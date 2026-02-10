'use client';

/**
 * @fileoverview Horizontal grouped bar chart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/bar-horizontal-2d.component.ts
 *
 * @description
 * Horizontal grouped bar chart (2D) where multiple series are displayed
 * side by side within each category.
 *
 * @license MIT
 */

import { useState, useMemo, useCallback, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ScaleBand } from 'd3-scale';
import type { DataItem, Series, ScaleType, LegendPosition } from '../types';
import { BarOrientation } from '../types';
import { BaseChart, XAxis, YAxis, Legend, GridPanelSeries } from '../common';
import { ColorHelper, calculateViewDimensions } from '../utils';
import { useGroupedBarScales } from './hooks';
import { BarSeriesHorizontal } from './components';
import type { MultiSeriesBarChartProps } from './types';

interface BarHorizontalGroupedInnerProps extends Omit<MultiSeriesBarChartProps, 'width' | 'height' | 'className'> {
  containerWidth: number;
  containerHeight: number;
}

/**
 * Inner component that renders the actual chart content
 * Separated to avoid calling hooks inside render callbacks
 */
const BarHorizontalGroupedInner = memo(function BarHorizontalGroupedInner({
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
  groupPadding = 16,
  showDataLabel = false,
  dataLabelFormatting,
  noBarWhenZero = true,
  activeEntries: initialActiveEntries = [],
  onSelect,
  onActivate,
  onDeactivate,
}: BarHorizontalGroupedInnerProps) {
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

  // Convert data to Series format
  const multiSeriesData: Series[] = useMemo(() => {
    return data.map((d) => ({
      name: d.name,
      series: d.series,
    }));
  }, [data]);

  // Create scales
  const { groupScale, innerScale, valueScale, groupDomain, innerDomain, valueDomain } = useGroupedBarScales({
    multiData: multiSeriesData,
    width: dims.width,
    height: dims.height,
    barPadding,
    groupPadding,
    roundDomains,
    xScaleMax: xAxisConfig.maxScale,
    orientation: 'horizontal',
  });

  // Create color helper
  const colors = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: 'ordinal' as ScaleType,
      domain: innerDomain,
      customColors,
    });
  }, [colorScheme, innerDomain, customColors]);

  // Calculate transform
  const transform = useMemo(() => {
    return `translate(${dims.xOffset ?? 0}, ${margin[0]})`;
  }, [dims.xOffset, margin]);

  // Group transform
  const groupTransform = useCallback((group: Series) => {
    const y = groupScale(String(group.name)) ?? 0;
    return `translate(0, ${y})`;
  }, [groupScale]);

  // Event handlers
  const handleClick = useCallback((item: DataItem, group?: Series) => {
    if (group) {
      (item as DataItem & { series?: string }).series = String(group.name);
    }
    onSelect?.(item);
  }, [onSelect]);

  const handleActivate = useCallback((item: DataItem, group?: Series, fromLegend = false) => {
    const eventItem = { ...item };
    if (group) {
      (eventItem as DataItem & { series?: string }).series = String(group.name);
    }

    const items = data
      .flatMap((g) => g.series)
      .filter((i) => {
        if (fromLegend) {
          return String(i.label ?? i.name) === String(item.name);
        }
        return String(i.name) === String(item.name);
      });

    setActiveEntries([...items]);
    onActivate?.({ value: eventItem, entries: items });
  }, [data, onActivate]);

  const handleDeactivate = useCallback((item: DataItem, group?: Series, fromLegend = false) => {
    const eventItem = { ...item };
    if (group) {
      (eventItem as DataItem & { series?: string }).series = String(group.name);
    }

    const newEntries = activeEntries.filter((i) => {
      if (fromLegend) {
        return String(i.label ?? i.name) !== String(item.name);
      }
      return !(String(i.name) === String(item.name));
    });

    setActiveEntries(newEntries);
    onDeactivate?.({ value: eventItem, entries: newEntries });
  }, [activeEntries, onDeactivate]);

  const handleXAxisHeightChanged = useCallback(({ height }: { height: number }) => {
    setXAxisHeight(height);
  }, []);

  const handleYAxisWidthChanged = useCallback(({ width }: { width: number }) => {
    setYAxisWidth(width);
  }, []);

  const handleDataLabelWidthChanged = useCallback((event: { size: { width: number; negative: boolean }; index: number }, groupIndex: number) => {
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
          <GridPanelSeries
            xScale={groupScale as unknown as ScaleBand<string>}
            yScale={groupScale}
            data={groupDomain.map((name) => ({ name }))}
            dims={dims}
            orient={BarOrientation.Horizontal}
          />
          {xAxisConfig.visible && (
            <XAxis
              xScale={valueScale}
              dims={dims}
              showGridLines={xAxisConfig.showGridLines}
              showLabel={xAxisConfig.showLabel}
              labelText={xAxisConfig.label}
              trimTicks={xAxisConfig.trimTicks}
              rotateTicks={xAxisConfig.rotateTicks}
              maxTickLength={xAxisConfig.maxTickLength}
              tickFormatting={xAxisConfig.tickFormatting}
              ticks={xAxisConfig.ticks}
              wrapTicks={xAxisConfig.wrapTicks}
              onDimensionsChanged={handleXAxisHeightChanged}
            />
          )}
          {yAxisConfig.visible && (
            <YAxis
              yScale={groupScale}
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
          <AnimatePresence>
            {multiSeriesData.map((group, groupIndex) => (
              <motion.g
                key={String(group.name)}
                transform={groupTransform(group)}
                initial={animated ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BarSeriesHorizontal
                  series={group.series}
                  xScale={valueScale}
                  yScale={innerScale}
                  getColor={(value: string) => colors.getColor(value)}
                  getGradientStops={(value: string, start?: string) => colors.getLinearGradientStops(value, start)}
                  dims={dims}
                  gradient={gradient}
                  activeEntries={activeEntries}
                  seriesName={group.name}
                  tooltipDisabled={tooltip?.disabled}
                  tooltipTemplate={tooltip?.template}
                  roundEdges={roundEdges}
                  animated={animated}
                  showDataLabel={showDataLabel}
                  dataLabelFormatting={dataLabelFormatting}
                  noBarWhenZero={noBarWhenZero}
                  onSelect={(item: DataItem) => handleClick(item, group)}
                  onActivate={(item: DataItem) => handleActivate(item, group)}
                  onDeactivate={(item: DataItem) => handleDeactivate(item, group)}
                  onDataLabelWidthChanged={(event: { size: { width: number; negative: boolean }; index: number }) => handleDataLabelWidthChanged(event, groupIndex)}
                />
              </motion.g>
            ))}
          </AnimatePresence>
        </g>
      </svg>
      {legend && (
        <Legend
          title={legendTitle}
          colors={colors}
          data={innerDomain}
          height={containerHeight}
          width={legendPosition === 'below' ? containerWidth : undefined}
          horizontal={legendPosition === 'below'}
          onLabelClick={(label: string) => handleClick({ name: label, value: 0 })}
          onLabelActivate={(item: { name: string }) => handleActivate(item as DataItem, undefined, true)}
          onLabelDeactivate={(item: { name: string }) => handleDeactivate(item as DataItem, undefined, true)}
        />
      )}
    </>
  );
});

/**
 * Horizontal grouped bar chart component
 */
export function BarHorizontalGrouped({
  width,
  height,
  className,
  ...props
}: MultiSeriesBarChartProps) {
  return (
    <BaseChart
      width={width}
      height={height}
      className={className}
    >
      {({ width: containerWidth, height: containerHeight }: { width: number; height: number }) => (
        <BarHorizontalGroupedInner
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          {...props}
        />
      )}
    </BaseChart>
  );
}

// Alias for backwards compatibility
export { BarHorizontalGrouped as BarHorizontal2D };
