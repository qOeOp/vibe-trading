/**
 * @fileoverview Pie Chart Module Exports
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 *
 * @description
 * Public exports for the pie chart module including main chart components,
 * internal sub-components, and hooks.
 *
 * Main exports:
 * - PieChart: Standard pie/doughnut chart
 * - AdvancedPieChart: Pie with detailed legend
 * - PieGrid: Grid of mini pie charts
 *
 * @license MIT
 */

// Main chart components
export { PieChart } from './pie-chart';
export type { PieChartProps } from './pie-chart';
export { AdvancedPieChart } from './advanced-pie-chart';
export type { AdvancedPieChartProps } from './advanced-pie-chart';
export { PieGrid } from './pie-grid';
export type { PieGridProps } from './pie-grid';

// Sub-components (for advanced customization)
export {
  PieArc,
  PieLabel,
  PieSeries,
  PieGridSeries,
} from './components';
export type {
  PieArcProps,
  PieLabelProps,
  PieLabelData,
  PieSeriesProps,
  ArcWithPosition,
  PieGridSeriesProps,
} from './components';

// Hooks
export {
  usePieChart,
  useGridLayout,
} from './hooks';
export type {
  UsePieChartConfig,
  UsePieChartResult,
  ProcessedArc,
  UseGridLayoutConfig,
  GridCell,
} from './hooks';
