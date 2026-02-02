# Thread: Sparkline Component

Compact 60-day mini-candlestick bar chart that appears on tile hover, showing historical price movement as vertical open/close bars.

---

## Purpose

Reveal historical price context when user hovers over a tile, providing visual confirmation of trend direction without cluttering the default view.

## Usage Context

**Exclusively in HeatMapTile middle frame (flex column):**
- Conditional render: Only shows when tile is hovered
- Positioned in dedicated flex middle frame between header and badge
- Edge-to-edge horizontally (cancels parent padding)
- See [HeatMapTile Task 06: Sparkline Integration](../heatmap-tile/tasks/06-sparkline-integration.md)

## Component Anatomy

```
┌──────────────────────────────────────┐
│ Sparkline (flex: 1, min-height: 0)   │
│ ┃┃ ┃┃┃ ┃┃┃┃ ┃┃ ┃┃┃┃ ┃┃┃ ┃┃ ┃┃┃   │ ← 60 candlestick bars
│ ┃┃ ┃┃┃ ┃┃┃┃ ┃┃ ┃┃┃┃ ┃┃┃ ┃┃ ┃┃┃   │   white, up=0.7 / down=0.35 opacity
│ ┃┃ ┃┃┃ ┃┃┃┃ ┃┃ ┃┃┃┃ ┃┃┃ ┃┃ ┃┃┃   │
│ ←─────── 60 trading days ──────→     │
└──────────────────────────────────────┘
```

## Task Breakdown

### [Task 01: SVG Shell & Dimensions](./tasks/01-svg-shell.md)
- Responsive SVG container (flex: 1)
- ViewBox calculation for dynamic width/height
- Coordinate system setup

### [Task 02: Candlestick Bar Generation & Styling](./tasks/02-path-generation.md)
- Generate 60 open/close candlestick pairs via geometric Brownian motion
- Render as SVG `<rect>` elements with gap and rounded corners
- White fill, differential opacity for up/down bars

### ~~[Task 03: Endpoint Dot](./tasks/03-endpoint-dot.md)~~
- **REMOVED** — Endpoint dot was removed during implementation (not visually appealing with bar chart)

### [Task 04: Staggered Bar Animation](./tasks/04-draw-animation.md)
- Per-bar fade-in with staggered delay (25ms per bar, left-to-right)
- 60ms ease-out per bar
- CSS `@keyframes bar-fade-in`

---

## Data Format

**Input:** Array of 60 candlestick objects with open/close prices

```typescript
interface Candle {
  open: number;
  close: number;
}

// Generated via geometric Brownian motion
const sparklineData: Candle[] = generateMockCandles(changePercent, 60);
```

**Mock Data Generation:**
```typescript
function generateMockCandles(changePercent: number, days = 60): Candle[] {
  const basePrice = 50 + Math.random() * 150;
  const dailyDrift = changePercent / days / 100;
  const volatility = 0.015 + Math.random() * 0.01;
  const candles: Candle[] = [];
  let price = basePrice;
  for (let i = 0; i < days; i++) {
    const open = price;
    const noise = (Math.random() - 0.5) * 2;
    price = open * (1 + dailyDrift + volatility * noise);
    candles.push({ open, close: price });
  }
  // End correction: nudge last close toward target
  const target = basePrice * (1 + changePercent / 100);
  candles[days - 1].close += (target - candles[days - 1].close) * 0.5;
  return candles;
}
```

**Key Properties:**
- Continuous: `open[i] = close[i-1]` (each bar starts where previous ended)
- Realistic volatility: 1.5-2.5% daily
- Trend correction: last close nudged toward sector's changePercent

---

## Visual Specifications

**Bar:**
- Fill: White `#ffffff`
- Up bar opacity: 70% (`fill-opacity="0.7"`)
- Down bar opacity: 35% (`fill-opacity="0.35"`)
- Width: `(containerWidth / 60) * 0.85` (15% gap between bars)
- Corner radius: `rx="0.5"`
- Minimum height: 1px

**Container:**
- CSS: `flex: 1; min-height: 0;`
- Horizontal: edge-to-edge via `margin: 4px calc(-1 * var(--tile-pad)) 4px`
- Y bounds: 8% padding top/bottom
- Fade-in: opacity 0→1 via `.visible` class

**Animation:**
- Per-bar staggered fade-in: `animation-delay: (i * 25)ms`
- Duration: 60ms ease-out per bar
- CSS class: `.sparkline-bar`

---

## Design Principles

**Minimalism:** Thin vertical bars, no axes/labels/grid
**Context:** Shows trend direction and volatility, not precise values
**Subtlety:** White bars with differential opacity, blends with solid tile background
**Angular aesthetics:** Candlestick bars give sharp, financial-data appearance vs wavy curves
**Performance:** SVG rect rendering, CSS animation (no JS animation loop)

---

## References

- **HeatMapTile Integration:** [Section 5 → HeatMapTile → Task 06](../heatmap-tile/tasks/06-sparkline-integration.md)
- **Lower Panel:** [Section 5 → HeatMapTile → Task 04](../heatmap-tile/tasks/04-lower-panel.md)

---

## Technical Notes

**Why 60 data points?**
- Represents ~3 months of trading days
- Dense enough for fine-grained trend visualization
- 60 thin bars create a cohesive trend line appearance
- Small enough for fast rendering (60 SVG rects ≈ negligible)

**Why candlestick bars instead of line chart?**
- Sharp angular appearance looks more professional/financial
- Open/close pairs show intraday direction per bar
- Differential opacity (up=0.7, down=0.35) adds depth
- No smoothing artifacts (Catmull-Rom curves looked "弯弯扭扭")
- Matches common financial charting conventions

**Why white fill instead of red/green?**
- Sparkline shows historical trend (not current direction)
- Current direction already shown by Change% badge color
- White blends with solid tile background
- Neutral color avoids confusion with up/down indicators

**SVG vs Canvas:**
- SVG chosen for:
  - Declarative API (easy rect generation)
  - Built-in scaling (viewBox handles responsiveness)
  - Per-element CSS animation (staggered delay)
  - No manual redraw on resize
