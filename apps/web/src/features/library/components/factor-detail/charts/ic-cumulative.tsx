'use client';

import { useMemo } from 'react';
import { PanelSection } from '@/components/shared/panel';
import { LineChart } from '@/lib/ngx-charts/line-chart';
import type { MultiSeries } from '@/lib/ngx-charts/types';
import { computeCumulativeIC } from '@/features/library/utils/compute-ic-stats';
import type { Factor } from '@/features/library/types';

/* ── Visual constants ──────────────────────────────────────────── */

const CUMULATIVE_COLORS: Array<{ name: string; value: string }> = [
  { name: '累计IC', value: 'var(--color-mine-accent-indigo)' },
];

const SERIES_CONFIG = {
  累计IC: { strokeWidth: 2, areaFillOpacity: 0.12 },
};

/* ── Chart Component ──────────────────────────────────────────── */

function CumulativeICChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const chartData: MultiSeries = useMemo(() => {
    const cumulative = computeCumulativeIC(data);
    return [
      {
        name: '累计IC',
        series: cumulative.map((v, i) => ({ name: i as number, value: v })),
      },
    ];
  }, [data]);

  const referenceLines = useMemo(() => [{ name: '0', value: 0 }], []);

  return (
    <LineChart
      data={chartData}
      customColors={CUMULATIVE_COLORS}
      animated
      showXAxis
      showYAxis
      showGridLines
      showLegend={false}
      autoScale
      tooltipDisabled={false}
      showRefLines
      showRefLabels={false}
      referenceLines={referenceLines}
      roundDomains
      seriesConfig={SERIES_CONFIG}
      yAxis={{ overlay: false }}
      margins={{ top: 10, right: 10, bottom: 20, left: 0 }}
    />
  );
}

/* ── Section Export ────────────────────────────────────────────── */

interface ICCumulativeSectionProps {
  factor: Factor;
}

export function ICCumulativeSection({ factor }: ICCumulativeSectionProps) {
  return (
    <PanelSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">累计 IC</span>
      </div>
      <div className="h-[170px]">
        <CumulativeICChart data={factor.icTimeSeries} />
      </div>
    </PanelSection>
  );
}
