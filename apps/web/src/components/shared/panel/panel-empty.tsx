'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type PanelEmptyProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
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
        'flex flex-col items-center justify-center py-8 px-4 text-center',
        className,
      )}
    >
      {icon && <div className="w-6 h-6 text-mine-muted/40 mb-2">{icon}</div>}
      {title && (
        <p className="text-[11px] font-medium text-mine-muted">{title}</p>
      )}
      {description && (
        <p className="text-[10px] text-mine-muted/60 mt-1">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export { PanelEmpty };
export type { PanelEmptyProps };
