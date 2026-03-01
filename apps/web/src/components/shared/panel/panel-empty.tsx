'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { PANEL_TYPOGRAPHY } from './panel-typography';

type PanelEmptyProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

function PanelEmpty({
  icon,
  title,
  description,
  action,
  className,
}: PanelEmptyProps) {
  return (
    <div
      data-slot="panel-empty"
      className={cn(
        'flex-1 flex flex-col items-center justify-center py-8 px-4 text-center',
        className,
      )}
    >
      {icon &&
        React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: 'w-6 h-6 text-mine-muted/40',
        })}
      {title && (
        <p className={cn(PANEL_TYPOGRAPHY.body, 'font-medium text-mine-muted')}>
          {title}
        </p>
      )}
      {description && (
        <p className={cn(PANEL_TYPOGRAPHY.hint, 'text-mine-muted/60 mt-1')}>
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export { PanelEmpty };
export type { PanelEmptyProps };
