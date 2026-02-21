'use client';

import { useMemo, useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_CONFIG } from '@/lib/navigation';
import { PANELS } from '@/features/lab/components/editor/chrome/types';
import type { PanelType } from '@/features/lab/components/editor/chrome/types';
import { useLabChromeStore } from '@/features/lab/store/use-lab-chrome-store';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';

/** Editor sidebar panels — the 7 we keep per design spec */
const EDITOR_PANELS = PANELS.filter(
  (p) =>
    ['files', 'variables', 'packages', 'ai', 'errors', 'validation'].includes(
      p.type,
    ) || p.type === 'snippets', // snippets → will become "Data Catalog"
);

const EASE = [0.25, 0.1, 0.25, 1] as const;
const TRANSITION = { duration: 0.55, ease: EASE };

const ICON_SIZE = 40;
const ICON_GAP = 4;

/** Calculate total height for N icons stacked with gap */
function iconsHeight(count: number) {
  return count * ICON_SIZE + (count - 1) * ICON_GAP;
}

type SidebarMode = 'editor' | 'nav';

interface LabCollapsedSidebarProps {
  onHoverChange?: (isHovering: boolean) => void;
  /**
   * 'pill' (default) — glass pill with glass background, used on left side
   * 'strip' — bare icons without glass background, used on right edge when panels are open
   */
  variant?: 'pill' | 'strip';
}

/**
 * Lab-mode sidebar with dual modes and Switch toggle.
 *
 * Two visual variants:
 * - pill: Glass background, left side, full Switch interaction
 * - strip: Bare icons, right edge, editor panels only (no Switch/nav mode)
 *
 * Animation: Both icon sets always in DOM, crossfade with stagger.
 */
