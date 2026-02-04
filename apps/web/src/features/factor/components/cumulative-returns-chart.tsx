"use client";

import { useMemo } from "react";
import { NgxAreaChart } from "@/components/charts/ngx-area-chart";
import type { AreaChartSeries } from "@/components/charts/ngx-area-chart";
import type { CumulativeReturnPoint } from "../types";

interface CumulativeReturnsChartProps {
  data: CumulativeReturnPoint[];
  showLongShort?: boolean;
}

// ngx-charts inspired colors
const COLOR_SCHEME = {
  domain: ["#7aa3e5", "#a8385d"], // Soft blue (Best), Pink/rose (Worst)
};

export function CumulativeReturnsChart({ data }: CumulativeReturnsChartProps) {
  // Transform data to ngx-charts format
  const chartData: AreaChartSeries[] = useMemo(() => {
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
    <NgxAreaChart
      results={chartData}
      legend={true}
      legendTitle=""
      xAxis={true}
      yAxis={true}
      showGridLines={true}
      gradient={true}
      scheme={COLOR_SCHEME}
      animations={true}
      autoScale={false}
      xAxisTickFormatting={(value: Date) =>
        value.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }
      yAxisTickFormatting={(value: number) => `${value}%`}
    />
  );
}
