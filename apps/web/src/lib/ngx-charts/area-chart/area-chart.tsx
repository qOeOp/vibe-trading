/**
 * @fileoverview Area chart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/area-chart/area-chart.component.ts
 *
 * @description
 * Multi-series area chart with optional timeline, tooltips, and legend.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { CurveFactory, curveLinear } from 'd3-shape';

import {
  MultiSeries,
  ScaleType,
  LegendPosition,
  LegendType,
  ColorScheme,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
} from '../types';
import { BaseChart, XAxis, YAxis, Legend, TooltipArea, TooltipItem } from '../common';
import { useAreaChart } from './hooks';
import { AreaSeries, XScaleWithDomain, YScaleWithRange } from './components';
import { CircleSeries } from '../line-chart/components';

/** Reference line configuration */
export interface ReferenceLine {
  name: string;
  value: number;
  color?: string;
}

export interface AreaChartProps {
  /** Chart data - multi-series format */
  data: MultiSeries;
  /** Fixed width (optional, defaults to container) */
  width?: number;
  /** Fixed height (optional, defaults to container) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Scale type for color mapping */
  scaleType?: ScaleType;
  /** Custom colors */
  colors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Enable/disable animations */
  animated?: boolean;
  /** X-axis configuration */
  xAxis?: AxisConfig;
  /** Y-axis configuration */
  yAxis?: AxisConfig;
  /** Legend configuration */
  legend?: LegendConfig;
  /** Tooltip configuration */
  tooltip?: TooltipConfig;
  /** Enable gradient fills */
  gradient?: boolean;
  /** Curve factory for area shape */
  curve?: CurveFactory;
  /** Auto scale Y axis (don't include 0) */
  autoScale?: boolean;
  /** Base value for area fill */
  baseValue?: number | 'auto';
  /** Round domains to nice values */
  roundDomains?: boolean;
  /** Reference lines for Y axis */
  referenceLines?: ReferenceLine[];
  /** Show reference lines */
  showRefLines?: boolean;
  /** Show reference line labels */
  showRefLabels?: boolean;
  /** Enable timeline brush */
  timeline?: boolean;
  /** Currently active/selected items */
  activeItems?: Array<{ name: string; value?: number }>;
  /** Callback when an item is selected */
  onSelect?: (event: { name: string; series?: string; value: number }) => void;
  /** Callback when an item is activated (hovered) */
  onActivate?: (event: { value: unknown; entries: unknown[] }) => void;
  /** Callback when an item is deactivated */
  onDeactivate?: (event: { value: unknown; entries: unknown[] }) => void;
  /** Custom tooltip template */
  tooltipTemplate?: (items: TooltipItem[]) => ReactNode;
  /** Custom CSS class name */
  className?: string;
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
  /** Wrap tick labels */
  wrapTicks?: boolean;
}

/**
 * Area Chart Component
 *
 * Multi-series area chart supporting:
 * - Time, linear, and ordinal X scales
 * - Optional gradient fills
 * - Interactive tooltips
 * - Legend with click/hover interactions
 * - Optional timeline brush for range selection
 */
