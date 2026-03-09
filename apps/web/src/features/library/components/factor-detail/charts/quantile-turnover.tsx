'use client';

import { useMemo } from 'react';
import { PanelSection } from '@/components/shared/panel';
import { DivergingBarChart } from '@/lib/xycharts/diverging-bar-chart';
import type { BrushBarDatum, ReferenceLine } from '@/lib/xycharts';
import type { Factor } from '@/features/library/types';

/* ── Visual constants ──────────────────────────────────────── */

/** Q1=green (bottom), Q5=red (top) — A股 convention */
const TURNOVER_COLORS = ['var(--color-market-down)', 'var(--color-market-up)'];

/** 4-state classification colors for turnover brush */
const BOTH_HIGH = 'var(--color-mine-text)'; // Both extremes active (high cost)
const Q5_HIGH = 'var(--color-mine-nav-active)'; // Good quantile active (positive signal)
const Q1_HIGH = 'var(--color-mine-muted)'; // Bad quantile active (negative signal)
const BOTH_LOW = 'var(--color-mine-border-light)'; // Both extremes inactive

/* ── Custom Brush Hook ─────────────────────────────────────── */

/**
 * Classify each timestep into 4 states based on whether Q5 and Q1
 * turnover exceed the factor's baseline daily turnover rate.
 *
 * @param data - Q1 (bottom) and Q5 (top) turnover arrays
 * @param monthlyTurnover - Factor's monthly turnover percentage (e.g. 45 = 45%)
 */
function useTurnoverBrushData(
  data: { top: number[]; bottom: number[] },
  monthlyTurnover: number,
): BrushBarDatum[] {
  return useMemo(() => {
    // Convert monthly turnover % to daily: (turnover% / 100) / ~21 trading days
    const dailyBase = monthlyTurnover / 100 / 21;

    return data.top.map((topVal, t) => {
      const botVal = data.bottom[t];
      const q5High = topVal > dailyBase;
      const q1High = botVal > dailyBase;

      let fill: string;
      if (q5High && q1High) fill = BOTH_HIGH;
      else if (q5High) fill = Q5_HIGH;
      else if (q1High) fill = Q1_HIGH;
      else fill = BOTH_LOW;

      return { t, severity: 0, fill, normalizedHeight: 1 };
    });
  }, [data, monthlyTurnover]);
}

/* ── Section Export ────────────────────────────────────────── */

interface QuantileTurnoverSectionProps {
  factor: Factor;
}

export function QuantileTurnoverSection({
  factor,
}: QuantileTurnoverSectionProps) {
  const curves = useMemo(
    () => [factor.quantileTurnover.bottom, factor.quantileTurnover.top],
    [factor.quantileTurnover],
  );

  const brushData = useTurnoverBrushData(
    factor.quantileTurnover,
    factor.turnover,
  );

  // Daily baseline turnover: monthly% / 100 / ~21 trading days
  // This is already in delta space since baseline=0
  const referenceLines = useMemo<ReferenceLine[]>(
    () => [{ value: factor.turnover / 100 / 21 }],
    [factor.turnover],
  );

  return (
    <PanelSection>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-mine-muted">分位换手率</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-mine-muted mr-1">
            Q1 / Q5 · 拖选范围缩放
          </span>
          <span className="flex items-center gap-1 text-[8px] text-mine-muted">
            <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-market-down" />
            Q1
          </span>
          <span className="flex items-center gap-1 text-[8px] text-mine-muted">
            <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-market-up" />
            Q5
          </span>
        </div>
      </div>
      <div className="h-[220px]">
        <DivergingBarChart
          curves={curves}
          baseline={0}
          colors={TURNOVER_COLORS}
          showBrush
          brushData={brushData}
          enableSeverity={false}
          referenceLines={referenceLines}
          showCrosshair
          seriesLabels={['Q1', 'Q5']}
          margin={{ top: 6, right: 4, bottom: 4, left: 0 }}
        />
      </div>
    </PanelSection>
  );
}
