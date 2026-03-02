'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PANEL_TYPOGRAPHY } from './panel-typography';

const CLOSE_SHADOW =
  '0px 1px 1px 0.5px rgba(51,51,51,0.04), 0px 3px 3px -1.5px rgba(51,51,51,0.02), 0px 6px 6px -3px rgba(51,51,51,0.04), 0px 12px 12px -6px rgba(51,51,51,0.04), 0px 0px 0px 1px rgba(51,51,51,0.1)';

const CLOSE_INSET = 'inset 0px -1px 1px -0.5px rgba(51,51,51,0.06)';

type FrameCloseButtonProps = React.ComponentProps<'button'>;

function FrameCloseButton({
  className,
  style,
  ...props
}: FrameCloseButtonProps) {
  return (
    <button
      data-slot="frame-close-button"
      type="button"
      aria-label="Close panel"
      className={cn(
        'flex items-center justify-center w-5 h-5 rounded-full bg-[#FF5F57] text-white/90 transition-opacity hover:opacity-80',
        className,
      )}
      style={{
        boxShadow: `${CLOSE_SHADOW}, ${CLOSE_INSET}`,
        ...style,
      }}
      {...props}
    >
      <X className="w-2.5 h-2.5" strokeWidth={2.5} />
    </button>
  );
}

type PanelFrameHeaderProps = {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  className?: string;
};

function PanelFrameHeader({
  title,
  subtitle,
  actions,
  onClose,
  className,
}: PanelFrameHeaderProps) {
  return (
    <div
      data-slot="panel-frame-header"
      className={cn('flex items-center px-2.5 py-2 shrink-0', className)}
    >
      <div className="flex items-baseline gap-2 pl-2 min-w-0">
        <span className={cn(PANEL_TYPOGRAPHY.label, 'shrink-0')}>{title}</span>
        {subtitle && <div className="min-w-0">{subtitle}</div>}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        {actions}
        {onClose && <FrameCloseButton onClick={onClose} />}
      </div>
    </div>
  );
}

export { PanelFrameHeader, FrameCloseButton };
export type { PanelFrameHeaderProps, FrameCloseButtonProps };
