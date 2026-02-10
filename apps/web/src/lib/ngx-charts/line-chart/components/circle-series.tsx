/**
 * @fileoverview Circle series component for data point markers
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/circle-series.component.ts
 *
 * @description
 * Renders circles at each data point for hover interaction and visual markers.
 * Migrated from Angular ngx-charts library to React.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Series, DataItem, ScaleType } from '../../types';
import { ColorHelper } from '../../utils';
import { useChartTooltip } from '../../common/tooltip';
import { XScale, YScale } from '../hooks';

export interface CircleSeriesProps {
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
  /** Currently visible value (x value for vertical line hover) */
  visibleValue?: unknown;
  /** Active entries for highlighting */
  activeEntries?: Array<{ name: string }>;
  /** Whether tooltip is disabled */
  tooltipDisabled?: boolean;
  /** Custom tooltip template */
  tooltipTemplate?: (item: DataItem, series: Series) => ReactNode;
  /** Click handler */
  onSelect?: (event: { name: unknown; value: number; series: string }) => void;
  /** Activate handler */
  onActivate?: (event: { name: string; value?: number }) => void;
  /** Deactivate handler */
  onDeactivate?: (event: { name: string; value?: number }) => void;
  /** Circle radius */
  circleRadius?: number;
  /** Enable animations */
  animated?: boolean;
}

interface CircleData {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  opacity: number;
  data: DataItem;
  seriesName: string;
  classNames: string;
  tooltipLabel: string;
  tooltipText: string;
}

/**
 * Get tooltip text for a circle
 */
function getTooltipLabel(name: unknown): string {
  if (name instanceof Date) {
    return name.toLocaleDateString();
  }
  return String(name);
}

/**
 * Get tooltip text for value
 */
function getTooltipText(value: number, min?: number, max?: number): string {
  let text = value.toLocaleString();

  if (min !== undefined || max !== undefined) {
    text += ' (';
    if (min !== undefined) {
      if (max === undefined) {
        text += '\u2265'; // >=
      }
      text += min.toLocaleString();
      if (max !== undefined) {
        text += ' - ';
      }
    } else if (max !== undefined) {
      text += '\u2264'; // <=
    }
    if (max !== undefined) {
      text += max.toLocaleString();
    }
    text += ')';
  }

  return text;
}

/**
 * Circle series component
 *
 * Renders circles at data points that appear on hover.
 */
export function CircleSeries({
  data,
  xScale,
  yScale,
  colors,
  scaleType,
  visibleValue,
  activeEntries,
  tooltipDisabled = false,
  tooltipTemplate,
  onSelect,
  onActivate,
  onDeactivate,
  circleRadius = 3,
  animated = true,
}: CircleSeriesProps) {
  // Global tooltip context - like Angular's TooltipService with destroyAll()
  const { showTooltip, hideTooltip } = useChartTooltip();

  // Check if series is active or inactive
  const isActive = useCallback(
    (entry: { name: string }) => {
      if (!activeEntries || activeEntries.length === 0) return false;
      return activeEntries.some((d) => d.name === entry.name);
    },
    [activeEntries]
  );

  const isInactive = useCallback(
    (entry: { name: string }) => {
      if (!activeEntries || activeEntries.length === 0) return false;
      return !activeEntries.some((d) => d.name === entry.name);
    },
    [activeEntries]
  );

  // Calculate circle data
  const circles = useMemo((): CircleData[] => {
    return data.series.map((item) => {
      let cx: number;

      if (scaleType === ScaleType.Time) {
        const date = item.name instanceof Date ? item.name : new Date(item.name as string);
        cx = (xScale as (d: Date) => number)(date);
      } else if (scaleType === ScaleType.Linear) {
        cx = (xScale as (d: number) => number)(Number(item.name));
      } else {
        cx = (xScale as (d: string) => number | undefined)(String(item.name)) ?? 0;
      }

      const cy = yScale(item.value);

      let color: string;
      if (colors.scaleType === ScaleType.Linear) {
        color = colors.getColor(item.value);
      } else {
        color = colors.getColor(data.name);
      }

      // Determine visibility and opacity
      let opacity = 0;
      if (visibleValue !== undefined) {
        const isMatch =
          visibleValue instanceof Date
            ? item.name instanceof Date
              ? item.name.getTime() === visibleValue.getTime()
              : new Date(item.name as string).getTime() === visibleValue.getTime()
            : String(item.name) === String(visibleValue);

        if (isMatch) {
          opacity = 1;
        }
      }

      const seriesName = String(data.name);
      const active = isActive({ name: seriesName });
      const inactive = isInactive({ name: seriesName });

      const classNames = [
        'circle',
        active ? 'active' : '',
        inactive ? 'inactive' : '',
      ]
        .filter(Boolean)
        .join(' ');

      return {
        cx,
        cy,
        radius: circleRadius,
        color,
        opacity,
        data: item,
        seriesName,
        classNames,
        tooltipLabel: getTooltipLabel(item.name),
        tooltipText: getTooltipText(item.value, item.min, item.max),
      };
    });
  }, [data, xScale, yScale, colors, scaleType, visibleValue, isActive, isInactive, circleRadius]);

  // Event handlers
  const handleCircleClick = useCallback(
    (circle: CircleData) => {
      onSelect?.({
        name: circle.data.name,
        value: circle.data.value,
        series: circle.seriesName,
      });
    },
    [onSelect]
  );

  const handleCircleActivate = useCallback(
    (circle: CircleData, element: SVGCircleElement) => {
      if (!tooltipDisabled) {
        const content = tooltipTemplate
          ? tooltipTemplate(circle.data, data)
          : (
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: circle.color }}>{circle.seriesName}</span>
              <br />
              <span>{circle.tooltipLabel}</span>
              <br />
              <span>{circle.tooltipText}</span>
            </div>
          );
        showTooltip({
          content,
          host: element as unknown as HTMLElement,
          placement: 'top',
          type: 'tooltip',
          showCaret: true,
        });
      }
      onActivate?.({
        name: circle.seriesName,
        value: circle.data.value,
      });
    },
    [onActivate, data, tooltipDisabled, tooltipTemplate, showTooltip]
  );

  const handleCircleDeactivate = useCallback(
    (circle: CircleData) => {
      hideTooltip();
      onDeactivate?.({
        name: circle.seriesName,
        value: circle.data.value,
      });
    },
    [onDeactivate, hideTooltip]
  );

  return (
    <g className="circle-series">
      <AnimatePresence>
        {circles.map((circle, index) => (
          <motion.circle
            key={`${circle.seriesName}-${circle.data.name}-${index}`}
            className={circle.classNames}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.radius}
            fill={circle.color}
            stroke={circle.color}
            strokeWidth={2}
            initial={animated ? { opacity: 0, scale: 0 } : { opacity: circle.opacity }}
            animate={{
              opacity: circle.opacity,
              scale: circle.opacity > 0 ? 1 : 0,
            }}
            exit={animated ? { opacity: 0, scale: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              cursor: 'pointer',
              pointerEvents: circle.opacity > 0 ? 'auto' : 'none',
            }}
            onClick={() => handleCircleClick(circle)}
            onMouseEnter={(e) =>
              handleCircleActivate(circle, e.currentTarget as unknown as SVGCircleElement)
            }
            onMouseLeave={() => handleCircleDeactivate(circle)}
          />
        ))}
      </AnimatePresence>
    </g>
  );
}
