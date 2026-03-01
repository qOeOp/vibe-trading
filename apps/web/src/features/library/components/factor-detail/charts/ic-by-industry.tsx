'use client';

import { useMemo } from 'react';
import { PanelSection } from '@/components/shared/panel';
import { BarVertical } from '@/lib/ngx-charts/bar-chart';
import type { DataItem } from '@/lib/ngx-charts/types';
import type { Factor } from '@/features/library/types';

/* ── Visual constants ──────────────────────────────────────── */

/** Positive IC = blue, Negative IC = red */
function buildIndustryColors(
  data: Array<{ name: string; value: number }>,
): Array<{ name: string; value: string }> {
  return data.map((d) => ({
    name: d.name,
    value: d.value >= 0 ? 'hsl(217, 91%, 65%)' : 'hsl(352, 90%, 62%)',
  }));
}

/* ── Chart Component ──────────────────────────────────────── */

function IndustryICChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  if (!data || data.length === 0) return null;

  const chartData: DataItem[] = useMemo(
    () => data.map((d) => ({ name: d.name, value: d.value })),
    [data],
  );

  const customColors = useMemo(() => buildIndustryColors(data), [data]);

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
        rotateTicks: true,
      }}
      yAxis={{
        visible: true,
        showGridLines: true,
        overlay: false,
      }}
      margins={{ top: 10, right: 10, bottom: 40, left: 0 }}
      tooltip={{ disabled: false }}
      noBarWhenZero={false}
    />
  );
}

/* ── Section Export ────────────────────────────────────────── */

interface ICByIndustrySectionProps {
  factor: Factor;
}

export function ICByIndustrySection({ factor }: ICByIndustrySectionProps) {
  return (
    <PanelSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">分行业 IC</span>
        <span className="text-[10px] text-mine-muted">申万L1</span>
      </div>
      <div className="h-[240px]">
        <IndustryICChart data={factor.icByIndustry} />
      </div>
    </PanelSection>
  );
}
