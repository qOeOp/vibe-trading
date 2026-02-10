'use client';

/**
 * @fileoverview Vertical bar series component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/series-vertical.component.ts
 *
 * @description
 * Renders a series of vertical bars. Supports standard, stacked,
 * and normalized bar chart types.
 *
 * @license MIT
 */

import { useMemo, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ScaleBand, ScaleLinear } from 'd3-scale';
import type { DataItem, StringOrNumberOrDate } from '../../types';
import { Bar } from './bar';
import { BarLabel } from './bar-label';
import { BarChartType, D0Types, type Bar as BarModel, type BarSeriesProps } from '../types';
import { formatLabel, escapeLabel } from '../../utils';
import { useChartTooltip } from '../../common/tooltip';

/**
 * Type guard to check if a scale is a ScaleBand
 */
function isScaleBand<T extends { toString(): string }>(scale: unknown): scale is ScaleBand<T> {
  return typeof scale === 'function' && 'bandwidth' in scale;
}

/**
 * Type guard to check if a scale is a ScaleLinear
 */
function isScaleLinear(scale: unknown): scale is ScaleLinear<number, number> {
  return typeof scale === 'function' && 'domain' in scale && !('bandwidth' in scale);
}

interface BarSeriesVerticalProps extends BarSeriesProps {
  /** Bar chart type */
  type?: BarChartType;
}

/**
 * Vertical bar series component
 */
