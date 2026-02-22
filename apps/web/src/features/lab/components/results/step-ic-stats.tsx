"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { ICStats } from "@/features/lab/types";

// ─── KPI Item ───────────────────────────────────────────

function KPIItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: "green" | "yellow" | "red" | "default";
}) {
  return (
    <div className="text-center">
      <div
        className={cn(
          "text-sm font-bold font-mono tabular-nums",
          color === "green" && "text-mine-accent-green",
          color === "yellow" && "text-mine-accent-yellow",
          color === "red" && "text-mine-accent-red",
          (!color || color === "default") && "text-mine-text",
        )}
      >
        {value}
      </div>
      <div className="text-[9px] text-mine-muted uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}

// ─── IC Time Series (simple SVG) ────────────────────────

function ICTimeSeries({ data }: { data: number[] }) {
  const { path, zeroY, width, height } = useMemo(() => {
    const w = 600;
    const h = 120;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    });

    const zy = h - ((0 - min) / range) * h;

    return { path: points.join(" "), zeroY: zy, width: w, height: h };
  }, [data]);

  return (
    <div className="bg-mine-bg rounded-md p-2 mt-3">
      <div className="text-[10px] text-mine-muted mb-1">IC 时序 (240 日)</div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[100px]"
        preserveAspectRatio="none"
      >
        {/* Zero line */}
        <line
          x1={0}
          y1={zeroY}
          x2={width}
          y2={zeroY}
          stroke="#a8b2c7"
          strokeWidth={0.5}
          strokeDasharray="4"
        />
        {/* IC line */}
        <polyline
          points={path}
          fill="none"
          stroke="#26a69a"
          strokeWidth={1.2}
        />
      </svg>
    </div>
  );
}

// ─── Step IC Stats ──────────────────────────────────────

export function StepICStats({ icStats }: { icStats: ICStats }) {
  const icColor =
    icStats.icMean > 0.03 ? "green" : icStats.icMean > 0.02 ? "yellow" : "red";
  const tColor =
    icStats.tStat > 2.0 ? "green" : icStats.tStat > 1.5 ? "yellow" : "red";

  return (
    <div data-slot="step-ic-stats">
      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        <KPIItem label="IC 均值" value={icStats.icMean.toFixed(4)} color={icColor} />
        <KPIItem label="IC 标准差" value={icStats.icStd.toFixed(4)} />
        <KPIItem label="IR" value={icStats.ir.toFixed(2)} />
        <KPIItem
          label="IC>0 占比"
          value={`${icStats.icPositiveRatio.toFixed(1)}%`}
        />
        <KPIItem label="t-stat" value={icStats.tStat.toFixed(2)} color={tColor} />
        <KPIItem
          label="覆盖率"
          value={`${icStats.coverageRate.toFixed(1)}%`}
        />
      </div>

      {/* IC Time Series */}
      <ICTimeSeries data={icStats.icTimeSeries} />

      {/* Detailed stats */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3">
        <StatRow label="偏度 (Skewness)" value={icStats.icSkewness.toFixed(2)} />
        <StatRow label="峰度 (Kurtosis)" value={icStats.icKurtosis.toFixed(2)} />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-mine-muted">{label}</span>
      <span className="text-[11px] font-mono tabular-nums text-mine-text">
        {value}
      </span>
    </div>
  );
}
