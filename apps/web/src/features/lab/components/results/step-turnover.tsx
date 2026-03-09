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
import type { TurnoverAnalysis } from '@/features/lab/types';
import { StatBox } from './stat-box';

// ─── Turnover Time Series (Recharts) ─────────────────────

function TurnoverTimeSeries({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ day: i, turnover: v }));
  const avg = data.reduce((a, b) => a + b, 0) / data.length;

  return (
    <div data-slot="turnover-time-series" className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-1">
        日换手率时序 (240 日)
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart
          data={chartData}
          margin={{ top: 2, right: 2, bottom: 0, left: 2 }}
        >
          <XAxis dataKey="day" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <ReferenceLine
            y={avg}
            stroke="var(--color-mine-border)"
            strokeWidth={0.5}
            strokeDasharray="4"
          />
          <Line
            type="linear"
            dataKey="turnover"
            stroke="var(--color-mine-accent-purple)"
            strokeWidth={1.2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Cost Impact Visualization ──────────────────────────

function CostImpactBar({
  grossIC,
  netIC,
  costDecayRatio,
}: {
  grossIC: number;
  netIC: number;
  costDecayRatio: number;
}) {
  const netRatio = netIC / (grossIC || 0.001);
  const netWidth = Math.max(0, Math.min(100, netRatio * 100));
  const costWidth = 100 - netWidth;

  return (
    <div data-slot="cost-impact-bar" className="bg-mine-bg rounded-md p-2">
      <div className="text-[10px] text-mine-muted mb-2">IC 成本侵蚀</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-5 bg-mine-border/30 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-mine-accent-green/70 rounded-l-full transition-all"
            style={{ width: `${netWidth}%` }}
          />
          <div
            className="h-full bg-mine-accent-red/40 rounded-r-full transition-all"
            style={{ width: `${costWidth}%` }}
          />
        </div>
        <span className="text-[10px] font-mono tabular-nums text-mine-muted shrink-0">
          {costDecayRatio.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[9px] text-mine-accent-green">
          净 IC: {netIC.toFixed(4)}
        </span>
        <span className="text-[9px] text-mine-accent-red">成本侵蚀</span>
      </div>
    </div>
  );
}

// ─── Step Turnover ──────────────────────────────────────

export function StepTurnover({
  turnover,
  grossIC,
}: {
  turnover: TurnoverAnalysis;
  grossIC: number;
}) {
  const costColor =
    turnover.costDecayRatio < 50
      ? 'green'
      : turnover.costDecayRatio < 70
        ? 'yellow'
        : 'red';

  const netICColor =
    turnover.netICAfterCost > 0.015
      ? 'green'
      : turnover.netICAfterCost > 0.005
        ? 'yellow'
        : 'red';

  return (
    <div data-slot="step-turnover" className="space-y-3">
      {/* KPI Row */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <StatBox
          label="日换手率"
          value={`${turnover.dailyTurnover.toFixed(1)}%`}
        />
        <StatBox label="年换手率" value={`${turnover.annualTurnover}%`} />
        <StatBox
          label="估算成本"
          value={`${turnover.estimatedCostBps} bps`}
          color={costColor}
        />
        <StatBox
          label="净 IC"
          value={turnover.netICAfterCost.toFixed(4)}
          color={netICColor}
        />
        <StatBox label="盈亏平衡" value={`${turnover.breakEvenCost} bps`} />
      </div>

      {/* Cost Impact */}
      <CostImpactBar
        grossIC={grossIC}
        netIC={turnover.netICAfterCost}
        costDecayRatio={turnover.costDecayRatio}
      />

      {/* Turnover time series */}
      <TurnoverTimeSeries data={turnover.turnoverTimeSeries} />

      {/* Period breakdown table */}
      <div className="rounded-lg border border-mine-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">周期</TableHead>
              <TableHead className="text-[10px] text-right">换手率</TableHead>
              <TableHead className="text-[10px] text-right">
                单次成本 (bps)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turnover.byPeriod.map((p) => (
              <TableRow key={p.period}>
                <TableCell className="text-[11px] font-medium">
                  {p.period}
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {p.turnover.toFixed(2)}%
                </TableCell>
                <TableCell className="text-[11px] font-mono tabular-nums text-right">
                  {p.cost.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
