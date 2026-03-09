'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, GitCompare, Download } from 'lucide-react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from '@/components/ui/toolbar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Factor, FactorLifecycleStatus } from '../types';
import { useLibraryStore } from '../store/use-library-store';
import { StatusChangeDialog } from './status-change-dialog';
import { ComparisonPanel } from './comparison-panel';
import { exportAsCSV, exportAsJSON } from '../utils/export-factors';

interface BatchToolbarProps {
  factors: Factor[];
}

export function BatchToolbar({ factors }: BatchToolbarProps) {
  const selectedFactorIds = useLibraryStore((s) => s.selectedFactorIds);
  const clearSelection = useLibraryStore((s) => s.clearSelection);
  const toggleFactorSelection = useLibraryStore((s) => s.toggleFactorSelection);
  const batchUpdateStatus = useLibraryStore((s) => s.batchUpdateStatus);

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
  }, [selectedFactors]);

  const handleExportJSON = useCallback(() => {
    exportAsJSON(selectedFactors);
  }, [selectedFactors]);

  const handleStatusConfirm = useCallback(
    (targetStatus: FactorLifecycleStatus, reason: string) => {
      batchUpdateStatus(Array.from(selectedFactorIds), targetStatus, reason);
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
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
        >
          <Toolbar
            data-slot="batch-toolbar"
            className="bg-white shadow-lg border border-mine-border rounded-xl px-4 py-2.5 gap-3"
          >
            {/* Count label */}
            <span className="text-[11px] text-mine-muted whitespace-nowrap">
              已选中{' '}
              <span className="numeric font-semibold text-mine-text">
                {count}
              </span>{' '}
              个因子
            </span>

            <ToolbarSeparator />

            {/* Compare button */}
            <ToolbarButton
              disabled={count < 2}
              onClick={() => setCompareOpen(true)}
            >
              <GitCompare className="w-3.5 h-3.5" />
              对比
            </ToolbarButton>

            {/* Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ToolbarButton>
                  <Download className="w-3.5 h-3.5" />
                  导出
                </ToolbarButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuItem onSelect={handleExportCSV}>
                  导出 CSV
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleExportJSON}>
                  导出 JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status change button */}
            <ToolbarButton onClick={() => setStatusDialogOpen(true)}>
              <ArrowRightLeft className="w-3.5 h-3.5" />
              状态变更
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Clear selection */}
            <ToolbarButton
              onClick={clearSelection}
              className="w-6 h-6 p-0 border-0 justify-center text-mine-muted hover:text-mine-text"
            >
              <X className="w-3.5 h-3.5" />
            </ToolbarButton>
          </Toolbar>
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
