"use client";

import type { Factor } from "../types";
import { CATEGORY_COLORS, STATUS_COLORS, STATUS_LABELS } from "../types";
import { useLibraryStore } from "../store/use-library-store";
import { cn } from "@/lib/utils";
import { SparklineSVG } from "./sparkline-svg";

interface FactorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  factor: Factor;
}

export function FactorCard({ factor, className, ...props }: FactorCardProps) {
  const selectedFactorId = useLibraryStore((s) => s.selectedFactorId);
  const selectFactor = useLibraryStore((s) => s.selectFactor);
  const toggleFactorSelection = useLibraryStore(
    (s) => s.toggleFactorSelection,
  );
  const selectedFactorIds = useLibraryStore((s) => s.selectedFactorIds);

  const catColor = CATEGORY_COLORS[factor.category];
  const statusColor = STATUS_COLORS[factor.status];
  const statusLabel = STATUS_LABELS[factor.status];
  const isSelected = selectedFactorId === factor.id;
  const isBatchSelected = selectedFactorIds.has(factor.id);
  const icColor = factor.ic >= 0 ? "#F6465D" : "#2EBD85";

  return (
    <div
      data-slot="factor-card"
      onClick={() => selectFactor(isSelected ? null : factor.id)}
      className={cn(
        "bg-white shadow-sm rounded-xl cursor-pointer transition-all hover:shadow-md overflow-hidden",
        className,
      )}
      style={{
        borderWidth: "1px 1px 1px 3px",
        borderStyle: "solid",
        borderTopColor: isSelected ? statusColor : "#e0ddd8",
        borderRightColor: isSelected ? statusColor : "#e0ddd8",
        borderBottomColor: isSelected ? statusColor : "#e0ddd8",
        borderLeftColor: statusColor,
      }}
      {...props}
    >
      <div className="px-3 py-2.5">
        {/* Row 1: Name + Status */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-bold text-mine-text truncate">
              {factor.name}
            </span>
            <span className="text-[10px] text-mine-muted font-mono shrink-0">
              {factor.version}
            </span>
          </div>
          <span
            className="px-1.5 py-0.5 text-[9px] font-bold rounded shrink-0"
            style={{
              backgroundColor: `${statusColor}18`,
              color: statusColor,
            }}
          >
            {statusLabel}
          </span>
        </div>

        {/* Row 2: Category + Checkbox */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2 py-0.5 text-[10px] font-semibold rounded"
            style={{
              backgroundColor: `${catColor}18`,
              color: catColor,
            }}
          >
            {factor.category}
          </span>
          <input
            type="checkbox"
            checked={isBatchSelected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleFactorSelection(factor.id)}
            className="w-3.5 h-3.5 rounded border-mine-border accent-mine-nav-active cursor-pointer"
          />
        </div>

        {/* Row 3: Sparkline */}
        <div className="mb-2">
          <SparklineSVG data={factor.icTrend} viewBoxWidth={160} viewBoxHeight={30} className="w-full h-[30px]" />
        </div>

        {/* Row 4: Key metrics */}
        <div className="flex items-center gap-3 text-[10px]">
          <div>
            <span className="text-mine-muted">IC </span>
            <span
              className={cn(
                "font-mono tabular-nums font-semibold",
                factor.ic >= 0
                  ? "text-market-down-strong"
                  : "text-market-up-strong",
              )}
            >
              {factor.ic >= 0 ? "+" : ""}
              {factor.ic.toFixed(3)}
            </span>
          </div>
          <div>
            <span className="text-mine-muted">IR </span>
            <span className="font-mono tabular-nums">
              {factor.ir.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-mine-muted">{"\u80DC\u7387"} </span>
            <span className="font-mono tabular-nums">{factor.winRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
