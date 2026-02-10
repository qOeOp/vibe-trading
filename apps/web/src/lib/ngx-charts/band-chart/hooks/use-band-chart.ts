'use client';

import { useMemo, useCallback, useState } from 'react';
import { scaleLinear, scalePoint, ScaleLinear, ScalePoint } from 'd3-scale';

import { ViewDimensions } from '../../types';
import { calculateViewDimensions, ViewDimensionsConfig } from '../../utils';

/* ── Public types ────────────────────────────────────────────── */

export interface BandDataPoint {
  name: string;  // X value (date string or label)
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export type BandData = BandDataPoint[];

export interface OverlaySeries {
  name: string;
  color: string;
  series: Array<{ name: string; value: number }>;
}

export interface BandConfig {
  color?: string;           // RGB base, default "99, 102, 241"
  outerOpacity?: number;    // min-max fill, default 0.07
  innerOpacity?: number;    // q1-q3 fill, default 0.18
  medianStrokeWidth?: number; // default 2
}

export interface AuxiliaryLine {
  id: string;
  series: Array<{ name: string; value: number }>;
}

/* ── Symmetric power scale ───────────────────────────────────── */

/** sign(x) · |x|^exp — expands near zero, compresses extremes */
function symPow(x: number, exp: number): number {
  return Math.sign(x) * Math.pow(Math.abs(x), exp);
}

/** Inverse of symPow */
function symPowInv(x: number, exp: number): number {
  return Math.sign(x) * Math.pow(Math.abs(x), 1 / exp);
}

/** Round to visually clean values based on magnitude */
function niceRound(value: number): number {
  const abs = Math.abs(value);
  if (abs < 0.5) return 0;
  if (abs < 3) return Math.round(value);            // 1% precision
  if (abs < 10) return Math.round(value / 2) * 2;   // 2% precision
  return Math.round(value / 5) * 5;                 // 5% precision
}

/**
 * Generate ticks evenly spaced in the transformed (visual) space,
 * then inverse-transform and snap to nice data values.
 * Result: denser ticks near zero, sparser at extremes.
 */
function generateSymPowTicks(
  domain: [number, number],
  count: number,
  exponent: number,
): number[] {
  const [dMin, dMax] = domain;
  const tMin = symPow(dMin, exponent);
  const tMax = symPow(dMax, exponent);

  const raw: number[] = [];
  for (let i = 0; i <= count; i++) {
    const t = tMin + (i / count) * (tMax - tMin);
    raw.push(niceRound(symPowInv(t, exponent)));
  }

  // Ensure zero is included when the domain spans it
  if (dMin <= 0 && dMax >= 0 && !raw.includes(0)) {
    raw.push(0);
  }

  // Deduplicate, sort, filter to domain
  return [...new Set(raw)]
    .sort((a, b) => a - b)
    .filter((v) => v >= dMin && v <= dMax);
}

/**
 * Creates a D3-compatible scale with symmetric power transformation.
 * Near-zero values get more visual space; extremes are compressed.
 */
function createSymPowScale(
  domain: [number, number],
  range: [number, number],
  exponent: number,
): ScaleLinear<number, number> {
  const tDomain: [number, number] = [
    symPow(domain[0], exponent),
    symPow(domain[1], exponent),
  ];
  const inner = scaleLinear().domain(tDomain).range(range);

  const scale = Object.assign(
    (value: number): number => inner(symPow(value, exponent)),
    {
      range: () => range,
      domain: () => domain,
      ticks: (count: number = 10) => generateSymPowTicks(domain, count, exponent),
      tickFormat: () => (v: number) => String(v),
      copy: () => createSymPowScale(domain, range, exponent),
      nice: () => scale,
      clamp: () => scale,
      invert: (pixel: number) => symPowInv(inner.invert(pixel), exponent),
    },
  );

  return scale as unknown as ScaleLinear<number, number>;
}

/* ── Hook config ─────────────────────────────────────────────── */

export interface UseBandChartConfig {
  data: BandData;
  width: number;
  height: number;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisHeight?: number;
  yAxisWidth?: number;
  margins?: [number, number, number, number];
  /** Power exponent for Y axis (0–1). Lower = stronger magnification near zero. Default 0.6 */
  yScaleExponent?: number;
}

export interface UseBandChartResult {
  dims: ViewDimensions;
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
  xDomain: string[];
  yDomain: [number, number];
  transform: string;
  updateXAxisHeight: (height: number) => void;
  updateYAxisWidth: (width: number) => void;
}

export function useBandChart(config: UseBandChartConfig): UseBandChartResult {
  const {
    data,
    width,
    height,
    showXAxis = false,
    showYAxis = false,
    xAxisHeight: initialXAxisHeight = 30,
    yAxisWidth: initialYAxisWidth = 50,
    margins: customMargins,
    yScaleExponent = 0.6,
  } = config;

  const [xAxisHeight, setXAxisHeight] = useState(initialXAxisHeight);
  const [yAxisWidth, setYAxisWidth] = useState(initialYAxisWidth);

  const margins: [number, number, number, number] = customMargins ?? [10, 24, 10, 10];

  // Calculate view dimensions
  const dims = useMemo(() => {
    const cfg: ViewDimensionsConfig = {
      width,
      height,
      margins,
      showXAxis,
      showYAxis,
      xAxisHeight,
      yAxisWidth,
      showXLabel: false,
      showYLabel: false,
      showLegend: false,
    };
    return calculateViewDimensions(cfg);
  }, [width, height, showXAxis, showYAxis, xAxisHeight, yAxisWidth, customMargins]);

  // X domain: all point names in order
  const xDomain = useMemo(() => data.map((d) => d.name), [data]);

  // Y domain: from band min/max with 10% padding
  const yDomain = useMemo((): [number, number] => {
    if (data.length === 0) return [0, 1];
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const bp of data) {
      if (bp.min < minVal) minVal = bp.min;
      if (bp.max > maxVal) maxVal = bp.max;
    }
    const range = maxVal - minVal || 1;
    return [minVal - range * 0.05, maxVal + range * 0.05];
  }, [data]);

  // X scale: scalePoint for uniform spacing (no weekend gaps)
  const xScale = useMemo(() => {
    return scalePoint<string>()
      .range([0, dims.width])
      .domain(xDomain)
      .padding(0);
  }, [xDomain, dims.width]);

  // Y scale: symmetric power (magnifies near zero)
  const yScale = useMemo(() => {
    return createSymPowScale(yDomain, [dims.height, 0], yScaleExponent);
  }, [yDomain, dims.height, yScaleExponent]);

  // Transform for chart group
  const transform = useMemo(() => {
    return `translate(${dims.xOffset || 0}, ${margins[0]})`;
  }, [dims.xOffset, margins]);

  const updateXAxisHeight = useCallback((h: number) => setXAxisHeight(h), []);
  const updateYAxisWidth = useCallback((w: number) => setYAxisWidth(w), []);

  return {
    dims,
    xScale,
    yScale,
    xDomain,
    yDomain,
    transform,
    updateXAxisHeight,
    updateYAxisWidth,
  };
}
