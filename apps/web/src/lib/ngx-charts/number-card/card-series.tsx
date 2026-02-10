/**
 * @fileoverview CardSeries component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/number-card/card-series.component.ts
 *
 * @description
 * Series of cards in a number card chart.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback } from 'react';
import { ViewDimensions } from '../types';
import { ColorHelper } from '../utils';
import { Card, invertColor } from './card';
import { GridData, CardModel } from './types';

export interface CardSeriesProps {
  data: CardModel[];
  dims: ViewDimensions;
  colors: ColorHelper;
  innerPadding?: number | [number, number, number, number];
  cardColor?: string;
  bandColor?: string;
  emptyColor?: string;
  textColor?: string;
  valueFormatting?: (card: { label: string; data: GridData; value: number }) => string;
  labelFormatting?: (card: { label: string; data: GridData; value: number }) => string;
  animated?: boolean;
  onSelect?: (data: GridData) => void;
}

export function CardSeries({
  data,
  dims,
  colors,
  innerPadding = 15,
  cardColor,
  bandColor,
  emptyColor = 'rgba(0, 0, 0, 0)',
  textColor,
  valueFormatting,
  labelFormatting,
  animated = true,
  onSelect,
}: CardSeriesProps) {
  const medianSize = useMemo(() => {
    if (data.length <= 2) return undefined;

    const formatValue = valueFormatting || ((card: { value: number }) => card.value?.toLocaleString() || '');

    const sortedLengths = data
      .map((d) => {
        const hasValue = d && d.data && typeof d.data.value !== 'undefined' && d.data.value !== null;
        return hasValue
          ? formatValue({
              data: d.data,
              label: d.data?.name?.toString() || '',
              value: d.data?.value,
            }).length
          : 0;
      })
      .sort((a, b) => b - a);

    const idx = Math.ceil(data.length / 2);
    return sortedLengths[idx];
  }, [data, valueFormatting]);

  const getPadding = useCallback(() => {
    if (typeof innerPadding === 'number') {
      return { x: innerPadding, y: innerPadding };
    }
    return {
      x: innerPadding[1] + innerPadding[3],
      y: innerPadding[0] + innerPadding[2],
    };
  }, [innerPadding]);

  const cards = useMemo(() => {
    const { x: xPadding, y: yPadding } = getPadding();

    return data.map((d, index) => {
      let label = d.data?.name as any;
      if (label && label.constructor?.name === 'Date') {
        label = label.toLocaleDateString();
      } else {
        label = label ? label.toLocaleString() : label;
      }

      const value = d.data?.value;
      const valueColor = label ? colors.getColor(label) : emptyColor;
      const color = cardColor || valueColor || '#000';

      return {
        x: d.x,
        y: d.y,
        width: d.width - xPadding,
        height: d.height - yPadding,
        color,
        bandColor: bandColor || valueColor,
        textColor: textColor || invertColor(color),
        label,
        data: d.data,
        tooltipText: `${label}: ${value}`,
      };
    });
  }, [data, colors, cardColor, bandColor, textColor, emptyColor, getPadding]);

  const filledCards = cards.filter((d) => d.data?.value !== null && d.data?.value !== undefined);
  const emptySlots = cards.filter((d) => d.data?.value === null || d.data?.value === undefined);

  return (
    <g className="card-series">
      {emptySlots.map((c, index) => (
        <rect
          key={`empty-${index}`}
          className="card-empty"
          x={c.x}
          y={c.y}
          fill={emptyColor}
          width={c.width}
          height={c.height}
          rx={3}
          ry={3}
        />
      ))}

      {filledCards.map((c, index) => (
        <Card
          key={`card-${index}-${c.label}`}
          x={c.x}
          y={c.y}
          width={c.width}
          height={c.height}
          color={c.color}
          bandColor={c.bandColor}
          textColor={c.textColor}
          data={c.data}
          label={c.label}
          medianSize={medianSize}
          valueFormatting={valueFormatting}
          labelFormatting={labelFormatting}
          animated={animated}
          onSelect={onSelect}
        />
      ))}
    </g>
  );
}
