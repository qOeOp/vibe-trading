/**
 * @fileoverview Gauge Chart Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/gauge/gauge.component.ts
 *
 * @description
 * Radial gauge chart component with multiple arc segments.
 * Supports axis display, legend, and customizable angle spans.
 * Uses D3 arc generator for path creation and Framer Motion for animations.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import type {
  DataItem,
  ColorScheme,
  ViewDimensions} from '../types';
import {
  ScaleType,
  LegendPosition
} from '../types';
import { ColorHelper, calculateViewDimensions } from '../utils';
import { Legend } from '../common';
import { GaugeArc, GaugeAxis } from './components';
import { useGauge } from './hooks';

export interface GaugeProps {
  /** Chart data array */
  data: DataItem[];
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
  /** Units label displayed below value */
  units?: string;
  /** Custom text value to display */
  textValue?: string;
  /** Number of major axis segments */
  bigSegments?: number;
  /** Number of minor axis segments between major ticks */
  smallSegments?: number;
  /** Show axis with tick marks */
  showAxis?: boolean;
  /** Start angle in degrees */
  startAngle?: number;
  /** Angle span in degrees (max 360) */
  angleSpan?: number;
  /** Show value text in center */
  showText?: boolean;
  /** Value formatting function */
  valueFormatting?: (value: number) => string;
  /** Axis tick formatting function */
  axisTickFormatting?: (value: number) => string;
  /** Show legend */
  legend?: boolean;
  /** Legend title */
  legendTitle?: string;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Currently active entries */
  activeEntries?: DataItem[];
  /** Enable/disable animations */
  animated?: boolean;
  /** Disable tooltips */
  tooltipDisabled?: boolean;
  /** Custom margins [top, right, bottom, left] */
  margin?: [number, number, number, number];
  /** Callback when data is selected */
  onSelect?: (data: DataItem) => void;
  /** Callback when data is activated (hovered) */
  onActivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Callback when data is deactivated */
  onDeactivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
}

/**
 * Radial gauge chart component
 */
