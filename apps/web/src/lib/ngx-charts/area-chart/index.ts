/**
 * @fileoverview Area chart module exports
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/area-chart/area-chart.module.ts
 *
 * @description
 * Unified exports for area chart components.
 * Includes basic, stacked, and normalized variants.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

// Main chart components
export { AreaChart } from './area-chart';
export type { AreaChartProps, ReferenceLine } from './area-chart';
export { AreaChartStacked } from './area-chart-stacked';
export type { AreaChartStackedProps } from './area-chart-stacked';
export { AreaChartNormalized } from './area-chart-normalized';
export type { AreaChartNormalizedProps } from './area-chart-normalized';

// Sub-components
export { Area } from './components/area';
export type { AreaProps } from './components/area';
export {
  AreaSeries,
} from './components/area-series';
export type {
  AreaSeriesProps,
  XScaleWithDomain,
  YScaleWithRange,
} from './components/area-series';

// Hooks
export {
  useAreaChart,
} from './hooks/use-area-chart';
export type {
  UseAreaChartConfig,
  UseAreaChartResult,
  ProcessedSeriesData,
  XScale,
  YScale,
} from './hooks/use-area-chart';
