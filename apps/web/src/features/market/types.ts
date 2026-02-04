// ---- Market Indices ----
export interface MarketIndex {
  code: string;
  name: string;
  shortName: string;
  value: number;
  change: number;
  changePercent: number;
  volume: number; // 亿
  turnover: number; // 亿
  sparklineData: number[];
}

// ---- Treemap Hierarchy ----
export interface SectorData {
  name: string;
  icon: string;
  capitalFlow: number; // 净流入, 亿, signed
  changePercent: number;
  children?: IndustryData[];
}

export interface IndustryData {
  name: string;
  capitalFlow: number;
  changePercent: number;
  children?: StockItem[];
}

export interface StockItem {
  name: string;
  capitalFlow: number;
  changePercent: number;
}

// ---- Unified D3 Treemap Node ----
export interface TreemapNode {
  name: string;
  capitalFlow: number;
  changePercent: number;
  icon?: string;
  value?: number; // computed for d3.hierarchy
  children?: TreemapNode[];
}

// ---- Market Breadth ----
export interface MarketBreadth {
  advancers: number;
  decliners: number;
  unchanged: number;
  limitUp: number;
  limitDown: number;
}

// ---- Candle Data (for sparkline) ----
export interface CandleData {
  open: number;
  close: number;
  high: number;
  low: number;
}

// ---- Navigation State ----
export type DrillLevel = 0 | 1 | 2;

export interface BreadcrumbEntry {
  name: string;
  level: DrillLevel;
  entities: TreemapNode[];
}

// ---- Color Ramp ----
export interface ColorRampEntry {
  bg: string;
  badge: string;
}
