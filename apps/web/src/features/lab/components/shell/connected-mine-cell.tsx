'use client';

import { useCallback } from 'react';
import { useLabCellStore } from '@/features/lab/store/use-lab-cell-store';
import { MineCell } from './mine-cell';
import { MineCodeEditor } from './mine-code-editor';
import { OutputArea } from '../cell/output-area';

// ─── Connected Mine Cell ─────────────────────────────────
//
// Bridges MineCell visual shell ↔ Zustand store.
// One component per cell in the connected notebook view.

type ConnectedMineCellProps = {
  cellId: string;
  /** Whether this cell grows to fill available space */
  flex?: boolean;
  className?: string;
};

function ConnectedMineCell({
  cellId,
  flex,
  className,
}: ConnectedMineCellProps) {
  // ── Store selectors ──
  const activeCellId = useLabCellStore((s) => s.activeCellId);
  const cellData = useLabCellStore((s) => s.cellData[cellId]);
  const cellRuntime = useLabCellStore((s) => s.cellRuntime[cellId]);

  // ── Actions ──
  const setCellCode = useLabCellStore((s) => s.setCellCode);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);
  const prepareForRun = useLabCellStore((s) => s.prepareForRun);
  const interruptCell = useLabCellStore((s) => s.interruptCell);
  const foldCell = useLabCellStore((s) => s.foldCell);
  const removeCell = useLabCellStore((s) => s.removeCell);

  const isActive = activeCellId === cellId;
  const isRunning =
    cellRuntime?.status === 'running' || cellRuntime?.status === 'queued';
  const code = cellData?.code ?? '';

  // ── Callbacks ──
  const handleCodeChange = useCallback(
    (newCode: string) => setCellCode(cellId, newCode),
    [cellId, setCellCode],
  );

  const handleRun = useCallback(
    () => prepareForRun(cellId),
    [cellId, prepareForRun],
  );

  const handleStop = useCallback(
    () => interruptCell(cellId),
    [cellId, interruptCell],
  );

  const handleHideCode = useCallback(
    () => foldCell(cellId),
    [cellId, foldCell],
  );

  const handleDelete = useCallback(
    () => removeCell(cellId),
    [cellId, removeCell],
  );

  const handleFocus = useCallback(
    () => setActiveCellId(cellId),
    [cellId, setActiveCellId],
  );

  // ── Execute keybindings ──
  const handleExecute = useCallback(() => {
    prepareForRun(cellId);
    // TODO: focus next cell
  }, [cellId, prepareForRun]);

  const handleExecuteAndStay = useCallback(() => {
    prepareForRun(cellId);
  }, [cellId, prepareForRun]);

  if (!cellData) return null;

  return (
    <MineCell
      flex={flex}
      isActive={isActive}
      isRunning={isRunning}
      onRun={handleRun}
      onStop={handleStop}
      onHideCode={handleHideCode}
      onDelete={handleDelete}
      className={className}
      output={
        <OutputArea
          output={cellRuntime?.output ?? null}
          consoleOutputs={cellRuntime?.consoleOutputs ?? []}
          cellId={cellId}
          stale={cellRuntime?.staleInputs}
          loading={isRunning}
        />
      }
    >
      {cellData.config.hide_code ? null : (
        <MineCodeEditor
          code={code}
          onChange={handleCodeChange}
          onExecute={handleExecute}
          onExecuteAndStay={handleExecuteAndStay}
          onFocus={handleFocus}
        />
      )}
    </MineCell>
  );
}

export { ConnectedMineCell };
