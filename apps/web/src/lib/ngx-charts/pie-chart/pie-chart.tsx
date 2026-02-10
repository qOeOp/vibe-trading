/**
 * @fileoverview Pie Chart Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/pie-chart/pie-chart.component.ts
 *
 * @description
 * Main pie chart component supporting pie and doughnut variants.
 * Features include labels, legends, tooltips, gradients, and animations.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useState, type ReactNode } from 'react';
import { BaseChart, Legend } from '../common';
import { PieSeries, type ArcWithPosition } from './components';
import { usePieChart } from './hooks';
import type { DataItem, ColorScheme, LegendConfig, TooltipConfig } from '../types';
import { LegendPosition } from '../types';

export interface PieChartProps {
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
  /** Show labels outside the pie */
  labels?: {
    visible?: boolean;
    formatting?: (name: string) => string;
    trim?: boolean;
    maxLength?: number;
  };
  /** Legend configuration */
  legend?: LegendConfig;
  /** Enable doughnut mode (hollow center) */
  doughnut?: boolean;
  /** Arc width for doughnut mode (0-1) */
  arcWidth?: number;
  /** Explode slices outward based on value */
  explodeSlices?: boolean;
  /** Enable gradient fills */
  gradient?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Tooltip configuration */
  tooltip?: TooltipConfig & {
    text?: (arc: ArcWithPosition) => string;
  };
  /** Currently active/highlighted entries */
  activeEntries?: DataItem[];
  /** Custom margins [top, right, bottom, left] */
  margins?: [number, number, number, number];
  /** Callback when a slice is selected */
  onSelect?: (data: DataItem) => void;
  /** Callback when a slice is activated (hovered) */
  onActivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Callback when a slice is deactivated */
  onDeactivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Callback when a slice is double-clicked */
  onDblClick?: (event: { data: DataItem; nativeEvent: React.MouseEvent }) => void;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Pie/Doughnut Chart Component
 *
 * @example
 * ```tsx
 * <PieChart
 *   data={[
 *     { name: 'Germany', value: 40632 },
 *     { name: 'USA', value: 50000 },
 *     { name: 'France', value: 36745 },
 *   ]}
 *   labels={{ visible: true }}
 *   legend={{ visible: true, title: 'Countries' }}
 * />
 * ```
 */
export function PieChart({
  data,
  width,
  height,
  colorScheme = 'cool',
  customColors,
  labels = {},
  legend = {},
  doughnut = false,
  arcWidth = 0.25,
  explodeSlices = false,
  gradient = false,
  animated = true,
  tooltip = {},
  activeEntries: controlledActiveEntries,
  margins,
  onSelect,
  onActivate,
  onDeactivate,
  onDblClick,
  className = '',
}: PieChartProps) {
  // Internal active entries state
  const [internalActiveEntries, setInternalActiveEntries] = useState<DataItem[]>([]);

  // Use controlled or internal active entries
  const activeEntries = controlledActiveEntries ?? internalActiveEntries;

  // Extract label config
  const showLabels = labels.visible ?? false;
  const labelFormatting = labels.formatting;
  const trimLabels = labels.trim ?? true;
  const maxLabelLength = labels.maxLength ?? 10;

  // Extract legend config
  const showLegend = legend.visible ?? false;
  const legendTitle = legend.title ?? 'Legend';
  const legendPosition = legend.position ?? LegendPosition.Right;

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
      className={`pie-chart ${className}`}
    >
      {({ width: chartWidth, height: chartHeight }) => (
        <PieChartInner
          data={data}
          width={chartWidth}
          height={chartHeight}
          colorScheme={colorScheme}
          customColors={customColors}
          showLabels={showLabels}
          labelFormatting={labelFormatting}
          trimLabels={trimLabels}
          maxLabelLength={maxLabelLength}
          showLegend={showLegend}
          legendTitle={legendTitle}
          legendPosition={legendPosition}
          doughnut={doughnut}
          arcWidth={arcWidth}
          explodeSlices={explodeSlices}
          gradient={gradient}
          animated={animated}
          tooltipDisabled={tooltipDisabled}
          tooltipTemplate={tooltipTemplate}
          tooltipText={tooltipText}
          activeEntries={activeEntries}
          margins={margins}
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
          onDblClick={onDblClick}
        />
      )}
    </BaseChart>
  );
}

