'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type PanelChartBoxProps = React.ComponentProps<'div'>;

function PanelChartBox({ className, ...props }: PanelChartBoxProps) {
  return (
    <div
      data-slot="panel-chart-box"
      className={cn('bg-mine-bg rounded-md p-1', className)}
      {...props}
    />
  );
}

export { PanelChartBox };
export type { PanelChartBoxProps };
