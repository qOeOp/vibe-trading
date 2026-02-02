# Thread: Utils

Utility functions for color calculation, sparkline path generation, and data formatting.

---

## Purpose

Centralize pure functions for reusable calculations and transformations.

## Task: [Utility Functions](./tasks/01-utility-functions.md)

Core utilities:
- **Color:** getTileBackgroundColor (7-stop ramp)
- **Sparkline:** generateSparklinePath, getSparklineEndpoint
- **Format:** formatCapitalFlow, formatChangePercent
- **Content:** getContentScale (adaptive sizing)

---

## Utility Categories

### Color Utils
- `getTileBackgroundColor(changePercent)`: 7-stop solid color ramp

### Sparkline Utils
- `generateSparklinePath(data, width, height)`: SVG path string
- `getSparklineEndpoint(data, width, height)`: Last point coordinates

### Format Utils
- `formatCapitalFlow(value)`: "+125.5亿" format
- `formatChangePercent(value)`: "+2.35%" format

### Tile Utils
- `getContentScale(width, height)`: Icon/font size config

---

## References

All utility implementations detailed in component tasks:
- Color: [Section 5 → HeatMapTile → Task 05](../../../5-components/threads/heatmap-tile/tasks/05-dynamic-color.md)
- Sparkline: [Section 5 → Sparkline → Task 02, 03](../../../5-components/threads/sparkline/index.md)
- Format: [Section 5 → HeatMapTile → Task 04](../../../5-components/threads/heatmap-tile/tasks/04-lower-panel.md)
- Content: [Section 5 → HeatMapTile → Task 07](../../../5-components/threads/heatmap-tile/tasks/07-adaptive-scaling.md)
