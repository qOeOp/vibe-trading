# Factor Detail Panel Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Completely redesign the factor detail panel from a flat 891-line monolith into a 5-layer modular architecture using DetailPanel primitives, semantic color tokens, and ngx-charts.

**Architecture:** Split `factor-detail-panel.tsx` (891 lines, 8 inline sections) into `factor-detail/` directory with 14 files across 5 priority layers (Header → L1 Overview → L2 Statistics → L3 Charts → L4 Supplementary). All sections use `DetailPanel`/`DetailSection` primitives from `@/components/shared/detail-panel`. Hand-crafted SVG charts migrated to ngx-charts. 30+ hardcoded hex colors replaced with Tailwind semantic tokens.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, DetailPanel primitives, RadarChart (ngx-charts), Framer Motion (AnimatePresence), D3.js (histogram bins)

**Design Doc:** `docs/plans/2026-02-16-factor-detail-panel-redesign.md`

---

### Task 1: Add New Fields to Factor Type + Mock Data

**Files:**
- Modify: `apps/web/src/features/library/types.ts` (after line 147, inside Factor interface)
- Modify: `apps/web/src/features/library/data/mock-library.ts` (FactorSeed interface + generators + buildFactor)

**Step 1: Add 6 new fields to Factor interface**

In `types.ts`, add these fields inside the `Factor` interface before `statusHistory`:

```typescript
  /** IC 半衰期 (天数，IC 衰减到初始 50% 所需 lag 步数) */
  icHalfLife: number;
  /** 因子覆盖率 (0-1，有效计算的股票占比) */
  coverageRate: number;
  /** 多空年化收益 (%) */
  longShortReturn: number;
  /** 多空累计净值曲线 (240 点日频) */
  longShortEquityCurve: number[];
  /** 多头收益占比 (0-1，多头贡献 / 总多空收益) */
  longSideReturnRatio: number;
  /** IC 分布直方图 bins (20 个 bin 的频次) */
  icHistogramBins: number[];
```

**Step 2: Add FactorSeed fields for new data**

In `mock-library.ts`, no new FactorSeed fields needed — these are all derived in `buildFactor`.

**Step 3: Add generator functions for new fields**

Add these generators in `mock-library.ts` before `buildFactor`:

```typescript
/** Calculate IC half-life from decay profile */
function computeICHalfLife(decayProfile: number[]): number {
  if (decayProfile.length === 0) return 20;
  const initial = Math.abs(decayProfile[0]);
  if (initial === 0) return 20;
  const halfTarget = initial * 0.5;
  for (let i = 0; i < decayProfile.length; i++) {
    if (Math.abs(decayProfile[i]) <= halfTarget) return i + 1;
  }
  return decayProfile.length; // never reached half
}

/** Generate long-short equity curve: random walk with drift from longShortReturn */
function generateLongShortEquityCurve(
  annualReturn: number,
  seed: number,
): number[] {
  const rand = createSeededRandom(seed);
  const dailyReturn = annualReturn / 100 / 252;
  const dailyVol = Math.abs(dailyReturn) * 3 + 0.002;
  const curve: number[] = [1.0];
  for (let i = 1; i < 240; i++) {
    const dr = dailyReturn + (rand() - 0.5) * dailyVol * 2;
    curve.push(Math.round(curve[i - 1] * (1 + dr) * 10000) / 10000);
  }
  return curve;
}

/** Generate long-short annual return from IC strength */
function generateLongShortReturn(baseIC: number, seed: number): number {
  const rand = createSeededRandom(seed);
  const icStrength = Math.abs(baseIC);
  // Stronger IC → higher L/S return; typical range 5%-30%
  const base = icStrength * 300 + 3;
  const noise = (rand() - 0.5) * 8;
  return Math.round((base + noise) * 100) / 100;
}

/** Generate IC histogram bins from IC time series */
function generateICHistogramBins(icTimeSeries: number[]): number[] {
  if (icTimeSeries.length === 0) return new Array(20).fill(0);
  const min = Math.min(...icTimeSeries);
  const max = Math.max(...icTimeSeries);
  const range = max - min || 0.001;
  const binWidth = range / 20;
  const bins = new Array(20).fill(0);
  for (const ic of icTimeSeries) {
    const idx = Math.min(19, Math.floor((ic - min) / binWidth));
    bins[idx]++;
  }
  return bins;
}
```

**Step 4: Wire generators into buildFactor**

In `buildFactor`, add after the existing fields:

```typescript
  const longShortReturn = generateLongShortReturn(seed.ic, index * 4391 + 31);
  return {
    ...seed,
    // ... existing fields ...
    icHalfLife: computeICHalfLife(icDecayProfile),
    coverageRate: Math.round((0.85 + rand() * 0.13) * 100) / 100, // 85-98%
    longShortReturn,
    longShortEquityCurve: generateLongShortEquityCurve(longShortReturn, index * 5113 + 59),
    longSideReturnRatio: Math.round((0.45 + rand() * 0.35) * 100) / 100, // 45-80%
    icHistogramBins: generateICHistogramBins(icTimeSeries),
    // ... statusHistory ...
  };
```

Note: `rand` needs to be created inside `buildFactor` — add `const rand = createSeededRandom(index * 3331 + 7);` at the top of the function.

**Step 5: Verify compilation**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx tsc --noEmit --project apps/web/tsconfig.json`
Expected: No errors (existing factor-detail-panel.tsx will still work since new fields are additive)

**Step 6: Commit**

```bash
git add apps/web/src/features/library/types.ts apps/web/src/features/library/data/mock-library.ts
git commit -m "feat(library): add 6 new Factor fields for detail panel redesign

