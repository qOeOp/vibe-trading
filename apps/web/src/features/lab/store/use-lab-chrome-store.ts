/* Copyright 2026 Marimo. All rights reserved. */
/* VT lab migration — lab chrome store for sidebar/panel/developer state */

import { create } from 'zustand';

type PanelLayout = 'default' | 'full-width';

interface LabChromeState {
  // Sidebar
  isSidebarOpen: boolean;
  selectedPanel: string | null;
  sidebarWidth: number;

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
  openSidebarPanel: (panel) =>
    set({ isSidebarOpen: true, selectedPanel: panel }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  setSelectedPanel: (panel) => set({ selectedPanel: panel }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),

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
