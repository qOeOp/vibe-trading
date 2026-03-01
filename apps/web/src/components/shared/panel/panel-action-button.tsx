'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type ActionButtonHoverColor = 'default' | 'teal' | 'red';

const HOVER_COLOR_MAP: Record<ActionButtonHoverColor, string> = {
  default: 'hover:text-mine-text hover:bg-mine-bg/50',
  teal: 'hover:text-mine-accent-teal hover:bg-mine-accent-teal/10',
  red: 'hover:text-mine-accent-red hover:bg-mine-accent-red/10',
};

type PanelActionButtonProps = Omit<
  React.ComponentProps<'button'>,
  'children'
> & {
  icon: React.ReactElement;
  label: string;
  hoverColor?: ActionButtonHoverColor;
};

function PanelActionButton({
  icon,
  label,
  hoverColor = 'default',
  className,
  ...props
}: PanelActionButtonProps) {
  return (
    <button
      data-slot="panel-action-button"
      type="button"
      aria-label={label}
      className={cn(
        'p-1 rounded text-mine-muted transition-colors',
        HOVER_COLOR_MAP[hoverColor],
        className,
      )}
      {...props}
    >
      {React.cloneElement(icon, {
        className: 'w-3 h-3',
      } as React.HTMLAttributes<SVGElement>)}
    </button>
  );
}

export { PanelActionButton };
export type { PanelActionButtonProps, ActionButtonHoverColor };
