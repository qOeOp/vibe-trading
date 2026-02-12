'use client';

import type { ReactElement, ReactNode } from 'react';
import { useState, useRef, useEffect, useCallback, useId, useMemo } from 'react';

export interface DataZoomBarProps {
  /** Height of the zoom bar (pixels) */
  height: number;
  /** Width of the zoom bar (pixels) */
  width?: number;
  /** Start percentage (0-100) */
  start: number;
  /** End percentage (0-100) */
  end: number;
  /** Callback when zoom changes */
  onChange: (start: number, end: number) => void;
  /** Orientation (default: vertical) */
  orient?: 'vertical' | 'horizontal';
  /** Color of the slider filler */
  fillColor?: string;
  /** Color of the track */
  trackColor?: string;
  /** Custom class name */
  className?: string;
  /** Y-axis domain [min, max] for rendering heat/grid background (Vertical only) */
  yDomain?: [number, number];
  /** X-axis labels to display evenly (Horizontal only) */
  xLabels?: string[];
}

export function DataZoomBar({
  height,
  width = 20,
  start,
  end,
  onChange,
  orient = 'vertical',
  fillColor = '#cfd8dc',
  trackColor = '#f5f5f5',
  className = '',
  yDomain,
  xLabels,
}: DataZoomBarProps) {
  const isVertical = orient === 'vertical';
  
  // Normalized 0-1 values
  const startRatio = Math.max(0, Math.min(1, start / 100));
  const endRatio = Math.max(0, Math.min(1, end / 100));

  const [isDragging, setIsDragging] = useState<'start' | 'end' | 'pan' | null>(null);
  const dragStartRef = useRef<number>(0);
  const startValRef = useRef<number>(0);
  const endValRef = useRef<number>(0);

  const containerRef = useRef<SVGGElement>(null);
  const reactId = useId();
  const clipId = `zoom-clip${reactId.replace(/:/g, '')}`;

  const isDraggingRef = useRef(isDragging);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  
  const onMouseMoveStable = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let ratio = 0;
    if (orient === 'vertical') {
      const relY = e.clientY - rect.top;
      ratio = rect.height > 0 ? 1 - (relY / rect.height) : 0;
    } else {
      const relX = e.clientX - rect.left;
      ratio = rect.width > 0 ? (relX / rect.width) : 0;
    }
    
    const delta = ratio - dragStartRef.current;
    
    let newStart = startValRef.current;
    let newEnd = endValRef.current;
    
    const type = isDraggingRef.current;
    const span = endValRef.current - startValRef.current;
    
    if (type === 'pan') {
      newStart = startValRef.current + delta;
      // Clamp
      if (newStart < 0) newStart = 0;
      if (newStart + span > 1) newStart = 1 - span;
      newEnd = newStart + span;
    } else if (type === 'start') {
      newStart = startValRef.current + delta;
      if (newStart < 0) newStart = 0;
      if (newStart > newEnd - 0.01) newStart = newEnd - 0.01;
    } else if (type === 'end') {
      newEnd = endValRef.current + delta;
      if (newEnd > 1) newEnd = 1;
      if (newEnd < newStart + 0.01) newEnd = newStart + 0.01;
    }
    
    onChange(newStart * 100, newEnd * 100);
  }, [orient, onChange]);

  const activeListenerRef = useRef<(e: MouseEvent) => void>(null);
  const startPropRef = useRef(start);
  const endPropRef = useRef(end);
  useEffect(() => { startPropRef.current = start; }, [start]);
  useEffect(() => { endPropRef.current = end; }, [end]);

  const handleMouseUpRef = useRef<() => void>(null);

  const handleMouseUpStable = useCallback(() => {
    setIsDragging(null);
    if (activeListenerRef.current) {
        document.removeEventListener('mousemove', activeListenerRef.current);
    }
    if (handleMouseUpRef.current) {
        document.removeEventListener('mouseup', handleMouseUpRef.current);
    }
  }, []);

  handleMouseUpRef.current = handleMouseUpStable;

  const handleMouseDownStable = useCallback((type: 'start' | 'end' | 'pan', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    let ratio = 0;
    if (rect) {
      if (orient === 'vertical') {
        ratio = rect.height > 0 ? Math.max(0, Math.min(1, 1 - ((e.clientY - rect.top) / rect.height))) : 0;
      } else {
        ratio = rect.width > 0 ? Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) : 0;
      }
    }

    dragStartRef.current = ratio;
    startValRef.current = startPropRef.current / 100;
    endValRef.current = endPropRef.current / 100;

    isDraggingRef.current = type;
    setIsDragging(type);

    activeListenerRef.current = onMouseMoveStable;
    document.addEventListener('mousemove', onMouseMoveStable);
    document.addEventListener('mouseup', handleMouseUpStable);
  }, [orient, onMouseMoveStable, handleMouseUpStable]);

  // Cleanup document listeners on unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (activeListenerRef.current) {
        document.removeEventListener('mousemove', activeListenerRef.current);
      }
      if (handleMouseUpRef.current) {
        document.removeEventListener('mouseup', handleMouseUpRef.current);
      }
    };
  }, []);

  // Vertical layout: bottom-up (0% at bottom, 100% at top)
  const yEnd = (1 - endRatio) * height;
  const barHeight = (endRatio - startRatio) * height;
  
  const barWidth = width;
  
  // Y-Axis Background Logic (memoized to avoid recreation each render)
  const yBackground = useMemo((): ReactNode => {
    if (!yDomain) return null;
    const [min, max] = yDomain;
    const range = max - min;
    if (range === 0) return null;

    const rawStep = range / 12;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const residual = rawStep / magnitude;
    let step = magnitude;
    if (residual > 5) step *= 10;
    else if (residual > 2) step *= 5;
    else if (residual > 1) step *= 2;

    if (step <= 0 || !isFinite(step)) return null;

    const startVal = Math.floor(min / step) * step;
    const blocks: ReactElement[] = [];
    const MAX_TICKS = 100;

    for (let v = startVal, tickCount = 0; v <= max && tickCount < MAX_TICKS; v += step, tickCount++) {
      if (v < min) continue;

      const ratio = (v - min) / range;
      const nextRatio = ((v + step) - min) / range;
      const yBottom = height * (1 - ratio);
      const yTop = height * (1 - nextRatio);
      const blockHeight = Math.abs(yBottom - yTop);
      const y = yTop;

      const mid = v + step / 2;
      const isUp = mid >= 0;
      const color = isUp ? '#CF304A' : '#0B8C5F';

      blocks.push(
        <g key={v}>
          <rect
            x={0}
            y={y}
            width={barWidth}
            height={Math.max(0, blockHeight - 1)}
            fill={color}
            opacity={0.15}
          />
          {v !== 0 && (
            <text
              x={barWidth / 2}
              y={y + blockHeight / 2}
              dy=".32em"
              textAnchor="middle"
              fontSize="9px"
              fill={isUp ? '#CF304A' : '#0B8C5F'}
              fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {Math.abs(v)}
            </text>
          )}
        </g>
      );
    }

    // Zero line
    if (min < 0 && max > 0) {
        const zeroRatio = (0 - min) / range;
        const zeroY = height * (1 - zeroRatio);
        blocks.push(
            <line key="zero" x1={0} y1={zeroY} x2={barWidth} y2={zeroY} stroke="#999" strokeWidth={1} strokeDasharray="2 2" />
        );
    }

    return <g className="zoom-y-bg">{blocks}</g>;
  }, [yDomain, height, barWidth]);

  if (!isVertical) {
    const xStart = startRatio * width;
    const fillerWidth = (endRatio - startRatio) * width;
    const barThickness = height;

    return (
      <g 
        className={`data-zoom-bar ${className}`} 
        ref={containerRef}
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
          {/* Track */}
          <rect 
              x={0} 
              y={0} 
              width={width} 
              height={barThickness} 
              fill={trackColor} 
              rx={2}
          />

          {/* Month Labels Background */}
          {xLabels && xLabels.length > 0 && (
            <g className="zoom-x-labels" pointerEvents="none">
              {xLabels.map((label, i) => {
                const step = width / xLabels.length;
                const x = i * step + step / 2;
                return (
                  <text
                    key={i}
                    x={x}
                    y={barThickness / 2}
                    dy=".32em"
                    textAnchor="middle"
                    fontSize="10px"
                    fill="#9ca3af"
                    fontWeight="500"
                  >
                    {label}
                  </text>
                );
              })}
              {/* Dividers */}
              {xLabels.map((_, i) => i > 0 && (
                <line
                  key={`div-${i}`}
                  x1={(width / xLabels.length) * i}
                  y1={2}
                  x2={(width / xLabels.length) * i}
                  y2={barThickness - 2}
                  stroke={i % 4 === 0 ? "#d1d5db" : "#e5e7eb"} // Darker divider for years (every 4 quarters)
                  strokeWidth={1}
                />
              ))}
            </g>
          )}
          
          {/* Filler (Active Range) */}
          <rect
              x={xStart}
              y={0}
              width={fillerWidth}
              height={barThickness}
              fill={fillColor}
              cursor="grab"
              onMouseDown={(e) => handleMouseDownStable('pan', e)}
              fillOpacity={0.5}
          />
          
          {/* Start Handle (Left) */}
          <rect
              x={xStart - 2}
              y={0}
              width={4}
              height={barThickness}
              fill="#fff"
              stroke="#999"
              strokeWidth={1}
              cursor="ew-resize"
              onMouseDown={(e) => handleMouseDownStable('start', e)}
          />
          <line x1={xStart} y1={barThickness/2 - 2} x2={xStart} y2={barThickness/2 + 2} stroke="#666" strokeWidth={1} pointerEvents="none" />
          
          {/* End Handle (Right) */}
          <rect
              x={xStart + fillerWidth - 2}
              y={0}
              width={4}
              height={barThickness}
              fill="#fff"
              stroke="#999"
              strokeWidth={1}
              cursor="ew-resize"
              onMouseDown={(e) => handleMouseDownStable('end', e)}
          />
          <line x1={xStart + fillerWidth} y1={barThickness/2 - 2} x2={xStart + fillerWidth} y2={barThickness/2 + 2} stroke="#666" strokeWidth={1} pointerEvents="none" />
      </g>
    );
  }
  
  return (
    <g
      className={`data-zoom-bar ${className}`}
      ref={containerRef}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
        <defs>
          <clipPath id={clipId}>
            <rect x={-1} y={-1} width={barWidth + 2} height={height + 2} />
          </clipPath>
        </defs>

        {/* Everything clipped to track bounds (1px bleed for strokes) */}
        <g clipPath={`url(#${clipId})`}>
          {/* Track */}
          <rect
              x={0}
              y={0}
              width={barWidth}
              height={height}
              fill={trackColor}
              rx={2}
          />

          {yBackground}

          {/* Filler (Active Range) */}
          <rect
              x={0}
              y={yEnd}
              width={barWidth}
              height={barHeight}
              fill={fillColor}
              cursor="grab"
              onMouseDown={(e) => handleMouseDownStable('pan', e)}
              fillOpacity={0.5}
          />

          {/* End Handle (Top) */}
          <rect
              x={0}
              y={Math.max(0, yEnd - 2)}
              width={barWidth}
              height={4}
              fill="#fff"
              stroke="#999"
              strokeWidth={1}
              cursor="ns-resize"
              onMouseDown={(e) => handleMouseDownStable('end', e)}
          />
          <line x1={barWidth/2 - 2} y1={Math.max(2, yEnd)} x2={barWidth/2 + 2} y2={Math.max(2, yEnd)} stroke="#666" strokeWidth={1} pointerEvents="none" />

          {/* Start Handle (Bottom) */}
          <rect
              x={0}
              y={Math.min(height - 4, yEnd + barHeight - 2)}
              width={barWidth}
              height={4}
              fill="#fff"
              stroke="#999"
              strokeWidth={1}
              cursor="ns-resize"
              onMouseDown={(e) => handleMouseDownStable('start', e)}
          />
          <line x1={barWidth/2 - 2} y1={Math.min(height - 2, yEnd + barHeight)} x2={barWidth/2 + 2} y2={Math.min(height - 2, yEnd + barHeight)} stroke="#666" strokeWidth={1} pointerEvents="none" />
        </g>
    </g>
  );
}
