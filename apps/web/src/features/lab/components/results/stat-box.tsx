"use client";

import { cn } from "@/lib/utils";

// ─── Shared StatBox ─────────────────────────────────────

interface StatBoxProps {
  label: string;
  value: string;
  color?: "green" | "yellow" | "red";
}

export function StatBox({ label, value, color }: StatBoxProps) {
  return (
    <div data-slot="stat-box" className="bg-mine-bg rounded-md p-2 text-center">
      <div
        className={cn(
          "text-sm font-bold font-mono tabular-nums",
          color === "green" && "text-mine-accent-green",
          color === "yellow" && "text-mine-accent-yellow",
          color === "red" && "text-mine-accent-red",
          !color && "text-mine-text",
        )}
      >
        {value}
      </div>
      <div className="text-[9px] text-mine-muted mt-0.5">{label}</div>
    </div>
  );
}
