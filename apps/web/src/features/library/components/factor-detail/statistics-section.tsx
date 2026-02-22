"use client";

import { useMemo } from "react";
import {
  DetailSection,
  DetailStatGrid,
  DetailStatItem,
} from "@/components/shared/detail-panel";
import { BarHorizontal } from "@/lib/ngx-charts/bar-chart";
import type { DataItem } from "@/lib/ngx-charts/types";
import type { Factor } from "@/features/library/types";
import { WINSORIZATION_LABELS } from "@/features/library/types";

// ─── Helpers ─────────────────────────────────────────────

function icColor(ic: number): "up" | "down" | "flat" {
  // positive IC = good = red (up token), negative = bad = green (down token)
  if (ic > 0) return "up";
  if (ic < 0) return "down";
  return "flat";
}

function irColor(ir: number): "down" | "flat" | "up" {
  const abs = Math.abs(ir);
  if (abs >= 1.5) return "up"; // excellent → red
  if (abs >= 0.5) return "flat"; // ok → gray
  return "down"; // weak → green
}

function tStatColor(t: number): "down" | "up" {
  return Math.abs(t) >= 2 ? "up" : "down";
}

function winRateColor(wr: number): "up" | "flat" {
  return wr >= 55 ? "up" : "flat";
}

function fmtIC(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(3)}`;
}

function fmtCapacity(cap: number): string {
  return cap >= 10000 ? `${(cap / 10000).toFixed(0)}亿` : `${cap}万`;
}

// ─── Quantile Colors (A股红涨绿跌: worst=green → best=red) ───────

const QUANTILE_COLORS: Array<{ name: string; value: string }> = [
  { name: "Q1", value: "#0B8C5F" },
  { name: "Q2", value: "#58CEAA" },
  { name: "Q3", value: "#76808E" },
  { name: "Q4", value: "#E8626F" },
  { name: "Q5", value: "#CF304A" },
];

function useQuantileData(
  returns: [number, number, number, number, number],
): DataItem[] {
  return useMemo(
    () =>
      returns.map((r, i) => ({
        name: `Q${i + 1}`,
        value: r,
      })),
    [returns],
  );
}

function QuantileBar({
  returns,
}: {
  returns: [number, number, number, number, number];
}) {
  const data = useQuantileData(returns);

  return (
    <div data-slot="quantile-bar" className="h-[150px]">
      <BarHorizontal
        data={data}
        customColors={QUANTILE_COLORS}
        roundEdges
        animated
        barPadding={12}
        xAxis={{ visible: false }}
        yAxis={{ visible: true, showGridLines: false }}
        margins={{ top: 5, right: 10, bottom: 5, left: 0 }}
        tooltip={{ disabled: true }}
        showDataLabel
        dataLabelFormatting={(v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`}
      />
    </div>
  );
}

// ─── Statistics Section ─────────────────────────────────

interface StatisticsSectionProps {
  factor: Factor;
}

function StatisticsSection({ factor }: StatisticsSectionProps) {
  const cfg = factor.benchmarkConfig;
  const benchmarkSuffix = `${cfg.universe} · ${cfg.icMethod} · ${WINSORIZATION_LABELS[cfg.winsorization]} · ${cfg.rebalanceDays}日调仓`;

  return (
    <DetailSection title="核心指标" suffix={benchmarkSuffix}>
      {/* 3×3 KPI Grid */}
      <DetailStatGrid columns={3}>
        {/* Row 1: IC multi-horizon */}
        <DetailStatItem
          label="IC (20D)"
          value={fmtIC(factor.ic)}
          color={icColor(factor.ic)}
        />
        <DetailStatItem
          label="IC (60D)"
          value={fmtIC(factor.ic60d)}
          color={icColor(factor.ic60d)}
        />
        <DetailStatItem
          label="IC (120D)"
          value={fmtIC(factor.ic120d)}
          color={icColor(factor.ic120d)}
        />
        {/* Row 2: Quality metrics */}
        <DetailStatItem
          label="IR"
          value={factor.ir.toFixed(2)}
          color={irColor(factor.ir)}
        />
        <DetailStatItem
          label="t-stat"
          value={factor.icTstat.toFixed(2)}
          color={tStatColor(factor.icTstat)}
        />
        <DetailStatItem
          label="胜率"
          value={`${factor.winRate}%`}
          color={winRateColor(factor.winRate)}
        />
        {/* Row 3: Practical metrics */}
        <DetailStatItem label="换手" value={`${factor.turnover}%`} />
        <DetailStatItem label="容量" value={fmtCapacity(factor.capacity)} />
        <DetailStatItem label="IC半衰期" value={`T+${factor.icHalfLife}`} />
      </DetailStatGrid>

      {/* Quantile returns bar */}
      <div className="mt-4 pt-3 border-t border-mine-border/40">
        <div className="text-xs font-medium text-mine-muted mb-2">
          分位收益 (Q1-Q5)
        </div>
        <QuantileBar returns={factor.quantileReturns} />
      </div>
    </DetailSection>
  );
}

export { StatisticsSection };
