/**
 * @fileoverview BoxChart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/box-chart/box-chart.component.ts
 *
 * @description
 * Box chart (box-and-whisker plot) for statistical distribution visualization.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useRef, useState } from 'react';
import type { ScaleBand, ScaleLinear } from 'd3-scale';
import { scaleBand, scaleLinear } from 'd3-scale';
import type { ColorScheme, ViewDimensions} from '../types';
import { ScaleType, LegendPosition } from '../types';
import { ColorHelper, calculateViewDimensions } from '../utils';
import { BaseChart, useChartDimensions } from '../common';
import { XAxis, YAxis } from '../common/axes';
import { Legend } from '../common/legend';
import type { BoxChartSeries } from './box-series';
import { BoxSeries } from './box-series';
import type { IBoxModel } from './box';

export type BoxChartMultiSeries = BoxChartSeries[];

export interface BoxChartProps {
  /** Chart data */
  data: BoxChartMultiSeries;
  /** Fixed width */
  width?: number;
  /** Fixed height */
  height?: number;
  /** Color scheme */
  colorScheme?: string | ColorScheme;
  /** Custom colors */
  colors?: Array<{ name: string; value: string }>;
  /** Scheme type */
  schemeType?: ScaleType;
  /** Show legend */
  legend?: boolean;
  /** Legend title */
  legendTitle?: string;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Show X axis */
  xAxis?: boolean;
  /** Show Y axis */
  yAxis?: boolean;
  /** Show grid lines */
  showGridLines?: boolean;
  /** Show X axis label */
  showXAxisLabel?: boolean;
  /** Show Y axis label */
  showYAxisLabel?: boolean;
  /** X axis label text */
  xAxisLabel?: string;
  /** Y axis label text */
  yAxisLabel?: string;
  /** Round domains */
  roundDomains?: boolean;
  /** Round box edges */
  roundEdges?: boolean;
  /** Box stroke color */
  strokeColor?: string;
  /** Box stroke width */
  strokeWidth?: number;
  /** Enable gradient fills */
  gradient?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Disable tooltips */
  tooltipDisabled?: boolean;
  /** Wrap axis ticks */
  wrapTicks?: boolean;
  /** Selection callback */
  onSelect?: (data: IBoxModel) => void;
  /** Activation callback */
  onActivate?: (data: IBoxModel) => void;
  /** Deactivation callback */
  onDeactivate?: (data: IBoxModel) => void;
  /** Custom class name */
  className?: string;
}

