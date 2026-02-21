'use client';

import { useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { useLabCellStore } from '../store/use-lab-cell-store';
import { NotebookCell } from './cell/notebook-cell';
import { CreateCellButton } from './cell/create-cell-button';
import { SortableCell } from './cell/sortable-cell';

// ─── Cells Workspace ──────────────────────────────────

/**
 * CellsWorkspace — Scrollable cell list with DnD reordering
 *
 * Uses @dnd-kit/sortable for drag-and-drop cell reordering.
 * Reads from Marimo cellIds array for ordering.
 */
export function CellsWorkspace() {
  const cellIds = useLabCellStore((s) => s.cellIds);
  const addCell = useLabCellStore((s) => s.addCell);
  const reorderCells = useLabCellStore((s) => s.reorderCells);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);

  // DnD sensors — require 8px movement to start drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const fromIndex = cellIds.indexOf(active.id as string);
      const toIndex = cellIds.indexOf(over.id as string);
      if (fromIndex >= 0 && toIndex >= 0) {
        reorderCells(fromIndex, toIndex);
      }
    },
    [cellIds, reorderCells],
  );

  // Cell execution is handled by Marimo kernel (WebSocket).
  // These handlers manage focus/navigation after triggering execution.
  const handleExecute = useCallback(
    (cellId: string) => {
      // TODO: wire to Marimo kernel run request
      // Move focus to next cell (Shift+Enter behavior)
      const idx = cellIds.indexOf(cellId);
      if (idx >= 0 && idx < cellIds.length - 1) {
        setActiveCellId(cellIds[idx + 1]);
      } else if (idx === cellIds.length - 1) {
        // Last cell: add a new cell
        addCell(cellId);
      }
    },
    [cellIds, setActiveCellId, addCell],
  );

  const handleExecuteAndStay = useCallback((_cellId: string) => {
    // TODO: wire to Marimo kernel run request
  }, []);

  return (
    <div
      data-slot="cells-workspace"
      className="flex-1 overflow-y-auto px-6 py-6 space-y-3"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cellIds} strategy={verticalListSortingStrategy}>
          {cellIds.map((cellId, index) => (
            <div key={cellId}>
              {/* Add cell button between cells (not before first) */}
              {index > 0 && (
                <CreateCellButton onClick={() => addCell(cellIds[index - 1])} />
              )}

              <SortableCell cellId={cellId}>
                <NotebookCell
                  cellId={cellId}
                  index={index}
                  totalCells={cellIds.length}
                  onExecute={handleExecute}
                  onExecuteAndStay={handleExecuteAndStay}
                />
              </SortableCell>
            </div>
          ))}
        </SortableContext>
      </DndContext>

      {/* Add cell button after last cell */}
      <CreateCellButton
        onClick={() =>
          addCell(cellIds.length > 0 ? cellIds[cellIds.length - 1] : undefined)
        }
      />
    </div>
  );
}

// ─── Workspace Container ─────────────────────────────────

/**
 * LabWorkspace — The main cells area container
 *
 * This is now just the cells workspace.
 * The outer layout (sidebar, context panel, developer panel)
 * is handled by LabChrome.
 */
export function LabWorkspace() {
  return (
    <div
      data-slot="lab-workspace"
      className={cn(
        'h-full flex flex-col',
        'bg-mine-bg/30 rounded-xl overflow-hidden',
      )}
    >
      <CellsWorkspace />
    </div>
  );
}
