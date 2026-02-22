'use client';

import { cn } from '@/lib/utils';
import {
  Tree,
  Folder,
  File,
  type TreeViewElement,
} from '@/components/ui/file-tree';
import { useLabFileTabStore } from '../../store/use-lab-file-tab-store';
import { useLabModeStore } from '../../store/use-lab-mode-store';

// ─── Mine File Tree ──────────────────────────────────────
//
// Uses Magic UI file-tree for expand/collapse animation.
// Accepts TreeViewElement[] from marimo kernel (connected)
// or falls back to DEFAULT_ELEMENTS (disconnected).
// Double-click a file → opens a tab in MineTabBar.

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

type MineFileTreeProps = {
  files?: TreeViewElement[];
  onFolderExpand?: (id: string) => void;
  className?: string;
};

/** Recursive renderer: TreeViewElement[] → Folder/File JSX */
function renderElements(
  elements: TreeViewElement[],
  onFileDoubleClick?: (path: string) => void,
) {
  return elements.map((el) => {
    if (el.children && Array.isArray(el.children)) {
      return (
        <Folder
          key={el.id}
          element={el.name}
          value={el.id}
          className="text-[13px] font-mono"
        >
          {el.children.length > 0 &&
            renderElements(el.children, onFileDoubleClick)}
        </Folder>
      );
    }
    return (
      <File
        key={el.id}
        value={el.id}
        onDoubleClick={() => onFileDoubleClick?.(el.id)}
      >
        <span>{el.name}</span>
      </File>
    );
  });
}

function MineFileTree({
  files = DEFAULT_ELEMENTS,
  onFolderExpand,
  className,
}: MineFileTreeProps) {
  const openFile = useLabFileTabStore((s) => s.openFile);
  const isConnected = useLabModeStore((s) => s.mode) === 'active';

  const handleFileDoubleClick = isConnected
    ? (path: string) => openFile(path)
    : undefined;

  return (
    <div
      data-slot="mine-file-tree"
      className={cn(
        'w-[280px] shrink-0 flex flex-col bg-white rounded-lg overflow-hidden shadow-sm',
        className,
      )}
    >
      <div className="flex items-center px-3 py-2 border-b border-mine-border/30">
        <span className="text-[11px] font-semibold text-mine-muted uppercase tracking-wider">
          Files
        </span>
      </div>
      <div className="flex-1 overflow-hidden text-[13px] font-mono text-mine-text">
        <Tree
          initialSelectedId="vt-lab.py"
          initialExpandedItems={['strategies']}
          elements={files}
          onExpand={onFolderExpand}
          className="py-1"
        >
          {renderElements(files, handleFileDoubleClick)}
        </Tree>
      </div>
    </div>
  );
}

export { MineFileTree, DEFAULT_ELEMENTS, type MineFileTreeProps };
