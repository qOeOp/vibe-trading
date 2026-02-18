'use client';

/**
 * @fileoverview DivergingCrosshair — Reusable crosshair overlay for diverging bar charts
 *
 * @description
 * A standalone SVG `<g>` element that renders:
 * - Vertical dashed crosshair line (snapped to nearest bar center)
 * - Horizontal dashed crosshair line (at mouse Y position)
 * - X-axis label (timestep index, TradingView-style dark tag)
 * - Y-axis label (delta value, TradingView-style dark tag)
 * - Small circle marker at intersection
 *
 * Designed for composition inside DivergingBarStack's SVG.
 * Adapted from BandTooltipArea's crosshair pattern.
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import type { MouseEvent } from 'react';
import type { ScaleBand, ScaleLinear } from 'd3-scale';
import type { DivergingBarDatum } from './types';

/* ── Types ─────────────────────────────────────────── */

export interface DivergingCrosshairProps {
  /** Chart data (visible slice) */
  data: DivergingBarDatum[];
  /** Band scale for time steps */
  xScale: ScaleBand<number>;
  /** Linear scale for delta values */
  yScale: ScaleLinear<number, number>;
  /** Inner chart width (excluding margins) */
  innerWidth: number;
  /** Inner chart height (excluding margins) */
  innerHeight: number;
  /** Colors for each series (used in tooltip value labels) */
  colors: string[];
  /** Series labels (e.g. ["Q1","Q2","Q3","Q4","Q5"]) — if omitted, uses "S1","S2",... */
  seriesLabels?: string[];
  /** Format function for Y-axis values. Default: ±X.XX% */
  formatValue?: (v: number) => string;
  /** Format function for X-axis labels. Default: "T{index}" */
  formatLabel?: (t: number) => string;
  /** Y position for the X-axis label (below chart). Default: innerHeight + 2 */
  xLabelY?: number;
  /** X position for the Y-axis label right edge (inside chart). Default: innerWidth - 2 */
  yLabelX?: number;
}

/* ── Crosshair State ──────────────────────────────── */

interface CrosshairState {
  /** Snapped X position (bar center) */
  x: number;
  /** Mouse Y position (clamped to chart area) */
  y: number;
  /** The delta value at mouse Y */
  value: number;
  /** Time step index */
  t: number;
  /** Whether crosshair is visible */
  visible: boolean;
  /** The datum at this timestep */
  datum: DivergingBarDatum | null;
}

const INITIAL: CrosshairState = {
  x: 0,
  y: 0,
  value: 0,
  t: 0,
  visible: false,
  datum: null,
};

/* ── Helpers ───────────────────────────────────────── */

function defaultFormatValue(v: number): string {
  const pct = v * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
}

function defaultFormatLabel(t: number): string {
  return `T${t}`;
}

/**
 * Find closest data point by X pixel position using band scale step estimation.
 */
function findClosestDatum(
  xPos: number,
  data: DivergingBarDatum[],
  xScale: ScaleBand<number>,
): DivergingBarDatum | null {
  if (data.length === 0) return null;

  const step = xScale.step();
  if (step <= 0) return data[0];

  // Estimate index from pixel position
  const estimated = Math.round(xPos / step);
  const clamped = Math.max(0, Math.min(data.length - 1, estimated));

  let bestIdx = clamped;
  let bestDist = Infinity;

  // Check neighbors
  for (
    let i = Math.max(0, clamped - 1);
    i <= Math.min(data.length - 1, clamped + 1);
    i++
  ) {
    const barCenter = (xScale(data[i].t) ?? 0) + xScale.bandwidth() / 2;
    const dist = Math.abs(barCenter - xPos);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }

  return data[bestIdx];
}

/* ── TradingView-style axis labels ────────────────── */

function XAxisLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const h = 16;
  const w = Math.max(36, text.length * 6.5 + 10);
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={3}
        fill="rgba(0,0,0,0.85)"
      />
      <text
        x={x}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontFamily="var(--font-chart, Roboto, sans-serif)"
        fontWeight={500}
        style={{ fill: '#fff' }}
      >
        {text}
      </text>
    </g>
  );
}

function YAxisLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const h = 16;
  const w = Math.max(46, text.length * 6.5 + 10);
  // Right-aligned: rect's right edge aligns to x, extends leftward into chart area
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={x - w}
        y={y - h / 2}
        width={w}
        height={h}
        rx={3}
        fill="rgba(0, 0, 0, 0.85)"
      />
      <text
        x={x - w / 2}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontFamily="var(--font-chart, Roboto, sans-serif)"
        fontWeight={500}
        style={{ fill: '#fff', fontVariantNumeric: 'tabular-nums' }}
      >
        {text}
      </text>
    </g>
  );
}

/* ── Tooltip ──────────────────────────────────────── */

