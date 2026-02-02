# Section 6: Visual Design

Color systems, tile styling, 3D interactions, and animation specifications.

---

## Threads

### [Color System](./threads/color-system/index.md)
7-stop solid color ramp based on changePercent (Binance-style). Conservative finance palette (white background + red/green for prices).

### [3D Hover](./threads/3d-hover/index.md)
Tile elevation (-2px translateY), sparkline reveal, water ripple expansion. See [Tile Shell](../5-components/threads/heatmap-tile/tasks/01-tile-shell.md) for canonical transition timing.

### [Animations](./threads/animations/index.md)
Sparkline draw-line, water ripple expansion, loading spinner, state transitions.

---

## Visual Principles

**Finance Aesthetics:**
- White background, solid opaque tile colors
- Red/green reserved exclusively for price changes (Chinese market convention: red=涨, green=跌)
- No decorative gradients or vibrant accent colors

**Tile Stack:**
```
Background: Solid opaque color from 7-stop ramp (e.g., #F6465D)
Border: 1px solid rgba(255, 255, 255, 0.18)
Shadow: 0px 8px 32px rgba(0, 0, 0, 0.37)
Corner: 0px default, 16px on container-edge corners
```

**Interaction Hierarchy:**
1. Hover: Tile lifts 2px, sparkline appears, water ripple for small tiles
2. Click: Drill-down animation (zoom from parent)
3. Breadcrumb: Drill-up animation (reverse shrink)
