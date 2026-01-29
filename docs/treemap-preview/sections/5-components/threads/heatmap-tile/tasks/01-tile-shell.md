# Task: Tile Shell & Positioning

Outermost wrapper for HeatMapTile with absolute positioning and 3D hover lift animation.

---

## Design

### Purpose
Provide absolute positioning context for tiles within Treemap Body, and implement subtle 3D elevation on hover to emphasize interactivity.

### Visual Behavior
- **Default State**: Tile positioned at calculated (x, y) coordinates
- **Hover State**: Tile lifts by 2px (translateY(-2px))
- **Transition**: 300ms ease-out animation

### Positioning Rules
- Position: `absolute` (relative to Treemap Body parent)
- Coordinates: Calculated by useTreeMap hook (Recharts treemap algorithm)
- Z-index: Default 0, hover raises to 10 for lift effect

### Dimensions
- Width/Height: Dynamic, based on entity.marketCap
- Minimum: 150×150px (enforced by treemap algorithm)
- Maximum: No hard limit, but constrained by container width

### Animation Timing
```
Initial → Hover: 300ms ease-out
Hover → Rest: 300ms ease-out
```

---

## Implementation

### Component Structure

```typescript
// apps/preview/src/app/components/HeatMapTile.tsx

'use client';

import { useState } from 'react';
import type { Entity } from '../types/sector';

interface HeatMapTileProps {
  entity: Entity;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute transition-all duration-300 ease-out"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        zIndex: isHovered ? 10 : 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Child layers: Dual backgrounds, panels, etc. (see other tasks) */}
    </div>
  );
}
```

### CSS Classes

```css
/* apps/preview/src/app/globals.css */

.tile-shell {
  /* Handled by inline styles for dynamic positioning */
  /* transition-all duration-300 ease-out applied via Tailwind */
}
```

### Props Interface

```typescript
// apps/preview/src/app/types/sector.ts

export interface TreemapNode {
  entity: Entity;
  x: number;      // Calculated by useTreeMap
  y: number;      // Calculated by useTreeMap
  width: number;  // Calculated by useTreeMap
  height: number; // Calculated by useTreeMap
}
```

---

## Acceptance Criteria

✅ **Positioning:**
- [ ] Tile renders at exact (x, y) coordinates provided by props
- [ ] Tile dimensions match width/height props precisely
- [ ] No visual gaps or overlaps with adjacent tiles (4px gap enforced by layout algorithm)

✅ **Hover Animation:**
- [ ] On mouse enter, tile lifts by exactly 2px (translateY(-2px))
- [ ] On mouse leave, tile returns to original position (translateY(0))
- [ ] Transition duration is 300ms with ease-out easing
- [ ] Z-index increases on hover to appear above adjacent tiles

✅ **Performance:**
- [ ] Animation uses transform (GPU-accelerated), not top/bottom
- [ ] No layout thrashing or reflows during hover
- [ ] Smooth 60fps animation on devices with hardware acceleration

✅ **Accessibility:**
- [ ] Tile is keyboard focusable (add tabIndex={0} if interactive)
- [ ] Hover state also applies on keyboard focus
- [ ] Reduced motion respected: `@media (prefers-reduced-motion: reduce)` disables animation

---

## References

- **Parent Component:** [HeatMap Container](../heatmap-container/index.md)
- **Layout Calculation:** [Section 7: Implementation → Hooks](../../../7-implementation/threads/hooks/index.md)
- **Related Task:** [Task 02: Dual Background Layers](./02-dual-backgrounds.md)
