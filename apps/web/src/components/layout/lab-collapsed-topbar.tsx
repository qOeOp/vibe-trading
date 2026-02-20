'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { BookOpen, Menu, Settings, Power, Bell } from 'lucide-react';
import { motion } from 'motion/react';

import { MarketTicker } from '@/components/layout/market-ticker';
import { Button } from '@/components/ui/button';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { useDocModeActions } from '@/features/blueprint/context/doc-mode-context';
import { getModuleByRoute, getActiveTab } from '@/lib/navigation';
import { usePathname } from 'next/navigation';

const EASE = [0.4, 0, 0.2, 1] as const;
const TRANSITION = { duration: 0.3, ease: EASE };
const PILL_SLOT_WIDTH = 50;

interface LabCollapsedTopbarProps {
  onHoverChange?: (isHovering: boolean) => void;
}

/**
 * Lab-mode topbar with anchor-based convergence animation.
 *
 * Layout matches normal TopNavBar: [flex-1: Ticker] [shrink-0: nav + Bell + Blueprint]
 * so that Lab pill stays at the SAME x-position as in normal mode.
 *
 * Editor controls (Menu, Settings, Disconnect) are absolutely positioned
 * INSIDE the nav container, overlaying the space freed by collapsed pills
 * (Backtest + Mining collapse toward Lab → their space becomes available).
 * This avoids adding extra width that would shift the nav left.
 */
export function LabCollapsedTopbar({
  onHoverChange,
}: LabCollapsedTopbarProps = {}) {
  const pathname = usePathname();
  const { toggleDocMode } = useDocModeActions();
  const [isHovering, setIsHovering] = useState(false);
  const labPillRef = useRef<HTMLButtonElement>(null);

  // Hover zone: only trigger nav expansion near Lab pill, not on editor controls
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!labPillRef.current) return;
      const labRect = labPillRef.current.getBoundingClientRect();
      // Nav zone: from left edge of nav to right edge of Lab pill (+ small margin)
      const inNavZone = e.clientX <= labRect.right + 8;
      if (inNavZone && !isHovering) {
        setIsHovering(true);
        onHoverChange?.(true);
      } else if (!inNavZone && isHovering) {
        setIsHovering(false);
        onHoverChange?.(false);
      }
    },
    [isHovering, onHoverChange],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    onHoverChange?.(false);
  }, [onHoverChange]);

  const labNavPills = useMemo(() => {
    const currentModule = getModuleByRoute(pathname);
    if (!currentModule) return [];
    return currentModule.tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      href: tab.href,
    }));
  }, [pathname]);

  const labActiveTabId = useMemo(() => {
    const currentModule = getModuleByRoute(pathname);
    if (!currentModule) return '';
    return getActiveTab(currentModule, pathname) ?? '';
  }, [pathname]);

  const labPillIndex = useMemo(
    () => labNavPills.findIndex((p) => p.id === labActiveTabId),
    [labNavPills, labActiveTabId],
  );

  const collapsed = !isHovering;

  return (
    <header
      data-slot="lab-topbar-zone"
      className="flex items-center h-14 bg-transparent gap-4 pr-4 shrink-0"
    >
      {/* Left: MarketTicker — fades but keeps layout width (same as normal TopNavBar) */}
      <motion.div
        className="flex-1 overflow-hidden min-w-0"
        animate={{ opacity: collapsed ? 0 : 1 }}
        initial={false}
        transition={TRANSITION}
        style={{ pointerEvents: collapsed ? 'none' : 'auto' }}
      >
        <MarketTicker />
      </motion.div>

      {/* Right section — matches normal TopNavBar: [nav] [Bell] [Blueprint] */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Nav container — constant width, editor controls positioned inside */}
        {labNavPills.length > 0 && (
          <div
            className="relative shrink-0"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Pills wrapper: hover zone + overflow clip */}
            <nav
              data-slot="lab-nav"
              className="relative flex items-center gap-1 rounded-full p-1 overflow-hidden"
            >
              {/* Background — opacity-only */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/60 backdrop-blur-sm pointer-events-none"
                animate={{ opacity: collapsed ? 0 : 1 }}
                initial={false}
                transition={TRANSITION}
              />

              {labNavPills.map((pill, index) => {
                const isLab = pill.id === labActiveTabId;
                const distFromLab = index - labPillIndex;
                const collapseX = -distFromLab * PILL_SLOT_WIDTH;

                return (
                  <motion.div
                    key={pill.id}
                    data-testid={isLab ? 'lab-pill-anchor' : undefined}
                    animate={{
                      opacity: isLab ? 1 : collapsed ? 0 : 1,
                      x: isLab ? 0 : collapsed ? collapseX : 0,
                      scale: isLab ? 1 : collapsed ? 0.8 : 1,
                    }}
                    initial={false}
                    transition={{
                      ...TRANSITION,
                      delay: !collapsed ? Math.abs(distFromLab) * 0.02 : 0,
                    }}
                    style={{
                      pointerEvents: !isLab && collapsed ? 'none' : 'auto',
                    }}
                  >
                    <button
                      ref={isLab ? labPillRef : undefined}
                      type="button"
                      className={`relative z-10 flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                        isLab
                          ? 'bg-mine-nav-active text-white shadow-sm'
                          : 'text-mine-text hover:bg-white/50'
                      }`}
                      tabIndex={!isLab && collapsed ? -1 : 0}
                    >
                      {pill.label}
                    </button>
                  </motion.div>
                );
              })}
            </nav>

            {/* Editor controls — absolutely positioned over collapsed pills' space.
                When collapsed: Backtest+Mining move toward Lab, freeing the right side.
                These controls appear in that freed space. When expanded: they fade out. */}
            <motion.div
              className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20"
              animate={{ opacity: collapsed ? 1 : 0 }}
              initial={false}
              transition={TRANSITION}
              style={{ pointerEvents: collapsed ? 'auto' : 'none' }}
            >
              <div className="w-px h-5 bg-mine-border/50" />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/50"
                aria-label="Notebook menu"
              >
                <Menu className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/50"
                aria-label="Editor settings"
              >
                <Settings
                  className="w-4 h-4 text-mine-text"
                  strokeWidth={1.5}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-red-100"
                aria-label="Disconnect"
                onClick={() => useLabModeStore.getState().setMode('idle')}
              >
                <Power
                  className="w-4 h-4 text-mine-accent-red"
                  strokeWidth={1.5}
                />
              </Button>
            </motion.div>
          </div>
        )}

        {/* Bell + Blueprint — always visible, same as normal TopNavBar */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/50"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/50"
          aria-label="Open Blueprint"
          onClick={toggleDocMode}
        >
          <BookOpen className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
        </Button>
      </div>
    </header>
  );
}
