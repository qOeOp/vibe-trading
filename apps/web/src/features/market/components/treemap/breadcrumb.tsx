"use client";

import { memo, useCallback, KeyboardEvent } from "react";
import { ChevronRight, Home } from "lucide-react";

// ============ Types ============

export interface BreadcrumbItem {
  id: string;
  name: string;
  level: number;
  /** Data snapshot at this breadcrumb level for navigation */
  data?: unknown[];
}

interface BreadcrumbProps {
  /** Array of breadcrumb items representing the navigation path */
  items: BreadcrumbItem[];
  /** Callback when a breadcrumb item is clicked */
  onNavigate: (item: BreadcrumbItem, index: number) => void;
  /** Optional className for styling */
  className?: string;
}

// ============ Constants ============

const LEVEL_LABELS: Record<number, string> = {
  0: "全部板块",
  1: "一级行业",
  2: "二级行业",
  3: "三级行业",
  4: "个股",
};

// ============ Component ============

export const Breadcrumb = memo(function Breadcrumb({
  items,
  onNavigate,
  className = "",
}: BreadcrumbProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, item: BreadcrumbItem, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onNavigate(item, index);
      }
    },
    [onNavigate]
  );

  // If no items, show root
  if (items.length === 0) {
    return (
      <nav
        className={`flex items-center gap-1 text-sm ${className}`}
        aria-label="Breadcrumb navigation"
      >
        <span className="flex items-center gap-1 text-mine-text font-medium">
          <Home className="w-4 h-4" />
          <span>{LEVEL_LABELS[1]}</span>
        </span>
      </nav>
    );
  }

  return (
    <nav
      className={`flex items-center gap-1 text-sm ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center gap-1 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const levelLabel = LEVEL_LABELS[item.level] || item.name;

          return (
            <li key={item.id} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-mine-muted" aria-hidden="true" />
              )}

              {isLast ? (
                // Current page (not clickable)
                <span
                  className="flex items-center gap-1 text-mine-text font-medium"
                  aria-current="page"
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  <span>{item.name || levelLabel}</span>
                </span>
              ) : (
                // Clickable breadcrumb
                <button
                  type="button"
                  className="flex items-center gap-1 text-mine-muted hover:text-mine-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded px-1 -mx-1"
                  onClick={() => onNavigate(item, index)}
                  onKeyDown={(e) => handleKeyDown(e, item, index)}
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  <span className="hover:underline">{item.name || levelLabel}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

// ============ Utility Functions ============

/**
 * Create initial breadcrumb with root item
 */
export function createInitialBreadcrumb(): BreadcrumbItem[] {
  return [
    {
      id: "root",
      name: "一级行业",
      level: 1,
    },
  ];
}

/**
 * Add an item to breadcrumb path
 */
export function addBreadcrumbItem(
  current: BreadcrumbItem[],
  item: BreadcrumbItem
): BreadcrumbItem[] {
  return [...current, item];
}

/**
 * Navigate to a specific breadcrumb index
 */
export function navigateToBreadcrumb(
  current: BreadcrumbItem[],
  index: number
): BreadcrumbItem[] {
  return current.slice(0, index + 1);
}
