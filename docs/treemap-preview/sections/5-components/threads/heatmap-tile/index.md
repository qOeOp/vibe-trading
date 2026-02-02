# Thread: HeatMap Tile

Solid-color tile component with header row layout, absolute-positioned badge, dynamic 7-stop coloring, and adaptive content scaling.

---

## Tasks

### [1. Tile Shell & Positioning](./tasks/01-tile-shell.md)
Absolute positioning wrapper with corner-aware border-radius (Binance-style), continuous font scaling, and hover adaptive refresh.

### [2. Tile Background Styling](./tasks/02-dual-backgrounds.md)
Solid opaque backgrounds with simple border and drop shadow.

### [3. Upper Panel Layout](./tasks/03-upper-panel.md)
Header row with sector name (left) and capital flow value (right). Continuous font scaling.

### [4. Lower Panel Layout](./tasks/04-lower-panel.md)
Absolute-positioned badge (涨跌幅) at bottom-right corner.

### [5. Dynamic Color System](./tasks/05-dynamic-color.md)
7-stop solid color ramp based on changePercent (Binance-style).

### [6. Sparkline Integration](./tasks/06-sparkline-integration.md)
Conditional sparkline rendering between header and badge for tiles with sufficient space.

### [7. Adaptive Content Scaling](./tasks/07-adaptive-scaling.md)
Content size/visibility adjustments, water ripple expansion, hover-aware `applyAdaptiveStyles` refresh.

---

## Component Structure

```
┌─────────────────────────────────────┐
│ tile-shell (absolute positioned)    │
│ ┌─────────────────────────────────┐ │
│ │ tile-content (padded flex col)  │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ tile-header (flex row)      │ │ │
│ │ │ ┌──────────┐ ┌───────────┐ │ │ │
│ │ │ │ name     │ │ value     │ │ │ │
│ │ │ │ (left)   │ │ (right)   │ │ │ │
│ │ │ └──────────┘ └───────────┘ │ │ │
│ │ └─────────────────────────────┘ │ │
│ │                                 │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ sparkline (flex: 1)         │ │ │
│ │ └─────────────────────────────┘ │ │
│ │                                 │ │
│ │              ┌──────────┐       │ │
│ │              │  badge   │ ← abs │ │
│ │              │ (bottom- │   pos │ │
│ │              │  right)  │       │ │
│ │              └──────────┘       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

```html
<div class="tile">                    <!-- Task 1: Shell -->
  <div class="tile-content">          <!-- Padded flex column -->
    <div class="tile-header">         <!-- Task 3: Name + Value -->
      <div class="tile-name">板块名称</div>
      <span class="tile-value">+125.5亿</span>
    </div>
    <div class="tile-sparkline">...</div>  <!-- Task 6 -->
    <span class="tile-badge">+2.35%</span> <!-- Task 4: Absolute bottom-right -->
  </div>
</div>
```

**Reference:** See [Section 6: Visual Design](../../6-visual-design/index.md) for tile styling specs.
