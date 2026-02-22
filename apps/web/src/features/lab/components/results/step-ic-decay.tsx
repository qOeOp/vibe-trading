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
import type { ICDecay } from "@/features/lab/types";

// ─── IC Decay Chart (SVG) ───────────────────────────────

function ICDecayChart({ lags }: { lags: { lag: number; ic: number }[] }) {
  const { path, width, height, zeroY } = useMemo(() => {
    const w = 400;
    const h = 80;
    const ics = lags.map((l) => l.ic);
    const min = Math.min(...ics, 0);
    const max = Math.max(...ics);
    const range = max - min || 1;

    const points = lags.map((l, i) => {
      const x = (i / (lags.length - 1)) * w;
      const y = h - ((l.ic - min) / range) * h;
      return `${x},${y}`;
    });

    const zy = h - ((0 - min) / range) * h;

    return { path: points.join(" "), width: w, height: h, zeroY: zy };
  }, [lags]);

  return (
    <div className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">
        IC 衰减曲线 (T+1 ~ T+20)
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[80px]"
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
        {/* Decay line */}
        <polyline
          points={path}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={1.5}
        />
        {/* Data points */}
        {lags.map((l, i) => {
          const x = (i / (lags.length - 1)) * width;
          const ics = lags.map((ll) => ll.ic);
          const min = Math.min(...ics, 0);
          const max = Math.max(...ics);
          const range = max - min || 1;
          const y = height - ((l.ic - min) / range) * height;
          return (
            <circle
              key={l.lag}
              cx={x}
              cy={y}
              r={2}
              fill="#f59e0b"
              opacity={0.7}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Step IC Decay ──────────────────────────────────────

export function StepICDecay({ icDecay }: { icDecay: ICDecay }) {
  return (
    <div data-slot="step-ic-decay" className="space-y-3">
      {/* Half-life callout */}
      <div className="flex items-center gap-2 px-3 py-2 bg-mine-bg rounded-lg">
        <span className="text-xs text-mine-muted">IC 半衰期:</span>
        <span className="text-sm font-bold font-mono tabular-nums text-mine-text">
          {icDecay.halfLife.toFixed(1)} 天
        </span>
        <span className="text-[10px] text-mine-muted">
          {icDecay.halfLife <= 5
            ? "— 衰减较快，适合短周期"
            : icDecay.halfLife <= 10
              ? "— 衰减中等"
              : "— 衰减缓慢，适合长周期"}
        </span>
      </div>

      {/* Decay chart */}
      <ICDecayChart lags={icDecay.lags} />

      {/* Multi-period stats table */}
      <div className="rounded-lg border border-mine-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">持有期</TableHead>
              <TableHead className="text-[10px] text-right">IC 均值</TableHead>
              <TableHead className="text-[10px] text-right">IC 标准差</TableHead>
              <TableHead className="text-[10px] text-right">IR</TableHead>
              <TableHead className="text-[10px] text-right">偏度</TableHead>
              <TableHead className="text-[10px] text-right">峰度</TableHead>
              <TableHead className="text-[10px] text-right">IC&lt;0%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {icDecay.multiPeriodStats.map((stat) => (
              <TableRow key={stat.period}>
                <TableCell className="text-[11px] font-medium">
                  T+{stat.period}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icMean.toFixed(4)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icStd.toFixed(4)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.ir.toFixed(2)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icSkew.toFixed(2)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icKurt.toFixed(2)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icNegRatio.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
