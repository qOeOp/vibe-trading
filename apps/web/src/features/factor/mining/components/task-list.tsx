'use client';

import { cn } from '@/lib/utils';
import { Plus, RefreshCw } from 'lucide-react';
import {
  PanelFrame,
  PanelFrameHeader,
  PanelFrameBody,
  PanelActionButton,
} from '@/components/shared/panel';
import type { MiningTask } from '../types';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: MiningTask[];
  selectedTaskId: string | null;
  loading?: boolean;
  onSelectTask: (taskId: string) => void;
  onNewTask: () => void;
  onRefresh: () => void;
  className?: string;
}

export function TaskList({
  tasks,
  selectedTaskId,
  loading = false,
  onSelectTask,
  onNewTask,
  onRefresh,
  className,
}: TaskListProps) {
  const refreshButton = (
    <PanelActionButton
      icon={<RefreshCw className={cn(loading && 'animate-spin')} />}
      label="刷新"
      onClick={onRefresh}
    />
  );

  const toolbar = (
    <div className="px-2 py-2 border-b border-mine-border/30 shrink-0">
      <button
        onClick={onNewTask}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                   bg-mine-nav-active text-white text-xs font-medium
                   hover:bg-mine-nav-active/90 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        新建挖掘任务
      </button>
    </div>
  );

  return (
    <PanelFrame data-slot="task-list" className={className}>
      <PanelFrameHeader title="挖掘任务" actions={refreshButton} />

      <PanelFrameBody toolbar={toolbar} className="p-2 space-y-1.5">
        {tasks.length === 0 && !loading && (
          <div className="py-8 text-center text-xs text-mine-muted">
            暂无任务，点击上方按钮创建
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.taskId}
            task={task}
            isSelected={task.taskId === selectedTaskId}
            onClick={() => onSelectTask(task.taskId)}
          />
        ))}
      </PanelFrameBody>
    </PanelFrame>
  );
}
