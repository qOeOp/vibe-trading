/**
 * @fileoverview Bar chart type definitions
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/types/
 *
 * @description
 * Type definitions for bar chart components.
 * Migrated from Angular ngx-charts library to React.
 *
 * @license MIT
 */

import type { ScaleBand, ScaleLinear } from 'd3-scale';
import type { DataItem, StringOrNumberOrDate } from '../../types';
import type { Gradient } from '../../types/common';

/**
 * D3 Scale types for bar charts
 */
export type BarXScale = ScaleBand<string> | ScaleLinear<number, number>;
export type BarYScale = ScaleBand<string> | ScaleLinear<number, number>;

/**
 * Bar chart type variants
 */
export enum BarChartType {
  Standard = 'standard',
  Normalized = 'normalized',
  Stacked = 'stacked',
}

/**
 * D0 types for stacking calculations
 */
export enum D0Types {
  positive = 'positive',
  negative = 'negative',
}

/**
 * Bar model representing a single rendered bar
 */
export interface Bar {
  /** Accessibility label for the bar */
  ariaLabel: string;
  /** Fill color of the bar */
  color: string;
  /** Original data item */
  data: DataItem;
  /** Formatted label text */
  formattedLabel: string;
  /** Gradient stops for gradient fills */
  gradientStops?: Gradient[];
  /** Height of the bar in pixels */
  height: number;
  /** Label text */
  label: StringOrNumberOrDate;
  /** Whether to round the bar edges */
  roundEdges: boolean;
  /** Tooltip text content */
  tooltipText?: string;
  /** Numeric value */
  value: number;
  /** Width of the bar in pixels */
  width: number;
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Offset for stacked bars */
  offset0?: number;
  offset1?: number;
}

/**
 * Bar label data for data labels
 */
export interface BarLabelData {
  x: number;
  y: number;
  width: number;
  height: number;
  total: number;
  series: StringOrNumberOrDate;
}

/**
 * Common bar chart props (React style)
 */
