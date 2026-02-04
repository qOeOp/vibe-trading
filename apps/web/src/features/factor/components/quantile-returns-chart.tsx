"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import type { QuantileReturn } from "../types";

interface QuantileReturnsChartProps {
  data: QuantileReturn[];
  period: "1D" | "5D" | "10D" | "20D";
}

// Colors from worst (Q1) to best (Q5)
const QUANTILE_COLORS = [
  { id: "q1", color: "#CF304A", light: "#fecaca" },  // Q1 - worst (red)
  { id: "q2", color: "#E8626F", light: "#fecdd3" },  // Q2
  { id: "q3", color: "#76808E", light: "#d1d5db" },  // Q3 - neutral
  { id: "q4", color: "#58CEAA", light: "#a7f3d0" },  // Q4
  { id: "q5", color: "#0B8C5F", light: "#86efac" },  // Q5 - best (green)
];

const COLORS = {
  grid: "#e0ddd8",
  axis: "#8a8a8a",
  text: "#1a1a1a",
  positive: "#0B8C5F",
  negative: "#CF304A",
  tooltipBg: "rgba(30, 30, 30, 0.95)",
};

const margin = { top: 52, right: 20, bottom: 36, left: 48 };

export function QuantileReturnsChart({ data, period }: QuantileReturnsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const periodKey = `period${period}` as keyof QuantileReturn;

  const chartData = useMemo(
    () =>
      data.map((d, index) => ({
        quantile: `Q${d.quantile}`,
        value: (d[periodKey] as number) * 100,
        colorIndex: index,
      })),
    [data, periodKey]
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
      .padding(0.3);

    const values = chartData.map((d) => d.value);
    const maxAbs = Math.max(Math.abs(Math.min(...values)), Math.abs(Math.max(...values)));
    const padding = maxAbs * 0.25;

    const yScale = d3.scaleLinear()
      .domain([-maxAbs - padding, maxAbs + padding])
      .range([innerHeight, 0])
      .nice();

    // ============ DEFS ============
    const defs = svg.append("defs");

    // Gradients for each quantile
    QUANTILE_COLORS.forEach((qc) => {
      const gradient = defs.append("linearGradient")
        .attr("id", `bar-grad-${qc.id}`)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
      gradient.append("stop").attr("offset", "0%").attr("stop-color", qc.color).attr("stop-opacity", 1);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", qc.color).attr("stop-opacity", 0.7);
    });

    // Drop shadow filter
    const shadow = defs.append("filter")
      .attr("id", "bar-shadow")
      .attr("x", "-30%").attr("y", "-30%")
      .attr("width", "160%").attr("height", "160%");
    shadow.append("feDropShadow")
      .attr("dx", "0").attr("dy", "3")
      .attr("stdDeviation", "4")
      .attr("flood-color", "#000")
      .attr("flood-opacity", "0.1");

    // ============ MAIN CHART GROUP ============
    const g = root.append("g")
      .attr("class", "chart-main")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ============ GRID GROUP ============
    const gridGroup = g.append("g").attr("class", "grid-group");

    gridGroup.selectAll("line.grid-line")
      .data(yScale.ticks(6))
      .join("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", COLORS.grid)
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", "4,4");

    // Zero line
    gridGroup.append("line")
      .attr("class", "zero-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", COLORS.grid)
      .attr("stroke-width", 1.5);

    // ============ BARS GROUP ============
    const barsGroup = g.append("g").attr("class", "bars-group");
    const tooltip = d3.select(tooltipRef.current);

    chartData.forEach((d, i) => {
      const barGroup = barsGroup.append("g").attr("class", `bar-group-${i}`);
      const barX = xScale(d.quantile) ?? 0;
      const barWidth = xScale.bandwidth();
      const targetY = d.value >= 0 ? yScale(d.value) : yScale(0);
      const barHeight = Math.abs(yScale(d.value) - yScale(0));
      const qc = QUANTILE_COLORS[d.colorIndex];

      // Bar with animation
      const bar = barGroup.append("rect")
        .attr("class", "bar-main")
        .attr("x", barX)
        .attr("y", yScale(0))
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", `url(#bar-grad-${qc.id})`)
        .attr("rx", 6)
        .attr("filter", "url(#bar-shadow)")
        .style("cursor", "pointer");

      bar
        .transition()
        .duration(600)
        .delay(i * 100)
        .ease(d3.easeCubicOut)
        .attr("y", targetY)
        .attr("height", barHeight);

      // Value label badge
      const labelY = d.value >= 0 ? -32 : barHeight + 8;

      const labelGroup = barGroup.append("g")
        .attr("class", "label-group")
        .attr("transform", `translate(${barX + barWidth / 2}, ${yScale(0)})`)
        .attr("opacity", 0);

      labelGroup.append("rect")
        .attr("x", -30)
        .attr("y", labelY)
        .attr("width", 60)
        .attr("height", 24)
        .attr("rx", 8)
        .attr("fill", d.value >= 0 ? "#f0fdf4" : "#fef2f2")
        .attr("stroke", d.value >= 0 ? "#bbf7d0" : "#fecaca")
        .attr("stroke-width", 1);

      labelGroup.append("text")
        .attr("x", 0)
        .attr("y", labelY + 16)
        .attr("text-anchor", "middle")
        .attr("font-size", 11)
        .attr("font-weight", 600)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("fill", d.value >= 0 ? COLORS.positive : COLORS.negative)
        .text(`${d.value.toFixed(2)}%`);

      labelGroup
        .transition()
        .duration(400)
        .delay(600 + i * 100)
        .attr("opacity", 1)
        .attr("transform", `translate(${barX + barWidth / 2}, ${targetY})`);

      // Hover interactions
      bar
        .on("mouseenter", (event) => {
          bar.transition().duration(150)
            .attr("filter", "url(#bar-shadow) brightness(1.1)");

          const tooltipContent = `
            <div style="font-weight: 600; margin-bottom: 6px; color: #fff; font-size: 12px;">
              ${d.quantile}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; background: ${qc.color}; border-radius: 50%;"></span>
                <span style="color: #9ca3af; font-size: 11px;">${period} Return</span>
              </span>
              <span style="font-weight: 600; color: #fff; font-size: 12px; font-variant-numeric: tabular-nums;">
                ${d.value.toFixed(3)}%
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
            .attr("filter", "url(#bar-shadow)");
          tooltip.style("opacity", 0);
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
          .ticks(6)
          .tickFormat((d) => `${d}%`)
          .tickSize(0)
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll("text")
        .attr("fill", COLORS.axis)
        .attr("font-size", 11)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("dx", -6));

  }, [chartData, period]);

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
          minWidth: "140px",
        }}
      />
    </div>
  );
}
