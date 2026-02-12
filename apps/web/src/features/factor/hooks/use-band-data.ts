'use client';

import { useMemo } from 'react';
import type { DailyReturn, Strategy } from '../data/polar-calendar-data';
import type { BandDataPoint, BandData, OverlaySeries, AuxiliaryLine } from '@/lib/ngx-charts/band-chart';

type DataItem = { name: string; value: number };

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] * (hi - idx) + sorted[hi] * (idx - lo);
}

export interface BaselineData {
  daily: DataItem[];
  monthly: DataItem[];
}

export interface UseBandDataResult {
  bandData: BandData;
  overlay: OverlaySeries | null;
  auxiliaryLines: AuxiliaryLine[];
  /** Market index baseline (mock: derived from band median) */
  baseline: BaselineData;
  /** Excess return (strategy − baseline), only when a strategy is selected */
  excessReturn: DataItem[] | null;
}

export function useBandData(
  dailyReturns: DailyReturn[],
  strategies: Strategy[],
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

  // Build overlay series for the selected strategy only (click-lock).
  // Hover no longer triggers overlay — the band chart stays in default mode
  // until a strategy is explicitly selected via the leaderboard.
  const highlightId = selectedStrategyId;

  const overlay = useMemo((): OverlaySeries | null => {
    if (!highlightId) return null;
    const strat = strategies.find((s) => s.id === highlightId);
    if (!strat) return null;

    const series: DataItem[] = [];
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

  // Baseline: mock from band median (daily + monthly samples)
  const baseline = useMemo((): BaselineData => {
    if (bandData.length === 0) return { daily: [], monthly: [] };

    const daily: DataItem[] = bandData.map((d) => ({ name: d.name, value: d.median }));

    // Monthly: sample last trading day of each calendar month
    const monthly: DataItem[] = [];
    for (let i = 0; i < bandData.length; i++) {
      const parts = bandData[i].name.split('-');
      const month = parts.length > 1 ? parseInt(parts[1], 10) : -1;
      const nextParts = i < bandData.length - 1 ? bandData[i + 1].name.split('-') : [];
      const nextMonth = nextParts.length > 1 ? parseInt(nextParts[1], 10) : -1;

      if (month !== nextMonth || i === bandData.length - 1) {
        monthly.push({ name: bandData[i].name, value: bandData[i].median });
      }
    }

    return { daily, monthly };
  }, [bandData]);

  // Excess return: strategy − baseline (only positive values kept for display)
  const excessReturn = useMemo((): DataItem[] | null => {
    if (!overlay || baseline.daily.length === 0) return null;

    // Build lookup for baseline values
    const baselineMap = new Map<string, number>();
    for (const d of baseline.daily) {
      baselineMap.set(d.name, d.value);
    }

    return overlay.series.map((pt) => {
      const baseVal = baselineMap.get(pt.name) ?? 0;
      return { name: pt.name, value: pt.value - baseVal };
    });
  }, [overlay, baseline.daily]);

  return { bandData, overlay, auxiliaryLines, baseline, excessReturn };
}
