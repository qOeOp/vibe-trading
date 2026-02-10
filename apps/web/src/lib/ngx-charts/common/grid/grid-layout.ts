/**
 * @fileoverview Grid layout helper utilities
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/grid-layout.helper.ts
 *
 * @description
 * Helper functions for calculating grid layouts.
 * Used by pie-grid, number-card, and other grid-based charts.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

import { scaleBand } from 'd3-scale';
import type { ViewDimensions, StringOrNumberOrDate } from '../../types';

/**
 * Grid item representing a positioned cell in the grid
 */
export interface GridItem {
  /** Data associated with this grid cell */
  data: GridData;
  /** Height of the cell */
  height: number;
  /** Width of the cell */
  width: number;
  /** X coordinate of the cell */
  x: number;
  /** Y coordinate of the cell */
  y: number;
}

/**
 * Grid data for a single cell
 */
export interface GridData {
  /** Additional metadata */
  extra?: unknown;
  /** Display label */
  label: string;
  /** Data item name */
  name: StringOrNumberOrDate;
  /** Percentage of total value */
  percent: number;
  /** Total value across all items */
  total: number;
  /** Value for this item */
  value: number;
}

/**
 * Calculates the optimal number of columns and rows for a grid
 *
 * @param dims - View dimensions
 * @param len - Number of items to display
 * @param minWidth - Minimum width per cell
 * @returns Tuple of [columns, rows]
 *
 * @example
 * ```ts
 * const [cols, rows] = gridSize({ width: 800, height: 400 }, 12, 150);
 * // Returns [5, 3] for example
 * ```
 */
export function gridSize(
  dims: ViewDimensions,
  len: number,
  minWidth: number
): [number, number] {
  let rows = 1;
  let cols = len;
  const width = dims.width;

  if (width > minWidth) {
    while (width / cols < minWidth) {
      rows += 1;
      cols = Math.ceil(len / rows);
    }
  }

  return [cols, rows];
}

/**
 * Calculates total value from data items
 */
function getTotal(results: Array<{ value?: number } | null | undefined>): number {
  return results
    .map((d) => (d ? d.value ?? 0 : 0))
    .reduce((sum, val) => sum + val, 0);
}

/**
 * Generates a grid layout for items
 *
 * Creates a responsive grid layout using D3 band scales.
 * Used by pie-grid and number-card charts.
 *
 * @param dims - View dimensions
 * @param data - Data items to layout
 * @param minWidth - Minimum width per cell
 * @param designatedTotal - Optional pre-calculated total (overrides auto-calculation)
 * @returns Array of positioned grid items
 *
 * @example
 * ```ts
 * const items = gridLayout(
 *   { width: 800, height: 400 },
 *   [
 *     { name: 'A', value: 100, label: 'Item A' },
 *     { name: 'B', value: 200, label: 'Item B' },
 *   ],
 *   150,
 *   300
 * );
 * ```
 */
export function gridLayout(
  dims: ViewDimensions,
  data: Array<Partial<GridData>>,
  minWidth: number,
  designatedTotal?: number
): GridItem[] {
  const xScale = scaleBand<number>();
  const yScale = scaleBand<number>();
  const width = dims.width;
  const height = dims.height;

  const [columns, rows] = gridSize(dims, data.length, minWidth);

  const xDomain: number[] = [];
  const yDomain: number[] = [];
  for (let i = 0; i < rows; i++) {
    yDomain.push(i);
  }
  for (let i = 0; i < columns; i++) {
    xDomain.push(i);
  }
  xScale.domain(xDomain);
  yScale.domain(yDomain);

  xScale.rangeRound([0, width]).padding(0.1);
  yScale.rangeRound([0, height]).padding(0.1);

  const result: GridItem[] = [];
  const total = designatedTotal ?? getTotal(data);
  const cardWidth = xScale.bandwidth();
  const cardHeight = yScale.bandwidth();

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const value = item?.value ?? 0;

    result[i] = {
      data: {
        name: item?.name ?? '',
        value,
        extra: item?.extra,
        label: item?.label ?? '',
        percent: total > 0 ? value / total : 0,
        total,
      },
      x: xScale(i % columns) ?? 0,
      y: yScale(Math.floor(i / columns)) ?? 0,
      width: cardWidth,
      height: cardHeight,
    };
  }

  return result;
}
