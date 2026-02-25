/* Copyright 2026 Marimo. All rights reserved. */
import React, {
  type PropsWithChildren,
  Suspense,
  useEffect,
  useMemo,
} from 'react';
import {
  type ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { Footer } from './footer';
import { Sidebar } from './sidebar';
import './app-chrome.css';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useAtom, useAtomValue } from 'jotai';
import { XIcon } from 'lucide-react';
import { Button } from '@/features/lab/components/ui/button';
import { ReorderableList } from '@/features/lab/components/ui/reorderable-list';
import { Tabs, TabsList, TabsTrigger } from '@/features/lab/components/ui/tabs';
import { LazyActivity } from '@/features/lab/components/utils/lazy-mount';
import { cellErrorCount } from '@/features/lab/core/cells/cells';
import { capabilitiesAtom } from '@/features/lab/core/config/capabilities';
import { getFeatureFlag } from '@/features/lab/core/config/feature-flag';
import { cn } from '@/features/lab/utils/cn';
import { ErrorBoundary } from '@/features/lab/components/editor/boundary/ErrorBoundary';
import { ContextAwarePanel } from '../panels/context-aware-panel/context-aware-panel';
import { PanelSectionProvider } from '../panels/panel-context';
import { panelLayoutAtom, useChromeActions, useChromeState } from '../state';
import {
  isPanelHidden,
  PANEL_MAP,
  PANELS,
  type PanelDescriptor,
  type PanelType,
} from '../types';
import { BackendConnectionStatus } from './footer-items/backend-status';
import { LspStatus } from './footer-items/lsp-status';
import { PanelsWrapper } from './panels';
import { PendingAICells } from './pending-ai-cells';
import { useAiPanelTab } from './useAiPanel';
import { handleDragging } from './utils';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { useLabChromeStore } from '@/features/lab/store/use-lab-chrome-store';
import { FloatingPanels } from './floating-panels';
import { LabModeContext } from '@/features/lab/components/lab-mode-context';

const LazyChatPanel = React.lazy(() => import('@/components/chat/chat-panel'));
const LazyAgentPanel = React.lazy(
  () => import('@/components/chat/acp/agent-panel'),
);
const LazySessionPanel = React.lazy(() => import('../panels/session-panel'));
const LazyErrorsPanel = React.lazy(() => import('../panels/error-panel'));
const LazyFileExplorerPanel = React.lazy(
  () => import('../panels/file-explorer-panel'),
);
const LazyPackagesPanel = React.lazy(() => import('../panels/packages-panel'));
const LazySnippetsPanel = React.lazy(() => import('../panels/snippets-panel'));
const LazyDataCatalogPanel = React.lazy(() =>
  import('../panels/data-catalog/data-catalog-panel').then((m) => ({
    default: m.DataCatalogPanel,
  })),
);
const LazyValidationPanel = React.lazy(
  () => import('../panels/validation-panel'),
);

