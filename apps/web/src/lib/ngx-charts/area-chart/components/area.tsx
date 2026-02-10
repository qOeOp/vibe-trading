/**
 * @fileoverview Area path component with animation support
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/area-chart/area.component.ts
 *
 * @description
 * SVG area path component with Framer Motion animations.
 * Supports gradient fills and opacity states.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useId } from 'react';
import { motion } from 'framer-motion';

import { Gradient } from '../../types';
import { SvgLinearGradient } from '../../common';

export interface AreaProps {
  /** Area path data string */
  path: string;
  /** Starting path for animation */
  startingPath?: string;
  /** Fill color */
  fill: string;
  /** Fill opacity */
  opacity?: number;
  /** Start opacity for default gradient (top of area) */
  startOpacity?: number;
  /** End opacity for default gradient (bottom of area) */
  endOpacity?: number;
  /** Whether to use gradient fill */
  gradient?: boolean;
  /** Gradient stops for linear gradient */
  stops?: Gradient[];
  /** Whether animations are enabled */
  animated?: boolean;
  /** Whether this area is active (highlighted) */
  isActive?: boolean;
  /** Whether this area is inactive (dimmed) */
  isInactive?: boolean;
  /** Optional data payload */
  data?: unknown;
  /** Click handler */
  onClick?: (data: unknown) => void;
}

/**
 * Area path component for area charts
 *
 * Renders an SVG path element representing an area with optional
 * gradient fill and smooth path animations.
 */
export function Area({
  path,
  startingPath,
  fill,
  opacity = 1, // Angular default is 1, AreaSeries passes 0.8
  startOpacity = 0.5, // Angular default for gradient top
  endOpacity = 1, // Angular default for gradient bottom
  gradient = false,
  stops,
  animated = true,
  isActive = false,
  isInactive = false,
  data,
  onClick,
}: AreaProps) {
  const reactId = useId();
  const gradientId = `gradient${reactId.replace(/:/g, '')}`;
  const gradientUrl = `url(#${gradientId})`;

  const computedOpacity = isInactive ? 0.2 : opacity;

  const gradientStops = useMemo((): Gradient[] => {
    if (stops && stops.length > 0) {
      return stops;
    }
    return [
      {
        offset: 0,
        color: fill,
        opacity: startOpacity,
      },
      {
        offset: 100,
        color: fill,
        opacity: endOpacity,
      },
    ];
  }, [stops, fill, startOpacity, endOpacity]);

  const hasGradient = gradient || (stops && stops.length > 0);
  const fillValue = hasGradient ? gradientUrl : fill;

  const variants = {
    initial: animated && startingPath ? { d: startingPath, opacity: 0 } : { d: path, opacity: computedOpacity },
    animate: { d: path, opacity: computedOpacity },
    exit: animated && startingPath ? { d: startingPath, opacity: 0 } : { opacity: 0 },
  };

  const transition = {
    d: { duration: animated ? 0.75 : 0, ease: 'easeInOut' as const },
    opacity: { duration: animated ? 0.3 : 0 },
  };

  const handleClick = () => {
    if (onClick && data) {
      onClick(data);
    }
  };

  if (!path) return null;

  const stateClass = isActive ? ' active' : isInactive ? ' inactive' : '';
  const groupClassNames = `area-series${stateClass}`;
  const pathClassNames = `area${stateClass}`;

  return (
    <g className={groupClassNames}>
      {/* Gradient definition */}
      {hasGradient && (
        <defs>
          <SvgLinearGradient
            id={gradientId}
            orientation="vertical"
            stops={gradientStops}
          />
        </defs>
      )}

      {/* Area path */}
      <motion.path
        className={pathClassNames}
        d={path}
        fill={fillValue}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={transition}
        onClick={onClick ? handleClick : undefined}
        style={{
          cursor: onClick ? 'pointer' : 'default',
          pointerEvents: 'visiblePainted',
        }}
      />
    </g>
  );
}
