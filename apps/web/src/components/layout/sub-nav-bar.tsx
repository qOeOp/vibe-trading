"use client";

import { useState, useCallback } from "react";
import {
  TrendingUp,
  BarChart3,
  Wallet,
  LineChart,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

export function SubNavBar() {
  const [activeNav, setActiveNav] = useState(DEFAULT_ACTIVE_NAV);

  const handleNavClick = useCallback((id: string) => {
    setActiveNav(id);
  }, []);

  return (
    <div className="flex items-center justify-center px-6 h-12">
      <nav className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full p-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNavClick(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
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
    </div>
  );
}
