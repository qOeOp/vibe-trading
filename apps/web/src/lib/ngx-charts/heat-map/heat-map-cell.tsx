'use client';

/**
 * @fileoverview Heat map cell component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/heat-map/heat-map-cell.component.ts
 *
 * @description
 * Renders a single cell in a heat map with support for
 * gradients and animations using Framer Motion.
 *
 * @license MIT
 */

import { useMemo, useCallback, useId } from 'react';
import { motion } from 'framer-motion';
import { SvgLinearGradient } from '../common';
import type { Gradient } from '../types';

export interface HeatMapCellProps {
  /** X position of the cell */
  x: number;
  /** Y position of the cell */
  y: number;
  /** Width of the cell */
  width: number;
  /** Height of the cell */
  height: number;
  /** Fill color */
  fill: string;
  /** Cell data value */
  data: number;
  /** Whether to render with gradient fill */
  gradient?: boolean;
  /** Enable/disable animations */
  animated?: boolean;
  /** Callback when cell is clicked */
  onSelect?: (data: number) => void;
  /** Callback when cell is activated (hovered) */
  onActivate?: (data: number) => void;
  /** Callback when cell is deactivated */
  onDeactivate?: (data: number) => void;
}

/**
 * Individual heat map cell component with animation support
 */
export function HeatMapCell({
  x,
  y,
  width,
  height,
  fill,
  data,
  gradient = false,
  animated = true,
  onSelect,
  onActivate,
  onDeactivate,
}: HeatMapCellProps) {
  const reactId = useId();
  const gradientId = `grad${reactId.replace(/:/g, '')}`;
  const gradientUrl = `url(#${gradientId})`;
  const startOpacity = 0.3;

  // Gradient stops
  const gradientStops = useMemo((): Gradient[] => {
    return [
      {
        offset: 0,
        color: fill,
        opacity: startOpacity,
      },
      {
        offset: 100,
        color: fill,
        opacity: 1,
      },
    ];
  }, [fill]);

  const handleClick = useCallback(() => {
    onSelect?.(data);
  }, [onSelect, data]);

  const handleMouseEnter = useCallback(() => {
    onActivate?.(data);
  }, [onActivate, data]);

  const handleMouseLeave = useCallback(() => {
    onDeactivate?.(data);
  }, [onDeactivate, data]);

  return (
    <g transform={`translate(${x}, ${y})`} className="cell">
      {gradient && (
        <defs>
          <SvgLinearGradient
            id={gradientId}
            orientation="vertical"
            stops={gradientStops}
          />
        </defs>
      )}
      <motion.rect
        fill={gradient ? gradientUrl : fill}
        rx={3}
        width={width}
        height={height}
        className="cell"
        style={{ cursor: onSelect ? 'pointer' : 'default' }}
        initial={animated ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </g>
  );
}
