"use client";

import { cn } from "@/lib/utils";
import { StatBox } from "./stat-box";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { FactorAttribution } from "../../types";

// ─── Style Exposure Bar Chart (SVG) ─────────────────────

function ExposureChart({
  exposures,
}: {
  exposures: { name: string; exposure: number; contribution: number }[];
}) {
  const barHeight = 18;
  const gap = 6;
  const labelWidth = 60;
  const chartWidth = 300;
  const svgWidth = labelWidth + chartWidth + 60;
  const svgHeight = exposures.length * (barHeight + gap) - gap;
  const maxExposure = Math.max(...exposures.map((e) => Math.abs(e.exposure)), 0.01);
  const midX = labelWidth + chartWidth / 2;

  return (
    <div className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">风格因子暴露</div>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ height: `${Math.max(svgHeight, 80)}px` }}
      >
        {/* Zero line */}
        <line
          x1={midX}
          y1={0}
          x2={midX}
          y2={svgHeight}
          stroke="#a8b2c7"
          strokeWidth={0.5}
          strokeDasharray="4"
        />
        {exposures.map((e, i) => {
          const y = i * (barHeight + gap);
          const barW = (Math.abs(e.exposure) / maxExposure) * (chartWidth / 2) * 0.85;
          const isPositive = e.exposure >= 0;
          const barX = isPositive ? midX : midX - barW;

          return (
            <g key={e.name}>
              {/* Label */}
              <text
                x={labelWidth - 4}
                y={y + barHeight / 2 + 4}
                textAnchor="end"
                className="text-[10px] fill-mine-muted"
              >
                {e.name}
              </text>
              {/* Bar */}
              <rect
                x={barX}
                y={y}
                width={barW}
                height={barHeight}
                fill={isPositive ? "#26a69a" : "#e74c3c"}
                rx={3}
                opacity={0.7}
              />
              {/* Value */}
              <text
                x={isPositive ? midX + barW + 4 : midX - barW - 4}
                y={y + barHeight / 2 + 4}
                textAnchor={isPositive ? "start" : "end"}
                className="text-[9px] fill-mine-muted font-mono"
              >
                {e.exposure > 0 ? "+" : ""}
                {e.exposure.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Industry Exposure Mini Chart ───────────────────────

function IndustryChart({
  industries,
}: {
  industries: { industry: string; weight: number }[];
}) {
  const top = industries.slice(0, 8); // Show top 8
  const barHeight = 14;
  const gap = 4;
  const labelWidth = 56;
  const chartWidth = 200;
  const svgWidth = labelWidth + chartWidth + 40;
  const svgHeight = top.length * (barHeight + gap) - gap;
  const maxWeight = Math.max(...top.map((i) => Math.abs(i.weight)), 0.01);
  const midX = labelWidth + chartWidth / 2;

  return (
    <div className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">
        行业暴露 (Top 8)
      </div>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ height: `${Math.max(svgHeight, 60)}px` }}
      >
        <line
          x1={midX}
          y1={0}
          x2={midX}
          y2={svgHeight}
          stroke="#a8b2c7"
          strokeWidth={0.3}
          strokeDasharray="3"
        />
        {top.map((ind, i) => {
          const y = i * (barHeight + gap);
          const barW = (Math.abs(ind.weight) / maxWeight) * (chartWidth / 2) * 0.8;
          const isPositive = ind.weight >= 0;
          const barX = isPositive ? midX : midX - barW;

          return (
            <g key={ind.industry}>
              <text
                x={labelWidth - 3}
                y={y + barHeight / 2 + 3}
                textAnchor="end"
                className="text-[8px] fill-mine-muted"
              >
                {ind.industry}
              </text>
              <rect
                x={barX}
                y={y}
                width={barW}
                height={barHeight}
                fill={isPositive ? "#6366f1" : "#f59e0b"}
                rx={2}
                opacity={0.6}
              />
              <text
                x={isPositive ? midX + barW + 3 : midX - barW - 3}
                y={y + barHeight / 2 + 3}
                textAnchor={isPositive ? "start" : "end"}
                className="text-[7px] fill-mine-muted font-mono"
              >
                {ind.weight > 0 ? "+" : ""}{ind.weight.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Step Attribution ───────────────────────────────────

export function StepAttribution({
  attribution,
}: {
  attribution: FactorAttribution;
}) {
  const alphaColor =
    attribution.alphaIC > 0.02
      ? "green"
      : attribution.alphaIC > 0.01
        ? "yellow"
        : "red";

  const r2Color =
    attribution.r2 < 50
      ? "green"
      : attribution.r2 < 70
        ? "yellow"
        : "red";

  return (
    <div data-slot="step-attribution" className="space-y-3">
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Alpha IC" value={attribution.alphaIC.toFixed(4)} color={alphaColor} />
        <StatBox
          label="风格 R²"
          value={`${attribution.r2.toFixed(1)}%`}
          color={r2Color}
        />
        <StatBox
          label="特异风险"
          value={`${attribution.specificRisk.toFixed(1)}%`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ExposureChart exposures={attribution.styleExposures} />
        <IndustryChart industries={attribution.industryExposures} />
      </div>

      {/* Style exposure table */}
      <div className="rounded-lg border border-mine-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">风格因子</TableHead>
              <TableHead className="text-[10px] text-right">暴露</TableHead>
              <TableHead className="text-[10px] text-right">贡献度</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attribution.styleExposures.map((s) => (
              <TableRow key={s.name}>
                <TableCell className="text-[11px] font-medium">
                  {s.name}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-[11px] font-mono tabular-nums text-right",
                    Math.abs(s.exposure) > 0.3 && "text-mine-accent-yellow",
                  )}
                >
                  {s.exposure > 0 ? "+" : ""}
                  {s.exposure.toFixed(3)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {s.contribution.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

