'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { MarketBreadth } from './detail/market-breadth';
import { HotConcepts } from './detail/hot-concepts';
import { CapitalFlow } from './detail/capital-flow';
import { LimitAnalysis } from './detail/limit-analysis';

export function MarketDetailPanel() {
  return (
    <Card className="w-[360px] min-w-0 max-w-full">
      <CardHeader title="市场概览" className="px-4 py-3" />

      {/* Content sections */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-5">
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
      </CardContent>
    </Card>
  );
}
