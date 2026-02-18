"use client";

import { create } from "zustand";
import { generateId } from "@/lib/id";
import type {
  CellOutput,
  CellStatus,
  ConsoleOutputLine,
  ContextPanelTab,
  LabCell,
  SidebarPanel,
  PyodideStatus,
  ValidationConfig,
  ValidationResult,
  ValidationStatus,
  AIChatMessage,
  // New Marimo-compatible types
  CellData,
  CellRuntimeState,
  CellConfig,
  OutputMessage,
  CellOutline,
  DeletedCellEntry,
  RuntimeState,
} from "../types";
import {
  DEFAULT_VALIDATION_CONFIG,
  DEFAULT_CELL_CONFIG,
  createCellData,
  createCellRuntimeState,
} from "../types";

// ─── Helper: create a blank legacy cell ─────────────────

function createBlankCell(): LabCell {
  return {
    id: generateId(),
    name: "",
    code: "",
    outputs: [],
    status: "idle",
    executionOrder: null,
    defines: [],
    uses: [],
  };
}

// ─── Helper: update a cell in cellData map ──────────────

function updateCellData(
  cellData: Record<string, CellData>,
  cellId: string,
  updater: (cell: CellData) => Partial<CellData>,
): Record<string, CellData> {
  const cell = cellData[cellId];
  if (!cell) return cellData;
  return { ...cellData, [cellId]: { ...cell, ...updater(cell) } };
}

function updateCellRuntime(
  cellRuntime: Record<string, CellRuntimeState>,
  cellId: string,
  updater: (rt: CellRuntimeState) => Partial<CellRuntimeState>,
): Record<string, CellRuntimeState> {
  const rt = cellRuntime[cellId];
  if (!rt) return cellRuntime;
  return { ...cellRuntime, [cellId]: { ...rt, ...updater(rt) } };
}

// ─── Store State ────────────────────────────────────────

interface LabCellState {
  // ═══════════════════════════════════════════════════════
  // Marimo-Compatible NotebookState
  // ═══════════════════════════════════════════════════════

  /** Ordered list of cell IDs (vertical layout) */
  cellIds: string[];
  /** Map of cell ID → static cell data */
  cellData: Record<string, CellData>;
  /** Map of cell ID → runtime state */
  cellRuntime: Record<string, CellRuntimeState>;
  /** Cell to scroll to after reorder */
  scrollKey: string | null;
  /** Deleted cell history for undo */
  deletedHistory: DeletedCellEntry[];

  // ═══════════════════════════════════════════════════════
  // Legacy State (backward compat — kept for existing consumers)
  // ═══════════════════════════════════════════════════════

  /** @deprecated Use cellIds + cellData + cellRuntime instead */
  cells: LabCell[];
  activeCellId: string | null;
  executionCounter: number;

  // Right sidebar overlay panel (legacy — chrome store replaces)
  sidebarPanel: SidebarPanel;
  // Permanent panel tab (AI / results)
  activePanel: ContextPanelTab;

  // Python runtime
  pyodideStatus: PyodideStatus;
  pyodideError: string | null;

  // Console (global output)
  consoleOutput: ConsoleOutputLine[];

  // Editor settings
  editorFontSize: number;
  editorLineWrap: boolean;

  // Factor
  factorName: string;

  // Validation
  validationConfig: ValidationConfig;
  validationStatus: ValidationStatus;
  validationResult: ValidationResult | null;

  // AI messages
  aiMessages: AIChatMessage[];

  // ═══════════════════════════════════════════════════════
  // 2A: Core Cell Actions (12)
  // ═══════════════════════════════════════════════════════

