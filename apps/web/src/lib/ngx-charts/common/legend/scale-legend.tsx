/**
 * @fileoverview Scale Legend Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/legend/scale-legend.component.ts
 *
 * @description
 * Scale legend component that displays a color gradient with min/max labels.
 * Used for continuous color scales (e.g., heat maps, choropleth).
 * Supports horizontal and vertical orientations.
 * Migrated from Angular ngx-charts library to React.
 *
 * @license MIT
 */

'use client';

import { useMemo } from 'react';

/** Color scale interface with range and domain methods */
export interface ColorScale {
  range(): string[];
  domain(): number[];
}

export interface ScaleLegendProps {
  /** Value range [min, max] to display */
  valueRange: [number, number];
  /** Color scale object with range() and domain() methods */
  colors: ColorScale;
  /** Height of the legend (used in vertical mode) */
  height?: number;
  /** Width of the legend container */
  width?: number;
  /** Whether to display the legend horizontally */
  horizontal?: boolean;
}

/**
 * Generates the CSS gradient string from colors and splits
 */
function gradientString(colors: string[], splits: number[]): string {
  // Add the 100% endpoint
  const allSplits = [...splits, 1];
  const pairs: string[] = [];

  // Reverse colors for proper gradient direction
  const reversedColors = [...colors].reverse();

  reversedColors.forEach((color, index) => {
    pairs.push(`${color} ${Math.round(allSplits[index] * 100)}%`);
  });

  return pairs.join(', ');
}

/**
 * Scale legend component for continuous color scales
 */
export function ScaleLegend({
  valueRange,
  colors,
  height,
  width,
  horizontal = false,
}: ScaleLegendProps) {
  // Generate the gradient CSS
  const gradient = useMemo(() => {
    const colorRange = colors.range();
    const colorDomain = colors.domain();
    const gradientValues = gradientString(colorRange, colorDomain);
    const direction = horizontal ? 'right' : 'bottom';
    return `linear-gradient(to ${direction}, ${gradientValues})`;
  }, [colors, horizontal]);

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: 0,
    width: width ?? 'auto',
  };

  const legendStyle: React.CSSProperties = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: horizontal ? 'row' : 'column',
    height: !horizontal && height ? height : undefined,
    width: width ?? undefined,
  };

  const gradientBarStyle: React.CSSProperties = {
    display: 'inline-block',
    flex: 1,
    width: horizontal ? 'auto' : '30px',
    height: horizontal ? '30px' : undefined,
    borderRadius: '5px',
    margin: horizontal ? '0 16px' : '0 auto',
    background: gradient,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
  };

  return (
    <div className="chart-legend" style={containerStyle}>
      <div
        className={`scale-legend ${horizontal ? 'horizontal-legend' : ''}`}
        style={legendStyle}
      >
        {/* Max Value Label */}
        <div className="scale-legend-label" style={labelStyle}>
          <span>{valueRange[1].toLocaleString()}</span>
        </div>

        {/* Gradient Bar */}
        <div className="scale-legend-wrap" style={gradientBarStyle} />

        {/* Min Value Label */}
        <div className="scale-legend-label" style={labelStyle}>
          <span>{valueRange[0].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
