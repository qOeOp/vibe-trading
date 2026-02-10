/**
 * @fileoverview Linear Gauge Chart Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/gauge/linear-gauge.component.ts
 *
 * @description
 * Linear/horizontal gauge chart component showing a value on a horizontal bar.
 * Supports previous value indicator, value and units text display.
 * Uses Framer Motion for bar animations.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { scaleLinear } from 'd3-scale';
import { ColorScheme, ScaleType, ViewDimensions } from '../types';
import { ColorHelper, calculateViewDimensions } from '../utils';

export interface LinearGaugeProps {
  /** Fixed width (optional, defaults to container width) */
  width?: number;
  /** Fixed height (optional, defaults to container height) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Custom color mapping */
  colors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Minimum gauge value */
  min?: number;
  /** Maximum gauge value */
  max?: number;
  /** Current value */
  value?: number;
  /** Units label displayed below value */
  units?: string;
  /** Previous value for comparison indicator */
  previousValue?: number;
  /** Value formatting function */
  valueFormatting?: (value: number) => string;
  /** Enable/disable animations */
  animated?: boolean;
  /** Callback when gauge is clicked */
  onSelect?: (data: { name: string; value: number }) => void;
}

/**
 * Creates a rounded rectangle path
 */
function roundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): string {
  const r = Math.min(radius, width / 2, height / 2);

  return `
    M${x + r},${y}
    H${x + width - r}
    A${r},${r} 0 0 1 ${x + width},${y + r}
    V${y + height - r}
    A${r},${r} 0 0 1 ${x + width - r},${y + height}
    H${x + r}
    A${r},${r} 0 0 1 ${x},${y + height - r}
    V${y + r}
    A${r},${r} 0 0 1 ${x + r},${y}
    Z
  `;
}

/**
 * Linear gauge chart component
 */
