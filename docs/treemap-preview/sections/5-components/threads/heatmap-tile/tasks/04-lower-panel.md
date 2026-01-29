# Task: Lower Panel Layout

Bottom 50% of tile height with Capital Flow + Change% + Arrow, right-bottom aligned with 8px padding.

---

## Design

### Purpose
Display financial metrics (capital inflow/outflow and price change percentage) in the lower half of the tile, positioned at bottom-right corner with clear visual hierarchy.

### Layout Structure

```
┌──────────────────────────────────────┐
│ Lower Panel (50% of tile height)    │
│                                      │
│                 ┌──────────────────┐ │
│                 │   +125.5亿      │ │ ← Capital Flow
│                 │      ↓ 4px gap   │ │
│                 │   [↑] +2.5%    │ │ ← Arrow + Change%
│                 └──────────────────┘ │
│                         ↑            │
│                    8px from right    │
│                    8px from bottom   │
└──────────────────────────────────────┘
```

### Spacing Specifications

**Container:**
- Position: `absolute bottom-0 right-0`
- Padding: `p-2` (8px all sides)
- Alignment: `flex justify-end items-end`

**Content Stack:**
- Direction: Vertical `flex-col`
- Alignment: Right-aligned `items-end`
- Gap: `gap-1` (4px between Capital Flow and Change%)

**Capital Flow:**
- Font: 12px (`text-xs`), weight 400 (normal)
- Color: White 80% opacity (`text-white/80`)
- Format: `+125.5亿` or `-45.2亿`
- Sign: Always show + or -

**Change Percent:**
- Container: Horizontal flex `flex items-center gap-1`
- Arrow: 14px Lucide icon (ArrowUp/ArrowDown)
- Text: 12px (`text-xs`), weight 600 (semibold), white
- Format: `+2.5%` or `-1.8%`
- Sign: Always show + or -

**Arrow Color Convention (Chinese Market):**
- 🔴 Red `text-red-600`: Positive change (up, 涨)
- 🟢 Green `text-green-600`: Negative change (down, 跌)
- Drop shadow: `filter: drop-shadow(0 0 2px rgba(255,255,255,0.9))` for anti-fusion

### Arrow Anti-Fusion Problem

**Issue:** Red arrow on red background (or green on green) becomes invisible.

**Solution:** White drop-shadow creates contrast regardless of background color.

```css
/* Creates white glow around arrow */
filter: drop-shadow(0 0 2px rgba(255,255,255,0.9));
```

---

## Implementation

### Component Structure

```typescript
// apps/preview/src/app/components/HeatMapTile.tsx

import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatCapitalFlow, formatChangePercent } from '../utils/colorUtils';

export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  return (
    <div className="absolute ...">
      <div className="gradient-border ...">
        <div className="glass-content ...">
          {/* Upper Panel: See Task 03 */}

          {/* Lower Panel: 50% height, bottom-right positioned */}
          <div className="absolute bottom-0 right-0 p-2">
            <div className="flex flex-col gap-1 items-end">
              {/* Capital Flow */}
              <div className="text-xs font-normal text-white/80">
                {formatCapitalFlow(entity.capitalFlow)}
              </div>

              {/* Change% with Arrow */}
              <div className="flex items-center gap-1">
                {entity.changePercent > 0 ? (
                  <ArrowUp
                    size={14}
                    className="text-red-600"
                    style={{
                      filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))'
                    }}
                  />
                ) : (
                  <ArrowDown
                    size={14}
                    className="text-green-600"
                    style={{
                      filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))'
                    }}
                  />
                )}
                <span className="text-xs font-semibold text-white">
                  {formatChangePercent(entity.changePercent)}
                </span>
              </div>
            </div>
          </div>

          {/* Sparkline: See Task 06 (conditional on hover) */}
        </div>
      </div>
    </div>
  );
}
```

### Utility Functions

