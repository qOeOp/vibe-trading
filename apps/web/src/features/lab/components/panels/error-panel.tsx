'use client';

import { useLabCellStore } from '@/features/lab/store/use-lab-cell-store';
import {
  PanelRow,
  PanelEmpty,
  PanelBadge,
  PanelText,
} from '@/components/shared/panel';

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

    let errorMsg = 'Unknown error';
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

// ─── Error Panel Content ────────────────────────────────

function ErrorPanel() {
  const { items, setActiveCellId } = useErrorData();

  if (items.length === 0) {
    return <PanelEmpty title="No errors" />;
  }

  return (
    <div className="divide-y divide-mine-border/20">
      {items.map((item) => (
        <PanelRow
          key={item.id}
          onPress={() => setActiveCellId(item.id)}
          hoverBg="red"
          className="flex-col items-start gap-0.5 py-2"
        >
          <div className="flex items-center gap-1.5">
            <PanelText variant="body" className="font-medium">
              {item.name}
            </PanelText>
            <PanelBadge>#{item.idx + 1}</PanelBadge>
          </div>
          <PanelText
            variant="hint"
            className="font-mono text-mine-accent-red line-clamp-2"
          >
            {item.errorMsg}
          </PanelText>
        </PanelRow>
      ))}
    </div>
  );
}

export { ErrorPanel };
