'use client';

/**
 * @fileoverview Self-contained chart title component
 *
 * Renders an HTML title row above the SVG chart area.
 * Callers pass `margin[3]` (left margin) as xOffset so the title aligns
 * with Y-axis tick labels that use `tickTextAnchor: 'start'`.
 *
 * The recommended consumer pattern is:
 *   yAxis: { width: 45, tickTextAnchor: 'start' }
 *   margins: { left: 0 }
 * This gives left-aligned Y-axis labels starting at SVG x=0, and
 * title paddingLeft=0 matches exactly.
 */

import type { ReactNode } from 'react';

/** Fixed height of the chart title row in pixels */
export const CHART_TITLE_HEIGHT = 20;

export interface ChartTitleProps {
  /** Primary title text */
  title: string;
  /** Right-aligned suffix (text or ReactNode for legend swatches) */
  suffix?: ReactNode;
  /** Left padding in pixels — pass margin[3] to align with Y-axis tick labels */
  xOffset?: number;
}

/**
 * Chart title row aligned with Y-axis tick labels.
 */
export function ChartTitle({ title, suffix, xOffset = 0 }: ChartTitleProps) {
  return (
    <div
      data-slot="chart-title"
      className="flex items-center justify-between h-5 shrink-0 pr-2"
      style={{ paddingLeft: `${xOffset}px` }}
    >
      <span className="text-xs font-medium text-mine-muted truncate">
        {title}
      </span>
      {suffix != null && (
        <span className="text-[10px] text-mine-muted shrink-0 ml-2">
          {suffix}
        </span>
      )}
    </div>
  );
}
