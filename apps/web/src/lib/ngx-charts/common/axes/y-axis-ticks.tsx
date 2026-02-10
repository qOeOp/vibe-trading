/**
 * @fileoverview Y-axis ticks component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/axes/y-axis-ticks.component.ts
 *
 * @description
 * Renders tick marks and labels for the Y axis.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useEffect, useRef } from 'react';
import { Orientation, TextAnchor } from '../../types';
import { trimLabel } from '../../utils';

export interface YAxisTicksProps {
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
  /** Width of grid lines */
  gridLineWidth?: number;
  /** Stroke dash array for grid lines (e.g. "6 4") */
  gridLineStrokeDasharray?: string;
  /** Height of the axis */
  height?: number;
  /** Reference lines */
  referenceLines?: any[];
  /** Show reference labels */
  showRefLabels?: boolean;
  /** Show reference lines */
  showRefLines?: boolean;
  /** Whether to wrap tick labels */
  wrapTicks?: boolean;
  /** Callback when dimensions change */
  onDimensionsChanged?: (dimensions: { width: number }) => void;
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
 * Y-axis ticks component
 */
export function YAxisTicks({
  scale,
  orient = Orientation.Left,
  tickArguments = [5],
  tickValues,
  tickStroke = '#ddd',
  trimTicks: shouldTrimTicks = true,
  maxTickLength = 16,
  tickFormatting,
  showGridLines = false,
  gridLineWidth = 0,
  gridLineStrokeDasharray,
  height = 0,
  referenceLines,
  showRefLabels = false,
  showRefLines = false,
  wrapTicks = false,
  onDimensionsChanged,
}: YAxisTicksProps) {
  const ticksRef = useRef<SVGGElement>(null);
  const lastWidthRef = useRef(0);

  // Calculate spacing
  const innerTickSize = 6;
  const tickPadding = 3;
  const tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

  // Calculate ticks
  const ticks = useMemo(() => {
    if (tickValues) {
      return tickValues;
    }

    const maxTicks = Math.floor(height / 20);
    const maxScaleTicks = Math.floor(height / 50);

    if (scale.ticks) {
      return scale.ticks.apply(scale, [Math.max(maxScaleTicks, tickArguments[0])]);
    }

    const domain = scale.domain();
    return reduceTicks(domain, maxTicks);
  }, [scale, tickValues, tickArguments, height]);

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

  // Calculate positioning based on orientation
  const { textAnchor, x1, dy } = useMemo(() => {
    const sign = orient === Orientation.Top || orient === Orientation.Right ? -1 : 1;

    switch (orient) {
      case Orientation.Left:
        return {
          textAnchor: 'end' as TextAnchor,
          x1: tickSpacing * -sign,
          dy: '.32em',
        };
      case Orientation.Right:
        return {
          textAnchor: 'start' as TextAnchor,
          x1: tickSpacing * -sign,
          dy: '.32em',
        };
      default:
        return {
          textAnchor: 'middle' as TextAnchor,
          x1: 0,
          dy: '.71em',
        };
    }
  }, [orient, tickSpacing]);

  // Calculate tick transform
  const tickTransform = useCallback(
    (tick: any): string => {
      return `translate(0,${adjustedScale(tick)})`;
    },
    [adjustedScale]
  );

  // Measure and report width - use ref for callback to avoid infinite loops
  const onDimensionsChangedRef = useRef(onDimensionsChanged);
  onDimensionsChangedRef.current = onDimensionsChanged;

  // Use layout effect to measure after DOM updates, with debouncing to prevent loops
  useEffect(() => {
    if (!ticksRef.current || typeof window === 'undefined') return;

    // Use requestAnimationFrame to ensure DOM has settled
    const measureAndReport = () => {
      if (!ticksRef.current) return;
      const rect = ticksRef.current.getBoundingClientRect();
      const newWidth = Math.ceil(rect.width);
      if (newWidth !== lastWidthRef.current && newWidth > 0) {
        lastWidthRef.current = newWidth;
        onDimensionsChangedRef.current?.({ width: newWidth });
      }
    };

    const rafId = requestAnimationFrame(measureAndReport);
    return () => cancelAnimationFrame(rafId);
  }); // Run on every render but use ref comparison to prevent state loops

  // Get approximate width for SSR
  const getApproximateWidth = useCallback(() => {
    const maxChars = Math.max(
      ...ticks.map((t: string | number | Date) => tickTrim(tickFormat(t)).length)
    );
    const charWidth = 7;
    return maxChars * charWidth;
  }, [ticks, tickTrim, tickFormat]);

  // Grid line transform
  const gridLineTransform = 'translate(5,0)';

  return (
    <g className="y-axis-ticks">
      {/* Tick marks and labels - measured for width */}
      <g ref={ticksRef}>
        {ticks.map((tick: string | number | Date, index: number) => {
          const formatted = tickFormat(tick);
          if (!formatted) return null;

          return (
            <g key={`tick-${index}`} className="tick" transform={tickTransform(tick)}>
              <title>{formatted}</title>
              <text
                strokeWidth="0.01"
                dy={dy}
                x={x1}
                textAnchor={textAnchor}
                fontSize="12px"
              >
                {tickTrim(String(formatted))}
              </text>
            </g>
          );
        })}
      </g>

      {/* Grid lines - not included in width measurement */}
      {showGridLines &&
        ticks.map((tick: string | number | Date, index: number) => (
          <g key={`grid-${index}`} transform={tickTransform(tick)}>
            <g transform={gridLineTransform}>
              {orient === Orientation.Left && (
                <line
                  className="gridline-path gridline-path-horizontal"
                  x1={0}
                  x2={gridLineWidth}
                  strokeDasharray={gridLineStrokeDasharray}
                />
              )}
              {orient === Orientation.Right && (
                <line
                  className="gridline-path gridline-path-horizontal"
                  x1={0}
                  x2={-gridLineWidth}
                  strokeDasharray={gridLineStrokeDasharray}
                />
              )}
            </g>
          </g>
        ))}

      {/* Reference lines */}
      {showRefLines &&
        referenceLines?.map((refLine, index) => (
          <g key={`ref-${index}`} className="ref-line" transform={tickTransform(refLine.value)}>
            <line
              className="refline-path gridline-path-horizontal"
              x1={0}
              x2={gridLineWidth}
              stroke="#a8b2c7"
              strokeDasharray="5"
              strokeDashoffset={5}
            />
            {showRefLabels && (
              <g>
                <title>{tickTrim(tickFormat(refLine.value))}</title>
                <text
                  className="refline-label"
                  dy={dy}
                  y={-6}
                  x={gridLineWidth}
                  textAnchor={textAnchor}
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
