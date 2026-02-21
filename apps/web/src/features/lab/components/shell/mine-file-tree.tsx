'use client';

import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Mine File Tree ──────────────────────────────────────
//
// Decorative file tree panel shared between static (disconnected)
// and live (connected) states.  Same component — same pixels.
//
// Phase 3+: will accept real file list from marimo kernel.

type FileEntry = {
  name: string;
  type: 'file' | 'folder';
  /** Folder expanded? (only for type='folder') */
  expanded?: boolean;
  /** Folder icon accent color */
  iconColor?: string;
  /** Nested children (only for type='folder') */
  children?: FileEntry[];
  /** Whether this file is currently selected/active */
  active?: boolean;
};

const DEFAULT_FILES: FileEntry[] = [
  { name: 'cache', type: 'folder', expanded: false },
  {
    name: 'strategies',
    type: 'folder',
    expanded: true,
    iconColor: '#d4a853',
    children: [
      { name: 'momentum.py', type: 'file' },
      { name: 'mean_revert.py', type: 'file' },
      { name: 'pairs.py', type: 'file' },
    ],
  },
  { name: 'data', type: 'folder', expanded: false },
  { name: 'vt-lab.py', type: 'file', active: true },
  { name: 'config.toml', type: 'file' },
  { name: 'requirements.txt', type: 'file' },
  { name: 'backtest_result.json', type: 'file' },
];

type MineFileTreeProps = {
  files?: FileEntry[];
  className?: string;
};

function MineFileTree({ files = DEFAULT_FILES, className }: MineFileTreeProps) {
  return (
    <div
      data-slot="mine-file-tree"
      className={cn(
        'w-[240px] shrink-0 flex flex-col bg-white rounded-lg overflow-hidden shadow-sm',
        className,
      )}
    >
      <div className="flex items-center px-3 py-2 border-b border-mine-border/30">
        <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
          Files
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-2 text-[13px] text-[#525252]">
        {files.map((entry) => (
          <FileTreeEntry key={entry.name} entry={entry} depth={0} />
        ))}
      </div>
    </div>
  );
}

// ─── Recursive Entry ─────────────────────────────────────

function FileTreeEntry({ entry, depth }: { entry: FileEntry; depth: number }) {
  if (entry.type === 'folder') {
    return (
      <>
        <div
          className="flex items-center gap-1.5 px-3 py-1 hover:bg-[#f5f5f5] cursor-pointer"
          style={{ paddingLeft: `${12 + depth * 20}px` }}
        >
          {entry.expanded ? (
            <ChevronDown className="w-3 h-3 text-[#a3a3a3]" strokeWidth={1.5} />
          ) : (
            <ChevronRight
              className="w-3 h-3 text-[#a3a3a3]"
              strokeWidth={1.5}
            />
          )}
          <Folder
            className="w-3.5 h-3.5"
            style={{ color: entry.iconColor ?? '#a3a3a3' }}
            strokeWidth={1.5}
          />
          <span>{entry.name}</span>
        </div>
        {entry.expanded &&
          entry.children?.map((child) => (
            <FileTreeEntry key={child.name} entry={child} depth={depth + 1} />
          ))}
      </>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-3 py-1 hover:bg-[#f5f5f5] cursor-pointer',
        entry.active && 'bg-[#f05023]/[0.06]',
      )}
      style={{ paddingLeft: `${12 + depth * 20}px` }}
    >
      {/* Spacer for chevron alignment (only at depth 0) */}
      {depth === 0 && <div className="w-3 h-3" />}
      <FileText className="w-3.5 h-3.5 text-[#a3a3a3]" strokeWidth={1.5} />
      <span className="font-mono text-[12px]">{entry.name}</span>
    </div>
  );
}

export { MineFileTree, type FileEntry };
