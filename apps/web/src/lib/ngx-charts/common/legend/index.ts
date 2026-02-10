/**
 * @fileoverview Legend component exports
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 *
 * @description
 * Unified exports for all legend components.
 * Includes basic legend, advanced legend with totals/percentages,
 * individual legend entries, and scale legend for continuous data.
 *
 * @license MIT
 */

export { LegendEntry } from './legend-entry';
export type { LegendEntryProps } from './legend-entry';
export { Legend } from './legend';
export type { LegendProps, LegendEntryData, ActiveEntry } from './legend';
export {
  AdvancedLegend,
} from './advanced-legend';
export type {
  AdvancedLegendProps,
  AdvancedLegendItem,
} from './advanced-legend';
export { ScaleLegend } from './scale-legend';
export type { ScaleLegendProps, ColorScale } from './scale-legend';
