# Task: Draw-Line Animation

Stroke-dasharray reveal animation that "draws" the sparkline path from left to right when component appears on hover.

---

## Design

### Purpose
Create engaging entrance animation that draws attention to the sparkline while providing smooth visual transition from hidden to visible state.

### Animation Technique

**Stroke Dasharray Method:**

```css
/* Initial state: Entire path is gap (invisible) */
stroke-dasharray: pathLength pathLength;
stroke-dashoffset: pathLength;

/* Final state: Entire path is solid (fully visible) */
stroke-dashoffset: 0;
```

**How it works:**
1. Set dash pattern to full path length (one dash = entire line)
2. Offset by path length (pushes dash completely out of view)
3. Animate offset to 0 (reveals dash from start to end)

### Animation Parameters

**Duration:** 400ms
**Easing:** `ease-out` (fast start, slow end)
**Delay:** 0ms (starts immediately on mount)
**Fill mode:** `forwards` (stays at final state)

### Timing Coordination

**Sparkline appearance (HeatMapTile hover):**
```
0ms:    Tile hover starts
0ms:    Sparkline container fades in (opacity: 0 → 1, 300ms)
0ms:    Path draw animation starts (stroke-dashoffset, 400ms)
300ms:  Container fade complete
400ms:  Path draw complete
```

Both animations run concurrently for fluid transition.

---

## Implementation

### Path Length Calculation

```typescript
// apps/preview/src/app/components/Sparkline.tsx

import { useEffect, useRef } from 'react';

export function Sparkline({
  data,
  width,
  height = 40,
  attentionLevel,
  className = '',
}: SparklineProps) {
  const pathRef = useRef<SVGPathElement>(null);

  // Calculate path length on mount for animation
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();

      // Set initial state (hidden)
      pathRef.current.style.strokeDasharray = `${length} ${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;

      // Trigger animation on next frame
      requestAnimationFrame(() => {
        if (pathRef.current) {
          pathRef.current.style.transition = 'stroke-dashoffset 400ms ease-out';
          pathRef.current.style.strokeDashoffset = '0';
        }
      });
    }
  }, [data, width, height]);

  // ... rest of component
}
```

### Alternative: CSS Animation

```typescript
// apps/preview/src/app/components/Sparkline.tsx

