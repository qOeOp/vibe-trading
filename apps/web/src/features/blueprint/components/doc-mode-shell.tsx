'use client';

import { useMemo, useCallback, useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { motion } from 'motion/react';

import { TopNavBar } from '@/components/layout/top-nav-bar';
import type { NavItem } from '@/components/layout/top-nav-bar';
import { LeftIconSidebar } from '@/components/layout/left-icon-sidebar';
import type { SidebarItem } from '@/components/layout/left-icon-sidebar';
import { UserCapsule } from '@/components/layout/user-capsule';
import { PageTransition } from '@/components/layout/page-transition';
import { LabCollapsedSidebar } from '@/components/layout/lab-collapsed-sidebar';
import { LabCollapsedTopbar } from '@/components/layout/lab-collapsed-topbar';
import { Button } from '@/components/ui/button';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';

import {
  useDocModeState,
  useDocModeActions,
} from '../context/doc-mode-context';
import { MODULES } from '../data/modules';
import { DocContent } from './doc-content';

const TRANSITION = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

/**
 * Root layout shell with three modes:
 * - Normal: standard sidebar + topbar + content
 * - Doc: blueprint sidebar + topbar + doc content (early return)
 * - Lab: collapsed sidebar + collapsed topbar + editor content
 *
 * Normal and Lab share the same React tree so {children} never remount.
 */
export function DocModeShell({ children }: { children: React.ReactNode }) {
  const { docMode, activeModule, activeTab } = useDocModeState();
  const { toggleDocMode, setActiveModule, setActiveTab } = useDocModeActions();
  const labMode = useLabModeStore((s) => s.mode);
  const isLabActive = labMode === 'active';

  // Hover state from sidebar/topbar — controls UserCapsule visibility in lab mode
  const [sidebarHover, setSidebarHover] = useState(false);
  const [topbarHover, setTopbarHover] = useState(false);
  const showUserCapsule = sidebarHover || topbarHover;

  // ── Doc mode data ──
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

  const docNavItems: NavItem[] = useMemo(() => {
    const mod = MODULES.find((m) => m.id === activeModule);
    if (!mod) return [];
    return mod.topbar.map((tab, i) => ({
      id: `tab-${i}`,
      label: tab,
    }));
  }, [activeModule]);

  const handleSidebarClick = useCallback(
    (item: SidebarItem) => {
      if (item.id) setActiveModule(item.id);
    },
    [setActiveModule],
  );

  const handleNavClick = useCallback(
    (item: NavItem) => {
      const idx = parseInt(item.id.replace('tab-', ''), 10);
      if (!isNaN(idx)) setActiveTab(idx);
    },
    [setActiveTab],
  );

  const sidebarItemClass = useCallback(
    (_item: SidebarItem, isActive: boolean) => {
      const base =
        'flex items-center justify-center w-10 h-10 rounded-full transition-all';
      if (isActive) return `${base} bg-mine-nav-active text-white shadow-sm`;
      return `${base} text-mine-text hover:bg-white/80 cursor-pointer`;
    },
    [],
  );

  const docToggleButton = (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-white/50"
      aria-label={docMode ? 'Exit Blueprint' : 'Open Blueprint'}
      onClick={toggleDocMode}
    >
      {docMode ? (
        <X className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
      ) : (
        <BookOpen className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
      )}
    </Button>
  );

  // ── Doc mode: early return ──
  if (docMode) {
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
            leftSlot={
              <div className="flex items-center gap-2 px-4">
                <BookOpen
                  className="w-4 h-4 text-mine-accent-teal"
                  strokeWidth={1.5}
                />
                <span className="text-sm font-semibold text-mine-text">
                  Blueprint
                </span>
                <span className="text-xs text-mine-muted">
                  {MODULES.find((m) => m.id === activeModule)?.workflow}
                </span>
              </div>
            }
            navItems={docNavItems}
            onNavClick={handleNavClick}
            activeNavId={`tab-${activeTab}`}
            trailingActions={docToggleButton}
          />
          <div className="flex-1 flex gap-4 pr-4 pb-4 overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              <DocContent />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal + Lab: unified tree (children never remount) ──
  return (
    <div className="h-screen w-screen min-w-0 bg-mine-page-bg flex">
      {/* ═══ Sidebar column ═══
          - z-20 ensures sidebar renders above editor content (helperPanel, etc.)
          - w-[52px] in lab mode for collapsed sidebar
       */}
      <div
        className={
          isLabActive
            ? 'flex flex-col items-center pt-3 pb-4 px-3 gap-3 shrink-0 min-h-0 relative z-20'
            : 'flex flex-col items-center pt-3 pb-4 px-3 gap-3 shrink-0 min-h-0'
        }
      >
        {isLabActive ? (
          <>
            {/* Invisible spacer matching UserCapsule height so justify-center
                produces the same Factor Y as normal mode */}
            <div className="h-8 shrink-0" />
            {/* UserCapsule: absolutely positioned so it never affects layout */}
            <motion.div
              className="absolute top-3 left-1/2 -translate-x-1/2 z-40"
              animate={{ opacity: showUserCapsule ? 1 : 0 }}
              initial={false}
              transition={TRANSITION}
              style={{ pointerEvents: showUserCapsule ? 'auto' : 'none' }}
            >
              <UserCapsule />
            </motion.div>
            <LabCollapsedSidebar onHoverChange={setSidebarHover} />
          </>
        ) : (
          <>
            <UserCapsule />
            <LeftIconSidebar />
          </>
        )}
      </div>

      {/* ═══ Main column ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        {isLabActive ? (
          <LabCollapsedTopbar onHoverChange={setTopbarHover} />
        ) : (
          <TopNavBar trailingActions={docToggleButton} />
        )}

        {/* Content — ALWAYS at same tree position */}
        <div
          className={
            isLabActive
              ? 'flex-1 flex overflow-hidden'
              : 'flex-1 flex gap-4 pr-4 pb-4 overflow-hidden'
          }
        >
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}
