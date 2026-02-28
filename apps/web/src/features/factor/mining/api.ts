import type { CreateTaskConfig, MiningTask, DiscoveredFactor } from './types';
import type { Factor } from '@/features/library/types';
import { VIBE_COMPUTE_URL as BASE_URL } from '@/lib/env';

function toCamelTask(raw: Record<string, unknown>): MiningTask {
  const config = (raw.config as Record<string, unknown>) ?? {};
  const progress = (raw.progress as Record<string, unknown>) ?? {};
  const factors = ((raw.factors as unknown[]) ?? []) as Array<
    Record<string, unknown>
  >;
  const dr = (config.date_range as Record<string, unknown>) ?? {};

  return {
    taskId: raw.task_id as string,
    status: raw.status as MiningTask['status'],
    mode: (config.mode as MiningTask['mode']) ?? 'factor',
    config: {
      mode: (config.mode as MiningTask['mode']) ?? 'factor',
      maxLoops: (config.max_loops as number) ?? 10,
      llmModel: (config.llm_model as string) ?? '',
      universe: (config.universe as string) ?? 'csi300',
      dateRange: {
        trainStart: (dr.train_start as string) ?? '',
        trainEnd: (dr.train_end as string) ?? '',
        validStart: (dr.valid_start as string) ?? '',
        validEnd: (dr.valid_end as string) ?? '',
        testStart: (dr.test_start as string) ?? '',
        testEnd: (dr.test_end as string) ?? '',
      },
      dedupThreshold: (config.dedup_threshold as number) ?? 0.99,
      seedFactors: (config.seed_factors as string[]) ?? [],
      reportFiles: (config.report_files as string[]) ?? [],
    },
    progress: {
      currentLoop: (progress.current_loop as number) ?? 0,
      maxLoops: (progress.max_loops as number) ?? 10,
      factorsDiscovered: (progress.factors_discovered as number) ?? 0,
      factorsAccepted: (progress.factors_accepted as number) ?? 0,
      factorsRejected: (progress.factors_rejected as number) ?? 0,
      bestIc: (progress.best_ic as number) ?? 0,
      bestIr: (progress.best_ir as number) ?? 0,
      elapsedSeconds: (progress.elapsed_seconds as number) ?? 0,
      estimatedRemainingSeconds:
        (progress.estimated_remaining_seconds as number) ?? 0,
      currentHypothesis: (progress.current_hypothesis as string) ?? '',
      currentStep: (progress.current_step as string) ?? '',
    },
    factors: factors.map((f) => {
      const m = (f.metrics as Record<string, unknown>) ?? {};
      return {
        name: f.name as string,
        code: f.code as string,
        metrics: {
          ic: (m.ic as number) ?? 0,
          icir: (m.icir as number) ?? 0,
          rankIc: (m.rank_ic as number) ?? 0,
          rankIcir: (m.rank_icir as number) ?? 0,
          turnover: (m.turnover as number) ?? 0,
          arr: (m.arr as number) ?? 0,
          sharpe: (m.sharpe as number) ?? 0,
          maxDrawdown: (m.max_drawdown as number) ?? 0,
        },
        generation: (f.generation as number) ?? 0,
        hypothesis: (f.hypothesis as string) ?? '',
        description: (f.description as string) ?? '',
        dedupScore: (f.dedup_score as number) ?? 0,
        accepted: (f.accepted as boolean) ?? false,
      } satisfies DiscoveredFactor;
    }),
    createdAt: (raw.created_at as number) ?? 0,
    startedAt: raw.started_at as number | undefined,
    completedAt: raw.completed_at as number | undefined,
    errorMessage: raw.error_message as string | undefined,
  };
}

export const miningApi = {
  async createTask(config: CreateTaskConfig): Promise<MiningTask> {
    const body = {
      mode: config.mode,
      config: {
        max_loops: config.maxLoops,
        llm_model: config.llmModel,
        universe: config.universe,
        date_range: {
          train_start: config.dateRange.trainStart,
          train_end: config.dateRange.trainEnd,
          valid_start: config.dateRange.validStart,
          valid_end: config.dateRange.validEnd,
          test_start: config.dateRange.testStart,
          test_end: config.dateRange.testEnd,
        },
        dedup_threshold: config.dedupThreshold,
        seed_factors: config.seedFactors ?? [],
        report_files: config.reportFiles ?? [],
      },
    };

    const res = await fetch(`${BASE_URL}/api/mining/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`createTask failed: ${res.status} ${body}`.trim());
    }
    const raw = (await res.json()) as Record<string, unknown>;
    return toCamelTask(raw);
  },

  async listTasks(): Promise<MiningTask[]> {
    const res = await fetch(`${BASE_URL}/api/mining/tasks`);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`listTasks failed: ${res.status} ${body}`.trim());
    }
    const data = (await res.json()) as { tasks?: unknown[] };
    return ((data.tasks ?? []) as Array<Record<string, unknown>>).map(
      toCamelTask,
    );
  },

  async getTask(taskId: string): Promise<MiningTask> {
    const res = await fetch(`${BASE_URL}/api/mining/tasks/${taskId}`);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`getTask failed: ${res.status} ${body}`.trim());
    }
    const raw = (await res.json()) as Record<string, unknown>;
    return toCamelTask(raw);
  },

  async cancelTask(taskId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/mining/tasks/${taskId}/cancel`, {
      method: 'POST',
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`cancelTask failed: ${res.status} ${body}`.trim());
    }
  },

  getStreamUrl(taskId: string): string {
    return `${BASE_URL}/api/mining/tasks/${taskId}/stream`;
  },
};

// ── pushFactorToLibrary ────────────────────────────────────────────

export interface PushFactorRequest {
  taskId: string;
  factorIndex: number;
  name: string;
  code: string;
  hypothesis: string;
  metrics: {
    ic: number;
    icir: number;
    arr: number;
    sharpe: number;
    maxDrawdown: number;
    turnover: number;
  };
}

export async function pushFactorToLibrary(
  req: PushFactorRequest,
): Promise<Factor> {
  const resp = await fetch(`${BASE_URL}/api/library/factors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!resp.ok) {
    const err = (await resp.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `Push failed: ${resp.status}`);
  }
  return resp.json() as Promise<Factor>;
}
