'use client';

/**
 * @fileoverview Horizontal bar chart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/bar-horizontal.component.ts
 *
 * @description
 * Standard horizontal bar chart with support for axes, legend, tooltips,
 * and data labels. Values are displayed on the X-axis, categories on Y-axis.
 *
 * @license MIT
 */

import { useState, useMemo, useCallback, memo } from 'react';
import type { DataItem, ScaleType, LegendPosition } from '../types';
import { BaseChart, XAxis, YAxis, Legend } from '../common';
import { ColorHelper, calculateViewDimensions } from '../utils';
import { useHorizontalBarScales } from './hooks';
import { BarSeriesHorizontal } from './components';
import type { BaseBarChartProps } from './types';

interface BarHorizontalInnerProps extends Omit<BaseBarChartProps, 'width' | 'height' | 'className'> {
  containerWidth: number;
  containerHeight: number;
}

/**
 * Inner component that renders the actual chart content
 * Separated to avoid calling hooks inside render callbacks
 */
const BarHorizontalInner = memo(function BarHorizontalInner({
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
}: BarHorizontalInnerProps) {
  const [xAxisHeight, setXAxisHeight] = useState(0);
  const [yAxisWidth, setYAxisWidth] = useState(0);
  const [activeEntries, setActiveEntries] = useState<DataItem[]>(initialActiveEntries);
  const [dataLabelMaxWidth, setDataLabelMaxWidth] = useState({ positive: 0, negative: 0 });

  // Merge axis config with defaults
  const xAxisConfig = useMemo(() => ({
    visible: true,
    showLabel: false,
    showGridLines: true,
    trimTicks: true,
    rotateTicks: true,
    maxTickLength: 16,
    wrapTicks: false,
    minScale: undefined as number | undefined,
    maxScale: undefined as number | undefined,
    ...xAxis,
  }), [xAxis]);

  const yAxisConfig = useMemo(() => ({
    visible: true,
    showLabel: false,
    showGridLines: false,
    trimTicks: true,
    maxTickLength: 16,
    wrapTicks: false,
    ...yAxis,
  }), [yAxis]);

  // Calculate margins
  const margin = useMemo(() => {
    return [
      10,
      20 + dataLabelMaxWidth.positive,
      10,
      20 + dataLabelMaxWidth.negative,
    ] as [number, number, number, number];
  }, [dataLabelMaxWidth]);

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

  // Create scales
  const { xScale, yScale, xDomain: _xDomain, yDomain } = useHorizontalBarScales({
    data,
    width: dims.width,
    height: dims.height,
    barPadding,
    roundDomains,
    xScaleMin: xAxisConfig.minScale,
    xScaleMax: xAxisConfig.maxScale,
  });

  // Create color helper
  const colors = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: 'ordinal' as ScaleType,
      domain: yDomain,
      customColors,
    });
  }, [colorScheme, yDomain, customColors]);

  // Calculate transform
  const transform = useMemo(() => {
    return `translate(${dims.xOffset ?? 0}, ${margin[0]})`;
  }, [dims.xOffset, margin]);

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

  const handleDataLabelWidthChanged = useCallback((event: { size: { width: number; negative: boolean }; index: number }) => {
    if (event.size.negative) {
      setDataLabelMaxWidth((prev) => ({
        ...prev,
        negative: Math.max(prev.negative, event.size.width),
      }));
    } else {
      setDataLabelMaxWidth((prev) => ({
        ...prev,
        positive: Math.max(prev.positive, event.size.width),
      }));
    }
  }, []);

  return (
    <>
      <svg width={containerWidth} height={containerHeight} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}>
        <g transform={transform} className="bar-chart chart">
          {xAxisConfig.visible && (
            <XAxis
              xScale={xScale}
              dims={dims}
              showGridLines={xAxisConfig.showGridLines}
              showLabel={xAxisConfig.showLabel}
              labelText={xAxisConfig.label}
              trimTicks={xAxisConfig.trimTicks}
              rotateTicks={xAxisConfig.rotateTicks}
              maxTickLength={xAxisConfig.maxTickLength}
              tickFormatting={xAxisConfig.tickFormatting}
              ticks={xAxisConfig.ticks}
              referenceLines={referenceLines}
              showRefLines={showRefLines}
              showRefLabels={showRefLabels}
              wrapTicks={xAxisConfig.wrapTicks}
              onDimensionsChanged={handleXAxisHeightChanged}
            />
          )}
          {yAxisConfig.visible && (
            <YAxis
              yScale={yScale}
              dims={dims}
              showLabel={yAxisConfig.showLabel}
              labelText={yAxisConfig.label}
              trimTicks={yAxisConfig.trimTicks}
              maxTickLength={yAxisConfig.maxTickLength}
              tickFormatting={yAxisConfig.tickFormatting}
              ticks={yAxisConfig.ticks}
              yAxisOffset={dataLabelMaxWidth.negative}
              wrapTicks={yAxisConfig.wrapTicks}
              onDimensionsChanged={handleYAxisWidthChanged}
            />
          )}
          <BarSeriesHorizontal
            series={data}
            xScale={xScale}
            yScale={yScale}
            getColor={(value: string) => colors.getColor(value)}
            getGradientStops={(value: string, start?: string) => colors.getLinearGradientStops(value, start)}
            dims={dims}
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
            onDataLabelWidthChanged={handleDataLabelWidthChanged}
          />
        </g>
      </svg>
      {legend && (
        <Legend
          title={legendTitle}
          colors={colors}
          data={yDomain}
          height={containerHeight}
          width={legendPosition === 'below' ? containerWidth : undefined}
          horizontal={legendPosition === 'below'}
          onLabelClick={(label: string) => handleClick({ name: label, value: 0 })}
          onLabelActivate={(item: { name: string }) => handleActivate(item as DataItem, true)}
          onLabelDeactivate={(item: { name: string }) => handleDeactivate(item as DataItem, true)}
        />
      )}
    </>
  );
});

/**
 * Horizontal bar chart component
 */
export function BarHorizontal({
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
        <BarHorizontalInner
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          {...props}
        />
      )}
    </BaseChart>
  );
}
