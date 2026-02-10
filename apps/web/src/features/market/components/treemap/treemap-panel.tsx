"use client";

import { memo, useMemo, useCallback, useState } from "react";
import { HeatMapContainer } from "./heatmap-container";
import { mockSectors } from "../../data/mock-sectors";
import { generateSyntheticChildren } from "../../data/generators";
import type { TreemapNode } from "../../types";

function buildTreemapData(): TreemapNode[] {
  return mockSectors.map((sector) => {
    const children = sector.children?.map((industry) => ({
      name: industry.name,
      capitalFlow: industry.capitalFlow,
      changePercent: industry.changePercent,
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

export const TreemapPanel = memo(function TreemapPanel() {
  const treemapData = useMemo(() => buildTreemapData(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <HeatMapContainer
      data={treemapData}
      isLoading={isLoading}
      error={error}
      onRetry={handleRetry}
      className="flex-1"
    />
  );
});
