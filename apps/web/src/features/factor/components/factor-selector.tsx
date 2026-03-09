'use client';

import { cn } from '@/lib/utils';
import {
  TrendingUp,
  DollarSign,
  Award,
  Activity,
  BarChart2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FactorInfo, FactorCategory } from '../types';

interface FactorSelectorProps {
  factors: FactorInfo[];
  selectedFactorId: string;
  onSelectFactor: (factorId: string) => void;
}

const CATEGORY_ICONS: Record<FactorCategory, LucideIcon> = {
  momentum: TrendingUp,
  value: DollarSign,
  quality: Award,
  volatility: Activity,
  size: BarChart2,
  growth: TrendingUp,
  technical: Activity,
};

const CATEGORY_COLORS: Record<FactorCategory, string> = {
  momentum: 'var(--color-mine-accent-purple)',
  value: 'var(--color-mine-accent-amber)',
  quality: 'var(--color-factor-quality)',
  volatility: 'var(--color-mine-accent-red)',
  size: 'var(--color-mine-accent-blue)',
  growth: 'var(--color-factor-growth)',
  technical: 'var(--color-mine-accent-indigo)',
};

export function FactorSelector({
  factors,
  selectedFactorId,
  onSelectFactor,
}: FactorSelectorProps) {
  return (
    <div data-slot="factor-selector" className="flex flex-col gap-2">
      {factors.map((factor) => {
        const Icon = CATEGORY_ICONS[factor.category];
        const isSelected = factor.id === selectedFactorId;

        return (
          <button
            key={factor.id}
            onClick={() => onSelectFactor(factor.id)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg transition-all text-left',
              'border',
              isSelected
                ? 'bg-mine-bg border-mine-border shadow-sm'
                : 'bg-transparent border-transparent hover:bg-mine-bg/50',
            )}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `color-mix(in srgb, ${CATEGORY_COLORS[factor.category]} 12%, transparent)`,
              }}
            >
              <Icon
                className="w-4 h-4"
                style={{ color: CATEGORY_COLORS[factor.category] }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-mine-text truncate">
                {factor.name}
              </div>
              <div className="text-xs text-mine-muted truncate">
                {factor.description}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div
                className={cn(
                  'text-sm font-mono font-medium',
                  factor.sharpeRatio >= 1
                    ? 'text-market-down'
                    : 'text-mine-text',
                )}
              >
                {factor.sharpeRatio.toFixed(2)}
              </div>
              <div className="text-xs text-mine-muted">Sharpe</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
