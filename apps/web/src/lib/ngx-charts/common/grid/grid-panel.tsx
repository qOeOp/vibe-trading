/**
 * @fileoverview Grid panel component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/grid-panel.component.ts
 *
 * @description
 * Renders a single grid panel (background rectangle) for charts.
 * Used as part of the grid panel series to create alternating backgrounds.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { memo } from 'react';

export interface GridPanelProps {
  /** X coordinate of the panel */
  x: number;
  /** Y coordinate of the panel */
  y: number;
  /** Width of the panel */
  width: number;
  /** Height of the panel */
  height: number;
  /** CSS class name for styling */
  className?: string;
}

/**
 * Grid panel component for rendering a single background rectangle
 *
 * @example
 * ```tsx
 * <GridPanel x={0} y={0} width={100} height={200} className="odd" />
 * ```
 */
export const GridPanel = memo(function GridPanel({
  x,
  y,
  width,
  height,
  className = '',
}: GridPanelProps) {
  // Match Angular ngx-charts grid panel styles:
  // - Even panels: no fill (transparent)
  // - Odd panels: rgba(0, 0, 0, 0.05) (very light gray)
  const fill = className === 'odd' ? 'rgba(0, 0, 0, 0.05)' : 'none';

  return (
    <rect
      className={`grid-panel ${className}`.trim()}
      x={x}
      y={y}
      width={width}
      height={height}
      stroke="none"
      fill={fill}
    />
  );
});

GridPanel.displayName = 'GridPanel';
