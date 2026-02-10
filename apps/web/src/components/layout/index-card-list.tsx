"use client";

import { mockIndices } from "@/features/market/data/mock-indices";
import { formatNumber, formatPercent } from "@/features/market/utils/formatters";
import { MiniSparkline } from "@/features/market/components/widgets/mini-sparkline";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function getMarketDirection(changePercent: number): "up" | "down" | "flat" {
  if (changePercent > 0) return "up";
  if (changePercent < 0) return "down";
  return "flat";
}

const MARKET_COLORS = {
  up: "var(--market-up-medium)",
  down: "var(--market-down-medium)",
  flat: "var(--market-flat)",
} as const;

const BADGE_STYLES = {
  up: "border-market-up-medium/30 text-market-up-medium bg-market-up-medium/5",
  down: "border-market-down-medium/30 text-market-down-medium bg-market-down-medium/5",
  flat: "border-mine-muted/30 text-mine-muted",
} as const;

const BADGE_LABELS = {
  up: "Active",
  down: "Declining",
  flat: "Stable",
} as const;

const CHANGE_TEXT_STYLES = {
  up: "text-market-up-medium",
  down: "text-market-down-medium",
  flat: "text-market-flat",
} as const;

function IndexCard({ index }: { index: (typeof mockIndices)[0] }) {
  const direction = getMarketDirection(index.changePercent);
  const color = MARKET_COLORS[direction];

  return (
    <div className="p-3 rounded-xl bg-white shadow-sm border border-mine-border hover:shadow-md transition-shadow cursor-pointer space-y-2">
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-medium px-1.5 py-0",
            BADGE_STYLES[direction],
          )}
        >
          {BADGE_LABELS[direction]}
        </Badge>
        <MiniSparkline
          data={index.sparklineData}
          width={48}
          height={16}
          color={color}
        />
      </div>

      <div className="text-xs text-mine-muted font-medium">{index.name}</div>

      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-mine-text">
          {formatNumber(index.value)}
        </span>
        <span
          className={cn(
            "text-xs font-semibold",
            CHANGE_TEXT_STYLES[direction],
          )}
        >
          {formatPercent(index.changePercent)}
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-mine-muted pt-1 border-t border-mine-border/50">
        <span>Vol: {formatNumber(index.volume)}亿</span>
        <span>成交: {formatNumber(index.turnover)}亿</span>
      </div>
    </div>
  );
}

export function IndexCardList() {
  return (
    <div className="w-[280px] min-w-0 max-w-full flex flex-col gap-2 overflow-y-auto pr-1">
      {mockIndices.map((idx) => (
        <IndexCard key={idx.code} index={idx} />
      ))}
    </div>
  );
}
