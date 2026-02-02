# Task: Sparkline Integration

Conditional mini-candlestick bar chart rendering on hover, positioned in a dedicated flex middle frame between tile header and badge.

---

## Design

### Purpose
Reveal 60-day price trend when user hovers over tile, providing historical context for current price change without cluttering default view.

### Display Conditions

**Show Sparkline when:**
1. Tile is hovered (`mouseenter` event)

**Hide Sparkline when:**
- Mouse leaves tile (`mouseleave` event)
- Sparkline cleared immediately (innerHTML + class removal)

### Tile Layout (Flex Column)

```
┌──────────────────────────────────────┐
│ tile-content (flex-direction: column) │
│ ┌──────────────────────────────────┐ │
│ │ tile-header (flex-shrink: 0)     │ │ ← Icon + Name
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ tile-sparkline (flex: 1)         │ │ ← 60 candlestick bars
│ │ ┃┃ ┃┃┃ ┃┃┃┃ ┃┃ ┃┃┃┃ ┃┃ ┃┃┃    │ │   edge-to-edge horizontally
│ │ ┃┃ ┃┃┃ ┃┃┃┃ ┃┃ ┃┃┃┃ ┃┃ ┃┃┃    │ │   4px margin top/bottom
│ └──────────────────────────────────┘ │
│                          ┌─────────┐ │
│                          │ +2.50%  │ │ ← tile-badge (bottom-right)
│                          └─────────┘ │   margin-top: auto
└──────────────────────────────────────┘
```

### Dimensions
- Width: Edge-to-edge (cancels parent padding via negative margin)
- Height: Fills remaining flex space between header and badge
- Y bounds: 8% padding top/bottom within sparkline frame

### Animation
- Container: opacity 0→1 via `.visible` class (300ms ease-out)
- Bars: staggered fade-in (25ms delay per bar, 60ms duration each)
- Cleanup: immediate on mouseleave (no fade-out animation)

---

## Implementation

### Hover Logic (drawOnce pattern)

```typescript
// Per-tile hover handlers
let sparklineRendered = false;
let sparklineTimer = null;

d3.select(tile).on('mouseenter', function() {
  sparklineRendered = false;

  function drawOnce() {
    if (sparklineRendered) return;
    sparklineRendered = true;

    tileEl.classList.add('show-sparkline');
    const sparklineEl = tileEl.querySelector('.tile-sparkline');
    if (sparklineEl) {
      const rect = sparklineEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        renderSparklineSVG(sparklineEl, d.sparklineData, rect.width, rect.height);
      }
    }
  }

  if (needsExpansion) {
    sparklineTimer = setTimeout(drawOnce, 420); // Wait for expansion
  } else {
    requestAnimationFrame(drawOnce);
  }
});

d3.select(tile).on('mouseleave', function() {
  if (sparklineTimer) { clearTimeout(sparklineTimer); sparklineTimer = null; }
  sparklineRendered = false;

  const sparklineEl = tileEl.querySelector('.tile-sparkline');
  if (sparklineEl) clearSparkline(sparklineEl);
  tileEl.classList.remove('show-sparkline');
});
```

### Key Design Decisions

**drawOnce pattern:** Boolean flag prevents duplicate renders from concurrent timers or event bubbling.

**420ms delay for expanding tiles:** Sparkline renders after tile expansion transition (400ms) completes, so container has correct measured dimensions.

**Sparkline visibility controlled exclusively by hover handlers:** Not by `applyAdaptiveStyles()`. This prevents neighbor tiles from showing sparklines during ripple expansion.

### Data Pre-generation

```typescript
// During tile initialization (not on every hover)
d.sparklineData = generateMockCandles(d.data.changePercent, 60);
```

---

## Acceptance Criteria

✅ **Display Logic:**
- [x] Sparkline appears on hover
- [x] Sparkline hidden by default (not hovered)
- [x] Sparkline clears immediately on mouseleave
- [x] No sparkline appears on neighbor tiles during ripple expansion

✅ **Layout:**
- [x] Sparkline in dedicated flex middle frame
- [x] Edge-to-edge horizontally (cancels parent padding)
- [x] Does not overlap with header or badge
- [x] Badge always at bottom-right via `margin-top: auto; align-self: flex-end`
- [x] 4px breathing room above and below sparkline frame

✅ **Timing:**
- [x] For expanding tiles: sparkline renders after 420ms (post-expansion)
- [x] For already-large tiles: sparkline renders immediately (next frame)
- [x] drawOnce flag prevents duplicate renders
- [x] Timer cleared on mouseleave (no orphan renders)

✅ **Animation:**
- [x] Container fades in (opacity 300ms)
- [x] Bars stagger left-to-right (25ms × 60 bars)
- [x] No redraw loops or animation re-triggers

✅ **Performance:**
- [x] Candle data pre-generated at init (not on hover)
- [x] No sparkline render cost when not hovered
- [x] Single render per hover (drawOnce pattern)
- [x] 60fps animation maintained

---

## References

- **Sparkline Component:** [Section 5 → Components → Sparkline](../../sparkline/index.md)
- **Bar Generation:** [Section 5 → Sparkline → Task 02](../../sparkline/tasks/02-path-generation.md)
- **Lower Panel:** [Task 04: Lower Panel Layout](./04-lower-panel.md)
- **Hover State:** [Task 01: Tile Shell & Positioning](./01-tile-shell.md)
