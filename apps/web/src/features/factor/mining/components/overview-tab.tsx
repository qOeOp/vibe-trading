'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  PanelSection,
  PanelStatGrid,
  PanelStatItem,
  PanelChartBox,
} from '@/components/shared/panel';
import type { StatColor } from '@/components/shared/panel';
import type { MiningTask, LogEntry } from '../types';
import type { MiningLang } from '../types';

// ── ProgressSection ───────────────────────────────────────────────

function ProgressSection({ task }: { task: MiningTask }) {
  const { progress } = task;
  const pct =
    progress.maxLoops > 0
      ? Math.round((progress.currentLoop / progress.maxLoops) * 100)
      : 0;

  const fmtTime = (s: number) => {
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    return `${Math.floor(s / 3600)}h${Math.floor((s % 3600) / 60)}m`;
  };

  const loopText = (
    <span className="text-[11px] font-mono tabular-nums text-mine-muted">
      Loop {progress.currentLoop}/{progress.maxLoops}
    </span>
  );

  const kpis: { label: string; value: string; color?: StatColor }[] = [
    {
      label: '已发现',
      value: String(progress.factorsDiscovered),
    },
    {
      label: '已接受',
      value: String(progress.factorsAccepted),
      color: 'positive',
    },
    {
      label: '已拒绝',
      value: String(progress.factorsRejected),
    },
    {
      label: '最佳 IC',
      value: progress.bestIc.toFixed(4),
      color: progress.bestIc > 0.03 ? 'positive' : undefined,
    },
    {
      label: '最佳 IR',
      value: progress.bestIr.toFixed(3),
      color: progress.bestIr > 1 ? 'positive' : undefined,
    },
    {
      label: '已用时间',
      value: fmtTime(progress.elapsedSeconds),
    },
  ];

  return (
    <PanelSection title="运行进度" suffix={loopText}>
      {/* Progress bar */}
      <div className="h-1.5 bg-mine-border rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-mine-accent-teal rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* KPI grid */}
      <PanelStatGrid columns={3}>
        {kpis.map(({ label, value, color }) => (
          <PanelStatItem
            key={label}
            label={label}
            value={value}
            color={color}
          />
        ))}
      </PanelStatGrid>

      {/* Current hypothesis */}
      {progress.currentHypothesis && (
        <PanelChartBox className="mt-3 px-2.5 py-2">
          <div className="text-[9px] text-mine-muted uppercase tracking-wider mb-1">
            当前假设
          </div>
          <div className="text-xs text-mine-text leading-relaxed line-clamp-2">
            {progress.currentHypothesis}
          </div>
        </PanelChartBox>
      )}
    </PanelSection>
  );
}

// ── ActivityLog ────────────────────────────────────────────────────

const LOG_TYPE_COLOR: Record<LogEntry['type'], string> = {
  iteration: 'text-mine-muted',
  factor_accepted: 'text-market-down-medium',
  factor_rejected: 'text-market-up-medium',
  complete: 'text-mine-accent-teal',
  error: 'text-market-up-medium',
};

function ActivityLog({
  entries,
  isLive = true,
}: {
  entries: LogEntry[];
  isLive?: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <PanelSection
      title={isLive ? '实时日志' : '运行日志'}
      className="flex-1 min-h-0 flex flex-col"
    >
      <div className="flex-1 min-h-0 overflow-y-auto bg-mine-bg rounded-md p-2 space-y-0.5">
        {entries.length === 0 && (
          <div className="text-[11px] text-mine-muted italic">
            等待挖掘开始...
          </div>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-2">
            <span className="text-[10px] font-mono text-mine-muted shrink-0 mt-0.5">
              {new Date(entry.timestamp).toLocaleTimeString('zh', {
                hour12: false,
              })}
            </span>
            <span
              className={cn(
                'text-[11px] leading-relaxed',
                LOG_TYPE_COLOR[entry.type],
              )}
            >
              {entry.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </PanelSection>
  );
}

// ── buildCompletedLog ─────────────────────────────────────────────

/** Build a static summary log for completed/failed/cancelled tasks.
 *  Replaces the live SSE stream log when the task is no longer running.
 */
function buildCompletedLog(task: MiningTask): LogEntry[] {
  const make = (
    type: LogEntry['type'],
    message: string,
    ts: number,
  ): LogEntry => ({
    id: `${type}-${ts}`,
    timestamp: ts,
    type,
    message,
  });

  const entries: LogEntry[] = [];
  const start = (task.startedAt ?? task.createdAt) * 1000;
  const end = (task.completedAt ?? task.createdAt) * 1000;

  entries.push(
    make(
      'iteration',
      `开始挖掘 — 模式: ${task.mode}  最大轮次: ${task.config.maxLoops}`,
      start,
    ),
  );

  const p = task.progress;
  if (p.currentLoop > 0) {
    entries.push(
      make(
        'iteration',
        `完成 ${p.currentLoop} 轮  发现 ${p.factorsDiscovered} 个因子  接受 ${p.factorsAccepted} 个`,
        end - 1000,
      ),
    );
  }

  for (let i = 0; i < task.factors.length; i++) {
    const f = task.factors[i];
    entries.push({
      ...make(
        f.accepted ? 'factor_accepted' : 'factor_rejected',
        `${f.name}  IC=${f.metrics.ic.toFixed(4)}  ${f.accepted ? '\u2713 已接受' : '\u2717 已拒绝'}`,
        end - 500,
      ),
      id: `factor_${i}_${end - 500}`,
    });
  }

  if (task.status === 'COMPLETED') {
    entries.push(
      make('complete', `挖掘完成 — 共接受 ${p.factorsAccepted} 个因子`, end),
    );
  } else if (task.status === 'FAILED') {
    entries.push(
      make('error', `挖掘失败: ${task.errorMessage ?? '未知错误'}`, end),
    );
  } else if (task.status === 'CANCELLED') {
    entries.push(make('error', '任务已取消', end));
  }

  return entries;
}

// ── OverviewTab ───────────────────────────────────────────────────

interface OverviewTabProps {
  task: MiningTask;
  logEntries: LogEntry[];
  lang?: MiningLang;
  className?: string;
}

function OverviewTab({ task, logEntries, className }: OverviewTabProps) {
  const resolvedEntries =
    task.status === 'RUNNING'
      ? logEntries
      : task.status === 'PENDING'
        ? []
        : buildCompletedLog(task);

  return (
    <div
      data-slot="overview-tab"
      className={cn('flex-1 min-h-0 flex flex-col', className)}
    >
      <div className="shrink-0">
        <ProgressSection task={task} />
      </div>
      <ActivityLog
        entries={resolvedEntries}
        isLive={task.status === 'RUNNING'}
      />
    </div>
  );
}

export {
  OverviewTab,
  ProgressSection,
  ActivityLog,
  buildCompletedLog,
  LOG_TYPE_COLOR,
};
export type { OverviewTabProps };
