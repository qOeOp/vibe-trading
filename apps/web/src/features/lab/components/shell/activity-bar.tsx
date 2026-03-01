'use client';

import { MoreHorizontal, X } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import {
  cellErrorSummariesAtom,
  cellsRuntimeAtom,
} from '@/features/lab/core/cells/cells';
import { connectionAtom } from '@/features/lab/core/network/connection';
import { store } from '@/features/lab/core/state/jotai';
import { WebSocketState } from '@/features/lab/core/websocket/types';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { getPanelsBySlot, BUTTON_SHADOW, BUTTON_INSET } from './panels';
import { PanelButton } from './panel-button';
import { useExportActions } from './use-export-actions';

// ─── Activity Bar ────────────────────────────────────────
//
// Right-side icon bar. Renders right-slot panels from PANELS config.
// Error badge logic tracks unseen errors and shows count on the errors button.

function ActivityBar({ className }: { className?: string }) {
  const rightPanel = useLabModeStore((s) => s.rightPanel);
  const togglePanel = useLabModeStore((s) => s.togglePanel);

  const connection = useAtomValue(connectionAtom, { store });
  const errorSummaries = useAtomValue(cellErrorSummariesAtom, { store });
  const cellsRuntime = useAtomValue(cellsRuntimeAtom, { store });
  const [seenErrorKeys, setSeenErrorKeys] = useState<Set<string>>(new Set());
  const [errorGenerationByCell, setErrorGenerationByCell] = useState<
    Record<string, number>
  >({});
  const prevConnectionStateRef = useRef(connection.state);
  const prevCellStatusRef = useRef<Record<string, string | null | undefined>>(
    {},
  );

  useEffect(() => {
    setErrorGenerationByCell((prev) => {
      let changed = false;
      const next = { ...prev };

      for (const [cellId, runtime] of Object.entries(cellsRuntime)) {
        const prevStatus = prevCellStatusRef.current[cellId];
        const currStatus = runtime.status;

        if (
          (prevStatus === 'running' || prevStatus === 'queued') &&
          currStatus === 'idle' &&
          runtime.errored
        ) {
          next[cellId] = (next[cellId] ?? 0) + 1;
          changed = true;
        }

        prevCellStatusRef.current[cellId] = currStatus;
      }

      return changed ? next : prev;
    });
  }, [cellsRuntime]);

  const currentErrorKeys = useMemo(
    () =>
      errorSummaries.map((summary) => {
        const generation = errorGenerationByCell[summary.cellId] ?? 0;
        return `${summary.cellId}:${summary.errorType}:${generation}`;
      }),
    [errorSummaries, errorGenerationByCell],
  );

  useEffect(() => {
    const prev = prevConnectionStateRef.current;
    const curr = connection.state;

    if (curr === WebSocketState.OPEN && prev !== WebSocketState.OPEN) {
      setSeenErrorKeys(new Set(currentErrorKeys));
    }

    prevConnectionStateRef.current = curr;
  }, [connection.state, currentErrorKeys]);

  useEffect(() => {
    if (rightPanel !== 'errors') return;

    setSeenErrorKeys((prev) => {
      const next = new Set(prev);
      for (const key of currentErrorKeys) {
        next.add(key);
      }
      return next;
    });
  }, [rightPanel, currentErrorKeys]);

  const unreadErrorCount = currentErrorKeys.filter(
    (key) => !seenErrorKeys.has(key),
  ).length;
  const errorBadgeCount = Math.min(unreadErrorCount, 99);

  const rightPanels = getPanelsBySlot('right');
  let lastGroup: string | undefined;

  return (
    <div
      data-slot="activity-bar"
      className={cn(
        'shrink-0 flex flex-col items-center pt-0 pb-0 gap-2',
        className,
      )}
    >
      {rightPanels.map((item) => {
        const isActive = rightPanel === item.id;
        const needsSeparator =
          item.group && item.group !== lastGroup && lastGroup != null;
        lastGroup = item.group ?? lastGroup;

        const badge =
          item.id === 'errors' && errorBadgeCount > 0 ? (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center font-semibold z-[2]">
              {errorBadgeCount}
            </span>
          ) : undefined;

        return (
          <div key={item.id} className="contents">
            {needsSeparator && (
              <div className="w-5 h-px bg-mine-border my-0.5" />
            )}
            <PanelButton
              icon={item.icon}
              label={item.label}
              isActive={isActive}
              badge={badge}
              onClick={() => togglePanel(item.id)}
            />
          </div>
        );
      })}

      <div className="flex-1" />

      {/* More options — export dropdown */}
      <MoreOptionsButton />
    </div>
  );
}

// ─── More Options (Export) ───────────────────────────────
//
// Click ⋯ → 4 export buttons fan out upward above it (same PanelButton style).
// Click again (now ✕) or click an export action → collapse back.

function MoreOptionsButton() {
  const exportActions = useExportActions();
  const [open, setOpen] = useState(false);

  return (
    <div data-slot="export-fan" className="flex flex-col items-center gap-2">
      {/* Export buttons — slide up when open */}
      <div
        className={cn(
          'flex flex-col items-center gap-2 transition-all duration-200 overflow-hidden',
          open
            ? 'max-h-[200px] opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none',
        )}
      >
        {exportActions.map((action) => (
          <PanelButton
            key={action.label}
            icon={action.icon}
            label={action.label}
            isActive={false}
            round
            disabled={action.disabled}
            onClick={() => {
              action.handle();
              setOpen(false);
            }}
          />
        ))}
      </div>

      {/* Toggle button — ⋯ / ✕ */}
      <button
        data-slot="more-options-btn"
        title={open ? 'Close export' : 'Export notebook'}
        className={cn(
          'w-[36px] h-[36px] flex items-center justify-center rounded-full relative transition-all',
          open
            ? 'bg-mine-nav-active text-white scale-105'
            : 'bg-white text-mine-text hover:scale-105',
        )}
        style={{
          boxShadow: open ? undefined : BUTTON_SHADOW,
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {!open && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: BUTTON_INSET }}
          />
        )}
        {!open && (
          <GlowingEffect
            spread={40}
            glow
            disabled={false}
            proximity={48}
            inactiveZone={0.01}
            borderWidth={2}
          />
        )}
        {open ? (
          <X className="w-[18px] h-[18px] relative z-[1]" strokeWidth={1.5} />
        ) : (
          <MoreHorizontal
            className="w-[18px] h-[18px] relative z-[1]"
            strokeWidth={1.5}
          />
        )}
      </button>
    </div>
  );
}

export { ActivityBar };
