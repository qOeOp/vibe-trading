'use client';

import { lazy, Suspense } from 'react';
import { cn } from '@/lib/utils';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { PanelShell } from './panel-shell';
import {
  Tree,
  Folder,
  File,
  type TreeViewElement,
} from '@/components/ui/file-tree';
import {
  FileCodeIcon,
  FileJsonIcon,
  FileTextIcon,
  FileIcon,
} from 'lucide-react';

// ─── Mine File Tree ──────────────────────────────────────
//
// Disconnected mode: Magic UI tree with static demo data.
// Connected mode: lazy-loads ConnectedFileTreeContent which
// binds Magic UI tree to marimo's RequestingTree + jotai atoms.

// Lazy-load connected tree deps — they require requestClientAtom
const ConnectedFileTreeContent = lazy(() =>
  import('./connected-file-tree').then((m) => ({
    default: m.ConnectedFileTreeContent,
  })),
);

// ─── Static tree data (disconnected demo) ────────────────

const DEFAULT_TREE: TreeViewElement[] = [
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

// ─── File icon by extension ──────────────────────────────

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  const cls = 'w-4 h-4 shrink-0 text-mine-muted/70';
  switch (ext) {
    case 'py':
      return <FileCodeIcon className={cls} strokeWidth={1.5} />;
    case 'json':
      return <FileJsonIcon className={cls} strokeWidth={1.5} />;
    case 'toml':
    case 'txt':
    case 'md':
      return <FileTextIcon className={cls} strokeWidth={1.5} />;
    default:
      return <FileIcon className={cls} strokeWidth={1.5} />;
  }
}

// ─── Recursive renderer ──────────────────────────────────

function renderNodes(nodes: TreeViewElement[]) {
  return nodes.map((node) =>
    node.children ? (
      <Folder key={node.id} element={node.name} value={node.id}>
        {node.children.length > 0 ? renderNodes(node.children) : null}
      </Folder>
    ) : (
      <File key={node.id} value={node.id} fileIcon={getFileIcon(node.name)}>
        <span className="truncate">{node.name}</span>
      </File>
    ),
  );
}

// ─── Static file tree content (no PanelShell) ────────────

function StaticFileTreeContent() {
  return (
    <Tree
      elements={DEFAULT_TREE}
      initialSelectedId="vt-lab.py"
      initialExpandedItems={['strategies']}
      className="py-1"
    >
      {renderNodes(DEFAULT_TREE)}
    </Tree>
  );
}

// ─── Connected file tree content (no PanelShell) ─────────

function ConnectedFileTreeWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col gap-2 p-3">
          <div className="h-2.5 w-3/4 rounded bg-mine-border/50 animate-pulse" />
          <div className="h-2.5 w-1/2 rounded bg-mine-border/50 animate-pulse" />
          <div className="h-2.5 w-2/3 rounded bg-mine-border/50 animate-pulse" />
        </div>
      }
    >
      <ConnectedFileTreeContent />
    </Suspense>
  );
}

// ─── Root: switch by connection state ────────────────────

type MineFileTreeProps = {
  className?: string;
};

function MineFileTree({ className }: MineFileTreeProps) {
  const isConnected = useLabModeStore((s) => s.mode) === 'active';
  return (
    <div
      data-slot="mine-file-tree"
      className={cn('flex-1 flex flex-col min-h-0', className)}
    >
      {isConnected ? <ConnectedFileTreeWrapper /> : <StaticFileTreeContent />}
    </div>
  );
}

/** DisconnectedFileTree with PanelShell — preserved for tests */
function DisconnectedFileTree({ className }: { className?: string }) {
  return (
    <PanelShell title="Files" className={className}>
      <StaticFileTreeContent />
    </PanelShell>
  );
}

export {
  MineFileTree,
  DisconnectedFileTree,
  StaticFileTreeContent,
  DEFAULT_TREE,
  getFileIcon,
  renderNodes,
  type MineFileTreeProps,
};
