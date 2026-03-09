'use client';

import * as React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PanelEmpty } from '@/components/shared/panel';
import type { MiningTask, DiscoveredFactor } from '../types';
import type { MiningLang } from '../types';
import { FactorDetail } from './factor-detail';

// ── Filter types ─────────────────────────────────────────────────

type FilterKey = 'all' | 'accepted' | 'rejected';

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'accepted', label: '通过' },
  { key: 'rejected', label: '拒绝' },
];

// ── Empty messages by status ─────────────────────────────────────

function emptyMessage(status: MiningTask['status']): string {
  switch (status) {
    case 'RUNNING':
      return '等待第一个因子...';
    case 'FAILED':
      return '挖掘失败，未产生因子';
    case 'CANCELLED':
      return '任务已取消，未产生因子';
    case 'PENDING':
      return '任务尚未开始';
    default:
      return '暂无因子';
  }
}

// ── FactorCard ───────────────────────────────────────────────────

function FactorCard({
  factor,
  selected,
  onClick,
}: {
  factor: DiscoveredFactor;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-slot="factor-card"
      onClick={onClick}
      className={cn(
        'w-full text-left px-3 py-2.5 rounded-lg transition-colors',
        selected
          ? 'bg-mine-nav-active text-white'
          : 'hover:bg-mine-bg text-mine-text',
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {factor.accepted ? (
          <CheckCircle2
            className={cn(
              'w-3.5 h-3.5 shrink-0',
              selected ? 'text-white/70' : 'text-market-down-medium',
            )}
          />
        ) : (
          <XCircle
            className={cn(
              'w-3.5 h-3.5 shrink-0',
              selected ? 'text-white/70' : 'text-market-up-medium',
            )}
          />
        )}
        <span className="text-xs numeric truncate">
          {factor.name}
        </span>
      </div>

      <div className="flex items-center gap-3 pl-5">
        <span
          className={cn(
            'text-[10px] numeric',
            selected ? 'text-white/60' : 'text-mine-muted',
          )}
        >
          IC {factor.metrics.ic.toFixed(4)}
        </span>
        <span
          className={cn(
            'text-[10px] numeric',
            selected ? 'text-white/60' : 'text-mine-muted',
          )}
        >
          ICIR {factor.metrics.icir.toFixed(4)}
        </span>
        <span
          className={cn(
            'text-[10px]',
            selected ? 'text-white/40' : 'text-mine-muted/60',
          )}
        >
          R{factor.generation}
        </span>
      </div>
    </button>
  );
}

// ── FactorsTab ───────────────────────────────────────────────────

interface FactorsTabProps {
  task: MiningTask;
  onViewCode?: (factor: DiscoveredFactor) => void;
  lang?: MiningLang;
  className?: string;
}

function FactorsTab({
  task,
  onViewCode,
  className,
  ...props
}: FactorsTabProps & Omit<React.ComponentProps<'div'>, keyof FactorsTabProps>) {
  const [filter, setFilter] = React.useState<FilterKey>('all');
  const [selectedIdx, setSelectedIdx] = React.useState(0);

  const filtered = React.useMemo(() => {
    if (filter === 'all') return task.factors;
    if (filter === 'accepted') return task.factors.filter((f) => f.accepted);
    return task.factors.filter((f) => !f.accepted);
  }, [task.factors, filter]);

  // Auto-select first when filter changes or factors update
  React.useEffect(() => {
    setSelectedIdx(0);
  }, [filter, task.taskId, task.factors.length]);

  const selectedFactor = filtered[selectedIdx] ?? null;

  // Get the real index in task.factors for the API call
  const realFactorIndex = selectedFactor
    ? task.factors.findIndex((f) => f.name === selectedFactor.name)
    : -1;

  if (task.factors.length === 0) {
    return (
      <div
        data-slot="factors-tab"
        className={cn('flex-1 flex items-center justify-center', className)}
        {...props}
      >
        <PanelEmpty
          title={emptyMessage(task.status)}
          description={
            task.status === 'RUNNING' ? '挖掘引擎正在搜索中' : undefined
          }
        />
      </div>
    );
  }

  return (
    <div
      data-slot="factors-tab"
      className={cn('flex-1 min-h-0 flex overflow-hidden', className)}
      {...props}
    >
      {/* Left: Factor list */}
      <div className="w-[240px] shrink-0 min-h-0 flex flex-col border-r border-mine-border/50">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-mine-border/50">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-label={label}
              onClick={() => setFilter(key)}
              className={cn(
                'px-2 py-1 text-xs font-medium rounded-md transition-colors',
                filter === key
                  ? 'bg-mine-nav-active text-white'
                  : 'text-mine-muted hover:text-mine-text',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Factor list */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="text-[11px] text-mine-muted text-center py-4">
              无匹配因子
            </div>
          ) : (
            filtered.map((factor, idx) => (
              <FactorCard
                key={factor.name}
                factor={factor}
                selected={idx === selectedIdx}
                onClick={() => setSelectedIdx(idx)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right: Factor detail */}
      <div className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        {selectedFactor ? (
          <FactorDetail
            factor={selectedFactor}
            taskId={task.taskId}
            factorIndex={realFactorIndex}
            onViewCode={onViewCode}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center h-full">
            <PanelEmpty title="选择一个因子查看详情" />
          </div>
        )}
      </div>
    </div>
  );
}

export { FactorsTab, FactorCard };
export type { FactorsTabProps };
