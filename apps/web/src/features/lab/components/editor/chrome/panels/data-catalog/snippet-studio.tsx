'use client';

import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSnippetPreview } from './use-snippet-preview';
import type { DataSource } from './mock-data';

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
  const { snippetData, isLoading, error } = useSnippetPreview(
    source.snippetPath ?? null,
  );

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
            <div className="border-b border-mine-border/20 max-h-[50%] overflow-auto">
              <div className="px-3 py-1.5 border-b border-mine-border/10">
                <span className="panel-label">代码</span>
              </div>
              <pre className="p-3 text-[11px] font-mono leading-relaxed text-mine-text/80 bg-mine-bg/20 overflow-x-auto">
                <code>{snippetData.code}</code>
              </pre>
            </div>

            {/* Output section — stub until kernel integration */}
            <div className="flex-1 overflow-auto">
              <div className="px-3 py-1.5 border-b border-mine-border/10">
                <span className="panel-label">输出</span>
              </div>
              <div className="p-4 flex items-center justify-center">
                <p className="panel-hint text-center">连接 kernel 后预览输出</p>
              </div>
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
              // TODO: implement actual cell insertion via useCellActions().createNewCell()
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
