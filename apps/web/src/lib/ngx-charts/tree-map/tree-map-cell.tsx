/**
 * @fileoverview TreeMapCell component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/tree-map/tree-map-cell.component.ts
 *
 * @description
 * Individual cell in a tree map chart.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useId } from 'react';
import { motion } from 'framer-motion';
import { DataItem, Gradient } from '../types';
import { trimLabel, escapeLabel } from '../utils';
import { SvgLinearGradient } from '../common/gradients';

export interface TreeMapCellProps {
  data: DataItem;
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  value: number;
  valueFormatting?: (value: number) => string;
  labelFormatting?: (cell: { data: DataItem; label: string; value: number }) => string;
  gradient?: boolean;
  animated?: boolean;
  onSelect?: (data: DataItem) => void;
}

/**
 * Inverts a color for text contrast
 */
function invertColor(hex: string): string {
  if (!hex) return '#000';

  // Remove # if present
  hex = hex.replace('#', '');

  // Parse RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000' : '#fff';
}

export function TreeMapCell({
  data,
  fill,
  x,
  y,
  width,
  height,
  label,
  value,
  valueFormatting,
  labelFormatting,
  gradient = false,
  animated = true,
  onSelect,
}: TreeMapCellProps) {
  const reactId = useId();
  const gradientId = `grad${reactId.replace(/:/g, '')}`;
  const gradientUrl = `url(#${gradientId})`;

  const gradientStops: Gradient[] = useMemo(() => [
    { offset: 0, color: fill, opacity: 0.3 },
    { offset: 100, color: fill, opacity: 1 },
  ], [fill]);

  const formatValue = valueFormatting || ((v: number) => v.toLocaleString());
  const formatLabel = labelFormatting || ((cell: { label: string }) => escapeLabel(trimLabel(cell.label, 55)));

  const cellData = { data, label, value };
  const formattedValue = formatValue(value);
  const formattedLabel = formatLabel(cellData);

  const textColor = invertColor(fill);

  const handleClick = useCallback(() => {
    onSelect?.(data);
  }, [data, onSelect]);

  const showLabel = width >= 70 && height >= 35;

  return (
    <g>
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
        className="cell"
        fill={gradient ? gradientUrl : fill}
        x={x}
        y={y}
        width={width}
        height={height}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
        initial={animated ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      />

      {showLabel && (
        <foreignObject
          x={x}
          y={y}
          width={width}
          height={height}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              color: textColor,
              height: `${height}px`,
              width: `${width}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4px',
              boxSizing: 'border-box',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <span
              className="treemap-label"
              style={{ fontSize: '12px', fontWeight: 500 }}
              dangerouslySetInnerHTML={{ __html: formattedLabel }}
            />
            <span
              className="treemap-val"
              style={{ fontSize: '11px', opacity: 0.8 }}
            >
              {formattedValue}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
}