export function Gauge({
  data,
  width = 400,
  height = 300,
  colorScheme = 'cool',
  colors,
  min = 0,
  max = 100,
  units,
  textValue,
  bigSegments = 10,
  smallSegments = 5,
  showAxis = true,
  startAngle: inputStartAngle = -120,
  angleSpan: inputAngleSpan = 240,
  showText = true,
  valueFormatting,
  axisTickFormatting,
  legend = false,
  legendTitle = 'Legend',
  legendPosition = LegendPosition.Right,
  activeEntries: externalActiveEntries,
  animated = true,
  tooltipDisabled = false,
  margin: inputMargin,
  onSelect,
  onActivate,
  onDeactivate,
}: GaugeProps) {
  const textRef = useRef<SVGTextElement>(null);
  const [textScale, setTextScale] = useState(1);
  const [internalActiveEntries, setInternalActiveEntries] = useState<DataItem[]>([]);

  const activeEntries = externalActiveEntries ?? internalActiveEntries;

  // Normalize start angle to positive
  const startAngle = useMemo(() => {
    let angle = inputStartAngle;
    if (angle < 0) {
      angle = (angle % 360) + 360;
    }
    return angle;
  }, [inputStartAngle]);

  // Clamp angle span to max 360
  const angleSpan = useMemo(() => {
    return Math.min(inputAngleSpan, 360);
  }, [inputAngleSpan]);

  // Calculate margins
  const margin = useMemo((): [number, number, number, number] => {
    if (inputMargin) {
      return inputMargin;
    }
    if (!showAxis) {
      return [10, 20, 10, 20];
    }
    return [60, 100, 60, 100];
  }, [inputMargin, showAxis]);

  // Calculate view dimensions
  const dims = useMemo((): ViewDimensions => {
    return calculateViewDimensions({
      width,
      height,
      margins: margin,
      showLegend: legend,
      legendPosition,
    });
  }, [width, height, margin, legend, legendPosition]);

  // Calculate outer radius
  const outerRadius = useMemo(() => {
    return Math.min(dims.width, dims.height) / 2;
  }, [dims.width, dims.height]);

  // Use gauge hook for calculations
  const {
    arcs,
    domain,
    valueScale,
    displayValue,
    textRadius,
    cornerRadius,
    effectiveMin,
    effectiveMax,
  } = useGauge({
    data,
    min,
    max,
    startAngle,
    angleSpan,
    outerRadius,
    textValue,
    valueFormatting,
  });

  // Create color helper
  const colorHelper = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: ScaleType.Ordinal,
      domain,
      customColors: colors,
    });
  }, [colorScheme, domain, colors]);

  // Calculate transforms
  const transform = useMemo(() => {
    const xOffset = margin[3] + dims.width / 2;
    const yOffset = margin[0] + dims.height / 2;
    return `translate(${xOffset}, ${yOffset})`;
  }, [margin, dims]);

  const rotation = useMemo(() => {
    return `rotate(${startAngle})`;
  }, [startAngle]);

  // Scale text to fit within available radius
  useEffect(() => {
    if (!showText || !textRef.current) return;

    const measureAndScale = () => {
      const bbox = textRef.current?.getBBox();
      if (!bbox || bbox.width === 0) return;

      const availableSpace = textRadius * 2;
      const scale = Math.min(1, availableSpace / bbox.width);
      setTextScale(Math.floor(scale * 100) / 100);
    };

    // Initial measurement
    const timeout = setTimeout(measureAndScale, 50);

    return () => clearTimeout(timeout);
  }, [showText, textRadius, displayValue, units]);

  // Check if an entry is active
  const isActive = useCallback(
    (name: string): boolean => {
      if (!activeEntries || activeEntries.length === 0) {
        return false;
      }
      return activeEntries.some(
        (entry) => entry.name === name
      );
    },
    [activeEntries]
  );

  // Event handlers
  const handleSelect = useCallback(
    (item: DataItem) => {
      onSelect?.(item);
    },
    [onSelect]
  );

  const handleActivate = useCallback(
    (item: DataItem) => {
      const idx = activeEntries.findIndex(
        (d) => d.name === item.name && d.value === item.value
      );
      if (idx > -1) return;

      const newEntries = [item, ...activeEntries];
      setInternalActiveEntries(newEntries);
      onActivate?.({ value: item, entries: newEntries });
    },
    [activeEntries, onActivate]
  );

  const handleDeactivate = useCallback(
    (item: DataItem) => {
      const idx = activeEntries.findIndex(
        (d) => d.name === item.name && d.value === item.value
      );
      if (idx === -1) return;

      const newEntries = [...activeEntries];
      newEntries.splice(idx, 1);
      setInternalActiveEntries(newEntries);
      onDeactivate?.({ value: item, entries: newEntries });
    },
    [activeEntries, onDeactivate]
  );

  const handleLegendClick = useCallback(
    (label: string) => {
      const item = data.find((d) => String(d.name) === label);
      if (item) {
        handleSelect(item);
      }
    },
    [data, handleSelect]
  );

  const handleLegendActivate = useCallback(
    (item: { name: string }) => {
      const dataItem = data.find((d) => String(d.name) === item.name);
      if (dataItem) {
        handleActivate(dataItem);
      }
    },
    [data, handleActivate]
  );

  const handleLegendDeactivate = useCallback(
    (item: { name: string }) => {
      const dataItem = data.find((d) => String(d.name) === item.name);
      if (dataItem) {
        handleDeactivate(dataItem);
      }
    },
    [data, handleDeactivate]
  );

  return (
    <div
      className="ngx-charts-gauge"
      style={{
        width: width,
        height: height,
        display: 'flex',
      }}
    >
      <svg
        width={legend && legendPosition === LegendPosition.Right ? width * 0.8 : width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="ngx-charts"
        style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}
      >
        <g className="gauge chart" transform={transform}>
          {/* Arcs */}
          {arcs.map((arc, index) => (
            <g key={`arc-${index}`} transform={rotation}>
              <GaugeArc
                backgroundArc={arc.backgroundArc}
                valueArc={arc.valueArc}
                cornerRadius={cornerRadius}
                colors={colorHelper}
                isActive={isActive(arc.valueArc.data.name)}
                tooltipDisabled={tooltipDisabled}
                valueFormatting={valueFormatting}
                animated={animated}
                onSelect={handleSelect}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            </g>
          ))}

          {/* Axis */}
          {showAxis && (
            <GaugeAxis
              bigSegments={bigSegments}
              smallSegments={smallSegments}
              min={effectiveMin}
              max={effectiveMax}
              radius={outerRadius}
              angleSpan={angleSpan}
              startAngle={startAngle}
              valueScale={valueScale}
              tickFormatting={axisTickFormatting}
            />
          )}

          {/* Center text */}
          {showText && (
            <text
              ref={textRef}
              style={{ textAnchor: 'middle' }}
              transform={`scale(${textScale}, ${textScale})`}
              alignmentBaseline="central"
            >
              <tspan x="0" dy="0" fontSize={24} fontWeight="bold">
                {displayValue}
              </tspan>
              {units && (
                <tspan x="0" dy="1.2em" fontSize={14} opacity={0.7}>
                  {units}
                </tspan>
              )}
            </text>
          )}
        </g>
      </svg>

      {/* Legend */}
      {legend && (
        <Legend
          data={domain}
          title={legendTitle}
          colors={colorHelper}
          height={height}
          width={width * 0.2}
          activeEntries={activeEntries.map((e) => ({ name: String(e.name) }))}
          horizontal={legendPosition === LegendPosition.Below}
          onLabelClick={handleLegendClick}
          onLabelActivate={handleLegendActivate}
          onLabelDeactivate={handleLegendDeactivate}
        />
      )}
    </div>
  );
}
