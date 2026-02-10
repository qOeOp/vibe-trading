/**
 * @fileoverview Stacked area chart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/area-chart/area-chart-stacked.component.ts
 *
 * @description
 * Stacked multi-series area chart where each series is stacked on top of the previous.
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
  ColorScheme,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
} from '../types';
import { BaseChart, XAxis, YAxis, Legend, TooltipArea, TooltipItem } from '../common';
import { useAreaChart } from './hooks';
import { AreaSeries, XScaleWithDomain, YScaleWithRange } from './components';

export interface AreaChartStackedProps {
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
  /** Round domains to nice values */
  roundDomains?: boolean;
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
  /** Custom chart margins [top, right, bottom, left] */
  margins?: [number, number, number, number];
}

/**
 * Stacked Area Chart Component
 *
 * Multi-series stacked area chart where each series is rendered
 * on top of the previous series, showing cumulative values.
 */
export function AreaChartStacked({
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
  roundDomains = false,
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
  margins,
}: AreaChartStackedProps) {
  const [localActiveEntries, setLocalActiveEntries] = useState<Array<{ name: string; value?: number }>>(activeItems);
  const [hoveredVertical, setHoveredVertical] = useState<unknown>(null);

  const activeEntries = activeItems.length > 0 ? activeItems : localActiveEntries;
  const resolvedScheme = typeof colorScheme === 'string' ? colorScheme : colorScheme.name;

  return (
    <BaseChart
      width={width}
      height={height}
      colorScheme={resolvedScheme}
      scaleType={scaleType}
      colors={customColors}
      animated={animated}
      className={`area-chart-stacked ${className}`}
    >
      {(dimensions) => (
        <AreaChartStackedContent
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
          roundDomains={roundDomains}
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
          margins={margins}
        />
      )}
    </BaseChart>
  );
}

interface AreaChartStackedContentProps {
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
  roundDomains: boolean;
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
  margins?: [number, number, number, number];
}

function AreaChartStackedContent({
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
  roundDomains,
  timeline,
  activeEntries,
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
  margins,
}: AreaChartStackedContentProps) {
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
  } = useAreaChart({
    data,
    width: dimensions.width,
    height: dimensions.height,
    showXAxis: xAxis.visible,
    showYAxis: yAxis.visible,
    showXAxisLabel: xAxis.showLabel,
    showYAxisLabel: yAxis.showLabel,
    showLegend: legend.visible,
    legendPosition: legend.position || LegendPosition.Right,
    colorScheme,
    schemeType,
    customColors,
    roundDomains,
    curve,
    xScaleMin: xAxis.minScale as number | Date | undefined,
    xScaleMax: xAxis.maxScale as number | Date | undefined,
    yScaleMin: yAxis.minScale,
    yScaleMax: yAxis.maxScale,
    stacked: true,
    timeline,
    margins,
  });

  const handleHover = useCallback(
    (event: { value: unknown }) => {
      setHoveredVertical(event.value);
      setLocalActiveEntries([]);
    },
    [setHoveredVertical, setLocalActiveEntries]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredVertical(null);
    setLocalActiveEntries([]);
  }, [setHoveredVertical, setLocalActiveEntries]);

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

  const handleLegendClick = useCallback(
    (label: string) => {
      onSelect?.({ name: label, value: 0 });
    },
    [onSelect]
  );

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

  const handleXAxisDimensionsChanged = useCallback(
    ({ height }: { height: number }) => {
      updateXAxisHeight(height);
    },
    [updateXAxisHeight]
  );

  const handleYAxisDimensionsChanged = useCallback(
    ({ width }: { width: number }) => {
      updateYAxisWidth(width);
    },
    [updateYAxisWidth]
  );

  const legendData = useMemo(() => seriesDomain, [seriesDomain]);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      className="ngx-charts"
      style={{
        display: 'block',
        overflow: (xAxis.visible || yAxis.visible) ? 'visible' : 'hidden',
        fontFamily: 'var(--font-chart, Roboto, sans-serif)',
      }}
    >
      <g transform={transform} className="area-chart chart">
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

        {yAxis.visible && (
          <YAxis
            yScale={yScale}
            dims={dims}
            showGridLines={yAxis.showGridLines}
            showLabel={yAxis.showLabel}
            labelText={yAxis.label}
            trimTicks={trimYAxisTicks}
            maxTickLength={maxYAxisTickLength}
            tickFormatting={yAxis.tickFormatting}
            ticks={yAxis.ticks}
            wrapTicks={wrapTicks}
            onDimensionsChanged={handleYAxisDimensionsChanged}
          />
        )}

        <g>
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
              colors={colors}
              scaleType={scaleType}
              stacked={true}
              gradient={gradient}
              curve={curve}
              activeEntries={activeEntries}
              animated={animated}
              onSelect={(d) => handleClick(d, series)}
            />
          ))}

          {!tooltip.disabled && (
            <g onMouseLeave={handleMouseLeave}>
              <TooltipArea
                dims={dims}
                xSet={xSet}
                xScale={xScale as (value: unknown) => number}
                yScale={yScale as (value: number) => number}
                results={processedData.map((s) => ({
                  name: s.name as string | Date,
                  series: s.series.map((item) => ({
                    name: item.name,
                    value: item.value,
                    d0: item.d0,
                    d1: item.d1,
                  })),
                }))}
                colors={colors as { scaleType: ScaleType; getColor: (value: unknown) => string }}
                tooltipDisabled={tooltip.disabled}
                tooltipTemplate={tooltipTemplate}
                onHover={handleHover}
                stacked
              />
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
              colors={colors}
              scaleType={scaleType}
              stacked={true}
              gradient={gradient}
              curve={curve}
              activeEntries={activeEntries}
              animated={false}
            />
          ))}
        </g>
      )}

      {legend.visible && (
        <foreignObject
          x={dims.width + (dims.xOffset || 0) + 20}
          y={0}
          width={dimensions.width - dims.width - (dims.xOffset || 0) - 40}
          height={dimensions.height}
        >
          <Legend
            data={legendData}
            title={legend.title}
            colors={colors}
            height={dimensions.height}
            activeEntries={activeEntries}
            onLabelClick={handleLegendClick}
            onLabelActivate={handleActivate}
            onLabelDeactivate={handleDeactivate}
          />
        </foreignObject>
      )}
    </svg>
  );
}
