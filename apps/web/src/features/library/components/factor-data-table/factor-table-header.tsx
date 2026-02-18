'use client';

import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';

// ─── Draggable Column Header Wrapper ────────────────────
// Provides a drag handle node for the left slot of DataTableColumnHeader.

/** Renders a GripVertical drag handle with dnd-kit listeners */
export function DragHandle({ columnId }: { columnId: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `col-${columnId}`,
    data: { type: 'column-header', columnId },
  });

  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`w-3 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <GripVertical className="w-3 h-3 text-mine-muted/30 opacity-0 group-hover/th:opacity-100 transition-opacity" />
    </span>
  );
}
