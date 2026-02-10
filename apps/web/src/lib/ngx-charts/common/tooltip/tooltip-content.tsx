/**
 * @fileoverview Tooltip content component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/tooltip/tooltip.component.ts
 *
 * @description
 * Tooltip content wrapper component that handles positioning and styling.
 * Renders tooltip content with optional caret indicator.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import type { ReactNode, CSSProperties } from 'react';
import type { Placement } from '@/lib/ngx-charts/types';

/** Style types for tooltip appearance */
export type TooltipStyleType = 'tooltip' | 'popover';

/** Alignment options for tooltip positioning */
export type TooltipAlignment = 'top' | 'bottom' | 'left' | 'right' | 'center';

/** Position coordinates */
interface Position {
  top: number;
  left: number;
}

/** Caret offset constant */
const CARET_OFFSET = 7;

export interface TooltipContentProps {
  /** Host element reference for positioning */
  host: HTMLElement | null;
  /** Whether to show the caret arrow */
  showCaret?: boolean;
  /** Tooltip style type */
  type?: TooltipStyleType;
  /** Tooltip placement relative to host */
  placement?: Placement;
  /** Tooltip alignment */
  alignment?: TooltipAlignment;
  /** Spacing from host element */
  spacing?: number;
  /** Additional CSS class */
  cssClass?: string;
  /** Simple text title */
  title?: string;
  /** Custom content */
  children?: ReactNode;
  /** Context data passed to template */
  context?: unknown;
  /** Position key that triggers re-positioning when changed */
  positionKey?: number | string;
}

/**
 * Calculate vertical position based on alignment
 */
function verticalPosition(
  elDimensions: DOMRect,
  popoverDimensions: DOMRect,
  alignment: TooltipAlignment
): number | undefined {
  if (alignment === 'top') {
    return elDimensions.top - CARET_OFFSET;
  }
  if (alignment === 'bottom') {
    return (
      elDimensions.top +
      elDimensions.height -
      popoverDimensions.height +
      CARET_OFFSET
    );
  }
  if (alignment === 'center') {
    return (
      elDimensions.top + elDimensions.height / 2 - popoverDimensions.height / 2
    );
  }
  return undefined;
}

/**
 * Calculate horizontal position based on alignment
 */
function horizontalPosition(
  elDimensions: DOMRect,
  popoverDimensions: DOMRect,
  alignment: TooltipAlignment
): number | undefined {
  if (alignment === 'left') {
    return elDimensions.left - CARET_OFFSET;
  }
  if (alignment === 'right') {
    return (
      elDimensions.left +
      elDimensions.width -
      popoverDimensions.width +
      CARET_OFFSET
    );
  }
  if (alignment === 'center') {
    return (
      elDimensions.left + elDimensions.width / 2 - popoverDimensions.width / 2
    );
  }
  return undefined;
}

/**
 * Position helper class for tooltip calculations
 */
class PositionHelper {
  /**
   * Calculate vertical alignment position
   */
  static calculateVerticalAlignment(
    elDimensions: DOMRect,
    popoverDimensions: DOMRect,
    alignment: TooltipAlignment
  ): number {
    let result = verticalPosition(elDimensions, popoverDimensions, alignment);

    if (result !== undefined && result + popoverDimensions.height > window.innerHeight) {
      result = window.innerHeight - popoverDimensions.height;
    }

    return result ?? 0;
  }

  /**
   * Calculate vertical caret position
   */
  static calculateVerticalCaret(
    elDimensions: DOMRect,
    popoverDimensions: DOMRect,
    caretDimensions: DOMRect,
    alignment: TooltipAlignment
  ): number {
    let result = 0;

    if (alignment === 'top') {
      result =
        elDimensions.height / 2 - caretDimensions.height / 2 + CARET_OFFSET;
    }
    if (alignment === 'bottom') {
      result =
        popoverDimensions.height -
        elDimensions.height / 2 -
        caretDimensions.height / 2 -
        CARET_OFFSET;
    }
    if (alignment === 'center') {
      result = popoverDimensions.height / 2 - caretDimensions.height / 2;
    }

    const popoverPosition = verticalPosition(
      elDimensions,
      popoverDimensions,
      alignment
    );
    if (
      popoverPosition !== undefined &&
      popoverPosition + popoverDimensions.height > window.innerHeight
    ) {
      result += popoverPosition + popoverDimensions.height - window.innerHeight;
    }

    return result;
  }

  /**
   * Calculate horizontal alignment position
   */
  static calculateHorizontalAlignment(
    elDimensions: DOMRect,
    popoverDimensions: DOMRect,
    alignment: TooltipAlignment
  ): number {
    let result = horizontalPosition(elDimensions, popoverDimensions, alignment);

    if (result !== undefined && result + popoverDimensions.width > window.innerWidth) {
      result = window.innerWidth - popoverDimensions.width;
    }

    return result ?? 0;
  }

