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
export { Gauge, type GaugeProps } from './gauge';
export { LinearGauge, type LinearGaugeProps } from './linear-gauge';
export { GaugePercent, type GaugePercentProps } from './gauge-percent';

// Supporting components
export { GaugeArc, type GaugeArcProps, type ArcItem } from './components/gauge-arc';
export { GaugeAxis, type GaugeAxisProps } from './components/gauge-axis';

// Hooks
export { useGauge, type UseGaugeConfig, type UseGaugeResult, type GaugeArcs } from './hooks/use-gauge';
