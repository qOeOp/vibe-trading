'use client';

import type { Factor } from '../types';
import { FactorCard } from './factor-card';

interface FactorCardGridProps {
  factors: Factor[];
}

export function FactorCardGrid({ factors }: FactorCardGridProps) {
  if (factors.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-mine-muted">
        {'\u6CA1\u6709\u5339\u914D\u7684\u56E0\u5B50'}
      </div>
    );
  }

  return (
    <div
      data-slot="factor-card-grid"
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 p-4"
    >
      {factors.map((f) => (
        <FactorCard key={f.id} factor={f} />
      ))}
    </div>
  );
}
