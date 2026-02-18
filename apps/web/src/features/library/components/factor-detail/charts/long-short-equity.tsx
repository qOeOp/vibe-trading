"use client";

import { useMemo } from "react";
import { DetailSection } from "@/components/shared/detail-panel";
import { LineChart } from "@/lib/ngx-charts/line-chart";
import type { MultiSeries } from "@/lib/ngx-charts/types";
import type { Factor } from "../../../types";

/* ── Visual constants ──────────────────────────────────────── */

const EQUITY_COLORS: Array<{ name: string; value: string }> = [
  { name: "净值", value: "#6366f1" },
];

const SERIES_CONFIG = {
  "净值": { strokeWidth: 2, areaFillOpacity: 0.12 },
};

/* ── Chart Component ──────────────────────────────────────── */

function EquityCurveChart({ curve }: { curve: number[] }) {
  if (!curve || curve.length < 2) return null;

  const chartData: MultiSeries = useMemo(
    () => [
      {
        name: "净值",
        series: curve.map((v, i) => ({
          name: i as number,
          value: v,
        })),
      },
    ],
    [curve],
  );

  const referenceLines = useMemo(
    () => [{ name: "基准", value: 1.0 }],
    [],
  );

  return (
    <LineChart
      data={chartData}
      customColors={EQUITY_COLORS}
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

/* ── Section Export ────────────────────────────────────────── */

interface LongShortEquitySectionProps {
  factor: Factor;
}

export function LongShortEquitySection({ factor }: LongShortEquitySectionProps) {
  const { maxDD, sharpe } = useMemo(() => {
    const curve = factor.longShortEquityCurve;
    if (!curve || curve.length < 2) return { maxDD: 0, sharpe: 0 };

    let peak = curve[0];
    let mdd = 0;
    for (let i = 1; i < curve.length; i++) {
      if (curve[i] > peak) peak = curve[i];
      const dd = (peak - curve[i]) / peak;
      if (dd > mdd) mdd = dd;
    }

    const returns: number[] = [];
    for (let i = 1; i < curve.length; i++) {
      returns.push(curve[i] / curve[i - 1] - 1);
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const std = Math.sqrt(
      returns.reduce((a, v) => a + (v - mean) ** 2, 0) / (returns.length - 1),
    );
    const annSharpe = std > 0 ? (mean / std) * Math.sqrt(252) : 0;

    return { maxDD: mdd, sharpe: annSharpe };
  }, [factor.longShortEquityCurve]);

  return (
    <DetailSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">多空净值曲线</span>
      </div>
      <div className="h-[170px]">
        <EquityCurveChart curve={factor.longShortEquityCurve} />
      </div>
      <div className="flex items-center gap-4 text-[11px] mt-4 ml-12">
        <span>
          <span className="text-mine-muted">年化</span>{" "}
          <span className={`font-semibold tabular-nums font-mono ${factor.longShortReturn >= 0 ? "text-market-down-medium" : "text-market-up-medium"}`}>
            {factor.longShortReturn >= 0 ? "+" : ""}{factor.longShortReturn.toFixed(1)}%
          </span>
        </span>
        <span>
          <span className="text-mine-muted">MaxDD</span>{" "}
          <span className="font-semibold tabular-nums font-mono text-market-up-medium">
            -{(maxDD * 100).toFixed(1)}%
          </span>
        </span>
        <span>
          <span className="text-mine-muted">Sharpe</span>{" "}
          <span className="font-semibold tabular-nums font-mono text-mine-text">
            {sharpe.toFixed(2)}
          </span>
        </span>
        <span>
          <span className="text-mine-muted">多头占比</span>{" "}
          <span className="font-semibold tabular-nums font-mono text-mine-text">
            {(factor.longSideReturnRatio * 100).toFixed(0)}%
          </span>
        </span>
      </div>
    </DetailSection>
  );
}
