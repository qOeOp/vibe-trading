'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

/**
 * Compound Tooltip root — use with TooltipTrigger + TooltipContent.
 * Wraps with TooltipProvider automatically.
 */
function TooltipRoot({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

const TooltipPortal = TooltipPrimitive.Portal;

type TooltipConvenienceProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  asChild?: boolean;
  usePortal?: boolean;
  tabIndex?: number;
  side?: TooltipPrimitive.TooltipContentProps['side'];
  align?: TooltipPrimitive.TooltipContentProps['align'];
  delayDuration?: number;
  disableHoverableContent?: boolean;
} & Omit<
  React.ComponentProps<typeof TooltipPrimitive.Root>,
  'delayDuration' | 'disableHoverableContent'
>;

/**
 * Unified Tooltip — supports both compound and convenience APIs.
 *
 * Convenience (content prop):
 * ```tsx
 * <Tooltip content="Delete this item">
 *   <Button>Delete</Button>
 * </Tooltip>
 * ```
 *
 * Compound (no content prop):
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger>hover me</TooltipTrigger>
 *   <TooltipContent>complex content</TooltipContent>
 * </Tooltip>
 * ```
 */
type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>;

function Tooltip(props: TooltipConvenienceProps | TooltipProps) {
  // Convenience API: content prop provided
  if ('content' in props && props.content !== undefined) {
    const {
      content,
      children,
      asChild = true,
      usePortal: _usePortal,
      tabIndex,
      side,
      align,
      delayDuration,
      disableHoverableContent = true,
      ...rootProps
    } = props as TooltipConvenienceProps;

    // When content is empty, just render children
    if (content == null || content === '') {
      return children;
    }

    return (
      <TooltipProvider delayDuration={delayDuration}>
        <TooltipPrimitive.Root
          data-slot="tooltip"
          disableHoverableContent={disableHoverableContent}
          {...rootProps}
        >
          <TooltipTrigger asChild={asChild} tabIndex={tabIndex}>
            {children}
          </TooltipTrigger>
          <TooltipContent side={side} align={align}>
            {content}
          </TooltipContent>
        </TooltipPrimitive.Root>
      </TooltipProvider>
    );
  }

  // Compound API: no content prop, behave as before
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipPortal,
};
