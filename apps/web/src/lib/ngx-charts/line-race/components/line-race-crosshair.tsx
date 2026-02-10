/**
 * @fileoverview Shared crosshair tooltip overlay for line race charts
 *
 * @description
 * Renders a vertical crosshair line at the hovered round position with
 * stacked labels showing each series' value. Labels are positioned using
 * a collision-avoidance algorithm that distributes them vertically.
 *
 * Extracted from line-race.tsx and line-race-with-leaderboard.tsx to
 * eliminate ~120 lines of duplication.
 *
 * @license MIT
 */

'use client';

import type { ReactNode } from 'react';
import type { LineRaceSeriesData } from '../hooks';
import { ColorHelper } from '../../utils';

export interface CrosshairItem {
  name: string;
  value: number;
  color: string;
  cy: number;
  dataIndex: number;
}

export interface LineRaceCrosshairProps {
  /** The hovered round index */
  hoveredRound: number;
  /** Chart data */
  data: LineRaceSeriesData[];
  /** Y scale function */
  yScale: (value: number) => number;
  /** X position for crosshair */
  hx: number;
  /** Chart width */
  chartWidth: number;
  /** Chart height */
  chartHeight: number;
  /** Custom colors array */
  customColors?: string[];
  /** Color helper */
  colors: ColorHelper;
  /** Value formatter */
  valueFormatter?: (value: number) => string;
  /** Render marker for each data point */
  renderMarker: (item: CrosshairItem, hx: number) => ReactNode;
  /** Render round label badge at bottom of crosshair */
  renderRoundLabel: (hoveredRound: number, hx: number, chartHeight: number) => ReactNode;
}

/**
 * Computes collision-free label Y positions for stacked tooltip labels.
 *
 * Uses an iterative relaxation algorithm: places labels at uniform spacing
 * initially, then nudges each toward its true data-point Y while respecting
 * minimum gap constraints from neighbors.
 */
function computeLabelPositions(items: CrosshairItem[], labelH: number, chartHeight: number): number[] {
  const minGap = labelH + 2;
  const totalNeeded = items.length * minGap;
  const medianCy = items[Math.floor(items.length / 2)]?.cy ?? chartHeight / 2;
  const stackTop = Math.max(0, Math.min(chartHeight - totalNeeded, medianCy - totalNeeded / 2));

  const labelYs = items.map((_, j) => stackTop + j * minGap);

  for (let pass = 0; pass < 5; pass++) {
    for (let j = 0; j < items.length; j++) {
      const target = items[j].cy - labelH / 2;
      const minY = j === 0 ? 0 : labelYs[j - 1] + minGap;
      const maxY = j === items.length - 1 ? chartHeight - labelH : labelYs[j + 1] - minGap;
      labelYs[j] = Math.max(minY, Math.min(maxY, target));
    }
  }

  return labelYs;
}

/**
 * Shared crosshair tooltip overlay for line race charts
 */
export function LineRaceCrosshair({
  hoveredRound,
  data,
  yScale,
  hx,
  chartWidth,
  chartHeight,
  customColors,
  colors,
  valueFormatter,
  renderMarker,
  renderRoundLabel,
}: LineRaceCrosshairProps) {
  const labelH = 22;
  const labelPad = 8;
  const placeLeft = hx > chartWidth * 0.5;

  const items: CrosshairItem[] = data
    .map((series, i) => {
      if (hoveredRound >= series.values.length) return null;
      const val = series.values[hoveredRound];
      return {
        name: series.name,
        value: val,
        color: customColors?.[i] ?? colors.getColor(series.name),
        cy: yScale(val),
        dataIndex: i,
      };
    })
    .filter((item): item is CrosshairItem => item !== null);

  items.sort((a, b) => a.cy - b.cy);

  const labelYs = computeLabelPositions(items, labelH, chartHeight);

  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* Crosshair vertical line */}
      <line
        x1={hx} y1={0} x2={hx} y2={chartHeight}
        stroke="#333" strokeWidth={1} shapeRendering="crispEdges" opacity={0.35}
      />

      {/* Connector lines from data point to label */}
      {items.map((item, j) => {
        const labelCenterY = labelYs[j] + labelH / 2;
        const labelEdgeX = placeLeft ? hx - labelPad : hx + labelPad;
        return (
          <line
            key={`conn-${item.name}`}
            x1={hx} y1={item.cy}
            x2={labelEdgeX} y2={labelCenterY}
            stroke={item.color} strokeWidth={0.8} opacity={0.5}
          />
        );
      })}

      {/* Data point markers */}
      {items.map((item) => renderMarker(item, hx))}

      {/* Stacked value labels */}
      {items.map((item, j) => {
        const lx = placeLeft ? hx - labelPad : hx + labelPad;
        const ly = labelYs[j];
        return (
          <foreignObject
            key={`label-${item.name}`}
            x={placeLeft ? lx - 220 : lx}
            y={ly} width={220} height={labelH}
            style={{ overflow: 'visible' }}
          >
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '2px 8px 2px 6px',
                background: 'rgba(255,255,255,0.95)',
                border: `1px solid ${item.color}`,
                borderLeft: placeLeft ? undefined : `3px solid ${item.color}`,
                borderRight: placeLeft ? `3px solid ${item.color}` : undefined,
                borderRadius: 3, fontSize: 11,
                fontFamily: 'var(--font-chart, Roboto, sans-serif)',
                whiteSpace: 'nowrap', lineHeight: '16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                float: placeLeft ? 'right' : 'left',
              }}
            >
              <span style={{ color: '#333', fontWeight: 500 }}>{item.name}:</span>
              <span style={{ color: '#333', fontVariantNumeric: 'tabular-nums' }}>
                {valueFormatter ? valueFormatter(item.value) : item.value.toLocaleString()}
              </span>
            </div>
          </foreignObject>
        );
      })}

      {/* Round label badge */}
      {renderRoundLabel(hoveredRound, hx, chartHeight)}
    </g>
  );
}
