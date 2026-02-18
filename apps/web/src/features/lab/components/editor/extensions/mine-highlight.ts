import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// ─── Mine Syntax Highlighting ────────────────────────────
//
// Warm, readable color scheme:
//   Keywords  → bold dark (#2d2d2d)
//   Functions → teal (#26a69a)
//   Strings   → forest green (#3d7a42)
//   Comments  → italic gray (#8a8a8a)
//   Numbers   → accent red (#CF304A)

export const mineHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: "#2d2d2d", fontWeight: "bold" },
    { tag: tags.function(tags.variableName), color: "#26a69a" },
    {
      tag: [tags.string, tags.special(tags.string)],
      color: "#3d7a42",
    },
    {
      tag: tags.comment,
      color: "#8a8a8a",
      fontStyle: "italic",
    },
    { tag: tags.number, color: "#CF304A" },
    { tag: tags.operator, color: "#2d2d2d" },
    { tag: tags.variableName, color: "#1a1a1a" },
    { tag: tags.bool, color: "#CF304A" },
    { tag: tags.null, color: "#CF304A" },
    {
      tag: tags.className,
      color: "#26a69a",
      fontWeight: "bold",
    },
    { tag: tags.definition(tags.variableName), color: "#1a1a1a" },
    { tag: tags.propertyName, color: "#26a69a" },
    { tag: tags.punctuation, color: "#666666" },
  ]),
);
