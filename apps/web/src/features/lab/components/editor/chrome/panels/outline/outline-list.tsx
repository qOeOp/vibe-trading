/* Copyright 2026 Marimo. All rights reserved. */

import React from 'react';
import type { OutlineItem } from '@/features/lab/core/cells/outline';
import { cn } from '@/features/lab/utils/cn';
import { scrollToOutlineItem } from './useActiveOutline';

export const OutlineList: React.FC<{
  className?: string;
  items: OutlineItem[];
  activeHeaderId: string | undefined;
  activeOccurrences: number | undefined;
}> = ({ items, activeHeaderId, activeOccurrences, className }) => {
  // Map of selector to its occurrences
  const seen = new Map<string, number>();
  return (
    <div className={cn('flex flex-col overflow-auto py-4 pl-2', className)}>
      {items.map((item, idx) => {
        const identifier = 'id' in item.by ? item.by.id : item.by.path;
        // Keep track of how many times we've seen this selector
        const occurrences = seen.get(identifier) ?? 0;
        seen.set(identifier, occurrences + 1);

        return (
          <div
            key={`${identifier}-${idx}`}
            className={cn(
              'px-2 py-1 cursor-pointer hover:bg-accent/50 hover:text-accent-foreground rounded-l',
              item.level === 1 && 'font-semibold',
              item.level === 2 && 'ml-3',
              item.level === 3 && 'ml-6',
              item.level === 4 && 'ml-9',
              occurrences === activeOccurrences &&
                activeHeaderId === identifier &&
                'text-accent-foreground',
            )}
            onClick={() => scrollToOutlineItem(item, occurrences)}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};
