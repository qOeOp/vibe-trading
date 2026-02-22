"use client";

import { useMemo } from "react";
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
import type { OrthogonalityTest } from "@/features/lab/types";

// ─── Correlation Heatmap (SVG) ──────────────────────────

function CorrelationChart({
  factors,
}: {
  factors: { name: string; correlation: number; pValue: number }[];
}) {
  const barWidth = 32;
  const gap = 4;
  const chartHeight = 100;
  const svgWidth = factors.length * (barWidth + gap) - gap;
  const midY = chartHeight / 2;
  const maxCorr = Math.max(...factors.map((f) => Math.abs(f.correlation)), 0.01);

  return (
    <div className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">
        与已知因子相关性
      </div>
      <svg
        viewBox={`0 0 ${svgWidth} ${chartHeight + 28}`}
        className="w-full h-[130px]"
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
        {/* ±0.2 threshold lines */}
        {[0.2, -0.2].map((threshold) => {
          const ty =
            midY - (threshold / maxCorr) * (chartHeight / 2) * 0.9;
          return (
            <line
              key={threshold}
              x1={0}
              y1={ty}
              x2={svgWidth}
              y2={ty}
              stroke="#e74c3c"
              strokeWidth={0.3}
              strokeDasharray="2"
              opacity={0.4}
            />
          );
        })}
        {factors.map((f, i) => {
          const x = i * (barWidth + gap);
          const barH =
            (Math.abs(f.correlation) / maxCorr) * (chartHeight / 2) * 0.9;
          const isPositive = f.correlation >= 0;
          const y = isPositive ? midY - barH : midY;
          const isSignificant = f.pValue < 0.05;

          return (
            <g key={f.name}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill={isSignificant ? "#e74c3c" : "#26a69a"}
                rx={2}
                opacity={0.7}
              />
              {/* Factor name */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 12}
                textAnchor="middle"
                className="text-[8px] fill-mine-muted"
              >
                {f.name}
              </text>
              {/* Value */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 24}
                textAnchor="middle"
                className="text-[7px] fill-mine-muted font-mono"
              >
                {f.correlation.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Step Orthogonality ─────────────────────────────────

export function StepOrthogonality({
  orthogonality,
}: {
  orthogonality: OrthogonalityTest;
}) {
  const maxCorrColor =
    orthogonality.maxCorrelation < 0.15
      ? "green"
      : orthogonality.maxCorrelation < 0.25
        ? "yellow"
        : "red";

  const independenceColor =
    orthogonality.independenceRatio > 80
      ? "green"
      : orthogonality.independenceRatio > 65
        ? "yellow"
        : "red";

  return (
    <div data-slot="step-orthogonality" className="space-y-3">
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox
          label="最大相关性"
          value={orthogonality.maxCorrelation.toFixed(3)}
          color={maxCorrColor}
        />
        <StatBox
          label="残差 IC"
          value={orthogonality.residualIC.toFixed(4)}
        />
        <StatBox
          label="独立性"
          value={`${orthogonality.independenceRatio.toFixed(1)}%`}
          color={independenceColor}
        />
      </div>

      {/* Correlation Chart */}
      <CorrelationChart factors={orthogonality.knownFactors} />

      {/* Detailed table */}
      <div className="rounded-lg border border-mine-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">因子</TableHead>
              <TableHead className="text-[10px] text-right">相关系数</TableHead>
              <TableHead className="text-[10px] text-right">p-value</TableHead>
              <TableHead className="text-[10px] text-right">显著性</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orthogonality.knownFactors.map((f) => (
              <TableRow key={f.name}>
                <TableCell className="text-[11px] font-medium">
                  {f.name}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-[11px] font-mono tabular-nums text-right",
                    Math.abs(f.correlation) > 0.2 && "text-mine-accent-red",
                  )}
                >
                  {f.correlation > 0 ? "+" : ""}
                  {f.correlation.toFixed(3)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {f.pValue.toFixed(3)}
                </TableCell>
                <TableCell className="text-[11px] text-right">
                  {f.pValue < 0.01 ? (
                    <span className="text-mine-accent-red">***</span>
                  ) : f.pValue < 0.05 ? (
                    <span className="text-mine-accent-yellow">**</span>
                  ) : f.pValue < 0.1 ? (
                    <span className="text-mine-muted">*</span>
                  ) : (
                    <span className="text-mine-muted">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

