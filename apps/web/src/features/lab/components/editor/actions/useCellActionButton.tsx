/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — exports match Marimo's useCellActionButton */

import type { EditorView } from '@codemirror/view';
import type { CellId } from '../../../core/cells/ids';
import type { CellData } from '../../../core/cells/types';
import type { RuntimeState, CellConfig } from '../../../core/network/types';
import type { ActionButton } from './types';

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

export function useCellActionButtons(_props: Props): ActionButton[][] {
  // Stub: returns empty action groups
  return [];
}
