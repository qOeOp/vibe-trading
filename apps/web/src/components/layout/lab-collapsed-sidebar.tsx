'use client';

import { useMemo, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { NAV_CONFIG } from '@/lib/navigation';
import { PANELS } from '@/features/lab/components/editor/chrome/types';
import type { PanelType } from '@/features/lab/components/editor/chrome/types';
import { useLabChromeStore } from '@/features/lab/store/use-lab-chrome-store';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';

/** Editor sidebar panels shown when collapsed */
const EDITOR_SIDEBAR_PANELS = PANELS.filter(
  (p) => p.defaultSection === 'sidebar' && !p.hidden,
);

const FACTOR_ID = 'factor';
const ITEM_SIZE = 40;
const GAP = 4;
const ITEM_SPACING = ITEM_SIZE + GAP;

const EASE = [0.4, 0, 0.2, 1] as const;
const TRANSITION = { duration: 0.3, ease: EASE };

interface LabCollapsedSidebarProps {
  onHoverChange?: (isHovering: boolean) => void;
}

/**
 * Lab-mode sidebar with anchor-based convergence animation.
 *
 * Architecture:
 * - All 11 nav items always in DOM inside a bar (constant height).
 * - Bar background: separate layer, animated via opacity (no backdrop-filter toggle).
 * - Factor: plain div, no motion — NEVER moves.
 * - Other items: y-transform toward Factor + opacity fade.
 * - Editor icons: absolutely positioned above Factor.
 * - Nav container overflow: hidden — prevents animation bleed.
 */
export function LabCollapsedSidebar({
  onHoverChange,
}: LabCollapsedSidebarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const selectedPanel = useLabChromeStore((s) => s.selectedPanel);
  const isSidebarOpen = useLabChromeStore((s) => s.isSidebarOpen);
  const openSidebarPanel = useLabChromeStore((s) => s.openSidebarPanel);
  const closeSidebar = useLabChromeStore((s) => s.closeSidebar);

  const [isHovering, setIsHovering] = useState(false);

  const navItems = useMemo(() => NAV_CONFIG, []);
  const factorIndex = useMemo(
    () => navItems.findIndex((n) => n.id === FACTOR_ID),
    [navItems],
  );

  // ── Measure Factor Y for editor icons positioning ──
  const factorRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorIconsTop, setEditorIconsTop] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!factorRef.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const factorRect = factorRef.current.getBoundingClientRect();
    setEditorIconsTop(factorRect.top - containerRect.top - GAP);
  }, []); // Measure once on mount — Factor position is constant

  const isNavActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const handleNavClick = useCallback((href: string) => {
    // Disconnect lab first — marimo editor intercepts pushState with its own origin,
    // causing cross-origin errors. Setting mode to 'idle' unmounts the editor.
    useLabModeStore.getState().setMode('idle');
    // Delay navigation to let React unmount the marimo editor tree,
    // which removes its history/routing interception
    const target = `${window.location.origin}${href}`;
    setTimeout(() => {
      window.location.href = target;
    }, 150);
  }, []);

  const handleEditorPanelClick = useCallback(
    (panelType: PanelType) => {
      if (isSidebarOpen && selectedPanel === panelType) {
        closeSidebar();
      } else {
        openSidebarPanel(panelType);
      }
    },
    [isSidebarOpen, selectedPanel, closeSidebar, openSidebarPanel],
  );

  // ── Hover zone: only trigger nav expansion near Factor, not on editor icons ──
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!factorRef.current) return;
      const factorRect = factorRef.current.getBoundingClientRect();
      // Nav zone: from one item-spacing above Factor to bottom of container
      const inNavZone = e.clientY >= factorRect.top - ITEM_SPACING;
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

  return (
    <div
      ref={containerRef}
      data-slot="lab-sidebar"
      className="flex flex-col w-[52px] flex-1 min-h-0 items-center justify-center relative z-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ═══ Nav items bar ═══ */}
      <div className="relative flex flex-col items-center gap-1 py-1 px-1.5 rounded-full">
        {/* Background layer — fades via opacity, no layout/filter toggle */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] pointer-events-none"
          animate={{ opacity: isHovering ? 1 : 0 }}
          initial={false}
          transition={TRANSITION}
        />

        {navItems.map((item, index) => {
          const isFactor = item.id === FACTOR_ID;
          const active = isFactor || isNavActive(item.href);
          const distFromFactor = index - factorIndex;

          // Factor: plain div, no animation — position is constant
          if (isFactor) {
            return (
              <div key={item.id} className="relative z-10">
                <button
                  ref={factorRef}
                  type="button"
                  data-testid="factor-anchor"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-mine-nav-active text-white shadow-sm"
                  title={item.label}
                  aria-label={item.label}
                >
                  <item.icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>
            );
          }

          const collapseY = -distFromFactor * ITEM_SPACING;

          return (
            <motion.div
              key={item.id}
              className="relative z-10"
              animate={
                isHovering
                  ? { y: 0, opacity: 1, scale: 1 }
                  : { y: collapseY, opacity: 0, scale: 0.5 }
              }
              initial={false}
              transition={{
                ...TRANSITION,
                delay: isHovering ? Math.abs(distFromFactor) * 0.02 : 0,
              }}
              style={{ pointerEvents: isHovering ? 'auto' : 'none' }}
            >
              <button
                type="button"
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full transition-all',
                  active
                    ? 'bg-mine-nav-active text-white shadow-sm'
                    : 'text-mine-text hover:bg-white/80 cursor-pointer',
                )}
                title={item.label}
                aria-label={item.label}
                tabIndex={isHovering ? 0 : -1}
              >
                <item.icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ Editor icons + divider: absolutely positioned above Factor ═══ */}
      <AnimatePresence>
        {!isHovering && editorIconsTop !== null && (
          <motion.div
            key="editor-icons"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30"
            style={{
              top:
                editorIconsTop -
                EDITOR_SIDEBAR_PANELS.length * ITEM_SPACING -
                ITEM_SPACING +
                GAP,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE, delay: 0.15 }}
          >
            {EDITOR_SIDEBAR_PANELS.map((panel) => {
              const isSelected = isSidebarOpen && selectedPanel === panel.type;
              return (
                <button
                  key={panel.type}
                  type="button"
                  onClick={() => handleEditorPanelClick(panel.type)}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full transition-colors',
                    isSelected
                      ? 'bg-white ring-2 ring-mine-nav-active text-mine-text shadow-sm'
                      : 'bg-white text-mine-text shadow-sm hover:bg-white/90 cursor-pointer',
                  )}
                  title={panel.tooltip}
                  aria-label={panel.tooltip}
                >
                  <panel.Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Divider between editor icons and Factor ═══ */}
      <AnimatePresence>
        {!isHovering && editorIconsTop !== null && (
          <motion.div
            key="editor-divider"
            className="absolute left-1/2 -translate-x-1/2 z-30"
            style={{ top: editorIconsTop - ITEM_SPACING / 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE, delay: 0.15 }}
          >
            <div className="w-6 h-px bg-mine-border/60" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
