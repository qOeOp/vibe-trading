/**
 * @fileoverview ngx-charts React Library
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 *
 * @description
 * High-fidelity React port of the Angular ngx-charts library.
 * This library provides a comprehensive set of chart components
 * with D3-powered calculations and Framer Motion animations.
 *
 * Migrated from Angular ngx-charts library.
 * Unused components/props are retained for completeness.
 *
 * @license MIT
 */

// Types
export * from './types';

// Utilities
export * from './utils';

// Common components
export * from './common';

// Chart components
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
  // Note: XScale and YScale not re-exported to avoid conflict with line-chart
} from './area-chart';

export * from './bar-chart';
export * from './pie-chart';

// Gauge - avoid GaugeArc conflict with types
export {
  Gauge,
  type GaugeProps,
  LinearGauge,
  type LinearGaugeProps,
  GaugePercent,
  type GaugePercentProps,
  GaugeArc as GaugeArcComponent,
  type GaugeArcProps,
  type ArcItem,
  GaugeAxis,
  type GaugeAxisProps,
  useGauge,
  type UseGaugeConfig,
  type UseGaugeResult,
  type GaugeArcs,
} from './gauge';

export * from './bubble-chart';

// Heat map - avoid HeatMapCell conflict with types
export {
  HeatMap,
  type HeatMapProps,
  HeatMapCell as HeatMapCellComponent,
  type HeatMapCellProps,
  HeatMapCellSeries,
  type HeatMapCellSeriesProps,
} from './heat-map';

export * from './tree-map';

// Number card - avoid GridData/GridItem conflict with common
export {
  NumberCard,
  type NumberCardProps,
  Card,
  type CardProps,
  CardSeries,
  type CardSeriesProps,
  type CardModel,
} from './number-card';

export * from './sankey';
export * from './polar-chart';
export * from './line-race';
export * from './band-chart';

// Box chart - avoid BoxChartSeries/BoxChartMultiSeries conflict with types
export {
  BoxChart,
  type BoxChartProps,
  BoxSeries,
  type BoxSeriesProps,
  Box,
  type BoxProps,
  type IBoxModel,
  type IVector2D,
} from './box-chart';
