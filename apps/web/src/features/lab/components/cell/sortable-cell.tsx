"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

// ─── Sortable Cell ───────────────────────────────────────

interface SortableCellProps {
  cellId: string;
  children: React.ReactNode;
}

/**
 * SortableCell — DnD wrapper for notebook cells
 *
 * Uses @dnd-kit/sortable for drag-and-drop reordering.
 * Provides a drag handle (grip icon) and applies transform
 * during drag operations.
 */
export function SortableCell({ cellId, children }: SortableCellProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cellId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="sortable-cell"
      className={cn(
        "relative",
        isDragging && "z-50 opacity-90 shadow-lg",
      )}
    >
      {/* Drag handle — visible on hover, left side */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full",
          "flex items-center justify-center",
          "w-5 h-8 cursor-grab active:cursor-grabbing",
          "opacity-0 group-hover/cell:opacity-40 hover:!opacity-80",
          "transition-opacity duration-150",
          "text-mine-muted",
        )}
        title="Drag to reorder"
      >
        <GripVertical className="size-3.5" />
      </div>

      {children}
    </div>
  );
}
