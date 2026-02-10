'use client';

/**
 * @fileoverview Heat map cell series component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/heat-map/heat-map-cell-series.component.ts
 *
 * @description
 * Renders a series of heat map cells with tooltip support.
 * Handles the calculation of cell positions and colors.
 *
 * @license MIT
 */

import { useMemo, useCallback, type ReactNode } from 'react';
import type { ScaleBand } from 'd3-scale';
import { HeatMapCell } from './heat-map-cell';
import { useChartTooltip } from '../common/tooltip';
import type { DataItem, Series, StringOrNumberOrDate } from '../types';
import { ColorHelper, trimLabel, escapeLabel } from '../utils';

/** Internal cell representation for rendering */
interface Cell {
  /** The original cell data */
  cell: DataItem;
  /** The numeric value */
  data: number;
  /** Fill color */
  fill: string;
  /** Cell height */
  height: number;
  /** Formatted label */
  label: string;
  /** Parent row/series */
  row: Series;
  /** Series name */
  series: string;
  /** Cell width */
  width: number;
  /** X position */
  x: number;
  /** Y position */
  y: number;
}

export interface HeatMapCellSeriesProps {
  /** Heat map data (array of series) */
  data: Series[];
  /** X scale (band scale) */
  xScale: ScaleBand<string>;
  /** Y scale (band scale) */
  yScale: ScaleBand<string>;
  /** Color helper for value-to-color mapping */
  colors: ColorHelper;
  /** Whether to render with gradient fill */
  gradient?: boolean;
  /** Whether tooltips are disabled */
  tooltipDisabled?: boolean;
  /** Custom tooltip template */
  tooltipTemplate?: ReactNode;
  /** Custom tooltip text function */
  tooltipText?: (cell: { label: string; data: number; series: string }) => string;
  /** Enable/disable animations */
  animated?: boolean;
  /** Callback when cell is clicked */
  onSelect?: (cell: DataItem) => void;
  /** Callback when cell is activated */
  onActivate?: (cell: DataItem) => void;
  /** Callback when cell is deactivated */
  onDeactivate?: (cell: DataItem) => void;
}

/**
 * Default tooltip text formatter
 */
function getDefaultTooltipText({
  label,
  data,
  series,
}: {
  label: string;
  data: number;
  series: string;
}): string {
  return `
    <span class="tooltip-label">${escapeLabel(series)} - ${escapeLabel(label)}</span>
    <span class="tooltip-val">${data.toLocaleString()}</span>
  `;
}

/**
 * Heat map cell series component
 */
export function HeatMapCellSeries({
  data,
  xScale,
  yScale,
  colors,
  gradient = false,
  tooltipDisabled = false,
  tooltipTemplate,
  tooltipText,
  animated = true,
  onSelect,
  onActivate,
  onDeactivate,
}: HeatMapCellSeriesProps) {
  const getTooltipText = tooltipText || getDefaultTooltipText;

  const cells = useMemo((): Cell[] => {
    const result: Cell[] = [];

    data.forEach((row) => {
      const seriesName = String(row.name);

      row.series.forEach((cell) => {
        const value = cell.value;
        const cellName = String(cell.name);

        // Mutate cell to add series reference (matching original behavior)
        (cell as DataItem & { series?: StringOrNumberOrDate }).series = row.name;

        const xPos = xScale(seriesName);
        const yPos = yScale(cellName);

        if (xPos !== undefined && yPos !== undefined) {
          result.push({
            row,
            cell,
            x: xPos,
            y: yPos,
            width: xScale.bandwidth(),
            height: yScale.bandwidth(),
            fill: colors.getColor(value),
            data: value,
            label: trimLabel(cellName),
            series: seriesName,
          });
        }
      });
    });

    return result;
  }, [data, xScale, yScale, colors]);

  const { showTooltip, hideTooltip } = useChartTooltip();

  const handleCellMouseEnter = useCallback(
    (c: Cell, event: React.MouseEvent<SVGGElement>) => {
      if (tooltipDisabled) return;

      const target = event.currentTarget;
      const tooltipTitle = tooltipTemplate
        ? undefined
        : getTooltipText({ label: c.label, data: c.data, series: c.series });

      showTooltip({
        title: tooltipTitle,
        host: target,
        placement: 'top',
        type: 'tooltip',
        showCaret: true,
      });
    },
    [tooltipDisabled, tooltipTemplate, getTooltipText, showTooltip]
  );

  const handleCellMouseLeave = useCallback(() => {
    if (tooltipDisabled) return;
    hideTooltip();
  }, [tooltipDisabled, hideTooltip]);

  return (
    <g className="heat-map-cell-series">
      {cells.map((c, index) => (
        <g
          key={`cell-wrapper-${c.series}-${c.label}-${index}`}
          onMouseEnter={(e) => handleCellMouseEnter(c, e)}
          onMouseLeave={handleCellMouseLeave}
        >
          <HeatMapCell
            x={c.x}
            y={c.y}
            width={c.width}
            height={c.height}
            fill={c.fill}
            data={c.data}
            gradient={gradient}
            animated={animated}
            onSelect={() => onSelect?.(c.cell)}
            onActivate={() => onActivate?.(c.cell)}
            onDeactivate={() => onDeactivate?.(c.cell)}
          />
        </g>
      ))}
    </g>
  );
}
