'use client';

/**
 * @fileoverview Vertical normalized bar chart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/bar-vertical-normalized.component.ts
 *
 * @description
 * Vertical normalized bar chart where stacked series are shown as
 * percentages of the total (0-100%).
 *
 * @license MIT
 */

import { useState, useMemo, useCallback, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { DataItem, Series, ScaleType, LegendPosition } from '../types';
import { BaseChart, XAxis, YAxis, Legend } from '../common';
import { ColorHelper, calculateViewDimensions } from '../utils';
import { useNormalizedBarScales } from './hooks';
import { BarSeriesVertical } from './components';
import { BarChartType } from './types';
import type { MultiSeriesBarChartProps } from './types';

interface BarVerticalNormalizedInnerProps extends Omit<MultiSeriesBarChartProps, 'width' | 'height' | 'className'> {
  containerWidth: number;
  containerHeight: number;
}

/**
 * Inner component that renders the actual chart content
 * Separated to avoid calling hooks inside render callbacks
 */
const BarVerticalNormalizedInner = memo(function BarVerticalNormalizedInner({
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
  roundDomains = false,
  barPadding = 8,
  noBarWhenZero = true,
  activeEntries: initialActiveEntries = [],
  onSelect,
  onActivate,
  onDeactivate,
}: BarVerticalNormalizedInnerProps) {
  const [xAxisHeight, setXAxisHeight] = useState(0);
  const [yAxisWidth, setYAxisWidth] = useState(0);
  const [activeEntries, setActiveEntries] = useState<DataItem[]>(initialActiveEntries);

  // Merge axis config with defaults
  const xAxisConfig = useMemo(() => ({
    visible: true,
    showLabel: false,
    showGridLines: false,
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
    ...yAxis,
  }), [yAxis]);

  // Calculate margins
  const margin = useMemo(() => {
    return [10, 20, 10, 20] as [number, number, number, number];
  }, []);

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
  const { groupScale, innerScale: _innerScale, valueScale, groupDomain: _groupDomain, innerDomain, valueDomain: _valueDomain } = useNormalizedBarScales({
    multiData: multiSeriesData,
    width: dims.width,
    height: dims.height,
    barPadding,
    roundDomains,
    orientation: 'vertical',
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
    const x = groupScale(String(group.name)) ?? 0;
    return `translate(${x}, 0)`;
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

  return (
    <>
      <svg width={containerWidth} height={containerHeight} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}>
        <g transform={transform} className="bar-chart chart">
          {xAxisConfig.visible && (
            <XAxis
              xScale={groupScale}
              dims={dims}
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
              yScale={valueScale}
              dims={dims}
              showGridLines={yAxisConfig.showGridLines}
              showLabel={yAxisConfig.showLabel}
              labelText={yAxisConfig.label}
              trimTicks={yAxisConfig.trimTicks}
              maxTickLength={yAxisConfig.maxTickLength}
              tickFormatting={yAxisConfig.tickFormatting}
              ticks={yAxisConfig.ticks}
              wrapTicks={yAxisConfig.wrapTicks}
              onDimensionsChanged={handleYAxisWidthChanged}
            />
          )}
          <AnimatePresence>
            {multiSeriesData.map((group) => (
              <motion.g
                key={String(group.name)}
                transform={groupTransform(group)}
                initial={animated ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BarSeriesVertical
                  type={BarChartType.Normalized}
                  series={group.series}
                  xScale={groupScale}
                  yScale={valueScale}
                  getColor={(value: string) => colors.getColor(value)}
                  getGradientStops={(value: string, start?: string) => colors.getLinearGradientStops(value, start)}
                  dims={dims}
                  gradient={gradient}
                  activeEntries={activeEntries}
                  seriesName={group.name}
                  tooltipDisabled={tooltip?.disabled}
                  tooltipTemplate={tooltip?.template}
                  animated={animated}
                  noBarWhenZero={noBarWhenZero}
                  onSelect={(item: DataItem) => handleClick(item, group)}
                  onActivate={(item: DataItem) => handleActivate(item, group)}
                  onDeactivate={(item: DataItem) => handleDeactivate(item, group)}
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
 * Vertical normalized bar chart component
 */
export function BarVerticalNormalized({
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
        <BarVerticalNormalizedInner
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          {...props}
        />
      )}
    </BaseChart>
  );
}
