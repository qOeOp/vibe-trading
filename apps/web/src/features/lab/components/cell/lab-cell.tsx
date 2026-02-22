"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "@/features/lab/store/use-lab-cell-store";
import type { LabCell as LabCellType } from "@/features/lab/types";
import { CellToolbar } from "./cell-toolbar";
import { CellEditor } from "./cell-editor";
import { CellOutput } from "./cell-output";

interface LabCellProps {
  cell: LabCellType;
  index: number;
  totalCells: number;
  onExecute: (cellId: string) => void;
  onExecuteAndStay: (cellId: string) => void;
}

/**
 * LabCell — Single cell container
 *
 * Combines toolbar, editor, and output into a cohesive unit.
 * Visual style: white background, left accent bar when active,
 * hover shows toolbar. Marimo-inspired clean design.
 */
export function LabCell({
  cell,
  index,
  totalCells,
  onExecute,
  onExecuteAndStay,
}: LabCellProps) {
  const activeCellId = useLabCellStore((s) => s.activeCellId);
  const setCellCode = useLabCellStore((s) => s.setCellCode);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);
  const removeCell = useLabCellStore((s) => s.removeCell);
  const moveCellUp = useLabCellStore((s) => s.moveCellUp);
  const moveCellDown = useLabCellStore((s) => s.moveCellDown);

  const isActive = activeCellId === cell.id;

  const handleCodeChange = useCallback(
    (code: string) => {
      setCellCode(cell.id, code);
    },
    [cell.id, setCellCode],
  );

  const handleExecute = useCallback(() => {
    onExecute(cell.id);
  }, [cell.id, onExecute]);

  const handleExecuteAndStay = useCallback(() => {
    onExecuteAndStay(cell.id);
  }, [cell.id, onExecuteAndStay]);

  const handleFocus = useCallback(() => {
    setActiveCellId(cell.id);
  }, [cell.id, setActiveCellId]);

  const handleNameChange = useCallback(
    (name: string) => {
      // Update cell name in store
      useLabCellStore.setState((state) => ({
        cells: state.cells.map((c) =>
          c.id === cell.id ? { ...c, name } : c,
        ),
      }));
    },
    [cell.id],
  );

  return (
    <div
      data-slot="lab-cell"
      className={cn(
        // Marimo .marimo-cell base (Cell.css)
        "group/cell relative",
        "rounded-[10px] border border-mine-border bg-white",
        "transition-all duration-200",
        // Marimo :hover → border darkens, raise z-index
        "hover:border-[#c5c0b8] hover:z-30",
        // Marimo .interactive:focus-within → shadow glow
        isActive && "shadow-[0_4px_12px_rgba(38,166,154,0.15)]",
        // Marimo .needs-run → stale yellow outline
        cell.status === "stale" &&
          "border-mine-accent-yellow/25 outline outline-1 outline-mine-accent-yellow/25",
        // Marimo .has-error → red outline
        cell.status === "error" &&
          "border-mine-accent-red/20 outline outline-1 outline-mine-accent-red/20",
      )}
    >
      {/* Toolbar — absolute positioned outside cell, Marimo style */}
      <CellToolbar
        cellId={cell.id}
        cellName={cell.name}
        status={cell.status}
        isFirst={index === 0}
        isLast={index === totalCells - 1}
        onRun={handleExecute}
        onDelete={() => removeCell(cell.id)}
        onMoveUp={() => moveCellUp(cell.id)}
        onMoveDown={() => moveCellDown(cell.id)}
        onNameChange={handleNameChange}
      />

      {/* Editor */}
      <CellEditor
        cellId={cell.id}
        code={cell.code}
        isActive={isActive}
        onCodeChange={handleCodeChange}
        onExecute={handleExecute}
        onExecuteAndStay={handleExecuteAndStay}
        onFocus={handleFocus}
      />

      {/* Output */}
      <CellOutput outputs={cell.outputs} />
    </div>
  );
}
