"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import type { FactorRankAutocorrelation } from "../types";

interface AutocorrelationChartProps {
  data: FactorRankAutocorrelation[];
}

const COLORS = {
  line: "#8b5cf6",
  dot: "#8b5cf6",
  dotHover: "#6d28d9",
  reference: "#e0ddd8",
  grid: "#e0ddd8",
  axis: "#8a8a8a",
  text: "#1a1a1a",
  crosshair: "#9ca3af",
  tooltipBg: "rgba(30, 30, 30, 0.95)",
};

const margin = { top: 24, right: 20, bottom: 40, left: 44 };

export function AutocorrelationChart({ data }: AutocorrelationChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        lag: `${d.lag}D`,
        lagNum: d.lag,
        autocorrelation: d.autocorrelation,
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
      .domain(chartData.map((d) => d.lag))
      .range([0, innerWidth])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0])
      .nice();

    // ============ DEFS ============
    const defs = svg.append("defs");

    // Line gradient
    const lineGrad = defs.append("linearGradient")
      .attr("id", "autocorr-line-grad")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%");
    lineGrad.append("stop").attr("offset", "0%").attr("stop-color", "#a78bfa");
    lineGrad.append("stop").attr("offset", "100%").attr("stop-color", "#8b5cf6");

    // Glow filter
    const glowFilter = defs.append("filter")
      .attr("id", "autocorr-glow")
      .attr("x", "-50%").attr("y", "-50%")
      .attr("width", "200%").attr("height", "200%");
    glowFilter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Dot shadow filter
    const dotShadow = defs.append("filter")
      .attr("id", "dot-shadow")
      .attr("x", "-100%").attr("y", "-100%")
      .attr("width", "300%").attr("height", "300%");
    dotShadow.append("feDropShadow")
      .attr("dx", "0").attr("dy", "2")
      .attr("stdDeviation", "3")
      .attr("flood-color", COLORS.line)
      .attr("flood-opacity", "0.4");

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

    // Reference line at 0.5
    gridGroup.append("line")
      .attr("class", "reference-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(0.5))
      .attr("y2", yScale(0.5))
      .attr("stroke", COLORS.reference)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "6,4");

    // ============ LINE GROUP ============
    const lineGroup = g.append("g").attr("class", "line-group");

    // Line path
    const lineGenerator = d3.line<typeof chartData[0]>()
      .x((d) => (xScale(d.lag) ?? 0) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.autocorrelation))
      .curve(d3.curveMonotoneX);

    const linePath = lineGroup.append("path")
      .datum(chartData)
      .attr("class", "main-line")
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "url(#autocorr-line-grad)")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("filter", "url(#autocorr-glow)");

    // Animate line drawing
    const totalLength = (linePath.node() as SVGPathElement)?.getTotalLength() || 0;
    linePath
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // ============ DOTS GROUP ============
    const dotsGroup = g.append("g").attr("class", "dots-group");

    chartData.forEach((d, i) => {
      const cx = (xScale(d.lag) ?? 0) + xScale.bandwidth() / 2;
      const cy = yScale(d.autocorrelation);

      const dotGroup = dotsGroup.append("g")
        .attr("class", `dot-group-${i}`)
        .attr("transform", `translate(${cx}, ${cy})`);

      // Outer glow circle
      dotGroup.append("circle")
        .attr("class", "dot-glow")
        .attr("r", 0)
        .attr("fill", COLORS.line)
        .attr("fill-opacity", 0.2);

      // Main dot
      dotGroup.append("circle")
        .attr("class", "dot-main")
        .attr("r", 0)
        .attr("fill", COLORS.line)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("filter", "url(#dot-shadow)")
        .style("cursor", "pointer")
        .transition()
        .duration(400)
        .delay(800 + i * 80)
        .ease(d3.easeBackOut.overshoot(1.5))
        .attr("r", 6);

      // Value label
      dotGroup.append("text")
        .attr("class", "dot-label")
        .attr("y", -14)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("font-weight", 600)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("fill", COLORS.text)
        .attr("opacity", 0)
        .text(d.autocorrelation.toFixed(2))
        .transition()
        .duration(400)
        .delay(1000 + i * 80)
        .attr("opacity", 1);
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
        .attr("font-size", 11)
        .attr("font-weight", 500)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("dy", 14));

    // Y Axis
    axesGroup.append("g")
      .attr("class", "y-axis")
      .call(
        d3.axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => Number(d).toFixed(1))
          .tickSize(0)
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll("text")
        .attr("fill", COLORS.axis)
        .attr("font-size", 11)
        .attr("font-family", "Inter, system-ui, sans-serif")
        .attr("dx", -6));

    // ============ INTERACTIVE LAYER ============
    const tooltip = d3.select(tooltipRef.current);

    // Add hover interactions to dots
    chartData.forEach((d, i) => {
      const dotGroup = dotsGroup.select(`.dot-group-${i}`);
      const mainDot = dotGroup.select(".dot-main");
      const glowDot = dotGroup.select(".dot-glow");

      mainDot
        .on("mouseenter", (event) => {
          mainDot
            .transition()
            .duration(150)
            .attr("r", 8);

          glowDot
            .transition()
            .duration(150)
            .attr("r", 16);

          const tooltipContent = `
            <div style="font-weight: 600; margin-bottom: 6px; color: #fff; font-size: 12px;">
              Lag ${d.lagNum} Days
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; background: ${COLORS.line}; border-radius: 50%;"></span>
                <span style="color: #9ca3af; font-size: 11px;">Autocorr.</span>
              </span>
              <span style="font-weight: 600; color: #fff; font-size: 12px; font-variant-numeric: tabular-nums;">
                ${d.autocorrelation.toFixed(3)}
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
          mainDot
            .transition()
            .duration(150)
            .attr("r", 6);

          glowDot
            .transition()
            .duration(150)
            .attr("r", 0);

          tooltip.style("opacity", 0);
        });
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
          minWidth: "140px",
        }}
      />
    </div>
  );
}
