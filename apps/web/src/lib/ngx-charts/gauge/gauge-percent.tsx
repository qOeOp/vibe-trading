/**
 * @fileoverview Percent Gauge Chart Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/gauge/percent-gauge/percent-gauge.component.ts
 *
 * @description
 * Circular percent gauge chart component with a target indicator.
 * Shows percentage progress with colorful segmented tick marks and target circle.
 * Uses Framer Motion for stroke animations.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useId } from 'react';
import { motion } from 'framer-motion';
import { ColorScheme, ScaleType, ViewDimensions } from '../types';
import { ColorHelper, calculateViewDimensions } from '../utils';

export interface GaugePercentProps {
  /** Fixed width (optional, defaults to container width) */
  width?: number;
  /** Fixed height (optional, defaults to container height) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Custom color mapping */
  colors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Maximum value (denominator for percentage) */
  max?: number;
  /** Current value */
  value?: number;
  /** Target percentage (0-100) */
  target?: number;
  /** Label for the target indicator */
  targetLabel?: string;
  /** Label displayed below the gauge */
  label?: string;
  /** Value formatting function */
  valueFormatting?: (value: number) => string;
  /** Show label below gauge */
  showLabel?: boolean;
  /** Enable/disable animations */
  animated?: boolean;
  /** Callback when gauge is clicked */
  onSelect?: (data: { name: string; value: number }) => void;
}

/** Tick mark data */
interface Tick {
  height: number;
  width: number;
  fill: string;
  transform: string;
}

/**
 * Generates points around a circle
 */
function generateCirclePoints(
  radius: number,
  numPoints: number
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
}

/**
 * Percent gauge chart component
 */
