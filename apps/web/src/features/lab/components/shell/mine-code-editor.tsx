'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// ─── Mine Code Editor ────────────────────────────────────
//
// CodeMirror 6 wrapper for the Mine shell.
// Two modes:
//   readOnly=true  → static "CSS artwork" (no keybindings, no cursor)
//   readOnly=false → live editor (full keybindings, autocomplete, change listener)

type MineCodeEditorProps = {
  /** Initial code content */
  code: string;
  /** When true, editor is non-interactive (disconnected state) */
  readOnly?: boolean;
  /** Code change callback (only fires when readOnly=false) */
  onChange?: (code: string) => void;
  /** Shift+Enter: execute cell and focus next */
  onExecute?: () => void;
  /** Mod+Enter: execute cell and stay */
  onExecuteAndStay?: () => void;
  /** Called when editor receives focus */
  onFocus?: () => void;
  /** Font size in px (default 14) */
  fontSize?: number;
  className?: string;
};

function MineCodeEditor({
  code,
  readOnly = false,
  onChange,
  onExecute,
  onExecuteAndStay,
  onFocus,
  fontSize = 14,
  className,
}: MineCodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<{ destroy: () => void } | null>(null);

  // Keep callback refs fresh without re-creating the editor
  const onChangeRef = useRef(onChange);
  const onExecuteRef = useRef(onExecute);
  const onExecuteAndStayRef = useRef(onExecuteAndStay);
  onChangeRef.current = onChange;
  onExecuteRef.current = onExecute;
  onExecuteAndStayRef.current = onExecuteAndStay;

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    async function init() {
      // Core modules (always needed)
      const [
        { EditorView, lineNumbers, highlightActiveLine, drawSelection, keymap },
        { EditorState },
        { python },
        { bracketMatching, foldGutter, indentOnInput },
        { highlightSelectionMatches },
      ] = await Promise.all([
        import('@codemirror/view'),
        import('@codemirror/state'),
        import('@codemirror/lang-python'),
        import('@codemirror/language'),
        import('@codemirror/search'),
      ]);

      // Mine extensions
      const { createMineTheme } = await import(
        '../editor/extensions/mine-theme'
      );
      const { mineHighlight } = await import(
        '../editor/extensions/mine-highlight'
      );

      if (destroyed || !containerRef.current) return;

      // Base extensions (both modes)
      const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        drawSelection(),
        highlightSelectionMatches(),
        bracketMatching(),
        indentOnInput(),
        foldGutter(),
        python(),
        createMineTheme(EditorView),
        mineHighlight,
        EditorView.theme({
          '.cm-content': { fontSize: `${fontSize}px` },
          '.cm-gutters': { fontSize: `${fontSize - 1}px` },
        }),
        EditorState.readOnly.of(readOnly),
      ];

      if (readOnly) {
        // Hide cursor in artwork mode
        extensions.push(
          EditorView.theme({ '.cm-cursor': { display: 'none' } }),
        );
      } else {
        // ── Live mode extras ──
        const [
          { defaultKeymap, history, historyKeymap, indentWithTab },
          { closeBrackets, closeBracketsKeymap, autocompletion },
        ] = await Promise.all([
          import('@codemirror/commands'),
          import('@codemirror/autocomplete'),
        ]);

        const { vtCompletionSource } = await import(
          '../editor/extensions/vt-completions'
        );

        if (destroyed) return;

        extensions.push(
          history(),
          closeBrackets(),
          autocompletion({ override: [vtCompletionSource] }),

          keymap.of([
            {
              key: 'Shift-Enter',
              run: () => {
                onExecuteRef.current?.();
                return true;
              },
            },
            {
              key: 'Mod-Enter',
              run: () => {
                onExecuteAndStayRef.current?.();
                return true;
              },
            },
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            indentWithTab,
          ]),

          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current?.(update.state.doc.toString());
            }
          }),
        );
      }

      const view = new EditorView({
        state: EditorState.create({ doc: code, extensions }),
        parent: containerRef.current,
      });

      viewRef.current = view;
    }

    init();

    return () => {
      destroyed = true;
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      data-slot="mine-code-editor"
      className={cn(
        '[&_.cm-editor]:outline-none',
        '[&_.cm-editor_.cm-scroller]:min-h-[40px]',
        '[&_.cm-editor_.cm-content]:py-2',
        '[&_.cm-editor]:bg-white',
        '[&_.cm-editor_.cm-gutters]:bg-transparent [&_.cm-editor_.cm-gutters]:border-none',
        className,
      )}
      ref={containerRef}
      onFocus={onFocus}
    />
  );
}

export { MineCodeEditor };
