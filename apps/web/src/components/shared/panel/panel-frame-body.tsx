'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type PanelFrameBodyMode = 'scroll' | 'flex';

type PanelFrameBodyProps = React.ComponentProps<'div'> & {
  toolbar?: React.ReactNode;
  /**
   * `scroll` (default) — inner div scrolls vertically.
   * `flex` — children manage their own overflow (for tab layouts).
   */
  mode?: PanelFrameBodyMode;
};

const PanelFrameBody = React.forwardRef<HTMLDivElement, PanelFrameBodyProps>(
  function PanelFrameBody(
    { className, toolbar, mode = 'scroll', children, ...props },
    ref,
  ) {
    return (
      <div
        data-slot="panel-frame-body"
        className="flex-1 min-h-0 overflow-hidden bg-white rounded-2xl mx-1.5 mb-1.5 flex flex-col"
      >
        {toolbar && <div className="shrink-0">{toolbar}</div>}
        <div
          ref={ref}
          className={cn(
            'flex-1 min-h-0',
            mode === 'scroll'
              ? 'overflow-y-auto'
              : 'flex flex-col overflow-hidden',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  },
);

export { PanelFrameBody };
export type { PanelFrameBodyProps, PanelFrameBodyMode };
