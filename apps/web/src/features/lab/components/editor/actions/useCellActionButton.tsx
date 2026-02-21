/* Copyright 2026 Marimo. All rights reserved. */
/**
 * Adapter: bridges CellActionsDropdown's interface to the real hook.
 *
 * CellActionsDropdown passes CellActionButtonProps (cellId, status, name,
 * config, hasOutput, hasConsoleOutput, getEditorView). The real hook in
 * hooks/use-cell-action-buttons.tsx needs config, status, and action
 * callbacks. This adapter provides marimo-native actions.
 */

import { useMemo } from 'react';
import type { EditorView } from '@codemirror/view';
import type { CellId } from '../../../core/cells/ids';
import type { CellData } from '../../../core/cells/types';
import type { RuntimeState } from '../../../core/network/types';
import type { ActionButton } from './types';
import {
  type CellActionCallbacks,
  useCellActionButtons as useRealCellActionButtons,
} from '../../../hooks/use-cell-action-buttons';
import { useRunCell } from '../cell/useRunCells';
import { useCellActions, useNotebook } from '../../../core/cells/cells';

export interface CellActionButtonProps
  extends Pick<CellData, 'name' | 'config'> {
  cellId: CellId;
  status: RuntimeState;
  hasOutput: boolean;
  hasConsoleOutput: boolean;
  getEditorView: () => EditorView | null;
}

interface Props {
  cell: CellActionButtonProps | null;
  closePopover?: () => void;
}

export function useCellActionButtons({ cell }: Props): ActionButton[][] {
  const cellId = (cell?.cellId ?? '') as CellId;
  const runCell = useRunCell(cellId || undefined);
  const marimoActions = useCellActions();
  const notebook = useNotebook();
  const cellCount = notebook.cellIds.inOrderIds.length;

  const actions: CellActionCallbacks = useMemo(
    () => ({
      setCellConfig: (id: string, config: Record<string, unknown>) => {
        marimoActions.updateCellConfig({
          cellId: id as CellId,
          config,
        });
      },
      createCellAbove: (id: string) => {
        marimoActions.createNewCell({
          cellId: id as CellId,
          before: true,
        });
      },
      createCellBelow: (id: string) => {
        marimoActions.createNewCell({
          cellId: id as CellId,
          before: false,
        });
      },
      moveCellUp: (id: string) => {
        marimoActions.moveCell({
          cellId: id as CellId,
          before: true,
        });
      },
      moveCellDown: (id: string) => {
        marimoActions.moveCell({
          cellId: id as CellId,
          before: false,
        });
      },
      sendToTop: (id: string) => {
        // Move up repeatedly until at top — marimo doesn't have "send to top"
        // Use moveCell with before=true (moves one position up)
        // For a proper "send to top", we'd need the index — approximate by moving up
        const ids = notebook.cellIds.inOrderIds;
        const idx = ids.indexOf(id as CellId);
        for (let i = 0; i < idx; i++) {
          marimoActions.moveCell({ cellId: id as CellId, before: true });
        }
      },
      sendToBottom: (id: string) => {
        const ids = notebook.cellIds.inOrderIds;
        const idx = ids.indexOf(id as CellId);
        for (let i = idx; i < ids.length - 1; i++) {
          marimoActions.moveCell({ cellId: id as CellId, before: false });
        }
      },
      clearConsoleOutput: (id: string) => {
        marimoActions.clearCellConsoleOutput({ cellId: id as CellId });
      },
      removeCell: (id: string) => {
        marimoActions.deleteCell({ cellId: id as CellId });
      },
    }),
    [marimoActions, notebook.cellIds],
  );

  const result = useRealCellActionButtons({
    cellId,
    canDelete: cellCount > 1,
    hasOutput: cell?.hasOutput ?? false,
    hasConsoleOutput: cell?.hasConsoleOutput ?? false,
    onRun: runCell,
    getEditorView: cell?.getEditorView,
    config: cell?.config ?? { disabled: false, hide_code: false },
    status: cell?.status ?? 'idle',
    actions,
  }) as unknown as ActionButton[][];

  if (!cell) return [];

  return result;
}
