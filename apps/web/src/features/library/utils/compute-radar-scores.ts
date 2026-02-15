/**
 * Factor Quality Radar — 归一化计算
 *
 * 将 Factor 原始指标转换为 7 维 0-100 雷达分数。
 * 所有分数均从现有 Factor 字段派生，不需要额外数据。
 *
 * 七维:
 *   1. 预测力 (Predictive Power) — |IC|
 *   2. 稳定性 (Stability) — |IR|
 *   3. 衰减抗性 (Decay Resistance) — IC 长期保持度
 *   4. 单调性 (Monotonicity) — 分位收益 Spearman ρ
 *   5. 换手效率 (Turnover Efficiency) — IC / turnover
 *   6. 容量 (Capacity) — log-scaled
 *   7. 鲁棒性 (Robustness) — Rank/Binary Test 平均保留率
 */

import type { Factor } from "../types";

// ─── Types ───────────────────────────────────────────────

export interface FactorRadarScores {
  /** 预测力: based on |IC| magnitude */
  predictivePower: number;
  /** 稳定性: based on |IR| */
  stability: number;
  /** 衰减抗性: based on IC retention ratio (ic120d / ic) */
  decayResistance: number;
  /** 收益单调性: Spearman ρ of quantile returns */
  monotonicity: number;
  /** 换手效率: IC per unit turnover */
  turnoverEfficiency: number;
  /** 容量: log-scaled capacity */
  capacity: number;
  /** 鲁棒性: based on Rank/Binary Test retention average */
  robustness: number;
}

/** Radar dimension labels (Chinese) — ordered to match FactorRadarScores */
export const RADAR_LABELS = [
  "预测力",
  "稳定性",
  "衰减抗性",
  "单调性",
  "换手效率",
  "容量",
  "鲁棒性",
] as const;

// ─── Helpers ─────────────────────────────────────────────

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Spearman rank correlation between two arrays of equal length.
 * Returns value in [-1, 1].
 */
function spearmanCorrelation(a: number[], b: number[]): number {
  const n = a.length;
  if (n < 2) return 0;

  const rankOf = (arr: number[]): number[] => {
    const sorted = arr
      .map((v, i) => ({ v, i }))
      .sort((x, y) => x.v - y.v);
    const ranks = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      ranks[sorted[i].i] = i + 1;
    }
    return ranks;
  };

  const ra = rankOf(a);
  const rb = rankOf(b);

  let dSquaredSum = 0;
  for (let i = 0; i < n; i++) {
    const d = ra[i] - rb[i];
    dSquaredSum += d * d;
  }

  return 1 - (6 * dSquaredSum) / (n * (n * n - 1));
}

// ─── Normalization constants ─────────────────────────────
// Calibrated against quant-domain.md thresholds and A-stock factor ranges

/** A-stock single factor IC practical ceiling */
const IC_CEILING = 0.07;

/** IR ceiling (mock data tops ~2.3, quant-domain: >1.0 = excellent) */
const IR_CEILING = 2.5;

/** Perfect IC retention: ic120d/ic = 1.0 means zero decay */
const RETENTION_CEILING = 1.0;

/**
 * Turnover efficiency ceiling.
 * IC=0.05, turnover=10% → 0.05/10*1000 = 5.0 → score 100
 */
const EFFICIENCY_CEILING = 5.0;

/** Capacity ceiling in 万元 (500,000万 = 50亿) */
const CAPACITY_CEILING = 500_000;

// ─── Main computation ────────────────────────────────────

export function computeRadarScores(factor: Factor): FactorRadarScores {
  // 1. Predictive Power — |IC| / 0.07 × 100
  const predictivePower = clamp(
    (Math.abs(factor.ic) / IC_CEILING) * 100,
  );

  // 2. Stability — |IR| / 2.5 × 100
  const stability = clamp(
    (Math.abs(factor.ir) / IR_CEILING) * 100,
  );

  // 3. Decay Resistance — |ic120d| / max(|ic|, 0.001)
  const icAbs = Math.max(Math.abs(factor.ic), 0.001);
  const retentionRatio = Math.abs(factor.ic120d) / icAbs;
  const decayResistance = clamp(
    (retentionRatio / RETENTION_CEILING) * 100,
  );

  // 4. Monotonicity — Spearman ρ of [1,2,3,4,5] vs quantile returns
  //    If expectedDirection is "negative", reverse expected order
  const idealRanks = [1, 2, 3, 4, 5];
  const returns = [...factor.quantileReturns];
  const rho = spearmanCorrelation(idealRanks, returns);
  const directionAdjusted =
    factor.expectedDirection === "positive" ? rho : -rho;
  // Map [-1, 1] → [0, 100]
  const monotonicity = clamp(((directionAdjusted + 1) / 2) * 100);

  // 5. Turnover Efficiency — |IC| / max(turnover, 1) × 1000
  const rawEfficiency =
    (Math.abs(factor.ic) / Math.max(factor.turnover, 1)) * 1000;
  const turnoverEfficiency = clamp(
    (rawEfficiency / EFFICIENCY_CEILING) * 100,
  );

  // 6. Capacity — log10(capacity) / log10(500000) × 100
  const logCap = factor.capacity > 0 ? Math.log10(factor.capacity) : 0;
  const logCeiling = Math.log10(CAPACITY_CEILING);
  const capacity = clamp((logCap / logCeiling) * 100);

  // 7. Robustness — average of Rank Test and Binary Test retention × 100
  const robustness = clamp(
    ((factor.rankTestRetention + factor.binaryTestRetention) / 2) * 100,
  );

  return {
    predictivePower,
    stability,
    decayResistance,
    monotonicity,
    turnoverEfficiency,
    capacity,
    robustness,
  };
}

/** Convert FactorRadarScores to ordered values array matching RADAR_LABELS */
export function radarScoresToValues(scores: FactorRadarScores): number[] {
  return [
    scores.predictivePower,
    scores.stability,
    scores.decayResistance,
    scores.monotonicity,
    scores.turnoverEfficiency,
    scores.capacity,
    scores.robustness,
  ];
}
