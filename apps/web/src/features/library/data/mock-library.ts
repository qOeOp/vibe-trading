/**
 * Mock Factor Library — 50 factors with statistically realistic distributions
 *
 * Design principles:
 * - IC values: ±0.01–0.07 range (A-stock realistic)
 * - IR = IC_mean / IC_std, typically 0.3–2.5
 * - t-stat ≈ IR × √(T/12), where T=trading days
 * - Negative IC factors have expectedDirection="negative"
 * - Capacity inversely correlated with turnover
 * - icTrend/icTimeSeries generated with seeded PRNG for determinism
 */

import type {
  Factor,
  BenchmarkConfig,
  FactorCategory,
  FactorLifecycleStatus,
  FactorType,
  FactorSource,
  FactorDirection,
  UniverseIC,
  UniversePool,
} from "../types";
import { UNIVERSE_POOLS } from "../types";
import { computeICStats } from "../utils/compute-ic-stats";

// ─── Seeded PRNG ─────────────────────────────────────────

function createSeededRandom(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate IC sparkline with drift toward mean IC */
function generateICSparkline(
  length: number,
  meanIC: number,
  volatility: number,
  seed: number,
): number[] {
  const rand = createSeededRandom(seed);
  const data: number[] = [];
  let value = meanIC + (rand() - 0.5) * volatility * 2;
  for (let i = 0; i < length; i++) {
    // Mean-reverting random walk
    const reversion = (meanIC - value) * 0.15;
    value += reversion + (rand() - 0.5) * volatility;
    data.push(Math.round(value * 10000) / 10000);
  }
  return data;
}

/** Generate quantile returns (Q1→Q5) with monotonicity control */
function generateQuantileReturns(
  ic: number,
  direction: FactorDirection,
  seed: number,
): [number, number, number, number, number] {
  const rand = createSeededRandom(seed);
  const strength = Math.abs(ic) * 100; // scale to percentage
  const base = (rand() - 0.5) * 2; // market baseline

  if (direction === "positive") {
    // Higher factor value → higher return
    return [
      Math.round((base - strength * 2.5 + rand() * 0.5) * 100) / 100,
      Math.round((base - strength * 1.2 + rand() * 0.5) * 100) / 100,
      Math.round((base + rand() * 0.3) * 100) / 100,
      Math.round((base + strength * 1.2 + rand() * 0.5) * 100) / 100,
      Math.round((base + strength * 2.5 + rand() * 0.5) * 100) / 100,
    ];
  }
  // Negative direction: higher factor value → lower return
  return [
    Math.round((base + strength * 2.5 + rand() * 0.5) * 100) / 100,
    Math.round((base + strength * 1.2 + rand() * 0.5) * 100) / 100,
    Math.round((base + rand() * 0.3) * 100) / 100,
    Math.round((base - strength * 1.2 + rand() * 0.5) * 100) / 100,
    Math.round((base - strength * 2.5 + rand() * 0.5) * 100) / 100,
  ];
}

// ─── Factor Definitions ──────────────────────────────────

interface FactorSeed {
  id: string;
  name: string;
  version: string;
  category: FactorCategory;
  factorType: FactorType;
  expectedDirection: FactorDirection;
  source: FactorSource;
  status: FactorLifecycleStatus;
  expression: string;
  ic: number;
  ir: number;
  icTstat: number;
  turnover: number;
  capacity: number;
  winRate: number;
  ic60d: number;
  ic120d: number;
  createdAt: string;
  createdBy: string;
  tags: string[];
}

const FACTOR_SEEDS: FactorSeed[] = [
  // ── 动能 (Momentum) ── 6 factors
  { id: "mom_20d", name: "Mom_20D", version: "v2.1", category: "动能", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "ts_mean(close / delay(close, 20) - 1, 20)", ic: 0.038, ir: 1.42, icTstat: 3.18, turnover: 42, capacity: 80000, winRate: 58, ic60d: 0.035, ic120d: 0.032, createdAt: "2024-03-15", createdBy: "Vincent", tags: ["经典", "中频"] },
  { id: "mom_60d", name: "Mom_60D", version: "v1.0", category: "动能", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "PAPER_TEST", expression: "close / delay(close, 60) - 1", ic: 0.022, ir: 0.78, icTstat: 1.75, turnover: 28, capacity: 120000, winRate: 53, ic60d: 0.025, ic120d: 0.020, createdAt: "2024-09-01", createdBy: "Vincent", tags: ["低频"] },
  { id: "rev_5d", name: "Rev_5D", version: "v1.3", category: "动能", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "LIVE_ACTIVE", expression: "-(close / delay(close, 5) - 1)", ic: -0.041, ir: -1.55, icTstat: -3.47, turnover: 55, capacity: 50000, winRate: 60, ic60d: -0.038, ic120d: -0.035, createdAt: "2024-01-10", createdBy: "Vincent", tags: ["短期反转", "高频"] },
  { id: "rsi_14", name: "RSI_14", version: "v1.0", category: "动能", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "INCUBATING", expression: "ts_rsi(close, 14)", ic: -0.018, ir: -0.62, icTstat: -1.39, turnover: 38, capacity: 90000, winRate: 50, ic60d: -0.015, ic120d: -0.012, createdAt: "2025-01-20", createdBy: "Researcher_A", tags: ["技术指标"] },
  { id: "macd_diff", name: "MACD_Diff", version: "v1.1", category: "动能", factorType: "composite", expectedDirection: "positive", source: "mining_gplearn", status: "PROBATION", expression: "ts_ema(close, 12) - ts_ema(close, 26)", ic: 0.012, ir: 0.38, icTstat: 0.85, turnover: 45, capacity: 70000, winRate: 48, ic60d: 0.018, ic120d: 0.025, createdAt: "2024-06-20", createdBy: "Mining_v1", tags: ["技术指标", "衰减中"] },
  { id: "mom_composite", name: "动能综合", version: "v1.0", category: "动能", factorType: "composite", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "0.5*zscore(mom_20d) + 0.3*zscore(rev_5d) + 0.2*zscore(rsi_14)", ic: 0.045, ir: 1.68, icTstat: 3.76, turnover: 35, capacity: 60000, winRate: 62, ic60d: 0.042, ic120d: 0.040, createdAt: "2024-04-01", createdBy: "Vincent", tags: ["复合", "核心"] },

  // ── 股息率 (Dividend) ── 4 factors
  { id: "dp", name: "DP", version: "v2.0", category: "股息率", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "dps_ttm / close", ic: 0.035, ir: 1.28, icTstat: 2.87, turnover: 8, capacity: 300000, winRate: 57, ic60d: 0.033, ic120d: 0.031, createdAt: "2023-11-01", createdBy: "Vincent", tags: ["经典", "低换手"] },
  { id: "dp_growth", name: "DP_Growth", version: "v1.0", category: "股息率", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "PAPER_TEST", expression: "dps_ttm / close - delay(dps_ttm / close, 252)", ic: 0.028, ir: 0.95, icTstat: 2.13, turnover: 6, capacity: 350000, winRate: 55, ic60d: 0.030, ic120d: 0.026, createdAt: "2024-10-15", createdBy: "Researcher_A", tags: ["成长型股息"] },
  { id: "dp_stability", name: "DP_Stab", version: "v1.1", category: "股息率", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "ts_std(dps_ttm / close, 60) * -1", ic: 0.031, ir: 1.15, icTstat: 2.57, turnover: 5, capacity: 400000, winRate: 56, ic60d: 0.029, ic120d: 0.028, createdAt: "2024-02-20", createdBy: "Vincent", tags: ["稳定性"] },
  { id: "dp_retired", name: "DP_Old", version: "v1.0", category: "股息率", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "RETIRED", expression: "dps_annual / close", ic: 0.008, ir: 0.25, icTstat: 0.56, turnover: 7, capacity: 320000, winRate: 49, ic60d: 0.005, ic120d: 0.010, createdAt: "2023-06-01", createdBy: "Vincent", tags: ["已退役"] },

  // ── 价值 (Value) ── 7 factors
  { id: "ep", name: "EP", version: "v3.0", category: "价值", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "eps_ttm / close", ic: 0.052, ir: 1.85, icTstat: 4.14, turnover: 18, capacity: 200000, winRate: 63, ic60d: 0.050, ic120d: 0.048, createdAt: "2023-08-01", createdBy: "Vincent", tags: ["经典", "核心"] },
  { id: "bp", name: "BP", version: "v2.0", category: "价值", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "bps / close", ic: 0.041, ir: 1.52, icTstat: 3.40, turnover: 15, capacity: 250000, winRate: 59, ic60d: 0.039, ic120d: 0.037, createdAt: "2023-08-01", createdBy: "Vincent", tags: ["经典"] },
  { id: "sp", name: "SP", version: "v1.2", category: "价值", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "revenue_ttm / market_cap", ic: 0.039, ir: 1.45, icTstat: 3.25, turnover: 17, capacity: 220000, winRate: 58, ic60d: 0.037, ic120d: 0.035, createdAt: "2023-09-15", createdBy: "Vincent", tags: ["经典"] },
  { id: "cfop", name: "CFOP", version: "v2.1", category: "价值", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "operating_cashflow_ttm / market_cap", ic: 0.044, ir: 1.62, icTstat: 3.63, turnover: 16, capacity: 180000, winRate: 61, ic60d: 0.042, ic120d: 0.040, createdAt: "2023-10-01", createdBy: "Vincent", tags: ["现金流"] },
  { id: "ev_ebitda", name: "EV_EBITDA", version: "v1.0", category: "价值", factorType: "composite", expectedDirection: "negative", source: "manual", status: "PAPER_TEST", expression: "-1 * (market_cap + total_debt - cash) / ebitda_ttm", ic: -0.033, ir: -1.22, icTstat: -2.73, turnover: 14, capacity: 190000, winRate: 56, ic60d: -0.031, ic120d: -0.029, createdAt: "2024-11-01", createdBy: "Researcher_A", tags: ["企业价值"] },
  { id: "value_composite", name: "价值综合", version: "v2.0", category: "价值", factorType: "composite", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "zscore(ep) + zscore(bp) + zscore(cfop)", ic: 0.058, ir: 2.15, icTstat: 4.81, turnover: 15, capacity: 160000, winRate: 65, ic60d: 0.055, ic120d: 0.053, createdAt: "2024-01-15", createdBy: "Vincent", tags: ["复合", "核心"] },
  { id: "peg", name: "PEG", version: "v1.0", category: "价值", factorType: "composite", expectedDirection: "negative", source: "mining_gplearn", status: "INCUBATING", expression: "-1 * (close / eps_ttm) / earnings_growth_3y", ic: -0.019, ir: -0.68, icTstat: -1.52, turnover: 20, capacity: 150000, winRate: 51, ic60d: -0.017, ic120d: -0.015, createdAt: "2025-02-01", createdBy: "Mining_v2", tags: ["价值成长"] },

  // ── 成长 (Growth) ── 5 factors
  { id: "revenue_yoy", name: "Rev_YoY", version: "v1.0", category: "成长", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "revenue_ttm / delay(revenue_ttm, 252) - 1", ic: 0.036, ir: 1.32, icTstat: 2.95, turnover: 22, capacity: 150000, winRate: 57, ic60d: 0.034, ic120d: 0.032, createdAt: "2024-01-01", createdBy: "Vincent", tags: ["基础"] },
  { id: "roe_yoy", name: "ROE_YoY", version: "v1.1", category: "成长", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "roe_ttm - delay(roe_ttm, 252)", ic: 0.033, ir: 1.18, icTstat: 2.64, turnover: 19, capacity: 170000, winRate: 56, ic60d: 0.031, ic120d: 0.029, createdAt: "2024-02-01", createdBy: "Vincent", tags: ["盈利改善"] },
  { id: "earnings_accel", name: "Earn_Accel", version: "v1.0", category: "成长", factorType: "composite", expectedDirection: "positive", source: "mining_gplearn", status: "PAPER_TEST", expression: "delta(eps_ttm, 63) - delta(eps_ttm, 126)", ic: 0.025, ir: 0.88, icTstat: 1.97, turnover: 25, capacity: 130000, winRate: 54, ic60d: 0.027, ic120d: 0.023, createdAt: "2024-08-15", createdBy: "Mining_v1", tags: ["加速"] },
  { id: "sg_composite", name: "成长综合", version: "v1.0", category: "成长", factorType: "composite", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "0.5*zscore(revenue_yoy) + 0.5*zscore(roe_yoy)", ic: 0.040, ir: 1.48, icTstat: 3.31, turnover: 20, capacity: 140000, winRate: 59, ic60d: 0.038, ic120d: 0.036, createdAt: "2024-03-01", createdBy: "Vincent", tags: ["复合"] },
  { id: "capex_growth", name: "Capex_G", version: "v1.0", category: "成长", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "INCUBATING", expression: "capex_ttm / delay(capex_ttm, 252) - 1", ic: 0.015, ir: 0.52, icTstat: 1.16, turnover: 16, capacity: 180000, winRate: 51, ic60d: 0.018, ic120d: 0.013, createdAt: "2025-01-05", createdBy: "Researcher_A", tags: ["另类"] },

  // ── 品质 (Quality) ── 6 factors
  { id: "roe_ttm", name: "ROE_TTM", version: "v2.0", category: "品质", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "net_income_ttm / equity", ic: 0.042, ir: 1.55, icTstat: 3.47, turnover: 20, capacity: 180000, winRate: 60, ic60d: 0.040, ic120d: 0.038, createdAt: "2023-07-01", createdBy: "Vincent", tags: ["经典", "核心"] },
  { id: "roa_ttm", name: "ROA_TTM", version: "v1.0", category: "品质", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "net_income_ttm / total_assets", ic: 0.035, ir: 1.32, icTstat: 2.95, turnover: 18, capacity: 200000, winRate: 57, ic60d: 0.033, ic120d: 0.031, createdAt: "2023-07-01", createdBy: "Vincent", tags: ["经典"] },
  { id: "gpm", name: "GPM", version: "v1.2", category: "品质", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "gross_profit_ttm / revenue_ttm", ic: 0.032, ir: 1.18, icTstat: 2.64, turnover: 14, capacity: 220000, winRate: 56, ic60d: 0.030, ic120d: 0.028, createdAt: "2023-08-15", createdBy: "Vincent", tags: ["盈利能力"] },
  { id: "accruals", name: "Accruals", version: "v1.0", category: "品质", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "LIVE_ACTIVE", expression: "-1 * (net_income_ttm - operating_cashflow_ttm) / total_assets", ic: -0.028, ir: -1.05, icTstat: -2.35, turnover: 12, capacity: 250000, winRate: 55, ic60d: -0.026, ic120d: -0.024, createdAt: "2024-01-01", createdBy: "Vincent", tags: ["应计异象"] },
  { id: "quality_composite", name: "品质综合", version: "v1.0", category: "品质", factorType: "composite", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "zscore(roe_ttm) + zscore(gpm) + zscore(accruals)", ic: 0.048, ir: 1.78, icTstat: 3.98, turnover: 16, capacity: 170000, winRate: 62, ic60d: 0.046, ic120d: 0.044, createdAt: "2024-05-01", createdBy: "Vincent", tags: ["复合", "核心"] },
  { id: "debt_equity", name: "D/E", version: "v1.0", category: "品质", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "PROBATION", expression: "-1 * total_debt / equity", ic: -0.010, ir: -0.35, icTstat: -0.78, turnover: 10, capacity: 280000, winRate: 47, ic60d: -0.015, ic120d: -0.022, createdAt: "2024-03-01", createdBy: "Vincent", tags: ["杠杆", "衰减中"] },

  // ── 流动性 (Liquidity) ── 4 factors
  { id: "illiq", name: "Illiq", version: "v1.0", category: "流动性", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "LIVE_ACTIVE", expression: "-1 * ts_mean(abs(return) / volume_amount, 20)", ic: -0.037, ir: -1.38, icTstat: -3.09, turnover: 12, capacity: 150000, winRate: 58, ic60d: -0.035, ic120d: -0.033, createdAt: "2023-12-01", createdBy: "Vincent", tags: ["Amihud"] },
  { id: "amihud", name: "Amihud", version: "v2.0", category: "流动性", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "LIVE_ACTIVE", expression: "-1 * ts_mean(abs(return) / turnover_rate, 20)", ic: -0.033, ir: -1.22, icTstat: -2.73, turnover: 11, capacity: 160000, winRate: 57, ic60d: -0.031, ic120d: -0.029, createdAt: "2023-12-01", createdBy: "Vincent", tags: ["经典"] },
  { id: "turnover_rate", name: "Turn_Rate", version: "v1.0", category: "流动性", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "PAPER_TEST", expression: "-1 * ts_mean(volume / float_shares, 20)", ic: -0.025, ir: -0.92, icTstat: -2.06, turnover: 30, capacity: 100000, winRate: 54, ic60d: -0.023, ic120d: -0.021, createdAt: "2024-09-15", createdBy: "Researcher_A", tags: ["换手"] },
  { id: "liq_composite", name: "流动综合", version: "v1.0", category: "流动性", factorType: "composite", expectedDirection: "negative", source: "manual", status: "LIVE_ACTIVE", expression: "zscore(illiq) + zscore(amihud)", ic: -0.042, ir: -1.55, icTstat: -3.47, turnover: 11, capacity: 140000, winRate: 60, ic60d: -0.040, ic120d: -0.038, createdAt: "2024-06-01", createdBy: "Vincent", tags: ["复合"] },

  // ── 波动度 (Volatility) ── 5 factors
  { id: "vol_20d", name: "Vol_20D", version: "v1.0", category: "波动度", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "LIVE_ACTIVE", expression: "-1 * ts_std(return, 20)", ic: -0.045, ir: -1.68, icTstat: -3.76, turnover: 28, capacity: 120000, winRate: 61, ic60d: -0.043, ic120d: -0.041, createdAt: "2023-09-01", createdBy: "Vincent", tags: ["经典", "核心"] },
  { id: "ivol", name: "IVOL", version: "v1.2", category: "波动度", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "LIVE_ACTIVE", expression: "-1 * ts_std(residual_return, 20)", ic: -0.052, ir: -1.92, icTstat: -4.30, turnover: 25, capacity: 130000, winRate: 63, ic60d: -0.050, ic120d: -0.048, createdAt: "2023-10-01", createdBy: "Vincent", tags: ["特质波动", "核心"] },
  { id: "beta", name: "Beta", version: "v1.0", category: "波动度", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "PROBATION", expression: "-1 * ts_cov(return, market_return, 60) / ts_var(market_return, 60)", ic: -0.012, ir: -0.42, icTstat: -0.94, turnover: 22, capacity: 200000, winRate: 48, ic60d: -0.018, ic120d: -0.025, createdAt: "2024-04-01", createdBy: "Vincent", tags: ["贝塔", "衰减中"] },
  { id: "skew_20d", name: "Skew_20D", version: "v1.0", category: "波动度", factorType: "leaf", expectedDirection: "negative", source: "mining_pysr", status: "INCUBATING", expression: "-1 * ts_skew(return, 20)", ic: -0.016, ir: -0.55, icTstat: -1.23, turnover: 32, capacity: 100000, winRate: 50, ic60d: -0.014, ic120d: -0.012, createdAt: "2025-01-15", createdBy: "Mining_PySR", tags: ["高阶矩"] },
  { id: "vol_regime", name: "Vol_Regime", version: "v1.0", category: "波动度", factorType: "composite", expectedDirection: "negative", source: "mining_llm", status: "INCUBATING", expression: "-1 * vol_20d * hmm_state_prob(high_vol)", ic: -0.020, ir: -0.72, icTstat: -1.61, turnover: 30, capacity: 90000, winRate: 52, ic60d: -0.018, ic120d: -0.015, createdAt: "2025-02-05", createdBy: "LLM_Alpha", tags: ["条件波动", "实验性"] },

  // ── 规模 (Size) ── 4 factors
  { id: "size", name: "Size", version: "v1.0", category: "规模", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "LIVE_ACTIVE", expression: "-1 * log(market_cap)", ic: -0.028, ir: -1.05, icTstat: -2.35, turnover: 8, capacity: 500000, winRate: 55, ic60d: -0.026, ic120d: -0.024, createdAt: "2023-06-01", createdBy: "Vincent", tags: ["经典", "小盘效应"] },
  { id: "float_size", name: "Float_Size", version: "v1.0", category: "规模", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "LIVE_ACTIVE", expression: "-1 * log(float_market_cap)", ic: -0.032, ir: -1.18, icTstat: -2.64, turnover: 9, capacity: 450000, winRate: 56, ic60d: -0.030, ic120d: -0.028, createdAt: "2023-06-01", createdBy: "Vincent", tags: ["流通盘"] },
  { id: "nonlinear_size", name: "NL_Size", version: "v1.0", category: "规模", factorType: "composite", expectedDirection: "negative", source: "mining_gplearn", status: "PAPER_TEST", expression: "-1 * (log(market_cap))^3 / zscore(log(market_cap))", ic: -0.035, ir: -1.28, icTstat: -2.87, turnover: 10, capacity: 380000, winRate: 57, ic60d: -0.033, ic120d: -0.031, createdAt: "2024-07-20", createdBy: "Mining_v1", tags: ["非线性"] },
  { id: "size_retired", name: "Size_v0", version: "v0.1", category: "规模", factorType: "leaf", expectedDirection: "negative", source: "manual", status: "RETIRED", expression: "-1 * market_cap", ic: -0.005, ir: -0.18, icTstat: -0.40, turnover: 8, capacity: 480000, winRate: 47, ic60d: -0.003, ic120d: -0.008, createdAt: "2023-01-01", createdBy: "Vincent", tags: ["已退役", "未对数化"] },

  // ── 情绪 (Sentiment) ── 9 factors
  { id: "sue", name: "SUE", version: "v2.0", category: "情绪", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "(eps_actual - eps_estimate) / ts_std(eps_surprise, 8)", ic: 0.061, ir: 2.28, icTstat: 5.10, turnover: 35, capacity: 80000, winRate: 66, ic60d: 0.058, ic120d: 0.055, createdAt: "2023-05-01", createdBy: "Vincent", tags: ["经典", "核心", "最强"] },
  { id: "analyst_rev", name: "Analyst_Rev", version: "v1.5", category: "情绪", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "analyst_upgrade_ratio - analyst_downgrade_ratio", ic: 0.048, ir: 1.78, icTstat: 3.98, turnover: 30, capacity: 90000, winRate: 62, ic60d: 0.046, ic120d: 0.044, createdAt: "2023-11-15", createdBy: "Vincent", tags: ["分析师"] },
  { id: "eps_rev", name: "EPS_Rev", version: "v1.0", category: "情绪", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "consensus_eps_now / consensus_eps_30d_ago - 1", ic: 0.055, ir: 2.05, icTstat: 4.59, turnover: 32, capacity: 85000, winRate: 64, ic60d: 0.052, ic120d: 0.050, createdAt: "2023-12-01", createdBy: "Vincent", tags: ["一致预期"] },
  { id: "north_flow", name: "North_Flow", version: "v1.0", category: "情绪", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "ts_sum(north_net_buy / float_market_cap, 20)", ic: 0.038, ir: 1.42, icTstat: 3.18, turnover: 40, capacity: 100000, winRate: 58, ic60d: 0.035, ic120d: 0.032, createdAt: "2024-02-01", createdBy: "Vincent", tags: ["聪明钱", "北向"] },
  { id: "main_flow", name: "Main_Flow", version: "v1.0", category: "情绪", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "PAPER_TEST", expression: "ts_sum(main_net_inflow / volume_amount, 10)", ic: 0.022, ir: 0.82, icTstat: 1.84, turnover: 48, capacity: 60000, winRate: 53, ic60d: 0.024, ic120d: 0.020, createdAt: "2024-10-01", createdBy: "Researcher_A", tags: ["主力资金"] },
  { id: "sentiment_llm", name: "LLM_Sent", version: "v0.1", category: "情绪", factorType: "leaf", expectedDirection: "positive", source: "mining_llm", status: "INCUBATING", expression: "llm_sentiment_score(news_7d)", ic: 0.015, ir: 0.48, icTstat: 1.07, turnover: 50, capacity: 40000, winRate: 51, ic60d: 0.018, ic120d: 0.012, createdAt: "2025-02-10", createdBy: "LLM_Alpha", tags: ["LLM", "实验性"] },
  { id: "insider_buy", name: "Insider_Buy", version: "v1.0", category: "情绪", factorType: "leaf", expectedDirection: "positive", source: "manual", status: "RETIRED", expression: "insider_net_buy_30d / float_market_cap", ic: 0.008, ir: 0.28, icTstat: 0.63, turnover: 15, capacity: 120000, winRate: 49, ic60d: 0.005, ic120d: 0.010, createdAt: "2023-03-01", createdBy: "Vincent", tags: ["内部人交易", "已退役"] },
  { id: "sentiment_composite", name: "情绪综合", version: "v1.0", category: "情绪", factorType: "composite", expectedDirection: "positive", source: "manual", status: "LIVE_ACTIVE", expression: "0.4*zscore(sue) + 0.3*zscore(eps_rev) + 0.3*zscore(analyst_rev)", ic: 0.062, ir: 2.32, icTstat: 5.19, turnover: 30, capacity: 70000, winRate: 67, ic60d: 0.060, ic120d: 0.058, createdAt: "2024-06-01", createdBy: "Vincent", tags: ["复合", "核心", "最强"] },
  { id: "gp_sent", name: "GP_Sent", version: "v1.0", category: "情绪", factorType: "composite", expectedDirection: "positive", source: "mining_gplearn", status: "PAPER_TEST", expression: "sqrt(abs(sue)) * sign(analyst_rev) * log1p(abs(north_flow))", ic: 0.030, ir: 1.08, icTstat: 2.42, turnover: 38, capacity: 55000, winRate: 55, ic60d: 0.032, ic120d: 0.028, createdAt: "2024-12-01", createdBy: "Mining_v2", tags: ["挖掘", "可解释性待验"] },
];

// ─── Default Benchmark Config ───────────────────────────

const DEFAULT_BENCHMARK_CONFIG: BenchmarkConfig = {
  universe: "全A",
  icMethod: "RankIC",
  winsorization: "MAD",
  rebalanceDays: 5,
  quantiles: 5,
};

/** Generate IC decay profile: IC at lag T+1 to T+20 */
function generateICDecayProfile(
  baseIC: number,
  seed: number,
): number[] {
  const rand = createSeededRandom(seed);
  const absIC = Math.abs(baseIC);
  // Decay rate between 3-7% per lag step
  const decayRate = 0.03 + rand() * 0.04;
  const profile: number[] = [];
  for (let lag = 1; lag <= 20; lag++) {
    const decay = absIC * (1 - decayRate) ** lag;
    const noise = (rand() - 0.5) * absIC * 0.1;
    const value = (decay + noise) * Math.sign(baseIC);
    profile.push(Math.round(value * 10000) / 10000);
  }
  return profile;
}

// ─── Universe IC Multipliers (domain-calibrated) ─────────

/**
 * 9 类因子 × 4 池的 IC 乘数 (领域校准)
 *
 * 设计依据:
 * - 规模因子在小盘池 (中证1000) IC 最高, 大盘池 (沪深300) 几乎无效
 * - 价值/品质/股息率因子在大盘池表现好 (大盘价值因子拥挤度低)
 * - 动能/波动度/流动性因子在中小盘池更有效 (交易行为差异)
 * - 全A = 基准 1.0 (各池 IC = 全A IC × multiplier ± noise)
 */
const UNIVERSE_MULTIPLIERS: Record<FactorCategory, Record<UniversePool, number>> = {
  规模:   { "全A": 1.0, "沪深300": 0.3, "中证500": 0.8, "中证1000": 1.4 },
  价值:   { "全A": 1.0, "沪深300": 1.2, "中证500": 0.9, "中证1000": 0.7 },
  动能:   { "全A": 1.0, "沪深300": 0.7, "中证500": 1.3, "中证1000": 1.1 },
  品质:   { "全A": 1.0, "沪深300": 1.3, "中证500": 0.9, "中证1000": 0.6 },
  波动度: { "全A": 1.0, "沪深300": 0.6, "中证500": 0.9, "中证1000": 1.3 },
  流动性: { "全A": 1.0, "沪深300": 0.5, "中证500": 0.9, "中证1000": 1.4 },
  情绪:   { "全A": 1.0, "沪深300": 0.8, "中证500": 1.1, "中证1000": 1.2 },
  股息率: { "全A": 1.0, "沪深300": 1.3, "中证500": 0.8, "中证1000": 0.5 },
  成长:   { "全A": 1.0, "沪深300": 0.9, "中证500": 1.1, "中证1000": 1.0 },
};

/** Generate pre-computed IC/IR for each standard universe pool */
function generateUniverseProfile(
  baseIC: number,
  baseIR: number,
  category: FactorCategory,
  seed: number,
): UniverseIC[] {
  const rand = createSeededRandom(seed);
  const multipliers = UNIVERSE_MULTIPLIERS[category];
  return UNIVERSE_POOLS.map((pool) => {
    const m = multipliers[pool];
    const icNoise = 1 + (rand() - 0.5) * 0.30; // ±15%
    const irNoise = 1 + (rand() - 0.5) * 0.25; // ±12.5%
    return {
      universe: pool,
      ic: Math.round(baseIC * m * icNoise * 10000) / 10000,
      ir: Math.round(baseIR * m * irNoise * 100) / 100,
    };
  });
}

// ─── Robustness & Valuation Generators ──────────────────

/** Generate Rank Test retention: stronger factors tend to have higher retention */
function generateRankTestRetention(baseIC: number, seed: number): number {
  const rand = createSeededRandom(seed * 9371 + 41);
  // Base retention correlates with |IC| strength: higher IC → more likely to be robust
  const icStrength = Math.min(Math.abs(baseIC) / 0.05, 1); // normalize to [0,1]
  const base = 0.4 + icStrength * 0.35; // range: 0.4-0.75 based on IC
  const noise = (rand() - 0.5) * 0.3; // ±0.15 noise
  return Math.round(Math.max(0.2, Math.min(0.95, base + noise)) * 100) / 100;
}

/** Generate Binary Test retention: typically lower than rank test */
function generateBinaryTestRetention(rankRetention: number, seed: number): number {
  const rand = createSeededRandom(seed * 5279 + 67);
  const ratio = 0.65 + rand() * 0.30; // binary is 65-95% of rank retention
  return Math.round(Math.max(0.15, Math.min(0.90, rankRetention * ratio)) * 100) / 100;
}

/** Generate V-Score: (IC_current - IC_5yr_mean) / IC_5yr_std */
function generateVScore(_baseIC: number, seed: number): number {
  const rand = createSeededRandom(seed * 7723 + 89);
  // Most factors cluster near 0 (normal), some outliers at ±1.5
  // Use a roughly normal distribution via Box-Muller-ish approach
  const u1 = rand();
  const u2 = rand();
  const z = Math.sqrt(-2 * Math.log(Math.max(u1, 0.001))) * Math.cos(2 * Math.PI * u2);
  // Scale to reasonable range [-2, 2] and clamp
  const vScore = Math.max(-2, Math.min(2, z * 0.8));
  return Math.round(vScore * 100) / 100;
}

// ─── Build Full Factor Objects ───────────────────────────

function buildFactor(seed: FactorSeed, index: number): Factor {
  const icVol = Math.abs(seed.ic) * 0.6 + 0.005;
  const icTimeSeries = generateICSparkline(240, seed.ic, icVol, index * 4219 + 99);
  const rankTestRetention = generateRankTestRetention(seed.ic, index);
  const binaryTestRetention = generateBinaryTestRetention(rankTestRetention, index);
  return {
    ...seed,
    expression: seed.expression,
    icTrend: generateICSparkline(30, seed.ic, icVol, index * 7919 + 42),
    quantileReturns: generateQuantileReturns(
      seed.ic,
      seed.expectedDirection,
      index * 3571 + 17,
    ),
    icTimeSeries,
    benchmarkConfig: DEFAULT_BENCHMARK_CONFIG,
    icDistribution: computeICStats(icTimeSeries),
    icDecayProfile: generateICDecayProfile(seed.ic, index * 6131 + 73),
    universeProfile: generateUniverseProfile(seed.ic, seed.ir, seed.category, index * 8837 + 53),
    rankTestRetention,
    binaryTestRetention,
    vScore: generateVScore(seed.ic, index),
    statusHistory: [],
  };
}

// ─── Public API ──────────────────────────────────────────

let _cachedFactors: Factor[] | null = null;

export function getLibraryFactors(): Factor[] {
  if (_cachedFactors) return _cachedFactors;
  _cachedFactors = FACTOR_SEEDS.map((seed, i) => buildFactor(seed, i));
  return _cachedFactors;
}

/** Summary statistics for the library */
export interface LibrarySummary {
  totalFactors: number;
  liveCount: number;
  paperTestCount: number;
  incubatingCount: number;
  probationCount: number;
  retiredCount: number;
  avgIC: number;
  avgIR: number;
}

export function getLibrarySummary(factors: Factor[]): LibrarySummary {
  const liveFactors = factors.filter((f) => f.status === "LIVE_ACTIVE");
  return {
    totalFactors: factors.length,
    liveCount: liveFactors.length,
    paperTestCount: factors.filter((f) => f.status === "PAPER_TEST").length,
    incubatingCount: factors.filter((f) => f.status === "INCUBATING").length,
    probationCount: factors.filter((f) => f.status === "PROBATION").length,
    retiredCount: factors.filter((f) => f.status === "RETIRED").length,
    avgIC:
      liveFactors.length > 0
        ? Math.round(
            (liveFactors.reduce((sum, f) => sum + Math.abs(f.ic), 0) /
              liveFactors.length) *
              1000,
          ) / 1000
        : 0,
    avgIR:
      liveFactors.length > 0
        ? Math.round(
            (liveFactors.reduce((sum, f) => sum + Math.abs(f.ir), 0) /
              liveFactors.length) *
              100,
          ) / 100
        : 0,
  };
}
