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
import { Orientation, TextAnchor } from '../../types';
import { trimLabel } from '../../utils';

export interface XAxisTicksProps {
  /** D3 scale function */
  scale: any;
  /** Axis orientation */
  orient?: Orientation;
  /** Number of ticks to display */
  tickArguments?: number[];
  /** Specific tick values to display */
  tickValues?: (string | number)[];
  /** Tick stroke color */
  tickStroke?: string;
  /** Whether to trim tick labels */
  trimTicks?: boolean;
  /** Maximum tick label length */
  maxTickLength?: number;
  /** Custom tick formatting function */
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
  referenceLines?: any[];
  /** Show reference labels */
  showRefLabels?: boolean;
  /** Show reference lines */
  showRefLines?: boolean;
  /** Callback when dimensions change */
  onDimensionsChanged?: (dimensions: { height: number }) => void;
}

/**
 * Reduces ticks to max number while maintaining even distribution
 */
function reduceTicks(ticks: any[], maxTicks: number): any[] {
  if (ticks.length <= maxTicks) {
    return ticks;
  }

  const reduced: any[] = [];
  const step = Math.floor(ticks.length / maxTicks);

  for (let i = 0; i < ticks.length; i += step) {
    reduced.push(ticks[i]);
  }

  return reduced;
}

/**
 * X-axis ticks component
 */
export function XAxisTicks({
  scale,
  orient = Orientation.Bottom,
  tickArguments = [5],
  tickValues,
  tickStroke = '#ddd',
  trimTicks: shouldTrimTicks = true,
  maxTickLength = 16,
  tickFormatting,
  showGridLines = false,
  gridLineHeight = 0,
  width = 0,
  rotateTicks: shouldRotateTicks = true,
  wrapTicks = false,
  referenceLines,
  showRefLabels = false,
  showRefLines = false,
  onDimensionsChanged,
}: XAxisTicksProps) {
  const ticksRef = useRef<SVGGElement>(null);
  const lastHeightRef = useRef(0);

  // Calculate ticks
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

  // Tick format function
  const tickFormat = useCallback(
    (value: any): string => {
      if (tickFormatting) {
        return tickFormatting(value);
      }
      if (scale.tickFormat) {
        return scale.tickFormat.apply(scale, tickArguments)(value);
      }
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      return String(value);
    },
    [tickFormatting, scale, tickArguments]
  );

  // Trim tick label
  const tickTrim = useCallback(
    (label: string): string => {
      return shouldTrimTicks ? trimLabel(label, maxTickLength) : label;
    },
    [shouldTrimTicks, maxTickLength]
  );

  // Get adjusted scale for band scales
  const adjustedScale = useMemo(() => {
    if (scale.bandwidth) {
      return (d: any) => scale(d) + scale.bandwidth() * 0.5;
    }
    return scale;
  }, [scale]);

  // Calculate rotation angle
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

  // Measure and report height - use ref for callback to avoid infinite loops
  const onDimensionsChangedRef = useRef(onDimensionsChanged);
  onDimensionsChangedRef.current = onDimensionsChanged;

  // Use layout effect to measure after DOM updates, with debouncing to prevent loops
  useEffect(() => {
    if (!ticksRef.current || typeof window === 'undefined') return;

    // Use requestAnimationFrame to ensure DOM has settled
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
  }); // Run on every render but use ref comparison to prevent state loops

  // Calculate tick transform
  const tickTransform = useCallback(
    (tick: any): string => {
      return `translate(${adjustedScale(tick)},${verticalSpacing})`;
    },
    [adjustedScale, verticalSpacing]
  );

  // Grid line transform
  const gridLineTransform = `translate(0,${-verticalSpacing - 5})`;

  return (
    <g className="x-axis-ticks">
      {/* Tick marks and labels - measured for height */}
      <g ref={ticksRef}>
        {ticks.map((tick: string | number | Date, index: number) => {
          const formatted = tickFormat(tick);
          if (!formatted) return null;

          return (
            <g key={`tick-${index}`} className="tick" transform={tickTransform(tick)}>
              <title>{formatted}</title>
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

      {/* Grid lines - not included in height measurement */}
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

      {/* Reference lines */}
      {showRefLines &&
        referenceLines?.map((refLine, index) => (
          <g key={`ref-${index}`} className="ref-line" transform={`translate(${adjustedScale(refLine.value)},0)`}>
            <line
              className="refline-path gridline-path-vertical"
              y1={25}
              y2={25 + gridLineHeight}
              transform={gridLineTransform}
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
        ))}
    </g>
  );
}
