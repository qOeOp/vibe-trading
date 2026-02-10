'use client';

/**
 * @fileoverview Heat map chart component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/heat-map/heat-map.component.ts
 *
 * @description
 * Heat map chart component that displays data as a matrix of colored cells.
 * The color intensity represents the value magnitude.
 * Supports axes, legends, tooltips, and gradient fills.
 *
 * @license MIT
 */

import { useState, useMemo, useCallback, memo, type ReactNode } from 'react';
import { scaleBand } from 'd3-scale';
import type { ScaleBand } from 'd3-scale';
import { BaseChart, XAxis, YAxis, Legend, ScaleLegend } from '../common';
import { ColorHelper, calculateViewDimensions, getScaleType } from '../utils';
import { HeatMapCellSeries } from './heat-map-cell-series';
import type {
  Series,
  DataItem,
  ScaleType,
  LegendPosition,
  ColorScheme,
  StringOrNumberOrDate,
} from '../types';
import { ScaleType as ScaleTypeEnum } from '../types';

/** Rect item for background grid */
interface RectItem {
  fill: string;
  height: number;
  rx: number;
  width: number;
  x: number;
  y: number;
}

/** Axis configuration */
interface AxisConfig {
  visible?: boolean;
  label?: string;
  showLabel?: boolean;
  showGridLines?: boolean;
  trimTicks?: boolean;
  rotateTicks?: boolean;
  maxTickLength?: number;
  tickFormatting?: (value: unknown) => string;
  ticks?: unknown[];
  wrapTicks?: boolean;
}

/** Tooltip configuration */
interface TooltipConfig {
  disabled?: boolean;
  template?: ReactNode;
  text?: (cell: { label: string; data: number; series: string }) => string;
}

