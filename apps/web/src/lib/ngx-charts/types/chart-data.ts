/**
 * @fileoverview Chart data type definitions
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/models/chart-data.model.ts
 *
 * @description
 * Core data types for all chart components.
 * Migrated from Angular ngx-charts library.
 * Unused types are retained for completeness.
 *
 * @license MIT
 */

import type { Vector2D } from './coordinates';

/** Base type for chart data item names */
export type StringOrNumberOrDate = string | number | Date;

/** Basic data item with name and value */
export interface DataItem {
  name: StringOrNumberOrDate;
  value: number;
  extra?: unknown;
  min?: number;
  max?: number;
  label?: string;
}

/** Single series is an array of data items */
export type SingleSeries = DataItem[];

/** Series with a name containing multiple data items */
export interface Series {
  name: StringOrNumberOrDate;
  series: DataItem[];
}

/** Multiple series data */
export type MultiSeries = Series[];

/** Area chart specific data item with d0/d1 for stacking */
export interface AreaChartDataItem extends DataItem {
  d0: number;
  d1: number;
}

/** Area chart series */
export interface AreaChartSeries {
  name: StringOrNumberOrDate;
  series: AreaChartDataItem[];
}

/** Pie grid data for pie grid charts */
export interface PieGridData {
  data: PieGridDataItem;
  height: number;
  width: number;
  x: number;
  y: number;
}

/** Pie grid data item with percentage */
export interface PieGridDataItem extends DataItem {
  percent: number;
  total: number;
  value: number;
}

/** Bubble chart data item with x, y, r coordinates */
export interface BubbleChartDataItem {
  name: StringOrNumberOrDate;
  x: StringOrNumberOrDate;
  y: StringOrNumberOrDate;
  r: number;
  extra?: unknown;
}

/** Bubble chart series */
export interface BubbleChartSeries {
  name: StringOrNumberOrDate;
  series: BubbleChartDataItem[];
}

/** Multiple bubble chart series */
export type BubbleChartMultiSeries = BubbleChartSeries[];

/** Tree map data item with optional children */
export interface TreeMapDataItem {
  name: StringOrNumberOrDate;
  size?: number;
  children?: TreeMapDataItem[];
  extra?: unknown;
}

/** Tree map data */
export type TreeMapData = TreeMapDataItem[];

/** Sankey diagram data object */
export interface SankeyObject {
  source: string;
  target: string;
  value: number;
}

/** Sankey diagram data */
export type SankeyData = SankeyObject[];

/** Box chart series */
export interface BoxChartSeries {
  name: StringOrNumberOrDate;
  series: DataItem[];
}

/** Multiple box chart series */
export type BoxChartMultiSeries = BoxChartSeries[];

/** Box model for box chart rendering */
export interface BoxModel {
  value: number | Date;
  label: StringOrNumberOrDate;
  data: DataItem[];
  formattedLabel: string;
  height: number;
  width: number;
  x: number;
  y: number;
  roundEdges: boolean;
  lineCoordinates: Vector2D[];
  quartiles: number[];
  tooltipText?: string;
  ariaLabel?: string;
  color?: string;
  gradientStops?: Array<{ offset: number; color: string; opacity: number }>;
}

/** Gauge arc data */
export interface GaugeArc {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  cornerRadius: number;
  data: {
    name: StringOrNumberOrDate;
    value: number;
  };
}

/** Pie arc data for pie charts */
export interface PieArcData {
  data: DataItem;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  index: number;
  color: string;
  label: string;
  tooltipText: string;
  pos: [number, number];
  pointerPos?: [number, number];
}

/** Heat map cell data */
export interface HeatMapCell {
  row: StringOrNumberOrDate;
  col: StringOrNumberOrDate;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  tooltipText: string;
}
