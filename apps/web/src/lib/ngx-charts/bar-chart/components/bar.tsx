'use client';

/**
 * @fileoverview Bar component for bar charts
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/bar.component.ts
 *
 * @description
 * Renders a single bar in a bar chart with support for
 * rounded edges, gradients, and animations.
 *
 * @license MIT
 */

import { useMemo, useCallback, useId } from 'react';
import type { BarProps } from '../types';
import { SvgLinearGradient } from '../../common';

/**
 * Creates a rounded rectangle path
 * Matches Angular ngx-charts shape.helper.ts exactly
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param w - Width
 * @param h - Height
 * @param r - Radius
 * @param edges - [topLeft, topRight, bottomLeft, bottomRight] - NOTE: bl before br!
 */
function roundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  [tl, tr, bl, br]: boolean[]
): string {
  let retval = '';

  // Ensure minimum dimensions
  w = Math.floor(w);
  h = Math.floor(h);
  w = w === 0 ? 1 : w;
  h = h === 0 ? 1 : h;

  // Start at top-left corner (after any radius)
  retval = `M${x + r},${y}`;

  // Top edge (move right)
  retval += `h${w - 2 * r}`;

  // Top-right corner
  if (tr) {
    retval += `a${r},${r} 0 0 1 ${r},${r}`;
  } else {
    retval += `h${r}v${r}`;
  }

  // Right edge (move down)
  retval += `v${h - 2 * r}`;

  // Bottom-right corner
  if (br) {
    retval += `a${r},${r} 0 0 1 ${-r},${r}`;
  } else {
    retval += `v${r}h${-r}`;
  }

  // Bottom edge (move left)
  retval += `h${2 * r - w}`;

  // Bottom-left corner
  if (bl) {
    retval += `a${r},${r} 0 0 1 ${-r},${-r}`;
  } else {
    retval += `h${-r}v${-r}`;
  }

  // Left edge (move up)
  retval += `v${2 * r - h}`;

  // Top-left corner
  if (tl) {
    retval += `a${r},${r} 0 0 1 ${r},${-r}`;
  } else {
    retval += `v${-r}h${r}`;
  }

  retval += `z`;

  return retval;
}

/**
 * Individual bar component with animation support
 */
export function Bar({
  fill,
  data,
  width,
  height,
  x,
  y,
  orientation,
  roundEdges = true,
  gradient = false,
  stops,
  isActive = false,
  animated = true,
  ariaLabel,
  noBarWhenZero = true,
  onSelect,
  onActivate,
  onDeactivate,
}: BarProps) {
  const reactId = useId();
  const gradientId = `grad${reactId.replace(/:/g, '')}`;
  const gradientFill = `url(#${gradientId})`;

  // Calculate bar radius
  const radius = useMemo(() => {
    if (!roundEdges || height <= 5 || width <= 5) {
      return 0;
    }
    return Math.floor(Math.min(5, height / 2, width / 2));
  }, [roundEdges, width, height]);

  // Calculate which edges to round
  const edges = useMemo((): boolean[] => {
    if (!roundEdges) {
      return [false, false, false, false];
    }

    if (orientation === 'vertical') {
      if (data.value > 0) {
        return [true, true, false, false]; // Top edges
      } else {
        return [false, false, true, true]; // Bottom edges
      }
    } else {
      if (data.value > 0) {
        return [false, true, true, false]; // Right edges
      } else {
        return [true, false, false, true]; // Left edges
      }
    }
  }, [roundEdges, orientation, data.value]);

  // Calculate path
  const path = useMemo(() => {
    return roundedRect(x, y, width, height, radius, edges);
  }, [x, y, width, height, radius, edges]);

  // Calculate starting path for animation
  const _startingPath = useMemo(() => {
    if (!animated) {
      return path;
    }

    if (orientation === 'vertical') {
      return roundedRect(x, y + height, width, 1, 0, edges);
    } else {
      return roundedRect(x, y, 1, height, 0, edges);
    }
  }, [animated, orientation, x, y, width, height, edges, path]);

  // Gradient stops
  const gradientStops = useMemo(() => {
    if (stops) {
      return stops;
    }

    const startOpacity = roundEdges ? 0.2 : 0.5;
    return [
      { offset: 0, color: fill, opacity: startOpacity },
      { offset: 100, color: fill, opacity: 1 },
    ];
  }, [stops, fill, roundEdges]);

  const hasGradient = gradient || !!stops;

  // Check if bar should be hidden
  const hideBar = useMemo(() => {
    if (!noBarWhenZero) {
      return false;
    }
    return (
      (orientation === 'vertical' && height === 0) ||
      (orientation === 'horizontal' && width === 0)
    );
  }, [noBarWhenZero, orientation, height, width]);

  const handleClick = useCallback(() => {
    onSelect?.(data);
  }, [onSelect, data]);

  const handleMouseEnter = useCallback(() => {
    onActivate?.(data);
  }, [onActivate, data]);

  const handleMouseLeave = useCallback(() => {
    onDeactivate?.(data);
  }, [onDeactivate, data]);

  if (hideBar) {
    return null;
  }

  return (
    <g>
      {hasGradient && (
        <defs>
          <SvgLinearGradient
            id={gradientId}
            stops={gradientStops}
            orientation={orientation}
          />
        </defs>
      )}
      <path
        className={`bar ${isActive ? 'active' : ''}`}
        stroke="none"
        role="img"
        tabIndex={-1}
        aria-label={ariaLabel}
        fill={hasGradient ? gradientFill : fill}
        d={path}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: onSelect ? 'pointer' : 'default',
          opacity: isActive ? 1 : undefined,
        }}
      />
    </g>
  );
}
