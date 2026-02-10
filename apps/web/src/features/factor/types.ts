/**
 * Factor Analysis Types
 * Based on Alphalens library structure
 */

export interface FactorInfo {
  id: string;
  name: string;
  description: string;
  category: FactorCategory;
  annualizedAlpha: number;
  annualizedBeta: number;
  sharpeRatio: number;
  informationCoefficient: number;
  icPValue: number;
  turnover: number;
  quantiles: number;
}

export type FactorCategory =
  | "momentum"
  | "value"
  | "quality"
  | "size"
  | "volatility"
  | "growth"
  | "technical";

export interface QuantileReturn {
  quantile: number;
  period1D: number;
  period5D: number;
  period10D: number;
  period20D: number;
}

export interface CumulativeReturnPoint {
  date: string;
  quantile1: number;
  quantile2: number;
  quantile3: number;
  quantile4: number;
  quantile5: number;
  longShort: number;
}

export interface SectorBreakdown {
  sector: string;
  meanReturn: number;
  ic: number;
  count: number;
}

export interface FactorStatistics {
  annualizedAlpha: number;
  annualizedBeta: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  informationCoefficient: number;
  icTStat: number;
  icPValue: number;
  icSkew: number;
  icKurtosis: number;
  turnoverMean: number;
  factorRankAutocorr: number;
}

export interface HoldingCompositionPoint {
  date: string;
  Consumer: number;
  Resources: number;
  Manufacturing: number;
  Financials: number;
  Healthcare: number;
  Technology: number;
  Other: number;
}

export const HOLDING_SECTORS = ["Consumer", "Resources", "Manufacturing", "Financials", "Healthcare", "Technology", "Other"] as const;
export type HoldingSector = (typeof HOLDING_SECTORS)[number];

/**
 * Global sector color map — single source of truth for all sector charts.
 * 6 core sectors (医药/消费/金融/制造/科技/资源) + Other.
 */
export const SECTOR_COLOR_MAP: Record<HoldingSector, string> = {
  Consumer:      "#1939B7",  // 消费 — royal blue
  Resources:     "#36D6F0",  // 资源 — cyan
  Manufacturing: "#228B22",  // 制造 — forest green
  Financials:    "#E8626F",  // 金融 — coral red
  Healthcare:    "#58CEAA",  // 医药 — mint green
  Technology:    "#A8385D",  // 科技 — deep rose
  Other:         "#B0B0B0",  // 其他 — gray
};

export interface FactorData {
  info: FactorInfo;
  statistics: FactorStatistics;
  cumulativeReturns: CumulativeReturnPoint[];
  sectorBreakdown: SectorBreakdown[];
  holdingComposition: HoldingCompositionPoint[];
}
