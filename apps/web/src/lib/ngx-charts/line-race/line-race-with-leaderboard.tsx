/**
 * @fileoverview Line race chart with animated leaderboard
 *
 * @description
 * Composite component that renders the LineRace chart on the left and a
 * live-updating leaderboard on the right. SVG connector lines bridge each
 * series' leading data point to its leaderboard row, creating a dynamic
 * visual link between the chart and rankings.
 *
 * Axes are intentionally omitted — the leaderboard values replace the Y axis,
 * and the playback controls bar shows a dynamic round label replacing the X axis.
 *
 * @license MIT
 */

'use client';

import { useState, useCallback, useRef, useMemo, type MouseEvent } from 'react';
import { CurveFactory, curveLinear, line } from 'd3-shape';

import {
  ColorScheme,
  ScaleType,
  LegendPosition,
} from '../types';
import {
  BaseChart,
} from '../common';
import { useLineRace, type LineRaceSeriesData } from './hooks';
import { LineRaceSeries } from './components';
import { LineRaceLeaderboard } from './components/line-race-leaderboard';

export interface LineRaceWithLeaderboardProps {
  data: LineRaceSeriesData[];
  width?: number;
  height?: number;
  colorScheme?: string | ColorScheme;
  schemeType?: ScaleType;
  customColors?: string[];
  showGridLines?: boolean;
  curve?: CurveFactory;
  strokeWidth?: number;
  roundDomains?: boolean;
  yScaleMin?: number;
  yScaleMax?: number;
  stepDuration?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  onRoundChange?: (round: number) => void;
  className?: string;
  /** Leaderboard panel width */
  leaderboardWidth?: number;
  /** Human-readable labels for each round index (shown in the playback bar) */
  roundLabels?: string[];
  /** Y value at which to draw a horizontal baseline (e.g. 0 for breakeven) */
  baseline?: number;
  /** Format function for display values (e.g. returns as percentages) */
  valueFormatter?: (value: number) => string;
  /** Benchmark data rendered as a static dashed line (not in leaderboard) */
  benchmarkData?: number[];
  /** Label for the benchmark line */
  benchmarkLabel?: string;
  /** Color for the benchmark line */
  benchmarkColor?: string;
}

export function LineRaceWithLeaderboard({
  width,
  height,
  colorScheme = 'vivid',
  schemeType = ScaleType.Ordinal,
  className = '',
  ...rest
}: LineRaceWithLeaderboardProps) {
  return (
    <BaseChart
      width={width}
      height={height}
      colorScheme={colorScheme}
      scaleType={schemeType}
      animated={false}
      className={`ngx-charts-line-race-lb ${className}`}
    >
      {({ width: containerWidth, height: containerHeight }) => (
        <LineRaceWithLeaderboardInner
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          colorScheme={colorScheme}
          schemeType={schemeType}
          {...rest}
        />
      )}
    </BaseChart>
  );
}

interface InnerProps extends Omit<LineRaceWithLeaderboardProps, 'width' | 'height' | 'className'> {
  containerWidth: number;
  containerHeight: number;
}

