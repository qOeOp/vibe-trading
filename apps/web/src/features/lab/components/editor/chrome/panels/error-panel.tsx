/* Copyright 2026 Marimo. All rights reserved. */

import { FileTextIcon, PartyPopperIcon } from 'lucide-react';
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

export const ErrorsPanel: React.FC = () => {
  const summaries = useCellErrorSummaries();
  const { showCellIfHidden } = useCellActions();
  const { openCellErrorDetails } = useErrorDetailsActions();

  const onClickSummary = React.useCallback(
    (cellId: CellId) => {
      showCellIfHidden({ cellId });
      openCellErrorDetails(cellId);
      requestAnimationFrame(() => {
        scrollAndHighlightCell(cellId, 'destructive');
      });
    },
    [openCellErrorDetails, showCellIfHidden],
  );

  const onViewLogs = React.useCallback(
    (e: React.MouseEvent, cellId: CellId) => {
      e.stopPropagation();
      useLabModeStore.getState().openLogsForCell(cellId);
    },
    [],
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
          className="w-full text-left rounded-md border bg-mine-page-bg px-3 py-2 hover:bg-mine-hover/70 transition-colors"
          onClick={() => onClickSummary(summary.cellId)}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-mono font-semibold text-mine-muted">
              {summary.cellName || summary.cellId}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-mine-muted">
              {summary.errorType}
            </div>
          </div>
          <div className="text-sm font-medium leading-5 mt-1">
            {summary.headline}
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-mine-muted">
              {summary.lineHint != null
                ? `Line ${summary.lineHint}`
                : 'No line info'}
              {summary.count > 1 ? ` · ${summary.count} errors` : ''}
            </div>
            <span
              role="link"
              className="inline-flex items-center gap-1 text-[10px] text-mine-accent-teal hover:underline"
              onClick={(e) => onViewLogs(e, summary.cellId)}
            >
              <FileTextIcon className="size-3" />
              View logs
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
