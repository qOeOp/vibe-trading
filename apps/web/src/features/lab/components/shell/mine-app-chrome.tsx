'use client';

import { type PropsWithChildren, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { LabModeContext } from '../lab-mode-context';
import { useLabModeStore } from '../../store/use-lab-mode-store';
import { MineFileTree } from './mine-file-tree';
import { MineTabBar } from './mine-tab-bar';
import { treeAtom } from '../editor/file-tree/state';
import type { TreeViewElement } from '@/components/ui/file-tree';
import type { FileInfo } from '../../core/network/types';

// ─── Mine App Chrome ─────────────────────────────────────
//
// Replaces marimo's AppChrome with our Mine visual frame.
// Wraps EditApp (children) with the same file tree + tabs
// as the disconnected static view — "CSS artwork comes alive".
//
// EditApp handles ALL kernel communication internally.
// This component is purely visual layout.

/** Convert marimo FileInfo[] → Magic UI TreeViewElement[] */
function fileInfoToTreeElements(files: FileInfo[]): TreeViewElement[] {
  return files.map((f) => {
    const el: TreeViewElement = { id: f.path || f.name, name: f.name };
    if (f.isDirectory) {
      el.children = f.children ? fileInfoToTreeElements(f.children) : [];
    }
    return el;
  });
}

/** Fetches real file tree from marimo kernel via treeAtom */
function useMarimoFileTree(): TreeViewElement[] | null {
  const [tree] = useAtom(treeAtom);
  const [files, setFiles] = useState<TreeViewElement[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    tree.initialize((data: FileInfo[]) => {
      if (!cancelled) {
        setFiles(fileInfoToTreeElements(data));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [tree]);

  return files;
}

function MineAppChrome({ children }: PropsWithChildren) {
  const fileTreeVisible = useLabModeStore((s) => s.fileTreeVisible);
  const realFiles = useMarimoFileTree();

  return (
    <LabModeContext.Provider value={{ isLabMode: true, onExit: null }}>
      <div
        data-slot="mine-app-chrome"
        className="flex-1 flex overflow-hidden h-full"
      >
        {/* Column 1: File tree (toggle via chrome header Menu) */}
        {fileTreeVisible && <MineFileTree files={realFiles ?? undefined} />}

        {/* Column 2: Editor (tabs + marimo cells) */}
        <div className="flex-1 min-w-0 flex flex-col ml-2 gap-2 overflow-hidden">
          <MineTabBar />

          {/* Marimo EditApp renders here — real cells from kernel */}
          {/* data-slot="lab-fullscreen" scopes cell.css lab-mode styles:
              dashed separators, focus-based controls, shine borders,
              gutter run button, cell type indicator, progressive blur */}
          <div
            data-slot="lab-fullscreen"
            className="relative flex-1 min-h-0 overflow-y-auto rounded-lg"
          >
            {children}
            {/* Progressive blur — fades editor bottom into dock area */}
            <div data-slot="editor-progressive-blur" />
          </div>
        </div>
      </div>
    </LabModeContext.Provider>
  );
}

export { MineAppChrome };
