'use client';

import { useCallback, useMemo, useState } from 'react';
import type { BandData, OverlaySeries } from './use-band-chart';
import { useAnimateZoom } from './use-animate-zoom';
import {
  computeFullYDomain,
  computeSelectedYDomain,
  computeZoomedBandYDomain,
  computeSliderYDomain,
  computeXDomainFromZoom,
  computeDynamicMargins,
  filterVisibleBandData,
  filterVisibleOverlay,
  filterVisibleBaseline,
  filterVisibleNamedValues,
} from '../utils';

interface UseBandChartZoomConfig {
  data: BandData;
  overlay: OverlaySeries | null;
  baseline?: {
    daily: Array<{ name: string; value: number }>;
    monthly: Array<{ name: string; value: number }>;
  };
  excessReturn?: Array<{ name: string; value: number }> | null;
  selectedMode?: boolean;
  showDataZoom?: boolean;
  showXDataZoom?: boolean;
}

interface UseBandChartZoomResult {
  /** Computed full Y domain with padding */
  fullYDomain: [number, number];
  /** Computed custom Y domain (zoom-adjusted) or undefined for auto */
  customYDomain: [number, number] | undefined;
  /** Computed custom X domain (zoom-adjusted) or undefined for auto */
  customXDomain: string[] | undefined;
  /** Dynamic margins based on DataZoom visibility */
  margins: [number, number, number, number] | undefined;
  /** Whether X axis is currently zoomed */
  isZoomed: boolean;
  /** Y DataZoom state */
  zoomState: { start: number; end: number };
  /** X DataZoom state */
  zoomStateX: { start: number; end: number };
  /** Set Y zoom state */
  setZoomState: (state: { start: number; end: number }) => void;
  /** Set X zoom state */
  setZoomStateX: (state: { start: number; end: number }) => void;
  /** Animated brush zoom handler */
  handleBrushZoom: (xRange: { start: number; end: number }) => void;
  /** Reset zoom to full range */
  handleResetZoom: () => void;
  /** Filtered data for visible range */
  visibleData: BandData;
  visibleOverlay: OverlaySeries | null | undefined;
  visibleBaseline: UseBandChartZoomConfig['baseline'];
  visibleExcessReturn:
    | Array<{ name: string; value: number }>
    | null
    | undefined;
}

export function useBandChartZoom({
  data,
  overlay,
  baseline,
  excessReturn,
  selectedMode,
  showDataZoom,
  showXDataZoom,
}: UseBandChartZoomConfig): UseBandChartZoomResult {
  const [zoomState, setZoomState] = useState({ start: 0, end: 100 });
  const [zoomStateX, setZoomStateX] = useState({ start: 0, end: 100 });

  const fullYDomain = useMemo(() => computeFullYDomain(data), [data]);

  const customXDomain = useMemo(
    () =>
      showXDataZoom
        ? computeXDomainFromZoom(data, zoomStateX.start, zoomStateX.end)
        : undefined,
    [showXDataZoom, data, zoomStateX],
  );

  const { animateZoom } = useAnimateZoom();
  const isZoomed = zoomStateX.start > 0.5 || zoomStateX.end < 99.5;

  const handleBrushZoom = useCallback(
    (xRange: { start: number; end: number }) => {
      animateZoom(zoomStateX, xRange, setZoomStateX, 350);
    },
    [zoomStateX, animateZoom],
  );

  const handleResetZoom = useCallback(() => {
    animateZoom(zoomStateX, { start: 0, end: 100 }, setZoomStateX, 350);
  }, [zoomStateX, animateZoom]);

  const visibleSet = useMemo(() => {
    if (!isZoomed || !customXDomain) return null;
    return new Set(customXDomain);
  }, [isZoomed, customXDomain]);

  const customYDomain = useMemo((): [number, number] | undefined => {
    if (selectedMode && overlay) {
      return computeSelectedYDomain(overlay, baseline?.daily, visibleSet);
    }

    if (isZoomed && customXDomain) {
      const zoomedDomain = computeZoomedBandYDomain(
        data,
        new Set(customXDomain),
      );
      if (zoomedDomain) return zoomedDomain;
    }

    if (!showDataZoom) return undefined;
    return computeSliderYDomain(fullYDomain, zoomState.start, zoomState.end);
  }, [
    selectedMode,
    overlay,
    baseline,
    showDataZoom,
    fullYDomain,
    zoomState,
    isZoomed,
    customXDomain,
    data,
    visibleSet,
  ]);

  const margins = useMemo(
    () => computeDynamicMargins(showDataZoom, showXDataZoom),
    [showDataZoom, showXDataZoom],
  );

  const visibleData = useMemo(
    () => filterVisibleBandData(data, visibleSet),
    [data, visibleSet],
  );
  const visibleOverlay = useMemo(
    () => filterVisibleOverlay(overlay, visibleSet),
    [overlay, visibleSet],
  );
  const visibleBaseline = useMemo(
    () => filterVisibleBaseline(baseline, visibleSet),
    [baseline, visibleSet],
  );
  const visibleExcessReturn = useMemo(
    () => filterVisibleNamedValues(excessReturn, visibleSet),
    [excessReturn, visibleSet],
  );

  return {
    fullYDomain,
    customYDomain,
    customXDomain,
    margins,
    isZoomed,
    zoomState,
    zoomStateX,
    setZoomState,
    setZoomStateX,
    handleBrushZoom,
    handleResetZoom,
    visibleData,
    visibleOverlay,
    visibleBaseline,
    visibleExcessReturn,
  };
}

export type { UseBandChartZoomConfig, UseBandChartZoomResult };
