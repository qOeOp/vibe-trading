import { describe, it, expect, vi, beforeEach } from 'vitest';
import { miningApi } from '../api';

const BASE = 'http://localhost:2728';

describe('miningApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('createTask sends POST to /api/mining/tasks', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          task_id: 'mining_001',
          status: 'PENDING',
          config: {
            mode: 'factor',
            max_loops: 5,
            llm_model: 'deepseek/deepseek-chat',
            universe: 'csi300',
            date_range: {
              train_start: '2015-01-01',
              train_end: '2021-12-31',
              valid_start: '2022-01-01',
              valid_end: '2023-12-31',
              test_start: '2024-01-01',
              test_end: '2025-12-31',
            },
            dedup_threshold: 0.99,
            seed_factors: [],
            report_files: [],
          },
          progress: {
            current_loop: 0,
            max_loops: 5,
            factors_discovered: 0,
            factors_accepted: 0,
            factors_rejected: 0,
            best_ic: 0,
            best_ir: 0,
            elapsed_seconds: 0,
            estimated_remaining_seconds: 0,
            current_hypothesis: '',
            current_step: '',
          },
          factors: [],
          created_at: 1000,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const config = {
      mode: 'factor' as const,
      maxLoops: 5,
      llmModel: 'deepseek/deepseek-chat',
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
    };

    const result = await miningApi.createTask(config);
    expect(result.taskId).toBe('mining_001');
    expect(result.status).toBe('PENDING');

    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${BASE}/api/mining/tasks`);
    expect(options.method).toBe('POST');
  });

  it('listTasks sends GET to /api/mining/tasks and returns array', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ tasks: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await miningApi.listTasks();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);

    const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${BASE}/api/mining/tasks`);
  });

  it('cancelTask sends POST to /api/mining/tasks/{id}/cancel', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );

    await miningApi.cancelTask('mining_001');

    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${BASE}/api/mining/tasks/mining_001/cancel`);
    expect(options.method).toBe('POST');
  });

  it('getStreamUrl returns correct SSE URL', () => {
    const url = miningApi.getStreamUrl('mining_001');
    expect(url).toBe(`${BASE}/api/mining/tasks/mining_001/stream`);
  });
});
