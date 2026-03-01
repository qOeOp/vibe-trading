'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLabCellStore } from '@/features/lab/store/use-lab-cell-store';
import { PanelEmpty } from '@/components/shared/panel';

// ─── Logs Panel ──────────────────────────────────────────

type LogEntry = {
  cellId: string;
  cellName: string;
  channel: string;
  data: string;
  timestamp: number;
};

function useLogData() {
  const cellIds = useLabCellStore((s) => s.cellIds);
  const cellRuntime = useLabCellStore((s) => s.cellRuntime);
  const cellData = useLabCellStore((s) => s.cellData);

  const allLogs: LogEntry[] = [];
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
        data:
          typeof output.data === 'string'
            ? output.data
            : JSON.stringify(output.data),
        timestamp: output.timestamp,
      });
    }
  }

  allLogs.sort((a, b) => a.timestamp - b.timestamp);
  return allLogs;
}

function useAutoScroll(dep: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [dep]);
  return scrollRef;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// ─── Log Row ────────────────────────────────────────────

function LogRow({ log }: { log: LogEntry }) {
  return (
    <div
      className={cn(
        'flex gap-2 py-0.5 leading-tight',
        log.channel === 'stderr' && 'text-mine-accent-red',
        log.channel === 'stdout' && 'text-mine-text',
      )}
    >
      <span className="panel-value-sm shrink-0 w-12 text-right">
        {formatTime(log.timestamp)}
      </span>
      <span className="panel-hint shrink-0 w-14 truncate text-[9px] text-mine-accent-teal">
        {log.cellName}
      </span>
      <span className="whitespace-pre-wrap break-all panel-value">
        {log.data}
      </span>
    </div>
  );
}

// ─── Logs Panel Content ─────────────────────────────────

function LogsPanel() {
  const allLogs = useLogData();
  const scrollRef = useAutoScroll(allLogs.length);

  if (allLogs.length === 0) {
    return <PanelEmpty title="No log output" />;
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed"
    >
      <div className="px-2 py-1">
        {allLogs.map((log, i) => (
          <LogRow key={`${log.cellId}-${log.timestamp}-${i}`} log={log} />
        ))}
      </div>
    </div>
  );
}

export { LogsPanel };
