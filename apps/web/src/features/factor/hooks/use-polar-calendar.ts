"use client";

import { useState, useMemo, useCallback } from "react";
import {
  getPolarCalendarData,
  getAnnualLeaderboard,
  getMonthDailyReturns,
} from "../data/polar-calendar-data";
import type {
  PolarCalendarDataset,
  RankedStrategy,
  MonthSlice,
  DailyReturn,
} from "../data/polar-calendar-data";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export interface PolarCalendarState {
  // Data
  dataset: PolarCalendarDataset;
  months: MonthSlice[];
  leaderboard: RankedStrategy[];
  detailDailyReturns: DailyReturn[];
  detailMonthLabel: string;

  // Core state
  activeYear: number;
  selectedMonth: number | null;
  hoverStrategyId: string | null;
  selectedStrategyId: string | null;

  // Actions
  setActiveYear: (year: number) => void;
  setSelectedMonth: (month: number | null) => void;
  setHoverStrategyId: (id: string | null) => void;
  setSelectedStrategyId: (id: string) => void;
}

export function usePolarCalendar(): PolarCalendarState {
  const dataset = useMemo(() => getPolarCalendarData(), []);
  const [activeYear, setActiveYear] = useState(dataset.years[dataset.years.length - 1]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [hoverStrategyId, setHoverStrategyId] = useState<string | null>(null);
  const [selectedStrategyId, setSelectedStrategyIdRaw] = useState<string | null>(null);

  const months = useMemo(() => {
    const yd = dataset.yearData[activeYear];
    return yd ? yd.months : [];
  }, [dataset, activeYear]);

  const leaderboard = useMemo(
    () => getAnnualLeaderboard(dataset, activeYear),
    [dataset, activeYear]
  );

  // Toggle selection: click same strategy → deselect (unlock), click different → switch
  const setSelectedStrategyId = useCallback((id: string) => {
    setSelectedStrategyIdRaw((prev) => (prev === id ? null : id));
  }, []);

  // Detail chart data — show selected month, or full year if no month selected
  // When a month is selected, re-baseline returns to the start of that month
  // so the chart shows within-month variation (starting from 0%) instead of
  // cumulative year-to-date values that compress the visible range.
  const detailDailyReturns = useMemo(() => {
    if (selectedMonth !== null) {
      const raw = getMonthDailyReturns(dataset, activeYear, selectedMonth);
      if (raw.length === 0) return raw;

      // Subtract first day's values to re-baseline to 0
      const baseline = raw[0].values;
      return raw.map((dr) => {
        const rebased: Record<string, number> = {};
        for (const key of Object.keys(dr.values)) {
          rebased[key] = +((dr.values[key] ?? 0) - (baseline[key] ?? 0)).toFixed(2);
        }
        return { ...dr, values: rebased };
      });
    }
    // Show full year
    const yd = dataset.yearData[activeYear];
    return yd ? yd.dailyReturns : [];
  }, [dataset, activeYear, selectedMonth]);

  const detailMonthLabel = useMemo(() => {
    if (selectedMonth !== null) {
      return `${MONTH_LABELS[selectedMonth]} ${activeYear}`;
    }
    return `${activeYear} Full Year`;
  }, [activeYear, selectedMonth]);

  return {
    dataset,
    months,
    leaderboard,
    detailDailyReturns,
    detailMonthLabel,
    activeYear,
    selectedMonth,
    hoverStrategyId,
    selectedStrategyId,
    setActiveYear,
    setSelectedMonth,
    setHoverStrategyId,
    setSelectedStrategyId,
  };
}
