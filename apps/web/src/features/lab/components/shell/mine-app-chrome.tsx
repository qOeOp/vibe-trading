'use client';

import { type PropsWithChildren, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { Provider } from 'jotai';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { LabModeContext } from '../lab-mode-context';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { useLabFileTabStore } from '@/features/lab/store/use-lab-file-tab-store';
import { MineFileTree } from './mine-file-tree';
import { MineTabBar } from './mine-tab-bar';
import { FileEditor } from './file-editor';
import { filenameAtom } from '@/features/lab/core/saving/file-state';
import { store } from '@/features/lab/core/state/jotai';
import { ErrorBoundary } from '../editor/boundary/ErrorBoundary';

// ─── Mine App Chrome ─────────────────────────────────────
//
// Replaces marimo's AppChrome with our Mine visual frame.
// Wraps EditApp (children) with file tree + tabs.
//
// Tab switching: notebook tab → children (marimo cells),
// other tabs → FileEditor with auto-save.

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
        {fileTreeVisible && <MineFileTree />}

        {/* Column 2: Editor frame (Align UI rounded container) */}
        <div
          data-slot="editor-frame"
          className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#f2f2f2] rounded-[20px] pb-1.5"
          style={{
            boxShadow: 'inset 0px 0.75px 0.75px rgba(0,0,0,0.04)',
          }}
        >
          <MineTabBar />

          {isNotebookTab ? (
            /* Notebook tab: marimo EditApp renders real cells from kernel */
            <div
              data-slot="lab-fullscreen"
              className="relative flex-1 min-h-0 overflow-y-auto bg-white rounded-2xl mx-1.5 p-2"
            >
              {children}
            </div>
          ) : (
            /* File tab: single-file CodeMirror editor with auto-save */
            <div className="relative flex-1 min-h-0 overflow-hidden bg-white rounded-2xl mx-1.5">
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
