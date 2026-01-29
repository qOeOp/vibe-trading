# Task: Path Generation & Styling

Convert 30 price data points into an SVG path element with proper scaling, white stroke styling, and smooth line rendering.

---

## Design

### Purpose
Transform array of price values into visual line chart by mapping data coordinates to SVG path commands with Y-axis normalization.

### Path Algorithm

**Step 1: Find data range**
```typescript
const minValue = Math.min(...data);
const maxValue = Math.max(...data);
const range = maxValue - minValue;
```

**Step 2: Calculate positions**
```typescript
// X: Evenly spaced across width
const xStep = width / (data.length - 1);

// Y: Normalized to 0-height, inverted (SVG Y grows downward)
const yScale = height / range;
const yPosition = height - ((value - minValue) * yScale);
```

**Step 3: Generate path string**
```typescript
// Start: Move to first point
let path = `M 0 ${y0}`;

// Lines: Draw to each subsequent point
for (let i = 1; i < data.length; i++) {
  path += ` L ${x[i]} ${y[i]}`;
}
```

### Path Styling

**Stroke:**
- Color: White `#ffffff`
- Opacity: 60% (`stroke-opacity="0.6"`)
- Width: 1.5px (`stroke-width="1.5"`)
- Cap: Round (`stroke-linecap="round"`)
- Join: Round (`stroke-linejoin="round"`)

**Fill:**
- None (`fill="none"`)
- No area fill under line
- Pure line chart (not area chart)

### Visual Example

```
Data: [100, 105, 102, 108, 110]
Width: 200px, Height: 40px

Min: 100, Max: 110, Range: 10

Points:
(0, 40)      → Value 100 (minimum, bottom)
(50, 20)     → Value 105 (middle)
(100, 28)    → Value 102 (below middle)
(150, 8)     → Value 108 (near top)
(200, 0)     → Value 110 (maximum, top)

Path: "M 0 40 L 50 20 L 100 28 L 150 8 L 200 0"
```

---

## Implementation

### Path Generation Utility

```typescript
// apps/preview/src/app/utils/sparklineUtils.ts

/**
 * Generate SVG path string from price data points
 *
 * @param data - Array of 30 price values
 * @param width - Chart width in pixels
 * @param height - Chart height in pixels (default: 40)
 * @returns SVG path d attribute string
 *
 * @example
 * const path = generateSparklinePath([100, 105, 102], 200, 40);
 * // "M 0 40 L 100 20 L 200 40"
 */
export function generateSparklinePath(
  data: number[],
  width: number,
  height: number
): string {
  if (data.length === 0) return '';
  if (data.length === 1) return `M 0 ${height / 2}`;

  // Find data range for Y-axis scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;

  // Handle edge case: all values identical
  if (range === 0) {
    const y = height / 2;
    const xStep = width / (data.length - 1);
    return data
      .map((_, i) => (i === 0 ? `M 0 ${y}` : `L ${i * xStep} ${y}`))
      .join(' ');
  }

  // Calculate X step (evenly distributed)
  const xStep = width / (data.length - 1);

  // Generate path commands
  const pathCommands = data.map((value, index) => {
    const x = index * xStep;

    // Y-axis: normalized and inverted (SVG Y grows downward)
    const normalizedY = (value - minValue) / range;
    const y = height - normalizedY * height;

    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  });

  return pathCommands.join(' ');
}
```

### Component Integration

```typescript
// apps/preview/src/app/components/Sparkline.tsx

import { generateSparklinePath } from '../utils/sparklineUtils';

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
  // Generate SVG path from data
  const pathData = generateSparklinePath(data, width, height);

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

        {/* BreathingDot will be added in Task 03 */}
        {/* Animation will be added in Task 04 */}
      </svg>
    </div>
  );
}
```

### Usage Example

```typescript
// In HeatMapTile lower panel
const mockSparklineData = [
  100.5, 102.3, 101.8, 103.2, 105.1,
  104.7, 106.2, 108.5, 107.9, 109.3,
  110.2, 108.8, 111.5, 113.2, 112.7,
  114.5, 116.8, 115.3, 117.2, 118.9,
  117.5, 119.3, 121.0, 120.5, 122.3,
  124.1, 123.5, 125.8, 127.2, 126.5,
];

<Sparkline
  data={mockSparklineData}
  width={width - 16}
  height={40}
  attentionLevel={entity.attentionLevel}
/>
```

---

## Acceptance Criteria

✅ **Path Generation:**
- [ ] 30 data points map to exactly 30 path coordinates
- [ ] First point starts at X=0
- [ ] Last point ends at X=width
- [ ] Points evenly distributed across X-axis
- [ ] Y-axis normalized to 0-height range

✅ **Y-Axis Scaling:**
- [ ] Minimum value maps to Y=height (bottom)
- [ ] Maximum value maps to Y=0 (top)
- [ ] Intermediate values interpolate linearly
- [ ] Handles negative values correctly (if present)
- [ ] All values identical: renders horizontal line at mid-height

✅ **Path Commands:**
- [ ] Starts with `M` (move) command
- [ ] All subsequent points use `L` (line-to) commands
- [ ] No unnecessary commands or whitespace
- [ ] Path string is valid SVG syntax

