/**
 * @fileoverview Line series component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/line-chart/line-series.component.ts
 *
 * @description
 * Line series component that renders a line with optional area fill,
 * gradients, and range area. Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useId } from 'react';
import type { CurveFactory} from 'd3-shape';
import { line, area, curveLinear } from 'd3-shape';

import type { Series, DataItem, Gradient } from '@/lib/ngx-charts/types';
import { ScaleType } from '@/lib/ngx-charts/types';
import type { ColorHelper } from '@/lib/ngx-charts/utils';
import { SvgLinearGradient } from '@/lib/ngx-charts/common';
import { Line } from './line';
import type { XScale, YScale } from '../hooks/use-line-chart';
import { sortLineData } from '../hooks/use-line-chart';

export interface LineSeriesProps {
  /** Series data */
  data: Series;
  /** X scale function */
  xScale: XScale;
  /** Y scale function */
  yScale: YScale;
  /** Color helper instance */
  colors: ColorHelper;
  /** Scale type for data */
  scaleType: ScaleType;
  /** D3 curve factory (default: curveLinear) */
  curve?: CurveFactory;
  /** Active entries for highlighting */
  activeEntries?: Array<{ name: string }>;
  /** Range fill opacity */
  rangeFillOpacity?: number;
  /** Whether data has min/max range */
  hasRange?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Custom class name */
  className?: string;
}

/**
 * Calculate X value from scale
 */
function getXValue(d: DataItem, scaleType: ScaleType, xScale: XScale): number {
  const label = d.name;
  let value: number;

  if (scaleType === ScaleType.Time) {
    const date = label instanceof Date ? label : new Date(label as string);
    value = (xScale as (d: Date) => number)(date);
  } else if (scaleType === ScaleType.Linear) {
    value = (xScale as (d: number) => number)(Number(label));
  } else {
    value = (xScale as (d: string) => number | undefined)(String(label)) ?? 0;
  }

  return value;
}

/**
 * Line series component
 *
 * Renders a line series with optional gradient, area highlight,
 * and range area for min/max values.
 */
export function LineSeries({
  data,
  xScale,
  yScale,
  colors,
  scaleType,
  curve = curveLinear,
  activeEntries,
  rangeFillOpacity = 0.15,
  hasRange = false,
  animated = true,
  animationDuration = 750,
  className = '',
}: LineSeriesProps) {
  const stableGradientId = `grad${useId().replace(/:/g, '')}`;

  const isActive = useMemo(() => {
    if (!activeEntries || activeEntries.length === 0) return false;
    return activeEntries.some((entry) => entry.name === data.name);
  }, [activeEntries, data.name]);

  const isInactive = useMemo(() => {
    if (!activeEntries || activeEntries.length === 0) return false;
    return !activeEntries.some((entry) => entry.name === data.name);
  }, [activeEntries, data.name]);

  const { hasGradient, gradientUrl, gradientStops, stroke } =
    useMemo(() => {
      const hasGrad = colors.scaleType === ScaleType.Linear;
      const gradUrl = `url(#${stableGradientId})`;

      let gradientStops: Gradient[] | undefined;
      let areaGradientStops: Gradient[] | undefined;
      let strokeColor: string;

      if (hasGrad) {
        const values = data.series.map((d) => d.value);
        const max = Math.max(...values);
        const min = Math.min(...values);
        gradientStops = colors.getLinearGradientStops(max, min);
        areaGradientStops = colors.getLinearGradientStops(max);

        if (max === min) {
          strokeColor = colors.getColor(max);
        } else {
          strokeColor = gradUrl;
        }
      } else {
        strokeColor = colors.getColor(data.name);
      }

      return {
        hasGradient: hasGrad,
        gradientUrl: gradUrl,
        gradientStops,
        areaGradientStops,
        stroke: strokeColor,
      };
    }, [colors, data.name, data.series, stableGradientId]);

  const { linePath, areaPath, rangePath } = useMemo(() => {
    const sortedData = sortLineData(data.series, scaleType, xScale);

    const lineGen = line<DataItem>()
      .x((d) => getXValue(d, scaleType, xScale))
      .y((d) => yScale(d.value))
      .curve(curve);

    const areaGen = area<DataItem>()
      .x((d) => getXValue(d, scaleType, xScale))
      .y0(() => yScale.range()[0])
      .y1((d) => yScale(d.value))
      .curve(curve);

    const linePath = lineGen(sortedData) || '';
    const areaPath = areaGen(sortedData) || '';

    let rangePath = '';
    if (hasRange) {
      const rangeGen = area<DataItem>()
        .x((d) => getXValue(d, scaleType, xScale))
        .y0((d) => yScale(typeof d.min === 'number' ? d.min : d.value))
        .y1((d) => yScale(typeof d.max === 'number' ? d.max : d.value))
        .curve(curve);

      rangePath = rangeGen(sortedData) || '';
    }

    return { linePath, areaPath, rangePath };
  }, [data.series, scaleType, xScale, yScale, curve, hasRange]);

  const fillColor = hasGradient ? gradientUrl : colors.getColor(data.name);

  const seriesClassName = [
    'line-series',
    className,
    isActive ? 'active' : '',
    isInactive ? 'inactive' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <g className={seriesClassName}>
      {hasGradient && gradientStops && (
        <defs>
          <SvgLinearGradient
            id={stableGradientId}
            stops={gradientStops}
            orientation="vertical"
          />
        </defs>
      )}

      <path
        className="line-highlight"
        d={areaPath}
        fill={fillColor}
        opacity={isInactive ? 0.05 : 0.25}
        style={{
          transition: 'opacity 250ms ease-in-out',
        }}
      />

      <Line
        path={linePath}
        stroke={stroke}
        animated={animated}
        animationDuration={animationDuration}
        className={isActive ? 'active' : isInactive ? 'inactive' : ''}
      />

      {hasRange && rangePath && (
        <path
          className="line-series-range"
          d={rangePath}
          fill={fillColor}
          opacity={isInactive ? rangeFillOpacity * 0.2 : rangeFillOpacity}
          style={{
            transition: 'opacity 250ms ease-in-out',
          }}
        />
      )}
    </g>
  );
}
