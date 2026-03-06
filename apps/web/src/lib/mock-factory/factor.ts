/**
 * Mock Factor Factory — generates statistically realistic Factor objects.
 *
 * Usage:
 *   import { createMockFactor, createMockFactors } from '@/lib/mock-factory';
 *   const factor = createMockFactor({ ic: 0.05, category: '动能' });
 *   const factors = createMockFactors(50, 42);
 *
 * Statistical realism:
 *   - IC ∈ [0.01, 0.08], IR ∈ [0.3, 2.5], t-stat ≈ IR × √(T/12)
 *   - NAV curves with realistic drawdowns (Box-Muller + drift)
 *   - IC time series with mean reversion and autocorrelation
 *   - Quantile returns monotonic with factor direction
 *   - All time series seeded for reproducibility
 */

import type {
  Factor,
  BenchmarkConfig,
  FactorCategory,
  FactorLifecycleStatus,
  FactorDirection,
  FactorType,
  FactorSource,
  UniverseIC,
  StatusChangeRecord,
} from '@/features/library/types';
import {
  FACTOR_CATEGORIES,
  FACTOR_LIFECYCLE_STATUSES,
  UNIVERSE_POOLS,
} from '@/features/library/types';
import { computeICStats } from '@/features/library/utils/compute-ic-stats';
import {
  createRng,
  normalRandom,
  generateICTimeSeries,
  generateNAVCurve,
  clamp,
  pickRandom,
  round,
} from './distributions';
import {
  SHENWAN_L1_INDUSTRIES,
  MONTHS,
  UNIVERSE_MULTIPLIERS,
} from './constants';

// ─── Default Benchmark Config ───────────────────────────

const DEFAULT_BENCHMARK: BenchmarkConfig = {
  universe: '全A',
  icMethod: 'RankIC',
  winsorization: 'MAD',
  rebalanceDays: 5,
  quantiles: 5,
};

// ─── Internal Generators ────────────────────────────────

function generateQuantileReturns(
  rng: () => number,
  ic: number,
  direction: FactorDirection,
): [number, number, number, number, number] {
  const strength = Math.abs(ic) * 100;
  const base = (rng() - 0.5) * 2;
  const spreads = [-2.5, -1.2, 0, 1.2, 2.5];

  const returns = spreads.map((s) =>
    round(base + s * strength + rng() * 0.5, 2),
  ) as [number, number, number, number, number];

  return direction === 'negative'
    ? ([...returns].reverse() as typeof returns)
    : returns;
}

function generateICDecayProfile(rng: () => number, baseIC: number): number[] {
  const absIC = Math.abs(baseIC);
  const decayRate = 0.03 + rng() * 0.04;
  return Array.from({ length: 20 }, (_, lag) => {
    const decay = absIC * (1 - decayRate) ** (lag + 1);
    const noise = (rng() - 0.5) * absIC * 0.1;
    return round((decay + noise) * Math.sign(baseIC), 4);
  });
}

function computeICHalfLife(decayProfile: number[]): number {
  if (decayProfile.length === 0) return 20;
  const initial = Math.abs(decayProfile[0]);
  if (initial === 0) return 20;
  const halfTarget = initial * 0.5;
  for (let i = 0; i < decayProfile.length; i++) {
    if (Math.abs(decayProfile[i]) <= halfTarget) return i + 1;
  }
  return decayProfile.length;
}

function generateUniverseProfile(
  rng: () => number,
  baseIC: number,
  baseIR: number,
  category: FactorCategory,
): UniverseIC[] {
  const multipliers = UNIVERSE_MULTIPLIERS[category];
  return UNIVERSE_POOLS.map((pool) => {
    const m = multipliers[pool];
    return {
      universe: pool,
      ic: round(baseIC * m * (1 + (rng() - 0.5) * 0.3), 4),
      ir: round(baseIR * m * (1 + (rng() - 0.5) * 0.25), 2),
    };
  });
}

function generateQuantileCumulativeReturns(
  rng: () => number,
  quantileReturns: [number, number, number, number, number],
): [number[], number[], number[], number[], number[]] {
  const result: [number[], number[], number[], number[], number[]] = [
    [],
    [],
    [],
    [],
    [],
  ];
  for (let q = 0; q < 5; q++) {
    const dailyDrift = quantileReturns[q] / 100 / 252;
    const vol = Math.abs(dailyDrift) * 2.5 + 0.003;
    const curve: number[] = [1.0];
    for (let d = 1; d < 240; d++) {
      const dr = dailyDrift + (rng() - 0.5) * vol * 2;
      curve.push(round(curve[d - 1] * (1 + dr), 4));
    }
    result[q] = curve;
  }
  return result;
}

