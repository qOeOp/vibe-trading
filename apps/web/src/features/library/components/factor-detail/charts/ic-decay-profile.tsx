"use client";

import { useMemo } from "react";
import { DetailSection } from "@/components/shared/detail-panel";
import { BarVertical } from "@/lib/ngx-charts/bar-chart";
import type { DataItem } from "@/lib/ngx-charts/types";
import type { Factor } from "../../../types";

/* ── Visual constants ──────────────────────────────────────── */

/** Blue for positive IC, red for negative — lightness graded by magnitude (solid colors) */
function buildDecayColors(data: number[]): Array<{ name: string; value: string }> {
  const maxAbs = Math.max(...data.map(Math.abs), 0.001);
  return data.map((ic, i) => {
    // t ranges 0→1 where 1 = strongest magnitude
    const t = Math.abs(ic) / maxAbs;
    // Interpolate lightness: weak values → lighter, strong values → more saturated
    // Blue: from hsl(217, 91%, 82%) to hsl(217, 91%, 60%)
    // Red:  from hsl(352, 90%, 78%) to hsl(352, 90%, 58%)
    const lightness = ic >= 0
      ? Math.round(82 - t * 22)   // blue: 82% → 60%
      : Math.round(78 - t * 20);  // red:  78% → 58%
    return {
      name: `T+${i + 1}`,
      value: ic >= 0
        ? `hsl(217, 91%, ${lightness}%)`
        : `hsl(352, 90%, ${lightness}%)`,
    };
  });
}

/* ── Chart Component ──────────────────────────────────────── */

function ICDecayChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const chartData: DataItem[] = useMemo(
    () =>
      data.map((ic, i) => ({
        name: `T+${i + 1}`,
        value: ic,
      })),
    [data],
  );

  const customColors = useMemo(() => buildDecayColors(data), [data]);

  /** Show sparse tick labels at T+1, T+5, T+10, T+15, T+20 */
  const xAxisTicks = useMemo(() => {
    const indices = [0, 4, 9, 14, 19];
    return indices
      .filter((i) => i < data.length)
      .map((i) => `T+${i + 1}`);
  }, [data.length]);

  return (
    <BarVertical
      data={chartData}
      customColors={customColors}
      animated
      roundEdges
      barPadding={4}
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

interface ICDecayProfileSectionProps {
  factor: Factor;
}

export function ICDecayProfileSection({ factor }: ICDecayProfileSectionProps) {
  return (
    <DetailSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">IC 衰减剖面</span>
        <span className="text-[10px] text-mine-muted">Lag T+1 ~ T+20</span>
      </div>
      <div className="h-[150px]">
        <ICDecayChart data={factor.icDecayProfile} />
      </div>
    </DetailSection>
  );
}
