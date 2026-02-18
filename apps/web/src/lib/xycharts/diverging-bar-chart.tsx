'use client';

/**
 * @fileoverview DivergingBarChart — L1 Framework Component
 *
 * @description
 * Integrates the full diverging bar chart pipeline:
 *   - Data transformation (useDivergingStackData)
 *   - Optional SeverityBrush with range selection
 *   - Brush state management (internal)
 *   - Visible data slicing + domain computation
 *   - Responsive container (BaseChart)
 *
 * Callers provide raw curves + colors. Everything else is handled internally.
 *
 * Supports two brush coloring modes:
 *   1. Default severity mode — grayscale based on monotonicity violation
 *   2. Custom mode — caller provides `brushData` for arbitrary classification
 *
 * @example
 * ```tsx
 * // 5-series quantile cumulative returns with severity brush
 * <DivergingBarChart
 *   curves={factor.quantileCumulativeReturns}
 *   baseline={1.0}
 *   colors={QUANTILE_COLORS}
 *   showBrush
 *   enableSeverity
 * />
 *
 * // 2-series turnover with custom 4-state brush classification
 * <DivergingBarChart
 *   curves={[turnover.bottom, turnover.top]}
 *   baseline={0}
 *   colors={["#0B8C5F", "#CF304A"]}
 *   showBrush
 *   brushData={customBrushData}
 *   enableSeverity={false}
 * />
 * ```
 */

import { useState, useCallback, useMemo, memo } from 'react';
import { BaseChart } from '../ngx-charts/common/base-chart';
import { DivergingBarStack } from './diverging-bar-stack';
import { SeverityBrush } from './severity-brush';
import { useDivergingStackData, useDivergingDomain } from './use-diverging-stack';
import { useBrushBarData } from './use-brush-data';
import type { BrushBarDatum, BrushRange, ChartMargin, ReferenceLine } from './types';

/* ── Constants ─────────────────────────────────────── */

const DEFAULT_MARGIN: ChartMargin = { top: 6, right: 4, bottom: 4, left: 4 };
const DEFAULT_BRUSH_HEIGHT = 32;

/* ── Props ─────────────────────────────────────────── */

export interface DivergingBarChartProps {
  /** N curves of raw values, each with M timesteps */
  curves: number[][];
  /** Reference value to subtract (default 1.0 for NAV, use 0 for turnover) */
  baseline?: number;
  /** Color for each series (required, length must match curves.length) */
  colors: string[];
  /** Show the brush mini-chart above the main chart (default true) */
  showBrush?: boolean;
  /** Compute monotonicity severity for default brush coloring (default true) */
  enableSeverity?: boolean;
  /** Custom brush bar data — overrides default severity-based grayscale coloring */
  brushData?: BrushBarDatum[];
  /** Brush mini-chart height in px (default 32) */
  brushHeight?: number;
  /** Optional horizontal reference lines (values in delta space, after baseline subtraction) */
  referenceLines?: ReferenceLine[];
  /** Show crosshair on hover with date + value labels */
  showCrosshair?: boolean;
  /** Series labels for crosshair tooltip (e.g. ["Q1","Q2","Q3","Q4","Q5"]) */
  seriesLabels?: string[];
  /** Format function for crosshair Y-axis values */
  formatValue?: (v: number) => string;
  /** Format function for crosshair X-axis labels */
  formatLabel?: (t: number) => string;
  /** Chart margins (shared between brush and main chart for alignment) */
  margin?: ChartMargin;
  /** Custom CSS class for the BaseChart container */
  className?: string;
}

/* ── Component ─────────────────────────────────────── */

export const DivergingBarChart = memo(function DivergingBarChart({
  curves,
  baseline = 1.0,
  colors,
  showBrush = true,
  enableSeverity = true,
  brushData: externalBrushData,
  brushHeight = DEFAULT_BRUSH_HEIGHT,
  referenceLines,
  showCrosshair = false,
  seriesLabels,
  formatValue,
  formatLabel,
  margin = DEFAULT_MARGIN,
  className,
}: DivergingBarChartProps) {
  // ── Data pipeline ──────────────────────────────
  const stackData = useDivergingStackData(curves, baseline, enableSeverity);
  const defaultBrushData = useBrushBarData(stackData);

  // Use external brush data if provided, otherwise default severity-based
  const brushBarData = externalBrushData ?? defaultBrushData;

  // ── Brush state ────────────────────────────────
  const [brushRange, setBrushRange] = useState<BrushRange | null>(null);

  const handleBrushChange = useCallback((range: BrushRange | null) => {
    setBrushRange(range);
  }, []);

  // ── Visible data slice ─────────────────────────
  const visibleData = useMemo(() => {
    if (!brushRange) return stackData;
    return stackData.filter(
      (d) => d.t >= brushRange.startT && d.t <= brushRange.endT,
    );
  }, [stackData, brushRange]);

  const visibleDomain = useDivergingDomain(visibleData);

  // ── Render ─────────────────────────────────────
  return (
    <BaseChart className={className}>
      {({ width: containerWidth, height: containerHeight }) => {
        const mainHeight = showBrush
          ? containerHeight - brushHeight
          : containerHeight;

        return (
          <div style={{ width: containerWidth, height: containerHeight }}>
            {showBrush && (
              <>
                <SeverityBrush
                  data={brushBarData}
                  selectedRange={brushRange}
                  onBrushChange={handleBrushChange}
                  width={containerWidth}
                  height={brushHeight}
                  margin={{ left: margin.left, right: margin.right }}
                />
              </>
            )}
            <div style={{ height: mainHeight }}>
              <DivergingBarStack
                data={visibleData}
                domain={visibleDomain}
                width={containerWidth}
                height={mainHeight}
                colors={colors}
                referenceLines={referenceLines}
                showCrosshair={showCrosshair}
                seriesLabels={seriesLabels}
                formatValue={formatValue}
                formatLabel={formatLabel}
                margin={margin}
              />
            </div>
          </div>
        );
      }}
    </BaseChart>
  );
});
