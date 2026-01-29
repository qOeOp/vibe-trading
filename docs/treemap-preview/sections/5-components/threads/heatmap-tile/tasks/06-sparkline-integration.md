# Task: Sparkline Integration

Conditional sparkline rendering on hover for tiles larger than 120×80px, positioned in Lower Panel above financial metrics.

---

## Design

### Purpose
Reveal 30-day price trend when user hovers over tile, providing historical context for current price change without cluttering default view.

### Display Conditions

**Show Sparkline when ALL conditions met:**
1. Tile is hovered (`isHovered === true`)
2. Tile width > 120px
3. Tile height > 80px

**Hide Sparkline when ANY condition fails:**
- Not hovered (default state)
- Tile too narrow (≤ 120px)
- Tile too short (≤ 80px)

### Positioning

```
┌──────────────────────────────────────┐
│ Lower Panel (50% height)             │
│ ┌──────────────────────────────────┐ │
│ │ [Sparkline Graph]           [Dot]│ │ ← 48px from bottom (bottom-12)
│ └──────────────────────────────────┘ │   Left/right 8px margin
│                 ↓ 12px gap            │
│ ┌──────────────────────────────────┐ │
│ │            +125.5亿       8px→   │ │ ← Capital Flow + Change%
│ │            [↑] +2.5%     8px→   │ │   (Always visible)
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Dimensions
- Width: Tile width - 16px (8px margin each side)
- Height: Fixed 40px
- Position: `absolute bottom-12 left-2 right-2`

### Animation
- Appear: Fade in with 300ms ease-out
- SVG path: Draw-line animation (0.4s)
- Ripple dot: Continues breathing animation

---

## Implementation

### Conditional Rendering Logic

```typescript
// apps/preview/src/app/components/HeatMapTile.tsx

import { useState } from 'react';
import { Sparkline } from './Sparkline';

export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine if sparkline should display
  const showSparkline = isHovered && width > 120 && height > 80;

  // Mock 30-day data (in real app, comes from entity.sparklineData)
  const mockSparklineData = Array.from({ length: 30 }, (_, i) =>
    100 + Math.sin(i / 5) * 10 + Math.random() * 5
  );

  return (
    <div
      className="absolute ..."
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="gradient-border ...">
        <div className="glass-content ...">
          {/* Upper Panel */}

          {/* Lower Panel */}
          <div className="relative">
            {/* Sparkline: Conditional render */}
            {showSparkline && (
              <div className="absolute bottom-12 left-2 right-2 transition-opacity duration-300">
                <Sparkline
                  data={mockSparklineData}
                  width={width - 16}
                  height={40}
                  attentionLevel={entity.attentionLevel}
                />
              </div>
            )}

            {/* Capital Flow + Change%: Always visible */}
            <div className="absolute bottom-0 right-0 p-2">
              {/* ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Sparkline Component Integration

```typescript
// Sparkline receives these props
interface SparklineProps {
  data: number[];       // 30 data points
  width: number;        // Tile width - 16px
  height: number;       // Fixed 40px
  attentionLevel: number; // For breathing dot
  className?: string;
}

// See: Section 5 → Components → Sparkline thread for full implementation
```

### Responsive Degradation

```typescript
// On small tiles, sparkline is hidden to prevent visual clutter
if (width <= 120 || height <= 80) {
  // No sparkline, only Capital Flow + Change% displayed
  // Saves rendering cost on small tiles
}

// Example tile sizes:
// 150×150: Sparkline shows on hover ✅
// 180×200: Sparkline shows on hover ✅
// 100×150: No sparkline (too narrow) ❌
// 150×70:  No sparkline (too short) ❌
```

---

## Acceptance Criteria

✅ **Display Logic:**
- [ ] Sparkline appears on hover for tiles > 120×80px
- [ ] Sparkline hidden by default (not hovered)
- [ ] Sparkline hidden on tiles ≤ 120px width
- [ ] Sparkline hidden on tiles ≤ 80px height
- [ ] Transition smooth (300ms fade-in/out)

✅ **Positioning:**
- [ ] Sparkline positioned 48px from bottom (bottom-12 = 3rem)
- [ ] Left margin 8px (left-2)
- [ ] Right margin 8px (right-2)
- [ ] Does not overlap with Capital Flow + Change%
- [ ] Minimum 12px gap between sparkline and financial metrics

✅ **Sizing:**
- [ ] Width = Tile width - 16px (accounts for 8px margins)
- [ ] Height = Exactly 40px (fixed)
- [ ] Sparkline never extends beyond tile boundaries
- [ ] Scales correctly when tile resizes

✅ **Integration with Financial Metrics:**
- [ ] Capital Flow + Change% always visible (not hidden by sparkline)
- [ ] Z-index layering correct (sparkline below metrics if overlap)
- [ ] Hover state does not break financial metrics layout

✅ **Animation:**
- [ ] Fade-in: opacity 0 → 1 over 300ms
- [ ] Fade-out: opacity 1 → 0 over 300ms
- [ ] Draw-line SVG animation plays on first appearance
- [ ] Breathing dot at end of line animates correctly

✅ **Performance:**
- [ ] No sparkline render cost when isHovered = false
- [ ] Conditional render prevents unnecessary component mounting
- [ ] Hover on/off does not cause layout thrashing
- [ ] 60fps animation maintained

---

## References

- **Sparkline Component:** [Section 5 → Components → Sparkline](../../sparkline/index.md)
- **BreathingDot:** [Section 5 → Components → BreathingDot](../../breathing-dot/index.md)
- **Lower Panel:** [Task 04: Lower Panel Layout](./04-lower-panel.md)
- **Hover State:** [Task 01: Tile Shell & Positioning](./01-tile-shell.md)

---

## Technical Notes

**Why 120×80px threshold?**

```
Tile Size Analysis:
- 150×150: Common size, sparkline fits well
- 120×120: Minimum for readable sparkline
- 100×80:  Too cramped, sparkline overlaps metrics
- < 120×80: Hide sparkline to prevent clutter

Threshold chosen based on visual testing for readability.
```

**Why bottom-12 (48px) gap?**

```
Lower Panel Layout:
- Capital Flow: 12px height
- Gap: 4px
- Change%: 12px height
- Padding: 8px
- Total: 36px minimum

Sparkline needs 40px height + 12px gap = 52px
Bottom-12 (48px) provides adequate separation.
```

**Mock Data vs Real Data:**

```typescript
// Phase 1: Mock data generation
const mockData = Array.from({ length: 30 }, () => randomPrice());

// Phase 2: Real data from entity
const realData = entity.sparklineData || fallbackMockData;
```
