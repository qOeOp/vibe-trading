/**
 * @fileoverview Bubble series component for bubble chart
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bubble-chart/bubble-series.component.ts
 *
 * @description
 * Renders bubble circles for a single series in the bubble chart.
 * Each bubble has x, y position and radius determined by data values.
 * Migrated from Angular ngx-charts library to React with Framer Motion.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScaleLinear, ScalePoint, ScaleTime } from 'd3-scale';

import {
  BubbleChartSeries,
  BubbleChartDataItem,
  ScaleType,
  StringOrNumberOrDate,
} from '../types';
import { ColorHelper, formatLabel, escapeLabel } from '../utils';
import { useChartTooltip } from '../common/tooltip';

/** Type for X/Y scales used in bubble chart */
export type BubbleScale =
  | ScaleLinear<number, number>
  | ScalePoint<string>
  | ScaleTime<number, number>;

export interface BubbleSeriesProps {
  /** Series data containing bubbles */
  data: BubbleChartSeries;
  /** X scale function */
  xScale: BubbleScale;
  /** Y scale function */
  yScale: BubbleScale;
  /** Radius scale function */
  rScale: ScaleLinear<number, number>;
  /** X scale type */
  xScaleType: ScaleType;
  /** Y scale type */
  yScaleType: ScaleType;
  /** Color helper instance */
  colors: ColorHelper;
  /** X axis label for tooltip */
  xAxisLabel?: string;
  /** Y axis label for tooltip */
  yAxisLabel?: string;
  /** Active entries for highlighting */
  activeEntries?: Array<{ name: string }>;
  /** Whether tooltip is disabled */
  tooltipDisabled?: boolean;
  /** Custom tooltip template */
  tooltipTemplate?: (item: BubbleChartDataItem, series: BubbleChartSeries) => ReactNode;
  /** Click handler */
  onSelect?: (data: BubbleChartDataItem) => void;
  /** Activate handler */
  onActivate?: (event: { name: StringOrNumberOrDate }) => void;
  /** Deactivate handler */
  onDeactivate?: (event: { name: StringOrNumberOrDate }) => void;
  /** Enable animations */
  animated?: boolean;
}

interface BubbleCircle {
  data: BubbleChartDataItem & { series: StringOrNumberOrDate };
  x: StringOrNumberOrDate;
  y: StringOrNumberOrDate;
  r: number;
  classNames: string[];
  value: StringOrNumberOrDate;
  label: StringOrNumberOrDate;
  cx: number;
  cy: number;
  radius: number;
  tooltipLabel: string;
  color: string;
  opacity: number;
  seriesName: StringOrNumberOrDate;
  isActive: boolean;
  transform: string;
}

/**
 * Bubble series component
 *
 * Renders animated bubble circles for data points with x, y, r values.
 */
