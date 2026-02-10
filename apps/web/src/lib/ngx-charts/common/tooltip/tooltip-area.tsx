/**
 * @fileoverview Tooltip area component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/tooltip-area.component.ts
 *
 * @description
 * SVG overlay component for detecting hover positions in charts.
 * Shows tooltip anchor and content based on mouse position.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import {
  useState,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { ViewDimensions } from '../../types';
import { useChartTooltip } from './tooltip-context';
import { ScaleType } from '../../types/scale';

/** Tooltip item data structure */
export interface TooltipItem {
  color: string;
  d0?: number;
  d1?: number;
  max?: number;
  min?: number;
  name: string | number | Date;
  series: string;
  value: string | number;
}

/** Color helper interface */
export interface ColorHelper {
  scaleType: ScaleType;
  getColor: (value: unknown) => string;
}

/** Series data structure */
export interface SeriesData {
  name: string | Date;
  series: Array<{
    name: string | number | Date;
    value: number;
    d0?: number;
    d1?: number;
    min?: number;
    max?: number;
  }>;
}

export interface TooltipAreaProps {
  /** Chart dimensions */
  dims: ViewDimensions;
  /** Unique X values set */
  xSet: Array<string | number | Date>;
  /** X scale function */
  xScale: (value: unknown) => number;
  /** Y scale function */
  yScale: (value: number) => number;
  /** Results data array */
  results: SeriesData[];
  /** Color helper for series colors */
  colors: ColorHelper;
  /** Whether to show percentage values */
  showPercentage?: boolean;
  /** Whether tooltip is disabled */
  tooltipDisabled?: boolean;
  /** Custom tooltip template render function */
  tooltipTemplate?: (items: TooltipItem[]) => ReactNode;
  /** Callback when hover position changes */
  onHover?: (value: { value: unknown }) => void;
  /** Whether this is a stacked chart — use mouse Y instead of snapping to data */
  stacked?: boolean;
}

/**
 * Default tooltip template component
 */
function DefaultTooltipTemplate({ items }: { items: TooltipItem[] }) {
  return (
    <div className="area-tooltip-container" style={{ padding: '5px 0', pointerEvents: 'none' }}>
      {items.map((item, index) => (
        <div
          key={`${item.series}-${item.name}-${index}`}
          className="tooltip-item"
          style={{ textAlign: 'left', lineHeight: '1.2em', padding: '5px 0' }}
        >
          <span
            className="tooltip-item-color"
            style={{
              display: 'inline-block',
              height: '12px',
              width: '12px',
              marginRight: '5px',
              backgroundColor: item.color,
              borderRadius: '3px',
            }}
          />
          {getToolTipText(item)}
        </div>
      ))}
    </div>
  );
}

/**
 * Get formatted tooltip text for an item
 */
function getToolTipText(tooltipItem: TooltipItem): string {
  let result = '';

  if (tooltipItem.series !== undefined) {
    result += tooltipItem.series;
  } else {
    result += '???';
  }

  result += ': ';

  if (tooltipItem.value !== undefined) {
    result +=
      typeof tooltipItem.value === 'number'
        ? tooltipItem.value.toLocaleString()
        : tooltipItem.value;
  }

  if (tooltipItem.min !== undefined || tooltipItem.max !== undefined) {
    result += ' (';
    if (tooltipItem.min !== undefined) {
      if (tooltipItem.max === undefined) {
        result += '\u2265'; // >=
      }
      result += tooltipItem.min.toLocaleString();
      if (tooltipItem.max !== undefined) {
        result += ' - ';
      }
    } else if (tooltipItem.max !== undefined) {
      result += '\u2264'; // <=
    }
    if (tooltipItem.max !== undefined) {
      result += tooltipItem.max.toLocaleString();
    }
    result += ')';
  }

  return result;
}

/**
 * Binary search to find closest point index
 */
function findClosestPointIndex(
  xPos: number,
  xSet: Array<string | number | Date>,
  xScale: (value: unknown) => number
): number {
  let minIndex = 0;
  let maxIndex = xSet.length - 1;
  let minDiff = Number.MAX_VALUE;
  let closestIndex = 0;

  while (minIndex <= maxIndex) {
    const currentIndex = Math.floor((minIndex + maxIndex) / 2);
    const currentElement = xScale(xSet[currentIndex]);
    const curDiff = Math.abs(currentElement - xPos);

    if (curDiff < minDiff) {
      minDiff = curDiff;
      closestIndex = currentIndex;
    }

    if (currentElement < xPos) {
      minIndex = currentIndex + 1;
    } else if (currentElement > xPos) {
      maxIndex = currentIndex - 1;
    } else {
      minDiff = 0;
      closestIndex = currentIndex;
      break;
    }
  }

  return closestIndex;
}

/**
 * Tooltip area component
 *
 * Creates an invisible overlay area to detect mouse position in charts.
 * Shows a vertical anchor line and tooltip at the closest data point.
 */