Add icHalfLife, coverageRate, longShortReturn, longShortEquityCurve,
longSideReturnRatio, icHistogramBins to Factor entity with mock generators."
```

---

### Task 2: Create Directory Structure + Barrel Export

**Files:**
- Create: `apps/web/src/features/library/components/factor-detail/index.ts`

**Step 1: Create the directory and barrel export**

```typescript
// Re-export the main panel component that library-page.tsx will import
export { FactorDetailPanel } from "./factor-detail-panel"
```

Note: We create a minimal barrel now and add exports as we build each file.

**Step 2: Verify the directory exists**

Run: `ls apps/web/src/features/library/components/factor-detail/`
Expected: `index.ts`

**Step 3: Commit**

```bash
git add apps/web/src/features/library/components/factor-detail/
git commit -m "chore(library): scaffold factor-detail directory with barrel export"
```

---

### Task 3: Update compute-radar-scores for 5 Dimensions

**Files:**
- Modify: `apps/web/src/features/library/utils/compute-radar-scores.ts`

The design calls for reducing from 7 dimensions to 5: 收益力 / 稳定性 / 效率 / 容量 / 鲜度.

**Step 1: Update types, labels, and computation**

Replace the entire file content. The key changes:
- `FactorRadarScores` → 5 fields: `profitability`, `stability`, `efficiency`, `capacity`, `freshness`
- `RADAR_LABELS` → `["收益力", "稳定性", "效率", "容量", "鲜度"]`
- Remove: `decayResistance`, `monotonicity` (absorbed into other dims)
- `profitability` = combines |IC| + |IR| (weighted 60/40)
- `stability` = combines winRate + IC consistency (MA smoothness)
- `efficiency` = IC per unit turnover (same as old turnoverEfficiency)
- `capacity` = log-scaled (same as old)
- `freshness` = based on V-Score (higher V-Score = less "fresh"/more crowded; map inversely)

```typescript
export interface FactorRadarScores {
  /** 收益力: combined |IC| + |IR| */
  profitability: number;
  /** 稳定性: win rate + IC consistency */
  stability: number;
  /** 效率: IC per unit turnover */
  efficiency: number;
  /** 容量: log-scaled capacity */
  capacity: number;
  /** 鲜度: inverse of crowding (V-Score based) */
  freshness: number;
}