function generateICMonthlyHeatmap(
  rng: () => number,
  baseIC: number,
  status: FactorLifecycleStatus,
): Array<{ name: string; series: Array<{ name: string; value: number }> }> {
  const years = ['2023', '2024', '2025'];
  const isProbOrRetired = status === 'PROBATION' || status === 'RETIRED';

  return MONTHS.map((month) => ({
    name: month,
    series: years.map((year, yearIdx) => {
      const yearDecay = isProbOrRetired
        ? 1 - yearIdx * 0.25
        : 1 - yearIdx * 0.05;
      const noise = (rng() - 0.5) * Math.abs(baseIC) * 0.6;
      return { name: year, value: round(baseIC * yearDecay + noise, 4) };
    }),
  }));
}

function generateICByIndustry(
  rng: () => number,
  baseIC: number,
): Array<{ name: string; value: number }> {
  return SHENWAN_L1_INDUSTRIES.map((name) => {
    const multiplier = 0.5 + rng() * 1.0;
    const noise = (rng() - 0.5) * Math.abs(baseIC) * 0.3;
    return { name, value: round(baseIC * multiplier + noise, 4) };
  });
}

function generateRankAutoCorrelation(
  rng: () => number,
  baseIC: number,
): number[] {
  const icStrength = Math.min(Math.abs(baseIC) / 0.05, 1);
  const meanLevel = 0.4 + icStrength * 0.35;
  const data: number[] = [];
  let value = meanLevel + (rng() - 0.5) * 0.1;
  for (let i = 0; i < 240; i++) {
    value += (meanLevel - value) * 0.08 + (rng() - 0.5) * 0.04;
    data.push(round(clamp(value, 0.15, 0.98), 4));
  }
  return data;
}

function generateQuantileTurnover(
  rng: () => number,
  baseTurnover: number,
): { top: number[]; bottom: number[] } {
  const dailyBase = baseTurnover / 100 / 21;
  const top: number[] = [];
  const bottom: number[] = [];
  let topVal = dailyBase * (0.8 + rng() * 0.4);
  let botVal = dailyBase * (1.0 + rng() * 0.6);

  for (let i = 0; i < 240; i++) {
    topVal +=
      (dailyBase * 0.9 - topVal) * 0.05 + (rng() - 0.5) * dailyBase * 0.3;
    botVal +=
      (dailyBase * 1.2 - botVal) * 0.05 + (rng() - 0.5) * dailyBase * 0.3;
    top.push(round(Math.max(0.001, topVal), 4));
    bottom.push(round(Math.max(0.001, botVal), 4));
  }
  return { top, bottom };
}

function generateICHistogramBins(icTimeSeries: number[]): number[] {
  if (icTimeSeries.length === 0) return new Array(20).fill(0);
  const min = Math.min(...icTimeSeries);
  const max = Math.max(...icTimeSeries);
  const range = max - min || 0.001;
  const binWidth = range / 20;
  const bins = new Array(20).fill(0);
  for (const ic of icTimeSeries) {
    const idx = Math.min(19, Math.floor((ic - min) / binWidth));
    bins[idx]++;
  }
  return bins;
}

// ─── Public API ─────────────────────────────────────────

const SOURCES: FactorSource[] = [
  'manual',
  'mining_gplearn',
  'mining_pysr',
  'mining_llm',
];
const CREATORS = ['Vincent', 'Researcher_A', 'Mining_v2', 'LLM_Alpha'];
const SAMPLE_TAGS = [
  '经典',
  '中频',
  '高频',
  '低频',
  '基础',
  '核心',
  '实验性',
  '复合',
  '挖掘',
];
const SAMPLE_HYPOTHESES: Record<FactorCategory, string> = {
  动能: '捕捉中期动量效应，源于投资者反应不足和信息渐进扩散。',
  股息率: '高股息率反映稳定现金流和管理层信心，提供下行保护。',
  价值: '低估值股票具有安全边际，资产重估和均值回归带来超额收益。',
  成长: '持续增长的营收反映公司竞争优势，市场对成长持续性定价不足。',
  品质: '高盈利质量和稳定ROE的公司长期跑赢，源于市场对品质溢价的低估。',
  流动性: '低流动性股票承担更高流动性风险溢价，长期获得补偿性收益。',
  波动度: '低波动股票的风险调整后收益更高，源于彩票偏好和杠杆约束。',
  规模: '小市值股票承担更高特质风险，长期获得规模溢价补偿。',
  情绪: '市场情绪偏差导致定价偏离基本面，情绪反转时产生超额收益。',
};

