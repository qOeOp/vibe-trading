/* Copyright 2026 Marimo. All rights reserved. */

import { PartyPopperIcon } from 'lucide-react';
import React from 'react';
import { scrollAndHighlightCell } from '@/features/lab/components/editor/links/cell-link';
import {
  useCellActions,
  useCellErrorSummaries,
} from '@/features/lab/core/cells/cells';
import type { CellId } from '@/features/lab/core/cells/ids';
import { useErrorDetailsActions } from '@/features/lab/core/errors/state';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { PanelEmptyState } from './empty-state';

const ErrorsPanel: React.FC = () => {
  const summaries = useCellErrorSummaries();
  const { showCellIfHidden } = useCellActions();
  const { openCellErrorDetails } = useErrorDetailsActions();

  const onClickSummary = React.useCallback(
    (cellId: CellId) => {
      // 1. Jump to cell in editor
      showCellIfHidden({ cellId });
      openCellErrorDetails(cellId);
      requestAnimationFrame(() => {
        scrollAndHighlightCell(cellId, 'destructive');
      });

      // 2. Open logs panel filtered to this cell (mutex closes file tree)
      useLabModeStore.getState().openLogsForCell(cellId);
    },
    [openCellErrorDetails, showCellIfHidden],
  );

  if (summaries.length === 0) {
    return <PanelEmptyState title="No errors!" icon={<PartyPopperIcon />} />;
  }

  return (
    <div className="flex flex-col h-full overflow-auto p-2 gap-2">
      {summaries.map((summary) => (
        <button
          type="button"
          key={`${summary.cellId}:${summary.errorType}`}
          className="w-full text-left rounded-md border bg-background px-3 py-2 hover:bg-muted/70 transition-colors"
          onClick={() => onClickSummary(summary.cellId)}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-mono font-semibold text-muted-foreground">
              {summary.cellName || summary.cellId}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {summary.errorType}
            </div>
          </div>
          <div className="text-sm font-medium leading-5 mt-1">
            {summary.headline}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {summary.lineHint != null
              ? `Line ${summary.lineHint}`
              : 'No line info'}
            {summary.count > 1 ? ` · ${summary.count} errors` : ''}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ErrorsPanel;
