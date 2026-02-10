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
import { Orientation, ViewDimensions } from '../../types';
import { YAxisTicks } from './y-axis-ticks';
import { AxisLabel } from './axis-label';

export interface YAxisProps {
  /** D3 scale function */
  yScale: any;
  /** Chart dimensions */
  dims: ViewDimensions;
  /** Whether to trim tick labels */
  trimTicks?: boolean;
  /** Maximum tick label length */
  maxTickLength?: number;
  /** Custom tick formatting function */
  tickFormatting?: (value: any) => string;
  /** Specific tick values to display */
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
  referenceLines?: any[];
  /** Show reference lines */
  showRefLines?: boolean;
  /** Show reference labels */
  showRefLabels?: boolean;
  /** Y-axis offset */
  yAxisOffset?: number;
  /** Whether to wrap tick labels */
  wrapTicks?: boolean;
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
  onDimensionsChanged,
}: YAxisProps) {
  const [labelOffset, setLabelOffset] = useState(15);
  const lastWidthRef = useRef(0);

  const padding = 5;
  const tickStroke = '#ddd';

  // Calculate transform and offset
  const { transform, offset } = useMemo(() => {
    const off = -(yAxisOffset + padding);
    let trans: string;

    if (yOrient === Orientation.Right) {
      trans = `translate(${off + dims.width}, 0)`;
    } else {
      trans = `translate(${off}, 0)`;
    }

    return { transform: trans, offset: off };
  }, [yAxisOffset, padding, yOrient, dims.width]);

  // Calculate tick arguments
  const tickArguments = useMemo(() => {
    if (yAxisTickCount !== undefined) {
      return [yAxisTickCount];
    }
    return [5];
  }, [yAxisTickCount]);

  // Handle ticks width change
  const handleTicksWidthChange = useCallback(
    ({ width }: { width: number }) => {
      if (width !== lastWidthRef.current) {
        lastWidthRef.current = width;
        let newLabelOffset: number;
        if (yOrient === Orientation.Right) {
          newLabelOffset = width + 15; // Base offset for right orientation
        } else {
          newLabelOffset = width;
        }
        setLabelOffset(newLabelOffset);
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
