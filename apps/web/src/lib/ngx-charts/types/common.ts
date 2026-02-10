/**
 * @fileoverview Common type definitions
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/types/
 *
 * @description
 * Common types used across chart components.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

import type { ScaleType } from './scale';

/** View dimensions for chart rendering */
export interface ViewDimensions {
  width: number;
  height: number;
  xOffset?: number;
  yOffset?: number;
}

/** Gradient stop for SVG gradients */
export interface Gradient {
  offset: number;
  originalOffset?: number;
  color: string;
  opacity: number;
}

/** Color scheme definition */
export interface ColorScheme {
  name: string;
  selectable: boolean;
  group: ScaleType;
  domain: string[];
}

/** Legend position options */
export enum LegendPosition {
  Right = 'right',
  Below = 'below',
}

/** Legend type options */
export enum LegendType {
  ScaleLegend = 'scaleLegend',
  Legend = 'legend',
}

/** Orientation options */
export enum Orientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

/** Bar chart orientation */
export enum BarOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

/** Bar chart label position */
export enum BarLabelPosition {
  Inside = 'inside',
  Outside = 'outside',
}

/** Text anchor options */
export type TextAnchor = 'start' | 'middle' | 'end';

/** Placement options for elements */
export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

/** Axis configuration (React style with nested objects) */
export interface AxisConfig {
  visible?: boolean;
  label?: string;
  showLabel?: boolean;
  showGridLines?: boolean;
  gridLineStrokeDasharray?: string;
  tickFormatting?: (value: unknown) => string;
  ticks?: unknown[];
  minScale?: number;
  maxScale?: number;
}

/** Legend configuration */
export interface LegendConfig {
  visible?: boolean;
  title?: string;
  position?: LegendPosition;
}

/** Tooltip configuration */
export interface TooltipConfig {
  disabled?: boolean;
  template?: React.ReactNode;
}

/** Common chart props interface (React style) */
export interface ChartProps {
  /** Chart data */
  data: unknown;
  /** Fixed width (optional, defaults to container width) */
  width?: number;
  /** Fixed height (optional, defaults to container height) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Scale type for color mapping */
  scaleType?: ScaleType;
  /** Custom color mapping function or array */
  colors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Enable/disable animations */
  animated?: boolean;
  /** X-axis configuration */
  xAxis?: AxisConfig;
  /** Y-axis configuration */
  yAxis?: AxisConfig;
  /** Legend configuration */
  legend?: LegendConfig;
  /** Tooltip configuration */
  tooltip?: TooltipConfig;
  /** Enable gradient fills */
  gradient?: boolean;
  /** Currently active/selected items */
  activeItems?: unknown[];
  /** Callback when an item is selected */
  onSelect?: (event: unknown) => void;
  /** Callback when an item is activated (hovered) */
  onActivate?: (event: unknown) => void;
  /** Callback when an item is deactivated */
  onDeactivate?: (event: unknown) => void;
  /** Custom CSS class name */
  className?: string;
}

/** Margin configuration */
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Bar padding configuration */
export interface BarPadding {
  inner: number;
  outer: number;
}
