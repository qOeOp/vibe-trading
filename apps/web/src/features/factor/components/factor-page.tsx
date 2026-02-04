"use client";

import { useState, useMemo } from "react";
import { AnimateIn, AnimateHeavy } from "@/components/animation";
import { ErrorBoundary, FeatureErrorFallback } from "@/components/error-boundary";
import { FactorSelector } from "./factor-selector";
import { FactorStatisticsPanel } from "./factor-statistics-panel";
import { ChartCard } from "./chart-card";
import { PeriodToggle } from "./period-toggle";
import type { Period } from "./period-toggle";
import { QuantileReturnsChart } from "./quantile-returns-chart";
import { CumulativeReturnsChart } from "./cumulative-returns-chart";
import { TurnoverChart } from "./turnover-chart";
import { SectorPerformanceChart } from "./sector-performance-chart";
import { AutocorrelationChart } from "./autocorrelation-chart";
import { getAllFactors, getFactorData } from "../data/mock-factors";

function FactorPageContent() {
  const factors = useMemo(() => getAllFactors(), []);
  const [selectedFactorId, setSelectedFactorId] = useState(factors[0]?.id ?? "");
  const [returnsPeriod, setReturnsPeriod] = useState<Period>("5D");
  const [sectorMetric, setSectorMetric] = useState<"meanReturn" | "ic">("ic");

  const factorData = useMemo(
    () => getFactorData(selectedFactorId),
    [selectedFactorId]
  );

  if (!factorData) {
    return (
      <div className="flex-1 flex items-center justify-center text-mine-muted">
        No factor data available
      </div>
    );
  }

  return (
    <>
      {/* Left Panel: Factor Selector */}
      <AnimateIn delay={0} from="left" className="w-[280px] shrink-0 hidden xl:flex flex-col">
        <div className="flex-1 bg-white shadow-sm border border-mine-border rounded-xl p-4 overflow-hidden flex flex-col">
          <h2 className="text-sm font-semibold text-mine-text mb-4">Select Factor</h2>
          <div className="flex-1 overflow-y-auto">
            <ErrorBoundary
              fallback={(error) => (
                <FeatureErrorFallback error={error} featureName="Factor Selector" />
              )}
            >
              <FactorSelector
                factors={factors}
                selectedFactorId={selectedFactorId}
                onSelectFactor={setSelectedFactorId}
              />
            </ErrorBoundary>
          </div>
        </div>
      </AnimateIn>

      {/* Center: Chart Grid */}
      <AnimateHeavy delay={0.15} className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto scrollbar-thin">
        {/* Top Row: Quantile Returns + Sector Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ErrorBoundary
            fallback={(error) => (
              <FeatureErrorFallback error={error} featureName="Quantile Returns" />
            )}
          >
            <ChartCard
              title="Mean Period-wise Return by Quantile"
              subtitle="Returns across factor quantiles"
              className="h-[260px]"
              actions={
                <PeriodToggle value={returnsPeriod} onChange={setReturnsPeriod} />
              }
            >
              <QuantileReturnsChart
                data={factorData.quantileReturns}
                period={returnsPeriod}
              />
            </ChartCard>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={(error) => (
              <FeatureErrorFallback error={error} featureName="Sector Performance" />
            )}
          >
            <ChartCard
              title="Sector Performance"
              subtitle="Factor performance by sector"
              className="h-[260px]"
              frostedContent
              actions={
                <div className="flex items-center gap-1 p-0.5 bg-mine-bg rounded-lg">
                  <button
                    onClick={() => setSectorMetric("ic")}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                      sectorMetric === "ic"
                        ? "bg-mine-nav-active text-white"
                        : "text-mine-muted hover:text-mine-text"
                    }`}
                  >
                    IC
                  </button>
                  <button
                    onClick={() => setSectorMetric("meanReturn")}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
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

        {/* Middle Row: Cumulative Returns (Full Width, 2x Height) */}
        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="Cumulative Returns" />
          )}
        >
          <ChartCard
            title="Cumulative Return by Quantile"
            subtitle="Q1 (Worst) vs Q5 (Best) cumulative performance"
            className="h-[560px]"
          >
            <CumulativeReturnsChart data={factorData.cumulativeReturns} showLongShort />
          </ChartCard>
        </ErrorBoundary>

        {/* Bottom Row: Turnover + Autocorrelation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ErrorBoundary
            fallback={(error) => (
              <FeatureErrorFallback error={error} featureName="Turnover Analysis" />
            )}
          >
            <ChartCard
              title="Turnover by Quantile"
              subtitle="Portfolio turnover across periods"
              className="h-[280px]"
            >
              <TurnoverChart data={factorData.turnoverByQuantile} />
            </ChartCard>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={(error) => (
              <FeatureErrorFallback error={error} featureName="Autocorrelation" />
            )}
          >
            <ChartCard
              title="Factor Rank Autocorrelation"
              subtitle="Persistence of factor rankings"
              className="h-[280px]"
            >
              <AutocorrelationChart data={factorData.rankAutocorrelation} />
            </ChartCard>
          </ErrorBoundary>
        </div>
      </AnimateHeavy>

      {/* Right Panel: Statistics */}
      <AnimateIn delay={1} from="right" className="w-[260px] shrink-0 hidden lg:flex flex-col">
        <div className="flex-1 bg-white shadow-sm border border-mine-border rounded-xl p-4 overflow-hidden flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-mine-text">{factorData.info.name}</h2>
            <p className="text-xs text-mine-muted mt-1">{factorData.info.description}</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <ErrorBoundary
              fallback={(error) => (
                <FeatureErrorFallback error={error} featureName="Statistics" />
              )}
            >
              <FactorStatisticsPanel statistics={factorData.statistics} />
            </ErrorBoundary>
          </div>
        </div>
      </AnimateIn>
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
