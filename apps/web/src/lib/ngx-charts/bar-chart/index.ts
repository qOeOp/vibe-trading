/**
 * @fileoverview Bar chart module exports
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/bar-chart.module.ts
 *
 * @description
 * Exports all bar chart components, hooks, and types for the
 * ngx-charts React library. Includes 8 chart variants:
 *
 * - BarVertical - Standard vertical bar chart
 * - BarHorizontal - Standard horizontal bar chart
 * - BarVerticalStacked - Stacked vertical bar chart
 * - BarHorizontalStacked - Stacked horizontal bar chart
 * - BarVerticalGrouped (BarVertical2D) - Grouped vertical bar chart
 * - BarHorizontalGrouped (BarHorizontal2D) - Grouped horizontal bar chart
 * - BarVerticalNormalized - Normalized (100%) vertical bar chart
 * - BarHorizontalNormalized - Normalized (100%) horizontal bar chart
 *
 * @license MIT
 */

// Main chart components
export { BarVertical } from './bar-vertical';
export { BarHorizontal } from './bar-horizontal';
export { BarVerticalStacked } from './bar-vertical-stacked';
export { BarHorizontalStacked } from './bar-horizontal-stacked';
export { BarVerticalGrouped, BarVertical2D } from './bar-vertical-2d';
export { BarHorizontalGrouped, BarHorizontal2D } from './bar-horizontal-2d';
export { BarVerticalNormalized } from './bar-vertical-normalized';
export { BarHorizontalNormalized } from './bar-horizontal-normalized';

// Supporting components
export { Bar, BarLabel, BarSeriesVertical, BarSeriesHorizontal } from './components';

// Hooks
export {
  useBarChart,
  useVerticalBarScales,
  useHorizontalBarScales,
  useGroupedBarScales,
  useStackedBarScales,
  useNormalizedBarScales,
} from './hooks';

// Note: formatLabel and escapeLabel are available from '../utils/label-helper'
// They were moved there to avoid export conflicts in the main library index

// Types
export {
  BarChartType,
  D0Types,
  type Bar as BarModel,
  type BarLabelData,
  type BaseBarChartProps,
  type MultiSeriesBarChartProps,
  type BarProps,
  type BarLabelProps,
  type BarSeriesProps,
} from './types';
