"use client";

import { cn } from "@/lib/utils";
import type { MarimoError } from "@/features/lab/types";

// ─── Error Output ────────────────────────────────────────

interface ErrorOutputProps {
  errors: MarimoError[];
  cellId?: string;
  className?: string;
}

/**
 * ErrorOutput — renders structured error messages with traceback
 *
 * Adapted from Marimo's MarimoErrorOutput
 * Displays Python errors with traceback, styled for readability
 */
export function ErrorOutput({ errors, cellId, className }: ErrorOutputProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      data-slot="error-output"
      className={cn("output-error space-y-2", className)}
    >
      {errors.map((error, i) => (
        <ErrorBlock key={i} error={error} />
      ))}
    </div>
  );
}

// ─── Error Block ─────────────────────────────────────────

function ErrorBlock({ error }: { error: MarimoError }) {
  return (
    <div className="rounded-lg border border-market-up-medium/20 bg-market-up-medium/5 overflow-hidden">
      {/* Error header */}
      <div className="px-3 py-2 bg-market-up-medium/10 border-b border-market-up-medium/20">
        <span className="text-xs font-semibold text-market-up-medium font-mono">
          {error.type}
        </span>
        <span className="text-xs text-mine-text ml-2">{error.msg}</span>
      </div>

      {/* Traceback */}
      {error.traceback && error.traceback.length > 0 && (
        <pre className="px-3 py-2 text-[11px] font-mono leading-relaxed text-mine-text overflow-x-auto">
          {error.traceback.map((line, i) => (
            <TracebackLine key={i} line={line} />
          ))}
        </pre>
      )}
    </div>
  );
}

// ─── Traceback Line ──────────────────────────────────────

function TracebackLine({ line }: { line: string }) {
  // Highlight file references: "  File "xxx", line N"
  const fileMatch = line.match(/^(\s*File\s+")([^"]+)(",\s+line\s+)(\d+)/);
  if (fileMatch) {
    return (
      <div>
        <span className="text-mine-muted">{fileMatch[1]}</span>
        <span className="text-mine-accent-teal">{fileMatch[2]}</span>
        <span className="text-mine-muted">{fileMatch[3]}</span>
        <span className="text-mine-accent-yellow">{fileMatch[4]}</span>
        <span className="text-mine-muted">{line.slice(fileMatch[0].length)}</span>
      </div>
    );
  }

  // Highlight the final error line (e.g., "ValueError: ...")
  if (line.match(/^\w+Error:/) || line.match(/^\w+Exception:/)) {
    return (
      <div className="text-market-up-medium font-semibold">{line}</div>
    );
  }

  // Highlight code pointer lines (e.g., "    ^^^^")
  if (line.trim().match(/^\^+$/)) {
    return (
      <div className="text-market-up-medium">{line}</div>
    );
  }

  return <div>{line}</div>;
}
