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
export { PieChart, type PieChartProps } from './pie-chart';
export { AdvancedPieChart, type AdvancedPieChartProps } from './advanced-pie-chart';
export { PieGrid, type PieGridProps } from './pie-grid';

// Sub-components (for advanced customization)
export {
  PieArc,
  type PieArcProps,
  PieLabel,
  type PieLabelProps,
  type PieLabelData,
  PieSeries,
  type PieSeriesProps,
  type ArcWithPosition,
  PieGridSeries,
  type PieGridSeriesProps,
} from './components';

// Hooks
export {
  usePieChart,
  type UsePieChartConfig,
  type UsePieChartResult,
  type ProcessedArc,
  useGridLayout,
  type UseGridLayoutConfig,
  type GridCell,
} from './hooks';