export const RADAR_LABELS = [
  "收益力",
  "稳定性",
  "效率",
  "容量",
  "鲜度",
] as const;
```

For `computeRadarScores`:
```typescript
export function computeRadarScores(factor: Factor): FactorRadarScores {
  // 1. Profitability — 60% |IC|/0.07 + 40% |IR|/2.5
  const icScore = (Math.abs(factor.ic) / 0.07) * 100;
  const irScore = (Math.abs(factor.ir) / 2.5) * 100;
  const profitability = clamp(icScore * 0.6 + irScore * 0.4);

  // 2. Stability — 60% winRate/70 + 40% IC retention (|ic120d|/max(|ic|,0.001))
  const winScore = (factor.winRate / 70) * 100;
  const retentionRatio = Math.abs(factor.ic120d) / Math.max(Math.abs(factor.ic), 0.001);
  const retentionScore = retentionRatio * 100;
  const stability = clamp(winScore * 0.6 + retentionScore * 0.4);

  // 3. Efficiency — |IC| / max(turnover, 1) × 1000, ceiling 5.0
  const rawEff = (Math.abs(factor.ic) / Math.max(factor.turnover, 1)) * 1000;
  const efficiency = clamp((rawEff / 5.0) * 100);

  // 4. Capacity — log10(capacity) / log10(500000)
  const logCap = factor.capacity > 0 ? Math.log10(factor.capacity) : 0;
  const capacity = clamp((logCap / Math.log10(500_000)) * 100);

  // 5. Freshness — V-Score < -1 is "undervalued" (fresh), > 1 is "crowded" (stale)
  // Map [-2, 2] → [100, 0]: lower V-Score = fresher
  const freshness = clamp(((2 - factor.vScore) / 4) * 100);

  return { profitability, stability, efficiency, capacity, freshness };
}
```

Update `radarScoresToValues`:
```typescript
export function radarScoresToValues(scores: FactorRadarScores): number[] {
  return [
    scores.profitability,
    scores.stability,
    scores.efficiency,
    scores.capacity,
    scores.freshness,
  ];
}
```

**Step 2: Verify compilation**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx tsc --noEmit --project apps/web/tsconfig.json`
Expected: No errors (old factor-detail-panel.tsx uses `RADAR_LABELS` and `computeRadarScores` — the return shape changed but it's passed to `radarScoresToValues` which returns `number[]`, and RadarChart accepts any array length)

**Step 3: Commit**

```bash
git add apps/web/src/features/library/utils/compute-radar-scores.ts
git commit -m "refactor(library): reduce radar from 7 to 5 dimensions

New axes: 收益力/稳定性/效率/容量/鲜度. Profitability combines IC+IR,
stability combines winRate+retention, freshness inversely maps V-Score."
```

---

### Task 4: Implement identity-header.tsx

**Files:**
- Create: `apps/web/src/features/library/components/factor-detail/identity-header.tsx`

This is the Header layer — identity card with expression (collapsed by default), badges, lifecycle timeline.

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { Copy, Clock, ChevronRight } from "lucide-react";
import { DetailHeader } from "@/components/shared/detail-panel";
import { LifecycleTimeline } from "../lifecycle-timeline";
import type { Factor } from "../../types";
import {
  CATEGORY_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  SOURCE_LABELS,
  SOURCE_COLORS,
  TYPE_LABELS,
  TYPE_COLORS,
} from "../../types";

interface IdentityHeaderProps {
  factor: Factor;
}

export function IdentityHeader({ factor }: IdentityHeaderProps) {
  const [exprOpen, setExprOpen] = useState(false);

  const catColor = CATEGORY_COLORS[factor.category];
  const statusColor = STATUS_COLORS[factor.status];
  const statusLabel = STATUS_LABELS[factor.status];
  const sourceLabel = SOURCE_LABELS[factor.source];
  const sourceColor = SOURCE_COLORS[factor.source];
  const typeLabel = TYPE_LABELS[factor.factorType];
  const typeColor = TYPE_COLORS[factor.factorType];

  return (
    <DetailHeader>
      {/* Row 1: Name + Status */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-mine-text">{factor.name}</h3>
            <span className="text-[10px] text-mine-muted font-mono">
              {factor.version}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="px-2 py-0.5 text-[10px] font-semibold rounded"
              style={{ backgroundColor: `${catColor}18`, color: catColor }}
            >
              {factor.category}
            </span>
            <span
              className="px-1.5 py-0.5 text-[10px] font-semibold rounded"
              style={{ backgroundColor: `${typeColor}18`, color: typeColor }}
            >
              {typeLabel}
            </span>
            <span
              className="text-[10px] font-medium"
              style={{ color: sourceColor }}
            >
              {sourceLabel}
            </span>
          </div>
        </div>
        <span
          className="px-2 py-0.5 text-[10px] font-bold rounded"
          style={{ backgroundColor: `${statusColor}18`, color: statusColor }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Row 2: Collapsible Expression */}
      <button
        type="button"
        className="flex items-center gap-1.5 w-full text-left mt-2 group"
        onClick={() => setExprOpen(!exprOpen)}
      >
        <ChevronRight
          className="w-3 h-3 text-mine-muted transition-transform shrink-0"
          style={{ transform: exprOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        />
        <span className="text-[10px] text-mine-muted">表达式</span>
      </button>
      {exprOpen && (
        <div className="bg-mine-bg rounded-md px-3 py-2 mt-1 flex items-center gap-2">
          <code className="text-[11px] text-mine-text font-mono flex-1 break-all leading-relaxed">
            {factor.expression}
          </code>
          <button
            type="button"
            className="text-mine-muted hover:text-mine-text transition-colors shrink-0"
            title="复制表达式"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(factor.expression);
            }}
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      )}

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
    </DetailHeader>
  );
}
```

**Step 2: Verify compilation**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx tsc --noEmit --project apps/web/tsconfig.json`
Expected: Pass

**Step 3: Commit**

```bash
git add apps/web/src/features/library/components/factor-detail/identity-header.tsx
git commit -m "feat(library): add IdentityHeader with collapsible expression"
```

---

### Task 5: Implement overview-section.tsx (V-Score + 5-dim Radar)

**Files:**
- Create: `apps/web/src/features/library/components/factor-detail/overview-section.tsx`

Layer 1 — the "一眼判断" layer. V-Score indicator on top, 5-dimension radar below.

**Step 1: Create the component**

```tsx
"use client";

import { useMemo } from "react";
import { DetailSection } from "@/components/shared/detail-panel";
import { RadarChart } from "@/lib/ngx-charts/radar-chart";
import {
  computeRadarScores,
  radarScoresToValues,
  RADAR_LABELS,
} from "../../utils/compute-radar-scores";
import type { Factor } from "../../types";

// ─── V-Score Indicator ──────────────────────────────────

function VScoreIndicator({ vScore }: { vScore: number }) {
  const config = useMemo(() => {
    if (vScore < -1) {
      return { label: "低估", colorClass: "text-blue-500", bgClass: "bg-blue-500/8" };
    }
    if (vScore > 1) {
      return { label: "拥挤风险", colorClass: "text-mine-accent-yellow", bgClass: "bg-mine-accent-yellow/8" };
    }
    return { label: "正常", colorClass: "text-mine-muted", bgClass: "bg-mine-muted/6" };
  }, [vScore]);

  return (
    <div
      data-slot="vscore-indicator"
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md ${config.bgClass}`}
    >
      <span className="text-[10px] text-mine-muted">V-Score</span>
      <span className={`text-[11px] font-bold font-mono tabular-nums ${config.colorClass}`}>
        {vScore >= 0 ? "+" : ""}{vScore.toFixed(2)}
      </span>
      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${config.bgClass} ${config.colorClass}`}>
        {config.label}
      </span>
    </div>
  );
}

// ─── Overview Section ───────────────────────────────────

interface OverviewSectionProps {
  factor: Factor;
}

export function OverviewSection({ factor }: OverviewSectionProps) {
  const scores = useMemo(() => computeRadarScores(factor), [factor]);
  const values = useMemo(() => radarScoresToValues(scores), [scores]);

  return (
    <DetailSection title="综合概览">
      {/* V-Score at top */}
      <VScoreIndicator vScore={factor.vScore} />

      {/* 5-dimension radar below */}
      <div className="flex justify-center mt-3">
        <RadarChart
          labels={[...RADAR_LABELS]}
          values={values}
          size={200}
          fillColor="#26a69a"
          fillOpacity={0.18}
          strokeColor="#26a69a"
        />
      </div>
    </DetailSection>
  );
}
```

**Step 2: Verify compilation**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx tsc --noEmit --project apps/web/tsconfig.json`

**Step 3: Commit**

```bash
git add apps/web/src/features/library/components/factor-detail/overview-section.tsx
git commit -m "feat(library): add OverviewSection with V-Score + 5-dim radar"
```

---

### Task 6: Implement statistics-section.tsx (3×3 KPI + Quantile Bar)

**Files:**
- Create: `apps/web/src/features/library/components/factor-detail/statistics-section.tsx`

Layer 2 — 3×3 KPI grid + quantile returns bar chart.

**Step 1: Create the component**

Key design decisions:
- 3×3 grid: Row 1 = IC(20D)/IC(60D)/IC(120D), Row 2 = IR/t-stat/胜率, Row 3 = 换手/容量/IC半衰期
- Benchmark config shown as section suffix
- Quantile bar uses inline SVG (simple enough, doesn't need ngx-charts bar-chart overhead for 5 bars)
- All colors use semantic `color` prop on DetailStatItem

```tsx
"use client";

import {
  DetailSection,
  DetailStatGrid,
  DetailStatItem,
} from "@/components/shared/detail-panel";
import type { Factor } from "../../types";
import { WINSORIZATION_LABELS } from "../../types";

// ─── Helpers ─────────────────────────────────────────────

function icColor(ic: number): "up" | "down" | "flat" {
  // For IC display: positive IC = green (down token = green in Chinese market)
  // negative IC = red (up token = red in Chinese market)
  if (ic > 0) return "down";  // green
  if (ic < 0) return "up";    // red
  return "flat";
}

function irColor(ir: number): "down" | "flat" | "up" {
  const abs = Math.abs(ir);
  if (abs >= 1.5) return "down";  // excellent → green
  if (abs >= 0.5) return "flat";  // ok → gray
  return "up";                     // weak → red
}

function tStatColor(t: number): "down" | "up" {
  return Math.abs(t) >= 2 ? "down" : "up";
}

function winRateColor(wr: number): "down" | "flat" {
  return wr >= 55 ? "down" : "flat";
}

function fmtIC(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(3)}`;
}

function fmtCapacity(cap: number): string {
  return cap >= 10000
    ? `${(cap / 10000).toFixed(0)}亿`
    : `${cap}万`;
}

// ─── Quantile Bar ────────────────────────────────────────

function QuantileBar({
  returns,
}: {
  returns: [number, number, number, number, number];
}) {
  const labels = ["Q1", "Q2", "Q3", "Q4", "Q5"];
  const maxAbs = Math.max(...returns.map(Math.abs), 0.01);

  return (
    <div data-slot="quantile-bar" className="flex items-end gap-1 h-[48px]">
      {returns.map((r, i) => {
        const height = Math.max(4, (Math.abs(r) / maxAbs) * 40);
        // Q1 worst → Q5 best: use market colors
        // Positive return → green (market-down-medium), negative → red (market-up-medium)
        const isPositive = r >= 0;
        return (
          <div
            key={labels[i]}
            className="flex-1 flex flex-col items-center gap-0.5"
          >
            <div
              className={`w-full rounded-sm ${isPositive ? "bg-market-down-medium" : "bg-market-up-medium"}`}
              style={{
                height: `${height}px`,
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

// ─── Statistics Section ─────────────────────────────────

interface StatisticsSectionProps {
  factor: Factor;
}

export function StatisticsSection({ factor }: StatisticsSectionProps) {
  const cfg = factor.benchmarkConfig;
  const benchmarkSuffix = `${cfg.universe} · ${cfg.icMethod} · ${cfg.rebalanceDays}D`;

  return (
    <DetailSection title="核心指标" suffix={benchmarkSuffix}>
      {/* 3×3 KPI Grid */}
      <DetailStatGrid columns={3}>
        {/* Row 1: IC multi-horizon */}
        <DetailStatItem
          label="IC (20D)"
          value={fmtIC(factor.ic)}
          color={icColor(factor.ic)}
        />
        <DetailStatItem
          label="IC (60D)"
          value={fmtIC(factor.ic60d)}
          color={icColor(factor.ic60d)}
        />
        <DetailStatItem
          label="IC (120D)"
          value={fmtIC(factor.ic120d)}
          color={icColor(factor.ic120d)}
        />
        {/* Row 2: Quality metrics */}
        <DetailStatItem
          label="IR"
          value={factor.ir.toFixed(2)}
          color={irColor(factor.ir)}
        />
        <DetailStatItem
          label="t-stat"
          value={factor.icTstat.toFixed(2)}
          color={tStatColor(factor.icTstat)}
        />
        <DetailStatItem
          label="胜率"
          value={`${factor.winRate}%`}
          color={winRateColor(factor.winRate)}
        />
        {/* Row 3: Practical metrics */}
        <DetailStatItem
          label="换手"
          value={`${factor.turnover}%`}
        />
        <DetailStatItem
          label="容量"
          value={fmtCapacity(factor.capacity)}
        />
        <DetailStatItem
          label="IC半衰期"
          value={`T+${factor.icHalfLife}`}
        />
      </DetailStatGrid>

      {/* Quantile returns bar */}
      <div className="mt-3">
        <div className="text-[10px] text-mine-muted mb-1">分位收益 (Q1-Q5)</div>
        <QuantileBar returns={factor.quantileReturns} />
      </div>
    </DetailSection>
  );
}
```

**Step 2: Verify compilation**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx tsc --noEmit --project apps/web/tsconfig.json`

**Step 3: Commit**

```bash
git add apps/web/src/features/library/components/factor-detail/statistics-section.tsx
git commit -m "feat(library): add StatisticsSection with 3x3 KPI grid + quantile bar"
```

---

### Task 7: Implement Chart Components (4 files)

**Files:**
- Create: `apps/web/src/features/library/components/factor-detail/charts/ic-time-series.tsx`
- Create: `apps/web/src/features/library/components/factor-detail/charts/ic-histogram.tsx`
- Create: `apps/web/src/features/library/components/factor-detail/charts/long-short-equity.tsx`
- Create: `apps/web/src/features/library/components/factor-detail/charts/ic-decay-profile.tsx`

All charts wrapped in `DetailSection` + `DetailChartBox`. We keep using inline SVG for these panel charts because they're small, specialized, and don't need the full ngx-charts infrastructure (BaseChart + ResizeObserver + D3 scales). The ngx-charts are designed for larger chart areas.

**Step 1: Create ic-time-series.tsx**

Migrated from existing code with semantic tokens. Three layers: gray daily IC + blue 60-day MA + red threshold.

```tsx
"use client";

import { useMemo } from "react";
import { DetailSection, DetailChartBox } from "@/components/shared/detail-panel";
import { computeRollingMA } from "../../utils/compute-ic-stats";
import type { Factor } from "../../types";

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
      {/* Legend */}
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
```

**Step 2: Create ic-histogram.tsx**

New chart — 20-bin histogram with normal overlay + mean reference line.

```tsx
"use client";

import { useMemo } from "react";
import { DetailSection, DetailChartBox } from "@/components/shared/detail-panel";
import type { Factor } from "../../types";

function ICHistogramChart({
  bins,
  icMean,
  icStd,
}: {
  bins: number[];
  icMean: number;
  icStd: number;
}) {
  if (!bins || bins.length === 0) return null;

  const w = 320;
  const h = 80;
  const padding = { top: 4, right: 8, bottom: 4, left: 8 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  const maxCount = Math.max(...bins, 1);
  const barCount = bins.length;
  const gap = 1;
  const barWidth = (plotW - (barCount - 1) * gap) / barCount;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {/* Bars */}
      {bins.map((count, i) => {
        const barH = (count / maxCount) * plotH;
        const x = padding.left + i * (barWidth + gap);
        const y = padding.top + plotH - barH;
        // Color: bins near center → gray, tails → teal
        const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        const opacity = 0.4 + distFromCenter * 0.4;
        return (
          <rect
            key={`bin-${i}`}
            x={x} y={y}
            width={barWidth}
            height={Math.max(barH, 0.5)}
            className="fill-mine-accent-teal"
            opacity={opacity}
            rx={1}
          />
        );
      })}
      {/* Mean reference line */}
      {icMean !== 0 && (
        <>
          <line
            x1={w / 2} y1={padding.top}
            x2={w / 2} y2={padding.top + plotH}
            stroke="#a8b2c7" strokeWidth={0.8} strokeDasharray="3 2"
          />
          <text
            x={w / 2 + 3} y={padding.top + 8}
            fill="#a8b2c7" fontSize={7}
          >
            μ={icMean.toFixed(3)}
          </text>
        </>
      )}
    </svg>
  );
}

interface ICHistogramSectionProps {
  factor: Factor;
}

export function ICHistogramSection({ factor }: ICHistogramSectionProps) {
  return (
    <DetailSection title="IC 分布直方图" suffix="20-bin">
      <DetailChartBox>
        <ICHistogramChart
          bins={factor.icHistogramBins}
          icMean={factor.icDistribution.icMean}
          icStd={factor.icDistribution.icStd}
        />
      </DetailChartBox>
    </DetailSection>
  );
}
```

**Step 3: Create long-short-equity.tsx**

New chart — cumulative equity curve with MaxDD red region + 4 bottom KPIs.

```tsx
"use client";

import { useMemo } from "react";
import {
  DetailSection,
  DetailChartBox,
  DetailKPIRow,
} from "@/components/shared/detail-panel";
import type { Factor } from "../../types";

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

  // Main equity path
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

  // DD region area path
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
      {/* Baseline at NAV=1.0 */}
      <line
        x1={padding.left} y1={toY(1.0)}
        x2={w - padding.right} y2={toY(1.0)}
        className="stroke-mine-border" strokeWidth={0.5} strokeDasharray="3 2"
      />
      {/* MaxDD region */}
      {ddAreaPath && (
        <path
          d={ddAreaPath}
          className="fill-market-up-medium" opacity={0.08}
        />
      )}
      {/* Equity line */}
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

    // MaxDD
    let peak = curve[0];
    let mdd = 0;
    for (let i = 1; i < curve.length; i++) {
      if (curve[i] > peak) peak = curve[i];
      const dd = (peak - curve[i]) / peak;
      if (dd > mdd) mdd = dd;
    }

    // Simple Sharpe from daily returns
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
      {/* Bottom KPIs */}
      <DetailKPIRow className="mt-2">
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
      </DetailKPIRow>
    </DetailSection>
  );
}
```

**Step 4: Create ic-decay-profile.tsx**

Migrated from existing code with semantic tokens.

```tsx
"use client";

