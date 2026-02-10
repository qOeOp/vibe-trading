'use client';

import { useCallback, useMemo, useId } from 'react';
import type { ReactNode } from 'react';
import { line, area, curveMonotoneX, curveBasis } from 'd3-shape';
import type { CurveFactory } from 'd3-shape';
import { motion } from 'framer-motion';

import type { AxisConfig } from '../types';
import { BaseChart, XAxis, YAxis, SvgLinearGradient } from '../common';
import { useBandChart } from './hooks';
import type { BandData, BandDataPoint, BandConfig, OverlaySeries, AuxiliaryLine } from './hooks';
import { BandSeries, OverlayLine, BandTooltipArea, RaceOverlay } from './components';
import type { BandTooltipInfo, RaceStrategy } from './components';

export interface BandChartProps {
  data: BandData;
  overlay?: OverlaySeries | null;
  auxiliaryLines?: AuxiliaryLine[];
  bandConfig?: BandConfig;
  width?: number;
  height?: number;
  animated?: boolean;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  referenceLines?: Array<{ name: string; value: number; color?: string }>;
  showRefLines?: boolean;
  showRefLabels?: boolean;
  monthLabel?: string;
  tooltipDisabled?: boolean;
  tooltipTemplate?: (info: BandTooltipInfo) => ReactNode;
  onHoverStrategy?: (id: string | null) => void;
  /** Called with tooltip info on hover, null on leave. Use to render info externally (e.g. in header). */
  onHoverInfo?: (info: BandTooltipInfo | null) => void;
  className?: string;
  trimXAxisTicks?: boolean;
  rotateXAxisTicks?: boolean;
  maxXAxisTickLength?: number;
  wrapTicks?: boolean;
  /** Power exponent for Y axis (0–1). Lower = stronger magnification near zero. Default 0.6 */
  yScaleExponent?: number;
  /** Number of Y-axis ticks. Default 10 */
  yAxisTickCount?: number;
  /** D3 curve factory for path interpolation. Default curveMonotoneX (spline) */
  curve?: CurveFactory;
  /** Enable ink-brush effect on overlay line. Default false */
  brushEffect?: boolean;
  /** Strategy lines for race animation (auto-plays when no overlay is active) */
  raceStrategies?: RaceStrategy[];
}

export function BandChart({
  data,
  overlay = null,
  auxiliaryLines,
  bandConfig,
  width,
  height,
  animated = true,
  xAxis = { visible: false },
  yAxis = { visible: false },
  referenceLines,
  showRefLines = false,
  showRefLabels = false,
  monthLabel,
  tooltipDisabled = false,
  tooltipTemplate,
  onHoverStrategy,
  onHoverInfo,
  className = '',
  trimXAxisTicks = true,
  rotateXAxisTicks = true,
  maxXAxisTickLength = 16,
  wrapTicks = false,
  yScaleExponent,
  yAxisTickCount,
  curve = curveMonotoneX,
  brushEffect = false,
  raceStrategies,
}: BandChartProps) {
  return (
    <BaseChart
      width={width}
      height={height}
      animated={animated}
      className={`band-chart ${className}`}
    >
      {(dimensions) => (
        <BandChartContent
          data={data}
          dimensions={dimensions}
          overlay={overlay}
          auxiliaryLines={auxiliaryLines}
          bandConfig={bandConfig}
          animated={animated}
          xAxis={xAxis}
          yAxis={yAxis}
          referenceLines={referenceLines}
          showRefLines={showRefLines}
          showRefLabels={showRefLabels}
          monthLabel={monthLabel}
          tooltipDisabled={tooltipDisabled}
          tooltipTemplate={tooltipTemplate}
          onHoverStrategy={onHoverStrategy}
          onHoverInfo={onHoverInfo}
          trimXAxisTicks={trimXAxisTicks}
          rotateXAxisTicks={rotateXAxisTicks}
          maxXAxisTickLength={maxXAxisTickLength}
          wrapTicks={wrapTicks}
          yScaleExponent={yScaleExponent}
          yAxisTickCount={yAxisTickCount}
          curve={curve}
          brushEffect={brushEffect}
          raceStrategies={raceStrategies}
        />
      )}
    </BaseChart>
  );
}