✅ **Stroke Styling:**
- [ ] Stroke color is white (#ffffff)
- [ ] Stroke opacity is 60% (0.6)
- [ ] Stroke width is 1.5px
- [ ] Line caps are round (smooth endpoints)
- [ ] Line joins are round (smooth corners)
- [ ] `vectorEffect="non-scaling-stroke"` maintains 1.5px width at all scales

✅ **Visual Quality:**
- [ ] Line is smooth and anti-aliased
- [ ] No jagged edges or pixelation
- [ ] Visible against all background colors (red, green, gray)
- [ ] Blends with glassmorphism aesthetic
- [ ] No gaps or disconnections in line

✅ **Edge Cases:**
- [ ] Empty data array: Returns empty string or doesn't crash
- [ ] Single value: Renders single point (horizontal line)
- [ ] All values identical: Renders horizontal line at mid-height
- [ ] Large value range (1-1000): Scales correctly
- [ ] Small value range (100-100.5): Visible variation

---

## References

- **SVG Shell:** [Task 01: SVG Shell & Dimensions](./01-svg-shell.md)
- **BreathingDot Integration:** [Task 03: Endpoint BreathingDot Integration](./03-endpoint-dot.md)
- **HeatMapTile Usage:** [Section 5 → HeatMapTile → Task 06](../../heatmap-tile/tasks/06-sparkline-integration.md)

---

## Technical Notes

**Y-axis inversion explained:**

```typescript
// SVG coordinate system: Y=0 at top, Y=height at bottom
// Data: Higher values should appear higher (top)

// ❌ Without inversion
const y = (value - minValue) / range * height;
// Problem: Maximum value → Y=height (bottom) 🔻

// ✅ With inversion
const y = height - (value - minValue) / range * height;
// Correct: Maximum value → Y=0 (top) 🔺
```

**vectorEffect="non-scaling-stroke" importance:**

```svg
<!-- ❌ Without vectorEffect -->
<svg viewBox="0 0 200 40" width="100" height="40">
  <path stroke-width="1.5" />
  <!-- Stroke scales to 0.75px (too thin) -->
</svg>

<!-- ✅ With vectorEffect -->
<svg viewBox="0 0 200 40" width="100" height="40">
  <path stroke-width="1.5" vector-effect="non-scaling-stroke" />
  <!-- Stroke stays 1.5px regardless of viewBox scaling -->
</svg>
```

**Why 1.5px stroke width?**

```
1px: Too thin, barely visible on glassmorphism
2px: Too thick, dominates small sparkline
1.5px: Perfect balance - visible but subtle

At 60% opacity:
- Effective opacity: 0.6 × 255 = 153 (semi-transparent white)
- Blends nicely with colored tile backgrounds
- Readable but not overpowering
```

**Round caps vs butt caps:**

```svg
<!-- stroke-linecap="butt" (default) -->
<path d="M 0 20 L 10 20" />
<!-- Sharp endpoints, can look truncated -->

<!-- stroke-linecap="round" -->
<path d="M 0 20 L 10 20" />
<!-- Smooth rounded endpoints, more polished -->
```

**Round joins for smooth curves:**

```svg
<!-- stroke-linejoin="miter" (sharp corners) -->
<path d="M 0 40 L 50 20 L 100 30" />
<!-- Pointy angles at direction changes -->

<!-- stroke-linejoin="round" (smooth corners) -->
<path d="M 0 40 L 50 20 L 100 30" />
<!-- Rounded corners, more organic feel -->
```

**Performance considerations:**

```typescript
// Path string generation cost
const data = Array(30); // 30 points
const iterations = 1000;

// Benchmark: ~0.02ms per path generation
// For 31 sectors × 1 render = 0.62ms total

// Optimization: Memoize path if data doesn't change
import { useMemo } from 'react';

const pathData = useMemo(
  () => generateSparklinePath(data, width, height),
  [data, width, height]
);
```

**Alternative: Smooth curves with quadratic Bézier:**

```typescript
// Current: Sharp-angle line segments (L commands)
"M 0 40 L 50 20 L 100 30"

// Alternative: Smooth curves (Q commands)
"M 0 40 Q 25 30 50 20 Q 75 25 100 30"

// Not used because:
// 1. More complex path generation
// 2. Can overshoot data points (misleading)
// 3. Sharp angles show volatility more clearly
// 4. Matches financial chart conventions
```

**Empty data handling:**

```typescript
export function generateSparklinePath(data: number[], width: number, height: number): string {
  // Edge case: No data
  if (data.length === 0) return '';

  // Edge case: Single data point
  if (data.length === 1) {
    // Render horizontal line at mid-height
    return `M 0 ${height / 2} L ${width} ${height / 2}`;
  }

  // Normal case: Multiple points
  // ...
}
```

**Testing path generation:**

```typescript
import { generateSparklinePath } from '../utils/sparklineUtils';

describe('generateSparklinePath', () => {
  test('generates valid path for simple data', () => {
    const data = [10, 20, 15];
    const path = generateSparklinePath(data, 100, 40);

    expect(path).toMatch(/^M 0 \d+/); // Starts with M command
    expect(path).toContain('L'); // Contains L commands
    expect(path.split('L').length).toBe(3); // 3 points = 1 M + 2 L
  });

  test('handles all identical values', () => {
    const data = [100, 100, 100];
    const path = generateSparklinePath(data, 100, 40);

    expect(path).toContain('20'); // Mid-height = 40/2 = 20
  });

  test('min value at bottom, max at top', () => {
    const data = [0, 100]; // Min=0, Max=100
    const path = generateSparklinePath(data, 100, 40);

    expect(path).toContain('M 0 40'); // Min value → Y=40 (bottom)
    expect(path).toContain('L 100 0'); // Max value → Y=0 (top)
  });
});
```
