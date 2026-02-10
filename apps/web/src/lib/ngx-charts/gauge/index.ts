/**
 * @fileoverview Gauge chart exports
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 *
 * @description
 * Re-exports all gauge chart components for the ngx-charts React library.
 * Includes radial gauge, linear gauge, and percent gauge variants.
 *
 * @license MIT
 */

// Main chart components
export { Gauge } from './gauge';
export type { GaugeProps } from './gauge';
export { LinearGauge } from './linear-gauge';
export type { LinearGaugeProps } from './linear-gauge';
export { GaugePercent } from './gauge-percent';
export type { GaugePercentProps } from './gauge-percent';

// Supporting components
export { GaugeArc } from './components/gauge-arc';
export type { GaugeArcProps, ArcItem } from './components/gauge-arc';
export { GaugeAxis } from './components/gauge-axis';
export type { GaugeAxisProps } from './components/gauge-axis';

// Hooks
export { useGauge } from './hooks/use-gauge';
export type { UseGaugeConfig, UseGaugeResult, GaugeArcs } from './hooks/use-gauge';
