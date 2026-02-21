'use client';

import { lazy, Suspense } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { PANEL_ITEMS } from './activity-bar';

// ─── Lazy-load panel components ──────────────────────────

// Marimo data panels
const FileExplorerPanel = lazy(() =>
  import('../panels/file-explorer-panel').then((m) => ({
    default: m.FileExplorerPanel,
  })),
);
const VariablePanel = lazy(() =>
  import('../panels/variable-panel').then((m) => ({
    default: m.VariablePanel,
  })),
);
const DependencyGraphPanel = lazy(() =>
  import('../panels/dependency-graph-panel').then((m) => ({
    default: m.DependencyGraphPanel,
  })),
);
const OutlinePanel = lazy(() =>
  import('../panels/outline-panel').then((m) => ({
    default: m.OutlinePanel,
  })),
);

// Marimo developer panels
const ErrorPanel = lazy(() =>
  import('../panels/error-panel').then((m) => ({
    default: m.ErrorPanel,
  })),
);
const LogsPanel = lazy(() =>
  import('../panels/logs-panel').then((m) => ({
    default: m.LogsPanel,
  })),
);

// ─── Panel Content Router ────────────────────────────────

function PanelContent({ panelId }: { panelId: string }) {
  switch (panelId) {
    // Marimo data panels
    case 'files':
      return <FileExplorerPanel />;
    case 'variables':
      return <VariablePanel />;
    case 'dependencies':
      return <DependencyGraphPanel />;
    case 'outline':
      return <OutlinePanel />;

    // Marimo developer panels
    case 'errors':
      return <ErrorPanel />;
    case 'logs':
      return <LogsPanel />;

    // Mine custom panels — placeholder until business design
    case 'variables-mine':
    case 'components':
    case 'ai':
    case 'snippets-mine':
    case 'experiments':
      return <PlaceholderPanel panelId={panelId} />;

    default:
      return null;
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
//
// Push-aside panel container. Renders between editor and
// activity bar. Width varies per panel definition.

type SidePanelProps = {
  panelId: string | null;
  onClose: () => void;
  className?: string;
};

function SidePanel({ panelId, onClose, className }: SidePanelProps) {
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
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="w-4 h-4 rounded-full border-2 border-mine-border border-t-mine-muted animate-spin" />
                </div>
              }
            >
              <PanelContent panelId={panelId} />
            </Suspense>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { SidePanel };
