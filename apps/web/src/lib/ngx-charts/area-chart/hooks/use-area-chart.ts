'use client';

/**
 * @fileoverview Area chart hook for computing scales and domains
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/area-chart/area-chart.component.ts
 *
 * @description
 * Custom hook that handles domain calculation, scale creation, and data processing
 * for area charts. Supports time, linear, and ordinal scales.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

import { useMemo, useCallback, useState } from 'react';
import { scaleLinear, scalePoint, scaleTime, ScaleLinear, ScaleTime, ScalePoint } from 'd3-scale';
import { CurveFactory, curveLinear } from 'd3-shape';

import {
  MultiSeries,
  ScaleType,
  ViewDimensions,
  LegendPosition,
} from '../../types';
import {
  calculateViewDimensions,
  ViewDimensionsConfig,
  ColorHelper,
} from '../../utils';

/** Scale type union */
export type XScale =
  | ScaleLinear<number, number>
  | ScaleTime<number, number>
  | ScalePoint<string>;

export type YScale = ScaleLinear<number, number>;

/** Processed series item data */
export interface ProcessedSeriesItem {
  name: string | number | Date;
  value: number;
  d0: number;
  d1: number;
}

/** Processed data for stacked/normalized charts */
export interface ProcessedSeriesData {
  name: string | number | Date;
  series: ProcessedSeriesItem[];
}

