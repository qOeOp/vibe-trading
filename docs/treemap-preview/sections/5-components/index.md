# Section 5: Components

Detailed specifications for all UI components, including props, layout, interactions, and state handling.

---

## Threads

### [HeatMap Container](./threads/heatmap-container/index.md)
Main container component managing layout calculation, dimension measurement, and tile rendering.

### [HeatMap Header](./threads/heatmap-header/index.md)
Fixed header with title, breadcrumb navigation, search box, and toggle controls.

### [HeatMap Tile](./threads/heatmap-tile/index.md)
Glassmorphism tile with dual backgrounds, 50/50 panel split, dynamic coloring (3 zones), and 3D hover lift.

### [Sparkline](./threads/sparkline/index.md)
Mini trend chart (30-day data) with 2px blue stroke, white gradient fill, and draw-line animation.

### [Breathing Dot](./threads/breathing-dot/index.md)
7px yellow dot with ripple animation (scale 0→3), attention level-based pulse duration (1.2-3.0s).

### [Breadcrumb](./threads/breadcrumb/index.md)
Navigation path display (一级 > 二级 > 三级 > 股票) with click-to-navigate and hover states.

### [Search Box](./threads/search-box/index.md)
Cross-level search input with icon, focus states, and result suggestions.

### [Loading State](./threads/loading-state/index.md)
Skeleton screen with 31 placeholder tiles, shimmer animation, and timeout behavior.

### [Error State](./threads/error-state/index.md)
Error display with retry button, error type categorization, and performance degradation handling.

### [Empty State](./threads/empty-state/index.md)
Empty data placeholder with icon, message, and action button.

---

## Component Hierarchy

```
HeatMap (Container)
  ├── HeatMapHeader
  │     ├── Breadcrumb
  │     └── SearchBox
  └── HeatMapTile × 31
        ├── Upper Panel
        │     ├── Icon (Lucide)
        │     ├── Name
        │     └── BreathingDot
        └── Lower Panel
              ├── Sparkline (on hover, if tile > 120×80)
              ├── Capital Flow
              └── Change% + Arrow
```
