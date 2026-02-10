/**
 * @fileoverview TreeMap component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/tree-map/tree-map.component.ts
 *
 * @description
 * Tree map chart for hierarchical data visualization.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useRef } from 'react';
import { treemap, stratify } from 'd3-hierarchy';
import type { DataItem, ColorScheme, ViewDimensions } from '../types';
import { ScaleType } from '../types';
import { ColorHelper, calculateViewDimensions } from '../utils';
import { BaseChart, useChartDimensions } from '../common';
import { TreeMapCellSeries } from './tree-map-cell-series';

export interface TreeMapProps {
  /** Chart data */
  data: DataItem[];
  /** Fixed width */
  width?: number;
  /** Fixed height */
  height?: number;
  /** Color scheme */
  colorScheme?: string | ColorScheme;
  /** Custom colors */
  colors?: Array<{ name: string; value: string }>;
  /** Enable gradient fills */
  gradient?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Disable tooltips */
  tooltipDisabled?: boolean;
  /** Value formatting function */
  valueFormatting?: (value: number) => string;
  /** Label formatting function */
  labelFormatting?: (cell: { data: DataItem; label: string; value: number }) => string;
  /** Selection callback */
  onSelect?: (data: DataItem) => void;
  /** Custom class name */
  className?: string;
}

export function TreeMap({
  data,
  width: fixedWidth,
  height: fixedHeight,
  colorScheme = 'cool',
  colors: customColors,
  gradient = false,
  animated = true,
  tooltipDisabled = false,
  valueFormatting,
  labelFormatting,
  onSelect,
  className = '',
}: TreeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartDimensions(
    containerRef as React.RefObject<HTMLElement>,
    fixedWidth,
    fixedHeight
  );

  const margin = useMemo<[number, number, number, number]>(() => [10, 10, 10, 10], []);

  const dims: ViewDimensions = useMemo(() => {
    return calculateViewDimensions({
      width,
      height,
      margins: margin,
    });
  }, [width, height, margin]);

  const domain = useMemo(() => {
    return data.map((d) => d.name);
  }, [data]);

  const colorHelper = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: ScaleType.Ordinal,
      domain: domain.map(String),
      customColors,
    });
  }, [colorScheme, domain, customColors]);

  const treemapData = useMemo(() => {
    if (!data || data.length === 0) return null;

    type TreeMapNodeInput = DataItem & { isRoot?: boolean };

    const treemapLayout = treemap<TreeMapNodeInput>()
      .size([dims.width, dims.height])
      .paddingInner(1);

    const rootNode: TreeMapNodeInput = {
      name: 'root',
      value: 0,
      isRoot: true,
    };

    try {
      const root = stratify<TreeMapNodeInput>()
        .id((d) => {
          let label = d.name;
          if (label instanceof Date) {
            label = label.toLocaleDateString();
          } else if (label !== undefined && label !== null) {
            label = String(label);
          }
          return label;
        })
        .parentId((d) => (d.isRoot ? null : 'root'))([rootNode, ...data])
        .sum((d) => d.value || 0);

      return treemapLayout(root);
    } catch (e) {
      console.error('TreeMap layout error:', e);
      return null;
    }
  }, [data, dims.width, dims.height]);

  const transform = `translate(${dims.xOffset || margin[3]}, ${margin[0]})`;

  return (
    <BaseChart
      ref={containerRef}
      width={fixedWidth}
      height={fixedHeight}
      animated={animated}
      className={`ngx-charts-tree-map ${className}`}
    >
      <svg width={width} height={height} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}>
        <g transform={transform} className="tree-map chart">
          {treemapData && (
            <TreeMapCellSeries
              data={treemapData}
              dims={dims}
              colors={colorHelper}
              valueFormatting={valueFormatting}
              labelFormatting={labelFormatting}
              gradient={gradient}
              animated={animated}
              tooltipDisabled={tooltipDisabled}
              onSelect={onSelect}
            />
          )}
        </g>
      </svg>
    </BaseChart>
  );
}
