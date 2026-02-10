'use client';

/**
 * @fileoverview Line chart hook
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/line-chart/line-chart.component.ts
 *
 * @description
 * Custom hook providing line chart calculations including scales, domains, and data processing.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear, scaleTime, scalePoint, ScaleLinear, ScaleTime, ScalePoint } from 'd3-scale';

import {
  MultiSeries,
  DataItem,
  ViewDimensions,
  ScaleType,
  ColorScheme,
  LegendPosition,
} from '../../types';
import { ColorHelper, calculateViewDimensions, useStableId } from '../../utils';

/** X Scale type union */
export type XScale = ScaleTime<number, number> | ScaleLinear<number, number> | ScalePoint<string>;

/** Y Scale type */
export type YScale = ScaleLinear<number, number>;

export interface UseLineChartConfig {
  /** Chart data */
  data: MultiSeries;
  /** Container width */
  width: number;
  /** Container height */
  height: number;
  /** Color scheme */
  colorScheme: string | ColorScheme;
  /** Scale type for colors */
  schemeType?: ScaleType;
  /** Custom colors */
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Show X axis */
  xAxis?: boolean;
  /** Show Y axis */
  yAxis?: boolean;
  /** Show X axis label */
  showXAxisLabel?: boolean;
  /** Show Y axis label */
  showYAxisLabel?: boolean;
  /** Show legend */
  legend?: boolean;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Auto scale Y axis from data */
  autoScale?: boolean;
  /** Round domains to nice values */
  roundDomains?: boolean;
  /** X scale minimum */
  xScaleMin?: number | Date;
  /** X scale maximum */
  xScaleMax?: number | Date;
  /** Y scale minimum */
  yScaleMin?: number;
  /** Y scale maximum */
  yScaleMax?: number;
  /** Timeline height */
  timelineHeight?: number;
  /** Show timeline */
  timeline?: boolean;
  /** Margin array [top, right, bottom, left] */
  margin?: [number, number, number, number];
}

export interface LineChartState {
  /** View dimensions after accounting for axes, margins, etc. */
  dims: ViewDimensions;
  /** X scale function */
  xScale: XScale;
  /** Y scale function */
  yScale: YScale;
  /** X domain values */
  xDomain: unknown[];
  /** Y domain values */
  yDomain: [number, number];
  /** Series domain (names) */
  seriesDomain: string[];
  /** Sorted unique X values */
  xSet: unknown[];
  /** Scale type detected from data */
  scaleType: ScaleType;
  /** Color helper instance */
  colors: ColorHelper;
  /** Transform string for chart positioning */
  transform: string;
  /** Clip path ID */
  clipPathId: string;
  /** Clip path URL reference */
  clipPath: string;
  /** Whether data has min/max range */
  hasRange: boolean;
  /** Legend options */
  legendOptions: {
    scaleType: ScaleType;
    colors: ColorHelper;
    domain: string[] | [number, number];
    title?: string;
    position: LegendPosition;
  };
  /** X axis height for layout */
  xAxisHeight: number;
  /** Y axis width for layout */
  yAxisWidth: number;
  /** Timeline X scale */
  timelineXScale?: XScale;
  /** Timeline Y scale */
  timelineYScale?: YScale;
  /** Timeline width */
  timelineWidth?: number;
  /** Timeline transform */
  timelineTransform?: string;
  /** Update X axis height callback */
  onXAxisHeightChange: (height: number) => void;
  /** Update Y axis width callback */
  onYAxisWidthChange: (width: number) => void;
  /** Filtered domain for timeline */
  filteredDomain?: unknown[];
  /** Update domain from timeline */
  updateDomain: (domain: unknown[]) => void;
}

/**
 * Detect scale type from values
 */
function getScaleType(values: unknown[]): ScaleType {
  if (values.length === 0) return ScaleType.Ordinal;

  const firstValue = values[0];

  if (firstValue instanceof Date) {
    return ScaleType.Time;
  }

  // Check if all values are numbers
  const allNumbers = values.every((v) => typeof v === 'number' || !isNaN(Number(v)));
  if (allNumbers) {
    return ScaleType.Linear;
  }

  return ScaleType.Ordinal;
}

/**
 * Get unique X domain values from data
 */