export function AreaChart({
  data,
  width,
  height,
  colorScheme = 'cool',
  scaleType = ScaleType.Ordinal,
  colors: customColors,
  animated = true,
  xAxis = { visible: false },
  yAxis = { visible: false },
  legend = { visible: false },
  tooltip = { disabled: false },
  gradient = false,
  curve = curveLinear,
  autoScale = false,
  baseValue = 'auto',
  roundDomains = false,
  referenceLines,
  showRefLines = false,
  showRefLabels = false,
  timeline = false,
  activeItems = [],
  onSelect,
  onActivate,
  onDeactivate,
  tooltipTemplate,
  className = '',
  trimXAxisTicks = true,
  trimYAxisTicks = true,
  rotateXAxisTicks = true,
  maxXAxisTickLength = 16,
  maxYAxisTickLength = 16,
  wrapTicks = false,
}: AreaChartProps) {
  // Local active entries state
  const [localActiveEntries, setLocalActiveEntries] = useState<Array<{ name: string; value?: number }>>(activeItems);
  const [hoveredVertical, setHoveredVertical] = useState<unknown>(null);

  // Effective active entries (controlled or local)
  const activeEntries = activeItems.length > 0 ? activeItems : localActiveEntries;

  // Resolve scheme
  const resolvedScheme = typeof colorScheme === 'string' ? colorScheme : colorScheme.name;

  return (
    <BaseChart
      width={width}
      height={height}
      colorScheme={resolvedScheme}
      scaleType={scaleType}
      colors={customColors}
      animated={animated}
      className={`area-chart ${className}`}
    >
      {(dimensions) => (
        <AreaChartContent
          data={data}
          dimensions={dimensions}
          colorScheme={resolvedScheme}
          schemeType={scaleType}
          customColors={customColors}
          animated={animated}
          xAxis={xAxis}
          yAxis={yAxis}
          legend={legend}
          tooltip={tooltip}
          gradient={gradient}
          curve={curve}
          autoScale={autoScale}
          baseValue={baseValue}
          roundDomains={roundDomains}
          referenceLines={referenceLines}
          showRefLines={showRefLines}
          showRefLabels={showRefLabels}
          timeline={timeline}
          activeEntries={activeEntries}
          hoveredVertical={hoveredVertical}
          setHoveredVertical={setHoveredVertical}
          setLocalActiveEntries={setLocalActiveEntries}
          onSelect={onSelect}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          tooltipTemplate={tooltipTemplate}
          trimXAxisTicks={trimXAxisTicks}
          trimYAxisTicks={trimYAxisTicks}
          rotateXAxisTicks={rotateXAxisTicks}
          maxXAxisTickLength={maxXAxisTickLength}
          maxYAxisTickLength={maxYAxisTickLength}
          wrapTicks={wrapTicks}
        />
      )}
    </BaseChart>
  );
}

interface AreaChartContentProps {
  data: MultiSeries;
  dimensions: { width: number; height: number };
  colorScheme: string;
  schemeType: ScaleType;
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  animated: boolean;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  legend: LegendConfig;
  tooltip: TooltipConfig;
  gradient: boolean;
  curve: CurveFactory;
  autoScale: boolean;
  baseValue: number | 'auto';
  roundDomains: boolean;
  referenceLines?: ReferenceLine[];
  showRefLines: boolean;
  showRefLabels: boolean;
  timeline: boolean;
  activeEntries: Array<{ name: string; value?: number }>;
  hoveredVertical: unknown;
  setHoveredVertical: (value: unknown) => void;
  setLocalActiveEntries: React.Dispatch<React.SetStateAction<Array<{ name: string; value?: number }>>>;
  onSelect?: (event: { name: string; series?: string; value: number }) => void;
  onActivate?: (event: { value: unknown; entries: unknown[] }) => void;
  onDeactivate?: (event: { value: unknown; entries: unknown[] }) => void;
  tooltipTemplate?: (items: TooltipItem[]) => ReactNode;
  trimXAxisTicks: boolean;
  trimYAxisTicks: boolean;
  rotateXAxisTicks: boolean;
  maxXAxisTickLength: number;
  maxYAxisTickLength: number;
  wrapTicks: boolean;
}

