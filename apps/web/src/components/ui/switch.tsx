'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mine-border focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-mine-nav-active data-[state=unchecked]:bg-mine-border',
  {
    variants: {
      size: {
        default: 'h-7 w-12',
        sm: 'h-5 w-9',
        xs: 'h-4 w-7',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const switchThumbVariants = cva(
  'pointer-events-none flex rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 items-center justify-center',
  {
    variants: {
      size: {
        default: 'h-6 w-6 data-[state=checked]:translate-x-5',
        sm: 'h-4 w-4 data-[state=checked]:translate-x-4',
        xs: 'h-3 w-3 data-[state=checked]:translate-x-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

function Switch({
  className,
  icon,
  size,
  thumbClassName,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants> & {
    icon?: React.ReactNode;
    thumbClassName?: string;
  }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants({ size }), thumbClassName)}
      >
        {icon ? icon : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
