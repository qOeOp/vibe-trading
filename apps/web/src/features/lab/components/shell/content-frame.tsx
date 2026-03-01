'use client';

import { type PropsWithChildren, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUTTON_SHADOW, BUTTON_INSET } from './panels';

// ─── Content Frame ──────────────────────────────────────
//
// Shared visual container for all three frame types in the IDE body:
// editor, left panel, right panel. Provides the rounded inset-shadow
// card with a slim header bar (title left, actions + close right).
//
// Header renders custom content via `header` prop. If `title` is
// provided, a default header with title + close button is rendered.

type ContentFrameProps = PropsWithChildren<{
  /** Header content — overrides default title/close header */
  header?: ReactNode;
  /** Simple title text (used when `header` is not provided) */
  title?: string;
  /** Extra content in the header right area (before close button) */
  headerRight?: ReactNode;
  /** Close handler — shows red close button when provided */
  onClose?: () => void;
  /** Additional className on the outer container */
  className?: string;
  /** Additional className on the body area */
  bodyClassName?: string;
  /** Slot below the body (e.g. terminal bottom panel) */
  footer?: ReactNode;
}>;

function ContentFrame({
  header,
  title,
  headerRight,
  onClose,
  className,
  bodyClassName,
  footer,
  children,
}: ContentFrameProps) {
  const headerContent = header ?? (
    <div
      data-slot="content-frame-header"
      className="flex items-center px-2.5 py-2"
    >
      <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider pl-2">
        {title}
      </span>
      <div className="flex-1" />
      <div className="flex items-center gap-1.5">
        {headerRight}
        {onClose && <FrameCloseButton onClick={onClose} />}
      </div>
    </div>
  );

  return (
    <div
      data-slot="content-frame"
      className={cn(
        'flex flex-col overflow-hidden bg-[#f2f2f2] rounded-[20px]',
        className,
      )}
      style={{
        boxShadow: 'inset 0px 0.75px 0.75px rgba(0,0,0,0.04)',
      }}
    >
      {headerContent}

      <div
        data-slot="content-frame-body"
        className={cn(
          'flex-1 min-h-0 overflow-hidden bg-white rounded-2xl mx-1.5 mb-1.5',
          bodyClassName,
        )}
      >
        {children}
      </div>

      {footer}
    </div>
  );
}

// ─── Close Button ────────────────────────────────────────
//
// macOS-style red circle button. 20×20px, same tactile shadow
// as activity bar buttons but with red fill.

function FrameCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      data-slot="frame-close-button"
      className="w-5 h-5 flex items-center justify-center rounded-full bg-[#FF5F57] text-white hover:brightness-90 transition-all"
      style={{ boxShadow: BUTTON_SHADOW }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: BUTTON_INSET }}
      />
      <X className="w-2.5 h-2.5 relative z-[1]" strokeWidth={2.5} />
    </button>
  );
}

export { ContentFrame, FrameCloseButton, type ContentFrameProps };
