"use client";

import { cn } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Award,
  Activity,
  BarChart2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FactorInfo, FactorCategory } from "../types";

interface FactorSelectorProps {
  factors: FactorInfo[];
  selectedFactorId: string;
  onSelectFactor: (factorId: string) => void;
}

const CATEGORY_ICONS: Record<FactorCategory, LucideIcon> = {
  momentum: TrendingUp,
  value: DollarSign,
  quality: Award,
  volatility: Activity,
  size: BarChart2,
  growth: TrendingUp,
  technical: Activity,
};

const CATEGORY_COLORS: Record<FactorCategory, string> = {
  momentum: "#8b5cf6",
  value: "#f59e0b",
  quality: "#10b981",
  volatility: "#ef4444",
  size: "#3b82f6",
  growth: "#22c55e",
  technical: "#6366f1",
};

export function FactorSelector({
  factors,
  selectedFactorId,
  onSelectFactor,
}: FactorSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {factors.map((factor) => {
        const Icon = CATEGORY_ICONS[factor.category];
        const isSelected = factor.id === selectedFactorId;

        return (
          <button
            key={factor.id}
            onClick={() => onSelectFactor(factor.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all text-left",
              "border",
              isSelected
                ? "bg-mine-bg border-mine-border shadow-sm"
                : "bg-transparent border-transparent hover:bg-mine-bg/50"
            )}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${CATEGORY_COLORS[factor.category]}20` }}
            >
              <Icon
                className="w-4 h-4"
                style={{ color: CATEGORY_COLORS[factor.category] }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-mine-text truncate">
                {factor.name}
              </div>
              <div className="text-xs text-mine-muted truncate">
                {factor.description}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div
                className={cn(
                  "text-sm font-mono font-medium",
                  factor.sharpeRatio >= 1 ? "text-[#0B8C5F]" : "text-mine-text"
                )}
              >
                {factor.sharpeRatio.toFixed(2)}
              </div>
              <div className="text-xs text-mine-muted">Sharpe</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
