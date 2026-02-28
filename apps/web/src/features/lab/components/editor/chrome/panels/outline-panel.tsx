/* Copyright 2026 Marimo. All rights reserved. */

import { useAtomValue } from 'jotai';
import { ScrollTextIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import {
  notebookOutline,
  useCellIds,
  useNotebook,
} from '@/features/lab/core/cells/cells';
import type { CellId } from '@/features/lab/core/cells/ids';
import { isInternalCellName } from '@/features/lab/core/cells/names';
import { PanelEmptyState } from './empty-state';
import { cn } from '@/features/lab/utils/cn';

import './outline-panel.css';
import { OutlineList } from './outline/outline-list';
import {
  findOutlineElements,
  useActiveOutline,
} from './outline/useActiveOutline';
import {
  PanelBar,
  PanelBody,
  PanelRow,
  PanelEmpty,
  PanelBadge,
  PanelText,
  usePanelV2,
} from '../../../panel-primitives';

const OutlinePanel: React.FC = () => {
  const { items } = useAtomValue(notebookOutline);
  const headerElements = useMemo(() => findOutlineElements(items), [items]);
  const { activeHeaderId, activeOccurrences } =
    useActiveOutline(headerElements);

  if (items.length > 0) {
    return (
      <OutlineList
        items={items}
        activeHeaderId={activeHeaderId}
        activeOccurrences={activeOccurrences}
      />
    );
  }

  return <CellListFallback />;
};

export default OutlinePanel;

// ─── Cell List Fallback ──────────────────────────────

function CellListFallback() {
  const [isV2] = usePanelV2('outline-panel');
  return isV2 ? <CellListV2 /> : <CellListV1 />;
}

// ─── V2 (primitives) ────────────────────────────────────

function CellListV2() {
  const cellIds = useCellIds();
  const { cellData, cellRuntime } = useNotebook();
  const [isV2, toggleV2] = usePanelV2('outline-panel');

  if (cellIds.inOrderIds.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <PanelBar title="Cells" v2={{ active: isV2, onToggle: toggleV2 }} />
        <PanelBody>
          <PanelEmpty
            title="No cells"
            description="Add cells to your notebook to see an outline."
            icon={<ScrollTextIcon />}
          />
        </PanelBody>
      </div>
    );
  }

  return (
    <div data-slot="cell-list-outline" className="flex flex-col overflow-auto">
      <PanelBar
        title="Cells"
        badge={<PanelBadge>{cellIds.inOrderIds.length}</PanelBadge>}
        v2={{ active: isV2, onToggle: toggleV2 }}
      />
      <PanelBody>
        {cellIds.inOrderIds.map((cellId, index) => {
          const data = cellData[cellId];
          const runtime = cellRuntime[cellId];
          if (!data) return null;

          const hasName = !isInternalCellName(data.name);
          const label = hasName ? data.name : codePreview(data.code, index);
          const hasError = runtime?.errored;
          const isStale = runtime?.staleInputs;

          return (
            <PanelRow
              key={cellId}
              onPress={() => scrollToCell(cellId)}
              className="py-1"
            >
              <PanelBadge className="w-4 shrink-0 text-right text-mine-muted/60">
                {index + 1}
              </PanelBadge>
              <PanelText
                variant="content"
                className={cn(
                  'truncate',
                  hasName ? 'font-medium' : 'font-mono text-mine-muted',
                  hasError && 'text-mine-accent-red',
                  isStale && !hasError && 'text-mine-accent-yellow',
                )}
              >
                {label}
              </PanelText>
            </PanelRow>
          );
        })}
      </PanelBody>
    </div>
  );
}

// ─── V1 (original) ──────────────────────────────────────

function CellListV1() {
  const cellIds = useCellIds();
  const { cellData, cellRuntime } = useNotebook();
  const [, toggleV2] = usePanelV2('outline-panel');

  if (cellIds.inOrderIds.length === 0) {
    return (
      <PanelEmptyState
        title="No cells"
        description="Add cells to your notebook to see an outline."
        icon={<ScrollTextIcon />}
      />
    );
  }

  return (
    <div
      data-slot="cell-list-outline"
      className="flex flex-col overflow-auto py-1"
    >
      <div className="px-3 py-1.5 flex items-center justify-between">
        <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
          Cells
        </span>
        <button
          type="button"
          onClick={toggleV2}
          className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors"
          title="Switch to v2 (new)"
        >
          <span className="text-[8px] font-mono">v2</span>
        </button>
      </div>
      {cellIds.inOrderIds.map((cellId, index) => {
        const data = cellData[cellId];
        const runtime = cellRuntime[cellId];
        if (!data) return null;

        const hasName = !isInternalCellName(data.name);
        const label = hasName ? data.name : codePreview(data.code, index);
        const hasError = runtime?.errored;
        const isStale = runtime?.staleInputs;

        return (
          <button
            key={cellId}
            type="button"
            onClick={() => scrollToCell(cellId)}
            className={cn(
              'w-full text-left px-3 py-1 flex items-center gap-2 hover:bg-mine-bg/50 transition-colors',
              hasError && 'text-mine-accent-red',
            )}
          >
            <span className="text-[10px] font-mono text-mine-muted/60 w-4 shrink-0 text-right tabular-nums">
              {index + 1}
            </span>
            <span
              className={cn(
                'text-[11px] truncate',
                hasName
                  ? 'font-medium text-mine-text'
                  : 'font-mono text-mine-muted',
                hasError && 'text-mine-accent-red',
                isStale && !hasError && 'text-mine-accent-yellow',
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────

function codePreview(code: string, index: number): string {
  const firstLine = code.split('\n')[0]?.trim() ?? '';
  if (!firstLine) return `Cell ${index + 1}`;
  const cleaned = firstLine
    .replace(/^(import |from |def |class |#\s*)/, '')
    .slice(0, 40);
  return cleaned || `Cell ${index + 1}`;
}

function scrollToCell(cellId: CellId) {
  const el = document.querySelector(`[data-cell-id="${cellId}"]`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
