"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  acquireWorker,
  releaseWorker,
} from "../lib/pyodide-worker-singleton";
import { useLabCellStore } from "../store/use-lab-cell-store";
import {
  buildDependencyGraph,
  topologicalSort,
  getDownstreamCells,
} from "../lib/dependency-graph";
import type { PyodideWorkerOutMessage } from "../types";

/**
 * useCellExecution — Hook for cell-level Python execution
 *
 * Manages the lifecycle of the Pyodide worker:
 * - INIT + INJECT_VT_DATA on mount
 * - ANALYZE after each cell execution (AST → defines/uses)
 * - EXEC_CELL for single cell execution
 * - Reactive downstream re-execution via DAG
 */
export function useCellExecution() {
  const workerRef = useRef<Worker | null>(null);

  const setPyodideStatus = useLabCellStore((s) => s.setPyodideStatus);
  const setPyodideError = useLabCellStore((s) => s.setPyodideError);
  const setCellStatus = useLabCellStore((s) => s.setCellStatus);
  const appendCellOutput = useLabCellStore((s) => s.appendCellOutput);
  const clearCellOutput = useLabCellStore((s) => s.clearCellOutput);
  const setCellDefinesUses = useLabCellStore((s) => s.setCellDefinesUses);
  const appendConsoleOutput = useLabCellStore((s) => s.appendConsoleOutput);
  const incrementExecutionCounter = useLabCellStore(
    (s) => s.incrementExecutionCounter,
  );

  // ── Analyze a single cell ──

  const analyzeCell = useCallback((cellId: string) => {
    const worker = workerRef.current;
    const cell = useLabCellStore.getState().cells.find((c) => c.id === cellId);
    if (worker && cell) {
      worker.postMessage({
        type: "ANALYZE",
        code: cell.code,
        cellId: cell.id,
      });
    }
  }, []);

  // ── Worker message handler ──

  const handleMessage = useCallback(
    (event: MessageEvent<PyodideWorkerOutMessage>) => {
      const msg = event.data;

      switch (msg.type) {
        case "INIT_START":
          setPyodideStatus("loading");
          break;

        case "INIT_DONE":
          // After init, inject vt_data
          workerRef.current?.postMessage({ type: "INJECT_VT_DATA" });
          break;

        case "INIT_ERROR":
          setPyodideStatus("error");
          setPyodideError(msg.error);
          break;

        case "VT_DATA_INJECTED":
          setPyodideStatus("ready");
          break;

        case "VT_DATA_ERROR":
          setPyodideStatus("error");
          setPyodideError(msg.error);
          break;

        case "ANALYZE_DONE":
          setCellDefinesUses(
            msg.cellId,
            msg.result.defines,
            msg.result.uses,
          );
          break;

        case "ANALYZE_ERROR":
          // AST analysis failed — not critical, just log
          appendConsoleOutput({
            stream: "stderr",
            text: `[analyze] ${msg.error}`,
            timestamp: Date.now(),
            cellId: msg.cellId,
          });
          break;

        case "STDOUT":
          if ("cellId" in msg && msg.cellId) {
            appendCellOutput(msg.cellId, {
              stream: "stdout",
              text: msg.text,
              timestamp: Date.now(),
            });
            appendConsoleOutput({
              stream: "stdout",
              text: msg.text,
              timestamp: Date.now(),
              cellId: msg.cellId,
            });
          }
          break;

        case "STDERR":
          if ("cellId" in msg && msg.cellId) {
            appendCellOutput(msg.cellId, {
              stream: "stderr",
              text: msg.text,
              timestamp: Date.now(),
            });
            appendConsoleOutput({
              stream: "stderr",
              text: msg.text,
              timestamp: Date.now(),
              cellId: msg.cellId,
            });
          }
          break;

        case "CELL_DONE":
          setCellStatus(msg.cellId, "done");
          incrementExecutionCounter();
          // After execution, analyze the cell for defines/uses
          analyzeCell(msg.cellId);
          break;

        case "CELL_ERROR":
          setCellStatus(msg.cellId, "error");
          appendCellOutput(msg.cellId, {
            stream: "stderr",
            text: msg.traceback ?? msg.error,
            timestamp: Date.now(),
          });
          // Also analyze on error to update dependencies from syntactically correct code
          analyzeCell(msg.cellId);
          break;
      }
    },
    [
      setPyodideStatus,
      setPyodideError,
      setCellStatus,
      appendCellOutput,
      setCellDefinesUses,
      appendConsoleOutput,
      incrementExecutionCounter,
      analyzeCell,
    ],
  );

  // ── Worker lifecycle ──

  useEffect(() => {
    const worker = acquireWorker();
    workerRef.current = worker;
    worker.addEventListener("message", handleMessage);
    worker.postMessage({ type: "INIT" });

    return () => {
      worker.removeEventListener("message", handleMessage);
      workerRef.current = null;
      releaseWorker();
    };
  }, [handleMessage]);

  // ── Execute a single cell ──

  const executeCell = useCallback(
    (cellId: string) => {
      const worker = workerRef.current;
      if (!worker) return;

      const cell = useLabCellStore
        .getState()
        .cells.find((c) => c.id === cellId);
      if (!cell || !cell.code.trim()) return;

      clearCellOutput(cellId);
      setCellStatus(cellId, "running");

      worker.postMessage({
        type: "EXEC_CELL",
        code: cell.code,
        cellId: cell.id,
      });
    },
    [clearCellOutput, setCellStatus],
  );

  // ── Execute all cells in topological order ──

  const executeAllCells = useCallback(() => {
    const state = useLabCellStore.getState();
    const cells = state.cells;

    try {
      const graph = buildDependencyGraph(cells);
      const sorted = topologicalSort(
        graph,
        cells.map((c) => c.id),
      );

      // Execute sequentially in topological order
      // Each cell waits for CELL_DONE before the next executes
      // For now, fire them all — the worker executes sequentially
      for (const cellId of sorted) {
        executeCell(cellId);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setPyodideError(`Execution failed: ${message}`);
    }
  }, [executeCell, setPyodideError]);

  // ── Execute cell and downstream dependents ──

  const executeCellAndDownstream = useCallback(
    (cellId: string) => {
      const state = useLabCellStore.getState();
      const cells = state.cells;

      // Execute the target cell first
      executeCell(cellId);

      try {
        // Find and mark downstream cells as stale
        const graph = buildDependencyGraph(cells);
        const downstream = getDownstreamCells(graph, cellId);

        for (const downId of downstream) {
          setCellStatus(downId, "stale");
        }

        // Execute downstream in topological order
        if (downstream.size > 0) {
          const sorted = topologicalSort(graph, Array.from(downstream));
          for (const downId of sorted) {
            executeCell(downId);
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setPyodideError(`Execution failed: ${message}`);
      }
    },
    [executeCell, setCellStatus, setPyodideError],
  );

  return {
    executeCell,
    executeAllCells,
    executeCellAndDownstream,
    analyzeCell,
  };
}
