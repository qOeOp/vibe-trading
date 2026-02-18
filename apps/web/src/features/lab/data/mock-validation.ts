/**
 * Mock validation data generator for Lab module.
 * Uses seeded PRNG (mulberry32) for deterministic, SSR-safe results.
 * Mock data is statistically realistic — IC in 0.03-0.06 range, not fantasy values.
 */

import type {
  ValidationResult,
  ICStats,
  QuantileReturns,
  ICDecay,
  OrthogonalityTest,
  ConditionalICAnalysis,
  FactorAttribution,
  TurnoverAnalysis,
  VerdictLevel,
  StepConclusion,
} from "../types";

// ─── Seeded PRNG (mulberry32) ────────────────────────────

function createSeededRandom(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Simple string hash for deterministic seed from expression */
export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) || 42;
}

// ─── IC Stats Generator ─────────────────────────────────

function generateICStats(rand: () => number): ICStats {
  // Realistic IC range for A-share factors
  const icMean = 0.025 + rand() * 0.04; // 0.025-0.065
  const icStd = 0.08 + rand() * 0.08; // 0.08-0.16
  const ir = icMean / icStd;
  const n = 240;
  const tStat = ir * Math.sqrt(n);

  // Generate IC time series with mean-reversion
  const icTimeSeries: number[] = [];
  let value = icMean + (rand() - 0.5) * icStd * 2;
  for (let i = 0; i < n; i++) {
    const reversion = (icMean - value) * 0.12;
    value += reversion + (rand() - 0.5) * icStd * 1.5;
    icTimeSeries.push(Math.round(value * 10000) / 10000);
  }

  const positiveCount = icTimeSeries.filter((v) => v > 0).length;

  // Skewness and kurtosis from the time series
  const mean =
    icTimeSeries.reduce((a, b) => a + b, 0) / icTimeSeries.length;
  const variance =
    icTimeSeries.reduce((a, b) => a + (b - mean) ** 2, 0) /
    icTimeSeries.length;
  const std = Math.sqrt(variance);
  const skewness =
    icTimeSeries.reduce((a, b) => a + ((b - mean) / std) ** 3, 0) /
    icTimeSeries.length;
  const kurtosis =
    icTimeSeries.reduce((a, b) => a + ((b - mean) / std) ** 4, 0) /
    icTimeSeries.length;

  return {
    icMean: Math.round(icMean * 10000) / 10000,
    icStd: Math.round(icStd * 10000) / 10000,
    ir: Math.round(ir * 100) / 100,
    icPositiveRatio: Math.round((positiveCount / n) * 1000) / 10,
    tStat: Math.round(tStat * 100) / 100,
    icSkewness: Math.round(skewness * 100) / 100,
    icKurtosis: Math.round(kurtosis * 100) / 100,
    coverageRate: 82 + rand() * 16, // 82-98%
    icTimeSeries,
  };
}

// ─── Quantile Returns Generator ──────────────────────────

function generateQuantileReturns(
  rand: () => number,
  icMean: number,
): QuantileReturns {
  // Generate 5 quantile groups with approximate monotonicity
  const baseSpread = icMean * 50; // IC → return spread relationship
  const groups = Array.from({ length: 5 }, (_, i) => {
    const baseReturn = -baseSpread + (i * 2 * baseSpread) / 4;
    const noise = (rand() - 0.5) * baseSpread * 0.3;
    return {
      label: `Q${i + 1}`,
      avgReturn: Math.round((baseReturn + noise) * 10000) / 10000,
    };
  });

  // Monotonicity: Spearman correlation of group index vs return
  const returns = groups.map((g) => g.avgReturn);
  const ranks = [...returns]
    .map((v, i) => ({ v, i }))
    .sort((a, b) => a.v - b.v)
    .map((item, rank) => ({ ...item, rank }));
  const sortedRanks = ranks.sort((a, b) => a.i - b.i).map((r) => r.rank);
  const n = 5;
  const d2 = sortedRanks.reduce((sum, r, i) => sum + (r - i) ** 2, 0);
  const monotonicity =
    Math.round((1 - (6 * d2) / (n * (n * n - 1))) * 100) / 100;

  // Long-short stats
  const longShortReturn =
    Math.round((groups[4].avgReturn - groups[0].avgReturn) * 252 * 10000) /
    10000;
  const longShortMaxDD = -(5 + rand() * 15); // -5% to -20%
  const longShortIR = 0.3 + rand() * 0.8;

  // Long-short cumulative NAV curve (240 trading days)
  const dailyReturn = longShortReturn / 252;
  const dailyVol = Math.abs(dailyReturn) / longShortIR;
  const longShortCurve: { date: string; value: number }[] = [];
  let nav = 1.0;
  const startDate = new Date(2023, 0, 4); // 2023-01-04
  for (let i = 0; i < 240; i++) {
    nav *= 1 + dailyReturn + (rand() - 0.5) * dailyVol * 2;
    nav = Math.max(nav, 0.5); // floor at 0.5
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i * 1.4)); // skip weekends approx
    longShortCurve.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(nav * 10000) / 10000,
    });
  }

  return {
    groups,
    monotonicity,
    longShortReturn: Math.round(longShortReturn * 100) / 100,
    longShortMaxDD: Math.round(longShortMaxDD * 100) / 100,
    longShortIR: Math.round(longShortIR * 100) / 100,
    longShortCurve,
  };
}

