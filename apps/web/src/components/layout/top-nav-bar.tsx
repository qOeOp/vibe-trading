'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { getModuleByRoute, getActiveTab } from '@/lib/navigation';
import { MarketTicker } from './market-ticker';
import { useTopBarExtraNavItems } from './top-bar-slot';

export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  disabled?: boolean;
}

interface TopNavBarProps {
  /** Replace left area (default: MarketTicker) */
  leftSlot?: ReactNode;
  /** Fully override nav pills. When set, module tabs & extras are ignored. */
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
  const extraNavItems = useTopBarExtraNavItems();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = useCallback(
    (item: NavItem, index: number) => {
      if (onNavClick) {
        onNavClick(item, index);
        return;
      }
      if (item.href) {
        router.push(item.href);
      }
    },
    [onNavClick, router],
  );

  // Build nav items from current module's tabs + any extra injected items
  const computedNavItems = useMemo(() => {
    const currentModule = getModuleByRoute(pathname);
    if (!currentModule) return [];

    // Module's own tabs
    const moduleTabs: NavItem[] = currentModule.tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      href: tab.href,
    }));

    // Merge extra items from page-level context (dedup by id)
    if (extraNavItems.length === 0) return moduleTabs;

    const result = [...moduleTabs];
    for (const extra of extraNavItems) {
      if (result.some((item) => item.id === extra.id)) continue;
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
    if (item.href && pathname === item.href) return true;
    // Fallback: check if this is the module's active tab
    const currentModule = getModuleByRoute(pathname);
    if (currentModule) {
      return item.id === getActiveTab(currentModule, pathname);
    }
    return false;
  };

  return (
    <header className="flex items-center h-14 bg-transparent gap-4 pr-4 shrink-0">
      {/* Left: MarketTicker or custom slot */}
      <div className="flex-1 overflow-hidden">
        {leftSlot ?? <MarketTicker />}
      </div>

      {/* Right: nav pills + actions */}
      <div className="flex items-center gap-4 shrink-0">
        {displayNavItems.length > 0 && (
          <nav className="flex items-center gap-0.5 bg-white/60 backdrop-blur-sm rounded-full p-1 border border-white/40">
            {displayNavItems.map((item, index) => {
              const { id, label, icon: Icon } = item;
              const active = isItemActive(item);
              return (
                <button
                  type="button"
                  key={id}
                  disabled={item.disabled}
                  onClick={() => !item.disabled && handleNavClick(item, index)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                    active
                      ? 'bg-mine-nav-active text-white shadow-sm'
                      : item.disabled
                        ? 'text-mine-muted/50 cursor-default'
                        : 'text-mine-text hover:bg-white/50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" strokeWidth={1.5} />}
                  {label}
                </button>
              );
            })}
          </nav>
        )}

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
