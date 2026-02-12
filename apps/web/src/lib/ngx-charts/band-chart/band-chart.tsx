'use client';

import { useCallback, useMemo, useId, useState } from 'react';
import type { ReactNode } from 'react';
import { line, area, curveLinear } from 'd3-shape';
import type { CurveFactory } from 'd3-shape';
import { motion } from 'framer-motion';

import type { AxisConfig } from '../types';
import { BaseChart, XAxis, YAxis, SvgLinearGradient, DataZoomBar } from '../common';
import { useBandChart } from './hooks';
import type { BandData, BandDataPoint, BandConfig, OverlaySeries, AuxiliaryLine } from './hooks';
import { BandSeries, OverlayLine, BandTooltipArea, MonthStripes, DrawdownArea, BaselineSeries, ExcessBars, ZoomResetButton } from './components';

/** Knockout stroke — matches page background (--color-mine-bg) for visual gap effect */
const KNOCKOUT_COLOR = '#f5f3ef';
import type { BandTooltipInfo } from './components';
import { useAnimateZoom } from './hooks/use-animate-zoom';

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
  /** Show vertical DataZoom bar to control Y-axis */
  showDataZoom?: boolean;
  /** Show horizontal DataZoom bar to control X-axis */
  showXDataZoom?: boolean;
  /** Custom labels for X DataZoom bar */
  xDataZoomLabels?: string[];
  /** Show drawdown area from top */
  showDrawdown?: boolean;
  /** Show month alternating stripes */
  showMonthStripes?: boolean;
  /** When true, chart enters selected-strategy mode: Y-axis fits to overlay, band hides, median hides */
  selectedMode?: boolean;
  /** Called when user clicks empty area to deselect (selectedMode → false) */
  onSelectStrategy?: (id: string | null) => void;
  /** Market index baseline data (daily + monthly for smooth curve) */
  baseline?: { daily: Array<{ name: string; value: number }>; monthly: Array<{ name: string; value: number }> };
  /** Excess return data (strategy − baseline). Only positive values are rendered. */
  excessReturn?: Array<{ name: string; value: number }> | null;
  /** Enable brush-zoom interaction (click-to-month, drag-to-range) in selected mode */
  brushZoomEnabled?: boolean;
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
  curve = curveLinear,
  brushEffect = false,
  showDataZoom = false,
  showXDataZoom = false,
  xDataZoomLabels,
  showDrawdown = false,
  showMonthStripes = false,
  selectedMode = false,
  onSelectStrategy,
  baseline,
  excessReturn,
  brushZoomEnabled = false,
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
          showDataZoom={showDataZoom}
          showXDataZoom={showXDataZoom}
          xDataZoomLabels={xDataZoomLabels}
          showDrawdown={showDrawdown}
          showMonthStripes={showMonthStripes}
          selectedMode={selectedMode}
          onSelectStrategy={onSelectStrategy}
          baseline={baseline}
          excessReturn={excessReturn}
          brushZoomEnabled={brushZoomEnabled}
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
  showDataZoom?: boolean;
  showXDataZoom?: boolean;
  xDataZoomLabels?: string[];
  showDrawdown?: boolean;
  showMonthStripes?: boolean;
  selectedMode?: boolean;
  onSelectStrategy?: (id: string | null) => void;
  baseline?: { daily: Array<{ name: string; value: number }>; monthly: Array<{ name: string; value: number }> };
  excessReturn?: Array<{ name: string; value: number }> | null;
  brushZoomEnabled?: boolean;
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
  showDataZoom,
  showXDataZoom,
  xDataZoomLabels,
  showDrawdown,
  showMonthStripes,
  selectedMode,
  onSelectStrategy,
  baseline,
  excessReturn,
  brushZoomEnabled,
}: BandChartContentProps) {
  // State for DataZoom
  const [zoomState, setZoomState] = useState<{ start: number; end: number }>({ start: 0, end: 100 });
  const [zoomStateX, setZoomStateX] = useState<{ start: number; end: number }>({ start: 0, end: 100 });

  // Calculate full domain to derive zoomed domain
  const fullYDomain = useMemo((): [number, number] => {
    if (data.length === 0) return [0, 1];

    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const bp of data) {
      if (bp.min < minVal) minVal = bp.min;
      if (bp.max > maxVal) maxVal = bp.max;
    }

    const range = maxVal - minVal || 1;
    return [minVal - range * 0.05, maxVal + range * 0.05];
  }, [data]);

  // X domain (must be computed before customYDomain which depends on it)
  const customXDomain = useMemo((): string[] | undefined => {
    if (!showXDataZoom) return undefined;
    const len = data.length;
    if (len === 0) return undefined;

    const startIdx = Math.floor(len * (zoomStateX.start / 100));
    const endIdx = Math.ceil(len * (zoomStateX.end / 100));
    // Clamp
    const safeStart = Math.max(0, Math.min(len - 1, startIdx));
    const safeEnd = Math.max(safeStart + 1, Math.min(len, endIdx));

    return data.slice(safeStart, safeEnd).map(d => d.name);
  }, [showXDataZoom, data, zoomStateX]);

  // Brush-zoom animation
  const { animateZoom } = useAnimateZoom();
  const isZoomed = zoomStateX.start > 0.5 || zoomStateX.end < 99.5;

  const handleBrushZoom = useCallback((xRange: { start: number; end: number }) => {
    animateZoom(zoomStateX, xRange, setZoomStateX, 350);
  }, [zoomStateX, animateZoom]);

  const handleResetZoom = useCallback(() => {
    animateZoom(zoomStateX, { start: 0, end: 100 }, setZoomStateX, 350);
  }, [zoomStateX, animateZoom]);

  const customYDomain = useMemo((): [number, number] | undefined => {
    // Selected mode: fit Y domain to the overlay strategy + baseline combined range + 10% padding
    if (selectedMode && overlay) {
      // When X is zoomed, auto-fit Y to visible data slice only
      const visibleSet = isZoomed && customXDomain ? new Set(customXDomain) : null;

      let sMin = Infinity;
      let sMax = -Infinity;
      for (const pt of overlay.series) {
        if (visibleSet && !visibleSet.has(pt.name)) continue;
        if (pt.value < sMin) sMin = pt.value;
        if (pt.value > sMax) sMax = pt.value;
      }
      // Include baseline so it never clips the chart edges
      if (baseline?.daily) {
        for (const pt of baseline.daily) {
          if (visibleSet && !visibleSet.has(pt.name)) continue;
          if (pt.value < sMin) sMin = pt.value;
          if (pt.value > sMax) sMax = pt.value;
        }
      }
      if (sMin === Infinity) {
        sMin = 0;
        sMax = 1;
      }
      const range = sMax - sMin || 1;
      return [sMin - range * 0.1, sMax + range * 0.1];
    }

    // Non-selected mode: auto-fit Y when X is zoomed
    if (isZoomed && customXDomain) {
      const visibleSet = new Set(customXDomain);
      let sMin = Infinity;
      let sMax = -Infinity;
      for (const d of data) {
        if (visibleSet.has(d.name)) {
          if (d.min < sMin) sMin = d.min;
          if (d.max > sMax) sMax = d.max;
        }
      }
      if (sMin !== Infinity) {
        const range = sMax - sMin || 1;
        return [sMin - range * 0.1, sMax + range * 0.1];
      }
    }

    if (!showDataZoom) return undefined;
    const [min, max] = fullYDomain;
    const range = max - min;

    const zMin = min + (zoomState.start / 100) * range;
    const zMax = min + (zoomState.end / 100) * range;

    return [zMin, zMax];
  }, [selectedMode, overlay, baseline, showDataZoom, fullYDomain, zoomState, isZoomed, customXDomain, data]);

  const margins: [number, number, number, number] | undefined = useMemo(() => {
    // Top, Right, Bottom, Left
    // Default is [10, 24, 10, 10]
    // If Y zoom: Right increases (e.g. 50)
    // If X zoom: Bottom increases (e.g. 40)
    const top = 10;
    const right = showDataZoom ? 50 : 24;
    const bottom = showXDataZoom ? 40 : 10;
    const left = 10;

    if (showDataZoom || showXDataZoom) return [top, right, bottom, left];
    return undefined;
  }, [showDataZoom, showXDataZoom]);

  const {
    dims,
    xScale,
    yScale,
    xDomain,
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
    customYDomain,
    customXDomain,
    margins,
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

  // ── Visible-data filtering: when X is zoomed, only pass visible points to renderers ──
  const visibleSet = useMemo(() => {
    if (!isZoomed || !customXDomain) return null;
    return new Set(customXDomain);
  }, [isZoomed, customXDomain]);

  const visibleData = useMemo(() => {
    if (!visibleSet) return data;
    return data.filter(d => visibleSet.has(d.name));
  }, [data, visibleSet]);

  const visibleOverlay = useMemo(() => {
    if (!overlay || !visibleSet) return overlay;
    return { ...overlay, series: overlay.series.filter(pt => visibleSet.has(pt.name)) };
  }, [overlay, visibleSet]);

  const visibleBaseline = useMemo(() => {
    if (!baseline || !visibleSet) return baseline;
    return {
      daily: baseline.daily.filter(pt => visibleSet.has(pt.name)),
      monthly: baseline.monthly.filter(pt => visibleSet.has(pt.name)),
    };
  }, [baseline, visibleSet]);

  const visibleExcessReturn = useMemo(() => {
    if (!excessReturn || !visibleSet) return excessReturn;
    return excessReturn.filter(pt => visibleSet.has(pt.name));
  }, [excessReturn, visibleSet]);

  // ── Median top-layer: always rendered above all fills/overlays ──
  const reactId = useId();
  const medianGradientId = `median-top-grad${reactId.replace(/:/g, '')}`;
  const medianShadowId = `median-top-shadow${reactId.replace(/:/g, '')}`;
  const bandColor = bandConfig?.color ?? '99, 102, 241';
  const hasOverlay = !!overlay;

  const { medianPath, medianAreaPath } = useMemo(() => {
    if (visibleData.length === 0) return { medianPath: '', medianAreaPath: '' };
    const x = (d: BandDataPoint) => xScale(d.name) ?? 0;
    const baseY = yScale.range()[0];

    const medLine = line<BandDataPoint>().x(x).y((d) => yScale(d.median)).curve(curve);
    const medArea = area<BandDataPoint>().x(x).y0(() => baseY).y1((d) => yScale(d.median)).curve(curve);

    return {
      medianPath: medLine(visibleData) || '',
      medianAreaPath: medArea(visibleData) || '',
    };
  }, [visibleData, xScale, yScale, curve]);

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
        <defs>
          <filter id="overlay-line-shadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="1" />
          </filter>
        </defs>
        <g transform={transform} className="band-chart chart">
          {/* Layer 0.5: Month Stripes (Background) */}
          {showMonthStripes && (
            <MonthStripes
              xScale={xScale}
              height={dims.height}
              data={xDomain}
            />
          )}

          {/* Layer 0.8: Drawdown Ceiling (red tint from top, depth = drawdown) — middle depth layer */}
          {showDrawdown && (
            <g opacity={0.6}>
              <DrawdownArea
                data={
                  visibleOverlay
                    ? visibleOverlay.series
                    : visibleData.map(d => ({ name: d.name, value: d.median }))
                }
                xScale={xScale}
                yScale={yScale}
                chartHeight={dims.height}
                animated={animated}
              />
            </g>
          )}

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
              separated={xAxis.separated}
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
              separated={yAxis.separated}
            />
          )}

          {/* Layer 2.5: DataZoom Control (Vertical Y) */}
          {showDataZoom && (
            <g transform={`translate(${dims.width + (yAxis.separated ? 20 : 10)}, 0)`}>
              <DataZoomBar
                height={dims.height}
                start={zoomState.start}
                end={zoomState.end}
                onChange={(s, e) => setZoomState({ start: s, end: e })}
                yDomain={fullYDomain}
              />
            </g>
          )}

          {/* Layer 2.6: DataZoom Control (Horizontal X) */}
          {showXDataZoom && (
            <g transform={`translate(0, ${dims.height + 20})`}>
              <DataZoomBar
                height={20}
                width={dims.width}
                start={zoomStateX.start}
                end={zoomStateX.end}
                onChange={(s, e) => setZoomStateX({ start: s, end: e })}
                orient="horizontal"
                xLabels={xDataZoomLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
              />
            </g>
          )}

          {/* Layer 2.7: Zoom Reset Button (center at DataZoom bar intersection) */}
          {showDataZoom && showXDataZoom && (
            <ZoomResetButton
              x={dims.width + (yAxis.separated ? 20 : 10) + 10}
              y={dims.height + 20 + 10}
              visible={isZoomed}
              onReset={handleResetZoom}
            />
          )}

          {/* Layer 3: Band fills + edges (median rendered in top layer) */}
          <g className="band-layers">
            <BandSeries
              data={visibleData}
              xScale={xScale}
              yScale={yScale}
              config={bandConfig}
              animated={animated}
              curve={curve}
              hasOverlay={hasOverlay}
              hideMedian
            />
          </g>

          {/* Layer 3.2: Baseline series (line + between-curve fills, selected mode) */}
          {selectedMode && visibleBaseline && visibleBaseline.daily.length > 0 && (
            <BaselineSeries
              daily={visibleBaseline.daily}
              monthly={visibleBaseline.monthly}
              xScale={xScale}
              yScale={yScale}
              mode="selected"
              animated={animated}
              overlaySeries={visibleOverlay?.series}
            />
          )}

          {/* Layer 3.3: Excess return energy bars (only positive, only in selected mode) — middle depth layer */}
          {selectedMode && visibleExcessReturn && visibleExcessReturn.length > 0 && (
            <g opacity={0.6}>
              <ExcessBars
                data={visibleExcessReturn}
                xScale={xScale}
                chartHeight={dims.height}
                animated={animated}
              />
            </g>
          )}

          {/* Layer 4: Highlighted strategy line + gradient (with directional shadow for depth) */}
          <g filter={overlay ? 'url(#overlay-line-shadow)' : undefined}>
            <OverlayLine
              overlay={visibleOverlay}
              xScale={xScale}
              yScale={yScale}
              animated={animated}
              curve={curve}
              brushEffect={brushEffect}
              hideGradient={selectedMode}
            />
          </g>

          {/* Layer 5: Median baseline — hidden in selected mode (strategy line is hero) */}
          {!selectedMode && medianPath && (
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
                <filter id={medianShadowId} x="-10%" y="-10%" width="120%" height="140%">
                  <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="1" />
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

              {/* Knockout stroke — background-colored backing for median line */}
              <motion.path
                d={medianPath}
                fill="none"
                stroke={KNOCKOUT_COLOR}
                strokeWidth={hasOverlay ? 0.6 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={animated ? { d: medianPath, opacity: 0 } : undefined}
                animate={{ d: medianPath, opacity: 1 }}
                transition={{ d: { duration: animated ? 0.75 : 0, ease: 'easeInOut' }, opacity: { duration: 0.3 } }}
              />
              {/* Median line with drop shadow */}
              <motion.path
                d={medianPath}
                fill="none"
                stroke={`rgba(${bandColor}, ${hasOverlay ? 0.25 : 1})`}
                strokeWidth={hasOverlay ? 0.3 : 1}
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
              data={visibleData}
              allData={data}
              xScale={xScale}
              yScale={yScale}
              auxiliaryLines={auxiliaryLines}
              tooltipDisabled={tooltipDisabled}
              tooltipTemplate={tooltipTemplate}
              onHoverStrategy={onHoverStrategy}
              onHoverInfo={onHoverInfo}
              onSelectStrategy={onSelectStrategy}
              brushZoomEnabled={brushZoomEnabled}
              onBrushZoom={handleBrushZoom}
              crosshairXLabelY={showXDataZoom ? dims.height + 10 : undefined}
              crosshairYLabelX={showDataZoom ? dims.width + (yAxis.separated ? 20 : 10) : undefined}
              crosshairYLabelWidth={showDataZoom ? 40 : undefined}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
