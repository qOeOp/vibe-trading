"use client";

import { mockIndices } from "@/features/market/data/mock-indices";
import { formatNumber, formatPercent } from "@/features/market/utils/formatters";
import { MiniSparkline } from "@/features/market/components/widgets/mini-sparkline";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function IndexCard({ index }: { index: (typeof mockIndices)[0] }) {
  const isUp = index.changePercent > 0;
  const color = isUp
    ? "var(--market-up-medium)"
    : index.changePercent < 0
      ? "var(--market-down-medium)"
      : "var(--market-flat)";

  return (
    <div className="p-3 rounded-xl bg-white shadow-sm border border-mine-border hover:shadow-md transition-shadow cursor-pointer space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-medium px-1.5 py-0",
            isUp
              ? "border-market-up-medium/30 text-market-up-medium bg-market-up-medium/5"
              : index.changePercent < 0
                ? "border-market-down-medium/30 text-market-down-medium bg-market-down-medium/5"
                : "border-mine-muted/30 text-mine-muted"
          )}
        >
          {isUp ? "Active" : index.changePercent < 0 ? "Declining" : "Stable"}
        </Badge>
        <MiniSparkline
          data={index.sparklineData}
          width={48}
          height={16}
          color={color}
        />
      </div>

      {/* Index name */}
      <div className="text-xs text-mine-muted font-medium">{index.name}</div>

      {/* Value + Change */}
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-mine-text">
          {formatNumber(index.value)}
        </span>
        <span
          className={cn(
            "text-xs font-semibold",
            isUp && "text-market-up-medium",
            index.changePercent < 0 && "text-market-down-medium",
            index.changePercent === 0 && "text-market-flat"
          )}
        >
          {formatPercent(index.changePercent)}
        </span>
      </div>

      {/* Extra info */}
      <div className="flex items-center justify-between text-[10px] text-mine-muted pt-1 border-t border-mine-border/50">
        <span>Vol: {formatNumber(index.volume)}亿</span>
        <span>成交: {formatNumber(index.turnover)}亿</span>
      </div>
    </div>
  );
}

export function IndexCardList() {
  return (
    <div className="w-[280px] flex flex-col gap-2 overflow-y-auto pr-1">
      {mockIndices.map((idx) => (
        <IndexCard key={idx.code} index={idx} />
      ))}
    </div>
  );
}
