'use client';

import { FileCode, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Factor } from '@/features/library/types';

interface SourceBlockProps extends React.ComponentProps<'div'> {
  factor: Factor;
  onNavigateToLab?: (workspacePath: string) => void;
}

function SourceBlock({
  factor,
  onNavigateToLab,
  className,
  ...props
}: SourceBlockProps) {
  return (
    <div
      data-slot="source-block"
      className={cn(
        'bg-mine-bg rounded-md px-3 py-2 flex items-center gap-2',
        className,
      )}
      {...props}
    >
      <FileCode className="w-3.5 h-3.5 text-mine-muted shrink-0" />
      <span
        className="text-[11px] font-mono text-mine-text truncate flex-1 min-w-0"
        title={factor.workspacePath}
      >
        {factor.workspacePath}
      </span>
      <button
        type="button"
        className="text-mine-muted hover:text-mine-text transition-colors shrink-0"
        title="在 Lab 中打开"
        onClick={() => {
          if (onNavigateToLab) {
            onNavigateToLab(factor.workspacePath);
          }
        }}
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export { SourceBlock };
