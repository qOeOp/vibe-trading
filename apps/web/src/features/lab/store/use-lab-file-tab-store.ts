'use client';

import { create } from 'zustand';

export type FileTab = {
  id: string;
  label: string;
  path: string;
  isDirty: boolean;
  pinned: boolean;
};

function basename(path: string): string {
  return path.split('/').pop() ?? path;
}

interface LabFileTabState {
  tabs: FileTab[];
  activeTabId: string | null;

  /** Initialize the pinned notebook tab (called on connection). */
  initNotebookTab: (path: string) => void;

  /** Open a file: creates tab if new, switches to it if existing. */
  openFile: (path: string) => void;

  /** Close a non-pinned tab. */
  closeTab: (id: string) => void;

  /** Switch active tab. */
  setActive: (id: string) => void;

  /** Mark tab dirty/clean. */
  setDirty: (id: string, dirty: boolean) => void;

  /** Reset all tabs (on disconnect). */
  reset: () => void;
}

export const useLabFileTabStore = create<LabFileTabState>((set, get) => ({
  tabs: [],
  activeTabId: null,

  initNotebookTab: (path) => {
    const { tabs } = get();
    const existing = tabs.find((t) => t.id === path);
    if (existing) {
      set({ activeTabId: path });
      return;
    }
    // Replace any existing pinned tab, keep other tabs
    const nonPinned = tabs.filter((t) => !t.pinned);
    const notebookTab: FileTab = {
      id: path,
      label: basename(path),
      path,
      isDirty: false,
      pinned: true,
    };
    set({
      tabs: [notebookTab, ...nonPinned],
      activeTabId: path,
    });
  },

  openFile: (path) => {
    const { tabs } = get();
    const existing = tabs.find((t) => t.id === path);
    if (existing) {
      set({ activeTabId: path });
      return;
    }
    const tab: FileTab = {
      id: path,
      label: basename(path),
      path,
      isDirty: false,
      pinned: false,
    };
    set({ tabs: [...tabs, tab], activeTabId: path });
  },

  closeTab: (id) => {
    const { tabs, activeTabId } = get();
    const tab = tabs.find((t) => t.id === id);
    if (!tab || tab.pinned) return;

    const idx = tabs.indexOf(tab);
    const next = tabs.filter((t) => t.id !== id);
    const newActive =
      activeTabId === id
        ? (next[Math.min(idx, next.length - 1)]?.id ?? null)
        : activeTabId;
    set({ tabs: next, activeTabId: newActive });
  },

  setActive: (id) => set({ activeTabId: id }),

  setDirty: (id, dirty) =>
    set((s) => ({
      tabs: s.tabs.map((t) => (t.id === id ? { ...t, isDirty: dirty } : t)),
    })),

  reset: () => set({ tabs: [], activeTabId: null }),
}));
