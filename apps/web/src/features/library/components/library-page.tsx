"use client";

import { useMemo } from "react";
import { AnimateHeavy } from "@/components/animation";
import { ErrorBoundary, FeatureErrorFallback } from "@/components/error-boundary";
import { useSetTopBarNavItems } from "@/components/layout/top-bar-slot";
import type { TopBarNavItem } from "@/components/layout/top-bar-slot";
import { BookOpen } from "lucide-react";

import { FilterBar } from "./filter-bar";
import { FactorGrid } from "./factor-grid";
import { FactorCardGrid } from "./factor-card-grid";
import { FactorDetailPanel } from "./factor-detail-panel";
import { BatchToolbar } from "./batch-toolbar";
import { useLibraryStore, filterFactors } from "../store/use-library-store";

const LIBRARY_NAV_ITEMS: TopBarNavItem[] = [
  {
    id: "library",
    label: "Library",
    icon: BookOpen,
    afterId: "market",
    href: "/factor/library",
  },
];

function LibraryPageContent() {
  useSetTopBarNavItems(LIBRARY_NAV_ITEMS);

  // All factors now live in Zustand store (mutable for status changes)
  const factors = useLibraryStore((s) => s.factors);

  // Filter state from store
  const statuses = useLibraryStore((s) => s.statuses);
  const category = useLibraryStore((s) => s.category);
  const search = useLibraryStore((s) => s.search);
  const selectedFactorId = useLibraryStore((s) => s.selectedFactorId);
  const viewMode = useLibraryStore((s) => s.viewMode);

  const filteredFactors = useMemo(
    () => filterFactors(factors, { statuses, category, search }),
    [factors, statuses, category, search],
  );

  const selectedFactor = useMemo(
    () =>
      selectedFactorId
        ? factors.find((f) => f.id === selectedFactorId) ?? null
        : null,
    [factors, selectedFactorId],
  );

  return (
    <AnimateHeavy
      delay={0.1}
      className="flex-1 min-w-0 flex flex-col gap-4 overflow-hidden"
    >
      {/* Row 1: Filter Bar */}
      <div className="bg-white shadow-sm border border-mine-border rounded-xl px-4 py-2.5 shrink-0">
        <FilterBar />
      </div>

      {/* Row 2: Grid + Detail Panel */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        {/* Grid (left, dominant) */}
        <div
          className="flex-1 min-w-0 bg-white shadow-sm border border-mine-border rounded-xl overflow-hidden flex flex-col"
          style={{ flex: selectedFactor ? "65 1 0%" : "1 1 0%" }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-mine-border/50 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-medium text-mine-muted uppercase tracking-wide">
                因子总览
              </h2>
              <span className="text-[10px] text-mine-muted font-mono tabular-nums">
                {filteredFactors.length} / {factors.length}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ErrorBoundary
              fallback={(error) => (
                <FeatureErrorFallback error={error} featureName="Factor Grid" />
              )}
            >
              {viewMode === "grid" ? (
                <FactorGrid factors={filteredFactors} />
              ) : (
                <FactorCardGrid factors={filteredFactors} />
              )}
            </ErrorBoundary>
          </div>
        </div>

        {/* Detail Panel (right, 35%) — only when a factor is selected */}
        {selectedFactor && (
          <div
            className="shrink-0 overflow-hidden"
            style={{ flex: "35 1 0%", maxWidth: "420px", minWidth: "320px" }}
          >
            <ErrorBoundary
              fallback={(error) => (
                <FeatureErrorFallback
                  error={error}
                  featureName="Factor Detail"
                />
              )}
            >
              <FactorDetailPanel factor={selectedFactor} />
            </ErrorBoundary>
          </div>
        )}
      </div>

      {/* Batch toolbar (floating, appears when factors are multi-selected) */}
      <BatchToolbar factors={filteredFactors} />
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
