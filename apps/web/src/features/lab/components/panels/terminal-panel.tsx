"use client";

import { TerminalSquare } from "lucide-react";

// ─── Terminal Panel ──────────────────────────────────────

/**
 * TerminalPanel — xterm terminal (lazy loaded)
 *
 * Placeholder for now. Will load @xterm/xterm lazily
 * and connect to Pyodide stdin/stdout.
 */
export function TerminalPanel() {
  return (
    <div data-slot="terminal-panel" className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-1.5 border-b border-mine-border/50 shrink-0 flex items-center gap-1.5">
        <TerminalSquare className="w-3 h-3 text-mine-muted" />
        <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
          终端
        </span>
      </div>

      {/* Placeholder */}
      <div className="flex-1 flex items-center justify-center text-mine-muted">
        <div className="text-center">
          <TerminalSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-[11px]">Python 终端</p>
          <p className="text-[10px] mt-1 opacity-60">
            xterm 终端将在后续版本中启用
          </p>
        </div>
      </div>
    </div>
  );
}
