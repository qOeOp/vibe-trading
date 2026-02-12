/**
 * @fileoverview X-axis ticks component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/axes/x-axis-ticks.component.ts
 *
 * @description
 * Renders tick marks and labels for the X axis.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useEffect, useRef } from 'react';
import type { Orientation, TextAnchor } from '@/lib/ngx-charts/types';
import { trimLabel, reduceTicks } from '@/lib/ngx-charts/utils';

/** Reference line definition for axis display */
interface ReferenceLine {
  name: string;
  value: string | number | Date;
}

export interface XAxisTicksProps {
  /** D3 scale function */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- D3 scales have incompatible type signatures across scale types
  scale: any;
  /** Axis orientation */
  orient?: Orientation;
  /** Number of ticks to display */
  tickArguments?: number[];
  /** Specific tick values to display */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- D3 scale.domain() returns unknown[]; callers pass heterogeneous tick arrays
  tickValues?: any[];
  /** Tick stroke color */
  tickStroke?: string;
  /** Whether to trim tick labels */
  trimTicks?: boolean;
  /** Maximum tick label length */
  maxTickLength?: number;
  /** Custom tick formatting function */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Callers pass (v: number) => string, (v: Date) => string, etc.; union of all signatures is impractical
  tickFormatting?: (value: any) => string;
  /** Whether to show grid lines */
  showGridLines?: boolean;
  /** Height of grid lines */
  gridLineHeight?: number;
  /** Width of the axis */
  width?: number;
  /** Whether to rotate tick labels */
  rotateTicks?: boolean;
  /** Whether to wrap tick labels */
  wrapTicks?: boolean;
  /** Reference lines */
  referenceLines?: ReferenceLine[];
  /** Show reference labels */
  showRefLabels?: boolean;
  /** Show reference lines */
  showRefLines?: boolean;
  /** Whether to show tick lines */
  showTicks?: boolean;
  /** Offset for grid lines */
  gridLineOffset?: number;
  /** Callback when dimensions change */
  onDimensionsChanged?: (dimensions: { height: number }) => void;
}

