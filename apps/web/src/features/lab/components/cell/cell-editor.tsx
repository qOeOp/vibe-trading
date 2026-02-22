"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * CellEditor — CodeMirror 6 editor per cell
 *
 * Dynamically imports CodeMirror modules to avoid blocking initial render.
 * Reuses the existing extension infrastructure from the editor/ directory.
 *
 * Keybindings:
 * - Shift+Enter: execute cell, focus next
 * - Cmd+Enter: execute cell, stay focused
 */

interface CellEditorProps {
  cellId: string;
  code: string;
  isActive: boolean;
  onCodeChange: (code: string) => void;
  onExecute: () => void;
  onExecuteAndStay: () => void;
  onFocus: () => void;
  className?: string;
}

export function CellEditor({
  code,
  isActive,
  onCodeChange,
  onExecute,
  onExecuteAndStay,
  onFocus,
  className,
}: CellEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<unknown>(null);
  const onCodeChangeRef = useRef(onCodeChange);
  const onExecuteRef = useRef(onExecute);
  const onExecuteAndStayRef = useRef(onExecuteAndStay);

  // Keep callback refs fresh
  onCodeChangeRef.current = onCodeChange;
  onExecuteRef.current = onExecute;
  onExecuteAndStayRef.current = onExecuteAndStay;

  // Initialize CodeMirror
  useEffect(() => {
    if (!containerRef.current) return;

    let view: { destroy: () => void; state: { doc: { toString: () => string } } } | null = null;

    async function initEditor() {
      const [
        { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection },
        { EditorState, Compartment },
        { python },
        { defaultKeymap, history, historyKeymap, indentWithTab },
        { bracketMatching, foldGutter, indentOnInput },
        { closeBrackets, closeBracketsKeymap },
        { highlightSelectionMatches },
        { autocompletion },
      ] = await Promise.all([
        import("@codemirror/view"),
        import("@codemirror/state"),
        import("@codemirror/lang-python"),
        import("@codemirror/commands"),
        import("@codemirror/language"),
        import("@codemirror/autocomplete"),
        import("@codemirror/search"),
        import("@codemirror/autocomplete"),
      ]);

      // Import our custom extensions
      const { createMineTheme } = await import(
        "@/features/lab/components/editor/extensions/mine-theme"
      );
      const { mineHighlight } = await import(
        "@/features/lab/components/editor/extensions/mine-highlight"
      );
      const { vtCompletionSource } = await import(
        "@/features/lab/components/editor/extensions/vt-completions"
      );

      if (!containerRef.current) return;

      const fontSizeComp = new Compartment();
      const lineWrapComp = new Compartment();

      const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        drawSelection(),
        highlightSelectionMatches(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        foldGutter(),
        history(),

        keymap.of([
          // Shift+Enter: execute and move to next cell
          {
            key: "Shift-Enter",
            run: () => {
              onExecuteRef.current();
              return true;
            },
          },
          // Cmd+Enter: execute and stay
          {
            key: "Mod-Enter",
            run: () => {
              onExecuteAndStayRef.current();
              return true;
            },
          },
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),

        python(),
        createMineTheme(EditorView),
        mineHighlight,

        autocompletion({
          override: [vtCompletionSource],
        }),

        fontSizeComp.of(
          EditorView.theme({
            ".cm-content": { fontSize: "13px" },
            ".cm-gutters": { fontSize: "12px" },
          }),
        ),
        lineWrapComp.of(EditorView.lineWrapping),

        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onCodeChangeRef.current(update.state.doc.toString());
          }
        }),
      ];

      view = new EditorView({
        state: EditorState.create({
          doc: code,
          extensions,
        }),
        parent: containerRef.current,
      });

      editorViewRef.current = view;
    }

    initEditor();

    return () => {
      if (view) {
        view.destroy();
        view = null;
        editorViewRef.current = null;
      }
    };
    // Only run once on mount — code updates handled via external sync if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFocus = useCallback(() => {
    onFocus();
  }, [onFocus]);

  return (
    <div
      data-slot="cell-editor"
      className={cn(
        // Tray class — enables 100px hover pseudo-element wings (see globals.css)
        "cell-tray",
        "min-h-[40px]",
        "[&_.cm-editor]:outline-none",
        "[&_.cm-editor_.cm-scroller]:min-h-[40px]",
        "[&_.cm-editor_.cm-content]:py-2",
        // Marimo: editor bg is always white, gutter is transparent
        "[&_.cm-editor]:bg-white",
        "[&_.cm-editor_.cm-gutters]:bg-transparent [&_.cm-editor_.cm-gutters]:border-none",
        className,
      )}
      ref={containerRef}
      onFocus={handleFocus}
    />
  );
}
