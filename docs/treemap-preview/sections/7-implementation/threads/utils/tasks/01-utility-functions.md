# Task: Utility Functions

Complete utility function catalog with references to detailed implementations.

---

## Implementation References

All utility functions are fully documented in their respective component tasks:

### Color Utils
- **getTileBackgroundColor:** [HeatMapTile Task 05](../../../../5-components/threads/heatmap-tile/tasks/05-dynamic-color.md)
- **getBreathingDuration:** [BreathingDot Task 02](../../../../5-components/threads/breathing-dot/tasks/02-breathing-animation.md)

### Sparkline Utils
- **generateSparklinePath:** [Sparkline Task 02](../../../../5-components/threads/sparkline/tasks/02-path-generation.md)
- **getSparklineEndpoint:** [Sparkline Task 03](../../../../5-components/threads/sparkline/tasks/03-endpoint-dot.md)

### Format Utils
- **formatCapitalFlow:** [HeatMapTile Task 04](../../../../5-components/threads/heatmap-tile/tasks/04-lower-panel.md)
- **formatChangePercent:** [HeatMapTile Task 04](../../../../5-components/threads/heatmap-tile/tasks/04-lower-panel.md)

### Tile Utils
- **getContentScale:** [HeatMapTile Task 07](../../../../5-components/threads/heatmap-tile/tasks/07-adaptive-scaling.md)

---

## File Organization

```
apps/preview/src/app/utils/
├── colorUtils.ts       # getTileBackgroundColor, getBreathingDuration
├── sparklineUtils.ts   # generateSparklinePath, getSparklineEndpoint
├── formatUtils.ts      # formatCapitalFlow, formatChangePercent
└── tileUtils.ts        # getContentScale
```

---

## Acceptance Criteria

✅ **Organization:**
- [ ] Utils organized by category
- [ ] Pure functions (no side effects)
- [ ] TypeScript types complete
- [ ] All functions tested
