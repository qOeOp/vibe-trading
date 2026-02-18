# Band Chart Dual-Mode Design

> Daily Returns chart improvement: default (band overview) vs selected (strategy deep-dive)

## Summary

The BandChart currently renders a statistical band (min-max, q1-q3) with an optional overlay line when a strategy is hovered/selected. This design introduces a proper **dual-mode** system: a clean band overview for default state, and a rich strategy analysis view when a leaderboard item is clicked.

## Two States

| Aspect | Default (no selection) | Selected (click leaderboard) |
|---|---|---|
| Band (q1-q3, min-max fills) | Visible (current design) | Hidden (fade out 300ms) |
| Baseline (market index) | Monthly smooth curve (cubic bezier), no fill | Daily precision, light blue area fill (low opacity) |
| Strategy line | None | Bold colored line, absolute hero |
| Drawdown ceiling | Based on median, red from canvas top | Based on selected strategy's own peak |
| Excess return bars | None | Strategy minus baseline, only positive, red thin bars |
| Y-axis domain | Full band range (current behavior) | Fit to strategy actual min-max + 10% padding |
| Background stripes | Year dividers (full period) / month stripes (year zoom) | Same logic as default |
| Race animation | Active (current behavior) | Hidden |
| Hover interaction | Disabled | Active on strategy line + crosshair |

## Implementation Plan

### P0: Core State Switch (selected mode)

**Goal:** Click leaderboard strategy -> Y-axis fits to strategy range, band hides, strategy line appears.

#### Step 1: Y-axis fit animation

**File:** `apps/web/src/lib/ngx-charts/band-chart/hooks/use-band-chart.ts`

- Add `fitToSeries?: DataItem[]` to `UseBandChartConfig`
- When `fitToSeries` is set, compute Y domain from that series instead of full band data
- Add 10% vertical padding: `[min - range * 0.1, max + range * 0.1]`
- The existing `customYDomain` mechanism handles domain override — `fitToSeries` is a higher-level convenience that computes the domain automatically

**File:** `apps/web/src/lib/ngx-charts/band-chart/band-chart.tsx`

- Compute `fitSeries` from `overlay?.series` when overlay exists
- Pass to `useBandChart({ fitToSeries: fitSeries })`
- Y-axis domain changes trigger natural re-render — D3 scales update, all paths recompute
- Framer Motion `<motion.path>` with `d`-attribute morphing provides 300ms animated transition between old/new paths

#### Step 2: Band hide/show on selection

**File:** `apps/web/src/lib/ngx-charts/band-chart/band-chart.tsx`

- BandSeries already has fade-out behavior when overlay is active (opacity 0 vs 1)
- Verify the existing fade transition uses 300ms ease-out
- May need to adjust: currently fades to low opacity, should fade to 0 completely in selected mode

#### Step 3: Strategy line as hero

**File:** `apps/web/src/lib/ngx-charts/band-chart/components/overlay-line.tsx`

- Already renders when overlay is set — no structural change needed
- Ensure stroke width is prominent (2-3px) and color matches strategy color
- Verify AnimatePresence transition is smooth at 300ms

#### Step 4: Click-to-deselect

**File:** `apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx`

- Add click handler on the invisible interaction rect
- If clicked without hitting a data point → call `onSelectStrategy?.(null)` to deselect
- Factor page already handles `selectedStrategyId = null` → returns to default mode

---

### P1: Visual Enhancements

#### Step 5: Baseline series (market index)

**New component:** `apps/web/src/lib/ngx-charts/band-chart/components/baseline-series.tsx`

Props:
```typescript
interface BaselineSeriesProps {
  daily: DataItem[]      // daily precision data
  monthly: DataItem[]    // monthly sample points for smooth curve
  xScale: ScalePoint<string>
  yScale: ScaleLinear<number, number>
  mode: 'default' | 'selected'
  animated?: boolean
}
```

Behavior:
- **Default mode:** Render monthly data as smooth curve using `d3.curveNatural` (cubic bezier). No area fill, just a thin line (~1px, muted color like `#a8b2c7`). Shows market trend without daily noise.
- **Selected mode:** Switch to daily data. Render as area fill from line to chart bottom. Light blue color (`rgba(100, 149, 237, 0.08)`), lower opacity than current overlay gradient. Serves as background reference without competing with strategy line.
- Transition: crossfade between monthly and daily paths over 300ms.

**Data source (mock phase):**

**File:** `apps/web/src/features/factor/hooks/use-band-data.ts`

- Compute `baseline.daily` from band median values (existing computation)
- Compute `baseline.monthly` by sampling last trading day of each calendar month from median
- Return both alongside existing `bandData`, `overlay`, `auxiliaryLines`
- Later: replace with real market index data via new prop

#### Step 6: Baseline area opacity reduction

In selected mode, the baseline area fill uses very low opacity (`0.06-0.08`) to stay firmly in the background. The strategy line and its color must always dominate visually.

