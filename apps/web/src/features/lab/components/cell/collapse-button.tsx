"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown } from "lucide-react";

// ─── Collapse Button ─────────────────────────────────────

interface CollapseButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * CollapseButton — Toggle code visibility
 *
 * Chevron rotates to indicate state:
 * - Right = collapsed (code hidden)
 * - Down = expanded (code visible)
 */
export function CollapseButton({
  isCollapsed,
  onClick,
  className,
}: CollapseButtonProps) {
  return (
    <button
      type="button"
      data-slot="collapse-button"
      onClick={onClick}
      title={isCollapsed ? "Show code" : "Hide code"}
      className={cn(
        "rounded-full border border-mine-border/60 p-[5px]",
        "shadow-sm [&>svg]:size-3",
        "transition-colors active:shadow-none",
        "bg-white text-mine-muted",
        "hover:bg-mine-bg hover:border-mine-border hover:text-mine-text",
        className,
      )}
    >
      {isCollapsed ? <ChevronRight /> : <ChevronDown />}
    </button>
  );
}
