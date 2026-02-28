import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMiningTasks } from '../hooks';
import { miningApi } from '../api';

vi.mock('../api', () => ({
  miningApi: {
    listTasks: vi.fn(),
    cancelTask: vi.fn(),
    createTask: vi.fn(),
    getStreamUrl: vi.fn().mockReturnValue('http://localhost:2728/stream'),
  },
}));

const makeTask = (
  overrides: Partial<{ taskId: string; status: string }> = {},
) => ({
  taskId: overrides.taskId ?? 'mining_001',
  status: (overrides.status ?? 'RUNNING') as
    | 'RUNNING'
    | 'PENDING'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED',
  mode: 'factor' as const,
  config: {
    mode: 'factor' as const,
    maxLoops: 10,
    llmModel: 'deepseek',
    universe: 'csi300',
    dateRange: {
      trainStart: '2015-01-01',
      trainEnd: '2021-12-31',
      validStart: '2022-01-01',
      validEnd: '2023-12-31',
      testStart: '2024-01-01',
      testEnd: '2025-12-31',
    },
    dedupThreshold: 0.99,
  },
  progress: {
    currentLoop: 5,
    maxLoops: 10,
    factorsDiscovered: 12,
    factorsAccepted: 3,
    factorsRejected: 9,
    bestIc: 0.041,
    bestIr: 1.5,
    elapsedSeconds: 3600,
    estimatedRemainingSeconds: 3600,
    currentHypothesis: '',
    currentStep: '',
  },
  factors: [],
  createdAt: Date.now(),
});

describe('useMiningTasks', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('loads tasks on mount', async () => {
    vi.mocked(miningApi.listTasks).mockResolvedValue([makeTask()]);

    const { result } = renderHook(() => useMiningTasks());

    await waitFor(() => expect(result.current.tasks).toHaveLength(1));
    expect(result.current.tasks[0].taskId).toBe('mining_001');
    expect(result.current.loading).toBe(false);
  });

  it('polls every 5 seconds when tasks are running', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(miningApi.listTasks).mockResolvedValue([
      makeTask({ status: 'RUNNING' }),
    ]);

    renderHook(() => useMiningTasks());

    await waitFor(() => expect(miningApi.listTasks).toHaveBeenCalledTimes(1));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(miningApi.listTasks).toHaveBeenCalledTimes(2);
  });

  it('sets error when API call fails', async () => {
    vi.mocked(miningApi.listTasks).mockRejectedValue(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useMiningTasks());

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.message).toBe('Network error');
  });
});
