'use client';

import { useMemo } from 'react';
import type { ScalePoint } from 'd3-scale';

export interface MonthStripesProps {
  xScale: ScalePoint<string>;
  height: number;
  data: string[]; // xDomain (date strings like "2024-01-15")
}

function getMonth(d: string): number {
  const parts = d.split('-');
  return parts.length > 1 ? parseInt(parts[1], 10) : -1;
}

function getYear(d: string): number {
  const parts = d.split('-');
  return parts.length > 0 ? parseInt(parts[0], 10) : -1;
}

/**
 * Background visual separator for the band chart.
 * - Full period (> 18 months): thin vertical lines at January 1st boundaries
 * - Year/month view (<= 18 months): alternating month stripe fills
 */
export function MonthStripes({ xScale, height, data }: MonthStripesProps) {

  // Determine time span to decide mode
  const isFullPeriod = useMemo(() => {
    if (data.length < 2) return false;
    const firstMonth = getMonth(data[0]);
    const lastMonth = getMonth(data[data.length - 1]);
    const firstYear = getYear(data[0]);
    const lastYear = getYear(data[data.length - 1]);
    const totalMonths = (lastYear - firstYear) * 12 + (lastMonth - firstMonth);
    return totalMonths > 18;
  }, [data]);

  // Year divider lines (full period mode)
  const yearDividers = useMemo(() => {
    if (!isFullPeriod || data.length === 0) return [];

    const dividers: { x: number; year: number }[] = [];
    let prevYear = getYear(data[0]);

    for (let i = 1; i < data.length; i++) {
      const y = getYear(data[i]);
      if (y !== prevYear) {
        const x = xScale(data[i]) ?? 0;
        dividers.push({ x, year: y });
        prevYear = y;
      }
    }

    return dividers;
  }, [isFullPeriod, data, xScale]);

  // Month stripe blocks (zoomed-in mode)
  const monthStripes = useMemo(() => {
    if (isFullPeriod || data.length === 0) return [];

    const blocks: { x: number; width: number; month: number }[] = [];

    let blockStart = 0;
    let blockMonth = getMonth(data[0]);

    for (let i = 1; i <= data.length; i++) {
      const m = i < data.length ? getMonth(data[i]) : -1;
      if (m !== blockMonth || i === data.length) {
        const startX = xScale(data[blockStart]) ?? 0;
        const endX = i < data.length
          ? (xScale(data[i]) ?? 0)
          : startX + (data.length - blockStart) * xScale.step();

        blocks.push({ x: startX, width: endX - startX, month: blockMonth });

        if (i < data.length) {
          blockStart = i;
          blockMonth = m;
        }
      }
    }

    return blocks;
  }, [isFullPeriod, xScale, data]);

  return (
    <g className="month-stripes" pointerEvents="none">
      {isFullPeriod
        ? yearDividers.map((d) => (
            <line
              key={d.year}
              x1={d.x}
              y1={0}
              x2={d.x}
              y2={height}
              stroke="#e0ddd8"
              strokeWidth={0.5}
            />
          ))
        : monthStripes.map((block, i) =>
            block.month % 2 === 0 && (
              <rect
                key={i}
                x={block.x}
                y={0}
                width={block.width}
                height={height}
                fill="rgba(0, 0, 0, 0.015)"
              />
            )
          )}
    </g>
  );
}
