'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const panelTextVariants = cva('', {
  variants: {
    variant: {
      label: 'text-[10px] font-medium text-mine-muted uppercase tracking-wider',
      body: 'text-[11px] text-mine-text',
      value: 'text-[11px] font-mono tabular-nums text-mine-text',
      hint: 'text-[10px] text-mine-muted',
    },
    size: {
      sm: 'text-[9px]',
      base: '',
      lg: 'text-sm font-bold',
    },
  },
  defaultVariants: { variant: 'body', size: 'base' },
});

type PanelTextProps = React.ComponentProps<'span'> &
  VariantProps<typeof panelTextVariants>;

function PanelText({ className, variant, size, ...props }: PanelTextProps) {
  return (
    <span
      data-slot="panel-text"
      className={cn(panelTextVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { PanelText, panelTextVariants };
export type { PanelTextProps };
