"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DetailPanel } from "@/components/shared/detail-panel";
import { useLibraryStore } from "../../store/use-library-store";
import type { Factor } from "../../types";

import { IdentityHeader } from "./identity-header";
import { OverviewSection } from "./overview-section";
import { StatisticsSection } from "./statistics-section";
import { ICTimeSeriesSection } from "./charts/ic-time-series";
import { ICHistogramSection } from "./charts/ic-histogram";
import { LongShortEquitySection } from "./charts/long-short-equity";
import { ICDecayProfileSection } from "./charts/ic-decay-profile";
import { FitnessSection } from "./fitness-section";
import { RobustnessSection } from "./robustness-section";
import { ICStatsCollapsible } from "./ic-stats-collapsible";
import { StatusActionsSection } from "./status-actions";

interface FactorDetailPanelProps {
  factor: Factor;
}

export function FactorDetailPanel({ factor }: FactorDetailPanelProps) {
  const selectFactor = useLibraryStore((s) => s.selectFactor);

  return (
    <DetailPanel
      title="因子详情"
      onClose={() => selectFactor(null)}
      className="h-full w-full"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={factor.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Header: Identity Card */}
          <IdentityHeader factor={factor} />

          {/* Layer 1: Quick Assessment */}
          <OverviewSection factor={factor} />

          {/* Layer 2: Core Statistics */}
          <StatisticsSection factor={factor} />

          {/* Layer 3: Deep Charts */}
          <ICTimeSeriesSection factor={factor} />
          <ICHistogramSection factor={factor} />
          <LongShortEquitySection factor={factor} />
          <ICDecayProfileSection factor={factor} />

          {/* Layer 4: Supplementary */}
          <FitnessSection factor={factor} />
          <RobustnessSection factor={factor} />
          <ICStatsCollapsible factor={factor} />
          <StatusActionsSection factor={factor} />
        </motion.div>
      </AnimatePresence>
    </DetailPanel>
  );
}
