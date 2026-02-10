/**
 * Mock Factor Data
 * Simulates Alphalens-style factor analysis results
 */

import type {
  FactorInfo,
  FactorData,
  CumulativeReturnPoint,
  SectorBreakdown,
  FactorStatistics,
  HoldingCompositionPoint,
} from "../types";
import { HOLDING_SECTORS } from "../types";

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

function generateSectorBreakdown(): SectorBreakdown[] {
  return [
    { sector: "Technology", meanReturn: 0.0045, ic: 0.052, count: 156 },
    { sector: "Healthcare", meanReturn: 0.0038, ic: 0.048, count: 98 },
    { sector: "Financials", meanReturn: 0.0028, ic: 0.042, count: 124 },
    { sector: "Consumer", meanReturn: 0.0035, ic: 0.045, count: 87 },
    { sector: "Manufacturing", meanReturn: 0.0032, ic: 0.038, count: 112 },
    { sector: "Resources", meanReturn: 0.0025, ic: 0.035, count: 45 },
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

function generateHoldingComposition(days: number, stepDays: number = 7): HoldingCompositionPoint[] {
  // Generate dates at weekly intervals over the given timespan
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= stepDays) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  const points: HoldingCompositionPoint[] = [];
  const sectorCount = HOLDING_SECTORS.length;

  // Start with only 2-3 active sectors, others at zero
  let weights = [0, 0, 35, 0, 0, 65, 0];

  for (let t = 0; t < dates.length; t++) {
    // Occasionally a dormant sector enters or an active sector exits
    for (let s = 0; s < sectorCount; s++) {
      if (weights[s] === 0) {
        // ~20% chance per step for a zero-weight sector to appear
        if (seededRandom() < 0.2) {
          weights[s] = 3 + seededRandom() * 8;
        }
      } else {
        // ~8% chance for a small sector to drop out entirely
        if (weights[s] < 5 && seededRandom() < 0.08) {
          weights[s] = 0;
          continue;
        }
      }

      if (weights[s] > 0) {
        const drift = (seededRandom() - 0.5) * 6;
        weights[s] = Math.max(0, weights[s] + drift);
      }
    }

    // Normalize to sum to 100
    const total = weights.reduce((a, b) => a + b, 0);
    const normalized = total > 0
      ? weights.map((w) => Number(((w / total) * 100).toFixed(1)))
      : weights.map(() => Number((100 / sectorCount).toFixed(1)));

    // Zero out tiny normalized values (< 1%) to keep chart clean
    for (let s = 0; s < sectorCount; s++) {
      if (normalized[s] < 1) {
        normalized[s] = 0;
        weights[s] = 0;
      }
    }

    // Re-normalize after zeroing
    const sum2 = normalized.reduce((a, b) => a + b, 0);
    if (sum2 > 0 && Math.abs(sum2 - 100) > 0.01) {
      const scale = 100 / sum2;
      for (let s = 0; s < sectorCount; s++) {
        normalized[s] = Number((normalized[s] * scale).toFixed(1));
      }
    }
    // Fix rounding on last non-zero element
    const sumNorm = normalized.reduce((a, b) => a + b, 0);
    const lastNonZero = normalized.findLastIndex((v) => v > 0);
    if (lastNonZero >= 0) {
      normalized[lastNonZero] = Number((normalized[lastNonZero] + (100 - sumNorm)).toFixed(1));
    }

    points.push({
      date: dates[t],
      Consumer: normalized[0],
      Resources: normalized[1],
      Manufacturing: normalized[2],
      Financials: normalized[3],
      Healthcare: normalized[4],
      Technology: normalized[5],
      Other: normalized[6],
    });
  }

  return points;
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
    cumulativeReturns: generateCumulativeReturns(300),
    sectorBreakdown: generateSectorBreakdown(),
    holdingComposition: generateHoldingComposition(60),
  };
}

export function getAllFactors(): FactorInfo[] {
  return [...FACTORS];
}
