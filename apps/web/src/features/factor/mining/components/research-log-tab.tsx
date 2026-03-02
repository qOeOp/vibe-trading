'use client';

import * as React from 'react';
import {
  Lightbulb,
  Code2,
  BarChart3,
  MessageSquare,
  ChevronDown,
  ScrollText,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { PanelEmpty } from '@/components/shared/panel';
import { miningApi } from '../api';
import type { MiningTask, MiningRound } from '../types';
import type { MiningLang } from '../types';

// ── Step visual config ───────────────────────────────────────────────

type StepType = 'hypothesis' | 'coding' | 'evaluating' | 'feedback';

const STEP_CONFIG: Record<
  StepType,
  {
    icon: React.ElementType;
    label: string;
    textColor: string;
    bgColor: string;
  }
> = {
  hypothesis: {
    icon: Lightbulb,
    label: '假设生成',
    textColor: 'text-mine-accent-yellow',
    bgColor: 'bg-mine-accent-yellow/10',
  },
  coding: {
    icon: Code2,
    label: '代码生成',
    textColor: 'text-mine-accent-teal',
    bgColor: 'bg-mine-accent-teal/10',
  },
  evaluating: {
    icon: BarChart3,
    label: '评估执行',
    textColor: 'text-mine-section-green',
    bgColor: 'bg-mine-section-green/10',
  },
  feedback: {
    icon: MessageSquare,
    label: '反馈总结',
    textColor: 'text-mine-muted',
    bgColor: 'bg-mine-bg',
  },
};

// ── TimelineStep ─────────────────────────────────────────────────────

type TimelineStepProps = {
  type: StepType;
  content: React.ReactNode;
  isLast?: boolean;
};

function TimelineStep({ type, content, isLast = false }: TimelineStepProps) {
  const config = STEP_CONFIG[type];
  const Icon = config.icon;

  return (
    <div data-slot="timeline-step" className="flex gap-3">
      {/* Left: icon circle + vertical line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
            config.bgColor,
          )}
        >
          <Icon className={cn('w-3.5 h-3.5', config.textColor)} />
        </div>
        {!isLast && <div className="w-px flex-1 min-h-3 bg-mine-border/50" />}
      </div>

      {/* Right: label + content */}
      <div className="pb-3 min-w-0 flex-1">
        <p
          className={cn(
            'text-[11px] font-medium uppercase tracking-wider mb-1',
            config.textColor,
          )}
        >
          {config.label}
        </p>
        <div className="text-xs text-mine-text leading-relaxed">{content}</div>
      </div>
    </div>
  );
}

// ── RoundCard ────────────────────────────────────────────────────────

type RoundCardProps = {
  round: MiningRound;
  expanded: boolean;
  onToggle: () => void;
};

function RoundCard({ round, expanded, onToggle }: RoundCardProps) {
  const steps = buildSteps(round);

  return (
    <div
      data-slot="round-card"
      className="bg-white shadow-sm border border-mine-border rounded-xl overflow-hidden"
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-mine-bg/50 transition-colors"
      >
        {/* Round number badge */}
        <div className="w-6 h-6 rounded-full bg-mine-nav-active text-white flex items-center justify-center shrink-0 text-[10px] font-mono font-bold tabular-nums">
          {round.roundIndex}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-mine-text">
              Round {round.roundIndex}
            </span>
            {round.timestamp != null && (
              <span className="text-[10px] text-mine-muted font-mono tabular-nums">
                {formatTimestamp(round.timestamp)}
              </span>
            )}
          </div>

          {/* Hypothesis preview */}
          <p className="text-[11px] text-mine-muted mt-0.5 line-clamp-2">
            {round.hypothesis}
          </p>
        </div>

        {/* Expand chevron */}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-mine-muted shrink-0 transition-transform duration-200',
            expanded && 'rotate-180',
          )}
        />
      </button>

      {/* Expanded content — timeline steps */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-mine-border/50 pt-3">
          {steps.map((step, i) => (
            <TimelineStep
              key={`${step.type}-${i}`}
              type={step.type}
              content={step.content}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Build timeline steps from round data ─────────────────────────────

function buildSteps(
  round: MiningRound,
): Array<{ type: StepType; content: React.ReactNode }> {
  const steps: Array<{ type: StepType; content: React.ReactNode }> = [];

  // 1. Hypothesis step
  steps.push({
    type: 'hypothesis',
    content: (
      <div className="space-y-1">
        <p>{round.hypothesis}</p>
        {round.conciseKnowledge && (
          <p className="text-mine-muted text-[10px]">
            {round.conciseKnowledge}
          </p>
        )}
      </div>
    ),
  });

  // 2. Feedback / reason step
  steps.push({
    type: 'feedback',
    content: (
      <div className="space-y-1">
        <p>{round.reason}</p>
        {round.conciseObservation && (
          <p className="text-mine-muted text-[10px]">
            {round.conciseObservation}
          </p>
        )}
        {round.conciseJustification && (
          <p className="text-mine-muted text-[10px]">
            {round.conciseJustification}
          </p>
        )}
      </div>
    ),
  });

  return steps;
}

// ── Helpers ──────────────────────────────────────────────────────────

function formatTimestamp(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getEmptyDescription(status: MiningTask['status']): string {
  switch (status) {
    case 'PENDING':
      return '任务尚未开始运行';
    case 'RUNNING':
      return '等待第一轮研究完成...';
    case 'FAILED':
      return '任务执行失败，未产生研究记录';
    case 'CANCELLED':
      return '任务已取消';
    default:
      return '本次挖掘未产生研究记录';
  }
}

// ── ResearchLogTab ───────────────────────────────────────────────────

type ResearchLogTabProps = {
  task: MiningTask;
  lang?: MiningLang;
  className?: string;
};

function ResearchLogTab({ task, className }: ResearchLogTabProps) {
  const [rounds, setRounds] = React.useState<MiningRound[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchRounds() {
      setLoading(true);
      try {
        const data = await miningApi.getRounds(task.taskId);
        if (cancelled) return;
        setRounds(data);
        // Auto-expand the latest round (highest roundIndex)
        if (data.length > 0) {
          const maxIdx = Math.max(...data.map((r) => r.roundIndex));
          setExpandedIndex(maxIdx);
        }
      } catch {
        if (cancelled) return;
        setRounds([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchRounds();
    return () => {
      cancelled = true;
    };
  }, [task.taskId]);

  // Loading state
  if (loading) {
    return (
      <div
        data-slot="research-log-tab"
        className={cn('flex flex-col gap-3 p-4', className)}
      >
        <div className="h-20 rounded-xl bg-mine-bg animate-pulse" />
        <div className="h-20 rounded-xl bg-mine-bg animate-pulse" />
      </div>
    );
  }

  // Empty state
  if (rounds.length === 0) {
    return (
      <div data-slot="research-log-tab" className={cn('flex-1', className)}>
        <PanelEmpty
          icon={<ScrollText />}
          title="暂无研究记录"
          description={getEmptyDescription(task.status)}
        />
      </div>
    );
  }

  // Rounds — newest first
  const sortedRounds = [...rounds].sort((a, b) => b.roundIndex - a.roundIndex);

  return (
    <div
      data-slot="research-log-tab"
      className={cn(
        'flex-1 min-h-0 flex flex-col gap-3 p-4 overflow-y-auto',
        className,
      )}
    >
      {sortedRounds.map((round) => (
        <RoundCard
          key={round.roundIndex}
          round={round}
          expanded={expandedIndex === round.roundIndex}
          onToggle={() =>
            setExpandedIndex((prev) =>
              prev === round.roundIndex ? null : round.roundIndex,
            )
          }
        />
      ))}
    </div>
  );
}

export { ResearchLogTab };
export type { ResearchLogTabProps };
