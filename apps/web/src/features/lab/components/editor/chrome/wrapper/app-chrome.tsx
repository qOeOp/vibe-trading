/* Copyright 2026 Marimo. All rights reserved. */
import React, { type PropsWithChildren, Suspense } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Footer } from './footer';
import './app-chrome.css';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ErrorBoundary } from '@/features/lab/components/editor/boundary/ErrorBoundary';
import { ContextAwarePanel } from '../panels/context-aware-panel/context-aware-panel';
import type { PanelType } from '../types';
import { PanelsWrapper } from './panels';
import { PendingAICells } from './pending-ai-cells';
import { useAiPanelTab } from './useAiPanel';
import { handleDragging } from './utils';
import { useLabChromeStore } from '@/features/lab/store/use-lab-chrome-store';
import { FloatingPanels } from './floating-panels';
import { LabModeContext } from '@/features/lab/components/lab-mode-context';
import { getFeatureFlag } from '@/features/lab/core/config/feature-flag';

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
  const { aiPanelTab } = useAiPanelTab();
  const hasOpenPanels = useLabChromeStore((s) => s.openPanels.length > 0);

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
    'data-catalog': <LazyDataCatalogPanel />,
    datasources: null,
    errors: <LazyErrorsPanel />,
    validation: <LazyValidationPanel />,
    terminal: null,
  };

  const appBodyPanel = (
    <Panel id="app" key="app" className="relative h-full">
      <Suspense>{children}</Suspense>
    </Panel>
  );

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
};