```typescript
// apps/preview/src/app/utils/colorUtils.ts

/**
 * Format capital flow with Chinese unit (亿元)
 * Always show sign (+ or -)
 */
export function formatCapitalFlow(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}亿`;
}

/**
 * Format change percentage
 * Always show sign (+ or -)
 */
export function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
```

### Examples

```typescript
// Positive change (涨)
capitalFlow: 125.5
changePercent: 2.35

// Renders:
// +125.5亿
// ↑ +2.35%  (red arrow, white text)

// Negative change (跌)
capitalFlow: -45.2
changePercent: -1.87

// Renders:
// -45.2亿
// ↓ -1.87%  (green arrow, white text)
```

---

## Acceptance Criteria

✅ **Layout Correctness:**
- [ ] Content positioned at bottom-right corner of tile
- [ ] Exactly 8px padding from right edge
- [ ] Exactly 8px padding from bottom edge
- [ ] Capital Flow and Change% have 4px vertical gap
- [ ] Content never overlaps with Upper Panel (50/50 split enforced)

✅ **Capital Flow Display:**
- [ ] Format: `+125.5亿` (1 decimal place, Chinese unit)
- [ ] Always shows sign (+ for positive, - for negative)
- [ ] Font size 12px, weight 400 (normal)
- [ ] Color: White with 80% opacity
- [ ] Right-aligned text

✅ **Change Percent Display:**
- [ ] Format: `+2.35%` (2 decimal places, always with sign)
- [ ] Font size 12px, weight 600 (semibold)
- [ ] Color: Pure white `#ffffff`
- [ ] Right-aligned with arrow
- [ ] Arrow and text have 4px gap

✅ **Arrow Rendering:**
- [ ] ArrowUp for positive change, ArrowDown for negative
- [ ] Size exactly 14px
- [ ] Red color (#dc2626) for positive (Chinese market: 涨)
- [ ] Green color (#16a34a) for negative (Chinese market: 跌)
- [ ] White drop-shadow visible on all background colors
- [ ] Arrow never appears blurry or pixelated

✅ **Chinese Market Convention:**
- [ ] Verified: Red = Up (positive) ✅
- [ ] Verified: Green = Down (negative) ✅
- [ ] No Western convention (green=up, red=down) used anywhere

✅ **Anti-Fusion Drop Shadow:**
- [ ] Red arrow visible on red backgrounds (0.2-3% positive tiles)
- [ ] Green arrow visible on green backgrounds (0.2-3% negative tiles)
- [ ] White glow has 2px radius blur
- [ ] Glow opacity is 0.9 (90%)

---

## References

- **Upper Panel:** [Task 03: Upper Panel Layout](./03-upper-panel.md)
- **Sparkline:** [Task 06: Sparkline Integration](./06-sparkline-integration.md)
- **Color Utils:** [Section 7 → Implementation → Utils](../../../7-implementation/threads/utils/index.md)
- **Chinese Market Colors:** [Section 1 → Overview → Design Source](../../../1-overview/threads/design-source/index.md)

---

## Technical Notes

**Why absolute positioning for Lower Panel?**

```tsx
// ❌ WRONG: Using flex on parent causes overlap issues
<div className="flex flex-col h-full">
  <div className="flex-1">Upper Panel</div>
  <div className="flex-1">Lower Panel</div>  {/* Hard to position bottom-right */}
</div>

// ✅ CORRECT: Absolute positioning gives precise control
<div className="relative h-full">
  <div className="top-section">Upper Panel</div>
  <div className="absolute bottom-0 right-0 p-2">
    Lower Panel  {/* Perfect bottom-right alignment */}
  </div>
</div>
```

**Chinese Market vs Western Market:**

| Market | Up (Positive) | Down (Negative) |
|--------|--------------|-----------------|
| **Chinese** 🇨🇳 | 🔴 Red | 🟢 Green |
| **Western** 🇺🇸 | 🟢 Green | 🔴 Red |

Our app uses Chinese convention exclusively.
