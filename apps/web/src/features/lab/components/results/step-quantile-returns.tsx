"use client";

import { useMemo } from "react";
import type { QuantileReturns } from "../../types";
import { StatBox } from "./stat-box";

// ─── Quantile Bar Chart (SVG) ───────────────────────────

const QUANTILE_COLORS = [
  "#0B8C5F", // Q1 - worst (green/跌)
  "#58CEAA", // Q2
  "#76808E", // Q3 - neutral
  "#E8626F", // Q4
  "#CF304A", // Q5 - best (red/涨)
];

function QuantileBarChart({
  groups,
}: {
  groups: { label: string; avgReturn: number }[];
}) {
  const { bars, maxAbs, chartHeight } = useMemo(() => {
    const absMax = Math.max(...groups.map((g) => Math.abs(g.avgReturn)), 0.001);
    const h = 100;
    const barData = groups.map((g, i) => {
      const barHeight = (Math.abs(g.avgReturn) / absMax) * (h / 2);
      const isPositive = g.avgReturn >= 0;
      return {
        ...g,
        color: QUANTILE_COLORS[i] ?? "#76808E",
        barHeight,
        isPositive,
      };
    });
    return { bars: barData, maxAbs: absMax, chartHeight: h };
  }, [groups]);

  const barWidth = 40;
  const gap = 16;
  const svgWidth = bars.length * (barWidth + gap) - gap;
  const midY = chartHeight / 2;

  return (
    <div className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">分位组平均收益</div>
      <svg
        viewBox={`0 0 ${svgWidth} ${chartHeight + 24}`}
        className="w-full h-[120px]"
      >
        {/* Zero line */}
        <line
          x1={0}
          y1={midY}
          x2={svgWidth}
          y2={midY}
          stroke="#a8b2c7"
          strokeWidth={0.5}
          strokeDasharray="4"
        />
        {bars.map((bar, i) => {
          const x = i * (barWidth + gap);
          const y = bar.isPositive ? midY - bar.barHeight : midY;
          return (
            <g key={bar.label}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={bar.barHeight}
                fill={bar.color}
                rx={3}
                opacity={0.85}
              />
              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 12}
                textAnchor="middle"
                className="text-[10px] fill-mine-muted"
              >
                {bar.label}
              </text>
              {/* Value */}
              <text
                x={x + barWidth / 2}
                y={bar.isPositive ? y - 4 : y + bar.barHeight + 12}
                textAnchor="middle"
                className="text-[9px] fill-mine-muted font-mono"
              >
                {(bar.avgReturn * 100).toFixed(2)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Long-Short Curve (SVG) ─────────────────────────────

function LongShortCurve({
  curve,
}: {
  curve: { date: string; value: number }[];
}) {
  const { path, width, height } = useMemo(() => {
    const w = 300;
    const h = 80;
    const values = curve.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = curve.map((p, i) => {
      const x = (i / (curve.length - 1)) * w;
      const y = h - ((p.value - min) / range) * h;
      return `${x},${y}`;
    });

    return { path: points.join(" "), width: w, height: h };
  }, [curve]);

  return (
    <div className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">多空净值曲线</div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[80px]"
        preserveAspectRatio="none"
      >
        <polyline
          points={path}
          fill="none"
          stroke="#6366f1"
          strokeWidth={1.5}
        />
      </svg>
    </div>
  );
}

// ─── Step Quantile Returns ──────────────────────────────

export function StepQuantileReturns({
  quantileReturns,
}: {
  quantileReturns: QuantileReturns;
}) {
  return (
    <div data-slot="step-quantile-returns" className="space-y-3">
      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <QuantileBarChart groups={quantileReturns.groups} />
        <LongShortCurve curve={quantileReturns.longShortCurve} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox
          label="单调性"
          value={quantileReturns.monotonicity.toFixed(2)}
          color={quantileReturns.monotonicity > 0.8 ? "green" : undefined}
        />
        <StatBox
          label="多空年化"
          value={`${quantileReturns.longShortReturn.toFixed(2)}%`}
        />
        <StatBox
          label="最大回撤"
          value={`${quantileReturns.longShortMaxDD.toFixed(2)}%`}
          color={quantileReturns.longShortMaxDD < -15 ? "red" : undefined}
        />
        <StatBox
          label="多空 IR"
          value={quantileReturns.longShortIR.toFixed(2)}
        />
      </div>
    </div>
  );
}

