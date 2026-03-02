'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { miningApi } from './api';
import type { MiningTask, LogEntry } from './types';

const POLL_INTERVAL_MS = 5000;

/** Poll task list, auto-refresh while any task is RUNNING. */
export function useMiningTasks() {
  const [tasks, setTasks] = useState<MiningTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const result = await miningApi.listTasks();
      setTasks(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Poll while any task is running or pending
  useEffect(() => {
    const hasActive = tasks.some(
      (t) => t.status === 'RUNNING' || t.status === 'PENDING',
    );
    if (!hasActive) return;

    const id = setInterval(fetchTasks, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [tasks, fetchTasks]);

  const cancelTask = useCallback(
    async (taskId: string) => {
      await miningApi.cancelTask(taskId);
      await fetchTasks();
    },
    [fetchTasks],
  );

  return { tasks, loading, error, refresh: fetchTasks, cancelTask };
}

// Step name → Chinese label for log display
const STEP_LABELS: Record<string, string> = {
  initializing: '初始化中',
  proposing: '生成假设中',
  coding: '代码生成中',
  evaluating: 'Qlib 回测评估中',
  running: '执行中',
  feedback: '反馈分析中',
  completed: '已完成',
};

/** Subscribe to SSE stream for a running task, accumulate log entries. */
export function useMiningStream(taskId: string | null) {
  const [log, setLog] = useState<LogEntry[]>([]);
  const esRef = useRef<EventSource | null>(null);

  const addEntry = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    setLog((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
        ...entry,
      },
    ]);
  }, []);

  useEffect(() => {
    if (!taskId) return;
    if (typeof window === 'undefined') return;

    // Close any existing connection
    esRef.current?.close();

    const url = miningApi.getStreamUrl(taskId);
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener('iteration', (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data) as {
          currentLoop?: number;
          maxLoops?: number;
          currentHypothesis?: string;
          currentStep?: string;
          factorsDiscovered?: number;
          factorsAccepted?: number;
          bestIc?: number;
        };
        const step = data.currentStep ?? '';
        const stepLabel = STEP_LABELS[step] ?? step;
        const loop = data.currentLoop ?? 0;
        const maxLoops = data.maxLoops ?? 0;

        // Generate a descriptive message based on step type
        let msg: string;
        if (step === 'proposing' || step === 'initializing') {
          msg = `[${loop}/${maxLoops}] ${stepLabel}`;
          if (data.currentHypothesis) {
            msg += ` — ${data.currentHypothesis}`;
          }
        } else if (step === 'coding') {
          msg = `[${loop}/${maxLoops}] ${stepLabel}`;
        } else if (step === 'evaluating' || step === 'running') {
          msg = `[${loop}/${maxLoops}] ${stepLabel}`;
        } else if (step === 'feedback') {
          const discovered = data.factorsDiscovered ?? 0;
          const accepted = data.factorsAccepted ?? 0;
          const bestIc = data.bestIc ?? 0;
          msg = `[${loop}/${maxLoops}] ${stepLabel} — 已发现 ${discovered} 个因子，已接受 ${accepted} 个，最佳 IC ${bestIc.toFixed(4)}`;
        } else {
          msg = `[${loop}/${maxLoops}] ${stepLabel}`;
        }

        addEntry({ type: 'iteration', message: msg });
      } catch {
        // ignore parse errors
      }
    });

    es.addEventListener('factor_found', (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data) as {
          name: string;
          metrics?: { ic?: number };
          accepted: boolean;
        };
        const type = data.accepted ? 'factor_accepted' : 'factor_rejected';
        const ic = data.metrics?.ic ?? 0;
        const status = data.accepted ? '✓ 已接受' : '✗ 已拒绝';
        const msg = `${data.name}  IC=${ic.toFixed(4)}  ${status}`;
        addEntry({ type, message: msg });
      } catch {
        // ignore parse errors
      }
    });

    es.addEventListener('complete', (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data) as {
          taskId: string;
          status: string;
        };
        addEntry({
          type: 'complete',
          message: `挖掘完成 (${data.status})`,
        });
      } catch {
        // ignore parse errors
      }
      es.close();
    });

    es.onerror = () => {
      addEntry({ type: 'error', message: '连接中断，等待重连...' });
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [taskId, addEntry]);

  const clearLog = useCallback(() => setLog([]), []);

  return { log, clearLog };
}
