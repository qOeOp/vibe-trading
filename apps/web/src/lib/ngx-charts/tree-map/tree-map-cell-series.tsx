/**
 * @fileoverview TreeMapCellSeries component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/tree-map/tree-map-cell-series.component.ts
 *
 * @description
 * Series of cells in a tree map chart.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo } from 'react';
import type { DataItem, ViewDimensions } from '../types';
import type { ColorHelper } from '../utils';
import { TreeMapCell } from './tree-map-cell';

/** D3 hierarchy node with treemap layout positions */
interface TreeMapHierarchyNode {
  children?: TreeMapHierarchyNode[];
  data?: DataItem;
  id?: string;
  value?: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/** Cell data computed from hierarchy node */
interface CellData {
  data: DataItem;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  label: string;
  value: number;
}

export interface TreeMapCellSeriesProps {
  data: TreeMapHierarchyNode; // D3 hierarchy node
  dims: ViewDimensions;
  colors: ColorHelper;
  valueFormatting?: (value: number) => string;
  labelFormatting?: (cell: { data: DataItem; label: string; value: number }) => string;
  gradient?: boolean;
  animated?: boolean;
  tooltipDisabled?: boolean;
  onSelect?: (data: DataItem) => void;
}

export function TreeMapCellSeries({
  data,
  colors,
  valueFormatting,
  labelFormatting,
  gradient = false,
  animated = true,
  onSelect,
}: TreeMapCellSeriesProps) {
  const cells = useMemo(() => {
    if (!data || !data.children) return [];

    return data.children
      .filter((child: TreeMapHierarchyNode): child is TreeMapHierarchyNode & { data: DataItem } => child.data != null)
      .map((child): CellData => {
        const label = child.id || child.data.name || '';
        const value = child.value || 0;
        const fill = colors.getColor(label);

        return {
          data: child.data,
          x: child.x0,
          y: child.y0,
          width: child.x1 - child.x0,
          height: child.y1 - child.y0,
          fill,
          label: String(label),
          value,
        };
      });
  }, [data, colors]);

  return (
    <g className="tree-map-cell-series">
      {cells.map((cell: CellData, index: number) => (
        <TreeMapCell
          key={`cell-${index}-${cell.label}`}
          data={cell.data}
          fill={cell.fill}
          x={cell.x}
          y={cell.y}
          width={cell.width}
          height={cell.height}
          label={cell.label}
          value={cell.value}
          valueFormatting={valueFormatting}
          labelFormatting={labelFormatting}
          gradient={gradient}
          animated={animated}
          onSelect={onSelect}
        />
      ))}
    </g>
  );
}
