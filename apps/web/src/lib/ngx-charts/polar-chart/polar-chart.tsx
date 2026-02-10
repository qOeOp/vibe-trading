/**
 * @fileoverview PolarChart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/polar-chart/polar-chart.component.ts
 *
 * @description
 * Polar/Radar chart for circular data visualization.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useRef, useState } from 'react';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';
import { curveCardinalClosed } from 'd3-shape';
import type { CurveFactory } from 'd3-shape';
import type { MultiSeries, ColorScheme, ViewDimensions} from '../types';
import { ScaleType, LegendPosition } from '../types';
import { ColorHelper, calculateViewDimensions } from '../utils';
import { BaseChart, useChartDimensions } from '../common';
import { YAxis } from '../common/axes';
import { Legend } from '../common/legend';
import { PolarSeries } from './polar-series';

const TWO_PI = 2 * Math.PI;

export interface PolarChartProps {
  /** Chart data */
  data: MultiSeries;
  /** Fixed width */
  width?: number;
  /** Fixed height */
  height?: number;
  /** Color scheme */
  colorScheme?: string | ColorScheme;
  /** Custom colors */
  colors?: Array<{ name: string; value: string }>;
  /** Show legend */
  legend?: boolean;
  /** Legend title */
  legendTitle?: string;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Show X axis labels */
  xAxis?: boolean;
  /** Show Y axis */
  yAxis?: boolean;
  /** Show X axis label */
  showXAxisLabel?: boolean;
  /** Show Y axis label */
  showYAxisLabel?: boolean;
  /** X axis label text */
  xAxisLabel?: string;
  /** Y axis label text */
  yAxisLabel?: string;
  /** Auto scale Y axis */
  autoScale?: boolean;
  /** Show grid lines */
  showGridLines?: boolean;
  /** Line curve type */
  curve?: CurveFactory;
  /** Range fill opacity */
  rangeFillOpacity?: number;
  /** Round Y axis domains */
  roundDomains?: boolean;
  /** Enable gradient fills */
  gradient?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Disable tooltips */
  tooltipDisabled?: boolean;
  /** Y axis minimum scale */
  yAxisMinScale?: number;
  /** Trim X axis labels */
  labelTrim?: boolean;
  /** Label trim size */
  labelTrimSize?: number;
  /** X axis tick formatting */
  xAxisTickFormatting?: (value: string | number | Date) => string;
  /** Y axis tick formatting */
  yAxisTickFormatting?: (value: string | number | Date) => string;
  /** Selection callback */
  onSelect?: (data: unknown) => void;
  /** Activation callback */
  onActivate?: (data: unknown) => void;
  /** Deactivation callback */
  onDeactivate?: (data: unknown) => void;
  /** Custom class name */
  className?: string;
}

