"use client";

import { useMemo, useState, useCallback } from "react";
import { X, Copy, Clock, ArrowRight, ChevronRight } from "lucide-react";
import { RadarChart } from "@/lib/ngx-charts/radar-chart";
import {
  computeRadarScores,
  radarScoresToValues,
  RADAR_LABELS,
} from "../utils/compute-radar-scores";
import { computeRollingMA } from "../utils/compute-ic-stats";
import type { Factor } from "../types";
import {
  CATEGORY_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  SOURCE_LABELS,
  SOURCE_COLORS,
  TYPE_LABELS,
  TYPE_COLORS,
  WINSORIZATION_LABELS,
  VALID_STATUS_TRANSITIONS,
  UNIVERSE_POOLS,
} from "../types";
import type { FactorLifecycleStatus } from "../types";
import { useLibraryStore } from "../store/use-library-store";
import { LifecycleTimeline } from "./lifecycle-timeline";
import { StatusChangeDialog } from "./status-change-dialog";

// ─── V-Score Indicator ───────────────────────────────────

function VScoreIndicator({ vScore }: { vScore: number }) {
  let label: string;
  let color: string;
  let bgColor: string;

  if (vScore < -1) {
    label = "低估";
    color = "#3b82f6";
    bgColor = "rgba(59, 130, 246, 0.08)";
  } else if (vScore > 1) {
    label = "拥挤风险";
    color = "#f5a623";
    bgColor = "rgba(245, 166, 35, 0.08)";
  } else {
    label = "正常";
    color = "#8a8a8a";
    bgColor = "rgba(138, 138, 138, 0.06)";
  }

  return (
    <div
      className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-md"
      style={{ backgroundColor: bgColor }}
    >
      <span className="text-[10px] text-mine-muted">V-Score</span>
      <span
        className="text-[11px] font-bold font-mono tabular-nums"
        style={{ color }}
      >
        {vScore >= 0 ? "+" : ""}{vScore.toFixed(2)}
      </span>
      <span
        className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Section A: Identity Card ────────────────────────────

function IdentitySection({ factor }: { factor: Factor }) {
  const catColor = CATEGORY_COLORS[factor.category];
  const statusColor = STATUS_COLORS[factor.status];
  const statusLabel = STATUS_LABELS[factor.status];
  const sourceLabel = SOURCE_LABELS[factor.source];
  const sourceColor = SOURCE_COLORS[factor.source];
  const typeLabel = TYPE_LABELS[factor.factorType];
  const typeColor = TYPE_COLORS[factor.factorType];

  return (
    <div className="px-4 py-3 border-b border-mine-border/50">
      {/* Row 1: Name + Close */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-mine-text">{factor.name}</h3>
            <span className="text-[10px] text-mine-muted font-mono">
              {factor.version}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {/* Category badge */}
            <span
              className="px-2 py-0.5 text-[10px] font-semibold rounded"
              style={{ backgroundColor: `${catColor}18`, color: catColor }}
            >
              {factor.category}
            </span>
            {/* Type badge */}
            <span
              className="px-1.5 py-0.5 text-[10px] font-semibold rounded"
              style={{ backgroundColor: `${typeColor}18`, color: typeColor }}
            >
              {typeLabel}
            </span>
            {/* Source */}
            <span
              className="text-[10px] font-medium"
              style={{ color: sourceColor }}
            >
              {sourceLabel}
            </span>
          </div>
        </div>
        {/* Status badge */}
        <span
          className="px-2 py-0.5 text-[10px] font-bold rounded"
          style={{ backgroundColor: `${statusColor}18`, color: statusColor }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Row 2: Expression */}
      <div className="bg-mine-bg rounded-md px-3 py-2 mt-2 flex items-center gap-2">
        <code className="text-[11px] text-mine-text font-mono flex-1 break-all leading-relaxed">
          {factor.expression}
        </code>
        <button
          type="button"
          className="text-mine-muted hover:text-mine-text transition-colors shrink-0"
          title="复制表达式"
          onClick={() => navigator.clipboard.writeText(factor.expression)}
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>

      {/* Row 3: Meta */}
      <div className="flex items-center gap-4 mt-2 text-[10px] text-mine-muted">
        <span>
          <Clock className="w-3 h-3 inline mr-0.5 -mt-0.5" />
          {factor.createdAt}
        </span>
        <span>by {factor.createdBy}</span>
        {factor.tags.length > 0 && (
          <div className="flex items-center gap-1">
            {factor.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-mine-bg rounded text-[9px]"
              >
                {tag}
              </span>
            ))}
            {factor.tags.length > 3 && (
              <span className="text-[9px]">+{factor.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Row 4: Lifecycle Timeline */}
      <LifecycleTimeline status={factor.status} />

      {/* Row 5: V-Score */}
      <VScoreIndicator vScore={factor.vScore} />
    </div>
  );
}

// ─── Section B: Statistics Grid ──────────────────────────

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className="text-sm font-bold tabular-nums"
        style={{ color: color ?? "#1a1a1a" }}
      >
        {value}
      </span>
      <span className="text-[9px] text-mine-muted uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function QuantileBar({ returns }: { returns: [number, number, number, number, number] }) {
  const labels = ["Q1", "Q2", "Q3", "Q4", "Q5"];
  const maxAbs = Math.max(...returns.map(Math.abs), 0.01);

  return (
    <div className="flex items-end gap-1 h-[48px]">
      {returns.map((r, i) => {
        const height = Math.max(4, (Math.abs(r) / maxAbs) * 40);
        const color = r >= 0 ? "#2EBD85" : "#F6465D";
        return (
          <div
            key={labels[i]}
            className="flex-1 flex flex-col items-center gap-0.5"
          >
            <div
              className="w-full rounded-sm"
              style={{
                height: `${height}px`,
                backgroundColor: color,
                opacity: 0.7 + (i / 4) * 0.3,
              }}
            />
            <span className="text-[8px] text-mine-muted">{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

function ICStatsKV({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-mine-muted">{label}</span>
      <span
        className="text-[11px] font-mono tabular-nums"
        style={{ color: color ?? "#1a1a1a" }}
      >
        {value}
      </span>
    </div>
  );
}

function ICStatsCollapsible({ factor }: { factor: Factor }) {
  const [open, setOpen] = useState(false);
  const d = factor.icDistribution;

  return (
    <div className="mt-3">
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 px-1">
          <ICStatsKV label="IC均值" value={fmtIC(d.icMean)} color={d.icMean >= 0 ? "#2EBD85" : "#F6465D"} />
          <ICStatsKV label="IC标准差" value={d.icStd.toFixed(4)} />
          <ICStatsKV label="正值次数" value={`${d.icPositiveCount}`} />
          <ICStatsKV label="负值次数" value={`${d.icNegativeCount}`} />
          <ICStatsKV label="显著比例" value={`${(d.icSignificantRatio * 100).toFixed(1)}%`} />
          <ICStatsKV label="正显著比例" value={`${(d.icPositiveSignificantRatio * 100).toFixed(1)}%`} />
          <ICStatsKV label="负显著比例" value={`${(d.icNegativeSignificantRatio * 100).toFixed(1)}%`} />
          <ICStatsKV
            label="P值"
            value={d.icPValue < 0.001 ? "<0.001" : d.icPValue.toFixed(3)}
            color={d.icPValue < 0.05 ? "#2EBD85" : "#F6465D"}
          />
          <ICStatsKV label="偏度" value={d.icSkewness.toFixed(2)} />
          <ICStatsKV label="峰度" value={d.icKurtosis.toFixed(2)} />
        </div>
      )}
    </div>
  );
}

function StatisticsSection({ factor }: { factor: Factor }) {
  const icColor = factor.ic >= 0 ? "#2EBD85" : "#F6465D";
  const irAbs = Math.abs(factor.ir);
  const irColor = irAbs >= 1.5 ? "#2EBD85" : irAbs >= 0.5 ? "#76808E" : "#F6465D";
  const cfg = factor.benchmarkConfig;

  return (
    <div className="px-4 py-3 border-b border-mine-border/50">
      {/* Benchmark config line */}
      <div className="text-[10px] text-mine-muted mb-2">
        基准: {cfg.universe} · {cfg.icMethod} · {WINSORIZATION_LABELS[cfg.winsorization]} · {cfg.rebalanceDays}日调仓
      </div>

      {/* Stats grid: 2×3 */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <StatItem
          label="IC (20D)"
          value={`${factor.ic >= 0 ? "+" : ""}${factor.ic.toFixed(3)}`}
          color={icColor}
        />
        <StatItem
          label="IR"
          value={factor.ir.toFixed(2)}
          color={irColor}
        />
        <StatItem
          label="t-stat"
          value={factor.icTstat.toFixed(2)}
          color={Math.abs(factor.icTstat) >= 2 ? "#2EBD85" : "#F6465D"}
        />
        <StatItem
          label="胜率"
          value={`${factor.winRate}%`}
          color={factor.winRate >= 55 ? "#2EBD85" : "#76808E"}
        />
        <StatItem
          label="换手"
          value={`${factor.turnover}%`}
        />
        <StatItem
          label="容量"
          value={
            factor.capacity >= 10000
              ? `${(factor.capacity / 10000).toFixed(0)}亿`
              : `${factor.capacity}万`
          }
        />
      </div>

      {/* Multi-horizon IC */}
      <div className="flex items-center gap-4 text-[10px] mb-3">
        <span className="text-mine-muted">IC滚动:</span>
        <span>
          <span className="text-mine-muted">60D</span>{" "}
          <span
            className="font-semibold tabular-nums"
            style={{ color: factor.ic60d >= 0 ? "#2EBD85" : "#F6465D" }}
          >
            {factor.ic60d >= 0 ? "+" : ""}{factor.ic60d.toFixed(3)}
          </span>
        </span>
        <span>
          <span className="text-mine-muted">120D</span>{" "}
          <span
            className="font-semibold tabular-nums"
            style={{ color: factor.ic120d >= 0 ? "#2EBD85" : "#F6465D" }}
          >
            {factor.ic120d >= 0 ? "+" : ""}{factor.ic120d.toFixed(3)}
          </span>
        </span>
      </div>

      {/* Quantile returns bar */}
      <div>
        <div className="text-[10px] text-mine-muted mb-1">分位收益 (Q1-Q5)</div>
        <QuantileBar returns={factor.quantileReturns} />
      </div>

      {/* Collapsible IC distribution stats */}
      <ICStatsCollapsible factor={factor} />
    </div>
  );
}

/** Format IC value with sign */
function fmtIC(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(4)}`;
}

// ─── Section B1.5: Multi-Universe Fitness ────────────────

/** IC color by absolute magnitude (not sign — negative-direction factors have negative IC by design) */
function icMagnitudeColor(ic: number): string {
  const abs = Math.abs(ic);
  if (abs >= 0.05) return "#0B8C5F"; // deep green — excellent
  if (abs >= 0.03) return "#2EBD85"; // medium green — good
  if (abs >= 0.02) return "#76808E"; // gray — marginal
  return "#F6465D";                  // red — weak
}

function FitnessSection({ factor }: { factor: Factor }) {
  const profile = factor.universeProfile;
  if (!profile || profile.length === 0) return null;

  const defaultPool = factor.benchmarkConfig.universe;

  // Find best pool by |IC| magnitude
  const best = profile.reduce((a, b) =>
    Math.abs(b.ic) > Math.abs(a.ic) ? b : a,
  );

  return (
    <div className="px-4 py-3 border-b border-mine-border/50">
      <div className="text-[10px] text-mine-muted uppercase tracking-wider mb-2">
        多池适用性
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-[9px] text-mine-muted uppercase tracking-wider bg-mine-bg/50">
            <th className="text-left py-1 px-2 font-medium">股票池</th>
            <th className="text-right py-1 px-2 font-medium">IC</th>
            <th className="text-right py-1 px-2 font-medium">IR</th>
          </tr>
        </thead>
        <tbody>
          {profile.map((row) => {
            const isBest = row.universe === best.universe;
            const isDefault = row.universe === defaultPool;
            return (
              <tr
                key={row.universe}
                className="border-t border-mine-border/30"
                style={{
                  borderLeft: isBest ? "3px solid #26a69a" : "3px solid transparent",
                  backgroundColor: isBest ? "rgba(38, 166, 154, 0.05)" : undefined,
                }}
              >
                <td className="py-1.5 px-2 text-mine-text font-medium">
                  {row.universe}
                  {isDefault && (
                    <span className="ml-1.5 text-[8px] text-mine-muted bg-mine-bg px-1 py-0.5 rounded">
                      默认
                    </span>
                  )}
                  {isBest && !isDefault && (
                    <span className="ml-1.5 text-[8px] text-[#26a69a] bg-[#26a69a]/10 px-1 py-0.5 rounded font-semibold">
                      最佳
                    </span>
                  )}
                </td>
                <td
                  className="py-1.5 px-2 text-right font-mono tabular-nums font-medium"
                  style={{ color: icMagnitudeColor(row.ic) }}
                >
                  {row.ic >= 0 ? "+" : ""}{row.ic.toFixed(4)}
                </td>
                <td
                  className="py-1.5 px-2 text-right font-mono tabular-nums"
                  style={{ color: Math.abs(row.ir) >= 1.0 ? "#2EBD85" : Math.abs(row.ir) >= 0.5 ? "#76808E" : "#F6465D" }}
                >
                  {row.ir.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Section B2: Factor Quality Radar ────────────────────

function RadarSection({ factor }: { factor: Factor }) {
  const scores = useMemo(() => computeRadarScores(factor), [factor]);
  const values = useMemo(() => radarScoresToValues(scores), [scores]);

  return (
    <div className="px-4 py-3 border-b border-mine-border/50">
      <div className="text-[10px] text-mine-muted uppercase tracking-wider mb-2">
        因子能力雷达
      </div>
      <div className="flex justify-center">
        <RadarChart
          labels={[...RADAR_LABELS]}
          values={values}
          size={220}
          fillColor="#26a69a"
          fillOpacity={0.18}
          strokeColor="#26a69a"
        />
      </div>
    </div>
  );
}

// ─── Section B2.5: Robustness Readout ────────────────────

function RobustnessSection({ factor }: { factor: Factor }) {
  const rankPct = Math.round(factor.rankTestRetention * 100);
  const binaryPct = Math.round(factor.binaryTestRetention * 100);

  function retentionColor(pct: number): string {
    if (pct >= 70) return "#2EBD85";
    if (pct >= 30) return "#76808E";
    return "#F6465D";
  }

  function retentionLabel(pct: number): string {
    if (pct >= 70) return "逻辑扎实";
    if (pct >= 30) return "中等";
    return "过拟合风险";
  }

  return (
    <div className="px-4 py-3 border-b border-mine-border/50">
      <div className="text-[10px] text-mine-muted uppercase tracking-wider mb-2">
        鲁棒性检验
      </div>
      <div className="space-y-2">
        {/* Rank Test */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-mine-text">Rank Test</span>
            <span className="text-[9px] text-mine-muted">rank(X) 保留率</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-bold font-mono tabular-nums"
              style={{ color: retentionColor(rankPct) }}
            >
              {rankPct}%
            </span>
            <span
              className="text-[8px] font-semibold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${retentionColor(rankPct)}18`,
                color: retentionColor(rankPct),
              }}
            >
              {retentionLabel(rankPct)}
            </span>
          </div>
        </div>

        {/* Binary Test */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-mine-text">Binary Test</span>
            <span className="text-[9px] text-mine-muted">sign(X) 保留率</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-bold font-mono tabular-nums"
              style={{ color: retentionColor(binaryPct) }}
            >
              {binaryPct}%
            </span>
            <span
              className="text-[8px] font-semibold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${retentionColor(binaryPct)}18`,
                color: retentionColor(binaryPct),
              }}
            >
              {retentionLabel(binaryPct)}
            </span>
          </div>
        </div>

        {/* Interpretation note */}
        <div className="text-[9px] text-mine-muted leading-relaxed mt-1">
          变换后 Sharpe 保留 &gt;70% 表示因子捕捉的是结构性信号；&lt;30% 提示过拟合风险
        </div>
      </div>
    </div>
  );
}

// ─── Section B3: IC Decay Profile ────────────────────────

function ICDecayChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const w = 320;
  const h = 70;
  const padding = { top: 6, right: 8, bottom: 14, left: 8 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  const maxAbs = Math.max(...data.map(Math.abs), 0.001);
  const barCount = data.length;
  const gap = 2;
  const barWidth = (plotW - (barCount - 1) * gap) / barCount;

  // Baseline Y position (IC=0)
  const baselineY = padding.top + plotH / 2;

  // X-axis labels: T+1, T+6, T+11, T+16, T+20
  const labelIndices = [0, 5, 10, 15, 19];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {/* Baseline */}
      <line
        x1={padding.left}
        y1={baselineY}
        x2={w - padding.right}
        y2={baselineY}
        stroke="#e0ddd8"
        strokeWidth={0.5}
      />
      {/* Bars */}
      {data.map((ic, i) => {
        const x = padding.left + i * (barWidth + gap);
        const barH = (Math.abs(ic) / maxAbs) * (plotH / 2);
        const y = ic >= 0 ? baselineY - barH : baselineY;
        const color = ic >= 0 ? "#3b82f6" : "#F6465D";
        return (
          <rect
            key={`bar-${i}`}
            x={x}
            y={y}
            width={barWidth}
            height={Math.max(barH, 0.5)}
            fill={color}
            opacity={0.75}
            rx={1}
          />
        );
      })}
      {/* X-axis labels */}
      {labelIndices.map((idx) => {
        if (idx >= barCount) return null;
        const x = padding.left + idx * (barWidth + gap) + barWidth / 2;
        return (
          <text
            key={`label-${idx}`}
            x={x}
            y={h - 2}
            textAnchor="middle"
            fill="#8a8a8a"
            fontSize={7}
            fontFamily="system-ui, sans-serif"
          >
            T+{idx + 1}
          </text>
        );
      })}
    </svg>
  );
}

function ICDecaySection({ factor }: { factor: Factor }) {
  return (
    <div className="px-4 py-3 border-b border-mine-border/50">
      <div className="text-[10px] text-mine-muted uppercase tracking-wider mb-2">
        IC 衰减剖面 (Lag T+1 ~ T+20)
      </div>
      <div className="bg-mine-bg rounded-md p-1">
        <ICDecayChart data={factor.icDecayProfile} />
      </div>
    </div>
  );
}

// ─── Section C: IC Time Series ───────────────────────────

/** PROBATION IC threshold */
const IC_PROBATION_THRESHOLD = 0.01;

/** MA window for IC time series overlay */
const IC_MA_WINDOW = 60;

function ICTimeSeriesChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const ma = useMemo(() => computeRollingMA(data, IC_MA_WINDOW), [data]);

  const w = 320;
  const h = 100;
  const padding = { top: 4, right: 4, bottom: 4, left: 4 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  // Compute range including threshold line
  const allValues = [...data, IC_PROBATION_THRESHOLD, -IC_PROBATION_THRESHOLD];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 0.001;

  const toY = (v: number) => padding.top + plotH - ((v - min) / range) * plotH;
  const toX = (i: number) => padding.left + (i / (data.length - 1)) * plotW;

  // Raw IC path (Layer 1: gray, thin, semi-transparent)
  const rawPath = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

  // MA path (Layer 2: blue, thick)
  const maSegments: string[] = [];
  let maStarted = false;
  for (let i = 0; i < ma.length; i++) {
    const v = ma[i];
    if (v === null) continue;
    maSegments.push(`${!maStarted ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
    maStarted = true;
  }
  const maPath = maSegments.join(" ");

  // Zero line
  const zeroY = toY(0);
  const showZero = min < 0 && max > 0;

  // PROBATION threshold line (Layer 3: red dashed)
  const thresholdY = toY(IC_PROBATION_THRESHOLD);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {/* Zero line */}
      {showZero && (
        <line
          x1={padding.left}
          y1={zeroY}
          x2={w - padding.right}
          y2={zeroY}
          stroke="#e0ddd8"
          strokeWidth={0.5}
          strokeDasharray="3 2"
        />
      )}
      {/* Layer 3: PROBATION threshold */}
      <line
        x1={padding.left}
        y1={thresholdY}
        x2={w - padding.right}
        y2={thresholdY}
        stroke="#F6465D"
        strokeWidth={0.8}
        strokeDasharray="4 4"
        opacity={0.6}
      />
      {/* Layer 1: Raw IC daily values */}
      <path
        d={rawPath}
        fill="none"
        stroke="#8a8a8a"
        strokeWidth={0.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.5}
      />
      {/* Layer 2: 60-day MA */}
      {maPath && (
        <path
          d={maPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function ICSeriesSection({ factor }: { factor: Factor }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-mine-muted uppercase tracking-wider">
          IC 时序 (240D)
        </span>
        {/* Mini legend */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[8px] text-mine-muted">
            <span className="inline-block w-3 h-[2px] bg-[#8a8a8a] opacity-50" />
            日值
          </span>
          <span className="flex items-center gap-1 text-[8px] text-mine-muted">
            <span className="inline-block w-3 h-[2px] bg-[#3b82f6]" />
            60日MA
          </span>
          <span className="flex items-center gap-1 text-[8px] text-mine-muted">
            <span className="inline-block w-3 h-[2px] border-t border-dashed border-[#F6465D]" />
            阈值
          </span>
        </div>
      </div>
      <div className="bg-mine-bg rounded-md p-1">
        <ICTimeSeriesChart data={factor.icTimeSeries} />
      </div>
    </div>
  );
}

// ─── Status Transition Actions ───────────────────────────

function StatusActions({ factor }: { factor: Factor }) {
  const validTransitions = VALID_STATUS_TRANSITIONS[factor.status];
  const updateFactorStatus = useLibraryStore((s) => s.updateFactorStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [justChanged, setJustChanged] = useState(false);

  const handleConfirm = useCallback(
    (targetStatus: FactorLifecycleStatus, reason: string) => {
      updateFactorStatus(factor.id, targetStatus, reason);
      setDialogOpen(false);
      // Brief visual feedback
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 1500);
    },
    [factor.id, updateFactorStatus],
  );

  if (validTransitions.length === 0) return null;

  return (
    <div className="px-4 py-3 border-t border-mine-border/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-mine-muted">状态变更</span>
        {justChanged && (
          <span className="text-[10px] font-medium text-mine-accent-green animate-pulse">
            ✓ 已变更
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {validTransitions.map((target) => {
          const targetColor = STATUS_COLORS[target];
          const targetLabel = STATUS_LABELS[target];
          return (
            <button
              key={target}
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded border transition-colors hover:opacity-80"
              style={{ borderColor: targetColor, color: targetColor }}
              title={`变更为 ${targetLabel}`}
            >
              <ArrowRight className="w-3 h-3" />
              {targetLabel}
            </button>
          );
        })}
      </div>

      <StatusChangeDialog
        factor={factor}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

// ─── Main Panel ──────────────────────────────────────────

interface FactorDetailPanelProps {
  factor: Factor;
}

export function FactorDetailPanel({ factor }: FactorDetailPanelProps) {
  const selectFactor = useLibraryStore((s) => s.selectFactor);

  return (
    <div className="bg-white shadow-sm border border-mine-border rounded-xl flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-mine-border/50 bg-mine-bg/50">
        <span className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          因子详情
        </span>
        <button
          type="button"
          onClick={() => selectFactor(null)}
          className="text-mine-muted hover:text-mine-text transition-colors"
          title="关闭"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <IdentitySection factor={factor} />
        <StatisticsSection factor={factor} />
        <FitnessSection factor={factor} />
        <RadarSection factor={factor} />
        <RobustnessSection factor={factor} />
        <ICDecaySection factor={factor} />
        <ICSeriesSection factor={factor} />
        <StatusActions factor={factor} />
      </div>
    </div>
  );
}
