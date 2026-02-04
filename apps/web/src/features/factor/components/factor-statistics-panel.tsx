"use client";

import { cn } from "@/lib/utils";
import type { FactorStatistics } from "../types";

interface FactorStatisticsPanelProps {
  statistics: FactorStatistics;
}

interface StatItemProps {
  label: string;
  value: string | number;
  format?: "percent" | "decimal" | "number";
  highlight?: "positive" | "negative" | "neutral";
}

function StatItem({ label, value, format = "decimal", highlight }: StatItemProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val;
    switch (format) {
      case "percent":
        return `${(val * 100).toFixed(2)}%`;
      case "decimal":
        return val.toFixed(4);
      case "number":
        return val.toFixed(2);
      default:
        return val.toString();
    }
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-mine-border/50 last:border-b-0">
      <span className="text-mine-muted text-sm">{label}</span>
      <span
        className={cn(
          "font-mono text-sm font-medium",
          highlight === "positive" && "text-[#0B8C5F]",
          highlight === "negative" && "text-[#CF304A]",
          highlight === "neutral" && "text-mine-text",
          !highlight && "text-mine-text"
        )}
      >
        {formatValue(value)}
      </span>
    </div>
  );
}

function StatSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-mine-muted mb-3">
        {title}
      </h4>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

export function FactorStatisticsPanel({ statistics }: FactorStatisticsPanelProps) {
  const getHighlight = (value: number, threshold = 0) => {
    if (value > threshold) return "positive" as const;
    if (value < threshold) return "negative" as const;
    return "neutral" as const;
  };

  return (
    <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-mine-border">
      <StatSection title="Returns">
        <StatItem
          label="Annualized Alpha"
          value={statistics.annualizedAlpha}
          format="percent"
          highlight={getHighlight(statistics.annualizedAlpha)}
        />
        <StatItem
          label="Annualized Beta"
          value={statistics.annualizedBeta}
          format="decimal"
          highlight="neutral"
        />
        <StatItem
          label="Sharpe Ratio"
          value={statistics.sharpeRatio}
          format="number"
          highlight={getHighlight(statistics.sharpeRatio, 1)}
        />
        <StatItem
          label="Max Drawdown"
          value={statistics.maxDrawdown}
          format="percent"
          highlight="negative"
        />
        <StatItem
          label="Volatility"
          value={statistics.volatility}
          format="percent"
          highlight="neutral"
        />
      </StatSection>

      <StatSection title="Information Coefficient">
        <StatItem
          label="Mean IC"
          value={statistics.informationCoefficient}
          format="decimal"
          highlight={getHighlight(statistics.informationCoefficient, 0.03)}
        />
        <StatItem
          label="IC t-stat"
          value={statistics.icTStat}
          format="number"
          highlight={getHighlight(statistics.icTStat, 2)}
        />
        <StatItem
          label="IC p-value"
          value={statistics.icPValue}
          format="decimal"
          highlight={statistics.icPValue < 0.05 ? "positive" : "negative"}
        />
        <StatItem
          label="IC Skewness"
          value={statistics.icSkew}
          format="number"
          highlight="neutral"
        />
        <StatItem
          label="IC Kurtosis"
          value={statistics.icKurtosis}
          format="number"
          highlight="neutral"
        />
      </StatSection>

      <StatSection title="Turnover">
        <StatItem
          label="Mean Turnover"
          value={statistics.turnoverMean}
          format="percent"
          highlight="neutral"
        />
        <StatItem
          label="Rank Autocorr."
          value={statistics.factorRankAutocorr}
          format="decimal"
          highlight={getHighlight(statistics.factorRankAutocorr, 0.8)}
        />
      </StatSection>
    </div>
  );
}
