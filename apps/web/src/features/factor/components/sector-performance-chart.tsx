"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import type { SectorBreakdown, HoldingSector } from "../types";
import { SECTOR_COLOR_MAP } from "../types";

interface SectorPerformanceChartProps {
  data: SectorBreakdown[];
  metric: "meanReturn" | "ic";
}

const COLORS = {
  text: "#1a1a1a",
  tooltipBg: "rgba(30, 30, 30, 0.95)",
};

// Margins: right margin for value labels; left margin is computed dynamically
const LABEL_GAP = 10; // gap between label text and bar
const HEADER_PAD = 12; // matches ChartCard header px-3
const baseMargin = { top: 8, right: 48, bottom: 8 };

function getSectorColor(sector: string): string {
  return SECTOR_COLOR_MAP[sector as HoldingSector] ?? "#76808E";
}

export function SectorPerformanceChart({ data, metric }: SectorPerformanceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    const filtered = data.filter((d) => d.sector in SECTOR_COLOR_MAP);
    const sorted = [...filtered].sort((a, b) => b[metric] - a[metric]);
    return sorted.map((d) => ({
      sector: d.sector,
      value: metric === "meanReturn" ? d.meanReturn * 100 : d.ic,
      rawValue: metric === "meanReturn" ? d.meanReturn : d.ic,
      count: d.count,
      color: getSectorColor(d.sector),
    }));
  }, [data, metric]);

  const drawChart = useCallback(() => {
    if (!svgRef.current || !containerRef.current || chartData.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Measure max label width to compute left margin dynamically
    const measureGroup = svg.append("g").attr("class", "measure");
    let maxLabelWidth = 0;
    chartData.forEach((d) => {
      const text = measureGroup.append("text")
        .attr("font-size", 11)
        .attr("font-weight", 500)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .text(d.sector);
      const bbox = text.node()?.getBBox();
      if (bbox && bbox.width > maxLabelWidth) maxLabelWidth = bbox.width;
    });
    measureGroup.remove();

    const marginLeft = HEADER_PAD + maxLabelWidth + LABEL_GAP;
    const innerWidth = width - marginLeft - baseMargin.right;
    const innerHeight = height - baseMargin.top - baseMargin.bottom;

    const root = svg.append("g").attr("class", "chart-root");

    // Scales
    const yScale = d3.scaleBand()
      .domain(chartData.map((d) => d.sector))
      .range([0, innerHeight])
      .padding(0.25); // Tighter spacing for compact layout

    const maxVal = Math.max(...chartData.map((d) => d.value));

    // Scale so longest bar reaches close to the edge (same padding as left labels)
    const xScale = d3.scaleLinear()
      .domain([0, maxVal])
      .range([0, innerWidth]);

    // ============ MAIN CHART GROUP ============
    const g = root.append("g")
      .attr("class", "chart-main")
      .attr("transform", `translate(${marginLeft},${baseMargin.top})`);

    // ============ BARS GROUP ============
    const barsGroup = g.append("g").attr("class", "bars-group");
    const tooltip = d3.select(tooltipRef.current);

    chartData.forEach((d, i) => {
      const barGroup = barsGroup.append("g").attr("class", `bar-group-${i}`);
      const barY = yScale(d.sector) ?? 0;
      const barHeight = yScale.bandwidth();
      const targetWidth = xScale(d.value);

      // Sector label (left side, right-aligned near bar edge)
      barGroup.append("text")
        .attr("class", "sector-label")
        .attr("x", -LABEL_GAP)
        .attr("y", barY + barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("font-size", 11)
        .attr("font-weight", 500)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("fill", COLORS.text)
        .text(d.sector);

      // Bar with animation
      const bar = barGroup.append("rect")
        .attr("class", "bar-main")
        .attr("x", 0)
        .attr("y", barY)
        .attr("width", 0)
        .attr("height", barHeight)
        .attr("fill", d.color)
        .attr("rx", 3)
        .style("cursor", "pointer");

      bar
        .transition()
        .duration(700)
        .delay(i * 40)
        .ease(d3.easeCubicOut)
        .attr("width", targetWidth);

      // Value label (at the end of bar)
      const valueText = metric === "meanReturn"
        ? (d.rawValue * 100).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        : d.rawValue.toFixed(3);

      const valueLabel = barGroup.append("text")
        .attr("class", "value-label")
        .attr("x", 0)
        .attr("y", barY + barHeight / 2)
        .attr("dy", "0.35em")
        .attr("font-size", 10)
        .attr("font-weight", 600)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("font-variant-numeric", "tabular-nums")
        .attr("fill", COLORS.text)
        .attr("opacity", 0)
        .text(valueText);

      valueLabel
        .transition()
        .duration(400)
        .delay(700 + i * 40)
        .attr("opacity", 1)
        .attr("x", targetWidth + 6);

      // Hover interactions
      bar
        .on("mouseenter", (event) => {
          bar.transition().duration(150)
            .attr("opacity", 0.8);

          const tooltipContent = `
            <div style="font-weight: 600; margin-bottom: 6px; color: #fff; font-size: 12px;">
              ${d.sector}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0; gap: 16px;">
              <span style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; background: ${d.color}; border-radius: 50%;"></span>
                <span style="color: #9ca3af; font-size: 11px;">${metric === "meanReturn" ? "Mean Return" : "IC"}</span>
              </span>
              <span style="font-weight: 600; color: #fff; font-size: 12px; font-variant-numeric: tabular-nums;">
                ${metric === "meanReturn" ? `${(d.rawValue * 100).toFixed(2)}%` : d.rawValue.toFixed(4)}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0;">
              <span style="color: #9ca3af; font-size: 11px;">Stock Count</span>
              <span style="font-weight: 600; color: #fff; font-size: 12px;">${d.count}</span>
            </div>
          `;

          tooltip
            .html(tooltipContent)
            .style("opacity", 1)
            .style("left", `${event.clientX + 15}px`)
            .style("top", `${event.clientY - 10}px`);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", `${event.clientX + 15}px`)
            .style("top", `${event.clientY - 10}px`);
        })
        .on("mouseleave", () => {
          bar.transition().duration(150)
            .attr("opacity", 1);
          tooltip.style("opacity", 0);
        });
    });

  }, [chartData, metric]);

  useEffect(() => {
    drawChart();

    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(drawChart);
    });
    ro.observe(container);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [drawChart]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
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
          minWidth: "150px",
        }}
      />
    </div>
  );
}
