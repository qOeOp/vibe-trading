# Task: Custom Hooks

Complete implementations of useTreeMap, useScrollTop, and useDebouncedValue.

---

## Implementations

### useTreeMap

```typescript
// apps/preview/src/app/hooks/useTreeMap.ts
import { useMemo } from 'react';
import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy';

export interface TileLayout {
  entity: Entity;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useTreeMap(entities: Entity[], width: number, height: number): TileLayout[] {
  return useMemo(() => {
    const S = 1.35; // Virtual height stretch for horizontal bias (≥80% tiles width > height)

    const root = hierarchy({ children: entities })
      .sum(d => Math.pow(Math.abs(d.capitalFlow), 0.8))  // Power scaling x^0.8
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    treemap<Entity>()
      .size([width, height * S])       // Stretch virtual height
      .padding(2)
      .tile(treemapSquarify.ratio(1))  // ratio(1) for squarest tiles
      (root);

    // Scale Y coordinates back to real container height
    return root.leaves().map(node => ({
      entity: node.data,
      x: node.x0,
      y: node.y0 / S,
      width: node.x1 - node.x0,
      height: (node.y1 - node.y0) / S,
    }));
  }, [entities, width, height]);
}
```

### useScrollTop

```typescript
// apps/preview/src/app/hooks/useScrollTop.ts
import { useEffect, useState } from 'react';

export function useScrollTop(ref: React.RefObject<HTMLElement>): number {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => setScrollTop(element.scrollTop);
    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => element.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return scrollTop;
}
```

### useDebouncedValue

```typescript
// apps/preview/src/app/hooks/useDebouncedValue.ts
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## Technical Notes

### Layout Algorithm: Power Scaling + Horizontal Bias

See [Task 07: Adaptive Scaling](../../../5-components/threads/heatmap-tile/tasks/07-adaptive-scaling.md) for the canonical layout algorithm spec. Key parameters:

- **Weight**: `Math.pow(Math.abs(capitalFlow), 0.8)` — balances visual hierarchy vs layout quality
- **Ratio**: `treemapSquarify.ratio(1)` — produces squarest possible tiles
- **Horizontal bias**: Virtual height stretched by S=1.35, Y scaled back → ≥80% tiles width > height
- **Padding**: `padding(2)` — 2px gaps between tiles

---

## Acceptance Criteria

✅ **useTreeMap:**
- [ ] Uses d3-hierarchy `treemapSquarify.ratio(1)` with S=1.35 virtual height stretch
- [ ] Uses power scaling (x^0.8) for visual hierarchy preservation
- [ ] Returns TileLayout[] with positions
- [ ] Memoized for performance
- [ ] 2px padding between tiles
- [ ] ≥80% tiles are horizontal (width > height)

✅ **useScrollTop:**
- [ ] Detects scroll position
- [ ] Passive event listener
- [ ] Cleanup on unmount

✅ **useDebouncedValue:**
- [ ] Debounces value changes
- [ ] Configurable delay
- [ ] Timer cleanup on unmount
