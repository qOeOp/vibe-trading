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
  ConfigSliceStatus,
  FactorCategory,
  FactorLifecycleStatus,
  FactorType,
  FactorSource,
  FactorDirection,
  UniverseIC,
  UniversePool,
} from '../types';
import { UNIVERSE_POOLS, HORIZON_KEYS, getConfigKey } from '../types';
import { computeICStats } from '../utils/compute-ic-stats';

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

  if (direction === 'positive') {
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
  hypothesis: string;
}

const FACTOR_SEEDS: FactorSeed[] = [
  // ── 动能 (Momentum) ── 6 factors
  {
    id: 'mom_20d',
    name: 'Mom_20D',
    version: 'v2.1',
    category: '动能',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.038,
    ir: 1.42,
    icTstat: 3.18,
    turnover: 42,
    capacity: 80000,
    winRate: 58,
    ic60d: 0.035,
    ic120d: 0.032,
    createdAt: '2024-03-15',
    createdBy: 'Vincent',
    tags: ['经典', '中频'],
    hypothesis:
      '过去20日收益率均值捕捉中期动量效应。假设近期表现好的股票在短期内具有趋势延续性，源于投资者反应不足和信息渐进扩散。',
  },
  {
    id: 'mom_60d',
    name: 'Mom_60D',
    version: 'v1.0',
    category: '动能',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'PAPER_TEST',
    ic: 0.022,
    ir: 0.78,
    icTstat: 1.75,
    turnover: 28,
    capacity: 120000,
    winRate: 53,
    ic60d: 0.025,
    ic120d: 0.02,
    createdAt: '2024-09-01',
    createdBy: 'Vincent',
    tags: ['低频'],
    hypothesis:
      '60日价格动量反映中长期趋势。假设机构持仓调整的滞后性导致季度级别的动量溢价持续存在。',
  },
  {
    id: 'rev_5d',
    name: 'Rev_5D',
    version: 'v1.3',
    category: '动能',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: -0.041,
    ir: -1.55,
    icTstat: -3.47,
    turnover: 55,
    capacity: 50000,
    winRate: 60,
    ic60d: -0.038,
    ic120d: -0.035,
    createdAt: '2024-01-10',
    createdBy: 'Vincent',
    tags: ['短期反转', '高频'],
    hypothesis:
      '5日短期反转因子。假设散户主导的短期过度反应会在一周内均值回归，流动性冲击消退后价格回归基本面。',
  },
  {
    id: 'rsi_14',
    name: 'RSI_14',
    version: 'v1.0',
    category: '动能',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'INCUBATING',
    ic: -0.018,
    ir: -0.62,
    icTstat: -1.39,
    turnover: 38,
    capacity: 90000,
    winRate: 50,
    ic60d: -0.015,
    ic120d: -0.012,
    createdAt: '2025-01-20',
    createdBy: 'Researcher_A',
    tags: ['技术指标'],
    hypothesis:
      '14日RSI相对强弱指标的反转信号。假设RSI极端值反映短期情绪过热，后续存在均值回归的统计规律。',
  },
  {
    id: 'macd_diff',
    name: 'MACD_Diff',
    version: 'v1.1',
    category: '动能',
    factorType: 'composite',
    expectedDirection: 'positive',
    source: 'mining_gplearn',
    status: 'PROBATION',
    ic: 0.012,
    ir: 0.38,
    icTstat: 0.85,
    turnover: 45,
    capacity: 70000,
    winRate: 48,
    ic60d: 0.018,
    ic120d: 0.025,
    createdAt: '2024-06-20',
    createdBy: 'Mining_v1',
    tags: ['技术指标', '衰减中'],
    hypothesis:
      'MACD差值因子，捕捉快慢均线交叉信号。假设EMA(12)与EMA(26)的背离包含动量方向变化的前瞻信息。',
  },
  {
    id: 'mom_composite',
    name: '动能综合',
    version: 'v1.0',
    category: '动能',
    factorType: 'composite',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.045,
    ir: 1.68,
    icTstat: 3.76,
    turnover: 35,
    capacity: 60000,
    winRate: 62,
    ic60d: 0.042,
    ic120d: 0.04,
    createdAt: '2024-04-01',
    createdBy: 'Vincent',
    tags: ['复合', '核心'],
    hypothesis:
      '多动量信号综合因子。假设不同时间尺度的动量信号互补，组合后信噪比显著提升，且单因子极端回撤被对冲。',
  },

  // ── 股息率 (Dividend) ── 4 factors
  {
    id: 'dp',
    name: 'DP',
    version: 'v2.0',
    category: '股息率',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.035,
    ir: 1.28,
    icTstat: 2.87,
    turnover: 8,
    capacity: 300000,
    winRate: 57,
    ic60d: 0.033,
    ic120d: 0.031,
    createdAt: '2023-11-01',
    createdBy: 'Vincent',
    tags: ['经典', '低换手'],
    hypothesis:
      'TTM股息率因子。假设高股息股票在A股具有防御性溢价，尤其在市场下行期提供安全边际，吸引险资等长期资金。',
  },
  {
    id: 'dp_growth',
    name: 'DP_Growth',
    version: 'v1.0',
    category: '股息率',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'PAPER_TEST',
    ic: 0.028,
    ir: 0.95,
    icTstat: 2.13,
    turnover: 6,
    capacity: 350000,
    winRate: 55,
    ic60d: 0.03,
    ic120d: 0.026,
    createdAt: '2024-10-15',
    createdBy: 'Researcher_A',
    tags: ['成长型股息'],
    hypothesis:
      '股息率增长因子。假设股息率提升的股票反映公司盈利能力改善和管理层对未来现金流的信心。',
  },
  {
    id: 'dp_stability',
    name: 'DP_Stab',
    version: 'v1.1',
    category: '股息率',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.031,
    ir: 1.15,
    icTstat: 2.57,
    turnover: 5,
    capacity: 400000,
    winRate: 56,
    ic60d: 0.029,
    ic120d: 0.028,
    createdAt: '2024-02-20',
    createdBy: 'Vincent',
    tags: ['稳定性'],
    hypothesis:
      '股息率稳定性因子。假设股息波动小的公司经营稳健，适合作为底仓配置，在震荡市中提供超额收益。',
  },
  {
    id: 'dp_retired',
    name: 'DP_Old',
    version: 'v1.0',
    category: '股息率',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'RETIRED',
    ic: 0.008,
    ir: 0.25,
    icTstat: 0.56,
    turnover: 7,
    capacity: 320000,
    winRate: 49,
    ic60d: 0.005,
    ic120d: 0.01,
    createdAt: '2023-06-01',
    createdBy: 'Vincent',
    tags: ['已退役'],
    hypothesis:
      '年度股息率因子（已退役）。使用年度数据频率太低，信息时效性不足，被TTM版本替代。',
  },

  // ── 价值 (Value) ── 7 factors
  {
    id: 'ep',
    name: 'EP',
    version: 'v3.0',
    category: '价值',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.052,
    ir: 1.85,
    icTstat: 4.14,
    turnover: 18,
    capacity: 200000,
    winRate: 63,
    ic60d: 0.05,
    ic120d: 0.048,
    createdAt: '2023-08-01',
    createdBy: 'Vincent',
    tags: ['经典', '核心'],
    hypothesis:
      '盈利收益率(EP)因子。假设低PE(高EP)股票被市场低估，长期存在价值回归的超额收益，是A股最经典的价值因子。',
  },
  {
    id: 'bp',
    name: 'BP',
    version: 'v2.0',
    category: '价值',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.041,
    ir: 1.52,
    icTstat: 3.4,
    turnover: 15,
    capacity: 250000,
    winRate: 59,
    ic60d: 0.039,
    ic120d: 0.037,
    createdAt: '2023-08-01',
    createdBy: 'Vincent',
    tags: ['经典'],
    hypothesis:
      '净资产收益率因子。假设低PB(高BP)股票具有安全边际，资产重估和均值回归带来长期超额收益。',
  },
  {
    id: 'sp',
    name: 'SP',
    version: 'v1.2',
    category: '价值',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.039,
    ir: 1.45,
    icTstat: 3.25,
    turnover: 17,
    capacity: 220000,
    winRate: 58,
    ic60d: 0.037,
    ic120d: 0.035,
    createdAt: '2023-09-15',
    createdBy: 'Vincent',
    tags: ['经典'],
    hypothesis:
      '营收价格比因子。假设高SP股票的营收被市场低估，相比EP更难被盈余管理操纵。',
  },
  {
    id: 'cfop',
    name: 'CFOP',
    version: 'v2.1',
    category: '价值',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.044,
    ir: 1.62,
    icTstat: 3.63,
    turnover: 16,
    capacity: 180000,
    winRate: 61,
    ic60d: 0.042,
    ic120d: 0.04,
    createdAt: '2023-10-01',
    createdBy: 'Vincent',
    tags: ['现金流'],
    hypothesis:
      '经营现金流价格比因子。假设高现金流产出的公司盈利质量更高，被市场系统性低估。',
  },
  {
    id: 'ev_ebitda',
    name: 'EV_EBITDA',
    version: 'v1.0',
    category: '价值',
    factorType: 'composite',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'PAPER_TEST',
    ic: -0.033,
    ir: -1.22,
    icTstat: -2.73,
    turnover: 14,
    capacity: 190000,
    winRate: 56,
    ic60d: -0.031,
    ic120d: -0.029,
    createdAt: '2024-11-01',
    createdBy: 'Researcher_A',
    tags: ['企业价值'],
    hypothesis:
      'EV/EBITDA因子。假设低企业价值倍数反映市场对公司盈利能力的低估，且EBITDA剔除了资本结构差异。',
  },
  {
    id: 'value_composite',
    name: '价值综合',
    version: 'v2.0',
    category: '价值',
    factorType: 'composite',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.058,
    ir: 2.15,
    icTstat: 4.81,
    turnover: 15,
    capacity: 160000,
    winRate: 65,
    ic60d: 0.055,
    ic120d: 0.053,
    createdAt: '2024-01-15',
    createdBy: 'Vincent',
    tags: ['复合', '核心'],
    hypothesis:
      '多价值信号综合因子。假设EP/BP/CFOP三维度互补覆盖不同价值陷阱，组合后稳定性显著优于单因子。',
  },
  {
    id: 'peg',
    name: 'PEG',
    version: 'v1.0',
    category: '价值',
    factorType: 'composite',
    expectedDirection: 'negative',
    source: 'mining_gplearn',
    status: 'INCUBATING',
    ic: -0.019,
    ir: -0.68,
    icTstat: -1.52,
    turnover: 20,
    capacity: 150000,
    winRate: 51,
    ic60d: -0.017,
    ic120d: -0.015,
    createdAt: '2025-02-01',
    createdBy: 'Mining_v2',
    tags: ['价值成长'],
    hypothesis:
      'PEG因子。假设结合估值与成长的PEG指标能有效区分便宜有道理和真正低估的股票。',
  },

  // ── 成长 (Growth) ── 5 factors
  {
    id: 'revenue_yoy',
    name: 'Rev_YoY',
    version: 'v1.0',
    category: '成长',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.036,
    ir: 1.32,
    icTstat: 2.95,
    turnover: 22,
    capacity: 150000,
    winRate: 57,
    ic60d: 0.034,
    ic120d: 0.032,
    createdAt: '2024-01-01',
    createdBy: 'Vincent',
    tags: ['基础'],
    hypothesis:
      '营收同比增长率因子。假设持续增长的营收反映公司竞争优势，市场对成长持续性定价不足。',
  },
  {
    id: 'roe_yoy',
    name: 'ROE_YoY',
    version: 'v1.1',
    category: '成长',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.033,
    ir: 1.18,
    icTstat: 2.64,
    turnover: 19,
    capacity: 170000,
    winRate: 56,
    ic60d: 0.031,
    ic120d: 0.029,
    createdAt: '2024-02-01',
    createdBy: 'Vincent',
    tags: ['盈利改善'],
    hypothesis:
      'ROE同比改善因子。假设盈利能力边际改善的公司被市场低估，改善趋势具有持续性。',
  },
  {
    id: 'earnings_accel',
    name: 'Earn_Accel',
    version: 'v1.0',
    category: '成长',
    factorType: 'composite',
    expectedDirection: 'positive',
    source: 'mining_gplearn',
    status: 'PAPER_TEST',
    ic: 0.025,
    ir: 0.88,
    icTstat: 1.97,
    turnover: 25,
    capacity: 130000,
    winRate: 54,
    ic60d: 0.027,
    ic120d: 0.023,
    createdAt: '2024-08-15',
    createdBy: 'Mining_v1',
    tags: ['加速'],
    hypothesis:
      '盈利加速因子。假设盈利增速的二阶导数包含前瞻信息，加速改善的公司超额收益更显著。',
  },
  {
    id: 'sg_composite',
    name: '成长综合',
    version: 'v1.0',
    category: '成长',
    factorType: 'composite',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.04,
    ir: 1.48,
    icTstat: 3.31,
    turnover: 20,
    capacity: 140000,
    winRate: 59,
    ic60d: 0.038,
    ic120d: 0.036,
    createdAt: '2024-03-01',
    createdBy: 'Vincent',
    tags: ['复合'],
    hypothesis:
      '成长综合因子。假设营收增长与盈利改善双维度互补，综合后降低单一财务指标的噪音。',
  },
  {
    id: 'capex_growth',
    name: 'Capex_G',
    version: 'v1.0',
    category: '成长',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'INCUBATING',
    ic: 0.015,
    ir: 0.52,
    icTstat: 1.16,
    turnover: 16,
    capacity: 180000,
    winRate: 51,
    ic60d: 0.018,
    ic120d: 0.013,
    createdAt: '2025-01-05',
    createdBy: 'Researcher_A',
    tags: ['另类'],
    hypothesis:
      '资本开支增长因子。假设CAPEX增长反映管理层对未来投资机会的判断，市场对此定价滞后。',
  },

  // ── 品质 (Quality) ── 6 factors
  {
    id: 'roe_ttm',
    name: 'ROE_TTM',
    version: 'v2.0',
    category: '品质',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.042,
    ir: 1.55,
    icTstat: 3.47,
    turnover: 20,
    capacity: 180000,
    winRate: 60,
    ic60d: 0.04,
    ic120d: 0.038,
    createdAt: '2023-07-01',
    createdBy: 'Vincent',
    tags: ['经典', '核心'],
    hypothesis:
      'ROE_TTM盈利能力因子。假设高ROE公司具有持续的竞争壁垒，盈利能力持续性带来长期超额收益。',
  },
  {
    id: 'roa_ttm',
    name: 'ROA_TTM',
    version: 'v1.0',
    category: '品质',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.035,
    ir: 1.32,
    icTstat: 2.95,
    turnover: 18,
    capacity: 200000,
    winRate: 57,
    ic60d: 0.033,
    ic120d: 0.031,
    createdAt: '2023-07-01',
    createdBy: 'Vincent',
    tags: ['经典'],
    hypothesis:
      'ROA_TTM资产回报因子。假设高资产回报率反映公司资产利用效率高，且不受杠杆率影响。',
  },
  {
    id: 'gpm',
    name: 'GPM',
    version: 'v1.2',
    category: '品质',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.032,
    ir: 1.18,
    icTstat: 2.64,
    turnover: 14,
    capacity: 220000,
    winRate: 56,
    ic60d: 0.03,
    ic120d: 0.028,
    createdAt: '2023-08-15',
    createdBy: 'Vincent',
    tags: ['盈利能力'],
    hypothesis:
      '毛利率因子。假设高毛利率反映公司在产业链中的议价能力和产品差异化程度。',
  },
  {
    id: 'accruals',
    name: 'Accruals',
    version: 'v1.0',
    category: '品质',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: -0.028,
    ir: -1.05,
    icTstat: -2.35,
    turnover: 12,
    capacity: 250000,
    winRate: 55,
    ic60d: -0.026,
    ic120d: -0.024,
    createdAt: '2024-01-01',
    createdBy: 'Vincent',
    tags: ['应计异象'],
    hypothesis:
      '应计异象因子。假设高应计比例预示未来盈利下降，现金流质量差的公司股价被高估。',
  },
  {
    id: 'quality_composite',
    name: '品质综合',
    version: 'v1.0',
    category: '品质',
    factorType: 'composite',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.048,
    ir: 1.78,
    icTstat: 3.98,
    turnover: 16,
    capacity: 170000,
    winRate: 62,
    ic60d: 0.046,
    ic120d: 0.044,
    createdAt: '2024-05-01',
    createdBy: 'Vincent',
    tags: ['复合', '核心'],
    hypothesis:
      '品质综合因子。假设ROE/毛利率/应计三维度互补评估公司质量，降低单指标噪音。',
  },
  {
    id: 'debt_equity',
    name: 'D/E',
    version: 'v1.0',
    category: '品质',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'PROBATION',
    ic: -0.01,
    ir: -0.35,
    icTstat: -0.78,
    turnover: 10,
    capacity: 280000,
    winRate: 47,
    ic60d: -0.015,
    ic120d: -0.022,
    createdAt: '2024-03-01',
    createdBy: 'Vincent',
    tags: ['杠杆', '衰减中'],
    hypothesis:
      '杠杆因子。假设低杠杆公司财务风险小，在市场波动加剧时表现更好。',
  },

  // ── 流动性 (Liquidity) ── 4 factors
  {
    id: 'illiq',
    name: 'Illiq',
    version: 'v1.0',
    category: '流动性',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: -0.037,
    ir: -1.38,
    icTstat: -3.09,
    turnover: 12,
    capacity: 150000,
    winRate: 58,
    ic60d: -0.035,
    ic120d: -0.033,
    createdAt: '2023-12-01',
    createdBy: 'Vincent',
    tags: ['Amihud'],
    hypothesis:
      'Amihud非流动性因子。假设低流动性股票承担流动性风险溢价，长期超额收益补偿持有者的交易成本。',
  },
  {
    id: 'amihud',
    name: 'Amihud',
    version: 'v2.0',
    category: '流动性',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: -0.033,
    ir: -1.22,
    icTstat: -2.73,
    turnover: 11,
    capacity: 160000,
    winRate: 57,
    ic60d: -0.031,
    ic120d: -0.029,
    createdAt: '2023-12-01',
    createdBy: 'Vincent',
    tags: ['经典'],
    hypothesis:
      'Amihud流动性指标。假设价格冲击大的股票流动性风险高，要求更高的预期收益作为补偿。',
  },
  {
    id: 'turnover_rate',
    name: 'Turn_Rate',
    version: 'v1.0',
    category: '流动性',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'PAPER_TEST',
    ic: -0.025,
    ir: -0.92,
    icTstat: -2.06,
    turnover: 30,
    capacity: 100000,
    winRate: 54,
    ic60d: -0.023,
    ic120d: -0.021,
    createdAt: '2024-09-15',
    createdBy: 'Researcher_A',
    tags: ['换手'],
    hypothesis:
      '换手率因子。假设低换手率反映投资者意见一致性高，高换手率则意味着分歧大、投机性强。',
  },
  {
    id: 'liq_composite',
    name: '流动综合',
    version: 'v1.0',
    category: '流动性',
    factorType: 'composite',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: -0.042,
    ir: -1.55,
    icTstat: -3.47,
    turnover: 11,
    capacity: 140000,
    winRate: 60,
    ic60d: -0.04,
    ic120d: -0.038,
    createdAt: '2024-06-01',
    createdBy: 'Vincent',
    tags: ['复合'],
    hypothesis:
      '流动性综合因子。假设多维度流动性指标互补，比单一指标更稳健地捕捉流动性溢价。',
  },

  // ── 波动度 (Volatility) ── 5 factors
  {
    id: 'vol_20d',
    name: 'Vol_20D',
    version: 'v1.0',
    category: '波动度',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: -0.045,
    ir: -1.68,
    icTstat: -3.76,
    turnover: 28,
    capacity: 120000,
    winRate: 61,
    ic60d: -0.043,
    ic120d: -0.041,
    createdAt: '2023-09-01',
    createdBy: 'Vincent',
    tags: ['经典', '核心'],
    hypothesis:
      '20日实现波动率因子。假设低波动股票被机构偏好，且高波动股票被彩票偏好者高估。',
  },
  {
    id: 'ivol',
    name: 'IVOL',
    version: 'v1.2',
    category: '波动度',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: -0.052,
    ir: -1.92,
    icTstat: -4.3,
    turnover: 25,
    capacity: 130000,
    winRate: 63,
    ic60d: -0.05,
    ic120d: -0.048,
    createdAt: '2023-10-01',
    createdBy: 'Vincent',
    tags: ['特质波动', '核心'],
    hypothesis:
      '特质波动率因子(IVOL)。假设剔除市场因子后的残差波动包含公司特有的不确定性信息，高IVOL股票系统性被高估。',
  },
  {
    id: 'beta',
    name: 'Beta',
    version: 'v1.0',
    category: '波动度',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'PROBATION',
    ic: -0.012,
    ir: -0.42,
    icTstat: -0.94,
    turnover: 22,
    capacity: 200000,
    winRate: 48,
    ic60d: -0.018,
    ic120d: -0.025,
    createdAt: '2024-04-01',
    createdBy: 'Vincent',
    tags: ['贝塔', '衰减中'],
    hypothesis:
      'Beta因子。假设低Beta股票的风险调整收益更高(Security Market Line比预测更平坦)。',
  },
  {
    id: 'skew_20d',
    name: 'Skew_20D',
    version: 'v1.0',
    category: '波动度',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'mining_pysr',
    status: 'INCUBATING',
    ic: -0.016,
    ir: -0.55,
    icTstat: -1.23,
    turnover: 32,
    capacity: 100000,
    winRate: 50,
    ic60d: -0.014,
    ic120d: -0.012,
    createdAt: '2025-01-15',
    createdBy: 'Mining_PySR',
    tags: ['高阶矩'],
    hypothesis:
      '20日偏度因子。假设正偏度股票被投资者作为"彩票"高估，负偏度股票被低估。',
  },
  {
    id: 'vol_regime',
    name: 'Vol_Regime',
    version: 'v1.0',
    category: '波动度',
    factorType: 'composite',
    expectedDirection: 'negative',
    source: 'mining_llm',
    status: 'INCUBATING',
    ic: -0.02,
    ir: -0.72,
    icTstat: -1.61,
    turnover: 30,
    capacity: 90000,
    winRate: 52,
    ic60d: -0.018,
    ic120d: -0.015,
    createdAt: '2025-02-05',
    createdBy: 'LLM_Alpha',
    tags: ['条件波动', '实验性'],
    hypothesis:
      '条件波动率因子。假设HMM状态概率加权的波动率能区分持续高波和暂时冲击。',
  },

  // ── 规模 (Size) ── 4 factors
  {
    id: 'size',
    name: 'Size',
    version: 'v1.0',
    category: '规模',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: -0.028,
    ir: -1.05,
    icTstat: -2.35,
    turnover: 8,
    capacity: 500000,
    winRate: 55,
    ic60d: -0.026,
    ic120d: -0.024,
    createdAt: '2023-06-01',
    createdBy: 'Vincent',
    tags: ['经典', '小盘效应'],
    hypothesis:
      '对数市值因子。假设小盘股因流动性不足、分析师覆盖低而被系统性低估。',
  },
  {
    id: 'float_size',
    name: 'Float_Size',
    version: 'v1.0',
    category: '规模',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: -0.032,
    ir: -1.18,
    icTstat: -2.64,
    turnover: 9,
    capacity: 450000,
    winRate: 56,
    ic60d: -0.03,
    ic120d: -0.028,
    createdAt: '2023-06-01',
    createdBy: 'Vincent',
    tags: ['流通盘'],
    hypothesis:
      '流通市值因子。假设流通盘大小比总市值更准确反映股票的可交易性和机构容量约束。',
  },
  {
    id: 'nonlinear_size',
    name: 'NL_Size',
    version: 'v1.0',
    category: '规模',
    factorType: 'composite',
    expectedDirection: 'negative',
    source: 'mining_gplearn',
    status: 'PAPER_TEST',
    ic: -0.035,
    ir: -1.28,
    icTstat: -2.87,
    turnover: 10,
    capacity: 380000,
    winRate: 57,
    ic60d: -0.033,
    ic120d: -0.031,
    createdAt: '2024-07-20',
    createdBy: 'Mining_v1',
    tags: ['非线性'],
    hypothesis:
      '非线性规模因子。假设规模效应在极端小盘端更强，三次方变换捕捉非线性溢价。',
  },
  {
    id: 'size_retired',
    name: 'Size_v0',
    version: 'v0.1',
    category: '规模',
    factorType: 'leaf',
    expectedDirection: 'negative',
    source: 'manual',
    status: 'RETIRED',
    ic: -0.005,
    ir: -0.18,
    icTstat: -0.4,
    turnover: 8,
    capacity: 480000,
    winRate: 47,
    ic60d: -0.003,
    ic120d: -0.008,
    createdAt: '2023-01-01',
    createdBy: 'Vincent',
    tags: ['已退役', '未对数化'],
    hypothesis:
      '未对数化市值因子（已退役）。线性市值的截面分布严重右偏，因子单调性差。',
  },

  // ── 情绪 (Sentiment) ── 9 factors
  {
    id: 'sue',
    name: 'SUE',
    version: 'v2.0',
    category: '情绪',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.061,
    ir: 2.28,
    icTstat: 5.1,
    turnover: 35,
    capacity: 80000,
    winRate: 66,
    ic60d: 0.058,
    ic120d: 0.055,
    createdAt: '2023-05-01',
    createdBy: 'Vincent',
    tags: ['经典', '核心', '最强'],
    hypothesis:
      '标准化盈利惊喜(SUE)因子。假设超预期盈利后的价格漂移(PEAD)反映市场对新信息的渐进吸收。',
  },
  {
    id: 'analyst_rev',
    name: 'Analyst_Rev',
    version: 'v1.5',
    category: '情绪',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.048,
    ir: 1.78,
    icTstat: 3.98,
    turnover: 30,
    capacity: 90000,
    winRate: 62,
    ic60d: 0.046,
    ic120d: 0.044,
    createdAt: '2023-11-15',
    createdBy: 'Vincent',
    tags: ['分析师'],
    hypothesis:
      '分析师调级因子。假设卖方分析师的集体判断包含基本面前瞻信息，调升多于调降预示正面前景。',
  },
  {
    id: 'eps_rev',
    name: 'EPS_Rev',
    version: 'v1.0',
    category: '情绪',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.055,
    ir: 2.05,
    icTstat: 4.59,
    turnover: 32,
    capacity: 85000,
    winRate: 64,
    ic60d: 0.052,
    ic120d: 0.05,
    createdAt: '2023-12-01',
    createdBy: 'Vincent',
    tags: ['一致预期'],
    hypothesis:
      '一致预期修正因子。假设分析师群体上调盈利预测反映新的正面信息到达，市场对此定价滞后。',
  },
  {
    id: 'north_flow',
    name: 'North_Flow',
    version: 'v1.0',
    category: '情绪',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.038,
    ir: 1.42,
    icTstat: 3.18,
    turnover: 40,
    capacity: 100000,
    winRate: 58,
    ic60d: 0.035,
    ic120d: 0.032,
    createdAt: '2024-02-01',
    createdBy: 'Vincent',
    tags: ['聪明钱', '北向'],
    hypothesis:
      '北向资金净流入因子。假设外资(聪明钱)的选股行为包含对A股定价的增量信息。',
  },
  {
    id: 'main_flow',
    name: 'Main_Flow',
    version: 'v1.0',
    category: '情绪',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'PAPER_TEST',
    ic: 0.022,
    ir: 0.82,
    icTstat: 1.84,
    turnover: 48,
    capacity: 60000,
    winRate: 53,
    ic60d: 0.024,
    ic120d: 0.02,
    createdAt: '2024-10-01',
    createdBy: 'Researcher_A',
    tags: ['主力资金'],
    hypothesis:
      '主力资金流因子。假设大单净流入占比反映知情交易者的方向性判断。',
  },
  {
    id: 'sentiment_llm',
    name: 'LLM_Sent',
    version: 'v0.1',
    category: '情绪',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'mining_llm',
    status: 'INCUBATING',
    ic: 0.015,
    ir: 0.48,
    icTstat: 1.07,
    turnover: 50,
    capacity: 40000,
    winRate: 51,
    ic60d: 0.018,
    ic120d: 0.012,
    createdAt: '2025-02-10',
    createdBy: 'LLM_Alpha',
    tags: ['LLM', '实验性'],
    hypothesis:
      'LLM新闻情绪因子。假设大模型从新闻文本中提取的情绪信号能捕捉市场未充分定价的信息。',
  },
  {
    id: 'insider_buy',
    name: 'Insider_Buy',
    version: 'v1.0',
    category: '情绪',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'RETIRED',
    ic: 0.008,
    ir: 0.28,
    icTstat: 0.63,
    turnover: 15,
    capacity: 120000,
    winRate: 49,
    ic60d: 0.005,
    ic120d: 0.01,
    createdAt: '2023-03-01',
    createdBy: 'Vincent',
    tags: ['内部人交易', '已退役'],
    hypothesis:
      '内部人交易因子（已退役）。假设管理层增持反映对公司前景的信心，但A股数据质量差导致信号噪音过大。',
  },
  {
    id: 'sentiment_composite',
    name: '情绪综合',
    version: 'v1.0',
    category: '情绪',
    factorType: 'composite',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'LIVE_ACTIVE',
    ic: 0.062,
    ir: 2.32,
    icTstat: 5.19,
    turnover: 30,
    capacity: 70000,
    winRate: 67,
    ic60d: 0.06,
    ic120d: 0.058,
    createdAt: '2024-06-01',
    createdBy: 'Vincent',
    tags: ['复合', '核心', '最强'],
    hypothesis:
      '情绪综合因子。假设SUE/EPS修正/分析师三维度情绪信号互补，综合后稳定捕捉市场情绪溢价。',
  },
  {
    id: 'gp_sent',
    name: 'GP_Sent',
    version: 'v1.0',
    category: '情绪',
    factorType: 'composite',
    expectedDirection: 'positive',
    source: 'mining_gplearn',
    status: 'PAPER_TEST',
    ic: 0.03,
    ir: 1.08,
    icTstat: 2.42,
    turnover: 38,
    capacity: 55000,
    winRate: 55,
    ic60d: 0.032,
    ic120d: 0.028,
    createdAt: '2024-12-01',
    createdBy: 'Mining_v2',
    tags: ['挖掘', '可解释性待验'],
    hypothesis:
      'GP挖掘情绪因子。gplearn发现的SUE/分析师/北向组合表达式，假设非线性组合能捕捉因子间的交互效应。',
  },
];