/** Inner pie chart component with all calculations */
interface PieChartInnerProps {
  data: DataItem[];
  width: number;
  height: number;
  colorScheme: string | ColorScheme;
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  showLabels: boolean;
  labelFormatting?: (name: string) => string;
  trimLabels: boolean;
  maxLabelLength: number;
  showLegend: boolean;
  legendTitle: string;
  legendPosition: LegendPosition;
  doughnut: boolean;
  arcWidth: number;
  explodeSlices: boolean;
  gradient: boolean;
  animated: boolean;
  tooltipDisabled: boolean;
  tooltipTemplate?: ReactNode;
  tooltipText?: (arc: ArcWithPosition) => string;
  activeEntries: DataItem[];
  margins?: [number, number, number, number];
  onSelect?: (data: DataItem) => void;
  onActivate?: (data: DataItem) => void;
  onDeactivate?: (data: DataItem) => void;
  onDblClick?: (event: { data: DataItem; nativeEvent: React.MouseEvent }) => void;
}

function PieChartInner({
  data,
  width,
  height,
  colorScheme,
  customColors,
  showLabels,
  labelFormatting,
  trimLabels,
  maxLabelLength,
  showLegend,
  legendTitle,
  legendPosition,
  doughnut,
  arcWidth,
  explodeSlices,
  gradient,
  animated,
  tooltipDisabled,
  tooltipTemplate,
  tooltipText,
  activeEntries,
  margins,
  onSelect,
  onActivate,
  onDeactivate,
  onDblClick,
}: PieChartInnerProps) {
  // Calculate pie dimensions
  const pieData = usePieChart({
    data,
    width,
    height,
    showLabels,
    doughnut,
    arcWidth,
    explodeSlices,
    showLegend,
    legendPosition,
    colorScheme,
    customColors,
    margins,
  });

  // Handle legend label click
  const handleLegendClick = useCallback(
    (label: string) => {
      const item = data.find((d) => String(d.name) === label);
      if (item) {
        onSelect?.(item);
      }
    },
    [data, onSelect]
  );

  // Handle legend label activate
  const handleLegendActivate = useCallback(
    (item: { name: string }) => {
      const dataItem = data.find((d) => String(d.name) === item.name);
      if (dataItem) {
        onActivate?.(dataItem);
      }
    },
    [data, onActivate]
  );

  // Handle legend label deactivate
  const handleLegendDeactivate = useCallback(
    (item: { name: string }) => {
      const dataItem = data.find((d) => String(d.name) === item.name);
      if (dataItem) {
        onDeactivate?.(dataItem);
      }
    },
    [data, onDeactivate]
  );

  // Sort data according to domain
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      return pieData.domain.indexOf(String(a.name)) - pieData.domain.indexOf(String(b.name));
    });
  }, [data, pieData.domain]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* Chart SVG */}
      <svg
        width={width}
        height={height}
        className="ngx-charts"
        style={{ display: 'block', overflow: 'visible' }}
        role="img"
        aria-label="Pie chart"
      >
        <g transform={pieData.translation} className="pie-chart chart">
          <PieSeries
            colors={pieData.colors}
            series={sortedData}
            innerRadius={pieData.innerRadius}
            outerRadius={pieData.outerRadius}
            explodeSlices={explodeSlices}
            showLabels={showLabels}
            gradient={gradient}
            activeEntries={activeEntries}
            labelFormatting={labelFormatting}
            trimLabels={trimLabels}
            maxLabelLength={maxLabelLength}
            tooltipText={tooltipText}
            tooltipDisabled={tooltipDisabled}
            tooltipTemplate={tooltipTemplate}
            animations={animated}
            onSelect={onSelect}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onDblClick={onDblClick}
          />
        </g>
      </svg>

      {/* Legend */}
      {showLegend && (
        <Legend
          data={pieData.domain}
          title={legendTitle}
          colors={pieData.colors}
          height={height}
          activeEntries={activeEntries.map((d) => ({ name: String(d.name) }))}
          onLabelClick={handleLegendClick}
          onLabelActivate={handleLegendActivate}
          onLabelDeactivate={handleLegendDeactivate}
        />
      )}
    </div>
  );
}
