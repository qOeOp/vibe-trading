"use client";

import { useState, useMemo } from "react";
import { AnimateHeavy } from "@/components/animation";
import { ErrorBoundary, FeatureErrorFallback } from "@/components/error-boundary";
import { useSetTopBarNavItems } from "@/components/layout/top-bar-slot";
import type { TopBarNavItem } from "@/components/layout/top-bar-slot";
import { BookOpen } from "lucide-react";

import { FilterBar } from "./filter-bar";
import { SummaryCards } from "./summary-cards";
import { FactorGrid } from "./factor-grid";
import { CorrelationMatrix, EffectivenessDistribution } from "./bottom-panels";
import { getLibraryFactors, getLibrarySummary } from "../data/mock-library";
import type { LibraryFactor } from "../types";

const LIBRARY_NAV_ITEMS: TopBarNavItem[] = [
  { id: "library", label: "Library", icon: BookOpen, afterId: "market", href: "/factor/library" },
];

function LibraryPageContent() {
  // Inject "Library" tab into the top bar nav
  useSetTopBarNavItems(LIBRARY_NAV_ITEMS);

  const allFactors = useMemo(() => getLibraryFactors(), []);
  const summary = useMemo(() => getLibrarySummary(allFactors), [allFactors]);

  // Filters
  const [category, setCategory] = useState("全部");
  const [stockPool, setStockPool] = useState("全A");
  const [timePeriod, setTimePeriod] = useState("近3年");
  const [status, setStatus] = useState("全部");
  const [search, setSearch] = useState("");

  const filteredFactors = useMemo(() => {
    let result = allFactors;
    if (category !== "全部") {
      result = result.filter((f) => f.category === category);
    }
    if (status !== "全部") {
      result = result.filter((f) => f.status === status);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allFactors, category, status, search]);

  return (
    <AnimateHeavy delay={0.1} className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto scrollbar-thin pr-2">
      {/* Filter bar */}
      <div className="bg-white shadow-sm border border-mine-border rounded-xl px-4 py-3">
        <FilterBar
          category={category}
          onCategoryChange={setCategory}
          stockPool={stockPool}
          onStockPoolChange={setStockPool}
          timePeriod={timePeriod}
          onTimePeriodChange={setTimePeriod}
          status={status}
          onStatusChange={setStatus}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      {/* Summary cards */}
      <SummaryCards summary={summary} />

      {/* Factor overview table header */}
      <div className="bg-white shadow-sm border border-mine-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-mine-border/50">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-medium text-mine-muted uppercase tracking-wide">
              因子总览
            </h2>
            <span className="text-[10px] text-mine-muted">FACTOR OVERVIEW</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="px-3 py-1.5 text-xs font-medium text-mine-text bg-white border border-mine-border rounded-lg hover:bg-mine-bg transition-colors">
              列配置
            </button>
            <button type="button" className="px-3 py-1.5 text-xs font-medium text-mine-text bg-white border border-mine-border rounded-lg hover:bg-mine-bg transition-colors">
              导出
            </button>
          </div>
        </div>

        {/* AG Grid table */}
        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="Factor Grid" />
          )}
        >
          <FactorGrid factors={filteredFactors} />
        </ErrorBoundary>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="Correlation Matrix" />
          )}
        >
          <CorrelationMatrix factors={filteredFactors} />
        </ErrorBoundary>

        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="Effectiveness Distribution" />
          )}
        >
          <EffectivenessDistribution factors={filteredFactors} />
        </ErrorBoundary>
      </div>
    </AnimateHeavy>
  );
}

export function LibraryPage() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="flex-1 flex items-center justify-center">
          <FeatureErrorFallback
            error={error}
            featureName="Factor Library"
            onRetry={() => window.location.reload()}
          />
        </div>
      )}
    >
      <LibraryPageContent />
    </ErrorBoundary>
  );
}
