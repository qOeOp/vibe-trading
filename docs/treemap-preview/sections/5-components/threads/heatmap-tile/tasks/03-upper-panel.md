# Task: Upper Panel Layout

Top 50% of tile height with horizontal flex layout: Icon (8px left) + Name (4px gap) + BreathingDot (auto right).

---

## Design

### Purpose
Display sector identification with visual icon, Chinese name, and attention indicator in a clean, centered horizontal layout occupying the upper half of the tile.

### Layout Structure

```
┌──────────────────────────────────────┐
│ Upper Panel (50% of tile height)    │
│ ┌──────────────────────────────────┐│
│ │8px│[Icon]│4px│Name...│  [Dot]│8px││ ← Horizontal flex, center aligned
│ └──────────────────────────────────┘│
│          (Flexible space)            │
└──────────────────────────────────────┘
```

### Spacing Specifications

**Container:**
- Padding: `px-2 py-2` (8px all sides)
- Alignment: `flex items-center justify-center`
- Gap: `gap-1` (4px between children, but Icon/Name use explicit margins)

**Icon:**
- Position: 8px from left edge (explicit `marginLeft: '8px'`)
- Size: 16-18px (adaptive based on tile width/height)
- Flex: `flex-shrink-0` (never shrinks)
- Source: Lucide React icons mapped by sector code

**Name:**
- Gap from Icon: 4px (explicit `marginLeft: '4px'`)
- Font: 14-16px, weight 600 (semibold)
- Color: White `#ffffff`
- Overflow: `truncate` (ellipsis if too long)
- Max content: Single line only

**BreathingDot:**
- Position: Auto right-aligned (`ml-auto`)
- Size: 7px diameter
- Color: Yellow `#facc15`
- Animation: See [BreathingDot thread](../../breathing-dot/index.md)

### Height Calculation

```typescript
// Upper Panel is always 50% of tile height
const upperPanelHeight = tileHeight * 0.5;

// Exception: If tile is very short (< 200px), ensure minimum for content
const minContentHeight = 32; // Icon + padding
if (upperPanelHeight < minContentHeight) {
  // Handled by parent tile constraints (min 150×150px enforced)
}
```

---

## Implementation

### Component Structure

```typescript
// apps/preview/src/app/components/HeatMapTile.tsx

import { iconMapping } from '../data/iconMapping';
import { BreathingDot } from './BreathingDot';

export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  // Determine icon size based on tile dimensions
  const iconSize = Math.min(width, height) > 180 ? 18 : 16;

  // Get Lucide icon component
  const Icon = iconMapping[entity.code];

  return (
    <div className="absolute ...">
      <div className="gradient-border ...">
        <div className="glass-content ...">
          {/* Upper Panel: 50% height */}
          <div className="flex items-center justify-center gap-1 px-2 py-2">
            {/* Icon - 8px from left */}
            {Icon && (
              <Icon
                size={iconSize}
                className="flex-shrink-0 text-white/90"
                style={{ marginLeft: '8px' }}
              />
            )}

            {/* Name - 4px from Icon */}
            <span
              className="font-semibold text-white text-sm truncate"
              style={{ marginLeft: '4px' }}
            >
              {entity.name}
            </span>

            {/* BreathingDot - auto right */}
            <BreathingDot
              attentionLevel={entity.attentionLevel}
              className="ml-auto"
            />
          </div>

          {/* Lower Panel: See Task 04 */}
        </div>
      </div>
    </div>
  );
}
```

### Icon Size Logic

```typescript
// apps/preview/src/app/utils/tileUtils.ts

export function getIconSize(width: number, height: number): number {
  const minDimension = Math.min(width, height);

  if (minDimension >= 180) return 18;  // Large tiles
  if (minDimension >= 150) return 16;  // Medium tiles
  return 14;  // Small tiles (edge case)
}
```

### Icon Mapping Reference

```typescript
// apps/preview/src/app/data/iconMapping.ts
// See: Section 3 → Data Model → Icon Mapping thread

import { Cpu, Landmark, Droplets /* ... */ } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const iconMapping: Record<string, LucideIcon> = {
  '801980': Cpu,        // 电子
  '801780': Landmark,   // 银行
  '802040': Droplets,   // 石油石化
  // ... (all 31 sectors)
};
```

---

## Acceptance Criteria

✅ **Layout Correctness:**
- [ ] Icon is exactly 8px from left edge of container
- [ ] Name has exactly 4px gap from Icon
- [ ] BreathingDot auto-aligns to right edge with 8px padding
- [ ] All elements vertically centered in container
- [ ] Container occupies exactly 50% of tile height

✅ **Icon Rendering:**
- [ ] Correct Lucide icon displays for each sector (31 unique icons)
- [ ] Icon size is 16px for tiles 150-180px, 18px for tiles > 180px
- [ ] Icon never shrinks (flex-shrink-0 applied)
- [ ] Icon color is white with 90% opacity

✅ **Name Display:**
- [ ] Chinese characters render correctly (e.g., 电子, 银行, 石油石化)
- [ ] Font weight is 600 (semibold)
- [ ] Font size is 14-16px (adaptive)
- [ ] Long names truncate with ellipsis (...)
- [ ] No line wrapping (single line only)

✅ **BreathingDot Integration:**
- [ ] Dot displays on all tiles
- [ ] Dot animates based on attentionLevel (see BreathingDot thread)
- [ ] Dot never overlaps with Name text
- [ ] Auto-positioning pushes dot to right edge correctly

✅ **Responsive Behavior:**
- [ ] On very narrow tiles (width < 120px), icon may be hidden to save space
- [ ] Name still displays even on smallest allowed tiles (150×150px)
- [ ] BreathingDot always visible (critical attention indicator)

---

## References

- **Icon Mapping:** [Section 3 → Data Model → Icon Mapping](../../../3-data-model/threads/icon-mapping/index.md)
- **BreathingDot Specs:** [Section 5 → Components → BreathingDot](../../breathing-dot/index.md)
- **Lower Panel:** [Task 04: Lower Panel Layout](./04-lower-panel.md)
- **Typography:** [Section 6 → Visual Design → Color System](../../../6-visual-design/threads/color-system/index.md)

---

## Technical Notes

**Why explicit marginLeft instead of gap?**

```tsx
// ❌ Using gap alone - Icon not precisely positioned
<div className="flex gap-1">
  <Icon />  {/* Gap from container edge varies */}
  <Name />
</div>

// ✅ Using explicit margin - Icon exactly 8px from left
<div className="flex gap-1">
  <Icon style={{ marginLeft: '8px' }} />  {/* Precise control */}
  <Name style={{ marginLeft: '4px' }} />  {/* Overrides gap for precision */}
</div>
```

**Why ml-auto for BreathingDot?**

```tsx
// Pushes dot to rightmost position within flex container
// Auto margin consumes all available space, forcing dot to right edge
<BreathingDot className="ml-auto" />
```
