/**
 * @fileoverview Number Card types
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 *
 * @license MIT
 */

import type { StringOrNumberOrDate } from '../types';

export interface GridItem {
  data: GridData;
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface GridData {
  extra?: unknown;
  label?: string;
  name: StringOrNumberOrDate;
  percent: number;
  total: number;
  value: number;
}

export interface CardModel extends GridItem {
  color: string;
  tooltipText: string;
  textColor: string;
  bandColor: string;
  label: string;
}
