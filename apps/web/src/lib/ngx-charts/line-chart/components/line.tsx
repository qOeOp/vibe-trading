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
}: LineProps) {
  if (!path) return null;

  if (animated) {
    return (
      <motion.path
        className={`line ${className}`}
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: animationDuration / 1000, ease: 'easeInOut' },
          opacity: { duration: 0.2 },
        }}
      />
    );
  }

  return (
    <path
      className={`line ${className}`}
      d={path}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}
