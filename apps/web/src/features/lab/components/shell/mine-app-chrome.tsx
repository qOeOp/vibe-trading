'use client';

import { type PropsWithChildren, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { Provider } from 'jotai';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { LabModeContext } from '../lab-mode-context';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { useLabFileTabStore } from '@/features/lab/store/use-lab-file-tab-store';
import { MineTabBar } from './mine-tab-bar';
import { FileEditor } from './file-editor';
import { ContentFrame } from './content-frame';
import { filenameAtom } from '@/features/lab/core/saving/file-state';
import { store } from '@/features/lab/core/state/jotai';
import { ErrorBoundary } from '../editor/boundary/ErrorBoundary';
import { PanelSlot } from './panel-slot';

// ─── Mine App Chrome ─────────────────────────────────────
//
// Replaces marimo's AppChrome with our Mine visual frame.
// Wraps EditApp (children) with tab bar + editor frame.
// Left/right panels are managed by LabOrchestrator (parent).
// Terminal (bottom) is rendered via PanelSlot inside the editor frame.
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
  const bottomPanel = useLabModeStore((s) => s.bottomPanel);
  const togglePanel = useLabModeStore((s) => s.togglePanel);
  const activeTabId = useLabFileTabStore((s) => s.activeTabId);
  const tabs = useLabFileTabStore((s) => s.tabs);

  useInitNotebookTab();

  // Determine if the active tab is the notebook (pinned) tab
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const isNotebookTab = !activeTab || activeTab.pinned;

  const handleCloseBottom = () => {
    if (bottomPanel) togglePanel(bottomPanel);
  };

  const terminalSlot = (
    <PanelSlot
      side="bottom"
      panelId={bottomPanel}
      isConnected={true}
      onClose={handleCloseBottom}
    />
  );

  return (
    <LabModeContext.Provider value={{ isLabMode: true, onExit: null }}>
      <div
        data-slot="mine-app-chrome"
        className="relative flex-1 flex overflow-hidden h-full"
      >
        <ContentFrame
          header={<MineTabBar />}
          className="flex-1 min-w-0"
          bodyClassName={isNotebookTab ? 'overflow-y-auto p-2' : undefined}
          footer={terminalSlot}
        >
          {isNotebookTab ? (
            children
          ) : (
            <Provider store={store}>
              <TooltipProvider>
                <ErrorBoundary>
                  <FileEditor path={activeTab.path} />
                </ErrorBoundary>
              </TooltipProvider>
            </Provider>
          )}
        </ContentFrame>
      </div>
    </LabModeContext.Provider>
  );
}

export { MineAppChrome };
