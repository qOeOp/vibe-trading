"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Chrome Panel Types ─────────────────────────────────

/**
 * Sidebar panels — left icon rail
 * Adapted from Marimo chrome/state.ts panelAtom
 */
export type SidebarPanelType =
  | "files"
  | "variables"
  | "dependencies"
  | "outline"
  | null;

/**
 * Developer panels — bottom panel tabs
 * Adapted from Marimo chrome/state.ts developerPanelTabAtom
 */
export type DeveloperPanelTab = "errors" | "logs" | "terminal";

/**
 * Panel layout config — persisted to localStorage
 */
export interface PanelLayout {
  /** Sidebar width in pixels */
  sidebarWidth: number;
  /** Developer panel height in pixels */
  developerPanelHeight: number;
  /** Context (right) panel width in pixels */
  contextPanelWidth: number;
}

// ─── Store State ────────────────────────────────────────

interface LabChromeState {
  // ── Sidebar (left) ──
  /** Whether the sidebar panel is open */
  isSidebarOpen: boolean;
  /** Currently selected sidebar panel */
  selectedPanel: SidebarPanelType;

  // ── Developer panel (bottom) ──
  /** Whether the developer panel is open */
  isDeveloperPanelOpen: boolean;
  /** Currently selected developer panel tab */
  selectedDeveloperTab: DeveloperPanelTab;

  // ── Context panel (right) ──
  /** Whether the context panel (AI + results) is open */
  isContextPanelOpen: boolean;

  // ── Layout (persisted) ──
  panelLayout: PanelLayout;

  // ── Actions ──

  // Sidebar
  toggleSidebar: () => void;
  openSidebarPanel: (panel: NonNullable<SidebarPanelType>) => void;
  closeSidebar: () => void;

  // Developer panel
  toggleDeveloperPanel: () => void;
  setDeveloperTab: (tab: DeveloperPanelTab) => void;
  openDeveloperPanel: (tab?: DeveloperPanelTab) => void;
  closeDeveloperPanel: () => void;

  // Context panel
  toggleContextPanel: () => void;

  // Layout
  setSidebarWidth: (width: number) => void;
  setDeveloperPanelHeight: (height: number) => void;
  setContextPanelWidth: (width: number) => void;
}

// ─── Default Layout ─────────────────────────────────────

const DEFAULT_LAYOUT: PanelLayout = {
  sidebarWidth: 260,
  developerPanelHeight: 200,
  contextPanelWidth: 360,
};

// ─── Store ──────────────────────────────────────────────

export const useLabChromeStore = create<LabChromeState>()(
  persist(
    (set, get) => ({
      // ── Defaults ──
      isSidebarOpen: false,
      selectedPanel: null,

      isDeveloperPanelOpen: false,
      selectedDeveloperTab: "errors",

      isContextPanelOpen: true,

      panelLayout: { ...DEFAULT_LAYOUT },

      // ── Sidebar Actions ──

      toggleSidebar: () => {
        const state = get();
        if (state.isSidebarOpen) {
          set({ isSidebarOpen: false, selectedPanel: null });
        } else {
          // Open with a default panel
          set({ isSidebarOpen: true, selectedPanel: "files" });
        }
      },

      openSidebarPanel: (panel) => {
        const state = get();
        if (state.isSidebarOpen && state.selectedPanel === panel) {
          // Toggle off if clicking the same panel
          set({ isSidebarOpen: false, selectedPanel: null });
        } else {
          set({ isSidebarOpen: true, selectedPanel: panel });
        }
      },

      closeSidebar: () => set({ isSidebarOpen: false, selectedPanel: null }),

      // ── Developer Panel Actions ──

      toggleDeveloperPanel: () => {
        set((state) => ({
          isDeveloperPanelOpen: !state.isDeveloperPanelOpen,
        }));
      },

      setDeveloperTab: (tab) => set({ selectedDeveloperTab: tab }),

      openDeveloperPanel: (tab) => {
        set({
          isDeveloperPanelOpen: true,
          ...(tab ? { selectedDeveloperTab: tab } : {}),
        });
      },

      closeDeveloperPanel: () => set({ isDeveloperPanelOpen: false }),

      // ── Context Panel Actions ──

      toggleContextPanel: () => {
        set((state) => ({
          isContextPanelOpen: !state.isContextPanelOpen,
        }));
      },

      // ── Layout Actions ──

      setSidebarWidth: (width) =>
        set((state) => ({
          panelLayout: { ...state.panelLayout, sidebarWidth: width },
        })),

      setDeveloperPanelHeight: (height) =>
        set((state) => ({
          panelLayout: { ...state.panelLayout, developerPanelHeight: height },
        })),

      setContextPanelWidth: (width) =>
        set((state) => ({
          panelLayout: { ...state.panelLayout, contextPanelWidth: width },
        })),
    }),
    {
      name: "vt-lab-chrome",
      // Only persist layout, not open/closed state
      partialize: (state) => ({
        panelLayout: state.panelLayout,
      }),
    },
  ),
);
