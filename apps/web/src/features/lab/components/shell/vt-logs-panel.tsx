'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Filter,
  Trash2,
  ArrowDown,
  Search,
  X,
  ChevronRight,
  ChevronDown,
  Info,
  AlertTriangle,
  AlertCircle,
  Package,
  Zap,
  Terminal,
} from 'lucide-react';
import { useCellActions, useCellLogs } from '@/features/lab/core/cells/cells';
import { formatLogTimestamp } from '@/features/lab/core/cells/logs';
import { CellLink } from '@/features/lab/components/editor/links/cell-link';
import { cn } from '@/features/lab/utils/cn';
import { useAlerts } from '@/features/lab/core/alerts/state';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';

// ─── Unified Log Entry ─────────────────────────────────

type LogSource = 'cell' | 'startup' | 'package';

interface UnifiedLogEntry {
  id: string;
  timestamp: number;
  level: 'stdout' | 'stderr' | 'info';
  message: string;
  cellId?: string;
  source: LogSource;
  packageName?: string;
}

// ─── Hooks ──────────────────────────────────────────────

function useUnifiedLogs(): UnifiedLogEntry[] {
  const cellLogs = useCellLogs();
  const alerts = useAlerts();

  return useMemo(() => {
    const entries: UnifiedLogEntry[] = [];

    // 1. Cell logs (stdout/stderr)
    for (let i = 0; i < cellLogs.length; i++) {
      const log = cellLogs[i];
      entries.push({
        id: `cell-${i}`,
        timestamp: log.timestamp,
        level: log.level,
        message: log.message,
        cellId: log.cellId,
        source: 'cell',
      });
    }

    // 2. Startup logs
    if (alerts.startupLogsAlert?.content) {
      const lines = alerts.startupLogsAlert.content.split('\n').filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        entries.push({
          id: `startup-${i}`,
          timestamp: 0,
          level: 'info',
          message: lines[i],
          source: 'startup',
        });
      }
    }

    // 3. Package install logs
    for (const [pkgName, content] of Object.entries(alerts.packageLogs)) {
      if (!content) continue;
      const lines = content.split('\n').filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        entries.push({
          id: `pkg-${pkgName}-${i}`,
          timestamp: 0,
          level: 'info',
          message: lines[i],
          source: 'package',
          packageName: pkgName,
        });
      }
    }

    // Sort: startup first (timestamp 0), then by timestamp
    entries.sort((a, b) => a.timestamp - b.timestamp);

    return entries;
  }, [cellLogs, alerts.startupLogsAlert, alerts.packageLogs]);
}

// ─── Source Filter ──────────────────────────────────────

type SourceFilter = 'all' | LogSource;

const SOURCE_LABELS: Record<SourceFilter, string> = {
  all: 'All',
  cell: 'Cell',
  startup: 'Startup',
  package: 'Package',
};

// ─── Severity helpers ───────────────────────────────────

function getSeverityFromLevel(
  level: UnifiedLogEntry['level'],
): 'info' | 'warning' | 'error' {
  if (level === 'stderr') return 'error';
  return 'info';
}

function SeverityIcon({ level }: { level: UnifiedLogEntry['level'] }) {
  const severity = getSeverityFromLevel(level);
  switch (severity) {
    case 'error':
      return <AlertCircle className="w-3 h-3 text-market-up-medium" />;
    case 'warning':
      return <AlertTriangle className="w-3 h-3 text-mine-accent-yellow" />;
    default:
      return <Info className="w-3 h-3 text-blue-400" />;
  }
}

// ─── Source label ────────────────────────────────────────