  /** Add a new cell after the given cell (or at end) */
  addCell: (afterCellId?: string) => void;
  /** Remove a cell by ID */
  removeCell: (cellId: string) => void;
  /** Move a cell to a new index (Marimo reorder) */
  moveCell: (cellId: string, toIndex: number) => void;
  /** Set cell code (marks cell as edited) */
  setCellCode: (cellId: string, code: string) => void;
  /** Set cell name */
  setCellName: (cellId: string, name: string) => void;
  /** Set cell config (hide_code, disabled) */
  setCellConfig: (cellId: string, config: Partial<CellConfig>) => void;
  /** Toggle code visibility (fold/unfold) */
  foldCell: (cellId: string) => void;
  unfoldCell: (cellId: string) => void;
  /** Set the active/focused cell */
  setActiveCellId: (id: string | null) => void;
  /** Focus a specific cell and optionally scroll to it */
  focusCell: (cellId: string) => void;

  // ═══════════════════════════════════════════════════════
  // 2B: Execution Actions (8)
  // ═══════════════════════════════════════════════════════

  /** Prepare cell for run: clear output, set status=queued, store lastCodeRun */
  prepareForRun: (cellId: string) => void;
  /** Handle cell output message from Pyodide worker */
  handleCellMessage: (cellId: string, output: OutputMessage) => void;
  /** Set the runtime state for a cell */
  setCellRuntimeStatus: (cellId: string, status: RuntimeState) => void;
  /** Mark cell as having stale inputs */
  setStaleInputs: (cellId: string, stale: boolean) => void;
  /** Mark cell as interrupted */
  interruptCell: (cellId: string) => void;
  /** Mark cell as stopped (error/mo.stop) */
  stopCell: (cellId: string) => void;
  /** Set run elapsed time */
  setRunElapsedTime: (cellId: string, ms: number) => void;
  /** Complete a cell run (set idle, record elapsed time) */
  completeCellRun: (
    cellId: string,
    result?: { elapsedMs: number },
  ) => void;

  // ═══════════════════════════════════════════════════════
  // 2D: Remaining Actions (8)
  // ═══════════════════════════════════════════════════════

  /** Reorder cells by dragging */
  reorderCells: (fromIndex: number, toIndex: number) => void;
  /** Scroll to a specific cell */
  scrollToCell: (cellId: string) => void;
  /** Set cell outline (TOC) */
  setOutline: (cellId: string, outline: CellOutline | null) => void;
  /** Set cell errors */
  setCellErrors: (cellId: string, errored: boolean) => void;
  /** Set cell console outputs */
  setConsoleOutputs: (cellId: string, outputs: OutputMessage[]) => void;
  /** Append a console output to a cell */
  appendConsoleOutput: (line: ConsoleOutputLine) => void;
  /** Undo last cell deletion */
  undoDelete: () => void;
  /** Deselect active cell */
  deselectCell: () => void;

  // ═══════════════════════════════════════════════════════
  // Legacy Actions (backward compat)
  // ═══════════════════════════════════════════════════════

  /** @deprecated Use setCellRuntimeStatus */
  setCellStatus: (cellId: string, status: CellStatus) => void;
  /** @deprecated Use handleCellMessage */
  appendCellOutput: (cellId: string, output: CellOutput) => void;
  clearCellOutput: (cellId: string) => void;
  setCellDefinesUses: (
    cellId: string,
    defines: string[],
    uses: string[],
  ) => void;
  moveCellUp: (cellId: string) => void;
  moveCellDown: (cellId: string) => void;
  incrementExecutionCounter: () => void;

  // Sidebar
  setSidebarPanel: (panel: SidebarPanel) => void;
  toggleSidebarPanel: (panel: NonNullable<SidebarPanel>) => void;
  setActivePanel: (tab: ContextPanelTab) => void;

  // Pyodide
  setPyodideStatus: (status: PyodideStatus) => void;
  setPyodideError: (error: string | null) => void;

  // Console (global)
  clearConsoleOutput: () => void;

  // Editor Settings
  setEditorFontSize: (size: number) => void;
  toggleEditorLineWrap: () => void;

  // Factor
  setFactorName: (name: string) => void;

  // Validation
  setValidationConfig: (config: Partial<ValidationConfig>) => void;
  setValidationStatus: (status: ValidationStatus) => void;
  setValidationResult: (result: ValidationResult | null) => void;

