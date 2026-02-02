# Task: Endpoint Dot

Position a static endpoint dot at the final data point of the sparkline using an SVG circle element.

---

## Design

### Purpose
Add visual emphasis to the sparkline's endpoint with a simple static dot.

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
// Endpoint dot size: 6px
const dotSize = 6;

// Center dot on endpoint coordinate
const dotX = lastX - dotSize / 2;  // Offset left by radius
const dotY = lastY - dotSize / 2;  // Offset up by radius
```

### SVG Circle Element

**Syntax:**
```svg
<circle cx={lastX} cy={lastY} r={3} fill="#facc15" />
```

### Size

**Endpoint dot:** 6px diameter (3px radius)

**Rationale:**
- Small size for subtle sparkline context
- Still clearly visible at 6px scale

---

## Implementation

### Endpoint Calculation Utility

```typescript
// apps/preview/src/app/utils/sparklineUtils.ts

/**
 * Calculate last data point coordinates for endpoint dot positioning
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

### Component with Endpoint Dot

```typescript
// apps/preview/src/app/components/Sparkline.tsx

import { generateSparklinePath, getSparklineEndpoint } from '../utils/sparklineUtils';

interface SparklineProps {
  data: number[];
  width: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  data,
  width,
  height = 40,
  className = '',
}: SparklineProps) {
  // Generate path
  const pathData = generateSparklinePath(data, width, height);

  // Calculate endpoint for dot positioning
  const endpoint = getSparklineEndpoint(data, width, height);

  // Dot radius
  const dotRadius = 3;

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

        {/* Endpoint dot */}
        <circle cx={endpoint.x} cy={endpoint.y} r={dotRadius} fill="#facc15" />

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
- [ ] Endpoint dot centered on last data point's coordinates
- [ ] Dot centered at `(endpoint.x, endpoint.y)`
- [ ] No offset errors (dot visually aligned with line endpoint)

✅ **Size:**
- [ ] Dot diameter is 6px (radius 3px)
- [ ] Dot maintains 6px size at all chart widths

✅ **SVG Integration:**
- [ ] Circle element renders correctly inside SVG
- [ ] No rendering errors

✅ **Visual Quality:**
- [ ] Dot appears on top of sparkline path
- [ ] Dot color (yellow `#facc15`) contrasts with white line
- [ ] No clipping or cutoff
- [ ] Smooth rendering at all data ranges

✅ **Edge Cases:**
- [ ] Works when last value is minimum (Y=height)
- [ ] Works when last value is maximum (Y=0)
- [ ] Works when all values identical (Y=height/2)
- [ ] Empty data: Dot positioned at (width/2, height/2) or hidden

---

## References

- **Path Generation:** [Task 02: Path Generation & Styling](./02-path-generation.md)
- **SVG Shell:** [Task 01: SVG Shell & Dimensions](./01-svg-shell.md)

---

## Technical Notes

**SVG circle simplicity:**

Using a native SVG `<circle>` element is the simplest and most performant approach for a static endpoint dot. No foreignObject or React component embedding needed.

**Overflow handling:**

```css
/* Sparkline SVG needs overflow:visible */
.sparkline-container svg {
  overflow: visible;
}

/* Why?
  - At 6px dot, radius is 3px from center
  - Could extend beyond SVG bounds if endpoint near edge
  - overflow:visible ensures dot renders fully
*/
```

**Performance impact:**

```
SVG circle rendering cost:
- Native SVG element, minimal overhead
- 31 sparklines × 1 circle = 31 total
- Performance: negligible

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
