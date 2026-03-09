'use client';

import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { MiningTask, TaskStatus } from '../types';

const MODE_LABELS: Record<string, string> = {
  factor: '自主发现',
  factor_report: '研报提取',
  quant: '联合优化',
};

const STATUS_CONFIG: Record<
  TaskStatus,
  { icon: React.ElementType; label: string; color: string }
> = {
  PENDING: { icon: Clock, label: '等待中', color: 'text-mine-muted' },
  RUNNING: { icon: Loader2, label: '运行中', color: 'text-mine-accent-teal' },
  COMPLETED: {
    icon: CheckCircle2,
    label: '已完成',
    color: 'text-market-down-medium',
  },
  FAILED: { icon: XCircle, label: '失败', color: 'text-market-up-medium' },
  CANCELLED: { icon: AlertCircle, label: '已取消', color: 'text-mine-muted' },
};

interface TaskCardProps extends React.ComponentProps<'button'> {
  task: MiningTask;
  isSelected?: boolean;
}

export function TaskCard({
  task,
  isSelected = false,
  className,
  ...props
}: TaskCardProps) {
  const {
    icon: StatusIcon,
    label: statusLabel,
    color: statusColor,
  } = STATUS_CONFIG[task.status];
  const pct =
    task.progress.maxLoops > 0
      ? Math.round((task.progress.currentLoop / task.progress.maxLoops) * 100)
      : 0;

  return (
    <button
      data-slot="task-card"
      className={cn(
        'w-full text-left px-3 py-2.5 rounded-lg border transition-colors',
        isSelected
          ? 'bg-mine-nav-active text-white border-mine-nav-active'
          : 'bg-white border-mine-border hover:bg-mine-bg',
        className,
      )}
      {...props}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            'text-[11px] font-mono truncate max-w-[140px]',
            isSelected ? 'text-white/70' : 'text-mine-muted',
          )}
        >
          {task.taskId.replace('mining_', '#')}
        </span>
        <div
          className={cn(
            'flex items-center gap-1',
            isSelected ? 'text-white/80' : statusColor,
          )}
        >
          <StatusIcon
            className={cn(
              'w-3 h-3',
              task.status === 'RUNNING' && 'animate-spin',
            )}
          />
          <span className="text-[10px] font-medium">{statusLabel}</span>
        </div>
      </div>

      {/* Mode + progress */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-medium',
            isSelected ? 'text-white' : 'text-mine-text',
          )}
        >
          {MODE_LABELS[task.mode] ?? task.mode}
        </span>
        {(task.status === 'RUNNING' || task.status === 'COMPLETED') && (
          <span
            className={cn(
              'text-[11px] numeric',
              isSelected ? 'text-white/80' : 'text-mine-muted',
            )}
          >
            {task.progress.currentLoop}/{task.progress.maxLoops}
          </span>
        )}
      </div>

      {/* Progress bar — only when RUNNING */}
      {task.status === 'RUNNING' && (
        <div
          className={cn(
            'mt-1.5 h-1 rounded-full overflow-hidden',
            isSelected ? 'bg-white/20' : 'bg-mine-border',
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isSelected ? 'bg-white/70' : 'bg-mine-accent-teal',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </button>
  );
}
