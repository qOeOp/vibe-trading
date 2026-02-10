'use client';

/**
 * @fileoverview Global tooltip context for ngx-charts
 *
 * Implements a global tooltip manager similar to Angular's TooltipService.
 * Only ONE tooltip can be visible at a time - showing a new tooltip
 * automatically hides any existing tooltip.
 *
 * @license MIT
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { TooltipContent, TooltipStyleType } from './tooltip-content';
import { Placement } from '../../types';

interface TooltipState {
  visible: boolean;
  content: ReactNode;
  title?: string;
  host: HTMLElement | SVGElement | null;
  placement: Placement;
  type: TooltipStyleType;
  showCaret: boolean;
  /** Position key to trigger repositioning when anchor moves */
  positionKey?: number | string;
}

interface ShowTooltipOptions {
  content?: ReactNode;
  title?: string;
  host: HTMLElement | SVGElement;
  placement?: Placement;
  type?: TooltipStyleType;
  showCaret?: boolean;
  /** Position key to trigger repositioning when anchor moves */
  positionKey?: number | string;
}

interface TooltipContextValue {
  showTooltip: (options: ShowTooltipOptions) => void;
  hideTooltip: () => void;
  hideTooltipImmediate: () => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

const SHOW_DELAY = 100;

export function ChartTooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: null,
    host: null,
    placement: 'top',
    type: 'tooltip',
    showCaret: true,
  });

  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideTooltipImmediate = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setTooltip((prev) => ({ ...prev, visible: false, host: null }));
  }, []);

  const hideTooltip = useCallback(() => {
    hideTooltipImmediate();
  }, [hideTooltipImmediate]);

  const showTooltip = useCallback((options: ShowTooltipOptions) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    const state: TooltipState = {
      visible: true,
      content: options.content,
      title: options.title,
      host: options.host,
      placement: options.placement || 'top',
      type: options.type || 'tooltip',
      showCaret: options.showCaret ?? true,
      positionKey: options.positionKey,
    };

    // positionKey means area charts: update immediately for smooth repositioning
    if (options.positionKey !== undefined) {
      setTooltip(state);
    } else {
      showTimeoutRef.current = setTimeout(() => setTooltip(state), SHOW_DELAY);
    }
  }, []);

  return (
    <TooltipContext.Provider
      value={{ showTooltip, hideTooltip, hideTooltipImmediate }}
    >
      {children}
      {tooltip.visible &&
        tooltip.host &&
        typeof document !== 'undefined' &&
        createPortal(
          <TooltipContent
            host={tooltip.host as unknown as HTMLElement}
            showCaret={tooltip.showCaret}
            type={tooltip.type}
            placement={tooltip.placement}
            spacing={15}
            title={tooltip.title}
            positionKey={tooltip.positionKey}
          >
            {tooltip.content}
          </TooltipContent>,
          document.body
        )}
    </TooltipContext.Provider>
  );
}

export function useChartTooltip() {
  const context = useContext(TooltipContext);
  if (!context) {
    return {
      showTooltip: /* noop fallback */ () => undefined as void,
      hideTooltip: /* noop fallback */ () => undefined as void,
      hideTooltipImmediate: /* noop fallback */ () => undefined as void,
    };
  }
  return context;
}
