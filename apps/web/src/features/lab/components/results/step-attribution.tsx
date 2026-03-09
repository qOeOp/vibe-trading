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
import type { FactorAttribution } from '@/features/lab/types';

// ─── Style Exposure Bar Chart (Recharts) ─────────────────

function ExposureChart({
  exposures,
}: {
  exposures: { name: string; exposure: number; contribution: number }[];
}) {
  const data = exposures.map((e) => ({
    name: e.name,
    exposure: e.exposure,
    isPositive: e.exposure >= 0,
  }));

  return (
    <div data-slot="exposure-chart" className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">风格因子暴露</div>
      <ResponsiveContainer
        width="100%"
        height={Math.max(exposures.length * 24, 80)}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 60 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: 'var(--color-mine-muted)' }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <ReferenceLine
            x={0}
            stroke="var(--color-mine-border)"
            strokeWidth={0.5}
            strokeDasharray="4"
          />
          <Bar
            dataKey="exposure"
            radius={[0, 3, 3, 0]}
            opacity={0.7}
            barSize={18}
            isAnimationActive={false}
            label={{
              position: 'right',
              fontSize: 9,
              fill: 'var(--color-mine-muted)',
              formatter: (v: unknown) => {
                const n = Number(v);
                return `${n > 0 ? '+' : ''}${n.toFixed(2)}`;
              },
            }}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={
                  entry.isPositive
                    ? 'var(--color-mine-accent-teal)'
                    : 'var(--color-mine-accent-red)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Industry Exposure Chart (Recharts) ──────────────────

function IndustryChart({
  industries,
}: {
  industries: { industry: string; weight: number }[];
}) {
  const top = industries.slice(0, 8);
  const data = top.map((ind) => ({
    name: ind.industry,
    weight: ind.weight,
    isPositive: ind.weight >= 0,
  }));

  return (
    <div data-slot="industry-chart" className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">行业暴露 (Top 8)</div>
      <ResponsiveContainer width="100%" height={Math.max(data.length * 18, 60)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 36, bottom: 0, left: 52 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 8, fill: 'var(--color-mine-muted)' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <ReferenceLine
            x={0}
            stroke="var(--color-mine-border)"
            strokeWidth={0.3}
            strokeDasharray="3"
          />
          <Bar
            dataKey="weight"
            radius={[0, 2, 2, 0]}
            opacity={0.6}
            barSize={14}
            isAnimationActive={false}
            label={{
              position: 'right',
              fontSize: 7,
              fill: 'var(--color-mine-muted)',
              formatter: (v: unknown) => {
                const n = Number(v);
                return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
              },
            }}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={
                  entry.isPositive
                    ? 'var(--color-mine-accent-indigo)'
                    : 'var(--color-mine-accent-amber)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Step Attribution ───────────────────────────────────

export function StepAttribution({
  attribution,
}: {
  attribution: FactorAttribution;
}) {
  const alphaColor =
    attribution.alphaIC > 0.02
      ? 'green'
      : attribution.alphaIC > 0.01
        ? 'yellow'
        : 'red';

  const r2Color =
    attribution.r2 < 50 ? 'green' : attribution.r2 < 70 ? 'yellow' : 'red';

  return (
    <div data-slot="step-attribution" className="space-y-3">
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox
          label="Alpha IC"
          value={attribution.alphaIC.toFixed(4)}
          color={alphaColor}
        />
        <StatBox
          label="风格 R²"
          value={`${attribution.r2.toFixed(1)}%`}
          color={r2Color}
        />
        <StatBox
          label="特异风险"
          value={`${attribution.specificRisk.toFixed(1)}%`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ExposureChart exposures={attribution.styleExposures} />
        <IndustryChart industries={attribution.industryExposures} />
      </div>

      {/* Style exposure table */}
      <div className="rounded-lg border border-mine-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">风格因子</TableHead>
              <TableHead className="text-[10px] text-right">暴露</TableHead>
              <TableHead className="text-[10px] text-right">贡献度</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attribution.styleExposures.map((s) => (
              <TableRow key={s.name}>
                <TableCell className="text-[11px] font-medium">
                  {s.name}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-[11px] font-mono tabular-nums text-right',
                    Math.abs(s.exposure) > 0.3 && 'text-mine-accent-yellow',
                  )}
                >
                  {s.exposure > 0 ? '+' : ''}
                  {s.exposure.toFixed(3)}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {s.contribution.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
