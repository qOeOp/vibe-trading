"use client";

import { useState } from "react";
import {
  Plus,
  Settings,
  ChevronRight,
  TrendingUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WATCHLIST_INDICES,
  WATCHLIST_SHARES,
  WATCHLIST_FUTURES,
  WATCHLIST_CRYPTO,
} from "../data/mock-stock-data";
import type { WatchlistItem } from "../data/mock-stock-data";

interface WatchlistPanelProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

// Collapsible group
function WatchlistGroup({
  title,
  items,
  selectedSymbol,
  onSelectSymbol,
  defaultExpanded = true,
}: {
  title: string;
  items: WatchlistItem[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-mine-muted hover:bg-mine-bg/50 transition-colors"
      >
        <ChevronRight
          className={cn(
            "w-3.5 h-3.5 transition-transform",
            isExpanded && "rotate-90"
          )}
        />
        {title}
      </button>

      {isExpanded && (
        <div className="space-y-px">
          {items.map((item) => (
            <WatchlistRow
              key={item.symbol}
              item={item}
              isSelected={item.symbol === selectedSymbol}
              onSelect={() => onSelectSymbol(item.symbol)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Individual row
function WatchlistRow({
  item,
  isSelected,
  onSelect,
}: {
  item: WatchlistItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isUp = item.change >= 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left cursor-pointer",
        isSelected
          ? "bg-mine-accent-teal/10"
          : "hover:bg-mine-bg/50"
      )}
    >
      {/* Symbol icon */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold",
          isUp ? "bg-market-up/10 text-market-up" : "bg-market-down/10 text-market-down"
        )}
      >
        {item.symbol.slice(0, 2)}
      </div>

      {/* Symbol & Name */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-mine-text truncate">
          {item.symbol}
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <div className="text-xs font-medium text-mine-text tabular-nums">
          {item.last.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>

      {/* Change */}
      <div className="text-right w-16">
        <div
          className={cn(
            "text-[10px] tabular-nums",
            isUp ? "text-market-up" : "text-market-down"
          )}
        >
          {isUp ? "+" : ""}
          {item.change.toFixed(2)}
        </div>
      </div>

      {/* Change % */}
      <div className="text-right w-14">
        <div
          className={cn(
            "text-[10px] tabular-nums font-medium",
            isUp ? "text-market-up" : "text-market-down"
          )}
        >
          {isUp ? "+" : ""}
          {item.changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Chart icon button */}
      <button
        className="p-1 rounded hover:bg-mine-bg transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          // Open chart
        }}
      >
        <TrendingUp className="w-3.5 h-3.5 text-mine-muted" />
      </button>
    </div>
  );
}

export function WatchlistPanel({
  selectedSymbol,
  onSelectSymbol,
}: WatchlistPanelProps) {
  return (
    <div className="flex-1 flex flex-col rounded-xl bg-white shadow-sm border border-mine-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-mine-border/50">
        <h2 className="text-sm font-semibold text-mine-text">Watchlist</h2>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-mine-bg transition-colors">
            <Plus className="w-4 h-4 text-mine-muted" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-mine-bg transition-colors">
            <Filter className="w-4 h-4 text-mine-muted" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-mine-bg transition-colors">
            <Settings className="w-4 h-4 text-mine-muted" />
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-3 py-2 bg-mine-bg/30 text-[10px] font-medium text-mine-muted uppercase tracking-wide">
        <div className="w-7 shrink-0" />
        <div className="flex-1">Symbol</div>
        <div className="text-right">Last</div>
        <div className="text-right w-16">Change</div>
        <div className="text-right w-14">Change%</div>
        <div className="w-6" />
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {/* Main indices */}
        <div className="space-y-px py-1">
          {WATCHLIST_INDICES.map((item) => (
            <WatchlistRow
              key={item.symbol}
              item={item}
              isSelected={item.symbol === selectedSymbol}
              onSelect={() => onSelectSymbol(item.symbol)}
            />
          ))}
        </div>

        <div className="border-t border-mine-border/30" />

        {/* Shares group */}
        <WatchlistGroup
          title="Shares"
          items={WATCHLIST_SHARES}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={onSelectSymbol}
        />

        <div className="border-t border-mine-border/30" />

        {/* Futures group */}
        <WatchlistGroup
          title="Futures"
          items={WATCHLIST_FUTURES}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={onSelectSymbol}
          defaultExpanded={false}
        />

        <div className="border-t border-mine-border/30" />

        {/* Crypto group */}
        <WatchlistGroup
          title="Cryptocurrencies"
          items={WATCHLIST_CRYPTO}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={onSelectSymbol}
          defaultExpanded={false}
        />
      </div>
    </div>
  );
}