export function Sparkline({ /* props */ }: SparklineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // Measure path length on mount
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [data, width, height]);

  const pathData = generateSparklinePath(data, width, height);
  const endpoint = getSparklineEndpoint(data, width, height);

  const dotSize = 6;
  const dotX = endpoint.x - dotSize / 2;
  const dotY = endpoint.y - dotSize / 2;

  return (
    <div className={`sparkline-container ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Animated sparkline path */}
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: pathLength ? `${pathLength} ${pathLength}` : 'none',
            strokeDashoffset: pathLength || 0,
            animation: pathLength ? 'draw-sparkline 400ms ease-out forwards' : 'none',
          }}
        />

        {/* BreathingDot at endpoint */}
        <foreignObject x={dotX} y={dotY} width={dotSize} height={dotSize}>
          <BreathingDot attentionLevel={attentionLevel} size={dotSize} />
        </foreignObject>
      </svg>
    </div>
  );
}
```

### CSS Keyframes

```css
/* apps/preview/src/app/styles.css */

@keyframes draw-sparkline {
  from {
    stroke-dashoffset: var(--path-length);
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Sparkline container fade-in (from HeatMapTile Task 06) */
.sparkline-container {
  animation: fade-in-sparkline 300ms ease-out forwards;
}

@keyframes fade-in-sparkline {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### Complete Component

```typescript
// apps/preview/src/app/components/Sparkline.tsx

import { useEffect, useRef, useState } from 'react';
import { generateSparklinePath, getSparklineEndpoint } from '../utils/sparklineUtils';
import { BreathingDot } from './BreathingDot';

interface SparklineProps {
  data: number[];
  width: number;
  height?: number;
  attentionLevel: number;
  className?: string;
}

export function Sparkline({
  data,
  width,
  height = 40,
  attentionLevel,
  className = '',
}: SparklineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // Measure path length for animation
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [data, width, height]);

  const pathData = generateSparklinePath(data, width, height);
  const endpoint = getSparklineEndpoint(data, width, height);

  const dotSize = 6;
  const dotX = endpoint.x - dotSize / 2;
  const dotY = endpoint.y - dotSize / 2;

  return (
    <div className={`sparkline-container ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Animated sparkline path */}
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="sparkline-path"
          style={{
            strokeDasharray: pathLength ? `${pathLength} ${pathLength}` : 'none',
            strokeDashoffset: pathLength || 0,
          }}
        />

        {/* BreathingDot at endpoint */}
        <foreignObject x={dotX} y={dotY} width={dotSize} height={dotSize}>
          <BreathingDot attentionLevel={attentionLevel} size={dotSize} />
        </foreignObject>
      </svg>
    </div>
  );
}
```

```css
/* apps/preview/src/app/styles.css */

.sparkline-container {
  position: relative;
  display: block;
  width: 100%;
  height: 40px;
  animation: fade-in-sparkline 300ms ease-out forwards;
}

.sparkline-path {
  animation: draw-sparkline 400ms ease-out forwards;
}

@keyframes draw-sparkline {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fade-in-sparkline {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

## Acceptance Criteria

✅ **Animation Behavior:**
- [ ] Path draws from left to right
- [ ] Animation duration is 400ms
- [ ] Easing is ease-out (fast start, slow end)
- [ ] Animation completes at fully visible state
- [ ] No flickering or jumping during animation

✅ **Path Length Calculation:**
- [ ] `getTotalLength()` called on mount
- [ ] Path length stored in state or ref
- [ ] `stroke-dasharray` set to `pathLength pathLength`
- [ ] Initial `stroke-dashoffset` equals `pathLength`
- [ ] Final `stroke-dashoffset` is 0

✅ **Timing Coordination:**
- [ ] Animation starts immediately when sparkline appears
- [ ] Runs concurrently with container fade-in (300ms)
- [ ] Both animations complete smoothly
- [ ] No jarring transitions or delays

✅ **Visual Quality:**
- [ ] Draw animation appears smooth (60fps)
- [ ] Line stroke remains consistent during animation
- [ ] No gaps or disconnections while drawing
- [ ] BreathingDot appears at endpoint (does not animate in)

✅ **Performance:**
- [ ] `getTotalLength()` called only once per render
- [ ] No forced reflows during animation
- [ ] GPU-accelerated animation (transform-based)
- [ ] Multiple sparklines animate independently

✅ **Edge Cases:**
- [ ] Works with short paths (small data range)
- [ ] Works with long paths (large data range)
- [ ] Animation skipped if pathLength is 0 or NaN
- [ ] Re-animates correctly if data changes

---

## References

- **Path Generation:** [Task 02: Path Generation & Styling](./02-path-generation.md)
- **Endpoint Dot:** [Task 03: Endpoint BreathingDot Integration](./03-endpoint-dot.md)
- **HeatMapTile Hover:** [Section 5 → HeatMapTile → Task 06](../../heatmap-tile/tasks/06-sparkline-integration.md)

---

## Technical Notes

**Why stroke-dasharray instead of clip-path?**

```css
/* ❌ clip-path approach */
@keyframes draw-clip {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}
/* Problems:
  - Less browser support
  - Can't animate stroke properties
  - Harder to control timing
*/

/* ✅ stroke-dasharray approach */
@keyframes draw-dash {
  to { stroke-dashoffset: 0; }
}
/* Benefits:
  - Perfect browser support
  - Smooth animation
  - Standard SVG technique
  - Works with any path shape
*/
```

**getTotalLength() explanation:**

```typescript
// SVG path element has built-in method to calculate arc length
const path = document.querySelector('path');
const length = path.getTotalLength();  // Returns total pixel length

// For sparkline with 30 points across 200px:
// Approximate length: 200-250px (depending on vertical variation)
```

**Why ease-out instead of linear?**

```
Linear:     ═══════════════════════  (constant speed)
Ease-out:   ═══════════╗            (fast start, slow end)
            ↑          ╚═══════     (emphasizes completion)

Ease-out creates more natural "drawing" feeling
Matches human hand-drawing behavior
Final slowdown emphasizes line completion
```

**Animation fill-mode:**

```css
animation: draw-sparkline 400ms ease-out forwards;
                                        ↑
                              Stays at final state

/* Without forwards:
  - Animation resets to initial state after completion
  - Path would disappear (stroke-dashoffset back to pathLength)
*/

/* With forwards:
  - Path stays fully visible (stroke-dashoffset: 0)
  - Preserves completed animation state
*/
```

**Coordination with container fade:**

```css
/* Container fades in over 300ms */
.sparkline-container {
  animation: fade-in-sparkline 300ms ease-out forwards;
}

/* Path draws over 400ms */
.sparkline-path {
  animation: draw-sparkline 400ms ease-out forwards;
}

/* Timeline:
  0ms:   Both start
  300ms: Container fully visible, path still drawing
  400ms: Path fully drawn

  Result: Path becomes visible as it draws (optimal)
*/
```

**Why requestAnimationFrame in JS approach?**

```typescript
// Set initial state
pathRef.current.style.strokeDashoffset = `${length}`;

// ❌ Immediate transition (won't animate)
pathRef.current.style.strokeDashoffset = '0';

// ✅ Defer to next frame (triggers transition)
requestAnimationFrame(() => {
  pathRef.current.style.strokeDashoffset = '0';
});

// Browser needs one frame to recognize initial state
// before applying transition to final state
```

**Performance optimization:**

```typescript
// ❌ Expensive: Re-measure on every render
useEffect(() => {
  const length = pathRef.current?.getTotalLength();
}, []);  // No dependencies, runs every render

// ✅ Efficient: Only re-measure when path changes
useEffect(() => {
  const length = pathRef.current?.getTotalLength();
}, [data, width, height]);  // Dependencies ensure only when path updates
```

**Alternative: CSS custom property:**

```tsx
// Set path length as CSS variable
<path
  ref={pathRef}
  d={pathData}
  style={{ '--path-length': pathLength } as React.CSSProperties}
/>
```

```css
@keyframes draw-sparkline {
  from {
    stroke-dashoffset: var(--path-length);
  }
  to {
    stroke-dashoffset: 0;
  }
}
```

**Testing animation:**

```typescript
import { render, screen } from '@testing-library/react';
import { Sparkline } from './Sparkline';

describe('Sparkline animation', () => {
  test('sets stroke-dasharray on mount', () => {
    const { container } = render(
      <Sparkline data={[100, 110]} width={200} height={40} attentionLevel={50} />
    );

    const path = container.querySelector('path');
    expect(path).toHaveStyle({ strokeDasharray: expect.stringMatching(/\d+/) });
  });

  test('animates stroke-dashoffset to 0', async () => {
    const { container } = render(
      <Sparkline data={[100, 110]} width={200} height={40} attentionLevel={50} />
    );

    const path = container.querySelector('path');

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    const computedStyle = window.getComputedStyle(path!);
    expect(parseFloat(computedStyle.strokeDashoffset)).toBe(0);
  });
});
```

**Browser compatibility:**

```
getTotalLength():
  ✅ Chrome, Firefox, Safari, Edge (all versions)
  ✅ Mobile browsers (iOS Safari, Chrome Android)

stroke-dasharray animation:
  ✅ CSS transitions/animations fully supported
  ✅ SVG 1.1 standard (universal support)
```
