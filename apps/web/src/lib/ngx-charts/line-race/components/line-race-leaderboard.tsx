/**
 * @fileoverview Animated leaderboard for line race chart
 *
 * @description
 * Displays a live-updating ranking sidebar that animates position changes
 * as the line race progresses. Each entry shows rank, marker, name, and value.
 * An SVG connector line links each leaderboard row to its corresponding
 * data point on the chart.
 *
 * @license MIT
 */

'use client';

import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import type { LineRaceSeriesData } from '../hooks/use-line-race';

export interface LeaderboardEntry {
  name: string;
  value: number;
  color: string;
  rank: number;
  seriesIndex: number;
  /** Y coordinate of the data point on chart (for connector) */
  chartY: number;
}

export interface LineRaceLeaderboardProps {
  /** All series data */
  data: LineRaceSeriesData[];
  /** Current completed round */
  currentRound: number;
  /** Interpolation progress [0..1] */
  interpolation: number;
  /** Whether animation is playing */
  isPlaying: boolean;
  /** Custom color array */
  customColors?: string[];
  /** Active (hovered) series */
  activeSeries?: string | null;
  /** Hover callbacks */
  onSeriesActivate?: (name: string) => void;
  onSeriesDeactivate?: () => void;
  /** Width of the leaderboard panel */
  width?: number;
  /** Chart Y scale for computing connector Y positions */
  yScale?: (value: number) => number;
  /** Format function for display values (e.g. returns as percentages) */
  valueFormatter?: (value: number) => string;
}

/**
 * Animated leaderboard component.
 * Entries smoothly slide to their new ranked positions using CSS transforms.
 */
export function LineRaceLeaderboard({
  data,
  currentRound,
  interpolation,
  isPlaying,
  customColors,
  activeSeries,
  onSeriesActivate,
  onSeriesDeactivate,
  width = 200,
  valueFormatter,
}: LineRaceLeaderboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ROW_HEIGHT = 32;
  const GAP = 2;
  const ITEM_STEP = ROW_HEIGHT + GAP;

  // Compute current values and rankings
  const entries: LeaderboardEntry[] = useMemo(() => {
    const items = data.map((series, i) => {
      const maxR = Math.min(currentRound, series.values.length - 1);
      let value: number;

      if (isPlaying && interpolation < 1 && currentRound < series.values.length - 1) {
        const fromVal = series.values[currentRound];
        const toVal = series.values[currentRound + 1];
        value = fromVal + (toVal - fromVal) * interpolation;
      } else {
        value = series.values[maxR];
      }

      return {
        name: series.name,
        value,
        color: customColors?.[i] ?? '#666',
        rank: 0,
        seriesIndex: i,
        chartY: 0,
      };
    });

    // Sort by value descending (highest = rank 1)
    items.sort((a, b) => b.value - a.value);
    items.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    return items;
  }, [data, currentRound, interpolation, isPlaying, customColors]);

  // Track previous positions for smooth animation
  const [positions, setPositions] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const newPositions = new Map<string, number>();
    entries.forEach((entry) => {
      newPositions.set(entry.name, (entry.rank - 1) * ITEM_STEP);
    });
    setPositions(newPositions);
  }, [entries, ITEM_STEP]);

  const hasActive = activeSeries != null;

  const handleMouseEnter = useCallback((name: string) => {
    onSeriesActivate?.(name);
  }, [onSeriesActivate]);

  const handleMouseLeave = useCallback(() => {
    onSeriesDeactivate?.();
  }, [onSeriesDeactivate]);

  const totalHeight = data.length * ITEM_STEP;

  // Medal styles for top 3
  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // gold, silver, bronze

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col"
      style={{ width, height: totalHeight }}
    >
      {entries.map((entry) => {
        const y = positions.get(entry.name) ?? (entry.rank - 1) * ITEM_STEP;
        const isActive = activeSeries === entry.name;
        const isInactive = hasActive && !isActive;
        const isMedal = entry.rank <= 3;

        return (
          <div
            key={entry.name}
            className="absolute left-0 right-0 flex items-center gap-2 px-2 rounded-md cursor-pointer select-none"
            style={{
              height: ROW_HEIGHT,
              top: 0,
              transform: `translateY(${y}px)`,
              transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease',
              opacity: isInactive ? 0.3 : 1,
              background: isActive ? `${entry.color}0D` : 'transparent',
            }}
            onMouseEnter={() => handleMouseEnter(entry.name)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Rank badge */}
            <span
              className="shrink-0 flex items-center justify-center text-[10px] font-bold rounded-full"
              style={{
                width: 20,
                height: 20,
                background: isMedal ? medalColors[entry.rank - 1] : '#f0f0f0',
                color: isMedal ? '#fff' : '#999',
                textShadow: isMedal ? '0 1px 1px rgba(0,0,0,0.2)' : undefined,
              }}
            >
              {entry.rank}
            </span>

            {/* Color dot */}
            <span
              className="shrink-0 rounded-full"
              style={{
                width: 8,
                height: 8,
                backgroundColor: entry.color,
                boxShadow: isActive ? `0 0 6px ${entry.color}80` : undefined,
              }}
            />

            {/* Name */}
            <span
              className="flex-1 min-w-0 text-[11px] truncate"
              style={{
                color: '#333',
                fontWeight: isActive ? 600 : 400,
                fontFamily: 'var(--font-chart, Roboto, sans-serif)',
              }}
            >
              {entry.name}
            </span>

            {/* Value */}
            <span
              className="shrink-0 text-[11px] font-mono tabular-nums font-medium"
              style={{
                color: entry.color,
                fontFamily: 'var(--font-chart, Roboto, sans-serif)',
              }}
            >
              {valueFormatter ? valueFormatter(entry.value) : entry.value.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
