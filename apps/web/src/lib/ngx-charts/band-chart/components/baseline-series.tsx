'use client';

import { useMemo, useId } from 'react';
import { line, area, curveLinear } from 'd3-shape';
import type { ScalePoint, ScaleLinear } from 'd3-scale';
import { motion, AnimatePresence } from 'framer-motion';

import { SvgLinearGradient } from '@/lib/ngx-charts/common';

/** Knockout stroke — matches page background (--color-mine-bg) for visual gap effect */
const KNOCKOUT_COLOR = '#f5f3ef';
/** Market index baseline line color */
const BASELINE_LINE_COLOR = '#1939B7';

export interface BaselineSeriesProps {
  /** Daily precision data points */
  daily: Array<{ name: string; value: number }>;
  /** Monthly-sampled data points for smooth default curve */
  monthly: Array<{ name: string; value: number }>;
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
  /** 'default' = thin monthly line; 'selected' = daily line + between-curve fills */
  mode: 'default' | 'selected';
  animated?: boolean;
  /** Strategy overlay series — used to compute between-curve fills */
  overlaySeries?: Array<{ name: string; value: number }>;
}

/** Paired point with both baseline and strategy Y values at the same date */
interface PairedPoint {
  name: string;
  baselineVal: number;
  strategyVal: number;
}

/**
 * Group consecutive paired points into segments by which line is on top.
 * Each segment is a run of points where the relationship (strategy > baseline or not) is constant.
 * Segments overlap by one point at boundaries for seamless joins.
 */
function buildBetweenSegments(
  paired: PairedPoint[],
): Array<{ points: PairedPoint[]; strategyAbove: boolean }> {
  if (paired.length === 0) return [];

  type Seg = { points: PairedPoint[]; strategyAbove: boolean };
  const segments: Seg[] = [];
  let current: Seg | null = null;

  for (const pt of paired) {
    const above = pt.strategyVal >= pt.baselineVal;

    if (!current || current.strategyAbove !== above) {
      const newSeg: Seg = { points: [pt], strategyAbove: above };
      // Overlap last point for seamless join
      if (current && current.points.length > 0) {
        newSeg.points.unshift(current.points[current.points.length - 1]);
      }
      segments.push(newSeg);
      current = newSeg;
    } else {
      current.points.push(pt);
    }
  }

  return segments;
}

export function BaselineSeries({
  daily,
  monthly,
  xScale,
  yScale,
  mode,
  animated = true,
  overlaySeries,
}: BaselineSeriesProps) {
  const reactId = useId();
  const cleanId = reactId.replace(/:/g, '');
  const outperformGradientId = `baseline-out${cleanId}`;
  const underperformGradientId = `baseline-under${cleanId}`;
  const shadowFilterId = `baseline-shadow${cleanId}`;

  const BASE_STROKE = 0.3;

  // Monthly line (default mode)
  const monthlyPath = useMemo(() => {
    if (monthly.length < 2) return '';
    const gen = line<{ name: string; value: number }>()
      .x((d) => xScale(d.name) ?? 0)
      .y((d) => yScale(d.value))
      .curve(curveLinear);
    return gen(monthly) || '';
  }, [monthly, xScale, yScale]);

  // Daily line path (selected mode) — linear, same as strategy line
  const dailyLinePath = useMemo(() => {
    if (daily.length < 2) return '';
    const lineGen = line<{ name: string; value: number }>()
      .x((d) => xScale(d.name) ?? 0)
      .y((d) => yScale(d.value))
      .curve(curveLinear);
    return lineGen(daily) || '';
  }, [daily, xScale, yScale]);

  // Between-curve fill segments (selected mode only)
  const betweenSegments = useMemo(() => {
    if (!overlaySeries || overlaySeries.length === 0 || daily.length < 2) return [];

    // Build lookup: date → strategy value
    const strategyMap = new Map<string, number>();
    for (const pt of overlaySeries) {
      strategyMap.set(pt.name, pt.value);
    }

    // Pair baseline with strategy by date
    const paired: PairedPoint[] = [];
    for (const pt of daily) {
      const stratVal = strategyMap.get(pt.name);
      if (stratVal !== undefined) {
        paired.push({ name: pt.name, baselineVal: pt.value, strategyVal: stratVal });
      }
    }

    if (paired.length < 2) return [];

    const rawSegments = buildBetweenSegments(paired);

    // Build area paths: y0 = one curve, y1 = the other curve
    const areaGen = area<PairedPoint>()
      .x((d) => xScale(d.name) ?? 0)
      .y0((d) => yScale(d.strategyVal))
      .y1((d) => yScale(d.baselineVal))
      .curve(curveLinear);

    return rawSegments
      .filter((s) => s.points.length >= 2)
      .map((s) => ({
        path: areaGen(s.points) || '',
        strategyAbove: s.strategyAbove,
      }))
      .filter((s) => s.path);
  }, [daily, overlaySeries, xScale, yScale]);

  const fadeDuration = animated ? 0.3 : 0;

  return (
    <g className="baseline-series" style={{ pointerEvents: 'none' }}>
      <defs>
        {/* Teal gradient for outperform regions (strategy > baseline) */}
        <SvgLinearGradient
          id={outperformGradientId}
          orientation="vertical"
          stops={[
            { offset: 0, color: 'rgb(46, 189, 133)', opacity: 0.10 },
            { offset: 100, color: 'rgb(46, 189, 133)', opacity: 0.02 },
          ]}
        />
        {/* Blue gradient for underperform regions (baseline > strategy) */}
        <SvgLinearGradient
          id={underperformGradientId}
          orientation="vertical"
          stops={[
            { offset: 100, color: 'rgb(100, 149, 237)', opacity: 0.14 },
            { offset: 0, color: 'rgb(100, 149, 237)', opacity: 0.03 },
          ]}
        />
        <filter id={shadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.10" />
        </filter>
      </defs>

      <AnimatePresence mode="wait">
        {mode === 'default' && monthlyPath && (
          <motion.g
            key="monthly"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: fadeDuration } }}
          >
            <path
              d={monthlyPath}
              fill="none"
              stroke={KNOCKOUT_COLOR}
              strokeWidth={BASE_STROKE * 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={monthlyPath}
              fill="none"
              stroke={BASELINE_LINE_COLOR}
              strokeWidth={BASE_STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${shadowFilterId})`}
            />
          </motion.g>
        )}

        {mode === 'selected' && dailyLinePath && (
          <motion.g
            key="daily"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: fadeDuration } }}
          >
            {/* Between-curve fills */}
            {betweenSegments.map((seg, i) => (
              <path
                key={i}
                d={seg.path}
                fill={seg.strategyAbove
                  ? `url(#${outperformGradientId})`       /* teal — strategy outperforms */
                  : `url(#${underperformGradientId})`     /* blue — strategy underperforms */
                }
              />
            ))}

            {/* Baseline line on top */}
            <path
              d={dailyLinePath}
              fill="none"
              stroke={KNOCKOUT_COLOR}
              strokeWidth={BASE_STROKE * 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={dailyLinePath}
              fill="none"
              stroke={BASELINE_LINE_COLOR}
              strokeWidth={BASE_STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${shadowFilterId})`}
            />
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}