function getUniqueXDomainValues(data: MultiSeries): unknown[] {
  const values: unknown[] = [];

  for (const series of data) {
    for (const item of series.series) {
      if (!values.includes(item.name)) {
        values.push(item.name);
      }
    }
  }

  return values;
}

/**
 * Custom hook for line chart calculations
 */
export function useLineChart(config: UseLineChartConfig): LineChartState {
  const {
    data,
    width,
    height,
    colorScheme,
    schemeType = ScaleType.Ordinal,
    customColors,
    xAxis = true,
    yAxis = true,
    showXAxisLabel = false,
    showYAxisLabel = false,
    legend = false,
    legendPosition = LegendPosition.Right,
    autoScale = false,
    roundDomains = false,
    xScaleMin,
    xScaleMax,
    yScaleMin,
    yScaleMax,
    timelineHeight = 50,
    timeline = false,
    margin = [10, 20, 10, 20],
  } = config;

  // State for axis dimensions
  const [xAxisHeight, setXAxisHeight] = useState(0);
  const [yAxisWidth, setYAxisWidth] = useState(0);
  const [filteredDomain, setFilteredDomain] = useState<unknown[] | undefined>(undefined);

  // Callbacks for axis dimension updates
  const onXAxisHeightChange = useCallback((h: number) => setXAxisHeight(h), []);
  const onYAxisWidthChange = useCallback((w: number) => setYAxisWidth(w), []);
  const updateDomain = useCallback((domain: unknown[]) => setFilteredDomain(domain), []);

  // Stable ID for clip path (SSR-safe)
  const stableId = useStableId('clip');

  // Calculate all derived values
  const chartState = useMemo(() => {
    // Calculate view dimensions
    let dims = calculateViewDimensions({
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
      legendType: schemeType,
      legendPosition,
    });

    // Adjust for timeline
    if (timeline) {
      dims = {
        ...dims,
        height: dims.height - timelineHeight - margin[2] - 10,
      };
    }

    // Get unique X values and determine scale type
    const xValues = getUniqueXDomainValues(data);
    const scaleType = getScaleType(xValues);

    // Calculate X domain
    let xDomain: unknown[];
    let xSet: unknown[];

    if (scaleType === ScaleType.Time) {
      const dateValues = xValues.map((v) => (v instanceof Date ? v : new Date(v as string)));
      const min = xScaleMin instanceof Date ? xScaleMin : new Date(Math.min(...dateValues.map((d) => d.getTime())));
      const max = xScaleMax instanceof Date ? xScaleMax : new Date(Math.max(...dateValues.map((d) => d.getTime())));
      xDomain = filteredDomain ?? [min, max];
      xSet = [...dateValues].sort((a, b) => a.getTime() - b.getTime());
    } else if (scaleType === ScaleType.Linear) {
      const numValues = xValues.map((v) => Number(v));
      const min = xScaleMin !== undefined ? (xScaleMin as number) : Math.min(...numValues);
      const max = xScaleMax !== undefined ? (xScaleMax as number) : Math.max(...numValues);
      xDomain = filteredDomain ?? [min, max];
      xSet = [...numValues].sort((a, b) => a - b);
    } else {
      xDomain = filteredDomain ?? xValues;
      xSet = xValues;
    }

    // Calculate Y domain and check for range
    let hasRange = false;
    const yValues: number[] = [];

    for (const series of data) {
      for (const item of series.series) {
        yValues.push(item.value);
        if (item.min !== undefined) {
          hasRange = true;
          yValues.push(item.min);
        }
        if (item.max !== undefined) {
          hasRange = true;
          yValues.push(item.max);
        }
      }
    }

    if (!autoScale) {
      yValues.push(0);
    }

    const yMin = yScaleMin !== undefined ? yScaleMin : Math.min(...yValues);
    const yMax = yScaleMax !== undefined ? yScaleMax : Math.max(...yValues);
    const yDomain: [number, number] = [yMin, yMax];

    // Get series domain
    const seriesDomain = data.map((d) => String(d.name));

    // Create X scale
    let xScale: XScale;
    if (scaleType === ScaleType.Time) {
      xScale = scaleTime().range([0, dims.width]).domain(xDomain as [Date, Date]);
    } else if (scaleType === ScaleType.Linear) {
      xScale = scaleLinear().range([0, dims.width]).domain(xDomain as [number, number]);
      if (roundDomains) {
        xScale = xScale.nice();
      }
    } else {
      xScale = scalePoint<string>()
        .range([0, dims.width])
        .padding(0.1)
        .domain(xDomain as string[]);
    }

    // Create Y scale
    let yScale: YScale = scaleLinear().range([dims.height, 0]).domain(yDomain);
    if (roundDomains) {
      yScale = yScale.nice();
    }

    // Create colors
    const colorDomain = schemeType === ScaleType.Ordinal ? seriesDomain : yDomain;
    const colors = new ColorHelper({
      scheme: colorScheme,
      scaleType: schemeType,
      domain: colorDomain as string[] | number[],
      customColors,
    });

    // Use stable clip path ID (passed from hook level for SSR safety)
    const clipPathId = stableId;
    const clipPath = `url(#${clipPathId})`;

    // Transform string
    const transform = `translate(${dims.xOffset ?? 0}, ${margin[0]})`;

    // Legend options
    const legendOptions = {
      scaleType: schemeType,
      colors,
      domain: schemeType === ScaleType.Ordinal ? seriesDomain : yDomain,
      title: legend ? 'Legend' : undefined,
      position: legendPosition,
    };

    // Timeline scales
    let timelineXScale: XScale | undefined;
    let timelineYScale: YScale | undefined;
    let timelineWidth: number | undefined;
    let timelineTransform: string | undefined;

    if (timeline && scaleType !== ScaleType.Ordinal) {
      timelineWidth = dims.width;
      const timelineDomain = getUniqueXDomainValues(data);

      if (scaleType === ScaleType.Time) {
        const dateValues = timelineDomain.map((v) => (v instanceof Date ? v : new Date(v as string)));
        timelineXScale = scaleTime()
          .range([0, timelineWidth])
          .domain([new Date(Math.min(...dateValues.map((d) => d.getTime()))), new Date(Math.max(...dateValues.map((d) => d.getTime())))]);
      } else {
        const numValues = timelineDomain.map((v) => Number(v));
        timelineXScale = scaleLinear()
          .range([0, timelineWidth])
          .domain([Math.min(...numValues), Math.max(...numValues)]);
      }

      timelineYScale = scaleLinear().range([timelineHeight, 0]).domain(yDomain);
      timelineTransform = `translate(${dims.xOffset ?? 0}, ${-margin[2]})`;
    }

    return {
      dims,
      xScale,
      yScale,
      xDomain,
      yDomain,
      seriesDomain,
      xSet,
      scaleType,
      colors,
      transform,
      clipPathId,
      clipPath,
      hasRange,
      legendOptions,
      timelineXScale,
      timelineYScale,
      timelineWidth,
      timelineTransform,
    };
  }, [
    data,
    width,
    height,
    colorScheme,
    schemeType,
    customColors,
    xAxis,
    yAxis,
    showXAxisLabel,
    showYAxisLabel,
    legend,
    legendPosition,
    autoScale,
    roundDomains,
    xScaleMin,
    xScaleMax,
    yScaleMin,
    yScaleMax,
    timelineHeight,
    timeline,
    margin,
    xAxisHeight,
    yAxisWidth,
    filteredDomain,
    stableId,
  ]);

  return {
    ...chartState,
    xAxisHeight,
    yAxisWidth,
    onXAxisHeightChange,
    onYAxisWidthChange,
    filteredDomain,
    updateDomain,
  };
}

/**
 * Sort data for line rendering
 */
export function sortLineData(
  data: DataItem[],
  scaleType: ScaleType,
  xScale?: XScale
): DataItem[] {
  if (scaleType === ScaleType.Linear) {
    return [...data].sort((a, b) => Number(a.name) - Number(b.name));
  } else if (scaleType === ScaleType.Time) {
    return [...data].sort((a, b) => {
      const aDate = a.name instanceof Date ? a.name : new Date(a.name as string);
      const bDate = b.name instanceof Date ? b.name : new Date(b.name as string);
      return aDate.getTime() - bDate.getTime();
    });
  } else if (xScale && 'domain' in xScale) {
    const domain = xScale.domain() as string[];
    return [...data].sort((a, b) => {
      const aIndex = domain.indexOf(String(a.name));
      const bIndex = domain.indexOf(String(b.name));
      return aIndex - bIndex;
    });
  }
  return data;
}
