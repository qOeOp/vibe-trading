/**
 * @fileoverview Bubble chart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bubble-chart/bubble-chart.component.ts
 *
 * @description
 * Main bubble chart component supporting multiple series with X, Y, and R (radius)
 * dimensions. Features customizable axes, legend, tooltips, and animations.
 * Migrated from Angular ngx-charts library to React with Framer Motion.
 *
 * @license MIT
 */

'use client';

import { useState, useCallback, useMemo, useId, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleLinear, scaleTime, scalePoint, ScaleLinear, ScaleTime, ScalePoint } from 'd3-scale';

import {
  BubbleChartMultiSeries,
  BubbleChartSeries,
  BubbleChartDataItem,
  ColorScheme,
  ScaleType,
  LegendPosition,
  ViewDimensions,
  StringOrNumberOrDate,
} from '../types';
import { BaseChart, XAxis, YAxis, Legend } from '../common';
import { calculateViewDimensions, ColorHelper } from '../utils';
import { BubbleSeries, BubbleScale } from './bubble-series';

export interface BubbleChartProps {
  /** Chart data - array of series with name and bubble data points */
  data: BubbleChartMultiSeries;
  /** Fixed width (optional, defaults to container width) */
  width?: number;
  /** Fixed height (optional, defaults to container height) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Scale type for color mapping (ordinal or linear based on r values) */
  schemeType?: ScaleType;
  /** Custom color mapping */
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Enable/disable animations */
  animated?: boolean;
  /** Show X axis */
  showXAxis?: boolean;
  /** Show Y axis */
  showYAxis?: boolean;
  /** Show X axis label */
  showXAxisLabel?: boolean;
  /** Show Y axis label */
  showYAxisLabel?: boolean;
  /** X axis label text */
  xAxisLabel?: string;
  /** Y axis label text */
  yAxisLabel?: string;
  /** Show legend */
  showLegend?: boolean;
  /** Legend title */
  legendTitle?: string;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Show grid lines */
  showGridLines?: boolean;
  /** Maximum bubble radius */
  maxRadius?: number;
  /** Minimum bubble radius */
  minRadius?: number;
  /** Auto scale to data range (don't include 0) */
  autoScale?: boolean;
  /** Round domains to nice values */
  roundDomains?: boolean;
  /** Disable tooltips */
  tooltipDisabled?: boolean;
  /** X scale minimum */
  xScaleMin?: number;
  /** X scale maximum */
  xScaleMax?: number;
  /** Y scale minimum */
  yScaleMin?: number;
  /** Y scale maximum */
  yScaleMax?: number;
  /** Trim X axis tick labels */
  trimXAxisTicks?: boolean;
  /** Trim Y axis tick labels */
  trimYAxisTicks?: boolean;
  /** Rotate X axis tick labels */
  rotateXAxisTicks?: boolean;
  /** Max X axis tick label length */
  maxXAxisTickLength?: number;
  /** Max Y axis tick label length */
  maxYAxisTickLength?: number;
  /** X axis tick formatting function */
  xAxisTickFormatting?: (value: unknown) => string;
  /** Y axis tick formatting function */
  yAxisTickFormatting?: (value: unknown) => string;
  /** Specific X axis tick values */
  xAxisTicks?: unknown[];
  /** Specific Y axis tick values */
  yAxisTicks?: unknown[];
  /** Wrap long tick labels */
  wrapTicks?: boolean;
  /** Custom tooltip template */
  tooltipTemplate?: (item: BubbleChartDataItem, series: BubbleChartSeries) => ReactNode;
  /** Callback when a bubble is selected */
  onSelect?: (event: BubbleChartDataItem & { series: StringOrNumberOrDate }) => void;
  /** Callback when an item is activated (hovered) */
  onActivate?: (event: { value: unknown; entries: unknown[] }) => void;
  /** Callback when an item is deactivated */
  onDeactivate?: (event: { value: unknown; entries: unknown[] }) => void;
  /** Custom CSS class name */
  className?: string;
}

