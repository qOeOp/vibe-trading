# Section 5: Components

Detailed specifications for all UI components, including props, layout, interactions, and state handling.

---

## Threads

### [HeatMap Container](./threads/heatmap-container/index.md)
Main container component managing layout calculation, dimension measurement, and tile rendering.

### [HeatMap Header](./threads/heatmap-header/index.md)
Fixed header with title, breadcrumb navigation, search box, and toggle controls.

### [HeatMap Tile](./threads/heatmap-tile/index.md)
Solid-color tile with header row layout, 7-stop coloring, adaptive content scaling, and water ripple expansion.

### [Sparkline](./threads/sparkline/index.md)
Mini trend chart (30-day data) with draw-line animation on hover. See [Sparkline thread](./threads/sparkline/index.md) for stroke/sizing specs.

### [Breadcrumb](./threads/breadcrumb/index.md)
Navigation path display (一级 > 二级 > 三级 > 股票) with click-to-navigate and hover states.

### [Search Box](./threads/search-box/index.md)
Cross-level search input with icon, focus states, and result suggestions.

### [Loading State](./threads/loading-state/index.md)
Centered spinner with "加载中..." text animation and semi-transparent overlay.

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
        ├── Header Row
        │     ├── Name (left)
        │     └── Capital Flow (right)
        ├── Sparkline (hover / large tiles)
        └── Badge (涨跌幅, absolute bottom-right)
```
