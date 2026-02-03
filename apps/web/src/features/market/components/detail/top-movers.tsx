"use client";

import { memo, useMemo } from "react";
import { mockSectors } from "../../data/mock-sectors";
import { formatPercent, formatFlow } from "../../utils/formatters";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../shared/section-header";

// ============ Sub Components ============

interface MoverRowProps {
  name: string;
  rank: number;
  capitalFlow: number;
  changePercent: number;
  variant: "gainer" | "loser";
}

const MoverRow = memo(function MoverRow({
  name,
  rank,
  capitalFlow,
  changePercent,
  variant,
}: MoverRowProps) {
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-mine-bg/60 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-mine-muted w-3 tabular-nums">{rank}</span>
        <span className="text-xs text-mine-text">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-mine-muted tabular-nums">
          {formatFlow(capitalFlow)}
        </span>
        <span
          className={cn(
            "text-xs font-semibold w-16 text-right tabular-nums",
            variant === "gainer"
              ? "text-market-up-medium"
              : changePercent < 0
                ? "text-market-down-medium"
                : "text-market-flat"
          )}
        >
          {formatPercent(changePercent)}
        </span>
      </div>
    </div>
  );
});

// ============ Main Component ============

export const TopMovers = memo(function TopMovers() {
  const { gainers, losers } = useMemo(() => {
    const sorted = [...mockSectors].sort(
      (a, b) => b.changePercent - a.changePercent
    );
    return {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse(),
    };
  }, []);

  return (
    <div className="space-y-3">
      <SectionHeader title="涨跌排行" />

      {/* Gainers */}
      <div className="space-y-1">
        <div className="text-[10px] text-market-up-medium font-medium mb-1">
          涨幅前5
        </div>
        {gainers.map((s, i) => (
          <MoverRow
            key={s.name}
            name={s.name}
            rank={i + 1}
            capitalFlow={s.capitalFlow}
            changePercent={s.changePercent}
            variant="gainer"
          />
        ))}
      </div>

      {/* Losers */}
      <div className="space-y-1">
        <div className="text-[10px] text-market-down-medium font-medium mb-1">
          跌幅前5
        </div>
        {losers.map((s, i) => (
          <MoverRow
            key={s.name}
            name={s.name}
            rank={i + 1}
            capitalFlow={s.capitalFlow}
            changePercent={s.changePercent}
            variant="loser"
          />
        ))}
      </div>
    </div>
  );
});
