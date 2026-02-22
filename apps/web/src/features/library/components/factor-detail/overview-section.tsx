"use client";

import { useMemo } from "react";
import { DetailSection } from "@/components/shared/detail-panel";
import { RadarChart } from "@/lib/ngx-charts/radar-chart";
import {
  computeRadarScores,
  radarScoresToValues,
  RADAR_LABELS,
} from "@/features/library/utils/compute-radar-scores";
import type { Factor } from "@/features/library/types";

// ─── V-Score Indicator ──────────────────────────────────

function VScoreIndicator({ vScore }: { vScore: number }) {
  const config = useMemo(() => {
    if (vScore < -1) {
      return {
        label: "低估",
        colorClass: "text-blue-500",
        bgClass: "bg-blue-500/8",
      };
    }
    if (vScore > 1) {
      return {
        label: "拥挤风险",
        colorClass: "text-mine-accent-yellow",
        bgClass: "bg-mine-accent-yellow/8",
      };
    }
    return {
      label: "正常",
      colorClass: "text-mine-muted",
      bgClass: "bg-mine-muted/6",
    };
  }, [vScore]);

  return (
    <div
      data-slot="vscore-indicator"
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md ${config.bgClass}`}
    >
      <span className="text-[10px] text-mine-muted">V-Score</span>
      <span
        className={`text-[11px] font-bold font-mono tabular-nums ${config.colorClass}`}
      >
        {vScore >= 0 ? "+" : ""}
        {vScore.toFixed(2)}
      </span>
      <span
        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${config.bgClass} ${config.colorClass}`}
      >
        {config.label}
      </span>
    </div>
  );
}

// ─── Overview Section ───────────────────────────────────

interface OverviewSectionProps {
  factor: Factor;
}

export function OverviewSection({ factor }: OverviewSectionProps) {
  const scores = useMemo(() => computeRadarScores(factor), [factor]);
  const values = useMemo(() => radarScoresToValues(scores), [scores]);

  return (
    <DetailSection title="综合概览">
      {/* V-Score at top */}
      <VScoreIndicator vScore={factor.vScore} />

      {/* 7-dimension radar below — full width of panel */}
      <div className="mt-3">
        <RadarChart
          labels={[...RADAR_LABELS]}
          values={values}
          size={320}
          fillColor="#26a69a"
          fillOpacity={0.18}
          strokeColor="#26a69a"
        />
      </div>
    </DetailSection>
  );
}
