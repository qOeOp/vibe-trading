/* Copyright 2026 Marimo. All rights reserved. */

import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { createReducerAndAtoms } from '@/features/lab/utils/createReducer';
import type { Identified } from '@/features/lab/utils/typed';
import { generateUUID } from '@/features/lab/utils/uuid';
import type { CellId } from '../cells/ids';
import type { Banner } from '../kernel/messages';

/**
 * Atom for storing kernel startup error message.
 * When set to a non-null value, shows a modal with the error details.
 */
export const kernelStartupErrorAtom = atom<string | null>(null);
const activeCellErrorDetailsAtom = atom<CellId | null>(null);

interface BannerState {
  banners: Identified<Banner>[];
}

const { valueAtom: bannersAtom, useActions } = createReducerAndAtoms(
  () => ({ banners: [] }) as BannerState,
  {
    addBanner: (state, banner: Banner) => {
      return {
        ...state,
        banners: [...state.banners, { ...banner, id: generateUUID() }],
      };
    },
    removeBanner: (state, id: string) => {
      return {
        ...state,
        banners: state.banners.filter((banner) => banner.id !== id),
      };
    },
    clearBanners: (state) => {
      return { ...state, banners: [] };
    },
  },
);

/**
 * React hook to get the Banner state.
 */
export const useBanners = () => useAtomValue(bannersAtom);

/**
 * React hook to get the Banners actions.
 */
export function useBannersActions() {
  return useActions();
}

/**
 * React hook to check whether a cell should show error details.
 * Details are only expanded for the currently focused error cell.
 */
export function useIsCellErrorDetailsOpen(cellId: CellId): boolean {
  const activeCellId = useAtomValue(activeCellErrorDetailsAtom);
  return activeCellId === cellId;
}

/**
 * React hook to manage the active error-details cell.
 */
export function useErrorDetailsActions() {
  const setActiveCell = useSetAtom(activeCellErrorDetailsAtom);

  const openCellErrorDetails = useCallback(
    (cellId: CellId) => setActiveCell(cellId),
    [setActiveCell],
  );

  const clearCellErrorDetails = useCallback(
    (cellId?: CellId) =>
      setActiveCell((prev) => {
        if (!cellId || prev === cellId) {
          return null;
        }
        return prev;
      }),
    [setActiveCell],
  );

  const clearAllCellErrorDetails = useCallback(
    () => setActiveCell(null),
    [setActiveCell],
  );

  return useMemo(
    () => ({
      openCellErrorDetails,
      clearCellErrorDetails,
      clearAllCellErrorDetails,
    }),
    [openCellErrorDetails, clearCellErrorDetails, clearAllCellErrorDetails],
  );
}
