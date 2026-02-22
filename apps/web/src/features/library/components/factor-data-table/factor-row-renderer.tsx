"use client";

import { useMemo, useState, useCallback } from "react";
import { flexRender } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import {
  GitCompare,
  Download,
  ArrowRightLeft,
  X,
} from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Factor, FactorLifecycleStatus } from "@/features/library/types";
import { useLibraryStore } from "@/features/library/store/use-library-store";
import { StatusChangeDialog } from "../status-change-dialog";
import { ComparisonPanel } from "../comparison-panel";
import { exportAsCSV, exportAsJSON } from "@/features/library/utils/export-factors";
import { NameCell } from "./factor-cell-renderers";
import { TypeIconCell } from "./factor-columns";
import { FactorActionsCell } from "./factor-actions-cell";

// ─── Inline Batch Toolbar ───────────────────────────────

function InlineBatchToolbar({ factors }: { factors: Factor[] }) {
  const selectedFactorIds = useLibraryStore((s) => s.selectedFactorIds);
  const clearSelection = useLibraryStore((s) => s.clearSelection);
  const toggleFactorSelection = useLibraryStore(
    (s) => s.toggleFactorSelection,
  );
  const batchUpdateStatus = useLibraryStore((s) => s.batchUpdateStatus);

  const [exportOpen, setExportOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const selectedFactors = useMemo(
    () => factors.filter((f) => selectedFactorIds.has(f.id)),
    [factors, selectedFactorIds],
  );

  const count = selectedFactorIds.size;
  const representativeFactor = selectedFactors[0] ?? null;

  const handleExportCSV = useCallback(() => {
    exportAsCSV(selectedFactors);
    setExportOpen(false);
  }, [selectedFactors]);

  const handleExportJSON = useCallback(() => {
    exportAsJSON(selectedFactors);
    setExportOpen(false);
  }, [selectedFactors]);

  const handleStatusConfirm = useCallback(
    (targetStatus: FactorLifecycleStatus, reason: string) => {
      batchUpdateStatus(
        Array.from(selectedFactorIds),
        targetStatus,
        reason,
      );
      setStatusDialogOpen(false);
    },
    [batchUpdateStatus, selectedFactorIds],
  );

  const handleRemoveFromComparison = useCallback(
    (factorId: string) => {
      toggleFactorSelection(factorId);
      if (selectedFactorIds.size - 1 < 2) {
        setCompareOpen(false);
      }
    },
    [toggleFactorSelection, selectedFactorIds.size],
  );

  return (
    <>
      {/* Inline glassmorphism toolbar */}
      <div
        className="inline-flex items-center gap-0.5 ml-2 shrink-0 bg-white/60 backdrop-blur-sm border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.06)] rounded-full px-1.5 py-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Count badge */}
        <span className="text-[9px] font-semibold text-mine-accent-teal tabular-nums px-1">
          {count}选
        </span>

        <div className="w-px h-3 bg-mine-border/40" />

        {/* Compare */}
        <button
          type="button"
          disabled={count < 2}
          onClick={() => setCompareOpen(true)}
          className="flex items-center justify-center w-5 h-5 rounded-full text-mine-muted hover:text-mine-text hover:bg-white/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="对比"
        >
          <GitCompare className="w-3 h-3" />
        </button>

        {/* Export */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center justify-center w-5 h-5 rounded-full text-mine-muted hover:text-mine-text hover:bg-white/80 transition-all"
            title="导出"
          >
            <Download className="w-3 h-3" />
          </button>
          {exportOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg border border-mine-border rounded-lg py-1 min-w-[100px] z-50">
              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full text-left px-3 py-1.5 text-[11px] text-mine-text hover:bg-mine-bg transition-colors"
              >
                CSV
              </button>
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full text-left px-3 py-1.5 text-[11px] text-mine-text hover:bg-mine-bg transition-colors"
              >
                JSON
              </button>
            </div>
          )}
        </div>

        {/* Status change */}
        <button
          type="button"
          onClick={() => setStatusDialogOpen(true)}
          className="flex items-center justify-center w-5 h-5 rounded-full text-mine-muted hover:text-mine-text hover:bg-white/80 transition-all"
          title="批量状态变更"
        >
          <ArrowRightLeft className="w-3 h-3" />
        </button>

        <div className="w-px h-3 bg-mine-border/40" />

        {/* Clear */}
        <button
          type="button"
          onClick={clearSelection}
          className="flex items-center justify-center w-5 h-5 rounded-full text-mine-muted hover:text-mine-text hover:bg-white/80 transition-all"
          title="清除选择"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Dialogs (portaled, not inline) */}
      {representativeFactor && (
        <StatusChangeDialog
          factor={representativeFactor}
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          onConfirm={handleStatusConfirm}
        />
      )}
      <ComparisonPanel
        factors={selectedFactors}
        open={compareOpen}
        onOpenChange={setCompareOpen}
        onRemoveFactor={handleRemoveFromComparison}
      />
    </>
  );
}

