'use client';

import { PanelSection } from '@/components/shared/panel';
import type { Factor } from '@/features/library/types';

function icMagnitudeColor(ic: number): string {
  const abs = Math.abs(ic);
  if (abs >= 0.05) return 'text-market-down';
  if (abs >= 0.03) return 'text-market-down-medium';
  if (abs >= 0.02) return 'text-market-flat';
  return 'text-market-up-medium';
}

function irQualityColor(ir: number): string {
  const abs = Math.abs(ir);
  if (abs >= 1.0) return 'text-market-down-medium';
  if (abs >= 0.5) return 'text-market-flat';
  return 'text-market-up-medium';
}

interface FitnessSectionProps {
  factor: Factor;
}

export function FitnessSection({ factor }: FitnessSectionProps) {
  const profile = factor.universeProfile;
  if (!profile || profile.length === 0) return null;

  const defaultPool = factor.benchmarkConfig.universe;
  const best = profile.reduce((a, b) =>
    Math.abs(b.ic) > Math.abs(a.ic) ? b : a,
  );

  return (
    <PanelSection>
      <div className="text-xs font-medium text-mine-muted mb-3 uppercase tracking-wider">
        多池适用性
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-[9px] text-mine-muted uppercase tracking-wider bg-mine-bg/50">
            <th className="text-left py-1 px-2 font-medium">股票池</th>
            <th className="text-right py-1 px-2 font-medium">IC</th>
            <th className="text-right py-1 px-2 font-medium">IR</th>
          </tr>
        </thead>
        <tbody>
          {profile.map((row) => {
            const isBest = row.universe === best.universe;
            const isDefault = row.universe === defaultPool;
            return (
              <tr
                key={row.universe}
                className={`border-t border-mine-border/30 ${isBest ? 'bg-mine-accent-teal/5' : ''}`}
                style={{
                  borderLeft: isBest ? '3px solid' : '3px solid transparent',
                }}
              >
                <td
                  className={`py-1.5 px-2 text-mine-text font-medium ${isBest ? 'border-l-mine-accent-teal' : ''}`}
                >
                  {row.universe}
                  {isDefault && (
                    <span className="ml-1.5 text-[8px] text-mine-muted bg-mine-bg px-1 py-0.5 rounded">
                      默认
                    </span>
                  )}
                  {isBest && !isDefault && (
                    <span className="ml-1.5 text-[8px] text-mine-accent-teal bg-mine-accent-teal/10 px-1 py-0.5 rounded font-semibold">
                      最佳
                    </span>
                  )}
                </td>
                <td
                  className={`py-1.5 px-2 text-right font-mono tabular-nums font-medium ${icMagnitudeColor(row.ic)}`}
                >
                  {row.ic >= 0 ? '+' : ''}
                  {row.ic.toFixed(4)}
                </td>
                <td
                  className={`py-1.5 px-2 text-right font-mono tabular-nums ${irQualityColor(row.ir)}`}
                >
                  {row.ir.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </PanelSection>
  );
}
