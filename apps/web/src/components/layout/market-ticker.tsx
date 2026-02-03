"use client";

import { mockIndices, mockBreadth } from "@/features/market/data/mock-indices";
import { mockLimitStats } from "@/features/market/data/mock-limit-stats";
import { formatNumber, formatPercent } from "@/features/market/utils/formatters";
import { cn } from "@/lib/utils";

// Tape item component
function TapeItem({
  label,
  value,
  change,
  className,
}: {
  label: string;
  value?: string | number;
  change?: number;
  className?: string;
}) {
  const isUp = change !== undefined && change > 0;
  const isDown = change !== undefined && change < 0;

  return (
    <div className={cn("flex items-center gap-1.5 px-3", className)}>
      <span className="text-[11px] text-mine-muted font-medium whitespace-nowrap">
        {label}
      </span>
      {value !== undefined && (
        <span className="text-xs font-semibold text-mine-text whitespace-nowrap">
          {typeof value === "number" ? formatNumber(value) : value}
        </span>
      )}
      {change !== undefined && (
        <span
          className={cn(
            "text-[11px] font-semibold whitespace-nowrap",
            isUp && "text-[#22c55e]",
            isDown && "text-[#ef4444]",
            !isUp && !isDown && "text-mine-muted"
          )}
        >
          {formatPercent(change)}
        </span>
      )}
    </div>
  );
}

// Separator
function TapeSeparator() {
  return <div className="w-px h-3 bg-[#d4d4d4] mx-1" />;
}

export function MarketTicker() {
  const b = mockBreadth;
  const l = mockLimitStats;

  // Build tape content - duplicated for seamless loop
  const tapeContent = (
    <>
      {/* 6大指数 */}
      {mockIndices.map((idx) => (
        <TapeItem
          key={idx.code}
          label={idx.shortName}
          value={idx.value}
          change={idx.changePercent}
        />
      ))}
      <TapeSeparator />

      {/* 涨跌统计 */}
      <div className="flex items-center gap-1 px-3">
        <span className="text-[11px] text-mine-muted">涨跌比</span>
        <span className="text-xs font-semibold text-[#22c55e]">
          {b.advancers}
        </span>
        <span className="text-[11px] text-mine-muted">:</span>
        <span className="text-xs font-semibold text-[#ef4444]">
          {b.decliners}
        </span>
      </div>
      <TapeSeparator />

      {/* 涨停跌停 */}
      <div className="flex items-center gap-2 px-3">
        <span className="text-[11px] whitespace-nowrap">
          <span className="text-mine-muted">涨停 </span>
          <span className="font-semibold text-[#22c55e]">{l.limitUp}</span>
        </span>
        <span className="text-[11px] whitespace-nowrap">
          <span className="text-mine-muted">跌停 </span>
          <span className="font-semibold text-[#ef4444]">{l.limitDown}</span>
        </span>
        <span className="text-[11px] whitespace-nowrap">
          <span className="text-mine-muted">封板率 </span>
          <span className="font-semibold text-mine-text">{l.sealRate}%</span>
        </span>
      </div>
      <TapeSeparator />

      {/* 成交额 */}
      <div className="flex items-center gap-1 px-3">
        <span className="text-[11px] text-mine-muted whitespace-nowrap">两市成交</span>
        <span className="text-xs font-semibold text-mine-text whitespace-nowrap">
          {formatNumber(mockIndices.reduce((sum, i) => sum + i.turnover, 0))}亿
        </span>
      </div>
    </>
  );

  return (
    <div className="relative w-full h-8 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden">
      {/* Gradient masks for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/80 to-transparent z-10 rounded-l-full" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/80 to-transparent z-10 rounded-r-full" />

      {/* Scrolling tape */}
      <div className="flex items-center h-full whitespace-nowrap animate-[tape-scroll_25s_linear_infinite] hover:[animation-play-state:paused]">
        <div className="flex items-center shrink-0">{tapeContent}</div>
        <div className="flex items-center shrink-0">{tapeContent}</div>
      </div>
    </div>
  );
}
