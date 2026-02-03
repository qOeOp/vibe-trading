"use client";

import { memo } from "react";
import { mockIndices } from "../data/mock-indices";
import { formatNumber, formatPercent } from "../utils/formatters";
import { MiniSparkline } from "./widgets/mini-sparkline";
import { cn } from "@/lib/utils";

// ============ Types ============

interface IndexCardProps {
  index: (typeof mockIndices)[0];
}

// ============ Sub Components ============

const IndexCard = memo(function IndexCard({ index }: IndexCardProps) {
  const isUp = index.changePercent > 0;
  const color = isUp
    ? "var(--market-up-medium)"
    : index.changePercent < 0
      ? "var(--market-down-medium)"
      : "var(--market-flat)";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${index.name}: ${formatNumber(index.value)}, ${formatPercent(index.changePercent)}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          // TODO: handle index card click
        }
      }}
      className="p-3 rounded-lg bg-white shadow-sm border border-mine-border/30 hover:shadow-md transition-shadow cursor-pointer space-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-accent-teal/50"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-mine-muted font-medium">
          {index.name}
        </span>
        <MiniSparkline
          data={index.sparklineData}
          width={48}
          height={16}
          color={color}
        />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-mine-text tabular-nums">
          {formatNumber(index.value)}
        </span>
        <span
          className={cn(
            "text-xs font-semibold tabular-nums",
            isUp && "text-market-up-medium",
            index.changePercent < 0 && "text-market-down-medium",
            index.changePercent === 0 && "text-market-flat"
          )}
        >
          {formatPercent(index.changePercent)}
        </span>
      </div>
      <div className="text-[10px] text-mine-muted tabular-nums">
        成交 {formatNumber(index.turnover)}亿
      </div>
    </div>
  );
});

// ============ Main Component ============

export const MarketIndexSidebar = memo(function MarketIndexSidebar() {
  return (
    <div className="w-[220px] flex flex-col gap-2 overflow-y-auto pr-1">
      {mockIndices.map((idx) => (
        <IndexCard key={idx.code} index={idx} />
      ))}
    </div>
  );
});
