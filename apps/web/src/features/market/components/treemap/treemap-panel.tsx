"use client";

import { memo, useMemo, useCallback, useState } from "react";
import { HeatMapContainer } from "./heatmap-container";
import { mockSectors } from "../../data/mock-sectors";
import { generateSyntheticChildren } from "../../data/generators";
import type { TreemapNode } from "../../types";

// ============ Data Builder ============

/**
 * Build hierarchical treemap data with all levels.
 * Returns L1 sectors with nested L2 industries and L3 stocks.
 * Uses real stock data if available, otherwise generates synthetic children.
 */
function buildTreemapData(): TreemapNode[] {
  return mockSectors.map((sector) => {
    // Build L2 industries with L3 stocks
    const children = sector.children?.map((industry) => ({
      name: industry.name,
      capitalFlow: industry.capitalFlow,
      changePercent: industry.changePercent,
      // Use real stock data if provided, otherwise generate synthetic
      children: industry.children && industry.children.length > 0
        ? industry.children.map((stock) => ({
            name: stock.name,
            capitalFlow: stock.capitalFlow,
            changePercent: stock.changePercent,
          }))
        : generateSyntheticChildren(
            industry.name,
            industry.capitalFlow,
            industry.changePercent,
            5 + Math.floor(Math.random() * 5)
          ),
    }));

    return {
      name: sector.name,
      icon: sector.icon,
      capitalFlow: sector.capitalFlow,
      changePercent: sector.changePercent,
      children,
    };
  });
}

/**
 * Get L1 level data only (for initial display).
 * Children are preserved for drill-down functionality.
 */
function getL1Data(): TreemapNode[] {
  return buildTreemapData();
}

// ============ Main Component ============

export const TreemapPanel = memo(function TreemapPanel() {
  const treemapData = useMemo(() => buildTreemapData(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrillDown = useCallback((_node: TreemapNode, _level: number) => {
    // Callback for drill-down events - can be used for analytics or state sync
  }, []);

  const handleDrillUp = useCallback((_level: number) => {
    // Callback for drill-up events - can be used for analytics or state sync
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    // Simulate retry
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <HeatMapContainer
      data={treemapData}
      onDrillDown={handleDrillDown}
      onDrillUp={handleDrillUp}
      isLoading={isLoading}
      error={error}
      onRetry={handleRetry}
      className="flex-1"
    />
  );
});
