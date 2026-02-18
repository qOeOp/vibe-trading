"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import type { ReactNode } from "react";
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

  // Memoize items based on their IDs to prevent unnecessary effect triggers
  // and ensure the effect only runs when the actual navigation items change.
  const stableItems = useMemo(
    () => items,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.map((i) => i.id).join(",")],
  );

  useEffect(() => {
    setExtraNavItems(stableItems);
    return () => setExtraNavItems([]);
  }, [stableItems, setExtraNavItems]);
}
