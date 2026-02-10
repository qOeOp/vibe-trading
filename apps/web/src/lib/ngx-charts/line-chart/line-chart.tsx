/**
 * @fileoverview Line chart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/line-chart/line-chart.component.ts
 *
 * @description
 * Main line chart component supporting multiple series, axes, legend,
 * tooltips, and animations. Migrated from Angular ngx-charts library
 * to React with Framer Motion for animations.
 *
 * @license MIT
 */

'use client';

import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CurveFactory} from 'd3-shape';
import { curveLinear } from 'd3-shape';

import type {
  MultiSeries,
  DataItem,
  Series,
  ColorScheme} from '../types';
import {
  ScaleType,
  LegendPosition,
} from '../types';
import type {
  TooltipItem,
  SeriesData} from '../common';
import {
  BaseChart,
  XAxis,
  YAxis,
  Legend,
  TooltipArea
} from '../common';
import { useLineChart } from './hooks';
import { LineSeries, CircleSeries } from './components';

export interface LineChartProps {
  /** Chart data - array of series with name and data points */
  data: MultiSeries;
  /** Fixed width (optional, defaults to container width) */
  width?: number;
  /** Fixed height (optional, defaults to container height) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Scale type for color mapping */
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
  /** Auto scale Y axis from data (don't include 0) */
  autoScale?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Legend title */
  legendTitle?: string;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Show grid lines */
  showGridLines?: boolean;
  /** D3 curve factory */
  curve?: CurveFactory;
  /** Active/selected entries */
  activeEntries?: Array<{ name: string; value?: number }>;
  /** Range fill opacity for min/max values */
  rangeFillOpacity?: number;
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
  /** Round domains to nice values */
  roundDomains?: boolean;
  /** Disable tooltips */
  tooltipDisabled?: boolean;
  /** Show reference lines */
  showRefLines?: boolean;
  /** Reference lines configuration */
  referenceLines?: Array<{ name: string; value: number }>;
  /** Show reference line labels */
  showRefLabels?: boolean;
  /** X scale minimum */
  xScaleMin?: number | Date;
  /** X scale maximum */
  xScaleMax?: number | Date;
  /** Y scale minimum */
  yScaleMin?: number;
  /** Y scale maximum */
  yScaleMax?: number;
  /** Wrap long tick labels */
  wrapTicks?: boolean;
  /** Show timeline for time-based data */
  timeline?: boolean;
  /** Custom tooltip template for individual points */
  tooltipTemplate?: (item: DataItem, series: Series) => ReactNode;
  /** Custom tooltip template for series hover */
  seriesTooltipTemplate?: (items: TooltipItem[]) => ReactNode;
  /** Callback when a data point is selected */
  onSelect?: (event: { name: unknown; value: number; series: string }) => void;
  /** Callback when an item is activated (hovered) */
  onActivate?: (event: { value: unknown; entries: unknown[] }) => void;
  /** Callback when an item is deactivated */
  onDeactivate?: (event: { value: unknown; entries: unknown[] }) => void;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Line Chart component
 *
 * A feature-rich line chart supporting:
 * - Multiple data series
 * - Customizable axes with labels and tick formatting
 * - Legend with click/hover interactions
 * - Tooltips on hover
 * - Smooth line animations
 * - Support for linear, time, and ordinal X scales
 * - Optional min/max range display
 * - Grid lines and reference lines
 */
export function LineChart({
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
  autoScale = false,
  showLegend = false,
  legendTitle = 'Legend',
  legendPosition = LegendPosition.Right,
  showGridLines = true,
  curve = curveLinear,
  activeEntries: initialActiveEntries = [],
  rangeFillOpacity = 0.15,
  trimXAxisTicks = true,
  trimYAxisTicks = true,
  rotateXAxisTicks = true,
  maxXAxisTickLength = 16,
  maxYAxisTickLength = 16,
  xAxisTickFormatting,
  yAxisTickFormatting,
  xAxisTicks,
  yAxisTicks,
  roundDomains = false,
  tooltipDisabled = false,
  showRefLines = false,
  referenceLines,
  showRefLabels = true,
  xScaleMin,
  xScaleMax,
  yScaleMin,
  yScaleMax,
  wrapTicks = false,
  timeline = false,
  tooltipTemplate,
  seriesTooltipTemplate,
  onSelect,
  onActivate,
  onDeactivate,
  className = '',
}: LineChartProps) {
  // State for hover and active entries
  const [hoveredVertical, setHoveredVertical] = useState<unknown>(null);
  const [activeEntries, setActiveEntries] = useState(initialActiveEntries);

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
      className={`ngx-charts-line-chart ${className}`}
    >
      {({ width: containerWidth, height: containerHeight }) => {
        // Use line chart hook for calculations
        // eslint-disable-next-line react-hooks/rules-of-hooks -- BaseChart render-prop is a stable component function, not a conditional callback
        const chartState = useLineChart({
          data,
          width: containerWidth,
          height: containerHeight,
          colorScheme,
          schemeType,
          customColors,
          xAxis: showXAxis,
          yAxis: showYAxis,
          showXAxisLabel,
          showYAxisLabel,
          legend: showLegend,
          legendPosition,
          autoScale,
          roundDomains,
          xScaleMin,
          xScaleMax,
          yScaleMin,
          yScaleMax,
          timeline,
          margin,
        });

        const {
          dims,
          xScale,
          yScale,
          xSet,
          scaleType,
          colors,
          transform,
          clipPathId,
          clipPath,
          hasRange,
          legendOptions,
          onXAxisHeightChange,
          onYAxisWidthChange,
          timelineXScale,
          timelineYScale,
          timelineTransform,
        } = chartState;

        // Handlers
        // eslint-disable-next-line react-hooks/rules-of-hooks -- BaseChart render-prop is a stable component function, not a conditional callback
        const handleHover = useCallback(({ value }: { value: unknown }) => {
          setHoveredVertical(value);
          // Deactivate all when hovering
          setActiveEntries([]);
        }, []);

        // eslint-disable-next-line react-hooks/rules-of-hooks -- BaseChart render-prop is a stable component function, not a conditional callback
        const handleMouseLeave = useCallback(() => {
          setHoveredVertical(null);
          setActiveEntries([]);
        }, []);

        // eslint-disable-next-line react-hooks/rules-of-hooks -- BaseChart render-prop is a stable component function, not a conditional callback
        const handleClick = useCallback(
          (event: { name: unknown; value: number; series: string }) => {
            onSelect?.(event);
          },
          []
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks -- BaseChart render-prop is a stable component function, not a conditional callback
        const handleActivate = useCallback(
          (item: { name: string; value?: number }) => {
            // Check if already in activeEntries
            const idx = activeEntries.findIndex(
              (d) => d.name === item.name && d.value === item.value
            );
            if (idx > -1) return;

            const newEntries = [item];
            setActiveEntries(newEntries);
            onActivate?.({ value: item, entries: newEntries });
          },
          []
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks -- BaseChart render-prop is a stable component function, not a conditional callback
        const handleDeactivate = useCallback(
          (item: { name: string; value?: number }) => {
            const idx = activeEntries.findIndex(
              (d) => d.name === item.name && d.value === item.value
            );
            if (idx === -1) return;

            const newEntries = [...activeEntries];
            newEntries.splice(idx, 1);
            setActiveEntries(newEntries);
            onDeactivate?.({ value: item, entries: newEntries });
          },
          []
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks -- BaseChart render-prop is a stable component function, not a conditional callback
        const handleLegendClick = useCallback(
          (name: string) => {
            const series = data.find((s) => String(s.name) === name);
            if (series) {
              handleClick({
                name: series.name,
                value: 0,
                series: String(series.name),
              });
            }
          },
          [handleClick]
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks -- BaseChart render-prop is a stable component function, not a conditional callback
        const handleLegendActivate = useCallback(
          (item: { name: string }) => {
            handleActivate(item);
          },
          [handleActivate]
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks -- BaseChart render-prop is a stable component function, not a conditional callback
        const handleLegendDeactivate = useCallback(
          (item: { name: string }) => {
            handleDeactivate(item);
          },
          [handleDeactivate]
        );

        // Convert data to SeriesData format for tooltip
        const tooltipResults: SeriesData[] = data.map((series) => ({
          name: series.name instanceof Date ? series.name : String(series.name),
          series: series.series.map((item) => ({
            name: item.name,
            value: item.value,
            d0: undefined,
            d1: undefined,
            min: item.min,
            max: item.max,
          })),
        }));

        // Color helper for tooltip
        const tooltipColors = {
          scaleType: colors.scaleType,
          getColor: (value: unknown) => colors.getColor(value as string | number | Date),
        };

        return (
          <>
            {/* Main chart SVG */}
            <svg
              width={containerWidth}
              height={containerHeight}
              className="ngx-charts"
              style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}
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
              <g transform={transform} className="line-chart chart">
                {/* X Axis */}
                {showXAxis && (
                  <XAxis
                    xScale={xScale}
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
                    onDimensionsChanged={({ height }) => onXAxisHeightChange(height)}
                  />
                )}

                {/* Y Axis */}
                {showYAxis && (
                  <YAxis
                    yScale={yScale}
                    dims={dims}
                    showGridLines={showGridLines}
                    showLabel={showYAxisLabel}
                    labelText={yAxisLabel}
                    trimTicks={trimYAxisTicks}
                    maxTickLength={maxYAxisTickLength}
                    tickFormatting={yAxisTickFormatting}
                    ticks={yAxisTicks}
                    referenceLines={referenceLines}
                    showRefLines={showRefLines}
                    showRefLabels={showRefLabels}
                    wrapTicks={wrapTicks}
                    onDimensionsChanged={({ width }) => onYAxisWidthChange(width)}
                  />
                )}

                {/* Clipped chart area */}
                <g clipPath={clipPath}>
                  {/* Line series */}
                  <AnimatePresence mode="sync">
                    {data.map((series, _index) => (
                      <motion.g
                        key={String(series.name)}
                        initial={animated ? { opacity: 0 } : { opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={animated ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <LineSeries
                          data={series}
                          xScale={xScale}
                          yScale={yScale}
                          colors={colors}
                          scaleType={scaleType}
                          curve={curve}
                          activeEntries={activeEntries}
                          rangeFillOpacity={rangeFillOpacity}
                          hasRange={hasRange}
                          animated={animated}
                        />
                      </motion.g>
                    ))}
                  </AnimatePresence>

                  {/* Tooltip area and circles */}
                  {!tooltipDisabled && (
                    <g onMouseLeave={handleMouseLeave}>
                      {/* Tooltip hover area */}
                      <TooltipArea
                        dims={dims}
                        xSet={xSet as Array<string | number | Date>}
                        xScale={xScale as (value: unknown) => number}
                        yScale={yScale}
                        results={tooltipResults}
                        colors={tooltipColors}
                        tooltipDisabled={tooltipDisabled}
                        tooltipTemplate={seriesTooltipTemplate}
                        onHover={handleHover}
                      />

                      {/* Circle series for each data series */}
                      {data.map((series) => (
                        <CircleSeries
                          key={`circles-${String(series.name)}`}
                          data={series}
                          xScale={xScale}
                          yScale={yScale}
                          colors={colors}
                          scaleType={scaleType}
                          visibleValue={hoveredVertical}
                          activeEntries={activeEntries}
                          tooltipDisabled={tooltipDisabled}
                          tooltipTemplate={tooltipTemplate}
                          onSelect={handleClick}
                          onActivate={handleActivate}
                          onDeactivate={handleDeactivate}
                          animated={animated}
                        />
                      ))}
                    </g>
                  )}
                </g>
              </g>

              {/* Timeline (for time-based charts) */}
              {timeline &&
                scaleType !== ScaleType.Ordinal &&
                timelineXScale &&
                timelineYScale && (
                  <g transform={timelineTransform} className="timeline">
                    {data.map((series) => (
                      <LineSeries
                        key={`timeline-${String(series.name)}`}
                        data={series}
                        xScale={timelineXScale}
                        yScale={timelineYScale}
                        colors={colors}
                        scaleType={scaleType}
                        curve={curve}
                        hasRange={hasRange}
                        animated={animated}
                      />
                    ))}
                  </g>
                )}
            </svg>

            {/* Legend (outside SVG for better text rendering) */}
            {showLegend && (
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
