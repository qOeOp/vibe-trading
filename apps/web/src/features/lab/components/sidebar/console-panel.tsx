"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";
import { X, Trash2 } from "lucide-react";

/**
 * ConsolePanel — Global stdout/stderr aggregated output
 *
 * Shows all console output from all cells in chronological order.
 * Each line is prefixed with the cell name/id for context.
 * Dark terminal-style background matching cell output areas.
 */
export function ConsolePanel() {
  const setSidebarPanel = useLabCellStore((s) => s.setSidebarPanel);
  const consoleOutput = useLabCellStore((s) => s.consoleOutput);
  const clearConsoleOutput = useLabCellStore((s) => s.clearConsoleOutput);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleOutput.length]);

  return (
    <div
      data-slot="console-panel"
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-mine-border/50">
        <span className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          Console
        </span>
        <div className="flex items-center gap-2">
          {consoleOutput.length > 0 && (
            <button
              type="button"
              onClick={clearConsoleOutput}
              className="text-mine-muted hover:text-mine-text transition-colors"
              title="清空输出"
              aria-label="清空输出"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSidebarPanel(null)}
            className="text-mine-muted hover:text-mine-text transition-colors"
            aria-label="关闭"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto",
          "bg-[#1e1e1e] font-mono text-xs",
          "p-3 space-y-0.5",
        )}
      >
        {consoleOutput.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            运行 cell 后，输出会出现在这里
          </p>
        ) : (
          consoleOutput.map((line, i) => (
            <div
              key={`${line.timestamp}-${i}`}
              className="flex items-start gap-2 leading-relaxed"
            >
              {/* Cell name prefix */}
              {(line.cellName || line.cellId) && (
                <span className="text-gray-500 shrink-0 select-none">
                  [{line.cellName || line.cellId?.slice(0, 6)}]
                </span>
              )}
              <span
                className={cn(
                  "whitespace-pre-wrap break-all",
                  line.stream === "stderr"
                    ? "text-red-400"
                    : "text-gray-300",
                )}
              >
                {line.text}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer stats */}
      <div className="px-4 py-1.5 border-t border-mine-border/50 text-[10px] text-mine-muted bg-white">
        {consoleOutput.length} 行输出
      </div>
    </div>
  );
}
