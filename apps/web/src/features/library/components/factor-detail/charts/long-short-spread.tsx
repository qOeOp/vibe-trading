"use client";

import { useMemo } from "react";
import { DetailSection } from "@/components/shared/detail-panel";
import { LineChart } from "@/lib/ngx-charts/line-chart";
import type { MultiSeries } from "@/lib/ngx-charts/types";
import type { Factor } from "@/features/library/types";

/* ── Visual constants ──────────────────────────────────────── */

const SPREAD_COLORS: Array<{ name: string; value: string }> = [
  { name: "价差", value: "#6366f1" },
];

const SERIES_CONFIG = {
  "价差": { strokeWidth: 1.0, areaFillOpacity: 0.08 },
};

/* ── Chart Component ──────────────────────────────────────── */

function SpreadChart({ q5: q5Curve, q1: q1Curve }: { q5: number[]; q1: number[] }) {
  if (!q5Curve || !q1Curve || q5Curve.length === 0 || q1Curve.length === 0) return null;

  const chartData: MultiSeries = useMemo(() => {
    const len = Math.min(q5Curve.length, q1Curve.length);
    const spread: Array<{ name: number; value: number }> = [];
    for (let i = 1; i < len; i++) {
      const q5Ret = q5Curve[i] / q5Curve[i - 1] - 1;
      const q1Ret = q1Curve[i] / q1Curve[i - 1] - 1;
      spread.push({ name: i, value: (q5Ret - q1Ret) * 100 });
    }
    return [{ name: "价差", series: spread }];
  }, [q5Curve, q1Curve]);

  const referenceLines = useMemo(
    () => [{ name: "0", value: 0 }],
    [],
  );

  return (
    <LineChart
      data={chartData}
      customColors={SPREAD_COLORS}
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

interface LongShortSpreadSectionProps {
  factor: Factor;
}

export function LongShortSpreadSection({ factor }: LongShortSpreadSectionProps) {
  const qcr = factor.quantileCumulativeReturns;
  return (
    <DetailSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">多空价差</span>
        <span className="text-[10px] text-mine-muted">Q5-Q1 日收益</span>
      </div>
      <div className="h-[150px]">
        <SpreadChart q5={qcr[4]} q1={qcr[0]} />
      </div>
    </DetailSection>
  );
}