function SourceLabel({
  source,
  packageName,
  cellId,
}: Pick<UnifiedLogEntry, 'source' | 'packageName' | 'cellId'>) {
  switch (source) {
    case 'cell':
      return cellId ? (
        <span className="flex items-center gap-1 text-[11px] text-mine-muted">
          <Terminal className="w-2.5 h-2.5" />
          <CellLink cellId={cellId as any} className="text-[11px]" />
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[11px] text-mine-muted">
          <Terminal className="w-2.5 h-2.5" />
          Cell
        </span>
      );
    case 'startup':
      return (
        <span className="flex items-center gap-1 text-[11px] text-mine-accent-yellow">
          <Zap className="w-2.5 h-2.5" />
          Startup
        </span>
      );
    case 'package':
      return (
        <span className="flex items-center gap-1 text-[11px] text-purple-500">
          <Package className="w-2.5 h-2.5" />
          {packageName || 'Package'}
        </span>
      );
  }
}

// ─── Message summary ────────────────────────────────────

function getFirstLine(message: string): string {
  const firstLine = message.split('\n')[0];
  return firstLine.length > 200 ? `${firstLine.slice(0, 200)}...` : firstLine;
}

function isMultiLine(message: string): boolean {
  return message.includes('\n') || message.length > 200;
}

// ─── Component ──────────────────────────────────────────