export interface BaseBarChartProps {
  /** Chart data */
  data: DataItem[];
  /** Fixed width (optional) */
  width?: number;
  /** Fixed height (optional) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string;
  /** Custom color mapping */
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Enable/disable animations */
  animated?: boolean;
  /** Show legend */
  legend?: boolean;
  /** Legend title */
  legendTitle?: string;
  /** Legend position */
  legendPosition?: 'right' | 'below';
  /** X-axis configuration */
  xAxis?: {
    visible?: boolean;
    label?: string;
    showLabel?: boolean;
    showGridLines?: boolean;
    tickFormatting?: (value: unknown) => string;
    ticks?: unknown[];
    trimTicks?: boolean;
    rotateTicks?: boolean;
    maxTickLength?: number;
    wrapTicks?: boolean;
  };
  /** Y-axis configuration */
  yAxis?: {
    visible?: boolean;
    label?: string;
    showLabel?: boolean;
    showGridLines?: boolean;
    tickFormatting?: (value: unknown) => string;
    ticks?: unknown[];
    trimTicks?: boolean;
    maxTickLength?: number;
    wrapTicks?: boolean;
    minScale?: number;
    maxScale?: number;
  };
  /** Tooltip configuration */
  tooltip?: {
    disabled?: boolean;
    template?: React.ReactNode;
  };
  /** Enable gradient fills */
  gradient?: boolean;
  /** Round bar edges */
  roundEdges?: boolean;
  /** Round domain values */
  roundDomains?: boolean;
  /** Bar padding (for standard charts) */
  barPadding?: number;
  /** Show data labels */
  showDataLabel?: boolean;
  /** Data label formatting function */
  dataLabelFormatting?: (value: number) => string;
  /** Hide bars when value is zero */
  noBarWhenZero?: boolean;
  /** Active/highlighted entries */
  activeEntries?: DataItem[];
  /** Reference lines */
  referenceLines?: Array<{ name: string; value: number }>;
  /** Show reference lines */
  showRefLines?: boolean;
  /** Show reference line labels */
  showRefLabels?: boolean;
  /** Callback when an item is selected */
  onSelect?: (event: DataItem) => void;
  /** Callback when an item is activated (hovered) */
  onActivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Callback when an item is deactivated */
  onDeactivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Multi-series bar chart props (for stacked, grouped, normalized)
 */
export interface MultiSeriesBarChartProps extends Omit<BaseBarChartProps, 'data'> {
  /** Multi-series data */
  data: Array<{
    name: StringOrNumberOrDate;
    series: DataItem[];
  }>;
  /** Group padding (for grouped charts) */
  groupPadding?: number;
}

/**
 * Bar component props
 */
export interface BarProps {
  /** Fill color */
  fill: string;
  /** Data item */
  data: DataItem;
  /** Bar width */
  width: number;
  /** Bar height */
  height: number;
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Bar orientation */
  orientation: 'vertical' | 'horizontal';
  /** Round bar edges */
  roundEdges?: boolean;
  /** Enable gradient */
  gradient?: boolean;
  /** Gradient stops */
  stops?: Gradient[];
  /** Whether bar is active/highlighted */
  isActive?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Accessibility label */
  ariaLabel?: string;
  /** Hide bar when value is zero */
  noBarWhenZero?: boolean;
  /** Click handler */
  onSelect?: (data: DataItem) => void;
  /** Mouse enter handler */
  onActivate?: (data: DataItem) => void;
  /** Mouse leave handler */
  onDeactivate?: (data: DataItem) => void;
}

/**
 * Bar label component props
 */
export interface BarLabelProps {
  /** Value to display */
  value: number;
  /** Value formatting function */
  valueFormatting?: (value: number) => string;
  /** Bar X position */
  barX: number;
  /** Bar Y position */
  barY: number;
  /** Bar width */
  barWidth: number;
  /** Bar height */
  barHeight: number;
  /** Bar orientation */
  orientation: 'vertical' | 'horizontal';
  /** Callback when label dimensions change */
  onDimensionsChanged?: (size: { height: number; width: number; negative: boolean }) => void;
}

/**
 * Bar series component props
 */
export interface BarSeriesProps {
  /** Series data */
  series: DataItem[];
  /** Chart type */
  type?: BarChartType;
  /** X scale (band for categories or linear for values) */
  xScale: BarXScale;
  /** Y scale (band for categories or linear for values) */
  yScale: BarYScale;
  /** Color helper or getColor function */
  getColor: (value: string) => string;
  /** Get gradient stops */
  getGradientStops?: (value: string, start?: string) => Gradient[];
  /** Chart dimensions */
  dims: { width: number; height: number };
  /** Enable gradient */
  gradient?: boolean;
  /** Active entries */
  activeEntries?: DataItem[];
  /** Series name for multi-series */
  seriesName?: StringOrNumberOrDate;
  /** Tooltip disabled */
  tooltipDisabled?: boolean;
  /** Tooltip template */
  tooltipTemplate?: React.ReactNode;
  /** Round edges */
  roundEdges?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Show data labels */
  showDataLabel?: boolean;
  /** Data label formatting */
  dataLabelFormatting?: (value: number) => string;
  /** No bar when zero */
  noBarWhenZero?: boolean;
  /** Scale type */
  scaleType?: 'ordinal' | 'linear' | 'quantile';
  /** Click handler */
  onSelect?: (data: DataItem) => void;
  /** Activate handler */
  onActivate?: (data: DataItem) => void;
  /** Deactivate handler */
  onDeactivate?: (data: DataItem) => void;
  /** Data label height changed */
  onDataLabelHeightChanged?: (event: { size: { height: number; negative: boolean }; index: number }) => void;
  /** Data label width changed */
  onDataLabelWidthChanged?: (event: { size: { width: number; negative: boolean }; index: number }) => void;
}
