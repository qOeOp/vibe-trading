/**
 * @fileoverview Gauge chart hook
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/gauge/gauge.component.ts
 *
 * @description
 * Custom hook for managing gauge chart state and calculations.
 * Handles arc generation, scales, and value calculations.
 *
 * @license MIT
 */

import { useMemo } from 'react';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import type { DataItem } from '../../types';
import type { ArcItem } from '../components/gauge-arc';

/** Arcs configuration for a single gauge segment */
export interface GaugeArcs {
  backgroundArc: ArcItem;
  valueArc: ArcItem;
}

export interface UseGaugeConfig {
  /** Chart data */
  data: DataItem[];
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Start angle in degrees */
  startAngle: number;
  /** Angle span in degrees */
  angleSpan: number;
  /** Outer radius of the gauge */
  outerRadius: number;
  /** Custom text value to display */
  textValue?: string;
  /** Value formatting function */
  valueFormatting?: (value: number) => string;
}

export interface UseGaugeResult {
  /** Array of arc configurations */
  arcs: GaugeArcs[];
  /** Domain for legend */
  domain: string[];
  /** Value domain [min, max] */
  valueDomain: [number, number];
  /** Value scale function */
  valueScale: ScaleLinear<number, number>;
  /** Display value text */
  displayValue: string;
  /** Text radius (max available for text) */
  textRadius: number;
  /** Calculated corner radius */
  cornerRadius: number;
  /** Effective min value */
  effectiveMin: number;
  /** Effective max value */
  effectiveMax: number;
}

/**
 * Hook for gauge chart calculations
 */
export function useGauge({
  data,
  min: inputMin,
  max: inputMax,
  startAngle,
  angleSpan,
  outerRadius,
  textValue,
  valueFormatting,
}: UseGaugeConfig): UseGaugeResult {
  // Calculate effective min/max from data
  const { effectiveMin, effectiveMax, valueDomain } = useMemo(() => {
    const values = data.map((d) => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);

    const effMin = Math.min(inputMin, dataMin);
    const effMax = Math.max(inputMax, dataMax);

    return {
      effectiveMin: effMin,
      effectiveMax: effMax,
      valueDomain: [effMin, effMax] as [number, number],
    };
  }, [data, inputMin, inputMax]);

  // Create value scale
  const valueScale = useMemo((): ScaleLinear<number, number> => {
    return scaleLinear<number, number>().range([0, angleSpan]).nice().domain(valueDomain);
  }, [angleSpan, valueDomain]);

  // Get domain for colors/legend
  const domain = useMemo(() => {
    return data.map((d) => String(d.name));
  }, [data]);

  // Generate arcs
  const { arcs, textRadius, cornerRadius } = useMemo(() => {
    const arcsList: GaugeArcs[] = [];
    const availableRadius = outerRadius * 0.7;
    const radiusPerArc = Math.min(availableRadius / data.length, 10);
    const arcWidth = radiusPerArc * 0.7;
    const calculatedTextRadius = outerRadius - data.length * radiusPerArc;
    const calculatedCornerRadius = Math.floor(arcWidth / 2);

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const arcOuterRadius = outerRadius - i * radiusPerArc;
      const arcInnerRadius = arcOuterRadius - arcWidth;

      const backgroundArc: ArcItem = {
        endAngle: (angleSpan * Math.PI) / 180,
        innerRadius: arcInnerRadius,
        outerRadius: arcOuterRadius,
        data: {
          value: effectiveMax,
          name: String(d.name),
        },
      };

      const valueAngle = Math.min(valueScale(d.value), angleSpan);
      const valueArc: ArcItem = {
        endAngle: (valueAngle * Math.PI) / 180,
        innerRadius: arcInnerRadius,
        outerRadius: arcOuterRadius,
        data: {
          value: d.value,
          name: String(d.name),
        },
      };

      arcsList.push({
        backgroundArc,
        valueArc,
      });
    }

    return {
      arcs: arcsList,
      textRadius: calculatedTextRadius,
      cornerRadius: calculatedCornerRadius,
    };
  }, [data, outerRadius, angleSpan, effectiveMax, valueScale]);

  // Calculate display value
  const displayValue = useMemo(() => {
    const totalValue = data.reduce((acc, d) => acc + d.value, 0);

    if (textValue && textValue.length > 0) {
      return textValue;
    }

    if (valueFormatting) {
      return valueFormatting(totalValue);
    }

    return totalValue.toLocaleString();
  }, [data, textValue, valueFormatting]);

  return {
    arcs,
    domain,
    valueDomain,
    valueScale,
    displayValue,
    textRadius,
    cornerRadius,
    effectiveMin,
    effectiveMax,
  };
}
