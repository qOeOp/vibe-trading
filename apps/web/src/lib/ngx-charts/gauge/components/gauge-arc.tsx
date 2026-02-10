/**
 * @fileoverview Gauge Arc Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/gauge/gauge-arc.component.ts
 *
 * @description
 * Individual gauge arc segment component with background and value arcs.
 * Uses D3 arc generator for path creation and Framer Motion for animations.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useId } from 'react';
import { motion } from 'framer-motion';
import { arc as d3Arc } from 'd3-shape';
import type { DataItem } from '../../types';
import { ColorHelper } from '../../utils';

/** Arc item structure */
export interface ArcItem {
  data: {
    name: string;
    value: number;
  };
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}

export interface GaugeArcProps {
  /** Background arc configuration */
  backgroundArc: ArcItem;
  /** Value arc configuration */
  valueArc: ArcItem;
  /** Corner radius for rounded edges */
  cornerRadius?: number;
  /** ColorHelper instance for color mapping */
  colors: ColorHelper;
  /** Whether this arc is active/highlighted */
  isActive?: boolean;
  /** Disable tooltips */
  tooltipDisabled?: boolean;
  /** Value formatting function */
  valueFormatting?: (value: number) => string;
  /** Enable animations */
  animated?: boolean;
  /** Callback when arc is selected */
  onSelect?: (data: DataItem) => void;
  /** Callback when arc is activated (hovered) */
  onActivate?: (data: DataItem) => void;
  /** Callback when arc is deactivated */
  onDeactivate?: (data: DataItem) => void;
}

/**
 * Formats a label for display
 */
function formatLabel(label: unknown): string {
  if (label instanceof Date) {
    return label.toLocaleDateString();
  }
  if (label === null || label === undefined) {
    return '';
  }
  return String(label);
}

/**
 * Gauge arc component with background and value arcs
 */
export function GaugeArc({
  backgroundArc,
  valueArc,
  cornerRadius = 10,
  colors,
  isActive = false,
  tooltipDisabled = false,
  valueFormatting,
  animated = true,
  onSelect,
  onActivate,
  onDeactivate,
}: GaugeArcProps) {
  const tooltipId = useId();

  // Generate background arc path
  const backgroundPath = useMemo(() => {
    const arcGenerator = d3Arc()
      .innerRadius(backgroundArc.innerRadius)
      .outerRadius(backgroundArc.outerRadius)
      .startAngle(0)
      .endAngle(backgroundArc.endAngle)
      .cornerRadius(cornerRadius);

    return arcGenerator({
      innerRadius: backgroundArc.innerRadius,
      outerRadius: backgroundArc.outerRadius,
      startAngle: 0,
      endAngle: backgroundArc.endAngle,
    }) || '';
  }, [backgroundArc, cornerRadius]);

  // Generate value arc path
  const { valuePath, initialValuePath } = useMemo(() => {
    const arcGenerator = d3Arc()
      .innerRadius(valueArc.innerRadius)
      .outerRadius(valueArc.outerRadius)
      .startAngle(0)
      .cornerRadius(cornerRadius);

    const vPath = arcGenerator({
      innerRadius: valueArc.innerRadius,
      outerRadius: valueArc.outerRadius,
      startAngle: 0,
      endAngle: valueArc.endAngle,
    }) || '';

    const initPath = arcGenerator({
      innerRadius: valueArc.innerRadius,
      outerRadius: valueArc.outerRadius,
      startAngle: 0,
      endAngle: 0.001, // Small angle for initial state
    }) || '';

    return { valuePath: vPath, initialValuePath: initPath };
  }, [valueArc, cornerRadius]);

  // Get fill color for value arc
  const fillColor = useMemo(() => {
    return colors.getColor(valueArc.data.name);
  }, [colors, valueArc.data.name]);

  // Generate tooltip text
  const tooltipText = useMemo(() => {
    if (tooltipDisabled) return '';

    const label = formatLabel(valueArc.data.name);
    const value = valueFormatting
      ? valueFormatting(valueArc.data.value)
      : formatLabel(valueArc.data.value);

    return `${label}: ${value}`;
  }, [tooltipDisabled, valueArc.data, valueFormatting]);

  // Event handlers
  const handleClick = useCallback(() => {
    onSelect?.({
      name: valueArc.data.name,
      value: valueArc.data.value,
    });
  }, [valueArc.data, onSelect]);

  const handleMouseEnter = useCallback(() => {
    onActivate?.({
      name: valueArc.data.name,
      value: valueArc.data.value,
    });
  }, [valueArc.data, onActivate]);

  const handleMouseLeave = useCallback(() => {
    onDeactivate?.({
      name: valueArc.data.name,
      value: valueArc.data.value,
    });
  }, [valueArc.data, onDeactivate]);

  return (
    <g className="gauge-arc-group">
      {/* Background arc */}
      <path
        className="background-arc"
        d={backgroundPath}
        fill="rgba(0, 0, 0, 0.1)"
        style={{ pointerEvents: 'none' }}
      />

      {/* Value arc */}
      {animated ? (
        <motion.path
          className={`value-arc ${isActive ? 'active' : ''}`}
          fill={fillColor}
          initial={{ d: initialValuePath }}
          animate={{ d: valuePath }}
          transition={{
            duration: 0.75,
            ease: 'easeOut',
          }}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: 'pointer',
            opacity: isActive ? 1 : 0.9,
            filter: isActive ? 'brightness(1.1)' : 'none',
            transition: 'opacity 0.2s, filter 0.2s',
          }}
          aria-label={tooltipText}
          data-tooltip-id={!tooltipDisabled ? tooltipId : undefined}
        />
      ) : (
        <path
          className={`value-arc ${isActive ? 'active' : ''}`}
          d={valuePath}
          fill={fillColor}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: 'pointer',
            opacity: isActive ? 1 : 0.9,
            filter: isActive ? 'brightness(1.1)' : 'none',
            transition: 'opacity 0.2s, filter 0.2s',
          }}
          aria-label={tooltipText}
        />
      )}
    </g>
  );
}
