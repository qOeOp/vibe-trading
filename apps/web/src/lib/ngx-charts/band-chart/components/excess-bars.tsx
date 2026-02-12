'use client';

import { useMemo, useId } from 'react';
import type { ScalePoint } from 'd3-scale';
import { motion } from 'framer-motion';

export interface ExcessBarsProps {
  /** Excess return values (strategy minus baseline). Negative values are ignored. */
  data: Array<{ name: string; value: number }>;
  xScale: ScalePoint<string>;
  /** Chart area height in pixels (bars grow upward from bottom) */
  chartHeight: number;
  animated?: boolean;
}

export function ExcessBars({
  data,
  xScale,
  chartHeight,
  animated = true,
}: ExcessBarsProps) {
  const reactId = useId();
  const clipId = `excess-clip${reactId.replace(/:/g, '')}`;
  const chartWidth = xScale.range()[1] || 0;

  const bars = useMemo(() => {
    const positive = data.filter((d) => d.value > 0);
    if (positive.length === 0) return [];

    const barWidth = Math.max(1, xScale.step() * 0.3);
    let maxVal = 0;
    for (const d of positive) {
      if (d.value > maxVal) maxVal = d.value;
    }
    if (maxVal <= 0) return [];

    // Normalize: max excess value maps to 15% of chart height.
    // Excess returns are a secondary metric on a different scale from the Y axis,
    // so we use a self-contained scale rather than the chart's yScale.
    const maxBarPx = chartHeight * 0.15;

    return positive
      .map((d) => {
        const x = (xScale(d.name) ?? 0) - barWidth / 2;
        const h = (d.value / maxVal) * maxBarPx;
        const y = chartHeight - h;
        return { key: d.name, x, y, width: barWidth, height: h };
      })
      .filter((b) => b.height > 0);
  }, [data, xScale, chartHeight]);

  if (bars.length === 0) return null;

  return (
    <motion.g
      className="excess-bars"
      style={{ pointerEvents: 'none' }}
      initial={animated ? { opacity: 0 } : undefined}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 0.3 } }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={chartWidth} height={chartHeight} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {bars.map((b) => (
          <rect
            key={b.key}
            x={b.x}
            y={b.y}
            width={b.width}
            height={b.height}
            fill="rgba(207, 48, 74, 0.35)"
            rx={0.5}
          />
        ))}
      </g>
    </motion.g>
  );
}
