/**
 * Pure computation functions for BandChart domain/filtering logic.
 * L0: No React, no hooks, no side effects — data in → data out.
 */
import type { BandDataPoint, BandData, OverlaySeries } from './hooks';

// ─── Y Domain ────────────────────────────────────────────

/** Compute full Y domain from band data with 5% padding. */
export function computeFullYDomain(data: BandData): [number, number] {
  if (data.length === 0) return [0, 1];

  let minVal = Infinity;
  let maxVal = -Infinity;
  for (const bp of data) {
    if (bp.min < minVal) minVal = bp.min;
    if (bp.max > maxVal) maxVal = bp.max;
  }

  const range = maxVal - minVal || 1;
  return [minVal - range * 0.05, maxVal + range * 0.05];
}

/** Compute Y domain in selected mode — fit to overlay + baseline visible range. */
export function computeSelectedYDomain(
  overlay: OverlaySeries,
  baselineDaily: Array<{ name: string; value: number }> | undefined,
  visibleSet: Set<string> | null,
): [number, number] {
  let sMin = Infinity;
  let sMax = -Infinity;

  for (const pt of overlay.series) {
    if (visibleSet && !visibleSet.has(pt.name)) continue;
    if (pt.value < sMin) sMin = pt.value;
    if (pt.value > sMax) sMax = pt.value;
  }

  if (baselineDaily) {
    for (const pt of baselineDaily) {
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

/** Compute Y domain for zoomed band data (non-selected mode). */
export function computeZoomedBandYDomain(
  data: BandData,
  visibleSet: Set<string>,
): [number, number] | undefined {
  let sMin = Infinity;
  let sMax = -Infinity;

  for (const d of data) {
    if (visibleSet.has(d.name)) {
      if (d.min < sMin) sMin = d.min;
      if (d.max > sMax) sMax = d.max;
    }
  }

  if (sMin === Infinity) return undefined;

  const range = sMax - sMin || 1;
  return [sMin - range * 0.1, sMax + range * 0.1];
}

/** Compute Y domain from DataZoom slider percentages. */
export function computeSliderYDomain(
  fullYDomain: [number, number],
  zoomStart: number,
  zoomEnd: number,
): [number, number] {
  const [min, max] = fullYDomain;
  const range = max - min;
  return [min + (zoomStart / 100) * range, min + (zoomEnd / 100) * range];
}

// ─── X Domain ────────────────────────────────────────────

/** Compute visible X domain from zoom slider state. */
export function computeXDomainFromZoom(
  data: BandData,
  zoomStart: number,
  zoomEnd: number,
): string[] | undefined {
  const len = data.length;
  if (len === 0) return undefined;

  const startIdx = Math.floor(len * (zoomStart / 100));
  const endIdx = Math.ceil(len * (zoomEnd / 100));
  const safeStart = Math.max(0, Math.min(len - 1, startIdx));
  const safeEnd = Math.max(safeStart + 1, Math.min(len, endIdx));

  return data.slice(safeStart, safeEnd).map((d) => d.name);
}

// ─── Margins ─────────────────────────────────────────────

/** Compute dynamic chart margins based on DataZoom visibility. */
export function computeDynamicMargins(
  showDataZoom?: boolean,
  showXDataZoom?: boolean,
): [number, number, number, number] | undefined {
  const top = 10;
  const right = showDataZoom ? 50 : 24;
  const bottom = showXDataZoom ? 40 : 10;
  const left = 10;

  if (showDataZoom || showXDataZoom) return [top, right, bottom, left];
  return undefined;
}

// ─── Visible Data Filtering ──────────────────────────────

/** Filter band data to visible set. */
export function filterVisibleBandData(
  data: BandData,
  visibleSet: Set<string> | null,
): BandData {
  if (!visibleSet) return data;
  return data.filter((d) => visibleSet.has(d.name));
}

/** Filter overlay series to visible set. */
export function filterVisibleOverlay(
  overlay: OverlaySeries | null | undefined,
  visibleSet: Set<string> | null,
): OverlaySeries | null | undefined {
  if (!overlay || !visibleSet) return overlay;
  return {
    ...overlay,
    series: overlay.series.filter((pt) => visibleSet.has(pt.name)),
  };
}

/** Filter baseline data to visible set. */
export function filterVisibleBaseline(
  baseline:
    | {
        daily: Array<{ name: string; value: number }>;
        monthly: Array<{ name: string; value: number }>;
      }
    | undefined,
  visibleSet: Set<string> | null,
): typeof baseline {
  if (!baseline || !visibleSet) return baseline;
  return {
    daily: baseline.daily.filter((pt) => visibleSet.has(pt.name)),
    monthly: baseline.monthly.filter((pt) => visibleSet.has(pt.name)),
  };
}

/** Filter named-value array to visible set. */
export function filterVisibleNamedValues(
  values: Array<{ name: string; value: number }> | null | undefined,
  visibleSet: Set<string> | null,
): Array<{ name: string; value: number }> | null | undefined {
  if (!values || !visibleSet) return values;
  return values.filter((pt) => visibleSet.has(pt.name));
}