/** Determine scale type from values */
function getScaleType(values: unknown[]): ScaleType {
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

/** Get domain from values based on scale type */
function getDomain(
  values: unknown[],
  scaleType: ScaleType,
  autoScale: boolean,
  minVal?: number,
  maxVal?: number
): unknown[] {
  let domain: unknown[] = [];

  if (scaleType === ScaleType.Linear) {
    const numValues = values.map((v) => Number(v));
    if (!autoScale) {
      numValues.push(0);
    }
    const min = minVal ?? Math.min(...numValues);
    const max = maxVal ?? Math.max(...numValues);
    domain = [min, max];
  } else if (scaleType === ScaleType.Time) {
    const times = values.map((v) => (v instanceof Date ? v.getTime() : new Date(v as string).getTime()));
    const min = minVal ?? Math.min(...times);
    const max = maxVal ?? Math.max(...times);
    domain = [new Date(min), new Date(max)];
  } else {
    domain = values;
  }

  return domain;
}

/** Create scale based on type */
function getScale(
  domain: unknown[],
  range: [number, number],
  scaleType: ScaleType,
  roundDomains: boolean
): BubbleScale {
  switch (scaleType) {
    case ScaleType.Time:
      return scaleTime<number, number>()
        .range(range)
        .domain(domain as [Date, Date]);
    case ScaleType.Linear: {
      const scale = scaleLinear<number, number>()
        .range(range)
        .domain(domain as [number, number]);
      return roundDomains ? scale.nice() : scale;
    }
    case ScaleType.Ordinal:
    default:
      return scalePoint<string>()
        .range(range)
        .domain(domain.map((r) => String(r)));
  }
}

/**
 * Bubble Chart component
 *
 * A feature-rich bubble chart supporting:
 * - Multiple data series with X, Y, R dimensions
 * - Customizable axes with labels and tick formatting
 * - Legend with click/hover interactions
 * - Tooltips on hover
 * - Smooth bubble animations
 * - Support for linear, time, and ordinal scales
 * - Configurable bubble size range
 */
export function BubbleChart({
  data,
  width,
  height,
  colorScheme = 'cool',
  schemeType = ScaleType.Ordinal,
  customColors,
  animated = true,
  showXAxis = true,
  showYAxis = true,
  showXAxisLabel = false,
  showYAxisLabel = false,
  xAxisLabel = '',
  yAxisLabel = '',
  showLegend = false,
  legendTitle = 'Legend',
  legendPosition = LegendPosition.Right,
  showGridLines = true,
  maxRadius = 10,
  minRadius = 3,
  autoScale = false,
  roundDomains = false,
  tooltipDisabled = false,
  xScaleMin,
  xScaleMax,
  yScaleMin,
  yScaleMax,
  trimXAxisTicks = true,
  trimYAxisTicks = true,
  rotateXAxisTicks = true,
  maxXAxisTickLength = 16,
  maxYAxisTickLength = 16,
  xAxisTickFormatting,
  yAxisTickFormatting,
  xAxisTicks,
  yAxisTicks,
  wrapTicks = false,
  tooltipTemplate,
  onSelect,
  onActivate,
  onDeactivate,
  className = '',
}: BubbleChartProps) {
  // State for axis dimensions
  const [xAxisHeight, setXAxisHeight] = useState(0);
  const [yAxisWidth, setYAxisWidth] = useState(0);
  const [activeEntries, setActiveEntries] = useState<Array<{ name: string }>>([]);

  // Generate stable clip path ID (must be at component level, not inside render prop)
  const reactId = useId();
  const clipPathId = `clip${reactId.replace(/:/g, '')}`;

  // Margins
  const margin: [number, number, number, number] = [10, 20, 10, 20];

  return (
    <BaseChart
      width={width}
      height={height}
      colorScheme={colorScheme}
      scaleType={schemeType}
      colors={customColors}
      animated={animated}
      className={`ngx-charts-bubble-chart ${className}`}
    >
      {({ width: containerWidth, height: containerHeight }) => {
        // Calculate view dimensions
        const dims = calculateViewDimensions({
          width: containerWidth,
          height: containerHeight,
          margins: margin,
          showXAxis,
          showYAxis,
          xAxisHeight,
          yAxisWidth,
          showXLabel: showXAxisLabel,
          showYLabel: showYAxisLabel,
          showLegend,
          legendType: schemeType,
          legendPosition,
        });

        // Extract domains
        const seriesDomain = data.map((d) => String(d.name));

        // Calculate R domain (radius values)
        const rDomain = useMemo((): [number, number] => {
          let min = Infinity;
          let max = -Infinity;

          for (const series of data) {
            for (const d of series.series) {
              const value = Number(d.r) || 1;
              min = Math.min(min, value);
              max = Math.max(max, value);
            }
          }

          return [min === Infinity ? 0 : min, max === -Infinity ? 1 : max];
        }, [data]);

        // Calculate X domain
        const { xDomain, xScaleType } = useMemo(() => {
          const values: unknown[] = [];
          for (const series of data) {
            for (const d of series.series) {
              if (!values.includes(d.x)) {
                values.push(d.x);
              }
            }
          }
          const scaleType = getScaleType(values);
          const domain = getDomain(values, scaleType, autoScale, xScaleMin, xScaleMax);
          return { xDomain: domain, xScaleType: scaleType };
        }, [data, autoScale, xScaleMin, xScaleMax]);

        // Calculate Y domain
        const { yDomain, yScaleType } = useMemo(() => {
          const values: unknown[] = [];
          for (const series of data) {
            for (const d of series.series) {
              if (!values.includes(d.y)) {
                values.push(d.y);
              }
            }
          }
          const scaleType = getScaleType(values);
          const domain = getDomain(values, scaleType, autoScale, yScaleMin, yScaleMax);
          return { yDomain: domain, yScaleType: scaleType };
        }, [data, autoScale, yScaleMin, yScaleMax]);

        // Ensure min/max radius are at least 1
        const effectiveMinRadius = Math.max(minRadius, 1);
        const effectiveMaxRadius = Math.max(maxRadius, 1);

        // Create radius scale
        const rScale = useMemo(() => {
          const scale = scaleLinear<number, number>()
            .range([effectiveMinRadius, effectiveMaxRadius])
            .domain(rDomain);
          return roundDomains ? scale.nice() : scale;
        }, [rDomain, effectiveMinRadius, effectiveMaxRadius, roundDomains]);

        // Calculate bubble padding to prevent clipping
        const bubblePadding = useMemo(() => {
          // First pass: create scales without padding
          const tempXScale = getScale(xDomain, [0, dims.width], xScaleType, roundDomains);
          const tempYScale = getScale(yDomain, [dims.height, 0], yScaleType, roundDomains);

          let yMin = 0;
          let xMin = 0;
          let yMax = dims.height;
          let xMax = dims.width;

          for (const series of data) {
            for (const d of series.series) {
              const r = rScale(d.r || 1);
              let cx: number;
              let cy: number;

              if (xScaleType === ScaleType.Linear) {
                cx = (tempXScale as ScaleLinear<number, number>)(Number(d.x));
              } else if (xScaleType === ScaleType.Time) {
                const date = d.x instanceof Date ? d.x : new Date(d.x as string);
                cx = (tempXScale as ScaleTime<number, number>)(date);
              } else {
                cx = (tempXScale as ScalePoint<string>)(String(d.x)) ?? 0;
              }

              if (yScaleType === ScaleType.Linear) {
                cy = (tempYScale as ScaleLinear<number, number>)(Number(d.y));
              } else if (yScaleType === ScaleType.Time) {
                const date = d.y instanceof Date ? d.y : new Date(d.y as string);
                cy = (tempYScale as ScaleTime<number, number>)(date);
              } else {
                cy = (tempYScale as ScalePoint<string>)(String(d.y)) ?? 0;
              }

              xMin = Math.max(r - cx, xMin);
              yMin = Math.max(r - cy, yMin);
              yMax = Math.max(cy + r, yMax);
              xMax = Math.max(cx + r, xMax);
            }
          }

          xMax = Math.max(xMax - dims.width, 0);
          yMax = Math.max(yMax - dims.height, 0);

          return [yMin, xMax, yMax, xMin] as [number, number, number, number];
        }, [data, dims, xDomain, yDomain, xScaleType, yScaleType, rScale, roundDomains]);

        // Create final scales with padding
        const { xScale, yScale } = useMemo(() => {
          let width = dims.width;
          if (xScaleMin === undefined && xScaleMax === undefined) {
            width = width - bubblePadding[1];
          }
          let height = dims.height;
          if (yScaleMin === undefined && yScaleMax === undefined) {
            height = height - bubblePadding[2];
          }

          const xs = getScale(xDomain, [bubblePadding[3], width], xScaleType, roundDomains);
          const ys = getScale(yDomain, [height, bubblePadding[0]], yScaleType, roundDomains);

          return { xScale: xs, yScale: ys };
        }, [dims, xDomain, yDomain, xScaleType, yScaleType, bubblePadding, roundDomains, xScaleMin, xScaleMax, yScaleMin, yScaleMax]);

        // Create color helper
        const colors = useMemo(() => {
          const colorDomain = schemeType === ScaleType.Ordinal ? seriesDomain : rDomain;
          return new ColorHelper({
            scheme: colorScheme,
            scaleType: schemeType,
            domain: colorDomain as string[] | number[],
            customColors,
          });
        }, [colorScheme, schemeType, seriesDomain, rDomain, customColors]);

        // Legend options
        const legendOptions = useMemo(() => {
          if (schemeType === ScaleType.Ordinal) {
            return {
              domain: seriesDomain,
              colors,
              title: legendTitle,
            };
          }
          return {
            domain: rDomain,
            colors,
            title: undefined,
          };
        }, [schemeType, seriesDomain, rDomain, colors, legendTitle]);

        // Transform and clip path
        const transform = `translate(${dims.xOffset},${margin[0]})`;
        const clipPath = `url(#${clipPathId})`;

        // Event handlers
        const handleClick = useCallback(
          (eventData: BubbleChartDataItem, series?: BubbleChartSeries) => {
            const enrichedData = {
              ...eventData,
              series: series?.name ?? eventData.name,
            } as BubbleChartDataItem & { series: StringOrNumberOrDate };
            onSelect?.(enrichedData);
          },
          [onSelect]
        );

        const handleActivate = useCallback(
          (item: { name: StringOrNumberOrDate }) => {
            const idx = activeEntries.findIndex((d) => String(d.name) === String(item.name));
            if (idx > -1) return;

            const newEntries = [{ name: String(item.name) }, ...activeEntries];
            setActiveEntries(newEntries);
            onActivate?.({ value: item, entries: newEntries });
          },
          [activeEntries, onActivate]
        );

        const handleDeactivate = useCallback(
          (item: { name: StringOrNumberOrDate }) => {
            const idx = activeEntries.findIndex((d) => String(d.name) === String(item.name));
            if (idx === -1) return;

            const newEntries = [...activeEntries];
            newEntries.splice(idx, 1);
            setActiveEntries(newEntries);
            onDeactivate?.({ value: item, entries: newEntries });
          },
          [activeEntries, onDeactivate]
        );

        const handleDeactivateAll = useCallback(() => {
          for (const entry of activeEntries) {
            onDeactivate?.({ value: entry, entries: [] });
          }
          setActiveEntries([]);
        }, [activeEntries, onDeactivate]);

        const handleLegendClick = useCallback(
          (name: string) => {
            const series = data.find((s) => String(s.name) === name);
            if (series && series.series.length > 0) {
              handleClick(series.series[0], series);
            }
          },
          [data, handleClick]
        );

        const handleLegendActivate = useCallback(
          (item: { name: string }) => {
            handleActivate(item);
          },
          [handleActivate]
        );

        const handleLegendDeactivate = useCallback(
          (item: { name: string }) => {
            handleDeactivate(item);
          },
          [handleDeactivate]
        );

        const handleXAxisHeightChange = useCallback(
          (newHeight: number) => {
            if (newHeight !== xAxisHeight) {
              setXAxisHeight(newHeight);
            }
          },
          [xAxisHeight]
        );

        const handleYAxisWidthChange = useCallback(
          (newWidth: number) => {
            if (newWidth !== yAxisWidth) {
              setYAxisWidth(newWidth);
            }
          },
          [yAxisWidth]
        );

        return (
          <>
            {/* Main chart SVG */}
            <svg
              width={containerWidth}
              height={containerHeight}
              className="ngx-charts"
              style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}
              onMouseLeave={handleDeactivateAll}
            >
              {/* Clip path definition */}
              <defs>
                <clipPath id={clipPathId}>
                  <rect
                    width={dims.width + 10}
                    height={dims.height + 10}
                    transform="translate(-5, -5)"
                  />
                </clipPath>
              </defs>

              {/* Chart content group */}
              <g transform={transform} className="bubble-chart chart">
                {/* X Axis */}
                {showXAxis && (
                  <XAxis
                    xScale={xScale as (value: unknown) => number}
                    dims={dims}
                    showGridLines={showGridLines}
                    showLabel={showXAxisLabel}
                    labelText={xAxisLabel}
                    trimTicks={trimXAxisTicks}
                    rotateTicks={rotateXAxisTicks}
                    maxTickLength={maxXAxisTickLength}
                    tickFormatting={xAxisTickFormatting}
                    ticks={xAxisTicks}
                    wrapTicks={wrapTicks}
                    onDimensionsChanged={({ height }) => handleXAxisHeightChange(height)}
                  />
                )}

                {/* Y Axis */}
                {showYAxis && (
                  <YAxis
                    yScale={yScale as (value: unknown) => number}
                    dims={dims}
                    showGridLines={showGridLines}
                    showLabel={showYAxisLabel}
                    labelText={yAxisLabel}
                    trimTicks={trimYAxisTicks}
                    maxTickLength={maxYAxisTickLength}
                    tickFormatting={yAxisTickFormatting}
                    ticks={yAxisTicks}
                    wrapTicks={wrapTicks}
                    onDimensionsChanged={({ width }) => handleYAxisWidthChange(width)}
                  />
                )}

                {/* Deactivation area */}
                <rect
                  className="bubble-chart-area"
                  x={0}
                  y={0}
                  width={dims.width}
                  height={dims.height}
                  style={{
                    fill: 'rgb(255, 0, 0)',
                    opacity: 0,
                    cursor: 'auto',
                  }}
                  onMouseEnter={handleDeactivateAll}
                />

                {/* Clipped bubble series */}
                <g clipPath={clipPath}>
                  <AnimatePresence mode="sync">
                    {data.map((series) => (
                      <motion.g
                        key={String(series.name)}
                        initial={animated ? { opacity: 0 } : { opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={animated ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BubbleSeries
                          data={series}
                          xScale={xScale}
                          yScale={yScale}
                          rScale={rScale}
                          xScaleType={xScaleType}
                          yScaleType={yScaleType}
                          colors={colors}
                          xAxisLabel={xAxisLabel}
                          yAxisLabel={yAxisLabel}
                          activeEntries={activeEntries}
                          tooltipDisabled={tooltipDisabled}
                          tooltipTemplate={tooltipTemplate}
                          onSelect={(eventData) => handleClick(eventData, series)}
                          onActivate={handleActivate}
                          onDeactivate={handleDeactivate}
                          animated={animated}
                        />
                      </motion.g>
                    ))}
                  </AnimatePresence>
                </g>
              </g>
            </svg>

            {/* Legend (outside SVG for better text rendering) */}
            {showLegend && schemeType === ScaleType.Ordinal && (
              <Legend
                data={legendOptions.domain as string[]}
                title={legendTitle}
                colors={colors}
                height={containerHeight}
                width={legendPosition === LegendPosition.Below ? containerWidth : undefined}
                activeEntries={activeEntries}
                horizontal={legendPosition === LegendPosition.Below}
                onLabelClick={handleLegendClick}
                onLabelActivate={handleLegendActivate}
                onLabelDeactivate={handleLegendDeactivate}
              />
            )}
          </>
        );
      }}
    </BaseChart>
  );
}
