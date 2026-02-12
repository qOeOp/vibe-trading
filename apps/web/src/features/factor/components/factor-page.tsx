"use client";

import { useState, useMemo, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimateIn, AnimateHeavy } from "@/components/animation";
import { ErrorBoundary, FeatureErrorFallback } from "@/components/error-boundary";
import { useSetTopBarNavItems } from "@/components/layout/top-bar-slot";
import { ChartLegendInline } from "@/components/chart-legend-inline";
import { BandChart } from "@/lib/ngx-charts/band-chart";
import type { TopBarNavItem } from "@/components/layout/top-bar-slot";
import type { BandTooltipInfo } from "@/lib/ngx-charts/band-chart/components";
import type { HoldingCompositionPoint, FactorStatistics } from "../types";

import { usePolarCalendar } from "../hooks/use-polar-calendar";
import { useBandData } from "../hooks/use-band-data";
import { getAllFactors, getFactorData } from "../data/mock-factors";
import { PolarRing } from "./polar-ring";
import { LeaderboardTable } from "./leaderboard-table";
import { ChartCard } from "./chart-card";
import { HoldingCompositionChart, HOLDING_COMPOSITION_LEGEND } from "./holding-composition-chart";
import { CumulativeReturnsChart, CUMULATIVE_RETURNS_LEGEND } from "./cumulative-returns-chart";
import { SectorPerformanceChart } from "./sector-performance-chart";

/** Evenly-spaced date labels rendered above the chart */
function HoldingDateTicks({ data }: { data: HoldingCompositionPoint[] }) {
  const ticks = useMemo(() => {
    if (data.length === 0) return [];
    const count = 4;
    const step = Math.max(1, Math.floor((data.length - 1) / (count - 1)));
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.min(i * step, data.length - 1);
      result.push(data[idx].date);
    }
    return result;
  }, [data]);

  if (ticks.length === 0) return null;

  return (
    <div className="flex items-center justify-between px-2 pb-0.5">
      {ticks.map((d) => (
        <span key={d} className="text-[10px] text-mine-muted font-mono tabular-nums">{d}</span>
      ))}
    </div>
  );
}

