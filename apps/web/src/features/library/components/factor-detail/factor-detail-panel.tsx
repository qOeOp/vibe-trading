'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  PanelFrame,
  PanelFrameHeader,
  PanelFrameBody,
} from '@/components/shared/panel';
import { useLibraryStore } from '@/features/library/store/use-library-store';
import type { Factor } from '@/features/library/types';

import { IdentityHeader } from './identity-header';
import { OverviewSection } from './overview-section';
import { StatisticsSection } from './statistics-section';

/* ── 趋势与持续性 ── */
import { ICTimeSeriesSection } from './charts/ic-time-series';
import { ICCumulativeSection } from './charts/ic-cumulative';
import { ICMonthlyHeatmapSection } from './charts/ic-monthly-heatmap';

/* ── 因子有效性验证 ── */
import { QuantileCumulativeReturnsSection } from './charts/quantile-cumulative-returns';
import { LongShortEquitySection } from './charts/long-short-equity';
import { LongShortSpreadSection } from './charts/long-short-spread';

/* ── 信号特征 ── */
import { ICDecayProfileSection } from './charts/ic-decay-profile';
import { ICHistogramSection } from './charts/ic-histogram';
import { ICQQPlotSection } from './charts/ic-qq-plot';

/* ── 维度分析 ── */
import { ICByIndustrySection } from './charts/ic-by-industry';
import { RankAutocorrelationSection } from './charts/rank-autocorrelation';
import { QuantileTurnoverSection } from './charts/quantile-turnover';

/* ── 补充 ── */
import { FitnessSection } from './fitness-section';
import { RobustnessSection } from './robustness-section';
import { ICStatsCollapsible } from './ic-stats-collapsible';
import { StatusActionsSection } from './status-actions';

interface FactorDetailPanelProps {
  factor: Factor;
}

export function FactorDetailPanel({ factor }: FactorDetailPanelProps) {
  const selectFactor = useLibraryStore((s) => s.selectFactor);

  return (
    <PanelFrame className="h-full w-full">
      <PanelFrameHeader title="因子详情" onClose={() => selectFactor(null)} />
      <PanelFrameBody>
        <AnimatePresence mode="wait">
          <motion.div
            key={factor.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header: Identity Card */}
            <IdentityHeader factor={factor} />

            {/* Layer 1: Quick Assessment */}
            <OverviewSection factor={factor} />

            {/* Layer 2: Core Statistics */}
            <StatisticsSection factor={factor} />

            {/* ── 因子有效性验证 ── */}
            <QuantileCumulativeReturnsSection factor={factor} />

            {/* ── 趋势与持续性 ── */}
            <ICTimeSeriesSection factor={factor} />
            <ICCumulativeSection factor={factor} />
            <ICMonthlyHeatmapSection factor={factor} />

            {/* ── 多空验证 ── */}
            <LongShortEquitySection factor={factor} />
            <LongShortSpreadSection factor={factor} />

            {/* ── 信号特征 ── */}
            <ICDecayProfileSection factor={factor} />
            <ICHistogramSection factor={factor} />
            <ICQQPlotSection factor={factor} />

            {/* ── 维度分析 ── */}
            <ICByIndustrySection factor={factor} />
            <RankAutocorrelationSection factor={factor} />
            <QuantileTurnoverSection factor={factor} />

            {/* ── 补充 ── */}
            <FitnessSection factor={factor} />
            <RobustnessSection factor={factor} />
            <ICStatsCollapsible factor={factor} />
            <StatusActionsSection factor={factor} />
          </motion.div>
        </AnimatePresence>
      </PanelFrameBody>
    </PanelFrame>
  );
}