// ─── IC Decay Generator ──────────────────────────────────

function generateICDecay(rand: () => number, icMean: number): ICDecay {
  // Exponential decay with noise
  const decayRate = 0.05 + rand() * 0.15; // 0.05-0.20
  const lags = Array.from({ length: 20 }, (_, i) => {
    const lag = i + 1;
    const ic =
      icMean * Math.exp(-decayRate * lag) + (rand() - 0.5) * 0.005;
    return { lag, ic: Math.round(ic * 10000) / 10000 };
  });

  // Half-life: find first lag where IC < icMean * 0.5
  const halfThreshold = icMean * 0.5;
  let halfLife = 20;
  for (let i = 0; i < lags.length; i++) {
    if (lags[i].ic < halfThreshold) {
      // Linear interpolation
      if (i > 0) {
        const prev = lags[i - 1].ic;
        const curr = lags[i].ic;
        halfLife =
          i + (prev - halfThreshold) / (prev - curr);
      } else {
        halfLife = 1;
      }
      break;
    }
  }

  // Multi-period stats
  const periods = [1, 5, 10, 21];
  const multiPeriodStats = periods.map((period) => {
    const periodIC =
      icMean * Math.exp(-decayRate * (period - 1)) +
      (rand() - 0.5) * 0.008;
    const periodStd = 0.08 + rand() * 0.06;
    const periodIR = periodIC / periodStd;
    return {
      period,
      icMean: Math.round(periodIC * 10000) / 10000,
      icStd: Math.round(periodStd * 10000) / 10000,
      ir: Math.round(periodIR * 100) / 100,
      icSkew: Math.round((rand() - 0.5) * 100) / 100,
      icKurt: Math.round((2.5 + rand() * 1.5) * 100) / 100,
      icNegRatio: Math.round((35 + rand() * 20) * 10) / 10,
    };
  });

  return {
    lags,
    halfLife: Math.round(halfLife * 10) / 10,
    multiPeriodStats,
  };
}

// ─── Orthogonality Test Generator (Step 4) ──────────────

function generateOrthogonalityTest(
  rand: () => number,
  icMean: number,
): OrthogonalityTest {
  const KNOWN_FACTORS = [
    "Size", "Value", "Momentum", "Reversal", "Volatility",
    "Liquidity", "Quality", "Growth", "Beta", "Dividend",
  ];

  const knownFactors = KNOWN_FACTORS.map((name) => {
    const correlation = (rand() - 0.5) * 0.6; // -0.3 to +0.3 (realistic range)
    const absCorr = Math.abs(correlation);
    // p-value inversely related to |correlation|
    const pValue = absCorr > 0.2
      ? rand() * 0.05
      : absCorr > 0.1
        ? 0.05 + rand() * 0.15
        : 0.1 + rand() * 0.9;

    return {
      name,
      correlation: Math.round(correlation * 1000) / 1000,
      pValue: Math.round(pValue * 1000) / 1000,
    };
  });

  const maxCorrelation = Math.max(...knownFactors.map((f) => Math.abs(f.correlation)));
  const residualIC = icMean * (0.6 + rand() * 0.35); // 60-95% of original IC retained
  const independenceRatio = 60 + rand() * 35; // 60-95% independent

  return {
    knownFactors,
    maxCorrelation: Math.round(maxCorrelation * 1000) / 1000,
    residualIC: Math.round(residualIC * 10000) / 10000,
    independenceRatio: Math.round(independenceRatio * 10) / 10,
  };
}

// ─── Conditional IC Generator (Step 5) ──────────────────