function CrosshairTooltip({
  datum,
  colors,
  labels,
  formatValue: fv,
}: {
  datum: DivergingBarDatum;
  colors: string[];
  labels: string[];
  formatValue: (v: number) => string;
}) {
  return (
    <div
      className="backdrop-blur-xl bg-mine-card/85 border border-mine-border/50 rounded-lg px-2.5 py-2 text-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      style={{ minWidth: 100, pointerEvents: 'none' }}
    >
      <div className="text-mine-muted font-mono tabular-nums mb-1">
        T{datum.t}
      </div>
      <div className="space-y-0.5">
        {datum.deltas.map((d, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-2 h-2 rounded-[1px]"
                style={{ backgroundColor: colors[i] }}
              />
              <span className="text-mine-muted">{labels[i]}</span>
            </span>
            <span
              className="font-mono tabular-nums"
              style={{
                color:
                  d >= 0
                    ? 'var(--color-market-up)'
                    : 'var(--color-market-down)',
              }}
            >
              {fv(d)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────── */

export function DivergingCrosshair({
  data,
  xScale,
  yScale,
  innerWidth,
  innerHeight,
  colors,
  seriesLabels,
  formatValue = defaultFormatValue,
  formatLabel = defaultFormatLabel,
  xLabelY,
  yLabelX,
}: DivergingCrosshairProps) {
  const [crosshair, setCrosshair] = useState<CrosshairState>(INITIAL);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const containerRef = useRef<SVGGElement>(null);

  const labels = useMemo(
    () => seriesLabels ?? colors.map((_, i) => `S${i + 1}`),
    [seriesLabels, colors],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      if (data.length === 0) return;

      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const xPos = event.clientX - rect.left;
      const yPos = event.clientY - rect.top;

      const datum = findClosestDatum(xPos, data, xScale);
      if (!datum) return;

      const barCenter = (xScale(datum.t) ?? 0) + xScale.bandwidth() / 2;
      const clampedY = Math.max(0, Math.min(innerHeight, yPos));
      const yValue = yScale.invert(clampedY);

      setCrosshair({
        x: barCenter,
        y: clampedY,
        value: yValue,
        t: datum.t,
        visible: true,
        datum,
      });

      // Tooltip position: offset from crosshair
      setTooltipPos({ x: event.clientX + 12, y: event.clientY - 20 });
    },
    [data, xScale, yScale, innerHeight],
  );

  const handleMouseLeave = useCallback(() => {
    setCrosshair(INITIAL);
    setTooltipPos(null);
  }, []);

  // Hide the dot when it overlaps the Y-axis label (label always tracks crosshair.y,
  // so only X overlap matters). The label rect spans [yLabelRight - labelWidth, yLabelRight].
  const yLabelRight = yLabelX ?? innerWidth - 2;
  const yLabelWidth = crosshair.visible
    ? Math.max(46, formatValue(crosshair.value).length * 6.5 + 10)
    : 0;
  const dotOverlapsLabel =
    crosshair.visible && crosshair.x >= yLabelRight - yLabelWidth - 3;

  return (
    <>
      <g ref={containerRef}>
        {/* Invisible hit area */}
        <rect
          x={0}
          y={0}
          width={innerWidth}
          height={innerHeight}
          style={{
            opacity: 0,
            cursor: dotOverlapsLabel ? 'none' : 'crosshair',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Crosshair dashed lines — only rendered when active to avoid sub-pixel
            artifacts from opacity:0 lines sitting at (0,0) in initial state */}
        {crosshair.visible && (
          <>
            <g
              style={{
                opacity: 0.7,
                pointerEvents: 'none',
              }}
            >
              {/* Vertical dashed line */}
              <line
                x1={crosshair.x}
                y1={0}
                x2={crosshair.x}
                y2={innerHeight}
                stroke="var(--color-mine-text)"
                strokeWidth={0.5}
                strokeDasharray="4 3"
              />
              {/* Horizontal dashed line */}
              <line
                x1={0}
                y1={crosshair.y}
                x2={innerWidth}
                y2={crosshair.y}
                stroke="var(--color-mine-text)"
                strokeWidth={0.5}
                strokeDasharray="4 3"
              />
            </g>

            {/* Intersection marker — fades out when overlapping Y-axis label */}
            <circle
              cx={crosshair.x}
              cy={crosshair.y}
              r={3}
              fill="var(--color-mine-card)"
              stroke="var(--color-mine-text)"
              strokeWidth={1.2}
              style={{
                opacity: dotOverlapsLabel ? 0 : 0.7,
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* Axis labels (always full opacity when visible) */}
        {crosshair.visible && (
          <g style={{ pointerEvents: 'none' }}>
            <XAxisLabel
              x={crosshair.x}
              y={xLabelY ?? innerHeight + 2}
              text={formatLabel(crosshair.t)}
            />
            <YAxisLabel
              x={yLabelX ?? innerWidth - 2}
              y={crosshair.y}
              text={formatValue(crosshair.value)}
            />
          </g>
        )}
      </g>

      {/* HTML tooltip (rendered via portal-like foreignObject approach) */}
      {crosshair.visible && crosshair.datum && tooltipPos && (
        <foreignObject
          x={0}
          y={0}
          width={1}
          height={1}
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <div
            style={{
              position: 'fixed',
              left: tooltipPos.x,
              top: tooltipPos.y,
              zIndex: 50,
              pointerEvents: 'none',
            }}
          >
            <CrosshairTooltip
              datum={crosshair.datum}
              colors={colors}
              labels={labels}
              formatValue={formatValue}
            />
          </div>
        </foreignObject>
      )}
    </>
  );
}
