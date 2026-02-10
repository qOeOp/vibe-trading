/**
 * @fileoverview Tooltip component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/tooltip/tooltip.directive.ts
 *
 * @description
 * Main tooltip component that manages tooltip visibility and lifecycle.
 * Uses React portals to render tooltip outside normal DOM hierarchy.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type ReactElement,
  cloneElement,
  isValidElement,
} from 'react';
import { createPortal } from 'react-dom';
import { TooltipContent, TooltipStyleType, TooltipAlignment } from './tooltip-content';
import { Placement } from '../../types';

/** Show event types */
export type TooltipShowEvent = 'all' | 'focus' | 'mouseover';

export interface TooltipProps {
  /** Child element that triggers tooltip */
  children: ReactElement;
  /** Tooltip title text */
  title?: string;
  /** Custom tooltip content */
  content?: ReactNode;
  /** Context data for template */
  context?: unknown;
  /** Whether tooltip is disabled */
  disabled?: boolean;
  /** Tooltip placement */
  placement?: Placement;
  /** Tooltip alignment */
  alignment?: TooltipAlignment;
  /** Tooltip style type */
  type?: TooltipStyleType;
  /** Whether to show caret */
  showCaret?: boolean;
  /** Additional CSS class */
  cssClass?: string;
  /** Spacing from trigger element */
  spacing?: number;
  /** Whether to close on click outside */
  closeOnClickOutside?: boolean;
  /** Whether to close on mouse leave */
  closeOnMouseLeave?: boolean;
  /** Delay before hiding (ms) */
  hideTimeout?: number;
  /** Delay before showing (ms) */
  showTimeout?: number;
  /** Which events trigger the tooltip */
  showEvent?: TooltipShowEvent;
  /** Whether to exit immediately */
  immediateExit?: boolean;
  /** Callback when tooltip shows */
  onShow?: () => void;
  /** Callback when tooltip hides */
  onHide?: () => void;
}

/**
 * Tooltip wrapper component
 *
 * Wraps a child element and shows a tooltip on hover/focus.
 * Uses React portals to render tooltip at document body level.
 *
 * @example
 * ```tsx
 * <Tooltip title="Hello World" placement="top">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  children,
  title,
  content,
  context,
  disabled = false,
  placement = 'top',
  alignment = 'center',
  type = 'popover',
  showCaret = true,
  cssClass = '',
  spacing = 10,
  closeOnClickOutside = true,
  closeOnMouseLeave = true,
  hideTimeout = 300,
  showTimeout = 100,
  showEvent = 'all',
  immediateExit = false,
  onShow,
  onHide,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Check if should listen for specific events
  const listensForFocus = showEvent === 'all' || showEvent === 'focus';
  const listensForHover = showEvent === 'all' || showEvent === 'mouseover';

  // Initialize portal container
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setPortalContainer(document.body);
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const showTooltip = useCallback(
    (immediate = false) => {
      if (isVisible || disabled) return;

      // Clear any pending hide
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      const delay = immediate ? 0 : showTimeout;

      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }

      showTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        onShow?.();
      }, delay);
    },
    [isVisible, disabled, showTimeout, onShow]
  );

  const hideTooltip = useCallback(
    (immediate = false) => {
      if (!isVisible) return;

      // Clear any pending show
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }

      const destroyFn = () => {
        setIsVisible(false);
        onHide?.();
      };

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      if (immediate) {
        destroyFn();
      } else {
        hideTimeoutRef.current = setTimeout(destroyFn, hideTimeout);
      }
    },
    [isVisible, hideTimeout, onHide]
  );

  // Handle click outside
  useEffect(() => {
    if (!isVisible || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const triggerContains = triggerRef.current?.contains(target);
      const tooltipContains = tooltipRef.current?.contains(target);

      if (!triggerContains && !tooltipContains) {
        hideTooltip(true);
      }
    };

    // Delay adding listener to avoid immediate trigger
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible, closeOnClickOutside, hideTooltip]);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    if (listensForHover) {
      showTooltip();
    }
  }, [listensForHover, showTooltip]);

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent) => {
      if (listensForHover && closeOnMouseLeave) {
        // Check if mouse moved to tooltip
        const relatedTarget = event.relatedTarget as Node | null;
        if (tooltipRef.current?.contains(relatedTarget)) {
          return;
        }
        hideTooltip(immediateExit);
      }
    },
    [listensForHover, closeOnMouseLeave, hideTooltip, immediateExit]
  );

  const handleFocusIn = useCallback(() => {
    if (listensForFocus) {
      showTooltip();
    }
  }, [listensForFocus, showTooltip]);

  const handleFocusOut = useCallback(() => {
    if (listensForFocus) {
      hideTooltip(true);
    }
  }, [listensForFocus, hideTooltip]);

  const handleClick = useCallback(() => {
    if (listensForHover) {
      hideTooltip(true);
    }
  }, [listensForHover, hideTooltip]);

  const handleTooltipMouseEnter = useCallback(() => {
    // Cancel pending hide when mouse enters tooltip
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const handleTooltipMouseLeave = useCallback(() => {
    if (closeOnMouseLeave) {
      hideTooltip(immediateExit);
    }
  }, [closeOnMouseLeave, hideTooltip, immediateExit]);

  // Clone child with ref and event handlers
  const childWithHandlers = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
          // Forward ref if child has one
          const childElement = children as unknown as { ref?: unknown };
          const childRef = childElement.ref;
          if (typeof childRef === 'function') {
            childRef(node);
          } else if (childRef && typeof childRef === 'object' && 'current' in childRef) {
            (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        },
        onMouseEnter: (e: React.MouseEvent) => {
          handleMouseEnter();
          const existingHandler = (children.props as Record<string, unknown>).onMouseEnter;
          if (typeof existingHandler === 'function') {
            (existingHandler as (e: React.MouseEvent) => void)(e);
          }
        },
        onMouseLeave: (e: React.MouseEvent) => {
          handleMouseLeave(e);
          const existingHandler = (children.props as Record<string, unknown>).onMouseLeave;
          if (typeof existingHandler === 'function') {
            (existingHandler as (e: React.MouseEvent) => void)(e);
          }
        },
        onFocus: (e: React.FocusEvent) => {
          handleFocusIn();
          const existingHandler = (children.props as Record<string, unknown>).onFocus;
          if (typeof existingHandler === 'function') {
            (existingHandler as (e: React.FocusEvent) => void)(e);
          }
        },
        onBlur: (e: React.FocusEvent) => {
          handleFocusOut();
          const existingHandler = (children.props as Record<string, unknown>).onBlur;
          if (typeof existingHandler === 'function') {
            (existingHandler as (e: React.FocusEvent) => void)(e);
          }
        },
        onClick: (e: React.MouseEvent) => {
          handleClick();
          const existingHandler = (children.props as Record<string, unknown>).onClick;
          if (typeof existingHandler === 'function') {
            (existingHandler as (e: React.MouseEvent) => void)(e);
          }
        },
      })
    : children;

  // Render tooltip content in portal
  const tooltipElement =
    isVisible && portalContainer && triggerRef.current
      ? createPortal(
          <div
            ref={tooltipRef}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <TooltipContent
              host={triggerRef.current}
              showCaret={showCaret}
              type={type}
              placement={placement}
              alignment={alignment}
              spacing={spacing}
              cssClass={cssClass}
              title={title}
              context={context}
            >
              {content}
            </TooltipContent>
          </div>,
          portalContainer
        )
      : null;

  return (
    <>
      {childWithHandlers}
      {tooltipElement}
    </>
  );
}
