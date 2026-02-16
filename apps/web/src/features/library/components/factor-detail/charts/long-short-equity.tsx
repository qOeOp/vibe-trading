"use client";

import { useMemo } from "react";
import { DetailSection, DetailChartBox } from "@/components/shared/detail-panel";
import type { Factor } from "../../../types";

function EquityCurveChart({ curve }: { curve: number[] }) {
  if (!curve || curve.length < 2) return null;

  const w = 320;
  const h = 80;
  const padding = { top: 4, right: 4, bottom: 4, left: 4 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  const min = Math.min(...curve);
  const max = Math.max(...curve);
  const range = max - min || 0.001;

  const toY = (v: number) => padding.top + plotH - ((v - min) / range) * plotH;
  const toX = (i: number) => padding.left + (i / (curve.length - 1)) * plotW;

  const linePath = curve
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

  // Find MaxDD period
  let peak = curve[0];
  let maxDD = 0;
  let maxDDStart = 0;
  let maxDDEnd = 0;
  let currentPeakIdx = 0;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i] > peak) {
      peak = curve[i];
      currentPeakIdx = i;
    }
    const dd = (peak - curve[i]) / peak;
    if (dd > maxDD) {
      maxDD = dd;
      maxDDStart = currentPeakIdx;
      maxDDEnd = i;
    }
  }

  const ddAreaPath = maxDD > 0.01
    ? curve
        .slice(maxDDStart, maxDDEnd + 1)
        .map((v, i) => {
          const idx = maxDDStart + i;
          return `${i === 0 ? "M" : "L"}${toX(idx).toFixed(1)},${toY(v).toFixed(1)}`;
        })
        .join(" ") +
      ` L${toX(maxDDEnd).toFixed(1)},${(padding.top + plotH).toFixed(1)}` +
      ` L${toX(maxDDStart).toFixed(1)},${(padding.top + plotH).toFixed(1)} Z`
    : null;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <line
        x1={padding.left} y1={toY(1.0)}
        x2={w - padding.right} y2={toY(1.0)}
        className="stroke-mine-border" strokeWidth={0.5} strokeDasharray="3 2"
      />
      {ddAreaPath && (
        <path
          d={ddAreaPath}
          className="fill-market-up-medium" opacity={0.08}
        />
      )}
      <path
        d={linePath} fill="none"
        stroke="#6366f1" strokeWidth={1.5}
        strokeLinejoin="round" strokeLinecap="round"
      />
    </svg>
  );
}

interface LongShortEquitySectionProps {
  factor: Factor;
}

export function LongShortEquitySection({ factor }: LongShortEquitySectionProps) {
  const { maxDD, sharpe } = useMemo(() => {
    const curve = factor.longShortEquityCurve;
    if (!curve || curve.length < 2) return { maxDD: 0, sharpe: 0 };

    let peak = curve[0];
    let mdd = 0;
    for (let i = 1; i < curve.length; i++) {
      if (curve[i] > peak) peak = curve[i];
      const dd = (peak - curve[i]) / peak;
      if (dd > mdd) mdd = dd;
    }

    const returns: number[] = [];
    for (let i = 1; i < curve.length; i++) {
      returns.push(curve[i] / curve[i - 1] - 1);
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const std = Math.sqrt(
      returns.reduce((a, v) => a + (v - mean) ** 2, 0) / (returns.length - 1),
    );
    const annSharpe = std > 0 ? (mean / std) * Math.sqrt(252) : 0;

    return { maxDD: mdd, sharpe: annSharpe };
  }, [factor.longShortEquityCurve]);

  return (
    <DetailSection title="多空净值曲线">
      <DetailChartBox>
        <EquityCurveChart curve={factor.longShortEquityCurve} />
      </DetailChartBox>
      <div className="flex items-center gap-3 text-[10px] mt-2">
        <span>
          <span className="text-mine-muted">年化</span>{" "}
          <span className={`font-semibold tabular-nums font-mono ${factor.longShortReturn >= 0 ? "text-market-down-medium" : "text-market-up-medium"}`}>
            {factor.longShortReturn >= 0 ? "+" : ""}{factor.longShortReturn.toFixed(1)}%
          </span>
        </span>
        <span>
          <span className="text-mine-muted">MaxDD</span>{" "}
          <span className="font-semibold tabular-nums font-mono text-market-up-medium">
            -{(maxDD * 100).toFixed(1)}%
          </span>
        </span>
        <span>
          <span className="text-mine-muted">Sharpe</span>{" "}
          <span className="font-semibold tabular-nums font-mono text-mine-text">
            {sharpe.toFixed(2)}
          </span>
        </span>
        <span>
          <span className="text-mine-muted">多头占比</span>{" "}
          <span className="font-semibold tabular-nums font-mono text-mine-text">
            {(factor.longSideReturnRatio * 100).toFixed(0)}%
          </span>
        </span>
      </div>
    </DetailSection>
  );
}
