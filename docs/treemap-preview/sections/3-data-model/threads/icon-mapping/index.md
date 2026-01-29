# Thread: Icon Mapping

Complete mapping of all 31 SW Level-1 sector codes to Lucide React icons.

---

## Purpose

Provide visual metaphors for each sector through semantically meaningful icons, enhancing recognizability and user experience.

## Task Breakdown

### [Task 01: Icon Mapping Table](./tasks/01-icon-table.md)
Complete mapping of 31 sector codes to Lucide icon names with rationale.

### [Task 02: Icon Mapping Implementation](./tasks/02-icon-implementation.md)
TypeScript implementation of iconMapping object with tree-shaking support.

---

## Icon Mapping Preview

| Sector Code | Sector Name | Icon | Rationale |
|-------------|-------------|------|-----------|
| 801010 | 农林牧渔 | Wheat | Agriculture primary symbol |
| 801020 | 采掘 | Pickaxe | Mining/extraction tool |
| 801030 | 化工 | Flask | Chemical laboratory |
| 801980 | 电子 | Cpu | Electronic circuits |
| ... | ... | ... | ... |

**Total:** 31 unique Lucide icons

---

## Implementation

```typescript
import { Cpu, Landmark, Droplets, /* ... */ } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const iconMapping: Record<string, LucideIcon> = {
  '801010': Wheat,
  '801020': Pickaxe,
  '801030': Flask,
  '801980': Cpu,
  // ... 31 total
};

// Fallback for unknown codes
export const fallbackIcon = CircuitBoard;
```

---

## References

- **Component Usage:** [Section 5 → HeatMapTile → Task 03](../../../5-components/threads/heatmap-tile/tasks/03-upper-panel.md)
- **Icon Sizing:** [Section 5 → HeatMapTile → Task 07](../../../5-components/threads/heatmap-tile/tasks/07-adaptive-scaling.md)
