/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — navigation state for temporarily shown code */

import { atom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import type { CellId } from '../../../core/cells/ids';
import { createReducerAndAtoms } from '../../../utils/createReducer';

type TemporarilyShownCodeState = Set<CellId>;

const {
  valueAtom: temporarilyShownCodeAtom,
  useActions: useTemporarilyShownCodeActions,
} = createReducerAndAtoms(() => new Set<CellId>(), {
  add: (state: TemporarilyShownCodeState, cellId: CellId) => {
    if (state.has(cellId)) {
      return state;
    }
    const newState = new Set(state);
    newState.add(cellId);
    return newState;
  },
  remove: (state: TemporarilyShownCodeState, cellId: CellId) => {
    if (!state.has(cellId)) {
      return state;
    }
    const newState = new Set(state);
    newState.delete(cellId);
    return newState;
  },
});

const createTemporarilyShownCodeAtom = (cellId: CellId) =>
  atom((get) => get(temporarilyShownCodeAtom).has(cellId));

export function useTemporarilyShownCode(cellId: CellId) {
  const a = useMemo(() => createTemporarilyShownCodeAtom(cellId), [cellId]);
  return useAtomValue(a);
}

export { temporarilyShownCodeAtom, useTemporarilyShownCodeActions };
