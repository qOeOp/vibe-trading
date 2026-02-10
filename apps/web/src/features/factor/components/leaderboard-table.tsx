"use client";

import { cn } from "@/lib/utils";
import type { RankedStrategy } from "../data/polar-calendar-data";

interface LeaderboardTableProps {
  rankings: RankedStrategy[];
  hoverStrategyId: string | null;
  selectedStrategyId: string | null;
  onHoverStrategy: (id: string | null) => void;
  onSelectStrategy: (id: string) => void;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xs" title="1st">🥇</span>;
  if (rank === 2) return <span className="text-xs" title="2nd">🥈</span>;
  if (rank === 3) return <span className="text-xs" title="3rd">🥉</span>;
  return (
    <span className="text-xs text-mine-muted font-mono tabular-nums w-5 text-center inline-block">
      {rank}
    </span>
  );
}

export function LeaderboardTable({
  rankings,
  hoverStrategyId,
  selectedStrategyId,
  onHoverStrategy,
  onSelectStrategy,
}: LeaderboardTableProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-mine-border/50 text-[10px] font-medium text-mine-muted uppercase tracking-wider">
        <span className="w-5">#</span>
        <span className="flex-1">Strategy</span>
        <span className="w-14 text-right">Return</span>
        <span className="w-12 text-right">Sharpe</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {rankings.map((item) => {
          const isHovered = hoverStrategyId === item.strategy.id;
          const isSelected = selectedStrategyId === item.strategy.id;
          const hasHighlight = hoverStrategyId != null || selectedStrategyId != null;
          const dimmed = hasHighlight && !isHovered && !isSelected;

          return (
            <div
              key={item.strategy.id}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer transition-all border-l-2",
                isSelected
                  ? "bg-mine-bg border-l-mine-nav-active"
                  : isHovered
                    ? "bg-mine-bg/60 border-l-transparent"
                    : "bg-transparent border-l-transparent hover:bg-mine-bg/40",
                dimmed && "opacity-40"
              )}
              onMouseEnter={() => onHoverStrategy(item.strategy.id)}
              onMouseLeave={() => onHoverStrategy(null)}
              onClick={() => onSelectStrategy(item.strategy.id)}
            >
              {/* Rank */}
              <div className="w-5 flex items-center justify-center shrink-0">
                <RankBadge rank={item.rank} />
              </div>

              {/* Color dot + Name */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.strategy.color }}
                />
                <span className="text-xs text-mine-text truncate">
                  {item.strategy.name}
                </span>
              </div>

              {/* Annual Return */}
              <div className="w-14 text-right shrink-0">
                <span
                  className={cn(
                    "text-xs font-mono tabular-nums font-medium",
                    item.annualReturn >= 0 ? "text-[#CF304A]" : "text-[#0B8C5F]"
                  )}
                >
                  {item.annualReturn > 0 ? "+" : ""}
                  {item.annualReturn.toFixed(1)}%
                </span>
              </div>

              {/* Sharpe */}
              <div className="w-12 text-right shrink-0">
                <span
                  className={cn(
                    "text-xs font-mono tabular-nums",
                    item.sharpe >= 1 ? "text-[#0B8C5F]" : "text-mine-muted"
                  )}
                >
                  {item.sharpe.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
