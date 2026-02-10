/**
 * Library Factor Overview Types
 */

export type FactorCategoryLabel =
  | "价值"
  | "质量"
  | "动量"
  | "情绪"
  | "波动"
  | "流动性"
  | "规模";

export type FactorStatus = "强有效" | "有效" | "弱" | "反向";

export interface LibraryFactor {
  id: string;
  /** Factor code name (e.g. "EP", "BP") */
  name: string;
  /** Chinese description */
  description: string;
  /** Category tag */
  category: FactorCategoryLabel;
  /** Mean IC value */
  icMean: number;
  /** IC Information Ratio */
  icir: number;
  /** Win rate percentage (0-100) */
  winRate: number;
  /** Rebalancing period (e.g. "20D", "10D", "5D") */
  period: string;
  /** Turnover percentage (0-100) */
  turnover: number;
  /** Max drawdown percentage (negative) */
  maxDrawdown: number;
  /** Sharpe ratio */
  sharpe: number;
  /** IC trend sparkline data (recent 30 data points) */
  icTrend: number[];
  /** Factor effectiveness status */
  status: FactorStatus;
}

export interface LibrarySummary {
  totalFactors: number;
  effectiveFactors: number;
  avgICIR: number;
  newThisMonth: number;
}
