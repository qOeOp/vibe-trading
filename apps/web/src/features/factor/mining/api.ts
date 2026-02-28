import type { CreateTaskConfig, MiningTask, DiscoveredFactor } from './types';
import type { Factor } from '@/features/library/types';
import { VIBE_COMPUTE_URL as BASE_URL } from '@/lib/env';

function toCamelTask(raw: Record<string, unknown>): MiningTask {
  const config = (raw.config as Record<string, unknown>) ?? {};
  const progress = (raw.progress as Record<string, unknown>) ?? {};
  const factors = ((raw.factors as unknown[]) ?? []) as Array<
    Record<string, unknown>
  >;
  const dr = (config.dateRange as Record<string, unknown>) ?? {};

  return {
    taskId: raw.taskId as string,
    status: raw.status as MiningTask['status'],
    mode: (config.mode as MiningTask['mode']) ?? 'factor',
    config: {
      mode: (config.mode as MiningTask['mode']) ?? 'factor',
      maxLoops: (config.maxLoops as number) ?? 10,
      llmModel: (config.llmModel as string) ?? '',
      universe: (config.universe as string) ?? 'csi300',
      dateRange: {
        trainStart: (dr.trainStart as string) ?? '',
        trainEnd: (dr.trainEnd as string) ?? '',
        validStart: (dr.validStart as string) ?? '',
        validEnd: (dr.validEnd as string) ?? '',
        testStart: (dr.testStart as string) ?? '',
        testEnd: (dr.testEnd as string) ?? '',
      },
      dedupThreshold: (config.dedupThreshold as number) ?? 0.99,
      seedFactors: (config.seedFactors as string[]) ?? [],
      reportFiles: (config.reportFiles as string[]) ?? [],
    },
    progress: {
      currentLoop: (progress.currentLoop as number) ?? 0,
      maxLoops: (progress.maxLoops as number) ?? 10,
      factorsDiscovered: (progress.factorsDiscovered as number) ?? 0,
      factorsAccepted: (progress.factorsAccepted as number) ?? 0,
      factorsRejected: (progress.factorsRejected as number) ?? 0,
      bestIc: (progress.bestIc as number) ?? 0,
      bestIr: (progress.bestIr as number) ?? 0,
      elapsedSeconds: (progress.elapsedSeconds as number) ?? 0,
      estimatedRemainingSeconds:
        (progress.estimatedRemainingSeconds as number) ?? 0,
      currentHypothesis: (progress.currentHypothesis as string) ?? '',
      currentStep: (progress.currentStep as string) ?? '',
    },
    factors: factors.map((f) => {
      const m = (f.metrics as Record<string, unknown>) ?? {};
      return {
        name: f.name as string,
        code: f.code as string,
        metrics: {
          ic: (m.ic as number) ?? 0,
          icir: (m.icir as number) ?? 0,
          rankIc: (m.rankIc as number) ?? 0,
          rankIcir: (m.rankIcir as number) ?? 0,
          turnover: (m.turnover as number) ?? 0,
          arr: (m.arr as number) ?? 0,
          sharpe: (m.sharpe as number) ?? 0,
          maxDrawdown: (m.maxDrawdown as number) ?? 0,
        },
        generation: (f.generation as number) ?? 0,
        hypothesis: (f.hypothesis as string) ?? '',
        description: (f.description as string) ?? '',
        dedupScore: (f.dedupScore as number) ?? 0,
        accepted: (f.accepted as boolean) ?? false,
      } satisfies DiscoveredFactor;
    }),
    createdAt: (raw.createdAt as number) ?? 0,
    startedAt: raw.startedAt as number | undefined,
    completedAt: raw.completedAt as number | undefined,
    errorMessage: raw.errorMessage as string | undefined,
  };
}

export const miningApi = {
  async createTask(config: CreateTaskConfig): Promise<MiningTask> {
    const body = {
      mode: config.mode,
      config: {
        maxLoops: config.maxLoops,
        llmModel: config.llmModel,
        universe: config.universe,
        dateRange: {
          trainStart: config.dateRange.trainStart,
          trainEnd: config.dateRange.trainEnd,
          validStart: config.dateRange.validStart,
          validEnd: config.dateRange.validEnd,
          testStart: config.dateRange.testStart,
          testEnd: config.dateRange.testEnd,
        },
        dedupThreshold: config.dedupThreshold,
        seedFactors: config.seedFactors ?? [],
        reportFiles: config.reportFiles ?? [],
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
