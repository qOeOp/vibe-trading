'use client';

import * as React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import {
  METRIC_CONFIGS,
  formatMetricValue,
  getThresholdTier,
  tierLabel,
} from './metric-configs';
import { ThresholdBar } from './threshold-bar';
import { DistributionBar } from './distribution-bar';
import { useFactorMetricContext } from './factor-metric-grid';
import type { MetricKey } from './metric-configs';

// ── Mock history generator ─────────────────────────────────────

function generateMockHistory(currentValue: number, length = 90): number[] {
  const result: number[] = [];
  let v = currentValue * 0.7;
  for (let i = 0; i < length; i++) {
    v += (Math.random() - 0.48) * Math.abs(currentValue) * 0.4;
    v = v * 0.95 + currentValue * 0.05;
    result.push(v);
  }
  result[result.length - 1] = currentValue;
  return result;
}

// ── Mini bar chart for IC/ICIR tooltip ────────────────────────

function MiniBarChart({
  values,
  thresholds,
}: {
  values: number[];
  thresholds: number[];
}) {
  const max = Math.max(...values.map(Math.abs), 0.001);
  const chartH = 36;
  const barW = 3;
  const gap = 1;

  return (
    <svg width={values.length * (barW + gap)} height={chartH} className="block">
      {/* Threshold lines */}
      {thresholds.map((t, i) => {
        const y = chartH / 2 - (t / max) * (chartH / 2);
        return (
          <line
            key={i}
            x1={0}
            x2={values.length * (barW + gap)}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.25)"
            strokeDasharray="2,2"
            strokeWidth={0.5}
          />
        );
      })}
      {/* Zero line */}
      <line
        x1={0}
        x2={values.length * (barW + gap)}
        y1={chartH / 2}
        y2={chartH / 2}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.5}
      />
      {/* Bars */}
      {values.map((v, i) => {
        const positive = v >= 0;
        const h = Math.max(1, (Math.abs(v) / max) * (chartH / 2 - 2));
        const y = positive ? chartH / 2 - h : chartH / 2;
        const color = positive ? 'rgba(207,48,74,0.7)' : 'rgba(11,140,95,0.7)';
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={y}
            width={barW}
            height={h}
            fill={color}
            rx={0.5}
          />
        );
      })}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────

interface FactorMetricItemProps {
  metric: MetricKey;
  value: number;
  history?: number[];
  className?: string;
}

function FactorMetricItem({
  metric,
  value,
  history,
  className,
}: FactorMetricItemProps) {
  const config = METRIC_CONFIGS[metric];
  const { variant, distributionData } = useFactorMetricContext();
  const allValues = distributionData?.[metric];
  const hasDistribution =
    variant === 'distribution' && allValues && allValues.length > 0;
  const showHistoryTooltip = metric === 'ic' || metric === 'icir';
  const tier = getThresholdTier(
    value,
    config.thresholds,
    config.higherIsBetter,
  );
  const formattedValue = formatMetricValue(value, config.fmt);

  const resolvedHistory = React.useMemo(
    () => history ?? (showHistoryTooltip ? generateMockHistory(value) : []),
    [history, showHistoryTooltip, value],
  );

  const bar = hasDistribution ? (
    <DistributionBar value={value} allValues={allValues} config={config} />
  ) : (
    <ThresholdBar value={value} config={config} />
  );

  const tooltipContent = showHistoryTooltip ? (
    <div className="space-y-1.5">
      <div className="text-[10px] text-white/50 uppercase tracking-wider">
        {config.label} · 近90日滚动
      </div>
      <MiniBarChart values={resolvedHistory} thresholds={config.thresholds} />
      <div className="flex items-center justify-between text-[10px] pt-0.5">
        <span className="text-white/60">
          当前 <span className="text-white font-mono">{formattedValue}</span>
        </span>
        {config.thresholds.length >= 2 && (
          <span className="text-white/40">
            合格 {config.thresholds[0]}
            {'  '}优秀 {config.thresholds[1]}
          </span>
        )}
      </div>
    </div>
  ) : (
    <div className="space-y-0.5">
      <div className="text-[11px] text-white font-mono">
        {formattedValue}
        <span className="ml-1.5 text-[10px] text-white/50">
          {tierLabel(tier)}
        </span>
      </div>
      {config.thresholds.length >= 1 && (
        <div className="text-[10px] text-white/40">
          合格 ≥ {formatMetricValue(config.thresholds[0], config.fmt)}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            data-slot="factor-metric-item"
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg',
              'hover:bg-mine-bg/80 transition-colors cursor-default',
              className,
            )}
          >
            {/* Value */}
            <span className="text-sm font-bold font-mono tabular-nums text-mine-text">
              {formattedValue}
            </span>
            {/* Bar */}
            <div className="w-full">{bar}</div>
            {/* Label */}
            <span className="text-[9px] font-medium text-mine-muted uppercase tracking-wider">
              {config.label}
            </span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            className="z-50 rounded-lg border border-mine-border bg-zinc-900/95 px-3 py-2.5 shadow-md max-w-[220px]"
            sideOffset={6}
          >
            {tooltipContent}
            <Tooltip.Arrow className="fill-zinc-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export { FactorMetricItem };
export type { FactorMetricItemProps };
