'use client';

import { useLabCellStore } from '@/features/lab/store/use-lab-cell-store';
import {
  PanelBar,
  PanelBody,
  PanelSection,
  PanelRow,
  PanelEmpty,
  PanelText,
  usePanelV2,
} from '../panel-primitives';

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

// ─── V2 (primitives) ────────────────────────────────────

function VariablePanelV2() {
  const { variables, setActiveCellId } = useVariableData();
  const [isV2, toggleV2] = usePanelV2('variable-panel');

  return (
    <div data-slot="variable-panel" className="h-full flex flex-col">
      <PanelBar
        title="变量"
        badge={
          <PanelText variant="tiny">{variables.length} 个变量定义</PanelText>
        }
        v2={{ active: isV2, onToggle: toggleV2 }}
      />
      <PanelBody>
        {variables.length === 0 ? (
          <PanelEmpty
            title="暂无变量定义"
            description="在 cell 中定义变量后将自动显示"
          />
        ) : (
          <PanelSection>
            <div className="flex items-center gap-2 pb-1.5 mb-1 border-b border-mine-border/20">
              <PanelText variant="title" className="flex-1">
                变量名
              </PanelText>
              <PanelText variant="title" className="flex-1">
                定义 Cell
              </PanelText>
            </div>
            {variables.map((v) => (
              <PanelRow
                key={`${v.cellId}-${v.name}`}
                className="px-0 py-1 border-b border-mine-border/10 last:border-b-0"
              >
                <PanelText variant="mono" className="flex-1 truncate">
                  {v.name}
                </PanelText>
                <button
                  type="button"
                  onClick={() => setActiveCellId(v.cellId)}
                  className="flex-1 truncate text-left"
                >
                  <PanelText
                    variant="mono"
                    className="text-mine-accent-teal hover:underline"
                  >
                    {v.cellName}
                  </PanelText>
                </button>
              </PanelRow>
            ))}
          </PanelSection>
        )}
      </PanelBody>
    </div>
  );
}

// ─── V1 (original) ──────────────────────────────────────

function VariablePanelV1() {
  const { variables, setActiveCellId } = useVariableData();
  const [, toggleV2] = usePanelV2('variable-panel');

  return (
    <div data-slot="variable-panel" className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-mine-border/50 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-mine-muted uppercase tracking-wide">
            变量
          </h3>
          <button
            type="button"
            onClick={toggleV2}
            className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors"
            title="Switch to v2"
          >
            <span className="text-[8px] font-mono">v2</span>
          </button>
        </div>
        <p className="text-[10px] text-mine-muted mt-0.5">
          {variables.length} 个变量定义
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {variables.length === 0 ? (
          <div className="px-3 py-6 text-center text-[11px] text-mine-muted">
            暂无变量定义
            <br />
            <span className="text-[10px]">在 cell 中定义变量后将自动显示</span>
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-mine-border/30">
                <th className="text-left px-3 py-1.5 text-[10px] font-medium text-mine-muted uppercase tracking-wider">
                  变量名
                </th>
                <th className="text-left px-3 py-1.5 text-[10px] font-medium text-mine-muted uppercase tracking-wider">
                  定义 Cell
                </th>
              </tr>
            </thead>
            <tbody>
              {variables.map((v) => (
                <tr
                  key={`${v.cellId}-${v.name}`}
                  className="border-b border-mine-border/20 hover:bg-mine-bg/50 transition-colors"
                >
                  <td className="px-3 py-1.5">
                    <span className="font-mono text-mine-text">{v.name}</span>
                  </td>
                  <td className="px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveCellId(v.cellId)}
                      className="text-mine-accent-teal hover:underline font-mono"
                    >
                      {v.cellName}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Switch ─────────────────────────────────────────────

export function VariablePanel() {
  const [isV2] = usePanelV2('variable-panel');
  return isV2 ? <VariablePanelV2 /> : <VariablePanelV1 />;
}