  /**
   * Calculate horizontal caret position
   */
  static calculateHorizontalCaret(
    elDimensions: DOMRect,
    popoverDimensions: DOMRect,
    caretDimensions: DOMRect,
    alignment: TooltipAlignment
  ): number {
    let result = 0;

    if (alignment === 'left') {
      result =
        elDimensions.width / 2 - caretDimensions.width / 2 + CARET_OFFSET;
    }
    if (alignment === 'right') {
      result =
        popoverDimensions.width -
        elDimensions.width / 2 -
        caretDimensions.width / 2 -
        CARET_OFFSET;
    }
    if (alignment === 'center') {
      result = popoverDimensions.width / 2 - caretDimensions.width / 2;
    }

    const popoverPosition = horizontalPosition(
      elDimensions,
      popoverDimensions,
      alignment
    );
    if (
      popoverPosition !== undefined &&
      popoverPosition + popoverDimensions.width > window.innerWidth
    ) {
      result += popoverPosition + popoverDimensions.width - window.innerWidth;
    }

    return result;
  }

  /**
   * Check if tooltip should flip to opposite side
   */
  static shouldFlip(
    elDimensions: DOMRect,
    popoverDimensions: DOMRect,
    placement: Placement,
    spacing: number
  ): boolean {
    if (placement === 'right') {
      return (
        elDimensions.left +
          elDimensions.width +
          popoverDimensions.width +
          spacing >
        window.innerWidth
      );
    }
    if (placement === 'left') {
      return elDimensions.left - popoverDimensions.width - spacing < 0;
    }
    if (placement === 'top') {
      return elDimensions.top - popoverDimensions.height - spacing < 0;
    }
    if (placement === 'bottom') {
      return (
        elDimensions.top +
          elDimensions.height +
          popoverDimensions.height +
          spacing >
        window.innerHeight
      );
    }
    return false;
  }

  /**
   * Calculate caret position
   */
  static positionCaret(
    placement: Placement,
    elmDim: DOMRect,
    hostDim: DOMRect,
    caretDimensions: DOMRect,
    alignment: TooltipAlignment
  ): Position {
    let top = 0;
    let left = 0;

    if (placement === 'right') {
      left = -7;
      top = PositionHelper.calculateVerticalCaret(
        hostDim,
        elmDim,
        caretDimensions,
        alignment
      );
    } else if (placement === 'left') {
      left = elmDim.width;
      top = PositionHelper.calculateVerticalCaret(
        hostDim,
        elmDim,
        caretDimensions,
        alignment
      );
    } else if (placement === 'top') {
      top = elmDim.height;
      left = PositionHelper.calculateHorizontalCaret(
        hostDim,
        elmDim,
        caretDimensions,
        alignment
      );
    } else if (placement === 'bottom') {
      top = -7;
      left = PositionHelper.calculateHorizontalCaret(
        hostDim,
        elmDim,
        caretDimensions,
        alignment
      );
    }

    return { top, left };
  }

  /**
   * Calculate content position
   */
  static positionContent(
    placement: Placement,
    elmDim: DOMRect,
    hostDim: DOMRect,
    spacing: number,
    alignment: TooltipAlignment
  ): Position {
    let top = 0;
    let left = 0;

    if (placement === 'right') {
      left = hostDim.left + hostDim.width + spacing;
      top = PositionHelper.calculateVerticalAlignment(
        hostDim,
        elmDim,
        alignment
      );
    } else if (placement === 'left') {
      left = hostDim.left - elmDim.width - spacing;
      top = PositionHelper.calculateVerticalAlignment(
        hostDim,
        elmDim,
        alignment
      );
    } else if (placement === 'top') {
      top = hostDim.top - elmDim.height - spacing;
      left = PositionHelper.calculateHorizontalAlignment(
        hostDim,
        elmDim,
        alignment
      );
    } else if (placement === 'bottom') {
      top = hostDim.top + hostDim.height + spacing;
      left = PositionHelper.calculateHorizontalAlignment(
        hostDim,
        elmDim,
        alignment
      );
    }

    return { top, left };
  }

  /**
   * Determine final placement (flipping if necessary)
   */
  static determinePlacement(
    placement: Placement,
    elmDim: DOMRect,
    hostDim: DOMRect,
    spacing: number
  ): Placement {
    const shouldFlip = PositionHelper.shouldFlip(
      hostDim,
      elmDim,
      placement,
      spacing
    );

    if (shouldFlip) {
      if (placement === 'right') return 'left';
      if (placement === 'left') return 'right';
      if (placement === 'top') return 'bottom';
      if (placement === 'bottom') return 'top';
    }

    return placement;
  }
}

/**
 * Tooltip content component
 *
 * Renders tooltip content with proper positioning relative to host element.
 * Supports caret indicators and automatic flip behavior when near viewport edges.
 */