import { DetailSection, DetailChartBox } from "@/components/shared/detail-panel";
import type { Factor } from "../../types";

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
  const baselineY = padding.top + plotH / 2;
  const labelIndices = [0, 5, 10, 15, 19];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <line
        x1={padding.left} y1={baselineY}
        x2={w - padding.right} y2={baselineY}
        className="stroke-mine-border" strokeWidth={0.5}
      />
      {data.map((ic, i) => {
        const x = padding.left + i * (barWidth + gap);
        const barH = (Math.abs(ic) / maxAbs) * (plotH / 2);
        const y = ic >= 0 ? baselineY - barH : baselineY;
        return (
          <rect
            key={`bar-${i}`}
            x={x} y={y}
            width={barWidth}
            height={Math.max(barH, 0.5)}
            fill={ic >= 0 ? "#3b82f6" : undefined}
            className={ic < 0 ? "fill-market-up-medium" : undefined}
            opacity={0.75}
            rx={1}
          />
        );
      })}
      {labelIndices.map((idx) => {
        if (idx >= barCount) return null;
        const x = padding.left + idx * (barWidth + gap) + barWidth / 2;
        return (
          <text
            key={`label-${idx}`}
            x={x} y={h - 2}
            textAnchor="middle"
            className="fill-mine-muted"
            fontSize={7}
          >
            T+{idx + 1}
          </text>
        );
      })}
    </svg>
  );
}

