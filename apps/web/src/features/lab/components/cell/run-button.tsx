"use client";

import { cn } from "@/lib/utils";
import { Play, Loader2 } from "lucide-react";

// ─── Run Button ──────────────────────────────────────────

interface RunButtonProps {
  onClick: () => void;
  isRunning?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * RunButton — Executes a cell
 *
 * Shows play icon when idle, spinner when running.
 * Keyboard shortcut: Shift+Enter
 */
export function RunButton({
  onClick,
  isRunning,
  disabled,
  className,
}: RunButtonProps) {
  return (
    <button
      type="button"
      data-slot="run-button"
      onClick={onClick}
      disabled={disabled || isRunning}
      title="Run (Shift+Enter)"
      className={cn(
        "rounded-full border border-mine-border/60 p-[5px]",
        "shadow-sm [&>svg]:size-3",
        "transition-colors active:shadow-none",
        "bg-white",
        disabled || isRunning
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-mine-accent-teal/10 hover:border-mine-accent-teal/30 hover:text-mine-accent-teal",
        !disabled && !isRunning && "text-mine-muted hover:text-mine-accent-teal",
        className,
      )}
    >
      {isRunning ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Play />
      )}
    </button>
  );
}
