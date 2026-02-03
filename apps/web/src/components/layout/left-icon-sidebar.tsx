"use client";

import {
  LayoutGrid,
  TrendingUp,
  BarChart3,
  Gauge,
  Gem,
  Wallet,
  LineChart,
  Users,
  Wrench,
  Shield,
  Bell,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

const icons: SidebarItem[] = [
  { icon: LayoutGrid, label: "Dashboard" },
  { icon: TrendingUp, label: "Market", active: true },
  { icon: BarChart3, label: "Analytics" },
  { icon: Gauge, label: "Indicators" },
  { icon: Gem, label: "Watchlist" },
  { icon: Wallet, label: "Portfolio" },
  { icon: LineChart, label: "Trading" },
  { icon: Users, label: "Social" },
  { icon: Wrench, label: "Tools" },
  { icon: Shield, label: "Security" },
  { icon: Bell, label: "Alerts" },
  { icon: Settings, label: "Settings" },
];

export function LeftIconSidebar() {
  return (
    <div className="flex flex-col w-[52px] h-full items-center justify-center">
      {/* 毛玻璃容器 - 圆角贴合首尾tab */}
      <div className="flex flex-col items-center gap-1 py-1 px-1.5 rounded-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {icons.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full transition-all",
              active
                ? "bg-mine-nav-active text-white shadow-sm"
                : "text-mine-text hover:bg-white/80"
            )}
            title={label}
            aria-label={label}
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
}
