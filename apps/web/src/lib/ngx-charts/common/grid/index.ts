/**
 * @fileoverview Grid components exports
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 *
 * @description
 * Exports for grid-related components and utilities.
 * Includes grid panels for alternating backgrounds and grid lines.
 *
 * @license MIT
 */

// Grid panel components
export { GridPanel } from './grid-panel';
export type { GridPanelProps } from './grid-panel';

export { GridPanelSeries, GridPanelClass } from './grid-panel-series';
export type {
  GridPanelSeriesProps,
  GridPanelData,
  GridDataItem,
} from './grid-panel-series';

// Grid lines components
export {
  GridLines,
  VerticalGridLines,
  HorizontalGridLines,
} from './grid-lines';
export type {
  GridLinesProps,
  VerticalGridLinesProps,
  HorizontalGridLinesProps,
} from './grid-lines';

// Grid layout utilities
export { gridSize, gridLayout } from './grid-layout';
export type { GridItem, GridData } from './grid-layout';
