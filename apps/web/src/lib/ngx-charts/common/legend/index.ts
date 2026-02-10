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

export { LegendEntry, type LegendEntryProps } from './legend-entry';
export { Legend, type LegendProps, type LegendEntryData, type ActiveEntry } from './legend';
export {
  AdvancedLegend,
  type AdvancedLegendProps,
  type AdvancedLegendItem,
} from './advanced-legend';
export { ScaleLegend, type ScaleLegendProps, type ColorScale } from './scale-legend';
