/**
 * @fileoverview xycharts library — purpose-built visx chart components
 *
 * @description
 * Custom chart components built on visx primitives for specialized
 * quantitative finance visualizations not covered by ngx-charts.
 *
 * Component layers:
 * - L0: DivergingBarStack — SVG renderer for overlapping diverging bars
 * - L0: DivergingCrosshair — Reusable crosshair overlay for diverging bar charts
 * - L0: SeverityBrush — Grayscale mini-chart with range selection
 * - L1: DivergingBarChart — Full framework: data pipeline + brush + state + crosshair
 *
 * Callers should prefer L1 (DivergingBarChart) unless they need
 * custom composition of L0 components.
 */

// L1 Framework component (preferred entry point)
export { DivergingBarChart } from './diverging-bar-chart';
export type { DivergingBarChartProps } from './diverging-bar-chart';

// L0 Chart components (for advanced composition)
export { DivergingBarStack } from './diverging-bar-stack';
export type { DivergingBarStackProps } from './diverging-bar-stack';

export { DivergingCrosshair } from './diverging-crosshair';
export type { DivergingCrosshairProps } from './diverging-crosshair';

export { SeverityBrush } from './severity-brush';
export type { SeverityBrushProps } from './severity-brush';

// Data hooks
export { useDivergingStackData, useDivergingDomain } from './use-diverging-stack';
export { useBrushBarData } from './use-brush-data';

// Severity algorithm (pure functions)
export { computeRawSeverity, computeSeverities, severityToGray } from './severity';

// Types
export type {
  QuantileCurves,
  DivergingBarDatum,
  BrushBarDatum,
  BrushRange,
  ChartMargin,
  ReferenceLine,
  CrosshairInfo,
} from './types';
