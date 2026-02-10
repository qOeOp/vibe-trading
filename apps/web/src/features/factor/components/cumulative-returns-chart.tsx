"use client";

import { useMemo } from "react";
import { curveLinear } from "d3-shape";
import { AreaChart } from "@/lib/ngx-charts";
import type { MultiSeries } from "@/lib/ngx-charts";
import type { CumulativeReturnPoint } from "../types";

/** Legend items for external rendering */
export const CUMULATIVE_RETURNS_LEGEND = [
  { label: "Q5 (Best)", color: "#a8385d" },
  { label: "Q1 (Worst)", color: "#7aa3e5" },
];

interface CumulativeReturnsChartProps {
  data: CumulativeReturnPoint[];
  /** Externally controlled active entries for legend highlight interaction */
  activeEntries?: Array<{ name: string }>;
}

export function CumulativeReturnsChart({ data, activeEntries = [] }: CumulativeReturnsChartProps) {
  // Transform data to ngx-charts MultiSeries format
  const chartData: MultiSeries = useMemo(() => {
    const q5Series = {
      name: "Q5 (Best)",
      series: data.map((d) => ({
        name: new Date(d.date),
        value: Number((d.quantile5 * 100).toFixed(2)),
      })),
    };

    const q1Series = {
      name: "Q1 (Worst)",
      series: data.map((d) => ({
        name: new Date(d.date),
        value: Number((d.quantile1 * 100).toFixed(2)),
      })),
    };

    return [q5Series, q1Series];
  }, [data]);

  return (
    <AreaChart
      data={chartData}
      colorScheme="cool"
      curve={curveLinear}
      animated={true}
      gradient={true}
      autoScale={false}
      activeItems={activeEntries}
      xAxis={{
        visible: true,
        showGridLines: false,
        showLabel: false,
        tickFormatting: (value: unknown) => {
          if (value instanceof Date) {
            return value.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }
          return String(value);
        },
      }}
      yAxis={{
        visible: true,
        showGridLines: true,
        gridLineStrokeDasharray: "6 4",
        showLabel: false,
        tickFormatting: (value: unknown) => `${value}%`,
      }}
      legend={{
        visible: false,
      }}
      tooltip={{
        disabled: false,
      }}
    />
  );
}
