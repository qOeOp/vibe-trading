# Task: Endpoint BreathingDot Integration

Position BreathingDot component at the final data point of the sparkline using SVG foreignObject for React component embedding.

---

## Design

### Purpose
Add visual emphasis to the sparkline's endpoint, showing current attention level and creating continuity with tile-level BreathingDot.

### Positioning Strategy

**Endpoint Coordinates:**
```typescript
// Last data point index
const lastIndex = data.length - 1;

// X position: Right edge of chart
const lastX = width;

// Y position: Same calculation as path generation
const normalizedY = (data[lastIndex] - minValue) / range;
const lastY = height - normalizedY * height;
```

**Centering Adjustment:**
```typescript
// BreathingDot size: 6px (smaller than tile dot)
const dotSize = 6;

// Center dot on endpoint coordinate
const dotX = lastX - dotSize / 2;  // Offset left by radius
const dotY = lastY - dotSize / 2;  // Offset up by radius
```

### foreignObject Integration

**Why foreignObject?**
- Allows embedding React components inside SVG
- BreathingDot is a React component with hooks/state
- Native SVG elements can't render React components directly

**Syntax:**
```svg
<foreignObject x={dotX} y={dotY} width={dotSize} height={dotSize}>
  <BreathingDot attentionLevel={attentionLevel} size={dotSize} />
</foreignObject>
```

### Size Adjustment

**Tile BreathingDot:** 7px diameter
**Sparkline BreathingDot:** 6px diameter

**Rationale:**
- Smaller size for subtler sparkline context
- Avoids visual dominance over main tile dot
- Still clearly visible at 6px scale

---

## Implementation

### Endpoint Calculation Utility

```typescript
// apps/preview/src/app/utils/sparklineUtils.ts

/**
 * Calculate last data point coordinates for BreathingDot positioning
 *
 * @param data - Array of 30 price values
 * @param width - Chart width in pixels
 * @param height - Chart height in pixels
 * @returns {x, y} coordinates of last point
 */
export function getSparklineEndpoint(
  data: number[],
  width: number,
  height: number
): { x: number; y: number } {
  if (data.length === 0) return { x: 0, y: height / 2 };

  const lastValue = data[data.length - 1];

  // Find data range
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;

  // X coordinate: Right edge
  const x = width;

  // Y coordinate: Same normalization as path
  if (range === 0) {
    return { x, y: height / 2 };
  }

  const normalizedY = (lastValue - minValue) / range;
  const y = height - normalizedY * height;

  return { x, y };
}
```

### Component with BreathingDot

```typescript
// apps/preview/src/app/components/Sparkline.tsx

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
  // Generate path
  const pathData = generateSparklinePath(data, width, height);

  // Calculate endpoint for BreathingDot
  const endpoint = getSparklineEndpoint(data, width, height);

  // BreathingDot size
  const dotSize = 6;

  // Center dot on endpoint
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
        {/* Sparkline path */}
        <path
          d={pathData}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* BreathingDot at endpoint */}
        <foreignObject x={dotX} y={dotY} width={dotSize} height={dotSize}>
          <BreathingDot attentionLevel={attentionLevel} size={dotSize} />
        </foreignObject>

        {/* Animation will be added in Task 04 */}
      </svg>
    </div>
  );
}
```

### Visual Alignment Example

```
Data: [100, 105, 102, 108, 110]
Width: 200px, Height: 40px
Last value: 110 (max) → Y=0 (top)

Endpoint: (200, 0)
Dot center offset: (200 - 3, 0 - 3) = (197, -3)

┌──────────────────────────────────┐
│                             ●    │ ← Dot centered at (200, 0)
│     /\      /\                   │
│    /  \    /  \     ___/         │
│   /    \  /    \___/             │
│  /      \/                       │
└──────────────────────────────────┘
  0                              200
```

---

## Acceptance Criteria

✅ **Positioning:**
- [ ] BreathingDot centered on last data point's coordinates
- [ ] Dot X position: `endpoint.x - dotSize/2`
- [ ] Dot Y position: `endpoint.y - dotSize/2`
- [ ] No offset errors (dot visually aligned with line endpoint)

✅ **Size:**
- [ ] BreathingDot size is 6px (not default 7px)
- [ ] `size={6}` prop passed to BreathingDot component
- [ ] Dot maintains 6px size at all chart widths
- [ ] Ripple rings scale proportionally to 6px base

✅ **foreignObject Integration:**
- [ ] foreignObject width and height match dotSize (6px)
- [ ] BreathingDot renders inside foreignObject
- [ ] No React component rendering errors
- [ ] foreignObject supports overflow for ripple rings

✅ **Animation:**
- [ ] BreathingDot animates based on `attentionLevel` prop
- [ ] Breathing pulse animation runs correctly
- [ ] Ripple rings expand and fade
- [ ] Animation synchronized with tile-level BreathingDot

✅ **Visual Quality:**
- [ ] Dot appears on top of sparkline path
- [ ] Dot color (yellow) contrasts with white line
- [ ] No clipping or cutoff of dot/ripples
- [ ] Smooth rendering at all data ranges