function LineRaceWithLeaderboardInner({
  data,
  containerWidth,
  containerHeight,
  colorScheme = 'vivid',
  schemeType = ScaleType.Ordinal,
  customColors,
  showGridLines = true,
  curve = curveLinear,
  strokeWidth = 2,
  roundDomains = false,
  yScaleMin,
  yScaleMax,
  stepDuration = 1000,
  autoPlay = true,
  showControls = true,
  onRoundChange,
  leaderboardWidth = 190,
  roundLabels,
  baseline,
  valueFormatter,
  benchmarkData,
  benchmarkLabel = 'Benchmark',
  benchmarkColor = '#76808E',
}: InnerProps) {
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [hoveredRound, setHoveredRound] = useState<number | null>(null);
  const prevRoundRef = useRef(-1);

  // Layout: chart on left, connector gap, leaderboard on right
  const connectorGap = 48;
  const chartWidth = containerWidth - leaderboardWidth - connectorGap;

  // No axes → tighter margins
  const margin: [number, number, number, number] = [12, 8, 8, 8];

  const controlsHeight = showControls ? 44 : 0;
  const chartHeight = containerHeight - controlsHeight;

  // Expand yScaleMin/Max to include benchmark range
  const effectiveYScaleMin = useMemo(() => {
    if (!benchmarkData || benchmarkData.length === 0) return yScaleMin;
    const bmMin = Math.min(...benchmarkData);
    return yScaleMin !== undefined ? Math.min(yScaleMin, bmMin) : bmMin;
  }, [yScaleMin, benchmarkData]);

  const effectiveYScaleMax = useMemo(() => {
    if (!benchmarkData || benchmarkData.length === 0) return yScaleMax;
    const bmMax = Math.max(...benchmarkData);
    return yScaleMax !== undefined ? Math.max(yScaleMax, bmMax) : bmMax;
  }, [yScaleMax, benchmarkData]);

  const state = useLineRace({
    data,
    width: chartWidth,
    height: chartHeight,
    colorScheme,
    schemeType,
    customColors,
    xAxis: false,
    yAxis: false,
    showXAxisLabel: false,
    showYAxisLabel: false,
    legend: false,
    legendPosition: LegendPosition.Below,
    roundDomains,
    yScaleMin: effectiveYScaleMin,
    yScaleMax: effectiveYScaleMax,
    margin,
    stepDuration,
    autoPlay,
  });

  const {
    dims,
    xScale,
    yScale,
    colors,
    customColorArray,
    transform,
    clipPathId,
    totalRounds,
    currentRound,
    interpolation,
    isPlaying,
    play,
    pause,
    seekTo,
  } = state;

  if (currentRound !== prevRoundRef.current && onRoundChange) {
    prevRoundRef.current = currentRound;
    onRoundChange(currentRound);
  }

  const handleLegendActivate = useCallback((name: string) => {
    setActiveSeries(name);
  }, []);

  const handleLegendDeactivate = useCallback(() => {
    setActiveSeries(null);
  }, []);

  // Compute leading-edge Y positions for connector lines
  const seriesEndpoints = useMemo(() => {
    return data.map((series, i) => {
      const maxR = Math.min(currentRound, series.values.length - 1);
      let value: number;

      if (isPlaying && interpolation < 1 && currentRound < series.values.length - 1) {
        const fromVal = series.values[currentRound];
        const toVal = series.values[currentRound + 1];
        value = fromVal + (toVal - fromVal) * interpolation;
      } else {
        value = series.values[maxR];
      }

      const chartY = yScale(value);
      const color = customColors?.[i] ?? colors.getColor(series.name);

      return {
        name: series.name,
        value: Math.round(value),
        chartY,
        color,
        seriesIndex: i,
      };
    });
  }, [data, currentRound, interpolation, isPlaying, yScale, customColors, colors]);

  // Leaderboard sorted by value
  const leaderboardSorted = useMemo(() => {
    const sorted = [...seriesEndpoints].sort((a, b) => b.value - a.value);
    sorted.forEach((item, idx) => {
      (item as typeof item & { rank: number }).rank = idx + 1;
    });
    return sorted;
  }, [seriesEndpoints]);

  // Compute leaderboard row Y positions
  const ROW_HEIGHT = 32;
  const ROW_GAP = 2;
  const ITEM_STEP = ROW_HEIGHT + ROW_GAP;
  const leaderboardTotalHeight = data.length * ITEM_STEP;

  // Center leaderboard vertically relative to chart
  const leaderboardTopOffset = Math.max(0, (chartHeight - leaderboardTotalHeight) / 2);

  // Chart content offset (from transform)
  const chartXOffset = dims.xOffset ?? 0;
  const chartYOffset = margin[0];

  // Connector line source X is right edge of chart area
  const connectorStartX = chartXOffset + dims.width;

  // Current round label for playback bar
  const currentRoundLabel = roundLabels?.[currentRound] ?? `Round ${currentRound}`;

  return (
    <>
      <div style={{ display: 'flex', width: containerWidth, height: chartHeight }}>
        {/* SVG: chart + connector lines */}
        <svg
          width={chartWidth + connectorGap}
          height={chartHeight}
          className="ngx-charts"
          style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)', flexShrink: 0 }}
        >
          <defs>
            <clipPath id={clipPathId}>
              <rect
                width={dims.width + 10}
                height={dims.height + 10}
                transform="translate(-5, -5)"
              />
            </clipPath>
            {/* Subtle vertical gradient to simulate canvas surface depth */}
            <linearGradient id="canvas-depth-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8f8f8" stopOpacity={0.0} />
              <stop offset="70%" stopColor="#f0f0ef" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#e8e6e2" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <g transform={transform} className="line-race-chart chart">
            {/* Canvas surface gradient — gives the impression of a receding floor */}
            <rect
              x={0} y={0}
              width={dims.width} height={dims.height}
              fill="url(#canvas-depth-gradient)"
              style={{ pointerEvents: 'none' }}
            />

            {/* Subtle horizontal grid lines only (no axes) */}
            {showGridLines && (() => {
              const ticks = yScale.ticks(5);
              return (
                <g className="grid-lines-y">
                  {ticks.map((t) => (
                    <line
                      key={t}
                      x1={0}
                      y1={yScale(t)}
                      x2={dims.width}
                      y2={yScale(t)}
                      stroke="#e8e8e8"
                      strokeWidth={0.5}
                      shapeRendering="crispEdges"
                    />
                  ))}
                </g>
              );
            })()}

            {/* Baseline (e.g. 0% breakeven) */}
            {baseline !== undefined && (() => {
              const by = yScale(baseline);
              return (
                <g className="baseline">
                  <line
                    x1={0} y1={by} x2={dims.width} y2={by}
                    stroke="#76808E"
                    strokeWidth={1}
                    strokeDasharray="6,4"
                    shapeRendering="crispEdges"
                    opacity={0.6}
                  />
                  <text
                    x={4} y={by - 5}
                    fontSize={10}
                    fill="#76808E"
                    fontFamily="var(--font-chart, Roboto, sans-serif)"
                  >
                    Baseline
                  </text>
                </g>
              );
            })()}

            {/* Benchmark reference line (not in leaderboard, clipped) */}
            {benchmarkData && benchmarkData.length > 0 && (() => {
              const maxR = Math.min(currentRound, benchmarkData.length - 1);
              const bmPts: { x: number; y: number }[] = [];
              for (let r = 0; r <= maxR; r++) {
                bmPts.push({ x: xScale(r), y: yScale(benchmarkData[r]) });
              }
              // Interpolate to current animation position
              if (isPlaying && interpolation < 1 && currentRound < benchmarkData.length - 1) {
                const toR = currentRound + 1;
                const fv = benchmarkData[currentRound];
                const tv = benchmarkData[toR];
                const iv = fv + (tv - fv) * interpolation;
                const fx = xScale(currentRound);
                const tx = xScale(toR);
                bmPts.push({ x: fx + (tx - fx) * interpolation, y: yScale(iv) });
              }
              if (bmPts.length < 2) return null;
              const bmLine = line<{ x: number; y: number }>()
                .x((d) => d.x)
                .y((d) => d.y)
                .curve(curve);
              const bmD = bmLine(bmPts) || '';
              const lastPt = bmPts[bmPts.length - 1];
              return (
                <g className="benchmark-line" clipPath={`url(#${clipPathId})`} style={{ pointerEvents: 'none' }}>
                  <path
                    d={bmD}
                    fill="none"
                    stroke={benchmarkColor}
                    strokeWidth={1.5}
                    strokeDasharray="4,3"
                    opacity={0.5}
                  />
                  {lastPt && (
                    <text
                      x={lastPt.x + 6}
                      y={lastPt.y + 3}
                      fontSize={9}
                      fill={benchmarkColor}
                      fontFamily="var(--font-chart, Roboto, sans-serif)"
                      opacity={0.7}
                    >
                      {benchmarkLabel}
                    </text>
                  )}
                </g>
              );
            })()}

            <g clipPath={`url(#${clipPathId})`}>
              <LineRaceSeries
                data={data}
                xScale={xScale}
                yScale={yScale}
                colors={colors}
                customColorArray={customColorArray}
                currentRound={currentRound}
                interpolation={interpolation}
                isPlaying={isPlaying}
                totalRounds={totalRounds}
                curve={curve}
                strokeWidth={strokeWidth}
                activeSeries={activeSeries}
                onSeriesActivate={(name) => setActiveSeries(name)}
                onSeriesDeactivate={() => setActiveSeries(null)}
                hideEndLabels
                chartHeight={dims.height}
              />
            </g>

            {/* Crosshair at current round (when not hovering) */}
            {currentRound > 0 && hoveredRound === null && (
              <line
                x1={xScale(currentRound)}
                y1={0}
                x2={xScale(currentRound)}
                y2={dims.height}
                stroke="#ddd"
                strokeWidth={1}
                shapeRendering="crispEdges"
                opacity={0.6}
              />
            )}

            {/* Tooltip crosshair + markers */}
            {hoveredRound !== null && hoveredRound <= currentRound && (() => {
              const hx = xScale(hoveredRound);
              const labelH = 22;
              const labelPad = 8;
              const placeLeft = hx > dims.width * 0.5;

              const items = data
                .map((series, i) => {
                  if (hoveredRound >= series.values.length) return null;
                  const val = series.values[hoveredRound];
                  return {
                    name: series.name,
                    value: val,
                    color: customColors?.[i] ?? colors.getColor(series.name),
                    cy: yScale(val),
                    dataIndex: i,
                  };
                })
                .filter(Boolean) as Array<{
                  name: string; value: number; color: string; cy: number; dataIndex: number;
                }>;

              items.sort((a, b) => a.cy - b.cy);

              const minGap = labelH + 2;
              const totalNeeded = items.length * minGap;
              const medianCy = items[Math.floor(items.length / 2)]?.cy ?? dims.height / 2;
              const stackTop = Math.max(0, Math.min(dims.height - totalNeeded, medianCy - totalNeeded / 2));

              const labelYs = items.map((_, j) => stackTop + j * minGap);

              for (let pass = 0; pass < 5; pass++) {
                for (let j = 0; j < items.length; j++) {
                  const target = items[j].cy - labelH / 2;
                  const minY = j === 0 ? 0 : labelYs[j - 1] + minGap;
                  const maxY = j === items.length - 1 ? dims.height - labelH : labelYs[j + 1] - minGap;
                  labelYs[j] = Math.max(minY, Math.min(maxY, target));
                }
              }

              return (
                <g style={{ pointerEvents: 'none' }}>
                  <line
                    x1={hx} y1={0} x2={hx} y2={dims.height}
                    stroke="#333" strokeWidth={1} shapeRendering="crispEdges" opacity={0.35}
                  />
                  {items.map((item, j) => {
                    const labelCenterY = labelYs[j] + labelH / 2;
                    const labelEdgeX = placeLeft ? hx - labelPad : hx + labelPad;
                    return (
                      <line
                        key={`conn-${item.name}`}
                        x1={hx} y1={item.cy}
                        x2={labelEdgeX} y2={labelCenterY}
                        stroke={item.color} strokeWidth={0.8} opacity={0.5}
                      />
                    );
                  })}
                  {items.map((item) => (
                    <circle
                      key={`marker-${item.name}`}
                      cx={hx}
                      cy={item.cy}
                      r={4}
                      fill={item.color}
                      stroke="#fff"
                      strokeWidth={1.5}
                    />
                  ))}
                  {items.map((item, j) => {
                    const lx = placeLeft ? hx - labelPad : hx + labelPad;
                    const ly = labelYs[j];
                    return (
                      <foreignObject
                        key={`label-${item.name}`}
                        x={placeLeft ? lx - 220 : lx}
                        y={ly} width={220} height={labelH}
                        style={{ overflow: 'visible' }}
                      >
                        <div
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '2px 8px 2px 6px',
                            background: 'rgba(255,255,255,0.95)',
                            border: `1px solid ${item.color}`,
                            borderLeft: placeLeft ? undefined : `3px solid ${item.color}`,
                            borderRight: placeLeft ? `3px solid ${item.color}` : undefined,
                            borderRadius: 3, fontSize: 11,
                            fontFamily: 'var(--font-chart, Roboto, sans-serif)',
                            whiteSpace: 'nowrap', lineHeight: '16px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            float: placeLeft ? 'right' : 'left',
                          }}
                        >
                          <span style={{ color: '#333', fontWeight: 500 }}>{item.name}:</span>
                          <span style={{ color: '#333', fontVariantNumeric: 'tabular-nums' }}>
                            {valueFormatter ? valueFormatter(item.value) : item.value.toLocaleString()}
                          </span>
                        </div>
                      </foreignObject>
                    );
                  })}
                  {/* Hovered round label badge */}
                  <foreignObject x={hx - 60} y={dims.height + 4} width={120} height={22}>
                    <div
                      style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        background: '#2d2d2d', borderRadius: 4,
                        fontSize: 10, fontFamily: 'var(--font-chart, Roboto, sans-serif)',
                        color: '#fff', fontWeight: 500, padding: '2px 6px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {roundLabels?.[hoveredRound] ?? `Round ${hoveredRound}`}
                    </div>
                  </foreignObject>
                </g>
              );
            })()}

            {/* Invisible overlay for mouse detection */}
            <rect
              x={0} y={0} width={dims.width} height={dims.height}
              style={{ opacity: 0, cursor: 'crosshair' }}
              onMouseMove={(e: MouseEvent<SVGRectElement>) => {
                const target = e.target as SVGRectElement;
                const rect = target.getBoundingClientRect();
                const xPos = e.clientX - rect.left;
                const yPos = e.clientY - rect.top;

                let closestRound = 0;
                let minDist = Infinity;
                const maxR = Math.min(currentRound, totalRounds);
                for (let r = 0; r <= maxR; r++) {
                  const dist = Math.abs(xScale(r) - xPos);
                  if (dist < minDist) { minDist = dist; closestRound = r; }
                }

                let closestName: string | null = null;
                let minYDist = Infinity;
                for (const series of data) {
                  if (closestRound < series.values.length) {
                    const sy = yScale(series.values[closestRound]);
                    const dy = Math.abs(sy - yPos);
                    if (dy < minYDist) { minYDist = dy; closestName = series.name; }
                  }
                }

                setHoveredRound(closestRound);
                setActiveSeries(closestName);
              }}
              onMouseLeave={() => { setHoveredRound(null); setActiveSeries(null); }}
            />
          </g>

          {/* Connector lines from chart edge to leaderboard rows */}
          <g className="connector-lines">
            {leaderboardSorted.map((entry, rankIdx) => {
              const ep = seriesEndpoints.find((e) => e.name === entry.name);
              if (!ep) return null;

              // Source: leading edge of the line in chart space
              const srcX = connectorStartX;
              const srcY = chartYOffset + ep.chartY;

              // Target: center of the leaderboard row
              const targetX = chartWidth + connectorGap;
              const targetY = leaderboardTopOffset + rankIdx * ITEM_STEP + ROW_HEIGHT / 2;

              const isActive = activeSeries === entry.name;
              const isInactive = activeSeries != null && !isActive;

              // Bezier control points for a smooth S-curve
              const midX1 = srcX + connectorGap * 0.4;
              const midX2 = targetX - connectorGap * 0.4;

              return (
                <path
                  key={`connector-${entry.name}`}
                  d={`M${srcX},${srcY} C${midX1},${srcY} ${midX2},${targetY} ${targetX},${targetY}`}
                  fill="none"
                  stroke={entry.color}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? undefined : '3,3'}
                  opacity={isInactive ? 0.12 : isActive ? 0.7 : 0.35}
                  style={{ transition: 'opacity 200ms ease, stroke-width 200ms ease, d 400ms ease' }}
                />
              );
            })}
          </g>
        </svg>

        {/* Leaderboard */}
        <div
          style={{
            width: leaderboardWidth,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: leaderboardTopOffset,
          }}
        >
          <LineRaceLeaderboard
            data={data}
            currentRound={currentRound}
            interpolation={interpolation}
            isPlaying={isPlaying}
            customColors={customColors}
            activeSeries={activeSeries}
            onSeriesActivate={handleLegendActivate}
            onSeriesDeactivate={handleLegendDeactivate}
            width={leaderboardWidth}
            valueFormatter={valueFormatter}
          />
        </div>
      </div>

      {/* Playback controls with dynamic round label */}
      {showControls && (
        <div
          className="flex items-center gap-3 px-3 border-t border-mine-border/30"
          style={{
            height: `${controlsHeight}px`,
            fontFamily: 'var(--font-chart, Roboto, sans-serif)',
          }}
        >
          {/* Play/pause button */}
          <button
            onClick={() => (isPlaying ? pause() : play())}
            className="shrink-0 flex items-center justify-center rounded-full border border-mine-border bg-white hover:bg-mine-bg transition-colors"
            style={{ width: 28, height: 28, fontSize: 11, color: '#333' }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '\u23F8' : '\u25B6'}
          </button>

          {/* Slider */}
          <input
            type="range"
            min={0}
            max={totalRounds}
            value={currentRound}
            onChange={(e) => seekTo(parseInt(e.target.value, 10))}
            className="flex-1 h-1 accent-mine-nav-active"
          />

          {/* Dynamic round label (replaces X axis) */}
          <span
            className="shrink-0 text-[11px] font-medium text-mine-text bg-mine-bg/80 px-2.5 py-1 rounded-md font-mono tabular-nums"
            style={{ minWidth: 110, textAlign: 'center', whiteSpace: 'nowrap' }}
          >
            {currentRoundLabel}
          </span>
        </div>
      )}
    </>
  );
}
