"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";
import { CellToolbar } from "./cell-toolbar";
import { CellEditor } from "./cell-editor";
import { OutputArea } from "./output-area";

// ─── Notebook Cell ───────────────────────────────────────

interface NotebookCellProps {
  cellId: string;
  index: number;
  totalCells: number;
  onExecute: (cellId: string) => void;
  onExecuteAndStay: (cellId: string) => void;
}

/**
 * NotebookCell — Main cell container (Marimo-compatible)
 *
 * Incremental upgrade of the original LabCell:
 * - Reads from Marimo state system (cellData + cellRuntime)
 * - Uses OutputArea (output-dispatcher) instead of legacy CellOutput
 * - Supports code folding (config.hide_code)
 * - Has data-cell-id and Marimo CSS class names
 * - Stale/error/needs-run CSS state classes
 */
export function NotebookCell({
  cellId,
  index,
  totalCells,
  onExecute,
  onExecuteAndStay,
}: NotebookCellProps) {
  // ── Marimo state selectors ──
  const cellData = useLabCellStore((s) => s.cellData[cellId]);
  const cellRuntime = useLabCellStore((s) => s.cellRuntime[cellId]);
  const activeCellId = useLabCellStore((s) => s.activeCellId);

  // ── Actions ──
  const setCellCode = useLabCellStore((s) => s.setCellCode);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);
  const removeCell = useLabCellStore((s) => s.removeCell);
  const moveCellUp = useLabCellStore((s) => s.moveCellUp);
  const moveCellDown = useLabCellStore((s) => s.moveCellDown);
  const setCellName = useLabCellStore((s) => s.setCellName);
  const foldCell = useLabCellStore((s) => s.foldCell);
  const unfoldCell = useLabCellStore((s) => s.unfoldCell);

  const isActive = activeCellId === cellId;
  const isHidden = cellData?.config?.hide_code ?? false;
  const isRunning = cellRuntime?.status === "running" || cellRuntime?.status === "queued";
  const isStale = cellRuntime?.staleInputs ?? false;
  const isErrored = cellRuntime?.errored ?? false;
  const isEdited = cellData?.edited ?? false;

  // ── Callbacks ──
  const handleCodeChange = useCallback(
    (code: string) => setCellCode(cellId, code),
    [cellId, setCellCode],
  );

  const handleExecute = useCallback(
    () => onExecute(cellId),
    [cellId, onExecute],
  );

  const handleExecuteAndStay = useCallback(
    () => onExecuteAndStay(cellId),
    [cellId, onExecuteAndStay],
  );

  const handleFocus = useCallback(
    () => setActiveCellId(cellId),
    [cellId, setActiveCellId],
  );

  const handleNameChange = useCallback(
    (name: string) => setCellName(cellId, name),
    [cellId, setCellName],
  );

  const handleToggleCode = useCallback(() => {
    if (isHidden) {
      unfoldCell(cellId);
    } else {
      foldCell(cellId);
    }
  }, [cellId, isHidden, foldCell, unfoldCell]);

  // ── Derive status for legacy toolbar ──
  const legacyStatus = useMemo(() => {
    if (isErrored) return "error" as const;
    if (isStale) return "stale" as const;
    if (isRunning) return "running" as const;
    if (cellRuntime?.status === "idle" && cellData?.lastCodeRun) return "done" as const;
    return "idle" as const;
  }, [isErrored, isStale, isRunning, cellRuntime?.status, cellData?.lastCodeRun]);

  if (!cellData || !cellRuntime) return null;

  return (
    <div
      data-slot="notebook-cell"
      data-cell-id={cellId}
      className={cn(
        // Base Marimo .marimo-cell class
        "marimo-cell group/cell relative",
        "rounded-[10px] border border-mine-border bg-white",
        "transition-all duration-200",

        // Hover → darken border, raise z
        "hover:border-[#c5c0b8] hover:z-30",

        // Active focus → teal glow
        isActive && "shadow-[0_4px_12px_rgba(38,166,154,0.15)]",

        // .needs-run → stale yellow outline
        (isStale || isEdited) &&
          !isRunning &&
          !isErrored &&
          "border-mine-accent-yellow/25 outline outline-1 outline-mine-accent-yellow/25",

        // .has-error → red outline
        isErrored &&
          "border-mine-accent-red/20 outline outline-1 outline-mine-accent-red/20",

        // Disabled
        cellData.config.disabled && "opacity-50",
      )}
    >
      {/* Toolbar — absolute positioned outside cell */}
      <CellToolbar
        cellId={cellId}
        cellName={cellData.name}
        status={legacyStatus}
        isFirst={index === 0}
        isLast={index === totalCells - 1}
        isRunning={isRunning}
        isCollapsed={isHidden}
        onRun={handleExecute}
        onStop={() => useLabCellStore.getState().interruptCell(cellId)}
        onDelete={() => removeCell(cellId)}
        onMoveUp={() => moveCellUp(cellId)}
        onMoveDown={() => moveCellDown(cellId)}
        onNameChange={handleNameChange}
        onToggleCode={handleToggleCode}
      />

      {/* Editor — hidden when code is folded */}
      {!isHidden ? (
        <CellEditor
          cellId={cellId}
          code={cellData.code}
          isActive={isActive}
          onCodeChange={handleCodeChange}
          onExecute={handleExecute}
          onExecuteAndStay={handleExecuteAndStay}
          onFocus={handleFocus}
        />
      ) : (
        /* Collapsed code summary */
        <button
          type="button"
          onClick={handleToggleCode}
          className="w-full px-4 py-2 text-xs text-mine-muted font-mono truncate text-left hover:bg-mine-bg/30 transition-colors"
        >
          {cellData.code
            ? cellData.code.split("\n")[0].slice(0, 80) + (cellData.code.length > 80 ? "..." : "")
            : "# Empty cell"}
        </button>
      )}

      {/* Output Area */}
      <OutputArea
        output={cellRuntime.output}
        consoleOutputs={cellRuntime.consoleOutputs}
        cellId={cellId}
        stale={isStale}
        loading={isRunning}
      />
    </div>
  );
}
