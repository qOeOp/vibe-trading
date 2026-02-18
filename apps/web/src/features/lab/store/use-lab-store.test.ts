/**
 * use-lab-store.test.ts — TDD tests for the cell-based lab store
 *
 * Tests cell CRUD, status management, sidebar panel state,
 * and console output management.
 */

import { act } from "@testing-library/react";

// We'll test the new cell-based store
import { useLabCellStore } from "./use-lab-cell-store";

// Helper: reset store between tests
function resetStore() {
  useLabCellStore.setState(useLabCellStore.getInitialState());
}

beforeEach(() => {
  resetStore();
});

// --- Cell CRUD ---

describe("cell management", () => {
  it("starts with one empty cell", () => {
    const state = useLabCellStore.getState();
    expect(state.cells).toHaveLength(1);
    expect(state.cells[0].code).toBe("");
    expect(state.cells[0].status).toBe("idle");
    expect(state.activeCellId).toBe(state.cells[0].id);
  });

  it("adds a cell at the end when no afterCellId given", () => {
    const state = useLabCellStore.getState();
    const firstId = state.cells[0].id;

    act(() => {
      useLabCellStore.getState().addCell();
    });

    const after = useLabCellStore.getState();
    expect(after.cells).toHaveLength(2);
    expect(after.cells[0].id).toBe(firstId);
    // New cell becomes active
    expect(after.activeCellId).toBe(after.cells[1].id);
  });

  it("adds a cell after a specific cell", () => {
    // Start with 1 cell, add two more
    act(() => {
      useLabCellStore.getState().addCell();
      useLabCellStore.getState().addCell();
    });

    const state = useLabCellStore.getState();
    expect(state.cells).toHaveLength(3);
    const middleId = state.cells[1].id;

    // Insert after the first cell (before the second)
    act(() => {
      useLabCellStore.getState().addCell(state.cells[0].id);
    });

    const after = useLabCellStore.getState();
    expect(after.cells).toHaveLength(4);
    // The new cell should be at index 1
    expect(after.cells[1].id).not.toBe(middleId);
    // The old middle cell should now be at index 2
    expect(after.cells[2].id).toBe(middleId);
  });

  it("removes a cell and adjusts active cell", () => {
    act(() => {
      useLabCellStore.getState().addCell();
      useLabCellStore.getState().addCell();
    });

    const state = useLabCellStore.getState();
    const secondId = state.cells[1].id;
    const thirdId = state.cells[2].id;

    // Set active to second, then remove it
    act(() => {
      useLabCellStore.getState().setActiveCellId(secondId);
      useLabCellStore.getState().removeCell(secondId);
    });

    const after = useLabCellStore.getState();
    expect(after.cells).toHaveLength(2);
    // Active should move to the next cell (third, now at index 1)
    expect(after.activeCellId).toBe(thirdId);
  });

  it("does not remove the last remaining cell", () => {
    const state = useLabCellStore.getState();
    const onlyId = state.cells[0].id;

    act(() => {
      useLabCellStore.getState().removeCell(onlyId);
    });

    expect(useLabCellStore.getState().cells).toHaveLength(1);
  });

  it("moves a cell up", () => {
    act(() => {
      useLabCellStore.getState().addCell();
      useLabCellStore.getState().addCell();
    });

    const state = useLabCellStore.getState();
    const ids = state.cells.map((c) => c.id);

    act(() => {
      useLabCellStore.getState().moveCellUp(ids[2]);
    });

    const after = useLabCellStore.getState();
    expect(after.cells.map((c) => c.id)).toEqual([ids[0], ids[2], ids[1]]);
  });

  it("does not move the first cell up", () => {
    act(() => {
      useLabCellStore.getState().addCell();
    });

    const state = useLabCellStore.getState();
    const ids = state.cells.map((c) => c.id);

    act(() => {
      useLabCellStore.getState().moveCellUp(ids[0]);
    });

    const after = useLabCellStore.getState();
    expect(after.cells.map((c) => c.id)).toEqual(ids);
  });

  it("moves a cell down", () => {
    act(() => {
      useLabCellStore.getState().addCell();
      useLabCellStore.getState().addCell();
    });

    const state = useLabCellStore.getState();
    const ids = state.cells.map((c) => c.id);

    act(() => {
      useLabCellStore.getState().moveCellDown(ids[0]);
    });

    const after = useLabCellStore.getState();
    expect(after.cells.map((c) => c.id)).toEqual([ids[1], ids[0], ids[2]]);
  });
});

// --- Cell Code & Status ---

