"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { scaleTime, scaleLinear } from "d3-scale";
import { area, line, curveLinear } from "d3-shape";
import { extent, bisector } from "d3-array";
import type { NgxAreaChartProps, AreaChartSeries, DataPoint, ViewDimensions, GradientStop } from "./types";

// Default color scheme similar to ngx-charts
const DEFAULT_SCHEME = {
  domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA", "#7aa3e5", "#a8385d", "#aae3f5"],
};

// Helper to generate unique IDs
let idCounter = 0;
const generateId = () => `ngx-area-${++idCounter}`;

export function NgxAreaChart({
  results,
  width: propWidth,
  height: propHeight,
  legend = true,
  legendTitle = "Legend",
  xAxis = true,
  yAxis = true,
  showXAxisLabel = false,
  showYAxisLabel = false,
  xAxisLabel = "",
  yAxisLabel = "",
  autoScale = false,
  showGridLines = true,
  curve = curveLinear,
  gradient = true,
  scheme = DEFAULT_SCHEME,
  animations = true,
  tooltipDisabled = false,
  xAxisTickFormatting,
  yAxisTickFormatting,
  onSelect,
}: NgxAreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [hoveredX, setHoveredX] = useState<Date | number | null>(null);
  const [activeEntries, setActiveEntries] = useState<string[]>([]);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const width = propWidth || containerSize.width;
  const height = propHeight || containerSize.height;

  // Calculate margins based on axes
  const margin = useMemo(() => {
    const m = { top: 10, right: 10, bottom: 10, left: 10 };
    if (xAxis) m.bottom += 20;
    if (yAxis) m.left += 35;
    if (showXAxisLabel) m.bottom += 16;
    if (showYAxisLabel) m.left += 16;
    if (legend) m.right += 80;
    return m;
  }, [xAxis, yAxis, showXAxisLabel, showYAxisLabel, legend]);

  const dims: ViewDimensions = useMemo(() => ({
    width: Math.max(0, width - margin.left - margin.right),
    height: Math.max(0, height - margin.top - margin.bottom),
    xOffset: margin.left,
  }), [width, height, margin]);

  // Get all unique x values
  const xSet = useMemo(() => {
    const allX = results.flatMap((s) => s.series.map((d) => d.name));
    const unique = Array.from(new Set(allX.map((x) => (x instanceof Date ? x.getTime() : x))));
    const firstItem = allX[0];
    const isDate = firstItem instanceof Date;
    return unique.sort((a, b) => Number(a) - Number(b)).map((x) =>
      isDate ? new Date(x as number) : x
    );
  }, [results]);

  // X Scale
  const xScale = useMemo(() => {
    if (!xSet.length || dims.width <= 0) return null;
    const domain = extent(xSet as (Date | number)[]) as [Date | number, Date | number];
    const isTime = xSet[0] instanceof Date;
    if (isTime) {
      return scaleTime().domain(domain as [Date, Date]).range([0, dims.width]);
    }
    return scaleLinear().domain(domain as [number, number]).range([0, dims.width]);
  }, [xSet, dims.width]);

  // Y Domain and Scale
  const yScale = useMemo(() => {
    if (dims.height <= 0) return null;
    const allValues = results.flatMap((s) => s.series.map((d) => d.value));
    let min = Math.min(...allValues);
    let max = Math.max(...allValues);

    if (!autoScale) {
      min = Math.min(min, 0);
    }

    const padding = (max - min) * 0.1;
    return scaleLinear()
      .domain([min - padding, max + padding])
      .range([dims.height, 0])
      .nice();
  }, [results, dims.height, autoScale]);

  // Color helper
  const getColor = useCallback(
    (name: string, index: number) => {
      return scheme.domain[index % scheme.domain.length];
    },
    [scheme]
  );

  // Generate gradient stops
  const getGradientStops = useCallback((color: string): GradientStop[] => {
    return [
      { offset: 0, color, opacity: 0.7 },
      { offset: 100, color, opacity: 0.1 },
    ];
  }, []);

  // Area path generator
  const areaGenerator = useMemo(() => {
    if (!xScale || !yScale) return null;
    return area<DataPoint>()
      .x((d) => xScale(d.name as Date | number)!)
      .y0(yScale.range()[0])
      .y1((d) => yScale(d.value)!)
      .curve(curve);
  }, [xScale, yScale, curve]);

  // Line path generator (for stroke on top of area)
  const lineGenerator = useMemo(() => {
    if (!xScale || !yScale) return null;
    return line<DataPoint>()
      .x((d) => xScale(d.name as Date | number)!)
      .y((d) => yScale(d.value)!)
      .curve(curve);
  }, [xScale, yScale, curve]);

  // Tooltip bisector
  const bisect = useMemo(() => bisector<Date | number, Date | number>((d) => d).left, []);

  // Find closest point on hover
  const findClosestPoint = useCallback(
    (mouseX: number) => {
      if (!xScale || !xSet.length) return null;
      const x0 = xScale.invert(mouseX);
      const i = bisect(xSet as (Date | number)[], x0, 1);
      const d0 = xSet[i - 1];
      const d1 = xSet[i];
      if (!d0) return d1;
      if (!d1) return d0;
      const x0Num = x0 instanceof Date ? x0.getTime() : x0;
      const d0Num = d0 instanceof Date ? (d0 as Date).getTime() : (d0 as number);
      const d1Num = d1 instanceof Date ? (d1 as Date).getTime() : (d1 as number);
      return x0Num - d0Num > d1Num - x0Num ? d1 : d0;
    },
    [xScale, xSet, bisect]
  );

  // Get values for tooltip at hovered x
  const hoveredValues = useMemo(() => {
    if (hoveredX === null) return [];
    const hoveredXNum = hoveredX instanceof Date ? hoveredX.getTime() : hoveredX;
    return results.map((series, i) => {
      const point = series.series.find((d) => {
        const xNum = d.name instanceof Date ? d.name.getTime() : d.name;
        return xNum === hoveredXNum;
      });
      return {
        series: series.name,
        value: point?.value ?? 0,
        color: getColor(series.name, i),
      };
    });
  }, [hoveredX, results, getColor]);

  // Mouse handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      if (tooltipDisabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const closest = findClosestPoint(mouseX);
      setHoveredX(closest as Date | number | null);
    },
    [findClosestPoint, tooltipDisabled]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredX(null);
  }, []);

  // Legend click handler
  const handleLegendClick = useCallback(
    (name: string) => {
      setActiveEntries((prev) => {
        if (prev.includes(name)) {
          return prev.filter((n) => n !== name);
        }
        return [...prev, name];
      });
      onSelect?.({ name });
    },
    [onSelect]
  );

  // X axis ticks
  const xTicks = useMemo(() => {
    if (!xScale || dims.width <= 0) return [];
    // Fewer ticks for cleaner appearance
    const tickCount = Math.max(2, Math.min(8, Math.floor(dims.width / 100)));
    return xScale.ticks(tickCount);
  }, [xScale, dims.width]);

  // Y axis ticks
  const yTicks = useMemo(() => {
    if (!yScale || dims.height <= 0) return [];
    return yScale.ticks(5);
  }, [yScale, dims.height]);

  // Format X tick
  const formatXTick = useCallback(
    (value: Date | number) => {
      if (xAxisTickFormatting) return xAxisTickFormatting(value);
      if (value instanceof Date) {
        return value.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      return String(value);
    },
    [xAxisTickFormatting]
  );

  // Format Y tick
  const formatYTick = useCallback(
    (value: number) => {
      if (yAxisTickFormatting) return yAxisTickFormatting(value);
      return `${value}%`;
    },
    [yAxisTickFormatting]
  );

  // Generate clip path ID
  const clipPathId = useMemo(() => generateId(), []);

  if (width <= 0 || height <= 0 || !xScale || !yScale || !areaGenerator || !lineGenerator) {
    return <div ref={containerRef} className="w-full h-full" />;
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          {/* Clip path */}
          <clipPath id={clipPathId}>
            <rect x={-5} y={-5} width={dims.width + 10} height={dims.height + 10} />
          </clipPath>

          {/* Gradient definitions for each series */}
          {results.map((series, i) => {
            const color = getColor(series.name, i);
            const gradientId = `gradient-${clipPathId}-${i}`;
            const stops = getGradientStops(color);
            return (
              <linearGradient
                key={gradientId}
                id={gradientId}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                {stops.map((stop, si) => (
                  <stop
                    key={si}
                    offset={`${stop.offset}%`}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
            );
          })}
        </defs>

        {/* Main chart group */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {showGridLines && (
            <g className="grid-lines">
              {yTicks.map((tick, i) => (
                <line
                  key={i}
                  x1={0}
                  x2={dims.width}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                  stroke="#e0e0e0"
                  strokeDasharray="3,3"
                  strokeOpacity={0.7}
                />
              ))}
            </g>
          )}

          {/* X Axis */}
          {xAxis && (
            <g transform={`translate(0, ${dims.height})`}>
              {xTicks.map((tick, i) => (
                <g key={i} transform={`translate(${xScale(tick)}, 0)`}>
                  <text
                    y={16}
                    textAnchor="middle"
                    fill="#8a8a8a"
                    fontSize={10}
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {formatXTick(tick)}
                  </text>
                </g>
              ))}
              {showXAxisLabel && (
                <text
                  x={dims.width / 2}
                  y={40}
                  textAnchor="middle"
                  fill="#666"
                  fontSize={12}
                >
                  {xAxisLabel}
                </text>
              )}
            </g>
          )}

          {/* Y Axis */}
          {yAxis && (
            <g>
              {yTicks.map((tick, i) => (
                <g key={i} transform={`translate(0, ${yScale(tick)})`}>
                  <text
                    x={-8}
                    dy="0.32em"
                    textAnchor="end"
                    fill="#8a8a8a"
                    fontSize={10}
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {formatYTick(tick)}
                  </text>
                </g>
              ))}
              {showYAxisLabel && (
                <text
                  transform={`rotate(-90)`}
                  x={-dims.height / 2}
                  y={-margin.left + 15}
                  textAnchor="middle"
                  fill="#666"
                  fontSize={12}
                >
                  {yAxisLabel}
                </text>
              )}
            </g>
          )}

          {/* Chart content with clip path */}
          <g clipPath={`url(#${clipPathId})`}>
            {/* Area series */}
            {results.map((series, i) => {
              const color = getColor(series.name, i);
              const isActive = activeEntries.length === 0 || activeEntries.includes(series.name);
              const opacity = isActive ? 1 : 0.3;
              const sortedData = [...series.series].sort((a, b) => {
                const aNum = a.name instanceof Date ? a.name.getTime() : Number(a.name);
                const bNum = b.name instanceof Date ? b.name.getTime() : Number(b.name);
                return aNum - bNum;
              });

              const areaPath = areaGenerator(sortedData) || "";
              const linePath = lineGenerator(sortedData) || "";

              return (
                <g key={series.name} className="area-series" style={{ opacity }}>
                  {/* Area fill */}
                  <path
                    d={areaPath}
                    fill={gradient ? `url(#gradient-${clipPathId}-${i})` : color}
                    fillOpacity={gradient ? 1 : 0.5}
                    className={animations ? "area-path-animated" : ""}
                  />
                  {/* Line stroke on top */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={animations ? "line-path-animated" : ""}
                  />
                </g>
              );
            })}

            {/* Tooltip area */}
            {!tooltipDisabled && (
              <g className="tooltip-area">
                {/* Invisible rect for mouse events */}
                <rect
                  x={0}
                  y={0}
                  width={dims.width}
                  height={dims.height}
                  fill="transparent"
                  style={{ cursor: "crosshair" }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                />

                {/* Vertical line at hovered position */}
                {hoveredX !== null && xScale && (
                  <>
                    <line
                      x1={xScale(hoveredX as Date | number)}
                      x2={xScale(hoveredX as Date | number)}
                      y1={0}
                      y2={dims.height}
                      stroke="#999"
                      strokeWidth={1}
                      strokeDasharray="3,3"
                      strokeOpacity={0.8}
                      pointerEvents="none"
                    />

                    {/* Circles at intersection points */}
                    {results.map((series, i) => {
                      const hoveredXNum = hoveredX instanceof Date ? hoveredX.getTime() : hoveredX;
                      const point = series.series.find((d) => {
                        const xNum = d.name instanceof Date ? d.name.getTime() : d.name;
                        return xNum === hoveredXNum;
                      });
                      if (!point) return null;
                      const color = getColor(series.name, i);
                      return (
                        <circle
                          key={series.name}
                          cx={xScale(hoveredX as Date | number)}
                          cy={yScale(point.value)}
                          r={5}
                          fill={color}
                          stroke="#fff"
                          strokeWidth={2}
                          pointerEvents="none"
                        />
                      );
                    })}
                  </>
                )}
              </g>
            )}
          </g>
        </g>

        {/* Legend */}
        {legend && (
          <g transform={`translate(${width - margin.right + 10}, ${margin.top})`}>
            <text
              x={0}
              y={0}
              fill="#666"
              fontSize={11}
              fontWeight={600}
              fontFamily="Inter, system-ui, sans-serif"
            >
              {legendTitle}
            </text>
            {results.map((series, i) => {
              const color = getColor(series.name, i);
              const isActive = activeEntries.length === 0 || activeEntries.includes(series.name);
              return (
                <g
                  key={series.name}
                  transform={`translate(0, ${20 + i * 20})`}
                  style={{ cursor: "pointer", opacity: isActive ? 1 : 0.5 }}
                  onClick={() => handleLegendClick(series.name)}
                >
                  <circle cx={6} cy={0} r={5} fill={color} />
                  <text
                    x={16}
                    y={0}
                    dy="0.35em"
                    fill="#333"
                    fontSize={11}
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {series.name}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {!tooltipDisabled && hoveredX !== null && hoveredValues.length > 0 && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: xScale(hoveredX as Date | number) + margin.left + 15,
            top: margin.top,
            background: "rgba(30, 30, 30, 0.95)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            padding: "10px 12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            minWidth: "120px",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6, color: "#fff", fontSize: 11 }}>
            {hoveredX instanceof Date
              ? hoveredX.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : String(hoveredX)}
          </div>
          {hoveredValues.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "4px 0",
                gap: 12,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: item.color,
                    borderRadius: "50%",
                  }}
                />
                <span style={{ color: "#9ca3af", fontSize: 10 }}>{item.series}</span>
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: "#fff",
                  fontSize: 11,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {item.value >= 0 ? "+" : ""}{item.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        .area-path-animated {
          animation: areaFadeIn 0.75s ease-out;
        }
        .line-path-animated {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: lineDrawIn 1s ease-out forwards;
        }
        @keyframes areaFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lineDrawIn {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
