/**
 * Factor Library Types
 *
 * Authoritative source: Home tab 概念索引 — Factor Entity
 * These types mirror the PRD entity definitions in library.md / home.md
 */

// ─── Enums ────────────────────────────────────────────────

/** 9 大因子分类 (与 Home tab 概念索引一致) */
export const FACTOR_CATEGORIES = [
  "动能",
  "股息率",
  "价值",
  "成长",
  "品质",
  "流动性",
  "波动度",
  "规模",
  "情绪",
] as const;
export type FactorCategory = (typeof FACTOR_CATEGORIES)[number];

/** 5 阶段因子生命周期 */
export const FACTOR_LIFECYCLE_STATUSES = [
  "INCUBATING",
  "PAPER_TEST",
  "LIVE_ACTIVE",
  "PROBATION",
  "RETIRED",
] as const;
export type FactorLifecycleStatus =
  (typeof FACTOR_LIFECYCLE_STATUSES)[number];

/** 因子类型 */
export type FactorType = "leaf" | "composite";

/** 因子来源 (与分类正交) */
export type FactorSource =
  | "manual"
  | "mining_gplearn"
  | "mining_pysr"
  | "mining_llm";

/** 因子预期方向 */
export type FactorDirection = "positive" | "negative";

// ─── Benchmark Config ────────────────────────────────────

/** 标准股票池列表 */
export const UNIVERSE_POOLS = ["全A", "沪深300", "中证500", "中证1000"] as const;
export type UniversePool = (typeof UNIVERSE_POOLS)[number];

/** 因子检验基准配置 — IC/IR 等统计量的计算上下文 */
export interface BenchmarkConfig {
  universe: UniversePool;
  icMethod: "RankIC" | "NormalIC";
  winsorization: "MAD" | "3σ" | "百分位" | "无";
  rebalanceDays: number;
  quantiles: number;
}

/** 单个股票池的预计算 IC/IR */
export interface UniverseIC {
  universe: UniversePool;
  ic: number;
  ir: number;
}

/** IC 分布统计量 — 对标米筐 IC 统计指标表 */
export interface ICDistributionStats {
  /** IC 均值 */
  icMean: number;
  /** IC 标准差 (Bessel 校正) */
  icStd: number;
  /** IC > 0 的天数 */
  icPositiveCount: number;
  /** IC < 0 的天数 */
  icNegativeCount: number;
  /** |IC| 显著 (>0.02) 的比例 (0-1) */
  icSignificantRatio: number;
  /** IC > 0 且 |IC| > 0.02 的比例 (0-1) */
  icPositiveSignificantRatio: number;
  /** IC < 0 且 |IC| > 0.02 的比例 (0-1) */
  icNegativeSignificantRatio: number;
  /** t 检验 p 值 */
  icPValue: number;
  /** IC 偏度 (三阶标准化矩) */
  icSkewness: number;
  /** IC 超额峰度 (四阶标准化矩, 正态=0) */
  icKurtosis: number;
}

// ─── Factor Entity ────────────────────────────────────────

/** Factor Entity — 因子库核心数据模型 */
export interface Factor {
  id: string;
  name: string;
  version: string;
  category: FactorCategory;
  factorType: FactorType;
  expectedDirection: FactorDirection;
  source: FactorSource;
  status: FactorLifecycleStatus;
  expression: string;
  /** 最近 20 日滚动 IC */
  ic: number;
  /** IC Information Ratio (均值/标准差) */
  ir: number;
  /** IC t 统计量 */
  icTstat: number;
  /** 月度换手率 (0-100) */
  turnover: number;
  /** 估算容量上限 (万元) */
  capacity: number;
  createdAt: string;
  createdBy: string;
  tags: string[];
  /** IC 时序 sparkline (最近 30 日) */
  icTrend: number[];
  /** IC > 0 的天数占比 (0-100) */
  winRate: number;
  /** 60 日滚动 IC */
  ic60d: number;
  /** 120 日滚动 IC */
  ic120d: number;
  /** Q1-Q5 分位收益 (%) */
  quantileReturns: [number, number, number, number, number];
  /** 240 日 IC 日值时序 (用于详情面板 IC 衰减曲线) */
  icTimeSeries: number[];
  /** 因子检验基准配置 */
  benchmarkConfig: BenchmarkConfig;
  /** IC 分布完整统计 (从 icTimeSeries 派生) */
  icDistribution: ICDistributionStats;
  /** IC 衰减剖面: Lag T+1 ~ T+20 的 IC 均值 */
  icDecayProfile: number[];
  /** 多池适用性: 各标准股票池的预计算 IC/IR */
  universeProfile: UniverseIC[];
  /** Rank Test 保留率: rank(X) 变换后 Sharpe 相对原始的保留比例 (0-1) */
  rankTestRetention: number;
  /** Binary Test 保留率: sign(X) 变换后 Sharpe 保留比例 (0-1) */
  binaryTestRetention: number;
  /** V-Score: 因子相对估值 (IC_current - IC_5yr_mean) / IC_5yr_std */
  vScore: number;
  /** IC 半衰期 (天数，IC 衰减到初始 50% 所需 lag 步数) */
  icHalfLife: number;
  /** 因子覆盖率 (0-1，有效计算的股票占比) */
  coverageRate: number;
  /** 多空年化收益 (%) */
  longShortReturn: number;
  /** 多空累计净值曲线 (240 点日频) */
  longShortEquityCurve: number[];
  /** 多头收益占比 (0-1，多头贡献 / 总多空收益) */
  longSideReturnRatio: number;
  /** IC 分布直方图 bins (20 个 bin 的频次) */
  icHistogramBins: number[];
  /** Q1-Q5 分组累计收益曲线 (每组 240 点日频, 起始=1.0) */
  quantileCumulativeReturns: [number[], number[], number[], number[], number[]];
  /** IC 月度热力图: 行=年份, 列=月份, 值=月均IC */
  icMonthlyHeatmap: Array<{ name: string; series: Array<{ name: string; value: number }> }>;
  /** 分行业 IC: 申万一级 28 个行业的截面 IC */
  icByIndustry: Array<{ name: string; value: number }>;
  /** 因子排名自相关时序 (240 点日频) */
  rankAutoCorrelation: number[];
  /** 分位换手率: top(Q5) 和 bottom(Q1) 组的日频换手率 (各 240 点) */
  quantileTurnover: { top: number[]; bottom: number[] };
  /** 状态变更历史 */
  statusHistory: StatusChangeRecord[];

