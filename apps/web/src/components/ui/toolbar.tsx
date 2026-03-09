'use client';

import * as React from 'react';
import * as ToolbarPrimitive from '@radix-ui/react-toolbar';

import { cn } from '@/lib/utils';

// ─── Root ───────────────────────────────────────────────

function Toolbar({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

// ─── Button ─────────────────────────────────────────────

function ToolbarButton({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Button>) {
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg',
        'border border-mine-border text-mine-text',
        'transition-colors hover:bg-mine-bg',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
}

// ─── Separator ──────────────────────────────────────────

function ToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn('w-px h-4 bg-mine-border', className)}
      {...props}
    />
  );
}

// ─── Link ───────────────────────────────────────────────

function ToolbarLink({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Link>) {
  return (
    <ToolbarPrimitive.Link
      data-slot="toolbar-link"
      className={cn(
        'text-[11px] text-mine-muted hover:text-mine-text transition-colors',
        className,
      )}
      {...props}
    />
  );
}

// ─── ToggleGroup ────────────────────────────────────────

function ToolbarToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup>) {
  return (
    <ToolbarPrimitive.ToggleGroup
      data-slot="toolbar-toggle-group"
      className={cn('flex items-center gap-0.5', className)}
      {...props}
    />
  );
}

// ─── ToggleItem ─────────────────────────────────────────

function ToolbarToggleItem({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem>) {
  return (
    <ToolbarPrimitive.ToggleItem
      data-slot="toolbar-toggle-item"
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md',
        'text-mine-muted transition-colors',
        'hover:bg-mine-bg hover:text-mine-text',
        'data-[state=on]:bg-mine-nav-active data-[state=on]:text-white',
        className,
      )}
      {...props}
    />
  );
}

// ─── Exports ────────────────────────────────────────────

export {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
};