function generateConditionalIC(
  rand: () => number,
  icMean: number,
): ConditionalICAnalysis {
  function makeGroups(
    conditions: string[],
    ratios: number[],
  ) {
    return conditions.map((condition, i) => ({
      condition,
      icMean: Math.round((icMean * (0.5 + rand() * 1.0)) * 10000) / 10000,
      icStd: Math.round((0.08 + rand() * 0.08) * 10000) / 10000,
      sampleRatio: Math.round(ratios[i] * 10) / 10,
    }));
  }

  const byMarketRegime = makeGroups(
    ["牛市", "震荡", "熊市"],
    [25 + rand() * 10, 40 + rand() * 10, 20 + rand() * 10],
  );
  const byVolatility = makeGroups(
    ["低波动", "中波动", "高波动"],
    [30 + rand() * 10, 35 + rand() * 10, 25 + rand() * 10],
  );
  const byLiquidity = makeGroups(
    ["高流动性", "低流动性"],
    [55 + rand() * 15, 30 + rand() * 15],
  );

  // Stability: how uniform IC is across conditions
  const allICs = [...byMarketRegime, ...byVolatility, ...byLiquidity].map(
    (g) => g.icMean,
  );
  const meanIC = allICs.reduce((a, b) => a + b, 0) / allICs.length;
  const variance =
    allICs.reduce((a, b) => a + (b - meanIC) ** 2, 0) / allICs.length;
  const cv = Math.sqrt(variance) / Math.abs(meanIC + 0.001);
  const stabilityScore = Math.max(0, Math.min(1, 1 - cv));

  return {
    byMarketRegime,
    byVolatility,
    byLiquidity,
    stabilityScore: Math.round(stabilityScore * 100) / 100,
  };
}

// ─── Factor Attribution Generator (Step 6) ──────────────

function generateAttribution(
  rand: () => number,
  icMean: number,
): FactorAttribution {
  const STYLE_FACTORS = [
    "市值", "价值", "动量", "波动率", "流动性", "盈利质量",
  ];

  const styleExposures = STYLE_FACTORS.map((name) => {
    const exposure = (rand() - 0.5) * 0.8; // -0.4 to +0.4
    const contribution = Math.abs(exposure) * (5 + rand() * 10); // % contribution
    return {
      name,
      exposure: Math.round(exposure * 1000) / 1000,
      contribution: Math.round(contribution * 10) / 10,
    };
  });

  const INDUSTRIES = [
    "银行", "非银金融", "电子", "医药生物", "食品饮料",
    "计算机", "电力设备", "机械设备", "汽车", "有色金属",
  ];

  const industryExposures = INDUSTRIES.map((industry) => ({
    industry,
    weight: Math.round((rand() * 15 - 3) * 10) / 10, // -3% to +12%
  })).sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  const totalStyleContribution = styleExposures.reduce(
    (sum, s) => sum + s.contribution,
    0,
  );
  const r2 = Math.min(totalStyleContribution, 85 + rand() * 10);
  const alphaIC = icMean * (1 - r2 / 100 * 0.5); // Residual IC
  const specificRisk = 100 - r2;

  return {
    styleExposures,
    industryExposures,
    alphaIC: Math.round(alphaIC * 10000) / 10000,
    r2: Math.round(r2 * 10) / 10,
    specificRisk: Math.round(specificRisk * 10) / 10,
  };
}

// ─── Turnover & Cost Generator (Step 7) ─────────────────

function generateTurnover(
  rand: () => number,
  icMean: number,
): TurnoverAnalysis {
  const dailyTurnover = 3 + rand() * 12; // 3-15% one-way daily
  const annualTurnover = dailyTurnover * 252;

  // Cost model: 10-30 bps round-trip per rebalance
  const costPerTrade = 10 + rand() * 20; // bps
  const estimatedCostBps = Math.round(dailyTurnover * costPerTrade / 100 * 252);

  // Net IC after cost impact
  const costImpact = estimatedCostBps / 10000; // convert bps to decimal
  const netICAfterCost = Math.max(0, icMean - costImpact * 0.3);

  // Break-even cost: IC / sensitivity
  const breakEvenCost = Math.round((icMean / 0.3) * 10000);

  const byPeriod = [
    { period: "日均", turnover: dailyTurnover, cost: costPerTrade },
    {
      period: "周均",
      turnover: dailyTurnover * 5 * 0.7,
      cost: costPerTrade * 0.8,
    },
    {
      period: "月均",
      turnover: dailyTurnover * 21 * 0.5,
      cost: costPerTrade * 0.6,
    },
  ].map((p) => ({
    ...p,
    turnover: Math.round(p.turnover * 100) / 100,
    cost: Math.round(p.cost * 10) / 10,
  }));

  // Turnover time series (240 days)
  const turnoverTimeSeries: number[] = [];
  let tv = dailyTurnover;
  for (let i = 0; i < 240; i++) {
    tv = tv * 0.9 + dailyTurnover * 0.1 + (rand() - 0.5) * dailyTurnover * 0.4;
    tv = Math.max(0.5, tv);
    turnoverTimeSeries.push(Math.round(tv * 100) / 100);
  }

  const costDecayRatio = Math.min(95, (estimatedCostBps / (icMean * 10000)) * 100);

  return {
    dailyTurnover: Math.round(dailyTurnover * 100) / 100,
    annualTurnover: Math.round(annualTurnover),
    estimatedCostBps: Math.round(estimatedCostBps),
    netICAfterCost: Math.round(netICAfterCost * 10000) / 10000,
    breakEvenCost: Math.round(breakEvenCost),
    byPeriod,
    turnoverTimeSeries,
    costDecayRatio: Math.round(costDecayRatio * 10) / 10,
  };
}

