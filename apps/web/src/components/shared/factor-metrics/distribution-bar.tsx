'use client';

import * as React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import { valueToPosition } from './metric-configs';
import type { MetricConfig } from './metric-configs';

// ── Pure Functions (exported for testing) ──────────────────────

export interface Bin {
  min: number;
  max: number;
  count: number;
  normalizedCount: number;
}

export function computeBins(
  values: number[],
  domain: [number, number],
  binCount: number,
): Bin[] {
  const [min, max] = domain;
  const binWidth = (max - min) / binCount;
  const counts = Array(binCount).fill(0);

  for (const v of values) {
    const raw = (v - min) / binWidth;
    const idx = Math.max(0, Math.min(Math.ceil(raw) - 1, binCount - 1));
    if (idx >= 0 && idx < binCount) counts[idx]++;
  }

  const maxCount = Math.max(...counts, 1);

  return counts.map((count, i) => ({
    min: min + i * binWidth,
    max: min + (i + 1) * binWidth,
    count,
    normalizedCount: count / maxCount,
  }));
}

export function getPercentile(value: number, values: number[]): number {
  if (values.length === 0) return 0;
  const below = values.filter((v) => v < value).length;
  return Math.round((below / values.length) * 100);
}

// ── Component ──────────────────────────────────────────────────

const BIN_COUNT = 20;

interface DistributionBarProps {
  value: number;
  allValues: number[];
  config: MetricConfig;
  className?: string;
}

function DistributionBar({
  value,
  allValues,
  config,
  className,
}: DistributionBarProps) {
  const { domain, thresholds } = config;
  const bins = React.useMemo(
    () => computeBins(allValues, domain, BIN_COUNT),
    [allValues, domain],
  );
  const percentile = React.useMemo(
    () => getPercentile(value, allValues),
    [value, allValues],
  );
  const tickPos = valueToPosition(value, domain);
  const thresholdPositions = thresholds.map((t) => valueToPosition(t, domain));

  return (
    <Tooltip.Provider delayDuration={150}>
      <div
        data-slot="distribution-bar"
        className={cn(
          'relative h-1 flex items-stretch gap-px overflow-visible',
          className,
        )}
      >
        {/* Density bins */}
        {bins.map((bin, i) => {
          const isCurrentBin = value >= bin.min && value < bin.max;
          const opacity = 0.08 + bin.normalizedCount * 0.77;

          return (
            <Tooltip.Root key={i}>
              <Tooltip.Trigger asChild>
                <div
                  className="flex-1 h-full rounded-[1px] cursor-default"
                  style={{
                    backgroundColor: `color-mix(in oklch, var(--color-mine-accent-teal) ${(opacity * 100).toFixed(0)}%, transparent)`,
                    outline: isCurrentBin
                      ? '1px solid color-mix(in oklch, var(--color-mine-accent-teal) 60%, transparent)'
                      : 'none',
                  }}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  className="z-50 rounded-lg border border-mine-border bg-zinc-900/95 px-2.5 py-2 shadow-md"
                  sideOffset={4}
                >
                  <div className="text-[10px] text-white/60 font-mono">
                    {bin.min.toFixed(3)} – {bin.max.toFixed(3)}
                  </div>
                  <div className="text-[11px] text-white font-medium mt-0.5">
                    {bin.count} 个因子
                  </div>
                  {isCurrentBin && (
                    <div className="text-[10px] text-mine-accent-teal mt-0.5">
                      当前因子在此区间
                    </div>
                  )}
                  <Tooltip.Arrow className="fill-zinc-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}

        {/* Threshold lines */}
        {thresholdPositions.map((pos, i) => (
          <div
            key={i}
            className="absolute top-[-1px] bottom-[-1px] w-px bg-mine-muted/50 pointer-events-none"
            style={{ left: `${pos * 100}%` }}
          />
        ))}

        {/* Current value tick */}
        <div
          className="absolute top-[-2px] bottom-[-2px] w-px bg-mine-text/80 pointer-events-none"
          style={{ left: `${tickPos * 100}%` }}
        />

        {/* Percentile for screen readers */}
        <span className="sr-only">第 {percentile} 分位</span>
      </div>
    </Tooltip.Provider>
  );
}

export { DistributionBar };
export type { DistributionBarProps };
