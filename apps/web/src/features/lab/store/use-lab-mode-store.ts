'use client';

import { create } from 'zustand';
import { getPanelDef, MUTEX_GROUPS } from '../components/shell/panels';

export type LabMode = 'idle' | 'connecting' | 'active';

/** Bridged actions registered by LiveIDEBody (jotai context → zustand) */
type BridgedActions = {
  runAll: (() => void) | null;
  openSettings: (() => void) | null;
};

interface LabModeState {
  mode: LabMode;
  setMode: (mode: LabMode) => void;

  /** Unified panel slots — null means closed */
  leftPanel: string | null;
  rightPanel: string | null;
  bottomPanel: string | null;

  /** Remembers the last-open bottom panel for quick re-open */
  lastBottomPanel: string | null;

  /** Toggle a panel by id. Handles slot routing + mutex groups. */
  togglePanel: (id: string) => void;

  /** Open logs panel and scroll to a specific cell's logs */
  focusLogCellId: string | null;
  openLogsForCell: (cellId: string) => void;

  // ── Legacy compat (thin wrappers around togglePanel) ──
  /** @deprecated Use `leftPanel === 'files'` */
  fileTreeVisible: boolean;
  /** @deprecated Use `togglePanel('files')` */
  toggleFileTree: () => void;
  /** @deprecated Use `bottomPanel === 'terminal'` */
  terminalOpen: boolean;
  /** @deprecated Use `togglePanel('terminal')` */
  toggleTerminal: () => void;
  /** @deprecated Use `togglePanel('terminal')` — opens terminal */
  openTerminal: () => void;
  /** @deprecated Use `togglePanel('terminal')` — closes terminal */
  closeTerminal: () => void;

  /** Bridged jotai actions for ChromeHeader */
  actions: BridgedActions;
  setActions: (actions: Partial<BridgedActions>) => void;
  /** Fixed workspace path (e.g. /Users/vx/.vt-lab), set during bootstrap */
  workspacePath: string;
  /** Notebook path opened on connect */
  notebookPath: string;
  setWorkspace: (workspacePath: string, notebookPath: string) => void;
}

export const useLabModeStore = create<LabModeState>((set, get) => ({
  mode: 'idle',
  setMode: (mode) => set({ mode }),

  // ── Unified panel state ──
  leftPanel: 'files', // file tree open by default
  rightPanel: 'data-catalog', // data catalog open by default
  bottomPanel: null,
  lastBottomPanel: null,

  focusLogCellId: null,
  openLogsForCell: (cellId: string) => {
    const s = get();
    // Set focus target first
    set({ focusLogCellId: cellId });
    // Open logs panel (togglePanel handles mutex)
    if (s.bottomPanel !== 'logs') {
      s.togglePanel('logs');
    }
  },

  togglePanel: (id: string) => {
    const def = getPanelDef(id);
    if (!def) return;

    // connectedOnly panels require active mode
    if (def.connectedOnly && get().mode !== 'active') return;

    const slotKey =
      def.side === 'left'
        ? 'leftPanel'
        : def.side === 'right'
          ? 'rightPanel'
          : 'bottomPanel';

    const current = get()[slotKey];
    const next = current === id ? null : id;

    const updates: Partial<LabModeState> = { [slotKey]: next };

    // Auto-collapse file tree when opening a right panel would squeeze
    // the editor below MIN_EDITOR_WIDTH (700px).
    if (next !== null && def.side === 'right' && get().leftPanel) {
      const leftDef = getPanelDef(get().leftPanel!);
      const leftWidth = typeof leftDef?.size === 'number' ? leftDef.size : 280;
      const rightWidth =
        typeof def.size === 'number'
          ? Math.max(def.size, def.minSize ?? 0)
          : 280;
      // LeftBar(~48) + leftPanel + editor + rightPanel + ActivityBar(~48) + gaps(~32)
      const CHROME_OVERHEAD = 48 + 48 + 32;
      const MIN_EDITOR_WIDTH = 700;
      const containerWidth =
        typeof window !== 'undefined' ? window.innerWidth : 1920;
      const editorWidth =
        containerWidth - CHROME_OVERHEAD - leftWidth - rightWidth;
      if (editorWidth < MIN_EDITOR_WIDTH) {
        updates.leftPanel = null;
        updates.fileTreeVisible = false;
      }
    }

    // Mutex: close other members of the same mutex group (in OTHER slots only)
    if (next !== null) {
      for (const group of MUTEX_GROUPS) {
        if (group.includes(id)) {
          for (const otherId of group) {
            if (otherId !== id) {
              const otherDef = getPanelDef(otherId);
              if (otherDef) {
                const otherKey =
                  otherDef.side === 'left'
                    ? 'leftPanel'
                    : otherDef.side === 'right'
                      ? 'rightPanel'
                      : 'bottomPanel';
                // Skip same-slot: switching within a slot already replaces the panel
                if (otherKey !== slotKey) {
                  updates[otherKey] = null;
                }
              }
            }
          }
        }
      }
    }

    // Track last bottom panel for quick re-open
    const merged = { ...get(), ...updates };
    if (def.side === 'bottom' && next !== null) {
      updates.lastBottomPanel = next;
    }

    // Compute derived compat fields
    updates.fileTreeVisible = merged.leftPanel === 'files';
    updates.terminalOpen =
      merged.bottomPanel === 'terminal' || merged.bottomPanel === 'logs';

    set(updates);
  },

  // ── Legacy compat (derived + thin wrappers) ──
  fileTreeVisible: true,
  toggleFileTree: () => get().togglePanel('files'),
  terminalOpen: false,
  toggleTerminal: () => get().togglePanel('terminal'),
  openTerminal: () => {
    const s = get();
    if (s.bottomPanel !== 'terminal') {
      s.togglePanel('terminal');
    }
  },
  closeTerminal: () => {
    const s = get();
    if (s.bottomPanel === 'terminal') {
      s.togglePanel('terminal');
    }
  },

  actions: { runAll: null, openSettings: null },
  setActions: (actions) =>
    set((s) => ({ actions: { ...s.actions, ...actions } })),
  workspacePath: '',
  notebookPath: '',
  setWorkspace: (workspacePath, notebookPath) =>
    set({ workspacePath, notebookPath }),
}));
