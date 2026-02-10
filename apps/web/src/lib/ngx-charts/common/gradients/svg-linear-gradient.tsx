/**
 * @fileoverview SVG linear gradient component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/svg-linear-gradient.component.ts
 *
 * @description
 * SVG linear gradient definition for chart fills.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo } from 'react';
import { Gradient } from '../../types';

export interface SvgLinearGradientProps {
  /** Unique ID for the gradient */
  id: string;
  /** Orientation: 'horizontal' or 'vertical' */
  orientation?: 'horizontal' | 'vertical';
  /** Gradient color stops */
  stops: Gradient[];
}

/**
 * SVG linear gradient definition component
 */
export function SvgLinearGradient({
  id,
  orientation = 'vertical',
  stops,
}: SvgLinearGradientProps) {
  // Angular uses inverted Y coordinates for vertical gradients
  // y1="100%" y2="0%" means gradient goes from bottom to top
  const gradientCoords = useMemo(() => {
    if (orientation === 'horizontal') {
      return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };
    }
    // Vertical: bottom (y1=100%) to top (y2=0%) - matches Angular
    return { x1: '0%', y1: '100%', x2: '0%', y2: '0%' };
  }, [orientation]);

  return (
    <linearGradient
      id={id}
      x1={gradientCoords.x1}
      y1={gradientCoords.y1}
      x2={gradientCoords.x2}
      y2={gradientCoords.y2}
    >
      {stops.map((stop, index) => (
        <stop
          key={`${id}-stop-${index}`}
          offset={`${stop.offset}%`}
          stopColor={stop.color}
          stopOpacity={stop.opacity}
        />
      ))}
    </linearGradient>
  );
}

/**
 * Creates default gradient stops from start and end colors
 */
export function createGradientStops(
  startColor: string,
  endColor: string,
  startOpacity: number = 1,
  endOpacity: number = 1
): Gradient[] {
  return [
    { offset: 0, color: startColor, opacity: startOpacity },
    { offset: 100, color: endColor, opacity: endOpacity },
  ];
}

/**
 * Creates gradient stops for an area chart (fading to transparent)
 */
export function createAreaGradientStops(color: string, topOpacity: number = 0.7): Gradient[] {
  return [
    { offset: 0, color, opacity: topOpacity },
    { offset: 100, color, opacity: 0.05 },
  ];
}
