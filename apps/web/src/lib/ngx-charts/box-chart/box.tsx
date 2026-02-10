/**
 * @fileoverview Box component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/box-chart/box.component.ts
 *
 * @description
 * Individual box in a box chart (box-and-whisker plot).
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useId } from 'react';
import { motion } from 'framer-motion';
import type { Gradient, DataItem } from '../types';
import { roundedRect } from '../utils';
import { SvgLinearGradient } from '../common';

export interface IVector2D {
  v1: { x: number; y: number };
  v2: { x: number; y: number };
}

export interface IBoxModel {
  value: number;
  data: DataItem[];
  label: string | number | Date;
  formattedLabel?: string;
  width: number;
  height: number;
  x: number;
  y: number;
  roundEdges: boolean;
  quartiles: [number, number, number];
  lineCoordinates: [IVector2D, IVector2D, IVector2D, IVector2D];
  color?: string;
  gradientStops?: Gradient[];
  tooltipText?: string;
  ariaLabel?: string;
}

export interface BoxProps {
  strokeColor: string;
  strokeWidth: number;
  fill: string;
  data: IBoxModel;
  width: number;
  height: number;
  x: number;
  y: number;
  lineCoordinates: [IVector2D, IVector2D, IVector2D, IVector2D];
  roundEdges?: boolean;
  gradient?: boolean;
  gradientStops?: Gradient[];
  animated?: boolean;
  ariaLabel?: string;
  onSelect?: (data: IBoxModel) => void;
  onActivate?: (data: IBoxModel) => void;
  onDeactivate?: (data: IBoxModel) => void;
}

export function Box({
  strokeColor,
  strokeWidth,
  fill,
  data,
  width,
  height,
  x,
  y,
  lineCoordinates,
  roundEdges = true,
  gradient = false,
  gradientStops,
  animated = true,
  ariaLabel,
  onSelect,
  onActivate,
  onDeactivate,
}: BoxProps) {
  const reactId = useId();
  const gradientId = `grad${reactId.replace(/:/g, '')}`;
  const maskLineId = `mask${reactId.replace(/:/g, '')}`;

  const gradientFill = `url(#${gradientId})`;
  const maskLine = `url(#${maskLineId})`;

  const boxStrokeWidth = Math.max(strokeWidth, 1);
  const whiskerStrokeWidth = Math.max(strokeWidth / 2, 1);
  const medianLineWidth = 1.5 * strokeWidth;

  const hideBar = height === 0;

  const radius = useMemo(() => {
    if (!roundEdges || height <= 5 || width <= 5) return 0;
    return Math.floor(Math.min(5, height / 2, width / 2));
  }, [roundEdges, height, width]);

  const boxPath = useMemo(() => {
    const edges: [boolean, boolean, boolean, boolean] = roundEdges
      ? [true, true, true, true]
      : [false, false, false, false];
    return roundedRect(x, y, width, height, Math.min(height, radius), edges);
  }, [x, y, width, height, radius, roundEdges]);

  const stops = useMemo(() => {
    if (gradientStops) return gradientStops;
    return [
      { offset: 0, color: fill, opacity: roundEdges ? 0.2 : 0.5 },
      { offset: 100, color: fill, opacity: 1 },
    ];
  }, [gradientStops, fill, roundEdges]);

  const handleClick = useCallback(() => {
    onSelect?.(data);
  }, [data, onSelect]);

  const handleMouseEnter = useCallback(() => {
    onActivate?.(data);
  }, [data, onActivate]);

  const handleMouseLeave = useCallback(() => {
    onDeactivate?.(data);
  }, [data, onDeactivate]);

  if (hideBar) return null;

  return (
    <g>
      <defs>
        {gradient && (
          <SvgLinearGradient
            id={gradientId}
            orientation="vertical"
            stops={stops}
          />
        )}
        <mask id={maskLineId}>
          <g>
            <rect height="100%" width="100%" fill="white" fillOpacity={1} />
            <path className="bar" d={boxPath} fill="black" fillOpacity={1} />
          </g>
        </mask>
      </defs>

      <g>
        {/* Box rectangle */}
        <motion.path
          className="bar"
          role="img"
          tabIndex={-1}
          d={boxPath}
          stroke={strokeColor}
          strokeWidth={boxStrokeWidth}
          fill={gradient ? gradientFill : fill}
          aria-label={ariaLabel}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'pointer' }}
          initial={animated ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Whisker lines */}
        {lineCoordinates.map((line, i) => (
          <motion.line
            key={`line-${i}`}
            className="bar-line"
            x1={line.v1.x}
            y1={line.v1.y}
            x2={line.v2.x}
            y2={line.v2.y}
            stroke={strokeColor}
            strokeWidth={i === 2 ? medianLineWidth : whiskerStrokeWidth}
            mask={i === 0 ? maskLine : undefined}
            fill="none"
            initial={animated ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        ))}
      </g>
    </g>
  );
}
