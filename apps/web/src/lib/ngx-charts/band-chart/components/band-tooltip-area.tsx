'use client';

import {
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import type { ReactNode, MouseEvent } from 'react';
import type { ScalePoint, ScaleLinear } from 'd3-scale';

import type { ViewDimensions } from '@/lib/ngx-charts/types';
import { useChartTooltip } from '@/lib/ngx-charts/common/tooltip/tooltip-context';
import type { BandDataPoint, AuxiliaryLine } from '../hooks';

export interface BandTooltipAreaProps {
  dims: ViewDimensions;
  /** Visible data points (filtered to current zoom window) */
  data: BandDataPoint[];
  /** Full unfiltered data — used for brush-zoom index-to-percent calculations */
  allData?: BandDataPoint[];
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
  auxiliaryLines?: AuxiliaryLine[];
  tooltipDisabled?: boolean;
  tooltipTemplate?: (info: BandTooltipInfo) => ReactNode;
  onHoverStrategy?: (id: string | null) => void;
  /** Called with tooltip info on hover, null on leave. Use to render info externally (e.g. in header). */
  onHoverInfo?: (info: BandTooltipInfo | null) => void;
  /** Called when user clicks empty area to deselect the current strategy */
  onSelectStrategy?: (id: string | null) => void;
  /** Enable brush-zoom (click-to-month, drag-to-range) */
  brushZoomEnabled?: boolean;
  /** Called with zoom target range (percentage 0-100) */
  onBrushZoom?: (xRange: { start: number; end: number }) => void;
  /** Y center for X-axis crosshair label (centered between chart bottom and DataZoom). Default: dims.height */
  crosshairXLabelY?: number;
  /** X position for Y-axis crosshair label (DataZoom bar left edge). Default: dims.width */
  crosshairYLabelX?: number;
  /** Fixed width for Y-axis crosshair label (fills DataZoom area). Default: auto */
  crosshairYLabelWidth?: number;
}

export interface BandTooltipInfo {
  date: string;
  band: BandDataPoint;
  closestStrategy: { id: string; value: number } | null;
}

/* ── Crosshair hover state ─────────────────────────────────── */

interface CrosshairState {
  /** Snapped X position (aligned to closest data point) */
  x: number;
  /** Snapped Y position (on the data line, not mouse Y) */
  y: number;
  /** The numeric value at the snap point (for Y-axis label) */
  value: number;
  /** Date string at the snap point (for X-axis label) */
  date: string;
  /** Whether the crosshair is visible */
  visible: boolean;
}

const INITIAL_CROSSHAIR: CrosshairState = { x: 0, y: 0, value: 0, date: '', visible: false };

/* ── Helpers ───────────────────────────────────────────────── */

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateShort(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return `${SHORT_MONTHS[month - 1] ?? parts[1]} ${day}`;
}

function formatValue(v: number): string {
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;
}

/**
 * Binary search to find the closest point index by X position.
 */
function findClosestPointIndex(
  xPos: number,
  data: BandDataPoint[],
  xScale: ScalePoint<string>
): number {
  if (data.length === 0) return 0;

  let minDiff = Number.MAX_VALUE;
  let closestIndex = 0;

  // With scalePoint, domain points are evenly spaced, so we can estimate
  const step = xScale.step();
  if (step > 0) {
    const estimated = Math.round(xPos / step);
    const clamped = Math.max(0, Math.min(data.length - 1, estimated));
    // Check neighbors for the true closest
    for (let i = Math.max(0, clamped - 1); i <= Math.min(data.length - 1, clamped + 1); i++) {
      const px = xScale(data[i].name) ?? 0;
      const diff = Math.abs(px - xPos);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  }

  // Fallback: linear scan
  for (let i = 0; i < data.length; i++) {
    const px = xScale(data[i].name) ?? 0;
    const diff = Math.abs(px - xPos);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }
  return closestIndex;
}

/**
 * Default tooltip template for band chart.
 */
function DefaultBandTooltip({ info }: { info: BandTooltipInfo }) {
  return (
    <div
      className="backdrop-blur-xl bg-white/75 border border-mine-border/50 rounded-xl px-3 py-2.5 text-xs shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
      style={{ minWidth: 140, pointerEvents: 'none' }}
    >
      <div className="text-mine-muted font-mono tabular-nums text-[10px] mb-1.5">{info.date}</div>

      {info.closestStrategy && (
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-mine-border/40">
          <span className="text-mine-text font-medium">{info.closestStrategy.id}</span>
          <span className={`font-mono tabular-nums text-right ${info.closestStrategy.value >= 0 ? 'text-[#CF304A]' : 'text-[#0B8C5F]'}`}>
            {info.closestStrategy.value > 0 ? '+' : ''}{info.closestStrategy.value.toFixed(1)}%
          </span>
        </div>
      )}

      <div className="space-y-0.5">
        <BandRow label="Max" value={info.band.max} />
        <BandRow label="Q3" value={info.band.q3} accent />
        <BandRow label="Med" value={info.band.median} accent highlight />
        <BandRow label="Q1" value={info.band.q1} accent />
        <BandRow label="Min" value={info.band.min} />
      </div>
    </div>
  );
}

function BandRow({ label, value, accent, highlight }: {
  label: string; value: number; accent?: boolean; highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${highlight ? 'text-mine-text font-medium' : ''}`}>
      <span className={`w-7 text-[10px] ${accent ? 'text-mine-text/70' : 'text-mine-muted'}`}>{label}</span>
      <span className={`font-mono tabular-nums text-right ${value >= 0 ? 'text-[#CF304A]' : 'text-[#0B8C5F]'}`}>
        {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </span>
    </div>
  );
}

/** Detect the month range containing the clicked data index */
function getMonthRange(data: BandDataPoint[], clickedIndex: number): [number, number] {
  if (clickedIndex < 0 || clickedIndex >= data.length) {
    return [0, Math.max(0, data.length - 1)];
  }
  const month = data[clickedIndex].name.substring(0, 7); // "YYYY-MM"
  let start = clickedIndex;
  let end = clickedIndex;
  while (start > 0 && data[start - 1].name.startsWith(month)) start--;
  while (end < data.length - 1 && data[end + 1].name.startsWith(month)) end++;
  return [start, end];
}

/** Convert data index range to zoom percentage (0-100) */
function indexRangeToPercent(startIdx: number, endIdx: number, total: number): { start: number; end: number } {
  const pad = 0.5; // half-step padding so edge points aren't clipped
  return {
    start: Math.max(0, ((startIdx - pad) / total) * 100),
    end: Math.min(100, ((endIdx + 1 + pad) / total) * 100),
  };
}

const DRAG_THRESHOLD = 5; // px — below this it's a click, above it's a drag
const SNAP_Y_THRESHOLD = 40; // px — max distance from mouse to strategy line for snap

/* ── Axis label sub-components (TradingView-style dark tags) ── */

function CrosshairXLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const h = 16;
  const w = Math.max(42, text.length * 6.5 + 12);
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={3}
        fill="#000"
      />
      <text
        x={x}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontFamily="var(--font-chart, Roboto, sans-serif)"
        fontWeight={500}
        style={{ fill: '#fff' }}
      >
        {text}
      </text>
    </g>
  );
}

function CrosshairYLabel({ x, y, text, width }: { x: number; y: number; text: string; width?: number }) {
  const h = 18;
  const w = width ?? Math.max(46, text.length * 6.5 + 12);
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={x}
        y={y - h / 2}
        width={w}
        height={h}
        rx={3}
        fill="#000"
      />
      <text
        x={x + w / 2}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontFamily="var(--font-chart, Roboto, sans-serif)"
        fontWeight={500}
        style={{ fill: '#fff', fontVariantNumeric: 'tabular-nums' }}
      >
        {text}
      </text>
    </g>
  );
}

/* ── Main component ────────────────────────────────────────── */

export function BandTooltipArea({
  dims,
  data,
  allData,
  xScale,
  yScale,
  auxiliaryLines,
  tooltipDisabled = false,
  tooltipTemplate,
  onHoverStrategy,
  onHoverInfo,
  onSelectStrategy,
  brushZoomEnabled = false,
  onBrushZoom,
  crosshairXLabelY,
  crosshairYLabelX,
  crosshairYLabelWidth,
}: BandTooltipAreaProps) {
  // For brush-zoom: use full dataset for index→percent mapping
  const zoomData = allData ?? data;
  const [crosshair, setCrosshair] = useState<CrosshairState>(INITIAL_CROSSHAIR);
  const anchorRef = useRef<SVGLineElement>(null);

  // Brush-zoom state
  const dragStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const [brushRect, setBrushRect] = useState<{ x: number; width: number } | null>(null);
  const [brushDayCount, setBrushDayCount] = useState<number | null>(null);

  const { showTooltip, hideTooltip } = useChartTooltip();

  // Pre-build name→value lookup maps for O(1) strategy value access during mousemove
  const auxLookup = useMemo(() => {
    if (!auxiliaryLines || auxiliaryLines.length === 0) return null;
    return auxiliaryLines.map((aux) => {
      const valueMap = new Map<string, number>();
      for (const pt of aux.series) {
        valueMap.set(pt.name, pt.value);
      }
      return { id: aux.id, valueMap };
    });
  }, [auxiliaryLines]);

  const handleMouseDown = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      if (!brushZoomEnabled || data.length === 0) return;
      const target = event.target as SVGRectElement;
      const rect = target.getBoundingClientRect();
      dragStartXRef.current = event.clientX - rect.left;
      isDraggingRef.current = false;
    },
    [brushZoomEnabled, data.length],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      if (data.length === 0) return;

      // Clear day count when starting new crosshair interaction (not during brush drag)
      if (!isDraggingRef.current && brushDayCount !== null) {
        setBrushDayCount(null);
      }

      const target = event.target as SVGRectElement;
      const rect = target.getBoundingClientRect();
      const xPos = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Brush drag detection
      if (brushZoomEnabled && dragStartXRef.current !== null) {
        const dragDist = Math.abs(xPos - dragStartXRef.current);
        if (dragDist > DRAG_THRESHOLD) {
          isDraggingRef.current = true;
          const left = Math.max(0, Math.min(dragStartXRef.current, xPos));
          const right = Math.min(dims.width, Math.max(dragStartXRef.current, xPos));
          setBrushRect({ x: left, width: right - left });

          // Calculate trading day count
          const startIdx = findClosestPointIndex(left, data, xScale);
          const endIdx = findClosestPointIndex(right, data, xScale);
          const dayCount = Math.abs(endIdx - startIdx) + 1;
          setBrushDayCount(dayCount);

          // Suppress crosshair while brushing
          setCrosshair(INITIAL_CROSSHAIR);
          hideTooltip();
          return;
        }
      }

      const closestIndex = findClosestPointIndex(xPos, data, xScale);
      const bp = data[closestIndex];

      let newAnchorX = xScale(bp.name) ?? 0;
      newAnchorX = Math.max(0, Math.min(dims.width, newAnchorX));

      // Find closest strategy line by Y proximity (O(1) lookup per line via pre-built maps)
      let closestStrategy: { id: string; value: number } | null = null;
      if (auxLookup) {
        let closestDist = Infinity;
        for (const { id, valueMap } of auxLookup) {
          const value = valueMap.get(bp.name);
          if (value === undefined) continue;
          const lineY = yScale(value);
          const dist = Math.abs(mouseY - lineY);
          if (dist < closestDist) {
            closestDist = dist;
            closestStrategy = { id, value };
          }
        }
        // Only report if within threshold
        if (closestDist > SNAP_Y_THRESHOLD) {
          onHoverStrategy?.(null);
          closestStrategy = null;
        } else {
          onHoverStrategy?.(closestStrategy?.id ?? null);
        }
      }

      // Snap value: closest strategy line if nearby, otherwise median
      const snapValue = closestStrategy?.value ?? bp.median;
      const snapY = yScale(snapValue);

      setCrosshair({
        x: newAnchorX,
        y: Math.max(0, Math.min(dims.height, snapY)),
        value: snapValue,
        date: bp.name,
        visible: true,
      });

      const info: BandTooltipInfo = {
        date: bp.name,
        band: bp,
        closestStrategy,
      };

      // Notify parent for external rendering (e.g. header)
      onHoverInfo?.(info);

      // Show floating tooltip (unless disabled)
      if (anchorRef.current && !tooltipDisabled) {
        const content = tooltipTemplate
          ? tooltipTemplate(info)
          : <DefaultBandTooltip info={info} />;

        showTooltip({
          content,
          host: anchorRef.current as unknown as HTMLElement,
          placement: 'right',
          type: 'tooltip',
          showCaret: false,
          positionKey: newAnchorX,
        });
      }
    },
    [data, xScale, yScale, dims, auxLookup, tooltipDisabled, tooltipTemplate, showTooltip, onHoverStrategy, onHoverInfo, brushZoomEnabled, hideTooltip, brushDayCount],
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      if (!brushZoomEnabled || dragStartXRef.current === null) {
        dragStartXRef.current = null;
        isDraggingRef.current = false;
        setBrushRect(null);
        return;
      }

      const target = event.target as SVGRectElement;
      const rect = target.getBoundingClientRect();
      const xPos = event.clientX - rect.left;

      if (isDraggingRef.current && data.length > 0) {
        // Drag release → map visible pixel positions to visible data names, then to full-data indices
        const left = Math.min(dragStartXRef.current, xPos);
        const right = Math.max(dragStartXRef.current, xPos);
        const visStartIdx = findClosestPointIndex(Math.max(0, left), data, xScale);
        const visEndIdx = findClosestPointIndex(Math.min(dims.width, right), data, xScale);
        const startName = data[Math.min(visStartIdx, visEndIdx)].name;
        const endName = data[Math.max(visStartIdx, visEndIdx)].name;
        // Find corresponding indices in the full data array
        const fullStart = zoomData.findIndex(d => d.name === startName);
        const fullEnd = zoomData.findIndex(d => d.name === endName);
        if (fullStart >= 0 && fullEnd >= 0) {
          onBrushZoom?.(indexRangeToPercent(
            Math.min(fullStart, fullEnd),
            Math.max(fullStart, fullEnd),
            zoomData.length,
          ));
        }
      } else if (data.length > 0) {
        // Click → find visible point, map to full-data index, zoom to its month
        const visIdx = findClosestPointIndex(xPos, data, xScale);
        const clickedName = data[visIdx].name;
        const fullIdx = zoomData.findIndex(d => d.name === clickedName);
        if (fullIdx >= 0) {
          const [monthStart, monthEnd] = getMonthRange(zoomData, fullIdx);
          onBrushZoom?.(indexRangeToPercent(monthStart, monthEnd, zoomData.length));
        }
      }

      dragStartXRef.current = null;
      isDraggingRef.current = false;
      setBrushRect(null);
    },
    [brushZoomEnabled, data, zoomData, xScale, dims.width, onBrushZoom],
  );

  const handleClick = useCallback(() => {
    // When brush zoom is active, click is handled by mouseUp
    if (brushZoomEnabled) return;
    onSelectStrategy?.(null);
  }, [onSelectStrategy, brushZoomEnabled]);

  const handleMouseLeave = useCallback(() => {
    setCrosshair(INITIAL_CROSSHAIR);
    hideTooltip();
    onHoverStrategy?.(null);
    onHoverInfo?.(null);
    // Clean up brush state
    dragStartXRef.current = null;
    isDraggingRef.current = false;
    setBrushRect(null);
    setBrushDayCount(null);
  }, [hideTooltip, onHoverStrategy, onHoverInfo]);

  const crosshairOpacity = crosshair.visible ? 0.7 : 0;

  const crosshairStyle = useMemo(
    () => ({
      opacity: crosshairOpacity,
      pointerEvents: 'none' as const,
      transition: 'opacity 200ms ease-in-out',
    }),
    [crosshairOpacity]
  );

  const dateLabel = crosshair.visible ? formatDateShort(crosshair.date) : '';
  const valueLabel = crosshair.visible ? formatValue(crosshair.value) : '';

  return (
    <g>
      {/* Invisible area for mouse detection */}
      <rect
        className="tooltip-area"
        x={0}
        y={0}
        width={dims.width}
        height={dims.height}
        style={{ opacity: 0, cursor: brushZoomEnabled ? 'crosshair' : 'auto' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* Brush selection overlay */}
      {brushRect && (
        <>
          <rect
            x={0} y={0}
            width={brushRect.x} height={dims.height}
            fill="rgba(0,0,0,0.04)" pointerEvents="none"
          />
          <rect
            x={brushRect.x} y={0}
            width={brushRect.width} height={dims.height}
            fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.3)"
            strokeWidth={1} rx={2} pointerEvents="none"
          />
          <rect
            x={brushRect.x + brushRect.width} y={0}
            width={Math.max(0, dims.width - brushRect.x - brushRect.width)} height={dims.height}
            fill="rgba(0,0,0,0.04)" pointerEvents="none"
          />
        </>
      )}

      {/* Brush day count label */}
      {brushRect && brushDayCount !== null && (
        <CrosshairXLabel
          x={brushRect.x + brushRect.width / 2}
          y={-10}
          text={`${brushDayCount}D`}
        />
      )}

      {/* Crosshair lines + dot (semi-transparent) */}
      <g style={crosshairStyle}>
        {/* Vertical dashed line */}
        <line
          ref={anchorRef}
          className="tooltip-anchor"
          x1={crosshair.x}
          y1={0}
          x2={crosshair.x}
          y2={dims.height}
          stroke="#1a1a1a"
          strokeWidth={0.5}
          strokeDasharray="4 3"
        />
        {/* Horizontal dashed line (at snapped Y on the data line) */}
        <line
          x1={0}
          y1={crosshair.y}
          x2={dims.width}
          y2={crosshair.y}
          stroke="#1a1a1a"
          strokeWidth={0.5}
          strokeDasharray="4 3"
        />

        {/* Dot on the line */}
        <circle
          cx={crosshair.x}
          cy={crosshair.y}
          r={3.5}
          fill="white"
          stroke="#1a1a1a"
          strokeWidth={1.5}
        />
      </g>

      {/* Axis labels — outside opacity group so they render at full opacity */}
      {crosshair.visible && (
        <g style={{ pointerEvents: 'none' }}>
          <CrosshairXLabel
            x={crosshair.x}
            y={crosshairXLabelY ?? dims.height + 2}
            text={dateLabel}
          />
          <CrosshairYLabel
            x={crosshairYLabelX ?? dims.width + 2}
            y={crosshair.y}
            text={valueLabel}
            width={crosshairYLabelWidth}
          />
        </g>
      )}
    </g>
  );
}
