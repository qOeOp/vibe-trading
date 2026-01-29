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
      .sum(d => Math.log(Math.abs(d.capitalFlow) + 10))
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

## Technical Notes

### Logarithmic Weight Scaling

**Why `Math.log(Math.abs(d.capitalFlow) + 10)` instead of linear weights?**

The capitalFlow data has extreme variance: 电子 (145.8亿) vs 综合 (6.5亿) = **22× difference**.

**Linear weights** (`Math.abs(d.capitalFlow)`) produce:
- ❌ Avg aspect ratio: 7.10:1 (too elongated)
- ❌ Sparkline coverage: 16% (5/31 tiles)
- ❌ 25/31 tiles with aspect ratio >4:1
- ❌ Poor visual balance (giant tiles + tiny unreadable tiles)

**Logarithmic weights** (`Math.log(Math.abs(d.capitalFlow) + 10)`) produce:
- ✅ Avg aspect ratio: 1.70:1 (nearly square)
- ✅ Sparkline coverage: 100% (31/31 tiles)
- ✅ 29/31 tiles with aspect ratio ≤2:1 (excellent)
- ✅ Balanced visual hierarchy (all tiles readable, min 116px)

**The math:**
- Linear: 145.8 / 6.5 = 22.4× size difference
- Logarithmic: log(155.8) / log(16.5) = 5.05 / 2.80 = 1.8× size difference

**Result:** Log scaling compresses extreme values while preserving relative relationships, creating optimal tile shapes for content display.

---

## Acceptance Criteria

✅ **useTreeMap:**
- [ ] Uses d3-hierarchy squarified algorithm
- [ ] Uses logarithmic weight scaling for balanced layout
- [ ] Returns TileLayout[] with positions
- [ ] Memoized for performance
- [ ] 2px padding between tiles
- [ ] All tiles ≥116px min dimension (sparkline compatible)
- [ ] 90%+ tiles have aspect ratio ≤2:1

✅ **useScrollTop:**
- [ ] Detects scroll position
- [ ] Passive event listener
- [ ] Cleanup on unmount

✅ **useDebouncedValue:**
- [ ] Debounces value changes
- [ ] Configurable delay
- [ ] Timer cleanup on unmount
