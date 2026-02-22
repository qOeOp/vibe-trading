"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { OutputChannel } from "@/features/lab/types";

// ─── ANSI Color Support ──────────────────────────────────

let AnsiUpClass: typeof import("ansi_up").AnsiUp | null = null;

function getAnsiUp() {
  if (!AnsiUpClass) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("ansi_up");
    AnsiUpClass = mod.AnsiUp || mod.default || mod;
  }
  return new AnsiUpClass!();
}

// ─── Text Output ─────────────────────────────────────────

interface TextOutputProps {
  text: string;
  channel?: OutputChannel;
  wrapText?: boolean;
  className?: string;
}

/**
 * TextOutput — renders plain text with ANSI color support
 *
 * Adapted from Marimo's TextOutput.tsx
 * Supports stdout/stderr/output channels with appropriate styling
 */
export function TextOutput({
  text,
  channel = "output",
  wrapText = true,
  className,
}: TextOutputProps) {
  const html = useMemo(() => {
    if (!text) return "";
    try {
      const ansi = getAnsiUp();
      ansi.use_classes = true;
      return ansi.ansi_to_html(text);
    } catch {
      return text;
    }
  }, [text]);

  if (!text) return null;

  return (
    <pre
      data-slot="text-output"
      data-channel={channel}
      className={cn(
        "font-mono text-[13px] leading-relaxed p-3",
        wrapText ? "whitespace-pre-wrap break-words" : "whitespace-pre overflow-x-auto",
        channel === "stderr" && "text-market-up-medium",
        channel === "stdout" && "text-mine-text",
        channel === "output" && "text-mine-text",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
