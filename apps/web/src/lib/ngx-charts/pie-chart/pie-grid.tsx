/**
 * @fileoverview Pie Grid Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/pie-chart/pie-grid.component.ts
 *
 * @description
 * Grid of mini pie charts showing individual values as percentages.
 * Each cell displays a mini doughnut with label and percentage.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { format } from 'd3-format';
import { min } from 'd3-array';
import { motion } from 'framer-motion';
import { BaseChart } from '../common';
import { useChartTooltip } from '../common/tooltip';
import { PieGridSeries } from './components';
import type { DataItem, ColorScheme, TooltipConfig, PieGridDataItem } from '../types';
import { ScaleType } from '../types';
import { ColorHelper, calculateViewDimensions, trimLabel } from '../utils';

/** Grid series item with positioning and colors */
interface GridSeriesItem {
  transform: string;
  colors: (label: string) => string;
  innerRadius: number;
  outerRadius: number;
  name: string | number | Date;
  label: string;
  total: number;
  value: number;
  percent: string;
  data: Array<{
    data: PieGridDataItem;
    height: number;
    width: number;
    x: number;
    y: number;
  }>;
}

export interface PieGridProps {
  /** Chart data - array of { name, value } objects */
  data: DataItem[];
  /** Fixed chart width (optional, defaults to container width) */
  width?: number;
  /** Fixed chart height (optional, defaults to container height) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Custom color mapping */
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Label displayed below each mini pie (prefix for value) */
  label?: string;
  /** Designated total for percentage calculation (defaults to sum) */
  designatedTotal?: number;
  /** Minimum cell width */
  minWidth?: number;
  /** Enable animations */
  animated?: boolean;
  /** Tooltip configuration */
  tooltip?: TooltipConfig & {
    text?: (data: { data: GridSeriesItem }) => string;
  };
  /** Currently active/highlighted entries */
  activeEntries?: DataItem[];
  /** Callback when a cell is selected */
  onSelect?: (data: DataItem) => void;
  /** Callback when a cell is activated (hovered) */
  onActivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Callback when a cell is deactivated */
  onDeactivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Pie Grid Component
 *
 * Displays a grid of mini pie charts, each showing a single value
 * as a percentage of the total.
 *
 * @example
 * ```tsx
 * <PieGrid
 *   data={[
 *     { name: 'Germany', value: 40632 },
 *     { name: 'USA', value: 50000 },
 *     { name: 'France', value: 36745 },
 *   ]}
 *   label="Population"
 * />
 * ```
 */
export function PieGrid({
  data,
  width,
  height,
  colorScheme = 'cool',
  customColors,
  label = 'Total',
  designatedTotal,
  minWidth = 150,
  animated = true,
  tooltip = {},
  activeEntries: controlledActiveEntries,
  onSelect,
  onActivate,
  onDeactivate,
  className = '',
}: PieGridProps) {
  // Internal active entries state
  const [internalActiveEntries, setInternalActiveEntries] = useState<DataItem[]>([]);

  // Use controlled or internal active entries
  const activeEntries = controlledActiveEntries ?? internalActiveEntries;

  // Extract tooltip config
  const tooltipDisabled = tooltip.disabled ?? false;
  const tooltipTemplate = tooltip.template;
  const tooltipText = tooltip.text;

  return (
    <BaseChart
      width={width}
      height={height}
      colorScheme={colorScheme}
      animated={animated}
      className={`pie-grid ${className}`}
    >
      {({ width: chartWidth, height: chartHeight }) => (
        <PieGridInner
          data={data}
          width={chartWidth}
          height={chartHeight}
          colorScheme={colorScheme}
          customColors={customColors}
          label={label}
          designatedTotal={designatedTotal}
          minWidth={minWidth}
          animated={animated}
          tooltipDisabled={tooltipDisabled}
          tooltipTemplate={tooltipTemplate}
          tooltipText={tooltipText}
          activeEntries={activeEntries}
          onSelect={onSelect}
          onActivate={(item) => {
            const fullItem = data.find((d) => d.name === item.name);
            if (!fullItem) return;

            const idx = activeEntries.findIndex(
              (d) => d.name === fullItem.name && d.value === fullItem.value
            );
            if (idx > -1) return;

            const newEntries = [fullItem, ...activeEntries];
            if (!controlledActiveEntries) {
              setInternalActiveEntries(newEntries);
            }
            onActivate?.({ value: fullItem, entries: newEntries });
          }}
          onDeactivate={(item) => {
            const fullItem = data.find((d) => d.name === item.name);
            if (!fullItem) return;

            const idx = activeEntries.findIndex(
              (d) => d.name === fullItem.name && d.value === fullItem.value
            );
            if (idx === -1) return;

            const newEntries = activeEntries.filter((_, i) => i !== idx);
            if (!controlledActiveEntries) {
              setInternalActiveEntries(newEntries);
            }
            onDeactivate?.({ value: fullItem, entries: newEntries });
          }}
        />
      )}
    </BaseChart>
  );
}

/** Inner pie grid component */
interface PieGridInnerProps {
  data: DataItem[];
  width: number;
  height: number;
  colorScheme: string | ColorScheme;
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  label: string;
  designatedTotal?: number;
  minWidth: number;
  animated: boolean;
  tooltipDisabled: boolean;
  tooltipTemplate?: ReactNode;
  tooltipText?: (data: { data: GridSeriesItem }) => string;
  activeEntries: DataItem[];
  onSelect?: (data: DataItem) => void;
  onActivate?: (data: DataItem) => void;
  onDeactivate?: (data: DataItem) => void;
}

function PieGridInner({
  data,
  width,
  height,
  colorScheme,
  customColors,
  label,
  designatedTotal,
  minWidth,
  animated,
  tooltipDisabled,
  tooltipTemplate,
  tooltipText,
  onSelect,
  onActivate,
  onDeactivate,
}: PieGridInnerProps) {
  const margin = useMemo<[number, number, number, number]>(() => [20, 20, 20, 20], []);

  // Calculate view dimensions
  const dims = useMemo(() => {
    return calculateViewDimensions({
      width,
      height,
      margins: margin,
    });
  }, [width, height, margin]);

  // Transform for the grid container
  const transform = `translate(${margin[3]}, ${margin[0]})`;

  // Get domain
  const domain = useMemo(() => {
    return data.map((d) => String(d.name));
  }, [data]);

  // Create color scale
  const colorScale = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: ScaleType.Ordinal,
      domain,
      customColors,
    });
  }, [colorScheme, domain, customColors]);

  // Calculate total
  const total = useMemo(() => {
    return designatedTotal ?? data.reduce((sum, d) => sum + d.value, 0);
  }, [data, designatedTotal]);

  // Calculate grid layout and series data
  const { series } = useMemo(() => {
    // Grid layout calculation - use Angular's gridSize algorithm
    // This keeps adding rows until each column width is >= minWidth
    let rows = 1;
    let columns = data.length;
    if (dims.width > minWidth) {
      while (dims.width / columns < minWidth) {
        rows += 1;
        columns = Math.ceil(data.length / rows);
      }
    }
    const cellWidth = dims.width / columns;
    const cellHeight = dims.height / rows;

    const gridCells = data.map((d, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const percent = total > 0 ? d.value / total : 0;

      return {
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
        data: {
          ...d,
          percent,
          total: d.value,
        } as PieGridDataItem,
      };
    });

    // Generate series from grid data
    const seriesItems: GridSeriesItem[] = gridCells.map((d) => {
      const baselineLabelHeight = 20;
      const padding = 10;
      const name = d.data.name;
      const labelText = String(name);
      const value = d.data.value;
      const radius = (min([d.width - padding, d.height - baselineLabelHeight]) ?? 100) / 2 - 5;
      const innerRadius = radius * 0.9;

      // Color function that returns lighter version for background, full color for value
      // Angular uses a lighter shade of the same color for the background arc
      const actualColor = colorScale.getColor(labelText);
      let count = 0;
      const colors = (_colorLabel: string): string => {
        count += 1;
        if (count === 1) {
          // Background: lighter version of the actual color (30% opacity)
          return actualColor + '4D'; // 4D = 30% opacity in hex (0.3 * 255 = 77 = 0x4D)
        } else {
          return actualColor;
        }
      };

      const xPos = d.x + (d.width - padding) / 2;
      const yPos = d.y + (d.height - baselineLabelHeight) / 2;

      return {
        transform: `translate(${xPos}, ${yPos})`,
        colors,
        innerRadius,
        outerRadius: radius,
        name,
        label: trimLabel(labelText),
        total: value,
        value,
        percent: format('.0%')(d.data.percent),
        // Data order: other (background) first, value second
        // This ensures: 1) other arc rendered first (grey, underneath)
        //               2) value arc rendered second (colored, on top)
        // Colors function returns grey for count=1, colored for count>1
        data: [
          {
            data: {
              other: true,
              value: total - value,
              name: d.data.name,
              percent: 0,
              total: 0,
            } as PieGridDataItem & { other: boolean },
            height: d.height,
            width: d.width,
            x: d.x,
            y: d.y,
          },
          d, // Value arc second - rendered on top
        ],
      };
    });

    return { gridData: gridCells, series: seriesItems };
  }, [data, dims, minWidth, total, colorScale]);

  // Default tooltip text
  const defaultTooltipText = useCallback(
    ({ data: seriesItem }: { data: GridSeriesItem }): string => {
      const itemLabel = trimLabel(String(seriesItem.name));
      const val = seriesItem.value.toLocaleString();
      return `
        <span class="tooltip-label">${itemLabel}</span>
        <span class="tooltip-val">${val}</span>
      `;
    },
    []
  );

  // Get tooltip text
  const getTooltipText = useCallback(
    (seriesItem: GridSeriesItem): string => {
      if (tooltipTemplate) return '';
      const getText = tooltipText || defaultTooltipText;
      return getText({ data: seriesItem });
    },
    [tooltipText, tooltipTemplate, defaultTooltipText]
  );

  // Global tooltip context - like Angular's TooltipService with destroyAll()
  const { showTooltip, hideTooltip } = useChartTooltip();

  // Tooltip handlers using global context (only ONE tooltip visible at a time)
  const handlePieMouseEnter = useCallback(
    (seriesItem: GridSeriesItem, event: React.MouseEvent<SVGGElement>) => {
      if (tooltipDisabled) return;

      const target = event.currentTarget;
      showTooltip({
        title: getTooltipText(seriesItem),
        host: target,
        placement: 'top',
        type: 'tooltip',
        showCaret: true,
      });
    },
    [tooltipDisabled, showTooltip, getTooltipText]
  );

  const handlePieMouseLeave = useCallback(() => {
    if (tooltipDisabled) return;
    hideTooltip();
  }, [tooltipDisabled, hideTooltip]);

  return (
    <svg
      width={width}
      height={height}
      className="ngx-charts"
      style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}
      role="img"
      aria-label="Pie grid chart"
    >
      <g transform={transform} className="pie-grid chart">
        {series.map((seriesItem, index) => (
          <g
            key={`pie-grid-item-${index}`}
            className="pie-grid-item"
            transform={seriesItem.transform}
            onMouseEnter={(e) => handlePieMouseEnter(seriesItem, e)}
            onMouseLeave={handlePieMouseLeave}
          >
            <PieGridSeries
              colors={seriesItem.colors}
              data={seriesItem.data}
              innerRadius={seriesItem.innerRadius}
              outerRadius={seriesItem.outerRadius}
              animations={animated}
              onSelect={onSelect}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
            />

            {/* Percent label */}
            {animated ? (
              <motion.text
                className="label percent-label"
                dy="-0.5em"
                x={0}
                y={5}
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: '14px', fontWeight: 'bold' }}
              >
                {seriesItem.percent}
              </motion.text>
            ) : (
              <text
                className="label percent-label"
                dy="-0.5em"
                x={0}
                y={5}
                textAnchor="middle"
                style={{ fontSize: '14px', fontWeight: 'bold' }}
              >
                {seriesItem.percent}
              </text>
            )}

            {/* Name label */}
            <text
              className="label"
              dy="0.5em"
              x={0}
              y={5}
              textAnchor="middle"
              style={{ fontSize: '12px' }}
            >
              {seriesItem.label}
            </text>

            {/* Value label */}
            {animated ? (
              <motion.text
                className="label"
                dy="1.23em"
                x={0}
                y={seriesItem.outerRadius}
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: '11px' }}
              >
                {`${label}: ${seriesItem.total.toLocaleString()}`}
              </motion.text>
            ) : (
              <text
                className="label"
                dy="1.23em"
                x={0}
                y={seriesItem.outerRadius}
                textAnchor="middle"
                style={{ fontSize: '11px' }}
              >
                {`${label}: ${seriesItem.total.toLocaleString()}`}
              </text>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