export interface HeatMapProps {
  /** Heat map data (array of series with name and series array) */
  data: Series[];
  /** Fixed width (optional, defaults to container width) */
  width?: number;
  /** Fixed height (optional, defaults to container height) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Custom color mapping */
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Enable/disable animations */
  animated?: boolean;
  /** Show legend */
  legend?: boolean;
  /** Legend title */
  legendTitle?: string;
  /** Legend position */
  legendPosition?: LegendPosition | 'right' | 'below';
  /** X-axis configuration */
  xAxis?: AxisConfig;
  /** Y-axis configuration */
  yAxis?: AxisConfig;
  /** Tooltip configuration */
  tooltip?: TooltipConfig;
  /** Enable gradient fills for cells */
  gradient?: boolean;
  /** Inner padding between cells (number, string with px/%, or array) */
  innerPadding?: number | string | (number | string)[];
  /** Minimum value for color scale */
  min?: number;
  /** Maximum value for color scale */
  max?: number;
  /** Currently active entries */
  activeEntries?: DataItem[];
  /** Callback when cell is selected */
  onSelect?: (data: DataItem) => void;
  /** Callback when cell is activated */
  onActivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Callback when cell is deactivated */
  onDeactivate?: (event: { value: DataItem; entries: DataItem[] }) => void;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Converts the input to gap paddingInner in fraction.
 * Supports various formats: numbers, strings ("8", "8px", "8%"),
 * arrays, and mixed formats.
 */
function getDimension(
  value: string | number | (string | number)[],
  index: number = 0,
  N: number,
  L: number
): number {
  let processedValue = value;

  if (typeof processedValue === 'string') {
    processedValue = processedValue
      .replace('[', '')
      .replace(']', '')
      .replace('px', '')
      .replace("'", '');

    if (processedValue.includes(',')) {
      processedValue = processedValue.split(',');
    }
  }

  if (Array.isArray(processedValue) && typeof index === 'number') {
    const arrValue = processedValue[index];
    return getDimension(arrValue, 0, N, L);
  }

  if (typeof processedValue === 'string' && processedValue.includes('%')) {
    return +processedValue.replace('%', '') / 100;
  }

  return N / (L / +processedValue + 1);
}

interface HeatMapInnerProps extends Omit<HeatMapProps, 'width' | 'height' | 'className'> {
  containerWidth: number;
  containerHeight: number;
}

/**
 * Inner component that renders the actual chart content
 * Separated to avoid calling hooks inside render callbacks
 */
const HeatMapInner = memo(function HeatMapInner({
  data,
  containerWidth,
  containerHeight,
  colorScheme = 'cool',
  customColors,
  animated = true,
  legend = false,
  legendTitle = 'Legend',
  legendPosition = 'right',
  xAxis = {},
  yAxis = {},
  tooltip = {},
  gradient = false,
  innerPadding = 8,
  min,
  max,
  activeEntries: initialActiveEntries = [],
  onSelect,
  onActivate,
  onDeactivate,
}: HeatMapInnerProps) {
  const [xAxisHeight, setXAxisHeight] = useState(0);
  const [yAxisWidth, setYAxisWidth] = useState(0);
  const [activeEntries, setActiveEntries] = useState<DataItem[]>(initialActiveEntries);

  // Default margins
  const margin: [number, number, number, number] = [10, 20, 10, 20];

  // Merge axis config with defaults
  // IMPORTANT: Angular heat-map NEVER passes showGridLines to axes, so grid lines
  // are always disabled. We enforce showGridLines: false after merging props.
  const xAxisConfig = useMemo(() => ({
    visible: true,
    showLabel: false,
    trimTicks: true,
    rotateTicks: true,
    maxTickLength: 16,
    wrapTicks: false,
    ...xAxis,
    showGridLines: false, // Heat maps never show grid lines (matches Angular)
  }), [xAxis]);

  const yAxisConfig = useMemo(() => ({
    visible: true,
    showLabel: false,
    trimTicks: true,
    maxTickLength: 16,
    wrapTicks: false,
    ...yAxis,
    showGridLines: false, // Heat maps never show grid lines (matches Angular)
  }), [yAxis]);

  // Get X domain (unique series names)
  const xDomain = useMemo((): string[] => {
    const domain: string[] = [];
    for (const group of data) {
      const name = String(group.name);
      if (!domain.includes(name)) {
        domain.push(name);
      }
    }
    return domain;
  }, [data]);

  // Get Y domain (unique cell names from all series)
  const yDomain = useMemo((): string[] => {
    const domain: string[] = [];
    for (const group of data) {
      for (const d of group.series) {
        const name = String(d.name);
        if (!domain.includes(name)) {
          domain.push(name);
        }
      }
    }
    return domain;
  }, [data]);

  // Get value domain (all unique values)
  const rawValueDomain = useMemo((): number[] => {
    const domain: number[] = [];
    for (const group of data) {
      for (const d of group.series) {
        if (!domain.includes(d.value)) {
          domain.push(d.value);
        }
      }
    }
    return domain;
  }, [data]);

  // Determine scale type from value domain
  const scaleType = useMemo(() => getScaleType(rawValueDomain), [rawValueDomain]);

  // Calculate view dimensions
  const dims = useMemo(() => {
    return calculateViewDimensions({
      width: containerWidth,
      height: containerHeight,
      margins: margin,
      showXAxis: xAxisConfig.visible,
      showYAxis: yAxisConfig.visible,
      xAxisHeight,
      yAxisWidth,
      showXLabel: xAxisConfig.showLabel,
      showYLabel: yAxisConfig.showLabel,
      showLegend: legend,
      legendType: scaleType,
      legendPosition: legendPosition as LegendPosition,
    });
  }, [
    containerWidth,
    containerHeight,
    margin,
    xAxisConfig.visible,
    yAxisConfig.visible,
    xAxisHeight,
    yAxisWidth,
    xAxisConfig.showLabel,
    yAxisConfig.showLabel,
    legend,
    scaleType,
    legendPosition,
  ]);

  // Calculate actual value domain (with min/max overrides)
  const valueDomain = useMemo((): [number, number] => {
    if (scaleType === ScaleTypeEnum.Linear) {
      let minVal = min;
      let maxVal = max;

      if (minVal === undefined) {
        minVal = Math.min(0, ...rawValueDomain);
      }
      if (maxVal === undefined) {
        maxVal = Math.max(...rawValueDomain);
      }

      return [minVal, maxVal];
    }
    const minVal = Math.min(...rawValueDomain);
    const maxVal = Math.max(...rawValueDomain);
    return [minVal, maxVal];
  }, [scaleType, rawValueDomain, min, max]);

  // Create X scale
  const xScale = useMemo((): ScaleBand<string> => {
    const f = getDimension(innerPadding, 0, xDomain.length, dims.width);
    return scaleBand<string>()
      .rangeRound([0, dims.width])
      .domain(xDomain)
      .paddingInner(f);
  }, [innerPadding, xDomain, dims.width]);

  // Create Y scale
  const yScale = useMemo((): ScaleBand<string> => {
    const f = getDimension(innerPadding, 1, yDomain.length, dims.height);
    return scaleBand<string>()
      .rangeRound([dims.height, 0])
      .domain(yDomain)
      .paddingInner(f);
  }, [innerPadding, yDomain, dims.height]);

  // Create color helper
  const colors = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType,
      domain: valueDomain,
      customColors,
    });
  }, [colorScheme, scaleType, valueDomain, customColors]);

  const transform = `translate(${dims.xOffset ?? 0}, ${margin[0]})`;

  // Generate background rects (grid)
  const rects = useMemo((): RectItem[] => {
    const result: RectItem[] = [];

    xDomain.forEach((xVal) => {
      yDomain.forEach((yVal) => {
        const xPos = xScale(xVal);
        const yPos = yScale(yVal);

        if (xPos !== undefined && yPos !== undefined) {
          result.push({
            x: xPos,
            y: yPos,
            rx: 3,
            width: xScale.bandwidth(),
            height: yScale.bandwidth(),
            fill: 'rgba(200,200,200,0.03)',
          });
        }
      });
    });

    return result;
  }, [xDomain, yDomain, xScale, yScale]);

  const handleActivate = useCallback(
    (event: DataItem, group?: Series, fromLegend = false) => {
      const item = { ...event };
      if (group) {
        (item as DataItem & { series?: StringOrNumberOrDate }).series = group.name;
      }

      const items = data
        .flatMap((g) =>
          g.series.map((s) => ({
            ...s,
            series: g.name,
          }))
        )
        .filter((i) => {
          if (fromLegend) {
            return String(i.label ?? i.name) === String(item.name);
          }
          const itemSeries = (item as DataItem & { series?: StringOrNumberOrDate }).series;
          return String(i.name) === String(item.name) && String(i.series) === String(itemSeries);
        });

      setActiveEntries([...items]);
      onActivate?.({ value: item, entries: items });
    },
    [data, onActivate]
  );

  const handleDeactivate = useCallback(
    (event: DataItem, group?: Series, fromLegend = false) => {
      const item = { ...event };
      if (group) {
        (item as DataItem & { series?: StringOrNumberOrDate }).series = group.name;
      }

      const newEntries = activeEntries.filter((i) => {
        const itemName = i as DataItem & { series?: StringOrNumberOrDate };
        if (fromLegend) {
          return String(itemName.label ?? itemName.name) !== String(item.name);
        }
        const eventSeries = (item as DataItem & { series?: StringOrNumberOrDate }).series;
        return !(
          String(itemName.name) === String(item.name) &&
          String(itemName.series) === String(eventSeries)
        );
      });

      setActiveEntries(newEntries);
      onDeactivate?.({ value: item, entries: newEntries });
    },
    [activeEntries, onDeactivate]
  );

  const handleXAxisHeightChanged = useCallback(({ height }: { height: number }) => {
    setXAxisHeight(height);
  }, []);

  const handleYAxisWidthChanged = useCallback(({ width }: { width: number }) => {
    setYAxisWidth(width);
  }, []);

  return (
    <>
      <svg width={containerWidth} height={containerHeight} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}>
        <g transform={transform} className="heat-map chart">
          {/* X Axis */}
          {xAxisConfig.visible && (
            <XAxis
              xScale={xScale}
              dims={dims}
              showGridLines={xAxisConfig.showGridLines}
              showLabel={xAxisConfig.showLabel}
              labelText={xAxisConfig.label}
              trimTicks={xAxisConfig.trimTicks}
              rotateTicks={xAxisConfig.rotateTicks}
              maxTickLength={xAxisConfig.maxTickLength}
              tickFormatting={xAxisConfig.tickFormatting}
              ticks={xAxisConfig.ticks}
              wrapTicks={xAxisConfig.wrapTicks}
              onDimensionsChanged={handleXAxisHeightChanged}
            />
          )}

          {/* Y Axis */}
          {yAxisConfig.visible && (
            <YAxis
              yScale={yScale}
              dims={dims}
              showGridLines={yAxisConfig.showGridLines}
              showLabel={yAxisConfig.showLabel}
              labelText={yAxisConfig.label}
              trimTicks={yAxisConfig.trimTicks}
              maxTickLength={yAxisConfig.maxTickLength}
              tickFormatting={yAxisConfig.tickFormatting}
              ticks={yAxisConfig.ticks}
              wrapTicks={yAxisConfig.wrapTicks}
              onDimensionsChanged={handleYAxisWidthChanged}
            />
          )}

          {/* Background grid rects */}
          {rects.map((rect, index) => (
            <rect
              key={`bg-${index}`}
              x={rect.x}
              y={rect.y}
              rx={rect.rx}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
            />
          ))}

          {/* Heat map cells */}
          <HeatMapCellSeries
            data={data}
            xScale={xScale}
            yScale={yScale}
            colors={colors}
            gradient={gradient}
            tooltipDisabled={tooltip?.disabled}
            tooltipTemplate={tooltip?.template}
            tooltipText={tooltip?.text}
            animated={animated}
            onSelect={onSelect}
            onActivate={(item) => handleActivate(item)}
            onDeactivate={(item) => handleDeactivate(item)}
          />
        </g>
      </svg>

      {/* Legend */}
      {legend && (
        scaleType === ScaleTypeEnum.Linear || scaleType === ScaleTypeEnum.Quantile ? (
          <ScaleLegend
            valueRange={valueDomain}
            colors={colors.scale as { range: () => string[]; domain: () => number[] }}
            height={containerHeight}
            width={legendPosition === 'below' ? containerWidth : undefined}
            horizontal={legendPosition === 'below'}
          />
        ) : (
          <Legend
            title={legendTitle}
            colors={colors}
            data={valueDomain.map(String)}
            height={containerHeight}
            width={legendPosition === 'below' ? containerWidth : undefined}
            horizontal={legendPosition === 'below'}
            onLabelClick={(label: string) => onSelect?.({ name: label, value: 0 })}
          />
        )
      )}
    </>
  );
});

/**
 * Heat map chart component
 */
export function HeatMap({
  width,
  height,
  className,
  ...props
}: HeatMapProps) {
  return (
    <BaseChart width={width} height={height} className={className}>
      {({ width: containerWidth, height: containerHeight }) => (
        <HeatMapInner
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          {...props}
        />
      )}
    </BaseChart>
  );
}