export function GaugePercent({
  width = 300,
  height = 300,
  colorScheme = 'cool',
  colors,
  max = 100,
  value = 0,
  target = 75,
  targetLabel = 'Target',
  label,
  valueFormatting,
  showLabel = true,
  animated = true,
  onSelect,
}: GaugePercentProps) {
  const maskId = useId();

  // Calculate margins
  const margin: [number, number, number, number] = useMemo(() => {
    const defaultMargin: [number, number, number, number] = [20, 40, 20, 40];
    if (showLabel) {
      return [defaultMargin[0], defaultMargin[1], 50, defaultMargin[3]];
    }
    return defaultMargin;
  }, [showLabel]);

  // Calculate view dimensions
  const dims = useMemo((): ViewDimensions => {
    return calculateViewDimensions({
      width,
      height,
      margins: { top: margin[0], right: margin[1], bottom: margin[2], left: margin[3] },
    });
  }, [width, height, margin]);

  // Calculate percentage
  const percent = useMemo(() => {
    return Math.round((value / max) * 100);
  }, [value, max]);

  // Calculate dimensions
  const ticHeight = useMemo(() => {
    return Math.min(dims.width, dims.height) / 10;
  }, [dims]);

  const radius = useMemo(() => {
    return Math.min(dims.width, dims.height) / 2 - ticHeight / 2;
  }, [dims, ticHeight]);

  const circumference = useMemo(() => {
    return 2 * Math.PI * radius;
  }, [radius]);

  const dashes = useMemo(() => {
    return `${radius / 60} ${circumference / 60 - radius / 60}`;
  }, [radius, circumference]);

  const valueFontSize = useMemo(() => {
    return Math.floor(radius / 3);
  }, [radius]);

  const targetRadius = useMemo(() => {
    return radius / 4;
  }, [radius]);

  // Value domain for color scale
  const valueDomain: [number, number] = [0, max];

  // Create color helper with linear scale
  const colorHelper = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: ScaleType.Linear,
      domain: valueDomain,
      customColors: colors,
    });
  }, [colorScheme, valueDomain, colors]);

  // Get target color
  const targetColor = useMemo(() => {
    return colorHelper.getColor((target / 100) * max);
  }, [colorHelper, target, max]);

  // Calculate transforms
  const transform = useMemo(() => {
    const xOffset = margin[3] + dims.width / 2;
    const yOffset = margin[0] + dims.height / 2;
    return `translate(${xOffset}, ${yOffset})`;
  }, [margin, dims]);

  const labelTransform = useMemo(() => {
    const yOffset = height / 2 + radius + margin[0] + ticHeight / 2 - 3;
    return `translate(0, ${yOffset})`;
  }, [height, radius, margin, ticHeight]);

  // Target position transform
  const targetTransform = useMemo(() => {
    const angle = (target / 100) * Math.PI * 2 - Math.PI / 2;
    const x = radius * 0.97 * Math.cos(angle) + targetRadius / 2;
    const y = radius * 0.97 * Math.sin(angle) + targetRadius / 2;
    return `translate(${x}, ${y})`;
  }, [target, radius, targetRadius]);

  const targetTextTransform = useMemo(() => {
    const scale = targetRadius / 28;
    return `translate(${-targetRadius / 2}, ${-targetRadius / 2}), scale(${scale})`;
  }, [targetRadius]);

  // Generate tick marks
  const ticks = useMemo((): Tick[] => {
    const numPoints = 60;
    const points = generateCirclePoints(radius, numPoints);
    const ticksList: Tick[] = [];

    for (let j = 0; j < points.length; j++) {
      const { x, y } = points[j];
      let progress = j / numPoints;
      if (progress === 1) {
        progress = 0;
      }

      ticksList.push({
        height: ticHeight,
        width: radius / 60,
        fill: colorHelper.getColor(progress * max),
        transform: `translate(${x}, ${y}), rotate(${360 * progress - 90})`,
      });
    }

    return ticksList;
  }, [radius, ticHeight, max, colorHelper]);

  // Calculate display value
  const displayValue = useMemo(() => {
    if (valueFormatting) {
      return valueFormatting(value);
    }
    return `${percent}%`;
  }, [value, percent, valueFormatting]);

  // Calculate stroke dashoffset for progress
  const strokeDashoffset = useMemo(() => {
    return circumference * (1 - percent / 100);
  }, [circumference, percent]);

  // Click handler
  const handleClick = useCallback(() => {
    onSelect?.({
      name: 'Value',
      value,
    });
  }, [onSelect, value]);

  return (
    <div
      className="ngx-charts-percent-gauge"
      style={{
        width,
        height,
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}>
        <g className="percent-gauge chart" onClick={handleClick} style={{ cursor: 'pointer' }}>
          <g transform={transform}>
            {/* Circle mask for progress animation */}
            <defs>
              <mask id={maskId}>
                {animated ? (
                  <motion.circle
                    r={radius}
                    cx="0"
                    cy="0"
                    stroke="white"
                    fill="transparent"
                    strokeWidth={radius / 5}
                    strokeDasharray={circumference}
                    transform="rotate(-90,0,0)"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                ) : (
                  <circle
                    r={radius}
                    cx="0"
                    cy="0"
                    stroke="white"
                    fill="transparent"
                    strokeWidth={radius / 5}
                    strokeDasharray={circumference}
                    transform="rotate(-90,0,0)"
                    strokeDashoffset={strokeDashoffset}
                  />
                )}
              </mask>
            </defs>

            {/* Center value text */}
            <text
              x="0"
              y="0"
              stroke="none"
              className="total"
              fontSize={valueFontSize}
                            textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
            >
              {displayValue}
            </text>

            {/* Background dashes circle */}
            <circle
              className="dashes-back"
              strokeWidth={radius / 5}
              r={radius}
              cx="0"
              cy="0"
              fill="none"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeDasharray={dashes}
            />

            {/* Colored tick marks (masked by progress) */}
            <g mask={`url(#${maskId})`}>
              <g transform="rotate(-90,0,0)">
                {ticks.map((tick, index) => (
                  <g key={index} transform={tick.transform}>
                    <rect
                      y={-tick.height / 2}
                      x={-tick.width}
                      width={tick.width}
                      height={tick.height}
                      fill={tick.fill}
                    />
                  </g>
                ))}
              </g>
            </g>

            {/* Target indicator */}
            <g transform={targetTransform}>
              {/* Target background circle */}
              <circle
                className="target-circle-bg"
                r={targetRadius}
                cx={-targetRadius / 2}
                cy={-targetRadius / 2}
                fill="rgba(0, 0, 0, 0.05)"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth={targetRadius / 10}
              />

              {/* Target filled circle (when target is met) */}
              {percent >= target && (
                <circle
                  className="target-circle"
                  r={targetRadius}
                  cx={-targetRadius / 2}
                  cy={-targetRadius / 2}
                  fill="transparent"
                  stroke={targetColor}
                  strokeWidth={targetRadius / 10}
                />
              )}

              {/* Target text */}
              <g transform={targetTextTransform}>
                <text
                  transform="translate(0, -4)"
                  className="target-label"
                  stroke="none"
                  textAnchor="middle"
                  fontSize={12}
                                    opacity={0.7}
                >
                  {targetLabel}
                </text>
                <text
                  transform="translate(0, 11)"
                  className="target-value"
                  stroke="none"
                  textAnchor="middle"
                  fontSize={14}
                                    fontWeight="bold"
                >
                  {target}%
                </text>
              </g>
            </g>
          </g>

          {/* Bottom label */}
          {showLabel && label && (
            <g transform={labelTransform}>
              <text
                className="gauge-label"
                x="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                stroke="none"
                                fontSize={14}
              >
                {label}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
