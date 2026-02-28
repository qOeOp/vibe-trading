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
          currentHypothesis?: string;
          currentStep?: string;
        };
        const msg = `Loop ${data.currentLoop}: ${data.currentHypothesis ?? ''} — ${data.currentStep ?? ''}`;
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
