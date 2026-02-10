/**
 * @fileoverview Gauge Axis Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/gauge/gauge-axis.component.ts
 *
 * @description
 * Axis component for gauge charts with tick marks and labels.
 * Renders major and minor tick marks around the gauge arc.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo } from 'react';
import { line } from 'd3-shape';
import type { ScaleLinear } from 'd3-scale';

/** Big tick mark data */
interface BigTick {
  line: string;
  text: string;
  textAnchor: 'start' | 'middle' | 'end';
  textTransform: string;
}

/** Small tick mark data */
interface SmallTick {
  line: string;
}

/** Ticks configuration */
interface Ticks {
  big: BigTick[];
  small: SmallTick[];
}

export interface GaugeAxisProps {
  /** Number of major tick segments */
  bigSegments?: number;
  /** Number of minor tick segments between major ticks */
  smallSegments?: number;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Angle span in degrees */
  angleSpan: number;
  /** Start angle in degrees */
  startAngle: number;
  /** Radius of the gauge */
  radius: number;
  /** Value scale function */
  valueScale: ScaleLinear<number, number>;
  /** Tick formatting function */
  tickFormatting?: (value: number) => string;
}

/**
 * Determines text anchor based on angle position
 */
function getTextAnchor(angle: number, startAngle: number): 'start' | 'middle' | 'end' {
  // Adjust angle to include start angle
  const adjustedAngle = (startAngle + angle) % 360;

  // [0, 45] = 'middle';
  // [46, 135] = 'start';
  // [136, 225] = 'middle';
  // [226, 315] = 'end';
  if (adjustedAngle > 45 && adjustedAngle <= 135) {
    return 'start';
  } else if (adjustedAngle > 225 && adjustedAngle <= 315) {
    return 'end';
  }
  return 'middle';
}

/**
 * Creates a tick path between two points
 */
function getTickPath(startDistance: number, tickLength: number, angle: number): string {
  const y1 = startDistance * Math.sin(angle);
  const y2 = (startDistance + tickLength) * Math.sin(angle);
  const x1 = startDistance * Math.cos(angle);
  const x2 = (startDistance + tickLength) * Math.cos(angle);

  const points = [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ];

  const lineGenerator = line<{ x: number; y: number }>()
    .x((d) => d.x)
    .y((d) => d.y);

  return lineGenerator(points) || '';
}

/**
 * Gauge axis component with tick marks and labels
 */
export function GaugeAxis({
  bigSegments = 10,
  smallSegments = 5,
  angleSpan,
  startAngle,
  radius,
  valueScale,
  tickFormatting,
}: GaugeAxisProps) {
  // Calculate rotation angle
  const rotationAngle = useMemo(() => {
    return -90 + startAngle;
  }, [startAngle]);

  // Generate ticks
  const ticks = useMemo((): Ticks => {
    const bigTickSegment = angleSpan / bigSegments;
    const smallTickSegment = bigTickSegment / smallSegments;
    const tickLength = 20;
    const result: Ticks = {
      big: [],
      small: [],
    };

    const startDistance = radius + 10;
    const textDist = startDistance + tickLength + 10;

    for (let i = 0; i <= bigSegments; i++) {
      const angleDeg = i * bigTickSegment;
      const angle = (angleDeg * Math.PI) / 180;

      const textAnchor = getTextAnchor(angleDeg, startAngle);

      // Skip first tick if full circle
      let skip = false;
      if (i === 0 && angleSpan === 360) {
        skip = true;
      }

      if (!skip) {
        // Get the value at this angle
        const invertedValue = valueScale.invert(angleDeg);
        let text = Number.parseFloat(invertedValue.toString()).toLocaleString();

        if (tickFormatting) {
          text = tickFormatting(invertedValue);
        }

        result.big.push({
          line: getTickPath(startDistance, tickLength, angle),
          textAnchor,
          text,
          textTransform: `translate(${(textDist * Math.cos(angle)).toFixed(2)}, ${(textDist * Math.sin(angle)).toFixed(2)}) rotate(${-rotationAngle})`,
        });
      }

      // Don't add small ticks after the last big segment
      if (i === bigSegments) {
        continue;
      }

      // Add small ticks between big ticks
      for (let j = 1; j <= smallSegments; j++) {
        const smallAngleDeg = angleDeg + j * smallTickSegment;
        const smallAngle = (smallAngleDeg * Math.PI) / 180;

        result.small.push({
          line: getTickPath(startDistance, tickLength / 2, smallAngle),
        });
      }
    }

    return result;
  }, [
    bigSegments,
    smallSegments,
    angleSpan,
    startAngle,
    radius,
    valueScale,
    tickFormatting,
    rotationAngle,
  ]);

  return (
    <g className="gauge-axis" transform={`rotate(${rotationAngle})`}>
      {/* Big tick lines */}
      {ticks.big.map((tick, index) => (
        <g key={`big-tick-line-${index}`} className="gauge-tick gauge-tick-large">
          <path d={tick.line} fill="none" />
        </g>
      ))}

      {/* Big tick labels */}
      {ticks.big.map((tick, index) => (
        <g key={`big-tick-text-${index}`} className="gauge-tick gauge-tick-large">
          <text
            style={{ textAnchor: tick.textAnchor }}
            transform={tick.textTransform}
            alignmentBaseline="central"
          >
            {tick.text}
          </text>
        </g>
      ))}

      {/* Small tick lines */}
      {ticks.small.map((tick, index) => (
        <g key={`small-tick-${index}`} className="gauge-tick gauge-tick-small">
          <path d={tick.line} fill="none" opacity={0.5} />
        </g>
      ))}
    </g>
  );
}
