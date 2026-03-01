'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type BadgeColor = 'muted' | 'red' | 'teal' | 'yellow';

const BADGE_COLOR_MAP: Record<BadgeColor, string> = {
  muted: 'text-mine-muted',
  red: 'text-mine-accent-red',
  teal: 'text-mine-accent-teal',
  yellow: 'text-mine-accent-yellow',
};

const BADGE_TAG_COLOR_MAP: Record<BadgeColor, string> = {
  muted: 'bg-mine-bg text-mine-muted',
  teal: 'bg-mine-accent-teal/10 text-mine-accent-teal',
  red: 'bg-mine-accent-red/10 text-mine-accent-red',
  yellow: 'bg-mine-accent-yellow/10 text-mine-accent-yellow',
};

type PanelBadgeProps = React.ComponentProps<'span'> & {
  color?: BadgeColor;
};

function PanelBadge({ color = 'muted', className, ...props }: PanelBadgeProps) {
  return (
    <span
      data-slot="panel-badge"
      className={cn(
        'text-[9px] font-mono tabular-nums',
        BADGE_COLOR_MAP[color],
        className,
      )}
      {...props}
    />
  );
}

type PanelBadgeTagProps = React.ComponentProps<'span'> & {
  color?: BadgeColor;
};

function PanelBadgeTag({
  color = 'muted',
  className,
  ...props
}: PanelBadgeTagProps) {
  return (
    <span
      data-slot="panel-badge-tag"
      className={cn(
        'px-1.5 py-0.5 text-[9px] font-medium rounded',
        BADGE_TAG_COLOR_MAP[color],
        className,
      )}
      {...props}
    />
  );
}

export { PanelBadge, PanelBadgeTag };
export type { PanelBadgeProps, PanelBadgeTagProps, BadgeColor };
