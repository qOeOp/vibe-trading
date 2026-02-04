"use client";

import { TradingViewChart } from "./tradingview-chart";
import { WatchlistPanel } from "./watchlist-panel";
import { StockDetailPanel } from "./stock-detail-panel";
import { useState } from "react";
import { AnimateIn, AnimateHeavy } from "@/components/animation";
import { ErrorBoundary, FeatureErrorFallback } from "@/components/error-boundary";

// Symbol mapping for TradingView format
const SYMBOL_MAP: Record<string, string> = {
  AAPL: "NASDAQ:AAPL",
  MSFT: "NASDAQ:MSFT",
  GOOGL: "NASDAQ:GOOGL",
  AMZN: "NASDAQ:AMZN",
  NVDA: "NASDAQ:NVDA",
  TSLA: "NASDAQ:TSLA",
  META: "NASDAQ:META",
  SPX: "SP:SPX",
  NDQ: "NASDAQ:NDX",
  DJI: "DJ:DJI",
  ES: "CME_MINI:ES1!",
  NQ: "CME_MINI:NQ1!",
  CL: "NYMEX:CL1!",
  GC: "COMEX:GC1!",
  BTC: "BINANCE:BTCUSDT",
  ETH: "BINANCE:ETHUSDT",
  SOL: "BINANCE:SOLUSDT",
};

function AnalysisPageContent() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  // Convert to TradingView symbol format
  const tvSymbol = SYMBOL_MAP[selectedSymbol] || `NASDAQ:${selectedSymbol}`;

  return (
    <>
      {/* 左侧：K线图区域 - 重组件，延迟加载给予加载时间 */}
      <AnimateHeavy delay={0.2} duration={0.6} className="flex-1 flex flex-col overflow-hidden rounded-xl">
        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="Trading Chart" />
          )}
        >
          <TradingViewChart symbol={tvSymbol} />
        </ErrorBoundary>
      </AnimateHeavy>

      {/* 右侧：Watchlist + 股票详情 - 交错进入, hidden on smaller screens */}
      <div className="w-[320px] min-w-0 max-w-full flex-col gap-4 shrink-0 hidden lg:flex">
        <AnimateIn delay={0} from="right">
          <ErrorBoundary
            fallback={(error) => (
              <FeatureErrorFallback error={error} featureName="Watchlist" />
            )}
          >
            <WatchlistPanel
              selectedSymbol={selectedSymbol}
              onSelectSymbol={setSelectedSymbol}
            />
          </ErrorBoundary>
        </AnimateIn>
        <AnimateIn delay={1} from="right">
          <ErrorBoundary
            fallback={(error) => (
              <FeatureErrorFallback error={error} featureName="Stock Detail" />
            )}
          >
            <StockDetailPanel symbol={selectedSymbol} />
          </ErrorBoundary>
        </AnimateIn>
      </div>
    </>
  );
}

export function AnalysisPage() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="flex-1 flex items-center justify-center">
          <FeatureErrorFallback
            error={error}
            featureName="Analysis"
            onRetry={() => window.location.reload()}
          />
        </div>
      )}
    >
      <AnalysisPageContent />
    </ErrorBoundary>
  );
}
