"use client";

import { useMemo } from "react";
import { curveLinear } from "d3-shape";
import { AreaChartStacked, type MultiSeries, ScaleType } from "@/lib/ngx-charts";
import type { HoldingCompositionPoint } from "../types";
import { HOLDING_SECTORS, SECTOR_COLOR_MAP } from "../types";

const SECTOR_COLORS: Array<{ name: string; value: string }> = HOLDING_SECTORS.map(
  (name) => ({ name, value: SECTOR_COLOR_MAP[name] ?? "#76808E" }),
);

/** Legend items for external rendering (excludes "Other") */
export const HOLDING_COMPOSITION_LEGEND = SECTOR_COLORS
  .filter((c) => c.name !== "Other")
  .map((c) => ({ label: c.name, color: c.value }));

interface HoldingCompositionChartProps {
  data: HoldingCompositionPoint[];
  activeEntries?: Array<{ name: string }>;
}

export function HoldingCompositionChart({ data, activeEntries = [] }: HoldingCompositionChartProps) {
  const chartData: MultiSeries = useMemo(() => {
    return HOLDING_SECTORS.map((sector) => ({
      name: sector,
      series: data.map((d) => ({
        name: new Date(d.date),
        value: d[sector],
      })),
    }));
  }, [data]);

  return (
    <AreaChartStacked
      data={chartData}
      colorScheme="cool"
      scaleType={ScaleType.Time}
      colors={SECTOR_COLORS}
      curve={curveLinear}
      animated={true}
      gradient={false}
      roundDomains={false}
      activeItems={activeEntries}
      xAxis={{
        visible: false,
        showGridLines: false,
        showLabel: false,
      }}
      yAxis={{
        visible: false,
        showGridLines: false,
        showLabel: false,
        minScale: 0,
        maxScale: 100,
      }}
      legend={{
        visible: false,
      }}
      tooltip={{
        disabled: false,
      }}
      margins={[0, 0, 0, 0]}
    />
  );
}
