import type { EditorView as EditorViewType } from "@codemirror/view";

// ─── Mine Light Theme ────────────────────────────────────
//
// Warm, paper-like light theme inspired by the Mine design system.
// Colors: teal accent (#26a69a), warm grays, paper white (#faf9f7).

export function createMineTheme(
  EditorView: typeof EditorViewType,
) {
  return EditorView.theme(
    {
      // ── Editor Shell ──
      "&": {
        backgroundColor: "#faf9f7",
        color: "#1a1a1a",
        height: "100%",
      },
      ".cm-content": {
        caretColor: "#26a69a",
        fontFamily: "'Geist Mono', 'SF Mono', 'Fira Code', monospace",
      },

      // ── Cursor ──
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "#26a69a",
        borderLeftWidth: "2px",
      },

      // ── Selection ──
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        {
          backgroundColor: "rgba(38, 166, 154, 0.15)",
        },
      ".cm-selectionMatch": {
        backgroundColor: "rgba(38, 166, 154, 0.1)",
        borderRadius: "2px",
      },

      // ── Active Line ──
      ".cm-activeLine": {
        backgroundColor: "rgba(0, 0, 0, 0.03)",
      },

      // ── Bracket Matching ──
      ".cm-matchingBracket": {
        backgroundColor: "rgba(38, 166, 154, 0.15)",
        color: "#26a69a",
        fontWeight: "bold",
        outline: "1px solid rgba(38, 166, 154, 0.3)",
        borderRadius: "2px",
      },
      ".cm-nonmatchingBracket": {
        backgroundColor: "rgba(231, 76, 60, 0.15)",
        color: "#e74c3c",
      },

      // ── Gutter ── (transparent bg, no border — matches Marimo codemirror.css)
      ".cm-gutters": {
        backgroundColor: "transparent",
        color: "#8a8a8a",
        borderRight: "none",
        fontSize: "0.75rem",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "rgba(38, 166, 154, 0.06)",
        color: "#26a69a",
        borderLeft: "2px solid rgba(38, 166, 154, 0.4)",
      },
      ".cm-lineNumbers .cm-gutterElement": {
        padding: "0 4px 0 4px",
        minWidth: "28px",
      },

      // ── Fold ──
      ".cm-foldPlaceholder": {
        backgroundColor: "rgba(38, 166, 154, 0.06)",
        border: "1px solid rgba(38, 166, 154, 0.15)",
        color: "#26a69a",
        borderRadius: "4px",
        padding: "0 6px",
        margin: "0 4px",
        fontSize: "0.85em",
        cursor: "pointer",
        transition: "background-color 150ms ease",
      },
      ".cm-foldPlaceholder:hover": {
        backgroundColor: "rgba(38, 166, 154, 0.12)",
      },
      ".cm-foldGutter .cm-gutterElement": {
        padding: "0 1px",
        cursor: "pointer",
      },

      // ── Search ──
      ".cm-panels": {
        backgroundColor: "#f5f3ef",
        color: "#1a1a1a",
        borderBottom: "1px solid #e0ddd8",
      },
      ".cm-panels.cm-panels-top": {
        borderBottom: "1px solid #e0ddd8",
      },
      ".cm-searchMatch": {
        backgroundColor: "rgba(38, 166, 154, 0.2)",
        outline: "1px solid rgba(38, 166, 154, 0.3)",
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: "rgba(38, 166, 154, 0.35)",
      },

      // ── Autocomplete Tooltip ──
      ".cm-tooltip": {
        backgroundColor: "#ffffff",
        border: "1px solid #e0ddd8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      },
      ".cm-tooltip.cm-tooltip-autocomplete": {
        "& > ul > li": { padding: "2px 8px" },
        "& > ul > li[aria-selected]": {
          backgroundColor: "rgba(38, 166, 154, 0.12)",
          color: "#1a1a1a",
        },
      },
      ".cm-completionLabel": { color: "#1a1a1a" },
      ".cm-completionDetail": {
        color: "#8a8a8a",
        fontStyle: "italic",
      },

      // ── Lint ──
      ".cm-lintRange-error": {
        backgroundImage: "none",
        textDecoration: "wavy underline #e74c3c",
        textDecorationSkipInk: "none",
        textUnderlineOffset: "3px",
      },
      ".cm-lintRange-warning": {
        backgroundImage: "none",
        textDecoration: "wavy underline #f5a623",
        textDecorationSkipInk: "none",
        textUnderlineOffset: "3px",
      },
      ".cm-tooltip-lint": {
        backgroundColor: "#fff",
        border: "1px solid #e0ddd8",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      },
      ".cm-gutter-lint": {
        width: "10px",
      },
      ".cm-lint-marker": {
        width: "5px",
        height: "5px",
      },

      // ── Scrollbar ──
      ".cm-scroller": {
        scrollbarWidth: "thin",
        scrollbarColor: "#d5dbd0 transparent",
      },
    },
    { dark: false },
  );
}