export function TooltipContent({
  host,
  showCaret = true,
  type = 'tooltip',
  placement = 'top',
  alignment = 'center',
  spacing = 10,
  cssClass = '',
  title,
  children,
  positionKey,
}: TooltipContentProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [finalPlacement, setFinalPlacement] = useState<Placement>(placement);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [caretPosition, setCaretPosition] = useState<Position>({
    top: 0,
    left: 0,
  });

  const positionTooltip = useCallback(() => {
    if (!elementRef.current || !host) return;

    const elmDim = elementRef.current.getBoundingClientRect();
    const hostDim = host.getBoundingClientRect();

    // If no dimensions, don't show
    if (!hostDim.height && !hostDim.width) return;

    // Check for flip
    const newPlacement = PositionHelper.determinePlacement(
      placement,
      elmDim,
      hostDim,
      spacing
    );
    setFinalPlacement(newPlacement);

    // Position content
    const contentPos = PositionHelper.positionContent(
      newPlacement,
      elmDim,
      hostDim,
      spacing,
      alignment as TooltipAlignment
    );
    setPosition(contentPos);

    // Position caret
    if (showCaret && caretRef.current) {
      const caretDimensions = caretRef.current.getBoundingClientRect();
      const caretPos = PositionHelper.positionCaret(
        newPlacement,
        elmDim,
        hostDim,
        caretDimensions,
        alignment as TooltipAlignment
      );
      setCaretPosition(caretPos);
    }

    // Animate after positioning
    requestAnimationFrame(() => {
      setIsAnimated(true);
    });
  }, [host, placement, spacing, alignment, showCaret]);

  // Position tooltip on mount and when host or positionKey changes
  useEffect(() => {
    if (host) {
      // Delay to ensure DOM is ready
      const timer = setTimeout(positionTooltip, 0);
      return () => clearTimeout(timer);
    }
  }, [host, positionTooltip, positionKey]);

  // Handle window resize
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(positionTooltip, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [positionTooltip]);

  // Build class names
  const classNames = [
    'ngx-charts-tooltip-content',
    `position-${finalPlacement}`,
    `type-${type}`,
    cssClass,
    isAnimated ? 'animate' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Tooltip styles
  const tooltipStyle: CSSProperties = {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 5000,
    borderRadius: '3px',
    display: 'block',
    fontWeight: 'normal',
    opacity: isAnimated ? 1 : 0,
    pointerEvents: isAnimated ? 'auto' : 'none',
    transition: isAnimated ? 'opacity 0.3s, transform 0.3s' : undefined,
    transform: isAnimated
      ? 'translate3d(0, 0, 0)'
      : getInitialTransform(finalPlacement),
    ...(type === 'tooltip'
      ? {
          color: '#fff',
          background: 'rgba(0, 0, 0, 0.75)',
          fontSize: '12px',
          padding: '0 10px',
          textAlign: 'center',
        }
      : {
          background: '#fff',
          color: '#060709',
          border: '1px solid #72809b',
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12)',
          fontSize: '13px',
          padding: '4px',
        }),
  };

  // Caret styles
  const caretStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 5001,
    width: 0,
    height: 0,
    top: `${caretPosition.top}px`,
    left: `${caretPosition.left}px`,
    ...getCaretBorderStyles(finalPlacement, type),
  };

  return (
    <div ref={elementRef} className={classNames} style={tooltipStyle}>
      <div>
        {showCaret && (
          <span
            ref={caretRef}
            className={`tooltip-caret position-${finalPlacement}`}
            style={caretStyle}
          />
        )}
        <div className="tooltip-content">
          {title ? (
            <span dangerouslySetInnerHTML={{ __html: title }} />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Get initial transform based on placement for animation
 */
function getInitialTransform(placement: Placement): string {
  switch (placement) {
    case 'right':
      return 'translate3d(10px, 0, 0)';
    case 'left':
      return 'translate3d(-10px, 0, 0)';
    case 'top':
      return 'translate3d(0, -10px, 0)';
    case 'bottom':
      return 'translate3d(0, 10px, 0)';
    default:
      return 'translate3d(0, 0, 0)';
  }
}

/**
 * Get caret border styles based on placement and type
 */
function getCaretBorderStyles(
  placement: Placement,
  type: TooltipStyleType
): CSSProperties {
  const caretColor =
    type === 'tooltip' ? 'rgba(0, 0, 0, 0.75)' : '#fff';

  switch (placement) {
    case 'left':
      return {
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        borderLeft: `7px solid ${caretColor}`,
      };
    case 'top':
      return {
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: `7px solid ${caretColor}`,
      };
    case 'right':
      return {
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        borderRight: `7px solid ${caretColor}`,
      };
    case 'bottom':
      return {
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderBottom: `7px solid ${caretColor}`,
      };
    default:
      return {};
  }
}

export { PositionHelper };
