/**
 * @fileoverview Y-axis component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/axes/y-axis.component.ts
 *
 * @description
 * Main Y-axis component combining ticks and label.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import type { ViewDimensions } from '@/lib/ngx-charts/types';
import { Orientation } from '@/lib/ngx-charts/types';
import { YAxisTicks } from './y-axis-ticks';
import { AxisLabel } from './axis-label';

export interface YAxisProps {
  /** D3 scale function */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- D3 scales have incompatible type signatures across scale types
  yScale: any;
  /** Chart dimensions */
  dims: ViewDimensions;
  /** Whether to trim tick labels */
  trimTicks?: boolean;
  /** Maximum tick label length */
  maxTickLength?: number;
  /** Custom tick formatting function */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Callers pass (v: number) => string, (v: Date) => string, etc.; union of all signatures is impractical
  tickFormatting?: (value: any) => string;
  /** Specific tick values to display */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- D3 scale.domain() returns unknown[]; callers pass heterogeneous tick arrays
  ticks?: any[];
  /** Whether to show grid lines */
  showGridLines?: boolean;
  /** Stroke dash array for grid lines */
  gridLineStrokeDasharray?: string;
  /** Whether to show axis label */
  showLabel?: boolean;
  /** Axis label text */
  labelText?: string;
  /** Number of ticks */
  yAxisTickCount?: number;
  /** Axis orientation */
  yOrient?: Orientation;
  /** Reference lines */
  referenceLines?: Array<{ name: string; value: string | number | Date }>;
  /** Show reference lines */
  showRefLines?: boolean;
  /** Show reference labels */
  showRefLabels?: boolean;
  /** Y-axis offset */
  yAxisOffset?: number;
  /** Whether to wrap tick labels */
  wrapTicks?: boolean;
  /** Whether the axis is separated from the plot area */
  separated?: boolean;
  /** Stroke color for ticks and axis line */
  tickStroke?: string;
  /** Callback when dimensions change */
  onDimensionsChanged?: (dimensions: { width: number }) => void;
}

/**
 * Y-axis component
 */
export function YAxis({
  yScale,
  dims,
  trimTicks,
  maxTickLength,
  tickFormatting,
  ticks,
  showGridLines = false,
  gridLineStrokeDasharray,
  showLabel = false,
  labelText = '',
  yAxisTickCount,
  yOrient = Orientation.Left,
  referenceLines,
  showRefLines = false,
  showRefLabels = false,
  yAxisOffset = 0,
  wrapTicks = false,
  separated = false,
  tickStroke = '#e0ddd8',
  onDimensionsChanged,
}: YAxisProps) {
  const [labelOffset, setLabelOffset] = useState(15);
  const lastWidthRef = useRef(0);

  const transform = useMemo(() => {
    // Increase offset if separated
    const baseOffset = separated ? 12 : 5;
    const off = -(yAxisOffset + baseOffset);
    return yOrient === Orientation.Right
      ? `translate(${off + dims.width}, 0)`
      : `translate(${off}, 0)`;
  }, [yAxisOffset, yOrient, dims.width, separated]);

  const tickArguments = useMemo(
    () => yAxisTickCount !== undefined ? [yAxisTickCount] : [5],
    [yAxisTickCount]
  );

  const handleTicksWidthChange = useCallback(
    ({ width }: { width: number }) => {
      if (width !== lastWidthRef.current) {
        lastWidthRef.current = width;
        setLabelOffset(yOrient === Orientation.Right ? width + 15 : width);
        onDimensionsChanged?.({ width });
      }
    },
    [yOrient, onDimensionsChanged]
  );

  return (
    <g className="y axis" transform={transform}>
      {yScale && (
        <YAxisTicks
          scale={yScale}
          orient={yOrient}
          tickArguments={tickArguments}
          tickValues={ticks}
          tickStroke={tickStroke}
          trimTicks={trimTicks}
          maxTickLength={maxTickLength}
          tickFormatting={tickFormatting}
          showGridLines={showGridLines}
          gridLineWidth={dims.width}
          gridLineStrokeDasharray={gridLineStrokeDasharray}
          height={dims.height}
          wrapTicks={wrapTicks}
          referenceLines={referenceLines}
          showRefLines={showRefLines}
          showRefLabels={showRefLabels}
          onDimensionsChanged={handleTicksWidthChange}
          showTicks={separated}
          gridLineOffset={separated ? 12 : 5}
        />
      )}

      {/* Axis line for separated style */}
      {separated && (
        <line
          x1={0}
          x2={0}
          y1={0}
          y2={dims.height}
          stroke={tickStroke}
          strokeWidth={1}
        />
      )}

      {showLabel && labelText && (
        <AxisLabel
          label={labelText}
          offset={labelOffset}
          orient={yOrient}
          height={dims.height}
          width={dims.width}
        />
      )}
    </g>
  );
}
