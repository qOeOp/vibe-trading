/**
 * @fileoverview Grid panel series component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/grid-panel-series.component.ts
 *
 * @description
 * Renders a series of alternating grid panels for bar charts.
 * Creates odd/even background patterns aligned with bar positions.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, memo } from 'react';
import type { ScaleBand } from 'd3-scale';
import { GridPanel } from './grid-panel';
import type { ViewDimensions } from '@/lib/ngx-charts/types';
import { BarOrientation } from '@/lib/ngx-charts/types';

/** Classification for grid panel styling (odd/even alternation) */
export enum GridPanelClass {
  Odd = 'odd',
  Even = 'even',
}

/** Internal grid panel data structure */
export interface GridPanelData {
  /** Data item name */
  name: string;
  /** CSS class for odd/even styling */
  class: GridPanelClass;
  /** Panel height */
  height: number;
  /** Panel width */
  width: number;
  /** Panel X coordinate */
  x: number;
  /** Panel Y coordinate */
  y: number;
}

/** Data item with name property */
export interface GridDataItem {
  name: string;
  [key: string]: unknown;
}

export interface GridPanelSeriesProps {
  /** Data items to create panels for */
  data: GridDataItem[];
  /** View dimensions */
  dims: ViewDimensions;
  /** X-axis scale (band scale for vertical bars) */
  xScale: ScaleBand<string>;
  /** Y-axis scale (band scale for horizontal bars) */
  yScale: ScaleBand<string>;
  /** Bar orientation */
  orient: BarOrientation;
}

/**
 * Generates grid panel data based on orientation and scales
 */
function getGridPanels(
  data: GridDataItem[],
  dims: ViewDimensions,
  xScale: ScaleBand<string>,
  yScale: ScaleBand<string>,
  orient: BarOrientation
): GridPanelData[] {
  return data.map((d) => {
    let offset: number;
    let width: number;
    let height: number;
    let x: number;
    let y: number;
    let className = GridPanelClass.Odd;

    if (orient === BarOrientation.Vertical) {
      const position: number = xScale(d.name) ?? 0;
      const step = xScale.step();
      const positionIndex = step > 0 ? Math.floor(position / step) : 0;

      if (positionIndex % 2 === 1) {
        className = GridPanelClass.Even;
      }
      const bandwidth = xScale.bandwidth();
      const paddingInner = xScale.paddingInner?.() ?? 0;
      offset = bandwidth * paddingInner;
      width = bandwidth + offset;
      height = dims.height;
      x = (xScale(d.name) ?? 0) - offset / 2;
      y = 0;
    } else {
      // BarOrientation.Horizontal
      const position = yScale(d.name) ?? 0;
      const step = yScale.step();
      const positionIndex = step > 0 ? Math.floor(position / step) : 0;

      if (positionIndex % 2 === 1) {
        className = GridPanelClass.Even;
      }
      const bandwidth = yScale.bandwidth();
      const paddingInner = yScale.paddingInner?.() ?? 0;
      offset = bandwidth * paddingInner;

      width = dims.width;
      height = bandwidth + offset;
      x = 0;
      y = (yScale(d.name) ?? 0) - offset / 2;
    }

    return {
      name: d.name,
      class: className,
      height,
      width,
      x,
      y,
    };
  });
}

/**
 * Grid panel series component for rendering alternating background panels
 *
 * Creates a series of rectangular backgrounds that align with bar chart
 * positions, alternating between odd and even styling.
 *
 * @example
 * ```tsx
 * <GridPanelSeries
 *   data={chartData}
 *   dims={{ width: 400, height: 300 }}
 *   xScale={xScale}
 *   yScale={yScale}
 *   orient={BarOrientation.Vertical}
 * />
 * ```
 */
export const GridPanelSeries = memo(function GridPanelSeries({
  data,
  dims,
  xScale,
  yScale,
  orient,
}: GridPanelSeriesProps) {
  const gridPanels = useMemo(
    () => getGridPanels(data, dims, xScale, yScale, orient),
    [data, dims, xScale, yScale, orient]
  );

  return (
    <g className="grid-panel-series">
      {gridPanels.map((panel, index) => (
        <GridPanel
          key={`panel-${panel.name}-${index}`}
          x={panel.x}
          y={panel.y}
          width={panel.width}
          height={panel.height}
          className={panel.class}
        />
      ))}
    </g>
  );
});

GridPanelSeries.displayName = 'GridPanelSeries';
