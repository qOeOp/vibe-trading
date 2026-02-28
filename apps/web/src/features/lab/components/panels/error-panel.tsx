'use client';

import { AlertCircle } from 'lucide-react';
import { useLabCellStore } from '@/features/lab/store/use-lab-cell-store';
import {
  PanelBar,
  PanelBody,
  PanelRow,
  PanelEmpty,
  PanelBadge,
  PanelText,
  usePanelV2,
} from '../panel-primitives';

// ─── Error Panel ─────────────────────────────────────────

function useErrorData() {
  const cellIds = useLabCellStore((s) => s.cellIds);
  const cellData = useLabCellStore((s) => s.cellData);
  const cellRuntime = useLabCellStore((s) => s.cellRuntime);
  const setActiveCellId = useLabCellStore((s) => s.setActiveCellId);

  const erroredCells = cellIds.filter((id) => cellRuntime[id]?.errored);

  const items = erroredCells.map((id) => {
    const data = cellData[id];
    const runtime = cellRuntime[id];
    const idx = cellIds.indexOf(id);
    const name = data?.name || `Cell ${idx + 1}`;

    let errorMsg = '未知错误';
    if (
      runtime?.output?.mimetype === 'application/vnd.marimo+error' &&
      Array.isArray(runtime.output.data)
    ) {
      const errors = runtime.output.data as Array<{ msg?: string }>;
      errorMsg = errors[0]?.msg || errorMsg;
    }

    return { id, name, idx, errorMsg };
  });

  return { items, setActiveCellId };
}

// ─── V2 (primitives) ────────────────────────────────────

function ErrorPanelV2() {
  const { items, setActiveCellId } = useErrorData();
  const [isV2, toggleV2] = usePanelV2('error-panel');

  return (
    <div data-slot="error-panel" className="h-full flex flex-col">
      <PanelBar
        title="错误"
        icon={<AlertCircle className="text-mine-accent-red" />}
        badge={
          items.length > 0 ? (
            <PanelBadge color="red">({items.length})</PanelBadge>
          ) : undefined
        }
        v2={{ active: isV2, onToggle: toggleV2 }}
      />
      <PanelBody>
        {items.length === 0 ? (
          <PanelEmpty title="无错误" />
        ) : (
          <div className="divide-y divide-mine-border/20">
            {items.map((item) => (
              <PanelRow
                key={item.id}
                onPress={() => setActiveCellId(item.id)}
                hoverBg="red"
                className="flex-col items-start gap-0.5 py-2"
              >
                <div className="flex items-center gap-1.5">
                  <PanelText variant="content" className="font-medium">
                    {item.name}
                  </PanelText>
                  <PanelBadge>#{item.idx + 1}</PanelBadge>
                </div>
                <PanelText
                  variant="sub"
                  className="font-mono text-mine-accent-red line-clamp-2"
                >
                  {item.errorMsg}
                </PanelText>
              </PanelRow>
            ))}
          </div>
        )}
      </PanelBody>
    </div>
  );
}

// ─── V1 (original) ──────────────────────────────────────

function ErrorPanelV1() {
  const { items, setActiveCellId } = useErrorData();
  const [, toggleV2] = usePanelV2('error-panel');

  return (
    <div data-slot="error-panel" className="h-full flex flex-col">
      <div className="px-3 py-1.5 border-b border-mine-border/50 shrink-0 flex items-center gap-1.5">
        <AlertCircle className="w-3 h-3 text-mine-accent-red" />
        <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
          错误
        </span>
        {items.length > 0 && (
          <span className="text-[10px] font-mono text-mine-accent-red">
            ({items.length})
          </span>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={toggleV2}
          className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors"
          title="Switch to v2"
        >
          <span className="text-[8px] font-mono">v2</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-3 py-4 text-center text-[11px] text-mine-muted">
            无错误
          </div>
        ) : (
          <div className="divide-y divide-mine-border/30">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCellId(item.id)}
                className="w-full text-left px-3 py-2 hover:bg-mine-accent-red/5 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-mine-text">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-mono text-mine-muted">
                    #{item.idx + 1}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-mine-accent-red mt-0.5 line-clamp-2">
                  {item.errorMsg}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Switch ─────────────────────────────────────────────

export function ErrorPanel() {
  const [isV2] = usePanelV2('error-panel');
  return isV2 ? <ErrorPanelV2 /> : <ErrorPanelV1 />;
}
