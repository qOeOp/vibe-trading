/**
 * Mock Factor Data
 * Simulates Alphalens-style factor analysis results
 */

import type {
  FactorInfo,
  FactorData,
  QuantileReturn,
  ICTimeSeriesPoint,
  CumulativeReturnPoint,
  TurnoverDataPoint,
  FactorRankAutocorrelation,
  SectorBreakdown,
  FactorStatistics,
} from "../types";

// ============ Seeded Random for SSR Consistency ============

/**
 * Simple seeded random number generator (mulberry32)
 * Ensures consistent values between server and client renders
 */
function createSeededRandom(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Global seeded random instance - reset per factor for consistency
let seededRandom = createSeededRandom(12345);

function resetSeed(seed: number) {
  seededRandom = createSeededRandom(seed);
}

// ============ Factor List ============

export const FACTORS: FactorInfo[] = [
  {
    id: "momentum_12m",
    name: "12-Month Momentum",
    description: "Price momentum over the past 12 months",
    category: "momentum",
    annualizedAlpha: 0.082,
    annualizedBeta: 0.15,
    sharpeRatio: 1.24,
    informationCoefficient: 0.045,
    icPValue: 0.001,
    turnover: 0.32,
    quantiles: 5,
  },
  {
    id: "value_pe",
    name: "Price-to-Earnings",
    description: "Inverse P/E ratio (value factor)",
    category: "value",
    annualizedAlpha: 0.065,
    annualizedBeta: 0.08,
    sharpeRatio: 0.98,
    informationCoefficient: 0.038,
    icPValue: 0.003,
    turnover: 0.18,
    quantiles: 5,
  },
  {
    id: "quality_roe",
    name: "Return on Equity",
    description: "Profitability measured by ROE",
    category: "quality",
    annualizedAlpha: 0.071,
    annualizedBeta: 0.12,
    sharpeRatio: 1.15,
    informationCoefficient: 0.042,
    icPValue: 0.002,
    turnover: 0.22,
    quantiles: 5,
  },
  {
    id: "volatility_60d",
    name: "60-Day Volatility",
    description: "Rolling 60-day return volatility",
    category: "volatility",
    annualizedAlpha: 0.055,
    annualizedBeta: -0.18,
    sharpeRatio: 0.85,
    informationCoefficient: 0.035,
    icPValue: 0.008,
    turnover: 0.28,
    quantiles: 5,
  },
  {
    id: "size_mcap",
    name: "Market Cap",
    description: "Log market capitalization (size factor)",
    category: "size",
    annualizedAlpha: 0.048,
    annualizedBeta: 0.05,
    sharpeRatio: 0.72,
    informationCoefficient: 0.028,
    icPValue: 0.015,
    turnover: 0.12,
    quantiles: 5,
  },
];

// ============ Data Generation Helpers ============

function generateDateRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

function generateQuantileReturns(): QuantileReturn[] {
  return [
    { quantile: 1, period1D: -0.0012, period5D: -0.0058, period10D: -0.0095, period20D: -0.0182 },
    { quantile: 2, period1D: -0.0004, period5D: -0.0018, period10D: -0.0032, period20D: -0.0055 },
    { quantile: 3, period1D: 0.0002, period5D: 0.0008, period10D: 0.0015, period20D: 0.0028 },
    { quantile: 4, period1D: 0.0008, period5D: 0.0042, period10D: 0.0078, period20D: 0.0145 },
    { quantile: 5, period1D: 0.0018, period5D: 0.0092, period10D: 0.0168, period20D: 0.0325 },
  ];
}

function generateICTimeSeries(days: number, baseIC: number): ICTimeSeriesPoint[] {
  const dates = generateDateRange(days);
  const points: ICTimeSeriesPoint[] = [];
  let movingSum = 0;
  const windowSize = 20;

  for (let i = 0; i < dates.length; i++) {
    const noise = (seededRandom() - 0.5) * 0.08;
    const trend = Math.sin(i / 30) * 0.02;
    const ic = baseIC + noise + trend;

    movingSum += ic;
    if (i >= windowSize) {
      movingSum -= points[i - windowSize].ic;
    }

    const icMovingAvg = i >= windowSize - 1 ? movingSum / windowSize : movingSum / (i + 1);

    points.push({
      date: dates[i],
      ic: Number(ic.toFixed(4)),
      icMovingAvg: Number(icMovingAvg.toFixed(4)),
    });
  }

  return points;
}

function generateCumulativeReturns(days: number): CumulativeReturnPoint[] {
  const dates = generateDateRange(days);
  const points: CumulativeReturnPoint[] = [];

  let q1 = 0, q2 = 0, q3 = 0, q4 = 0, q5 = 0;
  const dailyReturns = {
    q1: -0.0003,
    q2: -0.0001,
    q3: 0.0001,
    q4: 0.0003,
    q5: 0.0005,
  };

  for (const date of dates) {
    const noise = () => (seededRandom() - 0.5) * 0.003;

    q1 += dailyReturns.q1 + noise();
    q2 += dailyReturns.q2 + noise();
    q3 += dailyReturns.q3 + noise();
    q4 += dailyReturns.q4 + noise();
    q5 += dailyReturns.q5 + noise();

    points.push({
      date,
      quantile1: Number(q1.toFixed(4)),
      quantile2: Number(q2.toFixed(4)),
      quantile3: Number(q3.toFixed(4)),
      quantile4: Number(q4.toFixed(4)),
      quantile5: Number(q5.toFixed(4)),
      longShort: Number((q5 - q1).toFixed(4)),
    });
  }

  return points;
}

function generateTurnoverData(): TurnoverDataPoint[] {
  return [
    { quantile: 1, turnover1D: 0.28, turnover5D: 0.45, turnover10D: 0.58 },
    { quantile: 2, turnover1D: 0.22, turnover5D: 0.38, turnover10D: 0.52 },
    { quantile: 3, turnover1D: 0.18, turnover5D: 0.32, turnover10D: 0.45 },
    { quantile: 4, turnover1D: 0.24, turnover5D: 0.42, turnover10D: 0.55 },
    { quantile: 5, turnover1D: 0.32, turnover5D: 0.52, turnover10D: 0.65 },
  ];
}

function generateRankAutocorrelation(): FactorRankAutocorrelation[] {
  return [
    { lag: 1, autocorrelation: 0.92 },
    { lag: 5, autocorrelation: 0.78 },
    { lag: 10, autocorrelation: 0.65 },
    { lag: 20, autocorrelation: 0.48 },
    { lag: 40, autocorrelation: 0.32 },
    { lag: 60, autocorrelation: 0.22 },
  ];
}

function generateSectorBreakdown(): SectorBreakdown[] {
  return [
    { sector: "Technology", meanReturn: 0.0045, ic: 0.052, count: 156 },
    { sector: "Healthcare", meanReturn: 0.0038, ic: 0.048, count: 98 },
    { sector: "Financials", meanReturn: 0.0028, ic: 0.042, count: 124 },
    { sector: "Consumer Disc.", meanReturn: 0.0035, ic: 0.045, count: 87 },
    { sector: "Industrials", meanReturn: 0.0032, ic: 0.038, count: 112 },
    { sector: "Materials", meanReturn: 0.0025, ic: 0.035, count: 45 },
    { sector: "Energy", meanReturn: 0.0018, ic: 0.028, count: 38 },
    { sector: "Utilities", meanReturn: 0.0012, ic: 0.022, count: 32 },
    { sector: "Real Estate", meanReturn: 0.0022, ic: 0.032, count: 28 },
    { sector: "Comm. Services", meanReturn: 0.0042, ic: 0.055, count: 52 },
  ];
}

function generateStatistics(factor: FactorInfo): FactorStatistics {
  return {
    annualizedAlpha: factor.annualizedAlpha,
    annualizedBeta: factor.annualizedBeta,
    sharpeRatio: factor.sharpeRatio,
    maxDrawdown: -(0.08 + seededRandom() * 0.12),
    volatility: 0.12 + seededRandom() * 0.08,
    informationCoefficient: factor.informationCoefficient,
    icTStat: 2.5 + seededRandom() * 2,
    icPValue: factor.icPValue,
    icSkew: -0.2 + seededRandom() * 0.4,
    icKurtosis: 2.8 + seededRandom() * 0.8,
    turnoverMean: factor.turnover,
    factorRankAutocorr: 0.85 + seededRandom() * 0.1,
  };
}

// ============ Factory Function ============

// Simple hash function to convert factor ID to a seed number
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getFactorData(factorId: string): FactorData | null {
  const factor = FACTORS.find((f) => f.id === factorId);
  if (!factor) return null;

  // Reset seed based on factor ID for consistent data generation
  resetSeed(hashString(factorId));

  return {
    info: factor,
    statistics: generateStatistics(factor),
    quantileReturns: generateQuantileReturns(),
    icTimeSeries: generateICTimeSeries(252, factor.informationCoefficient),
    cumulativeReturns: generateCumulativeReturns(300), // 300 days for cumulative returns chart
    turnoverByQuantile: generateTurnoverData(),
    rankAutocorrelation: generateRankAutocorrelation(),
    sectorBreakdown: generateSectorBreakdown(),
  };
}

export function getAllFactors(): FactorInfo[] {
  return [...FACTORS];
}

export function getFactorsByCategory(category: string): FactorInfo[] {
  return FACTORS.filter((f) => f.category === category);
}
