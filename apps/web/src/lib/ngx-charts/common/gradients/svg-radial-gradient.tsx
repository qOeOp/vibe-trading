/**
 * @fileoverview SVG radial gradient component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/svg-radial-gradient.component.ts
 *
 * @description
 * SVG radial gradient definition for chart fills.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { Gradient } from '../../types';

export interface SvgRadialGradientProps {
  /** Unique ID for the gradient */
  id: string;
  /** Center X coordinate (percentage) */
  cx?: string;
  /** Center Y coordinate (percentage) */
  cy?: string;
  /** Radius (percentage) */
  r?: string;
  /** Focal point X coordinate (percentage) */
  fx?: string;
  /** Focal point Y coordinate (percentage) */
  fy?: string;
  /** Gradient color stops */
  stops: Gradient[];
}

/**
 * SVG radial gradient definition component
 */
export function SvgRadialGradient({
  id,
  cx = '50%',
  cy = '50%',
  r = '50%',
  fx,
  fy,
  stops,
}: SvgRadialGradientProps) {
  return (
    <radialGradient
      id={id}
      cx={cx}
      cy={cy}
      r={r}
      fx={fx || cx}
      fy={fy || cy}
    >
      {stops.map((stop, index) => (
        <stop
          key={`${id}-stop-${index}`}
          offset={`${stop.offset}%`}
          stopColor={stop.color}
          stopOpacity={stop.opacity}
        />
      ))}
    </radialGradient>
  );
}

/**
 * Creates default radial gradient stops from center to edge
 */
export function createRadialGradientStops(
  centerColor: string,
  edgeColor: string,
  centerOpacity: number = 1,
  edgeOpacity: number = 0.3
): Gradient[] {
  return [
    { offset: 0, color: centerColor, opacity: centerOpacity },
    { offset: 100, color: edgeColor, opacity: edgeOpacity },
  ];
}
