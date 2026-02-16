"use client";

import {
  DetailSection,
  DetailStatGrid,
  DetailStatItem,
} from "@/components/shared/detail-panel";
import type { Factor } from "../../types";
import { WINSORIZATION_LABELS } from "../../types";

// ─── Helpers ─────────────────────────────────────────────

function icColor(ic: number): "up" | "down" | "flat" {
  // positive IC = good = green (down token), negative = bad = red (up token)
  if (ic > 0) return "down";
  if (ic < 0) return "up";
  return "flat";
}

function irColor(ir: number): "down" | "flat" | "up" {
  const abs = Math.abs(ir);
  if (abs >= 1.5) return "down"; // excellent → green
  if (abs >= 0.5) return "flat"; // ok → gray
  return "up"; // weak → red
}

function tStatColor(t: number): "down" | "up" {
  return Math.abs(t) >= 2 ? "down" : "up";
}

function winRateColor(wr: number): "down" | "flat" {
  return wr >= 55 ? "down" : "flat";
}

function fmtIC(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(3)}`;
}

function fmtCapacity(cap: number): string {
  return cap >= 10000 ? `${(cap / 10000).toFixed(0)}亿` : `${cap}万`;
}

// ─── Quantile Bar ────────────────────────────────────────

function QuantileBar({
  returns,
}: {
  returns: [number, number, number, number, number];
}) {
  const labels = ["Q1", "Q2", "Q3", "Q4", "Q5"];
  const maxAbs = Math.max(...returns.map(Math.abs), 0.01);

  return (
    <div data-slot="quantile-bar" className="flex items-end gap-1 h-[48px]">
      {returns.map((r, i) => {
        const height = Math.max(4, (Math.abs(r) / maxAbs) * 40);
        const isPositive = r >= 0;
        return (
          <div
            key={labels[i]}
            className="flex-1 flex flex-col items-center gap-0.5"
          >
            <div
              className={`w-full rounded-sm ${isPositive ? "bg-market-down-medium" : "bg-market-up-medium"}`}
              style={{
                height: `${height}px`,
                opacity: 0.7 + (i / 4) * 0.3,
              }}
            />
            <span className="text-[8px] text-mine-muted">{labels[i]}</span>
          </div>
        );
      })}
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
      <div className="mt-3">
        <div className="text-[10px] text-mine-muted mb-1">
          分位收益 (Q1-Q5)
        </div>
        <QuantileBar returns={factor.quantileReturns} />
      </div>
    </DetailSection>
  );
}

export { StatisticsSection };
