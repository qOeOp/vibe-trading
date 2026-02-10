'use client';

/**
 * @fileoverview Bar chart state management hook
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/bar-vertical.component.ts
 *
 * @description
 * React hook for managing bar chart state including active entries,
 * dimensions, and event handlers.
 *
 * @license MIT
 */

import { useState, useCallback, useMemo } from 'react';
import type { DataItem, Series, LegendPosition, ScaleType } from '../../types';
import {
  ColorHelper,
  type ColorHelperConfig,
  calculateViewDimensions,
  type ViewDimensionsConfig,
} from '../../utils';

export interface UseBarChartConfig {
  /** Chart data */
  data: DataItem[] | Series[];
  /** Container width */
  width: number;
  /** Container height */
  height: number;
  /** Color scheme name */
  colorScheme?: string;
  /** Scale type */
  scaleType?: ScaleType;
  /** Custom colors */
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Show legend */
  showLegend?: boolean;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Show X axis */
  showXAxis?: boolean;
  /** Show Y axis */
  showYAxis?: boolean;
  /** Show X axis label */
  showXAxisLabel?: boolean;
  /** Show Y axis label */
  showYAxisLabel?: boolean;
  /** Initial active entries */
  activeEntries?: DataItem[];
  /** Margin configuration */
  margin?: [number, number, number, number];
  /** X axis height (after measurement) */
  xAxisHeight?: number;
  /** Y axis width (after measurement) */
  yAxisWidth?: number;
  /** Data label max height */
  dataLabelMaxHeight?: { positive: number; negative: number };
  /** Data label max width */
  dataLabelMaxWidth?: { positive: number; negative: number };
}

export interface UseBarChartResult {
  /** View dimensions */
  dims: { width: number; height: number; xOffset?: number };
  /** Color helper instance */
  colors: ColorHelper;
  /** Transform string for chart positioning */
  transform: string;
  /** Currently active entries */
  activeEntries: DataItem[];
  /** X axis height */
  xAxisHeight: number;
  /** Y axis width */
  yAxisWidth: number;
  /** Set active entries */
  setActiveEntries: (entries: DataItem[]) => void;
  /** Handle item activation */
  handleActivate: (item: DataItem, fromLegend?: boolean) => void;
  /** Handle item deactivation */
  handleDeactivate: (item: DataItem, fromLegend?: boolean) => void;
  /** Update X axis height */
  updateXAxisHeight: (height: number) => void;
  /** Update Y axis width */
  updateYAxisWidth: (width: number) => void;
  /** Get X domain */
  xDomain: string[];
  /** Get Y domain */
  yDomain: number[];
}

/**
 * Hook for managing bar chart state and calculations
 */
