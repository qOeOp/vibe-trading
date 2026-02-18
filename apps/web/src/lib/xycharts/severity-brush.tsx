'use client';

/**
 * @fileoverview Severity Brush — visx-style range selector with grayscale bars
 *
 * @description
 * A compact brush component that sits above the DivergingBarStack.
 * All bars are equal height — severity is encoded only by grayscale fill
 * (lighter = monotonic, darker = severe violation).
 *
 * Selection overlay follows visx brush style:
 *   - Hatched (diagonal lines) fill in the selected region
 *   - Two white drag handles at left/right edges
 *   - Unselected regions dimmed with white overlay
 *
 * Drag interaction:
 *   - mouseDown on empty area → start new selection
 *   - mouseDown on handle → resize existing selection
 *   - mouseDown inside selection → pan entire selection
 *   - Double-click → reset to full range
 */

import { useState, useRef, useCallback, useMemo, useId, memo } from 'react';
import type { MouseEvent } from 'react';
import { scaleBand } from '@visx/scale';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import type { BrushBarDatum, BrushRange } from './types';

/* ── Constants ─────────────────────────────────────── */

/** Minimum drag distance (px) to distinguish from click */
const DRAG_THRESHOLD = 4;

/** Opacity for the dimmed (unselected) overlay regions */
const DIM_OPACITY = 0.5;

/** Handle width in px */
const HANDLE_WIDTH = 5;

/** Handle corner radius */
const HANDLE_RX = 1.5;

/** Hit area padding around handles for easier grabbing */
const HANDLE_HIT_PADDING = 4;

/* ── Drag Mode ────────────────────────────────────── */

type DragMode = 'new' | 'pan' | 'resize-left' | 'resize-right';

/* ── Props ─────────────────────────────────────────── */

export interface SeverityBrushProps {
  /** Brush bar data (from useBrushBarData) */
  data: BrushBarDatum[];
  /** Current brush selection (null = full range) */
  selectedRange: BrushRange | null;
  /** Called when user selects a range or resets (null) */
  onBrushChange: (range: BrushRange | null) => void;
  /** Container width (from parent) */
  width: number;
  /** Container height (default 32px) */
  height?: number;
  /** Horizontal margin to align with main chart */
  margin?: { left: number; right: number };
}

/* ── Component ─────────────────────────────────────── */

