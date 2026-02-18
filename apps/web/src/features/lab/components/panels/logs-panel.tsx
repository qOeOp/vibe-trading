"use client";

import { useRef, useEffect } from "react";
import { Terminal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";

// ─── Logs Panel ──────────────────────────────────────────

/**
 * LogsPanel — Global console log stream
 *
 * Aggregates consoleOutputs from all cells.
 * Shows stdout/stderr with color coding, auto-scrolls to bottom.
 */
export function LogsPanel() {
  const cellIds = useLabCellStore((s) => s.cellIds);
  const cellRuntime = useLabCellStore((s) => s.cellRuntime);
  const cellData = useLabCellStore((s) => s.cellData);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Collect all console outputs across cells, sorted by timestamp
  const allLogs: {
    cellId: string;
    cellName: string;
    channel: string;
    data: string;
    timestamp: number;
  }[] = [];

  for (const id of cellIds) {
    const runtime = cellRuntime[id];
    const data = cellData[id];
    if (!runtime?.consoleOutputs) continue;
    const name = data?.name || `Cell ${cellIds.indexOf(id) + 1}`;

    for (const output of runtime.consoleOutputs) {
      allLogs.push({
        cellId: id,
        cellName: name,
        channel: output.channel,
        data: typeof output.data === "string" ? output.data : JSON.stringify(output.data),
        timestamp: output.timestamp,
      });
    }
  }

  // Sort by timestamp
  allLogs.sort((a, b) => a.timestamp - b.timestamp);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allLogs.length]);

  return (
    <div data-slot="logs-panel" className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-1.5 border-b border-mine-border/50 shrink-0 flex items-center gap-1.5">
        <Terminal className="w-3 h-3 text-mine-muted" />
        <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
          日志
        </span>
        <span className="text-[10px] font-mono text-mine-muted">
          ({allLogs.length})
        </span>
        <div className="flex-1" />
        {allLogs.length > 0 && (
          <button
            type="button"
            title="清除日志"
            className="text-mine-muted hover:text-mine-text transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed"
      >
        {allLogs.length === 0 ? (
          <div className="px-3 py-4 text-center text-[11px] text-mine-muted font-sans">
            暂无日志输出
          </div>
        ) : (
          <div className="px-2 py-1">
            {allLogs.map((log, i) => (
              <div
                key={`${log.cellId}-${log.timestamp}-${i}`}
                className={cn(
                  "flex gap-2 py-0.5 leading-tight",
                  log.channel === "stderr" && "text-mine-accent-red",
                  log.channel === "stdout" && "text-mine-text",
                )}
              >
                <span className="text-[9px] text-mine-muted shrink-0 w-12 text-right tabular-nums">
                  {new Date(log.timestamp).toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <span className="text-[9px] text-mine-accent-teal shrink-0 w-14 truncate">
                  {log.cellName}
                </span>
                <span className="whitespace-pre-wrap break-all">{log.data}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
