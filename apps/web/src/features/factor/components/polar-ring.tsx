"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { MonthSlice, Strategy } from "../data/polar-calendar-data";

interface PolarRingProps {
  months: MonthSlice[];
  strategies: Strategy[];
  activeYear: number;
  availableYears: number[];
  hoverStrategyId: string | null;
  selectedStrategyId: string | null;
  selectedMonth: number | null;
  onYearChange: (year: number) => void;
  onHoverStrategy: (id: string | null) => void;
  onSelectMonth: (month: number | null) => void;
}

const OUTER_RADIUS_RATIO = 0.44;
const INNER_RADIUS_RATIO = 0.097;  // matches preview: 64 / 660 ≈ 0.097
const RING_GAP_PX = 2;            // fixed 2px gap between rings (matches preview)
const VISUAL_PAD = 0.015;         // extra angular gap beyond cap compensation

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const BASE_RING_BG = "#eae7e2";     // 玉盘底座
const PILLAR_EVEN = "#f0ede8";
const PILLAR_ODD = "#f7f5f2";
const RING_BORDER = "#d6d3cd";
const CENTER_BG = "#FAFAF8";
const SELECTED_ARC_COLOR = "#6366F1";

function hexRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function getAngleFromCenter(x: number, y: number, cx: number, cy: number): number {
  const dx = x - cx;
  const dy = y - cy;
  let angle = Math.atan2(dx, -dy);
  if (angle < 0) angle += Math.PI * 2;
  return angle;
}

function dist(x: number, y: number, cx: number, cy: number): number {
  return Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
}

interface ArcSpan {
  strategyId: string;
  rank: number;
  startMonth: number;
  endMonth: number;
  spanLength: number;
}

function buildMergedArcs(months: MonthSlice[], N: number): ArcSpan[] {
  const rankMap: (string | undefined)[][] = [];
  for (let r = 1; r <= N; r++) {
    const row: (string | undefined)[] = new Array(12).fill(undefined);
    for (const ms of months) {
      const ranking = ms.rankings.find((rr) => rr.rank === r);
      if (ranking) row[ms.month] = ranking.strategyId;
    }
    rankMap.push(row);
  }

  const spans: ArcSpan[] = [];

  for (let r = 0; r < N; r++) {
    const row = rankMap[r];
    const rank = r + 1;

    let m = 0;
    while (m < 12) {
      const sid = row[m];
      if (sid === undefined) { m++; continue; }
      let end = m;
      while (end + 1 < 12 && row[end + 1] === sid) { end++; }
      spans.push({ strategyId: sid, rank, startMonth: m, endMonth: end, spanLength: end - m + 1 });
      m = end + 1;
    }

    // Wrap-around merge (Dec → Jan)
    if (spans.length >= 2) {
      const last = spans[spans.length - 1];
      const firstIdx = spans.findIndex((s) => s.rank === rank);
      if (firstIdx >= 0) {
        const first = spans[firstIdx];
        if (
          last.rank === rank && first.rank === rank &&
          last.endMonth === 11 && first.startMonth === 0 &&
          last.strategyId === first.strategyId && last !== first
        ) {
          last.endMonth = first.endMonth;
          last.spanLength = last.spanLength + first.spanLength;
          spans.splice(firstIdx, 1);
        }
      }
    }
  }

  return spans;
}

