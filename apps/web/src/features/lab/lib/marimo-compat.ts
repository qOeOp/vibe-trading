/**
 * Marimo Compatibility Layer
 *
 * Provides Marimo-compatible hooks backed by VT's Zustand stores.
 * This lets forked Marimo components work with minimal import path changes:
 *   - Replace `from "../core/cells/cells"` → `from "@/features/lib/marimo-compat"`
 *   - Replace `from "../core/network/connection"` → same
 *   - Replace `useAtomValue(someAtom)` → use named hook from this module
 *
 * Source reference: marimo/frontend/src/core/cells/cells.ts
 */

'use client';

import { useCallback, useMemo, useRef } from 'react';

/**
 * Inline shallow equality selector wrapper.
 * Equivalent to zustand/shallow's useShallow.
 * TODO: Replace with `import { useShallow } from 'zustand/shallow'` once zustand is installed.
 */
function useShallow<S, T>(selector: (state: S) => T): (state: S) => T {
  const prev = useRef<T>(undefined as T);
  return (state: S) => {
    const next = selector(state);
    if (shallowEqual(prev.current, next)) {
      return prev.current as T;
    }
    prev.current = next;
    return next;
  };
}

function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  )
    return false;
  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !Object.is(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      )
    )
      return false;
  }
  return true;
}
import { useLabCellStore } from '../store/use-lab-cell-store';
import { useLabChromeStore } from '../store/use-lab-chrome-store';
import type {
  CellData,
  CellRuntimeState,
  CellConfig,
  OutputMessage,
  CellOutline,
  RuntimeState,
} from '../types';

// ─── Cell Data Hooks ────────────────────────────────────

/**
 * Read cell data (code, name, config) for a specific cell.
 * Equivalent to Marimo's `useAtomValue(cellDataAtom(cellId))`.
 */
export function useCellData(cellId: string): CellData | undefined {
  return useLabCellStore((s) => s.cellData[cellId]);
}

/**
 * Read cell runtime state (status, output, errors) for a specific cell.
 * Equivalent to Marimo's `useAtomValue(cellRuntimeAtom(cellId))`.
 */
export function useCellRuntime(cellId: string): CellRuntimeState | undefined {
  return useLabCellStore((s) => s.cellRuntime[cellId]);
}

// ─── Cell Actions ───────────────────────────────────────

/**
 * Actions that can be dispatched to modify cell state.
 * Equivalent to Marimo's `useCellActions()` which dispatches to `notebookAtom`.
 */
export interface CellActions {
  // Cell CRUD
  addCell: (afterCellId?: string) => void;
  removeCell: (cellId: string) => void;
  moveCell: (cellId: string, toIndex: number) => void;
  reorderCells: (fromIndex: number, toIndex: number) => void;

  // Cell data mutations
  setCellCode: (cellId: string, code: string) => void;
  setCellName: (cellId: string, name: string) => void;
  setCellConfig: (cellId: string, config: Partial<CellConfig>) => void;

  // Cell folding
  foldCell: (cellId: string) => void;
  unfoldCell: (cellId: string) => void;

  // Focus & selection
  setActiveCellId: (id: string | null) => void;
  focusCell: (cellId: string) => void;
  scrollToCell: (cellId: string) => void;
  deselectCell: () => void;

  // Execution lifecycle
  prepareForRun: (cellId: string) => void;
  handleCellMessage: (cellId: string, output: OutputMessage) => void;
  setCellRuntimeStatus: (cellId: string, status: RuntimeState) => void;
  setStaleInputs: (cellId: string, stale: boolean) => void;
  interruptCell: (cellId: string) => void;
  stopCell: (cellId: string) => void;
  setRunElapsedTime: (cellId: string, ms: number) => void;
  completeCellRun: (cellId: string, result?: { elapsedMs: number }) => void;

  // Output & errors
  setOutline: (cellId: string, outline: CellOutline | null) => void;
  setCellErrors: (cellId: string, errored: boolean) => void;
  setConsoleOutputs: (cellId: string, outputs: OutputMessage[]) => void;

  // Undo
  undoDelete: () => void;
}

/**
 * Stable selector that extracts action functions from the cell store.
 * Memoized to prevent unnecessary re-renders.
 */
const cellActionsSelector = (
  s: ReturnType<typeof useLabCellStore.getState>,
): CellActions => ({
  addCell: s.addCell,
  removeCell: s.removeCell,
  moveCell: s.moveCell,
  reorderCells: s.reorderCells,
  setCellCode: s.setCellCode,
  setCellName: s.setCellName,
  setCellConfig: s.setCellConfig,
  foldCell: s.foldCell,
  unfoldCell: s.unfoldCell,
  setActiveCellId: s.setActiveCellId,
  focusCell: s.focusCell,
  scrollToCell: s.scrollToCell,
  deselectCell: s.deselectCell,
  prepareForRun: s.prepareForRun,
  handleCellMessage: s.handleCellMessage,
  setCellRuntimeStatus: s.setCellRuntimeStatus,
  setStaleInputs: s.setStaleInputs,
  interruptCell: s.interruptCell,
  stopCell: s.stopCell,
  setRunElapsedTime: s.setRunElapsedTime,
  completeCellRun: s.completeCellRun,
  setOutline: s.setOutline,
  setCellErrors: s.setCellErrors,
  setConsoleOutputs: s.setConsoleOutputs,
  undoDelete: s.undoDelete,
});

