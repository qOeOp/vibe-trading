'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { BookOpen, Menu, Settings, Power, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Button } from '@/components/ui/button';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { useDocModeActions } from '@/features/blueprint/context/doc-mode-context';
import { getModuleByRoute, getActiveTab } from '@/lib/navigation';
import { usePathname, useRouter } from 'next/navigation';

const EASE = [0.25, 0.1, 0.25, 1] as const;
const TRANSITION = { duration: 0.5, ease: EASE };

interface LabCollapsedTopbarProps {
  onHoverChange?: (isHovering: boolean) => void;
}

/**
 * Lab-mode topbar.
 *
 * Layout: [Factor text] [Lab pill → expand nav pills right] ——— [Editor controls] [Bell] [Blueprint]
 *
 * - "Factor" text animates in with blur on mount
 * - Lab pill is the leftmost/anchor pill
 * - Other nav pills expand rightward from Lab on hover
 * - Right section is static and never moves
 */
export function LabCollapsedTopbar({
  onHoverChange,
}: LabCollapsedTopbarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleDocMode } = useDocModeActions();
  const [isHovering, setIsHovering] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

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

  // Lab pill is the active tab
  const labPillIndex = useMemo(
    () => labNavPills.findIndex((p) => p.id === labActiveTabId),
    [labNavPills, labActiveTabId],
  );

  // Split pills: Lab (anchor) + others (expand on hover)
  const labPill = labNavPills[labPillIndex];
  const otherPills = useMemo(
    () => labNavPills.filter((_, i) => i !== labPillIndex),
    [labNavPills, labPillIndex],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    onHoverChange?.(true);
  }, [onHoverChange]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    onHoverChange?.(false);
  }, [onHoverChange]);

  const handleNavClick = useCallback((href: string) => {
    // Disconnect lab first — marimo editor intercepts pushState
    useLabModeStore.getState().setMode('idle');
    const target = `${window.location.origin}${href}`;
    setTimeout(() => {
      window.location.href = target;
    }, 150);
  }, []);

  return (
    <header
      data-slot="lab-topbar"
      className="flex items-center h-14 bg-transparent gap-4 px-4 shrink-0"
    >
      {/* Left section: "Factor" text + nav pills */}
      <div className="flex items-center gap-3 min-w-0">
        {/* "Factor" module label — blurIn on mount */}
        <motion.span
          data-slot="lab-topbar-module-label"
          className="text-base font-bold text-mine-text whitespace-nowrap select-none"
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          Factor
        </motion.span>

        {/* Nav pills container */}
        {labPill && (
          <div
            ref={navRef}
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <nav
              data-slot="lab-nav"
              className="relative flex items-center gap-1 rounded-full p-1"
            >
              {/* Glass background — visible when hovering (pills expanded) */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/60 backdrop-blur-sm pointer-events-none"
                animate={{ opacity: isHovering ? 1 : 0 }}
                initial={false}
                transition={TRANSITION}
              />

              {/* Lab pill — always visible, anchor position */}
              <button
                type="button"
                className="relative z-10 flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full bg-mine-nav-active text-white shadow-sm whitespace-nowrap"
                data-testid="lab-pill-anchor"
              >
                {labPill.label}
              </button>

              {/* Other pills — expand rightward on hover */}
              <AnimatePresence>
                {isHovering &&
                  otherPills.map((pill, index) => (
                    <motion.div
                      key={pill.id}
                      initial={{ opacity: 0, width: 0, scale: 0.8 }}
                      animate={{ opacity: 1, width: 'auto', scale: 1 }}
                      exit={{ opacity: 0, width: 0, scale: 0.8 }}
                      transition={{
                        ...TRANSITION,
                        delay: index * 0.06,
                      }}
                      className="relative z-10 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => handleNavClick(pill.href)}
                        className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full text-mine-text hover:bg-white/50 whitespace-nowrap transition-colors"
                      >
                        {pill.label}
                      </button>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </nav>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section: Editor controls + Bell + Blueprint — always visible */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Editor controls */}
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
          <Settings className="w-4 h-4 text-mine-text" strokeWidth={1.5} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-red-100"
          aria-label="Disconnect"
          onClick={() => useLabModeStore.getState().setMode('idle')}
        >
          <Power className="w-4 h-4 text-mine-accent-red" strokeWidth={1.5} />
        </Button>

        {/* Divider */}
        <div className="w-px h-5 bg-mine-border/50 mx-1" />

        {/* Bell + Blueprint */}
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
