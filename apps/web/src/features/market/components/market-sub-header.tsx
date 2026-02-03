"use client";

import { mockIndices, mockBreadth } from "../data/mock-indices";
import { formatNumber, formatPercent } from "../utils/formatters";
import { cn } from "@/lib/utils";

function IndexChip({
  shortName,
  value,
  changePercent,
}: {
  shortName: string;
  value: number;
  changePercent: number;
}) {
  const isUp = changePercent > 0;
  const isDown = changePercent < 0;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-border/30">
      <span className="text-xs text-muted-foreground font-medium">
        {shortName}
      </span>
      <span className="text-sm font-semibold text-foreground">
        {formatNumber(value)}
      </span>
      <span
        className={cn(
          "text-xs font-medium",
          isUp && "text-market-up-medium",
          isDown && "text-market-down-medium",
          !isUp && !isDown && "text-market-flat"
        )}
      >
        {formatPercent(changePercent)}
      </span>
    </div>
  );
}

export function MarketSubHeader() {
  const b = mockBreadth;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-white/80">
      <div className="flex items-center gap-2">
        {mockIndices.map((idx) => (
          <IndexChip
            key={idx.code}
            shortName={idx.shortName}
            value={idx.value}
            changePercent={idx.changePercent}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-market-up-medium font-medium">
          涨 {b.advancers}
        </span>
        <span className="text-market-down-medium font-medium">
          跌 {b.decliners}
        </span>
        <span className="text-market-flat font-medium">平 {b.unchanged}</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-market-up-medium">涨停 {b.limitUp}</span>
        <span className="text-market-down-medium">跌停 {b.limitDown}</span>
      </div>
    </div>
  );
}