interface ICDecayProfileSectionProps {
  factor: Factor;
}

export function ICDecayProfileSection({ factor }: ICDecayProfileSectionProps) {
  return (
    <DetailSection title="IC 衰减剖面" suffix="Lag T+1 ~ T+20">
      <DetailChartBox>
        <ICDecayChart data={factor.icDecayProfile} />
      </DetailChartBox>
    </DetailSection>
  );
}
```

**Step 5: Verify compilation**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx tsc --noEmit --project apps/web/tsconfig.json`

**Step 6: Commit**

```bash
git add apps/web/src/features/library/components/factor-detail/charts/
git commit -m "feat(library): add 4 chart sections (IC series, histogram, L/S equity, decay)"
```

---

### Task 8: Implement Layer 4 Sections (fitness, robustness, ic-stats, status-actions)

**Files:**
- Create: `apps/web/src/features/library/components/factor-detail/fitness-section.tsx`
- Create: `apps/web/src/features/library/components/factor-detail/robustness-section.tsx`
- Create: `apps/web/src/features/library/components/factor-detail/ic-stats-collapsible.tsx`
- Create: `apps/web/src/features/library/components/factor-detail/status-actions.tsx`

These are migrated from existing code, wrapped in DetailSection primitives, with hardcoded colors replaced by semantic tokens.

