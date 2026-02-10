'use client';

/**
 * @fileoverview Vertical bar chart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/bar-vertical.component.ts
 *
 * @description
 * Standard vertical bar chart with support for axes, legend, tooltips,
 * and data labels. Values are displayed on the Y-axis, categories on X-axis.
 *
 * @license MIT
 */

import React, { useState, useMemo, useCallback, memo } from 'react';
import type { DataItem, ScaleType, LegendPosition } from '../types';
import { BaseChart, XAxis, YAxis, Legend } from '../common';
import { ColorHelper, calculateViewDimensions } from '../utils';
import { useVerticalBarScales } from './hooks';
import { BarSeriesVertical } from './components';
import type { BaseBarChartProps } from './types';

interface BarVerticalInnerProps extends Omit<BaseBarChartProps, 'width' | 'height' | 'className'> {
  containerWidth: number;
  containerHeight: number;
}

/**
 * Inner component that renders the actual chart content
 * Separated to avoid calling hooks inside render callbacks
 */
const BarVerticalInner = memo(function BarVerticalInner({
  data,
  containerWidth,
  containerHeight,
  colorScheme = 'vivid',
  customColors,
  animated = true,
  legend = false,
  legendTitle = 'Legend',
  legendPosition = 'right',
  xAxis = {},
  yAxis = {},
  tooltip = {},
  gradient = false,
  roundEdges = true,
  roundDomains = false,
  barPadding = 8,
  showDataLabel = false,
  dataLabelFormatting,
  noBarWhenZero = true,
  activeEntries: initialActiveEntries = [],
  referenceLines,
  showRefLines = false,
  showRefLabels = false,
  onSelect,
  onActivate,
  onDeactivate,
}: BarVerticalInnerProps) {
  const [xAxisHeight, setXAxisHeight] = useState(0);
  const [yAxisWidth, setYAxisWidth] = useState(0);
  const [activeEntries, setActiveEntries] = useState<DataItem[]>(initialActiveEntries);
  const [dataLabelMaxHeight, setDataLabelMaxHeight] = useState({ positive: 0, negative: 0 });

  // Merge axis config with defaults - memoize to prevent infinite re-renders
  const xAxisConfig = useMemo(() => ({
    visible: true,
    showLabel: false,
    showGridLines: true,
    trimTicks: true,
    rotateTicks: true,
    maxTickLength: 16,
    wrapTicks: false,
    ...xAxis,
  }), [xAxis]);

  const yAxisConfig = useMemo(() => ({
    visible: true,
    showLabel: false,
    showGridLines: true,
    trimTicks: true,
    maxTickLength: 16,
    wrapTicks: false,
    minScale: undefined as number | undefined,
    maxScale: undefined as number | undefined,
    ...yAxis,
  }), [yAxis]);

  // Calculate margins
  const margin = useMemo(() => {
    return [
      10 + dataLabelMaxHeight.positive,
      20,
      10 + dataLabelMaxHeight.negative,
      20,
    ] as [number, number, number, number];
  }, [dataLabelMaxHeight]);

  // Calculate view dimensions
  const dims = useMemo(() => {
    return calculateViewDimensions({
      width: containerWidth,
      height: containerHeight,
      margins: margin,
      showXAxis: xAxisConfig.visible,
      showYAxis: yAxisConfig.visible,
      xAxisHeight,
      yAxisWidth,
      showXLabel: xAxisConfig.showLabel,
      showYLabel: yAxisConfig.showLabel,
      showLegend: legend,
      legendType: 'ordinal' as ScaleType,
      legendPosition: legendPosition as LegendPosition,
    });
  }, [containerWidth, containerHeight, margin, xAxisConfig, yAxisConfig, xAxisHeight, yAxisWidth, legend, legendPosition]);

  // Adjust dims for data labels
  const adjustedDims = useMemo(() => {
    if (showDataLabel) {
      return {
        ...dims,
        height: dims.height - dataLabelMaxHeight.negative,
      };
    }
    return dims;
  }, [dims, showDataLabel, dataLabelMaxHeight]);

  // Create scales
  const { xScale, yScale, xDomain, yDomain } = useVerticalBarScales({
    data,
    width: adjustedDims.width,
    height: adjustedDims.height,
    barPadding,
    roundDomains,
    yScaleMin: yAxisConfig.minScale,
    yScaleMax: yAxisConfig.maxScale,
    yAxisTicks: yAxisConfig.ticks as number[] | undefined,
  });

  // Create color helper
  const colors = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: 'ordinal' as ScaleType,
      domain: xDomain,
      customColors,
    });
  }, [colorScheme, xDomain, customColors]);

  // Calculate transform
  const transform = useMemo(() => {
    return `translate(${dims.xOffset ?? 0}, ${margin[0] + dataLabelMaxHeight.negative})`;
  }, [dims.xOffset, margin, dataLabelMaxHeight]);

  // Event handlers
  const handleClick = useCallback((item: DataItem) => {
    onSelect?.(item);
  }, [onSelect]);

  const handleActivate = useCallback((item: DataItem, fromLegend = false) => {
    const foundItem = data.find((d) => {
      if (fromLegend) {
        return String(d.label ?? d.name) === String(item.name);
      }
      return String(d.name) === String(item.name);
    });

    if (foundItem) {
      const idx = activeEntries.findIndex(
        (d) => d.name === foundItem.name && d.value === foundItem.value
      );
      if (idx === -1) {
        const newEntries = [foundItem, ...activeEntries];
        setActiveEntries(newEntries);
        onActivate?.({ value: foundItem, entries: newEntries });
      }
    }
  }, [data, activeEntries, onActivate]);

  const handleDeactivate = useCallback((item: DataItem, fromLegend = false) => {
    const foundItem = data.find((d) => {
      if (fromLegend) {
        return String(d.label ?? d.name) === String(item.name);
      }
      return String(d.name) === String(item.name);
    });

    if (foundItem) {
      const idx = activeEntries.findIndex(
        (d) => d.name === foundItem.name && d.value === foundItem.value
      );
      if (idx > -1) {
        const newEntries = [...activeEntries];
        newEntries.splice(idx, 1);
        setActiveEntries(newEntries);
        onDeactivate?.({ value: foundItem, entries: newEntries });
      }
    }
  }, [data, activeEntries, onDeactivate]);

  const handleXAxisHeightChanged = useCallback(({ height }: { height: number }) => {
    setXAxisHeight(height);
  }, []);

  const handleYAxisWidthChanged = useCallback(({ width }: { width: number }) => {
    setYAxisWidth(width);
  }, []);

  const handleDataLabelHeightChanged = useCallback((event: { size: { height: number; negative: boolean }; index: number }) => {
    if (event.size.negative) {
      setDataLabelMaxHeight((prev) => ({
        ...prev,
        negative: Math.max(prev.negative, event.size.height),
      }));
    } else {
      setDataLabelMaxHeight((prev) => ({
        ...prev,
        positive: Math.max(prev.positive, event.size.height),
      }));
    }
  }, []);

  // Calculate SVG dimensions - when legend is on right, SVG needs to be narrower
  // to fit both chart and legend within container dimensions
  const svgWidth = legend && legendPosition === 'right'
    ? dims.width + (dims.xOffset ?? 0) + margin[1] + margin[3]
    : containerWidth;
  const svgHeight = legend && legendPosition === 'below'
    ? dims.height + margin[0] + margin[2] + xAxisHeight + (xAxisConfig.showLabel ? 30 : 0)
    : containerHeight;

  // Legend width for right position (2/12 columns = 16.67%)
  const legendWidth = legend && legendPosition === 'right'
    ? Math.floor(containerWidth * 2 / 12)
    : 0;

  // Wrapper style for flex layout - matches Angular ngx-charts layout behavior
  const wrapperStyle: React.CSSProperties = legend ? {
    display: 'flex',
    flexDirection: legendPosition === 'below' ? 'column' : 'row',
    width: containerWidth,
    height: containerHeight,
    fontFamily: 'var(--font-chart, Roboto, sans-serif)',
  } : {
    width: containerWidth,
    height: containerHeight,
    fontFamily: 'var(--font-chart, Roboto, sans-serif)',
  };

  return (
    <div style={wrapperStyle}>
      <svg
        width={legend ? (legendPosition === 'right' ? containerWidth - legendWidth : containerWidth) : containerWidth}
        height={legend && legendPosition === 'below' ? svgHeight : containerHeight}
        className="ngx-charts"
        style={{ overflow: 'visible', flexShrink: 0 }}
      >
        <g transform={transform} className="bar-chart chart">
          {xAxisConfig.visible && (
            <XAxis
              xScale={xScale}
              dims={adjustedDims}
              showGridLines={xAxisConfig.showGridLines}
              showLabel={xAxisConfig.showLabel}
              labelText={xAxisConfig.label}
              trimTicks={xAxisConfig.trimTicks}
              rotateTicks={xAxisConfig.rotateTicks}
              maxTickLength={xAxisConfig.maxTickLength}
              tickFormatting={xAxisConfig.tickFormatting}
              ticks={xAxisConfig.ticks}
              wrapTicks={xAxisConfig.wrapTicks}
              xAxisOffset={dataLabelMaxHeight.negative}
              onDimensionsChanged={handleXAxisHeightChanged}
            />
          )}
          {yAxisConfig.visible && (
            <YAxis
              yScale={yScale}
              dims={adjustedDims}
              showGridLines={yAxisConfig.showGridLines}
              showLabel={yAxisConfig.showLabel}
              labelText={yAxisConfig.label}
              trimTicks={yAxisConfig.trimTicks}
              maxTickLength={yAxisConfig.maxTickLength}
              tickFormatting={yAxisConfig.tickFormatting}
              ticks={yAxisConfig.ticks}
              wrapTicks={yAxisConfig.wrapTicks}
              referenceLines={referenceLines}
              showRefLines={showRefLines}
              showRefLabels={showRefLabels}
              onDimensionsChanged={handleYAxisWidthChanged}
            />
          )}
          <BarSeriesVertical
            series={data}
            xScale={xScale}
            yScale={yScale}
            getColor={(value: string) => colors.getColor(value)}
            getGradientStops={(value: string, start?: string) => colors.getLinearGradientStops(value, start)}
            dims={adjustedDims}
            gradient={gradient}
            activeEntries={activeEntries}
            tooltipDisabled={tooltip?.disabled}
            tooltipTemplate={tooltip?.template}
            roundEdges={roundEdges}
            animated={animated}
            showDataLabel={showDataLabel}
            dataLabelFormatting={dataLabelFormatting}
            noBarWhenZero={noBarWhenZero}
            onSelect={handleClick}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onDataLabelHeightChanged={handleDataLabelHeightChanged}
          />
        </g>
      </svg>
      {legend && (
        <Legend
          title={legendTitle}
          colors={colors}
          data={xDomain}
          height={legendPosition === 'below' ? undefined : containerHeight}
          width={legendPosition === 'below' ? containerWidth : legendWidth}
          horizontal={legendPosition === 'below'}
          onLabelClick={(label: string) => handleClick({ name: label, value: 0 })}
          onLabelActivate={(item: { name: string }) => handleActivate(item as DataItem, true)}
          onLabelDeactivate={(item: { name: string }) => handleDeactivate(item as DataItem, true)}
        />
      )}
    </div>
  );
});

/**
 * Vertical bar chart component
 */
export function BarVertical({
  width,
  height,
  className,
  ...props
}: BaseBarChartProps) {
  return (
    <BaseChart
      width={width}
      height={height}
      className={className}
    >
      {({ width: containerWidth, height: containerHeight }: { width: number; height: number }) => (
        <BarVerticalInner
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          {...props}
        />
      )}
    </BaseChart>
  );
}
