'use client';

import { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLabCellStore } from '@/features/lab/store/use-lab-cell-store';
import {
  PanelBar,
  PanelBody,
  PanelEmpty,
  PanelActionButton,
  PanelText,
  usePanelV2,
} from '../panel-primitives';

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

// ─── Log Row (shared) ───────────────────────────────────

function LogRow({ log }: { log: LogEntry }) {
  return (
    <div
      className={cn(
        'flex gap-2 py-0.5 leading-tight',
        log.channel === 'stderr' && 'text-mine-accent-red',
        log.channel === 'stdout' && 'text-mine-text',
      )}
    >
      <PanelText
        variant="tiny"
        className="shrink-0 w-12 text-right tabular-nums font-mono"
      >
        {formatTime(log.timestamp)}
      </PanelText>
      <PanelText
        variant="tiny"
        className="shrink-0 w-14 truncate text-mine-accent-teal"
      >
        {log.cellName}
      </PanelText>
      <span className="whitespace-pre-wrap break-all text-[11px] font-mono">
        {log.data}
      </span>
    </div>
  );
}

// ─── V2 (primitives) ────────────────────────────────────

function LogsPanelV2() {
  const allLogs = useLogData();
  const scrollRef = useAutoScroll(allLogs.length);
  const [isV2, toggleV2] = usePanelV2('logs-panel');

  return (
    <div data-slot="logs-panel" className="h-full flex flex-col">
      <PanelBar
        title="Logs"
        icon={<Terminal />}
        badge={
          <PanelText variant="tiny" className="font-mono">
            ({allLogs.length})
          </PanelText>
        }
        right={
          allLogs.length > 0 ? (
            <PanelActionButton
              icon={<Trash2 />}
              label="Clear Logs"
              hoverColor="default"
            />
          ) : undefined
        }
        v2={{ active: isV2, onToggle: toggleV2 }}
      />
      <PanelBody
        ref={scrollRef}
        className="font-mono text-[11px] leading-relaxed"
      >
        {allLogs.length === 0 ? (
          <PanelEmpty title="No log output" />
        ) : (
          <div className="px-2 py-1">
            {allLogs.map((log, i) => (
              <LogRow key={`${log.cellId}-${log.timestamp}-${i}`} log={log} />
            ))}
          </div>
        )}
      </PanelBody>
    </div>
  );
}

// ─── V1 (original) ──────────────────────────────────────

function LogsPanelV1() {
  const allLogs = useLogData();
  const scrollRef = useAutoScroll(allLogs.length);
  const [, toggleV2] = usePanelV2('logs-panel');

  return (
    <div data-slot="logs-panel" className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-1.5 border-b border-mine-border/50 shrink-0 flex items-center gap-1.5">
        <Terminal className="w-3 h-3 text-mine-muted" />
        <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
          Logs
        </span>
        <span className="text-[10px] font-mono text-mine-muted">
          ({allLogs.length})
        </span>
        <div className="flex-1" />
        {allLogs.length > 0 && (
          <button
            type="button"
            title="Clear Logs"
            className="text-mine-muted hover:text-mine-text transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
        <button
          type="button"
          onClick={toggleV2}
          className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors ml-1"
          title="Switch to v2 (new)"
        >
          <span className="text-[8px] font-mono">v2</span>
        </button>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed"
      >
        {allLogs.length === 0 ? (
          <div className="px-3 py-4 text-center text-[11px] text-mine-muted font-sans">
            No log output
          </div>
        ) : (
          <div className="px-2 py-1">
            {allLogs.map((log, i) => (
              <LogRow key={`${log.cellId}-${log.timestamp}-${i}`} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Switch ─────────────────────────────────────────────

export function LogsPanel() {
  const [isV2] = usePanelV2('logs-panel');
  return isV2 ? <LogsPanelV2 /> : <LogsPanelV1 />;
}
