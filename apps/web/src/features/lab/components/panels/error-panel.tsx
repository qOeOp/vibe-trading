"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "@/features/lab/store/use-lab-cell-store";

// ─── Error Panel ─────────────────────────────────────────

/**
 * ErrorPanel — Lists cells with errors
 *
 * Shows errored cells with name, error message, and link to navigate.
 * Used in the developer panel bottom section.
 */
export function ErrorPanel() {
  const cellIds = useLabCellStore((s) => s.cellIds);
  const cellData = useLabCellStore((s) => s.cellData);
  const cellRuntime = useLabCellStore((s) => s.cellRuntime);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);

  // Filter to errored cells
  const erroredCells = cellIds.filter((id) => cellRuntime[id]?.errored);

  return (
    <div data-slot="error-panel" className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-1.5 border-b border-mine-border/50 shrink-0 flex items-center gap-1.5">
        <AlertCircle className="w-3 h-3 text-mine-accent-red" />
        <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
          错误
        </span>
        {erroredCells.length > 0 && (
          <span className="text-[10px] font-mono text-mine-accent-red">
            ({erroredCells.length})
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {erroredCells.length === 0 ? (
          <div className="px-3 py-4 text-center text-[11px] text-mine-muted">
            无错误
          </div>
        ) : (
          <div className="divide-y divide-mine-border/30">
            {erroredCells.map((id) => {
              const data = cellData[id];
              const runtime = cellRuntime[id];
              const idx = cellIds.indexOf(id);
              const name = data?.name || `Cell ${idx + 1}`;

              // Extract error message from output
              let errorMsg = "未知错误";
              if (
                runtime?.output?.mimetype === "application/vnd.marimo+error" &&
                Array.isArray(runtime.output.data)
              ) {
                const errors = runtime.output.data as Array<{ msg?: string }>;
                errorMsg = errors[0]?.msg || errorMsg;
              }

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveCellId(id)}
                  className="w-full text-left px-3 py-2 hover:bg-mine-accent-red/5 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-mine-text">
                      {name}
                    </span>
                    <span className="text-[9px] font-mono text-mine-muted">
                      #{idx + 1}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-[10px] font-mono text-mine-accent-red mt-0.5 line-clamp-2",
                    )}
                  >
                    {errorMsg}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
