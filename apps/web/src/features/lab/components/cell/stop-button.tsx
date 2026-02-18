"use client";

import { cn } from "@/lib/utils";
import { Square } from "lucide-react";

// ─── Stop Button ─────────────────────────────────────────

interface StopButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * StopButton — Interrupt cell execution
 *
 * Only visible when cell is running.
 */
export function StopButton({ onClick, className }: StopButtonProps) {
  return (
    <button
      type="button"
      data-slot="stop-button"
      onClick={onClick}
      title="Stop execution"
      className={cn(
        "rounded-full border border-mine-accent-red/30 p-[5px]",
        "shadow-sm [&>svg]:size-3",
        "transition-colors active:shadow-none",
        "bg-white text-mine-accent-red",
        "hover:bg-mine-accent-red/10",
        className,
      )}
    >
      <Square />
    </button>
  );
}
