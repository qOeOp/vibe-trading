"use client";

import { cn } from "@/lib/utils";

type Period = "1D" | "5D" | "10D" | "20D";

interface PeriodToggleProps {
  value: Period;
  onChange: (period: Period) => void;
}

const PERIODS: Period[] = ["1D", "5D", "10D", "20D"];

export function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  return (
    <div className="flex items-center gap-1 p-0.5 bg-mine-bg rounded-lg">
      {PERIODS.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-md transition-all",
            value === period
              ? "bg-mine-nav-active text-white"
              : "text-mine-muted hover:text-mine-text"
          )}
        >
          {period}
        </button>
      ))}
    </div>
  );
}

export type { Period };
