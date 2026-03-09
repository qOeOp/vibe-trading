/**
 * @fileoverview ngx-charts React Library
 *
 * High-fidelity React port of the Angular ngx-charts library.
 * D3-powered calculations + Framer Motion animations.
 *
 * Active chart types: line, area, bar, band, heat-map, radar
 * Removed (0 consumers): pie, gauge, bubble, number-card, polar, box,
 *   tree-map, sankey, line-race
 *
 * @license MIT
 */

// Types
export * from './types';

// Utilities
export * from './utils';

// Common components
export * from './common';

// ─── Active Chart Components ─────────────────────────────

export {
  LineChart,
  type LineChartProps,
  Line,
  type LineProps,
  LineSeries,
  type LineSeriesProps,
  CircleSeries,
  type CircleSeriesProps,
  useLineChart,
  sortLineData,
  type UseLineChartConfig,
  type LineChartState,
  type XScale,
  type YScale,
} from './line-chart';

export {
  AreaChart,
  type AreaChartProps,
  type ReferenceLine,
  AreaChartStacked,
  type AreaChartStackedProps,
  AreaChartNormalized,
  type AreaChartNormalizedProps,
  Area,
  type AreaProps,
  AreaSeries,
  type AreaSeriesProps,
  type XScaleWithDomain,
  type YScaleWithRange,
  useAreaChart,
  type UseAreaChartConfig,
  type UseAreaChartResult,
  type ProcessedSeriesData,
} from './area-chart';

export * from './bar-chart';

export {
  HeatMap,
  type HeatMapProps,
  HeatMapCell as HeatMapCellComponent,
  type HeatMapCellProps,
  HeatMapCellSeries,
  type HeatMapCellSeriesProps,
} from './heat-map';

export * from './band-chart';
export * from './radar-chart';