  // AI
  addAIMessage: (message: AIChatMessage) => void;
  clearAIMessages: () => void;
}

// ─── Initial State ──────────────────────────────────────

const initialCellId = generateId();
const initialLegacyCell = createBlankCell();
// Override to use same ID for both systems
const syncedId = initialLegacyCell.id;

const WELCOME_MESSAGE: AIChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "你好! 我是 Alpha 因子研究顾问。可以帮你解读因子公式、分析 IC/IR 统计指标、诊断覆盖率问题。有什么想了解的?",
  timestamp: Date.now(),
};

// ─── Store ──────────────────────────────────────────────

export const useLabCellStore = create<LabCellState>((set, get) => ({
  // ═══════════════════════════════════════════════════════
  // Marimo NotebookState defaults
  // ═══════════════════════════════════════════════════════

  cellIds: [syncedId],
  cellData: {
    [syncedId]: createCellData({ id: syncedId }),
  },
  cellRuntime: {
    [syncedId]: createCellRuntimeState(),
  },
  scrollKey: null,
  deletedHistory: [],

  // ═══════════════════════════════════════════════════════
  // Legacy defaults
  // ═══════════════════════════════════════════════════════

  cells: [initialLegacyCell],
  activeCellId: syncedId,
  executionCounter: 0,

  sidebarPanel: null,
  activePanel: "ai",

  pyodideStatus: "loading",
  pyodideError: null,
  consoleOutput: [],

  editorFontSize: 13,
  editorLineWrap: true,

  factorName: "因子_v1",

  validationConfig: { ...DEFAULT_VALIDATION_CONFIG },
  validationStatus: "idle",
  validationResult: null,

  aiMessages: [WELCOME_MESSAGE],

  // ═══════════════════════════════════════════════════════
  // 2A: Core Cell Actions
  // ═══════════════════════════════════════════════════════

  addCell: (afterCellId) => {
    const state = get();
    const newId = generateId();
    const newCellData = createCellData({ id: newId });
    const newCellRuntime = createCellRuntimeState();

    // Determine insertion index
    let insertIndex: number;
    if (afterCellId) {
      const afterIdx = state.cellIds.indexOf(afterCellId);
      insertIndex = afterIdx >= 0 ? afterIdx + 1 : state.cellIds.length;
    } else {
      insertIndex = state.cellIds.length;
    }

    // Update Marimo state
    const newCellIds = [...state.cellIds];
    newCellIds.splice(insertIndex, 0, newId);

    // Also update legacy cells
    const newLegacyCell: LabCell = {
      id: newId,
      name: "",
      code: "",
      outputs: [],
      status: "idle",
      executionOrder: null,
      defines: [],
      uses: [],
    };
    const newCells = [...state.cells];
    newCells.splice(insertIndex, 0, newLegacyCell);

    set({
      cellIds: newCellIds,
      cellData: { ...state.cellData, [newId]: newCellData },
      cellRuntime: { ...state.cellRuntime, [newId]: newCellRuntime },
      cells: newCells,
      activeCellId: newId,
    });
  },

  removeCell: (cellId) => {
    const state = get();
    if (state.cellIds.length <= 1) return;

    const idx = state.cellIds.indexOf(cellId);
    if (idx < 0) return;

    // Save to history for undo
    const cellData = state.cellData[cellId];
    const entry: DeletedCellEntry = {
      name: cellData?.name ?? "",
      code: cellData?.code ?? "",
      index: idx,
      config: cellData?.config ?? { ...DEFAULT_CELL_CONFIG },
    };

    // Remove from cellIds
    const newCellIds = state.cellIds.filter((id) => id !== cellId);

    // Remove from maps
    const newCellData = { ...state.cellData };
    delete newCellData[cellId];
    const newCellRuntime = { ...state.cellRuntime };
    delete newCellRuntime[cellId];

    // Legacy
    const newCells = state.cells.filter((c) => c.id !== cellId);
    let newActiveId = state.activeCellId;
    if (state.activeCellId === cellId) {
      newActiveId = newCellIds[Math.min(idx, newCellIds.length - 1)];
    }

    set({
      cellIds: newCellIds,
      cellData: newCellData,
      cellRuntime: newCellRuntime,
      deletedHistory: [...state.deletedHistory, entry],
      cells: newCells,
      activeCellId: newActiveId,
    });
  },

  moveCell: (cellId, toIndex) => {
    const state = get();
    const fromIndex = state.cellIds.indexOf(cellId);
    if (fromIndex < 0 || fromIndex === toIndex) return;

    const newCellIds = [...state.cellIds];
    newCellIds.splice(fromIndex, 1);
    newCellIds.splice(toIndex, 0, cellId);

    // Legacy sync
    const newCells = [...state.cells];
    const [movedCell] = newCells.splice(fromIndex, 1);
    newCells.splice(toIndex, 0, movedCell);

    set({
      cellIds: newCellIds,
      cells: newCells,
      scrollKey: cellId,
    });
  },

  setCellCode: (cellId, code) => {
    const state = get();
    const cellData = state.cellData[cellId];
    const edited = cellData ? code !== cellData.lastCodeRun : true;

    set({
      cellData: updateCellData(state.cellData, cellId, () => ({
        code,
        edited,
      })),
      // Legacy sync
      cells: state.cells.map((c) =>
        c.id === cellId ? { ...c, code } : c,
      ),
    });
  },

  setCellName: (cellId, name) => {
    const state = get();
    set({
      cellData: updateCellData(state.cellData, cellId, () => ({ name })),
      cells: state.cells.map((c) =>
        c.id === cellId ? { ...c, name } : c,
      ),
    });
  },

  setCellConfig: (cellId, config) => {
    const state = get();
    const cellData = state.cellData[cellId];
    if (!cellData) return;
    set({
      cellData: updateCellData(state.cellData, cellId, (cell) => ({
        config: { ...cell.config, ...config },
      })),
    });
  },

  foldCell: (cellId) => {
    const state = get();
    set({
      cellData: updateCellData(state.cellData, cellId, (cell) => ({
        config: { ...cell.config, hide_code: true },
      })),
    });
  },

  unfoldCell: (cellId) => {
    const state = get();
    set({
      cellData: updateCellData(state.cellData, cellId, (cell) => ({
        config: { ...cell.config, hide_code: false },
      })),
    });
  },

  setActiveCellId: (id) => set({ activeCellId: id }),

  focusCell: (cellId) => {
    set({ activeCellId: cellId, scrollKey: cellId });
  },

  // ═══════════════════════════════════════════════════════
  // 2B: Execution Actions
  // ═══════════════════════════════════════════════════════

  prepareForRun: (cellId) => {
    const state = get();
    const cellData = state.cellData[cellId];
    if (!cellData) return;

    set({
      cellData: updateCellData(state.cellData, cellId, (cell) => ({
        lastCodeRun: cell.code,
        edited: false,
      })),
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        output: null,
        consoleOutputs: [],
        status: "queued" as RuntimeState,
        staleInputs: false,
        interrupted: false,
        stopped: false,
        errored: false,
        runStartTimestamp: Date.now() / 1000,
        runElapsedTimeMs: null,
      })),
      // Legacy sync
      cells: state.cells.map((c) =>
        c.id === cellId
          ? { ...c, outputs: [], status: "running" as CellStatus }
          : c,
      ),
    });
  },

  handleCellMessage: (cellId, output) => {
    const state = get();
    if (output.channel === "output") {
      // Main output — replace
      set({
        cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
          output,
          status: "running" as RuntimeState,
        })),
      });
    } else if (
      output.channel === "stdout" ||
      output.channel === "stderr"
    ) {
      // Console — append
      set({
        cellRuntime: updateCellRuntime(state.cellRuntime, cellId, (rt) => ({
          consoleOutputs: [...rt.consoleOutputs, output],
        })),
      });
    } else if (output.channel === "marimo-error") {
      set({
        cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
          output,
          errored: true,
        })),
      });
    }
  },

  setCellRuntimeStatus: (cellId, status) => {
    const state = get();
    set({
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        status,
      })),
    });
  },

  setStaleInputs: (cellId, stale) => {
    const state = get();
    set({
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        staleInputs: stale,
      })),
      // Legacy sync: mark as stale
      cells: state.cells.map((c) =>
        c.id === cellId && stale ? { ...c, status: "stale" as CellStatus } : c,
      ),
    });
  },

  interruptCell: (cellId) => {
    const state = get();
    set({
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        interrupted: true,
        status: "idle" as RuntimeState,
      })),
      cells: state.cells.map((c) =>
        c.id === cellId ? { ...c, status: "idle" as CellStatus } : c,
      ),
    });
  },

  stopCell: (cellId) => {
    const state = get();
    set({
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        stopped: true,
        status: "idle" as RuntimeState,
      })),
      cells: state.cells.map((c) =>
        c.id === cellId ? { ...c, status: "error" as CellStatus } : c,
      ),
    });
  },

  setRunElapsedTime: (cellId, ms) => {
    const state = get();
    set({
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        runElapsedTimeMs: ms,
      })),
    });
  },

  completeCellRun: (cellId, result) => {
    const state = get();
    const rt = state.cellRuntime[cellId];
    if (!rt) return;

    set({
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        status: "idle" as RuntimeState,
        runElapsedTimeMs: result?.elapsedMs ?? null,
        lastRunStartTimestamp: rt.runStartTimestamp,
      })),
      cellData: updateCellData(state.cellData, cellId, (cell) => ({
        lastExecutionTime: result?.elapsedMs
          ? result.elapsedMs / 1000
          : cell.lastExecutionTime,
        edited: false,
      })),
      // Legacy sync
      cells: state.cells.map((c) =>
        c.id === cellId
          ? {
              ...c,
              status: (rt.errored ? "error" : "done") as CellStatus,
            }
          : c,
      ),
      executionCounter: state.executionCounter + 1,
    });
  },

  // ═══════════════════════════════════════════════════════
  // 2D: Remaining Actions
  // ═══════════════════════════════════════════════════════

  reorderCells: (fromIndex, toIndex) => {
    const state = get();
    const newCellIds = [...state.cellIds];
    const [movedId] = newCellIds.splice(fromIndex, 1);
    newCellIds.splice(toIndex, 0, movedId);

    const newCells = [...state.cells];
    const [movedCell] = newCells.splice(fromIndex, 1);
    newCells.splice(toIndex, 0, movedCell);

    set({ cellIds: newCellIds, cells: newCells, scrollKey: movedId });
  },

  scrollToCell: (cellId) => set({ scrollKey: cellId }),

  setOutline: (cellId, outline) => {
    const state = get();
    set({
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        outline,
      })),
    });
  },

  setCellErrors: (cellId, errored) => {
    const state = get();
    set({
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        errored,
      })),
      cells: state.cells.map((c) =>
        c.id === cellId
          ? { ...c, status: errored ? ("error" as CellStatus) : c.status }
          : c,
      ),
    });
  },

  setConsoleOutputs: (cellId, outputs) => {
    const state = get();
    set({
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        consoleOutputs: outputs,
      })),
    });
  },

  undoDelete: () => {
    const state = get();
    if (state.deletedHistory.length === 0) return;

    const entry = state.deletedHistory[state.deletedHistory.length - 1];
    const newId = generateId();

    // Restore cell
    const newCellIds = [...state.cellIds];
    const insertIdx = Math.min(entry.index, newCellIds.length);
    newCellIds.splice(insertIdx, 0, newId);

    const restoredCellData = createCellData({
      id: newId,
      name: entry.name,
      code: entry.code,
      config: entry.config,
    });

    const restoredLegacyCell: LabCell = {
      id: newId,
      name: entry.name,
      code: entry.code,
      outputs: [],
      status: "idle",
      executionOrder: null,
      defines: [],
      uses: [],
    };

    const newCells = [...state.cells];
    newCells.splice(insertIdx, 0, restoredLegacyCell);

    set({
      cellIds: newCellIds,
      cellData: { ...state.cellData, [newId]: restoredCellData },
      cellRuntime: {
        ...state.cellRuntime,
        [newId]: createCellRuntimeState(),
      },
      deletedHistory: state.deletedHistory.slice(0, -1),
      cells: newCells,
      activeCellId: newId,
    });
  },

  deselectCell: () => set({ activeCellId: null }),

  // ═══════════════════════════════════════════════════════
  // Legacy Actions (backward compat for existing consumers)
  // ═══════════════════════════════════════════════════════

  setCellStatus: (cellId, status) =>
    set((state) => ({
      cells: state.cells.map((c) =>
        c.id === cellId ? { ...c, status } : c,
      ),
    })),

  appendCellOutput: (cellId, output) =>
    set((state) => ({
      cells: state.cells.map((c) =>
        c.id === cellId
          ? { ...c, outputs: [...c.outputs, output] }
          : c,
      ),
    })),

  clearCellOutput: (cellId) =>
    set((state) => ({
      cells: state.cells.map((c) =>
        c.id === cellId ? { ...c, outputs: [] } : c,
      ),
      cellRuntime: updateCellRuntime(state.cellRuntime, cellId, () => ({
        output: null,
        consoleOutputs: [],
      })),
    })),

  setCellDefinesUses: (cellId, defines, uses) =>
    set((state) => ({
      cells: state.cells.map((c) =>
        c.id === cellId ? { ...c, defines, uses } : c,
      ),
    })),

  moveCellUp: (cellId) => {
    const state = get();
    const idx = state.cellIds.indexOf(cellId);
    if (idx <= 0) return;
    get().reorderCells(idx, idx - 1);
  },

  moveCellDown: (cellId) => {
    const state = get();
    const idx = state.cellIds.indexOf(cellId);
    if (idx < 0 || idx >= state.cellIds.length - 1) return;
    get().reorderCells(idx, idx + 1);
  },

  incrementExecutionCounter: () =>
    set((state) => ({ executionCounter: state.executionCounter + 1 })),

  // Sidebar
  setSidebarPanel: (panel) => set({ sidebarPanel: panel }),

  toggleSidebarPanel: (panel) => {
    const state = get();
    if (state.sidebarPanel === panel) {
      set({ sidebarPanel: null });
    } else {
      set({ sidebarPanel: panel });
    }
  },

  setActivePanel: (tab) => set({ activePanel: tab }),

  // Pyodide
  setPyodideStatus: (status) => set({ pyodideStatus: status }),
  setPyodideError: (error) => set({ pyodideError: error }),

  // Console (global)
  appendConsoleOutput: (line) =>
    set((state) => ({ consoleOutput: [...state.consoleOutput, line] })),
  clearConsoleOutput: () => set({ consoleOutput: [] }),

  // Editor Settings
  setEditorFontSize: (size) =>
    set({ editorFontSize: Math.min(18, Math.max(12, size)) }),
  toggleEditorLineWrap: () =>
    set((state) => ({ editorLineWrap: !state.editorLineWrap })),

  // Factor
  setFactorName: (name) => set({ factorName: name }),

  // Validation
  setValidationConfig: (config) =>
    set((state) => ({
      validationConfig: { ...state.validationConfig, ...config },
    })),
  setValidationStatus: (status) => set({ validationStatus: status }),
  setValidationResult: (result) => set({ validationResult: result }),

  // AI
  addAIMessage: (message) =>
    set((state) => ({ aiMessages: [...state.aiMessages, message] })),
  clearAIMessages: () => set({ aiMessages: [WELCOME_MESSAGE] }),
}));
