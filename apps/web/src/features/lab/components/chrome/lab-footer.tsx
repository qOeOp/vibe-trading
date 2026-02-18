"use client";

import { AlertCircle, AlertTriangle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";
import { useLabChromeStore } from "../../store/use-lab-chrome-store";

// ─── Lab Footer ──────────────────────────────────────────

/**
 * LabFooter — Bottom status bar
 *
 * Layout: [Error count | Warning count]  [spacer]  [Pyodide: Ready]  [Cell: 3/7]  [Exec: 12]
 * Height: h-7
 * Style: bg-white border-t border-mine-border
 */
export function LabFooter() {
  const cellIds = useLabCellStore((s) => s.cellIds);
  const cellRuntime = useLabCellStore((s) => s.cellRuntime);
  const activeCellId = useLabCellStore((s) => s.activeCellId);
  const pyodideStatus = useLabCellStore((s) => s.pyodideStatus);
  const executionCounter = useLabCellStore((s) => s.executionCounter);
  const openDeveloperPanel = useLabChromeStore((s) => s.openDeveloperPanel);

  // Counts
  const errorCount = cellIds.filter((id) => cellRuntime[id]?.errored).length;
  const runningCount = cellIds.filter(
    (id) => cellRuntime[id]?.status === "running",
  ).length;
  const staleCount = cellIds.filter(
    (id) => cellRuntime[id]?.staleInputs,
  ).length;

  // Active cell position
  const activeCellIndex = activeCellId
    ? cellIds.indexOf(activeCellId) + 1
    : 0;

  // Pyodide status indicator
  const pyodideReady = pyodideStatus === "ready";
  const pyodideLabel =
    pyodideStatus === "loading"
      ? "加载中"
      : pyodideStatus === "error"
        ? "加载失败"
        : pyodideStatus === "ready"
          ? "就绪"
          : "空闲";

  return (
    <div
      data-slot="lab-footer"
      className="flex items-center h-7 px-3 bg-white border-t border-mine-border text-[10px] text-mine-muted shrink-0 select-none"
    >
      {/* Left: error/warning counts */}
      <button
        type="button"
        onClick={() => openDeveloperPanel("errors")}
        className={cn(
          "flex items-center gap-2 hover:text-mine-text transition-colors",
          errorCount > 0 && "text-mine-accent-red",
        )}
      >
        <span className="flex items-center gap-0.5">
          <AlertCircle className="w-3 h-3" />
          {errorCount}
        </span>
        <span className="flex items-center gap-0.5">
          <AlertTriangle className="w-3 h-3" />
          {staleCount}
        </span>
      </button>

      {/* Running indicator */}
      {runningCount > 0 && (
        <span className="ml-3 flex items-center gap-1 text-mine-accent-teal">
          <span className="w-1.5 h-1.5 rounded-full bg-mine-accent-teal animate-pulse" />
          {runningCount} 执行中
        </span>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: status indicators */}
      <div className="flex items-center gap-3">
        {/* Pyodide status */}
        <span className="flex items-center gap-1">
          <Circle
            className={cn(
              "w-2 h-2",
              pyodideReady
                ? "fill-mine-accent-green text-mine-accent-green"
                : pyodideStatus === "error"
                  ? "fill-mine-accent-red text-mine-accent-red"
                  : "fill-mine-accent-yellow text-mine-accent-yellow animate-pulse",
            )}
          />
          Python: {pyodideLabel}
        </span>

        {/* Separator */}
        <span className="w-px h-3 bg-mine-border/50" />

        {/* Cell position */}
        <span className="font-mono tabular-nums">
          Cell: {activeCellIndex}/{cellIds.length}
        </span>

        {/* Separator */}
        <span className="w-px h-3 bg-mine-border/50" />

        {/* Execution counter */}
        <span className="font-mono tabular-nums">
          Exec: {executionCounter ?? 0}
        </span>
      </div>
    </div>
  );
}