export const SeverityBrush = memo(function SeverityBrush({
  data,
  selectedRange,
  onBrushChange,
  width,
  height = 32,
  margin = { left: 4, right: 4 },
}: SeverityBrushProps) {
  const patternId = useId();
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - 2; // 1px top/bottom padding

  // Drag state
  const svgRef = useRef<SVGSVGElement>(null);
  const dragModeRef = useRef<DragMode | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragAnchorRangeRef = useRef<{ startX: number; endX: number } | null>(null);
  const isDraggingRef = useRef(false);
  const [dragRect, setDragRect] = useState<{ x: number; w: number } | null>(null);

  // X scale: band for time steps
  const xScale = useMemo(
    () =>
      scaleBand<number>({
        domain: data.map((d) => d.t),
        range: [0, innerWidth],
        padding: 0.02,
      }),
    [data, innerWidth],
  );

  const barWidth = xScale.bandwidth();

  // Convert pixel X to nearest timestep index
  const xToTimestep = useCallback(
    (xPx: number): number => {
      if (data.length === 0) return 0;
      const step = xScale.step();
      if (step <= 0) return 0;
      const idx = Math.round(xPx / step);
      return Math.max(0, Math.min(data.length - 1, idx));
    },
    [data, xScale],
  );

  // Get local X position from mouse event
  const getLocalX = useCallback(
    (e: MouseEvent) => {
      if (!svgRef.current) return 0;
      const rect = svgRef.current.getBoundingClientRect();
      return e.clientX - rect.left - margin.left;
    },
    [margin.left],
  );

  /* ── Compute selection overlay from confirmed range ── */

  const selectionOverlay = useMemo(() => {
    if (!selectedRange || data.length === 0) return null;

    const startX = xScale(selectedRange.startT) ?? 0;
    const endX = (xScale(selectedRange.endT) ?? 0) + barWidth;

    return { x: startX, w: endX - startX };
  }, [selectedRange, data, xScale, barWidth]);

  /* ── Hit testing for handles ───────────────────── */

  const getHitZone = useCallback(
    (localX: number): DragMode => {
      if (!selectionOverlay) return 'new';

      const leftEdge = selectionOverlay.x;
      const rightEdge = selectionOverlay.x + selectionOverlay.w;

      // Left handle zone
      if (localX >= leftEdge - HANDLE_HIT_PADDING && localX <= leftEdge + HANDLE_WIDTH + HANDLE_HIT_PADDING) {
        return 'resize-left';
      }
      // Right handle zone
      if (localX >= rightEdge - HANDLE_WIDTH - HANDLE_HIT_PADDING && localX <= rightEdge + HANDLE_HIT_PADDING) {
        return 'resize-right';
      }
      // Inside selection → pan
      if (localX > leftEdge + HANDLE_WIDTH && localX < rightEdge - HANDLE_WIDTH) {
        return 'pan';
      }

      return 'new';
    },
    [selectionOverlay],
  );

  /* ── Mouse handlers ───────────────────────────── */

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      const xPos = getLocalX(e);
      const mode = getHitZone(xPos);

      dragModeRef.current = mode;
      dragStartXRef.current = xPos;
      isDraggingRef.current = false;
      setDragRect(null);

      // For pan/resize, save anchor positions
      if (selectionOverlay && (mode === 'pan' || mode === 'resize-left' || mode === 'resize-right')) {
        dragAnchorRangeRef.current = {
          startX: selectionOverlay.x,
          endX: selectionOverlay.x + selectionOverlay.w,
        };
      } else {
        dragAnchorRangeRef.current = null;
      }
    },
    [getLocalX, getHitZone, selectionOverlay],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragStartXRef.current === null || !dragModeRef.current) return;

      const xPos = getLocalX(e);
      const dragDist = Math.abs(xPos - dragStartXRef.current);

      if (dragDist > DRAG_THRESHOLD) {
        isDraggingRef.current = true;

        const mode = dragModeRef.current;
        const anchor = dragAnchorRangeRef.current;

        if (mode === 'new') {
          // New selection
          const left = Math.max(0, Math.min(dragStartXRef.current, xPos));
          const right = Math.min(innerWidth, Math.max(dragStartXRef.current, xPos));
          setDragRect({ x: left, w: right - left });
        } else if (mode === 'pan' && anchor) {
          // Pan existing selection
          const dx = xPos - dragStartXRef.current;
          let newStart = anchor.startX + dx;
          let newEnd = anchor.endX + dx;
          const selW = anchor.endX - anchor.startX;

          // Clamp to bounds
          if (newStart < 0) { newStart = 0; newEnd = selW; }
          if (newEnd > innerWidth) { newEnd = innerWidth; newStart = innerWidth - selW; }

          setDragRect({ x: newStart, w: newEnd - newStart });
        } else if (mode === 'resize-left' && anchor) {
          // Resize from left edge
          const newLeft = Math.max(0, Math.min(xPos, anchor.endX - barWidth * 5));
          setDragRect({ x: newLeft, w: anchor.endX - newLeft });
        } else if (mode === 'resize-right' && anchor) {
          // Resize from right edge
          const newRight = Math.min(innerWidth, Math.max(xPos, anchor.startX + barWidth * 5));
          setDragRect({ x: anchor.startX, w: newRight - anchor.startX });
        }
      }
    },
    [getLocalX, innerWidth, barWidth],
  );

  // Shared: commit current drag state as a brush selection
  const commitDrag = useCallback(() => {
    if (isDraggingRef.current && data.length > 0 && dragRect) {
      const left = dragRect.x;
      const right = dragRect.x + dragRect.w;

      const startT = data[xToTimestep(left)].t;
      const endT = data[xToTimestep(right)].t;

      if (endT - startT >= 4) {
        onBrushChange({ startT, endT });
      }
    }

    dragModeRef.current = null;
    dragStartXRef.current = null;
    dragAnchorRangeRef.current = null;
    isDraggingRef.current = false;
    setDragRect(null);
  }, [data, dragRect, xToTimestep, onBrushChange]);

  const handleMouseUp = useCallback(
    (_e: MouseEvent) => {
      if (dragStartXRef.current === null) return;
      commitDrag();
    },
    [commitDrag],
  );

  // When mouse leaves during drag, commit the current selection instead of discarding
  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      commitDrag();
    }
  }, [commitDrag]);

  const handleDoubleClick = useCallback(() => {
    onBrushChange(null); // Reset to full range
  }, [onBrushChange]);

  /* ── Cursor ───────────────────────────────────── */

  const getCursor = useCallback(
    (e: MouseEvent) => {
      if (isDraggingRef.current) return;
      const xPos = getLocalX(e);
      const zone = getHitZone(xPos);
      const svg = svgRef.current;
      if (!svg) return;

      switch (zone) {
        case 'resize-left':
        case 'resize-right':
          svg.style.cursor = 'ew-resize';
          break;
        case 'pan':
          svg.style.cursor = 'grab';
          break;
        default:
          svg.style.cursor = 'crosshair';
      }
    },
    [getLocalX, getHitZone],
  );

  /* ── Render ───────────────────────────────────── */

  if (innerWidth <= 0 || data.length === 0) return null;

  // Active rect = dragRect during drag, or selectionOverlay when confirmed
  const activeOverlay = dragRect ?? selectionOverlay;

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="severity-brush"
      style={{ cursor: 'crosshair', userSelect: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => { handleMouseMove(e); getCursor(e); }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      {/* Hatch pattern definition */}
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={6}
          height={6}
          patternTransform="rotate(45)"
        >
          <line
            x1={0} y1={0} x2={0} y2={6}
            stroke="rgba(99, 102, 241, 0.25)"
            strokeWidth={1.5}
          />
        </pattern>
      </defs>

      <Group left={margin.left} top={1}>
        {/* Equal-height bars — severity encoded by fill color only */}
        {data.map((d) => {
          const xPos = xScale(d.t) ?? 0;

          return (
            <Bar
              key={d.t}
              x={xPos}
              y={0}
              width={barWidth}
              height={innerHeight}
              fill={d.fill}
              rx={0}
            />
          );
        })}

        {/* Selection overlay */}
        {activeOverlay && (
          <>
            {/* Left dim region */}
            {activeOverlay.x > 0 && (
              <rect
                x={0}
                y={0}
                width={activeOverlay.x}
                height={innerHeight}
                fill="white"
                opacity={DIM_OPACITY}
              />
            )}

            {/* Hatched selection area */}
            <rect
              x={activeOverlay.x}
              y={0}
              width={activeOverlay.w}
              height={innerHeight}
              fill={`url(#${patternId})`}
            />

            {/* Selection border */}
            <rect
              x={activeOverlay.x}
              y={0}
              width={activeOverlay.w}
              height={innerHeight}
              fill="none"
              stroke="rgba(99, 102, 241, 0.4)"
              strokeWidth={1}
              rx={1}
            />

            {/* Right dim region */}
            {activeOverlay.x + activeOverlay.w < innerWidth && (
              <rect
                x={activeOverlay.x + activeOverlay.w}
                y={0}
                width={Math.max(0, innerWidth - activeOverlay.x - activeOverlay.w)}
                height={innerHeight}
                fill="white"
                opacity={DIM_OPACITY}
              />
            )}

            {/* Left handle */}
            <rect
              x={activeOverlay.x - 1}
              y={(innerHeight - 14) / 2}
              width={HANDLE_WIDTH}
              height={14}
              rx={HANDLE_RX}
              fill="white"
              stroke="rgba(99, 102, 241, 0.5)"
              strokeWidth={1}
            />
            {/* Left handle grip lines */}
            <line
              x1={activeOverlay.x + 0.5}
              y1={(innerHeight - 6) / 2}
              x2={activeOverlay.x + 0.5}
              y2={(innerHeight + 6) / 2}
              stroke="rgba(99, 102, 241, 0.4)"
              strokeWidth={0.5}
            />
            <line
              x1={activeOverlay.x + 2}
              y1={(innerHeight - 6) / 2}
              x2={activeOverlay.x + 2}
              y2={(innerHeight + 6) / 2}
              stroke="rgba(99, 102, 241, 0.4)"
              strokeWidth={0.5}
            />

            {/* Right handle */}
            <rect
              x={activeOverlay.x + activeOverlay.w - HANDLE_WIDTH + 1}
              y={(innerHeight - 14) / 2}
              width={HANDLE_WIDTH}
              height={14}
              rx={HANDLE_RX}
              fill="white"
              stroke="rgba(99, 102, 241, 0.5)"
              strokeWidth={1}
            />
            {/* Right handle grip lines */}
            <line
              x1={activeOverlay.x + activeOverlay.w - 2.5}
              y1={(innerHeight - 6) / 2}
              x2={activeOverlay.x + activeOverlay.w - 2.5}
              y2={(innerHeight + 6) / 2}
              stroke="rgba(99, 102, 241, 0.4)"
              strokeWidth={0.5}
            />
            <line
              x1={activeOverlay.x + activeOverlay.w - 1}
              y1={(innerHeight - 6) / 2}
              x2={activeOverlay.x + activeOverlay.w - 1}
              y2={(innerHeight + 6) / 2}
              stroke="rgba(99, 102, 241, 0.4)"
              strokeWidth={0.5}
            />
          </>
        )}
      </Group>
    </svg>
  );
});
