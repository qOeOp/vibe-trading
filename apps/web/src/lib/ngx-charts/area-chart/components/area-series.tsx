/**
 * @fileoverview Area series component for generating area paths
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/area-chart/area-series.component.ts
 *
 * @description
 * Generates SVG area paths using D3 area generator.
 * Supports stacked and normalized modes.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo } from 'react';
import type { Area as D3Area, CurveFactory} from 'd3-shape';
import { area, curveLinear } from 'd3-shape';

import type { AreaChartSeries, Gradient} from '@/lib/ngx-charts/types';
import { ScaleType } from '@/lib/ngx-charts/types';
import type { ColorHelper } from '@/lib/ngx-charts/utils';
import { Area } from './area';

/** Data item interface matching area chart needs */
interface AreaDataItem {
  name: string | number | Date;
  value: number;
  d0?: number;
  d1?: number;
}

/** Extended scale types */
export interface XScaleWithDomain {
  (value: unknown): number;
  domain?: () => string[];
}

export interface YScaleWithRange {
  (value: number): number;
  range(): [number, number];
}

export interface AreaSeriesProps {
  /** Series data to render */
  data: AreaChartSeries;
  /** X scale function - must have domain method for ordinal sorting */
  xScale: XScaleWithDomain;
  /** Y scale function - must have range method for area base */
  yScale: YScaleWithRange;
  /** Base value for area fill (non-stacked) */
  baseValue?: number | 'auto';
  /** Color helper for fill colors */
  colors: ColorHelper;
  /** Scale type for data */
  scaleType: ScaleType;
  /** Whether this is a stacked chart */
  stacked?: boolean;
  /** Whether this is a normalized chart */
  normalized?: boolean;
  /** Whether to use gradient fill */
  gradient?: boolean;
  /** Curve factory function */
  curve?: CurveFactory;
  /** Active entries for highlighting */
  activeEntries?: Array<{ name: string }>;
  /** Whether animations are enabled */
  animated?: boolean;
  /** Click handler */
  onSelect?: (data: unknown) => void;
}

/**
 * Sorts data array based on scale type
 */
function sortData(
  data: AreaDataItem[],
  scaleType: ScaleType,
  xScale: XScaleWithDomain
): AreaDataItem[] {
  const sorted = [...data];

  if (scaleType === ScaleType.Linear) {
    sorted.sort((a, b) => Number(a.name) - Number(b.name));
  } else if (scaleType === ScaleType.Time) {
    sorted.sort((a, b) => {
      const aTime = a.name instanceof Date ? a.name.getTime() : new Date(a.name as string).getTime();
      const bTime = b.name instanceof Date ? b.name.getTime() : new Date(b.name as string).getTime();
      return aTime - bTime;
    });
  } else {
    // Ordinal - sort by domain order
    const domain = xScale.domain ? xScale.domain() : [];
    if (domain && domain.length > 0) {
      const domainIndex = new Map(domain.map((d, i) => [String(d), i]));
      sorted.sort((a, b) => {
        const aIdx = domainIndex.get(String(a.name)) ?? 0;
        const bIdx = domainIndex.get(String(b.name)) ?? 0;
        return aIdx - bIdx;
      });
    }
  }

  return sorted;
}

/**
 * Area series component
 *
 * Generates and renders area paths for a single series in an area chart.
 * Uses D3 area generator for path calculation.
 */
export function AreaSeries({
  data,
  xScale,
  yScale,
  baseValue = 'auto',
  colors,
  scaleType,
  stacked = false,
  normalized = false,
  gradient = false,
  curve = curveLinear,
  activeEntries,
  animated = true,
  onSelect,
}: AreaSeriesProps) {
  const { isActive, isInactive } = useMemo(() => {
    if (!activeEntries || activeEntries.length === 0) {
      return { isActive: false, isInactive: false };
    }

    const active = activeEntries.some((entry) => entry.name === data.name);
    return {
      isActive: active,
      isInactive: !active,
    };
  }, [activeEntries, data.name]);

  const { hasGradient, gradientStops } = useMemo(() => {
    if (colors.scaleType !== ScaleType.Linear) {
      return { hasGradient: false, gradientStops: undefined };
    }

    let stops: Gradient[];
    if (stacked || normalized) {
      const d0values = data.series.map((d) => d.d0 ?? 0);
      const d1values = data.series.map((d) => d.d1 ?? d.value);
      const max = Math.max(...d1values);
      const min = Math.min(...d0values);
      stops = colors.getLinearGradientStops(max, min);
    } else {
      const values = data.series.map((d) => d.value);
      const max = Math.max(...values);
      stops = colors.getLinearGradientStops(max);
    }

    return { hasGradient: true, gradientStops: stops };
  }, [colors, data.series, stacked, normalized]);

  const { path, startingPath } = useMemo(() => {
    const xProperty = (d: AreaDataItem): number => xScale(d.name);
    const sortedData = sortData(data.series as AreaDataItem[], scaleType, xScale);

    let currentArea: D3Area<AreaDataItem>;
    let startingArea: D3Area<AreaDataItem>;

    if (stacked || normalized) {
      // Stacked/normalized area uses d0/d1 values
      currentArea = area<AreaDataItem>()
        .x(xProperty)
        .y0((d) => yScale(d.d0 ?? 0))
        .y1((d) => yScale(d.d1 ?? d.value));

      startingArea = area<AreaDataItem>()
        .x(xProperty)
        .y0(() => yScale.range()[0])
        .y1(() => yScale.range()[0]);
    } else {
      // Standard area uses value directly
      const baseY = baseValue === 'auto' ? yScale.range()[0] : yScale(baseValue as number);

      currentArea = area<AreaDataItem>()
        .x(xProperty)
        .y0(() => baseY)
        .y1((d) => yScale(d.value));

      startingArea = area<AreaDataItem>()
        .x(xProperty)
        .y0(() => baseY)
        .y1(() => baseY);
    }

    // Apply curve
    currentArea.curve(curve);
    startingArea.curve(curve);

    return {
      path: currentArea(sortedData) || '',
      startingPath: startingArea(sortedData) || '',
    };
  }, [data.series, xScale, yScale, baseValue, stacked, normalized, curve, scaleType]);

  const fillColor = useMemo(() => colors.getColor(data.name), [colors, data.name]);

  return (
    <Area
      path={path}
      startingPath={startingPath}
      fill={fillColor}
      opacity={1}
      gradient={gradient || hasGradient}
      stops={gradientStops}
      animated={animated}
      isActive={isActive}
      isInactive={isInactive}
      data={data}
      onClick={onSelect}
    />
  );
}
