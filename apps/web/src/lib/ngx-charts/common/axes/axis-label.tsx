/**
 * @fileoverview Axis label component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/axes/axis-label.component.ts
 *
 * @description
 * Renders axis labels for X and Y axes.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo } from 'react';
import { Orientation } from '../../types';

export interface AxisLabelProps {
  /** Label text */
  label: string;
  /** Offset from axis */
  offset: number;
  /** Orientation of the axis */
  orient: Orientation;
  /** Chart width */
  width: number;
  /** Chart height */
  height: number;
}

/**
 * Axis label component for rendering axis titles
 */
export function AxisLabel({ label, offset, orient, width, height }: AxisLabelProps) {
  const { x, y, transform, textAnchor } = useMemo(() => {
    const textHeight = 25;
    const margin = 5;
    let xPos = 0;
    let yPos = 0;
    let trans = '';

    switch (orient) {
      case Orientation.Top:
        yPos = offset;
        xPos = width / 2;
        break;
      case Orientation.Bottom:
        yPos = offset;
        xPos = width / 2;
        break;
      case Orientation.Left:
        yPos = -(offset + textHeight + margin);
        xPos = -height / 2;
        trans = 'rotate(270)';
        break;
      case Orientation.Right:
        yPos = offset + margin;
        xPos = -height / 2;
        trans = 'rotate(270)';
        break;
      default:
        break;
    }

    return {
      x: xPos,
      y: yPos,
      transform: trans,
      textAnchor: 'middle' as const,
    };
  }, [orient, offset, width, height]);

  return (
    <text
      className="axis-label"
      strokeWidth="0.01"
      x={x}
      y={y}
      textAnchor={textAnchor}
      transform={transform}
      style={{ fontSize: '12px' }}
    >
      {label}
    </text>
  );
}
