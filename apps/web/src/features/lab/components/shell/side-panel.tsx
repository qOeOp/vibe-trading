'use client';

import { lazy, Suspense } from 'react';
import { Provider } from 'jotai';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import { store } from '@/features/lab/core/state/jotai';
import { PanelSectionProvider } from '../editor/chrome/panels/panel-context';
import { ErrorBoundary } from '../editor/boundary/ErrorBoundary';
import { PANEL_ITEMS } from './activity-bar';

// ─── Marimo real panel lazy imports (connected mode) ────

const LazySessionPanel = lazy(
  () => import('../editor/chrome/panels/session-panel'),
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
// SystemStatusPanel removed — CPU/memory moved to ActivityBar

// ─── Disconnected-mode lite panel lazy imports ──────────

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
// LiteSystemStatusPanel removed — CPU/memory moved to ActivityBar

// ─── Marimo panel IDs that have real implementations ────

const MARIMO_PANEL_IDS = new Set([
  'variables',
  'packages',
  'snippets',
  'errors',
  'validation',
]);

// ─── Panel Content Routers ──────────────────────────────

function ConnectedPanelContent({ panelId }: { panelId: string }) {
  if (!MARIMO_PANEL_IDS.has(panelId)) {
    return <DisconnectedPanelContent panelId={panelId} />;
  }

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

function ConnectedPanelRouter({ panelId }: { panelId: string }) {
  switch (panelId) {
    case 'variables':
      return <LazySessionPanel />;
    case 'packages':
      return <LazyPackagesPanel />;
    case 'snippets':
      return <LazyDataCatalogPanel />;
    case 'errors':
      return <LazyErrorsPanel />;
    case 'validation':
      return <LazyValidationPanel />;
    default:
      return null;
  }
}

function DisconnectedPanelContent({ panelId }: { panelId: string }) {
  switch (panelId) {
    case 'variables':
      return <LiteVariablePanel />;
    case 'errors':
      return <LiteErrorPanel />;
    default:
      return <PlaceholderPanel panelId={panelId} />;
  }
}

function PlaceholderPanel({ panelId }: { panelId: string }) {
  const item = PANEL_ITEMS.find((p) => p.id === panelId);
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

// ─── Side Panel ──────────────────────────────────────────

type SidePanelProps = {
  panelId: string | null;
  onClose: () => void;
  isConnected: boolean;
  className?: string;
};

function SidePanel({
  panelId,
  onClose,
  isConnected,
  className,
}: SidePanelProps) {
  const item = panelId ? PANEL_ITEMS.find((p) => p.id === panelId) : null;
  const width = item?.width ?? 280;

  return (
    <AnimatePresence mode="wait">
      {panelId && (
        <motion.div
          key={panelId}
          data-slot="side-panel"
          className={cn(
            'shrink-0 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden',
            className,
          )}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-mine-border/30">
            <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
              {item?.label ?? panelId}
            </span>
            <button
              className="w-5 h-5 flex items-center justify-center rounded text-[#a3a3a3] hover:text-[#525252] hover:bg-[#f5f5f5] transition-colors"
              onClick={onClose}
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
          </div>

          {/* Panel body */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <Suspense
              fallback={
                <div className="flex-1 flex flex-col gap-2 p-4">
                  <div className="h-3 w-3/4 rounded bg-mine-border animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-mine-border animate-pulse" />
                  <div className="h-3 w-2/3 rounded bg-mine-border animate-pulse" />
                </div>
              }
            >
              {isConnected ? (
                <ConnectedPanelContent panelId={panelId} />
              ) : (
                <DisconnectedPanelContent panelId={panelId} />
              )}
            </Suspense>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { SidePanel };
