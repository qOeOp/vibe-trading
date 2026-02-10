/**
 * @fileoverview X-axis component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/axes/x-axis.component.ts
 *
 * @description
 * Main X-axis component combining ticks and label.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { Orientation, ViewDimensions } from '../../types';
import { XAxisTicks } from './x-axis-ticks';
import { AxisLabel } from './axis-label';

export interface XAxisProps {
  /** D3 scale function */
  xScale: any;
  /** Chart dimensions */
  dims: ViewDimensions;
  /** Whether to trim tick labels */
  trimTicks?: boolean;
  /** Whether to rotate tick labels */
  rotateTicks?: boolean;
  /** Maximum tick label length */
  maxTickLength?: number;
  /** Custom tick formatting function */
  tickFormatting?: (value: any) => string;
  /** Whether to show grid lines */
  showGridLines?: boolean;
  /** Whether to show axis label */
  showLabel?: boolean;
  /** Axis label text */
  labelText?: string;
  /** Specific tick values to display */
  ticks?: any[];
  /** Number of ticks */
  xAxisTickCount?: number;
  /** Axis orientation */
  xOrient?: Orientation;
  /** Reference lines */
  referenceLines?: any[];
  /** Show reference lines */
  showRefLines?: boolean;
  /** Show reference labels */
  showRefLabels?: boolean;
  /** X-axis offset */
  xAxisOffset?: number;
  /** Whether to wrap tick labels */
  wrapTicks?: boolean;
  /** Callback when dimensions change */
  onDimensionsChanged?: (dimensions: { height: number }) => void;
}

/**
 * X-axis component
 */
export function XAxis({
  xScale,
  dims,
  trimTicks,
  rotateTicks = true,
  maxTickLength,
  tickFormatting,
  showGridLines = false,
  showLabel = false,
  labelText = '',
  ticks,
  xAxisTickCount,
  xOrient = Orientation.Bottom,
  referenceLines,
  showRefLines = false,
  showRefLabels = false,
  xAxisOffset = 0,
  wrapTicks = false,
  onDimensionsChanged,
}: XAxisProps) {
  const [labelOffset, setLabelOffset] = useState(0);
  const lastHeightRef = useRef(0);

  const padding = 5;
  const tickStroke = '#ddd';

  // Calculate transform
  const transform = useMemo(() => {
    return `translate(0,${xAxisOffset + padding + dims.height})`;
  }, [xAxisOffset, padding, dims.height]);

  // Calculate tick arguments
  const tickArguments = useMemo(() => {
    if (xAxisTickCount !== undefined) {
      return [xAxisTickCount];
    }
    return [5];
  }, [xAxisTickCount]);

  // Handle ticks height change
  const handleTicksHeightChange = useCallback(
    ({ height }: { height: number }) => {
      if (height !== lastHeightRef.current) {
        lastHeightRef.current = height;
        const newLabelOffset = height + 25 + 5;
        setLabelOffset(newLabelOffset);
        onDimensionsChanged?.({ height });
      }
    },
    [onDimensionsChanged]
  );

  return (
    <g className="x axis" transform={transform}>
      {xScale && (
        <XAxisTicks
          scale={xScale}
          orient={xOrient}
          tickArguments={tickArguments}
          tickValues={ticks}
          tickStroke={tickStroke}
          trimTicks={trimTicks}
          maxTickLength={maxTickLength}
          tickFormatting={tickFormatting}
          showGridLines={showGridLines}
          gridLineHeight={dims.height}
          width={dims.width}
          rotateTicks={rotateTicks}
          wrapTicks={wrapTicks}
          referenceLines={referenceLines}
          showRefLines={showRefLines}
          showRefLabels={showRefLabels}
          onDimensionsChanged={handleTicksHeightChange}
        />
      )}

      {showLabel && labelText && (
        <AxisLabel
          label={labelText}
          offset={labelOffset}
          orient={Orientation.Bottom}
          height={dims.height}
          width={dims.width}
        />
      )}
    </g>
  );
}
