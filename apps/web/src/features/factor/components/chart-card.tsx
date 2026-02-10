"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  /** Enable frosted glass effect on the content area */
  frostedContent?: boolean;
}

export function ChartCard({ title, subtitle, children, className, actions, frostedContent }: ChartCardProps) {
  return (
    <div
      className={cn(
        "shadow-sm border rounded-xl",
        "flex flex-col overflow-hidden",
        frostedContent
          ? "bg-white/40 backdrop-blur-2xl border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          : "bg-white border-mine-border",
        className
      )}
    >
      <div className={cn(
        "flex items-center gap-x-4 px-3 py-2 border-b bg-white rounded-t-xl",
        frostedContent ? "border-white/40" : "border-mine-border/50"
      )}>
        <div className="shrink-0">
          <h3 className="text-sm font-semibold text-mine-text leading-tight">{title}</h3>
          {subtitle && <p className="text-[11px] text-mine-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex-1 min-w-0 flex justify-end">{actions}</div>}
      </div>
      <div className="flex-1 flex flex-col pt-1.5 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
