"use client";

import { useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { OutputMessage } from "../../types";

// ─── ANSI Support ────────────────────────────────────────

let AnsiUpClass: typeof import("ansi_up").AnsiUp | null = null;

function getAnsiUp() {
  if (!AnsiUpClass) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("ansi_up");
    AnsiUpClass = mod.AnsiUp || mod.default || mod;
  }
  return new AnsiUpClass!();
}

// ─── Console Output ──────────────────────────────────────

interface ConsoleOutputProps {
  outputs: OutputMessage[];
  maxHeight?: number;
  className?: string;
}

/**
 * ConsoleOutput — renders a stream of stdout/stderr messages
 *
 * Adapted from Marimo's ConsoleOutput
 * Auto-scrolls to bottom, ANSI color support, channel-based coloring
 */
export function ConsoleOutput({
  outputs,
  maxHeight = 200,
  className,
}: ConsoleOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [outputs.length]);

  if (outputs.length === 0) return null;

  return (
    <div
      ref={containerRef}
      data-slot="console-output"
      className={cn(
        "output-console font-mono text-[12px] leading-relaxed",
        "overflow-y-auto overflow-x-hidden",
        "bg-mine-bg/30 rounded-md",
        className,
      )}
      style={{ maxHeight }}
    >
      {outputs.map((output, i) => (
        <ConsoleLine key={i} output={output} />
      ))}
    </div>
  );
}

// ─── Console Line ────────────────────────────────────────

function ConsoleLine({ output }: { output: OutputMessage }) {
  const html = useMemo(() => {
    const text = typeof output.data === "string" ? output.data : JSON.stringify(output.data);
    try {
      const ansi = getAnsiUp();
      ansi.use_classes = true;
      return ansi.ansi_to_html(text);
    } catch {
      return text;
    }
  }, [output.data]);

  return (
    <div
      className={cn(
        "px-3 py-0.5 whitespace-pre-wrap break-words border-l-2",
        output.channel === "stderr"
          ? "border-l-market-up-medium/40 text-market-up-medium"
          : "border-l-transparent text-mine-text",
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