**Step 1: Create fitness-section.tsx**

Uses `DetailSection` wrapping the multi-pool table. Replace hardcoded hex with semantic token-based approach.

```tsx
"use client";

import { DetailSection } from "@/components/shared/detail-panel";
import type { Factor } from "../../types";

function icMagnitudeColor(ic: number): string {
  const abs = Math.abs(ic);
  if (abs >= 0.05) return "text-market-down";       // deep green
  if (abs >= 0.03) return "text-market-down-medium"; // medium green
  if (abs >= 0.02) return "text-market-flat";        // gray
  return "text-market-up-medium";                     // red
}

function irQualityColor(ir: number): string {
  const abs = Math.abs(ir);
  if (abs >= 1.0) return "text-market-down-medium";
  if (abs >= 0.5) return "text-market-flat";
  return "text-market-up-medium";
}

interface FitnessSectionProps {
  factor: Factor;
}

export function FitnessSection({ factor }: FitnessSectionProps) {
  const profile = factor.universeProfile;
  if (!profile || profile.length === 0) return null;

  const defaultPool = factor.benchmarkConfig.universe;
  const best = profile.reduce((a, b) =>
    Math.abs(b.ic) > Math.abs(a.ic) ? b : a,
  );

  return (
    <DetailSection title="多池适用性">
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
                className={`border-t border-mine-border/30 ${isBest ? "bg-mine-accent-teal/5" : ""}`}
                style={{ borderLeft: isBest ? "3px solid" : "3px solid transparent" }}
              >
                <td className={`py-1.5 px-2 text-mine-text font-medium ${isBest ? "border-l-mine-accent-teal" : ""}`}>
                  {row.universe}
                  {isDefault && (
                    <span className="ml-1.5 text-[8px] text-mine-muted bg-mine-bg px-1 py-0.5 rounded">
                      默认
                    </span>
                  )}
                  {isBest && !isDefault && (
                    <span className="ml-1.5 text-[8px] text-mine-accent-teal bg-mine-accent-teal/10 px-1 py-0.5 rounded font-semibold">
                      最佳
                    </span>
                  )}
                </td>
                <td className={`py-1.5 px-2 text-right font-mono tabular-nums font-medium ${icMagnitudeColor(row.ic)}`}>
                  {row.ic >= 0 ? "+" : ""}{row.ic.toFixed(4)}
                </td>
                <td className={`py-1.5 px-2 text-right font-mono tabular-nums ${irQualityColor(row.ir)}`}>
                  {row.ir.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DetailSection>
  );
}
```

**Step 2: Create robustness-section.tsx**

