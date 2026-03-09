'use client';

import { useMemo } from 'react';
import { PanelSection } from '@/components/shared/panel';
import { LineChart } from '@/lib/ngx-charts/line-chart';
import type { MultiSeries } from '@/lib/ngx-charts/types';
import { computeRollingMA } from '@/features/library/utils/compute-ic-stats';
import type { Factor } from '@/features/library/types';

/* ── Visual constants ──────────────────────────────────────────── */

const IC_PROBATION_THRESHOLD = 0.01;

/** Three-window rolling MA colors: shorter→longer = blue→indigo→purple */
const ROLLING_COLORS: Array<{ name: string; value: string }> = [
  { name: '20D MA', value: 'var(--color-mine-accent-blue)' },
  { name: '60D MA', value: 'var(--color-mine-accent-indigo)' },
  { name: '120D MA', value: 'var(--color-mine-accent-purple)' },
];

/** Per-series rendering config
 *  - 20D: thinnest, most responsive
 *  - 60D: medium
 *  - 120D: thickest, area fill for long-term trend
 */
const SERIES_CONFIG = {
  '20D MA': { strokeWidth: 0.8, areaFillOpacity: 0 },
  '60D MA': { strokeWidth: 1.0, areaFillOpacity: 0 },
  '120D MA': { strokeWidth: 1.2, areaFillOpacity: 0.08 },
};

/* ── Chart Component ──────────────────────────────────────────── */

function ICRollingMAChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const chartData: MultiSeries = useMemo(() => {
    const ma20 = computeRollingMA(data, 20);
    const ma60 = computeRollingMA(data, 60);
    const ma120 = computeRollingMA(data, 120);

    const buildSeries = (values: (number | null)[]) => {
      const series: Array<{ name: number; value: number }> = [];
      for (let i = 0; i < values.length; i++) {
        if (values[i] !== null) {
          series.push({ name: i, value: values[i] as number });
        }
      }
      return series;
    };

    // 120D first (area underneath), then 60D, then 20D on top
    return [
      { name: '120D MA', series: buildSeries(ma120) },
      { name: '60D MA', series: buildSeries(ma60) },
      { name: '20D MA', series: buildSeries(ma20) },
    ];
  }, [data]);

  const referenceLines = useMemo(
    () => [{ name: '阈值', value: IC_PROBATION_THRESHOLD }],
    [],
  );

  return (
    <LineChart
      data={chartData}
      customColors={ROLLING_COLORS}
      animated
      showXAxis={false}
      showYAxis
      showGridLines={false}
      showLegend={false}
      autoScale
      tooltipDisabled={false}
      showRefLines
      showRefLabels={false}
      referenceLines={referenceLines}
      roundDomains={false}
      seriesConfig={SERIES_CONFIG}
      yAxis={{ overlay: false }}
      margins={{ top: 10, right: 10, bottom: 5, left: 0 }}
    />
  );
}

/* ── Section Export ────────────────────────────────────────────── */

interface ICTimeSeriesSectionProps {
  factor: Factor;
}

export function ICTimeSeriesSection({ factor }: ICTimeSeriesSectionProps) {
  return (
    <PanelSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">IC 滚动均线</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[8px] text-mine-muted">
            <span className="inline-block w-3 h-[1.5px] bg-blue-500" />
            20D
          </span>
          <span className="flex items-center gap-1 text-[8px] text-mine-muted">
            <span className="inline-block w-3 h-[1.5px] bg-indigo-500" />
            60D
          </span>
          <span className="flex items-center gap-1 text-[8px] text-mine-muted">
            <span className="inline-block w-3 h-2 rounded-sm bg-violet-500/10 border border-violet-500/30" />
            120D
          </span>
          <span className="flex items-center gap-1 text-[8px] text-mine-muted">
            <span className="inline-block w-3 h-0 border-t border-dashed border-market-up-medium" />
            阈值
          </span>
        </span>
      </div>
      <div className="h-[150px]">
        <ICRollingMAChart data={factor.icTimeSeries} />
      </div>
    </PanelSection>
  );
}
