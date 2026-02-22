"use client";

import { useCallback, useState } from "react";
import type { Row, Table } from "@tanstack/react-table";
import type { Factor } from "@/features/library/types";
import { useLibraryStore } from "@/features/library/store/use-library-store";

export function useFactorRowClick(table: Table<Factor>) {
  const selectedFactorId = useLibraryStore((s) => s.selectedFactorId);
  const selectFactor = useLibraryStore((s) => s.selectFactor);
  const selectedFactorIds = useLibraryStore((s) => s.selectedFactorIds);
  const selectAllFactors = useLibraryStore((s) => s.selectAllFactors);
  const toggleFactorSelection = useLibraryStore(
    (s) => s.toggleFactorSelection,
  );
  const clearSelection = useLibraryStore((s) => s.clearSelection);

  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  const handleRowClick = useCallback(
    (e: React.MouseEvent, row: Row<Factor>) => {
      // Skip clicks on grouped rows (they have their own toggle handler)
      if (row.getIsGrouped()) return;

      const factorId = row.original.id;

      if (e.metaKey || e.ctrlKey) {
        // Cmd/Ctrl+Click: toggle multi-select
        if (selectedFactorIds.size === 0) {
          selectFactor(null);
        }
        toggleFactorSelection(factorId);
      } else if (e.shiftKey && lastClickedId) {
        // Shift+Click: range select
        const rows = table
          .getRowModel()
          .rows.filter((r) => !r.getIsGrouped());
        const anchorIdx = rows.findIndex(
          (r) => r.original.id === lastClickedId,
        );
        const targetIdx = rows.findIndex((r) => r.original.id === factorId);
        if (anchorIdx >= 0 && targetIdx >= 0) {
          const start = Math.min(anchorIdx, targetIdx);
          const end = Math.max(anchorIdx, targetIdx);
          const rangeIds = rows
            .slice(start, end + 1)
            .map((r) => r.original.id);
          selectAllFactors(rangeIds);
        }
        selectFactor(null);
      } else {
        // Normal click: single select / toggle detail panel
        if (selectedFactorIds.size > 0) {
          clearSelection();
        }
        selectFactor(selectedFactorId === factorId ? null : factorId);
      }
      setLastClickedId(factorId);
    },
    [
      lastClickedId,
      selectedFactorId,
      selectedFactorIds.size,
      selectFactor,
      toggleFactorSelection,
      selectAllFactors,
      clearSelection,
      table,
    ],
  );

  return { handleRowClick, lastClickedId };
}
