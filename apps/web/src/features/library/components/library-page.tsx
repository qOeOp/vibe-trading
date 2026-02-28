"use client";

import { useEffect, useMemo } from "react";
import { AnimateHeavy } from "@/components/animation";
import { ErrorBoundary, FeatureErrorFallback } from "@/components/error-boundary";

import { FactorDataTable } from "./factor-data-table";
import { FactorDetailPanel } from "./factor-detail";
import { useLibraryStore, filterFactors } from "../store/use-library-store";

// ─── Page Content ────────────────────────────────────────

function LibraryPageContent() {
  const factors = useLibraryStore((s) => s.factors);
  const statuses = useLibraryStore((s) => s.statuses);
  const category = useLibraryStore((s) => s.category);
  const search = useLibraryStore((s) => s.search);
  const selectedFactorId = useLibraryStore((s) => s.selectedFactorId);

  const fetchMiningFactors = useLibraryStore((s) => s.fetchMiningFactors);
  useEffect(() => { void fetchMiningFactors(); }, [fetchMiningFactors]);

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
      {/* Grid + Detail Panel */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        {/* Grid panel (left, dominant) — no card wrapper, tablecn style */}
        <div
          className="flex-1 min-w-0 overflow-hidden flex flex-col"
          style={{ flex: selectedFactor ? "65 1 0%" : "1 1 0%" }}
        >
          {/* View content */}
          <ErrorBoundary
            fallback={(error) => (
              <FeatureErrorFallback error={error} featureName="Factor Grid" />
            )}
          >
            <FactorDataTable factors={filteredFactors} />
          </ErrorBoundary>
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
