/**
 * @fileoverview Tooltip module exports
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/tooltip/
 *
 * @description
 * Exports for tooltip-related components and utilities.
 * Includes main tooltip component, content wrapper, and hover area detector.
 *
 * @license MIT
 */

// Main tooltip wrapper component
export { Tooltip } from './tooltip';
export type { TooltipProps, TooltipShowEvent } from './tooltip';

// Tooltip content component
export { TooltipContent, PositionHelper } from './tooltip-content';
export type {
  TooltipContentProps,
  TooltipStyleType,
  TooltipAlignment,
} from './tooltip-content';

// Tooltip area component for chart hover detection
export { TooltipArea } from './tooltip-area';
export type {
  TooltipAreaProps,
  TooltipItem,
  ColorHelper as TooltipColorHelper,
  SeriesData,
  SeriesData as TooltipSeriesData,
} from './tooltip-area';

// Global tooltip context (like Angular's TooltipService)
export { ChartTooltipProvider, useChartTooltip } from './tooltip-context';
