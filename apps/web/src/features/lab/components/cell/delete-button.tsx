"use client";

import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

// ─── Delete Button ───────────────────────────────────────

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * DeleteButton — Remove a cell
 *
 * Red danger styling on hover. Disabled when only one cell remains.
 */
export function DeleteButton({
  onClick,
  disabled,
  className,
}: DeleteButtonProps) {
  return (
    <button
      type="button"
      data-slot="delete-button"
      onClick={onClick}
      disabled={disabled}
      title="Delete cell"
      className={cn(
        "rounded-full border border-mine-border/60 p-[5px]",
        "shadow-sm [&>svg]:size-3",
        "transition-colors active:shadow-none",
        "bg-white",
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-mine-accent-red/10 hover:border-mine-accent-red/30 hover:text-mine-accent-red",
        !disabled && "text-mine-muted",
        className,
      )}
    >
      <Trash2 />
    </button>
  );
}
