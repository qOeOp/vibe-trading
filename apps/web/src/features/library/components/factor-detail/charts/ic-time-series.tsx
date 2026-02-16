"use client";

import { useMemo } from "react";
import { DetailSection, DetailChartBox } from "@/components/shared/detail-panel";
import { computeRollingMA } from "../../../utils/compute-ic-stats";
import type { Factor } from "../../../types";

const IC_PROBATION_THRESHOLD = 0.01;
const IC_MA_WINDOW = 60;

function ICTimeSeriesChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const ma = useMemo(() => computeRollingMA(data, IC_MA_WINDOW), [data]);

  const w = 320;
  const h = 100;
  const padding = { top: 4, right: 4, bottom: 4, left: 4 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  const allValues = [...data, IC_PROBATION_THRESHOLD, -IC_PROBATION_THRESHOLD];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 0.001;

  const toY = (v: number) => padding.top + plotH - ((v - min) / range) * plotH;
  const toX = (i: number) => padding.left + (i / (data.length - 1)) * plotW;

  const rawPath = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

  const maSegments: string[] = [];
  let maStarted = false;
  for (let i = 0; i < ma.length; i++) {
    const v = ma[i];
    if (v === null) continue;
    maSegments.push(`${!maStarted ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
    maStarted = true;
  }
  const maPath = maSegments.join(" ");

  const zeroY = toY(0);
  const showZero = min < 0 && max > 0;
  const thresholdY = toY(IC_PROBATION_THRESHOLD);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {showZero && (
        <line
          x1={padding.left} y1={zeroY}
          x2={w - padding.right} y2={zeroY}
          className="stroke-mine-border" strokeWidth={0.5} strokeDasharray="3 2"
        />
      )}
      <line
        x1={padding.left} y1={thresholdY}
        x2={w - padding.right} y2={thresholdY}
        className="stroke-market-up-medium" strokeWidth={0.8}
        strokeDasharray="4 4" opacity={0.6}
      />
      <path
        d={rawPath} fill="none"
        className="stroke-mine-muted" strokeWidth={0.8}
        strokeLinejoin="round" strokeLinecap="round" opacity={0.5}
      />
      {maPath && (
        <path
          d={maPath} fill="none"
          stroke="#3b82f6" strokeWidth={2}
          strokeLinejoin="round" strokeLinecap="round"
        />
      )}
    </svg>
  );
}

interface ICTimeSeriesSectionProps {
  factor: Factor;
}

export function ICTimeSeriesSection({ factor }: ICTimeSeriesSectionProps) {
  return (
    <DetailSection title="IC 时序 (240D)">
      <div className="flex items-center gap-3 mb-1">
        <span className="flex items-center gap-1 text-[8px] text-mine-muted">
          <span className="inline-block w-3 h-[2px] bg-mine-muted opacity-50" />
          日值
        </span>
        <span className="flex items-center gap-1 text-[8px] text-mine-muted">
          <span className="inline-block w-3 h-[2px] bg-[#3b82f6]" />
          60日MA
        </span>
        <span className="flex items-center gap-1 text-[8px] text-mine-muted">
          <span className="inline-block w-3 h-[2px] border-t border-dashed border-market-up-medium" />
          阈值
        </span>
      </div>
      <DetailChartBox>
        <ICTimeSeriesChart data={factor.icTimeSeries} />
      </DetailChartBox>
    </DetailSection>
  );
}
