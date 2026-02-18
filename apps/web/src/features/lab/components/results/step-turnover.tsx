"use client";

import { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { TurnoverAnalysis } from "../../types";
import { StatBox } from "./stat-box";

// ─── Turnover Time Series (SVG) ─────────────────────────

function TurnoverTimeSeries({ data }: { data: number[] }) {
  const { path, avgLine, width, height } = useMemo(() => {
    const w = 600;
    const h = 80;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const avg = data.reduce((a, b) => a + b, 0) / data.length;

    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    });

    const avgY = h - ((avg - min) / range) * h;

    return { path: points.join(" "), avgLine: avgY, width: w, height: h };
  }, [data]);

  return (
    <div className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">
        日换手率时序 (240 日)
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[80px]"
        preserveAspectRatio="none"
      >
        {/* Average line */}
        <line
          x1={0}
          y1={avgLine}
          x2={width}
          y2={avgLine}
          stroke="#a8b2c7"
          strokeWidth={0.5}
          strokeDasharray="4"
        />
        {/* Turnover line */}
        <polyline
          points={path}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={1.2}
        />
      </svg>
    </div>
  );
}

// ─── Cost Impact Visualization ──────────────────────────

function CostImpactBar({
  grossIC,
  netIC,
  costDecayRatio,
}: {
  grossIC: number;
  netIC: number;
  costDecayRatio: number;
}) {
  const netRatio = netIC / (grossIC || 0.001);
  const netWidth = Math.max(0, Math.min(100, netRatio * 100));
  const costWidth = 100 - netWidth;

  return (
    <div className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-2">IC 成本侵蚀</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-5 bg-mine-border/30 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-mine-accent-green/70 rounded-l-full transition-all"
            style={{ width: `${netWidth}%` }}
          />
          <div
            className="h-full bg-mine-accent-red/40 rounded-r-full transition-all"
            style={{ width: `${costWidth}%` }}
          />
        </div>
        <span className="text-[10px] font-mono tabular-nums text-mine-muted shrink-0">
          {costDecayRatio.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[9px] text-mine-accent-green">
          净 IC: {netIC.toFixed(4)}
        </span>
        <span className="text-[9px] text-mine-accent-red">
          成本侵蚀
        </span>
      </div>
    </div>
  );
}

// ─── Step Turnover ──────────────────────────────────────

export function StepTurnover({
  turnover,
  grossIC,
}: {
  turnover: TurnoverAnalysis;
  grossIC: number;
}) {
  const costColor =
    turnover.costDecayRatio < 50
      ? "green"
      : turnover.costDecayRatio < 70
        ? "yellow"
        : "red";

  const netICColor =
    turnover.netICAfterCost > 0.015
      ? "green"
      : turnover.netICAfterCost > 0.005
        ? "yellow"
        : "red";

  return (
    <div data-slot="step-turnover" className="space-y-3">
      {/* KPI Row */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <StatBox
          label="日换手率"
          value={`${turnover.dailyTurnover.toFixed(1)}%`}
        />
        <StatBox
          label="年换手率"
          value={`${turnover.annualTurnover}%`}
        />
        <StatBox
          label="估算成本"
          value={`${turnover.estimatedCostBps} bps`}
          color={costColor}
        />
        <StatBox
          label="净 IC"
          value={turnover.netICAfterCost.toFixed(4)}
          color={netICColor}
        />
        <StatBox
          label="盈亏平衡"
          value={`${turnover.breakEvenCost} bps`}
        />
      </div>

      {/* Cost Impact */}
      <CostImpactBar
        grossIC={grossIC}
        netIC={turnover.netICAfterCost}
        costDecayRatio={turnover.costDecayRatio}
      />

      {/* Turnover time series */}
      <TurnoverTimeSeries data={turnover.turnoverTimeSeries} />

      {/* Period breakdown table */}
      <div className="rounded-lg border border-mine-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">周期</TableHead>
              <TableHead className="text-[10px] text-right">换手率</TableHead>
              <TableHead className="text-[10px] text-right">单次成本 (bps)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turnover.byPeriod.map((p) => (
              <TableRow key={p.period}>
                <TableCell className="text-[11px] font-medium">
                  {p.period}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {p.turnover.toFixed(2)}%
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {p.cost.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

