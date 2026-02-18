"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

// ─── HTML Output ─────────────────────────────────────────

interface HtmlOutputProps {
  html: string;
  className?: string;
}

/**
 * HtmlOutput — renders sanitized HTML content
 *
 * Adapted from Marimo's HtmlOutput.tsx
 * Uses DOMPurify for XSS prevention while preserving rich output
 * (tables, styled divs, matplotlib SVGs, etc.)
 */
export function HtmlOutput({ html, className }: HtmlOutputProps) {
  const sanitized = useMemo(() => {
    if (!html) return "";
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ["style"],
      ADD_ATTR: ["target", "rel", "class", "style"],
      ALLOW_DATA_ATTR: true,
    });
  }, [html]);

  if (!html) return null;

  return (
    <div
      data-slot="html-output"
      className={cn(
        "output-html",
        "text-sm text-mine-text",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-xs",
        "[&_th]:bg-mine-bg/50 [&_th]:border [&_th]:border-mine-border/50 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:font-medium",
        "[&_td]:border [&_td]:border-mine-border/50 [&_td]:px-2 [&_td]:py-1",
        "[&_tr:hover]:bg-mine-bg/30",
        "[&_a]:text-mine-accent-teal [&_a]:underline",
        "[&_img]:max-w-full [&_img]:rounded-md",
        "[&_pre]:bg-mine-bg/50 [&_pre]:rounded-md [&_pre]:p-2 [&_pre]:text-xs [&_pre]:overflow-x-auto",
        "[&_code]:text-xs [&_code]:font-mono",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
