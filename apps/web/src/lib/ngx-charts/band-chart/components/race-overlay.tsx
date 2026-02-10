'use client';

import { useMemo, useState, useRef, useEffect, useCallback, useId } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import type { CurveFactory } from 'd3-shape';
import type { ScalePoint, ScaleLinear } from 'd3-scale';

export interface RaceStrategy {
  id: string;
  color: string;
  series: Array<{ name: string; value: number }>;
}

export interface RaceOverlayProps {
  strategies: RaceStrategy[];
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
  curve?: CurveFactory;
  /** Duration per data-point step in ms. Default 40 */
  stepDuration?: number;
  /** Number of trailing data points visible (comet tail length). Default 15 */
  tailLength?: number;
}

// Rank-based opacity range (rank 1 = deepest, rank N = lightest)
const OPACITY_MAX = 0.28;
const OPACITY_MIN = 0.05;

/**
 * RaceOverlay renders a progressive comet-tail line-race animation.
 *
 * Each strategy line only shows the most recent `tailLength` data points,
 * fading from transparent at the tail to opaque at the head via an SVG mask.
 * The leader (highest value) is subtly distinguished from the rest.
 */
export function RaceOverlay({
  strategies,
  xScale,
  yScale,
  curve = curveMonotoneX,
  stepDuration = 40,
  tailLength = 15,
}: RaceOverlayProps) {
  const totalPoints = strategies.length > 0
    ? Math.min(...strategies.map(s => s.series.length))
    : 0;

  // Unique IDs for SVG defs
  const reactId = useId();
  const safeId = reactId.replace(/:/g, '');
  const maskId = `race-mask${safeId}`;
  const gradId = `race-grad${safeId}`;

  // Animation state — progress in ref, snapshotted to React state at ~50ms
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const lastSnapshotRef = useRef(0);

  // Data fingerprint for reset detection
  const dataKey = useMemo(
    () => `${strategies.length}-${totalPoints}-${strategies[0]?.series[0]?.name ?? ''}`,
    [strategies, totalPoints],
  );
  const prevDataKeyRef = useRef(dataKey);

  // Animation tick
  const tick = useCallback(() => {
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const newProgress = Math.min(Math.floor(elapsed / stepDuration), totalPoints - 1);
    progressRef.current = newProgress;

    if (now - lastSnapshotRef.current > 50 || newProgress >= totalPoints - 1) {
      setProgress(newProgress);
      lastSnapshotRef.current = now;
    }

    if (newProgress < totalPoints - 1) {
      animRef.current = requestAnimationFrame(tick);
    } else {
      animRef.current = null;
    }
  }, [stepDuration, totalPoints]);

  // Start/restart animation when data changes
  useEffect(() => {
    if (totalPoints <= 1) return;

    if (prevDataKeyRef.current !== dataKey) {
      prevDataKeyRef.current = dataKey;
      progressRef.current = 0;
      setProgress(0);
    }

    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }

    startTimeRef.current = performance.now();
    lastSnapshotRef.current = performance.now();
    progressRef.current = 0;
    setProgress(0);
    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [dataKey, totalPoints, tick]);

  // D3 line generator
  const lineGen = useMemo(
    () =>
      line<{ name: string; value: number }>()
        .x((d) => xScale(d.name) ?? 0)
        .y((d) => yScale(d.value))
        .curve(curve),
    [xScale, yScale, curve],
  );

  // Sliding window bounds
  const windowStart = Math.max(0, progress + 1 - tailLength);
  const windowEnd = Math.min(progress + 1, totalPoints);

  // Compute paths (window slice) + rank-based opacity
  const paths = useMemo(() => {
    if (strategies.length === 0 || windowEnd <= windowStart) {
      return [] as Array<{ id: string; d: string; opacity: number }>;
    }

    const n = strategies.length;
    // Collect current values for ranking
    const entries = strategies.map((s, i) => {
      const slice = s.series.slice(windowStart, windowEnd);
      const d = lineGen(slice) || '';
      const lastVal = slice[slice.length - 1]?.value ?? -Infinity;
      return { idx: i, id: s.id, d, lastVal };
    });

    // Sort by value descending → rank 0 = best
    const sorted = [...entries].sort((a, b) => b.lastVal - a.lastVal);
    const rankMap = new Map<string, number>();
    sorted.forEach((e, rank) => rankMap.set(e.id, rank));

    return entries.map((e) => {
      const rank = rankMap.get(e.id) ?? n - 1;
      const t = n > 1 ? rank / (n - 1) : 0; // 0 = best, 1 = worst
      const opacity = OPACITY_MAX - t * (OPACITY_MAX - OPACITY_MIN);
      return { id: e.id, d: e.d, opacity };
    });
  }, [strategies, windowStart, windowEnd, lineGen]);

  // Gradient mask bounds (pixel positions)
  const maskBounds = useMemo(() => {
    if (strategies.length === 0 || windowEnd <= windowStart) return null;
    const ref = strategies[0].series;
    const x1 = xScale(ref[windowStart]?.name ?? '') ?? 0;
    const x2 = xScale(ref[windowEnd - 1]?.name ?? '') ?? 0;
    const [yBottom, yTop] = yScale.range(); // range is [height, 0]
    return { x1, x2, yTop: yTop - 10, h: yBottom - yTop + 20 };
  }, [strategies, windowStart, windowEnd, xScale, yScale]);

  // Hide completely once animation finishes — lines have merged into band
  const finished = progress >= totalPoints - 1;
  if (strategies.length === 0 || totalPoints <= 1 || !maskBounds || finished) return null;

  const maskW = Math.max(maskBounds.x2 - maskBounds.x1, 1);

  return (
    <g className="race-overlay-layer" style={{ pointerEvents: 'none' }}>
      <defs>
        {/* Horizontal gradient: transparent at tail → opaque at head */}
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={maskBounds.x1} y1="0" x2={maskBounds.x2} y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id={maskId}>
          <rect x={maskBounds.x1} y={maskBounds.yTop} width={maskW} height={maskBounds.h} fill={`url(#${gradId})`} />
        </mask>
      </defs>

      {/* Masked group — all lines fade at tail, ranked deep→light */}
      <g mask={`url(#${maskId})`}>
        {paths.map(
          (p) =>
            p.d && (
              <path
                key={p.id}
                d={p.d}
                fill="none"
                stroke={`rgba(99,102,241,${p.opacity})`}
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ),
        )}
      </g>
    </g>
  );
}
