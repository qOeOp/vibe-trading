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
import { cn } from '@/features/lab/utils/cn';

import './outline-panel.css';
import { OutlineList } from './outline/outline-list';
import {
  findOutlineElements,
  useActiveOutline,
} from './outline/useActiveOutline';
import {
  PanelRow,
  PanelEmpty,
  PanelBadge,
  PanelText,
} from '@/components/shared/panel';

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
  const cellIds = useCellIds();
  const { cellData, cellRuntime } = useNotebook();

  if (cellIds.inOrderIds.length === 0) {
    return (
      <PanelEmpty
        title="No cells"
        description="Add cells to your notebook to see an outline."
        icon={<ScrollTextIcon />}
      />
    );
  }

  return (
    <div data-slot="cell-list-outline" className="flex flex-col overflow-auto">
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
              variant="body"
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
