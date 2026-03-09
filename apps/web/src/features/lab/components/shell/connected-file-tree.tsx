'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import useResizeObserver from 'use-resize-observer';
import {
  ChevronDownIcon,
  CopyMinusIcon,
  EyeOffIcon,
  FilePlus2Icon,
  FolderPlusIcon,
  RefreshCcwIcon,
  UploadIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tree, Folder, File } from '@/components/ui/file-tree';
import { useLabFileTabStore } from '@/features/lab/store/use-lab-file-tab-store';
import { useImperativeModal } from '../modal/ImperativeModal';
import { treeAtom, openStateAtom } from '../editor/file-tree/state';
import { useFileExplorerUpload } from '../editor/file-tree/upload';
import {
  FILE_TYPE_ICONS,
  guessFileType,
  filterHiddenTree,
  isDirectoryOrFileHidden,
} from './connected-file-tree-utils';
import type { FileInfo } from '@/features/lab/core/network/types';
import { useAsyncData } from '@/features/lab/hooks/useAsyncData';
import { Spinner } from '../icons/spinner';
import { ErrorBanner } from '@/features/lab/plugins/impl/common/error-banner';
import { atomWithStorage } from 'jotai/utils';
import { jotaiJsonStorage } from '@/features/lab/utils/storage/jotai';

// ─── Connected File Tree ─────────────────────────────────
//
// Bridges Magic UI tree shell to marimo's RequestingTree.
// WebStorm-style: toolbar icons visible only on panel hover.
// Lazy-loaded — requires marimo kernel context.

const hiddenFilesState = atomWithStorage(
  'marimo:showHiddenFiles',
  true,
  jotaiJsonStorage,
  { getOnInit: true },
);

// ─── Toolbar (hover-reveal) ──────────────────────────────

type ToolbarProps = {
  onRefresh: () => void;
  onHidden: () => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onCollapseAll: () => void;
};

function Toolbar({
  onRefresh,
  onHidden,
  onCreateFile,
  onCreateFolder,
  onCollapseAll,
}: ToolbarProps) {
  const { getRootProps, getInputProps } = useFileExplorerUpload({
    noDrag: true,
    noDragEventsBubbling: true,
  });

  const btnCls =
    'w-6 h-6 flex items-center justify-center rounded text-mine-muted hover:text-mine-text hover:bg-mine-bg transition-colors';

  return (
    <div data-slot="file-tree-toolbar" className="flex items-center gap-0.5">
      <button
        type="button"
        title="New File"
        className={btnCls}
        onClick={onCreateFile}
      >
        <FilePlus2Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        title="New Folder"
        className={btnCls}
        onClick={onCreateFolder}
      >
        <FolderPlusIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        title="Upload"
        {...getRootProps({})}
        className={btnCls}
      >
        <UploadIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
      <input {...getInputProps({})} type="file" />
      <button
        type="button"
        title="Refresh"
        className={btnCls}
        onClick={onRefresh}
      >
        <RefreshCcwIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        title="Toggle Hidden"
        className={btnCls}
        onClick={onHidden}
      >
        <EyeOffIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        title="Collapse All"
        className={btnCls}
        onClick={onCollapseAll}
      >
        <CopyMinusIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

// ─── Recursive node renderer ─────────────────────────────

function renderFileNodes(nodes: FileInfo[]) {
  return nodes.map((node) => {
    if (node.isDirectory) {
      return (
        <Folder key={node.path} element={node.name} value={node.path}>
          {node.children && node.children.length > 0
            ? renderFileNodes(node.children)
            : null}
        </Folder>
      );
    }

    const fileType = guessFileType(node.name);
    const Icon = FILE_TYPE_ICONS[fileType];

    return (
      <File
        key={node.path}
        value={node.path}
        fileIcon={
          <Icon
            className="w-4 h-4 shrink-0 text-mine-muted"
            strokeWidth={1.75}
          />
        }
      >
        <span className="truncate">{node.name}</span>
      </File>
    );
  });
}

// ─── Main Component ──────────────────────────────────────

export function ConnectedFileTreeContent() {
  const [tree] = useAtom(treeAtom);
  const [data, setData] = useState<FileInfo[]>([]);
  const [showHiddenFiles, setShowHiddenFiles] = useAtom(hiddenFilesState);
  const [openState, setOpenState] = useAtom(openStateAtom);
  const { openPrompt } = useImperativeModal();
  const treeRef = useRef<HTMLDivElement>(null);

  const { isPending, error } = useAsyncData(() => tree.initialize(setData), []);

  // Build expanded items from openState
  const expandedItems = useMemo(
    () => Object.keys(openState).filter((k) => openState[k]),
    [openState],
  );

  const visibleData = useMemo(
    () => filterHiddenTree(data, showHiddenFiles),
    [data, showHiddenFiles],
  );

  // Handle folder expand/collapse — async lazy loading
  const handleExpand = useCallback(
    async (id: string) => {
      const wasOpen = openState[id];
      if (wasOpen) {
        setOpenState({ ...openState, [id]: false });
      } else {
        await tree.expand(id);
        setOpenState({ ...openState, [id]: true });
      }
    },
    [tree, openState, setOpenState],
  );

  // Handle file selection → open in tab
  const handleSelect = useCallback((id: string) => {
    // id is the file path for connected tree
    useLabFileTabStore.getState().openFile(id);
  }, []);

  // Toolbar handlers
  const handleRefresh = useCallback(() => {
    tree.refreshAll(Object.keys(openState).filter((k) => openState[k]));
  }, [tree, openState]);

  const handleHiddenToggle = useCallback(() => {
    setShowHiddenFiles(!showHiddenFiles);
  }, [showHiddenFiles, setShowHiddenFiles]);

  const handleCreateFile = useCallback(() => {
    openPrompt({
      title: 'File name',
      onConfirm: async (name: string) => {
        tree.createFile(name, null);
      },
    });
  }, [tree, openPrompt]);

  const handleCreateFolder = useCallback(() => {
    openPrompt({
      title: 'Folder name',
      onConfirm: async (name: string) => {
        tree.createFolder(name, null);
      },
    });
  }, [tree, openPrompt]);

  const handleCollapseAll = useCallback(() => {
    setOpenState({});
  }, [setOpenState]);

  // Upload drop zone
  const { getRootProps, getInputProps, isDragActive } = useFileExplorerUpload({
    noClick: true,
    noKeyboard: true,
  });

  if (isPending) {
    return <Spinner size="medium" centered={true} />;
  }

  if (error) {
    return <ErrorBanner error={error} />;
  }

  return (
    <div
      {...getRootProps()}
      data-slot="connected-file-tree"
      className="group/filetree flex-1 flex flex-col min-h-0 relative"
    >
      <input {...getInputProps()} />

      {/* Upload overlay */}
      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-mine-accent-teal bg-mine-accent-teal/10 z-10 border-2 border-dashed border-mine-accent-teal/50 rounded-lg pointer-events-none uppercase">
          Drop files here
        </div>
      )}

      {/* Toolbar icons replace the panel title */}
      <div className="flex items-center px-2 py-1.5 shrink-0">
        <Toolbar
          onRefresh={handleRefresh}
          onHidden={handleHiddenToggle}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onCollapseAll={handleCollapseAll}
        />
      </div>

      {/* Tree */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Tree
          ref={treeRef}
          initialExpandedItems={expandedItems}
          onExpand={handleExpand}
          onDoubleClickItem={handleSelect}
          indicator={true}
          className="py-0.5"
        >
          {renderFileNodes(visibleData)}
        </Tree>
      </div>
    </div>
  );
}
