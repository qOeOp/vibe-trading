'use client';

import { MoreHorizontal } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/lab/components/ui/dropdown-menu';
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

function MoreOptionsButton() {
  const exportActions = useExportActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-slot="more-options-btn"
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white text-mine-text relative hover:scale-105 transition-transform"
          style={{ boxShadow: BUTTON_SHADOW }}
        >
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: BUTTON_INSET }}
          />
          <GlowingEffect
            spread={40}
            glow
            disabled={false}
            proximity={48}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <MoreHorizontal
            className="w-[18px] h-[18px] relative z-[1]"
            strokeWidth={1.5}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="end" className="w-[200px]">
        <div className="px-2 py-1.5 text-[10px] font-medium text-mine-muted uppercase tracking-wider">
          Export notebook
        </div>
        {exportActions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onSelect={action.handle}
            disabled={action.disabled}
          >
            <action.icon className="w-4 h-4 mr-2 text-mine-muted" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ActivityBar };