// ─── Verdict Logic ───────────────────────────────────────

function computeVerdict(
  icStats: ICStats,
  quantileReturns: QuantileReturns,
  orthogonality: OrthogonalityTest,
  conditionalIC: ConditionalICAnalysis,
  attribution: FactorAttribution,
  turnover: TurnoverAnalysis,
): { verdict: VerdictLevel; stepConclusions: Record<number, StepConclusion> } {
  const step1: StepConclusion =
    icStats.icMean > 0.03 && icStats.tStat > 2.0
      ? "pass"
      : icStats.icMean > 0.02 || icStats.tStat > 1.5
        ? "warning"
        : "fail";

  const step2: StepConclusion =
    quantileReturns.monotonicity > 0.8
      ? "pass"
      : quantileReturns.monotonicity > 0.5
        ? "warning"
        : "fail";

  const step3: StepConclusion = "warning"; // IC decay is informational

  // Step 4: Orthogonality — low correlation with known factors
  const step4: StepConclusion =
    orthogonality.maxCorrelation < 0.15 && orthogonality.independenceRatio > 80
      ? "pass"
      : orthogonality.maxCorrelation < 0.25 || orthogonality.independenceRatio > 65
        ? "warning"
        : "fail";

  // Step 5: Conditional IC — stable across regimes
  const step5: StepConclusion =
    conditionalIC.stabilityScore > 0.7
      ? "pass"
      : conditionalIC.stabilityScore > 0.4
        ? "warning"
        : "fail";

  // Step 6: Attribution — high alpha IC, low style R²
  const step6: StepConclusion =
    attribution.alphaIC > 0.02 && attribution.r2 < 50
      ? "pass"
      : attribution.alphaIC > 0.01 || attribution.r2 < 70
        ? "warning"
        : "fail";

  // Step 7: Turnover — reasonable cost, positive net IC
  const step7: StepConclusion =
    turnover.netICAfterCost > 0.015 && turnover.costDecayRatio < 50
      ? "pass"
      : turnover.netICAfterCost > 0.005 || turnover.costDecayRatio < 70
        ? "warning"
        : "fail";

  const allSteps = [step1, step2, step3, step4, step5, step6, step7];
  const failCount = allSteps.filter((s) => s === "fail").length;
  const passCount = allSteps.filter((s) => s === "pass").length;

  const verdict: VerdictLevel =
    failCount === 0 && passCount >= 4
      ? "valid"
      : failCount <= 2
        ? "marginal"
        : "invalid";

  return {
    verdict,
    stepConclusions: {
      1: step1,
      2: step2,
      3: step3,
      4: step4,
      5: step5,
      6: step6,
      7: step7,
      8: verdict === "valid" ? "pass" : verdict === "marginal" ? "warning" : "fail",
    },
  };
}

// ─── Main Generator ──────────────────────────────────────

export function generateMockValidation(seed: number): ValidationResult {
  const rand = createSeededRandom(seed);

  const icStats = generateICStats(rand);
  const quantileReturns = generateQuantileReturns(rand, icStats.icMean);
  const icDecay = generateICDecay(rand, icStats.icMean);
  const orthogonality = generateOrthogonalityTest(rand, icStats.icMean);
  const conditionalIC = generateConditionalIC(rand, icStats.icMean);
  const attribution = generateAttribution(rand, icStats.icMean);
  const turnover = generateTurnover(rand, icStats.icMean);

  const { verdict, stepConclusions } = computeVerdict(
    icStats,
    quantileReturns,
    orthogonality,
    conditionalIC,
    attribution,
    turnover,
  );

  return {
    icStats,
    quantileReturns,
    icDecay,
    orthogonality,
    conditionalIC,
    attribution,
    turnover,
    verdict,
    stepConclusions,
  };
}
