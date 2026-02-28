/* Copyright 2026 Marimo. All rights reserved. */
/* VT lab migration — lab chrome store for sidebar/panel/developer state */

import { create } from 'zustand';

type PanelLayout = 'default' | 'full-width';

export type SidebarPanelType =
  | 'files'
  | 'variables'
  | 'packages'
  | 'ai'
  | 'data-catalog'
  | 'validation'
  | string;
export type DeveloperPanelTab = 'errors' | string;

interface LabChromeState {
  // Sidebar
  isSidebarOpen: boolean;
  selectedPanel: string | null;
  sidebarWidth: number;

  // Floating panels (multi-panel card system)
  openPanels: string[];
  currentPage: number;
  panelCardWidth: number;

  // Developer panel (bottom)
  isDeveloperPanelOpen: boolean;
  selectedDeveloperTab: string | null;
  developerPanelHeight: number;

  // Context panel (right)
  isContextPanelOpen: boolean;
  contextPanelWidth: number;

  // Layout
  panelLayout: PanelLayout;

  // Sidebar actions
  toggleSidebar: () => void;
  openSidebarPanel: (panel: string) => void;
  closeSidebar: () => void;
  setSelectedPanel: (panel: string | null) => void;
  setSidebarWidth: (width: number) => void;

  // Floating panel actions
  openPanel: (panel: string) => void;
  closePanel: (panel: string) => void;
  togglePanel: (panel: string) => void;
  setCurrentPage: (page: number) => void;
  setPanelCardWidth: (width: number) => void;

  // Developer panel actions
  toggleDeveloperPanel: () => void;
  openDeveloperPanel: (tab?: string) => void;
  closeDeveloperPanel: () => void;
  setDeveloperTab: (tab: string) => void;
  setDeveloperPanelHeight: (height: number) => void;

  // Context panel actions
  toggleContextPanel: () => void;
  setContextPanelWidth: (width: number) => void;
}

export const useLabChromeStore = create<LabChromeState>((set) => ({
  // Sidebar
  isSidebarOpen: false,
  selectedPanel: null,
  sidebarWidth: 260,

  // Floating panels
  openPanels: [],
  currentPage: 0,
  panelCardWidth: 30,

  // Developer panel
  isDeveloperPanelOpen: false,
  selectedDeveloperTab: null,
  developerPanelHeight: 200,

  // Context panel
  isContextPanelOpen: false,
  contextPanelWidth: 300,

  // Layout
  panelLayout: 'default' as PanelLayout,

  // Sidebar actions
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  openSidebarPanel: (panel) => {
    // Delegate to openPanel for multi-panel support
    const state = useLabChromeStore.getState();
    state.openPanel(panel);
  },
  closeSidebar: () =>
    set({ isSidebarOpen: false, openPanels: [], currentPage: 0 }),
  setSelectedPanel: (panel) => set({ selectedPanel: panel }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),

  // Floating panel actions
  openPanel: (panel) =>
    set((s) => {
      if (s.openPanels.includes(panel)) {
        return { selectedPanel: panel, isSidebarOpen: true };
      }
      const newPanels = [...s.openPanels, panel];
      const newPage =
        newPanels.length >= 3
          ? Math.floor((newPanels.length - 1) / 2)
          : s.currentPage;
      return {
        openPanels: newPanels,
        selectedPanel: panel,
        isSidebarOpen: true,
        currentPage: newPage,
      };
    }),
  closePanel: (panel) =>
    set((s) => {
      const newPanels = s.openPanels.filter((p) => p !== panel);
      const pageCount = Math.ceil(newPanels.length / 2);
      const newPage = Math.min(s.currentPage, Math.max(0, pageCount - 1));
      const newSelected =
        s.selectedPanel === panel
          ? newPanels.length > 0
            ? newPanels[newPanels.length - 1]
            : null
          : s.selectedPanel;
      return {
        openPanels: newPanels,
        currentPage: newPage,
        selectedPanel: newSelected,
        isSidebarOpen: newPanels.length > 0,
      };
    }),
  togglePanel: (panel) => {
    const state = useLabChromeStore.getState();
    if (state.openPanels.includes(panel)) {
      state.closePanel(panel);
    } else {
      state.openPanel(panel);
    }
  },
  setCurrentPage: (page) => set({ currentPage: page }),
  setPanelCardWidth: (width) => set({ panelCardWidth: width }),

  // Developer panel actions
  toggleDeveloperPanel: () =>
    set((s) => ({ isDeveloperPanelOpen: !s.isDeveloperPanelOpen })),
  openDeveloperPanel: (tab) =>
    set((s) => ({
      isDeveloperPanelOpen: true,
      ...(tab ? { selectedDeveloperTab: tab } : {}),
    })),
  closeDeveloperPanel: () => set({ isDeveloperPanelOpen: false }),
  setDeveloperTab: (tab) => set({ selectedDeveloperTab: tab }),
  setDeveloperPanelHeight: (height) => set({ developerPanelHeight: height }),

  // Context panel actions
  toggleContextPanel: () =>
    set((s) => ({ isContextPanelOpen: !s.isContextPanelOpen })),
  setContextPanelWidth: (width) => set({ contextPanelWidth: width }),
}));
