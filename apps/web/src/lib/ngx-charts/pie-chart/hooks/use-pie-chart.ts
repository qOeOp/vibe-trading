/**
 * @fileoverview Pie Chart Hook
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/pie-chart/pie-chart.component.ts
 *
 * @description
 * React hook for pie chart calculations including dimensions, radii, and data processing.
 * Handles pie/doughnut layout, label positioning, and color mapping.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

import { useMemo } from 'react';
import { pie, arc, PieArcDatum } from 'd3-shape';
import { max } from 'd3-array';
import type { DataItem, ColorScheme, ViewDimensions } from '../../types';
import { ColorHelper, calculateViewDimensions, formatLabel } from '../../utils';
import { ScaleType, LegendPosition } from '../../types';

/** Configuration for the pie chart hook */
export interface UsePieChartConfig {
  /** Chart data */
  data: DataItem[];
  /** Chart width */
  width: number;
  /** Chart height */
  height: number;
  /** Show labels outside the pie */
  showLabels?: boolean;
  /** Enable doughnut mode (hollow center) */
  doughnut?: boolean;
  /** Arc width for doughnut mode (0-1) */
  arcWidth?: number;
  /** Explode slices outward based on value */
  explodeSlices?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Color scheme */
  colorScheme: string | ColorScheme;
  /** Custom colors */
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Margins [top, right, bottom, left] */
  margins?: [number, number, number, number];
}

/** Processed arc data for rendering */
export interface ProcessedArc {
  data: DataItem;
  startAngle: number;
  endAngle: number;
  padAngle: number;
  value: number;
  index: number;
  pos: [number, number];
  label: string;
  color: string;
}

/** Output of the pie chart hook */
export interface UsePieChartResult {
  /** Processed arc data */
  arcs: ProcessedArc[];
  /** Center translation transform */
  translation: string;
  /** Outer radius of the pie */
  outerRadius: number;
  /** Inner radius (0 for pie, >0 for doughnut) */
  innerRadius: number;
  /** Maximum value in data */
  maxValue: number;
  /** Color helper instance */
  colors: ColorHelper;
  /** Domain (labels) for legend */
  domain: string[];
  /** View dimensions after accounting for legend */
  dims: ViewDimensions;
  /** Chart dimensions */
  chartWidth: number;
  chartHeight: number;
}

/**
 * Hook for pie chart calculations
 */
export function usePieChart({
  data,
  width,
  height,
  showLabels = false,
  doughnut = false,
  arcWidth = 0.25,
  explodeSlices: _explodeSlices = false,
  showLegend = false,
  legendPosition = LegendPosition.Right,
  colorScheme,
  customColors,
  margins: providedMargins,
}: UsePieChartConfig): UsePieChartResult {
  return useMemo(() => {
    let margins: [number, number, number, number];
    if (providedMargins && providedMargins.length === 4) {
      margins = providedMargins;
    } else if (showLabels) {
      margins = [30, 80, 30, 80];
    } else {
      margins = [20, 20, 20, 20];
    }

    const dims = calculateViewDimensions({
      width,
      height,
      margins,
      showLegend,
      legendPosition,
    });

    const xOffset = margins[3] + dims.width / 2;
    const yOffset = margins[0] + dims.height / 2;
    const translation = `translate(${xOffset}, ${yOffset})`;

    let outerRadius = Math.min(dims.width, dims.height);
    if (showLabels) {
      outerRadius /= 3;
    } else {
      outerRadius /= 2;
    }

    let innerRadius = 0;
    if (doughnut) {
      innerRadius = outerRadius * (1 - arcWidth);
    }

    const domain = data.map((d) => formatLabel(d.name));

    const sortedData = [...data].sort((a, b) => {
      return domain.indexOf(formatLabel(a.name)) - domain.indexOf(formatLabel(b.name));
    });

    const colors = new ColorHelper({
      scheme: colorScheme,
      scaleType: ScaleType.Ordinal,
      domain,
      customColors,
    });

    const pieGenerator = pie<DataItem>()
      .value((d) => d.value)
      .sort(null);

    const arcData = pieGenerator(sortedData);
    const maxValue = max(arcData, (d) => d.value) ?? 0;

    const factor = 1.5;
    const outerArcGen = arc<PieArcDatum<DataItem>>()
      .innerRadius(outerRadius * factor)
      .outerRadius(outerRadius * factor);

    const arcs: ProcessedArc[] = arcData.map((d, index) => {
      const label = formatLabel(d.data.name);
      const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;

      const pos: [number, number] = outerArcGen.centroid(d) as [number, number];
      pos[0] = factor * outerRadius * (midAngle < Math.PI ? 1 : -1);

      return {
        data: d.data,
        startAngle: d.startAngle,
        endAngle: d.endAngle,
        padAngle: d.padAngle ?? 0,
        value: d.value,
        index,
        pos,
        label,
        color: colors.getColor(label),
      };
    });

    if (showLabels) {
      const minDistance = 10;
      for (let i = 0; i < arcs.length - 1; i++) {
        const a = arcs[i];
        for (let j = i + 1; j < arcs.length; j++) {
          const b = arcs[j];
          // If they're on the same side
          if (b.pos[0] * a.pos[0] > 0) {
            // If they're overlapping
            const o = minDistance - Math.abs(b.pos[1] - a.pos[1]);
            if (o > 0) {
              // Push the second up or down
              b.pos[1] += Math.sign(b.pos[0]) * o;
            }
          }
        }
      }
    }

    return {
      arcs,
      translation,
      outerRadius,
      innerRadius,
      maxValue,
      colors,
      domain,
      dims,
      chartWidth: width,
      chartHeight: height,
    };
  }, [
    data,
    width,
    height,
    showLabels,
    doughnut,
    arcWidth,
    showLegend,
    legendPosition,
    colorScheme,
    customColors,
    providedMargins,
  ]);
}

/**
 * Hook for calculating grid layout
 */
export interface GridCell {
  x: number;
  y: number;
  width: number;
  height: number;
  data: DataItem & { percent: number; total: number };
}

export interface UseGridLayoutConfig {
  data: DataItem[];
  width: number;
  height: number;
  minWidth?: number;
  designatedTotal?: number;
}

export function useGridLayout({
  data,
  width,
  height,
  minWidth = 150,
  designatedTotal,
}: UseGridLayoutConfig): GridCell[] {
  return useMemo(() => {
    const total = designatedTotal ?? data.reduce((sum, d) => sum + d.value, 0);
    const numCells = data.length;

    const columns = Math.max(1, Math.floor(width / minWidth));
    const rows = Math.ceil(numCells / columns);
    const cellWidth = width / columns;
    const cellHeight = height / rows;

    return data.map((d, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const percent = total > 0 ? (d.value / total) * 100 : 0;

      return {
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
        data: {
          ...d,
          percent,
          total: d.value,
        },
      };
    });
  }, [data, width, height, minWidth, designatedTotal]);
}
