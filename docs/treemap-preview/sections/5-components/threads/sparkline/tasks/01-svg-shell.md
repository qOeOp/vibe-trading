# Task: SVG Shell & Dimensions

Responsive SVG container that fills the flex middle frame of the tile, adapting to available space between header and badge.

---

## Design

### Purpose
Create SVG canvas that dynamically sizes to fill the sparkline frame, providing the coordinate system for candlestick bar rendering.

### Dimensions

**Width:**
- Dynamic: Fills tile width edge-to-edge
- Container uses `margin: 4px calc(-1 * var(--tile-pad)) 4px` to cancel parent padding
- Effective width = full tile width

**Height:**
- Dynamic: `flex: 1` takes remaining space in tile flex column
- Minimum height: 0 (via `min-height: 0`)
- Actual height depends on tile size minus header and badge

**ViewBox:**
```
viewBox="0 0 {width} {height}"
```
- Coordinate system matches measured pixel dimensions
- (0,0) at top-left corner
- X-axis: 0 → width (left to right)
- Y-axis: 0 → height (top to bottom, with 8% padding)

### Container Structure

```html
<!-- Inside tile-content flex column -->
<div class="tile-sparkline">
  <svg class="sparkline-svg"
       viewBox="0 0 {width} {height}"
       preserveAspectRatio="none"
       aria-hidden="true">
    <!-- 60 <rect> bars rendered here -->
  </svg>
</div>
```

### Flex Layout Context

```
tile-content (flex-direction: column)
├── tile-header  { flex-shrink: 0 }     ← fixed height
├── tile-sparkline { flex: 1; min-height: 0 }  ← fills remaining space
└── tile-badge   { flex-shrink: 0; margin-top: auto; align-self: flex-end }
```

---

## Implementation

### CSS

```css
.tile-sparkline {
  flex: 1;
  min-height: 0;
  display: none;
  opacity: 0;
  transition: opacity 300ms ease-out;
  margin: 4px calc(-1 * var(--tile-pad, 16px)) 4px;
}

.tile.show-sparkline .tile-sparkline { display: block; }
.tile.show-sparkline .tile-sparkline.visible { opacity: 1; }

.sparkline-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

### Rendering (SVG creation)

```typescript
const svgNS = 'http://www.w3.org/2000/svg';
const svg = document.createElementNS(svgNS, 'svg');
svg.setAttribute('class', 'sparkline-svg');
svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
svg.setAttribute('preserveAspectRatio', 'none');
svg.setAttribute('aria-hidden', 'true');
```

### Size Measurement

```typescript
// Measure container after show-sparkline class is applied
const rect = sparklineEl.getBoundingClientRect();
if (rect.width > 0 && rect.height > 0) {
  renderSparklineSVG(sparklineEl, candles, rect.width, rect.height);
}
```

---

## Acceptance Criteria

✅ **SVG Rendering:**
- [x] SVG element renders with measured width and height
- [x] ViewBox attribute matches measured dimensions
- [x] `preserveAspectRatio="none"` allows non-uniform scaling
- [x] SVG coordinate system: (0,0) at top-left

✅ **Flex Sizing:**
- [x] Container uses `flex: 1` to fill available space
- [x] `min-height: 0` prevents flex overflow
- [x] Edge-to-edge horizontal via negative margin
- [x] 4px vertical margin provides breathing room

✅ **Visibility Control:**
- [x] Hidden by default (`display: none`)
- [x] Shown via `.show-sparkline` class on parent tile
- [x] Fade-in via `.visible` class and opacity transition
- [x] Cleanup: innerHTML cleared and classes removed on mouseleave

✅ **Accessibility:**
- [x] `aria-hidden="true"` on SVG (decorative chart)
- [x] No interactive elements (not keyboard focusable)

---

## References

- **Bar Rendering:** [Task 02: Candlestick Bar Generation & Styling](./02-path-generation.md)
- **Animation:** [Task 04: Staggered Bar Animation](./04-draw-animation.md)
- **HeatMapTile Usage:** [Section 5 → HeatMapTile → Task 06](../../heatmap-tile/tasks/06-sparkline-integration.md)
