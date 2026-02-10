'use client';

/**
 * @fileoverview Line race chart hook
 *
 * @description
 * Custom hook providing line race chart calculations including scales, domains,
 * animation playback state, and data processing. Follows ngx-charts patterns.
 *
 * @license MIT
 */

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { scaleLinear, ScaleLinear } from 'd3-scale';

import {
  ViewDimensions,
  ScaleType,
  ColorScheme,
  LegendPosition,
} from '../../types';
import { ColorHelper, calculateViewDimensions, useStableId } from '../../utils';

/** Individual series data for line race */
export interface LineRaceSeriesData {
  name: string;
  values: number[];
}

/** Line race chart configuration */
export interface UseLineRaceConfig {
  /** Array of series, each with a name and array of numeric values per round */
  data: LineRaceSeriesData[];
  /** Container width */
  width: number;
  /** Container height */
  height: number;
  /** Color scheme */
  colorScheme: string | ColorScheme;
  /** Scale type for colors */
  schemeType?: ScaleType;
  /** Custom colors */
  customColors?: string[];
  /** Show X axis */
  xAxis?: boolean;
  /** Show Y axis */
  yAxis?: boolean;
  /** Show X axis label */
  showXAxisLabel?: boolean;
  /** Show Y axis label */
  showYAxisLabel?: boolean;
  /** Show legend */
  legend?: boolean;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Round domains to nice values */
  roundDomains?: boolean;
  /** Y scale minimum */
  yScaleMin?: number;
  /** Y scale maximum */
  yScaleMax?: number;
  /** Margin array [top, right, bottom, left] */
  margin?: [number, number, number, number];
  /** Animation duration per step in ms */
  stepDuration?: number;
  /** Auto-play on mount */
  autoPlay?: boolean;
}

export interface LineRaceState {
  /** View dimensions after accounting for axes, margins, etc. */
  dims: ViewDimensions;
  /** X scale function */
  xScale: ScaleLinear<number, number>;
  /** Y scale function */
  yScale: ScaleLinear<number, number>;
  /** X domain */
  xDomain: [number, number];
  /** Y domain */
  yDomain: [number, number];
  /** Series domain (names) */
  seriesDomain: string[];
  /** Color helper instance */
  colors: ColorHelper;
  /** Custom color array (if provided) */
  customColorArray?: string[];
  /** Transform string for chart positioning */
  transform: string;
  /** Clip path ID */
  clipPathId: string;
  /** Clip path URL reference */
  clipPath: string;
  /** Total number of rounds (steps) */
  totalRounds: number;
  /** Current visible round (0 = first data point) */
  currentRound: number;
  /** Interpolation progress [0..1] between currentRound-1 and currentRound */
  interpolation: number;
  /** Whether animation is playing */
  isPlaying: boolean;
  /** X axis height for layout */
  xAxisHeight: number;
  /** Y axis width for layout */
  yAxisWidth: number;
  /** Update X axis height callback */
  onXAxisHeightChange: (height: number) => void;
  /** Update Y axis width callback */
  onYAxisWidthChange: (width: number) => void;
  /** Start/resume playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Seek to specific round */
  seekTo: (round: number) => void;
  /** Reset to start */
  reset: () => void;
  /** Legend options */
  legendOptions: {
    scaleType: ScaleType;
    colors: ColorHelper;
    domain: string[];
    title?: string;
    position: LegendPosition;
  };
}

/**
 * Custom hook for line race chart calculations and animation playback
 */
