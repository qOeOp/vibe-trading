# Thread: Animations

Animation specifications for breathing dots, sparkline draw, and state transitions.

---

## Purpose

Define consistent animation timing, easing, and effects across all interactive elements.

## Task: [Animation Specifications](./tasks/01-animation-specs.md)

Complete animation catalog:
- BreathingDot pulse (1-3s based on attention)
- Ripple expansion (synchronized with pulse)
- Sparkline draw-line (400ms stroke-dasharray)
- Loading spinner (1s rotation)
- State transitions (200-300ms ease-out)

---

## Animation Catalog

### BreathingDot
- **Breathing Pulse:** scale(1.0 → 1.2 → 1.0)
- **Duration:** 3000ms - (attentionLevel / 100) × 2000ms
- **Easing:** ease-in-out
- **Iteration:** infinite

### Ripple Rings
- **Expansion:** scale(1 → 2/2.5) + opacity (0.9 → 0)
- **Duration:** Matches breathing pulse
- **Easing:** ease-out
- **Delay:** 200ms (Ring 2)

### Sparkline Draw
- **Method:** stroke-dasharray reveal
- **Duration:** 400ms
- **Easing:** ease-out
- **Fill-mode:** forwards

### Loading Spinner
- **Rotation:** 360deg
- **Duration:** 1s
- **Easing:** linear
- **Iteration:** infinite

---

## References

- **BreathingDot:** [Section 5 → BreathingDot → Task 02, 03](../../../5-components/threads/breathing-dot/index.md)
- **Sparkline:** [Section 5 → Sparkline → Task 04](../../../5-components/threads/sparkline/tasks/04-draw-animation.md)
- **LoadingState:** [Section 5 → LoadingState → Task 02](../../../5-components/threads/loading-state/tasks/02-spinner-animation.md)
