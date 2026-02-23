'use client';

import { lazy, Suspense } from 'react';
import useResizeObserver from 'use-resize-observer';
import { cn } from '@/lib/utils';
import {
  Tree,
  Folder,
  File,
  type TreeViewElement,
} from '@/components/ui/file-tree';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';

// Lazy-load connected tree deps — they require requestClientAtom (marimo kernel)
const ConnectedFileTreeInner = lazy(() => import('./connected-file-tree'));

// ─── Mine File Tree ──────────────────────────────────────
//
// Connected mode: embeds marimo's full FileExplorer with
// icons, context menus, DnD, toolbar, inline rename, etc.
//
// Disconnected mode: static Magic UI tree for preview.

const CONTAINER_CLASS =
  'w-[280px] shrink-0 flex flex-col bg-white rounded-lg rounded-bl-[18px] overflow-hidden shadow-sm';

const HEADER_CLASS =
  'flex items-center px-3 py-2 border-b border-mine-border/30';

const HEADER_LABEL_CLASS =
  'text-[11px] font-semibold text-mine-muted uppercase tracking-wider';

// ─── Connected: marimo FileExplorer (lazy-loaded) ────────

function ConnectedFileTree({ className }: { className?: string }) {
  return (
    <div data-slot="mine-file-tree" className={cn(CONTAINER_CLASS, className)}>
      <div className={HEADER_CLASS}>
        <span className={HEADER_LABEL_CLASS}>Files</span>
      </div>
      <Suspense>
        <ConnectedFileTreeInner />
      </Suspense>
    </div>
  );
}

// ─── Disconnected: static Magic UI tree ──────────────────

const DEFAULT_ELEMENTS: TreeViewElement[] = [
  { id: 'cache', name: 'cache', children: [] },
  {
    id: 'strategies',
    name: 'strategies',
    children: [
      { id: 'momentum.py', name: 'momentum.py' },
      { id: 'mean_revert.py', name: 'mean_revert.py' },
      { id: 'pairs.py', name: 'pairs.py' },
    ],
  },
  { id: 'data', name: 'data', children: [] },
  { id: 'vt-lab.py', name: 'vt-lab.py' },
  { id: 'config.toml', name: 'config.toml' },
  { id: 'requirements.txt', name: 'requirements.txt' },
  { id: 'backtest_result.json', name: 'backtest_result.json' },
];

function renderElements(elements: TreeViewElement[]) {
  return elements.map((el) => {
    if (el.children && Array.isArray(el.children)) {
      return (
        <Folder
          key={el.id}
          element={el.name}
          value={el.id}
          className="text-[13px] font-mono"
        >
          {el.children.length > 0 && renderElements(el.children)}
        </Folder>
      );
    }
    return (
      <File key={el.id} value={el.id}>
        <span>{el.name}</span>
      </File>
    );
  });
}

function DisconnectedFileTree({ className }: { className?: string }) {
  return (
    <div data-slot="mine-file-tree" className={cn(CONTAINER_CLASS, className)}>
      <div className={HEADER_CLASS}>
        <span className={HEADER_LABEL_CLASS}>Files</span>
      </div>
      <div className="flex-1 overflow-hidden text-[13px] font-mono text-mine-text">
        <Tree
          initialSelectedId="vt-lab.py"
          initialExpandedItems={['strategies']}
          elements={DEFAULT_ELEMENTS}
          className="py-1"
        >
          {renderElements(DEFAULT_ELEMENTS)}
        </Tree>
      </div>
    </div>
  );
}

// ─── Root: switch by connection state ────────────────────

type MineFileTreeProps = {
  className?: string;
};

function MineFileTree({ className }: MineFileTreeProps) {
  const isConnected = useLabModeStore((s) => s.mode) === 'active';
  return isConnected ? (
    <ConnectedFileTree className={className} />
  ) : (
    <DisconnectedFileTree className={className} />
  );
}

export {
  MineFileTree,
  DisconnectedFileTree,
  DEFAULT_ELEMENTS,
  type MineFileTreeProps,
};