export function XAxisTicks({
  scale,
  tickArguments = [5],
  tickValues,
  tickStroke = '#e0ddd8',
  trimTicks: shouldTrimTicks = true,
  maxTickLength = 16,
  tickFormatting,
  showGridLines = false,
  gridLineHeight = 0,
  width = 0,
  rotateTicks: shouldRotateTicks = true,
  referenceLines,
  showRefLabels = false,
  showRefLines = false,
  showTicks = false,
  gridLineOffset = 5,
  onDimensionsChanged,
}: XAxisTicksProps) {
  const ticksRef = useRef<SVGGElement>(null);
  const lastHeightRef = useRef(0);

  const ticks = useMemo(() => {
    if (tickValues) {
      return tickValues;
    }

    const maxTicks = Math.floor(width / 20);
    const maxScaleTicks = Math.floor(width / 100);

    if (scale.ticks) {
      return scale.ticks.apply(scale, [Math.max(maxScaleTicks, tickArguments[0])]);
    }

    const domain = scale.domain();
    return reduceTicks(domain, maxTicks);
  }, [scale, tickValues, tickArguments, width]);

  const tickFormat = useCallback(
    (value: string | number | Date): string => {
      if (tickFormatting) {
        return tickFormatting(value);
      }
      if (scale.tickFormat) {
        return scale.tickFormat(...tickArguments)(value);
      }
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      return String(value);
    },
    [tickFormatting, scale, tickArguments]
  );

  const tickTrim = useCallback(
    (label: string): string => shouldTrimTicks ? trimLabel(label, maxTickLength) : label,
    [shouldTrimTicks, maxTickLength]
  );

  const adjustedScale = useMemo(() => {
    if (scale.bandwidth) {
      return (d: string | number | Date) => scale(d) + scale.bandwidth() * 0.5;
    }
    return scale;
  }, [scale]);

  const { textTransform, textAnchor, verticalSpacing } = useMemo(() => {
    if (!shouldRotateTicks || ticks.length === 0) {
      return {
        textTransform: '',
        textAnchor: 'middle' as TextAnchor,
        verticalSpacing: 10,
      };
    }

    let maxTicksLength = 0;
    for (const tick of ticks) {
      const formatted = tickFormat(tick);
      const tickLength = shouldTrimTicks
        ? tickTrim(String(formatted)).length
        : String(formatted).length;
      if (tickLength > maxTicksLength) {
        maxTicksLength = tickLength;
      }
    }

    const len = Math.min(maxTicksLength, 16);
    const charWidth = 7;
    const wordWidth = len * charWidth;
    let baseWidth = wordWidth;
    const maxBaseWidth = Math.floor(width / ticks.length);

    let angle = 0;
    while (baseWidth > maxBaseWidth && angle > -90) {
      angle -= 30;
      baseWidth = Math.cos(angle * (Math.PI / 180)) * wordWidth;
    }

    if (angle !== 0) {
      return {
        textTransform: `rotate(${angle})`,
        textAnchor: 'end' as TextAnchor,
        verticalSpacing: 10,
      };
    }

    return {
      textTransform: '',
      textAnchor: 'middle' as TextAnchor,
      verticalSpacing: 20,
    };
  }, [shouldRotateTicks, ticks, tickFormat, tickTrim, shouldTrimTicks, width]);

  const onDimensionsChangedRef = useRef(onDimensionsChanged);
  onDimensionsChangedRef.current = onDimensionsChanged;

  useEffect(() => {
    if (!ticksRef.current || typeof window === 'undefined') return;

    const measureAndReport = () => {
      if (!ticksRef.current) return;
      const rect = ticksRef.current.getBoundingClientRect();
      const newHeight = Math.ceil(rect.height);
      if (newHeight !== lastHeightRef.current && newHeight > 0) {
        lastHeightRef.current = newHeight;
        onDimensionsChangedRef.current?.({ height: newHeight });
      }
    };

    const rafId = requestAnimationFrame(measureAndReport);
    return () => cancelAnimationFrame(rafId);
  });

  const tickTransform = useCallback(
    (tick: string | number | Date): string => {
      return `translate(${adjustedScale(tick)},${verticalSpacing})`;
    },
    [adjustedScale, verticalSpacing]
  );

  const gridLineTransform = `translate(0,${-verticalSpacing - gridLineOffset})`;

  return (
    <g className="x-axis-ticks">
      <g ref={ticksRef}>
        {ticks.map((tick: string | number | Date, index: number) => {
          const formatted = tickFormat(tick);
          if (!formatted) return null;

          return (
            <g key={`tick-${index}`} className="tick" transform={tickTransform(tick)}>
              <title>{formatted}</title>
              {showTicks && (
                <line
                  x1={0}
                  x2={0}
                  y1={0}
                  y2={6}
                  stroke={tickStroke}
                />
              )}
              <text
                strokeWidth="0.01"
                fontSize="12px"
                textAnchor={textAnchor}
                transform={textTransform}
              >
                {tickTrim(String(formatted))}
              </text>
            </g>
          );
        })}
      </g>

      {showGridLines &&
        ticks.map((tick: string | number | Date, index: number) => (
          <g key={`grid-${index}`} transform={tickTransform(tick)}>
            <g transform={gridLineTransform}>
              <line
                className="gridline-path gridline-path-vertical"
                y1={-gridLineHeight}
                y2={0}
              />
            </g>
          </g>
        ))}

      {showRefLines &&
        referenceLines?.map((refLine, index) => (
          <g key={`ref-${index}`} className="ref-line" transform={`translate(${adjustedScale(refLine.value)},0)`}>
            <g transform={gridLineTransform}>
              <line
                className="refline-path gridline-path-vertical"
                y1={0}
                y2={gridLineHeight}
                stroke="#a8b2c7"
                strokeDasharray="5"
                strokeDashoffset={5}
              />
              {showRefLabels && (
                <g>
                  <title>{tickTrim(tickFormat(refLine.value))}</title>
                  <text
                    className="refline-label"
                    transform="rotate(-270) translate(5, -5)"
                    fontSize="9px"
                  >
                    {refLine.name}
                  </text>
                </g>
              )}
            </g>
          </g>
        ))}
    </g>
  );
}
