'use client';

import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSnippetPreview } from './use-snippet-preview';
import type { DataSource } from './mock-data';
import type { CellId } from '@/features/lab/core/cells/ids';
import { OutputRenderer } from '@/features/lab/components/editor/Output';
import { useCellRuntime } from '@/features/lab/core/cells/cells';

// ─── Output renderer for a temp cell ────────────────────

function SnippetOutput({ cellId }: { cellId: CellId }) {
  const runtime = useCellRuntime(cellId);

  if (!runtime) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-4 h-4 text-mine-muted animate-spin" />
      </div>
    );
  }

  if (runtime.status === 'running' || runtime.status === 'queued') {
    return (
      <div className="p-4 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 text-mine-muted animate-spin" />
        <span className="panel-hint">执行中...</span>
      </div>
    );
  }

  if (runtime.errored && runtime.output) {
    return (
      <div className="p-3 overflow-auto">
        <OutputRenderer message={runtime.output} cellId={cellId} />
      </div>
    );
  }

  if (
    !runtime.output ||
    runtime.output.data == null ||
    runtime.output.data === ''
  ) {
    return (
      <div className="p-4 flex items-center justify-center">
        <span className="panel-hint">无输出</span>
      </div>
    );
  }

  return (
    <div data-slot="snippet-output" className="p-3 overflow-auto">
      <OutputRenderer message={runtime.output} cellId={cellId} />
    </div>
  );
}

// ─── SnippetStudio component ────────────────────────────

interface SnippetStudioProps extends React.ComponentProps<'div'> {
  source: DataSource;
  onClose: () => void;
}

function SnippetStudio({
  source,
  onClose,
  className,
  ...props
}: SnippetStudioProps) {
  const { snippetData, isLoading, error, tempCellId, insertToNotebook } =
    useSnippetPreview(source.snippetPath ?? null);

  return (
    <div
      data-slot="snippet-studio"
      className={cn('flex flex-col h-full', className)}
      {...props}
    >
      {/* ─── Header ─── */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-mine-border/20">
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-mine-bg rounded transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-mine-muted" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="panel-label truncate">{source.nameZh}</div>
          <div className="font-mono text-[10px] text-mine-muted truncate">
            {source.name}
          </div>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-mine-muted animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-[11px] text-red-500 text-center">{error}</p>
          </div>
        )}

        {snippetData && (
          <>
            {/* Code section */}
            <div className="border-b border-mine-border/20 max-h-[40%] overflow-auto">
              <div className="px-3 py-1.5 border-b border-mine-border/10">
                <span className="panel-label">代码</span>
              </div>
              <pre className="p-3 text-[11px] font-mono leading-relaxed text-mine-text/80 bg-mine-bg/20 overflow-x-auto">
                <code>{snippetData.code}</code>
              </pre>
            </div>

            {/* Output section */}
            <div className="flex-1 overflow-auto">
              <div className="px-3 py-1.5 border-b border-mine-border/10">
                <span className="panel-label">输出</span>
              </div>
              {tempCellId ? (
                <SnippetOutput cellId={tempCellId} />
              ) : (
                <div className="p-4 flex items-center justify-center">
                  <span className="panel-hint">连接 kernel 后预览输出</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ─── Footer ─── */}
      {snippetData && (
        <div className="shrink-0 border-t border-mine-border/20 p-3">
          <button
            type="button"
            data-slot="insert-snippet-btn"
            onClick={() => {
              insertToNotebook();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-mine-nav-active text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            插入到 Notebook
          </button>
        </div>
      )}
    </div>
  );
}

export { SnippetStudio };
