'use client';

import { useMemo, useId } from 'react';
import type { Area as D3Area, Line as D3Line} from 'd3-shape';
import { area, line, curveMonotoneX, curveBasis } from 'd3-shape';
import type { CurveFactory } from 'd3-shape';
import type { ScalePoint, ScaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';

import { SvgLinearGradient } from '@/lib/ngx-charts/common';
import type { BandDataPoint, BandConfig } from '../hooks';
import { BandArea } from './band-area';

export interface BandSeriesProps {
  data: BandDataPoint[];
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
  config?: BandConfig;
  animated?: boolean;
  curve?: CurveFactory;
  /** When true, band fills fade out and median shows a light-blue gradient area */
  hasOverlay?: boolean;
  /** When true, median line + area are not rendered (rendered externally as a top layer) */
  hideMedian?: boolean;
}

export function BandSeries({
  data,
  xScale,
  yScale,
  config,
  animated = true,
  curve = curveMonotoneX,
  hasOverlay = false,
  hideMedian = false,
}: BandSeriesProps) {
  const reactId = useId();
  const medianGradientId = `median-grad${reactId.replace(/:/g, '')}`;

  const bandColor = config?.color ?? '99, 102, 241';
  const outerOpacity = config?.outerOpacity ?? 0.07;
  const innerOpacity = config?.innerOpacity ?? 0.18;
  const medianStrokeWidth = config?.medianStrokeWidth ?? 2;

  // D3 generators
  const {
    outerPath,
    innerPath,
    maxEdgePath,
    minEdgePath,
    q3EdgePath,
    q1EdgePath,
    medianPath,
    medianAreaPath,
    startingOuterPath,
    startingInnerPath,
  } = useMemo(() => {
    if (data.length === 0) {
      return {
        outerPath: '',
        innerPath: '',
        maxEdgePath: '',
        minEdgePath: '',
        q3EdgePath: '',
        q1EdgePath: '',
        medianPath: '',
        medianAreaPath: '',
        startingOuterPath: '',
        startingInnerPath: '',
      };
    }

    const x = (d: BandDataPoint) => xScale(d.name) ?? 0;
    const baseY = yScale.range()[0]; // bottom of chart

    // Min-Max band (outer)
    const outerArea: D3Area<BandDataPoint> = area<BandDataPoint>()
      .x(x)
      .y0((d) => yScale(d.min))
      .y1((d) => yScale(d.max))
      .curve(curve);

    // Q1-Q3 band (inner)
    const innerArea: D3Area<BandDataPoint> = area<BandDataPoint>()
      .x(x)
      .y0((d) => yScale(d.q1))
      .y1((d) => yScale(d.q3))
      .curve(curve);

    // Starting areas (flat at baseline for animation)
    const startingOuter: D3Area<BandDataPoint> = area<BandDataPoint>()
      .x(x)
      .y0(() => baseY)
      .y1(() => baseY)
      .curve(curve);

    const startingInner: D3Area<BandDataPoint> = area<BandDataPoint>()
      .x(x)
      .y0(() => baseY)
      .y1(() => baseY)
      .curve(curve);

    // Edge lines
    const maxLine: D3Line<BandDataPoint> = line<BandDataPoint>()
      .x(x)
      .y((d) => yScale(d.max))
      .curve(curve);

    const minLine: D3Line<BandDataPoint> = line<BandDataPoint>()
      .x(x)
      .y((d) => yScale(d.min))
      .curve(curve);

    const q3Line: D3Line<BandDataPoint> = line<BandDataPoint>()
      .x(x)
      .y((d) => yScale(d.q3))
      .curve(curve);

    const q1Line: D3Line<BandDataPoint> = line<BandDataPoint>()
      .x(x)
      .y((d) => yScale(d.q1))
      .curve(curve);

    // Median line — use curveBasis for extra smoothness
    const medLine: D3Line<BandDataPoint> = line<BandDataPoint>()
      .x(x)
      .y((d) => yScale(d.median))
      .curve(curveBasis);

    // Median area fill (median → baseline) — same smooth curve
    const medArea: D3Area<BandDataPoint> = area<BandDataPoint>()
      .x(x)
      .y0(() => baseY)
      .y1((d) => yScale(d.median))
      .curve(curveBasis);

    return {
      outerPath: outerArea(data) || '',
      innerPath: innerArea(data) || '',
      maxEdgePath: maxLine(data) || '',
      minEdgePath: minLine(data) || '',
      q3EdgePath: q3Line(data) || '',
      q1EdgePath: q1Line(data) || '',
      medianPath: medLine(data) || '',
      medianAreaPath: medArea(data) || '',
      startingOuterPath: startingOuter(data) || '',
      startingInnerPath: startingInner(data) || '',
    };
  }, [data, xScale, yScale, curve]);

  const pathTransition = {
    d: { duration: animated ? 0.75 : 0, ease: 'easeInOut' as const },
    opacity: { duration: animated ? 0.3 : 0 },
  };

  const fadeTransition = {
    opacity: { duration: 0.35, ease: 'easeInOut' as const },
  };

  if (data.length === 0) return null;

  return (
    <g className="band-series">
      {/* Gradient definition for median area — matches band style */}
      <defs>
        <SvgLinearGradient
          id={medianGradientId}
          orientation="vertical"
          stops={[
            { offset: 100, color: `rgb(${bandColor})`, opacity: 0.09 },
            { offset: 0, color: `rgb(${bandColor})`, opacity: 0.01 },
          ]}
        />
      </defs>

      {/* Band fills + edges — fade out when overlay active */}
      <motion.g
        animate={{ opacity: hasOverlay ? 0 : 1 }}
        transition={fadeTransition}
        style={{ pointerEvents: 'none' }}
      >
        {/* Min-Max band fill */}
        <BandArea
          path={outerPath}
          startingPath={startingOuterPath}
          fill={`rgba(${bandColor}, ${outerOpacity})`}
          animated={animated}
          className="band-outer"
        />

        {/* Q1-Q3 band fill */}
        <BandArea
          path={innerPath}
          startingPath={startingInnerPath}
          fill={`rgba(${bandColor}, ${innerOpacity})`}
          animated={animated}
          className="band-inner"
        />

        {/* Edge strokes */}
        {maxEdgePath && (
          <motion.path
            d={maxEdgePath}
            fill="none"
            stroke={`rgba(${bandColor}, 0.15)`}
            strokeWidth={0.5}
            initial={animated ? { d: maxEdgePath, opacity: 0 } : undefined}
            animate={{ d: maxEdgePath, opacity: 1 }}
            transition={pathTransition}
            style={{ pointerEvents: 'none' }}
          />
        )}
        {minEdgePath && (
          <motion.path
            d={minEdgePath}
            fill="none"
            stroke={`rgba(${bandColor}, 0.15)`}
            strokeWidth={0.5}
            initial={animated ? { d: minEdgePath, opacity: 0 } : undefined}
            animate={{ d: minEdgePath, opacity: 1 }}
            transition={pathTransition}
            style={{ pointerEvents: 'none' }}
          />
        )}
        {q3EdgePath && (
          <motion.path
            d={q3EdgePath}
            fill="none"
            stroke={`rgba(${bandColor}, 0.30)`}
            strokeWidth={0.5}
            initial={animated ? { d: q3EdgePath, opacity: 0 } : undefined}
            animate={{ d: q3EdgePath, opacity: 1 }}
            transition={pathTransition}
            style={{ pointerEvents: 'none' }}
          />
        )}
        {q1EdgePath && (
          <motion.path
            d={q1EdgePath}
            fill="none"
            stroke={`rgba(${bandColor}, 0.30)`}
            strokeWidth={0.5}
            initial={animated ? { d: q1EdgePath, opacity: 0 } : undefined}
            animate={{ d: q1EdgePath, opacity: 1 }}
            transition={pathTransition}
            style={{ pointerEvents: 'none' }}
          />
        )}
      </motion.g>

      {/* Median area fill — fades in when overlay active (skip if rendered externally) */}
      {!hideMedian && medianAreaPath && (
        <motion.path
          d={medianAreaPath}
          fill={`url(#${medianGradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: hasOverlay ? 1 : 0 }}
          transition={fadeTransition}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Median line (skip if rendered externally as top layer) */}
      {!hideMedian && medianPath && (
        <motion.path
          d={medianPath}
          fill="none"
          stroke={`rgba(${bandColor}, ${hasOverlay ? 0.18 : 1})`}
          strokeWidth={hasOverlay ? 0.5 : medianStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { d: medianPath, opacity: 0 } : undefined}
          animate={{ d: medianPath, opacity: 1 }}
          transition={pathTransition}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </g>
  );
}
