"use client";

import { memo } from "react";
import { mockLimitStats, mockLimitUpStocks } from "@/features/market/data/mock-limit-stats";
import type { LimitUpStock } from "@/features/market/data/mock-limit-stats";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../shared/section-header";

// ============ Types ============

type StatColor = "up" | "down" | "neutral" | "warning";

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: number;
  subtext?: string;
  color: StatColor;
}

// ============ Constants ============

const COLOR_MAP: Record<StatColor, string> = {
  up: "text-market-up-medium",
  down: "text-market-down-medium",
  neutral: "text-mine-text",
  warning: "text-amber-500",
};

// ============ Sub Components ============

const StatCard = memo(function StatCard({
  label,
  value,
  delta,
  subtext,
  color,
}: StatCardProps) {
  return (
    <div className="p-2 rounded-lg bg-mine-bg/50 text-center">
      <div className="text-[10px] text-mine-muted mb-0.5">{label}</div>
      <div className={cn("text-base font-bold tabular-nums", COLOR_MAP[color])}>{value}</div>
      {delta !== undefined && (
        <div
          className={cn(
            "text-[9px] tabular-nums",
            delta > 0 ? "text-market-up-medium" : "text-market-down-medium"
          )}
        >
          {delta > 0 ? "+" : ""}
          {delta} 较昨日
        </div>
      )}
      {subtext && <div className="text-[9px] text-mine-muted tabular-nums">{subtext}</div>}
    </div>
  );
});

interface ContinuousBadgeProps {
  count: number;
  stockCount: number;
}

const ContinuousBadge = memo(function ContinuousBadge({
  count,
  stockCount,
}: ContinuousBadgeProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded bg-market-up-medium/5 border border-market-up-medium/20">
      <span className="text-[10px] font-bold text-market-up-medium">
        {count}板
      </span>
      <span className="text-[10px] text-mine-muted">({stockCount})</span>
    </div>
  );
});

interface LimitStockRowProps {
  stock: LimitUpStock;
}

const LimitStockRow = memo(function LimitStockRow({ stock }: LimitStockRowProps) {
  return (
    <button
      aria-label={`${stock.name}${stock.continuousDays > 1 ? ` ${stock.continuousDays}连板` : ''}, 封单时间 ${stock.limitTime}, 封单金额 ${stock.sealAmount}亿`}
      className="w-full flex items-center justify-between py-1 px-2 rounded hover:bg-mine-bg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-accent-teal/50 focus-visible:ring-inset"
    >
      <div className="flex items-center gap-2">
        {stock.continuousDays > 1 && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-market-up-medium text-white font-bold">
            {stock.continuousDays}板
          </span>
        )}
        <span className="text-xs text-mine-text font-medium">{stock.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-mine-muted tabular-nums">{stock.limitTime}</span>
        <span className="text-[10px] text-mine-muted tabular-nums">
          封单 {stock.sealAmount}亿
        </span>
      </div>
    </button>
  );
});

// ============ Main Component ============

export const LimitAnalysis = memo(function LimitAnalysis() {
  const stats = mockLimitStats;

  return (
    <div className="space-y-3">
      <SectionHeader title="涨跌停分析" showMore moreText="详情" />

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard
          label="涨停"
          value={stats.limitUp}
          delta={stats.limitUp - stats.limitUpYesterday}
          color="up"
        />
        <StatCard
          label="跌停"
          value={stats.limitDown}
          delta={stats.limitDown - stats.limitDownYesterday}
          color="down"
        />
        <StatCard label="封板率" value={`${stats.sealRate}%`} color="neutral" />
        <StatCard
          label="炸板"
          value={stats.brokenBoard}
          subtext={`${stats.brokenBoardRate}%`}
          color="warning"
        />
      </div>

      {/* Continuous Boards */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-mine-muted">连板统计</span>
        <div className="flex flex-wrap gap-1.5">
          {stats.continuousUp.map((item) => (
            <ContinuousBadge
              key={item.count}
              count={item.count}
              stockCount={item.stocks.length}
            />
          ))}
        </div>
      </div>

      {/* Latest Limit-Up Stocks */}
      <div className="space-y-1">
        <span className="text-[10px] text-mine-muted">最新涨停</span>
        {mockLimitUpStocks.slice(0, 3).map((stock) => (
          <LimitStockRow key={stock.code} stock={stock} />
        ))}
      </div>
    </div>
  );
});
