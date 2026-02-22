"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Terminal } from "lucide-react";
import type { OutputMessage } from "@/features/lab/types";
import { OutputDispatcher } from "../output/output-dispatcher";
import { ConsoleOutput } from "../output/console-output";

// ─── Output Area ─────────────────────────────────────────

interface OutputAreaProps {
  /** Main cell output (display result) */
  output: OutputMessage | null;
  /** Console outputs (stdout/stderr during execution) */
  consoleOutputs: OutputMessage[];
  cellId: string;
  /** Whether cell inputs are stale */
  stale?: boolean;
  /** Whether cell is currently executing */
  loading?: boolean;
  className?: string;
}

/**
 * OutputArea — Renders cell output with console toggle
 *
 * Adapted from Marimo's OutputArea pattern:
 * - Main output rendered via OutputDispatcher
 * - Console outputs in a collapsible section
 * - Stale outputs get semi-transparent overlay
 * - Loading state shows pulse indicator
 */
export function OutputArea({
  output,
  consoleOutputs,
  cellId,
  stale,
  loading,
  className,
}: OutputAreaProps) {
  const [consoleOpen, setConsoleOpen] = useState(false);

  const hasOutput = output !== null;
  const hasConsole = consoleOutputs.length > 0;

  if (!hasOutput && !hasConsole) return null;

  return (
    <div
      data-slot="output-area"
      className={cn(
        "relative border-t border-mine-border/30",
        className,
      )}
    >
      {/* Loading pulse indicator */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-mine-accent-teal/50 animate-pulse" />
      )}

      {/* Stale overlay */}
      {stale && !loading && (
        <div className="absolute inset-0 bg-white/50 z-10 pointer-events-none" />
      )}

      {/* Main output */}
      {hasOutput && (
        <div className="px-3 py-2">
          <OutputDispatcher
            message={output}
            cellId={cellId}
          />
        </div>
      )}

      {/* Console outputs (collapsible) */}
      {hasConsole && (
        <div className="border-t border-mine-border/20">
          {/* Console toggle header */}
          <button
            type="button"
            onClick={() => setConsoleOpen(!consoleOpen)}
            className={cn(
              "w-full flex items-center gap-1.5 px-3 py-1",
              "text-[10px] text-mine-muted hover:text-mine-text",
              "transition-colors",
            )}
          >
            {consoleOpen ? (
              <ChevronDown className="size-3" />
            ) : (
              <ChevronRight className="size-3" />
            )}
            <Terminal className="size-3" />
            <span>Console ({consoleOutputs.length})</span>
          </button>

          {/* Console content */}
          {consoleOpen && (
            <ConsoleOutput
              outputs={consoleOutputs}
              maxHeight={150}
            />
          )}
        </div>
      )}
    </div>
  );
}
