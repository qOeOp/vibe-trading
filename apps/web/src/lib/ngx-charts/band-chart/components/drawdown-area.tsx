'use client';

import { useMemo, useId } from 'react';
import type { ScalePoint } from 'd3-scale';
import { motion } from 'framer-motion';

export interface DrawdownAreaProps {
  /** Series data (date + cumulative return %) to compute drawdown from */
  data: Array<{ name: string; value: number }>;
  xScale: ScalePoint<string>;
  /** Y scale — used to compute proportional drawdown depth in pixels */
  yScale: (v: number) => number;
  /** Chart area height in pixels (for clip rect) */
  chartHeight: number;
  color?: string;
  animated?: boolean;
}

/**
 * Ceiling-mode drawdown: horizontal line segments arranged in rows from the top.
 * Each row represents a depth level; dashes appear where drawdown >= that depth.
 * Drawdown depth is mapped through the chart's Y scale so it stays proportional
 * to the equity curve.
 */
export function DrawdownArea({
  data,
  xScale,
  yScale,
  chartHeight,
  color = 'rgba(130, 130, 130, 0.55)',
  animated = true,
}: DrawdownAreaProps) {
  const reactId = useId();
  const clipId = `drawdown-clip${reactId.replace(/:/g, '')}`;
  const chartWidth = xScale.range()[1] || 0;

  const rowPaths = useMemo(() => {
    if (data.length === 0 || chartHeight <= 0) return [];

    const ROW_THICKNESS = 1.5;
    const ROW_STEP = 4;
    const BAR_RATIO = 0.7;

    // Step 1: compute drawdown pixel depth at each point using yScale
    let peakNetVal = -Infinity;
    let peakReturnPct = 0;
    const ddPoints = data.map((d) => {
      const netVal = 1 + d.value / 100;
      if (netVal > peakNetVal) {
        peakNetVal = netVal;
        peakReturnPct = d.value;
      }
      // Pixel depth = Y-scale distance between peak return and current return.
      // yScale(lower value) > yScale(higher value) in SVG coords, so this is positive during drawdowns.
      const depthPx = Math.max(0, yScale(d.value) - yScale(peakReturnPct));
      return { name: d.name, depthPx };
    });

    // Step 2: find max depth in pixels
    let maxDepthPx = 0;
    for (const d of ddPoints) {
      if (d.depthPx > maxDepthPx) maxDepthPx = d.depthPx;
    }
    if (maxDepthPx <= 0) return [];

    const barWidth = xScale.step() * BAR_RATIO;
    const numRows = Math.ceil(maxDepthPx / ROW_STEP);

    // Step 3: one path per row — horizontal dashes where drawdown reaches that depth
    const rows: Array<{ key: number; d: string; thickness: number }> = [];
    for (let row = 0; row < numRows; row++) {
      const y = row * ROW_STEP + ROW_THICKNESS / 2;
      const segments: string[] = [];
      for (const pt of ddPoints) {
        if (pt.depthPx > row * ROW_STEP) {
          const x = (xScale(pt.name) ?? 0) - barWidth / 2;
          segments.push(`M${x},${y}h${barWidth}`);
        }
      }
      if (segments.length > 0) {
        rows.push({ key: row, d: segments.join(''), thickness: ROW_THICKNESS });
      }
    }

    return rows;
  }, [data, xScale, yScale, chartHeight]);

  if (rowPaths.length === 0) return null;

  return (
    <motion.g
      className="drawdown-ceiling"
      style={{ pointerEvents: 'none' }}
      initial={animated ? { opacity: 0 } : undefined}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 0.4 } }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={chartWidth} height={chartHeight} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {rowPaths.map((r) => (
          <path
            key={r.key}
            d={r.d}
            stroke={color}
            strokeWidth={r.thickness}
            fill="none"
            strokeLinecap="butt"
          />
        ))}
      </g>
    </motion.g>
  );
}
