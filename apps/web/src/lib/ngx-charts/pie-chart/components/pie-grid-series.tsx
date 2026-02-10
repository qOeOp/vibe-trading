/**
 * @fileoverview Pie Grid Series Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/pie-chart/pie-grid-series.component.ts
 *
 * @description
 * Renders a mini pie chart for pie grid cells.
 * Shows a partial arc with background arc for visual comparison.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback } from 'react';
import { PieArc } from './pie-arc';
import type { DataItem, PieGridDataItem } from '@/lib/ngx-charts/types';

/** Pie grid data structure */
export interface PieGridData {
  data: PieGridDataItem;
  height: number;
  width: number;
  x: number;
  y: number;
}

/** Processed arc for pie grid */
export interface PieGridArc {
  animate: boolean;
  class: string;
  data: PieGridDataItem;
  endAngle: number;
  fill: string;
  pointerEvents: boolean;
  startAngle: number;
}

export interface PieGridSeriesProps {
  /** Color function for the series */
  colors: (label: string) => string;
  /** Grid data items */
  data: PieGridData[];
  /** Inner radius */
  innerRadius?: number;
  /** Outer radius */
  outerRadius?: number;
  /** Enable animations */
  animations?: boolean;
  /** Callback when arc is selected */
  onSelect?: (data: DataItem) => void;
  /** Callback when arc is activated */
  onActivate?: (data: DataItem) => void;
  /** Callback when arc is deactivated */
  onDeactivate?: (data: DataItem) => void;
}

/**
 * Pie grid series component for mini pie charts
 */
export function PieGridSeries({
  colors,
  data,
  innerRadius = 70,
  outerRadius = 80,
  animations = true,
  onSelect,
  onActivate,
  onDeactivate,
}: PieGridSeriesProps) {
  // Generate arcs from data
  // Don't use d3.pie - manually calculate angles for pie grid
  // Background (other) arc: full circle (0 to 2π)
  // Value arc: partial arc (0 to percentage * 2π)
  const arcs = useMemo((): PieGridArc[] => {
    // Calculate total value for percentage
    const totalValue = data.reduce((sum, d) => sum + d.data.value, 0);

    return data.map((item, index) => {
      const label = item.data.name as string;
      const isOther = (item.data as { other?: boolean }).other ?? false;
      const color = colors(label);

      // Calculate end angle based on percentage
      let endAngle: number;
      if (isOther) {
        // Background arc: full circle
        endAngle = Math.PI * 2;
      } else {
        // Value arc: percentage of circle
        const percent = totalValue > 0 ? item.data.value / totalValue : 0;
        endAngle = percent * Math.PI * 2;
      }

      return {
        data: item.data,
        class: `arc arc${index}`,
        fill: color,
        startAngle: 0, // Both arcs start from 0 (3 o'clock)
        endAngle,
        animate: animations && !isOther,
        pointerEvents: !isOther,
      };
    });
  }, [data, colors, animations]);

  // Handle arc selection
  const handleSelect = useCallback(
    (_data: DataItem) => {
      // Select the primary data item (first one)
      if (data.length > 0) {
        onSelect?.(data[0].data);
      }
    },
    [data, onSelect]
  );

  return (
    <g className="pie-grid-arcs">
      {arcs.map((arcItem, index) => (
        <PieArc
          key={`grid-arc-${index}`}
          startAngle={arcItem.startAngle}
          endAngle={arcItem.endAngle}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill={arcItem.fill} // Use pre-computed fill from getArcs(), don't call colors() again
          value={arcItem.data.value}
          data={arcItem.data}
          max={100}
          gradient={false}
          pointerEvents={arcItem.pointerEvents}
          animate={arcItem.animate}
          onSelect={handleSelect}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      ))}
    </g>
  );
}
