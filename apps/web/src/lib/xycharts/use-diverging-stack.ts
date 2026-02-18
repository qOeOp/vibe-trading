/**
 * @fileoverview Data transformation hook for diverging bar stack with optional monotonicity severity
 *
 * @description
 * Transforms raw series curves (arbitrary N) into diverging bar stack data.
 * Core logic:
 * 1. Compute deltas (value - baseline) for each series at each timestep
 * 2. Optionally detect monotonicity violations (series[N-1] ≥ ... ≥ series[0])
 * 3. Optionally compute severity scores using gap-squared weighted pairwise comparisons
 */

import { useMemo } from 'react';
import type { DivergingBarDatum } from './types';
import { computeRawSeverity } from './severity';

/**
 * Check if deltas satisfy non-decreasing order:
 * delta[N-1] >= ... >= delta[1] >= delta[0]
 */
function checkMonotonicity(deltas: number[]): boolean {
  for (let i = 1; i < deltas.length; i++) {
    if (deltas[i] < deltas[i - 1]) return false;
  }
  return true;
}

/**
 * Hook: transform raw series curves into diverging bar stack data.
 *
 * @param curves - N arrays of values, each with M timesteps
 * @param baseline - Reference value (default 1.0 for NAV, 0 for turnover)
 * @param enableSeverity - Whether to compute monotonicity severity (default true)
 * @returns Array of DivergingBarDatum, one per timestep
 */
export function useDivergingStackData(
  curves: number[][],
  baseline = 1.0,
  enableSeverity = true,
): DivergingBarDatum[] {
  return useMemo(() => {
    if (!curves || curves.length === 0 || curves[0].length === 0) return [];

    const N = curves.length;
    const numSteps = curves[0].length;

    // First pass: compute deltas, monotonicity, and raw severity scores
    const rawData: Array<{
      t: number;
      deltas: number[];
      isMonotonic: boolean;
      rawSeverity: number;
    }> = [];

    let maxRawSeverity = 0;

    for (let t = 0; t < numSteps; t++) {
      const deltas: number[] = [];
      for (let q = 0; q < N; q++) {
        deltas.push(curves[q][t] - baseline);
      }

      const isMonotonic = checkMonotonicity(deltas);
      const rawSeverity = enableSeverity ? computeRawSeverity(deltas) : 0;
      maxRawSeverity = Math.max(maxRawSeverity, rawSeverity);

      rawData.push({ t, deltas, isMonotonic, rawSeverity });
    }

    // Second pass: normalize severity to [0, 1]
    return rawData.map((d) => ({
      t: d.t,
      deltas: d.deltas,
      isMonotonic: d.isMonotonic,
      severity: maxRawSeverity > 0 ? d.rawSeverity / maxRawSeverity : 0,
    }));
  }, [curves, baseline, enableSeverity]);
}

/**
 * Compute the global domain for the Y axis.
 * Returns [min, max] covering the actual data range of all series.
 * Adds a small padding (5%) for visual breathing room.
 */
export function useDivergingDomain(
  data: DivergingBarDatum[],
): [number, number] {
  return useMemo(() => {
    if (data.length === 0) return [-0.1, 0.1];

    let minDelta = 0;
    let maxDelta = 0;

    for (const datum of data) {
      for (const d of datum.deltas) {
        minDelta = Math.min(minDelta, d);
        maxDelta = Math.max(maxDelta, d);
      }
    }

    // Small padding for visual breathing room
    const range = maxDelta - minDelta || 0.01;
    const pad = range * 0.05;

    return [minDelta - pad, maxDelta + pad];
  }, [data]);
}
