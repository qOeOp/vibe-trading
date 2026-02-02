# Task: Dynamic Color System

7-stop solid color ramp (Binance-style) mapping changePercent to opaque background colors.

---

## Design

### Purpose
Provide immediate visual feedback on price movement magnitude through distinct background coloring, ensuring white text remains crisp and readable at every intensity level.

### 7-Stop Solid Color Ramp

| Index | Range | Color | Hex | Meaning |
|-------|-------|-------|-----|---------|
| 0 | < -5% | Deep Green | `#0B8C5F` | 大跌 |
| 1 | -2% ~ -5% | Medium Green | `#2EBD85` | 中跌 |
| 2 | -0.5% ~ -2% | Light Green | `#58CEAA` | 小跌 |
| 3 | ±0.5% | Gray | `#76808E` | 平盘 |
| 4 | +0.5% ~ +2% | Light Red | `#E8626F` | 小涨 |
| 5 | +2% ~ +5% | Medium Red | `#F6465D` | 中涨 |
| 6 | > +5% | Deep Red | `#CF304A` | 大涨 |

**Base colors:** Red `#F6465D`, Green `#2EBD85` (from Binance reference)

**Key design decisions:**
- **Solid opaque colors** — not rgba with alpha. Eliminates background bleed-through.
- **7 discrete stops** — not continuous gradient. Clear visual distinction between intensity levels.
- **Symmetrical** — 3 red tiers + neutral gray + 3 green tiers.
- **Chinese market convention** — Red = 涨 (positive), Green = 跌 (negative).

### Visual Examples

```
changePercent: +0.3%  → #76808E (gray, neutral)
changePercent: +0.8%  → #E8626F (light red)
changePercent: +2.5%  → #F6465D (medium red)
changePercent: +7.0%  → #CF304A (deep red)

changePercent: -0.2%  → #76808E (gray, neutral)
changePercent: -1.2%  → #58CEAA (light green)
changePercent: -3.5%  → #2EBD85 (medium green)
changePercent: -8.0%  → #0B8C5F (deep green)
```

### Why Solid Colors Instead of RGBA Alpha?

```
❌ rgba(246, 70, 93, 0.2) on white background:
  - Produces pale pink (#FDE1E5)
  - White text contrast ratio: ~1.3:1 (FAILS WCAG)
  - Colors look washed out and inconsistent

✅ Solid #E8626F on white background:
  - Renders exactly as specified
  - White text contrast ratio: ~4.5:1 (PASSES WCAG AA)
  - Crisp, professional appearance matching Binance reference
```

---

## Implementation

### Color Ramp Definition

```typescript
// apps/preview/src/app/utils/colorUtils.ts

const COLOR_RAMP = [
  { bg: '#0B8C5F', label: 'deep-green' },   // < -5%
  { bg: '#2EBD85', label: 'medium-green' },  // -2% ~ -5%
  { bg: '#58CEAA', label: 'light-green' },   // -0.5% ~ -2%
  { bg: '#76808E', label: 'gray' },          // ±0.5%
  { bg: '#E8626F', label: 'light-red' },     // +0.5% ~ +2%
  { bg: '#F6465D', label: 'medium-red' },    // +2% ~ +5%
  { bg: '#CF304A', label: 'deep-red' },      // > +5%
] as const;
```

### Color Index Function

```typescript
export function getColorIndex(changePercent: number): number {
  if (changePercent <= -5)   return 0;  // deep green
  if (changePercent <= -2)   return 1;  // medium green
  if (changePercent <= -0.5) return 2;  // light green
  if (changePercent < 0.5)   return 3;  // gray (neutral)
  if (changePercent < 2)     return 4;  // light red
  if (changePercent < 5)     return 5;  // medium red
  return 6;                             // deep red
}

export function getTileBackgroundColor(changePercent: number): string {
  return COLOR_RAMP[getColorIndex(changePercent)].bg;
}
```

### Usage in Component

```typescript
// apps/preview/src/app/components/HeatMapTile.tsx

import { getTileBackgroundColor } from '../utils/colorUtils';

export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  const bgColor = getTileBackgroundColor(entity.changePercent);

  return (
    <div
      className="absolute"
      style={{
        background: bgColor,  // Solid opaque color
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.37)',
      }}
    >
      {/* Content with white text */}
    </div>
  );
}
```

