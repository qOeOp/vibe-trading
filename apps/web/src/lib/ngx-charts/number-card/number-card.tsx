/**
 * @fileoverview NumberCard component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/number-card/number-card.component.ts
 *
 * @description
 * Number card chart for displaying KPI values in a grid.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useRef } from 'react';
import { scaleBand } from 'd3-scale';
import { DataItem, ColorScheme, ScaleType, ViewDimensions } from '../types';
import { ColorHelper, calculateViewDimensions } from '../utils';
import { BaseChart, useChartDimensions } from '../common';
import { CardSeries } from './card-series';
import { GridData, GridItem, CardModel } from './types';

export interface NumberCardProps {
  /** Chart data */
  data: DataItem[];
  /** Fixed width */
  width?: number;
  /** Fixed height */
  height?: number;
  /** Color scheme */
  colorScheme?: string | ColorScheme;
  /** Custom colors */
  colors?: Array<{ name: string; value: string }>;
  /** Card background color */
  cardColor?: string;
  /** Band color at bottom of cards */
  bandColor?: string;
  /** Empty card color */
  emptyColor?: string;
  /** Text color */
  textColor?: string;
  /** Inner padding between cards */
  innerPadding?: number;
  /** Enable animations */
  animated?: boolean;
  /** Value formatting function */
  valueFormatting?: (card: { label: string; data: GridData; value: number }) => string;
  /** Label formatting function */
  labelFormatting?: (card: { label: string; data: GridData; value: number }) => string;
  /** Designated total for percentage calculation */
  designatedTotal?: number;
  /** Selection callback */
  onSelect?: (data: GridData) => void;
  /** Custom class name */
  className?: string;
}

/**
 * Calculate grid size based on dimensions and item count
 */
function gridSize(dims: ViewDimensions, len: number, minWidth: number): [number, number] {
  let rows = 1;
  let cols = len;
  const width = dims.width;

  if (width > minWidth) {
    while (width / cols < minWidth) {
      rows += 1;
      cols = Math.ceil(len / rows);
    }
  }

  return [cols, rows];
}

/**
 * Calculate grid layout positions
 */
function gridLayout(
  dims: ViewDimensions,
  data: GridData[],
  minWidth: number,
  designatedTotal?: number
): GridItem[] {
  const xScale = scaleBand<number>();
  const yScale = scaleBand<number>();
  const width = dims.width;
  const height = dims.height;

  const [columns, rows] = gridSize(dims, data.length, minWidth);

  const xDomain: number[] = [];
  const yDomain: number[] = [];
  for (let i = 0; i < rows; i++) {
    yDomain.push(i);
  }
  for (let i = 0; i < columns; i++) {
    xDomain.push(i);
  }

  // NOTE: Angular passes 0.1 as second arg to rangeRound but d3 ignores it
  // Angular: xScale.rangeRound([0, width], 0.1) - the 0.1 is NOT padding, it's ignored
  // So Angular has NO padding, cards fill the entire space
  xScale.domain(xDomain).rangeRound([0, width]);
  yScale.domain(yDomain).rangeRound([0, height]);

  const res: GridItem[] = [];
  const total = designatedTotal ?? data.reduce((sum, d) => sum + (d?.value || 0), 0);
  const cardWidth = xScale.bandwidth();
  const cardHeight = yScale.bandwidth();

  for (let i = 0; i < data.length; i++) {
    res[i] = {
      data: {
        name: data[i]?.name || '',
        value: data[i]?.value,
        extra: data[i]?.extra,
        label: data[i]?.label || '',
        percent: total > 0 ? (data[i]?.value || 0) / total : 0,
        total,
      },
      x: xScale(i % columns) || 0,
      y: yScale(Math.floor(i / columns)) || 0,
      width: cardWidth,
      height: cardHeight,
    };
  }

  return res;
}

export function NumberCard({
  data,
  width: fixedWidth,
  height: fixedHeight,
  colorScheme = 'cool',
  colors: customColors,
  cardColor,
  bandColor,
  emptyColor = 'rgba(0, 0, 0, 0)',
  textColor,
  innerPadding = 15,
  animated = true,
  valueFormatting,
  labelFormatting,
  designatedTotal,
  onSelect,
  className = '',
}: NumberCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartDimensions(
    containerRef as React.RefObject<HTMLElement>,
    fixedWidth,
    fixedHeight
  );

  const margin = useMemo<[number, number, number, number]>(() => [10, 10, 10, 10], []);
  const minCardWidth = 150;

  // Calculate view dimensions
  const dims: ViewDimensions = useMemo(() => {
    return calculateViewDimensions({
      width,
      height,
      margins: margin,
    });
  }, [width, height, margin]);

  // Get domain
  const domain = useMemo(() => {
    return data.map((d) => d.label || d.name);
  }, [data]);

  // Create color helper
  const colorHelper = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: ScaleType.Ordinal,
      domain: domain.map(String),
      customColors,
    });
  }, [colorScheme, domain, customColors]);

  // Format data for grid layout
  const gridData = useMemo(() => {
    return data.map((d) => ({
      name: d.name,
      value: d.value as number,
      extra: d.extra,
      label: d.label || (d.name as string),
      percent: 0,
      total: 0,
    }));
  }, [data]);

  // Calculate grid layout
  const cardData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Calculate grid size
    const [cols, rows] = gridSize(dims, data.length, minCardWidth);
    const N = cols * rows;

    // Pad data to fill grid
    const paddedData = [...gridData];
    while (paddedData.length < N) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Empty grid padding cells require null value despite GridData typing value as number
      paddedData.push({ name: '', value: null as any, extra: undefined, label: '', percent: 0, total: 0 });
    }

    return gridLayout(dims, paddedData, minCardWidth, designatedTotal) as CardModel[];
  }, [data, dims, gridData, designatedTotal]);

  // Handle click
  const handleSelect = useCallback(
    (item: GridData) => {
      onSelect?.(item);
    },
    [onSelect]
  );

  const transform = `translate(${dims.xOffset || margin[3]}, ${margin[0]})`;

  return (
    <BaseChart
      ref={containerRef}
      width={fixedWidth}
      height={fixedHeight}
      animated={animated}
      className={`ngx-charts-number-card ${className}`}
    >
      <svg width={width} height={height} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}>
        <g transform={transform} className="number-card chart">
          <CardSeries
            data={cardData}
            dims={dims}
            colors={colorHelper}
            cardColor={cardColor}
            bandColor={bandColor}
            emptyColor={emptyColor}
            textColor={textColor}
            innerPadding={innerPadding}
            valueFormatting={valueFormatting}
            labelFormatting={labelFormatting}
            animated={animated}
            onSelect={handleSelect}
          />
        </g>
      </svg>
    </BaseChart>
  );
}
