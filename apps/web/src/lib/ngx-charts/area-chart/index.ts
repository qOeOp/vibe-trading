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
export { AreaChart, type AreaChartProps, type ReferenceLine } from './area-chart';
export { AreaChartStacked, type AreaChartStackedProps } from './area-chart-stacked';
export { AreaChartNormalized, type AreaChartNormalizedProps } from './area-chart-normalized';

// Sub-components
export { Area, type AreaProps } from './components/area';
export {
  AreaSeries,
  type AreaSeriesProps,
  type XScaleWithDomain,
  type YScaleWithRange,
} from './components/area-series';

// Hooks
export {
  useAreaChart,
  type UseAreaChartConfig,
  type UseAreaChartResult,
  type ProcessedSeriesData,
  type XScale,
  type YScale,
} from './hooks/use-area-chart';
