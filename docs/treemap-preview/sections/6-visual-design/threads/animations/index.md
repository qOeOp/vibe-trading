# Thread: Animations

Animation specifications for sparkline draw, water ripple, and state transitions.

---

## Purpose

Define consistent animation timing, easing, and effects across all interactive elements.

## Task: [Animation Specifications](./tasks/01-animation-specs.md)

Complete animation catalog:
- Sparkline bar reveal (staggered fade-in, 25ms × 60 bars)
- Water ripple expansion (400ms tile repositioning)
- Loading spinner (1s rotation)
- State transitions (200-300ms ease-out)

---

## Animation Catalog

### Sparkline Bar Reveal
- **Method:** Staggered per-bar fade-in (CSS animation-delay)
- **Duration:** 60ms per bar, 25ms delay between bars
- **Total reveal:** ~1.5s for 60 bars
- **Easing:** ease-out
- **Fill-mode:** forwards

### Water Ripple Expansion
- **Method:** CSS transition on position/size
- **Duration:** 400ms
- **Easing:** ease-out
- **Trigger:** Hover on small tiles (minDim < 200px)

### Loading Spinner
- **Rotation:** 360deg
- **Duration:** 1s
- **Easing:** linear
- **Iteration:** infinite

---

## References

- **Sparkline:** [Section 5 → Sparkline → Task 04](../../../5-components/threads/sparkline/tasks/04-draw-animation.md)
- **LoadingState:** [Section 5 → LoadingState → Task 02](../../../5-components/threads/loading-state/tasks/02-spinner-animation.md)
- **Water Ripple:** [Section 5 → HeatMapTile → Task 07](../../../5-components/threads/heatmap-tile/tasks/07-adaptive-scaling.md)
