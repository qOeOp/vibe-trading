# Task: Dynamic Color System

3-zone dynamic background coloring based on changePercent: dead zone (±0.2%), active zone (0.2-3%), extreme protection (>3%).

---

## Design

### Purpose
Provide immediate visual feedback on price movement magnitude through subtle background color tinting, while avoiding overwhelming saturation at extreme values.

### 3-Zone Color System

**Zone 1: Dead Zone (±0.2%)**
- **Range:** `-0.2% ≤ changePercent ≤ +0.2%`
- **Color:** Gray `rgba(107, 114, 128, 0.15)`
- **Rationale:** Price movements under 0.2% are considered noise, neutral gray indicates minimal change

**Zone 2: Active Zone (0.2% - 3%)**
- **Range (Positive):** `+0.2% < changePercent ≤ +3%`
  - Color: Red gradient `rgba(213, 44, 162, alpha)`
  - Alpha: `0.1 + intensity × 0.2` (0.1 → 0.3)
  - Intensity: Linear mapping `(changePercent - 0.2) / 2.8`

- **Range (Negative):** `-3% ≤ changePercent < -0.2%`
  - Color: Green gradient `rgba(3, 145, 96, alpha)`
  - Alpha: `0.1 + intensity × 0.2` (0.1 → 0.3)
  - Intensity: Linear mapping `(|changePercent| - 0.2) / 2.8`

- **Rationale:** Most price movements fall in this range, linear gradient provides intuitive visual scaling

**Zone 3: Extreme Protection (>3%)**
- **Range (Positive):** `changePercent > +3%`
  - Color: Deep red `rgba(165, 35, 128, 0.25)`
  - Alpha: Fixed at 0.25 (no further increase)

- **Range (Negative):** `changePercent < -3%`
  - Color: Deep green `rgba(2, 107, 69, 0.25)`
  - Alpha: Fixed at 0.25

- **Rationale:** Caps saturation at 3% to prevent visual overwhelm on extreme movers (e.g., +10% daily gain)

### Visual Examples

```
changePercent: +0.1%  → rgba(107, 114, 128, 0.15)   // Gray (dead zone)
changePercent: +0.5%  → rgba(213, 44, 162, 0.11)    // Light red (active)
changePercent: +1.5%  → rgba(213, 44, 162, 0.19)    // Medium red (active)
changePercent: +2.8%  → rgba(213, 44, 162, 0.29)    // Strong red (active)
changePercent: +5.0%  → rgba(165, 35, 128, 0.25)    // Deep red (capped)

changePercent: -0.1%  → rgba(107, 114, 128, 0.15)   // Gray (dead zone)
changePercent: -1.2%  → rgba(3, 145, 96, 0.16)      // Medium green (active)
changePercent: -4.5%  → rgba(2, 107, 69, 0.25)      // Deep green (capped)
```

---

## Implementation

### Color Calculation Function

```typescript
// apps/preview/src/app/utils/colorUtils.ts

/**
 * Calculate dynamic tile background color based on price change percentage
 *
 * @param changePercent - Price change percentage (e.g., 2.35 for +2.35%)
 * @returns RGBA color string for tile background
 */
export function getTileBackgroundColor(changePercent: number): string {
  const absChange = Math.abs(changePercent);

  // Zone 1: Dead Zone (±0.2%)
  if (absChange <= 0.2) {
    return 'rgba(107, 114, 128, 0.15)';  // Gray
  }

  // Zone 2: Active Zone (0.2% - 3%)
  if (absChange <= 3.0) {
    // Linear intensity mapping: 0.0 (at 0.2%) → 1.0 (at 3%)
    const intensity = (absChange - 0.2) / 2.8;

    // Alpha range: 0.1 → 0.3
    const alpha = 0.1 + intensity * 0.2;

    if (changePercent > 0) {
      // Positive: Red (Chinese market convention)
      return `rgba(213, 44, 162, ${alpha.toFixed(2)})`;
    } else {
      // Negative: Green (Chinese market convention)
      return `rgba(3, 145, 96, ${alpha.toFixed(2)})`;
    }
  }

  // Zone 3: Extreme Protection (>3%)
  if (changePercent > 0) {
    return 'rgba(165, 35, 128, 0.25)';  // Deep red (capped)
  } else {
    return 'rgba(2, 107, 69, 0.25)';    // Deep green (capped)
  }
}
```

### Usage in Component

```typescript
// apps/preview/src/app/components/HeatMapTile.tsx

import { getTileBackgroundColor } from '../utils/colorUtils';

export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  const bgColor = getTileBackgroundColor(entity.changePercent);

  return (
    <div className="absolute ...">
      <div className="gradient-border ...">
        {/* Inner layer with dynamic background */}
        <div
          className="glass-content backdrop-blur-md ..."
          style={{
            background: bgColor,  // Dynamic color applied here
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Upper Panel, Lower Panel */}
        </div>
      </div>
    </div>
  );
}
```

### Test Cases

