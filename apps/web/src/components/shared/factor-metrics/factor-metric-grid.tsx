'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { MetricKey } from './metric-configs';

// ── Context ────────────────────────────────────────────────────

export type FactorMetricVariant = 'distribution' | 'threshold';

export type DistributionData = Partial<Record<MetricKey, number[]>>;

interface FactorMetricContextValue {
  variant: FactorMetricVariant;
  distributionData?: DistributionData;
}

const FactorMetricContext = React.createContext<FactorMetricContextValue>({
  variant: 'threshold',
});

export function useFactorMetricContext() {
  return React.useContext(FactorMetricContext);
}

// ── Mock distribution generator ────────────────────────────────

export function generateMockDistribution(
  center: number,
  spread: number,
  count = 80,
): number[] {
  return Array.from({ length: count }, () => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return center + z * spread;
  });
}

// ── Component ──────────────────────────────────────────────────

interface FactorMetricGridProps {
  variant?: FactorMetricVariant;
  distributionData?: DistributionData;
  children: React.ReactNode;
  className?: string;
}

function FactorMetricGrid({
  variant = 'threshold',
  distributionData,
  children,
  className,
}: FactorMetricGridProps) {
  const ctx = React.useMemo(
    () => ({ variant, distributionData }),
    [variant, distributionData],
  );

  return (
    <FactorMetricContext.Provider value={ctx}>
      <div
        data-slot="factor-metric-grid"
        className={cn('grid grid-cols-3 gap-1', className)}
      >
        {children}
      </div>
    </FactorMetricContext.Provider>
  );
}

export { FactorMetricGrid };
export type { FactorMetricGridProps };