export function PolarRing({
  months,
  strategies,
  activeYear,
  availableYears,
  hoverStrategyId,
  selectedStrategyId,
  selectedMonth,
  onYearChange,
  onHoverStrategy,
  onSelectMonth,
}: PolarRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [hoverMonth, setHoverMonth] = useState<number | null>(null);
  const [hoverCenter, setHoverCenter] = useState<"left" | "right" | null>(null);

  // Responsive sizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const size = Math.min(width, height);
      setCanvasSize({ w: width, h: size });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // ─── Main draw ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize.w === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvasSize.w;
    const h = canvasSize.h;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const minDim = Math.min(w, h);
    const outerR = minDim * OUTER_RADIUS_RATIO;
    const innerR = minDim * INNER_RADIUS_RATIO;
    const N = strategies.length;

    const totalBand = outerR - innerR;
    const thickness = (totalBand - RING_GAP_PX * (N - 1)) / N;  // fixed px gap
    const ringStep = thickness + RING_GAP_PX;

    const yearIdx = availableYears.indexOf(activeYear);

    // ── 1. Base ring donut background (玉盘底座) ──
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = BASE_RING_BG;
    ctx.fill();

    // ── 2. Alternating sector backgrounds (整列交替, matching preview) ──
    // Each sector (month column) gets a uniform fill across all rings.
    // Adjacent sectors alternate between EVEN/ODD for visual separation.
    const pillarSlice = (2 * Math.PI) / 12;
    for (let m = 0; m < 12; m++) {
      const sStart = -Math.PI / 2 + m * pillarSlice;
      const sEnd = sStart + pillarSlice;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, sStart, sEnd);
      ctx.arc(cx, cy, innerR, sEnd, sStart, true);
      ctx.closePath();
      ctx.fillStyle = m % 2 === 0 ? PILLAR_EVEN : PILLAR_ODD;
      ctx.fill();
      ctx.restore();
    }

    // ── 3. Ring separator grooves (嵌入凹槽) ──
    ctx.save();
    for (let r = 0; r < N - 1; r++) {
      // Groove sits in the center of the gap between ring r and ring r+1
      const ringBottom = outerR - r * ringStep - thickness;  // bottom edge of ring r
      const grooveR = ringBottom - RING_GAP_PX / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, grooveR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    ctx.restore();

    // ── 4. Draw merged ranking arcs ──
    const mergedArcs = buildMergedArcs(months, N);

    for (const span of mergedArcs) {
      const strategy = strategies.find((s) => s.id === span.strategyId);
      if (!strategy) continue;

      const ringIdx = span.rank - 1;
      const ringR = outerR - ringIdx * ringStep - thickness / 2;

      // Cap angle compensation + visualPad for consistent inter-strategy gaps
      const capAngle = (thickness * 0.5) / ringR;
      const padA = capAngle + VISUAL_PAD;

      let arcStartAngle: number;
      let arcEndAngle: number;

      // Use flush pillarSlice (2π/12) for positioning — no sector gap
      if (span.startMonth <= span.endMonth) {
        const firstSectorStart = -Math.PI / 2 + span.startMonth * pillarSlice;
        const lastSectorEnd = -Math.PI / 2 + (span.endMonth + 1) * pillarSlice;
        arcStartAngle = firstSectorStart + padA;
        arcEndAngle = lastSectorEnd - padA;
      } else {
        const firstSectorStart = -Math.PI / 2 + span.startMonth * pillarSlice;
        const lastSectorEnd = -Math.PI / 2 + (span.endMonth + 1) * pillarSlice + Math.PI * 2;
        arcStartAngle = firstSectorStart + padA;
        arcEndAngle = lastSectorEnd - padA;
      }

      // Rank-based default alpha: top ranks brighter, bottom ranks dimmer
      let alpha: number;
      if (ringIdx < 3) alpha = 0.88;
      else if (ringIdx < 7) alpha = 0.55;
      else alpha = 0.40;

      const isHighlighted = hoverStrategyId === span.strategyId || selectedStrategyId === span.strategyId;
      const hasActiveStrategy = hoverStrategyId != null || selectedStrategyId != null;
      if (hasActiveStrategy) {
        alpha = isHighlighted ? 1.0 : 0.10;
      }

      if (selectedMonth !== null) {
        const coversSelected = span.startMonth <= span.endMonth
          ? selectedMonth >= span.startMonth && selectedMonth <= span.endMonth
          : selectedMonth >= span.startMonth || selectedMonth <= span.endMonth;
        if (!coversSelected) {
          alpha *= 0.55;
        }
      }

      // Draw the merged arc (lineWidth = thickness - 1 for slight inset, matching preview)
      const arcLineWidth = Math.max(1, thickness - 1);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, arcStartAngle, arcEndAngle);
      ctx.strokeStyle = hexRgba(strategy.color, alpha);
      ctx.lineWidth = arcLineWidth;
      ctx.lineCap = "round";
      ctx.stroke();

      // Glow effect for highlighted arcs
      if (isHighlighted && hasActiveStrategy) {
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, arcStartAngle, arcEndAngle);
        ctx.strokeStyle = strategy.color;
        ctx.lineWidth = arcLineWidth + 6;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.restore();
    }

    // ── 6. Inner/outer ring border strokes (镶边) ──
    ctx.save();
    ctx.strokeStyle = RING_BORDER;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // ── 7. Selected sector arc indicator ──
    const activeM = selectedMonth ?? hoverMonth;
    if (activeM !== null) {
      const sStart = -Math.PI / 2 + activeM * pillarSlice;
      const sEnd = sStart + pillarSlice;
      const indicR = outerR + 2;  // tight to ring edge

      ctx.save();
      ctx.strokeStyle = SELECTED_ARC_COLOR;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, indicR, sStart, sEnd);
      ctx.stroke();

      // End dots
      [sStart, sEnd].forEach((a) => {
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * indicR, cy + Math.sin(a) * indicR, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = SELECTED_ARC_COLOR;
        ctx.fill();
      });
      ctx.restore();
    }

    // ── 8. Month labels (rotated along tangent) ──
    ctx.save();
    const labelR = outerR * 1.08;   // half the previous offset for tighter but breathable gap
    const labelFontSize = Math.round(outerR * 0.07);
    for (let m = 0; m < 12; m++) {
      const midAngle = -Math.PI / 2 + (m + 0.5) * pillarSlice;
      const lx = cx + Math.cos(midAngle) * labelR;
      const ly = cy + Math.sin(midAngle) * labelR;

      const isSelected = selectedMonth === m;
      const isHovered = hoverMonth === m;

      ctx.save();
      ctx.translate(lx, ly);

      // Rotate along tangent; flip if in bottom half so text stays readable
      let rot = midAngle + Math.PI / 2;
      if (rot > Math.PI / 2 && rot < Math.PI * 1.5) rot += Math.PI;
      ctx.rotate(rot);

      ctx.font = `${isSelected || isHovered ? 700 : 500} ${labelFontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = isSelected ? SELECTED_ARC_COLOR : isHovered ? "#1c1917" : "#a8a29e";
      ctx.fillText(MONTH_LABELS[m], 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // ── 9. Center circle with year + arrows ──
    // Fill center
    ctx.beginPath();
    ctx.arc(cx, cy, innerR - 1, 0, Math.PI * 2);
    ctx.fillStyle = CENTER_BG;
    ctx.fill();

    // Year number — proportional coefficients derived from preview (innerR=64 @ 660px)
    const yearFont = Math.round(innerR * 0.31);     // 20 / 64 ≈ 0.3125
    const subFont = Math.round(innerR * 0.14);      // 9 / 64 ≈ 0.1406
    const arrowFont = Math.round(innerR * 0.22);    // 14 / 64 ≈ 0.2188
    const arrowOffsetX = innerR * 0.47;             // 30 / 64 ≈ 0.4688
    const yearShiftY = innerR * 0.06;               // 4 / 64 ≈ 0.0625
    const subShiftY = innerR * 0.22;                // 14 / 64 ≈ 0.2188

    ctx.font = `700 ${yearFont}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = "#1c1917";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(activeYear), cx, cy - yearShiftY);

    // "Full Year" label
    ctx.font = `500 ${subFont}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = "#a8a29e";
    ctx.fillText("Full Year", cx, cy + subShiftY);

    // Navigation arrows with disabled state
    ctx.font = `600 ${arrowFont}px Inter, system-ui, sans-serif`;
    ctx.textBaseline = "middle";

    // ‹ (left)
    ctx.textAlign = "right";
    ctx.fillStyle = yearIdx > 0
      ? (hoverCenter === "left" ? "#1c1917" : "#78716c")
      : "#ddd8d0";
    ctx.fillText("‹", cx - arrowOffsetX, cy - yearShiftY);

    // › (right)
    ctx.textAlign = "left";
    ctx.fillStyle = yearIdx < availableYears.length - 1
      ? (hoverCenter === "right" ? "#1c1917" : "#78716c")
      : "#ddd8d0";
    ctx.fillText("›", cx + arrowOffsetX, cy - yearShiftY);

  }, [canvasSize, months, strategies, activeYear, availableYears, hoverStrategyId, selectedStrategyId, selectedMonth, hoverMonth, hoverCenter]);

  // ─── Mouse interaction ─────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize.w === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = canvasSize.w / 2;
    const cy = canvasSize.h / 2;
    const minDim = Math.min(canvasSize.w, canvasSize.h);
    const outerR = minDim * OUTER_RADIUS_RATIO;
    const innerR = minDim * INNER_RADIUS_RATIO;
    const N = strategies.length;
    const totalBand = outerR - innerR;
    const thickness = (totalBand - RING_GAP_PX * (N - 1)) / N;  // fixed px gap
    const ringStep = thickness + RING_GAP_PX;

    const d = dist(x, y, cx, cy);
    const angle = getAngleFromCenter(x, y, cx, cy);

    // Center hover
    if (d < innerR) {
      const arrowOffsetX = innerR * 0.47;  // proportional to innerR
      const leftD = dist(x, y, cx - arrowOffsetX, cy);
      const rightD = dist(x, y, cx + arrowOffsetX, cy);
      let newHoverCenter: "left" | "right" | null = null;
      if (leftD < innerR * 0.4) {
        newHoverCenter = "left";
      } else if (rightD < innerR * 0.4) {
        newHoverCenter = "right";
      }
      setHoverCenter(newHoverCenter);
      setHoverMonth(null);
      onHoverStrategy(null);
      canvas.style.cursor = newHoverCenter ? "pointer" : "default";
      return;
    }

    setHoverCenter(null);

    // Ring/sector hit test
    if (d >= innerR && d <= outerR + 10) {
      const slice = (2 * Math.PI) / 12;

      const monthIdx = Math.min(11, Math.max(0, Math.floor(angle / slice)));
      setHoverMonth(monthIdx);

      // Which ring?
      const ringIdx = Math.round((outerR - d) / ringStep);
      const clampedRing = Math.min(N - 1, Math.max(0, ringIdx));

      const monthData = months.find((ms) => ms.month === monthIdx);
      if (monthData) {
        const ranking = monthData.rankings.find((r) => r.rank === clampedRing + 1);
        if (ranking) {
          onHoverStrategy(ranking.strategyId);
          canvas.style.cursor = "pointer";
          return;
        }
      }

      onHoverStrategy(null);
      canvas.style.cursor = "pointer";
    } else {
      setHoverMonth(null);
      onHoverStrategy(null);
      canvas.style.cursor = "default";
    }
  }, [canvasSize, months, strategies, onHoverStrategy]);

  const handleMouseLeave = useCallback(() => {
    setHoverMonth(null);
    setHoverCenter(null);
    onHoverStrategy(null);
  }, [onHoverStrategy]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize.w === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cxv = canvasSize.w / 2;
    const cyv = canvasSize.h / 2;
    const minDim = Math.min(canvasSize.w, canvasSize.h);
    const outerR = minDim * OUTER_RADIUS_RATIO;
    const innerR = minDim * INNER_RADIUS_RATIO;
    const N = strategies.length;
    const totalBand = outerR - innerR;
    const thickness = (totalBand - RING_GAP_PX * (N - 1)) / N;

    const d = dist(x, y, cxv, cyv);
    const dx = x - cxv;

    // Center click — year nav
    if (d < innerR) {
      const yi = availableYears.indexOf(activeYear);
      const deadzone = innerR * 0.125;  // 8 / 64 ≈ 0.125
      if (dx < -deadzone && yi > 0) {
        onYearChange(availableYears[yi - 1]);
      } else if (dx > deadzone && yi < availableYears.length - 1) {
        onYearChange(availableYears[yi + 1]);
      }
      return;
    }

    // Sector click
    if (d >= innerR && d <= outerR + thickness * 0.5) {
      const angle = getAngleFromCenter(x, y, cxv, cyv);
      const slice = (2 * Math.PI) / 12;
      const monthIdx = Math.min(11, Math.max(0, Math.floor(angle / slice)));

      onSelectMonth(selectedMonth === monthIdx ? null : monthIdx);
    }
  }, [canvasSize, activeYear, availableYears, selectedMonth, strategies, onYearChange, onSelectMonth]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="block"
        style={{ width: canvasSize.w, height: canvasSize.h, cursor: "pointer" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    </div>
  );
}
