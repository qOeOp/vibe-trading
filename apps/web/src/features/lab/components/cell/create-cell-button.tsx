"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

// ─── Create Cell Button ──────────────────────────────────

interface CreateCellButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * CreateCellButton — Subtle + button between cells
 *
 * Adapted from Marimo CreateCellButton.tsx:
 * - Transparent background, no border
 * - strokeWidth 1.8, size 14
 * - opacity-60 on hover, opacity-90 on icon hover
 * - Shows horizontal line + center plus icon
 */
export function CreateCellButton({ onClick, className }: CreateCellButtonProps) {
  return (
    <div
      data-slot="create-cell-button"
      className={cn(
        "group/add relative h-3 flex items-center justify-center",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "absolute inset-x-0 -top-1 -bottom-1 z-10",
          "flex items-center justify-center",
          "opacity-0 group-hover/add:opacity-60 hover:!opacity-90",
          "transition-opacity duration-200",
          "cursor-pointer",
          "bg-transparent border-none",
        )}
        aria-label="添加新 cell"
      >
        {/* Horizontal line — subtle */}
        <div className="absolute inset-x-8 top-1/2 h-px bg-mine-border" />

        {/* Center + icon — Marimo style: small, transparent bg */}
        <div className="relative z-10 flex items-center justify-center text-mine-muted hover:text-mine-text transition-colors">
          <Plus strokeWidth={1.8} size={14} />
        </div>
      </button>
    </div>
  );
}
