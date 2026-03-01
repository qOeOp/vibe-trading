'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PANEL_TYPOGRAPHY } from './panel-typography';

type PanelSearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

function PanelSearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: PanelSearchBarProps) {
  return (
    <div
      data-slot="panel-search-bar"
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 border-b border-mine-border/30',
        className,
      )}
    >
      <Search className="w-3 h-3 text-mine-muted shrink-0" />
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          PANEL_TYPOGRAPHY.body,
          'flex-1 bg-transparent outline-none placeholder:text-mine-muted/50',
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="p-0.5 text-mine-muted hover:text-mine-text transition-colors"
          aria-label="Clear search"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}

export { PanelSearchBar };
export type { PanelSearchBarProps };
