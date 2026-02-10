/**
 * @fileoverview Pie Label Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/pie-chart/pie-label.component.ts
 *
 * @description
 * Label component for pie chart slices with leader lines.
 * Handles label positioning, trimming, and animation.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { arc as d3Arc } from 'd3-shape';
import { trimLabel } from '../../utils';
import type { TextAnchor } from '../../types';

/** Pie data for label positioning */
export interface PieLabelData {
  startAngle: number;
  endAngle: number;
  padAngle?: number;
  pos: [number, number];
}

export interface PieLabelProps {
  /** Arc data with angles and position */
  data: PieLabelData;
  /** Radius for label positioning */
  radius: number;
  /** Label text */
  label: string;
  /** Label line color */
  color: string;
  /** Maximum value (for explode calculation) */
  max: number;
  /** Arc value */
  value: number;
  /** Explode slices outward */
  explodeSlices?: boolean;
  /** Enable animations */
  animations?: boolean;
  /** Trim long labels */
  labelTrim?: boolean;
  /** Maximum label length before trimming */
  labelTrimSize?: number;
}

/**
 * Calculates the midpoint angle of an arc
 */
function midAngle(d: PieLabelData): number {
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

/**
 * Determines text anchor based on arc position
 */
function getTextAnchor(d: PieLabelData): TextAnchor {
  return midAngle(d) < Math.PI ? 'start' : 'end';
}

/**
 * Pie label component with leader line
 */
export function PieLabel({
  data,
  radius,
  label,
  color,
  max,
  value,
  explodeSlices = false,
  animations = true,
  labelTrim = true,
  labelTrimSize = 10,
}: PieLabelProps) {
  // Calculate label position and line path
  const { linePath, textX, textY, textAnchor, displayLabel } = useMemo(() => {
    // Calculate starting radius (may vary for exploded slices)
    let startRadius = radius;
    if (explodeSlices && max > 0) {
      startRadius = (radius * value) / max;
    }

    // Create arc generator for calculating inner point
    const innerArc = d3Arc().innerRadius(startRadius).outerRadius(startRadius);

    // Calculate inner position (on the arc edge)
    const innerPos = innerArc.centroid({
      startAngle: data.startAngle,
      endAngle: data.endAngle,
      innerRadius: startRadius,
      outerRadius: startRadius,
    });

    // Calculate outer position scaled to label position
    let scale = 1;
    if (data.pos[1] !== 0 && innerPos[1] !== 0) {
      scale = data.pos[1] / innerPos[1];
    }
    const outerPos: [number, number] = [scale * innerPos[0], scale * innerPos[1]];

    // Generate line path from arc edge to label
    const line = `M${innerPos[0]},${innerPos[1]}L${outerPos[0]},${outerPos[1]}L${data.pos[0]},${data.pos[1]}`;

    // Display label (trimmed if needed)
    const trimmedLabel = labelTrim ? trimLabel(label, labelTrimSize) : label;

    return {
      linePath: line,
      textX: data.pos[0],
      textY: data.pos[1],
      textAnchor: getTextAnchor(data),
      displayLabel: trimmedLabel,
    };
  }, [data, radius, value, max, explodeSlices, label, labelTrim, labelTrimSize]);

  // Animation variants
  const textVariants = {
    initial: { opacity: 0, x: 0, y: 0 },
    animate: { opacity: 1, x: textX, y: textY },
  };

  const lineVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
  };

  return (
    <g className="pie-label-group">
      {/* Title for accessibility */}
      <title>{label}</title>

      {/* Label text */}
      {animations ? (
        <motion.g
          initial="initial"
          animate="animate"
          variants={textVariants}
          transition={{
            duration: 0.75,
            ease: 'easeOut',
          }}
        >
          <text
            className="pie-label"
            dy=".35em"
            style={{
              textAnchor,
              shapeRendering: 'crispEdges',
              fontSize: '11px',
                          }}
          >
            {displayLabel}
          </text>
        </motion.g>
      ) : (
        <g transform={`translate(${textX}, ${textY})`}>
          <text
            className="pie-label"
            dy=".35em"
            style={{
              textAnchor,
              shapeRendering: 'crispEdges',
              fontSize: '11px',
                          }}
          >
            {displayLabel}
          </text>
        </g>
      )}

      {/* Leader line */}
      {animations ? (
        <motion.path
          className="pie-label-line line"
          d={linePath}
          stroke={color}
          fill="none"
          strokeWidth={1}
          initial="initial"
          animate="animate"
          variants={lineVariants}
          transition={{
            duration: 0.75,
            ease: 'easeOut',
          }}
        />
      ) : (
        <path
          className="pie-label-line line"
          d={linePath}
          stroke={color}
          fill="none"
          strokeWidth={1}
        />
      )}
    </g>
  );
}
