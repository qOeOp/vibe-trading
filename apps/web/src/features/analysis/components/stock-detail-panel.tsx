"use client";

import { useState } from "react";
import {
  Bell,
  History,
  Settings,
  Plus,
  Search,
  ExternalLink,
  TrendingUp,
  MessageSquare,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStockInfo, MOCK_ALERTS } from "../data/mock-stock-data";
import type { AlertItem } from "../data/mock-stock-data";

interface StockDetailPanelProps {
  symbol: string;
}

// Tab types
type TabType = "alerts" | "history" | "system";

// Alert row component
function AlertRow({ alert }: { alert: AlertItem }) {
  const statusConfig = {
    active: { color: "text-mine-accent-teal", bg: "bg-mine-accent-teal/10", label: "Active" },
    triggered: { color: "text-market-up", bg: "bg-market-up/10", label: "Stopped - Triggered" },
    stopped: { color: "text-mine-muted", bg: "bg-mine-muted/10", label: "Stopped" },
  };

  const config = statusConfig[alert.status];

  return (
    <div className="px-3 py-2.5 hover:bg-mine-bg/50 transition-colors cursor-pointer">
      <div className="flex items-start gap-2">
        {/* Status icon */}
        <div
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
            config.bg
          )}
        >
          <Bell className={cn("w-3 h-3", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-mine-text leading-relaxed line-clamp-2">
            {alert.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-[10px] text-mine-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-mine-text" />
              {alert.symbol}, {alert.timeframe}
            </span>
            <span className={cn("text-[10px]", config.color)}>
              {config.label}
            </span>
            {alert.type && (
              <>
                <span className="text-[10px] text-mine-muted">·</span>
                <span className="text-[10px] text-mine-muted">{alert.type}</span>
              </>
            )}
          </div>
        </div>

        {/* Chart icon */}
        <button className="p-1 rounded hover:bg-mine-bg shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-mine-muted" />
        </button>
      </div>
    </div>
  );
}

// Alerts tab content
function AlertsTab() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Action bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-mine-border/30">
        <button className="p-1.5 rounded hover:bg-mine-bg transition-colors">
          <Plus className="w-4 h-4 text-mine-muted" />
        </button>
        <button className="p-1.5 rounded hover:bg-mine-bg transition-colors">
          <Search className="w-4 h-4 text-mine-muted" />
        </button>
        <button className="p-1.5 rounded hover:bg-mine-bg transition-colors">
          <Settings className="w-4 h-4 text-mine-muted" />
        </button>
      </div>

      {/* Alert list */}
      <div className="divide-y divide-mine-border/30">
        {MOCK_ALERTS.map((alert) => (
          <AlertRow key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

// Stock info section
function StockInfoSection({ symbol }: { symbol: string }) {
  const info = getStockInfo(symbol);
  const isUp = info.change >= 0;

  return (
    <div className="px-4 py-3 border-t border-mine-border/50">
      {/* Header with symbol */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
              isUp ? "bg-market-up/10 text-market-up" : "bg-market-down/10 text-market-down"
            )}
          >
            {symbol.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-mine-text">{symbol}</span>
              <ExternalLink className="w-3 h-3 text-mine-muted" />
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-mine-bg">
            <Settings className="w-4 h-4 text-mine-muted" />
          </button>
          <button className="p-1.5 rounded hover:bg-mine-bg">
            <MessageSquare className="w-4 h-4 text-mine-muted" />
          </button>
          <button className="p-1.5 rounded hover:bg-mine-bg">
            <Edit3 className="w-4 h-4 text-mine-muted" />
          </button>
        </div>
      </div>

      {/* Company info */}
      <div className="text-[11px] text-mine-muted mb-3">
        <span className="text-mine-text font-medium">{info.name}</span>
        <span> · </span>
        <span>{info.exchange}</span>
        <div className="mt-0.5">
          {info.sector} · {info.industry}
        </div>
      </div>

      {/* Price section */}
      <div className="space-y-2">
        {/* Main price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-mine-text tabular-nums">
            {info.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-xs text-mine-muted">USD</span>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              isUp ? "text-market-up" : "text-market-down"
            )}
          >
            {isUp ? "+" : ""}
            {info.change.toFixed(2)} ({isUp ? "+" : ""}
            {info.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div className="text-[10px] text-mine-muted">
          Last update at {info.lastUpdate}
        </div>

        {/* Pre-market price (if available) */}
        {info.preMarketPrice && (
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-semibold text-mine-text tabular-nums">
              {info.preMarketPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs text-mine-muted">USD</span>
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                (info.preMarketChange || 0) >= 0 ? "text-market-up" : "text-market-down"
              )}
            >
              {(info.preMarketChange || 0) >= 0 ? "+" : ""}
              {info.preMarketChange?.toFixed(2)} (
              {(info.preMarketChangePercent || 0) >= 0 ? "+" : ""}
              {info.preMarketChangePercent?.toFixed(2)}%)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-mine-bg text-mine-muted">
              Pre-market
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function StockDetailPanel({ symbol }: StockDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("alerts");

  const tabs: { id: TabType; label: string; icon: typeof Bell }[] = [
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "history", label: "History", icon: History },
    { id: "system", label: "System", icon: Settings },
  ];

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm border border-mine-border overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-mine-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "text-mine-accent-teal border-b-2 border-mine-accent-teal bg-mine-accent-teal/5"
                : "text-mine-muted hover:text-mine-text hover:bg-mine-bg/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-[200px]">
        {activeTab === "alerts" && <AlertsTab />}
        {activeTab === "history" && (
          <div className="flex items-center justify-center h-full text-xs text-mine-muted">
            No history available
          </div>
        )}
        {activeTab === "system" && (
          <div className="flex items-center justify-center h-full text-xs text-mine-muted">
            System settings
          </div>
        )}
      </div>

      {/* Stock info section */}
      <StockInfoSection symbol={symbol} />
    </div>
  );
}
