# Task: Staggered Bar Animation

Per-bar fade-in animation with staggered delay, creating a left-to-right reveal effect across the 60 candlestick bars.

---

## Design

### Purpose
Create engaging entrance animation that draws attention to the sparkline while providing smooth visual transition from hidden to visible state.

### Animation Technique

**Staggered Fade-In Method:**

```css
/* Each bar starts invisible */
.sparkline-bar {
  opacity: 0;
  animation: bar-fade-in 60ms ease-out forwards;
}

/* Bars appear left-to-right with 25ms delay between each */
/* Bar 0: delay 0ms, Bar 1: delay 25ms, ... Bar 59: delay 1475ms */
```

**How it works:**
1. All 60 bars start at opacity: 0
2. Each bar has `animation-delay: (index * 25)ms` set via JS
3. CSS `@keyframes bar-fade-in` transitions opacity 0→1 over 60ms
4. Result: bars appear in a wave from left to right

### Animation Parameters

**Duration per bar:** 60ms
**Easing:** `ease-out`
**Delay between bars:** 25ms
**Total reveal time:** ~1.5s (60 bars × 25ms)
**Fill mode:** `forwards` (stays at final opacity)

### Timing Coordination

**Sparkline appearance (tile hover):**
```
0ms:      Tile hover starts, expansion begins (400ms transition)
420ms:    Expansion complete, sparkline container shown
420ms:    Container opacity transition starts (300ms)
420ms:    Bars begin staggered fade-in (25ms × 60 bars)
720ms:    Container fully opaque
~1900ms:  All 60 bars visible
```

---

## Implementation

### JavaScript (animation delay assignment)

```typescript
candles.forEach((c, i) => {
  const rect = document.createElementNS(svgNS, 'rect');
  rect.setAttribute('class', 'sparkline-bar');
  // ... other attributes ...

  // Staggered animation delay
  rect.style.animationDelay = (i * 25) + 'ms';
  svg.appendChild(rect);
});
```

### CSS Keyframes

```css
.sparkline-bar {
  opacity: 0;
  animation: bar-fade-in 60ms ease-out forwards;
}

@keyframes bar-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

### Container Fade-In

```css
.tile-sparkline {
  opacity: 0;
  transition: opacity 300ms ease-out;
}

.tile-sparkline.visible {
  opacity: 1;
}
```

```typescript
// After SVG is appended to container:
requestAnimationFrame(() => container.classList.add('visible'));
```

---

## Acceptance Criteria

✅ **Animation Behavior:**
- [x] Bars fade in from left to right
- [x] 25ms delay between consecutive bars
- [x] Each bar fade duration is 60ms
- [x] Animation completes with all bars at target opacity
- [x] No flickering or jumping during animation

✅ **Timing:**
- [x] Animation starts after tile expansion completes (~420ms)
- [x] Container fade and bar stagger run concurrently
- [x] Total reveal time ~1.5s for all 60 bars
- [x] Smooth visual flow, no jarring transitions

✅ **Visual Quality:**
- [x] Wave effect visible across bar chart
- [x] Individual bar fade is smooth (60fps)
- [x] Final state: up bars at 0.7 opacity, down bars at 0.35 opacity
- [x] No residual animation artifacts

✅ **Performance:**
- [x] CSS animation only (no JS animation loop)
- [x] GPU-accelerated (opacity is compositing-only property)
- [x] 60 concurrent animations handled efficiently
- [x] No forced reflows during animation

---

## References

- **Bar Generation:** [Task 02: Candlestick Bar Generation & Styling](./02-path-generation.md)
- **HeatMapTile Hover:** [Section 5 → HeatMapTile → Task 06](../../heatmap-tile/tasks/06-sparkline-integration.md)

---

## Technical Notes

**Why staggered fade-in instead of stroke-dasharray?**

The original plan used stroke-dasharray draw-line animation for a single SVG `<path>`. With the switch to candlestick bars (60 individual `<rect>` elements), stroke-dasharray is not applicable. Staggered per-element fade-in creates an analogous left-to-right reveal effect that matches the bar chart rendering model.

**Why 25ms delay?**

```
10ms:  Too fast — all bars appear nearly simultaneously, no wave visible
25ms:  Sweet spot — visible wave effect, completes in ~1.5s
50ms:  Too slow — full reveal takes 3s, feels sluggish
```

**Why 60ms per-bar duration?**

```
30ms:  Too snappy — feels like a jump-cut
60ms:  Smooth but quick — each bar pops in naturally
150ms: Too slow — overlapping fades create muddy appearance
```

**animation-delay via JS vs CSS nth-child:**

```css
/* ❌ CSS nth-child: verbose, hard to maintain for 60 bars */
.sparkline-bar:nth-child(1) { animation-delay: 0ms; }
.sparkline-bar:nth-child(2) { animation-delay: 25ms; }
/* ... 58 more rules ... */

/* ✅ JS inline style: dynamic, concise */
rect.style.animationDelay = (i * 25) + 'ms';
```

**Cleanup on mouseleave:**

```typescript
function clearSparkline(container) {
  container.classList.remove('visible');
  container.innerHTML = '';
}
// Called in mouseleave handler — removes all bars and resets opacity
```
