'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import type { ICDecay } from '@/features/lab/types';

// ─── IC Decay Chart (Recharts) ───────────────────────────

function ICDecayChart({ lags }: { lags: { lag: number; ic: number }[] }) {
  const data = lags.map((l) => ({ name: `T+${l.lag}`, ic: l.ic }));

  return (
    <div data-slot="ic-decay-chart" className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">
        IC 衰减曲线 (T+1 ~ T+20)
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
        >
          <XAxis dataKey="name" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <ReferenceLine
            y={0}
            stroke="var(--color-mine-border)"
            strokeWidth={0.5}
            strokeDasharray="4"
          />
          <Line
            type="linear"
            dataKey="ic"
            stroke="var(--color-mine-accent-amber)"
            strokeWidth={1.5}
            dot={{ r: 2, fill: 'var(--color-mine-accent-amber)', opacity: 0.7 }}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Step IC Decay ──────────────────────────────────────

export function StepICDecay({ icDecay }: { icDecay: ICDecay }) {
  return (
    <div data-slot="step-ic-decay" className="space-y-3">
      {/* Half-life callout */}
      <div className="flex items-center gap-2 px-3 py-2 bg-mine-bg rounded-lg">
        <span className="text-xs text-mine-muted">IC 半衰期:</span>
        <span className="text-sm font-bold font-mono tabular-nums text-mine-text">
          {icDecay.halfLife.toFixed(1)} 天
        </span>
        <span className="text-[10px] text-mine-muted">
          {icDecay.halfLife <= 5
            ? '— 衰减较快，适合短周期'
            : icDecay.halfLife <= 10
              ? '— 衰减中等'
              : '— 衰减缓慢，适合长周期'}
        </span>
      </div>

      {/* Decay chart */}
      <ICDecayChart lags={icDecay.lags} />

      {/* Multi-period stats table */}
      <div className="rounded-lg border border-mine-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">持有期</TableHead>
              <TableHead className="text-[10px] text-right">IC 均值</TableHead>
              <TableHead className="text-[10px] text-right">
                IC 标准差
              </TableHead>
              <TableHead className="text-[10px] text-right">IR</TableHead>
              <TableHead className="text-[10px] text-right">偏度</TableHead>
              <TableHead className="text-[10px] text-right">峰度</TableHead>
              <TableHead className="text-[10px] text-right">IC&lt;0%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {icDecay.multiPeriodStats.map((stat) => (
              <TableRow key={stat.period}>
                <TableCell className="text-[11px] font-medium">
                  T+{stat.period}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icMean.toFixed(4)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icStd.toFixed(4)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.ir.toFixed(2)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icSkew.toFixed(2)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icKurt.toFixed(2)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {stat.icNegRatio.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