/**
 * Create a single mock Factor with all 80+ fields populated.
 *
 * @param overrides - Partial Factor fields to override defaults
 * @param seed - PRNG seed for reproducibility (default: 42)
 */
export function createMockFactor(
  overrides: Partial<Factor> = {},
  seed = 42,
): Factor {
  const rng = createRng(seed);

  // ── Identity ──
  const category =
    overrides.category ?? pickRandom(rng, [...FACTOR_CATEGORIES]);
  const status =
    overrides.status ?? pickRandom(rng, [...FACTOR_LIFECYCLE_STATUSES]);
  const direction: FactorDirection =
    overrides.expectedDirection ?? (rng() > 0.8 ? 'negative' : 'positive');
  const source = overrides.source ?? pickRandom(rng, SOURCES);
  const id = overrides.id ?? `mock_${seed}`;

  // ── Core metrics (domain-calibrated) ──
  const ic =
    overrides.ic ??
    round((0.01 + rng() * 0.06) * (direction === 'negative' ? -1 : 1), 4);
  const absIC = Math.abs(ic);
  const ir =
    overrides.ir ?? round((ic / (absIC * 3 + 0.02)) * Math.sqrt(240 / 12), 2);
  const icTstat = overrides.icTstat ?? round(ir * Math.sqrt(240 / 12), 2);
  const turnover = overrides.turnover ?? round(10 + rng() * 50, 0);
  const capacity = overrides.capacity ?? round(30000 + rng() * 250000, 0);

  // ── Time series ──
  const icTimeSeries =
    overrides.icTimeSeries ??
    generateICTimeSeries(rng, 240, ic, absIC * 3 + 0.02, 0.3);
  const icTrend =
    overrides.icTrend ??
    generateICTimeSeries(rng, 30, ic, absIC * 3 + 0.02, 0.3);
  const icDecayProfile =
    overrides.icDecayProfile ?? generateICDecayProfile(rng, ic);
  const quantileReturns =
    overrides.quantileReturns ?? generateQuantileReturns(rng, ic, direction);
  const longShortReturn =
    overrides.longShortReturn ?? round(absIC * 300 + 3 + (rng() - 0.5) * 8, 2);

  // ── Derived statistics ──
  const icDistribution =
    overrides.icDistribution ?? computeICStats(icTimeSeries);
  const icHalfLife = overrides.icHalfLife ?? computeICHalfLife(icDecayProfile);

  // ── Robustness ──
  const icStrength = Math.min(absIC / 0.05, 1);
  const rankTestRetention =
    overrides.rankTestRetention ??
    round(clamp(0.4 + icStrength * 0.35 + (rng() - 0.5) * 0.3, 0.2, 0.95), 2);
  const binaryTestRetention =
    overrides.binaryTestRetention ??
    round(clamp(rankTestRetention * (0.65 + rng() * 0.3), 0.15, 0.9), 2);

  // ── V-Score (normal-ish) ──
  const vScore =
    overrides.vScore ?? round(clamp(normalRandom(rng, 0, 0.8), -2, 2), 2);

  // ── Win rate ──
  const positiveRatio =
    icDistribution.icPositiveCount /
    Math.max(
      1,
      icDistribution.icPositiveCount + icDistribution.icNegativeCount,
    );
  const winRate = overrides.winRate ?? round(positiveRatio * 100, 0);

  // ── Rolling IC ──
  const ic60d = overrides.ic60d ?? round(ic * (0.9 + rng() * 0.2), 4);
  const ic120d = overrides.ic120d ?? round(ic * (0.85 + rng() * 0.2), 4);

  const factor: Factor = {
    id,
    name: overrides.name ?? `Mock_${id}`,
    version: overrides.version ?? 'v1.0',
    category,
    factorType:
      overrides.factorType ??
      ((rng() > 0.75 ? 'composite' : 'leaf') as FactorType),
    expectedDirection: direction,
    source,
    status,
    ic,
    ir,
    icTstat,
    turnover,
    capacity,
    createdAt:
      overrides.createdAt ??
      `2024-${String(Math.floor(rng() * 12) + 1).padStart(2, '0')}-01`,
    createdBy: overrides.createdBy ?? pickRandom(rng, CREATORS),
    tags: overrides.tags ?? [
      pickRandom(rng, SAMPLE_TAGS),
      pickRandom(rng, SAMPLE_TAGS),
    ],
    icTrend,
    winRate,
    ic60d,
    ic120d,
    quantileReturns,
    icTimeSeries,
    benchmarkConfig: overrides.benchmarkConfig ?? DEFAULT_BENCHMARK,
    icDistribution,
    icDecayProfile,
    universeProfile:
      overrides.universeProfile ??
      generateUniverseProfile(rng, ic, ir, category),
    rankTestRetention,
    binaryTestRetention,
    vScore,
    icHalfLife,
    coverageRate: overrides.coverageRate ?? round(0.85 + rng() * 0.13, 2),
    longShortReturn,
    longShortEquityCurve:
      overrides.longShortEquityCurve ??
      generateNAVCurve(
        rng,
        240,
        longShortReturn / 100,
        Math.abs(longShortReturn / 100) * 3 + 0.002,
      ),
    longSideReturnRatio:
      overrides.longSideReturnRatio ?? round(0.45 + rng() * 0.35, 2),
    icHistogramBins:
      overrides.icHistogramBins ?? generateICHistogramBins(icTimeSeries),
    quantileCumulativeReturns:
      overrides.quantileCumulativeReturns ??
      generateQuantileCumulativeReturns(rng, quantileReturns),
    icMonthlyHeatmap:
      overrides.icMonthlyHeatmap ?? generateICMonthlyHeatmap(rng, ic, status),
    icByIndustry: overrides.icByIndustry ?? generateICByIndustry(rng, ic),
    rankAutoCorrelation:
      overrides.rankAutoCorrelation ?? generateRankAutoCorrelation(rng, ic),
    quantileTurnover:
      overrides.quantileTurnover ?? generateQuantileTurnover(rng, turnover),
    statusHistory: overrides.statusHistory ?? [],
    workspacePath: overrides.workspacePath ?? `factors/${id}/factor.py`,
    hypothesis: overrides.hypothesis ?? SAMPLE_HYPOTHESES[category],
    ...(overrides.pendingProposal
      ? { pendingProposal: overrides.pendingProposal }
      : {}),
    ...(overrides.codeFile ? { codeFile: overrides.codeFile } : {}),
    ...(overrides.taskId ? { taskId: overrides.taskId } : {}),
    ...(overrides.annualReturn !== undefined
      ? { annualReturn: overrides.annualReturn }
      : {}),
    ...(overrides.sharpeRatio !== undefined
      ? { sharpeRatio: overrides.sharpeRatio }
      : {}),
    ...(overrides.maxDrawdown !== undefined
      ? { maxDrawdown: overrides.maxDrawdown }
      : {}),
    ...(overrides.lookback !== undefined
      ? { lookback: overrides.lookback }
      : {}),
  };

  return factor;
}

/**
 * Create N mock factors with different seeds for variety.
 *
 * @param count - Number of factors to generate
 * @param baseSeed - Base seed (each factor gets baseSeed + index)
 */
export function createMockFactors(count: number, baseSeed = 42): Factor[] {
  return Array.from({ length: count }, (_, i) =>
    createMockFactor({}, baseSeed + i * 7919),
  );
}

/**
 * Create a mock StatusChangeRecord.
 */
export function createMockStatusChange(
  overrides: Partial<StatusChangeRecord> = {},
  seed = 42,
): StatusChangeRecord {
  const rng = createRng(seed);
  const statuses = [...FACTOR_LIFECYCLE_STATUSES];
  const fromIdx = Math.floor(rng() * (statuses.length - 1));
  return {
    timestamp: overrides.timestamp ?? '2025-06-15T10:30:00Z',
    operator: overrides.operator ?? pickRandom(rng, CREATORS),
    reason: overrides.reason ?? '样本外 IC 连续 60 期 > 0.02',
    fromStatus: overrides.fromStatus ?? statuses[fromIdx],
    toStatus: overrides.toStatus ?? statuses[fromIdx + 1],
  };
}
