# Task: Animation Specifications

Comprehensive animation timing and easing catalog.

---

## Animation Details

All animations detailed in component-specific tasks:

- **BreathingDot:** [Section 5 → BreathingDot → Tasks 02, 03](../../../../5-components/threads/breathing-dot/index.md)
- **Sparkline Draw:** [Section 5 → Sparkline → Task 04](../../../../5-components/threads/sparkline/tasks/04-draw-animation.md)
- **Tile Hover:** [Section 5 → HeatMapTile → Task 01](../../../../5-components/threads/heatmap-tile/tasks/01-tile-shell.md)
- **Loading Spinner:** [Section 5 → LoadingState → Task 02](../../../../5-components/threads/loading-state/tasks/02-spinner-animation.md)

---

## Global Timing Standards

**Fast (100-150ms):** Button states, focus rings  
**Standard (200-300ms):** Hover effects, content reveal  
**Slow (400ms+):** Entrance animations, draw effects

**Easing:**
- `ease-out`: Most transitions (fast start, slow end)
- `ease-in-out`: Continuous loops (breathing, spinning)
- `linear`: Constant motion (rotation, steady progress)

---

## Acceptance Criteria

✅ **Consistency:**
- [ ] All animations use defined timing values
- [ ] Easing functions match interaction type
- [ ] GPU-accelerated properties used (transform, opacity)
- [ ] 60fps target maintained