#### Step 7: Excess return energy bars

**New component:** `apps/web/src/lib/ngx-charts/band-chart/components/excess-bars.tsx`

Props:
```typescript
interface ExcessBarsProps {
  data: DataItem[]       // excess return values (strategy - baseline)
  xScale: ScalePoint<string>
  yScale: ScaleLinear<number, number>
  animated?: boolean
}
```

Behavior:
- For each data point where excess > 0: render thin vertical bar from Y=0 upward to the excess value
- Bar width: 1-2px (or `xScale.step() * 0.3` for proportional sizing)
- Color: red/coral (`#CF304A` at 40% opacity) — matches market-up color
- Negative excess: not rendered (completely hidden)
- Shares main Y-axis scale — bars are positioned using the same `yScale`
- Only rendered in selected mode

**Data computation:**

**File:** `apps/web/src/features/factor/hooks/use-band-data.ts`

```
excessReturn[i] = overlay.series[i].value - baseline.daily[i].value
// Only keep positive values, set negative to 0
```

#### Step 8: Drawdown ceiling (enhanced)

**File:** `apps/web/src/lib/ngx-charts/band-chart/components/drawdown-area.tsx`

Current behavior: renders drawdown as horizontal gradient from the data area. Needs redesign to "ceiling mode":

- Drawdown = `1 - (current / runningPeak)` where `runningPeak = max(values[0..i])`
- **Default mode:** Compute from median series
- **Selected mode:** Compute from selected strategy's series
- Rendering: Red fill from **canvas top edge** downward
  - Height proportional to drawdown depth: `drawdownHeight = drawdown * dims.height * 0.5` (cap at 50% canvas)
  - Opacity dynamic: `baseOpacity + drawdown * opacityScale`
    - Shallow drawdown (< 5%): nearly invisible (`opacity ~0.02`)
    - Deep drawdown (> 20%): clearly visible (`opacity ~0.15-0.25`)
  - Color: `rgba(207, 48, 74, opacity)` (market-up red)
- Implementation: SVG `<path>` tracing the ceiling contour, filled downward from `y=0` (top of chart area)

#### Step 9: Year dividers replacing month stripes

**File:** `apps/web/src/lib/ngx-charts/band-chart/components/month-stripes.tsx`

Rename to `background-stripes.tsx` or keep name but add mode logic:

- **Full period view** (X domain spans > 18 months): render vertical lines at January 1st boundaries only. Thin, muted color (`#e0ddd8`). Optional small year label at top.
- **Year view** (X domain <= 18 months): render alternating month stripes (current behavior) to match polar calendar month rings.
- Detection: check `xDomain.length` and date range to determine which mode

#### Step 10: Transition animations

All state transitions use consistent 300ms ease-out:
- Y-axis domain: paths morph via Framer Motion `d`-attribute transition
- Band opacity: `1 → 0` (fade out)
- Baseline: crossfade monthly path → daily area path
- Excess bars: fade in from 0 opacity
- Drawdown: morph contour from median-based to strategy-based
- Strategy switching: all elements transition simultaneously, no stagger

Click empty area → deselect → reverse all animations back to default.

## Component Layer Order (updated)

```
1. BackgroundStripes (year dividers or month stripes)
2. DrawdownCeiling (red tint from top)
3. XAxis
4. YAxis + DataZoomBars
5. BandSeries (hidden in selected mode)
6. BaselineSeries (monthly curve or daily area)
7. ExcessBars (only in selected mode)
8. RaceOverlay (only in default mode)
9. OverlayLine (strategy line, only in selected mode)
10. Median baseline (only in default mode)
11. Month label
12. BandTooltipArea (crosshair + interaction)
```

## New/Modified Files

| File | Action | Priority |
|---|---|---|
| `band-chart/hooks/use-band-chart.ts` | Add `fitToSeries` domain override | P0 |
| `band-chart/band-chart.tsx` | Wire fit logic, layer ordering, mode prop threading | P0 |
| `band-chart/components/band-tooltip-area.tsx` | Add click-to-deselect | P0 |
| `band-chart/components/overlay-line.tsx` | Verify hero styling | P0 |
| `band-chart/components/baseline-series.tsx` | **New** — market index curve/area | P1 |
| `band-chart/components/excess-bars.tsx` | **New** — positive excess return bars | P1 |
| `band-chart/components/drawdown-area.tsx` | Rewrite to ceiling mode | P1 |
| `band-chart/components/month-stripes.tsx` | Add year-divider mode | P1 |
| `features/factor/hooks/use-band-data.ts` | Add baseline + excess computation | P1 |
| `band-chart/components/index.ts` | Export new components | P1 |

## Mock Data Strategy

Until real market index data is available:
- `baseline.daily` = band median values (already computed)
- `baseline.monthly` = sample median at last trading day of each month
- `excessReturn` = strategy value minus median value at each point

The data interface is designed so swapping mock for real data requires only changing the computation in `useBandData`, no chart component changes needed.
