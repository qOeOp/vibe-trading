'use client';

/**
 * @fileoverview Bar chart scale hooks
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/bar-vertical.component.ts
 *
 * @description
 * React hooks for creating D3 scales for bar charts.
 * Supports band scales for categories and linear scales for values.
 *
 * @license MIT
 */

import { useMemo } from 'react';
import { scaleBand, scaleLinear, type ScaleBand, type ScaleLinear } from 'd3-scale';
import type { DataItem, StringOrNumberOrDate, Series } from '../../types';

export interface UseBarScalesConfig {
  /** Chart data (single series) */
  data?: DataItem[];
  /** Multi-series data */
  multiData?: Series[];
  /** Chart width */
  width: number;
  /** Chart height */
  height: number;
  /** Bar padding (ratio 0-1 or pixel value) */
  barPadding?: number;
  /** Group padding for grouped charts */
  groupPadding?: number;
  /** Whether to round domain values */
  roundDomains?: boolean;
  /** Custom y-axis min value */
  yScaleMin?: number;
  /** Custom y-axis max value */
  yScaleMax?: number;
  /** Custom x-axis min value (for horizontal) */
  xScaleMin?: number;
  /** Custom x-axis max value (for horizontal) */
  xScaleMax?: number;
  /** Custom y-axis ticks */
  yAxisTicks?: number[];
  /** Custom x-axis ticks */
  xAxisTicks?: number[];
}

export interface UseBarScalesResult {
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  xDomain: string[];
  yDomain: [number, number];
}

export interface UseHorizontalBarScalesResult {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleBand<string>;
  xDomain: [number, number];
  yDomain: string[];
}

export interface UseGroupedBarScalesResult {
  groupScale: ScaleBand<string>;
  innerScale: ScaleBand<string>;
  valueScale: ScaleLinear<number, number>;
  groupDomain: string[];
  innerDomain: string[];
  valueDomain: [number, number];
}

/**
 * Hook for creating vertical bar chart scales
 */
export function useVerticalBarScales(config: UseBarScalesConfig): UseBarScalesResult {
  const {
    data = [],
    width,
    height,
    barPadding = 8,
    roundDomains = false,
    yScaleMin,
    yScaleMax,
    yAxisTicks,
  } = config;

  return useMemo(() => {
    // X domain - category labels
    const xDomain = data.map((d) => String(d.label ?? d.name));

    // Y domain - value range
    const values = data.map((d) => d.value);
    let min = yScaleMin !== undefined ? Math.min(yScaleMin, ...values) : Math.min(0, ...values);
    let max = yScaleMax !== undefined ? Math.max(yScaleMax, ...values) : Math.max(0, ...values);

    if (yAxisTicks && !yAxisTicks.some(isNaN)) {
      min = Math.min(min, ...yAxisTicks);
      max = Math.max(max, ...yAxisTicks);
    }

    const yDomain: [number, number] = [min, max];

    // X scale - band scale for categories
    const spacing = xDomain.length / (width / barPadding + 1);
    const xScale = scaleBand<string>()
      .range([0, width])
      .paddingInner(spacing)
      .domain(xDomain);

    // Y scale - linear scale for values
    let yScale = scaleLinear<number>().range([height, 0]).domain(yDomain);

    if (roundDomains) {
      yScale = yScale.nice();
    }

    return { xScale, yScale, xDomain, yDomain };
  }, [data, width, height, barPadding, roundDomains, yScaleMin, yScaleMax, yAxisTicks]);
}

/**
 * Hook for creating horizontal bar chart scales
 */
export function useHorizontalBarScales(config: UseBarScalesConfig): UseHorizontalBarScalesResult {
  const {
    data = [],
    width,
    height,
    barPadding = 8,
    roundDomains = false,
    xScaleMin,
    xScaleMax,
  } = config;

  return useMemo(() => {
    // Y domain - category labels
    const yDomain = data.map((d) => String(d.label ?? d.name));

    // X domain - value range
    const values = data.map((d) => d.value);
    const min = xScaleMin !== undefined ? Math.min(xScaleMin, ...values) : Math.min(0, ...values);
    const max = xScaleMax !== undefined ? Math.max(xScaleMax, ...values) : Math.max(0, ...values);
    const xDomain: [number, number] = [min, max];

    // Y scale - band scale for categories
    const spacing = yDomain.length / (height / barPadding + 1);
    const yScale = scaleBand<string>()
      .rangeRound([0, height])
      .paddingInner(spacing)
      .domain(yDomain);

    // X scale - linear scale for values
    let xScale = scaleLinear<number>().range([0, width]).domain(xDomain);

    if (roundDomains) {
      xScale = xScale.nice();
    }

    return { xScale, yScale, xDomain, yDomain };
  }, [data, width, height, barPadding, roundDomains, xScaleMin, xScaleMax]);
}

