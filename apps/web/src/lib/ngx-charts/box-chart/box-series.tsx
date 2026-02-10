/**
 * @fileoverview BoxSeries component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/box-chart/box-series.component.ts
 *
 * @description
 * Series of boxes in a box chart.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo } from 'react';
import type { ScaleBand, ScaleLinear } from 'd3-scale';
import { min, max, quantile } from 'd3-array';
import type { ViewDimensions} from '../types';
import { ScaleType } from '../types';
import type { ColorHelper} from '../utils';
import { escapeLabel, formatLabel } from '../utils';
import type { IBoxModel, IVector2D } from './box';
import { Box } from './box';

export interface BoxChartSeries {
  name: string | number | Date;
  series: Array<{ name: string | number | Date; value: number }>;
}

export interface BoxSeriesProps {
  dims: ViewDimensions;
  series: BoxChartSeries;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  colors: ColorHelper;
  strokeColor?: string;
  strokeWidth?: number;
  roundEdges?: boolean;
  gradient?: boolean;
  animated?: boolean;
  tooltipDisabled?: boolean;
  onSelect?: (data: IBoxModel) => void;
  onActivate?: (data: IBoxModel) => void;
  onDeactivate?: (data: IBoxModel) => void;
}

export function BoxSeries({
  series,
  xScale,
  yScale,
  colors,
  strokeColor = '#FFFFFF',
  strokeWidth = 2,
  roundEdges = true,
  gradient = false,
  animated = true,
  tooltipDisabled = false,
  onSelect,
  onActivate,
  onDeactivate,
}: BoxSeriesProps) {
  const box = useMemo((): IBoxModel | null => {
    if (!series || !series.series || series.series.length === 0) return null;

    const width = Math.round(xScale.bandwidth());
    const seriesName = series.name;
    const counts = series.series;

    const mappedCounts = counts.map((c) => Number(c.value));
    const whiskers: [number, number] = [min(mappedCounts) ?? 0, max(mappedCounts) ?? 0];

    const groupCounts = counts.map((item) => item.value).sort((a, b) => Number(a) - Number(b));
    const quartiles: [number, number, number] = [
      quantile(groupCounts, 0.25) ?? 0,
      quantile(groupCounts, 0.5) ?? 0,
      quantile(groupCounts, 0.75) ?? 0,
    ];

    const commonX = xScale(String(seriesName)) ?? 0;
    const offsetX = commonX + width / 2;

    const medianLineWidth = Math.max(width + 4 * strokeWidth, 1);
    const whiskerLineWidth = Math.max(width / 3, 1);

    const whiskerZero = yScale(whiskers[0]);
    const whiskerOne = yScale(whiskers[1]);
    const median = yScale(quartiles[1]);

    const lineCoordinates: [IVector2D, IVector2D, IVector2D, IVector2D] = [
      // Vertical line
      {
        v1: { x: offsetX, y: whiskerZero },
        v2: { x: offsetX, y: whiskerOne },
      },
      // Top whisker
      {
        v1: { x: offsetX + whiskerLineWidth / 2, y: whiskerZero },
        v2: { x: offsetX - whiskerLineWidth / 2, y: whiskerZero },
      },
      // Median line
      {
        v1: { x: offsetX + medianLineWidth / 2, y: median },
        v2: { x: offsetX - medianLineWidth / 2, y: median },
      },
      // Bottom whisker
      {
        v1: { x: offsetX + whiskerLineWidth / 2, y: whiskerOne },
        v2: { x: offsetX - whiskerLineWidth / 2, y: whiskerOne },
      },
    ];

    const value = quartiles[1];
    const formattedLabel = formatLabel(seriesName);

    const boxModel: IBoxModel = {
      value,
      data: counts,
      label: seriesName,
      formattedLabel,
      width,
      height: Math.abs(yScale(quartiles[0]) - yScale(quartiles[2])),
      x: xScale(String(seriesName)) ?? 0,
      y: yScale(quartiles[2]),
      roundEdges,
      quartiles,
      lineCoordinates,
      ariaLabel: `${formattedLabel} - Median: ${value.toLocaleString()}`,
    };

    if (colors.scaleType === ScaleType.Ordinal) {
      boxModel.color = colors.getColor(seriesName);
    } else {
      boxModel.color = colors.getColor(quartiles[1]);
      boxModel.gradientStops = colors.getLinearGradientStops(quartiles[0], quartiles[2]);
    }

    if (!tooltipDisabled) {
      boxModel.tooltipText = `
        <span class="tooltip-label">${escapeLabel(formattedLabel)}</span>
        <span class="tooltip-val">
          • Q1: ${quartiles[0]} • Q2: ${quartiles[1]} • Q3: ${quartiles[2]}<br>
          • Min: ${whiskers[0]} • Max: ${whiskers[1]}
        </span>
      `;
    }

    return boxModel;
  }, [series, xScale, yScale, colors, strokeWidth, roundEdges, tooltipDisabled]);

  if (!box) return null;

  return (
    <g>
      <Box
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        fill={box.color || '#000'}
        data={box}
        width={box.width}
        height={box.height}
        x={box.x}
        y={box.y}
        lineCoordinates={box.lineCoordinates}
        roundEdges={box.roundEdges}
        gradient={gradient}
        gradientStops={box.gradientStops}
        animated={animated}
        ariaLabel={box.ariaLabel}
        onSelect={onSelect}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
      />
      {!tooltipDisabled && box.tooltipText && (
        <title dangerouslySetInnerHTML={{ __html: box.tooltipText }} />
      )}
    </g>
  );
}
