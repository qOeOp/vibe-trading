/**
 * @fileoverview Advanced Pie Chart Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/pie-chart/advanced-pie-chart.component.ts
 *
 * @description
 * Advanced pie chart with detailed legend showing totals, values, and percentages.
 * Features a compact pie/doughnut with a comprehensive breakdown panel.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { BaseChart, AdvancedLegend } from '../common';
import { PieSeries } from './components';
import type { DataItem, ColorScheme, StringOrNumberOrDate, TooltipConfig } from '../types';
import { ScaleType } from '../types';
import { ColorHelper, calculateViewDimensions } from '../utils';

export interface AdvancedPieChartProps {
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
  /** Label displayed above the total in the legend */
  label?: string;
  /** Enable gradient fills */
  gradient?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Tooltip configuration */
  tooltip?: TooltipConfig & {
    text?: (data: DataItem) => string;
  };
  /** Currently active/highlighted entries */
  activeEntries?: DataItem[];
  /** Custom value formatting function */
  valueFormatting?: (value: StringOrNumberOrDate) => string;
  /** Custom name/label formatting function */
  nameFormatting?: (value: string) => string;
  /** Custom percentage formatting function */
  percentageFormatting?: (value: number) => number;
  /** Callback when a slice is selected */
  onSelect?: (data: DataItem) => void;
  /** Callback when a slice is activated (hovered) */
  onActivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Callback when a slice is deactivated */
  onDeactivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Advanced Pie Chart Component
 *
 * Displays a pie/doughnut chart alongside a detailed legend with
 * totals, individual values, and percentages.
 *
 * @example
 * ```tsx
 * <AdvancedPieChart
 *   data={[
 *     { name: 'Germany', value: 40632 },
 *     { name: 'USA', value: 50000 },
 *     { name: 'France', value: 36745 },
 *   ]}
 *   label="Total Population"
 * />
 * ```
 */
export function AdvancedPieChart({
  data,
  width,
  height,
  colorScheme = 'cool',
  customColors,
  label = 'Total',
  gradient = false,
  animated = true,
  tooltip = {},
  activeEntries: controlledActiveEntries,
  valueFormatting,
  nameFormatting,
  percentageFormatting,
  onSelect,
  onActivate,
  onDeactivate,
  className = '',
}: AdvancedPieChartProps) {
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
      className={`advanced-pie-chart ${className}`}
    >
      {({ width: chartWidth, height: chartHeight }) => (
        <AdvancedPieChartInner
          data={data}
          width={chartWidth}
          height={chartHeight}
          colorScheme={colorScheme}
          customColors={customColors}
          label={label}
          gradient={gradient}
          animated={animated}
          tooltipDisabled={tooltipDisabled}
          tooltipTemplate={tooltipTemplate}
          tooltipText={tooltipText}
          activeEntries={activeEntries}
          valueFormatting={valueFormatting}
          nameFormatting={nameFormatting}
          percentageFormatting={percentageFormatting}
          onSelect={onSelect}
          onActivate={(item) => {
            // Find full data item
            const fullItem = data.find((d) => d.name === item.name);
            if (!fullItem) return;

            // Check if already active
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
            // Find full data item
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

/** Inner advanced pie chart component */
interface AdvancedPieChartInnerProps {
  data: DataItem[];
  width: number;
  height: number;
  colorScheme: string | ColorScheme;
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  label: string;
  gradient: boolean;
  animated: boolean;
  tooltipDisabled: boolean;
  tooltipTemplate?: ReactNode;
  tooltipText?: (data: DataItem) => string;
  activeEntries: DataItem[];
  valueFormatting?: (value: StringOrNumberOrDate) => string;
  nameFormatting?: (value: string) => string;
  percentageFormatting?: (value: number) => number;
  onSelect?: (data: DataItem) => void;
  onActivate?: (data: DataItem) => void;
  onDeactivate?: (data: DataItem) => void;
}

function AdvancedPieChartInner({
  data,
  width,
  height,
  colorScheme,
  customColors,
  label,
  gradient,
  animated,
  tooltipDisabled,
  tooltipTemplate,
  tooltipText,
  activeEntries,
  valueFormatting,
  nameFormatting,
  percentageFormatting,
  onSelect,
  onActivate,
  onDeactivate,
}: AdvancedPieChartInnerProps) {
  const margin = useMemo<[number, number, number, number]>(() => [20, 20, 20, 20], []);

  // Calculate dimensions - pie takes 4/12 of width, legend takes 8/12
  const dims = useMemo(() => {
    return calculateViewDimensions({
      width: (width * 4) / 12,
      height,
      margins: margin,
    });
  }, [width, height, margin]);

  // Calculate center offset for pie
  const xOffset = dims.width / 2;
  const yOffset = margin[0] + dims.height / 2;
  const transform = `translate(${xOffset}, ${yOffset})`;

  // Calculate radii
  const outerRadius = Math.min(dims.width, dims.height) / 2.5;
  const innerRadius = outerRadius * 0.75;

  // Legend width
  const legendWidth = width - dims.width - margin[1];

  // Get domain
  const domain = useMemo(() => {
    return data.map((d) => String(d.name));
  }, [data]);

  // Create color helper
  const colors = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: ScaleType.Ordinal,
      domain,
      customColors,
    });
  }, [colorScheme, domain, customColors]);

  // Handle legend select
  const handleLegendSelect = useCallback(
    (item: DataItem) => {
      onSelect?.(item);
    },
    [onSelect]
  );

  // Handle legend activate
  const handleLegendActivate = useCallback(
    (item: DataItem) => {
      // Find by label
      const dataItem = data.find((d) => String(d.name) === item.name);
      if (dataItem) {
        onActivate?.(dataItem);
      }
    },
    [data, onActivate]
  );

  // Handle legend deactivate
  const handleLegendDeactivate = useCallback(
    (item: DataItem) => {
      // Find by label
      const dataItem = data.find((d) => String(d.name) === item.name);
      if (dataItem) {
        onDeactivate?.(dataItem);
      }
    },
    [data, onDeactivate]
  );

  return (
    <div
      style={{
        display: 'flex',
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Pie Chart */}
      <div
        className="advanced-pie"
        style={{
          width: `${dims.width}px`,
          height: `${dims.height}px`,
        }}
      >
        <svg
          width={dims.width + margin[1] + margin[3]}
          height={height}
          className="ngx-charts"
          style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}
          role="img"
          aria-label="Advanced pie chart"
        >
          <g transform={transform} className="pie chart">
            <PieSeries
              colors={colors}
              series={data}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              gradient={gradient}
              activeEntries={activeEntries}
              tooltipDisabled={tooltipDisabled}
              tooltipTemplate={tooltipTemplate}
              tooltipText={tooltipText ? (arc) => tooltipText(arc.data) : undefined}
              animations={animated}
              onSelect={onSelect}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
            />
          </g>
        </svg>
      </div>

      {/* Advanced Legend */}
      <div
        className="advanced-pie-legend-wrapper"
        style={{
          width: `${legendWidth}px`,
          height: `${height}px`,
        }}
      >
        <AdvancedLegend
          data={data}
          colors={colors}
          width={legendWidth - margin[1]}
          label={label}
          animations={animated}
          valueFormatting={valueFormatting}
          labelFormatting={nameFormatting}
          percentageFormatting={percentageFormatting}
          onSelect={handleLegendSelect}
          onActivate={handleLegendActivate}
          onDeactivate={handleLegendDeactivate}
        />
      </div>
    </div>
  );
}