export function useLineRace(config: UseLineRaceConfig): LineRaceState {
  const {
    data,
    width,
    height,
    colorScheme,
    schemeType = ScaleType.Ordinal,
    customColors,
    xAxis = true,
    yAxis = true,
    showXAxisLabel = false,
    showYAxisLabel = false,
    legend = false,
    legendPosition = LegendPosition.Below,
    roundDomains = false,
    yScaleMin,
    yScaleMax,
    margin = [10, 20, 10, 20],
    stepDuration = 1000,
    autoPlay = false,
  } = config;

  // Axis dimension state
  const [xAxisHeight, setXAxisHeight] = useState(0);
  const [yAxisWidth, setYAxisWidth] = useState(0);
  const onXAxisHeightChange = useCallback((h: number) => setXAxisHeight(h), []);
  const onYAxisWidthChange = useCallback((w: number) => setYAxisWidth(w), []);

  // SSR-safe stable clip path ID
  const stableClipId = useStableId('clip');

  // Animation state — interpolation lives in a ref to avoid 60fps state updates
  // which cause "Maximum update depth exceeded". We use a reduced-frequency
  // forceUpdate counter to push ~20fps visual updates to React.
  const [currentRound, setCurrentRound] = useState(0);
  const interpolationRef = useRef(1);
  const [interpolationSnapshot, setInterpolationSnapshot] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const fromRoundRef = useRef<number>(-1);
  const toRoundRef = useRef<number>(0);
  const lastSnapshotRef = useRef<number>(0);

  // Total rounds = length of values array - 1 (0-indexed)
  const totalRounds = useMemo(() => {
    if (data.length === 0) return 0;
    return data[0].values.length - 1;
  }, [data]);

  // Static chart state (scales, dimensions, colors)
  const chartState = useMemo(() => {
    const dims = calculateViewDimensions({
      width,
      height,
      margins: margin,
      showXAxis: xAxis,
      showYAxis: yAxis,
      xAxisHeight,
      yAxisWidth,
      showXLabel: showXAxisLabel,
      showYLabel: showYAxisLabel,
      showLegend: legend,
      legendType: schemeType,
      legendPosition,
    });

    // X domain: round indices
    const xDomain: [number, number] = [0, totalRounds];

    // Y domain: min/max across all series with padding
    let yMin = Infinity;
    let yMax = -Infinity;
    for (const series of data) {
      for (const v of series.values) {
        if (v < yMin) yMin = v;
        if (v > yMax) yMax = v;
      }
    }
    if (yScaleMin !== undefined) yMin = Math.min(yMin, yScaleMin);
    if (yScaleMax !== undefined) yMax = Math.max(yMax, yScaleMax);
    // Add 10% padding so lines don't hug edges
    const yRange = yMax - yMin || 1;
    const yPad = yRange * 0.1;
    yMin -= yPad;
    yMax += yPad;
    const yDomain: [number, number] = [yMin, yMax];

    // Create X scale
    let xScale = scaleLinear().range([0, dims.width]).domain(xDomain);
    if (roundDomains) xScale = xScale.nice();

    // Create Y scale
    let yScale = scaleLinear().range([dims.height, 0]).domain(yDomain);
    if (roundDomains) yScale = yScale.nice();

    // Series domain
    const seriesDomain = data.map((d) => d.name);

    // Colors
    const colors = new ColorHelper({
      scheme: colorScheme,
      scaleType: schemeType,
      domain: seriesDomain,
      customColors: customColors
        ? customColors.map((c, i) => ({ name: seriesDomain[i] || String(i), value: c }))
        : undefined,
    });

    // Clip path (SSR-safe stable ID)
    const clipPathId = stableClipId;
    const clipPath = `url(#${clipPathId})`;

    // Transform
    const transform = `translate(${dims.xOffset ?? 0}, ${margin[0]})`;

    // Legend options
    const legendOptions = {
      scaleType: schemeType,
      colors,
      domain: seriesDomain,
      title: legend ? 'Legend' : undefined,
      position: legendPosition,
    };

    return {
      dims,
      xScale,
      yScale,
      xDomain,
      yDomain,
      seriesDomain,
      colors,
      customColorArray: customColors,
      transform,
      clipPathId,
      clipPath,
      legendOptions,
    };
  }, [
    data,
    width,
    height,
    colorScheme,
    schemeType,
    customColors,
    xAxis,
    yAxis,
    showXAxisLabel,
    showYAxisLabel,
    legend,
    legendPosition,
    roundDomains,
    yScaleMin,
    yScaleMax,
    margin,
    xAxisHeight,
    yAxisWidth,
    totalRounds,
    stableClipId,
  ]);

  // Animation tick — writes to ref, only pushes React state at ~20fps or on step boundary
  const animTick = useCallback(() => {
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const progress = Math.min(elapsed / stepDuration, 1);
    interpolationRef.current = progress;

    if (progress >= 1) {
      // Step complete — push state synchronously
      const nextRound = toRoundRef.current;
      interpolationRef.current = 1;
      setInterpolationSnapshot(1);
      setCurrentRound(nextRound);
      lastSnapshotRef.current = now;

      if (nextRound < totalRounds) {
        // Advance to next step
        fromRoundRef.current = nextRound;
        toRoundRef.current = nextRound + 1;
        startTimeRef.current = now;
        animRef.current = requestAnimationFrame(animTick);
      } else {
        // Animation complete
        setIsPlaying(false);
        animRef.current = null;
      }
    } else {
      // Throttle React state updates to ~20fps (every 50ms) to avoid
      // "Maximum update depth exceeded" from 60fps setInterpolation calls
      if (now - lastSnapshotRef.current > 50) {
        setInterpolationSnapshot(progress);
        lastSnapshotRef.current = now;
      }
      animRef.current = requestAnimationFrame(animTick);
    }
  }, [stepDuration, totalRounds]);

  // Track currentRound in a ref to avoid stale closure in play()
  const currentRoundRef = useRef(currentRound);
  currentRoundRef.current = currentRound;

  // Play
  const play = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    let startFrom = currentRoundRef.current;
    if (startFrom >= totalRounds) {
      // If at end, restart
      startFrom = 0;
      setCurrentRound(0);
      interpolationRef.current = 1;
      setInterpolationSnapshot(1);
    }

    fromRoundRef.current = startFrom;
    toRoundRef.current = startFrom + 1;
    startTimeRef.current = performance.now();
    lastSnapshotRef.current = performance.now();
    setIsPlaying(true);
    animRef.current = requestAnimationFrame(animTick);
  }, [totalRounds, animTick]);

  // Pause
  const pause = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Seek
  const seekTo = useCallback((round: number) => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    setIsPlaying(false);
    const clamped = Math.max(0, Math.min(round, totalRounds));
    setCurrentRound(clamped);
    interpolationRef.current = 1;
    setInterpolationSnapshot(1);
  }, [totalRounds]);

  // Reset
  const reset = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    setIsPlaying(false);
    setCurrentRound(0);
    interpolationRef.current = 1;
    setInterpolationSnapshot(1);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Auto-play
  useEffect(() => {
    if (autoPlay && totalRounds > 0) {
      play();
    }
  }, [autoPlay, totalRounds]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...chartState,
    totalRounds,
    currentRound,
    interpolation: interpolationSnapshot,
    isPlaying,
    xAxisHeight,
    yAxisWidth,
    onXAxisHeightChange,
    onYAxisWidthChange,
    play,
    pause,
    seekTo,
    reset,
  };
}