function VTLogsPanel() {
  const allLogs = useUnifiedLogs();
  const { clearLogs } = useCellActions();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [cellFilter, setCellFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Listen for focusLogCellId from store (errors→logs linkage)
  const focusLogCellId = useLabModeStore((s) => s.focusLogCellId);

  useEffect(() => {
    if (!focusLogCellId) return;
    setCellFilter(focusLogCellId);
    setSourceFilter('cell');
    useLabModeStore.setState({ focusLogCellId: null });
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, [focusLogCellId]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    let logs = allLogs;
    if (sourceFilter !== 'all') {
      logs = logs.filter((l) => l.source === sourceFilter);
    }
    if (cellFilter) {
      logs = logs.filter((l) => l.cellId === cellFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      logs = logs.filter((l) => l.message.toLowerCase().includes(q));
    }
    return logs;
  }, [allLogs, sourceFilter, cellFilter, searchQuery]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredLogs.length, autoScroll]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 40;
    setAutoScroll(atBottom);
  }, []);

  const clearCellFilter = useCallback(() => {
    setCellFilter(null);
  }, []);

  const toggleRow = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  if (allLogs.length === 0) {
    return (
      <div
        data-slot="vt-logs-empty"
        className="flex-1 flex flex-col items-center justify-center gap-2 text-mine-muted"
      >
        <span className="text-xs font-medium">No logs</span>
        <span className="text-[10px] opacity-60">
          stdout and stderr will appear here
        </span>
      </div>
    );
  }

  return (
    <div data-slot="vt-logs-panel" className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center gap-1 px-2 py-1 border-b border-mine-border/30">
        {/* Source filter pills */}
        <div className="flex items-center gap-0.5">
          {(Object.keys(SOURCE_LABELS) as SourceFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              className={cn(
                'px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors',
                sourceFilter === key
                  ? 'bg-mine-nav-active text-white'
                  : 'text-mine-muted hover:text-mine-text hover:bg-mine-bg',
              )}
              onClick={() => {
                setSourceFilter(key);
                if (key !== 'cell') setCellFilter(null);
              }}
            >
              {SOURCE_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Cell filter badge */}
        {cellFilter && (
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-mine-accent-teal/10 text-mine-accent-teal">
            <Filter className="w-2.5 h-2.5" />
            <span className="text-[10px] font-mono">
              {cellFilter.slice(0, 8)}
            </span>
            <button
              type="button"
              className="hover:text-mine-text"
              onClick={clearCellFilter}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        )}

        <div className="flex-1" />

        {/* Count */}
        <span className="text-[10px] font-mono text-mine-muted tabular-nums">
          {filteredLogs.length} events
        </span>

        {/* Search toggle */}
        <button
          type="button"
          className={cn(
            'p-1 rounded transition-colors',
            showSearch
              ? 'text-mine-accent-teal bg-mine-accent-teal/10'
              : 'text-mine-muted hover:text-mine-text',
          )}
          onClick={() => setShowSearch((v) => !v)}
        >
          <Search className="w-3 h-3" />
        </button>

        {/* Auto-scroll indicator */}
        {!autoScroll && (
          <button
            type="button"
            className="p-1 rounded text-mine-muted hover:text-mine-text transition-colors"
            onClick={() => {
              setAutoScroll(true);
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
            }}
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        )}

        {/* Clear */}
        <button
          type="button"
          className="p-1 rounded text-mine-muted hover:text-mine-accent-red transition-colors"
          onClick={clearLogs}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="shrink-0 flex items-center gap-2 px-2 py-1 border-b border-mine-border/30">
          <Search className="w-3 h-3 text-mine-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="flex-1 text-xs bg-transparent outline-none text-mine-text placeholder:text-mine-muted/50"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className="text-mine-muted hover:text-mine-text"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <span className="text-[10px] text-mine-muted tabular-nums font-mono">
            {filteredLogs.length}
          </span>
        </div>
      )}

      {/* Table header */}
      <div className="shrink-0 grid grid-cols-[minmax(100px,1fr)_140px_minmax(0,3fr)] gap-0 border-b border-mine-border/40 bg-mine-bg/50 text-[10px] font-medium text-mine-muted uppercase tracking-wider select-none">
        <div className="px-2 py-1.5">Source</div>
        <div className="px-2 py-1.5">Timestamp</div>
        <div className="px-2 py-1.5">Message</div>
      </div>

      {/* Table body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onScroll={handleScroll}
      >
        {filteredLogs.map((log) => (
          <LogTableRow
            key={log.id}
            log={log}
            expanded={expandedRows.has(log.id)}
            onToggle={() => toggleRow(log.id)}
            onCellClick={setCellFilter}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Table Row ──────────────────────────────────────────

function LogTableRow({
  log,
  expanded,
  onToggle,
  onCellClick,
}: {
  log: UnifiedLogEntry;
  expanded: boolean;
  onToggle: () => void;
  onCellClick: (cellId: string) => void;
}) {
  const expandable = isMultiLine(log.message);
  const summary = getFirstLine(log.message);

  return (
    <div
      data-slot="log-table-row"
      data-cell-id={log.cellId}
      className={cn(
        'border-b border-mine-border/20 transition-colors',
        expanded && 'bg-mine-bg/30',
        !expanded && 'hover:bg-mine-bg/30',
      )}
    >
      {/* Main row — 3 columns */}
      <div
        className={cn(
          'grid grid-cols-[minmax(100px,1fr)_140px_minmax(0,3fr)] gap-0 items-center cursor-pointer',
        )}
        onClick={expandable ? onToggle : undefined}
      >
        {/* Col 1: Source */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 min-w-0">
          {expandable ? (
            expanded ? (
              <ChevronDown className="w-3 h-3 text-mine-muted shrink-0" />
            ) : (
              <ChevronRight className="w-3 h-3 text-mine-muted shrink-0" />
            )
          ) : (
            <span className="w-3 shrink-0" />
          )}
          <SeverityIcon level={log.level} />
          <SourceLabel
            source={log.source}
            packageName={log.packageName}
            cellId={log.cellId}
          />
        </div>

        {/* Col 2: Timestamp */}
        <div className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-mine-muted">
          {log.timestamp > 0 ? formatLogTimestamp(log.timestamp) : '—'}
        </div>

        {/* Col 3: Message summary */}
        <div className="px-2 py-1.5 text-[11px] font-mono text-mine-text truncate">
          {summary}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-2 pb-2 pl-8">
          <pre className="text-[11px] font-mono text-mine-text whitespace-pre-wrap break-all bg-mine-bg/60 rounded-md px-3 py-2 max-h-60 overflow-y-auto border border-mine-border/20">
            {log.message}
          </pre>
        </div>
      )}
    </div>
  );
}

export default VTLogsPanel;
