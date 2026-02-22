'use client';

import { create } from 'zustand';

export type LabMode = 'idle' | 'connecting' | 'active';

/** Bridged actions registered by LiveIDEBody (jotai context → zustand) */
type BridgedActions = {
  runAll: (() => void) | null;
  openSettings: (() => void) | null;
};

interface LabModeState {
  mode: LabMode;
  setMode: (mode: LabMode) => void;
  /** File tree visibility */
  fileTreeVisible: boolean;
  toggleFileTree: () => void;
  /** Bridged jotai actions for ChromeHeader */
  actions: BridgedActions;
  setActions: (actions: Partial<BridgedActions>) => void;
}

export const useLabModeStore = create<LabModeState>((set) => ({
  mode: 'idle',
  setMode: (mode) => set({ mode }),
  fileTreeVisible: true,
  toggleFileTree: () => set((s) => ({ fileTreeVisible: !s.fileTreeVisible })),
  actions: { runAll: null, openSettings: null },
  setActions: (actions) =>
    set((s) => ({ actions: { ...s.actions, ...actions } })),
}));
