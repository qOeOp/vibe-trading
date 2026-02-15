"use client";

import { useMemo, useCallback } from "react";
import { BookOpen, X } from "lucide-react";

import { TopNavBar } from "@/components/layout/top-nav-bar";
import type { NavItem } from "@/components/layout/top-nav-bar";
import { LeftIconSidebar } from "@/components/layout/left-icon-sidebar";
import type { SidebarItem } from "@/components/layout/left-icon-sidebar";
import { UserCapsule } from "@/components/layout/user-capsule";
import { PageTransition } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";

import {
  useDocModeState,
  useDocModeActions,
} from "../context/doc-mode-context";
import { MODULES, PHASE_COLOR } from "../data/modules";
import { DocContent } from "./doc-content";

/**
 * Shell that replaces the normal layout content when doc mode is active.
 * Uses the exact same LeftIconSidebar + TopNavBar components, just with
 * different items/tabs passed through props.
 */
export function DocModeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { docMode, activeModule, activeTab } = useDocModeState();
  const { toggleDocMode, setActiveModule, setActiveTab } = useDocModeActions();

  // Build sidebar items from Blueprint MODULES
  const docSidebarItems: SidebarItem[] = useMemo(
    () =>
      MODULES.map((m) => ({
        icon: m.icon,
        label: m.label,
        id: m.id,
        phase: m.phase,
      })),
    [],
  );

  // Build nav pills from the active module's topbar tabs
  const docNavItems: NavItem[] = useMemo(() => {
    const mod = MODULES.find((m) => m.id === activeModule);
    if (!mod) return [];
    return mod.topbar.map((tab, i) => ({
      id: `tab-${i}`,
      label: tab,
    }));
  }, [activeModule]);

  const activeTabId = `tab-${activeTab}`;

  const handleSidebarClick = useCallback(
    (item: SidebarItem) => {
      if (item.id) setActiveModule(item.id);
    },
    [setActiveModule],
  );

  const handleNavClick = useCallback(
    (item: NavItem) => {
      const idx = parseInt(item.id.replace("tab-", ""), 10);
      if (!isNaN(idx)) setActiveTab(idx);
    },
    [setActiveTab],
  );

  // Custom sidebar item styling with phase color indicator
  const sidebarItemClass = useCallback(
    (item: SidebarItem, isActive: boolean) => {
      const base =
        "flex items-center justify-center w-10 h-10 rounded-full transition-all";
      if (isActive) return `${base} bg-mine-nav-active text-white shadow-sm`;
      return `${base} text-mine-text hover:bg-white/80 cursor-pointer`;
    },
    [],
  );

  // Toggle button for TopNavBar trailing actions
  const docToggleButton = (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-white/50"
      aria-label={docMode ? "Exit Blueprint" : "Open Blueprint"}
      onClick={toggleDocMode}
    >
      {docMode ? (
        <X className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
      ) : (
        <BookOpen className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
      )}
    </Button>
  );

  // Doc mode title for the left slot
  const docLeftSlot = (
    <div className="flex items-center gap-2 px-4">
      <BookOpen className="w-4 h-4 text-mine-accent-teal" strokeWidth={1.5} />
      <span className="text-sm font-semibold text-mine-text">Blueprint</span>
      <span className="text-xs text-mine-muted">
        {MODULES.find((m) => m.id === activeModule)?.workflow}
      </span>
    </div>
  );

  if (!docMode) {
    // Normal mode: use default sidebar + nav, just add the toggle button
    return (
      <div className="h-screen w-screen min-w-0 bg-mine-page-bg flex">
        <div className="flex flex-col items-center pt-3 pb-4 px-3 gap-3 shrink-0 min-h-0">
          <UserCapsule />
          <LeftIconSidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavBar trailingActions={docToggleButton} />
          <div className="flex-1 flex gap-4 pr-4 pb-4 overflow-hidden">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </div>
    );
  }

  // Doc mode: same skeleton, different data
  return (
    <div className="h-screen w-screen min-w-0 bg-mine-page-bg flex">
      <div className="flex flex-col items-center pt-3 pb-4 px-3 gap-3 shrink-0 min-h-0">
        <UserCapsule />
        <LeftIconSidebar
          items={docSidebarItems}
          onItemClick={handleSidebarClick}
          activeId={activeModule}
          itemClassName={sidebarItemClass}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBar
          leftSlot={docLeftSlot}
          navItems={docNavItems}
          onNavClick={handleNavClick}
          activeNavId={activeTabId}
          trailingActions={docToggleButton}
        />
        <div className="flex-1 flex gap-4 pr-4 pb-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <DocContent />
          </div>
        </div>
      </div>
    </div>
  );
}
