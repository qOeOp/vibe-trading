'use client';

import { useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { XIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Suspense } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ErrorBoundary } from '@/features/lab/components/editor/boundary/ErrorBoundary';
import { PanelSectionProvider } from '../panels/panel-context';
import { LazyActivity } from '@/features/lab/components/utils/lazy-mount';
import { PANEL_MAP, type PanelDescriptor, type PanelType } from '../types';
import { Card } from '@/components/ui/card';
import { useLabChromeStore } from '@/features/lab/store/use-lab-chrome-store';
import { handleDragging } from './utils';

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface FloatingPanelsProps {
  sidebarPanels: Record<PanelType, React.ReactNode>;
}

function PanelCardHeader({
  panel,
  onClose,
}: {
  panel: PanelDescriptor;
  onClose: () => void;
}) {
  return (
    <div
      data-slot="panel-card-header"
      className="flex items-center justify-between px-4 py-2.5 border-b border-mine-border/50 shrink-0"
    >
      <div className="flex items-center gap-2">
        <panel.Icon className="w-3.5 h-3.5 text-mine-muted" strokeWidth={1.5} />
        <span className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          {panel.label}
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-mine-muted hover:text-mine-text transition-colors cursor-pointer"
      >
        <XIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

function PaginationFooter({
  currentPage,
  pageCount,
  onPageChange,
}: {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <div
      data-slot="panel-pagination"
      className="flex items-center justify-center gap-2 py-2 shrink-0"
    >
      <button
        type="button"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-mine-muted hover:text-mine-text disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-xs text-mine-muted font-mono tabular-nums">
        {currentPage + 1} / {pageCount}
      </span>
      <button
        type="button"
        disabled={currentPage >= pageCount - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="text-mine-muted hover:text-mine-text disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function FloatingPanels({ sidebarPanels }: FloatingPanelsProps) {
  const openPanels = useLabChromeStore((s) => s.openPanels);
  const currentPage = useLabChromeStore((s) => s.currentPage);
  const closePanel = useLabChromeStore((s) => s.closePanel);
  const setCurrentPage = useLabChromeStore((s) => s.setCurrentPage);

  const pageCount = Math.ceil(openPanels.length / 2);

  const visiblePanels = useMemo(() => {
    const start = currentPage * 2;
    return openPanels.slice(start, start + 2);
  }, [openPanels, currentPage]);

  const visibleDescriptors = useMemo(() => {
    return visiblePanels
      .map((id) => PANEL_MAP.get(id as PanelType))
      .filter((d): d is PanelDescriptor => d != null);
  }, [visiblePanels]);

  if (visibleDescriptors.length === 0) return null;

  const renderCard = (descriptor: PanelDescriptor) => (
    <Card
      key={descriptor.type}
      data-slot="floating-panel-card"
      className="h-full"
    >
      <PanelCardHeader
        panel={descriptor}
        onClose={() => closePanel(descriptor.type)}
      />
      <div className="flex-1 overflow-hidden">
        <ErrorBoundary>
          <PanelSectionProvider value="sidebar">
            <Suspense>
              <TooltipProvider>
                {Object.entries(sidebarPanels).map(([key, PanelContent]) => (
                  <LazyActivity
                    key={key}
                    mode={key === descriptor.type ? 'visible' : 'hidden'}
                  >
                    {PanelContent}
                  </LazyActivity>
                ))}
              </TooltipProvider>
            </Suspense>
          </PanelSectionProvider>
        </ErrorBoundary>
      </div>
    </Card>
  );

  return (
    <div data-slot="floating-panels" className="flex flex-col h-full gap-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className="flex-1 min-h-0"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {visibleDescriptors.length === 1 ? (
            renderCard(visibleDescriptors[0])
          ) : (
            <PanelGroup
              direction="vertical"
              autoSaveId="marimo:chrome:lab-cards:v1"
            >
              <Panel id="lab-card-top" minSize={20}>
                {renderCard(visibleDescriptors[0])}
              </Panel>
              <PanelResizeHandle
                onDragging={handleDragging}
                className="h-2 flex items-center justify-center group cursor-row-resize shrink-0"
              >
                <div className="w-8 h-0.5 rounded-full bg-mine-border group-hover:bg-mine-accent-teal transition-colors" />
              </PanelResizeHandle>
              <Panel id="lab-card-bottom" minSize={20}>
                {renderCard(visibleDescriptors[1])}
              </Panel>
            </PanelGroup>
          )}
        </motion.div>
      </AnimatePresence>
      <PaginationFooter
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export { FloatingPanels };