/**
 * Hook for creating grouped/2D bar chart scales
 */
export function useGroupedBarScales(
  config: UseBarScalesConfig & { orientation?: 'vertical' | 'horizontal' }
): UseGroupedBarScalesResult {
  const {
    multiData = [],
    width,
    height,
    barPadding = 8,
    groupPadding = 16,
    roundDomains = false,
    yScaleMax,
    xScaleMax,
    orientation = 'vertical',
  } = config;

  return useMemo(() => {
    // Group domain - outer categories
    const groupDomain: string[] = [];
    for (const group of multiData) {
      const label = String(group.name);
      if (!groupDomain.includes(label)) {
        groupDomain.push(label);
      }
    }

    // Inner domain - series within each group
    const innerDomain: string[] = [];
    for (const group of multiData) {
      for (const d of group.series) {
        const label = String(d.label ?? d.name);
        if (!innerDomain.includes(label)) {
          innerDomain.push(label);
        }
      }
    }

    // Value domain
    const values: number[] = [];
    for (const group of multiData) {
      for (const d of group.series) {
        if (!values.includes(d.value)) {
          values.push(d.value);
        }
      }
    }

    const min = Math.min(0, ...values);
    const scaleMax = orientation === 'vertical' ? yScaleMax : xScaleMax;
    const max = scaleMax !== undefined ? Math.max(scaleMax, ...values) : Math.max(0, ...values);
    const valueDomain: [number, number] = [min, max];

    if (orientation === 'vertical') {
      // Vertical grouped: groups along x-axis, values along y-axis
      const spacing = groupDomain.length / (height / groupPadding + 1);
      const groupScale = scaleBand<string>()
        .rangeRound([0, width])
        .paddingInner(spacing)
        .paddingOuter(spacing / 2)
        .domain(groupDomain);

      const groupWidth = groupScale.bandwidth();
      const innerSpacing = innerDomain.length / (groupWidth / barPadding + 1);
      const innerScale = scaleBand<string>()
        .rangeRound([0, groupWidth])
        .paddingInner(innerSpacing)
        .domain(innerDomain);

      let valueScale = scaleLinear<number>().range([height, 0]).domain(valueDomain);
      if (roundDomains) {
        valueScale = valueScale.nice();
      }

      return { groupScale, innerScale, valueScale, groupDomain, innerDomain, valueDomain };
    } else {
      // Horizontal grouped: groups along y-axis, values along x-axis
      const spacing = groupDomain.length / (height / groupPadding + 1);
      const groupScale = scaleBand<string>()
        .rangeRound([0, height])
        .paddingInner(spacing)
        .paddingOuter(spacing / 2)
        .domain(groupDomain);

      const groupHeight = groupScale.bandwidth();
      const innerSpacing = innerDomain.length / (groupHeight / barPadding + 1);
      const innerScale = scaleBand<string>()
        .rangeRound([0, groupHeight])
        .paddingInner(innerSpacing)
        .domain(innerDomain);

      let valueScale = scaleLinear<number>().range([0, width]).domain(valueDomain);
      if (roundDomains) {
        valueScale = valueScale.nice();
      }

      return { groupScale, innerScale, valueScale, groupDomain, innerDomain, valueDomain };
    }
  }, [multiData, width, height, barPadding, groupPadding, roundDomains, yScaleMax, xScaleMax, orientation]);
}

/**
 * Hook for creating stacked bar chart scales
 */
