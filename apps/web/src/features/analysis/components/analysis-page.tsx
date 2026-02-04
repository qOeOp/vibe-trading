"use client";

import { TradingViewChart } from "./tradingview-chart";
import { WatchlistPanel } from "./watchlist-panel";
import { StockDetailPanel } from "./stock-detail-panel";
import { useState } from "react";

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

export function AnalysisPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  // Convert to TradingView symbol format
  const tvSymbol = SYMBOL_MAP[selectedSymbol] || `NASDAQ:${selectedSymbol}`;

  return (
    <>
      {/* 左侧：K线图区域 */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-xl">
        <TradingViewChart symbol={tvSymbol} />
      </div>

      {/* 右侧：Watchlist + 股票详情 */}
      <div className="w-[320px] flex flex-col gap-4 shrink-0">
        <WatchlistPanel
          selectedSymbol={selectedSymbol}
          onSelectSymbol={setSelectedSymbol}
        />
        <StockDetailPanel symbol={selectedSymbol} />
      </div>
    </>
  );
}
