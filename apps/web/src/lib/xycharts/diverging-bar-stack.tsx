'use client';

/**
 * @fileoverview Diverging Bar Stack Chart (L0 renderer)
 *
 * @description
 * A purpose-built SVG renderer for overlapping diverging bars:
 *
 * 1. Each series' delta is drawn as an independent bar from zero.
 *    Bars overlap — tallest drawn first (back), shortest last (front).
 *    This creates layered color bands showing the series spread.
 *
 * 2. Supports arbitrary N series (not limited to 5 quantiles).
 *
 * 3. Paired with DivergingBarChart (L1 framework) which adds
 *    SeverityBrush, data pipeline, and state management.
 *
 * 4. Optional crosshair overlay for hover interactivity.
 *
 * Built with visx primitives and our BaseChart responsive container.
 */

import { useMemo, memo, useState, useCallback } from 'react';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { BaseChart } from '../ngx-charts/common/base-chart';
import { YAxis } from '../ngx-charts/common/axes';
import { DivergingCrosshair } from './diverging-crosshair';
import type { DivergingBarDatum, ChartMargin, ReferenceLine } from './types';

/* ── Constants ─────────────────────────────────────── */

const DEFAULT_MARGIN: ChartMargin = { top: 6, right: 4, bottom: 6, left: 0 };
const DEFAULT_REFERENCE_LINE_COLOR = '#2563eb'; // Royal blue for visibility over red/green bars

/* ── Bar Rect Type ─────────────────────────────────── */
// ... (rest of imports and BarItem interface)
interface BarItem {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  opacity: number;
}

/* ── Props ─────────────────────────────────────────── */

export interface DivergingBarStackProps {
  /** Processed diverging bar data (from useDivergingStackData) */
  data: DivergingBarDatum[];
  /** Y domain [min, max] (from useDivergingDomain) */
  domain: [number, number];
  /** Optional fixed width */
  width?: number;
  /** Optional fixed height */
  height?: number;
  /** Color palette for each series (required, arbitrary length) */
  colors: string[];
  /** Chart margins */
  margin?: ChartMargin;
  /** Optional horizontal reference lines (values are in delta space, after baseline subtraction) */
  referenceLines?: ReferenceLine[];
  /** Show crosshair on hover with date + value labels */
  showCrosshair?: boolean;
  /** Series labels for crosshair tooltip (e.g. ["Q1","Q2","Q3","Q4","Q5"]) */
  seriesLabels?: string[];
  /** Format function for crosshair Y-axis values */
  formatValue?: (v: number) => string;
  /** Format function for crosshair X-axis labels */
  formatLabel?: (t: number) => string;
  /** Custom CSS class */
  className?: string;
}

/* ── Inner Chart ───────────────────────────────────── */

interface InnerProps {
  data: DivergingBarDatum[];
  domain: [number, number];
  containerWidth: number;
  containerHeight: number;
  colors: string[];
  margin: ChartMargin;
  referenceLines: ReferenceLine[];
  showCrosshair: boolean;
  seriesLabels?: string[];
  formatValue?: (v: number) => string;
  formatLabel?: (t: number) => string;
}

