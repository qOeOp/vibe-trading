# Band Chart: Remove Race Animation + Depth Layering

**Date:** 2026-02-12
**Status:** Approved

## Goal

Remove the line race animation from the daily return band chart. Add visual depth/hierarchy to strategy-level layers using directional drop shadow on the strategy line and progressive opacity reduction on lower layers.

## Changes

### Remove

- **`race-overlay.tsx`** — delete the component file
- **`RaceOverlay` render block** in `band-chart.tsx`
- **`raceStrategies` prop** from BandChart interface and all usage
- **`raceStrategies` useMemo** in `factor-page.tsx`

Default mode (no strategy selected) shows static band fills only.

### Modify

#### 1. OverlayLine — Drop Shadow (topmost layer)

Add an SVG `<filter>` definition in `band-chart.tsx` `<defs>`:

```tsx
<filter id="line-shadow" x="-10%" y="-10%" width="120%" height="130%">
  <feDropShadow dx="2" dy="3" stdDeviation="2" flood-opacity="0.15" />
</filter>
```

Wrap `<OverlayLine>` in `<g filter="url(#line-shadow)">`.

Full opacity (100%). The directional shadow creates a "floating above paper" effect.

#### 2. DrawdownArea + ExcessBars — Middle Layer

Wrap each in `<g opacity={0.6}>` in selected mode. Visually receded but still readable.

#### 3. BaselineSeries — Bottom Layer

Wrap in `<g opacity={0.35}>` in selected mode (area fill). Most subdued, serves as ground reference.

### No Change

- Default mode: static band fills, axes, month stripes, tooltip
- Band fills fading to `opacity: 0` in selected mode
- BaselineSeries dual-mode behavior (thin line default, area fill selected)

## Visual Hierarchy (selected mode)

```
Strategy OverlayLine ── 100% opacity + drop shadow
DrawdownArea/ExcessBars ── 60% opacity
Baseline area fill ── 35% opacity
```

## Files

| File | Action |
|------|--------|
| `band-chart/components/race-overlay.tsx` | Delete |
| `band-chart/band-chart.tsx` | Remove RaceOverlay, add filter + opacity wrappers |
| `factor/components/factor-page.tsx` | Remove raceStrategies computation |
| `band-chart/components/index.ts` | Remove RaceOverlay export |
