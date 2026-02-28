'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimateIn } from '@/components/animation';
import { cn } from '@/lib/utils';
import { useMiningTasks, useMiningStream } from '../hooks';
import { miningApi } from '../api';
import type { CreateTaskConfig, DiscoveredFactor } from '../types';
import { TaskList } from './task-list';
import { TaskDetailPanel } from './task-detail-panel';
import { NewTaskDialog } from './new-task-dialog';

export function MiningPage({ className }: { className?: string }) {
  const { tasks, loading, error, refresh, cancelTask } = useMiningTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);

  // Auto-select first task when list loads
  useEffect(() => {
    if (!selectedTaskId && tasks.length > 0) {
      setSelectedTaskId(tasks[0].taskId);
    }
  }, [tasks, selectedTaskId]);

  const selectedTask = tasks.find((t) => t.taskId === selectedTaskId) ?? null;

  // SSE stream for the selected task (only when running)
  const { log: streamLog } = useMiningStream(
    selectedTask?.status === 'RUNNING' ? selectedTaskId : null,
  );

  const handleCreateTask = useCallback(
    async (config: CreateTaskConfig) => {
      const task = await miningApi.createTask(config);
      await refresh();
      setSelectedTaskId(task.taskId);
    },
    [refresh],
  );

  const handleViewCode = useCallback((factor: DiscoveredFactor) => {
    // Phase 3: open in Lab tab. For now, show code in a simple alert.
    alert(`因子代码:\n\n${factor.code}`);
  }, []);

  return (
    <div
      data-slot="mining-page"
      className={cn('flex-1 flex gap-4 p-4 overflow-hidden', className)}
    >
      {/* Left: Task list */}
      <AnimateIn from="left" delay={0} className="w-[300px] shrink-0 h-full">
        <TaskList
          tasks={tasks}
          selectedTaskId={selectedTaskId}
          loading={loading}
          onSelectTask={setSelectedTaskId}
          onNewTask={() => setShowNewTask(true)}
          onRefresh={refresh}
          className="h-full"
        />
      </AnimateIn>

      {/* Right: Detail panel or empty state */}
      <AnimateIn from="right" delay={1} className="flex-1 min-w-0 h-full">
        {error && (
          <div className="flex flex-col items-center justify-center bg-white border border-mine-border rounded-xl h-full">
            <div className="text-sm text-market-up-medium mb-1">
              无法连接到 Vibe Compute
            </div>
            <div className="text-xs text-mine-muted">{error.message}</div>
          </div>
        )}

        {!error && !selectedTask && !loading && (
          <div className="h-full flex flex-col items-center justify-center bg-white border border-mine-border rounded-xl shadow-sm">
            <div className="text-sm text-mine-muted mb-4">
              选择一个任务，或创建新任务
            </div>
            <button
              onClick={() => setShowNewTask(true)}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-mine-nav-active text-white
                         hover:bg-mine-nav-active/90 transition-colors"
            >
              新建挖掘任务
            </button>
          </div>
        )}

        {!error && selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            logEntries={streamLog}
            onViewCode={handleViewCode}
            onCancel={cancelTask}
            className="h-full"
          />
        )}
      </AnimateIn>

      {/* New task dialog */}
      {showNewTask && (
        <NewTaskDialog
          open={showNewTask}
          onClose={() => setShowNewTask(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
}
