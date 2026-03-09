'use client';

import { PanelSection } from '@/components/shared/panel';
import { DivergingBarChart } from '@/lib/xycharts/diverging-bar-chart';
import type { Factor } from '@/features/library/types';

/* ── Visual constants ──────────────────────────────────────── */

/** A股红涨绿跌: Q1 (worst, green/跌) → Q5 (best, red/涨) */
const QUANTILE_COLORS = [
  'var(--color-market-down)', // Q1 — worst (green/跌)
  'var(--color-market-down-light)', // Q2
  'var(--color-market-flat)', // Q3 — neutral
  'var(--color-market-up-light)', // Q4
  'var(--color-market-up)', // Q5 — best (red/涨)
];

const LEGEND_ITEMS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'] as const;

/* ── Section Export ────────────────────────────────────────── */

interface QuantileCumulativeReturnsSectionProps {
  factor: Factor;
}

export function QuantileCumulativeReturnsSection({
  factor,
}: QuantileCumulativeReturnsSectionProps) {
  return (
    <PanelSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">
          分组累计收益
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-mine-muted mr-1">
            Q1-Q5 · 拖选范围缩放
          </span>
          {LEGEND_ITEMS.map((label, i) => (
            <span
              key={label}
              className="flex items-center gap-1 text-[8px] text-mine-muted"
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-[2px]"
                style={{ backgroundColor: QUANTILE_COLORS[i] }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="h-[220px]">
        <DivergingBarChart
          curves={factor.quantileCumulativeReturns}
          baseline={1.0}
          colors={QUANTILE_COLORS}
          showBrush
          enableSeverity
          showCrosshair
          seriesLabels={[...LEGEND_ITEMS]}
          margin={{ top: 6, right: 4, bottom: 4, left: 0 }}
        />
      </div>
    </PanelSection>
  );
}
