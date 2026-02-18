/**
 * @fileoverview Line path component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/line-chart/line.component.ts
 *
 * @description
 * Individual line path component with pathLength animation.
 * Migrated from Angular ngx-charts library to React with Framer Motion.
 *
 * @license MIT
 */

'use client';

import { motion } from 'framer-motion';

export interface LineProps {
  /** SVG path data string */
  path: string;
  /** Stroke color */
  stroke: string;
  /** Fill color (default: 'none') */
  fill?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Enable animations */
  animated?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Custom class name */
  className?: string;
  /**
   * Knockout stroke color (typically page background).
   * When set, renders a wider backing stroke underneath the main line
   * to create a visual gap effect (BandChart-style depth layering).
   */
  knockoutColor?: string;
  /**
   * Multiplier for knockout stroke width relative to strokeWidth.
   * Default: 2 (knockout is 2× the line width)
   */
  knockoutWidthMultiplier?: number;
  /**
   * SVG filter ID for drop shadow (e.g. `url(#my-shadow)`).
   * Applied to the main line, not the knockout backing.
   */
  shadowFilter?: string;
  /** Stroke line cap style */
  strokeLinecap?: 'butt' | 'round' | 'square';
  /** Stroke line join style */
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  /** Stroke opacity */
  strokeOpacity?: number;
}

/**
 * Line path component
 *
 * Renders a single line path with optional pathLength animation on enter.
 * Uses Framer Motion for smooth path drawing animation.
 */
export function Line({
  path,
  stroke,
  fill = 'none',
  strokeWidth = 1.5,
  animated = true,
  animationDuration = 1000,
  className = '',
  knockoutColor = '#f5f3ef',
  knockoutWidthMultiplier = 2,
  shadowFilter,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  strokeOpacity = 1,
}: LineProps) {
  if (!path) return null;

  const commonLineProps = {
    strokeLinecap,
    strokeLinejoin,
    style: { pointerEvents: 'none' as const },
  };

  /** Knockout backing — wider stroke in background color for visual separation */
  const knockoutElement = knockoutColor ? (
    <path
      key="knockout"
      className="line-knockout"
      d={path}
      fill="none"
      stroke={knockoutColor}
      strokeWidth={strokeWidth * knockoutWidthMultiplier}
      {...commonLineProps}
    />
  ) : null;

  if (animated) {
    return (
      <g className={`line-group ${className}`}>
        {knockoutElement}
        <motion.path
          className={`line ${className}`}
          d={path}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          filter={shadowFilter}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: animationDuration / 1000, ease: 'easeInOut' },
            opacity: { duration: 0.2 },
          }}
          {...commonLineProps}
        />
      </g>
    );
  }

  return (
    <g className={`line-group ${className}`}>
      {knockoutElement}
      <path
        className={`line ${className}`}
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        filter={shadowFilter}
        {...commonLineProps}
      />
    </g>
  );
}