export function PolarChart({
  data,
  width: fixedWidth,
  height: fixedHeight,
  colorScheme = 'cool',
  colors: customColors,
  legend = false,
  legendTitle = 'Legend',
  legendPosition = LegendPosition.Right,
  xAxis = true,
  yAxis = true,
  showXAxisLabel = false,
  showYAxisLabel = false,
  xAxisLabel = '',
  yAxisLabel = '',
  autoScale = false,
  showGridLines = true,
  curve = curveCardinalClosed,
  rangeFillOpacity = 0.15,
  roundDomains = false,
  gradient = false,
  animated = true,
  tooltipDisabled = false,
  yAxisMinScale = 0,
  labelTrim = true,
  labelTrimSize = 10,
  xAxisTickFormatting,
  yAxisTickFormatting,
  onSelect,
  onActivate,
  onDeactivate,
  className = '',
}: PolarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartDimensions(
    containerRef as React.RefObject<HTMLElement>,
    fixedWidth,
    fixedHeight
  );

  const [activeEntries, setActiveEntries] = useState<{ name: string | number | Date }[]>([]);
  const [yAxisWidth, setYAxisWidth] = useState(0);

  const margin = useMemo<[number, number, number, number]>(() => [10, 20, 10, 20], []);

  // Calculate view dimensions
  const dims: ViewDimensions = useMemo(() => {
    return calculateViewDimensions({
      width,
      height,
      margins: margin,
      showXAxis: xAxis,
      showYAxis: yAxis,
      yAxisWidth,
      showXLabel: showXAxisLabel,
      showYLabel: showYAxisLabel,
      showLegend: legend,
      legendPosition,
    });
  }, [width, height, margin, xAxis, yAxis, yAxisWidth, showXAxisLabel, showYAxisLabel, legend, legendPosition]);

  // Calculate outer radius
  const outerRadius = useMemo(() => {
    const halfWidth = Math.floor(dims.width / 2);
    const halfHeight = Math.floor(dims.height / 2);
    return Math.min(halfHeight / 1.5, halfWidth / 1.5);
  }, [dims.width, dims.height]);

  // Get all X values
  const xValues = useMemo(() => {
    const values: (string | number | Date)[] = [];
    for (const result of data) {
      for (const d of result.series || []) {
        if (!values.includes(d.name)) {
          values.push(d.name);
        }
      }
    }
    return values;
  }, [data]);

  // Determine scale type
  const scaleType = useMemo(() => {
    if (xValues.length === 0) return ScaleType.Ordinal;
    const firstValue = xValues[0];
    if (firstValue instanceof Date) return ScaleType.Time;
    if (typeof firstValue === 'number') return ScaleType.Linear;
    return ScaleType.Ordinal;
  }, [xValues]);

  // Calculate X domain
  const xDomain = useMemo(() => {
    if (scaleType === ScaleType.Time) {
      const min = Math.min(...xValues.map((v) => new Date(v).getTime()));
      const max = Math.max(...xValues.map((v) => new Date(v).getTime()));
      return [new Date(min), new Date(max)];
    } else if (scaleType === ScaleType.Linear) {
      const values = xValues.map((v) => Number(v));
      return [Math.min(...values), Math.max(...values)];
    }
    return xValues;
  }, [xValues, scaleType]);

  // Calculate Y domain
  const yDomain = useMemo(() => {
    const domain: number[] = [];
    for (const result of data) {
      for (const d of result.series || []) {
        if (!domain.includes(d.value as number)) {
          domain.push(d.value as number);
        }
        if (d.min !== undefined && !domain.includes(d.min)) {
          domain.push(d.min);
        }
        if (d.max !== undefined && !domain.includes(d.max)) {
          domain.push(d.max);
        }
      }
    }

    let min = Math.min(...domain);
    const max = Math.max(yAxisMinScale, ...domain);
    min = Math.max(0, min);
    if (!autoScale) {
      min = Math.min(0, min);
    }

    return [min, max];
  }, [data, autoScale, yAxisMinScale]);

  // Series domain for legend
  const seriesDomain = useMemo(() => {
    return data.map((d) => d.name as string);
  }, [data]);

  // Create X scale (theta)
  const xScale = useMemo(() => {
    switch (scaleType) {
      case ScaleType.Time:
        return scaleTime().range([0, TWO_PI]).domain(xDomain as [Date, Date]);
      case ScaleType.Linear: {
        const scale = scaleLinear().range([0, TWO_PI]).domain(xDomain as [number, number]);
        return roundDomains ? scale.nice() : scale;
      }
      default:
        return scalePoint<string>()
          .range([0, TWO_PI - TWO_PI / (xDomain as string[]).length])
          .padding(0)
          .domain(xDomain as string[]);
    }
  }, [scaleType, xDomain, roundDomains]);

  // Create Y scale (radius)
  const yScale = useMemo(() => {
    const scale = scaleLinear().range([0, outerRadius]).domain(yDomain);
    return roundDomains ? scale.nice() : scale;
  }, [yDomain, outerRadius, roundDomains]);

  // Y axis scale (reversed for display)
  const yAxisScale = useMemo(() => {
    const scale = scaleLinear().range([0, outerRadius]).domain([...yDomain].reverse());
    return roundDomains ? scale.nice() : scale;
  }, [yDomain, outerRadius, roundDomains]);

  // Create color helper
  const colorHelper = useMemo(() => {
    const domain = scaleType === ScaleType.Ordinal ? seriesDomain : [...yDomain].reverse();
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: scaleType === ScaleType.Ordinal ? ScaleType.Ordinal : ScaleType.Linear,
      domain: domain.map(String),
      customColors,
    });
  }, [colorScheme, scaleType, seriesDomain, yDomain, customColors]);

  // Generate theta ticks for X axis labels
  const thetaTicks = useMemo(() => {
    if (!xAxis) return [];

    const tickFormat =
      xAxisTickFormatting ||
      ((d: string | number | Date) => {
        if (d instanceof Date) return d.toLocaleDateString();
        return String(d);
      });

    const s = 1.1;
    return (xDomain as (string | number | Date)[]).map((d) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- xScale can be time/linear/point scale; D3 scale input types are incompatible across scale types
      const startAngle = (xScale as (v: any) => number)(d) ?? 0;
      const dd = s * outerRadius * (startAngle > Math.PI ? -1 : 1);
      const label = tickFormat(d);

      const startPos = [outerRadius * Math.sin(startAngle), -outerRadius * Math.cos(startAngle)];
      const pos = [dd, s * startPos[1]];

      return {
        startAngle,
        label,
        startPos,
        pos,
      };
    });
  }, [xAxis, xDomain, xScale, outerRadius, xAxisTickFormatting]);

  // Generate radius ticks for grid circles
  const radiusTicks = useMemo(() => {
    if (!showGridLines) return [];
    const tickCount = Math.floor(dims.height / 50);
    return yAxisScale.ticks(tickCount).map((d: number) => yScale(d));
  }, [showGridLines, dims.height, yAxisScale, yScale]);

  // Transforms
  const halfWidth = Math.floor(dims.width / 2);
  const halfHeight = Math.floor(dims.height / 2);
  const yOffset = Math.max(0, halfHeight - outerRadius);

  const transform = `translate(${dims.xOffset || margin[3]}, ${margin[0]})`;
  const transformPlot = `translate(${halfWidth}, ${halfHeight})`;
  const transformYAxis = `translate(0, ${yOffset})`;

  // Y axis dimensions
  const yAxisDims: ViewDimensions = {
    ...dims,
    width: halfWidth,
  };

  // Event handlers
  const handleSelect = useCallback(
    (item: unknown) => {
      onSelect?.(item);
    },
    [onSelect]
  );

  const handleActivate = useCallback(
    (data: unknown) => {
      const item = data as { name: string | number | Date };
      const idx = activeEntries.findIndex((d) => d.name === item.name);
      if (idx === -1) {
        setActiveEntries([item, ...activeEntries]);
      }
      onActivate?.({ value: item, entries: activeEntries });
    },
    [activeEntries, onActivate]
  );

  const handleDeactivate = useCallback(
    (data: unknown) => {
      const item = data as { name: string | number | Date };
      const idx = activeEntries.findIndex((d) => d.name === item.name);
      if (idx > -1) {
        const newEntries = [...activeEntries];
        newEntries.splice(idx, 1);
        setActiveEntries(newEntries);
      }
      onDeactivate?.({ value: item, entries: activeEntries });
    },
    [activeEntries, onDeactivate]
  );

  const handleYAxisWidthChange = useCallback((width: number) => {
    setYAxisWidth(width);
  }, []);

  return (
    <BaseChart
      ref={containerRef}
      width={fixedWidth}
      height={fixedHeight}
      animated={animated}
      className={`ngx-charts-polar-chart ${className}`}
    >
      <svg width={width} height={height} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}>
        <g className="polar-chart chart" transform={transform}>
          {/* Plot area */}
          <g transform={transformPlot}>
            {/* Background circle */}
            <circle className="polar-chart-background" cx={0} cy={0} r={outerRadius} fill="none" stroke="#ddd" strokeOpacity={0.3} />

            {/* Grid circles */}
            {showGridLines &&
              radiusTicks.map((r, index) => (
                <circle
                  key={`grid-${index}`}
                  className="gridline-path radial-gridline-path"
                  cx={0}
                  cy={0}
                  r={r}
                  fill="none"
                  stroke="#ddd"
                  strokeOpacity={0.3}
                />
              ))}

            {/* Theta labels */}
            {xAxis &&
              thetaTicks.map((tick, index) => (
                <g key={`tick-${index}`}>
                  <line
                    x1={0}
                    y1={0}
                    x2={tick.startPos[0]}
                    y2={tick.startPos[1]}
                    stroke="#ddd"
                    strokeOpacity={0.3}
                  />
                  <text
                    x={tick.pos[0]}
                    y={tick.pos[1]}
                    textAnchor={tick.startAngle > Math.PI ? 'end' : 'start'}
                    dy="0.35em"
                    style={{ fontSize: '11px', fill: '#666' }}
                  >
                    {labelTrim && tick.label.length > labelTrimSize
                      ? tick.label.slice(0, labelTrimSize) + '...'
                      : tick.label}
                  </text>
                </g>
              ))}
          </g>

          {/* Y Axis */}
          {yAxis && (
            <g transform={transformYAxis}>
              <YAxis
                yScale={yAxisScale}
                dims={yAxisDims}
                showGridLines={false}
                showLabel={showYAxisLabel}
                labelText={yAxisLabel}
                tickFormatting={yAxisTickFormatting}
                onDimensionsChanged={({ width }: { width: number }) => handleYAxisWidthChange(width)}
              />
            </g>
          )}

          {/* X Axis Label */}
          {xAxis && showXAxisLabel && (
            <text
              x={dims.width / 2}
              y={dims.height + 40}
              textAnchor="middle"
              style={{ fontSize: '12px', fill: '#666' }}
            >
              {xAxisLabel}
            </text>
          )}

          {/* Series */}
          <g transform={transformPlot}>
            {data.map((series, index) => (
              <PolarSeries
                key={`series-${index}-${series.name}`}
                data={series}
                xScale={xScale}
                yScale={yScale}
                colors={colorHelper}
                scaleType={scaleType}
                curve={curve}
                activeEntries={activeEntries}
                rangeFillOpacity={rangeFillOpacity}
                gradient={gradient}
                animated={animated}
                tooltipDisabled={tooltipDisabled}
                onSelect={handleSelect}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            ))}
          </g>
        </g>
      </svg>

      {/* Legend */}
      {legend && (
        <Legend
          data={seriesDomain}
          colors={colorHelper}
          title={legendTitle}
          onLabelClick={handleSelect}
          onLabelActivate={handleActivate}
          onLabelDeactivate={handleDeactivate}
        />
      )}
    </BaseChart>
  );
}
