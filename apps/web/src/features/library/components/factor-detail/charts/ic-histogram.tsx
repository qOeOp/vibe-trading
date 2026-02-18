"use client";

import { useMemo } from "react";
import { DetailSection } from "@/components/shared/detail-panel";
import { BarVertical } from "@/lib/ngx-charts/bar-chart";
import type { DataItem } from "@/lib/ngx-charts/types";
import type { Factor } from "../../../types";

/* ── Visual constants ──────────────────────────────────────── */

/** Teal with lightness graded by distance from center — emphasises distribution tails (solid colors) */
function buildBinColors(binCount: number): Array<{ name: string; value: string }> {
  const colors: Array<{ name: string; value: string }> = [];
  for (let i = 0; i < binCount; i++) {
    const distFromCenter = Math.abs(i - binCount / 2) / (binCount / 2);
    // Center bins → lighter teal, tail bins → deeper teal
    // Lightness from 75% (center) to 42% (tails)
    const lightness = Math.round(75 - distFromCenter * 33);
    colors.push({
      name: String(i + 1),
      value: `hsl(174, 63%, ${lightness}%)`,
    });
  }
  return colors;
}

/* ── Chart Component ──────────────────────────────────────── */

function ICHistogramChart({
  bins,
}: {
  bins: number[];
}) {
  if (!bins || bins.length === 0) return null;

  const chartData: DataItem[] = useMemo(
    () =>
      bins.map((count, i) => ({
        name: String(i + 1),
        value: count,
      })),
    [bins],
  );

  const customColors = useMemo(() => buildBinColors(bins.length), [bins.length]);

  /** Sparse X ticks — show every 5th bin */
  const xAxisTicks = useMemo(() => {
    const ticks: string[] = [];
    for (let i = 0; i < bins.length; i += 5) {
      ticks.push(String(i + 1));
    }
    return ticks;
  }, [bins.length]);

  return (
    <BarVertical
      data={chartData}
      customColors={customColors}
      animated
      roundEdges
      barPadding={2}
      xAxis={{
        visible: true,
        showGridLines: false,
        ticks: xAxisTicks,
        rotateTicks: false,
      }}
      yAxis={{
        visible: true,
        showGridLines: true,
        overlay: false,
      }}
      margins={{ top: 10, right: 10, bottom: 20, left: 0 }}
      tooltip={{ disabled: false }}
      noBarWhenZero={false}
    />
  );
}

/* ── Section Export ────────────────────────────────────────── */

interface ICHistogramSectionProps {
  factor: Factor;
}

export function ICHistogramSection({ factor }: ICHistogramSectionProps) {
  return (
    <DetailSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">IC 分布直方图</span>
        <span className="text-[10px] text-mine-muted">20-bin</span>
      </div>
      <div className="h-[150px]">
        <ICHistogramChart bins={factor.icHistogramBins} />
      </div>
    </DetailSection>
  );
}
