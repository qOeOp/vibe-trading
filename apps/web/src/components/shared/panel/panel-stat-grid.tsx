'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type StatColor = 'up' | 'down' | 'flat' | 'muted' | 'positive' | 'negative';

const STAT_COLOR_MAP: Record<StatColor, string> = {
  up: 'text-market-up-medium',
  down: 'text-market-down-medium',
  flat: 'text-market-flat',
  muted: 'text-mine-muted',
  positive: 'text-market-down',
  negative: 'text-market-up-medium',
};

type PanelStatItemProps = {
  label: string;
  value: React.ReactNode;
  color?: StatColor;
  className?: string;
};

function PanelStatItem({ label, value, color, className }: PanelStatItemProps) {
  return (
    <div
      data-slot="panel-stat-item"
      className={cn('flex flex-col items-center', className)}
    >
      <span
        className={cn(
          'text-sm font-bold font-mono tabular-nums',
          color ? STAT_COLOR_MAP[color] : 'text-mine-text',
        )}
      >
        {value}
      </span>
      <span className="font-medium text-mine-muted uppercase tracking-wider text-[9px]">
        {label}
      </span>
    </div>
  );
}

type PanelStatGridProps = React.ComponentProps<'div'> & {
  columns?: 2 | 3 | 4;
};

const GRID_COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

function PanelStatGrid({
  columns = 3,
  className,
  ...props
}: PanelStatGridProps) {
  return (
    <div
      data-slot="panel-stat-grid"
      className={cn('grid gap-3', GRID_COLS[columns], className)}
      {...props}
    />
  );
}

export { PanelStatGrid, PanelStatItem, STAT_COLOR_MAP };
export type { PanelStatGridProps, PanelStatItemProps, StatColor };
