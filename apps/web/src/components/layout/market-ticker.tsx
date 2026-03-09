'use client';

import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────

export interface TickerIndex {
  code: string;
  shortName: string;
  value: number;
  changePercent: number;
  turnover: number;
}

export interface TickerBreadth {
  advancers: number;
  decliners: number;
}

export interface TickerLimitStats {
  limitUp: number;
  limitDown: number;
  sealRate: number;
}

export interface MarketTickerProps {
  indices: TickerIndex[];
  breadth: TickerBreadth;
  limitStats: TickerLimitStats;
  className?: string;
}

// ── Default mock data (L2-local, avoids L3 dependency) ──

export const DEFAULT_TICKER_INDICES: TickerIndex[] = [
  {
    code: '000001.SH',
    shortName: '上证',
    value: 3245.67,
    changePercent: 1.21,
    turnover: 4521,
  },
  {
    code: '399001.SZ',
    shortName: '深证',
    value: 10523.45,
    changePercent: 1.47,
    turnover: 5832,
  },
  {
    code: '399006.SZ',
    shortName: '创业板',
    value: 2156.78,
    changePercent: 2.14,
    turnover: 2843,
  },
  {
    code: '000688.SH',
    shortName: '科创50',
    value: 1023.45,
    changePercent: -1.19,
    turnover: 1023,
  },
  {
    code: '899050.BJ',
    shortName: '北证50',
    value: 892.34,
    changePercent: 0.97,
    turnover: 312,
  },
  {
    code: '000300.SH',
    shortName: '沪深300',
    value: 3876.12,
    changePercent: 1.38,
    turnover: 3245,
  },
];

export const DEFAULT_TICKER_BREADTH: TickerBreadth = {
  advancers: 2841,
  decliners: 1523,
};

export const DEFAULT_TICKER_LIMIT_STATS: TickerLimitStats = {
  limitUp: 47,
  limitDown: 12,
  sealRate: 83,
};

// ── Formatting helpers (inlined to avoid L3 dependency) ──

function fmtNumber(n: number, decimals = 2): string {
  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(n);
}

function fmtPercent(n: number, decimals = 2): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(decimals)}%`;
}

// ── Sub-components ───────────────────────────────────────

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
    <div className={cn('flex items-center gap-1.5 px-3', className)}>
      <span className="text-[11px] text-mine-muted font-medium whitespace-nowrap">
        {label}
      </span>
      {value !== undefined && (
        <span className="text-[11px] font-semibold text-mine-text whitespace-nowrap">
          {typeof value === 'number' ? fmtNumber(value) : value}
        </span>
      )}
      {change !== undefined && (
        <span
          className={cn(
            'text-[11px] font-semibold whitespace-nowrap',
            isUp && 'text-market-up-medium',
            isDown && 'text-market-down-medium',
            !isUp && !isDown && 'text-mine-muted',
          )}
        >
          {fmtPercent(change)}
        </span>
      )}
    </div>
  );
}

function TapeSeparator() {
  return <div className="w-px h-3 bg-mine-border mx-1" />;
}

// ── Main component ───────────────────────────────────────

export function MarketTicker({
  indices,
  breadth,
  limitStats,
  className,
}: MarketTickerProps) {
  const b = breadth;
  const l = limitStats;

  const tapeContent = (
    <>
      {/* 6大指数 */}
      {indices.map((idx) => (
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
        <span className="text-[11px] font-semibold text-market-up-medium">
          {b.advancers}
        </span>
        <span className="text-[11px] text-mine-muted">:</span>
        <span className="text-[11px] font-semibold text-market-down-medium">
          {b.decliners}
        </span>
      </div>
      <TapeSeparator />

      {/* 涨停跌停 */}
      <div className="flex items-center gap-2 px-3">
        <span className="text-[11px] whitespace-nowrap">
          <span className="text-mine-muted">涨停 </span>
          <span className="font-semibold text-market-up-medium">
            {l.limitUp}
          </span>
        </span>
        <span className="text-[11px] whitespace-nowrap">
          <span className="text-mine-muted">跌停 </span>
          <span className="font-semibold text-market-down-medium">
            {l.limitDown}
          </span>
        </span>
        <span className="text-[11px] whitespace-nowrap">
          <span className="text-mine-muted">封板率 </span>
          <span className="font-semibold text-mine-text">{l.sealRate}%</span>
        </span>
      </div>
      <TapeSeparator />

      {/* 成交额 */}
      <div className="flex items-center gap-1 px-3">
        <span className="text-[11px] text-mine-muted whitespace-nowrap">
          两市成交
        </span>
        <span className="text-[11px] font-semibold text-mine-text whitespace-nowrap">
          {fmtNumber(indices.reduce((sum, i) => sum + i.turnover, 0))}亿
        </span>
      </div>
    </>
  );

  return (
    <div
      data-slot="market-ticker"
      className={cn(
        'relative w-full h-8 glass-light rounded-full overflow-hidden',
        className,
      )}
    >
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
