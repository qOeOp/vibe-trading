"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { DetailSection, DetailKV } from "@/components/shared/detail-panel";
import type { Factor } from "@/features/library/types";

function fmtIC(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(4)}`;
}

interface ICStatsCollapsibleProps {
  factor: Factor;
}

export function ICStatsCollapsible({ factor }: ICStatsCollapsibleProps) {
  const [open, setOpen] = useState(false);
  const d = factor.icDistribution;

  return (
    <DetailSection noBorder>
      <button
        type="button"
        className="flex items-center gap-1 text-[10px] text-mine-muted hover:text-mine-text transition-colors"
        onClick={() => setOpen(!open)}
      >
        <ChevronRight
          className="w-3 h-3 transition-transform"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        />
        IC 统计详情
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-0 mt-2 px-1">
          <DetailKV label="IC均值" value={fmtIC(d.icMean)} color={d.icMean >= 0 ? "positive" : "negative"} />
          <DetailKV label="IC标准差" value={d.icStd.toFixed(4)} />
          <DetailKV label="正值次数" value={`${d.icPositiveCount}`} />
          <DetailKV label="负值次数" value={`${d.icNegativeCount}`} />
          <DetailKV label="显著比例" value={`${(d.icSignificantRatio * 100).toFixed(1)}%`} />
          <DetailKV label="正显著比例" value={`${(d.icPositiveSignificantRatio * 100).toFixed(1)}%`} />
          <DetailKV label="负显著比例" value={`${(d.icNegativeSignificantRatio * 100).toFixed(1)}%`} />
          <DetailKV
            label="P值"
            value={d.icPValue < 0.001 ? "<0.001" : d.icPValue.toFixed(3)}
            color={d.icPValue < 0.05 ? "positive" : "negative"}
          />
          <DetailKV label="偏度" value={d.icSkewness.toFixed(2)} />
          <DetailKV label="峰度" value={d.icKurtosis.toFixed(2)} />
        </div>
      )}
    </DetailSection>
  );
}
