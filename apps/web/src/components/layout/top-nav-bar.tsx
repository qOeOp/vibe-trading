"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  TrendingUp,
  BarChart3,
  Wallet,
  LineChart,
  Settings,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MarketTicker } from "./market-ticker";
import { useTopBarExtraNavItems } from "./top-bar-slot";

export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
}

const BASE_NAV_ITEMS: NavItem[] = [
  { id: "market", label: "Market", icon: TrendingUp },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "portfolio", label: "Portfolio", icon: Wallet },
  { id: "trading", label: "Trading", icon: LineChart },
  { id: "settings", label: "Settings", icon: Settings },
];

/**
 * Route-prefix overrides for the first "home" nav item.
 * When pathname starts with the prefix, the "market" item transforms.
 */
const ROUTE_HOME_OVERRIDES: { prefix: string; label: string; icon: LucideIcon; href: string }[] = [
  { prefix: "/factor", label: "Home", icon: Home, href: "/factor/home" },
];

const DEFAULT_ACTIVE_NAV = "market";

interface TopNavBarProps {
  /** Replace left area (default: MarketTicker) */
  leftSlot?: ReactNode;
  /** Fully override nav pills. When set, BASE_NAV_ITEMS & extras are ignored. */
  navItems?: NavItem[];
  /** Custom click handler for nav pills (default: router.push) */
  onNavClick?: (item: NavItem, index: number) => void;
  /** Custom active pill id (default: pathname-based) */
  activeNavId?: string;
  /** Extra buttons after Bell */
  trailingActions?: ReactNode;
}

export function TopNavBar({
  leftSlot,
  navItems: navItemsOverride,
  onNavClick,
  activeNavId,
  trailingActions,
}: TopNavBarProps = {}) {
  const [activeNav, setActiveNav] = useState(DEFAULT_ACTIVE_NAV);
  const extraNavItems = useTopBarExtraNavItems();
  const router = useRouter();
  const pathname = usePathname();

  // Reset local active state when pathname changes (avoids stale highlight)
  useEffect(() => {
    setActiveNav(DEFAULT_ACTIVE_NAV);
  }, [pathname]);

  const handleNavClick = useCallback(
    (item: NavItem, index: number) => {
      if (onNavClick) {
        onNavClick(item, index);
        return;
      }
      setActiveNav(item.id);
      if (item.href) {
        router.push(item.href);
      }
    },
    [onNavClick, router],
  );

  // Build nav items: use override if provided, otherwise default + extras
  const computedNavItems = useMemo(() => {
    const override = ROUTE_HOME_OVERRIDES.find((o) => pathname.startsWith(o.prefix));
    const base = override
      ? BASE_NAV_ITEMS.map((item) =>
          item.id === "market"
            ? { ...item, label: override.label, icon: override.icon, href: override.href }
            : item,
        )
      : BASE_NAV_ITEMS;

    if (extraNavItems.length === 0) return base;

    const result = [...base];
    for (const extra of extraNavItems) {
      const insertIdx = extra.afterId
        ? result.findIndex((item) => item.id === extra.afterId) + 1
        : result.length;
      result.splice(insertIdx > 0 ? insertIdx : result.length, 0, {
        id: extra.id,
        label: extra.label,
        icon: extra.icon,
        href: extra.href,
      });
    }
    return result;
  }, [extraNavItems, pathname]);

  const displayNavItems = navItemsOverride ?? computedNavItems;

  const isItemActive = (item: NavItem) => {
    if (activeNavId !== undefined) return item.id === activeNavId;
    if (item.href) return pathname === item.href;
    return activeNav === item.id;
  };

  return (
    <header className="flex items-center h-14 bg-transparent gap-4 pr-4 shrink-0">
      {/* Left: MarketTicker or custom slot */}
      <div className="flex-1 overflow-hidden">
        {leftSlot ?? <MarketTicker />}
      </div>

      {/* Right: nav pills + actions */}
      <div className="flex items-center gap-4 shrink-0">
        <nav className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full p-1">
          {displayNavItems.map((item, index) => {
            const { id, label, icon: Icon } = item;
            const isActive = isItemActive(item);
            return (
              <button
                type="button"
                key={id}
                onClick={() => handleNavClick(item, index)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                  isActive
                    ? "bg-mine-nav-active text-white shadow-sm"
                    : "text-mine-text hover:bg-white/50"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" strokeWidth={1.5} />}
                {label}
              </button>
            );
          })}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/50"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
        </Button>

        {trailingActions}
      </div>
    </header>
  );
}