/** Compact statistics card — 2-col grid of key metrics */
function StatisticsCard({ statistics, strategyName, className }: { statistics: FactorStatistics; strategyName?: string; className?: string }) {
  const fmt = (v: number, type: "pct" | "dec" | "num"): string => {
    switch (type) {
      case "pct": return `${(v * 100).toFixed(2)}%`;
      case "dec": return v.toFixed(4);
      case "num": return v.toFixed(2);
    }
  };

  const metrics = [
    { label: "Alpha", value: fmt(statistics.annualizedAlpha, "pct"), color: statistics.annualizedAlpha > 0 ? "#0B8C5F" : "#CF304A" },
    { label: "Sharpe", value: fmt(statistics.sharpeRatio, "num"), color: statistics.sharpeRatio > 1 ? "#0B8C5F" : undefined },
    { label: "Max DD", value: fmt(statistics.maxDrawdown, "pct"), color: "#CF304A" },
    { label: "Volatility", value: fmt(statistics.volatility, "pct"), color: undefined },
    { label: "Mean IC", value: fmt(statistics.informationCoefficient, "dec"), color: statistics.informationCoefficient > 0.03 ? "#0B8C5F" : undefined },
    { label: "IC t-stat", value: fmt(statistics.icTStat, "num"), color: statistics.icTStat > 2 ? "#0B8C5F" : undefined },
    { label: "Turnover", value: fmt(statistics.turnoverMean, "pct"), color: undefined },
    { label: "Autocorr.", value: fmt(statistics.factorRankAutocorr, "dec"), color: statistics.factorRankAutocorr > 0.8 ? "#0B8C5F" : undefined },
  ];

  return (
    <div className={cn("bg-white shadow-sm border border-mine-border rounded-xl overflow-hidden flex flex-col", className)}>
      <div className="px-3 py-2 border-b border-mine-border/50 shrink-0">
        <h3 className="text-sm font-semibold text-mine-text truncate leading-tight">
          {strategyName ?? "Strategy Metrics"}
        </h3>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-1">
        <div className="grid grid-cols-2 gap-x-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex justify-between items-center py-1.5 border-b border-mine-border/30 last:border-b-0">
              <span className="text-[10px] text-mine-muted">{m.label}</span>
              <span
                className="text-[11px] font-mono tabular-nums font-medium"
                style={{ color: m.color ?? "#1a1a1a" }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Inline hover info rendered in the Daily Returns ChartCard header */
function BandHoverHeader({ info }: { info: BandTooltipInfo }) {
  const fmtVal = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
  const valColor = (v: number) => (v >= 0 ? "text-market-up" : "text-market-down");

  return (
    <div className="flex items-center gap-3 text-[11px]">
      <span className="text-mine-muted font-mono tabular-nums">{info.date}</span>
      {info.closestStrategy && (
        <>
          <span className="text-mine-text font-medium">{info.closestStrategy.id}</span>
          <span className={`font-mono tabular-nums ${valColor(info.closestStrategy.value)}`}>
            {fmtVal(info.closestStrategy.value)}
          </span>
          <span className="w-px h-3 bg-mine-border/50" />
        </>
      )}
      <span className="text-mine-muted">Med</span>
      <span className={`font-mono tabular-nums ${valColor(info.band.median)}`}>{fmtVal(info.band.median)}</span>
      <span className="text-mine-muted">Q1</span>
      <span className={`font-mono tabular-nums ${valColor(info.band.q1)}`}>{fmtVal(info.band.q1)}</span>
      <span className="text-mine-muted">Q3</span>
      <span className={`font-mono tabular-nums ${valColor(info.band.q3)}`}>{fmtVal(info.band.q3)}</span>
    </div>
  );
}

const FACTOR_NAV_ITEMS: TopBarNavItem[] = [
  { id: "library", label: "Library", icon: BookOpen, afterId: "market", href: "/factor/library" },
];

const STRATEGY_TO_FACTOR: Record<string, string> = {
  ml_multi:   "momentum_12m",
  momentum:   "momentum_12m",
  value:      "value_pe",
  quality:    "quality_roe",
  growth:     "quality_roe",
  low_vol:    "volatility_60d",
  stat_arb:   "size_mcap",
  mean_rev:   "value_pe",
  trend:      "momentum_12m",
  sector_rot: "volatility_60d",
};

function FactorPageContent() {
  useSetTopBarNavItems(FACTOR_NAV_ITEMS);

  const polar = usePolarCalendar();

  const { bandData, overlay, auxiliaryLines, baseline, excessReturn } = useBandData(
    polar.detailDailyReturns,
    polar.dataset.strategies,
    polar.selectedStrategyId,
  );

  const factors = useMemo(() => getAllFactors(), []);

  const defaultFactorId = factors[0]?.id ?? "";
  const mappedFactorId = useMemo(
    () => (polar.selectedStrategyId
      ? STRATEGY_TO_FACTOR[polar.selectedStrategyId] ?? defaultFactorId
      : defaultFactorId),
    [polar.selectedStrategyId, defaultFactorId],
  );

  const factorData = useMemo(
    () => getFactorData(mappedFactorId),
    [mappedFactorId],
  );

  const [bandHoverInfo, setBandHoverInfo] = useState<BandTooltipInfo | null>(null);
  const [sectorMetric, setSectorMetric] = useState<"meanReturn" | "ic">("ic");
  const [cumulativeActiveLegend, setCumulativeActiveLegend] = useState<string | null>(null);
  const [holdingActiveLegend, setHoldingActiveLegend] = useState<string | null>(null);

  const cumulativeActiveEntries = useMemo(
    () => (cumulativeActiveLegend ? [{ name: cumulativeActiveLegend }] : []),
    [cumulativeActiveLegend]
  );

  const holdingActiveEntries = useMemo(
    () => (holdingActiveLegend ? [{ name: holdingActiveLegend }] : []),
    [holdingActiveLegend]
  );

  const handleCumulativeLegendActivate = useCallback(
    (label: string) => setCumulativeActiveLegend(label), [],
  );
  const handleCumulativeLegendDeactivate = useCallback(
    () => setCumulativeActiveLegend(null), [],
  );
  const handleHoldingLegendActivate = useCallback(
    (label: string) => setHoldingActiveLegend(label), [],
  );
  const handleHoldingLegendDeactivate = useCallback(
    () => setHoldingActiveLegend(null), [],
  );

  const selectedStrategyInfo = useMemo(() => {
    if (!polar.selectedStrategyId) return null;
    return polar.dataset.strategies.find((s) => s.id === polar.selectedStrategyId) ?? null;
  }, [polar.selectedStrategyId, polar.dataset.strategies]);

  const xZoomLabels = useMemo(() => {
    if (polar.selectedMonth !== null) {
      return ['W1', 'W2', 'W3', 'W4'];
    }
    
    // 5-Year History: Jan (as Year), Apr, Jul, Oct for each year
    const labels: string[] = [];
    for (const year of polar.dataset.years) {
      labels.push(`${year}`); // Represents Q1 (Jan)
      labels.push('Apr');     // Q2
      labels.push('Jul');     // Q3
      labels.push('Oct');     // Q4
    }
    return labels;
  }, [polar.selectedMonth, polar.dataset.years]);

  if (!factorData) {
    return (
      <div className="flex-1 flex items-center justify-center text-mine-muted">
        No factor data available
      </div>
    );
  }

  return (
    <>
      {/* ─── Left Column: Ranking + Polar Calendar ─── */}
      <AnimateIn delay={0} from="left" className="w-[420px] shrink-0 hidden xl:flex flex-col gap-3">
        {/* Ranking — compact, no scroll */}
        <div className="bg-white shadow-sm border border-mine-border rounded-xl overflow-hidden flex flex-col shrink-0">
          <div className="px-3 py-2 border-b border-mine-border/50">
            <h2 className="text-xs font-semibold text-mine-text">Strategy Ranking</h2>
            <p className="text-[10px] text-mine-muted mt-0.5">
              {polar.activeYear} annual performance
            </p>
          </div>
          <div>
            <ErrorBoundary
              fallback={(error) => (
                <FeatureErrorFallback error={error} featureName="Leaderboard" />
              )}
            >
              <LeaderboardTable
                rankings={polar.leaderboard}
                hoverStrategyId={polar.hoverStrategyId}
                selectedStrategyId={polar.selectedStrategyId}
                onHoverStrategy={polar.setHoverStrategyId}
                onSelectStrategy={polar.setSelectedStrategyId}
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Polar Calendar — fills remaining height */}
        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="Polar Calendar" />
          )}
        >
          <ChartCard
            title="Polar Calendar"
            subtitle="Click sector to drill down"
            className="flex-1 min-h-0"
            frostedContent
            actions={
              <div className="flex items-center gap-1 text-xs text-mine-muted">
                <span className="font-mono tabular-nums">{polar.activeYear}</span>
                <span className="mx-1">·</span>
                <span>{polar.dataset.strategies.length} strategies</span>
              </div>
            }
          >
            <PolarRing
              months={polar.months}
              strategies={polar.dataset.strategies}
              activeYear={polar.activeYear}
              availableYears={polar.dataset.years}
              hoverStrategyId={polar.hoverStrategyId}
              selectedStrategyId={polar.selectedStrategyId}
              selectedMonth={polar.selectedMonth}
              onYearChange={polar.setActiveYear}
              onHoverStrategy={polar.setHoverStrategyId}
              onSelectMonth={polar.setSelectedMonth}
            />
          </ChartCard>
        </ErrorBoundary>
      </AnimateIn>

      {/* ─── Right Column: scrollable main area ─── */}
      <AnimateHeavy delay={0.15} className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto scrollbar-thin pr-2">

        {/* ══ Hero viewport — fills exactly the visible scroll area ══ */}
        <div className="flex flex-col gap-3 h-full">

          {/* Daily Returns — HERO, fills remaining after bottom row */}
          <ErrorBoundary
            fallback={(error) => (
              <FeatureErrorFallback error={error} featureName="Daily Returns" />
            )}
          >
            <ChartCard
              title="Daily Returns"
              subtitle={polar.detailMonthLabel}
              className="flex-1 min-h-0"
              frostedContent
              actions={bandHoverInfo ? <BandHoverHeader info={bandHoverInfo} /> : undefined}
            >
              <div className="flex-1 min-h-0 px-1">
                <BandChart
                  data={bandData}
                  overlay={overlay}
                  auxiliaryLines={auxiliaryLines}
                  baseline={baseline}
                  excessReturn={excessReturn}
                  onHoverInfo={polar.selectedStrategyId ? setBandHoverInfo : undefined}
                  onSelectStrategy={polar.setSelectedStrategyId}
                  selectedMode={!!polar.selectedStrategyId}
                  tooltipDisabled
                  monthLabel={polar.selectedMonth !== null ? polar.detailMonthLabel : undefined}
                  xAxis={{ visible: false }}
                  yAxis={{ visible: false }}
                  referenceLines={[{ name: "zero", value: 0, color: "#a8b2c7" }]}
                  showRefLines
                  showDataZoom
                  showXDataZoom
                  xDataZoomLabels={xZoomLabels}
                  showDrawdown={!!polar.selectedStrategyId}
                  showMonthStripes
                  brushZoomEnabled={!!polar.selectedStrategyId}
                />
              </div>
            </ChartCard>
          </ErrorBoundary>

          {/* Bottom row: Strategy Metrics | Holding Composition | Sector Performance */}
          <div className="flex gap-3 shrink-0 h-[170px]">
            {/* Strategy Metrics */}
            <StatisticsCard
              statistics={factorData.statistics}
              strategyName={selectedStrategyInfo?.name}
              className="flex-[0.8] min-w-0"
            />

            {/* Holding Composition */}
            <ErrorBoundary
              fallback={(error) => (
                <FeatureErrorFallback error={error} featureName="Holding Composition" />
              )}
            >
              <ChartCard
                title="Holding Composition"
                className="flex-1 min-w-0"
                frostedContent
                actions={
                  <div className="grid grid-cols-3 gap-x-2 gap-y-0.5">
                    {HOLDING_COMPOSITION_LEGEND.map((item) => {
                      const isActive = holdingActiveLegend === item.label;
                      const dimmed = holdingActiveLegend != null && !isActive;
                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-1 cursor-pointer select-none transition-opacity"
                          style={{ opacity: dimmed ? 0.35 : 1 }}
                          onMouseEnter={() => handleHoldingLegendActivate(item.label)}
                          onMouseLeave={() => handleHoldingLegendDeactivate()}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[10px] text-mine-muted whitespace-nowrap leading-none">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                }
              >
                <HoldingDateTicks data={factorData.holdingComposition} />
                <div className="flex-1 min-h-0 mx-1 mb-1 rounded-lg overflow-hidden">
                  <HoldingCompositionChart
                    data={factorData.holdingComposition}
                    activeEntries={holdingActiveEntries}
                  />
                </div>
              </ChartCard>
            </ErrorBoundary>

            {/* Sector Performance */}
            <ErrorBoundary
              fallback={(error) => (
                <FeatureErrorFallback error={error} featureName="Sector Performance" />
              )}
            >
              <ChartCard
                title="Sector Performance"
                className="flex-[0.8] min-w-0"
                frostedContent
                actions={
                  <div className="flex items-center gap-1 p-0.5 bg-mine-bg rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSectorMetric("ic")}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                        sectorMetric === "ic"
                          ? "bg-mine-nav-active text-white"
                          : "text-mine-muted hover:text-mine-text"
                      }`}
                    >
                      IC
                    </button>
                    <button
                      type="button"
                      onClick={() => setSectorMetric("meanReturn")}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                        sectorMetric === "meanReturn"
                          ? "bg-mine-nav-active text-white"
                          : "text-mine-muted hover:text-mine-text"
                      }`}
                    >
                      Return
                    </button>
                  </div>
                }
              >
                <SectorPerformanceChart
                  data={factorData.sectorBreakdown}
                  metric={sectorMetric}
                />
              </ChartCard>
            </ErrorBoundary>
          </div>
        </div>

        {/* ══ Below fold: Cumulative Returns ══ */}
        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="Cumulative Returns" />
          )}
        >
          <ChartCard
            title="Cumulative Return by Quantile"
            subtitle="Q1 (Worst) vs Q5 (Best) cumulative performance"
            className="h-[560px] shrink-0"
            frostedContent
            actions={
              <ChartLegendInline
                items={CUMULATIVE_RETURNS_LEGEND}
                activeLabel={cumulativeActiveLegend}
                onActivate={handleCumulativeLegendActivate}
                onDeactivate={handleCumulativeLegendDeactivate}
              />
            }
          >
            <div className="flex-1 min-h-0 px-2 pb-2">
              <CumulativeReturnsChart
                data={factorData.cumulativeReturns}
                activeEntries={cumulativeActiveEntries}
              />
            </div>
          </ChartCard>
        </ErrorBoundary>

      </AnimateHeavy>
    </>
  );
}

export function FactorPage() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="flex-1 flex items-center justify-center">
          <FeatureErrorFallback
            error={error}
            featureName="Factor Analysis"
            onRetry={() => window.location.reload()}
          />
        </div>
      )}
    >
      <FactorPageContent />
    </ErrorBoundary>
  );
}