describe("cell code and status", () => {
  it("sets cell code", () => {
    const cellId = useLabCellStore.getState().cells[0].id;

    act(() => {
      useLabCellStore.getState().setCellCode(cellId, "x = 42");
    });

    expect(useLabCellStore.getState().cells[0].code).toBe("x = 42");
  });

  it("sets cell status", () => {
    const cellId = useLabCellStore.getState().cells[0].id;

    act(() => {
      useLabCellStore.getState().setCellStatus(cellId, "running");
    });

    expect(useLabCellStore.getState().cells[0].status).toBe("running");
  });

  it("sets cell defines and uses", () => {
    const cellId = useLabCellStore.getState().cells[0].id;

    act(() => {
      useLabCellStore
        .getState()
        .setCellDefinesUses(cellId, ["factor"], ["close", "delay"]);
    });

    const cell = useLabCellStore.getState().cells[0];
    expect(cell.defines).toEqual(["factor"]);
    expect(cell.uses).toEqual(["close", "delay"]);
  });
});

// --- Cell Output ---

describe("cell output", () => {
  it("appends output to a cell", () => {
    const cellId = useLabCellStore.getState().cells[0].id;

    act(() => {
      useLabCellStore.getState().appendCellOutput(cellId, {
        stream: "stdout",
        text: "hello",
        timestamp: 1000,
      });
    });

    expect(useLabCellStore.getState().cells[0].outputs).toHaveLength(1);
    expect(useLabCellStore.getState().cells[0].outputs[0].text).toBe("hello");
  });

  it("clears cell output", () => {
    const cellId = useLabCellStore.getState().cells[0].id;

    act(() => {
      useLabCellStore.getState().appendCellOutput(cellId, {
        stream: "stdout",
        text: "hello",
        timestamp: 1000,
      });
      useLabCellStore.getState().clearCellOutput(cellId);
    });

    expect(useLabCellStore.getState().cells[0].outputs).toHaveLength(0);
  });
});

// --- Sidebar Panel ---

describe("sidebar panel", () => {
  it("defaults to null (no overlay)", () => {
    expect(useLabCellStore.getState().sidebarPanel).toBeNull();
  });

  it("sets sidebar panel", () => {
    act(() => {
      useLabCellStore.getState().setSidebarPanel("data");
    });

    expect(useLabCellStore.getState().sidebarPanel).toBe("data");
  });

  it("closes sidebar panel by setting null", () => {
    act(() => {
      useLabCellStore.getState().setSidebarPanel("data");
      useLabCellStore.getState().setSidebarPanel(null);
    });

    expect(useLabCellStore.getState().sidebarPanel).toBeNull();
  });

  it("toggles sidebar panel (open→close same panel)", () => {
    act(() => {
      useLabCellStore.getState().toggleSidebarPanel("data");
    });
    expect(useLabCellStore.getState().sidebarPanel).toBe("data");

    act(() => {
      useLabCellStore.getState().toggleSidebarPanel("data");
    });
    expect(useLabCellStore.getState().sidebarPanel).toBeNull();
  });

  it("toggles sidebar panel (switch panels)", () => {
    act(() => {
      useLabCellStore.getState().toggleSidebarPanel("data");
    });
    expect(useLabCellStore.getState().sidebarPanel).toBe("data");

    act(() => {
      useLabCellStore.getState().toggleSidebarPanel("snippets");
    });
    expect(useLabCellStore.getState().sidebarPanel).toBe("snippets");
  });
});

// --- Console Output ---

describe("console output", () => {
  it("appends console output", () => {
    act(() => {
      useLabCellStore.getState().appendConsoleOutput({
        stream: "stdout",
        text: "global output",
        timestamp: 1000,
      });
    });

    expect(useLabCellStore.getState().consoleOutput).toHaveLength(1);
  });

  it("clears console output", () => {
    act(() => {
      useLabCellStore.getState().appendConsoleOutput({
        stream: "stdout",
        text: "output",
        timestamp: 1000,
      });
      useLabCellStore.getState().clearConsoleOutput();
    });

    expect(useLabCellStore.getState().consoleOutput).toHaveLength(0);
  });
});

// --- Execution Counter ---

describe("execution counter", () => {
  it("starts at 0", () => {
    expect(useLabCellStore.getState().executionCounter).toBe(0);
  });

  it("increments execution counter", () => {
    act(() => {
      useLabCellStore.getState().incrementExecutionCounter();
    });

    expect(useLabCellStore.getState().executionCounter).toBe(1);
  });
});
