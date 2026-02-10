"use client";

import type { LibrarySummary } from "../types";

interface SummaryCardProps {
  value: string | number;
  label: string;
  color?: string;
}

function SummaryCard({ value, label, color }: SummaryCardProps) {
  return (
    <div className="bg-white shadow-sm border border-mine-border rounded-xl px-5 py-4 flex flex-col items-center justify-center gap-1">
      <span
        className="text-2xl font-bold tabular-nums"
        style={{ color: color ?? "#1a1a1a" }}
      >
        {value}
      </span>
      <span className="text-xs text-mine-muted">{label}</span>
    </div>
  );
}

interface SummaryCardsProps {
  summary: LibrarySummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard value={summary.totalFactors} label="因子总数" />
      <SummaryCard
        value={summary.effectiveFactors}
        label="有效因子（IC>0.03）"
        color="#2EBD85"
      />
      <SummaryCard value={summary.avgICIR} label="平均 ICIR" />
      <SummaryCard
        value={summary.newThisMonth}
        label="本月新增"
        color="#F6465D"
      />
    </div>
  );
}
