'use client';

/**
 * @fileoverview Bar label component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/bar-chart/bar-label.component.ts
 *
 * @description
 * Renders data labels on bars showing the value.
 * Supports vertical and horizontal orientations.
 *
 * @license MIT
 */

import { useMemo, useRef, useEffect } from 'react';
import type { BarLabelProps } from '../types';
import { formatLabel } from '../../utils';

/** Track reported dimensions to avoid infinite loops */
interface ReportedDimensions {
  height: number;
  width: number;
}

/**
 * Bar label component for displaying values on bars
 */
export function BarLabel({
  value,
  valueFormatting,
  barX,
  barY,
  barWidth,
  barHeight,
  orientation,
  onDimensionsChanged,
}: BarLabelProps) {
  const textRef = useRef<SVGTextElement>(null);
  const lastReportedRef = useRef<ReportedDimensions | null>(null);
  const horizontalPadding = 2;
  const verticalPadding = 5;

  // Format the value
  const formattedValue = useMemo(() => {
    if (valueFormatting) {
      return valueFormatting(value);
    }
    return formatLabel(value);
  }, [value, valueFormatting]);

  // Calculate position based on orientation
  const { x, y, textAnchor, transform } = useMemo(() => {
    if (orientation === 'horizontal') {
      let labelX = barX + barWidth;
      let anchor: 'start' | 'end';

      if (value < 0) {
        labelX = labelX - horizontalPadding;
        anchor = 'end';
      } else {
        labelX = labelX + horizontalPadding;
        anchor = 'start';
      }

      const labelY = barY + barHeight / 2;

      return {
        x: labelX,
        y: labelY,
        textAnchor: anchor,
        transform: undefined,
      };
    } else {
      // Vertical orientation
      const labelX = barX + barWidth / 2;
      let labelY = barY + barHeight;
      let anchor: 'start' | 'end';

      if (value < 0) {
        labelY = labelY + verticalPadding;
        anchor = 'end';
      } else {
        labelY = labelY - verticalPadding;
        anchor = 'start';
      }

      return {
        x: labelX,
        y: labelY,
        textAnchor: anchor,
        transform: `rotate(-45, ${labelX}, ${labelY})`,
      };
    }
  }, [orientation, barX, barY, barWidth, barHeight, value]);

  // Report dimensions after render - only when dimensions actually change
  // This prevents infinite loops when onDimensionsChanged triggers re-renders
  useEffect(() => {
    if (textRef.current && onDimensionsChanged) {
      const bbox = textRef.current.getBoundingClientRect();
      const newHeight = Math.round(bbox.height);
      const newWidth = Math.round(bbox.width);

      // Only report if dimensions changed to prevent infinite loops
      const last = lastReportedRef.current;
      if (!last || last.height !== newHeight || last.width !== newWidth) {
        lastReportedRef.current = { height: newHeight, width: newWidth };
        onDimensionsChanged({
          height: newHeight,
          width: newWidth,
          negative: value < 0,
        });
      }
    }
    // Intentionally exclude onDimensionsChanged from deps to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, formattedValue]);

  return (
    <text
      ref={textRef}
      className="textDataLabel"
      alignmentBaseline="middle"
      textAnchor={textAnchor}
      transform={transform}
      x={x}
      y={y}
      style={{
        fontSize: '11px',
      }}
    >
      {formattedValue}
    </text>
  );
}
