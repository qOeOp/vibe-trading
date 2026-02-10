"use client";

import { memo, useMemo } from "react";
import { getTopGainers, type ConceptData } from "../../data/mock-concepts";
import { formatPercent } from "../../utils/formatters";
import { cn } from "@/lib/utils";
import { API } from "../../constants";
import { SectionHeader } from "../shared/section-header";

const RANK_STYLES = [
  "bg-market-up-medium text-white",
  "bg-market-up-light text-white",
  "bg-mine-muted/30 text-mine-muted",
] as const;

interface ConceptTagProps {
  concept: ConceptData;
  onClick?: () => void;
}

const ConceptTag = memo(function ConceptTag({ concept, onClick }: ConceptTagProps) {
  const { name, changePercent } = concept;
  const isUp = changePercent > 0;
  const isDown = changePercent < 0;

  return (
    <button
      onClick={onClick}
      aria-label={`${name}: ${formatPercent(changePercent)}`}
      className={cn(
        "px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors",
        "border text-xs font-medium",
        "hover:shadow-sm",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-accent-teal/50",
        isUp && "bg-market-up-medium/5 border-market-up-medium/20 text-market-up-medium hover:bg-market-up-medium/10",
        isDown && "bg-market-down-medium/5 border-market-down-medium/20 text-market-down-medium hover:bg-market-down-medium/10",
        !isUp && !isDown && "bg-mine-muted/5 border-mine-border text-mine-muted"
      )}
    >
      <span>{name}</span>
      <span className="ml-1.5 opacity-80 tabular-nums">{formatPercent(changePercent)}</span>
    </button>
  );
});

interface ConceptRowProps {
  concept: ConceptData;
  rank: number;
  onClick?: () => void;
}

const ConceptRow = memo(function ConceptRow({ concept, rank, onClick }: ConceptRowProps) {
  const { name, changePercent, leadingStock } = concept;

  return (
    <button
      onClick={onClick}
      aria-label={`第${rank + 1}名 ${name}: ${formatPercent(changePercent)}, 龙头股 ${leadingStock}`}
      className="w-full flex items-center justify-between py-1 px-2 rounded hover:bg-mine-bg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-accent-teal/50 focus-visible:ring-inset"
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center",
            RANK_STYLES[rank] || RANK_STYLES[2]
          )}
        >
          {rank + 1}
        </span>
        <span className="text-xs text-mine-text font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-mine-muted">{leadingStock}</span>
        <span
          className={cn(
            "text-xs font-semibold w-14 text-right tabular-nums",
            changePercent > 0 && "text-market-up-medium",
            changePercent < 0 && "text-market-down-medium",
            !(changePercent > 0) && !(changePercent < 0) && "text-market-flat"
          )}
        >
          {formatPercent(changePercent)}
        </span>
      </div>
    </button>
  );
});

export const HotConcepts = memo(function HotConcepts() {
  const concepts = useMemo(() => getTopGainers(API.conceptsLimit), []);

  return (
    <div className="space-y-3">
      <SectionHeader title="热门概念" showMore />

      <div className="flex flex-wrap gap-2">
        {concepts.map((c) => (
          <ConceptTag key={c.name} concept={c} />
        ))}
      </div>

      <div className="space-y-1.5 pt-1">
        {concepts.slice(0, 3).map((c, i) => (
          <ConceptRow key={c.name} concept={c} rank={i} />
        ))}
      </div>
    </div>
  );
});
