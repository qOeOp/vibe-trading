'use client';

import { lazy, Suspense } from 'react';
import { Provider } from 'jotai';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { store } from '@/features/lab/core/state/jotai';
import { PanelSectionProvider } from '../editor/chrome/panels/panel-context';
import { ErrorBoundary } from '../editor/boundary/ErrorBoundary';
import { MCPStatusIndicator } from '../mcp/mcp-status-indicator';
import { getPanelDef } from './panels';
import { StaticFileTreeContent } from './mine-file-tree';

// ─── Lazy panel imports (connected mode) ─────────────────

const ConnectedFileTreeInner = lazy(() => import('./connected-file-tree'));

const LazyVariablesPanel = lazy(
  () => import('../editor/chrome/panels/variables-panel'),
);
const LazyDataSourcesPanel = lazy(
  () => import('../editor/chrome/panels/datasources-panel'),
);
const LazyPackagesPanel = lazy(
  () => import('../editor/chrome/panels/packages-panel'),
);
const LazyDataCatalogPanel = lazy(() =>
  import('../editor/chrome/panels/data-catalog/data-catalog-panel').then(
    (m) => ({ default: m.DataCatalogPanel }),
  ),
);
const LazyErrorsPanel = lazy(
  () => import('../editor/chrome/panels/error-panel'),
);
const LazyValidationPanel = lazy(
  () => import('../editor/chrome/panels/validation-panel'),
);
const LazyChatPanel = lazy(() => import('../chat/chat-panel'));
const LazyLogsPanel = lazy(() => import('./vt-logs-panel'));
const LazyDependencyGraphPanel = lazy(
  () => import('../editor/chrome/panels/dependency-graph-panel'),
);
const LazySecretsPanel = lazy(() =>
  import('../editor/chrome/panels/secrets-panel').then((m) => ({
    default: m.SecretsPanel,
  })),
);
const LazyOutlinePanel = lazy(
  () => import('../editor/chrome/panels/outline-panel'),
);

// ─── Lazy panel imports (disconnected mode) ──────────────

const LiteVariablePanel = lazy(() =>
  import('../panels/variable-panel').then((m) => ({
    default: m.VariablePanel,
  })),
);
const LiteErrorPanel = lazy(() =>
  import('../panels/error-panel').then((m) => ({
    default: m.ErrorPanel,
  })),
);

// ─── Marimo panel IDs with real kernel implementations ───

const MARIMO_PANEL_IDS = new Set([
  'ai',
  'variables',
  'datasources',
  'packages',
  'data-catalog',
  'errors',
  'validation',
  'logs',
  'dependencies',
  'secrets',
  'outline',
]);

// ─── Skeleton fallback ───────────────────────────────────

function PanelSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-2 p-4">
      <div className="h-3 w-3/4 rounded bg-mine-border animate-pulse" />
      <div className="h-3 w-1/2 rounded bg-mine-border animate-pulse" />
      <div className="h-3 w-2/3 rounded bg-mine-border animate-pulse" />
    </div>
  );
}

// ─── Placeholder ─────────────────────────────────────────

function PlaceholderPanel({ panelId }: { panelId: string }) {
  const item = getPanelDef(panelId);
  return (
    <div
      data-slot="placeholder-panel"
      className="flex-1 flex flex-col items-center justify-center gap-3 text-mine-muted"
    >
      {item && <item.icon className="w-8 h-8 opacity-30" strokeWidth={1.5} />}
      <span className="text-xs font-medium">{item?.label ?? panelId}</span>
      <span className="text-[10px] opacity-50">Coming soon</span>
    </div>
  );
}

// ─── Header extras ───────────────────────────────────────

function getPanelHeaderRight(
  panelId: string,
  isConnected: boolean,
): React.ReactNode {
  if (isConnected && panelId === 'ai') {
    return <MCPStatusIndicator compact />;
  }
  return undefined;
}

// ─── Content Router ──────────────────────────────────────

type PanelContentProps = {
  panelId: string;
  isConnected: boolean;
};

function PanelContent({ panelId, isConnected }: PanelContentProps) {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      {isConnected ? (
        <ConnectedContent panelId={panelId} />
      ) : (
        <DisconnectedContent panelId={panelId} />
      )}
    </Suspense>
  );
}

// ─── Connected ───────────────────────────────────────────

function ConnectedContent({ panelId }: { panelId: string }) {
  // File tree: Mine-native rendering (no CSS overrides needed)
  if (panelId === 'files') {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ConnectedFileTreeInner />
      </div>
    );
  }

  // Marimo panels: wrap in jotai Provider + context
  if (MARIMO_PANEL_IDS.has(panelId)) {
    return (
      <Provider store={store}>
        <PanelSectionProvider value="sidebar">
          <TooltipProvider>
            <ErrorBoundary>
              <ConnectedPanelRouter panelId={panelId} />
            </ErrorBoundary>
          </TooltipProvider>
        </PanelSectionProvider>
      </Provider>
    );
  }

  // Mine custom panels without kernel implementation → disconnected fallback
  return <DisconnectedContent panelId={panelId} />;
}

function ConnectedPanelRouter({ panelId }: { panelId: string }) {
  switch (panelId) {
    case 'ai':
      return <LazyChatPanel />;
    case 'variables':
      return <LazyVariablesPanel />;
    case 'datasources':
      return <LazyDataSourcesPanel />;
    case 'packages':
      return <LazyPackagesPanel />;
    case 'data-catalog':
      return <LazyDataCatalogPanel />;
    case 'errors':
      return <LazyErrorsPanel />;
    case 'validation':
      return <LazyValidationPanel />;
    case 'logs':
      return <LazyLogsPanel />;
    case 'dependencies':
      return <LazyDependencyGraphPanel />;
    case 'secrets':
      return <LazySecretsPanel />;
    case 'outline':
      return <LazyOutlinePanel />;
    default:
      return null;
  }
}

// ─── Disconnected ────────────────────────────────────────

function DisconnectedContent({ panelId }: { panelId: string }) {
  switch (panelId) {
    case 'files':
      return <StaticFileTreeContent />;
    case 'data-catalog':
      return <LazyDataCatalogPanel />;
    case 'variables':
      return <LiteVariablePanel />;
    case 'errors':
      return <LiteErrorPanel />;
    default:
      return <PlaceholderPanel panelId={panelId} />;
  }
}

export { PanelContent, getPanelHeaderRight };
