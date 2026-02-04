"use client";

import { MarketBreadth } from "./detail/market-breadth";
import { HotConcepts } from "./detail/hot-concepts";
import { CapitalFlow } from "./detail/capital-flow";
import { LimitAnalysis } from "./detail/limit-analysis";

export function MarketDetailPanel() {
  return (
    <div className="w-[360px] flex flex-col gap-0 rounded-xl bg-white shadow-sm border border-mine-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-mine-border/50">
        <h2 className="text-sm font-semibold text-mine-text">市场概览</h2>
      </div>

      {/* Content sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 市场宽度 */}
        <MarketBreadth />

        <div className="border-t border-mine-border/30" />

        {/* 热门概念 */}
        <HotConcepts />

        <div className="border-t border-mine-border/30" />

        {/* 资金流向 */}
        <CapitalFlow />

        <div className="border-t border-mine-border/30" />

        {/* 涨跌停分析 */}
        <LimitAnalysis />
      </div>
    </div>
  );
}
