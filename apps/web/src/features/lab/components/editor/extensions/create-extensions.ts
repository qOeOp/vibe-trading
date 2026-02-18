import type { Extension } from "@codemirror/state";
import type { Compartment } from "@codemirror/state";
import type { EditorView as EditorViewType } from "@codemirror/view";
import type { EditorStats } from "../../../types";
import { createMineTheme } from "./mine-theme";
import { mineHighlight } from "./mine-highlight";
import { vtCompletionSource } from "./vt-completions";
import { pythonLinter } from "./python-lint";

// ─── Extension Factory ───────────────────────────────────
//
// Assembles all CodeMirror extensions into a single array.
// This is the single source of truth for editor behavior.

/** Helper: creates a font-size theme extension */
export function fontSizeExtension(
  EditorView: typeof EditorViewType,
  size: number,
) {
  return EditorView.theme({
    ".cm-content": { fontSize: `${size}px` },
    ".cm-gutters": { fontSize: `${size - 1}px` },
  });
}

/**
 * CodeMirror module refs passed from the dynamic import site.
 *
 * We use `any` for keymap-related types because these are Facet/KeyBinding
 * types from @codemirror/view that don't need strict typing at this boundary —
 * they're already type-checked at the import site in code-editor.tsx.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeymapRef = { of: (bindings: any[]) => Extension };

export interface CMModules {
  EditorView: typeof EditorViewType;
  lineNumbers: () => Extension;
  highlightActiveLine: () => Extension;
  highlightSpecialChars: () => Extension;
  drawSelection: () => Extension;
  highlightSelectionMatches: () => Extension;
  keymap: KeymapRef;
  bracketMatching: () => Extension;
  closeBrackets: () => Extension;
  closeBracketsKeymap: readonly unknown[];
  indentOnInput: () => Extension;
  foldGutter: () => Extension;
  foldKeymap: readonly unknown[];
  history: () => Extension;
  historyKeymap: readonly unknown[];
  search: () => Extension;
  searchKeymap: readonly unknown[];
  defaultKeymap: readonly unknown[];
  indentWithTab: unknown;
  python: () => Extension;
  autocompletion: (config: { override: unknown[] }) => Extension;
}

export interface ExtensionConfig {
  fontSizeComp: InstanceType<typeof Compartment>;
  lineWrapComp: InstanceType<typeof Compartment>;
  initialFontSize: number;
  initialLineWrap: boolean;
  getWorker: () => Worker | null;
  onDocChanged: (value: string) => void;
  onCursorChanged: (stats: EditorStats) => void;
  onLintCount: (count: number) => void;
  onTriggerValidation: () => void;
}

/**
 * Full extension builder — called from code-editor.tsx after
 * all CodeMirror modules have been dynamically imported.
 *
 * This function receives all the CM module references to avoid
 * a direct static import of heavy packages in this file.
 */
export function buildExtensions(
  modules: CMModules,
  config: ExtensionConfig,
): Extension[] {
  const { EditorView } = modules;

  return [
    // ── Visual ──
    modules.lineNumbers(),
    modules.highlightActiveLine(),
    modules.highlightSpecialChars(),
    modules.drawSelection(),
    modules.highlightSelectionMatches(),
    modules.bracketMatching(),
    modules.closeBrackets(),
    modules.indentOnInput(),
    modules.foldGutter(),

    // ── History + Search ──
    modules.history(),
    modules.search(),

    // ── Keybindings ──
    modules.keymap.of([
      // Cmd+Enter → trigger validation
      {
        key: "Mod-Enter",
        run: () => {
          config.onTriggerValidation();
          return true;
        },
      },
      ...modules.closeBracketsKeymap,
      ...modules.foldKeymap,
      ...modules.defaultKeymap,
      ...modules.historyKeymap,
      ...modules.searchKeymap,
      modules.indentWithTab,
    ]),

    // ── Language ──
    modules.python(),

    // ── Theme + Highlighting ──
    createMineTheme(EditorView),
    mineHighlight,

    // ── Autocomplete ──
    modules.autocompletion({
      override: [vtCompletionSource],
    }),

    // ── Python Linting (via Pyodide Worker) ──
    pythonLinter(config.getWorker, config.onLintCount),

    // ── Dynamic Settings (Compartments) ──
    config.fontSizeComp.of(
      fontSizeExtension(EditorView, config.initialFontSize),
    ),
    config.lineWrapComp.of(
      config.initialLineWrap ? EditorView.lineWrapping : [],
    ),

    // ── Update Listener (doc changes + cursor stats) ──
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        config.onDocChanged(update.state.doc.toString());
      }

      const pos = update.state.selection.main.head;
      const line = update.state.doc.lineAt(pos);
      config.onCursorChanged({
        line: line.number,
        col: pos - line.from + 1,
        chars: update.state.doc.length,
        lines: update.state.doc.lines,
        fileName: "", // Will be filled by the caller
      });
    }),
  ];
}