export function useStackedBarScales(
  config: UseBarScalesConfig & { orientation?: 'vertical' | 'horizontal' }
): UseGroupedBarScalesResult {
  const {
    multiData = [],
    width,
    height,
    barPadding = 8,
    roundDomains = false,
    yScaleMax,
    xScaleMax,
    orientation = 'vertical',
  } = config;

  return useMemo(() => {
    // Group domain - outer categories
    const groupDomain: string[] = [];
    for (const group of multiData) {
      const label = String(group.name);
      if (!groupDomain.includes(label)) {
        groupDomain.push(label);
      }
    }

    // Inner domain - series within each group
    const innerDomain: string[] = [];
    for (const group of multiData) {
      for (const d of group.series) {
        const label = String(d.label ?? d.name);
        if (!innerDomain.includes(label)) {
          innerDomain.push(label);
        }
      }
    }

    // Value domain - sum of stacked values
    const domain: number[] = [];
    let smallest = 0;
    let biggest = 0;

    for (const group of multiData) {
      let smallestSum = 0;
      let biggestSum = 0;
      for (const d of group.series) {
        if (d.value < 0) {
          smallestSum += d.value;
        } else {
          biggestSum += d.value;
        }
        smallest = d.value < smallest ? d.value : smallest;
        biggest = d.value > biggest ? d.value : biggest;
      }
      domain.push(smallestSum);
      domain.push(biggestSum);
    }
    domain.push(smallest);
    domain.push(biggest);

    const min = Math.min(0, ...domain);
    const scaleMax = orientation === 'vertical' ? yScaleMax : xScaleMax;
    const max = scaleMax !== undefined ? Math.max(scaleMax, ...domain) : Math.max(...domain);
    const valueDomain: [number, number] = [min, max];

    if (orientation === 'vertical') {
      const spacing = groupDomain.length / (width / barPadding + 1);
      const groupScale = scaleBand<string>()
        .rangeRound([0, width])
        .paddingInner(spacing)
        .domain(groupDomain);

      const innerScale = scaleBand<string>()
        .rangeRound([0, groupScale.bandwidth()])
        .domain(innerDomain);

      let valueScale = scaleLinear<number>().range([height, 0]).domain(valueDomain);
      if (roundDomains) {
        valueScale = valueScale.nice();
      }

      return { groupScale, innerScale, valueScale, groupDomain, innerDomain, valueDomain };
    } else {
      const spacing = groupDomain.length / (height / barPadding + 1);
      const groupScale = scaleBand<string>()
        .rangeRound([0, height])
        .paddingInner(spacing)
        .domain(groupDomain);

      const innerScale = scaleBand<string>()
        .rangeRound([0, groupScale.bandwidth()])
        .domain(innerDomain);

      let valueScale = scaleLinear<number>().range([0, width]).domain(valueDomain);
      if (roundDomains) {
        valueScale = valueScale.nice();
      }

      return { groupScale, innerScale, valueScale, groupDomain, innerDomain, valueDomain };
    }
  }, [multiData, width, height, barPadding, roundDomains, yScaleMax, xScaleMax, orientation]);
}

/**
 * Hook for creating normalized bar chart scales
 */
export function useNormalizedBarScales(
  config: UseBarScalesConfig & { orientation?: 'vertical' | 'horizontal' }
): UseGroupedBarScalesResult {
  const {
    multiData = [],
    width,
    height,
    barPadding = 8,
    roundDomains = false,
    orientation = 'vertical',
  } = config;

  return useMemo(() => {
    // Group domain - outer categories
    const groupDomain: string[] = [];
    for (const group of multiData) {
      const label = String(group.name);
      if (!groupDomain.includes(label)) {
        groupDomain.push(label);
      }
    }

    // Inner domain - series within each group
    const innerDomain: string[] = [];
    for (const group of multiData) {
      for (const d of group.series) {
        const label = String(d.label ?? d.name);
        if (!innerDomain.includes(label)) {
          innerDomain.push(label);
        }
      }
    }

    // Normalized value domain is always 0-100
    const valueDomain: [number, number] = [0, 100];

    if (orientation === 'vertical') {
      const spacing = groupDomain.length / (width / barPadding + 1);
      const groupScale = scaleBand<string>()
        .rangeRound([0, width])
        .paddingInner(spacing)
        .domain(groupDomain);

      const innerScale = scaleBand<string>()
        .rangeRound([0, groupScale.bandwidth()])
        .domain(innerDomain);

      let valueScale = scaleLinear<number>().range([height, 0]).domain(valueDomain);
      if (roundDomains) {
        valueScale = valueScale.nice();
      }

      return { groupScale, innerScale, valueScale, groupDomain, innerDomain, valueDomain };
    } else {
      const spacing = groupDomain.length / (height / barPadding + 1);
      const groupScale = scaleBand<string>()
        .rangeRound([0, height])
        .paddingInner(spacing)
        .domain(groupDomain);

      const innerScale = scaleBand<string>()
        .rangeRound([0, groupScale.bandwidth()])
        .domain(innerDomain);

      let valueScale = scaleLinear<number>().range([0, width]).domain(valueDomain);
      if (roundDomains) {
        valueScale = valueScale.nice();
      }

      return { groupScale, innerScale, valueScale, groupDomain, innerDomain, valueDomain };
    }
  }, [multiData, width, height, barPadding, roundDomains, orientation]);
}
