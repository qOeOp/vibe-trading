/**
 * @fileoverview Types for the xycharts diverging bar stack library
 *
 * @description
 * Purpose-built chart types for diverging stacked bar charts with
 * monotonicity detection and severity-based brush visualization.
 * Supports arbitrary N series (not limited to 5 quantiles).
 */

/**
 * Raw quantile data: 5 cumulative return curves (Q1-Q5), each with N time steps.
 * @deprecated Use `number[][]` directly — the library now supports arbitrary N series.
 */
export type QuantileCurves = [number[], number[], number[], number[], number[]];

/** Single time step after processing */
export interface DivergingBarDatum {
  /** Time step index */
  t: number;
  /** Delta values (value - baseline) for each series, used for main bars */
  deltas: number[];
  /** Whether deltas satisfy non-decreasing order at this timestep */
  isMonotonic: boolean;
  /** Normalized monotonicity violation severity [0, 1]. 0 = monotonic, 1 = worst violation in history */
  severity: number;
}

/** Single bar datum for the severity brush mini-chart */
export interface BrushBarDatum {
  /** Time step index */
  t: number;
  /** Normalized severity [0, 1] */
  severity: number;
  /** Grayscale fill color derived from severity */
  fill: string;
  /** Normalized bar height [0, 1] based on |Q5 - Q1| spread */
  normalizedHeight: number;
}

/** Brush selection range (inclusive timestep indices) */
export interface BrushRange {
  startT: number;
  endT: number;
}

/** A horizontal reference line rendered at a specific Y value */
export interface ReferenceLine {
  /** The Y-axis value where the line should be drawn (in delta space, i.e. after baseline subtraction) */
  value: number;
  /** Line color (default: '#2563eb' — royal blue, visible above both red/green bars and gray zero line) */
  color?: string;
  /** Line opacity (default: 1.0 — fully opaque for maximum visibility) */
  opacity?: number;
  /** Stroke dash array (default: '4 2' for dashed; use '' for solid) */
  strokeDasharray?: string;
  /** Line width (default: 0.75 — thin to avoid distracting from bar data) */
  strokeWidth?: number;
}

/** Crosshair tooltip info emitted on hover */
export interface CrosshairInfo {
  /** Time step index */
  t: number;
  /** Delta values for each series at this timestep */
  deltas: number[];
  /** Pixel X position (snapped to bar center) */
  x: number;
  /** Pixel Y position (at mouse or snapped value) */
  y: number;
}

/** Chart margin configuration */
export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
