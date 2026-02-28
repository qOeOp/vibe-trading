'use client';

import { type PropsWithChildren, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Panel Shell ─────────────────────────────────────────
//
// Shared visual container for left/right sidepanels.
// Provides: white card + header bar + scrollable body.
// Does NOT handle animation — that's the caller's job.

type PanelShellProps = PropsWithChildren<{
  /** Header label text (uppercased automatically) */
  title: string;
  /** Show close (X) button — pass handler to enable */
  onClose?: () => void;
  /** Extra content in the header right area (before close button) */
  headerRight?: ReactNode;
  /** Additional className on the outer container */
  className?: string;
}>;

function PanelShell({
  title,
  onClose,
  headerRight,
  className,
  children,
}: PanelShellProps) {
  return (
    <div
      data-slot="panel-shell"
      className={cn(
        'flex flex-col bg-white rounded-lg border border-mine-border/30 overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-mine-border/30">
        <span className="text-panel-header font-semibold text-mine-muted uppercase tracking-wider">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {headerRight}
          {onClose && (
            <button
              className="w-5 h-5 flex items-center justify-center rounded text-[#a3a3a3] hover:text-[#525252] hover:bg-[#f5f5f5] transition-colors"
              onClick={onClose}
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Body — flex column so children can use flex-1 for height measurement */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
        {children}
      </div>
    </div>
  );
}

export { PanelShell, type PanelShellProps };
