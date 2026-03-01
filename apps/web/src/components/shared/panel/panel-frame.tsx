'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type PanelFrameProps = React.ComponentProps<'div'>;

function PanelFrame({ className, style, ...props }: PanelFrameProps) {
  return (
    <div
      data-slot="panel-frame"
      className={cn(
        'flex flex-col overflow-hidden bg-[#f2f2f2] rounded-[20px]',
        className,
      )}
      style={{
        boxShadow: 'inset 0px 0.75px 0.75px rgba(0,0,0,0.04)',
        ...style,
      }}
      {...props}
    />
  );
}

export { PanelFrame };
export type { PanelFrameProps };
