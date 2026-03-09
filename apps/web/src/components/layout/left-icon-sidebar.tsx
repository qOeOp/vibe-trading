'use client';

import type { LucideIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_CONFIG } from '@/lib/navigation';

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  id?: string;
  phase?: string;
  disabled?: boolean;
}

const DEFAULT_SIDEBAR_ITEMS: SidebarItem[] = NAV_CONFIG.map((mod) => ({
  icon: mod.icon,
  label: mod.label,
  id: mod.id,
  href: mod.href,
  phase: mod.phase,
}));

interface LeftIconSidebarProps {
  items?: SidebarItem[];
  onItemClick?: (item: SidebarItem, index: number) => void;
  activeId?: string;
  itemClassName?: (item: SidebarItem, isActive: boolean) => string;
}

export function LeftIconSidebar({
  items,
  onItemClick,
  activeId,
  itemClassName,
}: LeftIconSidebarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const displayItems = items ?? DEFAULT_SIDEBAR_ITEMS;

  const isActive = (item: SidebarItem) => {
    if (activeId !== undefined) return item.id === activeId;
    if (!item.href) return false;
    if (item.href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(item.href);
  };

  const handleClick = (item: SidebarItem, index: number) => {
    if (onItemClick) {
      onItemClick(item, index);
      return;
    }
    if (item.href) router.push(item.href);
  };

  return (
    <div className="flex flex-col w-[52px] flex-1 min-h-0 items-center justify-center">
      <div className="flex flex-col items-center gap-1 py-1 px-1.5 rounded-full glass-heavy max-h-full overflow-y-auto scrollbar-none">
        {displayItems.map((item, index) => {
          const { icon: Icon, label } = item;
          const active = isActive(item);
          const isDisabled =
            item.disabled ?? (!item.href && !onItemClick && !item.id);
          return (
            <button
              type="button"
              key={item.id ?? label}
              disabled={isDisabled}
              onClick={() => handleClick(item, index)}
              className={
                itemClassName
                  ? itemClassName(item, active)
                  : cn(
                      'flex items-center justify-center w-10 h-10 rounded-full transition-all',
                      active
                        ? 'bg-mine-nav-active text-white shadow-sm'
                        : !isDisabled
                          ? 'text-mine-text hover:bg-white/80 cursor-pointer'
                          : 'text-mine-muted/50 cursor-default',
                    )
              }
              title={label}
              aria-label={label}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
