/* Copyright 2026 Marimo. All rights reserved. */

import { useAtomValue } from "jotai";
import { maybeAddAltairImport } from "@/features/lab/core/cells/add-missing-import";
import { useCellActions } from "@/features/lab/core/cells/cells";
import { useLastFocusedCellId } from "@/features/lab/core/cells/focus";
import { autoInstantiateAtom } from "@/features/lab/core/config/config";

export function useAddCodeToNewCell(): (code: string) => void {
  const autoInstantiate = useAtomValue(autoInstantiateAtom);
  const lastFocusedCellId = useLastFocusedCellId();
  const { createNewCell } = useCellActions();

  return (code: string) => {
    if (code.includes("alt")) {
      maybeAddAltairImport({
        autoInstantiate,
        createNewCell,
        fromCellId: lastFocusedCellId,
      });
    }

    createNewCell({
      code: code,
      before: false,
      cellId: lastFocusedCellId ?? "__end__",
    });
  };
}
