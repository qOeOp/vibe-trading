'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const panelTextVariants = cva('', {
  variants: {
    variant: {
      label: 'panel-label',
      body: 'panel-body',
      value: 'panel-value',
      hint: 'panel-hint',
    },
  },
  defaultVariants: { variant: 'body' },
});

type PanelTextProps = React.ComponentProps<'span'> &
  VariantProps<typeof panelTextVariants>;

function PanelText({ className, variant, ...props }: PanelTextProps) {
  return (
    <span
      data-slot="panel-text"
      className={cn(panelTextVariants({ variant }), className)}
      {...props}
    />
  );
}

export { PanelText, panelTextVariants };
export type { PanelTextProps };
