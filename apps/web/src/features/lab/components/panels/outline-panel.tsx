"use client";

import { cn } from "@/lib/utils";
import { useLabCellStore } from "@/features/lab/store/use-lab-cell-store";

// ─── Outline Panel ───────────────────────────────────────

/**
 * OutlinePanel — Cell list with code summaries
 *
 * Shows all cells with name + first 40 chars of code.
 * Clicking navigates to that cell.
 */
export function OutlinePanel() {
  const cellIds = useLabCellStore((s) => s.cellIds);
  const cellData = useLabCellStore((s) => s.cellData);
  const cellRuntime = useLabCellStore((s) => s.cellRuntime);
  const activeCellId = useLabCellStore((s) => s.activeCellId);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);

  return (
    <div data-slot="outline-panel" className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-mine-border/50 shrink-0">
        <h3 className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          大纲
        </h3>
        <p className="text-[10px] text-mine-muted mt-0.5">
          {cellIds.length} 个 cells
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {cellIds.map((id, index) => {
          const data = cellData[id];
          const runtime = cellRuntime[id];
          const isActive = id === activeCellId;
          const name = data?.name || `Cell ${index + 1}`;
          const code = data?.code || "";
          const preview = code.split("\n")[0]?.slice(0, 50) || "";
          const hasError = runtime?.errored;
          const isStale = runtime?.staleInputs;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveCellId(id)}
              className={cn(
                "w-full text-left px-3 py-1.5 border-l-2 transition-colors",
                isActive
                  ? "border-mine-accent-teal bg-mine-accent-teal/5"
                  : "border-transparent hover:bg-mine-bg/50",
                hasError && "border-mine-accent-red",
                isStale && !hasError && "border-mine-accent-yellow",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-mine-muted w-4 shrink-0">
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium truncate",
                    isActive ? "text-mine-accent-teal" : "text-mine-text",
                  )}
                >
                  {name}
                </span>
              </div>
              {preview && (
                <p className="text-[10px] text-mine-muted font-mono mt-0.5 truncate pl-5">
                  {preview}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