export function BubbleSeries({
  data,
  xScale,
  yScale,
  rScale,
  xScaleType,
  yScaleType,
  colors,
  xAxisLabel = '',
  yAxisLabel = '',
  activeEntries = [],
  tooltipDisabled = false,
  tooltipTemplate,
  onSelect,
  onActivate,
  onDeactivate,
  animated = true,
}: BubbleSeriesProps) {
  const { showTooltip, hideTooltip } = useChartTooltip();

  const isActive = useCallback(
    (entry: { name: StringOrNumberOrDate }): boolean => {
      if (!activeEntries || activeEntries.length === 0) return true;
      return activeEntries.some((d) => String(d.name) === String(entry.name));
    },
    [activeEntries]
  );

  const circles = useMemo((): BubbleCircle[] => {
    const seriesName = data.name;

    const result: BubbleCircle[] = [];

    for (let i = 0; i < data.series.length; i++) {
      const d = data.series[i];
      if (d.y === undefined || d.x === undefined) {
        continue;
      }

      const y = d.y;
      const x = d.x;
      const r = d.r;

      const radius = rScale(r || 1);
      const tooltipLabel = formatLabel(d.name);

      let cx: number;
      if (xScaleType === ScaleType.Linear) {
        cx = (xScale as ScaleLinear<number, number>)(Number(x));
      } else if (xScaleType === ScaleType.Time) {
        const date = x instanceof Date ? x : new Date(x as string);
        cx = (xScale as ScaleTime<number, number>)(date);
      } else {
        cx = (xScale as ScalePoint<string>)(String(x)) ?? 0;
      }

      let cy: number;
      if (yScaleType === ScaleType.Linear) {
        cy = (yScale as ScaleLinear<number, number>)(Number(y));
      } else if (yScaleType === ScaleType.Time) {
        const date = y instanceof Date ? y : new Date(y as string);
        cy = (yScale as ScaleTime<number, number>)(date);
      } else {
        cy = (yScale as ScalePoint<string>)(String(y)) ?? 0;
      }

      const color =
        colors.scaleType === ScaleType.Linear
          ? colors.getColor(r)
          : colors.getColor(seriesName);

      const active = isActive({ name: seriesName });
      const opacity = active ? 1 : 0.3;

      const enrichedData: BubbleChartDataItem & { series: StringOrNumberOrDate } = {
        ...d,
        series: seriesName,
      };

      result.push({
        data: enrichedData,
        x,
        y,
        r,
        classNames: [`circle-data-${i}`],
        value: y,
        label: x,
        cx,
        cy,
        radius,
        tooltipLabel,
        color,
        opacity,
        seriesName,
        isActive: active,
        transform: `translate(${cx},${cy})`,
      });
    }

    return result;
  }, [data, xScale, yScale, rScale, xScaleType, yScaleType, colors, isActive]);

  const getTooltipText = useCallback(
    (circle: BubbleCircle): string => {
      const hasRadius = circle.r !== undefined;
      const hasTooltipLabel = circle.tooltipLabel && circle.tooltipLabel.length > 0;
      const hasSeriesName = circle.seriesName && String(circle.seriesName).length > 0;

      const radiusValue = hasRadius ? formatLabel(circle.r) : '';
      const xLabel = xAxisLabel ? `${xAxisLabel}:` : '';
      const yLabel = yAxisLabel ? `${yAxisLabel}:` : '';
      const x = formatLabel(circle.x);
      const y = formatLabel(circle.y);
      const name =
        hasSeriesName && hasTooltipLabel
          ? `${circle.seriesName} • ${circle.tooltipLabel}`
          : String(circle.seriesName) + circle.tooltipLabel;

      const tooltipTitle =
        hasSeriesName || hasTooltipLabel
          ? `<span class="tooltip-label">${escapeLabel(name)}</span>`
          : '';

      return `
        ${tooltipTitle}
        <span class="tooltip-label">
          <label>${escapeLabel(xLabel)}</label> ${escapeLabel(x)}<br />
          <label>${escapeLabel(yLabel)}</label> ${escapeLabel(y)}
        </span>
        <span class="tooltip-val">
          ${escapeLabel(radiusValue)}
        </span>
      `;
    },
    [xAxisLabel, yAxisLabel]
  );

  const handleClick = useCallback(
    (circle: BubbleCircle) => {
      onSelect?.(circle.data);
    },
    [onSelect]
  );

  const handleActivate = useCallback(
    (circle: BubbleCircle, element: SVGCircleElement) => {
      if (!tooltipDisabled) {
        const content = tooltipTemplate
          ? tooltipTemplate(circle.data, data)
          : (
            <div
              dangerouslySetInnerHTML={{ __html: getTooltipText(circle) }}
              style={{ textAlign: 'center' }}
            />
          );
        showTooltip({
          content,
          host: element as unknown as HTMLElement,
          placement: 'top',
          type: 'tooltip',
          showCaret: true,
        });
      }
      onActivate?.({ name: data.name });
    },
    [onActivate, data, tooltipDisabled, tooltipTemplate, getTooltipText, showTooltip]
  );

  const handleDeactivate = useCallback(
    (_circle: BubbleCircle) => {
      hideTooltip();
      onDeactivate?.({ name: data.name });
    },
    [onDeactivate, data.name, hideTooltip]
  );

  return (
    <g className="bubble-series">
      <AnimatePresence>
        {circles.map((circle, index) => (
          <motion.g
            key={`${circle.seriesName}-${circle.data.name}-${index}`}
            style={{ transform: circle.transform }}
          >
            <motion.circle
              className={`circle ${circle.isActive ? 'active' : ''} ${circle.classNames.join(' ')}`}
              cx={0}
              cy={0}
              r={circle.radius}
              fill={circle.color}
              initial={animated ? { opacity: 0, scale: 0 } : { opacity: circle.opacity }}
              animate={{
                opacity: circle.opacity,
                scale: 1,
              }}
              exit={animated ? { opacity: 0, scale: 0 } : { opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                cursor: 'pointer',
                pointerEvents: 'all',
              }}
              onClick={() => handleClick(circle)}
              onMouseEnter={(e) =>
                handleActivate(circle, e.currentTarget as unknown as SVGCircleElement)
              }
              onMouseLeave={() => handleDeactivate(circle)}
            />
          </motion.g>
        ))}
      </AnimatePresence>
    </g>
  );
}
