'use client';

import { useMemo } from 'react';
import type { DailyReturn, Strategy } from '../data/polar-calendar-data';
import type { BandDataPoint, BandData, OverlaySeries, AuxiliaryLine } from '@/lib/ngx-charts/band-chart';

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] * (hi - idx) + sorted[hi] * (idx - lo);
}

export interface UseBandDataResult {
  bandData: BandData;
  overlay: OverlaySeries | null;
  auxiliaryLines: AuxiliaryLine[];
}

export function useBandData(
  dailyReturns: DailyReturn[],
  strategies: Strategy[],
  hoverStrategyId: string | null,
  selectedStrategyId: string | null,
): UseBandDataResult {
  // Compute band data (min, q1, median, q3, max) for each day
  const bandData = useMemo((): BandData => {
    if (dailyReturns.length === 0 || strategies.length === 0) return [];

    return dailyReturns.map((dr): BandDataPoint => {
      const vals: number[] = [];
      for (const s of strategies) {
        const v = dr.values[s.id];
        if (v !== undefined) vals.push(v);
      }
      vals.sort((a, b) => a - b);

      return {
        name: dr.date,
        min: vals[0] ?? 0,
        q1: percentile(vals, 0.25),
        median: percentile(vals, 0.5),
        q3: percentile(vals, 0.75),
        max: vals[vals.length - 1] ?? 0,
      };
    });
  }, [dailyReturns, strategies]);

  // Build overlay series for the highlighted strategy
  // Selection (click-lock) takes priority over hover
  const highlightId = selectedStrategyId || hoverStrategyId;

  const overlay = useMemo((): OverlaySeries | null => {
    if (!highlightId) return null;
    const strat = strategies.find((s) => s.id === highlightId);
    if (!strat) return null;

    const series: Array<{ name: string; value: number }> = [];
    for (const dr of dailyReturns) {
      const v = dr.values[strat.id];
      if (v !== undefined) {
        series.push({ name: dr.date, value: v });
      }
    }
    if (series.length === 0) return null;

    return { name: strat.short, color: strat.color, series };
  }, [dailyReturns, strategies, highlightId]);

  // Build auxiliary lines for closest-Y detection
  const auxiliaryLines = useMemo((): AuxiliaryLine[] => {
    return strategies.map((s) => ({
      id: s.id,
      series: dailyReturns
        .filter((dr) => dr.values[s.id] !== undefined)
        .map((dr) => ({ name: dr.date, value: dr.values[s.id] })),
    }));
  }, [dailyReturns, strategies]);

  return { bandData, overlay, auxiliaryLines };
}
