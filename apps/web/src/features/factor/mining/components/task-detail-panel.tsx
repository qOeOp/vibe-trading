'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  Code2,
  Rocket,
  Lightbulb,
  FlaskConical,
} from 'lucide-react';
import type {
  MiningTask,
  LogEntry,
  DiscoveredFactor,
  MiningRound,
} from '../types';
import { miningApi, pushFactorToLibrary } from '../api';
import { useLibraryStore } from '@/features/library/store/use-library-store';

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

  const kpis = [
    {
      label: '已发现',
      value: String(progress.factorsDiscovered),
      positive: undefined as boolean | undefined,
    },
    {
      label: '已接受',
      value: String(progress.factorsAccepted),
      positive: true,
    },
    {
      label: '已拒绝',
      value: String(progress.factorsRejected),
      positive: undefined as boolean | undefined,
    },
    {
      label: '最佳 IC',
      value: progress.bestIc.toFixed(4),
      positive: progress.bestIc > 0.03,
    },
    {
      label: '最佳 IR',
      value: progress.bestIr.toFixed(3),
      positive: progress.bestIr > 1,
    },
    {
      label: '已用时间',
      value: fmtTime(progress.elapsedSeconds),
      positive: undefined as boolean | undefined,
    },
  ];

  return (
    <div
      data-slot="progress-section"
      className="px-4 py-3 border-b border-mine-border/50"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-mine-muted uppercase tracking-wider font-medium">
          运行进度
        </span>
        <span className="text-[11px] font-mono tabular-nums text-mine-muted">
          Loop {progress.currentLoop}/{progress.maxLoops}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-mine-border rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-mine-accent-teal rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-3 gap-3">
        {kpis.map(({ label, value, positive }) => (
          <div key={label} className="text-center">
            <div
              className={cn(
                'text-sm font-bold font-mono tabular-nums',
                positive === true
                  ? 'text-market-down-medium'
                  : 'text-mine-text',
              )}
            >
              {value}
            </div>
            <div className="text-[9px] text-mine-muted uppercase tracking-wider mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Current hypothesis */}
      {progress.currentHypothesis && (
        <div className="mt-3 px-2.5 py-2 bg-mine-bg rounded-md">
          <div className="text-[9px] text-mine-muted uppercase tracking-wider mb-1">
            当前假设
          </div>
          <div className="text-xs text-mine-text leading-relaxed line-clamp-2">
            {progress.currentHypothesis}
          </div>
        </div>
      )}
    </div>
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

function ActivityLog({ entries }: { entries: LogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div
      data-slot="activity-log"
      className="px-4 py-3 border-b border-mine-border/50"
    >
      <div className="text-[10px] text-mine-muted uppercase tracking-wider font-medium mb-2">
        实时日志
      </div>
      <div className="h-[140px] overflow-y-auto bg-mine-bg rounded-md p-2 space-y-0.5">
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
    </div>
  );
}

// ── ResearchRounds ─────────────────────────────────────────────────

function ResearchRounds({ taskId }: { taskId: string }) {
  const [rounds, setRounds] = useState<MiningRound[]>([]);
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    miningApi
      .getRounds(taskId)
      .then(setRounds)
      .catch(() => {});
  }, [taskId]);

  if (rounds.length === 0) return null;

  return (
    <div
      data-slot="research-rounds"
      className="px-4 py-3 border-b border-mine-border/50"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Lightbulb className="w-3 h-3 text-mine-accent-yellow" />
        <span className="text-[10px] text-mine-muted uppercase tracking-wider font-medium">
          研究假设 ({rounds.length} 轮)
        </span>
      </div>
      <div className="space-y-2">
        {rounds.map((round) => (
          <div
            key={round.roundIndex}
            className="bg-mine-bg rounded-lg border border-mine-border/50 overflow-hidden"
          >
            {/* Round header — click to expand */}
            <button
              onClick={() =>
                setExpanded(
                  expanded === round.roundIndex ? null : round.roundIndex,
                )
              }
              className="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-mine-border/20 transition-colors"
            >
              <span className="shrink-0 w-4 h-4 rounded-full bg-mine-accent-yellow/20 text-mine-accent-yellow text-[9px] font-bold flex items-center justify-center mt-0.5">
                {round.roundIndex + 1}
              </span>
              <p className="text-[11px] text-mine-text leading-relaxed line-clamp-2 flex-1">
                {round.hypothesis}
              </p>
            </button>
            {/* Expanded reason */}
            {expanded === round.roundIndex && round.reason && (
              <div className="px-3 pb-2.5 pt-0.5 border-t border-mine-border/30">
                <div className="text-[9px] text-mine-muted uppercase tracking-wider mb-1">
                  推理
                </div>
                <p className="text-[11px] text-mine-muted leading-relaxed">
                  {round.reason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FactorResultCard ───────────────────────────────────────────────

interface FactorResultCardProps {
  factor: DiscoveredFactor;
  taskId: string;
  factorIndex: number;
  onViewCode?: (factor: DiscoveredFactor) => void;
}

function FactorResultCard({
  factor,
  taskId,
  factorIndex,
  onViewCode,
}: FactorResultCardProps) {
  const m = factor.metrics;

  const kvItems = [
    { label: 'IC', value: m.ic.toFixed(4), positive: m.ic > 0.03 },
    { label: 'ICIR', value: m.icir.toFixed(3), positive: m.icir > 1 },
    {
      label: 'ARR',
      value: `${(m.arr * 100).toFixed(1)}%`,
      positive: m.arr > 0,
    },
    { label: 'Sharpe', value: m.sharpe.toFixed(2), positive: m.sharpe > 1 },
    {
      label: '最大回撤',
      value: `${(m.maxDrawdown * 100).toFixed(1)}%`,
      positive: undefined as boolean | undefined,
    },
    {
      label: '换手率',
      value: `${(m.turnover * 100).toFixed(1)}%`,
      positive: undefined as boolean | undefined,
    },
  ];

  const [pushState, setPushState] = useState<
    'idle' | 'loading' | 'done' | 'error'
  >('idle');

  async function handlePush() {
    setPushState('loading');
    try {
      await pushFactorToLibrary({
        taskId,
        factorIndex,
        name: factor.name,
        code: factor.code,
        hypothesis: factor.hypothesis ?? '',
        metrics: {
          ic: factor.metrics.ic,
          icir: factor.metrics.icir,
          arr: factor.metrics.arr,
          sharpe: factor.metrics.sharpe,
          maxDrawdown: factor.metrics.maxDrawdown,
          turnover: factor.metrics.turnover,
        },
      });
      await useLibraryStore.getState().fetchMiningFactors();
      setPushState('done');
    } catch {
      setPushState('error');
      setTimeout(() => setPushState('idle'), 3000);
    }
  }

  return (
    <div
      data-slot="factor-result-card"
      className="bg-mine-bg rounded-lg p-2.5 border border-mine-border/50"
    >
      {/* Name + status */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {factor.accepted ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-market-down-medium shrink-0" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-market-up-medium shrink-0" />
          )}
          <span className="text-xs font-semibold text-mine-text font-mono">
            {factor.name}
          </span>
        </div>
        <span className="text-[10px] text-mine-muted">
          Gen {factor.generation}
        </span>
      </div>

      {/* Description tag + natural language */}
      {factor.description && (
        <div className="mb-2">
          {/* Extract "[Type]" prefix as a badge */}
          {(() => {
            const m = factor.description.match(/^\[([^\]]+)\](.*)/);
            return m ? (
              <div className="flex items-start gap-1.5">
                <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium bg-mine-accent-teal/10 text-mine-accent-teal border border-mine-accent-teal/20">
                  {m[1]}
                </span>
                <p className="text-[10px] text-mine-muted leading-relaxed">
                  {m[2].trim()}
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-mine-muted leading-relaxed">
                {factor.description}
              </p>
            );
          })()}
        </div>
      )}

      {/* Math formulation */}
      {factor.formulation && (
        <div className="mb-2 px-2 py-1.5 bg-mine-nav-active/5 rounded border border-mine-border/30">
          <div className="flex items-center gap-1 mb-0.5">
            <FlaskConical className="w-2.5 h-2.5 text-mine-muted" />
            <span className="text-[9px] text-mine-muted uppercase tracking-wider">
              公式
            </span>
          </div>
          <code className="text-[10px] font-mono text-mine-text leading-relaxed break-all">
            {factor.formulation}
          </code>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mb-2">
        {kvItems.map(({ label, value, positive }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[10px] text-mine-muted">{label}</span>
            <span
              className={cn(
                'text-[11px] font-mono tabular-nums',
                positive === true
                  ? 'text-market-down-medium'
                  : positive === false
                    ? 'text-market-up-medium'
                    : 'text-mine-text',
              )}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewCode?.(factor)}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium
                     text-mine-muted hover:text-mine-text bg-white border border-mine-border
                     hover:border-mine-nav-active/50 transition-colors"
        >
          <Code2 className="w-3 h-3" />
          查看代码
        </button>
        {factor.accepted && (
          <button
            onClick={handlePush}
            disabled={pushState === 'loading' || pushState === 'done'}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
              pushState === 'done'
                ? 'text-market-down-medium border border-market-down-medium/30 bg-market-down-medium/5'
                : pushState === 'error'
                  ? 'text-market-up-medium border border-market-up-medium/30 hover:bg-market-up-medium/5'
                  : 'text-mine-accent-teal border border-mine-accent-teal/30 hover:bg-mine-accent-teal/5',
              (pushState === 'loading' || pushState === 'done') &&
                'opacity-70 cursor-not-allowed',
            )}
          >
            <Rocket className="w-3 h-3" />
            {pushState === 'loading'
              ? '推送中...'
              : pushState === 'done'
                ? '已推送'
                : pushState === 'error'
                  ? '推送失败'
                  : '推送到 Library'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── TaskDetailPanel ────────────────────────────────────────────────

const MODE_LABELS: Record<string, string> = {
  factor: '自主因子发现',
  factor_report: '研报因子提取',
  quant: '联合优化',
};

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

  for (const f of task.factors) {
    entries.push(
      make(
        f.accepted ? 'factor_accepted' : 'factor_rejected',
        `${f.name}  IC=${f.metrics.ic.toFixed(4)}  ${f.accepted ? '✓ 已接受' : '✗ 已拒绝'}`,
        end - 500,
      ),
    );
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

interface TaskDetailPanelProps {
  task: MiningTask;
  logEntries: LogEntry[];
  onViewCode?: (factor: DiscoveredFactor) => void;
  onCancel?: (taskId: string) => void;
  className?: string;
}

export function TaskDetailPanel({
  task,
  logEntries,
  onViewCode,
  onCancel,
  className,
}: TaskDetailPanelProps) {
  return (
    <div
      data-slot="task-detail-panel"
      className={cn(
        'flex flex-col bg-white border border-mine-border rounded-xl overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-mine-border/50 shrink-0">
        <div>
          <span className="text-xs font-mono text-mine-muted">
            {task.taskId.replace('mining_', '#')}
          </span>
          <span className="mx-2 text-mine-border">·</span>
          <span className="text-xs font-medium text-mine-text">
            {MODE_LABELS[task.mode] ?? task.mode}
          </span>
        </div>
        {task.status === 'RUNNING' && onCancel && (
          <button
            onClick={() => onCancel(task.taskId)}
            className="px-2.5 py-1 text-[10px] font-medium rounded
                       text-market-up-medium border border-market-up-medium/30
                       hover:bg-market-up-medium/5 transition-colors"
          >
            停止
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Progress */}
        <ProgressSection task={task} />

        {/* Activity log — live stream when RUNNING, static summary otherwise */}
        <ActivityLog
          entries={
            task.status === 'RUNNING' ? logEntries : buildCompletedLog(task)
          }
        />

        {/* Research rounds — hypothesis + reason per loop */}
        <ResearchRounds taskId={task.taskId} />

        {/* Discovered factors */}
        <div className="px-4 py-3">
          <div className="text-[10px] text-mine-muted uppercase tracking-wider font-medium mb-2">
            已发现因子 ({task.factors.length})
          </div>
          {task.factors.length === 0 ? (
            <div className="py-4 text-center text-xs text-mine-muted">
              {task.status === 'RUNNING'
                ? '等待第一个因子...'
                : task.status === 'FAILED'
                  ? '挖掘失败，未产生因子'
                  : task.status === 'CANCELLED'
                    ? '任务已取消'
                    : '本次运行未产生有效因子'}
            </div>
          ) : (
            <div className="space-y-2">
              {task.factors.map((factor, idx) => (
                <FactorResultCard
                  key={factor.name}
                  factor={factor}
                  taskId={task.taskId}
                  factorIndex={idx}
                  onViewCode={onViewCode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
