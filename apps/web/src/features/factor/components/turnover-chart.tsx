"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import type { TurnoverDataPoint } from "../types";

interface TurnoverChartProps {
  data: TurnoverDataPoint[];
}

const COLORS = {
  "1D": { main: "#3b82f6", light: "#93c5fd" },  // Blue
  "5D": { main: "#8b5cf6", light: "#c4b5fd" },  // Purple
  "10D": { main: "#0B8C5F", light: "#58CEAA" }, // Green
  grid: "#e0ddd8",
  axis: "#8a8a8a",
  text: "#1a1a1a",
  tooltipBg: "rgba(30, 30, 30, 0.95)",
};

const PERIOD_KEYS = ["1D", "5D", "10D"] as const;

const margin = { top: 36, right: 16, bottom: 44, left: 44 };

export function TurnoverChart({ data }: TurnoverChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        quantile: `Q${d.quantile}`,
        "1D": d.turnover1D * 100,
        "5D": d.turnover5D * 100,
        "10D": d.turnover10D * 100,
      })),
    [data]
  );

  const drawChart = useCallback(() => {
    if (!svgRef.current || !containerRef.current || chartData.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = svg.append("g").attr("class", "chart-root");

    // Scales
    const xScale = d3.scaleBand()
      .domain(chartData.map((d) => d.quantile))
      .range([0, innerWidth])
      .padding(0.2);

    const groupScale = d3.scaleBand()
      .domain(PERIOD_KEYS as unknown as string[])
      .range([0, xScale.bandwidth()])
      .padding(0.08);

    const allValues = chartData.flatMap((d) => [d["1D"], d["5D"], d["10D"]]);
    const maxVal = Math.max(...allValues);

    const yScale = d3.scaleLinear()
      .domain([0, maxVal * 1.15])
      .range([innerHeight, 0])
      .nice();

    // ============ DEFS ============
    const defs = svg.append("defs");

    // Gradients for each period
    PERIOD_KEYS.forEach((period) => {
      const colors = COLORS[period];
      const gradient = defs.append("linearGradient")
        .attr("id", `turnover-grad-${period}`)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
      gradient.append("stop").attr("offset", "0%").attr("stop-color", colors.main);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", colors.light);
    });

    // Shadow filter
    const shadow = defs.append("filter")
      .attr("id", "turnover-shadow")
      .attr("x", "-30%").attr("y", "-30%")
      .attr("width", "160%").attr("height", "160%");
    shadow.append("feDropShadow")
      .attr("dx", "0").attr("dy", "2")
      .attr("stdDeviation", "3")
      .attr("flood-color", "#000")
      .attr("flood-opacity", "0.08");

    // ============ MAIN CHART GROUP ============
    const g = root.append("g")
      .attr("class", "chart-main")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ============ GRID GROUP ============
    const gridGroup = g.append("g").attr("class", "grid-group");

    gridGroup.selectAll("line.grid-line")
      .data(yScale.ticks(5))
      .join("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", COLORS.grid)
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", "4,4");

    // ============ BARS GROUP ============
    const barsGroup = g.append("g").attr("class", "bars-group");
    const tooltip = d3.select(tooltipRef.current);

    chartData.forEach((d, quantileIndex) => {
      const x0 = xScale(d.quantile) ?? 0;
      const quantileGroup = barsGroup.append("g")
        .attr("class", `quantile-group-${quantileIndex}`)
        .attr("transform", `translate(${x0}, 0)`);

      PERIOD_KEYS.forEach((period, periodIndex) => {
        const barX = groupScale(period) ?? 0;
        const barWidth = groupScale.bandwidth();
        const barHeight = innerHeight - yScale(d[period]);
        const targetY = yScale(d[period]);
        const colors = COLORS[period];

        const bar = quantileGroup.append("rect")
          .attr("class", `bar-${period}`)
          .attr("x", barX)
          .attr("y", innerHeight)
          .attr("width", barWidth)
          .attr("height", 0)
          .attr("fill", `url(#turnover-grad-${period})`)
          .attr("rx", 4)
          .attr("filter", "url(#turnover-shadow)")
          .style("cursor", "pointer");

        bar
          .transition()
          .duration(600)
          .delay(quantileIndex * 80 + periodIndex * 40)
          .ease(d3.easeCubicOut)
          .attr("y", targetY)
          .attr("height", barHeight);

        // Hover interactions
        bar
          .on("mouseenter", (event) => {
            bar.transition().duration(150)
              .attr("filter", "url(#turnover-shadow) brightness(1.08)");

            const tooltipContent = `
              <div style="font-weight: 600; margin-bottom: 6px; color: #fff; font-size: 12px;">
                ${d.quantile}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; gap: 6px;">
                  <span style="width: 10px; height: 10px; background: ${colors.main}; border-radius: 50%;"></span>
                  <span style="color: #9ca3af; font-size: 11px;">${period === "1D" ? "1-Day" : period === "5D" ? "5-Day" : "10-Day"} Turnover</span>
                </span>
                <span style="font-weight: 600; color: #fff; font-size: 12px; font-variant-numeric: tabular-nums;">
                  ${d[period].toFixed(1)}%
                </span>
              </div>
            `;

            tooltip
              .html(tooltipContent)
              .style("opacity", 1)
              .style("left", `${event.clientX + 15}px`)
              .style("top", `${event.clientY - 10}px`);
          })
          .on("mouseleave", () => {
            bar.transition().duration(150)
              .attr("filter", "url(#turnover-shadow)");
            tooltip.style("opacity", 0);
          });
      });
    });

    // ============ AXES GROUP ============
    const axesGroup = g.append("g").attr("class", "axes-group");

    // X Axis
    axesGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(xScale)
          .tickSize(0)
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll("text")
        .attr("fill", COLORS.text)
        .attr("font-size", 12)
        .attr("font-weight", 500)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("dy", 14));

    // Y Axis
    axesGroup.append("g")
      .attr("class", "y-axis")
      .call(
        d3.axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => `${Number(d).toFixed(0)}%`)
          .tickSize(0)
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll("text")
        .attr("fill", COLORS.axis)
        .attr("font-size", 11)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("dx", -6));

    // ============ LEGEND GROUP ============
    const legendGroup = root.append("g")
      .attr("class", "legend-group")
      .attr("transform", `translate(${margin.left}, 10)`);

    PERIOD_KEYS.forEach((period, i) => {
      const lg = legendGroup.append("g")
        .attr("class", `legend-item-${period}`)
        .attr("transform", `translate(${i * 75}, 0)`)
        .attr("opacity", 0);

      lg.append("rect")
        .attr("x", 0).attr("y", 2)
        .attr("width", 16).attr("height", 12)
        .attr("rx", 3)
        .attr("fill", `url(#turnover-grad-${period})`);

      lg.append("text")
        .attr("x", 20).attr("y", 12)
        .attr("font-size", 10)
        .attr("font-weight", 500)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("fill", COLORS.text)
        .text(period === "1D" ? "1-Day" : period === "5D" ? "5-Day" : "10-Day");

      lg.transition()
        .duration(400)
        .delay(800 + i * 100)
        .attr("opacity", 1);
    });

  }, [chartData]);

  useEffect(() => {
    drawChart();

    const handleResize = () => drawChart();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawChart]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[250px] relative">
      <svg ref={svgRef} className="w-full h-full" />
      <div
        ref={tooltipRef}
        className="fixed z-50 pointer-events-none transition-opacity duration-150"
        style={{
          opacity: 0,
          background: COLORS.tooltipBg,
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          padding: "12px 14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          minWidth: "160px",
        }}
      />
    </div>
  );
}
