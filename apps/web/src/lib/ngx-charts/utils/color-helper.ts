/**
 * @fileoverview Color helper for generating D3 color scales
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/color.helper.ts
 *
 * @description
 * Generates D3 color scales from color schemes.
 * Supports ordinal, linear, and quantile scale types.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

import { range } from 'd3-array';
import {
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scaleQuantile,
  ScaleLinear,
  ScaleOrdinal,
  ScaleQuantile,
} from 'd3-scale';

import { ColorScheme, Gradient, ScaleType, StringOrNumberOrDate } from '../types';
import { colorSets } from './color-sets';

type ColorScale =
  | ScaleQuantile<string, never>
  | ScaleOrdinal<string, string, never>
  | ScaleLinear<string, string, never>;

export interface ColorHelperConfig {
  scheme: string | ColorScheme;
  scaleType: ScaleType;
  domain: number[] | string[];
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
}

/**
 * Creates and manages color scales for charts
 */
export class ColorHelper {
  scale: ColorScale;
  scaleType: ScaleType;
  colorDomain: string[];
  domain: number[] | string[];
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;

  constructor(config: ColorHelperConfig) {
    const { scheme, scaleType, domain, customColors } = config;

    let resolvedScheme: ColorScheme;
    if (typeof scheme === 'string') {
      const found = colorSets.find((cs) => cs.name === scheme);
      if (!found) {
        throw new Error(`Color scheme "${scheme}" not found`);
      }
      resolvedScheme = found;
    } else {
      resolvedScheme = scheme;
    }

    this.colorDomain = resolvedScheme.domain;
    this.scaleType = scaleType;
    this.domain = domain;
    this.customColors = customColors;

    this.scale = this.generateColorScheme(resolvedScheme, scaleType, domain);
  }

  /**
   * Generates a D3 color scale based on scheme and type
   */
  private generateColorScheme(
    scheme: ColorScheme,
    type: ScaleType,
    domain: number[] | string[]
  ): ColorScale {
    switch (type) {
      case ScaleType.Quantile:
        return scaleQuantile<string>()
          .range(scheme.domain)
          .domain(domain as number[]);

      case ScaleType.Ordinal:
        return scaleOrdinal<string, string>()
          .range(scheme.domain)
          .domain(domain as string[]);

      case ScaleType.Linear: {
        const colorDomain = [...scheme.domain];
        if (colorDomain.length === 1) {
          colorDomain.push(colorDomain[0]);
          this.colorDomain = colorDomain;
        }

        const points = range(0, 1, 1.0 / colorDomain.length);
        return scaleLinear<string>()
          .range(colorDomain)
          .domain(points);
      }

      default:
        return scaleOrdinal<string, string>()
          .range(scheme.domain)
          .domain(domain as string[]);
    }
  }

  /**
   * Gets the color for a given value
   */
  getColor(value: StringOrNumberOrDate): string {
    if (value === undefined || value === null) {
      throw new Error('Value cannot be null or undefined');
    }

    if (this.scaleType === ScaleType.Linear) {
      const valueScale = scaleLinear<number>()
        .domain(this.domain as number[])
        .range([0, 1]);

      return (this.scale as ScaleLinear<string, string>)(valueScale(value as number));
    }

    // Check custom colors first
    if (typeof this.customColors === 'function') {
      return this.customColors(value);
    }

    const formattedValue = String(value).toLowerCase();
    if (Array.isArray(this.customColors) && this.customColors.length > 0) {
      const found = this.customColors.find(
        (mapping) => mapping.name.toLowerCase() === formattedValue
      );
      if (found) {
        return found.value;
      }
    }

    return (this.scale as ScaleOrdinal<string, string>)(String(value));
  }

  /**
   * Gets gradient stops for linear gradients
   */
  getLinearGradientStops(value: number | string, start?: number | string): Gradient[] {
    if (start === undefined) {
      start = this.domain[0];
    }

    const valueScale = scaleLinear<number>()
      .domain(this.domain as number[])
      .range([0, 1]);

    const colorValueScale = scaleBand<string>().domain(this.colorDomain).range([0, 1]);

    const endColor = this.getColor(value as StringOrNumberOrDate);

    // Generate the stops
    const startVal = valueScale(start as number);
    const startColor = this.getColor(start as StringOrNumberOrDate);

    const endVal = valueScale(value as number);
    let i = 1;
    let currentVal = startVal;
    const stops: Gradient[] = [];

    stops.push({
      color: startColor,
      offset: startVal,
      originalOffset: startVal,
      opacity: 1,
    });

    while (currentVal < endVal && i < this.colorDomain.length) {
      const color = this.colorDomain[i];
      const offset = colorValueScale(color) ?? 0;
      if (offset <= startVal) {
        i++;
        continue;
      }

      const bandwidth = colorValueScale.bandwidth();
      if (offset.toFixed(4) >= (endVal - bandwidth).toFixed(4)) {
        break;
      }

      stops.push({
        color,
        offset,
        opacity: 1,
      });
      currentVal = offset;
      i++;
    }

    if (stops[stops.length - 1].offset < 100) {
      stops.push({
        color: endColor,
        offset: endVal,
        opacity: 1,
      });
    }

    if (endVal === startVal) {
      stops[0].offset = 0;
      stops[1].offset = 100;
    } else {
      // Normalize the offsets into percentages
      if (stops[stops.length - 1].offset !== 100) {
        for (const s of stops) {
          s.offset = ((s.offset - startVal) / (endVal - startVal)) * 100;
        }
      }
    }

    return stops;
  }
}

/**
 * React hook for creating a color helper
 */
export function useColorHelper(config: ColorHelperConfig): ColorHelper {
  return new ColorHelper(config);
}
