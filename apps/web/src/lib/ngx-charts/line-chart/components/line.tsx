/**
 * @fileoverview Line path component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/line-chart/line.component.ts
 *
 * @description
 * Individual line path component with stroke dash animation.
 * Migrated from Angular ngx-charts library to React with Framer Motion.
 *
 * @license MIT
 */

'use client';

import { useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';

import { Series } from '../../types';

export interface LineProps {
  /** SVG path data string */
  path: string;
  /** Stroke color */
  stroke: string;
  /** Series data (optional, for identification) */
  data?: Series;
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
 * Renders a single line path with optional stroke dash animation on enter.
 * Uses Framer Motion for smooth path drawing animation.
 */
export function Line({
  path,
  stroke,
  data: _data,
  fill = 'none',
  strokeWidth = 1.5,
  animated = true,
  animationDuration = 1000,
  className = '',
}: LineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const initialPath = useRef<string>(path);
  const isInitialized = useRef(false);

  // Motion values for animation
  const pathLength = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const animatedPathLength = useSpring(pathLength, springConfig);

  // Handle initial animation
  useEffect(() => {
    if (!animated || !pathRef.current) return;

    const pathElement = pathRef.current;
    const totalLength = pathElement.getTotalLength();

    if (!isInitialized.current) {
      // Initial animation - draw the line
      pathLength.set(0);
      animate(pathLength, totalLength, {
        duration: animationDuration / 1000,
        ease: 'easeOut',
      });
      isInitialized.current = true;
    }
  }, [animated, animationDuration, pathLength]);

  // Handle path updates with animation
  useEffect(() => {
    if (!animated || !pathRef.current || !isInitialized.current) return;

    const pathElement = pathRef.current;
    const totalLength = pathElement.getTotalLength();
    pathLength.set(totalLength);
  }, [path, animated, pathLength]);

  // Calculate dash props for animation
  const dashProps = useMemo(() => {
    if (!animated) {
      return {};
    }

    return {
      strokeDasharray: 2000,
      strokeDashoffset: animated ? animatedPathLength : 0,
    };
  }, [animated, animatedPathLength]);

  if (animated) {
    return (
      <motion.path
        ref={pathRef}
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
      ref={pathRef}
      className={`line ${className}`}
      d={path}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}
