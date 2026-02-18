/**
 * @fileoverview Brush bar data transformation hook
 *
 * @description
 * Transforms DivergingBarDatum[] into BrushBarDatum[] for the severity
 * brush mini-chart. All bars have **equal height** (normalizedHeight = 1).
 * The only visual dimension is grayscale fill — darker = more severe
 * monotonicity violation.
 */

import { useMemo } from 'react';
import type { DivergingBarDatum, BrushBarDatum } from './types';
import { severityToGray } from './severity';

/**
 * Hook: compute brush bar data from diverging stack data.
 *
 * All bars are equal height. Only grayscale fill encodes severity.
 *
 * @param stackData - Processed diverging bar data with severity scores
 * @returns Array of BrushBarDatum with uniform heights and grayscale fills
 */
export function useBrushBarData(
  stackData: DivergingBarDatum[],
): BrushBarDatum[] {
  return useMemo(() => {
    if (stackData.length === 0) return [];

    return stackData.map((d) => ({
      t: d.t,
      severity: d.severity,
      fill: severityToGray(d.severity),
      normalizedHeight: 1, // equal height — color is the only channel
    }));
  }, [stackData]);
}