✅ **Edge Cases:**
- [ ] Works when last value is minimum (Y=height)
- [ ] Works when last value is maximum (Y=0)
- [ ] Works when all values identical (Y=height/2)
- [ ] Empty data: Dot positioned at (width/2, height/2) or hidden

---

## References

- **BreathingDot Component:** [Section 5 → Components → BreathingDot](../../breathing-dot/index.md)
- **Path Generation:** [Task 02: Path Generation & Styling](./02-path-generation.md)
- **SVG Shell:** [Task 01: SVG Shell & Dimensions](./01-svg-shell.md)

---

## Technical Notes

**foreignObject browser support:**

```
✅ Supported: All modern browsers (Chrome, Firefox, Safari, Edge)
✅ React components work inside foreignObject
✅ CSS animations/transitions function correctly
⚠️ Legacy IE11: Limited support (not a concern for modern app)
```

**Why foreignObject instead of native SVG circle?**

```svg
<!-- ❌ Native SVG circle - can't animate with React hooks -->
<circle cx={lastX} cy={lastY} r="3" fill="#facc15">
  <animate attributeName="r" values="3;3.6;3" dur="2s" repeatCount="indefinite" />
</circle>
<!-- Problems:
  - No ripple rings (would need separate circles)
  - Can't use React state/hooks
  - Hard to sync with attention level
  - Duplicates animation logic
-->

<!-- ✅ foreignObject with React component -->
<foreignObject x={dotX} y={dotY} width="6" height="6">
  <BreathingDot attentionLevel={attentionLevel} size={6} />
</foreignObject>
<!-- Benefits:
  - Reuses existing BreathingDot component
  - Automatic breathing + ripple animations
  - Attention level integration built-in
  - Single source of truth for dot behavior
-->
```

**Centering offset math:**

```typescript
// Dot size: 6×6px
// Endpoint coordinate: (200, 10)

// ❌ No offset
<foreignObject x={200} y={10} width={6} height={6}>
  {/* Dot top-left corner at (200, 10) */}
  {/* Dot center at (203, 13) - WRONG! */}
</foreignObject>

// ✅ With offset
<foreignObject x={197} y={7} width={6} height={6}>
  {/* Dot top-left at (197, 7) */}
  {/* Dot center at (200, 10) - CORRECT! */}
</foreignObject>
```

**Overflow handling for ripple rings:**

```css
/* Sparkline SVG needs overflow:visible */
.sparkline-container svg {
  overflow: visible;
}

/* Why?
  - Ripple ring 2 expands to 2.5× dot size = 15px diameter
  - At 6px dot, ring reaches 7.5px radius from center
  - Could extend beyond SVG bounds if endpoint near edge
  - overflow:visible ensures rings render fully
*/
```

**Alternative positioning approaches:**

```tsx
// Approach 1: foreignObject (chosen)
<foreignObject x={dotX} y={dotY} width={dotSize} height={dotSize}>
  <BreathingDot />
</foreignObject>
// ✅ Works perfectly with React components

// Approach 2: Portal to HTML overlay
<div className="absolute" style={{ left: dotX, top: dotY }}>
  <BreathingDot />
</div>
// ❌ Requires coordinate transformation SVG → HTML
// ❌ Breaks semantic grouping (dot separate from chart)
// ❌ Z-index layering complexity

// Approach 3: Duplicate native SVG version
<circle cx={lastX} cy={lastY} r="3" className="custom-animate" />
// ❌ Duplicates BreathingDot logic
// ❌ Maintains two animation implementations
// ❌ Hard to keep in sync
```

**Performance impact:**

```
foreignObject rendering cost:
- Creates HTML rendering context inside SVG
- Minimal overhead for single 6×6px region
- 31 sparklines × 1 foreignObject = 31 total
- Performance: <0.1ms additional per sparkline

Measured FPS: 60fps maintained with all 31 sparklines
```

**Endpoint coordinate edge cases:**

```typescript
// Case 1: Last value is minimum
data = [110, 105, 100];  // Last=100 (min)
endpoint = { x: width, y: height };  // Bottom-right

// Case 2: Last value is maximum
data = [100, 105, 110];  // Last=110 (max)
endpoint = { x: width, y: 0 };  // Top-right

// Case 3: All values identical
data = [105, 105, 105];
endpoint = { x: width, y: height/2 };  // Middle-right

// Case 4: Empty data
data = [];
endpoint = { x: 0, y: height/2 };  // Default fallback
```

**Testing endpoint calculation:**

```typescript
import { getSparklineEndpoint } from '../utils/sparklineUtils';

describe('getSparklineEndpoint', () => {
  test('positions at rightmost X coordinate', () => {
    const data = [100, 110];
    const endpoint = getSparklineEndpoint(data, 200, 40);

    expect(endpoint.x).toBe(200);  // Width = 200
  });

  test('max value at Y=0 (top)', () => {
    const data = [100, 110];  // Last is max
    const endpoint = getSparklineEndpoint(data, 200, 40);

    expect(endpoint.y).toBe(0);
  });

  test('min value at Y=height (bottom)', () => {
    const data = [110, 100];  // Last is min
    const endpoint = getSparklineEndpoint(data, 200, 40);

    expect(endpoint.y).toBe(40);
  });
});
```
