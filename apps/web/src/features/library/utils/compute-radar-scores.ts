/**
 * Factor Quality Radar — 归一化计算
 *
 * 将 Factor 原始指标转换为 5 维 0-100 雷达分数。
 * 所有分数均从现有 Factor 字段派生，不需要额外数据。
 *
 * 五维:
 *   1. 收益力 (Profitability) — combined |IC| + |IR|
 *   2. 稳定性 (Stability) — win rate + IC consistency
 *   3. 效率 (Efficiency) — IC per unit turnover
 *   4. 容量 (Capacity) — log-scaled
 *   5. 鲜度 (Freshness) — inverse of crowding (V-Score based)
 */

import type { Factor } from "../types";

// ─── Types ───────────────────────────────────────────────

export interface FactorRadarScores {
  /** 收益力: combined |IC| + |IR| */
  profitability: number;
  /** 稳定性: win rate + IC consistency */
  stability: number;
  /** 效率: IC per unit turnover */
  efficiency: number;
  /** 容量: log-scaled capacity */
  capacity: number;
  /** 鲜度: inverse of crowding (V-Score based) */
  freshness: number;
}

/** Radar dimension labels (Chinese) — ordered to match FactorRadarScores */
export const RADAR_LABELS = [
  "收益力",
  "稳定性",
  "效率",
  "容量",
  "鲜度",
] as const;

// ─── Helpers ─────────────────────────────────────────────

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

// ─── Main computation ────────────────────────────────────

export function computeRadarScores(factor: Factor): FactorRadarScores {
  // 1. Profitability — 60% |IC|/0.07 + 40% |IR|/2.5
  const icScore = (Math.abs(factor.ic) / 0.07) * 100;
  const irScore = (Math.abs(factor.ir) / 2.5) * 100;
  const profitability = clamp(icScore * 0.6 + irScore * 0.4);

  // 2. Stability — 60% winRate/70 + 40% IC retention (|ic120d|/max(|ic|,0.001))
  const winScore = (factor.winRate / 70) * 100;
  const retentionRatio =
    Math.abs(factor.ic120d) / Math.max(Math.abs(factor.ic), 0.001);
  const retentionScore = retentionRatio * 100;
  const stability = clamp(winScore * 0.6 + retentionScore * 0.4);

  // 3. Efficiency — |IC| / max(turnover, 1) × 1000, ceiling 5.0
  const rawEff =
    (Math.abs(factor.ic) / Math.max(factor.turnover, 1)) * 1000;
  const efficiency = clamp((rawEff / 5.0) * 100);

  // 4. Capacity — log10(capacity) / log10(500000)
  const logCap = factor.capacity > 0 ? Math.log10(factor.capacity) : 0;
  const capacity = clamp((logCap / Math.log10(500_000)) * 100);

  // 5. Freshness — V-Score < -1 is "undervalued" (fresh), > 1 is "crowded" (stale)
  // Map [-2, 2] → [100, 0]: lower V-Score = fresher
  const freshness = clamp(((2 - factor.vScore) / 4) * 100);

  return { profitability, stability, efficiency, capacity, freshness };
}

/** Convert FactorRadarScores to ordered values array matching RADAR_LABELS */
export function radarScoresToValues(scores: FactorRadarScores): number[] {
  return [
    scores.profitability,
    scores.stability,
    scores.efficiency,
    scores.capacity,
    scores.freshness,
  ];
}