export function BarSeriesVertical({
  series,
  type = BarChartType.Standard,
  xScale,
  yScale,
  getColor,
  getGradientStops,
  dims,
  gradient = false,
  activeEntries = [],
  seriesName,
  tooltipDisabled = false,
  tooltipTemplate,
  roundEdges = true,
  animated = true,
  showDataLabel = false,
  dataLabelFormatting,
  noBarWhenZero = true,
  scaleType = 'ordinal',
  onSelect,
  onActivate,
  onDeactivate,
  onDataLabelHeightChanged,
}: BarSeriesVerticalProps) {
  const { showTooltip, hideTooltip } = useChartTooltip();
  const barRefs = useRef<Map<string, SVGGElement | null>>(new Map());

  // Calculate bars
  const bars = useMemo((): BarModel[] => {
    if (!series.length) {
      return [];
    }

    // Get xScale bandwidth if available
    const xBandwidth = isScaleBand<string>(xScale) ? xScale.bandwidth() : 0;
    const width = Math.round(xBandwidth);

    // Get yScale domain minimum
    const yScaleDomain = isScaleLinear(yScale) ? yScale.domain() : [0, 0];
    const yScaleMin = Math.max(yScaleDomain[0], 0);

    const d0 = {
      [D0Types.positive]: 0,
      [D0Types.negative]: 0,
    };

    let total = 0;
    if (type === BarChartType.Normalized) {
      total = series.reduce((sum, d) => sum + d.value, 0);
    }

    return series.map((d) => {
      let value = d.value;
      const label = d.label ?? d.name;
      const formattedLabel = formatLabel(label);
      const d0Type = value > 0 ? D0Types.positive : D0Types.negative;

      const bar: BarModel = {
        value,
        label,
        roundEdges,
        data: d,
        width,
        formattedLabel,
        height: 0,
        x: 0,
        y: 0,
        color: '',
        ariaLabel: '',
      };

      if (type === BarChartType.Standard) {
        const yVal = isScaleLinear(yScale) ? (yScale(value) ?? 0) : 0;
        const yMin = isScaleLinear(yScale) ? (yScale(yScaleMin) ?? 0) : 0;
        bar.height = Math.abs(yVal - yMin);
        bar.x = isScaleBand<string>(xScale) ? (xScale(String(label)) ?? 0) : 0;

        if (value < 0) {
          bar.y = isScaleLinear(yScale) ? (yScale(0) ?? 0) : 0;
        } else {
          bar.y = yVal;
        }
      } else if (type === BarChartType.Stacked) {
        const offset0 = d0[d0Type];
        const offset1 = offset0 + value;
        d0[d0Type] += value;

        const y0 = isScaleLinear(yScale) ? (yScale(offset0) ?? 0) : 0;
        const y1 = isScaleLinear(yScale) ? (yScale(offset1) ?? 0) : 0;
        bar.height = y0 - y1;
        bar.x = 0;
        bar.y = y1;
        bar.offset0 = offset0;
        bar.offset1 = offset1;
      } else if (type === BarChartType.Normalized) {
        let offset0 = d0[d0Type];
        let offset1 = offset0 + value;
        d0[d0Type] += value;

        if (total > 0) {
          offset0 = (offset0 * 100) / total;
          offset1 = (offset1 * 100) / total;
        } else {
          offset0 = 0;
          offset1 = 0;
        }

        const y0 = isScaleLinear(yScale) ? (yScale(offset0) ?? 0) : 0;
        const y1 = isScaleLinear(yScale) ? (yScale(offset1) ?? 0) : 0;
        bar.height = y0 - y1;
        bar.x = 0;
        bar.y = y1;
        bar.offset0 = offset0;
        bar.offset1 = offset1;
        value = Number((offset1 - offset0).toFixed(2));
      }

      // Set color
      if (scaleType === 'ordinal') {
        bar.color = getColor(String(label));
      } else {
        if (type === BarChartType.Standard) {
          bar.color = getColor(String(value));
          if (getGradientStops) {
            bar.gradientStops = getGradientStops(String(value));
          }
        } else {
          bar.color = getColor(String(bar.offset1 ?? value));
          if (getGradientStops && bar.offset1 !== undefined && bar.offset0 !== undefined) {
            bar.gradientStops = getGradientStops(String(bar.offset1), String(bar.offset0));
          }
        }
      }

      // Build tooltip and aria label
      let tooltipLabel = formattedLabel;
      bar.ariaLabel = `${formattedLabel} ${value.toLocaleString()}`;

      if (seriesName !== undefined && seriesName !== null) {
        tooltipLabel = `${seriesName} - ${formattedLabel}`;
        bar.ariaLabel = `${seriesName} ${bar.ariaLabel}`;
      }

      if (!tooltipDisabled) {
        const displayValue = type === BarChartType.Normalized
          ? `${value}%`
          : dataLabelFormatting
            ? dataLabelFormatting(value)
            : value.toLocaleString();

        bar.tooltipText = `
          <span class="tooltip-label">${escapeLabel(tooltipLabel)}</span>
          <span class="tooltip-val">${displayValue}</span>
        `;
      }

      return bar;
    });
  }, [series, type, xScale, yScale, getColor, getGradientStops, roundEdges, seriesName, tooltipDisabled, dataLabelFormatting, scaleType]);

  // Calculate data labels
  const barsForDataLabels = useMemo(() => {
    if (!showDataLabel) {
      return [];
    }

    const xBandwidth = isScaleBand<string>(xScale) ? xScale.bandwidth() : 0;

    if (type === BarChartType.Stacked) {
      const totalPositive = series.reduce((sum, d) => (d.value > 0 ? sum + d.value : sum), 0);
      const totalNegative = series.reduce((sum, d) => (d.value < 0 ? sum + d.value : sum), 0);
      const total = totalPositive + totalNegative;

      const yVal = isScaleLinear(yScale)
        ? (total > 0 ? (yScale(totalPositive) ?? 0) : (yScale(totalNegative) ?? 0))
        : 0;

      return [{
        series: seriesName,
        total,
        x: 0,
        y: 0,
        height: yVal,
        width: xBandwidth,
      }];
    }

    return series.map((d) => {
      const xPos = isScaleBand<string>(xScale) ? (xScale(String(d.label ?? d.name)) ?? 0) : 0;
      const y0 = isScaleLinear(yScale) ? (yScale(0) ?? 0) : 0;
      const yVal = isScaleLinear(yScale) ? (yScale(d.value) ?? 0) : 0;

      return {
        series: seriesName ?? d.label,
        total: d.value,
        x: xPos,
        y: y0,
        height: yVal - y0,
        width: xBandwidth,
      };
    });
  }, [showDataLabel, type, series, seriesName, xScale, yScale]);

  // Check if entry is active
  const isActive = useCallback((entry: DataItem): boolean => {
    if (!activeEntries.length) {
      return false;
    }
    return activeEntries.some(
      (active) => entry.name === active.name && entry.value === active.value
    );
  }, [activeEntries]);

  // Event handlers
  const handleClick = useCallback((data: DataItem) => {
    onSelect?.(data);
  }, [onSelect]);

  const handleActivate = useCallback((data: DataItem) => {
    onActivate?.(data);
  }, [onActivate]);

  const handleDeactivate = useCallback((data: DataItem) => {
    onDeactivate?.(data);
  }, [onDeactivate]);

  const handleDataLabelDimensionsChanged = useCallback((size: { height: number; width: number; negative: boolean }, index: number) => {
    onDataLabelHeightChanged?.({ size: { height: size.height, negative: size.negative }, index });
  }, [onDataLabelHeightChanged]);

  // Tooltip handlers using global context
  const handleBarMouseEnter = useCallback((bar: BarModel, event: React.MouseEvent<SVGGElement>) => {
    if (tooltipDisabled || !bar.tooltipText) return;

    const target = event.currentTarget;
    showTooltip({
      title: bar.tooltipText,
      host: target,
      placement: 'top',
      type: 'tooltip',
      showCaret: true,
    });
  }, [tooltipDisabled, showTooltip]);

  const handleBarMouseLeave = useCallback(() => {
    if (tooltipDisabled) return;
    hideTooltip();
  }, [tooltipDisabled, hideTooltip]);

  return (
    <g>
      <AnimatePresence>
        {bars.map((bar, index) => (
          <motion.g
            key={String(bar.label)}
            initial={animated ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={(e) => handleBarMouseEnter(bar, e)}
            onMouseLeave={handleBarMouseLeave}
          >
            <Bar
              fill={bar.color}
              data={bar.data}
              width={bar.width}
              height={bar.height}
              x={bar.x}
              y={bar.y}
              orientation="vertical"
              roundEdges={bar.roundEdges}
              gradient={gradient}
              stops={bar.gradientStops}
              isActive={isActive(bar.data)}
              animated={animated}
              ariaLabel={bar.ariaLabel}
              noBarWhenZero={noBarWhenZero}
              onSelect={handleClick}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
            />
          </motion.g>
        ))}
      </AnimatePresence>

      {showDataLabel && barsForDataLabels.map((b, i) => (
        <g key={`label-${i}`}>
          <BarLabel
            value={b.total}
            valueFormatting={dataLabelFormatting}
            barX={b.x}
            barY={b.y}
            barWidth={b.width}
            barHeight={b.height}
            orientation="vertical"
            onDimensionsChanged={(size) => handleDataLabelDimensionsChanged(size, i)}
          />
        </g>
      ))}
    </g>
  );
}
