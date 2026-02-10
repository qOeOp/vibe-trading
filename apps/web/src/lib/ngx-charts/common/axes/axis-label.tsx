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
  label: string;
  offset: number;
  orient: Orientation;
  width: number;
  height: number;
}

export function AxisLabel({ label, offset, orient, width, height }: AxisLabelProps) {
  const { x, y, transform } = useMemo(() => {
    const textHeight = 25;
    const margin = 5;

    switch (orient) {
      case Orientation.Top:
      case Orientation.Bottom:
        return { x: width / 2, y: offset, transform: '' };
      case Orientation.Left:
        return { x: -height / 2, y: -(offset + textHeight + margin), transform: 'rotate(270)' };
      case Orientation.Right:
        return { x: -height / 2, y: offset + margin, transform: 'rotate(270)' };
      default:
        return { x: 0, y: 0, transform: '' };
    }
  }, [orient, offset, width, height]);

  return (
    <text
      className="axis-label"
      strokeWidth="0.01"
      x={x}
      y={y}
      textAnchor="middle"
      transform={transform}
      style={{ fontSize: '12px' }}
    >
      {label}
    </text>
  );
}
