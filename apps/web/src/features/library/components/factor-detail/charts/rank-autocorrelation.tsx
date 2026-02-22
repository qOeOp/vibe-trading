"use client";

import { useMemo } from "react";
import { DetailSection } from "@/components/shared/detail-panel";
import { LineChart } from "@/lib/ngx-charts/line-chart";
import type { MultiSeries } from "@/lib/ngx-charts/types";
import type { Factor } from "@/features/library/types";

/* ── Visual constants ──────────────────────────────────────── */

const AUTOCORR_COLORS: Array<{ name: string; value: string }> = [
  { name: "自相关", value: "#f59e0b" },
];

const SERIES_CONFIG = {
  "自相关": { strokeWidth: 1.0, areaFillOpacity: 0 },
};

/* ── Chart Component ──────────────────────────────────────── */

function RankAutocorrChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const chartData: MultiSeries = useMemo(
    () => [
      {
        name: "自相关",
        series: data.map((v, i) => ({ name: i as number, value: v })),
      },
    ],
    [data],
  );

  const referenceLines = useMemo(
    () => [{ name: "0.5", value: 0.5 }],
    [],
  );

  return (
    <LineChart
      data={chartData}
      customColors={AUTOCORR_COLORS}
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

/* ── Section Export ────────────────────────────────────────── */

interface RankAutocorrelationSectionProps {
  factor: Factor;
}

export function RankAutocorrelationSection({ factor }: RankAutocorrelationSectionProps) {
  return (
    <DetailSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">因子排名自相关</span>
      </div>
      <div className="h-[150px]">
        <RankAutocorrChart data={factor.rankAutoCorrelation} />
      </div>
    </DetailSection>
  );
}
