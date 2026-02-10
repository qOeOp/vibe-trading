/**
 * @fileoverview Line race series component — ink brush style
 *
 * @description
 * Renders animated line paths for the line race chart using an ink/brush
 * style with gentle stroke-width variation, soft shadow, and round caps.
 * Optimised for dense data (300+ points) — the brush effect is subtle
 * to maintain readability at high density.
 *
 * @license MIT
 */

'use client';

import { useMemo, useState, useCallback, useId } from 'react';
import { line, curveLinear, CurveFactory } from 'd3-shape';
import { ScaleLinear } from 'd3-scale';

import { ColorHelper } from '../../utils';
import { LineRaceSeriesData } from '../hooks/use-line-race';

export interface LineRaceSeriesProps {
  data: LineRaceSeriesData[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  colors: ColorHelper;
  customColorArray?: string[];
  currentRound: number;
  interpolation: number;
  isPlaying: boolean;
  totalRounds: number;
  curve?: CurveFactory;
  strokeWidth?: number;
  activeSeries?: string | null;
  onSeriesActivate?: (name: string) => void;
  onSeriesDeactivate?: () => void;
  hideEndLabels?: boolean;
  chartHeight?: number;
}

interface PointData {
  x: number;
  y: number;
}

interface SeriesRenderData {
  name: string;
  color: string;
  /** Full smooth path for shadow + main stroke */
  pathD: string;
  /** Array of segment sub-paths with variable widths for brush effect */
  brushSegments: { d: string; width: number }[];
  lastPoint: PointData | null;
  displayValue: number;
  seriesIndex: number;
}

/* ── helpers ──────────────────────────────────────────────────── */
const HIT_W = 16;

/** Parse "#rrggbb" to [r, g, b] */
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Convert hex + alpha to rgba string */
function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Build brush segments: split the path into groups of consecutive points,
 * each rendered with a slightly different stroke-width to create a
 * hand-drawn brush feel. The variation is gentle (±25% of base width)
 * so it stays readable at 300+ points.
 */
function buildBrushSegments(
  pts: PointData[],
  curve: CurveFactory,
  baseWidth: number,
): { d: string; width: number }[] {
  if (pts.length < 2) return [];

  // For dense data (>50 pts), use larger segments to avoid visual noise
  const segLen = pts.length > 100 ? 12 : pts.length > 50 ? 8 : 5;
  const segments: { d: string; width: number }[] = [];
  const lineGen = line<PointData>().x(d => d.x).y(d => d.y).curve(curve);

  for (let i = 0; i < pts.length - 1; i += segLen) {
    // Overlap by 1 point to avoid gaps between segments
    const end = Math.min(i + segLen + 1, pts.length);
    const slice = pts.slice(i, end);
    if (slice.length < 2) continue;

    const d = lineGen(slice) || '';
    if (!d) continue;

    // Seeded width variation based on segment index — deterministic
    const seed = ((i * 7 + 13) % 17) / 17; // 0..1
    const widthFactor = 0.8 + seed * 0.4;   // 0.8 .. 1.2
    segments.push({ d, width: baseWidth * widthFactor });
  }

  return segments;
}

/* ── Component ─────────────────────────────────────────────────── */

export function LineRaceSeries({
  data,
  xScale,
  yScale,
  colors,
  customColorArray,
  currentRound,
  interpolation,
  isPlaying,
  totalRounds,
  curve = curveLinear,
  strokeWidth = 2.5,
  activeSeries,
  onSeriesActivate,
  onSeriesDeactivate,
  hideEndLabels = false,
}: LineRaceSeriesProps) {
  const filterId = useId();
  const [localHover, setLocalHover] = useState<string | null>(null);

  const effective = activeSeries ?? localHover;
  const hasActive = effective != null;

  const handleEnter = useCallback((n: string) => { setLocalHover(n); onSeriesActivate?.(n); }, [onSeriesActivate]);
  const handleLeave = useCallback(() => { setLocalHover(null); onSeriesDeactivate?.(); }, [onSeriesDeactivate]);

  /* ── build paths ─────────────────────────────────────────────── */
  const seriesPaths: SeriesRenderData[] = useMemo(() => {
    return data.map((series, seriesIndex) => {
      const color = customColorArray?.[seriesIndex] ?? colors.getColor(series.name);
      const completedPoints: PointData[] = [];
      const maxR = Math.min(currentRound, series.values.length - 1);

      for (let r = 0; r <= maxR; r++) {
        completedPoints.push({ x: xScale(r), y: yScale(series.values[r]) });
      }

      let endPoint: PointData | null = null;
      if (isPlaying && interpolation < 1 && currentRound < totalRounds) {
        const toR = currentRound + 1;
        if (toR < series.values.length) {
          const fv = series.values[currentRound], tv = series.values[toR];
          const iv = fv + (tv - fv) * interpolation;
          const fx = xScale(currentRound), tx = xScale(toR);
          endPoint = { x: fx + (tx - fx) * interpolation, y: yScale(iv) };
        }
      }

      const pts = endPoint ? [...completedPoints, endPoint] : completedPoints;

      // Full path for shadow and hit area
      const lineGen = line<PointData>().x(d => d.x).y(d => d.y).curve(curve);
      const pathD = pts.length >= 2 ? lineGen(pts) || '' : '';

      // Brush segments with variable width
      const brushSegments = buildBrushSegments(pts, curve, strokeWidth);

      const lastPoint = pts[pts.length - 1] ?? null;

      let displayValue: number;
      if (endPoint && isPlaying && interpolation < 1) {
        const fv = series.values[currentRound], tv = series.values[currentRound + 1];
        displayValue = fv + (tv - fv) * interpolation;
      } else {
        displayValue = series.values[maxR];
      }

      return { name: series.name, color, pathD, brushSegments, lastPoint, displayValue, seriesIndex };
    });
  }, [data, xScale, yScale, colors, customColorArray, currentRound, interpolation, isPlaying, totalRounds, curve, strokeWidth]);

  /* ── render ──────────────────────────────────────────────────── */
  return (
    <g className="line-race-series">
      {/* Shared shadow filter — subtle drop shadow for depth */}
      <defs>
        <filter id={`${filterId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.12" />
        </filter>
      </defs>

      {seriesPaths.map((s) => {
        const isActive = effective === s.name;
        const isInactive = hasActive && !isActive;

        return (
          <g
            key={s.name}
            className={`line-race-series-group series-${s.seriesIndex}`}
            style={{ opacity: isInactive ? 0.2 : 1, transition: 'opacity 200ms ease' }}
          >
            {/* Hit area */}
            {s.pathD && (
              <path
                d={s.pathD}
                fill="none"
                stroke="transparent"
                strokeWidth={HIT_W}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => handleEnter(s.name)}
                onMouseLeave={handleLeave}
              />
            )}

            {/* Shadow layer — uses full path, blurred */}
            {s.pathD && (
              <path
                d={s.pathD}
                fill="none"
                stroke={hexToRgba('#000000', 0.08)}
                strokeWidth={strokeWidth + 1}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#${filterId}-shadow)`}
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* Brush segments — variable width for ink feel */}
            {s.brushSegments.map((seg, i) => (
              <path
                key={i}
                d={seg.d}
                fill="none"
                stroke={s.color}
                strokeWidth={isActive ? seg.width + 0.8 : seg.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              />
            ))}

            {/* Leading dot — round for brush feel */}
            {s.lastPoint && (
              <circle
                cx={s.lastPoint.x}
                cy={s.lastPoint.y}
                r={isActive ? 4 : 3}
                fill={s.color}
                stroke="#fff"
                strokeWidth={1.5}
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* End label */}
            {!hideEndLabels && s.lastPoint && (
              <g transform={`translate(${s.lastPoint.x + 10}, ${s.lastPoint.y})`} style={{ pointerEvents: 'none' }}>
                <text
                  fontSize="10px"
                  dominantBaseline="middle"
                  fontFamily="var(--font-chart, Roboto, sans-serif)"
                >
                  <tspan fill="#333" fontWeight={isActive ? 600 : 400}>{s.name}</tspan>
                  <tspan fill="#888">{' '}</tspan>
                  <tspan
                    fill="#555"
                    fontWeight={500}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {s.displayValue.toLocaleString()}
                  </tspan>
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}
