'use client';

import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  PanelFrame,
  PanelFrameHeader,
  PanelBadgeTag,
} from '@/components/shared/panel';
import type { MiningTask, LogEntry, DiscoveredFactor } from '../types';
import { OverviewTab } from './overview-tab';
import { FactorsTab } from './factors-tab';
import { ResearchLogTab } from './research-log-tab';

const MODE_LABELS: Record<string, string> = {
  factor: '自主因子发现',
  factor_report: '研报因子提取',
  quant: '联合优化',
};

interface TaskDetailPanelProps {
  task: MiningTask;
  logEntries: LogEntry[];
  onViewCode?: (factor: DiscoveredFactor) => void;
  onCancel?: (taskId: string) => void;
  className?: string;
}

function TaskDetailPanel({
  task,
  logEntries,
  onViewCode,
  onCancel,
  className,
}: TaskDetailPanelProps) {
  const cancelButton =
    task.status === 'RUNNING' && onCancel ? (
      <button
        onClick={() => onCancel(task.taskId)}
        className="px-2.5 py-1 text-[10px] font-medium rounded
                   text-market-up-medium border border-market-up-medium/30
                   hover:bg-market-up-medium/5 transition-colors"
      >
        停止
      </button>
    ) : undefined;

  return (
    <PanelFrame
      data-slot="task-detail-panel"
      className={cn('flex flex-col', className)}
    >
      <PanelFrameHeader
        title={task.taskId.replace('mining_', '#')}
        subtitle={
          <PanelBadgeTag color="teal">
            {MODE_LABELS[task.mode] ?? task.mode}
          </PanelBadgeTag>
        }
        actions={cancelButton}
      />

      <Tabs
        defaultValue="overview"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-4 pt-2 border-b border-mine-border/50">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="overview" className="text-xs">
              概览
            </TabsTrigger>
            <TabsTrigger value="factors" className="text-xs">
              因子
              {task.factors.length > 0 && (
                <span className="ml-1 text-[9px] text-mine-muted font-mono tabular-nums">
                  {task.factors.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="research-log" className="text-xs">
              研究日志
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="flex-1 overflow-y-auto">
          <OverviewTab task={task} logEntries={logEntries} />
        </TabsContent>

        <TabsContent value="factors" className="flex-1 overflow-hidden">
          <FactorsTab task={task} onViewCode={onViewCode} />
        </TabsContent>

        <TabsContent value="research-log" className="flex-1 overflow-hidden">
          <ResearchLogTab task={task} />
        </TabsContent>
      </Tabs>
    </PanelFrame>
  );
}

export { TaskDetailPanel };
export type { TaskDetailPanelProps };
