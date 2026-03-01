'use client';

import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';
import { PanelSection } from '@/components/shared/panel';
import { BaseChart } from '@/lib/ngx-charts/common/base-chart';
import { computeQQPlotData } from '@/features/library/utils/compute-ic-stats';
import type { Factor } from '@/features/library/types';

/* ── Visual constants ──────────────────────────────────────── */

const DOT_COLOR = '#6366f1';
const DOT_RADIUS = 1.5;
const REF_LINE_COLOR = '#e0ddd8';
const MARGINS = { top: 8, right: 8, bottom: 20, left: 0 };

/* ── Chart Component ──────────────────────────────────────── */

function QQPlotContent({
  data,
  width,
  height,
}: {
  data: Array<{ theoretical: number; empirical: number }>;
  width: number;
  height: number;
}) {
  const plotW = width - MARGINS.left - MARGINS.right;
  const plotH = height - MARGINS.top - MARGINS.bottom;

  const { xScale, yScale, extent } = useMemo(() => {
    const allT = data.map((d) => d.theoretical);
    const allE = data.map((d) => d.empirical);
    const lo = Math.min(Math.min(...allT), Math.min(...allE));
    const hi = Math.max(Math.max(...allT), Math.max(...allE));
    const pad = (hi - lo) * 0.05;
    const ext = [lo - pad, hi + pad] as const;

    return {
      xScale: scaleLinear().domain([ext[0], ext[1]]).range([0, plotW]),
      yScale: scaleLinear().domain([ext[0], ext[1]]).range([plotH, 0]),
      extent: ext,
    };
  }, [data, plotW, plotH]);

  if (plotW <= 0 || plotH <= 0) return null;

  return (
    <svg width={width} height={height} className="ngx-charts">
      <g transform={`translate(${MARGINS.left},${MARGINS.top})`}>
        {/* 45° reference line */}
        <line
          x1={xScale(extent[0])}
          y1={yScale(extent[0])}
          x2={xScale(extent[1])}
          y2={yScale(extent[1])}
          stroke={REF_LINE_COLOR}
          strokeWidth={1}
          strokeDasharray="4,3"
        />

        {/* X axis line */}
        <line
          x1={0}
          y1={plotH}
          x2={plotW}
          y2={plotH}
          stroke={REF_LINE_COLOR}
          strokeWidth={0.5}
        />
        <text
          x={plotW / 2}
          y={plotH + 14}
          textAnchor="middle"
          fill="#666"
          fontSize={9}
          fontFamily="var(--font-chart)"
          fontWeight={300}
        >
          理论分位数
        </text>

        {/* Y axis line */}
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={plotH}
          stroke={REF_LINE_COLOR}
          strokeWidth={0.5}
        />

        {/* Scatter dots */}
        {data.map((d, i) => (
          <motion.circle
            key={i}
            cx={xScale(d.theoretical)}
            cy={yScale(d.empirical)}
            r={DOT_RADIUS}
            fill={DOT_COLOR}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.001 }}
          />
        ))}
      </g>
    </svg>
  );
}

function ICQQPlotChart({ data }: { data: number[] }) {
  if (!data || data.length < 10) return null;

  const qqData = useMemo(() => computeQQPlotData(data), [data]);

  if (qqData.length === 0) return null;

  return (
    <BaseChart>
      {({ width, height }) => (
        <QQPlotContent data={qqData} width={width} height={height} />
      )}
    </BaseChart>
  );
}

/* ── Section Export ────────────────────────────────────────── */

interface ICQQPlotSectionProps {
  factor: Factor;
}

export function ICQQPlotSection({ factor }: ICQQPlotSectionProps) {
  return (
    <PanelSection>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-mine-muted">IC Q-Q 图</span>
        <span className="text-[10px] text-mine-muted">正态检验</span>
      </div>
      <div className="h-[150px]">
        <ICQQPlotChart data={factor.icTimeSeries} />
      </div>
    </PanelSection>
  );
}
