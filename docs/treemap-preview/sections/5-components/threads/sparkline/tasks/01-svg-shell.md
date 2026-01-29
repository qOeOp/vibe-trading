# Task: SVG Shell & Dimensions

Responsive SVG container with dynamic viewBox that adapts to tile width while maintaining fixed 40px height.

---

## Design

### Purpose
Create SVG canvas that scales width based on tile size while preserving aspect ratio and coordinate system for consistent path rendering.

### Dimensions

**Width:**
- Dynamic: Equals `width` prop (tile width - 16px)
- Typical range: 134px-284px (for 150px-300px tiles)
- Must adapt to container size changes

**Height:**
- Fixed: 40px (always, regardless of tile size)
- Chosen for optimal trend visibility in lower panel gap
- Enough vertical space for variation without dominating tile

**ViewBox:**
```
viewBox="0 0 {width} {height}"
```
- Coordinate system matches pixel dimensions
- (0,0) at top-left corner
- X-axis: 0 → width (left to right)
- Y-axis: 0 → height (top to bottom)

### Container Structure

```tsx
<div className="sparkline-container">
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
  >
    {/* Path will be added in Task 02 */}
    {/* BreathingDot will be added in Task 03 */}
  </svg>
</div>
```

---

## Implementation

### Component Base

```typescript
// apps/preview/src/app/components/Sparkline.tsx

interface SparklineProps {
  /** 30 price data points */
  data: number[];

  /** Chart width in pixels */
  width: number;

  /** Chart height in pixels (default: 40) */
  height?: number;

  /** Attention level for endpoint dot */
  attentionLevel: number;

  /** Additional CSS classes */
  className?: string;
}

export function Sparkline({
  data,
  width,
  height = 40,
  attentionLevel,
  className = '',
}: SparklineProps) {
  return (
    <div className={`sparkline-container ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Path rendering: Task 02 */}
        {/* BreathingDot: Task 03 */}
        {/* Animation: Task 04 */}
      </svg>
    </div>
  );
}
```

### Base Styles

```css
/* apps/preview/src/app/styles.css */

.sparkline-container {
  position: relative;
  display: block;
  width: 100%;
  height: 40px;
}

.sparkline-container svg {
  display: block;
  overflow: visible;
  /* Allows BreathingDot to render beyond SVG bounds if needed */
}
```

### Coordinate System

**Horizontal (X-axis):**
```
0px                  width/2                  width
├─────────────────────┼──────────────────────┤
Day 0               Day 15                Day 30
```

**Vertical (Y-axis):**
```
0px ─────  Maximum price (top)
  │
  │
20px ───── Middle (average price)
  │
  │
40px ─────  Minimum price (bottom)
```

**Data Point Spacing:**
```typescript
// 30 data points across width
const xStep = width / (data.length - 1);

// Example at width=200px:
// xStep = 200 / 29 ≈ 6.9px between points
```

---

## Acceptance Criteria

✅ **SVG Rendering:**
- [ ] SVG element renders with correct width and height
- [ ] ViewBox attribute matches width and height dimensions
- [ ] `preserveAspectRatio="none"` allows non-uniform scaling
- [ ] SVG coordinate system: (0,0) at top-left, Y-axis increases downward

✅ **Responsive Sizing:**
- [ ] Width changes when `width` prop changes
- [ ] Height remains fixed at 40px (default)
- [ ] ViewBox updates when dimensions change
- [ ] No layout shift when SVG renders

✅ **Container:**
- [ ] Container div wraps SVG properly
- [ ] Container height matches SVG height (40px)
- [ ] `className` prop applied to container div
- [ ] SVG overflow visible for BreathingDot rendering

✅ **Accessibility:**
- [ ] `aria-hidden="true"` on SVG (decorative chart)
- [ ] No interactive elements (not keyboard focusable)
- [ ] Screen readers ignore sparkline

✅ **Edge Cases:**
- [ ] Handles very narrow widths (min 120px per spec)
- [ ] Handles very wide widths (max 284px for 300px tiles)
- [ ] Works at custom heights (if `height` prop overridden)
- [ ] Renders correctly with empty data array (edge case)

---

## References

- **Path Generation:** [Task 02: Path Generation & Styling](./02-path-generation.md)
- **BreathingDot:** [Task 03: Endpoint BreathingDot Integration](./03-endpoint-dot.md)
- **HeatMapTile Usage:** [Section 5 → HeatMapTile → Task 06](../../heatmap-tile/tasks/06-sparkline-integration.md)

---

## Technical Notes

**Why preserveAspectRatio="none"?**

```svg
<!-- ✅ With preserveAspectRatio="none" -->
<svg viewBox="0 0 200 40" width="200" height="40" preserveAspectRatio="none">
  <!-- ViewBox coordinates map exactly to pixel coordinates -->
  <!-- (100, 20) in viewBox = center of 200×40 canvas -->
</svg>

<!-- ❌ Without (default "xMidYMid meet") -->
<svg viewBox="0 0 200 40" width="150" height="40">
  <!-- ViewBox gets letterboxed, coordinates don't align -->
  <!-- Chart appears squashed or stretched -->
</svg>
```

**Why overflow: visible?**

```css
.sparkline-container svg {
  overflow: visible;
  /* Allows BreathingDot (6px diameter) to extend beyond SVG bounds */
  /* Example: If last point is at Y=0, dot center at Y=3 would be cut off */
  /* overflow:visible ensures dot renders fully */
}
```

**ViewBox coordinate math:**

```typescript
// For 30 data points at width=200px:
const points = 30;
const width = 200;

// Point 0: X = 0px (leftmost)
const x0 = 0 * (width / (points - 1)); // 0px

// Point 15: X = 103.4px (middle)
const x15 = 15 * (width / (points - 1)); // ~103px

// Point 29: X = 200px (rightmost)
const x29 = 29 * (width / (points - 1)); // 200px
```

**Height fixation rationale:**

```
Variable height problems:
- Inconsistent visual weight across tiles
- Breaks lower panel layout (bottom-12 positioning)
- Complicates Y-axis scaling (data range changes per tile)

Fixed 40px benefits:
- Uniform appearance across all tiles
- Predictable layout spacing
- Simpler Y-axis normalization (min/max always fit 0-40px)
```

**Container wrapper purpose:**

```tsx
// ❌ Without container
<svg className={className} />
// Problem: className applied to SVG, not wrapper
// Can't use flex/positioning classes on SVG directly

// ✅ With container
<div className={className}>
  <svg />
</div>
// Allows: className="absolute bottom-12 left-2 right-2"
// SVG stays presentational, container handles layout
```

**aria-hidden justification:**

```
Sparkline is decorative enhancement, not critical information:
- Primary data: Capital Flow + Change% (always visible text)
- Sparkline: Visual supplement showing historical trend
- Missing sparkline doesn't affect understanding (accessible)
- Screen readers focus on text metrics (essential info)
```

**Performance note:**

```typescript
// SVG element creation cost: ~0.01ms
// ViewBox calculation: negligible (string concatenation)
// 31 sparklines (all sectors): ~0.3ms total initialization

// SVG is more efficient than Canvas for small charts:
// - No context creation overhead
// - Browser handles rendering optimization
// - Built-in scaling via viewBox
// - No manual redraw on resize
```