/**
 * Get cell action dispatchers.
 * Equivalent to Marimo's `useCellActions()`.
 */
export function useCellActions(): CellActions {
  return useLabCellStore(useShallow(cellActionsSelector));
}

// ─── Notebook-Level Hooks ───────────────────────────────

/**
 * Get ordered list of cell IDs.
 * Equivalent to Marimo's `useAtomValue(cellIdsAtom)`.
 */
export function useCellIds(): string[] {
  return useLabCellStore((s) => s.cellIds);
}

/**
 * Get the currently focused/active cell ID.
 * Equivalent to Marimo's `useAtomValue(activeCellIdAtom)`.
 */
export function useActiveCellId(): string | null {
  return useLabCellStore((s) => s.activeCellId);
}

/**
 * Get scroll-to-cell key (changes trigger scroll).
 * Equivalent to Marimo's scroll trigger mechanism.
 */
export function useScrollKey(): string | null {
  return useLabCellStore((s) => s.scrollKey ?? null);
}

// ─── Derived Cell State Hooks ───────────────────────────

/**
 * Whether a cell needs to be run (code changed since last execution).
 * Equivalent to Marimo's cell "edited" / "needs-run" state.
 */
export function useCellNeedsRun(cellId: string): boolean {
  return useLabCellStore((s) => {
    const data = s.cellData[cellId];
    const runtime = s.cellRuntime[cellId];
    if (!data || !runtime) return false;
    return data.edited || runtime.staleInputs;
  });
}

/**
 * Whether a cell's output is stale (inputs changed but not re-run).
 */
export function useCellIsStale(cellId: string): boolean {
  return useLabCellStore((s) => {
    const runtime = s.cellRuntime[cellId];
    return runtime?.staleInputs ?? false;
  });
}

/**
 * Whether a cell is currently running.
 */
export function useCellIsRunning(cellId: string): boolean {
  return useLabCellStore((s) => {
    const runtime = s.cellRuntime[cellId];
    return runtime?.status === 'running';
  });
}

/**
 * Whether a cell is queued for execution.
 */
export function useCellIsQueued(cellId: string): boolean {
  return useLabCellStore((s) => {
    const runtime = s.cellRuntime[cellId];
    return runtime?.status === 'queued';
  });
}

// ─── Connection Status ──────────────────────────────────

/**
 * Connection status to the execution backend.
 * Marimo uses WebSocket; VT uses Pyodide WASM (always "connected" once loaded).
 *
 * Equivalent to Marimo's `useAtomValue(connectionAtom)`.
 */
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export function useConnectionStatus(): ConnectionStatus {
  // Pyodide-based: we consider the connection status based on worker readiness.
  // For now, always return "connected" since Pyodide runs in-browser.
  // TODO: Wire to actual Pyodide worker health check.
  return 'connected';
}

// ─── Chrome State Hooks ─────────────────────────────────

/**
 * Read chrome UI state (panels, sidebar).
 * Equivalent to Marimo's `useAtomValue(panelAtom)` and related chrome atoms.
 */
export function useChromeState() {
  return useLabChromeStore(
    useShallow((s) => ({
      isSidebarOpen: s.isSidebarOpen,
      selectedPanel: s.selectedPanel,
      isDeveloperPanelOpen: s.isDeveloperPanelOpen,
      selectedDeveloperTab: s.selectedDeveloperTab,
      isContextPanelOpen: s.isContextPanelOpen,
      panelLayout: s.panelLayout,
    })),
  );
}

/**
 * Get chrome action dispatchers.
 */
export function useChromeActions() {
  return useLabChromeStore(
    useShallow((s) => ({
      toggleSidebar: s.toggleSidebar,
      openSidebarPanel: s.openSidebarPanel,
      closeSidebar: s.closeSidebar,
      toggleDeveloperPanel: s.toggleDeveloperPanel,
      setDeveloperTab: s.setDeveloperTab,
      openDeveloperPanel: s.openDeveloperPanel,
      closeDeveloperPanel: s.closeDeveloperPanel,
      toggleContextPanel: s.toggleContextPanel,
      setSidebarWidth: s.setSidebarWidth,
      setDeveloperPanelHeight: s.setDeveloperPanelHeight,
      setContextPanelWidth: s.setContextPanelWidth,
    })),
  );
}

// ─── Utility Hooks ──────────────────────────────────────

/**
 * Get cell config with defaults applied.
 * Useful for components that need to read config with fallbacks.
 */
const DEFAULT_CELL_CONFIG_FALLBACK: CellConfig = {
  disabled: false,
  hide_code: false,
};

export function useCellConfig(cellId: string): CellConfig {
  return useLabCellStore((s) => {
    const data = s.cellData[cellId];
    return data?.config ?? DEFAULT_CELL_CONFIG_FALLBACK;
  });
}

/**
 * Whether the app is in "read" mode (non-interactive).
 * Marimo has edit/read/present modes; VT Lab is always in edit mode.
 */
export function useAppMode(): 'edit' | 'read' | 'present' {
  return 'edit';
}

/**
 * Whether interaction is disabled (e.g., during disconnect).
 * In Marimo this checks WebSocket connection; VT always allows interaction.
 */
export function useIsInteractionDisabled(): boolean {
  return false;
}