export interface UseAreaChartConfig {
  /** Chart data */
  data: MultiSeries;
  /** Container width */
  width: number;
  /** Container height */
  height: number;
  /** Show X axis */
  showXAxis?: boolean;
  /** Show Y axis */
  showYAxis?: boolean;
  /** Show X axis label */
  showXAxisLabel?: boolean;
  /** Show Y axis label */
  showYAxisLabel?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Color scheme */
  colorScheme: string;
  /** Scale type for colors */
  schemeType?: ScaleType;
  /** Custom colors */
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Auto scale Y axis (don't include 0) */
  autoScale?: boolean;
  /** Base value for area fill */
  baseValue?: number | 'auto';
  /** Round domains to nice values */
  roundDomains?: boolean;
  /** Curve factory function */
  curve?: CurveFactory;
  /** X scale minimum */
  xScaleMin?: number | Date;
  /** X scale maximum */
  xScaleMax?: number | Date;
  /** Y scale minimum */
  yScaleMin?: number;
  /** Y scale maximum */
  yScaleMax?: number;
  /** Whether chart is stacked */
  stacked?: boolean;
  /** Whether chart is normalized (100%) */
  normalized?: boolean;
  /** Show timeline */
  timeline?: boolean;
  /** X axis height (from measurement) */
  xAxisHeight?: number;
  /** Y axis width (from measurement) */
  yAxisWidth?: number;
  /** Custom margins [top, right, bottom, left] */
  margins?: [number, number, number, number];
}

export interface UseAreaChartResult {
  /** Calculated view dimensions */
  dims: ViewDimensions;
  /** X scale function */
  xScale: XScale;
  /** Y scale function */
  yScale: YScale;
  /** X domain values */
  xDomain: Array<string | number | Date>;
  /** Y domain values */
  yDomain: [number, number];
  /** Unique X values set */
  xSet: Array<string | number | Date>;
  /** Series domain (series names) */
  seriesDomain: string[];
  /** Detected scale type */
  scaleType: ScaleType;
  /** Color helper instance */
  colors: ColorHelper;
  /** Transform for chart group */
  transform: string;
  /** Processed data with stacking values */
  processedData: ProcessedSeriesData[];
  /** Timeline scales and dimensions */
  timelineScales?: {
    xScale: XScale;
    yScale: YScale;
    width: number;
    height: number;
    transform: string;
  };
  /** Curve factory */
  curve: CurveFactory;
  /** Update X axis height callback */
  updateXAxisHeight: (height: number) => void;
  /** Update Y axis width callback */
  updateYAxisWidth: (width: number) => void;
  /** Update filtered domain (from timeline) */
  updateFilteredDomain: (domain: Array<string | number | Date>) => void;
}

/**
 * Detects the scale type from values array
 */
function detectScaleType(values: Array<unknown>): ScaleType {
  if (values.length === 0) return ScaleType.Ordinal;

  const first = values[0];

  if (first instanceof Date) {
    return ScaleType.Time;
  }

  if (typeof first === 'number') {
    return ScaleType.Linear;
  }

  // Check if all values are numeric strings
  const allNumeric = values.every((v) => {
    const num = Number(v);
    return !isNaN(num) && isFinite(num);
  });

  if (allNumeric) {
    return ScaleType.Linear;
  }

  return ScaleType.Ordinal;
}

/**
 * Gets unique X domain values from data
 */
function getUniqueXDomainValues(data: MultiSeries): Array<string | number | Date> {
  const valueSet = new Set<string>();
  const values: Array<string | number | Date> = [];

  for (const series of data) {
    for (const item of series.series) {
      const key = String(item.name);
      if (!valueSet.has(key)) {
        valueSet.add(key);
        values.push(item.name);
      }
    }
  }

  return values;
}

/**
 * Sort data by various methods
 */
function sortData(
  data: ProcessedSeriesItem[],
  scaleType: ScaleType,
  xDomain?: Array<string | number | Date>
): typeof data {
  const sorted = [...data];

  if (scaleType === ScaleType.Time) {
    sorted.sort((a, b) => {
      const aTime = a.name instanceof Date ? a.name.getTime() : new Date(a.name as string).getTime();
      const bTime = b.name instanceof Date ? b.name.getTime() : new Date(b.name as string).getTime();
      return aTime - bTime;
    });
  } else if (scaleType === ScaleType.Linear) {
    sorted.sort((a, b) => Number(a.name) - Number(b.name));
  } else if (xDomain) {
    // Sort by domain order
    const domainIndex = new Map(xDomain.map((d, i) => [String(d), i]));
    sorted.sort((a, b) => {
      const aIdx = domainIndex.get(String(a.name)) ?? 0;
      const bIdx = domainIndex.get(String(b.name)) ?? 0;
      return aIdx - bIdx;
    });
  }

  return sorted;
}

/**
 * Custom hook for area chart state management
 */
export function useAreaChart(config: UseAreaChartConfig): UseAreaChartResult {
  const {
    data,
    width,
    height,
    showXAxis = false,
    showYAxis = false,
    showXAxisLabel = false,
    showYAxisLabel = false,
    showLegend = false,
    legendPosition = LegendPosition.Right,
    colorScheme,
    schemeType = ScaleType.Ordinal,
    customColors,
    autoScale = false,
    baseValue = 'auto',
    roundDomains = false,
    curve = curveLinear,
    xScaleMin,
    xScaleMax,
    yScaleMin,
    yScaleMax,
    stacked = false,
    normalized = false,
    timeline = false,
    xAxisHeight: initialXAxisHeight = 30, // Default height to avoid clipping on initial render
    yAxisWidth: initialYAxisWidth = 50, // Default width to avoid clipping on initial render
    margins: customMargins,
  } = config;

  // State for axis dimensions
  const [xAxisHeight, setXAxisHeight] = useState(initialXAxisHeight);
  const [yAxisWidth, setYAxisWidth] = useState(initialYAxisWidth);
  const [filteredDomain, setFilteredDomain] = useState<Array<string | number | Date> | null>(null);

  const margins: [number, number, number, number] = useMemo(
    () => customMargins ?? [10, 12, 10, 10],
    [customMargins]
  );
  const timelineHeight = 50;
  const timelinePadding = 10;

  // Calculate view dimensions
  const dims = useMemo(() => {
    const config: ViewDimensionsConfig = {
      width,
      height,
      margins,
      showXAxis,
      showYAxis,
      xAxisHeight,
      yAxisWidth,
      showXLabel: showXAxisLabel,
      showYLabel: showYAxisLabel,
      showLegend,
      legendType: schemeType,
      legendPosition,
    };

    const calculatedDims = calculateViewDimensions(config);

    // Adjust for timeline
    if (timeline) {
      calculatedDims.height -= timelineHeight + margins[2] + timelinePadding;
    }

    return calculatedDims;
  }, [
    width,
    height,
    margins,
    showXAxis,
    showYAxis,
    xAxisHeight,
    yAxisWidth,
    showXAxisLabel,
    showYAxisLabel,
    showLegend,
    schemeType,
    legendPosition,
    timeline,
  ]);

  // Get unique X values and detect scale type
  const { xValues, scaleType, xSet } = useMemo(() => {
    const values = getUniqueXDomainValues(data);
    const detectedType = detectScaleType(values);

    let processedValues: Array<string | number | Date>;
    let sortedSet: Array<string | number | Date>;

    if (detectedType === ScaleType.Linear) {
      processedValues = values.map((v) => Number(v));
      sortedSet = [...processedValues].sort((a, b) => (a as number) - (b as number));
    } else if (detectedType === ScaleType.Time) {
      sortedSet = [...values].sort((a, b) => {
        const aTime = a instanceof Date ? a.getTime() : new Date(a as string).getTime();
        const bTime = b instanceof Date ? b.getTime() : new Date(b as string).getTime();
        return aTime - bTime;
      });
      processedValues = sortedSet;
    } else {
      processedValues = values;
      sortedSet = values;
    }

    return {
      xValues: processedValues,
      scaleType: detectedType,
      xSet: sortedSet,
    };
  }, [data]);

  // Calculate X domain
  const xDomain = useMemo(() => {
    if (filteredDomain) {
      return filteredDomain;
    }

    if (scaleType === ScaleType.Time) {
      const times = xValues.map((v) =>
        v instanceof Date ? v.getTime() : new Date(v as string).getTime()
      );
      const min = xScaleMin
        ? (xScaleMin instanceof Date ? xScaleMin.getTime() : xScaleMin)
        : Math.min(...times);
      const max = xScaleMax
        ? (xScaleMax instanceof Date ? xScaleMax.getTime() : xScaleMax)
        : Math.max(...times);
      return [new Date(min), new Date(max)];
    }

    if (scaleType === ScaleType.Linear) {
      const nums = xValues.map((v) => Number(v));
      const min = xScaleMin !== undefined ? Number(xScaleMin) : Math.min(...nums);
      const max = xScaleMax !== undefined ? Number(xScaleMax) : Math.max(...nums);
      return [min, max];
    }

    return xValues;
  }, [xValues, scaleType, xScaleMin, xScaleMax, filteredDomain]);

  // Calculate Y domain
  const yDomain = useMemo((): [number, number] => {
    if (normalized) {
      return [0, 100];
    }

    if (stacked) {
      // Calculate stacked totals
      const totals: number[] = [];
      for (const xVal of xSet) {
        let sum = 0;
        for (const series of data) {
          const item = series.series.find((d) => String(d.name) === String(xVal));
          if (item) {
            sum += item.value;
          }
        }
        totals.push(sum);
      }

      const min = yScaleMin !== undefined ? yScaleMin : Math.min(0, ...totals);
      const max = yScaleMax !== undefined ? yScaleMax : Math.max(...totals);
      return [min, max];
    }

    // Standard area chart
    const allValues: number[] = [];
    for (const series of data) {
      for (const item of series.series) {
        allValues.push(item.value);
      }
    }

    if (!autoScale) {
      allValues.push(0);
    }

    if (baseValue !== 'auto' && typeof baseValue === 'number') {
      allValues.push(baseValue);
    }

    const min = yScaleMin !== undefined ? yScaleMin : Math.min(...allValues);
    const max = yScaleMax !== undefined ? yScaleMax : Math.max(...allValues);

    return [min, max];
  }, [data, xSet, autoScale, baseValue, yScaleMin, yScaleMax, stacked, normalized]);

  // Series domain (series names)
  const seriesDomain = useMemo(() => {
    return data.map((d) => String(d.name));
  }, [data]);

  // Create X scale
  const xScale = useMemo((): XScale => {
    let scale: XScale;

    if (scaleType === ScaleType.Time) {
      scale = scaleTime()
        .range([0, dims.width])
        .domain(xDomain as [Date, Date]);
    } else if (scaleType === ScaleType.Linear) {
      scale = scaleLinear()
        .range([0, dims.width])
        .domain(xDomain as [number, number]);
    } else {
      scale = scalePoint<string>()
        .range([0, dims.width])
        .domain(xDomain as string[])
        .padding(0.1);
    }

    if (roundDomains && 'nice' in scale) {
      return scale.nice() as XScale;
    }

    return scale;
  }, [scaleType, xDomain, dims.width, roundDomains]);

  // Create Y scale
  const yScale = useMemo((): YScale => {
    const scale = scaleLinear().range([dims.height, 0]).domain(yDomain);
    return roundDomains ? scale.nice() : scale;
  }, [yDomain, dims.height, roundDomains]);

  // Process data for stacking/normalization
  const processedData = useMemo((): ProcessedSeriesData[] => {
    if (!stacked && !normalized) {
      // For non-stacked charts, just convert data format
      return data.map((series) => ({
        name: series.name,
        series: series.series.map((item) => ({
          name: item.name,
          value: item.value,
          d0: 0,
          d1: item.value,
        })),
      }));
    }

    // Deep clone data for stacking
    const result: ProcessedSeriesData[] = data.map((series) => ({
      name: series.name,
      series: series.series.map((item) => ({
        name: item.name,
        value: item.value,
        d0: 0,
        d1: 0,
      })),
    }));

    // Calculate stacking values
    for (const xVal of xSet) {
      let d0 = 0;
      let total = 0;

      // Calculate total for normalization
      if (normalized) {
        for (const series of data) {
          const item = series.series.find((d) => String(d.name) === String(xVal));
          if (item) {
            total += item.value;
          }
        }
      }

      // Apply stacking
      for (const series of result) {
        let item = series.series.find((d) => String(d.name) === String(xVal));

        if (!item) {
          // Add missing point
          item = { name: xVal, value: 0, d0, d1: d0 };
          series.series.push(item);
        } else {
          item.d0 = d0;
          item.d1 = d0 + item.value;
          d0 += item.value;
        }

        // Normalize to percentage
        if (normalized && total > 0) {
          item.d0 = (item.d0 * 100) / total;
          item.d1 = (item.d1 * 100) / total;
        } else if (normalized) {
          item.d0 = 0;
          item.d1 = 0;
        }
      }
    }

    // Sort series data
    for (const series of result) {
      series.series = sortData(series.series, scaleType, xSet);
    }

    return result;
  }, [data, xSet, stacked, normalized, scaleType]);

  // Create color helper
  const colors = useMemo(() => {
    const domain = schemeType === ScaleType.Ordinal ? seriesDomain : (yDomain as number[]);

    return new ColorHelper({
      scheme: colorScheme,
      scaleType: schemeType,
      domain,
      customColors,
    });
  }, [colorScheme, schemeType, seriesDomain, yDomain, customColors]);

  // Transform for chart group
  const transform = useMemo(() => {
    return `translate(${dims.xOffset || 0}, ${margins[0]})`;
  }, [dims.xOffset, margins]);

  // Timeline scales
  const timelineScales = useMemo(() => {
    if (!timeline || scaleType === ScaleType.Ordinal) {
      return undefined;
    }

    // Timeline uses full domain (not filtered)
    const fullXDomain = (() => {
      if (scaleType === ScaleType.Time) {
        const times = xValues.map((v) =>
          v instanceof Date ? v.getTime() : new Date(v as string).getTime()
        );
        return [new Date(Math.min(...times)), new Date(Math.max(...times))];
      }
      if (scaleType === ScaleType.Linear) {
        const nums = xValues.map((v) => Number(v));
        return [Math.min(...nums), Math.max(...nums)];
      }
      return xValues;
    })();

    let timelineXScale: XScale;
    if (scaleType === ScaleType.Time) {
      timelineXScale = scaleTime()
        .range([0, dims.width])
        .domain(fullXDomain as [Date, Date]);
    } else {
      timelineXScale = scaleLinear()
        .range([0, dims.width])
        .domain(fullXDomain as [number, number]);
    }

    const timelineYScale = scaleLinear().range([timelineHeight, 0]).domain(yDomain);

    return {
      xScale: timelineXScale,
      yScale: timelineYScale,
      width: dims.width,
      height: timelineHeight,
      transform: `translate(${dims.xOffset || 0}, ${-margins[2]})`,
    };
  }, [timeline, scaleType, xValues, dims.width, dims.xOffset, yDomain, margins]);

  // Callbacks
  const updateXAxisHeight = useCallback((height: number) => {
    setXAxisHeight(height);
  }, []);

  const updateYAxisWidth = useCallback((width: number) => {
    setYAxisWidth(width);
  }, []);

  const updateFilteredDomain = useCallback((domain: Array<string | number | Date>) => {
    setFilteredDomain(domain);
  }, []);

  return {
    dims,
    xScale,
    yScale,
    xDomain,
    yDomain,
    xSet,
    seriesDomain,
    scaleType,
    colors,
    transform,
    processedData,
    timelineScales,
    curve,
    updateXAxisHeight,
    updateYAxisWidth,
    updateFilteredDomain,
  };
}