function AreaChartContent({
  data,
  dimensions,
  colorScheme,
  schemeType,
  customColors,
  animated,
  xAxis,
  yAxis,
  legend,
  tooltip,
  gradient,
  curve,
  autoScale,
  baseValue,
  roundDomains,
  referenceLines,
  showRefLines,
  showRefLabels,
  timeline,
  activeEntries,
  hoveredVertical,
  setHoveredVertical,
  setLocalActiveEntries,
  onSelect,
  onActivate,
  onDeactivate,
  tooltipTemplate,
  trimXAxisTicks,
  trimYAxisTicks,
  rotateXAxisTicks,
  maxXAxisTickLength,
  maxYAxisTickLength,
  wrapTicks,
}: AreaChartContentProps) {
  // Determine legend position and type
  const legendPosition = legend.position || LegendPosition.Right;
  const isLegendBelow = legendPosition === LegendPosition.Below;
  const legendType = schemeType === ScaleType.Linear ? LegendType.ScaleLegend : LegendType.Legend;

  // Calculate legend columns for SVG width (like Angular's chart.component.ts)
  // Note: The hook's calculateViewDimensions will also account for legend columns
  // for calculating the inner chart area, so we only use chartColumns for SVG sizing
  let legendColumns = 0;
  if (legend.visible && !isLegendBelow) {
    legendColumns = legendType === LegendType.ScaleLegend ? 1 : 2;
  }
  const chartColumns = 12 - legendColumns;
  const chartWidth = Math.floor((dimensions.width * chartColumns) / 12.0);
  const legendWidth = !isLegendBelow
    ? Math.floor((dimensions.width * legendColumns) / 12.0)
    : dimensions.width;

  // Use area chart hook
  // Pass the FULL width - the hook's calculateViewDimensions handles legend column reduction
  const {
    dims,
    xScale,
    yScale,
    xSet,
    seriesDomain,
    scaleType,
    colors,
    transform,
    processedData,
    timelineScales,
    updateXAxisHeight,
    updateYAxisWidth,
    updateFilteredDomain,
  } = useAreaChart({
    data,
    width: dimensions.width,
    height: dimensions.height,
    showXAxis: xAxis.visible,
    showYAxis: yAxis.visible,
    showXAxisLabel: xAxis.showLabel,
    showYAxisLabel: yAxis.showLabel,
    showLegend: legend.visible,
    legendPosition,
    colorScheme,
    schemeType,
    customColors,
    autoScale,
    baseValue,
    roundDomains,
    curve,
    xScaleMin: xAxis.minScale as number | Date | undefined,
    xScaleMax: xAxis.maxScale as number | Date | undefined,
    yScaleMin: yAxis.minScale,
    yScaleMax: yAxis.maxScale,
    timeline,
  });

  // Handle hover
  const handleHover = useCallback(
    (event: { value: unknown }) => {
      setHoveredVertical(event.value);
      // Deactivate all on hover change
      setLocalActiveEntries([]);
    },
    [setHoveredVertical, setLocalActiveEntries]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setHoveredVertical(null);
    setLocalActiveEntries([]);
  }, [setHoveredVertical, setLocalActiveEntries]);

  // Handle click
  const handleClick = useCallback(
    (clickData: unknown, series?: { name: string | number | Date }) => {
      const originalData = clickData as { name: string; value: number };
      const event: { name: string; series?: string; value: number } = {
        name: originalData.name,
        value: originalData.value,
      };
      if (series) {
        event.series = String(series.name);
      }
      onSelect?.(event);
    },
    [onSelect]
  );

  // Handle legend click
  const handleLegendClick = useCallback(
    (label: string) => {
      onSelect?.({ name: label, value: 0 });
    },
    [onSelect]
  );

  // Handle activate
  const handleActivate = useCallback(
    (item: { name: string }) => {
      const exists = activeEntries.find((d) => d.name === item.name);
      if (exists) return;

      const newEntries = [item, ...activeEntries];
      setLocalActiveEntries(newEntries);
      onActivate?.({ value: item, entries: newEntries });
    },
    [activeEntries, setLocalActiveEntries, onActivate]
  );

  // Handle deactivate
  const handleDeactivate = useCallback(
    (item: { name: string }) => {
      const idx = activeEntries.findIndex((d) => d.name === item.name);
      if (idx === -1) return;

      const newEntries = [...activeEntries];
      newEntries.splice(idx, 1);
      setLocalActiveEntries(newEntries);
      onDeactivate?.({ value: item, entries: newEntries });
    },
    [activeEntries, setLocalActiveEntries, onDeactivate]
  );

  // Handle X axis dimension change
  const handleXAxisDimensionsChanged = useCallback(
    ({ height }: { height: number }) => {
      updateXAxisHeight(height);
    },
    [updateXAxisHeight]
  );

  // Handle Y axis dimension change
  const handleYAxisDimensionsChanged = useCallback(
    ({ width }: { width: number }) => {
      updateYAxisWidth(width);
    },
    [updateYAxisWidth]
  );

  // Legend options
  const legendData = useMemo(() => seriesDomain, [seriesDomain]);

  return (
    <div
      className="ngx-charts-outer"
      style={{ width: '100%', height: '100%' }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${chartWidth} ${dimensions.height}`}
        className="ngx-charts"
        style={{
          display: 'block',
          overflow: (xAxis.visible || yAxis.visible) ? 'visible' : 'hidden',
          fontFamily: 'var(--font-chart, Roboto, sans-serif)',
        }}
      >
        {/* Main chart area */}
        <g transform={transform} className="area-chart chart">
          {/* X Axis */}
          {xAxis.visible && (
            <XAxis
              xScale={xScale}
              dims={dims}
              showGridLines={xAxis.showGridLines}
              showLabel={xAxis.showLabel}
              labelText={xAxis.label}
              trimTicks={trimXAxisTicks}
              rotateTicks={rotateXAxisTicks}
              maxTickLength={maxXAxisTickLength}
              tickFormatting={xAxis.tickFormatting}
              ticks={xAxis.ticks}
              wrapTicks={wrapTicks}
              onDimensionsChanged={handleXAxisDimensionsChanged}
            />
          )}

          {/* Y Axis (Left) */}
          {yAxis.visible && (
            <YAxis
              yScale={yScale}
              dims={dims}
              showGridLines={yAxis.showGridLines}
              gridLineStrokeDasharray={yAxis.gridLineStrokeDasharray}
              showLabel={yAxis.showLabel}
              labelText={yAxis.label}
              trimTicks={trimYAxisTicks}
              maxTickLength={maxYAxisTickLength}
              tickFormatting={yAxis.tickFormatting}
              ticks={yAxis.ticks}
              referenceLines={referenceLines}
              showRefLines={showRefLines}
              showRefLabels={showRefLabels}
              wrapTicks={wrapTicks}
              onDimensionsChanged={handleYAxisDimensionsChanged}
            />
          )}

          {/* Chart content */}
          <g>
            {/* Area series */}
            {processedData.map((series) => (
              <AreaSeries
                key={String(series.name)}
                data={{
                  name: series.name,
                  series: series.series.map((item) => ({
                    name: item.name,
                    value: item.value,
                    d0: item.d0,
                    d1: item.d1,
                  })),
                }}
                xScale={xScale as XScaleWithDomain}
                yScale={yScale as unknown as YScaleWithRange}
                baseValue={baseValue}
                colors={colors}
                scaleType={scaleType}
                gradient={gradient}
                curve={curve}
                activeEntries={activeEntries}
                animated={animated}
                onSelect={(d) => handleClick(d, series)}
              />
            ))}

            {/* Tooltip area */}
            {!tooltip.disabled && (
              <g onMouseLeave={handleMouseLeave}>
                <TooltipArea
                  dims={dims}
                  xSet={xSet}
                  xScale={xScale as (value: unknown) => number}
                  yScale={yScale as (value: number) => number}
                  results={data.map((s) => ({
                    name: s.name as string | Date,
                    series: s.series.map((item) => ({
                      name: item.name,
                      value: item.value,
                      min: item.min,
                      max: item.max,
                    })),
                  }))}
                  colors={colors as { scaleType: ScaleType; getColor: (value: unknown) => string }}
                  tooltipDisabled={tooltip.disabled}
                  tooltipTemplate={tooltipTemplate}
                  onHover={handleHover}
                />

                {/* Circle series for data point markers on hover */}
                {data.map((series) => (
                  <CircleSeries
                    key={`circles-${String(series.name)}`}
                    data={{
                      name: series.name,
                      series: series.series.map((item) => ({
                        name: item.name,
                        value: item.value,
                        min: item.min,
                        max: item.max,
                      })),
                    }}
                    xScale={xScale}
                    yScale={yScale}
                    colors={colors}
                    scaleType={scaleType}
                    visibleValue={hoveredVertical}
                    activeEntries={activeEntries}
                    tooltipDisabled={tooltip.disabled}
                    animated={animated}
                    onSelect={(d) => handleClick(d, series)}
                    onActivate={handleActivate}
                    onDeactivate={handleDeactivate}
                  />
                ))}
              </g>
            )}
          </g>
        </g>

        {/* Timeline (for time-based charts) */}
        {timeline && timelineScales && scaleType !== ScaleType.Ordinal && (
          <g
            transform={`translate(${dims.xOffset || 0}, ${dims.height + 60})`}
            className="timeline"
          >
            {processedData.map((series) => (
              <AreaSeries
                key={`timeline-${String(series.name)}`}
                data={{
                  name: series.name,
                  series: series.series.map((item) => ({
                    name: item.name,
                    value: item.value,
                    d0: item.d0,
                    d1: item.d1,
                  })),
                }}
                xScale={timelineScales.xScale as XScaleWithDomain}
                yScale={timelineScales.yScale as unknown as YScaleWithRange}
                baseValue={baseValue}
                colors={colors}
                scaleType={scaleType}
                gradient={gradient}
                curve={curve}
                activeEntries={activeEntries}
                animated={false}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Legend - rendered as sibling to SVG like Angular */}
      {legend.visible && (
        <Legend
          data={legendData}
          title={legend.title}
          colors={colors}
          height={dimensions.height}
          width={legendWidth}
          horizontal={isLegendBelow}
          activeEntries={activeEntries}
          onLabelClick={handleLegendClick}
          onLabelActivate={handleActivate}
          onLabelDeactivate={handleDeactivate}
        />
      )}
    </div>
  );
}
