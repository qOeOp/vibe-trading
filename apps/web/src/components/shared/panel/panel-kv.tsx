'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { STAT_COLOR_MAP } from './panel-stat-grid';
import type { StatColor } from './panel-stat-grid';

type PanelKVProps = {
  label: string;
  value: React.ReactNode;
  color?: StatColor;
  className?: string;
};

function PanelKV({ label, value, color, className }: PanelKVProps) {
  return (
    <div
      data-slot="panel-kv"
      className={cn('flex items-center justify-between py-1', className)}
    >
      <span className="text-[10px] text-mine-muted">{label}</span>
      <span
        className={cn(
          'text-[11px] font-mono tabular-nums',
          color ? STAT_COLOR_MAP[color] : 'text-mine-text',
        )}
      >
        {value}
      </span>
    </div>
  );
}

export { PanelKV };
export type { PanelKVProps };
