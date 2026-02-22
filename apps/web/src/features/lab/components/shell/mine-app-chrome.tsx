'use client';

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAtomValue } from 'jotai';
import { Provider } from 'jotai';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { LabModeContext } from '../lab-mode-context';
import { useLabModeStore } from '../../store/use-lab-mode-store';
import { useLabFileTabStore } from '../../store/use-lab-file-tab-store';
import { MineFileTree } from './mine-file-tree';
import { MineTabBar } from './mine-tab-bar';
import { FileEditor } from './file-editor';
// Footer dock removed — CPU/memory stats moved to ActivityBar
import { requestClientAtom } from '../../core/network/requests';
import { RequestingTree } from '../editor/file-tree/requesting-tree';
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

/**
 * Fetches file tree from marimo kernel, rooted at the VT workspace path.
 * Builds its own RequestingTree with a patched listFiles callback that
 * redirects the initial empty-path request to the workspace directory.
 */
function useMarimoFileTree() {
  const client = useAtomValue(requestClientAtom);
  const workspacePath = useLabModeStore((s) => s.workspacePath);
  const [files, setFiles] = useState<TreeViewElement[] | null>(null);
  const treeRef = useRef<RequestingTree | null>(null);

  useEffect(() => {
    if (!client) return;

    let cancelled = false;

    const tree = new RequestingTree({
      listFiles: (req) => {
        const resolvedPath =
          !req.path && workspacePath ? workspacePath : req.path;
        return client.sendListFiles({ ...req, path: resolvedPath });
      },
      createFileOrFolder: client.sendCreateFileOrFolder,
      deleteFileOrFolder: client.sendDeleteFileOrFolder,
      renameFileOrFolder: client.sendRenameFileOrFolder,
    });
    treeRef.current = tree;

    tree.initialize((data: FileInfo[]) => {
      if (!cancelled) {
        setFiles(fileInfoToTreeElements(data));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [client, workspacePath]);

  const expandFolder = useCallback(async (id: string) => {
    const tree = treeRef.current;
    if (!tree) return;
    const result = await tree.expand(id);
    if (result) {
      setFiles(fileInfoToTreeElements(tree.getData()));
    }
  }, []);

  return { files, expandFolder };
}

/** Initialize notebook tab from marimo's filenameAtom (with fallback to store path) */
function useInitNotebookTab() {
  const filename = useAtomValue(filenameAtom);
  const notebookPath = useLabModeStore((s) => s.notebookPath);
  const initNotebookTab = useLabFileTabStore((s) => s.initNotebookTab);

  useEffect(() => {
    const path = filename || notebookPath || '/tmp/vt-lab.py';
    initNotebookTab(path);
  }, [filename, notebookPath, initNotebookTab]);
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
        className="relative flex-1 flex gap-2 overflow-hidden h-full"
      >
        {/* Column 1: File tree (toggle via chrome header Menu) */}
        {fileTreeVisible && (
          <MineFileTree
            files={realFiles ?? undefined}
            onFolderExpand={expandFolder}
          />
        )}

        {/* Column 2: Editor (tabs + content) */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <MineTabBar />
          <div className="h-2 shrink-0" />

          {isNotebookTab ? (
            /* Notebook tab: marimo EditApp renders real cells from kernel */
            <div
              data-slot="lab-fullscreen"
              className="relative flex-1 min-h-0 overflow-y-auto rounded-lg"
            >
              {children}
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
      </div>
    </LabModeContext.Provider>
  );
}

export { MineAppChrome };
