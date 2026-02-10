"use client";

import { memo, useMemo } from "react";
import { mockBreadth } from "@/features/market/data/mock-indices";
import { SectionHeader } from "../shared/section-header";

// ============ Types ============

interface BreadthSegment {
  label: string;
  count: number;
  percent: number;
  bgClass: string;
  textClass: string;
  showLabel: boolean;
}

// ============ Constants ============

const SEGMENT_CONFIG = {
  advancers: {
    label: "上涨",
    bgClass: "bg-market-up-medium",
    textClass: "text-market-up-medium",
  },
  unchanged: {
    label: "平盘",
    bgClass: "bg-mine-muted/30",
    textClass: "text-mine-text",
  },
  decliners: {
    label: "下跌",
    bgClass: "bg-market-down-medium",
    textClass: "text-market-down-medium",
  },
} as const;

// ============ Sub Components ============

interface LegendItemProps {
  label: string;
  percent: number;
  bgClass: string;
  textClass: string;
}

const LegendItem = memo(function LegendItem({
  label,
  percent,
  bgClass,
  textClass,
}: LegendItemProps) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-sm ${bgClass}`} />
      <span className="text-mine-muted">{label}</span>
      <span className={`font-semibold tabular-nums ${textClass}`}>{percent}%</span>
    </div>
  );
});

// ============ Main Component ============

export const MarketBreadth = memo(function MarketBreadth() {
  const { advancers, decliners, unchanged } = mockBreadth;

  const { total, segments } = useMemo(() => {
    const total = advancers + decliners + unchanged;
    const advPct = Math.round((advancers / total) * 100);
    const decPct = Math.round((decliners / total) * 100);
    const uncPct = 100 - advPct - decPct;

    const segments: BreadthSegment[] = [
      {
        ...SEGMENT_CONFIG.advancers,
        count: advancers,
        percent: advPct,
        showLabel: true,
      },
      {
        ...SEGMENT_CONFIG.unchanged,
        count: unchanged,
        percent: uncPct,
        showLabel: uncPct > 8,
      },
      {
        ...SEGMENT_CONFIG.decliners,
        count: decliners,
        percent: decPct,
        showLabel: true,
      },
    ];

    return { total, segments };
  }, [advancers, decliners, unchanged]);

  return (
    <div className="space-y-3">
      <SectionHeader title="市场宽度" suffix={`共 ${total.toLocaleString()} 只`} />

      {/* Stacked Bar */}
      <div className="h-6 flex rounded-lg overflow-hidden">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.bgClass} flex items-center justify-center transition-[width] duration-300 motion-reduce:transition-none`}
            style={{ width: `${seg.percent}%` }}
          >
            {seg.showLabel && (
              <span
                className={`text-[10px] font-semibold tabular-nums ${
                  seg.label === "平盘" ? "text-mine-muted" : "text-white"
                }`}
              >
                {seg.count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px]">
        {segments.map((seg) => (
          <LegendItem
            key={seg.label}
            label={seg.label}
            percent={seg.percent}
            bgClass={seg.bgClass}
            textClass={seg.textClass}
          />
        ))}
      </div>
    </div>
  );
});
