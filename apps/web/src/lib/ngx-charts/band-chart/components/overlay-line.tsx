'use client';

import { useMemo, useId } from 'react';
import { line, area, curveLinear } from 'd3-shape';
import type { CurveFactory } from 'd3-shape';
import type { ScalePoint, ScaleLinear } from 'd3-scale';
import { motion, AnimatePresence } from 'framer-motion';

import { SvgLinearGradient } from '@/lib/ngx-charts/common';
import type { OverlaySeries } from '../hooks';

/** Knockout stroke — matches page background (--color-mine-bg) for visual gap effect */
const KNOCKOUT_COLOR = '#f5f3ef';

export interface OverlayLineProps {
  overlay: OverlaySeries | null;
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
  animated?: boolean;
  curve?: CurveFactory;
  /** Enable ink-brush effect (variable stroke-width segments). Default false */
  brushEffect?: boolean;
  /** Hide the gradient area fill under the line. Used in selected mode where BaselineSeries handles fills. */
  hideGradient?: boolean;
}

/* ── Brush helpers ──────────────────────────────────────────── */

interface Pt { x: number; y: number }

/**
 * Split a series of points into overlapping segments, each rendered
 * with a slightly different stroke-width for an ink-brush feel.
 * Variation is gentle (±20%) to stay readable at high density.
 */
function buildBrushSegments(
  pts: Pt[],
  curve: CurveFactory,
  baseWidth: number,
): Array<{ d: string; width: number }> {
  if (pts.length < 2) return [];

  const segLen = pts.length > 100 ? 12 : pts.length > 50 ? 8 : 5;
  const segments: Array<{ d: string; width: number }> = [];
  const lineGen = line<Pt>().x((d) => d.x).y((d) => d.y).curve(curve);

  for (let i = 0; i < pts.length - 1; i += segLen) {
    const end = Math.min(i + segLen + 1, pts.length);
    const slice = pts.slice(i, end);
    if (slice.length < 2) continue;

    const d = lineGen(slice) || '';
    if (!d) continue;

    // Deterministic pseudo-random width factor per segment
    const seed = ((i * 7 + 13) % 17) / 17; // 0..1
    const widthFactor = 0.8 + seed * 0.4;   // 0.8..1.2
    segments.push({ d, width: baseWidth * widthFactor });
  }

  return segments;
}

/* ── Component ──────────────────────────────────────────────── */

export function OverlayLine({
  overlay,
  xScale,
  yScale,
  animated = true,
  curve = curveLinear,
  brushEffect = false,
  hideGradient = false,
}: OverlayLineProps) {
  const reactId = useId();
  const gradientId = `overlay-grad${reactId.replace(/:/g, '')}`;
  const shadowFilterId = `overlay-shadow${reactId.replace(/:/g, '')}`;

  const BASE_STROKE = 1;

  const { areaPath, linePath, brushSegments } = useMemo(() => {
    if (!overlay || overlay.series.length === 0) {
      return { areaPath: '', linePath: '', brushSegments: [] as Array<{ d: string; width: number }> };
    }

    const pts = overlay.series;
    const x = (d: { name: string; value: number }) => xScale(d.name) ?? 0;
    const baseY = yScale.range()[0];

    // Area fill under line
    const areaGen = area<{ name: string; value: number }>()
      .x(x)
      .y0(() => baseY)
      .y1((d) => yScale(d.value))
      .curve(curve);

    // Single-path line (used when brush is off)
    const lineGen = line<{ name: string; value: number }>()
      .x(x)
      .y((d) => yScale(d.value))
      .curve(curve);

    // Brush segments (only computed when enabled)
    let segs: Array<{ d: string; width: number }> = [];
    if (brushEffect) {
      const pixelPts: Pt[] = pts.map((d) => ({
        x: xScale(d.name) ?? 0,
        y: yScale(d.value),
      }));
      segs = buildBrushSegments(pixelPts, curve, BASE_STROKE);
    }

    return {
      areaPath: areaGen(pts) || '',
      linePath: lineGen(pts) || '',
      brushSegments: segs,
    };
  }, [overlay, xScale, yScale, curve, brushEffect]);

  const fadeTransition = { opacity: { duration: animated ? 0.25 : 0 } };
  const hasContent = brushEffect ? brushSegments.length > 0 : !!linePath;

  return (
    <g className="overlay-layer">
      <AnimatePresence>
        {overlay && hasContent && (
          <motion.g
            key={overlay.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
          >
            <defs>
              <SvgLinearGradient
                id={gradientId}
                orientation="vertical"
                stops={[
                  { offset: 0, color: overlay.color, opacity: 0.09 },
                  { offset: 100, color: overlay.color, opacity: 0.01 },
                ]}
              />
              <filter id={shadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.10" />
              </filter>
            </defs>

            {/* Gradient area under strategy line (hidden in selected mode) */}
            {areaPath && !hideGradient && (
              <path
                d={areaPath}
                fill={`url(#${gradientId})`}
                style={{ pointerEvents: 'none' }}
              />
            )}

            {brushEffect ? (
              /* Brush segments — variable-width strokes for ink feel */
              <>
                {/* White knockout backing for brush segments */}
                {brushSegments.map((seg, i) => (
                  <path
                    key={`ko-${i}`}
                    d={seg.d}
                    fill="none"
                    stroke={KNOCKOUT_COLOR}
                    strokeWidth={seg.width * 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pointerEvents: 'none' }}
                  />
                ))}
                {brushSegments.map((seg, i) => (
                  <path
                    key={i}
                    d={seg.d}
                    fill="none"
                    stroke={overlay.color}
                    strokeWidth={seg.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${shadowFilterId})`}
                    style={{ pointerEvents: 'none' }}
                  />
                ))}
              </>
            ) : (
              /* Single clean path with white knockout backing */
              linePath && (
                <>
                  {/* White knockout — creates visual gap from layers below */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke={KNOCKOUT_COLOR}
                    strokeWidth={BASE_STROKE * 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pointerEvents: 'none' }}
                  />
                  <path
                    d={linePath}
                    fill="none"
                    stroke={overlay.color}
                    strokeWidth={BASE_STROKE}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${shadowFilterId})`}
                    style={{ pointerEvents: 'none' }}
                  />
                </>
              )
            )}
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}
