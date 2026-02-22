"use client";

import { cn } from "@/lib/utils";
import type { OutputMessage, KnownMimeType, MarimoError } from "@/features/lab/types";
import { TextOutput } from "./text-output";
import { HtmlOutput } from "./html-output";
import { JsonOutput } from "./json-output";
import { ImageOutput } from "./image-output";
import { ErrorOutput } from "./error-output";

// ─── Output Dispatcher ───────────────────────────────────

interface OutputDispatcherProps {
  message: OutputMessage;
  cellId: string;
  className?: string;
}

/**
 * OutputDispatcher — MIME-type based output routing
 *
 * Adapted from Marimo's Output.tsx switch statement.
 * Routes each OutputMessage to the correct renderer based on mimetype.
 */
export function OutputDispatcher({
  message,
  cellId,
  className,
}: OutputDispatcherProps) {
  const { mimetype, data, channel } = message;

  return (
    <div
      data-slot="output-dispatcher"
      data-mimetype={mimetype}
      data-cell-id={cellId}
      className={cn("output-area", className)}
    >
      {renderOutput(mimetype, data, channel)}
    </div>
  );
}

// ─── MIME Router ─────────────────────────────────────────

function renderOutput(
  mimetype: KnownMimeType,
  data: string | MarimoError[] | Record<string, unknown>,
  channel: string,
): React.ReactNode {
  switch (mimetype) {
    case "text/plain":
      return (
        <TextOutput
          text={typeof data === "string" ? data : JSON.stringify(data, null, 2)}
          channel={channel as "stdout" | "stderr" | "output"}
        />
      );

    case "text/html":
      return (
        <HtmlOutput
          html={typeof data === "string" ? data : String(data)}
        />
      );

    case "text/markdown":
      // Markdown → render as HTML (simple conversion via marked-style)
      // For now, wrap in a prose container — full markdown support can be added later
      return (
        <HtmlOutput
          html={typeof data === "string" ? markdownToSimpleHtml(data) : String(data)}
          className="prose prose-sm max-w-none"
        />
      );

    case "application/json":
      return <JsonOutput data={typeof data === "string" ? data : data} />;

    case "image/png":
    case "image/jpeg":
    case "image/svg+xml":
      return (
        <ImageOutput
          data={typeof data === "string" ? data : String(data)}
          mimetype={mimetype}
        />
      );

    case "application/vnd.marimo+error":
      return (
        <ErrorOutput
          errors={Array.isArray(data) ? (data as MarimoError[]) : []}
        />
      );

    default: {
      // Fallback: render as text
      const fallbackText =
        typeof data === "string" ? data : JSON.stringify(data, null, 2);
      return <TextOutput text={fallbackText} />;
    }
  }
}

// ─── Simple Markdown → HTML ──────────────────────────────
// Minimal conversion for common patterns. Full markdown support
// would use react-markdown, but this avoids the dependency for now.

function markdownToSimpleHtml(md: string): string {
  let html = md;

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Code blocks
  html = html.replace(
    /```[\w]*\n([\s\S]*?)```/g,
    "<pre><code>$1</code></pre>",
  );

  // Line breaks (double newline → paragraph)
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  return html;
}
