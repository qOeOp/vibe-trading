'use client';

import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getPanelDef } from './panels';
import {
  PanelFrame,
  PanelFrameHeader,
  PanelFrameBody,
} from '@/components/shared/panel';
import { PanelContent, getPanelHeaderRight } from './panel-content';

// ─── Panel Slot ──────────────────────────────────────────
//
// Unified animated shell for all three panel positions.
// Left/right: width animation + PanelFrame (gray card + header + white body).
// Bottom: height animation + AnimatePresence for panel switching.
//   - Terminal: mount-once (preserves WS).
//   - Other bottom panels (Logs): PanelFrame.
// All slots support drag-to-resize via edge handles.

const LazyTerminal = lazy(() => import('../terminal/terminal'));

const PANEL_EASE = [0.25, 0.1, 0.25, 1] as const;
const PANEL_DURATION = 0.25;

// ─── Resize Handle ───────────────────────────────────────

type ResizeEdge = 'left' | 'right' | 'top';

function ResizeHandle({
  edge,
  onResize,
}: {
  edge: ResizeEdge;
  onResize: (delta: number) => void;
}) {
  const dragging = useRef(false);
  const lastPos = useRef(0);

  const isVertical = edge === 'top';
  const cursor = isVertical ? 'cursor-row-resize' : 'cursor-col-resize';

  const positionCls =
    edge === 'left'
      ? 'left-0 top-0 bottom-0 w-1'
      : edge === 'right'
        ? 'right-0 top-0 bottom-0 w-1'
        : 'left-0 right-0 top-0 h-1';

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      lastPos.current = isVertical ? e.clientY : e.clientX;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isVertical],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const current = isVertical ? e.clientY : e.clientX;
      const delta = current - lastPos.current;
      lastPos.current = current;
      onResize(delta);
    },
    [isVertical, onResize],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  return (
    <div
      data-slot="resize-handle"
      className={`absolute ${positionCls} ${cursor} z-10 hover:bg-mine-accent-teal/20 active:bg-mine-accent-teal/30 transition-colors`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}

// ─── PanelSlot ───────────────────────────────────────────

type PanelSlotProps = {
  side: 'left' | 'right' | 'bottom';
  panelId: string | null;
  isConnected: boolean;
  onClose?: () => void;
};

function PanelSlot({ side, panelId, isConnected, onClose }: PanelSlotProps) {
  if (side === 'bottom') {
    return (
      <BottomSlot
        panelId={panelId}
        isConnected={isConnected}
        onClose={onClose}
      />
    );
  }

  return (
    <SideSlot
      side={side}
      panelId={panelId}
      isConnected={isConnected}
      onClose={onClose}
    />
  );
}

// ─── Side Slot (left / right) ────────────────────────────

const MIN_SIDE_WIDTH = 180;
const MAX_SIDE_WIDTH = 700;

function SideSlot({
  side = 'left',
  panelId,
  isConnected,
  onClose,
}: Omit<PanelSlotProps, 'side'> & { side?: 'left' | 'right' }) {
  const def = panelId ? getPanelDef(panelId) : null;
  const defaultWidth = typeof def?.size === 'number' ? def.size : 280;
  const [width, setWidth] = useState(defaultWidth);

  const minWidth = def?.minSize ?? MIN_SIDE_WIDTH;

  const handleResize = useCallback(
    (delta: number) => {
      setWidth((w) => {
        // Left sidebar: drag right edge → positive delta = wider
        // Right sidebar: drag left edge → positive delta = narrower
        const adjusted = side === 'right' ? w - delta : w + delta;
        return Math.min(MAX_SIDE_WIDTH, Math.max(minWidth, adjusted));
      });
    },
    [side, minWidth],
  );

  // Reset width when panel changes
  const prevPanelRef = useRef(panelId);
  if (panelId !== prevPanelRef.current) {
    prevPanelRef.current = panelId;
    const newDefault = panelId
      ? typeof getPanelDef(panelId)?.size === 'number'
        ? (getPanelDef(panelId)!.size as number)
        : 280
      : 280;
    setWidth(newDefault);
  }

  return (
    <AnimatePresence mode="wait">
      {panelId && def && (
        <motion.div
          key={panelId}
          data-slot="panel-slot"
          className="shrink-0 h-full overflow-hidden relative"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: PANEL_DURATION, ease: PANEL_EASE }}
        >
          <PanelFrame className="h-full">
            <PanelFrameHeader
              title={def.label}
              onClose={onClose}
              actions={getPanelHeaderRight(panelId, isConnected)}
            />
            <PanelFrameBody className="overflow-y-auto flex flex-col">
              <PanelContent panelId={panelId} isConnected={isConnected} />
            </PanelFrameBody>
          </PanelFrame>

          {/* Resize handle on the appropriate edge */}
          <ResizeHandle
            edge={side === 'left' ? 'right' : 'left'}
            onResize={handleResize}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Bottom Slot ─────────────────────────────────────────
// Bottom panels animate height open/close. Panel switching uses
// AnimatePresence for cross-fade. Terminal is mount-once (WS alive).
// Non-terminal panels (Logs, etc.) get white ContentFrame.

const MIN_BOTTOM_HEIGHT = 100;
const MAX_BOTTOM_RATIO = 0.6;

const BOTTOM_HEIGHT_KEY = 'vt-lab-bottom-height';

function readPersistedHeight(): number | null {
  try {
    const v = localStorage.getItem(BOTTOM_HEIGHT_KEY);
    if (v) {
      const n = Number(v);
      if (Number.isFinite(n) && n >= MIN_BOTTOM_HEIGHT) return n;
    }
  } catch {
    /* SSR / privacy mode */
  }
  return null;
}

function persistHeight(px: number) {
  try {
    localStorage.setItem(BOTTOM_HEIGHT_KEY, String(Math.round(px)));
  } catch {
    /* ignore */
  }
}

function BottomSlot({
  panelId,
  isConnected,
  onClose,
}: Omit<PanelSlotProps, 'side'>) {
  // Mount-once: keep terminal alive after first open
  const terminalMountedRef = useRef(false);
  if (panelId === 'terminal') terminalMountedRef.current = true;

  const [heightPx, setHeightPx] = useState<number | null>(() =>
    readPersistedHeight(),
  );

  const handleResize = useCallback((delta: number) => {
    setHeightPx((prev) => {
      const current = prev ?? window.innerHeight * 0.4;
      const next = current - delta;
      const maxH = window.innerHeight * MAX_BOTTOM_RATIO;
      const clamped = Math.min(maxH, Math.max(MIN_BOTTOM_HEIGHT, next));
      persistHeight(clamped);
      return clamped;
    });
  }, []);

  const isOpen = panelId !== null;
  const isTerminal = panelId === 'terminal';
  const def = panelId ? getPanelDef(panelId) : null;
  const heightValue = heightPx ? `${heightPx}px` : '40%';

  // Nothing to render if neither terminal was ever opened nor a panel is active
  if (!isOpen && !terminalMountedRef.current) return null;

  return (
    <motion.div
      data-slot="panel-slot-bottom"
      className="shrink-0 mx-1.5 overflow-hidden rounded-xl relative flex flex-col shadow-lg"
      initial={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0 }}
      animate={
        isOpen
          ? { height: heightValue, opacity: 1, marginTop: 6, marginBottom: 6 }
          : { height: 0, opacity: 0, marginTop: 0, marginBottom: 0 }
      }
      transition={{ duration: PANEL_DURATION, ease: PANEL_EASE }}
    >
      {/* Resize handle on top edge */}
      {isOpen && <ResizeHandle edge="top" onResize={handleResize} />}

      {/* Terminal layer — mount-once, opacity-animated to preserve WS */}
      {terminalMountedRef.current && (
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: isTerminal ? 1 : 0,
            zIndex: isTerminal ? 1 : 0,
          }}
          transition={{ duration: 0.15, ease: PANEL_EASE }}
          style={{ pointerEvents: isTerminal ? 'auto' : 'none' }}
        >
          <PanelFrame className="h-full">
            <PanelFrameHeader title="Terminal" onClose={onClose} />
            <PanelFrameBody className="overflow-hidden flex flex-col">
              <Suspense>
                <LazyTerminal
                  visible={isOpen && isTerminal}
                  onClose={onClose ?? (() => {})}
                />
              </Suspense>
            </PanelFrameBody>
          </PanelFrame>
        </motion.div>
      )}

      {/* Non-terminal panels — AnimatePresence cross-fade */}
      <AnimatePresence mode="wait">
        {isOpen && !isTerminal && def && (
          <motion.div
            key={panelId}
            className="absolute inset-0 z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <PanelFrame className="h-full">
              <PanelFrameHeader
                title={def.label}
                onClose={onClose}
                actions={getPanelHeaderRight(panelId!, isConnected)}
              />
              <PanelFrameBody className="overflow-y-auto flex flex-col">
                <PanelContent panelId={panelId!} isConnected={isConnected} />
              </PanelFrameBody>
            </PanelFrame>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { PanelSlot };
