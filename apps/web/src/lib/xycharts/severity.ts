/**
 * @fileoverview Monotonicity violation severity scoring
 *
 * @description
 * Computes how severely a timestep violates the expected ordering
 * (series[N-1] ≥ ... ≥ series[1] ≥ series[0]). Uses gap-squared weighting
 * so that distant violations are penalized far more than adjacent swaps.
 *
 * Supports arbitrary N series (not limited to 5 quantiles).
 * Pairwise comparisons: C(N,2) pairs.
 * Weight = gap² where gap = |i - j|.
 *
 * Example for N=5:
 * | Pair (i,j) | gap | Weight |
 * |------------|-----|--------|
 * | (4,0)      | 4   | 16     |
 * | (4,1)      | 3   | 9      |
 * | (3,0)      | 3   | 9      |
 * | ...        | ... | ...    |
 * | Total      |     | 50     |
 */

/**
 * Compute the raw severity score for a single timestep.
 *
 * For each pair (i > j), if delta[i] < delta[j] (violation),
 * the contribution is gap² × (delta[j] - delta[i]).
 *
 * This means the score captures both the structural distance of the
 * violation AND its magnitude.
 *
 * @param deltas - Array of delta values for each series (arbitrary length)
 * @returns Raw score ≥ 0. Zero means perfect monotonicity.
 */
export function computeRawSeverity(deltas: number[]): number {
  const n = deltas.length;
  let score = 0;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // Expected: delta[i] >= delta[j] (higher series index = higher return)
      const violation = deltas[j] - deltas[i];
      if (violation > 0) {
        const gap = i - j;
        score += gap * gap * violation;
      }
    }
  }

  return score;
}

/**
 * Normalize raw severity scores across all timesteps to [0, 1].
 *
 * - 0 = perfect monotonicity (or zero violation)
 * - 1 = the worst violation in this factor's history
 *
 * If all timesteps are monotonic, returns all zeros.
 *
 * @param allDeltas Array of delta arrays, one per timestep
 * @returns Array of normalized severity values, same length as input
 */
export function computeSeverities(
  allDeltas: number[][],
): number[] {
  const rawScores = allDeltas.map(computeRawSeverity);
  const maxScore = Math.max(...rawScores);

  if (maxScore <= 0) return rawScores.map(() => 0);

  return rawScores.map((s) => s / maxScore);
}

/**
 * Map a severity value [0, 1] to a grayscale color string.
 *
 * Uses OKLCH lightness ramp:
 *   severity = 0  → L = 0.94 ≈ #eaeaea (very light gray)
 *   severity = 0.5 → L = 0.57 ≈ mid gray
 *   severity = 1  → L = 0.20 ≈ #2d2d2d (near black)
 *
 * @returns oklch() color string
 */
export function severityToGray(severity: number): string {
  const L = 0.94 - severity * 0.74;
  return `oklch(${L.toFixed(3)} 0 0)`;
}
