/**
 * @fileoverview Line race chart component
 *
 * @description
 * Animated "line race" chart that progressively draws multiple series
 * over discrete rounds with playback controls (play/pause/seek).
 * Uses the same axis/grid/font styling as the ngx-charts library
 * (12px Roboto, #ddd grid, #ddd tick strokes).
 *
 * @license MIT
 */

'use client';

import { useState, useCallback, useRef, useEffect, useMemo, type MouseEvent } from 'react';
import { CurveFactory, curveLinear } from 'd3-shape';

import {
  ColorScheme,
  ScaleType,
  LegendPosition,
} from '../types';
import {
  BaseChart,
  XAxis,
  YAxis,
  Legend,
} from '../common';
import { useLineRace, type LineRaceSeriesData } from './hooks';
import { LineRaceSeries } from './components';
import { markerPath } from './utils';

export interface LineRaceProps {
  /** Chart data: array of { name, values: number[] } */
  data: LineRaceSeriesData[];
  /** Fixed width (optional, defaults to container width) */
  width?: number;
  /** Fixed height (optional, defaults to container height) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Scale type for color mapping */
  schemeType?: ScaleType;
  /** Custom colors array (one per series, in order) */
  customColors?: string[];
  /** Show X axis */
  showXAxis?: boolean;
  /** Show Y axis */
  showYAxis?: boolean;
  /** Show X axis label */
  showXAxisLabel?: boolean;
  /** Show Y axis label */
  showYAxisLabel?: boolean;
  /** X axis label text */
  xAxisLabel?: string;
  /** Y axis label text */
  yAxisLabel?: string;
  /** Show legend */
  showLegend?: boolean;
  /** Legend title */
  legendTitle?: string;
  /** Legend position */
  legendPosition?: LegendPosition;
  /** Show grid lines (applies to both axes unless overridden) */
  showGridLines?: boolean;
  /** Show X axis grid lines (overrides showGridLines for X) */
  showXGridLines?: boolean;
  /** Show Y axis grid lines (overrides showGridLines for Y) */
  showYGridLines?: boolean;
  /** D3 curve factory */
  curve?: CurveFactory;
  /** Line stroke width */
  strokeWidth?: number;
  /** Trim X axis tick labels */
  trimXAxisTicks?: boolean;
  /** Trim Y axis tick labels */
  trimYAxisTicks?: boolean;
  /** Rotate X axis tick labels */
  rotateXAxisTicks?: boolean;
  /** Max X axis tick label length */
  maxXAxisTickLength?: number;
  /** Max Y axis tick label length */
  maxYAxisTickLength?: number;
  /** X axis tick formatting function */
  xAxisTickFormatting?: (value: unknown) => string;
  /** Y axis tick formatting function */
  yAxisTickFormatting?: (value: unknown) => string;
  /** Specific X axis tick values */
  xAxisTicks?: unknown[];
  /** Specific Y axis tick values */
  yAxisTicks?: unknown[];
  /** Round domains to nice values */
  roundDomains?: boolean;
  /** Wrap long tick labels */
  wrapTicks?: boolean;
  /** Y scale minimum */
  yScaleMin?: number;
  /** Y scale maximum */
  yScaleMax?: number;
  /** Animation duration per step (ms) */
  stepDuration?: number;
  /** Auto-play animation on mount */
  autoPlay?: boolean;
  /** Show playback controls (play/pause button + slider) */
  showControls?: boolean;
  /** Chart title */
  title?: string;
  /** Callback when a round is reached */
  onRoundChange?: (round: number) => void;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Line Race Chart
 *
 * An animated chart where multiple line series "race" across discrete rounds.
 * Features:
 * - Play/pause/seek controls
 * - Progressive line drawing with smooth interpolation
 * - End-point labels with series name and current value
 * - Diamond markers at the latest data point
 * - Hover dimming (other series fade out)
 * - Consistent ngx-charts axis/grid styling
 */
export function LineRace({
  width,
  height,
  colorScheme = 'vivid',
  schemeType = ScaleType.Ordinal,
  className = '',
  ...rest
}: LineRaceProps) {
  return (
    <BaseChart
      width={width}
      height={height}
      colorScheme={colorScheme}
      scaleType={schemeType}
      animated={false}
      className={`ngx-charts-line-race ${className}`}
    >
      {({ width: containerWidth, height: containerHeight }) => (
        <LineRaceInner
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

/** Props for the inner component that receives container dimensions */
interface LineRaceInnerProps extends Omit<LineRaceProps, 'width' | 'height' | 'className'> {
  containerWidth: number;
  containerHeight: number;
}

/**
 * Inner component where hooks are called at the top level (fixing Rules of Hooks).
 * BaseChart's render callback instantiates this as a real React component.
 */
function LineRaceInner({
  data,
  containerWidth,
  containerHeight,
  colorScheme = 'vivid',
  schemeType = ScaleType.Ordinal,
  customColors,
  showXAxis = true,
  showYAxis = true,
  showXAxisLabel = false,
  showYAxisLabel = false,
  xAxisLabel = '',
  yAxisLabel = '',
  showLegend = true,
  legendTitle = '',
  legendPosition = LegendPosition.Below,
  showGridLines = true,
  showXGridLines,
  showYGridLines,
  curve = curveLinear,
  strokeWidth = 2,
  trimXAxisTicks = true,
  trimYAxisTicks = true,
  rotateXAxisTicks = false,
  maxXAxisTickLength = 16,
  maxYAxisTickLength = 16,
  xAxisTickFormatting,
  yAxisTickFormatting,
  xAxisTicks,
  yAxisTicks,
  roundDomains = false,
  wrapTicks = false,
  yScaleMin,
  yScaleMax,
  stepDuration = 1000,
  autoPlay = true,
  showControls = true,
  title,
  onRoundChange,
}: LineRaceInnerProps) {
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [hoveredRound, setHoveredRound] = useState<number | null>(null);
  const prevRoundRef = useRef(-1);

  const margin = useMemo<[number, number, number, number]>(
    () => [title ? 50 : 20, 20, 10, 20],
    [title],
  );

  // Reserve space for controls at the bottom
  const controlsHeight = showControls ? 50 : 0;
  const chartHeight = containerHeight - controlsHeight;

  const state = useLineRace({
    data,
    width: containerWidth,
    height: chartHeight,
    colorScheme,
    schemeType,
    customColors,
    xAxis: showXAxis,
    yAxis: showYAxis,
    showXAxisLabel,
    showYAxisLabel,
    legend: showLegend,
    legendPosition,
    roundDomains,
    yScaleMin,
    yScaleMax,
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
    onXAxisHeightChange,
    onYAxisWidthChange,
    legendOptions,
  } = state;

  // Notify round changes (must be in effect, not render phase)
  useEffect(() => {
    if (currentRound !== prevRoundRef.current && onRoundChange) {
      prevRoundRef.current = currentRound;
      onRoundChange(currentRound);
    }
  }, [currentRound, onRoundChange]);

  // Legend handlers
  const handleLegendActivate = useCallback((item: { name: string }) => {
    setActiveSeries(item.name);
  }, []);

  const handleLegendDeactivate = useCallback(() => {
    setActiveSeries(null);
  }, []);

  return (
    <>
      {/* Main chart SVG */}
      <svg
        width={containerWidth}
        height={chartHeight}
        className="ngx-charts"
        style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}
      >
        {/* Clip path */}
        <defs>
          <clipPath id={clipPathId}>
            <rect
              width={dims.width + 10}
              height={dims.height + 10}
              transform="translate(-5, -5)"
            />
          </clipPath>
        </defs>

        {/* Title */}
        {title && (
          <text
            x={(dims.xOffset ?? 0) + dims.width / 2}
            y={20}
            textAnchor="middle"
            fill="#333"
            fontSize="18px"
            fontWeight="bold"
            strokeWidth="0.01"
          >
            {title}
          </text>
        )}

        {/* Chart content group */}
        <g transform={transform} className="line-race-chart chart">
          {/* X Axis */}
          {showXAxis && (
            <XAxis
              xScale={xScale}
              dims={dims}
              showGridLines={showXGridLines ?? showGridLines}
              showLabel={showXAxisLabel}
              labelText={xAxisLabel}
              trimTicks={trimXAxisTicks}
              rotateTicks={rotateXAxisTicks}
              maxTickLength={maxXAxisTickLength}
              tickFormatting={xAxisTickFormatting}
              ticks={xAxisTicks}
              wrapTicks={wrapTicks}
              onDimensionsChanged={({ height }) => onXAxisHeightChange(height)}
            />
          )}

          {/* Y Axis */}
          {showYAxis && (
            <YAxis
              yScale={yScale}
              dims={dims}
              showGridLines={showYGridLines ?? showGridLines}
              showLabel={showYAxisLabel}
              labelText={yAxisLabel}
              trimTicks={trimYAxisTicks}
              maxTickLength={maxYAxisTickLength}
              tickFormatting={yAxisTickFormatting}
              ticks={yAxisTicks}
              wrapTicks={wrapTicks}
              onDimensionsChanged={({ width }) => onYAxisWidthChange(width)}
            />
          )}

          {/* Series (no clip path — end labels overflow to the right) */}
          <g>
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
            />
          </g>

          {/* Crosshair line at current round (shown when NOT hovering) */}
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

          {/* Highcharts-style tooltip: crosshair + markers + connector lines + stacked labels */}
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
                {/* Crosshair line */}
                <line
                  x1={hx}
                  y1={0}
                  x2={hx}
                  y2={dims.height}
                  stroke="#333"
                  strokeWidth={1}
                  shapeRendering="crispEdges"
                  opacity={0.35}
                />

                {/* Connector lines from data point to label */}
                {items.map((item, j) => {
                  const labelCenterY = labelYs[j] + labelH / 2;
                  const labelEdgeX = placeLeft ? hx - labelPad : hx + labelPad;
                  return (
                    <line
                      key={`conn-${item.name}`}
                      x1={hx}
                      y1={item.cy}
                      x2={labelEdgeX}
                      y2={labelCenterY}
                      stroke={item.color}
                      strokeWidth={0.8}
                      opacity={0.5}
                    />
                  );
                })}

                {/* Geometric markers on each series data point */}
                {items.map((item) => (
                  <g key={`marker-${item.name}`}>
                    <path
                      d={markerPath(hx, item.cy, 5, item.dataIndex)}
                      fill={item.color}
                      stroke="#fff"
                      strokeWidth={1.5}
                    />
                  </g>
                ))}

                {/* Stacked labels */}
                {items.map((item, j) => {
                  const lx = placeLeft ? hx - labelPad : hx + labelPad;
                  const ly = labelYs[j];
                  return (
                    <foreignObject
                      key={`label-${item.name}`}
                      x={placeLeft ? lx - 220 : lx}
                      y={ly}
                      width={220}
                      height={labelH}
                      style={{ overflow: 'visible' }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '2px 8px 2px 6px',
                          background: 'rgba(255,255,255,0.95)',
                          border: `1px solid ${item.color}`,
                          borderLeft: placeLeft ? undefined : `3px solid ${item.color}`,
                          borderRight: placeLeft ? `3px solid ${item.color}` : undefined,
                          borderRadius: 3,
                          fontSize: 11,
                          fontFamily: 'var(--font-chart, Roboto, sans-serif)',
                          whiteSpace: 'nowrap',
                          lineHeight: '16px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                          float: placeLeft ? 'right' : 'left',
                        }}
                      >
                        <span style={{ color: '#333', fontWeight: 500 }}>{item.name}:</span>
                        <span style={{ color: '#333', fontVariantNumeric: 'tabular-nums' }}>
                          {item.value.toLocaleString()} Points
                        </span>
                      </div>
                    </foreignObject>
                  );
                })}

                {/* Round number label at bottom of crosshair */}
                <foreignObject
                  x={hx - 20}
                  y={dims.height + 2}
                  width={40}
                  height={20}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: '#f5f5f5',
                      border: '1px solid #ddd',
                      borderRadius: 3,
                      fontSize: 11,
                      fontFamily: 'var(--font-chart, Roboto, sans-serif)',
                      color: '#333',
                      fontWeight: 500,
                    }}
                  >
                    {hoveredRound}
                  </div>
                </foreignObject>
              </g>
            );
          })()}

          {/* Invisible overlay for mouse detection */}
          <rect
            x={0}
            y={0}
            width={dims.width}
            height={dims.height}
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
                if (dist < minDist) {
                  minDist = dist;
                  closestRound = r;
                }
              }

              let closestName: string | null = null;
              let minYDist = Infinity;
              for (const series of data) {
                if (closestRound < series.values.length) {
                  const sy = yScale(series.values[closestRound]);
                  const dy = Math.abs(sy - yPos);
                  if (dy < minYDist) {
                    minYDist = dy;
                    closestName = series.name;
                  }
                }
              }

              setHoveredRound(closestRound);
              setActiveSeries(closestName);
            }}
            onMouseLeave={() => {
              setHoveredRound(null);
              setActiveSeries(null);
            }}
          />
        </g>
      </svg>

      {/* Playback controls (HTML, below the chart) */}
      {showControls && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: `${controlsHeight}px`,
            padding: '0 16px',
            gap: '12px',
            fontFamily: 'var(--font-chart, Roboto, sans-serif)',
          }}
        >
          <button
            onClick={() => (isPlaying ? pause() : play())}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 14,
              color: '#333',
              transition: 'background 200ms',
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '\u23F8' : '\u25B6'}
          </button>
          <input
            type="range"
            min={0}
            max={totalRounds}
            value={currentRound}
            onChange={(e) => seekTo(parseInt(e.target.value, 10))}
            style={{
              flex: 1,
              accentColor: '#666',
              height: 4,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: '#666',
              minWidth: 40,
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {currentRound} / {totalRounds}
          </span>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <Legend
          data={legendOptions.domain as string[]}
          title={legendTitle}
          colors={colors}
          height={chartHeight}
          width={legendPosition === LegendPosition.Below ? containerWidth : undefined}
          horizontal={legendPosition === LegendPosition.Below}
          onLabelActivate={handleLegendActivate}
          onLabelDeactivate={handleLegendDeactivate}
        />
      )}
    </>
  );
}