export function useBarChart(config: UseBarChartConfig): UseBarChartResult {
  const {
    data,
    width,
    height,
    colorScheme = 'vivid',
    scaleType = 'ordinal' as ScaleType,
    customColors,
    showLegend = false,
    legendPosition = 'right' as LegendPosition,
    showXAxis = false,
    showYAxis = false,
    showXAxisLabel = false,
    showYAxisLabel = false,
    activeEntries: initialActiveEntries = [],
    margin: initialMargin = [10, 20, 10, 20],
    xAxisHeight: initialXAxisHeight = 0,
    yAxisWidth: initialYAxisWidth = 0,
    dataLabelMaxHeight = { positive: 0, negative: 0 },
    dataLabelMaxWidth = { positive: 0, negative: 0 },
  } = config;

  const [activeEntries, setActiveEntries] = useState<DataItem[]>(initialActiveEntries);
  const [xAxisHeight, setXAxisHeight] = useState(initialXAxisHeight);
  const [yAxisWidth, setYAxisWidth] = useState(initialYAxisWidth);

  // Calculate margin with data label offsets
  const margin = useMemo(() => {
    return [
      initialMargin[0] + dataLabelMaxHeight.positive,
      initialMargin[1] + dataLabelMaxWidth.positive,
      initialMargin[2] + dataLabelMaxHeight.negative,
      initialMargin[3] + dataLabelMaxWidth.negative,
    ] as [number, number, number, number];
  }, [initialMargin, dataLabelMaxHeight, dataLabelMaxWidth]);

  // Calculate view dimensions
  const dims = useMemo(() => {
    const viewConfig: ViewDimensionsConfig = {
      width,
      height,
      margins: margin,
      showXAxis,
      showYAxis,
      xAxisHeight,
      yAxisWidth,
      showXLabel: showXAxisLabel,
      showYLabel: showYAxisLabel,
      showLegend,
      legendType: scaleType,
      legendPosition,
    };
    return calculateViewDimensions(viewConfig);
  }, [width, height, margin, showXAxis, showYAxis, xAxisHeight, yAxisWidth, showXAxisLabel, showYAxisLabel, showLegend, scaleType, legendPosition]);

  // Calculate domains
  const { xDomain, yDomain } = useMemo(() => {
    // Check if data is multi-series
    const isMultiSeries = data.length > 0 && 'series' in data[0];

    if (isMultiSeries) {
      const multiData = data as Series[];
      const xDomain = multiData.map((d) => String(d.name));
      const allValues: number[] = [];
      for (const group of multiData) {
        for (const item of group.series) {
          allValues.push(item.value);
        }
      }
      const yDomain = [Math.min(0, ...allValues), Math.max(0, ...allValues)];
      return { xDomain, yDomain };
    } else {
      const singleData = data as DataItem[];
      const xDomain = singleData.map((d) => String(d.label ?? d.name));
      const values = singleData.map((d) => d.value);
      const yDomain = [Math.min(0, ...values), Math.max(0, ...values)];
      return { xDomain, yDomain };
    }
  }, [data]);

  // Create color helper
  const colors = useMemo(() => {
    const domain = scaleType === 'ordinal' ? xDomain : yDomain;
    const colorConfig: ColorHelperConfig = {
      scheme: colorScheme,
      scaleType: scaleType as ScaleType,
      domain: domain as string[] | number[],
      customColors,
    };
    return new ColorHelper(colorConfig);
  }, [colorScheme, scaleType, xDomain, yDomain, customColors]);

  // Calculate transform
  const transform = useMemo(() => {
    const xOffset = dims.xOffset ?? 0;
    const yOffset = margin[0] + dataLabelMaxHeight.negative;
    return `translate(${xOffset}, ${yOffset})`;
  }, [dims.xOffset, margin, dataLabelMaxHeight.negative]);

  // Handle activation
  const handleActivate = useCallback((item: DataItem, fromLegend = false) => {
    const isMultiSeries = data.length > 0 && 'series' in data[0];

    if (isMultiSeries) {
      const multiData = data as Series[];
      const items = multiData
        .flatMap((g) => g.series)
        .filter((i) => {
          if (fromLegend) {
            return String(i.label ?? i.name) === String(item.name);
          }
          return String(i.name) === String(item.name);
        });
      setActiveEntries([...items]);
    } else {
      const singleData = data as DataItem[];
      const foundItem = singleData.find((d) => {
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
          setActiveEntries([foundItem, ...activeEntries]);
        }
      }
    }
  }, [data, activeEntries]);

  // Handle deactivation
  const handleDeactivate = useCallback((item: DataItem, fromLegend = false) => {
    const isMultiSeries = data.length > 0 && 'series' in data[0];

    if (isMultiSeries) {
      setActiveEntries(activeEntries.filter((i) => {
        if (fromLegend) {
          return String(i.label ?? i.name) !== String(item.name);
        }
        return !(String(i.name) === String(item.name));
      }));
    } else {
      const singleData = data as DataItem[];
      const foundItem = singleData.find((d) => {
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
        }
      }
    }
  }, [data, activeEntries]);

  const updateXAxisHeight = useCallback((newHeight: number) => {
    setXAxisHeight(newHeight);
  }, []);

  const updateYAxisWidth = useCallback((newWidth: number) => {
    setYAxisWidth(newWidth);
  }, []);

  return {
    dims,
    colors,
    transform,
    activeEntries,
    xAxisHeight,
    yAxisWidth,
    setActiveEntries,
    handleActivate,
    handleDeactivate,
    updateXAxisHeight,
    updateYAxisWidth,
    xDomain,
    yDomain,
  };
}

// formatLabel and escapeLabel are available from '../../utils/label-helper'
// Import them from there instead of re-exporting to avoid conflicts
