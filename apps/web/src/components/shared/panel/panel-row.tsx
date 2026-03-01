'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const HOVER_BG = {
  default: 'hover:bg-mine-bg/30',
  red: 'hover:bg-mine-accent-red/5',
  none: '',
} as const;

type HoverBg = keyof typeof HOVER_BG;

type PanelRowProps = {
  onPress?: () => void;
  hoverBg?: HoverBg;
  className?: string;
  children?: React.ReactNode;
};

function PanelRow({
  onPress,
  hoverBg = 'default',
  className,
  children,
}: PanelRowProps) {
  const classes = cn(
    'flex items-center gap-2 px-3 py-1.5 group transition-colors w-full text-left',
    HOVER_BG[hoverBg],
    className,
  );

  if (onPress) {
    return (
      <button
        data-slot="panel-row"
        type="button"
        onClick={onPress}
        className={classes}
      >
        {children}
      </button>
    );
  }

  return (
    <div data-slot="panel-row" className={classes}>
      {children}
    </div>
  );
}

type PanelActionsProps = React.ComponentProps<'div'>;

function PanelActions({ className, ...props }: PanelActionsProps) {
  return (
    <div
      data-slot="panel-actions"
      className={cn(
        'flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0',
        className,
      )}
      {...props}
    />
  );
}

export { PanelRow, PanelActions };
export type { PanelRowProps, PanelActionsProps, HoverBg };
