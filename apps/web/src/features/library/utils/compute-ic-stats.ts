/**
 * IC Distribution Statistics — 从 IC 日值时序计算完整统计指标
 *
 * 对标米筐 (RiceQuant) IC 统计表:
 * IC均值/标准差/正负次数/显著比例/P值/偏度/峰度
 */

import type { ICDistributionStats } from "../types";

// ─── Constants ──────────────────────────────────────────

/** 日频 IC 显著性阈值: |IC| > 0.02 视为单日显著 (行业惯例) */
const IC_SIGNIFICANCE_THRESHOLD = 0.02;

// ─── Standard Normal CDF Approximation ──────────────────

/**
 * Abramowitz & Stegun 标准正态 CDF 近似 (公式 26.2.17)
 * 精度: |误差| < 7.5e-8, 对 n>30 的 t 分布足够准确
 */
function normalCDF(x: number): number {
  if (x < -8) return 0;
  if (x > 8) return 1;

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1 / (1 + p * absX);
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-0.5 * absX * absX);

  return 0.5 * (1 + sign * y);
}

// ─── Public API ─────────────────────────────────────────

/**
 * 从 IC 日值时序计算完整分布统计量
 *
 * @param icSeries - IC 日值数组 (通常 240 个点)
 * @returns 10 项 IC 分布统计
 */
export function computeICStats(icSeries: number[]): ICDistributionStats {
  const n = icSeries.length;

  if (n === 0) {
    return {
      icMean: 0,
      icStd: 0,
      icPositiveCount: 0,
      icNegativeCount: 0,
      icSignificantRatio: 0,
      icPositiveSignificantRatio: 0,
      icNegativeSignificantRatio: 0,
      icPValue: 1,
      icSkewness: 0,
      icKurtosis: 0,
    };
  }

  // ── 均值 ──
  const sum = icSeries.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // ── 标准差 (Bessel 校正, n-1) ──
  const sumSqDev = icSeries.reduce((a, v) => a + (v - mean) ** 2, 0);
  const variance = n > 1 ? sumSqDev / (n - 1) : 0;
  const std = Math.sqrt(variance);

  // ── 正负计数 ──
  let positiveCount = 0;
  let negativeCount = 0;
  let significantCount = 0;
  let positiveSignificantCount = 0;
  let negativeSignificantCount = 0;

  for (const ic of icSeries) {
    if (ic > 0) positiveCount++;
    else if (ic < 0) negativeCount++;

    const absIC = Math.abs(ic);
    if (absIC > IC_SIGNIFICANCE_THRESHOLD) {
      significantCount++;
      if (ic > 0) positiveSignificantCount++;
      else if (ic < 0) negativeSignificantCount++;
    }
  }

  // ── p 值: t = mean / (std / √n), p = 2 × (1 - Φ(|t|)) ──
  const tStat = std > 0 ? mean / (std / Math.sqrt(n)) : 0;
  const pValue = 2 * (1 - normalCDF(Math.abs(tStat)));

  // ── 偏度 (三阶标准化矩) ──
  let skewness = 0;
  if (std > 0 && n >= 3) {
    const sumCube = icSeries.reduce((a, v) => a + ((v - mean) / std) ** 3, 0);
    skewness = (n / ((n - 1) * (n - 2))) * sumCube;
  }

  // ── 超额峰度 (四阶标准化矩 - 3, 正态=0) ──
  let kurtosis = 0;
  if (std > 0 && n >= 4) {
    const sumQuart = icSeries.reduce(
      (a, v) => a + ((v - mean) / std) ** 4,
      0,
    );
    const rawKurt =
      ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sumQuart;
    const correction = (3 * (n - 1) ** 2) / ((n - 2) * (n - 3));
    kurtosis = rawKurt - correction;
  }

  return {
    icMean: round6(mean),
    icStd: round6(std),
    icPositiveCount: positiveCount,
    icNegativeCount: negativeCount,
    icSignificantRatio: round4(significantCount / n),
    icPositiveSignificantRatio: round4(positiveSignificantCount / n),
    icNegativeSignificantRatio: round4(negativeSignificantCount / n),
    icPValue: round6(pValue),
    icSkewness: round4(skewness),
    icKurtosis: round4(kurtosis),
  };
}

/**
 * 滑动窗口均值 (用于 IC 时序图的 60 日 MA 叠加)
 *
 * @param data - 原始数据数组
 * @param window - 窗口大小
 * @returns 与 data 等长的数组, 前 window-1 个为 null
 */
export function computeRollingMA(
  data: number[],
  window: number,
): (number | null)[] {
  const result: (number | null)[] = [];
  let runningSum = 0;

  for (let i = 0; i < data.length; i++) {
    runningSum += data[i];
    if (i >= window) {
      runningSum -= data[i - window];
    }
    if (i < window - 1) {
      result.push(null);
    } else {
      result.push(round6(runningSum / window));
    }
  }

  return result;
}

/**
 * IC 累计求和 — 将日IC积分为趋势曲线
 *
 * 累计IC持续向上 = 因子长期有效
 * 走平 = 预测力消失
 * 掉头向下 = 因子反转
 *
 * @param icSeries - IC 日值数组
 * @returns 等长的前缀和数组
 */
export function computeCumulativeIC(icSeries: number[]): number[] {
  const result: number[] = [];
  let sum = 0;
  for (const ic of icSeries) {
    sum += ic;
    result.push(round6(sum));
  }
  return result;
}

/**
 * Q-Q 正态检验数据 — 用于 IC Q-Q 图散点
 *
 * 将 IC 经验分布与标准正态分布对比:
 * - 散点沿 45° 对角线 = 完美正态
 * - 尾部偏离 = 厚尾/薄尾
 * - S 形偏移 = 偏度
 *
 * @param icSeries - IC 日值数组
 * @returns {theoretical, empirical}[] 理论分位数 vs 经验分位数
 */
export function computeQQPlotData(
  icSeries: number[],
): Array<{ theoretical: number; empirical: number }> {
  const n = icSeries.length;
  if (n < 3) return [];

  const sorted = [...icSeries].sort((a, b) => a - b);

  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(
    sorted.reduce((a, v) => a + (v - mean) ** 2, 0) / (n - 1),
  );
  if (std === 0) return [];

  const result: Array<{ theoretical: number; empirical: number }> = [];

  for (let i = 0; i < n; i++) {
    // Hazen plotting position: (i + 0.5) / n
    const p = (i + 0.5) / n;
    const theoretical = inverseNormalCDF(p);
    const empirical = (sorted[i] - mean) / std;
    result.push({
      theoretical: round4(theoretical),
      empirical: round4(empirical),
    });
  }

  return result;
}

// ─── Inverse Normal CDF (Rational Approximation) ────────

/**
 * Beasley-Springer-Moro 标准正态逆 CDF
 * 精度: |误差| < 1.5e-9 for p ∈ (0, 1)
 */
function inverseNormalCDF(p: number): number {
  if (p <= 0) return -8;
  if (p >= 1) return 8;

  // Rational approximation for central region
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0,
    -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0,
    3.754408661907416e0,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number;
  let r: number;

  if (p < pLow) {
    // Lower tail
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  } else if (p <= pHigh) {
    // Central region
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  } else {
    // Upper tail
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
}

// ─── Helpers ────────────────────────────────────────────

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function round6(v: number): number {
  return Math.round(v * 1000000) / 1000000;
}
