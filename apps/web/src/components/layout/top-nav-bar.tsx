"use client";

import { useState, useCallback } from "react";
import {
  Bell,
  TrendingUp,
  BarChart3,
  Wallet,
  LineChart,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketTicker } from "./market-ticker";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: "market", label: "Market", icon: TrendingUp },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "portfolio", label: "Portfolio", icon: Wallet },
  { id: "trading", label: "Trading", icon: LineChart },
  { id: "settings", label: "Settings", icon: Settings },
];

const DEFAULT_ACTIVE_NAV = "market";

export function TopNavBar() {
  const [activeNav, setActiveNav] = useState(DEFAULT_ACTIVE_NAV);

  const handleNavClick = useCallback((id: string) => {
    setActiveNav(id);
  }, []);

  return (
    <header className="flex items-center h-14 bg-transparent gap-4 pr-4 shrink-0">
      {/* 左侧：行情滚动条 */}
      <div className="flex-1 overflow-hidden">
        <MarketTicker />
      </div>

      {/* 右侧：导航按钮和通知 */}
      <div className="flex items-center gap-4 shrink-0">
        <nav className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full p-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                activeNav === id
                  ? "bg-mine-nav-active text-white shadow-sm"
                  : "text-mine-text hover:bg-white/50"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/50"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
        </Button>
      </div>
    </header>
  );
}