export function LabCollapsedSidebar({
  onHoverChange,
  variant = 'pill',
}: LabCollapsedSidebarProps = {}) {
  const pathname = usePathname();

  const selectedPanel = useLabChromeStore((s) => s.selectedPanel);
  const isSidebarOpen = useLabChromeStore((s) => s.isSidebarOpen);
  const openSidebarPanel = useLabChromeStore((s) => s.openSidebarPanel);
  const closeSidebar = useLabChromeStore((s) => s.closeSidebar);
  const togglePanel = useLabChromeStore((s) => s.togglePanel);
  const openPanels = useLabChromeStore((s) => s.openPanels);

  const [mode, setMode] = useState<SidebarMode>('editor');
  const [switchHover, setSwitchHover] = useState(false);

  const navItems = useMemo(() => NAV_CONFIG, []);

  const editorIconsH = iconsHeight(EDITOR_PANELS.length);
  const navIconsH = iconsHeight(navItems.length);
  const targetIconsH = mode === 'editor' ? editorIconsH : navIconsH;

  const isNavActive = useCallback(
    (href: string) => {
      if (href === '/dashboard') return pathname === '/dashboard';
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const handleNavClick = useCallback((href: string) => {
    useLabModeStore.getState().setMode('idle');
    const target = `${window.location.origin}${href}`;
    setTimeout(() => {
      window.location.href = target;
    }, 150);
  }, []);

  const handleEditorPanelClick = useCallback(
    (panelType: PanelType) => {
      togglePanel(panelType);
    },
    [togglePanel],
  );

  const handleSwitchClick = useCallback(() => {
    setMode((prev) => (prev === 'editor' ? 'nav' : 'editor'));
    setSwitchHover(false);
    onHoverChange?.(false);
  }, [onHoverChange]);

  const isEditor = mode === 'editor';
  const isStrip = variant === 'strip';

  // ═══ Strip variant — minimal right-edge icon bar ═══
  if (isStrip) {
    return (
      <div
        data-slot="lab-sidebar-strip"
        className="flex flex-col w-[40px] flex-1 min-h-0 items-center justify-center"
      >
        <div className="flex flex-col items-center gap-1">
          {EDITOR_PANELS.map((panel) => {
            const isSelected = openPanels.includes(panel.type);
            return (
              <button
                key={panel.type}
                type="button"
                onClick={() => handleEditorPanelClick(panel.type)}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-mine-nav-active/10 text-mine-nav-active'
                    : 'text-mine-muted hover:text-mine-text hover:bg-mine-bg',
                )}
                title={panel.tooltip}
                aria-label={panel.tooltip}
              >
                <panel.Icon className="w-4 h-4" strokeWidth={1.5} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══ Pill variant — full glass sidebar ═══
  return (
    <div
      data-slot="lab-sidebar"
      className="flex flex-col w-[52px] flex-1 min-h-0 items-center justify-center relative z-20"
    >
      <div className="relative flex flex-col items-center gap-1 py-1 px-1.5 rounded-full">
        {/* Glass background */}
        <div className="absolute inset-0 rounded-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] pointer-events-none" />

        {/* Icons area — animated height, both sets absolutely positioned */}
        <motion.div
          className="relative w-10 z-10"
          animate={{ height: targetIconsH }}
          transition={TRANSITION}
        >
          {/* Editor panel icons */}
          <motion.div
            className="absolute inset-x-0 top-0 flex flex-col items-center gap-1"
            animate={{
              opacity: isEditor ? (switchHover ? 0.5 : 1) : 0,
              scale: isEditor ? (switchHover ? 0.96 : 1) : 0.85,
            }}
            transition={TRANSITION}
            style={{ pointerEvents: isEditor ? 'auto' : 'none' }}
          >
            {EDITOR_PANELS.map((panel, index) => {
              const isSelected = openPanels.includes(panel.type);
              return (
                <motion.button
                  key={panel.type}
                  type="button"
                  onClick={() => handleEditorPanelClick(panel.type)}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-white ring-2 ring-mine-nav-active text-mine-text shadow-sm'
                      : 'text-mine-text hover:bg-white/80',
                  )}
                  title={panel.tooltip}
                  aria-label={panel.tooltip}
                  animate={{
                    opacity: isEditor ? 1 : 0,
                    y: isEditor ? 0 : -8,
                  }}
                  transition={{
                    ...TRANSITION,
                    delay: isEditor
                      ? index * 0.05
                      : (EDITOR_PANELS.length - 1 - index) * 0.05,
                  }}
                >
                  <panel.Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </motion.button>
              );
            })}
          </motion.div>

          {/* Nav module icons */}
          <motion.div
            className="absolute inset-x-0 top-0 flex flex-col items-center gap-1"
            animate={{
              opacity: !isEditor ? 1 : 0,
              scale: !isEditor ? 1 : 0.85,
            }}
            transition={TRANSITION}
            style={{ pointerEvents: !isEditor ? 'auto' : 'none' }}
          >
            {navItems.map((item, index) => {
              const active = isNavActive(item.href);
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer',
                    active
                      ? 'bg-mine-nav-active text-white shadow-sm'
                      : 'text-mine-text hover:bg-white/80',
                  )}
                  title={item.label}
                  aria-label={item.label}
                  animate={{
                    opacity: !isEditor ? 1 : 0,
                    y: !isEditor ? 0 : 8,
                  }}
                  transition={{
                    ...TRANSITION,
                    delay: !isEditor
                      ? index * 0.05
                      : (navItems.length - 1 - index) * 0.05,
                  }}
                >
                  <item.icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </motion.button>
              );
            })}
          </motion.div>

          {/* Switch hover preview — nav icons blurred behind editor icons */}
          {isEditor && (
            <motion.div
              className="absolute inset-x-0 top-0 flex flex-col items-center justify-center pointer-events-none"
              animate={{
                opacity: switchHover ? 0.25 : 0,
              }}
              transition={{ duration: 0.2, ease: EASE }}
              style={{
                filter: 'blur(2.5px)',
                height: editorIconsH,
              }}
            >
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-center text-mine-text"
                  style={{
                    width: ICON_SIZE,
                    height: editorIconsH / navItems.length,
                  }}
                >
                  <item.icon className="w-[16px] h-[16px]" strokeWidth={1.5} />
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Divider */}
        <div className="relative z-10 w-6 h-px bg-mine-border/60 my-0.5" />

        {/* Switch button */}
        <button
          type="button"
          onClick={handleSwitchClick}
          onMouseEnter={() => setSwitchHover(true)}
          onMouseLeave={() => setSwitchHover(false)}
          className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-mine-muted hover:bg-white/80 hover:text-mine-text transition-colors cursor-pointer"
          title={isEditor ? 'Switch to navigation' : 'Switch to editor panels'}
          aria-label={
            isEditor ? 'Switch to navigation' : 'Switch to editor panels'
          }
        >
          <ArrowLeftRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
