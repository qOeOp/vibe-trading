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
  /** Currently active left panel (null = collapsed) */
  leftPanel: string | null;
  /** Currently active bottom panel (null = collapsed) */
  bottomPanel: string | null;
  /** Toggle a panel by id (mutex within slot) */
  togglePanel: (id: string) => void;
  /** Cell ID to focus in logs panel (cross-panel linkage) */
  focusLogCellId: string | null;
  setFocusLogCellId: (id: string | null) => void;
  /** Bridged jotai actions for ChromeHeader */
  actions: BridgedActions;
  setActions: (actions: Partial<BridgedActions>) => void;
  /** Fixed workspace path (e.g. /Users/vx/.vt-lab), set during bootstrap */
  workspacePath: string;
  /** Notebook path opened on connect */
  notebookPath: string;
  setWorkspace: (workspacePath: string, notebookPath: string) => void;
}

export const useLabModeStore = create<LabModeState>((set) => ({
  mode: 'idle',
  setMode: (mode) => set({ mode }),
  fileTreeVisible: true,
  toggleFileTree: () => set((s) => ({ fileTreeVisible: !s.fileTreeVisible })),
  leftPanel: 'files',
  bottomPanel: null,
  togglePanel: (id) =>
    set((s) => {
      // Determine which slot this panel belongs to
      const LEFT_IDS = ['files', 'dependencies', 'outline'];
      const BOTTOM_IDS = ['terminal', 'logs'];

      if (LEFT_IDS.includes(id)) {
        return { leftPanel: s.leftPanel === id ? null : id };
      }
      if (BOTTOM_IDS.includes(id)) {
        return { bottomPanel: s.bottomPanel === id ? null : id };
      }
      return {};
    }),
  focusLogCellId: null,
  setFocusLogCellId: (id) => set({ focusLogCellId: id }),
  actions: { runAll: null, openSettings: null },
  setActions: (actions) =>
    set((s) => ({ actions: { ...s.actions, ...actions } })),
  workspacePath: '',
  notebookPath: '',
  setWorkspace: (workspacePath, notebookPath) =>
    set({ workspacePath, notebookPath }),
}));
