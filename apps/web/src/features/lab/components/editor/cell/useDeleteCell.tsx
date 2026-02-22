/* Copyright 2026 Marimo. All rights reserved. */

import useEvent from "react-use-event-hook";
import { UndoButton } from "@/features/lab/components/buttons/undo-button";
import { toast } from "@/features/lab/components/ui/use-toast";
import {
  hasOnlyOneCellAtom,
  notebookAtom,
  useCellActions,
} from "@/features/lab/core/cells/cells";
import type { CellId } from "@/features/lab/core/cells/ids";
import { useRequestClient } from "@/features/lab/core/network/requests";
import { store } from "@/features/lab/core/state/jotai";

export function useDeleteCellCallback() {
  const { deleteCell, undoDeleteCell } = useCellActions();
  const { sendDeleteCell } = useRequestClient();

  return useEvent((opts: { cellId: CellId }) => {
    // Can't delete the last cell
    if (store.get(hasOnlyOneCellAtom)) {
      return;
    }

    const { cellId } = opts;
    const notebook = store.get(notebookAtom);
    const isEmptyCell = (notebook.cellData[cellId]?.code ?? "").trim() === "";

    // Optimistic update
    deleteCell({ cellId });
    sendDeleteCell({ cellId: cellId }).catch(() => {
      // Fall back on failure
      undoDeleteCell();
    });

    if (!isEmptyCell) {
      const { dismiss } = toast({
        title: "Cell deleted",
        description:
          "You can bring it back by clicking undo or through the command palette.",
        action: (
          <UndoButton
            data-testid="undo-delete-button"
            onClick={() => {
              undoDeleteCell();
              dismiss();
            }}
          />
        ),
      });
    }
  });
}

export function useDeleteManyCellsCallback() {
  const { deleteCell, undoDeleteCell } = useCellActions();
  const { sendDeleteCell } = useRequestClient();

  return useEvent(async (opts: { cellIds: CellId[] }) => {
    // Can't delete the last cell
    if (store.get(hasOnlyOneCellAtom)) {
      return;
    }

    const { cellIds } = opts;
    for (const cellId of cellIds) {
      await sendDeleteCell({ cellId }).then(() => {
        deleteCell({ cellId });
      });
    }

    const { dismiss } = toast({
      title: "Cells deleted",
      action: (
        <UndoButton
          data-testid="undo-delete-button"
          onClick={() => {
            for (const _cellId of cellIds) {
              // This function does not take a cellId,
              // so we just undo the number of cells that were deleted
              undoDeleteCell();
            }
            dismiss();
          }}
        />
      ),
    });
  });
}
