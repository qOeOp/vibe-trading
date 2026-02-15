"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ArrowRightLeft, GitCompare, Download } from "lucide-react";
import type { Factor, FactorLifecycleStatus } from "../types";
import { useLibraryStore } from "../store/use-library-store";
import { StatusChangeDialog } from "./status-change-dialog";
import { ComparisonPanel } from "./comparison-panel";
import { exportAsCSV, exportAsJSON } from "../utils/export-factors";

interface BatchToolbarProps {
  factors: Factor[];
}

export function BatchToolbar({ factors }: BatchToolbarProps) {
  const selectedFactorIds = useLibraryStore((s) => s.selectedFactorIds);
  const clearSelection = useLibraryStore((s) => s.clearSelection);
  const toggleFactorSelection = useLibraryStore((s) => s.toggleFactorSelection);
  const batchUpdateStatus = useLibraryStore((s) => s.batchUpdateStatus);

  const [exportOpen, setExportOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const selectedFactors = useMemo(
    () => factors.filter((f) => selectedFactorIds.has(f.id)),
    [factors, selectedFactorIds],
  );

  const count = selectedFactorIds.size;

  // Use the first selected factor as a representative for the StatusChangeDialog
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
      // Close comparison panel when fewer than 2 factors remain
      if (selectedFactorIds.size <= 2) {
        setCompareOpen(false);
      }
    },
    [toggleFactorSelection, selectedFactorIds.size],
  );

  if (count === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white shadow-lg border border-mine-border rounded-xl px-4 py-2.5 flex items-center gap-3"
        >
          {/* Count label */}
          <span className="text-[11px] text-mine-muted whitespace-nowrap">
            已选中 <span className="font-mono tabular-nums font-semibold text-mine-text">{count}</span> 个因子
          </span>

          <div className="w-px h-4 bg-mine-border" />

          {/* Compare button */}
          <button
            type="button"
            disabled={count < 2}
            onClick={() => setCompareOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-mine-border transition-all disabled:opacity-40 disabled:cursor-not-allowed text-mine-text hover:bg-mine-bg"
          >
            <GitCompare className="w-3.5 h-3.5" />
            对比
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-mine-border transition-all text-mine-text hover:bg-mine-bg"
            >
              <Download className="w-3.5 h-3.5" />
              导出
              <ChevronDown className="w-3 h-3" />
            </button>
            {exportOpen && (
              <div className="absolute bottom-full left-0 mb-1.5 bg-white shadow-lg border border-mine-border rounded-lg py-1 min-w-[120px] z-50">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full text-left px-3 py-1.5 text-[11px] text-mine-text hover:bg-mine-bg transition-colors"
                >
                  导出 CSV
                </button>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full text-left px-3 py-1.5 text-[11px] text-mine-text hover:bg-mine-bg transition-colors"
                >
                  导出 JSON
                </button>
              </div>
            )}
          </div>

          {/* Status change button */}
          <button
            type="button"
            onClick={() => setStatusDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-mine-border transition-all text-mine-text hover:bg-mine-bg"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            状态变更
          </button>

          <div className="w-px h-4 bg-mine-border" />

          {/* Clear selection */}
          <button
            type="button"
            onClick={clearSelection}
            className="flex items-center justify-center w-6 h-6 rounded-md text-mine-muted hover:text-mine-text hover:bg-mine-bg transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Status change dialog — uses first selected factor as representative */}
      {representativeFactor && (
        <StatusChangeDialog
          factor={representativeFactor}
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          onConfirm={handleStatusConfirm}
        />
      )}

      {/* Comparison panel — requires 2+ selected factors */}
      <ComparisonPanel
        factors={selectedFactors}
        open={compareOpen}
        onOpenChange={setCompareOpen}
        onRemoveFactor={handleRemoveFromComparison}
      />
    </>
  );
}
