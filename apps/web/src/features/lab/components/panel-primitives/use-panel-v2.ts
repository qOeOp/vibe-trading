'use client';

import { create } from 'zustand';

// ─── Panel V2 Toggle Store ──────────────────────────────
//
// Per-panel toggle between old (v1) and new (v2) rendering.
// Used during migration to let users compare side-by-side.
// Remove this file once all panels are finalized on v2.

type PanelV2State = {
  /** Map of panelId → whether v2 is active */
  flags: Record<string, boolean>;
  /** Toggle a specific panel's v2 flag */
  toggle: (panelId: string) => void;
  /** Check if a panel has v2 enabled */
  isV2: (panelId: string) => boolean;
};

const usePanelV2Store = create<PanelV2State>((set, get) => ({
  flags: {},
  toggle: (panelId) =>
    set((s) => ({
      flags: { ...s.flags, [panelId]: !s.flags[panelId] },
    })),
  isV2: (panelId) => get().flags[panelId] ?? false,
}));

/** Hook: returns [isV2, toggleV2] for a specific panel */
function usePanelV2(panelId: string): [boolean, () => void] {
  const isV2 = usePanelV2Store((s) => s.flags[panelId] ?? false);
  const toggle = usePanelV2Store((s) => s.toggle);
  return [isV2, () => toggle(panelId)];
}

export { usePanelV2, usePanelV2Store };
