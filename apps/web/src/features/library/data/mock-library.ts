import type { LibraryFactor, LibrarySummary, FactorStatus } from "../types";

/** Seeded PRNG (mulberry32) for SSR-consistent sparklines */
function createSeededRandom(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate a deterministic sparkline array */
function generateSparkline(length: number, trend: "up" | "down" | "flat", seed: number): number[] {
  const rand = createSeededRandom(seed);
  const data: number[] = [];
  let value = 50 + rand() * 20;
  for (let i = 0; i < length; i++) {
    const drift =
      trend === "up" ? 0.3 : trend === "down" ? -0.3 : 0;
    value += drift + (rand() - 0.5) * 8;
    value = Math.max(10, Math.min(90, value));
    data.push(Math.round(value * 100) / 100);
  }
  return data;
}

const FACTORS_RAW: Omit<LibraryFactor, "icTrend">[] = [
  { id: "ep", name: "EP", description: "盈利收益率", category: "价值", icMean: 0.052, icir: 1.85, winRate: 62, period: "20D", turnover: 18, maxDrawdown: -8.2, sharpe: 1.92, status: "强有效" },
  { id: "bp", name: "BP", description: "市净率倒数", category: "价值", icMean: 0.041, icir: 1.52, winRate: 58, period: "20D", turnover: 15, maxDrawdown: -6.5, sharpe: 1.65, status: "有效" },
  { id: "roe_ttm", name: "ROE_TTM", description: "净资产收益率", category: "质量", icMean: 0.038, icir: 1.41, winRate: 56, period: "10D", turnover: 22, maxDrawdown: -9.1, sharpe: 1.48, status: "有效" },
  { id: "sue", name: "SUE", description: "标准化超预期", category: "情绪", icMean: 0.061, icir: 2.10, winRate: 65, period: "5D", turnover: 35, maxDrawdown: -11.3, sharpe: 2.15, status: "强有效" },
  { id: "mom_20d", name: "Mom_20D", description: "20日动量", category: "动量", icMean: 0.028, icir: 0.95, winRate: 52, period: "5D", turnover: 42, maxDrawdown: -15.2, sharpe: 0.88, status: "弱" },
  { id: "rev_5d", name: "Rev_5D", description: "5日反转", category: "动量", icMean: -0.035, icir: -1.30, winRate: 44, period: "5D", turnover: 55, maxDrawdown: -18.1, sharpe: -1.10, status: "反向" },
  { id: "illiq", name: "Illiq", description: "非流动性", category: "流动性", icMean: -0.033, icir: -1.22, winRate: 45, period: "20D", turnover: 12, maxDrawdown: -7.8, sharpe: -0.95, status: "反向" },
  { id: "vol_20d", name: "Vol_20D", description: "20日波动率", category: "波动", icMean: -0.045, icir: -1.68, winRate: 41, period: "10D", turnover: 28, maxDrawdown: -18.5, sharpe: -1.42, status: "反向" },
  { id: "size", name: "Size", description: "流通市值", category: "规模", icMean: -0.022, icir: -0.82, winRate: 48, period: "20D", turnover: 8, maxDrawdown: -5.2, sharpe: -0.55, status: "弱" },
  { id: "gpm", name: "GPM", description: "毛利率", category: "质量", icMean: 0.032, icir: 1.18, winRate: 55, period: "20D", turnover: 14, maxDrawdown: -7.5, sharpe: 1.28, status: "有效" },
  { id: "cfop", name: "CFOP", description: "经营现金流/市值", category: "价值", icMean: 0.044, icir: 1.62, winRate: 60, period: "20D", turnover: 16, maxDrawdown: -8.8, sharpe: 1.72, status: "有效" },
  { id: "analyst", name: "Analyst", description: "分析师上调比例", category: "情绪", icMean: 0.048, icir: 1.75, winRate: 61, period: "10D", turnover: 30, maxDrawdown: -10.5, sharpe: 1.82, status: "强有效" },
  { id: "dp", name: "DP", description: "股息率", category: "价值", icMean: 0.029, icir: 1.08, winRate: 54, period: "20D", turnover: 10, maxDrawdown: -6.0, sharpe: 1.15, status: "有效" },
  { id: "roa_ttm", name: "ROA_TTM", description: "总资产收益率", category: "质量", icMean: 0.035, icir: 1.32, winRate: 57, period: "10D", turnover: 20, maxDrawdown: -8.0, sharpe: 1.40, status: "有效" },
  { id: "mom_60d", name: "Mom_60D", description: "60日动量", category: "动量", icMean: 0.018, icir: 0.68, winRate: 51, period: "10D", turnover: 38, maxDrawdown: -16.5, sharpe: 0.62, status: "弱" },
  { id: "earnings_rev", name: "EPS_Rev", description: "每股收益修正", category: "情绪", icMean: 0.055, icir: 1.95, winRate: 63, period: "10D", turnover: 32, maxDrawdown: -9.5, sharpe: 2.02, status: "强有效" },
  { id: "beta", name: "Beta", description: "市场贝塔", category: "波动", icMean: -0.015, icir: -0.55, winRate: 47, period: "20D", turnover: 25, maxDrawdown: -12.0, sharpe: -0.42, status: "弱" },
  { id: "amihud", name: "Amihud", description: "Amihud非流动性", category: "流动性", icMean: -0.028, icir: -1.05, winRate: 46, period: "20D", turnover: 11, maxDrawdown: -6.8, sharpe: -0.78, status: "反向" },
  { id: "accruals", name: "Accruals", description: "应计利润", category: "质量", icMean: 0.025, icir: 0.92, winRate: 53, period: "20D", turnover: 19, maxDrawdown: -10.0, sharpe: 0.95, status: "弱" },
  { id: "sp", name: "SP", description: "营收价格比", category: "价值", icMean: 0.039, icir: 1.45, winRate: 59, period: "20D", turnover: 17, maxDrawdown: -7.2, sharpe: 1.55, status: "有效" },
];

function getTrend(status: FactorStatus): "up" | "down" | "flat" {
  switch (status) {
    case "强有效":
    case "有效":
      return "up";
    case "反向":
      return "down";
    default:
      return "flat";
  }
}

export function getLibraryFactors(): LibraryFactor[] {
  return FACTORS_RAW.map((f, i) => ({
    ...f,
    icTrend: generateSparkline(30, getTrend(f.status), i * 7919 + 42),
  }));
}

export function getLibrarySummary(factors: LibraryFactor[]): LibrarySummary {
  const effective = factors.filter((f) => f.icMean > 0.03).length;
  const avgICIR =
    factors.reduce((sum, f) => sum + Math.abs(f.icir), 0) / factors.length;
  return {
    totalFactors: factors.length,
    effectiveFactors: effective,
    avgICIR: Math.round(avgICIR * 100) / 100,
    newThisMonth: 3,
  };
}