export function BoxChart({
  data,
  width: fixedWidth,
  height: fixedHeight,
  colorScheme = 'cool',
  colors: customColors,
  schemeType = ScaleType.Ordinal,
  legend = false,
  legendTitle = 'Legend',
  legendPosition = LegendPosition.Right,
  xAxis = true,
  yAxis = true,
  showGridLines = true,
  showXAxisLabel = true,
  showYAxisLabel = true,
  xAxisLabel = '',
  yAxisLabel = '',
  roundDomains = false,
  roundEdges = true,
  strokeColor = '#FFFFFF',
  strokeWidth = 2,
  gradient = false,
  animated = true,
  tooltipDisabled = false,
  wrapTicks = false,
  onSelect,
  onActivate,
  onDeactivate,
  className = '',
}: BoxChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartDimensions(
    containerRef as React.RefObject<HTMLElement>,
    fixedWidth,
    fixedHeight
  );

  const [xAxisHeight, setXAxisHeight] = useState(0);
  const [yAxisWidth, setYAxisWidth] = useState(0);

  const margin: [number, number, number, number] = useMemo(() => [10, 20, 10, 20], []);

  // Calculate view dimensions
  const dims: ViewDimensions = useMemo(() => {
    return calculateViewDimensions({
      width,
      height,
      margins: margin,
      showXAxis: xAxis,
      showYAxis: yAxis,
      xAxisHeight,
      yAxisWidth,
      showXLabel: showXAxisLabel,
      showYLabel: showYAxisLabel,
      showLegend: legend,
      legendPosition,
    });
  }, [width, height, margin, xAxis, yAxis, xAxisHeight, yAxisWidth, showXAxisLabel, showYAxisLabel, legend, legendPosition]);

  // Calculate X domain
  const xDomain = useMemo(() => {
    const values = data.map((d) => d.name);
    return values.map((v) => String(v));
  }, [data]);

  // Calculate Y domain
  const yDomain = useMemo(() => {
    const allValues: number[] = [];
    for (const result of data) {
      for (const d of result.series) {
        allValues.push(Number(d.value));
      }
    }
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    return [min, max];
  }, [data]);

  // Series domain for legend
  const seriesDomain = useMemo(() => {
    return data.map((d) => String(d.name));
  }, [data]);

  // Create X scale
  const xScale: ScaleBand<string> = useMemo(() => {
    return scaleBand<string>()
      .domain(xDomain)
      .rangeRound([0, dims.width])
      .padding(0.5);
  }, [xDomain, dims.width]);

  // Create Y scale
  const yScale: ScaleLinear<number, number> = useMemo(() => {
    const scale = scaleLinear().domain(yDomain).range([dims.height, 0]);
    return roundDomains ? scale.nice() : scale;
  }, [yDomain, dims.height, roundDomains]);

  // Create color helper
  const colorHelper = useMemo(() => {
    const domain = schemeType === ScaleType.Ordinal ? seriesDomain : yDomain.map(String);
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: schemeType,
      domain,
      customColors,
    });
  }, [colorScheme, schemeType, seriesDomain, yDomain, customColors]);

  // Event handlers
  const handleSelect = useCallback(
    (item: IBoxModel) => {
      onSelect?.(item);
    },
    [onSelect]
  );

  const handleActivate = useCallback(
    (item: IBoxModel) => {
      onActivate?.(item);
    },
    [onActivate]
  );

  const handleDeactivate = useCallback(
    (item: IBoxModel) => {
      onDeactivate?.(item);
    },
    [onDeactivate]
  );

  const handleXAxisHeightChange = useCallback((height: number) => {
    setXAxisHeight(height);
  }, []);

  const handleYAxisWidthChange = useCallback((width: number) => {
    setYAxisWidth(width);
  }, []);

  const transform = `translate(${dims.xOffset || margin[3]}, ${margin[0]})`;

  return (
    <BaseChart
      ref={containerRef}
      width={fixedWidth}
      height={fixedHeight}
      animated={animated}
      className={`ngx-charts-box-chart ${className}`}
    >
      <svg width={width} height={height} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}>
        {/* Axes */}
        <g transform={transform} className="box-chart chart">
          {xAxis && (
            <XAxis
              xScale={xScale}
              dims={dims}
              showGridLines={showGridLines}
              showLabel={showXAxisLabel}
              labelText={xAxisLabel}
              wrapTicks={wrapTicks}
              onDimensionsChanged={({ height }: { height: number }) => handleXAxisHeightChange(height)}
            />
          )}
          {yAxis && (
            <YAxis
              yScale={yScale}
              dims={dims}
              showGridLines={showGridLines}
              showLabel={showYAxisLabel}
              labelText={yAxisLabel}
              wrapTicks={wrapTicks}
              onDimensionsChanged={({ width }: { width: number }) => handleYAxisWidthChange(width)}
            />
          )}
        </g>

        {/* Box series */}
        <g transform={transform}>
          {data.map((result, index) => (
            <BoxSeries
              key={`box-${index}-${result.name}`}
              dims={dims}
              series={result}
              xScale={xScale}
              yScale={yScale}
              colors={colorHelper}
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              roundEdges={roundEdges}
              gradient={gradient}
              animated={animated}
              tooltipDisabled={tooltipDisabled}
              onSelect={handleSelect}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
            />
          ))}
        </g>
      </svg>

      {/* Legend */}
      {legend && (
        <Legend
          data={xDomain}
          colors={colorHelper}
          title={legendTitle}
        />
      )}
    </BaseChart>
  );
}
