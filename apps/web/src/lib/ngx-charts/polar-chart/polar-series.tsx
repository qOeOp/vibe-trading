/**
 * @fileoverview PolarSeries component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/polar-chart/polar-series.component.ts
 *
 * @description
 * Series for polar/radar charts using radial line generator.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useId } from 'react';
import { lineRadial, curveCardinalClosed, type CurveFactory } from 'd3-shape';
import { Series, DataItem, ScaleType, StringOrNumberOrDate } from '../types';
import { ColorHelper, escapeLabel } from '../utils';
import { SvgRadialGradient, createRadialGradientStops } from '../common/gradients';

export interface PolarSeriesProps {
  data: Series;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- D3 scales have incompatible type signatures across scale types
  xScale: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- D3 scales have incompatible type signatures across scale types
  yScale: any;
  colors: ColorHelper;
  scaleType: ScaleType;
  curve?: CurveFactory;
  activeEntries?: { name: string | number | Date }[];
  rangeFillOpacity?: number;
  gradient?: boolean;
  animated?: boolean;
  tooltipDisabled?: boolean;
  circleRadius?: number;
  onSelect?: (data: unknown) => void;
  onActivate?: (data: unknown) => void;
  onDeactivate?: (data: unknown) => void;
}

interface PolarCircleData {
  series: StringOrNumberOrDate;
  value: number;
  name: StringOrNumberOrDate;
}

interface PolarCircle {
  color: string;
  cx: number;
  cy: number;
  data: PolarCircleData;
  label: string;
  value: number;
}

export function PolarSeries({
  data,
  xScale,
  yScale,
  colors,
  scaleType,
  curve = curveCardinalClosed,
  activeEntries = [],
  rangeFillOpacity = 0.15,
  gradient = false,
  tooltipDisabled = false,
  circleRadius = 3,
  onSelect,
  onActivate,
  onDeactivate,
}: PolarSeriesProps) {
  const seriesName = data.name;

  // Sort data based on scale type
  const sortedData = useMemo(() => {
    const series = [...(data.series || [])];
    if (scaleType === ScaleType.Linear) {
      return series.sort((a, b) => Number(a.name) - Number(b.name));
    } else if (scaleType === ScaleType.Time) {
      return series.sort((a, b) => new Date(a.name as string | number).getTime() - new Date(b.name as string | number).getTime());
    }
    // For ordinal, use domain order
    const domain = xScale.domain();
    return series.sort((a, b) => domain.indexOf(a.name) - domain.indexOf(b.name));
  }, [data.series, scaleType, xScale]);

  // Get angle from scale
  const getAngle = useCallback(
    (d: DataItem) => {
      const label = d.name;
      if (scaleType === ScaleType.Time) {
        return xScale(label);
      } else if (scaleType === ScaleType.Linear) {
        return xScale(Number(label));
      }
      return xScale(label);
    },
    [xScale, scaleType]
  );

  // Get radius from scale
  const getRadius = useCallback(
    (d: DataItem) => {
      return yScale(d.value);
    },
    [yScale]
  );

  // Gradient settings
  const hasGradient = gradient || colors.scaleType === ScaleType.Linear;
  const reactId = useId();
  const gradientId = `grad${reactId.replace(/:/g, '')}`;
  const gradientUrl = `url(#${gradientId})`;

  // Series color
  const seriesColor = useMemo(() => {
    const linearScaleType = colors.scaleType === ScaleType.Linear;
    const min = yScale.domain()[0];
    return colors.getColor(linearScaleType ? min : seriesName);
  }, [colors, yScale, seriesName]);

  // Gradient stops
  const gradientStops = useMemo(() => {
    if (!hasGradient) return undefined;
    if (colors.scaleType === ScaleType.Linear) {
      const values = sortedData.map((d) => d.value as number);
      const max = Math.max(...values);
      const min = Math.min(...values);
      return colors.getLinearGradientStops(max, min);
    }
    // Create default radial gradient stops from the series color
    return createRadialGradientStops(seriesColor, seriesColor, 0.25, 1);
  }, [hasGradient, colors, sortedData, seriesColor]);

  // Generate line path
  const path = useMemo(() => {
    const line = lineRadial<DataItem>()
      .angle((d) => getAngle(d))
      .radius((d) => getRadius(d))
      .curve(curve);

    return line(sortedData) || '';
  }, [sortedData, getAngle, getRadius, curve]);

  // Generate circles for data points
  const circles: PolarCircle[] = useMemo(() => {
    const linearScaleType = colors.scaleType === ScaleType.Linear;

    return sortedData.map((d) => {
      const a = getAngle(d);
      const r = getRadius(d);
      const value = d.value as number;
      const color = colors.getColor(linearScaleType ? Math.abs(value) : seriesName);

      return {
        data: { ...d, series: seriesName, value, name: d.name },
        cx: r * Math.sin(a),
        cy: -r * Math.cos(a),
        value,
        color,
        label: String(d.name),
      };
    });
  }, [sortedData, getAngle, getRadius, colors, seriesName]);

  // Active/inactive state
  const isActive = useMemo(() => {
    if (!activeEntries || activeEntries.length === 0) return false;
    return activeEntries.some((entry) => entry.name === data.name);
  }, [activeEntries, data.name]);

  const isInactive = useMemo(() => {
    if (!activeEntries || activeEntries.length === 0) return false;
    return !activeEntries.some((entry) => entry.name === data.name);
  }, [activeEntries, data.name]);

  // Tooltip text generator
  const tooltipText = useCallback(
    (circle: PolarCircle) => {
      return `
        <span class="tooltip-label">${escapeLabel(String(data.name))} • ${escapeLabel(circle.label)}</span>
        <span class="tooltip-val">${circle.value.toLocaleString()}</span>
      `;
    },
    [data.name]
  );

  // Event handlers
  const handleCircleClick = useCallback(
    (circle: PolarCircle) => {
      onSelect?.(circle.data);
    },
    [onSelect]
  );

  const handleCircleEnter = useCallback(
    (circle: PolarCircle) => {
      onActivate?.({ name: circle.data.series });
    },
    [onActivate]
  );

  const handleCircleLeave = useCallback(
    (circle: PolarCircle) => {
      onDeactivate?.({ name: circle.data.series });
    },
    [onDeactivate]
  );

  return (
    <g className="polar-charts-series">
      {hasGradient && gradientStops && (
        <defs>
          <SvgRadialGradient
            id={gradientId}
            stops={gradientStops}
          />
        </defs>
      )}

      {/* Series path */}
      <path
        className={`polar-series-path ${isActive ? 'active' : ''} ${isInactive ? 'inactive' : ''}`}
        d={path}
        stroke={hasGradient ? gradientUrl : seriesColor}
        fill={hasGradient ? gradientUrl : seriesColor}
        fillOpacity={rangeFillOpacity}
        strokeWidth={2}
        style={{ opacity: isInactive ? 0.2 : 1 }}
      />

      {/* Data point circles */}
      {circles.map((circle, index) => (
        <circle
          key={`circle-${index}-${circle.label}`}
          className="circle"
          cx={circle.cx}
          cy={circle.cy}
          r={circleRadius}
          fill={circle.color}
          style={{ opacity: isInactive ? 0.2 : 1, cursor: 'pointer' }}
          onClick={() => handleCircleClick(circle)}
          onMouseEnter={() => handleCircleEnter(circle)}
          onMouseLeave={() => handleCircleLeave(circle)}
        >
          {!tooltipDisabled && <title dangerouslySetInnerHTML={{ __html: tooltipText(circle) }} />}
        </circle>
      ))}
    </g>
  );
}
