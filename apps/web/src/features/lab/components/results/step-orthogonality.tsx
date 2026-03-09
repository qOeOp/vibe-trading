'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { StatBox } from './stat-box';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import type { OrthogonalityTest } from '@/features/lab/types';

// ─── Correlation Chart (Recharts) ────────────────────────

function CorrelationChart({
  factors,
}: {
  factors: { name: string; correlation: number; pValue: number }[];
}) {
  const data = factors.map((f) => ({
    name: f.name,
    correlation: f.correlation,
    isSignificant: f.pValue < 0.05,
  }));

  return (
    <div data-slot="correlation-chart" className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">与已知因子相关性</div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 20, left: 4 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 8, fill: 'var(--color-mine-muted)' }}
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
          <ReferenceLine
            y={0.2}
            stroke="var(--color-mine-accent-red)"
            strokeWidth={0.3}
            strokeDasharray="2"
            opacity={0.4}
          />
          <ReferenceLine
            y={-0.2}
            stroke="var(--color-mine-accent-red)"
            strokeWidth={0.3}
            strokeDasharray="2"
            opacity={0.4}
          />
          <Bar
            dataKey="correlation"
            radius={[2, 2, 0, 0]}
            opacity={0.7}
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={
                  entry.isSignificant
                    ? 'var(--color-mine-accent-red)'
                    : 'var(--color-mine-accent-teal)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Step Orthogonality ─────────────────────────────────

export function StepOrthogonality({
  orthogonality,
}: {
  orthogonality: OrthogonalityTest;
}) {
  const maxCorrColor =
    orthogonality.maxCorrelation < 0.15
      ? 'green'
      : orthogonality.maxCorrelation < 0.25
        ? 'yellow'
        : 'red';

  const independenceColor =
    orthogonality.independenceRatio > 80
      ? 'green'
      : orthogonality.independenceRatio > 65
        ? 'yellow'
        : 'red';

  return (
    <div data-slot="step-orthogonality" className="space-y-3">
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox
          label="最大相关性"
          value={orthogonality.maxCorrelation.toFixed(3)}
          color={maxCorrColor}
        />
        <StatBox label="残差 IC" value={orthogonality.residualIC.toFixed(4)} />
        <StatBox
          label="独立性"
          value={`${orthogonality.independenceRatio.toFixed(1)}%`}
          color={independenceColor}
        />
      </div>

      {/* Correlation Chart */}
      <CorrelationChart factors={orthogonality.knownFactors} />

      {/* Detailed table */}
      <div className="rounded-lg border border-mine-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">因子</TableHead>
              <TableHead className="text-[10px] text-right">相关系数</TableHead>
              <TableHead className="text-[10px] text-right">p-value</TableHead>
              <TableHead className="text-[10px] text-right">显著性</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orthogonality.knownFactors.map((f) => (
              <TableRow key={f.name}>
                <TableCell className="text-[11px] font-medium">
                  {f.name}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-[11px] font-mono tabular-nums text-right',
                    Math.abs(f.correlation) > 0.2 && 'text-mine-accent-red',
                  )}
                >
                  {f.correlation > 0 ? '+' : ''}
                  {f.correlation.toFixed(3)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {f.pValue.toFixed(3)}
                </TableCell>
                <TableCell className="text-[11px] text-right">
                  {f.pValue < 0.01 ? (
                    <span className="text-mine-accent-red">***</span>
                  ) : f.pValue < 0.05 ? (
                    <span className="text-mine-accent-yellow">**</span>
                  ) : f.pValue < 0.1 ? (
                    <span className="text-mine-muted">*</span>
                  ) : (
                    <span className="text-mine-muted">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
