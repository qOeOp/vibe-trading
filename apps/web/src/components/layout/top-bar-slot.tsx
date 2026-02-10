"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";

export interface TopBarNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Insert after this existing nav id. If omitted, appended at end. */
  afterId?: string;
  /** Optional route to navigate to when clicked. */
  href?: string;
}

interface TopBarSlotContextValue {
  extraNavItems: TopBarNavItem[];
  setExtraNavItems: (items: TopBarNavItem[]) => void;
}

const TopBarSlotContext = createContext<TopBarSlotContextValue>({
  extraNavItems: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setExtraNavItems: () => {},
});

export function TopBarSlotProvider({ children }: { children: ReactNode }) {
  const [extraNavItems, setExtraNavItems] = useState<TopBarNavItem[]>([]);

  return (
    <TopBarSlotContext.Provider value={{ extraNavItems, setExtraNavItems }}>
      {children}
    </TopBarSlotContext.Provider>
  );
}

/** Read extra nav items (used by TopNavBar) */
export function useTopBarExtraNavItems(): TopBarNavItem[] {
  return useContext(TopBarSlotContext).extraNavItems;
}

/**
 * Inject extra nav items into the top bar. Cleans up on unmount.
 * Pages use this to add route-specific tabs to the shared nav pill.
 */
export function useSetTopBarNavItems(items: TopBarNavItem[]): void {
  const { setExtraNavItems } = useContext(TopBarSlotContext);
  const prevRef = useRef<TopBarNavItem[]>([]);

  const changed =
    items.length !== prevRef.current.length ||
    items.some((item, i) => item.id !== prevRef.current[i]?.id);
  if (changed) {
    prevRef.current = items;
  }
  const stableItems = prevRef.current;

  useEffect(() => {
    setExtraNavItems(stableItems);
    return () => setExtraNavItems([]);
  }, [stableItems, setExtraNavItems]);
}