interface BandChartContentProps {
  data: BandData;
  dimensions: { width: number; height: number };
  overlay: OverlaySeries | null;
  auxiliaryLines?: AuxiliaryLine[];
  bandConfig?: BandConfig;
  animated: boolean;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  referenceLines?: Array<{ name: string; value: number; color?: string }>;
  showRefLines: boolean;
  showRefLabels: boolean;
  monthLabel?: string;
  tooltipDisabled: boolean;
  tooltipTemplate?: (info: BandTooltipInfo) => ReactNode;
  onHoverStrategy?: (id: string | null) => void;
  onHoverInfo?: (info: BandTooltipInfo | null) => void;
  trimXAxisTicks: boolean;
  rotateXAxisTicks: boolean;
  maxXAxisTickLength: number;
  wrapTicks: boolean;
  yScaleExponent?: number;
  yAxisTickCount?: number;
  curve: CurveFactory;
  brushEffect: boolean;
  raceStrategies?: RaceStrategy[];
}

function BandChartContent({
  data,
  dimensions,
  overlay,
  auxiliaryLines,
  bandConfig,
  animated,
  xAxis,
  yAxis,
  referenceLines,
  showRefLines,
  showRefLabels,
  monthLabel,
  tooltipDisabled,
  tooltipTemplate,
  onHoverStrategy,
  onHoverInfo,
  trimXAxisTicks,
  rotateXAxisTicks,
  maxXAxisTickLength,
  wrapTicks,
  yScaleExponent,
  yAxisTickCount,
  curve,
  brushEffect,
  raceStrategies,
}: BandChartContentProps) {
  const {
    dims,
    xScale,
    yScale,
    transform,
    updateXAxisHeight,
    updateYAxisWidth,
  } = useBandChart({
    data,
    width: dimensions.width,
    height: dimensions.height,
    showXAxis: xAxis.visible,
    showYAxis: yAxis.visible,
    yScaleExponent,
  });

  const handleXAxisDimensionsChanged = useCallback(
    ({ height }: { height: number }) => updateXAxisHeight(height),
    [updateXAxisHeight]
  );

  const handleYAxisDimensionsChanged = useCallback(
    ({ width }: { width: number }) => updateYAxisWidth(width),
    [updateYAxisWidth]
  );

  const handleMouseLeave = useCallback(() => {
    onHoverStrategy?.(null);
  }, [onHoverStrategy]);

  // ── Median top-layer: always rendered above all fills/overlays ──
  const reactId = useId();
  const medianGradientId = `median-top-grad${reactId.replace(/:/g, '')}`;
  const medianShadowId = `median-top-shadow${reactId.replace(/:/g, '')}`;
  const bandColor = bandConfig?.color ?? '99, 102, 241';
  const hasOverlay = !!overlay;

  const { medianPath, medianAreaPath } = useMemo(() => {
    if (data.length === 0) return { medianPath: '', medianAreaPath: '' };
    const x = (d: BandDataPoint) => xScale(d.name) ?? 0;
    const baseY = yScale.range()[0];

    const medLine = line<BandDataPoint>().x(x).y((d) => yScale(d.median)).curve(curveBasis);
    const medArea = area<BandDataPoint>().x(x).y0(() => baseY).y1((d) => yScale(d.median)).curve(curveBasis);

    return {
      medianPath: medLine(data) || '',
      medianAreaPath: medArea(data) || '',
    };
  }, [data, xScale, yScale]);

  return (
    <div className="ngx-charts-outer" style={{ width: '100%', height: '100%' }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="ngx-charts"
        style={{
          display: 'block',
          overflow: (xAxis.visible || yAxis.visible) ? 'visible' : 'hidden',
          fontFamily: 'var(--font-chart, Roboto, sans-serif)',
        }}
      >
        <g transform={transform} className="band-chart chart">
          {/* Layer 1: X Axis */}
          {xAxis.visible && (
            <XAxis
              xScale={xScale}
              dims={dims}
              showGridLines={xAxis.showGridLines}
              showLabel={xAxis.showLabel}
              labelText={xAxis.label}
              trimTicks={trimXAxisTicks}
              rotateTicks={rotateXAxisTicks}
              maxTickLength={maxXAxisTickLength}
              tickFormatting={xAxis.tickFormatting}
              ticks={xAxis.ticks}
              wrapTicks={wrapTicks}
              onDimensionsChanged={handleXAxisDimensionsChanged}
            />
          )}

          {/* Layer 2: Y Axis (with grid lines) */}
          {yAxis.visible && (
            <YAxis
              yScale={yScale}
              dims={dims}
              showGridLines={yAxis.showGridLines}
              gridLineStrokeDasharray={yAxis.gridLineStrokeDasharray}
              showLabel={yAxis.showLabel}
              labelText={yAxis.label}
              trimTicks
              maxTickLength={16}
              tickFormatting={yAxis.tickFormatting}
              ticks={yAxis.ticks}
              yAxisTickCount={yAxisTickCount ?? 10}
              referenceLines={referenceLines}
              showRefLines={showRefLines}
              showRefLabels={showRefLabels}
              wrapTicks={wrapTicks}
              onDimensionsChanged={handleYAxisDimensionsChanged}
            />
          )}

          {/* Layer 3: Band fills + edges (median rendered in top layer) */}
          <g className="band-layers">
            <BandSeries
              data={data}
              xScale={xScale}
              yScale={yScale}
              config={bandConfig}
              animated={animated}
              curve={curve}
              hasOverlay={hasOverlay}
              hideMedian
            />
          </g>

          {/* Layer 3.5: Race animation (all strategy lines, progressive draw) */}
          {raceStrategies && raceStrategies.length > 0 && !overlay && (
            <RaceOverlay
              strategies={raceStrategies}
              xScale={xScale}
              yScale={yScale}
              curve={curve}
            />
          )}

          {/* Layer 4: Highlighted strategy line + gradient */}
          <OverlayLine
            overlay={overlay}
            xScale={xScale}
            yScale={yScale}
            animated={animated}
            curve={curve}
            brushEffect={brushEffect}
          />

          {/* Layer 5: Median baseline — always on top of all fills */}
          {medianPath && (
            <g className="median-top-layer" style={{ pointerEvents: 'none' }}>
              <defs>
                <SvgLinearGradient
                  id={medianGradientId}
                  orientation="vertical"
                  stops={[
                    { offset: 100, color: `rgb(${bandColor})`, opacity: 0.09 },
                    { offset: 0, color: `rgb(${bandColor})`, opacity: 0.01 },
                  ]}
                />
                <filter id={medianShadowId} x="-10%" y="-30%" width="120%" height="160%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={`rgb(${bandColor})`} floodOpacity="0.18" />
                </filter>
              </defs>

              {/* Median area fill — visible when overlay active */}
              {medianAreaPath && (
                <motion.path
                  d={medianAreaPath}
                  fill={`url(#${medianGradientId})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hasOverlay ? 1 : 0 }}
                  transition={{ opacity: { duration: 0.35 } }}
                />
              )}

              {/* Median line with subtle drop shadow for floating feel */}
              <motion.path
                d={medianPath}
                fill="none"
                stroke={`rgba(${bandColor}, ${hasOverlay ? 0.25 : 1})`}
                strokeWidth={hasOverlay ? 1 : (bandConfig?.medianStrokeWidth ?? 2)}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#${medianShadowId})`}
                initial={animated ? { d: medianPath, opacity: 0 } : undefined}
                animate={{ d: medianPath, opacity: 1 }}
                transition={{ d: { duration: animated ? 0.75 : 0, ease: 'easeInOut' }, opacity: { duration: 0.3 } }}
              />
            </g>
          )}

          {/* Layer 6: Month label */}
          {monthLabel && (
            <text
              x={4}
              y={2}
              fill="#666666"
              fontSize={13}
              fontWeight={500}
              fontFamily="var(--font-chart, Roboto, sans-serif)"
              dominantBaseline="hanging"
              style={{ pointerEvents: 'none' }}
            >
              {monthLabel}
            </text>
          )}

          {/* Layer 7: Interaction + crosshair + tooltip */}
          <g onMouseLeave={handleMouseLeave}>
            <BandTooltipArea
              dims={dims}
              data={data}
              xScale={xScale}
              yScale={yScale}
              auxiliaryLines={auxiliaryLines}
              tooltipDisabled={tooltipDisabled}
              tooltipTemplate={tooltipTemplate}
              onHoverStrategy={onHoverStrategy}
              onHoverInfo={onHoverInfo}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
