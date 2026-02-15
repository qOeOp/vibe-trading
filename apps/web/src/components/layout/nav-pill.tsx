"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface NavPillProps {
  icon?: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function NavPill({ icon: Icon, label, isActive, onClick }: NavPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full transition-all",
        isActive
          ? "bg-mine-nav-active text-white shadow-sm"
          : "text-mine-muted hover:bg-white/50",
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />}
      {label}
    </button>
  );
}

interface NavPillGroupProps {
  children: ReactNode;
  className?: string;
}

export function NavPillGroup({ children, className }: NavPillGroupProps) {
  return (
    <nav className={cn("flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full p-1", className)}>
      {children}
    </nav>
  );
}