const DivergingBarStackInner = memo(function DivergingBarStackInner({
  data,
  domain,
  containerWidth,
  containerHeight,
  colors,
  margin,
  referenceLines,
  showCrosshair,
  seriesLabels,
  formatValue,
  formatLabel,
}: InnerProps) {
  const [yAxisWidth, setYAxisWidth] = useState(0);

  // xOffset mimics the logic in calculateViewDimensions
  const xOffset = useMemo(() => {
    return margin.left + yAxisWidth + (yAxisWidth > 0 ? 9 : 0);
  }, [margin.left, yAxisWidth]);

  const innerWidth = containerWidth - xOffset - margin.right;
  const innerHeight = containerHeight - margin.top - margin.bottom;

  // X scale: band for time steps
  const xScale = useMemo(
    () =>
      scaleBand<number>({
        domain: data.map((d) => d.t),
        range: [0, innerWidth],
        padding: 0.05,
      }),
    [data, innerWidth],
  );

  // Y scale: maps delta values to full chart area
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain,
        range: [innerHeight, 0], // SVG: larger y = lower on screen
        clamp: true,
      }),
    [domain, innerHeight],
  );

  const zeroY = yScale(0);
  const barWidth = xScale.bandwidth();

  // ── Compute all bar rects ──────────────────────────
  const bars = useMemo(() => {
    const result: BarItem[] = [];

    for (const datum of data) {
      const xPos = xScale(datum.t) ?? 0;

      // Separate series into positive and negative groups
      const posQs: Array<{ q: number; delta: number }> = [];
      const negQs: Array<{ q: number; delta: number }> = [];
      const N = colors.length;

      for (let q = 0; q < N; q++) {
        const d = datum.deltas[q];
        if (d === undefined) continue;
        if (d >= 0) posQs.push({ q, delta: d });
        else negQs.push({ q, delta: d });
      }

      // Sort by magnitude descending — tallest drawn first (painter's algorithm)
      posQs.sort((a, b) => b.delta - a.delta);
      negQs.sort((a, b) => a.delta - b.delta); // most negative first

      // Draw positive bars (from zero upward)
      for (const { q, delta } of posQs) {
        const barTopY = yScale(delta);
        const barH = zeroY - barTopY;
        if (barH < 0.3) continue;

        result.push({
          x: xPos,
          y: barTopY,
          width: barWidth,
          height: barH,
          fill: colors[q],
          opacity: 1,
        });
      }

      // Draw negative bars (from zero downward)
      for (const { q, delta } of negQs) {
        const barBottomY = yScale(delta);
        const barH = barBottomY - zeroY;
        if (barH < 0.3) continue;

        result.push({
          x: xPos,
          y: zeroY,
          width: barWidth,
          height: barH,
          fill: colors[q],
          opacity: 1,
        });
      }
    }

    return result;
  }, [data, xScale, yScale, zeroY, barWidth, colors]);

  const handleYAxisWidthChange = useCallback(({ width }: { width: number }) => {
    setYAxisWidth(width);
  }, []);

  if (innerWidth <= 0 || innerHeight <= 0) return null;

  return (
    <svg
      width={containerWidth}
      height={containerHeight}
      className="xycharts"
      style={{
        overflow: 'visible',
        fontFamily: 'var(--font-chart, Roboto, sans-serif)',
      }}
    >
      <Group left={xOffset} top={margin.top}>
        {/* Y Axis integration */}
        <YAxis
          yScale={yScale}
          dims={{ width: innerWidth, height: innerHeight, xOffset }}
          showGridLines={true}
          tickFormatting={formatValue}
          onDimensionsChanged={handleYAxisWidthChange}
        />

        {/* Main bars layer */}
        <Group className="main-bars">
          {bars.map((bar, i) => (
            <Bar
              key={`main-${i}`}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={bar.fill}
              opacity={bar.opacity}
              rx={0.3}
            />
          ))}
        </Group>

        {/* Reference lines (includes zero line when injected by L1) */}
        {referenceLines.map((ref, i) => {
          const refY = yScale(ref.value);
          if (refY < 0 || refY > innerHeight) return null;
          return (
            <line
              key={`ref-${i}`}
              x1={0}
              y1={refY}
              x2={innerWidth}
              y2={refY}
              stroke={ref.color ?? DEFAULT_REFERENCE_LINE_COLOR}
              strokeWidth={ref.strokeWidth ?? 0.75}
              opacity={ref.opacity ?? 1}
              strokeDasharray={ref.strokeDasharray ?? '4 2'}
            />
          );
        })}

        {/* Crosshair overlay (topmost interactive layer) */}
        {showCrosshair && (
          <DivergingCrosshair
            data={data}
            xScale={xScale}
            yScale={yScale}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            colors={colors}
            seriesLabels={seriesLabels}
            formatValue={formatValue}
            formatLabel={formatLabel}
          />
        )}
      </Group>
    </svg>
  );
});

/* ── Public Component ──────────────────────────────── */

/**
 * Diverging Bar Stack Chart (L0 renderer)
 *
 * Renders N-series overlapping diverging bars from zero.
 * Use DivergingBarChart (L1) for the full framework with brush and data pipeline.
 *
 * @example
 * ```tsx
 * <DivergingBarStack
 *   data={data}
 *   domain={domain}
 *   colors={["#0B8C5F", "#58CEAA", "#76808E", "#E8626F", "#CF304A"]}
 *   showCrosshair
 *   seriesLabels={["Q1", "Q2", "Q3", "Q4", "Q5"]}
 * />
 * ```
 */
export function DivergingBarStack({
  data,
  domain,
  width,
  height,
  colors,
  margin = DEFAULT_MARGIN,
  referenceLines = [],
  showCrosshair = false,
  seriesLabels,
  formatValue,
  formatLabel,
  className,
}: DivergingBarStackProps) {
  return (
    <BaseChart width={width} height={height} className={className}>
      {({ width: containerWidth, height: containerHeight }) => (
        <DivergingBarStackInner
          data={data}
          domain={domain}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          colors={colors}
          margin={margin}
          referenceLines={referenceLines}
          showCrosshair={showCrosshair}
          seriesLabels={seriesLabels}
          formatValue={formatValue}
          formatLabel={formatLabel}
        />
      )}
    </BaseChart>
  );
}
