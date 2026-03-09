import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        defaultOutline: 'bg-blue-50 border-blue-300 text-blue-700',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20',
        success:
          'bg-emerald-50 border-emerald-300 text-emerald-700 [a&]:hover:bg-emerald-100',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        up: 'border-market-up-medium/30 bg-market-up-medium/10 text-market-up-medium',
        down: 'border-market-down-medium/30 bg-market-down-medium/10 text-market-down-medium',
        flat: 'border-market-flat/30 bg-market-flat/10 text-market-flat',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type BadgeProps = Omit<React.ComponentProps<'span'>, 'ref'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  if (asChild) {
    return (
      <Slot
        data-slot="badge"
        className={cn(badgeVariants({ variant }), className)}
        {...(props as React.ComponentPropsWithoutRef<typeof Slot>)}
      />
    );
  }

  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
