# Thread: Sparkline Component

Compact 30-day price trend line chart that appears on tile hover, showing historical price movement with endpoint BreathingDot.

---

## Purpose

Reveal historical price context when user hovers over a tile, providing visual confirmation of trend direction without cluttering the default view.

## Component Location

```
apps/preview/src/app/components/Sparkline.tsx
```

## Usage Context

**Exclusively in HeatMapTile Lower Panel:**
- Conditional render: Only shows when tile is hovered AND tile size > 120×80px
- Positioned 48px from bottom (above Capital Flow + Change%)
- See [HeatMapTile Task 06: Sparkline Integration](../heatmap-tile/tasks/06-sparkline-integration.md)

## Component Anatomy

```
┌──────────────────────────────────────┐
│ Sparkline (40px height)              │
│     /\      /\                   ●   │ ← BreathingDot at endpoint
│    /  \    /  \     ___/             │
│   /    \  /    \___/                 │
│  /      \/                           │
│ ←────── 30 data points ──────→       │
└──────────────────────────────────────┘
```

## Task Breakdown

### [Task 01: SVG Shell & Dimensions](./tasks/01-svg-shell.md)
- Responsive SVG container
- ViewBox calculation for dynamic width
- Fixed 40px height
- Coordinate system setup

### [Task 02: Path Generation & Styling](./tasks/02-path-generation.md)
- Convert 30 data points to SVG path
- Line-to commands with proper scaling
- Stroke color (white with opacity)
- Smooth curves vs sharp angles

### [Task 03: Endpoint BreathingDot Integration](./tasks/03-endpoint-dot.md)
- Position BreathingDot at final data point
- foreignObject for React component in SVG
- Coordinate transformation
- Size adjustment (6px instead of 7px)

### [Task 04: Draw-Line Animation](./tasks/04-draw-animation.md)
- Stroke-dasharray reveal animation
- 400ms duration with ease-out
- Triggered on component mount
- Synchronized with fade-in

---

## Props Interface

```typescript
interface SparklineProps {
  /** 30 price data points */
  data: number[];

  /** Chart width in pixels */
  width: number;

  /** Chart height in pixels (fixed 40px recommended) */
  height: number;

  /** Attention level for endpoint dot */
  attentionLevel: number;

  /** Additional CSS classes */
  className?: string;
}
```

## Design Principles

**Minimalism:** Single-line chart, no axes/labels/grid
**Context:** Shows trend direction, not precise values
**Subtlety:** White line with low opacity, blends with glassmorphism
**Performance:** SVG path rendering, GPU-accelerated animation

---

## Data Format

**Input:** Array of 30 numbers representing daily closing prices

```typescript
// Example: 30-day price data
const sparklineData = [
  100.5, 102.3, 101.8, 103.2, 105.1,  // Days 1-5
  104.7, 106.2, 108.5, 107.9, 109.3,  // Days 6-10
  // ... 20 more data points
];
```

**Mock Data Generation:**
```typescript
// Temporary mock until real data available
const mockData = Array.from({ length: 30 }, (_, i) =>
  100 + Math.sin(i / 5) * 10 + Math.random() * 5
);
```

---

## Visual Specifications

**Line:**
- Stroke: White `#ffffff`
- Opacity: 60% (`stroke-opacity="0.6"`)
- Width: 1.5px (`stroke-width="1.5"`)
- Cap: Round (`stroke-linecap="round"`)
- Join: Round (`stroke-linejoin="round"`)

**BreathingDot:**
- Size: 6px (slightly smaller than tile dot)
- Color: Yellow `#facc15`
- Animation: Based on `attentionLevel` prop
- Position: End of line (last data point)

**Container:**
- Width: Tile width - 16px (8px margin each side)
- Height: Fixed 40px
- Position: `absolute bottom-12 left-2 right-2`
- Fade-in: 300ms opacity transition

---

## References

- **HeatMapTile Integration:** [Section 5 → HeatMapTile → Task 06](../heatmap-tile/tasks/06-sparkline-integration.md)
- **BreathingDot:** [Section 5 → Components → BreathingDot](../breathing-dot/index.md)
- **Lower Panel:** [Section 5 → HeatMapTile → Task 04](../heatmap-tile/tasks/04-lower-panel.md)

---

## Technical Notes

**Why 30 data points?**
- Represents 1 month of trading days (~22 business days)
- Balances detail vs visual clarity
- Small enough for fast rendering
- Large enough to show meaningful trends

**Why fixed 40px height?**
- Consistent visual weight across all tiles
- Fits in lower panel gap (48px from bottom)
- Tall enough to show trend variations
- Short enough to avoid dominating tile

**Why white stroke instead of red/green?**
- Sparkline shows historical trend (not current direction)
- Current direction already shown by Change% arrow color
- White blends with glassmorphism aesthetic
- Neutral color avoids confusion with up/down indicators

**SVG vs Canvas:**
- SVG chosen for:
  - Declarative API (easier path generation)
  - Built-in scaling (viewBox handles responsiveness)
  - Easy integration with React components
  - Better animation support (stroke-dasharray)
- Canvas alternative:
  - Slightly faster for 100+ charts
  - Overkill for 31 sectors max
  - Harder to integrate BreathingDot