  /** 挖掘来源扩展字段 — 仅 source === "mining_llm" 时存在 */
  codeFile?: string;           // factor.py 绝对路径
  workspacePath?: string;      // Lab workspace 关联路径（关联后填入）
  taskId?: string;             // 来源挖掘任务 ID
  annualReturn?: number;       // 年化收益（来自 RD-Agent 回测）
  sharpeRatio?: number;        // Sharpe ratio
  maxDrawdown?: number;        // 最大回撤
  hypothesis?: string;         // 挖掘假设描述
  lookback?: number;           // 因子回溯窗口（天数）
}

// ─── Status Change ────────────────────────────────────────

/** 状态变更记录 */
export interface StatusChangeRecord {
  timestamp: string;
  operator: string;
  reason: string;
  fromStatus: FactorLifecycleStatus;
  toStatus: FactorLifecycleStatus;
}

/** 合法状态转换路径 */
export const VALID_STATUS_TRANSITIONS: Record<
  FactorLifecycleStatus,
  FactorLifecycleStatus[]
> = {
  INCUBATING: ["PAPER_TEST", "RETIRED"],
  PAPER_TEST: ["LIVE_ACTIVE", "RETIRED"],
  LIVE_ACTIVE: ["PROBATION", "RETIRED"],
  PROBATION: ["LIVE_ACTIVE", "RETIRED"],
  RETIRED: [],
};

// ─── Display Constants ────────────────────────────────────

/** 分类颜色映射 (badge 背景 18% + 文字色) */
export const CATEGORY_COLORS: Record<FactorCategory, string> = {
  动能: "#f97316",
  股息率: "#ec4899",
  价值: "#3b82f6",
  成长: "#22c55e",
  品质: "#10b981",
  流动性: "#06b6d4",
  波动度: "#eab308",
  规模: "#64748b",
  情绪: "#a855f7",
};

/** 状态颜色映射 */
export const STATUS_COLORS: Record<FactorLifecycleStatus, string> = {
  INCUBATING: "#8b8b8b",
  PAPER_TEST: "#3b82f6",
  LIVE_ACTIVE: "#4caf50",
  PROBATION: "#f5a623",
  RETIRED: "#8a8a8a",
};

/** 状态中文标签 */
export const STATUS_LABELS: Record<FactorLifecycleStatus, string> = {
  INCUBATING: "INC",
  PAPER_TEST: "PAPER",
  LIVE_ACTIVE: "LIVE",
  PROBATION: "PROB",
  RETIRED: "RET",
};

/** 来源中文标签 */
export const SOURCE_LABELS: Record<FactorSource, string> = {
  manual: "手动",
  mining_gplearn: "gplearn",
  mining_pysr: "PySR",
  mining_llm: "LLM",
};

/** 来源颜色 */
export const SOURCE_COLORS: Record<FactorSource, string> = {
  manual: "#8b8b8b",
  mining_gplearn: "#22c55e",
  mining_pysr: "#3b82f6",
  mining_llm: "#a855f7",
};

/** 类型中文标签 */
export const TYPE_LABELS: Record<FactorType, string> = {
  leaf: "叶子",
  composite: "复合",
};

/** 类型颜色 */
export const TYPE_COLORS: Record<FactorType, string> = {
  leaf: "#3b82f6",
  composite: "#a855f7",
};

/** 去极值方法标签 */
export const WINSORIZATION_LABELS: Record<
  BenchmarkConfig["winsorization"],
  string
> = {
  MAD: "MAD去极值",
  "3σ": "3σ去极值",
  百分位: "百分位去极值",
  无: "无去极值",
};
