"use client";

import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";

// ─── Variable Panel ──────────────────────────────────────

/**
 * VariablePanel — Shows all variables defined across cells
 *
 * Reads from cellData to extract `defines` from legacy cells.
 * Shows variable name, defining cell, and type hint.
 */
export function VariablePanel() {
  const cells = useLabCellStore((s) => s.cells);
  const cellData = useLabCellStore((s) => s.cellData);
  const cellIds = useLabCellStore((s) => s.cellIds);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);

  // Collect variables from legacy cells (which have defines/uses)
  const variables: {
    name: string;
    cellId: string;
    cellName: string;
    cellIndex: number;
  }[] = [];

  for (const cell of cells) {
    for (const varName of cell.defines) {
      const idx = cellIds.indexOf(cell.id);
      const data = cellData[cell.id];
      variables.push({
        name: varName,
        cellId: cell.id,
        cellName: data?.name || cell.name || `Cell ${idx + 1}`,
        cellIndex: idx,
      });
    }
  }

  return (
    <div data-slot="variable-panel" className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-mine-border/50 shrink-0">
        <h3 className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          变量
        </h3>
        <p className="text-[10px] text-mine-muted mt-0.5">
          {variables.length} 个变量定义
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {variables.length === 0 ? (
          <div className="px-3 py-6 text-center text-[11px] text-mine-muted">
            暂无变量定义
            <br />
            <span className="text-[10px]">
              在 cell 中定义变量后将自动显示
            </span>
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-mine-border/30">
                <th className="text-left px-3 py-1.5 text-[10px] font-medium text-mine-muted uppercase tracking-wider">
                  变量名
                </th>
                <th className="text-left px-3 py-1.5 text-[10px] font-medium text-mine-muted uppercase tracking-wider">
                  定义 Cell
                </th>
              </tr>
            </thead>
            <tbody>
              {variables.map((v) => (
                <tr
                  key={`${v.cellId}-${v.name}`}
                  className="border-b border-mine-border/20 hover:bg-mine-bg/50 transition-colors"
                >
                  <td className="px-3 py-1.5">
                    <span className="font-mono text-mine-text">{v.name}</span>
                  </td>
                  <td className="px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveCellId(v.cellId)}
                      className={cn(
                        "text-mine-accent-teal hover:underline",
                        "font-mono",
                      )}
                    >
                      {v.cellName}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
