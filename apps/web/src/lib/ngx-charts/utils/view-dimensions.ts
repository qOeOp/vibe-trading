/**
 * @fileoverview View dimensions calculator
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/view-dimensions.helper.ts
 *
 * @description
 * Calculates chart view dimensions accounting for axes, legends, and margins.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

import { LegendPosition, ScaleType, ViewDimensions, Margin } from '../types';

export interface ViewDimensionsConfig {
  width: number;
  height: number;
  margins: Margin | [number, number, number, number];
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisHeight?: number;
  yAxisWidth?: number;
  showXLabel?: boolean;
  showYLabel?: boolean;
  showLegend?: boolean;
  legendType?: ScaleType;
  legendPosition?: LegendPosition;
  columns?: number;
}

/**
 * Calculates the actual chart view dimensions after accounting for
 * axes, labels, legend, and margins.
 */
export function calculateViewDimensions(config: ViewDimensionsConfig): ViewDimensions {
  const {
    width,
    height,
    margins,
    showXAxis = false,
    showYAxis = false,
    xAxisHeight = 0,
    yAxisWidth = 0,
    showXLabel = false,
    showYLabel = false,
    showLegend = false,
    legendType = ScaleType.Ordinal,
    legendPosition = LegendPosition.Right,
    columns: initialColumns = 12,
  } = config;

  // Convert margin array to values
  const marginArray = Array.isArray(margins)
    ? margins
    : [margins.top, margins.right, margins.bottom, margins.left];

  let xOffset = marginArray[3];
  let chartWidth = width;
  let chartHeight = height - marginArray[0] - marginArray[2];
  let columns = initialColumns;

  if (showLegend && legendPosition === LegendPosition.Right) {
    if (legendType === ScaleType.Ordinal) {
      columns -= 2;
    } else {
      columns -= 1;
    }
  }

  chartWidth = (chartWidth * columns) / 12;
  chartWidth = chartWidth - marginArray[1] - marginArray[3];

  if (showXAxis) {
    chartHeight -= 5;
    chartHeight -= xAxisHeight;

    if (showXLabel) {
      // text height + spacing between axis label and tick labels
      const offset = 25 + 5;
      chartHeight -= offset;
    }
  }

  if (showYAxis) {
    chartWidth -= 5;
    chartWidth -= yAxisWidth;
    xOffset += yAxisWidth;
    xOffset += 10;

    if (showYLabel) {
      // text height + spacing between axis label and tick labels
      const offset = 25 + 5;
      chartWidth -= offset;
      xOffset += offset;
    }
  }

  chartWidth = Math.max(0, chartWidth);
  chartHeight = Math.max(0, chartHeight);

  return {
    width: Math.floor(chartWidth),
    height: Math.floor(chartHeight),
    xOffset: Math.floor(xOffset),
  };
}

/**
 * Default margins for different chart types
 */
export const DEFAULT_MARGINS: Margin = {
  top: 10,
  right: 20,
  bottom: 10,
  left: 20,
};

/**
 * Margins for charts with axes
 */
export const AXES_MARGINS: Margin = {
  top: 20,
  right: 40,
  bottom: 40,
  left: 60,
};

/**
 * Reduces ticks to max number while maintaining even distribution
 */
export function reduceTicks<T>(ticks: T[], maxTicks: number): T[] {
  if (ticks.length <= maxTicks) {
    return ticks;
  }

  const reduced: T[] = [];
  const step = Math.floor(ticks.length / maxTicks);

  for (let i = 0; i < ticks.length; i += step) {
    reduced.push(ticks[i]);
  }

  return reduced;
}

/**
 * Determines the scale type from an array of domain values.
 * Inspects whether all values are Dates, numbers, or mixed (ordinal).
 */
export function getScaleType(values: unknown[]): ScaleType {
  if (values.length === 0) return ScaleType.Ordinal;

  let date = true;
  let num = true;

  for (const value of values) {
    if (!(value instanceof Date)) {
      date = false;
    }
    if (typeof value !== 'number') {
      num = false;
    }
  }

  if (date) return ScaleType.Time;
  if (num) return ScaleType.Linear;
  return ScaleType.Ordinal;
}