// ─── Default Benchmark Config ───────────────────────────

const DEFAULT_BENCHMARK_CONFIG: BenchmarkConfig = {
  universe: '全A',
  icMethod: 'RankIC',
  winsorization: 'MAD',
  rebalanceDays: 5,
  quantiles: 5,
};

/** Generate IC decay profile: IC at lag T+1 to T+20 */
function generateICDecayProfile(baseIC: number, seed: number): number[] {
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
const UNIVERSE_MULTIPLIERS: Record<
  FactorCategory,
  Record<UniversePool, number>
> = {
  规模: { 全A: 1.0, 沪深300: 0.3, 中证500: 0.8, 中证1000: 1.4 },
  价值: { 全A: 1.0, 沪深300: 1.2, 中证500: 0.9, 中证1000: 0.7 },
  动能: { 全A: 1.0, 沪深300: 0.7, 中证500: 1.3, 中证1000: 1.1 },
  品质: { 全A: 1.0, 沪深300: 1.3, 中证500: 0.9, 中证1000: 0.6 },
  波动度: { 全A: 1.0, 沪深300: 0.6, 中证500: 0.9, 中证1000: 1.3 },
  流动性: { 全A: 1.0, 沪深300: 0.5, 中证500: 0.9, 中证1000: 1.4 },
  情绪: { 全A: 1.0, 沪深300: 0.8, 中证500: 1.1, 中证1000: 1.2 },
  股息率: { 全A: 1.0, 沪深300: 1.3, 中证500: 0.8, 中证1000: 0.5 },
  成长: { 全A: 1.0, 沪深300: 0.9, 中证500: 1.1, 中证1000: 1.0 },
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
    const icNoise = 1 + (rand() - 0.5) * 0.3; // ±15%
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
function generateBinaryTestRetention(
  rankRetention: number,
  seed: number,
): number {
  const rand = createSeededRandom(seed * 5279 + 67);
  const ratio = 0.65 + rand() * 0.3; // binary is 65-95% of rank retention
  return (
    Math.round(Math.max(0.15, Math.min(0.9, rankRetention * ratio)) * 100) / 100
  );
}

/** Generate V-Score: (IC_current - IC_5yr_mean) / IC_5yr_std */
function generateVScore(_baseIC: number, seed: number): number {
  const rand = createSeededRandom(seed * 7723 + 89);
  // Most factors cluster near 0 (normal), some outliers at ±1.5
  // Use a roughly normal distribution via Box-Muller-ish approach
  const u1 = rand();
  const u2 = rand();
  const z =
    Math.sqrt(-2 * Math.log(Math.max(u1, 0.001))) * Math.cos(2 * Math.PI * u2);
  // Scale to reasonable range [-2, 2] and clamp
  const vScore = Math.max(-2, Math.min(2, z * 0.8));
  return Math.round(vScore * 100) / 100;
}

// ─── New Field Generators ────────────────────────────────

/** Calculate IC half-life from decay profile */
function computeICHalfLife(decayProfile: number[]): number {
  if (decayProfile.length === 0) return 20;
  const initial = Math.abs(decayProfile[0]);
  if (initial === 0) return 20;
  const halfTarget = initial * 0.5;
  for (let i = 0; i < decayProfile.length; i++) {
    if (Math.abs(decayProfile[i]) <= halfTarget) return i + 1;
  }
  return decayProfile.length; // never reached half
}

/** Generate long-short equity curve: random walk with drift from longShortReturn */
function generateLongShortEquityCurve(
  annualReturn: number,
  seed: number,
): number[] {
  const rand = createSeededRandom(seed);
  const dailyReturn = annualReturn / 100 / 252;
  const dailyVol = Math.abs(dailyReturn) * 3 + 0.002;
  const curve: number[] = [1.0];
  for (let i = 1; i < 240; i++) {
    const dr = dailyReturn + (rand() - 0.5) * dailyVol * 2;
    curve.push(Math.round(curve[i - 1] * (1 + dr) * 10000) / 10000);
  }
  return curve;
}

/** Generate long-short annual return from IC strength */
function generateLongShortReturn(baseIC: number, seed: number): number {
  const rand = createSeededRandom(seed);
  const icStrength = Math.abs(baseIC);
  // Stronger IC → higher L/S return; typical range 5%-30%
  const base = icStrength * 300 + 3;
  const noise = (rand() - 0.5) * 8;
  return Math.round((base + noise) * 100) / 100;
}

/** Generate IC histogram bins from IC time series */
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

// ─── Shenwan L1 Industry Names ───────────────────────────

const SHENWAN_L1_INDUSTRIES = [
  '农林牧渔',
  '基础化工',
  '钢铁',
  '有色金属',
  '电子',
  '汽车',
  '家用电器',
  '食品饮料',
  '纺织服饰',
  '轻工制造',
  '医药生物',
  '公用事业',
  '交通运输',
  '房地产',
  '商贸零售',
  '社会服务',
  '银行',
  '非银金融',
  '综合',
  '建筑材料',
  '建筑装饰',
  '电力设备',
  '国防军工',
  '计算机',
  '传媒',
  '通信',
  '煤炭',
  '石油石化',
] as const;

// ─── New IC Visualization Generators ─────────────────────

/** Generate Q1-Q5 cumulative return curves (240 points each, start=1.0) */
function generateQuantileCumulativeReturns(
  quantileReturns: [number, number, number, number, number],
  seed: number,
): [number[], number[], number[], number[], number[]] {
  const result: [number[], number[], number[], number[], number[]] = [
    [],
    [],
    [],
    [],
    [],
  ];
  for (let q = 0; q < 5; q++) {
    const rand = createSeededRandom(seed * 2741 + q * 1031);
    const dailyDrift = quantileReturns[q] / 100 / 252; // annualize to daily
    const vol = Math.abs(dailyDrift) * 2.5 + 0.003;
    const curve: number[] = [1.0];
    for (let d = 1; d < 240; d++) {
      const dr = dailyDrift + (rand() - 0.5) * vol * 2;
      curve.push(Math.round(curve[d - 1] * (1 + dr) * 10000) / 10000);
    }
    result[q] = curve;
  }
  return result;
}

/** Generate IC monthly heatmap: 3 years × 12 months */
function generateICMonthlyHeatmap(
  baseIC: number,
  status: string,
  seed: number,
): Array<{ name: string; series: Array<{ name: string; value: number }> }> {
  const rand = createSeededRandom(seed * 4517 + 83);
  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ];
  const years = ['2023', '2024', '2025'];
  const isProbOrRetired = status === 'PROBATION' || status === 'RETIRED';

  // X axis = months (12 columns), Y axis = years (3 rows)
  // ngx-charts HeatMap: outer .name → X domain, inner series[].name → Y domain
  return months.map((month) => ({
    name: month,
    series: years.map((year, yearIdx) => {
      const yearDecay = isProbOrRetired
        ? 1 - yearIdx * 0.25
        : 1 - yearIdx * 0.05;
      const seasonalNoise = (rand() - 0.5) * Math.abs(baseIC) * 0.6;
      const icValue = baseIC * yearDecay + seasonalNoise;
      return {
        name: year,
        value: Math.round(icValue * 10000) / 10000,
      };
    }),
  }));
}

/** Generate per-industry IC values (Shenwan L1, 28 industries) */
function generateICByIndustry(
  baseIC: number,
  seed: number,
): Array<{ name: string; value: number }> {
  const rand = createSeededRandom(seed * 3389 + 47);
  return SHENWAN_L1_INDUSTRIES.map((name) => {
    const multiplier = 0.5 + rand() * 1.0; // 0.5x ~ 1.5x
    const noise = (rand() - 0.5) * Math.abs(baseIC) * 0.3;
    return {
      name,
      value: Math.round((baseIC * multiplier + noise) * 10000) / 10000,
    };
  });
}

/** Generate rank autocorrelation time series (240 points, range 0.3-0.95) */
function generateRankAutoCorrelation(baseIC: number, seed: number): number[] {
  const rand = createSeededRandom(seed * 6173 + 29);
  const icStrength = Math.min(Math.abs(baseIC) / 0.05, 1);
  // Higher IC → higher autocorrelation (more stable rankings)
  const meanLevel = 0.4 + icStrength * 0.35; // 0.4-0.75
  const data: number[] = [];
  let value = meanLevel + (rand() - 0.5) * 0.1;
  for (let i = 0; i < 240; i++) {
    const reversion = (meanLevel - value) * 0.08;
    value += reversion + (rand() - 0.5) * 0.04;
    data.push(
      Math.round(Math.max(0.15, Math.min(0.98, value)) * 10000) / 10000,
    );
  }
  return data;
}

/** Generate quantile turnover: top (Q5) and bottom (Q1) daily turnover series */
function generateQuantileTurnover(
  baseTurnover: number,
  seed: number,
): { top: number[]; bottom: number[] } {
  const randTop = createSeededRandom(seed * 5501 + 11);
  const randBot = createSeededRandom(seed * 7717 + 37);
  // Convert monthly turnover (0-100) to daily fraction
  const dailyBase = baseTurnover / 100 / 21; // ~21 trading days/month
  const top: number[] = [];
  const bottom: number[] = [];
  let topVal = dailyBase * (0.8 + randTop() * 0.4);
  let botVal = dailyBase * (1.0 + randBot() * 0.6); // bottom quantile typically higher turnover

  for (let i = 0; i < 240; i++) {
    topVal +=
      (dailyBase * 0.9 - topVal) * 0.05 + (randTop() - 0.5) * dailyBase * 0.3;
    botVal +=
      (dailyBase * 1.2 - botVal) * 0.05 + (randBot() - 0.5) * dailyBase * 0.3;
    top.push(Math.round(Math.max(0.001, topVal) * 10000) / 10000);
    bottom.push(Math.round(Math.max(0.001, botVal) * 10000) / 10000);
  }
  return { top, bottom };
}

// ─── Pending Proposals (mock) ────────────────────────────

const PENDING_PROPOSALS: Record<
  string,
  { targetStatus: FactorLifecycleStatus; reason: string; proposedAt: string }
> = {
  earnings_accel: {
    targetStatus: 'LIVE_ACTIVE',
    reason: '样本外 IC 连续 60 期 > 0.02, ICIR > 0.5，建议升级至实盘',
    proposedAt: '2026-03-04T08:30:00Z',
  },
  macd_diff: {
    targetStatus: 'RETIRED',
    reason: '近 120 期 IC 均值降至 0.005，低于退役阈值 0.01',
    proposedAt: '2026-03-03T15:30:00Z',
  },
  mom_60d: {
    targetStatus: 'LIVE_ACTIVE',
    reason: 'Paper Test 180 天通过，IC 稳定 > 0.02，最大回撤可控',
    proposedAt: '2026-03-04T08:30:00Z',
  },
};

// ─── Config Status (Pool × Horizon 16-combo states) ─────

function generateConfigStatus(
  status: FactorLifecycleStatus,
  seed: number,
): Record<string, ConfigSliceStatus> {
  const rand = createSeededRandom(seed);
  const result: Record<string, ConfigSliceStatus> = {};

  for (const pool of UNIVERSE_POOLS) {
    for (const hz of HORIZON_KEYS) {
      const key = getConfigKey(pool, hz);
      const r = rand();

      if (status === 'INCUBATING' && r < 0.15) {
        // 15% chance still computing for incubating factors
        result[key] = { signalStatus: 'loading', portfolioStatus: 'loading' };
      } else if (r < 0.03) {
        // 3% chance of error
        result[key] = { signalStatus: 'ready', portfolioStatus: 'error' };
      } else if (r < 0.08) {
        // 5% chance portfolio still computing
        result[key] = { signalStatus: 'ready', portfolioStatus: 'loading' };
      } else {
        result[key] = { signalStatus: 'ready', portfolioStatus: 'ready' };
      }
    }
  }
  return result;
}

// ─── Build Full Factor Objects ───────────────────────────

function buildFactor(seed: FactorSeed, index: number): Factor {
  const rand = createSeededRandom(index * 3331 + 7);
  const icVol = Math.abs(seed.ic) * 3.0 + 0.02;
  const icTimeSeries = generateICSparkline(
    240,
    seed.ic,
    icVol,
    index * 4219 + 99,
  );
  const rankTestRetention = generateRankTestRetention(seed.ic, index);
  const binaryTestRetention = generateBinaryTestRetention(
    rankTestRetention,
    index,
  );
  const icDecayProfile = generateICDecayProfile(seed.ic, index * 6131 + 73);
  const longShortReturn = generateLongShortReturn(seed.ic, index * 4391 + 31);
  const quantileReturns = generateQuantileReturns(
    seed.ic,
    seed.expectedDirection,
    index * 3571 + 17,
  );
  const pendingProposal = PENDING_PROPOSALS[seed.id];
  return {
    ...seed,
    workspacePath: `factors/${seed.id}/factor.py`,
    ...(pendingProposal ? { pendingProposal } : {}),
    icTrend: generateICSparkline(30, seed.ic, icVol, index * 7919 + 42),
    quantileReturns,
    icTimeSeries,
    benchmarkConfig: DEFAULT_BENCHMARK_CONFIG,
    icDistribution: computeICStats(icTimeSeries),
    icDecayProfile,
    universeProfile: generateUniverseProfile(
      seed.ic,
      seed.ir,
      seed.category,
      index * 8837 + 53,
    ),
    rankTestRetention,
    binaryTestRetention,
    vScore: generateVScore(seed.ic, index),
    icHalfLife: computeICHalfLife(icDecayProfile),
    coverageRate: Math.round((0.85 + rand() * 0.13) * 100) / 100, // 85-98%
    longShortReturn,
    longShortEquityCurve: generateLongShortEquityCurve(
      longShortReturn,
      index * 5113 + 59,
    ),
    longSideReturnRatio: Math.round((0.45 + rand() * 0.35) * 100) / 100, // 45-80%
    icHistogramBins: generateICHistogramBins(icTimeSeries),
    quantileCumulativeReturns: generateQuantileCumulativeReturns(
      quantileReturns,
      index * 8219 + 41,
    ),
    icMonthlyHeatmap: generateICMonthlyHeatmap(
      seed.ic,
      seed.status,
      index * 9413 + 67,
    ),
    icByIndustry: generateICByIndustry(seed.ic, index * 7321 + 53),
    rankAutoCorrelation: generateRankAutoCorrelation(
      seed.ic,
      index * 6529 + 79,
    ),
    quantileTurnover: generateQuantileTurnover(
      seed.turnover,
      index * 4871 + 23,
    ),
    statusHistory: [],
    configStatus: generateConfigStatus(seed.status, index * 9091 + 37),
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
  const liveFactors = factors.filter((f) => f.status === 'LIVE_ACTIVE');
  return {
    totalFactors: factors.length,
    liveCount: liveFactors.length,
    paperTestCount: factors.filter((f) => f.status === 'PAPER_TEST').length,
    incubatingCount: factors.filter((f) => f.status === 'INCUBATING').length,
    probationCount: factors.filter((f) => f.status === 'PROBATION').length,
    retiredCount: factors.filter((f) => f.status === 'RETIRED').length,
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
