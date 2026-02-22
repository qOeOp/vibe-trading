'use client';

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Provider } from 'jotai';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { LabModeContext } from '../lab-mode-context';
import { useLabModeStore } from '../../store/use-lab-mode-store';
import { useLabFileTabStore } from '../../store/use-lab-file-tab-store';
import { MineFileTree } from './mine-file-tree';
import { MineTabBar } from './mine-tab-bar';
import { FileEditor } from './file-editor';
import { Footer } from '../editor/chrome/wrapper/footer';
import { treeAtom } from '../editor/file-tree/state';
import { filenameAtom } from '../../core/saving/file-state';
import { store } from '../../core/state/jotai';
import { ErrorBoundary } from '../editor/boundary/ErrorBoundary';
import type { TreeViewElement } from '@/components/ui/file-tree';
import type { FileInfo } from '../../core/network/types';

// ─── Mine App Chrome ─────────────────────────────────────
//
// Replaces marimo's AppChrome with our Mine visual frame.
// Wraps EditApp (children) with file tree + tabs.
//
// Tab switching: notebook tab → children (marimo cells),
// other tabs → FileEditor with auto-save.

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
function useMarimoFileTree() {
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

  // Lazy-load directory contents when folder is expanded.
  // RequestingTree.expand() fetches children from kernel and calls onChange
  // which triggers setFiles. As a safety net, we also read the tree data
  // directly after expand to ensure React state is in sync.
  const expandFolder = useCallback(
    async (id: string) => {
      const result = await tree.expand(id);
      if (result) {
        // Directly read tree data and update state, in case the onChange
        // callback was stale or cancelled by a concurrent effect cleanup
        setFiles(fileInfoToTreeElements(tree.getData()));
      }
    },
    [tree],
  );

  return { files, expandFolder };
}

const DEFAULT_NOTEBOOK = '/tmp/vt-lab.py';

/** Initialize notebook tab from marimo's filenameAtom (with fallback) */
function useInitNotebookTab() {
  const filename = useAtomValue(filenameAtom);
  const initNotebookTab = useLabFileTabStore((s) => s.initNotebookTab);

  useEffect(() => {
    // Use real filename if available, otherwise fall back to default
    const path = filename || DEFAULT_NOTEBOOK;
    initNotebookTab(path);
  }, [filename, initNotebookTab]);
}

function MineAppChrome({ children }: PropsWithChildren) {
  const fileTreeVisible = useLabModeStore((s) => s.fileTreeVisible);
  const { files: realFiles, expandFolder } = useMarimoFileTree();
  const activeTabId = useLabFileTabStore((s) => s.activeTabId);
  const tabs = useLabFileTabStore((s) => s.tabs);

  useInitNotebookTab();

  // Determine if the active tab is the notebook (pinned) tab
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const isNotebookTab = !activeTab || activeTab.pinned;

  return (
    <LabModeContext.Provider value={{ isLabMode: true, onExit: null }}>
      <div
        data-slot="mine-app-chrome"
        className="relative flex-1 flex overflow-hidden h-full"
      >
        {/* Column 1: File tree (toggle via chrome header Menu) */}
        {fileTreeVisible && (
          <MineFileTree
            files={realFiles ?? undefined}
            onFolderExpand={expandFolder}
          />
        )}

        {/* Column 2: Editor (tabs + content) */}
        <div className="flex-1 min-w-0 flex flex-col ml-2 gap-2 overflow-hidden">
          <MineTabBar />

          {isNotebookTab ? (
            /* Notebook tab: marimo EditApp renders real cells from kernel */
            <div
              data-slot="lab-fullscreen"
              className="relative flex-1 min-h-0 overflow-y-auto rounded-lg"
            >
              {children}
              <div data-slot="editor-progressive-blur" />
            </div>
          ) : (
            /* File tab: single-file CodeMirror editor with auto-save */
            <div className="relative flex-1 min-h-0 overflow-hidden rounded-lg bg-white shadow-sm">
              <Provider store={store}>
                <TooltipProvider>
                  <ErrorBoundary>
                    <FileEditor path={activeTab.path} />
                  </ErrorBoundary>
                </TooltipProvider>
              </Provider>
            </div>
          )}
        </div>

        {/* Floating dock at bottom center */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <Footer />
        </div>
      </div>
    </LabModeContext.Provider>
  );
}

export { MineAppChrome };