```typescript
// apps/preview/src/app/utils/__tests__/colorUtils.test.ts

import { getTileBackgroundColor } from '../colorUtils';

describe('getTileBackgroundColor', () => {
  // Zone 1: Dead Zone
  test('returns gray for changes within ±0.2%', () => {
    expect(getTileBackgroundColor(0.1)).toBe('rgba(107, 114, 128, 0.15)');
    expect(getTileBackgroundColor(-0.15)).toBe('rgba(107, 114, 128, 0.15)');
    expect(getTileBackgroundColor(0)).toBe('rgba(107, 114, 128, 0.15)');
  });

  // Zone 2: Active Zone (Positive)
  test('returns red gradient for +0.2% to +3%', () => {
    expect(getTileBackgroundColor(0.3)).toContain('rgba(213, 44, 162,');
    expect(getTileBackgroundColor(1.5)).toContain('rgba(213, 44, 162,');
    expect(getTileBackgroundColor(2.9)).toContain('rgba(213, 44, 162,');
  });

  // Zone 2: Active Zone (Negative)
  test('returns green gradient for -0.2% to -3%', () => {
    expect(getTileBackgroundColor(-0.5)).toContain('rgba(3, 145, 96,');
    expect(getTileBackgroundColor(-1.8)).toContain('rgba(3, 145, 96,');
  });

  // Zone 3: Extreme Protection
  test('caps red at +3% and above', () => {
    expect(getTileBackgroundColor(3.5)).toBe('rgba(165, 35, 128, 0.25)');
    expect(getTileBackgroundColor(10.0)).toBe('rgba(165, 35, 128, 0.25)');
  });

  test('caps green at -3% and below', () => {
    expect(getTileBackgroundColor(-4.0)).toBe('rgba(2, 107, 69, 0.25)');
    expect(getTileBackgroundColor(-15.0)).toBe('rgba(2, 107, 69, 0.25)');
  });

  // Alpha scaling verification
  test('alpha increases linearly in active zone', () => {
    const color1 = getTileBackgroundColor(0.3);  // Near 0.2%
    const color2 = getTileBackgroundColor(2.8);  // Near 3%

    // Extract alpha values
    const alpha1 = parseFloat(color1.match(/0\.\d+/)?.[0] || '0');
    const alpha2 = parseFloat(color2.match(/0\.\d+/)?.[0] || '0');

    expect(alpha2).toBeGreaterThan(alpha1);
    expect(alpha1).toBeCloseTo(0.1, 1);
    expect(alpha2).toBeCloseTo(0.3, 1);
  });
});
```

---

## Acceptance Criteria

✅ **Zone 1 - Dead Zone:**
- [ ] Changes from -0.2% to +0.2% return gray `rgba(107, 114, 128, 0.15)`
- [ ] Exactly 0% also returns gray
- [ ] Boundary at ±0.2% is exact (0.2001% enters active zone)

✅ **Zone 2 - Active Zone:**
- [ ] Positive changes (0.2%-3%) return red with alpha 0.1-0.3
- [ ] Negative changes (-0.2% to -3%) return green with alpha 0.1-0.3
- [ ] Alpha scales linearly with changePercent magnitude
- [ ] At 0.2%: alpha ≈ 0.10
- [ ] At 3.0%: alpha ≈ 0.30
- [ ] Intermediate values interpolate correctly

✅ **Zone 3 - Extreme Protection:**
- [ ] Changes > +3% return fixed deep red `rgba(165, 35, 128, 0.25)`
- [ ] Changes < -3% return fixed deep green `rgba(2, 107, 69, 0.25)`
- [ ] Alpha does not increase beyond 0.25 for extreme values (+10%, -15%, etc.)
- [ ] Color saturation capped prevents visual overwhelm

✅ **Chinese Market Convention:**
- [ ] Red used for positive changes (涨) ✅
- [ ] Green used for negative changes (跌) ✅
- [ ] No Western convention (green=up, red=down) anywhere

✅ **Visual Verification:**
- [ ] Gray tiles clearly distinguishable from colored tiles
- [ ] Light red/green visible on small changes (+0.5%, -0.8%)
- [ ] Strong red/green visible on larger changes (+2.5%, -2.5%)
- [ ] Extreme movers (+5%, -10%) don't look "too saturated"
- [ ] Colors harmonize with glassmorphism backdrop-blur

---

## References

- **Dual Backgrounds:** [Task 02: Dual Background Layers](./02-dual-backgrounds.md)
- **Color Philosophy:** [Section 6 → Visual Design → Color System](../../../6-visual-design/threads/color-system/index.md)
- **Arrow Anti-Fusion:** [Task 04: Lower Panel Layout](./04-lower-panel.md)

---

## Technical Notes

**Why 3 zones instead of linear scaling?**

```
❌ Linear scaling 0% → 10%:
  - 0.1% change: Almost invisible (too subtle)
  - 5% change: Overwhelmingly saturated (too intense)
  - Poor visual distribution

✅ 3-zone system:
  - Dead zone: Filters out noise
  - Active zone: Optimal range for most data (0.2-3%)
  - Extreme cap: Prevents visual overload
  - Intuitive thresholds match trader expectations
```

**Color RGB values origin:**
- Red `rgba(213, 44, 162, ?)` - Derived from Figma design
- Green `rgba(3, 145, 96, ?)` - Derived from Figma design
- Gray `rgba(107, 114, 128, 0.15)` - Tailwind gray-500 at low opacity
- Deep red/green: Darker variants for extreme cap
