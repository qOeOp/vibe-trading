'use client';

import { useLabCellStore } from '@/features/lab/store/use-lab-cell-store';
import {
  PanelSection,
  PanelRow,
  PanelEmpty,
  PanelText,
} from '@/components/shared/panel';

// ─── Variable Panel ──────────────────────────────────────

type VarEntry = {
  name: string;
  cellId: string;
  cellName: string;
  cellIndex: number;
};

function useVariableData() {
  const cells = useLabCellStore((s) => s.cells);
  const cellData = useLabCellStore((s) => s.cellData);
  const cellIds = useLabCellStore((s) => s.cellIds);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);

  const variables: VarEntry[] = [];
  for (const cell of cells) {
    for (const varName of cell.defines) {
      const idx = cellIds.indexOf(cell.id);
      const data = cellData[cell.id];
      variables.push({
        name: varName,
        cellId: cell.id,
        cellName: data?.name || cell.name || `Cell ${idx + 1}`,
        cellIndex: idx,
      });
    }
  }

  return { variables, setActiveCellId };
}

// ─── Variable Panel Content ─────────────────────────────

function VariablePanel() {
  const { variables, setActiveCellId } = useVariableData();

  if (variables.length === 0) {
    return (
      <PanelEmpty
        title="No variables defined"
        description="Define variables in cells to see them here"
      />
    );
  }

  return (
    <PanelSection noBorder>
      {/* Table header */}
      <div className="flex items-center gap-2 pb-1.5 mb-1 border-b border-mine-border/20">
        <PanelText variant="label" className="flex-1">
          Name
        </PanelText>
        <PanelText variant="label" className="flex-1">
          Defined In
        </PanelText>
      </div>
      {/* Rows */}
      {variables.map((v) => (
        <PanelRow
          key={`${v.cellId}-${v.name}`}
          className="px-0 py-1 border-b border-mine-border/10 last:border-b-0"
        >
          <PanelText variant="value" className="flex-1 truncate">
            {v.name}
          </PanelText>
          <button
            type="button"
            onClick={() => setActiveCellId(v.cellId)}
            className="flex-1 truncate text-left"
          >
            <PanelText
              variant="value"
              className="text-mine-accent-teal hover:underline"
            >
              {v.cellName}
            </PanelText>
          </button>
        </PanelRow>
      ))}
    </PanelSection>
  );
}

export { VariablePanel };