```tsx
"use client";

import { DetailSection } from "@/components/shared/detail-panel";
import type { Factor } from "../../types";

function retentionColorClass(pct: number): string {
  if (pct >= 70) return "text-market-down-medium";
  if (pct >= 30) return "text-market-flat";
  return "text-market-up-medium";
}

function retentionBgClass(pct: number): string {
  if (pct >= 70) return "bg-market-down-medium/8 text-market-down-medium";
  if (pct >= 30) return "bg-market-flat/8 text-market-flat";
  return "bg-market-up-medium/8 text-market-up-medium";
}

function retentionLabel(pct: number): string {
  if (pct >= 70) return "逻辑扎实";
  if (pct >= 30) return "中等";
  return "过拟合风险";
}

interface RobustnessSectionProps {
  factor: Factor;
}

export function RobustnessSection({ factor }: RobustnessSectionProps) {
  const rankPct = Math.round(factor.rankTestRetention * 100);
  const binaryPct = Math.round(factor.binaryTestRetention * 100);

  return (
    <DetailSection title="鲁棒性检验">
      <div className="space-y-2">
        {/* Rank Test */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-mine-text">Rank Test</span>
            <span className="text-[9px] text-mine-muted">rank(X) 保留率</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold font-mono tabular-nums ${retentionColorClass(rankPct)}`}>
              {rankPct}%
            </span>
            <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${retentionBgClass(rankPct)}`}>
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
            <span className={`text-[11px] font-bold font-mono tabular-nums ${retentionColorClass(binaryPct)}`}>
              {binaryPct}%
            </span>
            <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${retentionBgClass(binaryPct)}`}>
              {retentionLabel(binaryPct)}
            </span>
          </div>
        </div>

        <div className="text-[9px] text-mine-muted leading-relaxed mt-1">
          变换后 Sharpe 保留 &gt;70% 表示因子捕捉的是结构性信号；&lt;30% 提示过拟合风险
        </div>
      </div>
    </DetailSection>
  );
}
```

**Step 3: Create ic-stats-collapsible.tsx**

```tsx
"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { DetailSection, DetailKV } from "@/components/shared/detail-panel";
import type { Factor } from "../../types";

function fmtIC(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(4)}`;
}

interface ICStatsCollapsibleProps {
  factor: Factor;
}

export function ICStatsCollapsible({ factor }: ICStatsCollapsibleProps) {
  const [open, setOpen] = useState(false);
  const d = factor.icDistribution;

  return (
    <DetailSection noBorder>
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-0 mt-2 px-1">
          <DetailKV label="IC均值" value={fmtIC(d.icMean)} color={d.icMean >= 0 ? "positive" : "negative"} />
          <DetailKV label="IC标准差" value={d.icStd.toFixed(4)} />
          <DetailKV label="正值次数" value={`${d.icPositiveCount}`} />
          <DetailKV label="负值次数" value={`${d.icNegativeCount}`} />
          <DetailKV label="显著比例" value={`${(d.icSignificantRatio * 100).toFixed(1)}%`} />
          <DetailKV label="正显著比例" value={`${(d.icPositiveSignificantRatio * 100).toFixed(1)}%`} />
          <DetailKV label="负显著比例" value={`${(d.icNegativeSignificantRatio * 100).toFixed(1)}%`} />
          <DetailKV
            label="P值"
            value={d.icPValue < 0.001 ? "<0.001" : d.icPValue.toFixed(3)}
            color={d.icPValue < 0.05 ? "positive" : "negative"}
          />
          <DetailKV label="偏度" value={d.icSkewness.toFixed(2)} />
          <DetailKV label="峰度" value={d.icKurtosis.toFixed(2)} />
        </div>
      )}
    </DetailSection>
  );
}
```

**Step 4: Create status-actions.tsx**

```tsx
"use client";

import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { DetailSection } from "@/components/shared/detail-panel";
import { useLibraryStore } from "../../store/use-library-store";
import { StatusChangeDialog } from "../status-change-dialog";
import type { Factor, FactorLifecycleStatus } from "../../types";
import { VALID_STATUS_TRANSITIONS, STATUS_COLORS, STATUS_LABELS } from "../../types";

interface StatusActionsSectionProps {
  factor: Factor;
}

export function StatusActionsSection({ factor }: StatusActionsSectionProps) {
  const validTransitions = VALID_STATUS_TRANSITIONS[factor.status];
  const updateFactorStatus = useLibraryStore((s) => s.updateFactorStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [justChanged, setJustChanged] = useState(false);

  const handleConfirm = useCallback(
    (targetStatus: FactorLifecycleStatus, reason: string) => {
      updateFactorStatus(factor.id, targetStatus, reason);
      setDialogOpen(false);
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 1500);
    },
    [factor.id, updateFactorStatus],
  );

  if (validTransitions.length === 0) return null;

  return (
    <DetailSection title="状态变更">
      {justChanged && (
        <span className="text-[10px] font-medium text-mine-accent-green animate-pulse mb-2 block">
          ✓ 已变更
        </span>
      )}
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
    </DetailSection>
  );
}
```

**Step 5: Verify compilation**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx tsc --noEmit --project apps/web/tsconfig.json`

**Step 6: Commit**

```bash
git add apps/web/src/features/library/components/factor-detail/fitness-section.tsx \
  apps/web/src/features/library/components/factor-detail/robustness-section.tsx \
  apps/web/src/features/library/components/factor-detail/ic-stats-collapsible.tsx \
  apps/web/src/features/library/components/factor-detail/status-actions.tsx
