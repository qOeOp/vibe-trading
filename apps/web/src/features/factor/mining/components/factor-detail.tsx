'use client';

import * as React from 'react';
import {
  CheckCircle2,
  XCircle,
  Code2,
  Rocket,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PanelSection,
  PanelStatGrid,
  PanelStatItem,
  PanelBadgeTag,
  PanelChartBox,
} from '@/components/shared/panel';
import {
  FactorMetricGrid,
  FactorMetricItem,
} from '@/components/shared/factor-metrics';
import { pushFactorToLibrary } from '../api';
import { useLibraryStore } from '@/features/library/store/use-library-store';
import type { DiscoveredFactor } from '../types';

// ── Helpers ──────────────────────────────────────────────────────

function extractTags(description: string): string[] {
  const matches = description.match(/\[([^\]]+)\]/g);
  return matches ? matches.map((m) => m.slice(1, -1)) : [];
}

function stripTags(description: string): string {
  return description.replace(/\[([^\]]+)\]/g, '').trim();
}

// ── Component ────────────────────────────────────────────────────

interface FactorDetailProps {
  factor: DiscoveredFactor;
  taskId: string;
  factorIndex: number;
  onViewCode?: (factor: DiscoveredFactor) => void;
  className?: string;
}

function FactorDetail({
  factor,
  taskId,
  factorIndex,
  onViewCode,
  className,
  ...props
}: FactorDetailProps &
  Omit<React.ComponentProps<'div'>, keyof FactorDetailProps>) {
  const [codeExpanded, setCodeExpanded] = React.useState(false);
  const [pushState, setPushState] = React.useState<
    'idle' | 'loading' | 'done' | 'error'
  >('idle');

  // Reset push state when factor changes
  React.useEffect(() => {
    setPushState('idle');
    setCodeExpanded(false);
  }, [factor.name]);

  const tags = extractTags(factor.description);
  const cleanDesc = stripTags(factor.description);
  const m = factor.metrics;

  async function handlePush() {
    if (factorIndex < 0) return;
    setPushState('loading');
    try {
      await pushFactorToLibrary({
        taskId,
        factorIndex,
        name: factor.name,
        code: factor.code,
        hypothesis: factor.hypothesis,
        metrics: {
          ic: m.ic,
          icir: m.icir,
          arr: m.arr,
          sharpe: m.sharpe,
          maxDrawdown: m.maxDrawdown,
          turnover: m.turnover,
        },
      });
      void useLibraryStore.getState().fetchMiningFactors();
      setPushState('done');
    } catch {
      setPushState('error');
    }
  }

  return (
    <div
      data-slot="factor-detail"
      className={cn('flex flex-col overflow-y-auto', className)}
      {...props}
    >
      {/* Section 1: 因子信息 */}
      <PanelSection title="因子信息">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold numeric text-mine-text">
            {factor.name}
          </span>
          <PanelBadgeTag color={factor.accepted ? 'teal' : 'red'}>
            {factor.accepted ? '通过' : '拒绝'}
          </PanelBadgeTag>
        </div>

        <div className="text-[11px] text-mine-muted mb-1.5">
          Round {factor.generation}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <PanelBadgeTag key={tag} color="muted">
                {tag}
              </PanelBadgeTag>
            ))}
          </div>
        )}

        {factor.hypothesis && (
          <div className="text-xs text-mine-text leading-relaxed mb-1.5">
            {factor.hypothesis}
          </div>
        )}

        {cleanDesc && (
          <div className="text-[11px] text-mine-muted leading-relaxed">
            {cleanDesc}
          </div>
        )}
      </PanelSection>

      {/* Section 2: 指标 */}
      <PanelSection title="指标">
        <FactorMetricGrid variant="threshold">
          <FactorMetricItem metric="ic" value={m.ic} />
          <FactorMetricItem metric="icir" value={m.icir} />
          <FactorMetricItem metric="arr" value={m.arr} />
          <FactorMetricItem metric="sharpe" value={m.sharpe} />
          <FactorMetricItem metric="maxDrawdown" value={m.maxDrawdown} />
          <FactorMetricItem metric="turnover" value={m.turnover} />
        </FactorMetricGrid>

        {/* Rank IC — supplemental, not in core 6 */}
        <div className="mt-2 pt-2 border-t border-mine-border/30">
          <PanelStatGrid columns={2}>
            <PanelStatItem
              label="Rank IC"
              value={m.rankIc.toFixed(4)}
              color={m.rankIc > 0.03 ? 'positive' : undefined}
            />
            <PanelStatItem label="Rank ICIR" value={m.rankIcir.toFixed(3)} />
          </PanelStatGrid>
        </div>
      </PanelSection>

      {/* Section 3: 因子代码 */}
      <PanelSection title="因子代码">
        <PanelChartBox className="relative">
          <pre
            className={cn(
              'text-[11px] font-mono text-mine-text leading-relaxed p-2 overflow-x-auto',
              !codeExpanded && 'max-h-[120px] overflow-hidden',
            )}
          >
            {factor.code}
          </pre>
          {!codeExpanded && factor.code.split('\n').length > 6 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-mine-bg to-transparent" />
          )}
        </PanelChartBox>

        <div className="flex items-center gap-2 mt-2">
          {factor.code.split('\n').length > 6 && (
            <button
              type="button"
              onClick={() => setCodeExpanded((v) => !v)}
              className="flex items-center gap-1 text-[11px] text-mine-muted hover:text-mine-text transition-colors"
            >
              <ChevronDown
                className={cn(
                  'w-3 h-3 transition-transform',
                  codeExpanded && 'rotate-180',
                )}
              />
              {codeExpanded ? '收起' : '展开'}
            </button>
          )}

          {onViewCode && (
            <button
              type="button"
              onClick={() => onViewCode(factor)}
              className="flex items-center gap-1 text-[11px] text-mine-accent-teal hover:text-mine-accent-teal/80 transition-colors"
            >
              <Code2 className="w-3 h-3" />在 Lab 中打开
            </button>
          )}
        </div>
      </PanelSection>

      {/* Section 4: 公式 */}
      {factor.formulation && (
        <PanelSection title="公式">
          <PanelChartBox>
            <pre className="text-[11px] font-mono text-mine-text leading-relaxed p-2 overflow-x-auto">
              {factor.formulation}
            </pre>
          </PanelChartBox>
        </PanelSection>
      )}

      {/* Section 5: AI 评审意见 */}
      {factor.reason && (
        <PanelSection title="AI 评审意见">
          <div className="text-xs text-mine-text leading-relaxed">
            {factor.reason}
          </div>
        </PanelSection>
      )}

      {/* Section 6: 操作 */}
      {factor.accepted && (
        <PanelSection title="操作">
          <button
            type="button"
            disabled={pushState === 'loading' || pushState === 'done'}
            onClick={handlePush}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              pushState === 'done'
                ? 'bg-market-down-medium/10 text-market-down-medium cursor-default'
                : pushState === 'error'
                  ? 'bg-mine-accent-red/10 text-mine-accent-red hover:bg-mine-accent-red/20'
                  : 'bg-mine-accent-teal text-white hover:bg-mine-accent-teal/90',
              pushState === 'loading' && 'opacity-60 cursor-wait',
            )}
          >
            <Rocket className="w-3.5 h-3.5" />
            {pushState === 'idle' && '推送到 Library'}
            {pushState === 'loading' && '推送中...'}
            {pushState === 'done' && '已推送'}
            {pushState === 'error' && '推送失败，点击重试'}
          </button>
        </PanelSection>
      )}
    </div>
  );
}

export { FactorDetail };
export type { FactorDetailProps };