// ─── Factor Row Renderer ────────────────────────────────

interface FactorRowRendererProps {
  rows: Row<Factor>[];
  factors: Factor[];
  lastClickedId: string | null;
  handleRowClick: (e: React.MouseEvent, row: Row<Factor>) => void;
}

export function FactorRowRenderer({
  rows,
  factors,
  lastClickedId,
  handleRowClick,
}: FactorRowRendererProps) {
  const selectedFactorId = useLibraryStore((s) => s.selectedFactorId);
  const selectedFactorIds = useLibraryStore((s) => s.selectedFactorIds);
  const toggleFactorSelection = useLibraryStore(
    (s) => s.toggleFactorSelection,
  );

  const leafColumnCount = rows[0]
    ? rows[0].getVisibleCells().length
    : 1;

  // Determine which row shows the inline toolbar
  const showToolbarForId =
    selectedFactorIds.size >= 2 ? lastClickedId : null;

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={leafColumnCount}
          className="h-24 text-center text-mine-muted text-sm"
        >
          暂无数据
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {rows.map((row) => {
        // ── Data row ──
        const factor = row.original;
        const isDetailActive = selectedFactorId === factor.id;
        const isBatchSelected = selectedFactorIds.has(factor.id);
        const isProbation = factor.status === "PROBATION";
        const isRetired = factor.status === "RETIRED";
        const isToolbarRow = showToolbarForId === factor.id;

        return (
          <TableRow
            key={row.id}
            data-state={isBatchSelected ? "selected" : undefined}
            onClick={(e) => handleRowClick(e, row)}
            className={cn(
              "group/row cursor-pointer",
              isDetailActive && "bg-muted",
              isProbation && "border-l-2 border-l-yellow-500",
              isRetired && "opacity-50",
            )}
          >
            {row.getVisibleCells().map((cell) => {
              // Skip aggregated cells
              if (cell.getIsAggregated()) return null;

              // ── Type icon / checkbox column ──
              if (cell.column.id === "type") {
                return (
                  <TableCell
                    key={cell.id}
                    className="[&:has([role=checkbox])]:pr-0"
                  >
                    <TypeIconCell
                      factorType={factor.factorType}
                      isSelected={isBatchSelected}
                      onToggle={() => toggleFactorSelection(factor.id)}
                    />
                  </TableCell>
                );
              }

              // ── Name column (custom rendering) ──
              if (cell.column.id === "name") {
                return (
                  <TableCell
                    key={cell.id}
                    className="overflow-hidden"
                  >
                    <NameCell
                      factor={factor}
                      showToolbar={isToolbarRow}
                      toolbarNode={
                        isToolbarRow ? (
                          <InlineBatchToolbar factors={factors} />
                        ) : undefined
                      }
                    />
                  </TableCell>
                );
              }

              // ── Actions column (center-aligned icon buttons) ──
              if (cell.column.id === "actions") {
                return (
                  <TableCell key={cell.id} className="text-center">
                    <FactorActionsCell factor={factor} />
                  </TableCell>
                );
              }

              // ── Default cell rendering ──
              const cellAlign = (cell.column.columnDef.meta as Record<string, unknown> | undefined)?.align;
              return (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "overflow-hidden",
                    cellAlign === "right" && "text-right px-1 py-2",
                    cellAlign === "center" && "text-center px-1 py-2",
                  )}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </>
  );
}
