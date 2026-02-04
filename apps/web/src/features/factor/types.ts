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

export interface ICTimeSeriesPoint {
  date: string;
  ic: number;
  icMovingAvg: number;
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

export interface TurnoverDataPoint {
  quantile: number;
  turnover1D: number;
  turnover5D: number;
  turnover10D: number;
}

export interface FactorRankAutocorrelation {
  lag: number;
  autocorrelation: number;
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

export interface FactorData {
  info: FactorInfo;
  statistics: FactorStatistics;
  quantileReturns: QuantileReturn[];
  icTimeSeries: ICTimeSeriesPoint[];
  cumulativeReturns: CumulativeReturnPoint[];
  turnoverByQuantile: TurnoverDataPoint[];
  rankAutocorrelation: FactorRankAutocorrelation[];
  sectorBreakdown: SectorBreakdown[];
}
