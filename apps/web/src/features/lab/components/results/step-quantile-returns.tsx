'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import type { QuantileReturns } from '@/features/lab/types';
import { StatBox } from './stat-box';

// ─── Quantile Bar Chart (Recharts) ───────────────────────

const QUANTILE_COLORS = [
  'var(--color-market-down)', // Q1 - worst (green/跌)
  'var(--color-market-down-medium)', // Q2
  'var(--color-mine-muted)', // Q3 - neutral
  'var(--color-market-up-medium)', // Q4
  'var(--color-market-up)', // Q5 - best (red/涨)
];

function QuantileBarChart({
  groups,
}: {
  groups: { label: string; avgReturn: number }[];
}) {
  const data = groups.map((g, i) => ({
    name: g.label,
    value: g.avgReturn * 100,
    color: QUANTILE_COLORS[i] ?? 'var(--color-mine-muted)',
  }));

  return (
    <div data-slot="quantile-bar-chart" className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">分位组平均收益</div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 4, bottom: 16, left: 4 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'var(--color-mine-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <ReferenceLine
            y={0}
            stroke="var(--color-mine-border)"
            strokeWidth={0.5}
            strokeDasharray="4"
          />
          <Bar
            dataKey="value"
            radius={[3, 3, 0, 0]}
            opacity={0.85}
            isAnimationActive={false}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Long-Short Curve (Recharts) ─────────────────────────

function LongShortCurve({
  curve,
}: {
  curve: { date: string; value: number }[];
}) {
  return (
    <div data-slot="long-short-curve" className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">多空净值曲线</div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart
          data={curve}
          margin={{ top: 2, right: 2, bottom: 0, left: 2 }}
        >
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Line
            type="linear"
            dataKey="value"
            stroke="var(--color-mine-accent-indigo)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Step Quantile Returns ──────────────────────────────

export function StepQuantileReturns({
  quantileReturns,
}: {
  quantileReturns: QuantileReturns;
}) {
  return (
    <div data-slot="step-quantile-returns" className="space-y-3">
      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <QuantileBarChart groups={quantileReturns.groups} />
        <LongShortCurve curve={quantileReturns.longShortCurve} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox
          label="单调性"
          value={quantileReturns.monotonicity.toFixed(2)}
          color={quantileReturns.monotonicity > 0.8 ? 'green' : undefined}
        />
        <StatBox
          label="多空年化"
          value={`${quantileReturns.longShortReturn.toFixed(2)}%`}
        />
        <StatBox
          label="最大回撤"
          value={`${quantileReturns.longShortMaxDD.toFixed(2)}%`}
          color={quantileReturns.longShortMaxDD < -15 ? 'red' : undefined}
        />
        <StatBox
          label="多空 IR"
          value={quantileReturns.longShortIR.toFixed(2)}
        />
      </div>
    </div>
  );
}
