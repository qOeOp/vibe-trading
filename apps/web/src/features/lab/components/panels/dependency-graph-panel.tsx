"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";

// ─── Dependency Graph Panel ──────────────────────────────

/**
 * DependencyGraphPanel — Shows cell dependency graph
 *
 * Text-based adjacency list view (D3 visualization deferred).
 * Uses legacy cells[].defines/uses to compute edges.
 */
export function DependencyGraphPanel() {
  const cells = useLabCellStore((s) => s.cells);
  const cellData = useLabCellStore((s) => s.cellData);
  const cellIds = useLabCellStore((s) => s.cellIds);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);

  // Build dependency map: variable → defining cell
  const varToCellId: Record<string, string> = {};
  for (const cell of cells) {
    for (const v of cell.defines) {
      varToCellId[v] = cell.id;
    }
  }

  // Build edges: cell → depends on cells (via `uses`)
  const edges: { from: string; to: string; via: string }[] = [];
  for (const cell of cells) {
    for (const v of cell.uses) {
      const defCellId = varToCellId[v];
      if (defCellId && defCellId !== cell.id) {
        edges.push({ from: defCellId, to: cell.id, via: v });
      }
    }
  }

  const getCellLabel = (id: string) => {
    const data = cellData[id];
    const idx = cellIds.indexOf(id);
    return data?.name || `Cell ${idx + 1}`;
  };

  return (
    <div data-slot="dependency-graph-panel" className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-mine-border/50 shrink-0">
        <h3 className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          依赖图
        </h3>
        <p className="text-[10px] text-mine-muted mt-0.5">
          {edges.length} 条依赖关系
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {edges.length === 0 ? (
          <div className="py-6 text-center text-[11px] text-mine-muted">
            暂无依赖关系
            <br />
            <span className="text-[10px]">
              cells 之间共享变量后将自动显示
            </span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {edges.map((edge, i) => (
              <div
                key={`${edge.from}-${edge.to}-${edge.via}-${i}`}
                className="flex items-center gap-1.5 text-[11px]"
              >
                <button
                  type="button"
                  onClick={() => setActiveCellId(edge.from)}
                  className="font-mono text-mine-text hover:text-mine-accent-teal transition-colors truncate max-w-[80px]"
                >
                  {getCellLabel(edge.from)}
                </button>
                <ArrowRight className="w-3 h-3 text-mine-muted shrink-0" />
                <span className="font-mono text-mine-accent-teal text-[10px] shrink-0">
                  {edge.via}
                </span>
                <ArrowRight className="w-3 h-3 text-mine-muted shrink-0" />
                <button
                  type="button"
                  onClick={() => setActiveCellId(edge.to)}
                  className={cn(
                    "font-mono text-mine-text hover:text-mine-accent-teal transition-colors truncate max-w-[80px]",
                  )}
                >
                  {getCellLabel(edge.to)}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
