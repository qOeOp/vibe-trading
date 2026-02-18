"use client";

import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";
import type { SidebarPanel } from "../../types";
import {
  Database,
  Code2,
  Package,
  Terminal,
} from "lucide-react";

interface IconBarItem {
  panel: NonNullable<SidebarPanel>;
  icon: typeof Database;
  label: string;
}

const ICON_BAR_ITEMS: IconBarItem[] = [
  { panel: "data", icon: Database, label: "数据字典" },
  { panel: "snippets", icon: Code2, label: "代码片段" },
  { panel: "variables", icon: Package, label: "变量检查器" },
  { panel: "console", icon: Terminal, label: "Console" },
];

/**
 * RightIconBar — Narrow vertical icon strip on the far right
 *
 * Each icon toggles an overlay panel that covers the permanent
 * AI/results panel area. Active panel icon is highlighted.
 */
export function RightIconBar() {
  const sidebarPanel = useLabCellStore((s) => s.sidebarPanel);
  const toggleSidebarPanel = useLabCellStore((s) => s.toggleSidebarPanel);

  return (
    <div
      data-slot="right-icon-bar"
      className={cn(
        "flex flex-col items-center gap-1 py-3 px-1.5",
      )}
    >
      {ICON_BAR_ITEMS.map(({ panel, icon: Icon, label }) => {
        const isActive = sidebarPanel === panel;

        return (
          <button
            key={panel}
            type="button"
            onClick={() => toggleSidebarPanel(panel)}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              "transition-all duration-150",
              isActive
                ? "bg-mine-nav-active text-white shadow-sm"
                : "text-mine-muted hover:text-mine-text hover:bg-white/80",
            )}
            title={label}
            aria-label={label}
            aria-pressed={isActive}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
