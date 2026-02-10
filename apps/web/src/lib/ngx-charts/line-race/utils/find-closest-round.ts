/**
 * @fileoverview Shared mouse-position-to-round lookup for line race charts
 *
 * @description
 * Given a mouse position within the chart area, finds the closest round
 * index (X) and the closest series name (Y). Used by both line-race.tsx
 * and line-race-with-leaderboard.tsx for hover detection.
 *
 * @license MIT
 */

import type { LineRaceSeriesData } from '../hooks';

export interface ClosestResult {
  round: number;
  seriesName: string | null;
}

/**
 * Finds the closest round and series to a given mouse position.
 */
export function findClosestRound(
  xPos: number,
  yPos: number,
  xScale: (round: number) => number,
  yScale: (value: number) => number,
  currentRound: number,
  totalRounds: number,
  data: LineRaceSeriesData[],
): ClosestResult {
  let closestRound = 0;
  let minDist = Infinity;
  const maxR = Math.min(currentRound, totalRounds);

  for (let r = 0; r <= maxR; r++) {
    const dist = Math.abs(xScale(r) - xPos);
    if (dist < minDist) {
      minDist = dist;
      closestRound = r;
    }
  }

  let closestName: string | null = null;
  let minYDist = Infinity;
  for (const series of data) {
    if (closestRound < series.values.length) {
      const sy = yScale(series.values[closestRound]);
      const dy = Math.abs(sy - yPos);
      if (dy < minYDist) {
        minYDist = dy;
        closestName = series.name;
      }
    }
  }

  return { round: closestRound, seriesName: closestName };
}
