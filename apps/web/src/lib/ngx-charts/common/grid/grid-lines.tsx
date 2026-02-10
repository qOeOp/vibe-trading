/**
 * @fileoverview Grid lines component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/axes/x-axis-ticks.component.ts
 *
 * @description
 * Standalone grid lines component for rendering chart grid lines.
 * Extracted from axis tick components for independent use.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { memo, useMemo } from 'react';
import { Orientation } from '@/lib/ngx-charts/types';

export interface GridLinesProps {
  /** Tick values to draw grid lines at */
  ticks: Array<string | number | Date>;
  /** Scale function to position grid lines */
  scale: (value: string | number | Date) => number | undefined;
  /** Orientation of the grid lines (vertical or horizontal) */
  orient: Orientation;
  /** Height of vertical grid lines (for x-axis) */
  gridLineHeight?: number;
  /** Width of horizontal grid lines (for y-axis) */
  gridLineWidth?: number;
  /** Stroke color for grid lines */
  stroke?: string;
  /** Stroke dash array for dashed lines */
  strokeDasharray?: string;
  /** Optional transform offset */
  offset?: number;
}

/**
 * Renders grid lines at tick positions
 *
 * Can render either vertical grid lines (for x-axis) or
 * horizontal grid lines (for y-axis) depending on orientation.
 *
 * @example
 * ```tsx
 * // Vertical grid lines (for x-axis)
 * <GridLines
 *   ticks={[0, 25, 50, 75, 100]}
 *   scale={xScale}
 *   orient={Orientation.Bottom}
 *   gridLineHeight={300}
 * />
 *
 * // Horizontal grid lines (for y-axis)
 * <GridLines
 *   ticks={[0, 100, 200, 300]}
 *   scale={yScale}
 *   orient={Orientation.Left}
 *   gridLineWidth={400}
 * />
 * ```
 */
export const GridLines = memo(function GridLines({
  ticks,
  scale,
  orient,
  gridLineHeight = 0,
  gridLineWidth = 0,
  stroke = '#ddd',
  strokeDasharray,
  offset = 0,
}: GridLinesProps) {
  const isVertical = orient === Orientation.Top || orient === Orientation.Bottom;

  const lines = useMemo(() => {
    return ticks.map((tick, index) => {
      const position = scale(tick) ?? 0;

      if (isVertical) {
        // Vertical grid lines (for x-axis ticks)
        return {
          key: `grid-line-${index}`,
          x1: position,
          y1: offset,
          x2: position,
          y2: offset - gridLineHeight,
        };
      } else {
        // Horizontal grid lines (for y-axis ticks)
        return {
          key: `grid-line-${index}`,
          x1: offset,
          y1: position,
          x2: offset + gridLineWidth,
          y2: position,
        };
      }
    });
  }, [ticks, scale, isVertical, gridLineHeight, gridLineWidth, offset]);

  const className = isVertical
    ? 'gridline-path gridline-path-vertical'
    : 'gridline-path gridline-path-horizontal';

  return (
    <g className="grid-lines">
      {lines.map((line) => (
        <line
          key={line.key}
          className={className}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
        />
      ))}
    </g>
  );
});

GridLines.displayName = 'GridLines';

/**
 * Props for the VerticalGridLines component
 */
export interface VerticalGridLinesProps {
  /** Tick values to draw grid lines at */
  ticks: Array<string | number | Date>;
  /** Scale function to position grid lines */
  scale: (value: string | number | Date) => number | undefined;
  /** Height of the grid lines */
  height: number;
  /** Stroke color for grid lines */
  stroke?: string;
  /** Stroke dash array for dashed lines */
  strokeDasharray?: string;
}

/**
 * Convenience component for vertical grid lines (x-axis)
 */
export const VerticalGridLines = memo(function VerticalGridLines({
  ticks,
  scale,
  height,
  stroke = '#ddd',
  strokeDasharray,
}: VerticalGridLinesProps) {
  return (
    <GridLines
      ticks={ticks}
      scale={scale}
      orient={Orientation.Bottom}
      gridLineHeight={height}
      stroke={stroke}
      strokeDasharray={strokeDasharray}
    />
  );
});

VerticalGridLines.displayName = 'VerticalGridLines';

/**
 * Props for the HorizontalGridLines component
 */
export interface HorizontalGridLinesProps {
  /** Tick values to draw grid lines at */
  ticks: Array<string | number | Date>;
  /** Scale function to position grid lines */
  scale: (value: string | number | Date) => number | undefined;
  /** Width of the grid lines */
  width: number;
  /** Stroke color for grid lines */
  stroke?: string;
  /** Stroke dash array for dashed lines */
  strokeDasharray?: string;
}

/**
 * Convenience component for horizontal grid lines (y-axis)
 */
export const HorizontalGridLines = memo(function HorizontalGridLines({
  ticks,
  scale,
  width,
  stroke = '#ddd',
  strokeDasharray,
}: HorizontalGridLinesProps) {
  return (
    <GridLines
      ticks={ticks}
      scale={scale}
      orient={Orientation.Left}
      gridLineWidth={width}
      stroke={stroke}
      strokeDasharray={strokeDasharray}
    />
  );
});

HorizontalGridLines.displayName = 'HorizontalGridLines';
