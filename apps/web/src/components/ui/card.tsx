'use client';

import * as React from 'react';
import { useState } from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// ─── Card Shell ─────────────────────────────────────────

const cardVariants = cva('flex flex-col overflow-hidden rounded-xl', {
  variants: {
    variant: {
      default: 'bg-white shadow-sm border border-mine-border',
      frosted: 'glass-heavy shadow-sm',
    },
    interactive: {
      true: 'cursor-pointer transition-all hover:shadow-md',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    interactive: false,
  },
});

interface CardProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardVariants> {
  /** Expand button + modal with full content */
  expandable?: boolean;
  /** Override title shown in expand modal */
  expandTitle?: string;
  /** Override subtitle shown in expand modal */
  expandSubtitle?: string;
  /** Additional content shown only in the expanded modal (after children) */
  expandContent?: React.ReactNode;
}

function Card({
  className,
  variant,
  interactive,
  expandable,
  expandTitle,
  expandSubtitle,
  expandContent,
  children,
  ...props
}: CardProps) {
  const [expandOpen, setExpandOpen] = useState(false);

  // Extract title/subtitle from CardHeader children for expand modal fallback
  const headerTitle = expandTitle;
  const headerSubtitle = expandSubtitle;

  return (
    <>
      <div
        data-slot="card"
        className={cn(cardVariants({ variant, interactive }), className)}
        {...props}
      >
        {children}
        {expandable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpandOpen(true);
            }}
            className="absolute top-2 right-2 p-1 rounded-md text-mine-muted hover:text-mine-text hover:bg-mine-bg transition-colors z-10"
            aria-label="展开卡片"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {expandable && (
        <Dialog open={expandOpen} onOpenChange={setExpandOpen}>
          <DialogContent>
            {(headerTitle || headerSubtitle) && (
              <DialogHeader>
                {headerTitle && <DialogTitle>{headerTitle}</DialogTitle>}
                {headerSubtitle && (
                  <DialogDescription>{headerSubtitle}</DialogDescription>
                )}
              </DialogHeader>
            )}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
              {expandContent}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// ─── CardHeader ─────────────────────────────────────────
// Supports two usage patterns:
//   1. Structured: <CardHeader title="..." subtitle="..." actions={...} />
//   2. Composable: <CardHeader><CardTitle>...</CardTitle></CardHeader>

interface CardHeaderProps extends React.ComponentProps<'div'> {
  /** Structured mode: card title */
  title?: string;
  /** Structured mode: card subtitle */
  subtitle?: string;
  /** Structured mode: right-aligned actions slot */
  actions?: React.ReactNode;
}

function CardHeader({
  className,
  title,
  subtitle,
  actions,
  children,
  ...props
}: CardHeaderProps) {
  // Structured mode — Mine standard header layout
  if (title || subtitle || actions) {
    return (
      <div
        data-slot="card-header"
        className={cn(
          'flex items-center gap-4 px-3 py-2 border-b border-mine-border/50 bg-white rounded-t-xl',
          className,
        )}
        {...props}
      >
        <div className="shrink-0">
          {title && (
            <h3 className="text-sm font-semibold text-mine-text leading-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[11px] text-mine-muted">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex-1 min-w-0 flex items-center justify-end gap-1.5">
            {actions}
          </div>
        )}
        {children}
      </div>
    );
  }

  // Composable mode — children-only (shadcn compat)
  return (
    <div
      data-slot="card-header"
      className={cn(
        'flex flex-col gap-1.5 px-3 py-2 border-b border-mine-border/50 bg-white rounded-t-xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'text-sm font-semibold text-mine-text leading-tight',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-[11px] text-mine-muted', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'flex-1 min-w-0 flex items-center justify-end gap-1.5',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('flex-1 min-h-0 overflow-hidden', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center px-3 py-2 border-t border-mine-border/50',
        className,
      )}
      {...props}
    />
  );
}

// ─── Exports ────────────────────────────────────────────

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
};
export type { CardProps, CardHeaderProps };
