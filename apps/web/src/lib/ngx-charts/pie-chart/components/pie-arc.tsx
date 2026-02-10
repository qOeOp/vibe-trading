/**
 * @fileoverview Pie Arc Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/pie-chart/pie-arc.component.ts
 *
 * @description
 * Individual pie arc segment component with animation support.
 * Handles arc path generation, gradients, and interaction events.
 * Uses Framer Motion for smooth draw-out animations.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useRef, useId } from 'react';
import { motion } from 'framer-motion';
import { arc as d3Arc } from 'd3-shape';
import type { DataItem } from '@/lib/ngx-charts/types';
import { SvgRadialGradient, createRadialGradientStops } from '@/lib/ngx-charts/common';

export interface PieArcProps {
  /** Arc fill color */
  fill: string;
  /** Start angle in radians */
  startAngle: number;
  /** End angle in radians */
  endAngle: number;
  /** Inner radius (0 for pie, >0 for doughnut) */
  innerRadius: number;
  /** Outer radius */
  outerRadius: number;
  /** Corner radius for rounded edges */
  cornerRadius?: number;
  /** Arc value */
  value: number;
  /** Maximum value (for explode calculation) */
  max: number;
  /** Data item associated with this arc */
  data: DataItem;
  /** Explode slices outward based on value */
  explodeSlices?: boolean;
  /** Use gradient fill */
  gradient?: boolean;
  /** Enable animations */
  animate?: boolean;
  /** Enable pointer events */
  pointerEvents?: boolean;
  /** Whether this arc is active/highlighted */
  isActive?: boolean;
  /** Callback when arc is clicked */
  onSelect?: (data: DataItem) => void;
  /** Callback when arc is activated (hovered) */
  onActivate?: (data: DataItem) => void;
  /** Callback when arc is deactivated */
  onDeactivate?: (data: DataItem) => void;
  /** Callback when arc is double-clicked */
  onDblClick?: (event: { data: DataItem; nativeEvent: React.MouseEvent }) => void;
}

/**
 * Individual pie arc segment component
 */
export function PieArc({
  fill,
  startAngle,
  endAngle,
  innerRadius,
  outerRadius,
  cornerRadius = 0,
  value,
  max,
  data,
  explodeSlices = false,
  gradient = false,
  animate = true,
  pointerEvents = true,
  isActive = false,
  onSelect,
  onActivate,
  onDeactivate,
  onDblClick,
}: PieArcProps) {
  const gradientId = useId();
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate the arc path
  const { path, initialPath } = useMemo(() => {
    let effectiveOuterRadius = outerRadius;

    // Adjust outer radius for explode slices effect
    if (explodeSlices && innerRadius === 0 && max > 0) {
      effectiveOuterRadius = (outerRadius * value) / max;
    }

    const arcGenerator = d3Arc()
      .innerRadius(innerRadius)
      .outerRadius(effectiveOuterRadius)
      .cornerRadius(cornerRadius);

    // Full arc path
    const arcPath = arcGenerator({
      startAngle,
      endAngle,
      innerRadius,
      outerRadius: effectiveOuterRadius,
    });

    // Initial path for animation (collapsed arc)
    const initialArcPath = arcGenerator({
      startAngle,
      endAngle: startAngle,
      innerRadius,
      outerRadius: effectiveOuterRadius,
    });

    return {
      path: arcPath || '',
      initialPath: initialArcPath || '',
    };
  }, [startAngle, endAngle, innerRadius, outerRadius, cornerRadius, explodeSlices, value, max]);

  // Gradient fill URL
  const gradientFill = useMemo(() => {
    return gradient ? `url(#${gradientId})` : fill;
  }, [gradient, gradientId, fill]);

  // Gradient stops
  const gradientStops = useMemo(() => {
    if (!gradient) return [];
    return createRadialGradientStops(fill, fill, 1, 0.5);
  }, [gradient, fill]);

  // Event handlers
  const handleClick = useCallback(() => {
    // Use timeout to distinguish single click from double click
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      onSelect?.(data);
    }, 200);
  }, [data, onSelect]);

  const handleDblClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // Clear single click timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }

      onDblClick?.({
        data,
        nativeEvent: event,
      });
    },
    [data, onDblClick]
  );

  const handleMouseEnter = useCallback(() => {
    onActivate?.(data);
  }, [data, onActivate]);

  const handleMouseLeave = useCallback(() => {
    onDeactivate?.(data);
  }, [data, onDeactivate]);

  const pointerEventsStyle = pointerEvents ? 'auto' : 'none';

  // Animation variants for the arc path
  const arcVariants = {
    initial: { d: initialPath },
    animate: { d: path },
  };

  return (
    <g className="arc-group">
      {/* Gradient definition */}
      {gradient && (
        <defs>
          <SvgRadialGradient id={gradientId} stops={gradientStops} />
        </defs>
      )}

      {/* Arc path */}
      {animate ? (
        <motion.path
          className={`arc ${isActive ? 'active' : ''}`}
          fill={gradientFill}
          initial="initial"
          animate="animate"
          variants={arcVariants}
          transition={{
            duration: 0.75,
            ease: 'easeOut',
          }}
          onClick={handleClick}
          onDoubleClick={handleDblClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            pointerEvents: pointerEventsStyle,
            cursor: pointerEvents ? 'pointer' : 'default',
            opacity: isActive ? 1 : 0.9,
            filter: isActive ? 'brightness(1.1)' : 'none',
            transition: 'opacity 0.2s, filter 0.2s',
          }}
        />
      ) : (
        <path
          className={`arc ${isActive ? 'active' : ''}`}
          d={path}
          fill={gradientFill}
          onClick={handleClick}
          onDoubleClick={handleDblClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            pointerEvents: pointerEventsStyle,
            cursor: pointerEvents ? 'pointer' : 'default',
            opacity: isActive ? 1 : 0.9,
            filter: isActive ? 'brightness(1.1)' : 'none',
            transition: 'opacity 0.2s, filter 0.2s',
          }}
        />
      )}
    </g>
  );
}
