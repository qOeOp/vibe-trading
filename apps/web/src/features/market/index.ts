// Components
export { MarketPage } from "./components/market-page";
export { AiChatPanel } from "./components/ai-chat-panel";
export { MarketDetailPanel } from "./components/market-detail-panel";
export { MarketIndexSidebar } from "./components/market-index-sidebar";
export { MarketSubHeader } from "./components/market-sub-header";
export { MarketTimeBar } from "./components/market-time-bar";
export { KLineChart } from "./components/k-line-chart";

// Treemap components
export { TreemapPanel } from "./components/treemap/treemap-panel";
export { HeatMapContainer } from "./components/treemap/heatmap-container";
export { HeatMapTile } from "./components/treemap/heatmap-tile";

// Hooks
export {
  useTreemap,
  buildSplitLineStructure,
  buildTileSpans,
  elasticRedistribute,
  calculateRippleLayout,
  getAdaptiveStyles,
  getBorderRadius,
  getTargetSize,
  useChat,
} from "./hooks";
export type { TileLayout, SplitLineStructure, Message } from "./hooks";

// Types
export type {
  MarketIndex,
  SectorData,
  IndustryData,
  StockItem,
  TreemapNode,
  MarketBreadth,
  CandleData,
  DrillLevel,
  BreadcrumbEntry,
  ColorRampEntry,
} from "./types";
