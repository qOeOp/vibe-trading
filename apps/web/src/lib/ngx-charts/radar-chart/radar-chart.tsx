"use client";

import { useMemo } from "react";

// ─── Types ───────────────────────────────────────────────

export interface RadarSeries {
  /** Series display label (used in legend) */
  label: string;
  /** Values for each dimension (0-100 scale) */
  values: number[];
  /** Series color (fill & stroke) */
  color: string;
}

export interface RadarChartProps {
  /** Dimension labels displayed at each axis endpoint */
  labels: string[];
  /** Values for each dimension (0-100 scale) — single series mode */
  values?: number[];
  /** Multi-series data (overrides values/fillColor/strokeColor when provided) */
  series?: RadarSeries[];
  /** Chart size in px (width = height) */
  size?: number;
  /** Polygon fill color */
  fillColor?: string;
  /** Polygon fill opacity */
  fillOpacity?: number;
  /** Polygon stroke color */
  strokeColor?: string;
  /** Number of concentric grid rings */
  rings?: number;
  /** Show numeric score next to each label */
  showValues?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ─── Geometry helpers ────────────────────────────────────

const DEG_TO_RAD = Math.PI / 180;

/**
 * Convert a polar coordinate to cartesian.
 * Angle 0 = 12 o'clock (top), increases clockwise.
 */
function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): [number, number] {
  const rad = (angleDeg - 90) * DEG_TO_RAD;
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
}

/**
 * Determine textAnchor based on angle position:
 * - Top/bottom center → "middle"
 * - Left half → "end"
 * - Right half → "start"
 */
function labelAnchor(angleDeg: number): "start" | "middle" | "end" {
  const norm = ((angleDeg % 360) + 360) % 360;
  if (norm < 15 || norm > 345) return "middle"; // top
  if (norm > 165 && norm < 195) return "middle"; // bottom
  return norm < 180 ? "start" : "end";
}

/** Vertical offset for labels at top/bottom vs sides */
function labelDy(angleDeg: number): string {
  const norm = ((angleDeg % 360) + 360) % 360;
  if (norm < 30 || norm > 330) return "-0.5em"; // top — push up
  if (norm > 150 && norm < 210) return "1.1em"; // bottom — push down
  return "0.35em"; // sides — vertically center
}

// ─── Component ───────────────────────────────────────────

export function RadarChart({
  labels,
  values = [],
  series,
  size = 200,
  fillColor = "#26a69a",
  fillOpacity = 0.2,
  strokeColor = "#26a69a",
  rings = 5,
  showValues = true,
  className,
}: RadarChartProps) {
  const n = labels.length;
  // Extra padding around SVG viewBox so labels (incl. scores) never clip.
  // CJK labels + 2-3 digit scores can extend ~55px from the anchor point,
  // so we need generous room on all sides.
  const viewPad = 40;
  const svgSize = size + viewPad * 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const outerR = size / 2 - 14;
  const angleStep = 360 / n;

  // Determine if multi-series mode
  const isMulti = series != null && series.length > 0;
  const effectiveSeries: RadarSeries[] = isMulti
    ? series
    : [{ label: "", values, color: fillColor }];
  const effectiveFillOpacity = isMulti ? 0.12 : fillOpacity;
  const effectiveShowValues = isMulti ? false : showValues;

  // Pre-compute axis angles
  const angles = useMemo(() => {
    return Array.from({ length: n }, (_, i) => i * angleStep);
  }, [n, angleStep]);

  // Concentric grid rings (polygons, not circles — matching axis geometry)
  const gridPaths = useMemo(() => {
    return Array.from({ length: rings }, (_, ring) => {
      const r = (outerR * (ring + 1)) / rings;
      const pts = angles.map((a) => polarToCartesian(cx, cy, r, a));
      return pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    });
  }, [rings, outerR, angles, cx, cy]);

  // Pre-compute polygon paths and vertex points for each series
  const seriesGeometry = useMemo(() => {
    return effectiveSeries.map((s) => {
      const points = s.values.map((v, i) => {
        const clamped = Math.max(0, Math.min(100, v));
        const r = (clamped / 100) * outerR;
        return polarToCartesian(cx, cy, r, angles[i]);
      });
      const path = points
        .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
        .join(" ");
      return { path, points };
    });
  }, [effectiveSeries, outerR, angles, cx, cy]);

  // For single-series mode, use first series values for label scores
  const labelValues = isMulti ? null : effectiveSeries[0].values;

  return (
    <div className={className}>
      <svg
        width="100%"
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        overflow="visible"
      >
        {/* Grid rings (polygon outlines) */}
        {gridPaths.map((pts, i) => (
          <polygon
            key={`ring-${i}`}
            points={pts}
            fill="none"
            stroke="#e0ddd8"
            strokeWidth={i === rings - 1 ? 0.8 : 0.5}
            strokeDasharray={i === rings - 1 ? "none" : "2 2"}
          />
        ))}

        {/* Axis lines (center → outer edge) */}
        {angles.map((a, i) => {
          const [ex, ey] = polarToCartesian(cx, cy, outerR, a);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={ex}
              y2={ey}
              stroke="#e0ddd8"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Data polygons + data points for each series */}
        {seriesGeometry.map(({ path, points }, si) => {
          const s = effectiveSeries[si];
          return (
            <g key={`series-${si}`}>
              <polygon
                points={path}
                fill={s.color}
                fillOpacity={effectiveFillOpacity}
                stroke={isMulti ? s.color : strokeColor}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              {points.map(([px, py], i) => (
                <circle
                  key={`dot-${si}-${i}`}
                  cx={px}
                  cy={py}
                  r={2.5}
                  fill={s.color}
                  stroke="white"
                  strokeWidth={1}
                />
              ))}
            </g>
          );
        })}

        {/* Labels + optional scores */}
        {angles.map((a, i) => {
          const [lx, ly] = polarToCartesian(cx, cy, outerR + 14, a);
          const anchor = labelAnchor(a);
          const dy = labelDy(a);

          return (
            <text
              key={`label-${i}`}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dy={dy}
              className="fill-mine-muted"
              style={{ fontSize: 9, fontWeight: 500 }}
            >
              {labels[i]}
              {effectiveShowValues && labelValues && (
                <tspan
                  dx={anchor === "middle" ? 0 : 3}
                  style={{ fontSize: 8, fontWeight: 700, fill: "#1a1a1a" }}
                >
                  {anchor === "middle"
                    ? ` ${Math.round(Math.max(0, Math.min(100, labelValues[i])))}`
                    : Math.round(Math.max(0, Math.min(100, labelValues[i])))}
                </tspan>
              )}
            </text>
          );
        })}
      </svg>

      {/* Legend for multi-series */}
      {isMulti && (
        <div className="flex items-center justify-center gap-3 mt-2">
          {series.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[9px] text-mine-text">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