export function LinearGauge({
  width = 400,
  height = 100,
  colorScheme = 'cool',
  colors,
  min: inputMin = 0,
  max: inputMax = 100,
  value = 0,
  units,
  previousValue,
  valueFormatting,
  animated = true,
  onSelect,
}: LinearGaugeProps) {
  const valueTextRef = useRef<SVGTextElement>(null);
  const unitsTextRef = useRef<SVGTextElement>(null);
  const [valueTextScale, setValueTextScale] = useState(1);
  const [unitsTextScale, setUnitsTextScale] = useState(1);

  const margin: [number, number, number, number] = useMemo(() => [10, 20, 10, 20], []);

  // Check if previous value exists
  const hasPreviousValue = previousValue !== undefined;

  // Calculate effective min/max
  const { min, max } = useMemo(() => {
    let effectiveMin = inputMin;
    let effectiveMax = inputMax;

    effectiveMax = Math.max(effectiveMax, value);
    effectiveMin = Math.min(effectiveMin, value);

    if (hasPreviousValue) {
      effectiveMax = Math.max(effectiveMax, previousValue);
      effectiveMin = Math.min(effectiveMin, previousValue);
    }

    return { min: effectiveMin, max: effectiveMax };
  }, [inputMin, inputMax, value, previousValue, hasPreviousValue]);

  // Calculate view dimensions
  const dims = useMemo((): ViewDimensions => {
    return calculateViewDimensions({
      width,
      height,
      margins: { top: margin[0], right: margin[1], bottom: margin[2], left: margin[3] },
    });
  }, [width, height, margin]);

  // Create value scale
  const valueScale = useMemo(() => {
    return scaleLinear().range([0, dims.width]).domain([min, max]);
  }, [dims.width, min, max]);

  // Create color helper
  const colorHelper = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: ScaleType.Ordinal,
      domain: [String(value)],
      customColors: colors,
    });
  }, [colorScheme, value, colors]);

  // Get fill color
  const fillColor = useMemo(() => {
    return colorHelper.getColor(units || 'value');
  }, [colorHelper, units]);

  // Calculate display value
  const displayValue = useMemo(() => {
    if (valueFormatting) {
      return valueFormatting(value);
    }
    return value.toLocaleString();
  }, [value, valueFormatting]);

  // Calculate bar dimensions
  const barY = dims.height / 2 + margin[0] - 2;
  const barHeight = 3;
  const valueBarWidth = valueScale(value);

  // Calculate transforms
  const transform = useMemo(() => {
    const xOffset = margin[3] + dims.width / 2;
    const yOffset = margin[0] + dims.height / 2;
    return `translate(${xOffset}, ${yOffset})`;
  }, [margin, dims]);

  const previousLineTransform = useMemo(() => {
    if (!hasPreviousValue) return '';
    const xOffset = margin[3] + valueScale(previousValue);
    const yOffset = margin[0] + dims.height / 2;
    return `translate(${xOffset}, ${yOffset})`;
  }, [hasPreviousValue, margin, valueScale, previousValue, dims]);

  // Scale text to fit
  useEffect(() => {
    const scaleTextElement = (
      ref: React.RefObject<SVGTextElement | null>,
      setScale: React.Dispatch<React.SetStateAction<number>>
    ) => {
      if (!ref.current) return;

      const bbox = ref.current.getBBox();
      if (bbox.width === 0 || bbox.height === 0) return;

      const availableWidth = dims.width;
      const availableHeight = Math.max(dims.height / 2 - 15, 0);

      const scaleWidth = Math.floor((availableWidth / bbox.width) * 100) / 100;
      const scaleHeight = Math.floor((availableHeight / bbox.height) * 100) / 100;

      setScale(Math.min(1, scaleWidth, scaleHeight));
    };

    const timeout = setTimeout(() => {
      scaleTextElement(valueTextRef, setValueTextScale);
      scaleTextElement(unitsTextRef, setUnitsTextScale);
    }, 50);

    return () => clearTimeout(timeout);
  }, [displayValue, units, dims]);

  // Click handler
  const handleClick = useCallback(() => {
    onSelect?.({
      name: 'Value',
      value,
    });
  }, [onSelect, value]);

  // Background bar path
  const backgroundPath = useMemo(() => {
    return roundedRect(margin[3], barY, dims.width, barHeight, 2);
  }, [margin, dims.width, barY, barHeight]);

  // Value bar path (for animation)
  const valueBarPath = useMemo(() => {
    return roundedRect(margin[3], barY, Math.max(0, valueBarWidth), barHeight, 2);
  }, [margin, barY, valueBarWidth, barHeight]);

  const initialValueBarPath = useMemo(() => {
    return roundedRect(margin[3], barY, 1, barHeight, 0);
  }, [margin, barY, barHeight]);

  return (
    <div
      className="ngx-charts-linear-gauge"
      style={{
        width,
        height,
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }} onClick={handleClick}>
        <g className="linear-gauge chart">
          {/* Background bar */}
          <path
            className="background-bar"
            d={backgroundPath}
            fill="rgba(0, 0, 0, 0.1)"
          />

          {/* Value bar */}
          {animated ? (
            <motion.path
              className="value-bar"
              fill={fillColor}
              initial={{ d: initialValueBarPath }}
              animate={{ d: valueBarPath }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ) : (
            <path className="value-bar" d={valueBarPath} fill={fillColor} />
          )}

          {/* Previous value indicator lines */}
          {hasPreviousValue && (
            <g transform={previousLineTransform}>
              <line x1="0" y1="5" x2="0" y2="15" stroke={fillColor} strokeWidth={2} />
              <line x1="0" y1="-5" x2="0" y2="-15" stroke={fillColor} strokeWidth={2} />
            </g>
          )}

          {/* Value and units text */}
          <g transform={transform}>
            {/* Value text */}
            <g transform="translate(0, -15)">
              <text
                ref={valueTextRef}
                className="value"
                style={{ textAnchor: 'middle' }}
                transform={`scale(${valueTextScale}, ${valueTextScale})`}
                alignmentBaseline="after-edge"
                fontSize={24}
                fontWeight="bold"
              >
                {displayValue}
              </text>
            </g>

            {/* Units text */}
            {units && (
              <g transform="translate(0, 15)">
                <text
                  ref={unitsTextRef}
                  className="units"
                  style={{ textAnchor: 'middle' }}
                  transform={`scale(${unitsTextScale}, ${unitsTextScale})`}
                  alignmentBaseline="before-edge"
                  fontSize={14}
                  opacity={0.7}
                >
                  {units}
                </text>
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