git commit -m "feat(library): add Layer 4 sections (fitness, robustness, IC stats, actions)"
```

---

### Task 9: Assemble factor-detail-panel.tsx (Main Panel + Animation)

**Files:**
- Create: `apps/web/src/features/library/components/factor-detail/factor-detail-panel.tsx`
- Update: `apps/web/src/features/library/components/factor-detail/index.ts`

**Step 1: Create the main panel component**

This is the orchestrator that composes all sections using `DetailPanel` primitive + `AnimatePresence` for factor switching.

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DetailPanel } from "@/components/shared/detail-panel";
import { useLibraryStore } from "../../store/use-library-store";
import type { Factor } from "../../types";

import { IdentityHeader } from "./identity-header";
import { OverviewSection } from "./overview-section";
import { StatisticsSection } from "./statistics-section";
import { ICTimeSeriesSection } from "./charts/ic-time-series";
import { ICHistogramSection } from "./charts/ic-histogram";
import { LongShortEquitySection } from "./charts/long-short-equity";
import { ICDecayProfileSection } from "./charts/ic-decay-profile";
import { FitnessSection } from "./fitness-section";
import { RobustnessSection } from "./robustness-section";
import { ICStatsCollapsible } from "./ic-stats-collapsible";
import { StatusActionsSection } from "./status-actions";

interface FactorDetailPanelProps {
  factor: Factor;
}

export function FactorDetailPanel({ factor }: FactorDetailPanelProps) {
  const selectFactor = useLibraryStore((s) => s.selectFactor);

  return (
    <DetailPanel
      title="因子详情"
      onClose={() => selectFactor(null)}
      width={360}
      className="h-full"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={factor.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Header: Identity Card */}
          <IdentityHeader factor={factor} />

          {/* Layer 1: Quick Assessment */}
          <OverviewSection factor={factor} />

          {/* Layer 2: Core Statistics */}
          <StatisticsSection factor={factor} />

          {/* Layer 3: Deep Charts */}
          <ICTimeSeriesSection factor={factor} />
          <ICHistogramSection factor={factor} />
          <LongShortEquitySection factor={factor} />
          <ICDecayProfileSection factor={factor} />

          {/* Layer 4: Supplementary */}
          <FitnessSection factor={factor} />
          <RobustnessSection factor={factor} />
          <ICStatsCollapsible factor={factor} />
          <StatusActionsSection factor={factor} />
        </motion.div>
      </AnimatePresence>
    </DetailPanel>
  );
}
```

**Step 2: Update barrel export**

The `index.ts` already exports `FactorDetailPanel` — no change needed since the component name matches.

**Step 3: Verify compilation**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx tsc --noEmit --project apps/web/tsconfig.json`

**Step 4: Commit**

```bash
git add apps/web/src/features/library/components/factor-detail/factor-detail-panel.tsx
git commit -m "feat(library): assemble redesigned FactorDetailPanel with 5-layer architecture"
```

---

### Task 10: Update library-page.tsx Import + Delete Old File

**Files:**
- Modify: `apps/web/src/features/library/components/library-page.tsx` (line 8)
- Delete: `apps/web/src/features/library/components/factor-detail-panel.tsx` (old 891-line file)

**Step 1: Update import path**

Change line 8 from:
```typescript
import { FactorDetailPanel } from "./factor-detail-panel";
```
to:
```typescript
import { FactorDetailPanel } from "./factor-detail";
```

Everything else stays the same — the component name and props are identical.

**Step 2: Delete old monolith file**

```bash
rm apps/web/src/features/library/components/factor-detail-panel.tsx
```

**Step 3: Verify compilation**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx tsc --noEmit --project apps/web/tsconfig.json`
Expected: Pass — no other files import the old `factor-detail-panel.tsx`

**Step 4: Verify build**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx nx run web:build`
Expected: Build passes with all routes including `/factor/library`

**Step 5: Commit**

```bash
git add apps/web/src/features/library/components/library-page.tsx
git rm apps/web/src/features/library/components/factor-detail-panel.tsx
git commit -m "refactor(library): switch to modular factor-detail panel, remove 891-line monolith

Replaces flat 8-section panel with 5-layer architecture:
- Header: identity card with collapsible expression
- L1: V-Score + 5-dim radar (收益力/稳定性/效率/容量/鲜度)
- L2: 3x3 KPI grid + quantile bar
- L3: IC time series, IC histogram (new), L/S equity curve (new), IC decay
- L4: multi-pool fitness, robustness, IC stats (collapsible), status actions

All sections use DetailPanel/DetailSection primitives. AnimatePresence for
factor switching. 30+ hardcoded hex colors replaced with semantic tokens."
```

---

### Task 11: Visual Verification

**Step 1: Start dev server**

Run: `cd /Users/vx/WebstormProjects/vibe-trading && npx nx run web:serve --port=4200`

**Step 2: Navigate to factor library**

Open `http://localhost:4200/factor/library` in browser.

**Step 3: Click a factor row to open detail panel**

Visual checklist:
- [ ] Panel slides in from right
- [ ] Header shows name, version, badges, collapsible expression
- [ ] V-Score indicator shows correct color/label
- [ ] 5-dimension radar renders with labels
- [ ] 3×3 KPI grid shows all 9 metrics with correct colors
- [ ] Quantile bar shows Q1-Q5
- [ ] IC time series shows 3 layers (gray daily, blue MA, red threshold)
- [ ] IC histogram shows 20 bins
- [ ] Long-short equity curve shows with MaxDD red area + 4 KPIs
- [ ] IC decay shows T+1 to T+20 bars
- [ ] Multi-pool table renders with "最佳" highlight
- [ ] Robustness shows Rank/Binary with retention badges
- [ ] IC stats collapsible works (click to expand)
- [ ] Status change buttons appear and open dialog

**Step 4: Switch between factors**

- [ ] AnimatePresence transition works (content fades out/in)
- [ ] No stale data from previous factor

**Step 5: Close panel**

- [ ] X button closes panel
- [ ] Grid expands back to full width
