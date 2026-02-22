"use client";

import { cn } from "@/lib/utils";
import type { ConditionalICAnalysis, ConditionalICGroup } from "@/features/lab/types";

// ─── Grouped Bar Chart (SVG) ────────────────────────────

function ConditionBarChart({
  title,
  groups,
}: {
  title: string;
  groups: ConditionalICGroup[];
}) {
  const barWidth = 48;
  const gap = 12;
  const chartHeight = 80;
  const svgWidth = groups.length * (barWidth + gap) - gap;
  const maxIC = Math.max(...groups.map((g) => Math.abs(g.icMean)), 0.001);
  const midY = chartHeight / 2;

  return (
    <div className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">{title}</div>
      <svg
        viewBox={`0 0 ${svgWidth} ${chartHeight + 24}`}
        className="w-full h-[100px]"
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
        {groups.map((g, i) => {
          const x = i * (barWidth + gap);
          const barH = (Math.abs(g.icMean) / maxIC) * (chartHeight / 2) * 0.85;
          const isPositive = g.icMean >= 0;
          const y = isPositive ? midY - barH : midY;

          return (
            <g key={g.condition}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill="#26a69a"
                rx={3}
                opacity={0.6 + (i * 0.15)}
              />
              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 12}
                textAnchor="middle"
                className="text-[9px] fill-mine-muted"
              >
                {g.condition}
              </text>
              {/* IC value */}
              <text
                x={x + barWidth / 2}
                y={isPositive ? y - 4 : y + barH + 11}
                textAnchor="middle"
                className="text-[8px] fill-mine-muted font-mono"
              >
                {g.icMean.toFixed(4)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Condition Table ────────────────────────────────────

function ConditionTable({
  groups,
}: {
  groups: ConditionalICGroup[];
}) {
  return (
    <div className="space-y-1">
      {groups.map((g) => (
        <div
          key={g.condition}
          className="flex items-center justify-between text-[11px]"
        >
          <span className="text-mine-muted w-16">{g.condition}</span>
          <span className="font-mono tabular-nums text-mine-text">
            IC={g.icMean.toFixed(4)}
          </span>
          <span className="font-mono tabular-nums text-mine-muted">
            ±{g.icStd.toFixed(4)}
          </span>
          <span className="text-mine-muted text-[10px]">
            {g.sampleRatio.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Step Conditional IC ────────────────────────────────

export function StepConditionalIC({
  conditionalIC,
}: {
  conditionalIC: ConditionalICAnalysis;
}) {
  const stabilityColor =
    conditionalIC.stabilityScore > 0.7
      ? "green"
      : conditionalIC.stabilityScore > 0.4
        ? "yellow"
        : "red";

  return (
    <div data-slot="step-conditional-ic" className="space-y-3">
      {/* Stability callout */}
      <div className="flex items-center gap-2 px-3 py-2 bg-mine-bg rounded-lg">
        <span className="text-xs text-mine-muted">稳定性评分:</span>
        <span
          className={cn(
            "text-sm font-bold font-mono tabular-nums",
            stabilityColor === "green" && "text-mine-accent-green",
            stabilityColor === "yellow" && "text-mine-accent-yellow",
            stabilityColor === "red" && "text-mine-accent-red",
          )}
        >
          {conditionalIC.stabilityScore.toFixed(2)}
        </span>
        <span className="text-[10px] text-mine-muted">
          {conditionalIC.stabilityScore > 0.7
            ? "— 不同市场环境下表现稳定"
            : conditionalIC.stabilityScore > 0.4
              ? "— 部分环境下波动较大"
              : "— 对市场环境高度敏感"}
        </span>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ConditionBarChart
          title="按市场环境"
          groups={conditionalIC.byMarketRegime}
        />
        <ConditionBarChart
          title="按波动率"
          groups={conditionalIC.byVolatility}
        />
      </div>

      {/* Liquidity (smaller) */}
      <ConditionBarChart
        title="按流动性"
        groups={conditionalIC.byLiquidity}
      />

      {/* Detailed breakdown */}
      <div className="space-y-3">
        <div>
          <div className="text-[10px] text-mine-muted uppercase tracking-wider mb-1.5">
            市场环境
          </div>
          <ConditionTable groups={conditionalIC.byMarketRegime} />
        </div>
        <div>
          <div className="text-[10px] text-mine-muted uppercase tracking-wider mb-1.5">
            波动率分组
          </div>
          <ConditionTable groups={conditionalIC.byVolatility} />
        </div>
        <div>
          <div className="text-[10px] text-mine-muted uppercase tracking-wider mb-1.5">
            流动性分组
          </div>
          <ConditionTable groups={conditionalIC.byLiquidity} />
        </div>
      </div>
    </div>
  );
}
