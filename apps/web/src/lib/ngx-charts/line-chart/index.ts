/**
 * @fileoverview Line chart module exports
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/line-chart/line-chart.module.ts
 *
 * @description
 * Exports all line chart components, hooks, and types.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

// Main component
export { LineChart } from './line-chart';
export type { LineChartProps } from './line-chart';

// Sub-components
export { Line } from './components/line';
export type { LineProps } from './components/line';

export { LineSeries } from './components/line-series';
export type { LineSeriesProps } from './components/line-series';

export { CircleSeries } from './components/circle-series';
export type { CircleSeriesProps } from './components/circle-series';

// Hooks
export { useLineChart, sortLineData } from './hooks/use-line-chart';
export type {
  UseLineChartConfig,
  LineChartState,
  XScale,
  YScale,
} from './hooks/use-line-chart';