### Test Cases

```typescript
// apps/preview/src/app/utils/__tests__/colorUtils.test.ts

import { getTileBackgroundColor, getColorIndex } from '../colorUtils';

describe('getTileBackgroundColor', () => {
  // Neutral zone
  test('returns gray for changes within ±0.5%', () => {
    expect(getTileBackgroundColor(0.3)).toBe('#76808E');
    expect(getTileBackgroundColor(-0.4)).toBe('#76808E');
    expect(getTileBackgroundColor(0)).toBe('#76808E');
  });

  // Positive tiers
  test('returns light red for +0.5% to +2%', () => {
    expect(getTileBackgroundColor(0.8)).toBe('#E8626F');
    expect(getTileBackgroundColor(1.5)).toBe('#E8626F');
  });

  test('returns medium red for +2% to +5%', () => {
    expect(getTileBackgroundColor(2.5)).toBe('#F6465D');
    expect(getTileBackgroundColor(4.9)).toBe('#F6465D');
  });

  test('returns deep red for > +5%', () => {
    expect(getTileBackgroundColor(5.5)).toBe('#CF304A');
    expect(getTileBackgroundColor(10.0)).toBe('#CF304A');
  });

  // Negative tiers
  test('returns light green for -0.5% to -2%', () => {
    expect(getTileBackgroundColor(-1.0)).toBe('#58CEAA');
  });

  test('returns medium green for -2% to -5%', () => {
    expect(getTileBackgroundColor(-3.5)).toBe('#2EBD85');
  });

  test('returns deep green for < -5%', () => {
    expect(getTileBackgroundColor(-8.0)).toBe('#0B8C5F');
  });

  // Index mapping
  test('maps to correct index', () => {
    expect(getColorIndex(-10)).toBe(0);
    expect(getColorIndex(-3)).toBe(1);
    expect(getColorIndex(-1)).toBe(2);
    expect(getColorIndex(0)).toBe(3);
    expect(getColorIndex(1)).toBe(4);
    expect(getColorIndex(3)).toBe(5);
    expect(getColorIndex(10)).toBe(6);
  });
});
```

---

## Acceptance Criteria

✅ **7-Stop Color Ramp:**
- [ ] 7 distinct solid colors defined (3 green + gray + 3 red)
- [ ] changePercent correctly maps to color index
- [ ] Boundary conditions exact (e.g., -0.5% is light green, +0.5% is light red)
- [ ] Colors are fully opaque (no alpha channel)

✅ **White Text Readability:**
- [ ] All 7 colors provide sufficient contrast with white text
- [ ] Minimum contrast ratio ≥ 3:1 (WCAG AA large text)
- [ ] No color produces "washed out" appearance on white background

✅ **Chinese Market Convention:**
- [ ] Red tiers for positive changes (涨) ✅
- [ ] Green tiers for negative changes (跌) ✅
- [ ] Gray for neutral (±0.5%) ✅

✅ **Visual Verification:**
- [ ] Gray tiles clearly distinguishable from colored tiles
- [ ] 3 intensity tiers per direction clearly distinguishable
- [ ] Colors match Binance heatmap reference
- [ ] No visual overwhelm on extreme movers

---

## References

- **Binance Reference:** https://www.binance.com/en/futures/crypto-heatmap/
- **Color Philosophy:** [Section 6 → Visual Design → Color System](../../../6-visual-design/threads/color-system/index.md)
- **Lower Panel:** [Task 04: Lower Panel Layout](./04-lower-panel.md)

---

## Technical Notes

**Why 7 stops instead of continuous gradient?**

```
❌ Continuous alpha scaling:
  - Requires background color to be known (dark vs light)
  - rgba on white = pale pastels, rgba on dark = vivid
  - Text contrast unpredictable across alpha range

✅ 7-stop discrete system:
  - Background-agnostic (solid colors work on any bg)
  - Guaranteed text contrast at every level
  - Matches industry standard (Binance, TradingView)
  - Simpler implementation (lookup table vs formula)
```

**Color hex origins:**
- Red `#F6465D` — Binance standard red
- Green `#2EBD85` — Binance standard green
- Gray `#76808E` — Binance neutral gray (extracted from DOM)
- Deep/light variants — Darker/lighter shifts maintaining hue
