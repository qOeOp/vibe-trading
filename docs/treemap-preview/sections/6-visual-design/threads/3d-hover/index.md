# Thread: 3D Hover

Tile elevation and interactive reveal effects on hover.

---

## Purpose

Create depth perception through subtle Y-axis translation and conditional content reveal.

## Task: [3D Hover Effects](./tasks/01-hover-effects.md)

Complete hover interaction specifications:
- Tile lift (-2px translateY)
- Z-index elevation (0 → 10)
- Sparkline conditional reveal
- Smooth transitions

---

## Hover Behavior

See [Task 01: Tile Shell](../../../5-components/threads/heatmap-tile/tasks/01-tile-shell.md) for canonical transition timing.

**Default State:**
- Position: Normal (translateY: 0)
- Z-index: 0
- Sparkline: Hidden

**Hover State:**
- Position: Lifted (translateY: -2px)
- Z-index: 10 (above other tiles)
- Sparkline: Visible (if tile > 120×80px)
- Water ripple expansion for small tiles

---

## References

- **Tile Hover:** [Section 5 → HeatMapTile → Task 01](../../../5-components/threads/heatmap-tile/tasks/01-tile-shell.md)
- **Sparkline Reveal:** [Section 5 → HeatMapTile → Task 06](../../../5-components/threads/heatmap-tile/tasks/06-sparkline-integration.md)