export function TooltipArea({
  dims,
  xSet,
  xScale,
  yScale,
  results,
  colors,
  showPercentage = false,
  tooltipDisabled = false,
  tooltipTemplate,
  onHover,
  stacked = false,
}: TooltipAreaProps) {
  const [anchorOpacity, setAnchorOpacity] = useState(0);
  const [anchorPos, setAnchorPos] = useState(-1);
  const [anchorYPos, setAnchorYPos] = useState(-1);
  const [anchorValues, setAnchorValues] = useState<TooltipItem[]>([]);
  const lastAnchorPosRef = useRef<number>(-1);
  const anchorRef = useRef<SVGLineElement>(null);

  // Global tooltip context - like Angular's TooltipService with destroyAll()
  const { showTooltip, hideTooltip } = useChartTooltip();

  // Get values for a given x value
  const getValues = useCallback(
    (xVal: string | number | Date): TooltipItem[] => {
      const resultItems: TooltipItem[] = [];

      for (const group of results) {
        const item = group.series.find(
          (d) => d.name.toString() === xVal.toString()
        );

        let groupName = group.name;
        if (groupName instanceof Date) {
          groupName = groupName.toLocaleDateString();
        }

        if (item) {
          const label = item.name;
          let val: string | number = item.value;

          if (showPercentage && item.d1 !== undefined && item.d0 !== undefined) {
            val = (item.d1 - item.d0).toFixed(2) + '%';
          }

          let color: string;
          if (colors.scaleType === ScaleType.Linear) {
            let v: number = typeof val === 'number' ? val : item.value;
            if (item.d1 !== undefined) {
              v = item.d1;
            }
            color = colors.getColor(v);
          } else {
            color = colors.getColor(group.name);
          }

          const data: TooltipItem = {
            ...item,
            value: val,
            name: label,
            series: String(groupName),
            min: item.min,
            max: item.max,
            color,
          };

          resultItems.push(data);
        }
      }

      return resultItems;
    },
    [results, colors, showPercentage]
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      if (typeof window === 'undefined') return;

      const target = event.target as SVGRectElement;
      const rect = target.getBoundingClientRect();
      const xPos = event.clientX - rect.left;

      const closestIndex = findClosestPointIndex(xPos, xSet, xScale);
      const closestPoint = xSet[closestIndex];

      let newAnchorPos = xScale(closestPoint);
      newAnchorPos = Math.max(0, newAnchorPos);
      newAnchorPos = Math.min(dims.width, newAnchorPos);

      const values = getValues(closestPoint);

      // Calculate Y position for horizontal crosshair — always follow mouse
      let yPos = event.clientY - rect.top;
      yPos = Math.max(0, Math.min(dims.height, yPos));

      // Update anchor position
      setAnchorPos(newAnchorPos);
      setAnchorYPos(yPos);
      setAnchorValues(values);
      setAnchorOpacity(0.7);

      // Show tooltip positioned relative to anchor line (placement: right)
      // Pass positionKey (anchor position) so tooltip repositions when anchor moves
      if (anchorRef.current && !tooltipDisabled) {
        const content = tooltipTemplate ? tooltipTemplate(values) : <DefaultTooltipTemplate items={values} />;
        showTooltip({
          content,
          host: anchorRef.current as unknown as HTMLElement,
          placement: 'right',
          type: 'tooltip',
          showCaret: false,
          positionKey: newAnchorPos, // Triggers reposition when anchor moves
        });
      }

      if (newAnchorPos !== lastAnchorPosRef.current) {
        onHover?.({ value: closestPoint });
        lastAnchorPosRef.current = newAnchorPos;
      }
    },
    [xSet, xScale, dims.width, getValues, onHover, tooltipDisabled, tooltipTemplate, showTooltip]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setAnchorOpacity(0);
    hideTooltip();
    lastAnchorPosRef.current = -1;
  }, [hideTooltip]);

  // Animation styles for anchor
  const anchorStyle = useMemo(
    () => ({
      opacity: anchorOpacity,
      pointerEvents: 'none' as const,
      transition: 'opacity 250ms ease-in-out',
    }),
    [anchorOpacity]
  );

  return (
    <g>
      {/* Invisible area for mouse detection */}
      <rect
        className="tooltip-area"
        x={0}
        y={0}
        width={dims.width}
        height={dims.height}
        style={{ opacity: 0, cursor: 'auto' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Crosshair lines */}
      <g style={anchorStyle}>
        {/* Vertical dashed line */}
        <line
          ref={anchorRef}
          className="tooltip-anchor"
          x1={anchorPos}
          y1={0}
          x2={anchorPos}
          y2={dims.height}
          stroke="#1a1a1a"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
        {/* Horizontal dashed line */}
        {anchorYPos >= 0 && (
          <line
            x1={0}
            y1={anchorYPos}
            x2={dims.width}
            y2={anchorYPos}
            stroke="#1a1a1a"
            strokeWidth={1}
            strokeDasharray="6 4"
          />
        )}
        {/* Center circle at intersection */}
        {anchorYPos >= 0 && (
          <circle
            cx={anchorPos}
            cy={anchorYPos}
            r={4}
            fill="white"
            stroke="#1a1a1a"
            strokeWidth={1.5}
          />
        )}
      </g>
    </g>
  );
}
