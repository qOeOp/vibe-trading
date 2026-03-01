'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  valueToPosition,
  tierToColorClass,
  getThresholdTier,
} from './metric-configs';
import type { MetricConfig } from './metric-configs';

interface ThresholdBarProps {
  value: number;
  config: MetricConfig;
  className?: string;
}

function ThresholdBar({ value, config, className }: ThresholdBarProps) {
  const { domain, thresholds, higherIsBetter } = config;
  const fillPos = valueToPosition(value, domain);
  const tier = getThresholdTier(value, thresholds, higherIsBetter);

  const thresholdPositions = thresholds.map((t) => valueToPosition(t, domain));

  return (
    <div
      data-slot="threshold-bar"
      className={cn(
        'relative h-1 rounded-full bg-mine-border/30 overflow-visible',
        className,
      )}
    >
      {/* Fill */}
      <div
        className={cn(
          'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
          tierToColorClass(tier),
        )}
        style={{ width: `${fillPos * 100}%` }}
      />

      {/* Threshold lines */}
      {thresholdPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute top-[-1px] bottom-[-1px] w-px bg-mine-muted/50"
          style={{ left: `${pos * 100}%` }}
        />
      ))}

      {/* Current value tick */}
      <div
        className="absolute top-[-2px] bottom-[-2px] w-px bg-mine-text/80"
        style={{ left: `${fillPos * 100}%` }}
      />
    </div>
  );
}

export { ThresholdBar };
export type { ThresholdBarProps };
