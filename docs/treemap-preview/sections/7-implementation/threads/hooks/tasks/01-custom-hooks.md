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
    const root = hierarchy({ children: entities })
      .sum(d => Math.abs(d.capitalFlow || 1))
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = treemap<Entity>()
      .size([width, height])
      .padding(2)
      .tile(treemapSquarify);

    treemapLayout(root);

    return root.leaves().map(node => ({
      entity: node.data,
      x: node.x0,
      y: node.y0,
      width: node.x1 - node.x0,
      height: node.y1 - node.y0,
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

## Acceptance Criteria

✅ **useTreeMap:**
- [ ] Uses d3-hierarchy squarified algorithm
- [ ] Returns TileLayout[] with positions
- [ ] Memoized for performance
- [ ] 2px padding between tiles

✅ **useScrollTop:**
- [ ] Detects scroll position
- [ ] Passive event listener
- [ ] Cleanup on unmount

✅ **useDebouncedValue:**
- [ ] Debounces value changes
- [ ] Configurable delay
- [ ] Timer cleanup on unmount