export const AppChrome: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    isSidebarOpen,
    isDeveloperPanelOpen,
    selectedPanel,
    selectedDeveloperPanelTab,
  } = useChromeState();
  const { setIsSidebarOpen, setIsDeveloperPanelOpen, openApplication } =
    useChromeActions();
  const sidebarRef = React.useRef<ImperativePanelHandle>(null);
  const developerPanelRef = React.useRef<ImperativePanelHandle>(null);
  const { aiPanelTab, setAiPanelTab } = useAiPanelTab();
  const errorCount = useAtomValue(cellErrorCount);
  const [panelLayout, setPanelLayout] = useAtom(panelLayoutAtom);
  // Subscribe to capabilities to re-render when they change (e.g., terminal capability)
  const capabilities = useAtomValue(capabilitiesAtom);
  const labMode = useLabModeStore((s) => s.mode);
  const isLabActive = labMode === 'active';

  // Convert current developer panel items to PanelDescriptors
  // Filter out hidden panels (e.g., terminal when capability is not available)
  const devPanelItems = useMemo(() => {
    return panelLayout.developerPanel.flatMap((id) => {
      const panel = PANEL_MAP.get(id);
      if (!panel || isPanelHidden(panel, capabilities)) {
        return [];
      }
      return [panel];
    });
  }, [panelLayout.developerPanel, capabilities]);

  const handleSetDevPanelItems = (items: PanelDescriptor[]) => {
    setPanelLayout((prev) => ({
      ...prev,
      developerPanel: items.map((item) => item.type),
    }));
  };

  const handleDevPanelReceive = (item: PanelDescriptor, fromListId: string) => {
    // Remove from the source list
    if (fromListId === 'sidebar') {
      setPanelLayout((prev) => ({
        ...prev,
        sidebar: prev.sidebar.filter((id) => id !== item.type),
      }));

      // If the moved item was selected in sidebar, select the first remaining item
      if (selectedPanel === item.type) {
        const remainingSidebar = panelLayout.sidebar.filter(
          (id) => id !== item.type,
        );
        if (remainingSidebar.length > 0) {
          openApplication(remainingSidebar[0]);
        }
      }
    }

    // Select the dropped item in developer panel
    openApplication(item.type);
  };

  // Get panels available for developer panel context menu
  // Only show panels that are NOT in the sidebar
  const availableDevPanels = useMemo(() => {
    const sidebarIds = new Set(panelLayout.sidebar);
    return PANELS.filter((p) => {
      if (isPanelHidden(p, capabilities)) {
        return false;
      }
      // Exclude panels that are in the sidebar
      if (sidebarIds.has(p.type)) {
        return false;
      }
      return true;
    });
  }, [panelLayout.sidebar, capabilities]);

  // sync sidebar
  useEffect(() => {
    if (!sidebarRef.current) {
      return;
    }

    const isCurrentlyCollapsed = sidebarRef.current.isCollapsed();
    if (isSidebarOpen && isCurrentlyCollapsed) {
      sidebarRef.current.expand();
    }
    if (!isSidebarOpen && !isCurrentlyCollapsed) {
      sidebarRef.current.collapse();
    }

    // Dispatch a resize event so widgets know to resize
    requestAnimationFrame(() => {
      // HACK: Unfortunately, we have to do this twice to make sure it the
      // panel is fully expanded before we dispatch the resize event
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    });
  }, [isSidebarOpen]);

  // sync panel
  useEffect(() => {
    if (!developerPanelRef.current) {
      return;
    }

    const isCurrentlyCollapsed = developerPanelRef.current.isCollapsed();
    if (isDeveloperPanelOpen && isCurrentlyCollapsed) {
      developerPanelRef.current.expand();
    }
    if (!isDeveloperPanelOpen && !isCurrentlyCollapsed) {
      developerPanelRef.current.collapse();
    }

    // Dispatch a resize event so widgets know to resize
    requestAnimationFrame(() => {
      // HACK: Unfortunately, we have to do this twice to make sure it the
      // panel is fully expanded before we dispatch the resize event
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    });
  }, [isDeveloperPanelOpen]);

  // Auto-correct developer panel selection when the selected tab is no longer available
  useEffect(() => {
    if (!isDeveloperPanelOpen) {
      return;
    }
    const isSelectionValid = devPanelItems.some(
      (p) => p.type === selectedDeveloperPanelTab,
    );
    if (!isSelectionValid) {
      if (devPanelItems.length > 0) {
        openApplication(devPanelItems[0].type);
      } else {
        setIsDeveloperPanelOpen(false);
      }
    }
  }, [
    isDeveloperPanelOpen,
    devPanelItems,
    selectedDeveloperPanelTab,
    openApplication,
    setIsDeveloperPanelOpen,
  ]);

  // Sync Zustand (lab chrome store) → Jotai (Marimo chrome state) in lab mode
  const labChromePanel = useLabChromeStore((s) => s.selectedPanel);
  const labChromeSidebarOpen = useLabChromeStore((s) => s.isSidebarOpen);
  const hasOpenPanels = useLabChromeStore((s) => s.openPanels.length > 0);

  useEffect(() => {
    if (!isLabActive) return;
    if (labChromeSidebarOpen && labChromePanel) {
      openApplication(labChromePanel as PanelType);
      setIsSidebarOpen(true);
    } else if (!labChromeSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [
    isLabActive,
    labChromeSidebarOpen,
    labChromePanel,
    openApplication,
    setIsSidebarOpen,
  ]);

  const appBodyPanel = (
    <Panel id="app" key="app" className="relative h-full">
      <Suspense>{children}</Suspense>
    </Panel>
  );

  const helperResizeHandle = (
    <PanelResizeHandle
      onDragging={handleDragging}
      disabled={!isSidebarOpen}
      hitAreaMargins={{ coarse: 15, fine: 2 }}
      className={cn(
        'border-border print:hidden z-10',
        isSidebarOpen ? 'resize-handle' : 'resize-handle-collapsed',
        'vertical',
      )}
    />
  );

  const panelResizeHandle = (
    <PanelResizeHandle
      onDragging={handleDragging}
      disabled={!isDeveloperPanelOpen}
      className={cn(
        'border-border print:hidden z-20',
        isDeveloperPanelOpen ? 'resize-handle' : 'resize-handle-collapsed',
        'horizontal',
      )}
    />
  );

  const agentsEnabled = getFeatureFlag('external_agents');

  const renderAiPanel = () => {
    if (agentsEnabled && aiPanelTab === 'agents') {
      return <LazyAgentPanel />;
    }
    return <LazyChatPanel />;
  };

  const SIDEBAR_PANELS: Record<PanelType, React.ReactNode> = {
    files: <LazyFileExplorerPanel />,
    variables: <LazySessionPanel />,
    packages: <LazyPackagesPanel />,
    ai: renderAiPanel(),
    snippets: <LazyDataCatalogPanel />,
    errors: <LazyErrorsPanel />,
    validation: <LazyValidationPanel />,
    terminal: null,
  };

  const helpPaneBody = (
    <ErrorBoundary>
      <PanelSectionProvider value="sidebar">
        <div className="flex flex-col h-full flex-1 overflow-hidden mr-[-4px]">
          <div className="p-3 border-b flex justify-between items-center">
            {selectedPanel === 'ai' && agentsEnabled ? (
              <Tabs
                value={aiPanelTab}
                onValueChange={(value) => {
                  if (value === 'chat' || value === 'agents') {
                    setAiPanelTab(value);
                  }
                }}
              >
                <TabsList>
                  <TabsTrigger
                    value="chat"
                    className="py-0.5 text-xs uppercase tracking-wide font-bold"
                  >
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="agents"
                    className="py-0.5 text-xs uppercase tracking-wide font-bold"
                  >
                    Agents
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <span className="text-sm text-(--slate-11) uppercase tracking-wide font-semibold flex-1">
                {selectedPanel}
              </span>
            )}
            <Button
              data-testid="close-helper-pane"
              className="m-0"
              size="xs"
              variant="text"
              onClick={() => setIsSidebarOpen(false)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
          <Suspense>
            <TooltipProvider>
              {Object.entries(SIDEBAR_PANELS).map(([key, Panel]) => (
                <LazyActivity
                  key={key}
                  mode={
                    isSidebarOpen && selectedPanel === key
                      ? 'visible'
                      : 'hidden'
                  }
                >
                  {Panel}
                </LazyActivity>
              ))}
            </TooltipProvider>
          </Suspense>
        </div>
      </PanelSectionProvider>
    </ErrorBoundary>
  );

  const helperPanel = (
    <Panel
      ref={sidebarRef}
      // This cannot by dynamic and must be constant
      // so that the size is preserved between page loads
      id="app-chrome-sidebar"
      data-testid="helper"
      key={'helper'}
      collapsedSize={0}
      collapsible={true}
      className={cn(
        'print:hidden hide-on-fullscreen',
        isLabActive
          ? cn(
              'bg-white shadow-sm rounded-xl m-2 mr-0 overflow-hidden',
              isSidebarOpen
                ? 'border border-mine-border'
                : 'border border-transparent',
            )
          : cn(
              'dark:bg-(--slate-1)',
              isSidebarOpen && 'border-r border-l border-(--slate-7)',
            ),
      )}
      minSize={10}
      // We can't make the default size greater than 0, otherwise it will start open
      defaultSize={0}
      maxSize={75}
      onResize={(size, prevSize) => {
        // This means it started closed and is opening for the first time
        if (prevSize === 0 && size === 10) {
          sidebarRef.current?.resize(30);
        }
      }}
      onCollapse={() => setIsSidebarOpen(false)}
      onExpand={() => setIsSidebarOpen(true)}
    >
      <span className="flex flex-row h-full">
        {helpPaneBody} {helperResizeHandle}
      </span>
    </Panel>
  );

  const DEVELOPER_PANELS: Record<PanelType, React.ReactNode> = {
    ...SIDEBAR_PANELS,
  };

  const bottomPanel = (
    <Panel
      ref={developerPanelRef}
      // This cannot by dynamic and must be constant
      // so that the size is preserved between page loads
      id="app-chrome-panel"
      data-testid="panel"
      key={'panel'}
      collapsedSize={0}
      collapsible={true}
      className={cn(
        'dark:bg-(--slate-1) print:hidden hide-on-fullscreen',
        isDeveloperPanelOpen && 'border-t',
      )}
      minSize={10}
      // We can't make the default size greater than 0, otherwise it will start open
      defaultSize={0}
      maxSize={75}
      onResize={(size, prevSize) => {
        // This means it started closed and is opening for the first time
        if (prevSize === 0 && size === 10) {
          developerPanelRef.current?.resize(30);
        }
      }}
      onCollapse={() => setIsDeveloperPanelOpen(false)}
      onExpand={() => setIsDeveloperPanelOpen(true)}
    >
      {panelResizeHandle}
      <div className="flex flex-col h-full">
        {/* Panel header with tabs */}
        <div className="flex items-center justify-between border-b px-2 h-8 bg-background shrink-0">
          <ReorderableList<PanelDescriptor>
            value={devPanelItems}
            setValue={handleSetDevPanelItems}
            getKey={(p) => p.type}
            availableItems={availableDevPanels}
            crossListDrag={{
              dragType: 'panels',
              listId: 'developer-panel',
              onReceive: handleDevPanelReceive,
            }}
            getItemLabel={(panel) => (
              <span className="flex items-center gap-2">
                <panel.Icon className="w-4 h-4 text-muted-foreground" />
                {panel.label}
              </span>
            )}
            ariaLabel="Developer panel tabs"
            className="flex flex-row gap-1"
            minItems={0}
            onAction={(panel) => openApplication(panel.type)}
            renderItem={(panel) => (
              <div
                className={cn(
                  'text-sm flex gap-2 px-2 pt-1 pb-0.5 items-center leading-none rounded-sm cursor-pointer',
                  selectedDeveloperPanelTab === panel.type
                    ? 'bg-muted'
                    : 'hover:bg-muted/50',
                )}
              >
                <panel.Icon
                  className={cn(
                    'w-4 h-4',
                    panel.type === 'errors' &&
                      errorCount > 0 &&
                      'text-destructive',
                  )}
                />
                {panel.label}
              </div>
            )}
          />
          <div className="border-l border-border h-4 mx-1" />
          <BackendConnectionStatus />
          <LspStatus />
          <div className="flex-1" />
          <Button
            size="xs"
            variant="text"
            onClick={() => setIsDeveloperPanelOpen(false)}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
        {/* Panel content */}
        <Suspense fallback={<div />}>
          <PanelSectionProvider value="developer-panel">
            <div className="flex-1 overflow-hidden">
              {Object.entries(DEVELOPER_PANELS).map(([key, Panel]) => (
                <LazyActivity
                  key={key}
                  mode={
                    isDeveloperPanelOpen && selectedDeveloperPanelTab === key
                      ? 'visible'
                      : 'hidden'
                  }
                >
                  {Panel}
                </LazyActivity>
              ))}
            </div>
          </PanelSectionProvider>
        </Suspense>
      </div>
    </Panel>
  );

  // Lab active mode: floating cards on left, editor center, context panel right
  if (isLabActive) {
    return (
      <PanelsWrapper>
        <PanelGroup autoSaveId="marimo:chrome:lab:v1" direction={'horizontal'}>
          {/* Floating cards — only when panels are open */}
          {hasOpenPanels && (
            <>
              <Panel
                id="lab-floating-cards"
                defaultSize={30}
                minSize={20}
                maxSize={50}
                className="p-3 pr-0"
              >
                <FloatingPanels sidebarPanels={SIDEBAR_PANELS} />
              </Panel>
              <PanelResizeHandle
                onDragging={handleDragging}
                className="w-2 flex items-center justify-center group cursor-col-resize"
              >
                <div className="h-8 w-0.5 rounded-full bg-mine-border group-hover:bg-mine-accent-teal transition-colors" />
              </PanelResizeHandle>
            </>
          )}
          <Panel id="app-chrome-body" className="relative">
            <LabModeContext.Provider value={{ isLabMode: true, onExit: null }}>
              <div
                data-slot="lab-fullscreen"
                className="flex-1 flex flex-col overflow-hidden h-full"
              >
                {appBodyPanel}
              </div>
            </LabModeContext.Provider>
            {/* Progressive blur overlay — fades editor into dock */}
            <div data-slot="editor-progressive-blur" />
            {/* Floating dock — positioned relative to editor body */}
            <ErrorBoundary>
              <TooltipProvider>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <Footer />
                </div>
              </TooltipProvider>
            </ErrorBoundary>
          </Panel>
          <ContextAwarePanel />
        </PanelGroup>
        <PendingAICells />
      </PanelsWrapper>
    );
  }

  return (
    <PanelsWrapper>
      <PanelGroup autoSaveId="marimo:chrome:v1:l2" direction={'horizontal'}>
        <TooltipProvider>
          <Sidebar />
        </TooltipProvider>
        {helperPanel}
        <Panel
          id="app-chrome-body"
          className={cn(isDeveloperPanelOpen && !isSidebarOpen && 'border-l')}
        >
          <PanelGroup autoSaveId="marimo:chrome:v1:l1" direction="vertical">
            {appBodyPanel}
            {bottomPanel}
          </PanelGroup>
        </Panel>
        <ContextAwarePanel />
      </PanelGroup>
      <PendingAICells />
      <ErrorBoundary>
        <TooltipProvider>
          <Footer />
        </TooltipProvider>
      </ErrorBoundary>
    </PanelsWrapper>
  );
};
