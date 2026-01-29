# Task: Adaptive Content Scaling

Content size and visibility adjustments based on tile dimensions to maintain readability across variable tile sizes.

---

## Design

### Purpose
Ensure text, icons, and metrics remain readable on both large and small tiles by dynamically adjusting font sizes, icon sizes, and element visibility based on available space.

### Scaling Strategy

**Philosophy:** Content shrinks proportionally, nothing is hidden unless absolutely necessary.

### Size Thresholds

| Tile Size | Min Dimension | Icon Size | Font Size (Name) | Font Size (Metrics) | Notes |
|-----------|---------------|-----------|------------------|---------------------|-------|
| **Large** | > 180px | 18px | 16px (base) | 12px (xs) | Full detail, all elements visible |
| **Medium** | 150-180px | 16px | 14px (sm) | 12px (xs) | Standard size (most common) |
| **Small** | < 150px | 14px | 12px (xs) | 10px (xxs) | Compact mode, sparkline hidden |

**Note:** Treemap algorithm enforces 150×150px minimum, so tiles rarely enter "Small" category.

### Adaptive Rules

**Icon:**
```typescript
if (minDimension >= 180) iconSize = 18;
else if (minDimension >= 150) iconSize = 16;
else iconSize = 14;
```

**Name Text:**
```typescript
if (minDimension >= 180) fontSize = 'text-base' (16px);
else if (minDimension >= 150) fontSize = 'text-sm' (14px);
else fontSize = 'text-xs' (12px);
```

**Metrics (Capital Flow + Change%):**
- Always `text-xs` (12px) - Does not scale
- Critical data must remain readable

**Sparkline:**
- Hidden if width ≤ 120px OR height ≤ 80px
- See [Task 06: Sparkline Integration](./06-sparkline-integration.md)

---

## Implementation

### Utility Function

```typescript
// apps/preview/src/app/utils/tileUtils.ts

interface ContentScaleConfig {
  iconSize: number;
  nameFontSize: string;  // Tailwind class
  showIcon: boolean;
  showSparkline: boolean;
}

/**
 * Determine content scale based on tile dimensions
 *
 * @param width - Tile width in pixels
 * @param height - Tile height in pixels
 * @returns Configuration object for content sizing
 */
export function getContentScale(width: number, height: number): ContentScaleConfig {
  const minDimension = Math.min(width, height);
  const area = width * height;

  // Large tiles (> 180px)
  if (minDimension > 180) {
    return {
      iconSize: 18,
      nameFontSize: 'text-base',
      showIcon: true,
      showSparkline: width > 120 && height > 80,
    };
  }

  // Medium tiles (150-180px) - Most common
  if (minDimension >= 150) {
    return {
      iconSize: 16,
      nameFontSize: 'text-sm',
      showIcon: true,
      showSparkline: width > 120 && height > 80,
    };
  }

  // Small tiles (< 150px) - Rare, but handle gracefully
  return {
    iconSize: 14,
    nameFontSize: 'text-xs',
    showIcon: area >= 15000,  // Hide icon on very small tiles (< 122×122)
    showSparkline: false,
  };
}
```

### Component Integration

```typescript
// apps/preview/src/app/components/HeatMapTile.tsx

import { getContentScale } from '../utils/tileUtils';

export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get adaptive content configuration
  const contentScale = getContentScale(width, height);

  // Determine sparkline visibility
  const showSparkline = isHovered && contentScale.showSparkline;

  return (
    <div className="absolute ...">
      <div className="gradient-border ...">
        <div className="glass-content ...">
          {/* Upper Panel */}
          <div className="flex items-center justify-center gap-1 px-2 py-2">
            {/* Icon: Conditional render based on scale */}
            {contentScale.showIcon && Icon && (
              <Icon
                size={contentScale.iconSize}
                className="flex-shrink-0 text-white/90"
                style={{ marginLeft: '8px' }}
              />
            )}

            {/* Name: Adaptive font size */}
            <span
              className={`font-semibold text-white truncate ${contentScale.nameFontSize}`}
              style={{ marginLeft: contentScale.showIcon ? '4px' : '8px' }}
            >
              {entity.name}
            </span>

            {/* BreathingDot: Always visible (critical indicator) */}
            <BreathingDot
              attentionLevel={entity.attentionLevel}
              className="ml-auto"
            />
          </div>

          {/* Lower Panel */}
          <div className="relative">
            {/* Sparkline: Conditional based on scale + hover */}
            {showSparkline && (
              <div className="absolute bottom-12 left-2 right-2">
                <Sparkline data={data} width={width - 16} height={40} />
              </div>
            )}

            {/* Metrics: Always visible, fixed 12px */}
            <div className="absolute bottom-0 right-0 p-2">
              <div className="flex flex-col gap-1 items-end">
                <div className="text-xs font-normal text-white/80">
                  {formatCapitalFlow(entity.capitalFlow)}
                </div>
                <div className="flex items-center gap-1">
                  {/* Arrow + Change% */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Responsive Examples

**Large Tile (200×200):**
```
Icon: 18px
Name: 16px (text-base)
Capital Flow: 12px (text-xs)
Change%: 12px (text-xs)
Sparkline: Visible on hover
```

**Medium Tile (160×160):**
```
Icon: 16px
Name: 14px (text-sm)
Capital Flow: 12px (text-xs)
Change%: 12px (text-xs)
Sparkline: Visible on hover
```

**Small Tile (150×150):**
```
Icon: 16px
Name: 14px (text-sm)
Capital Flow: 12px (text-xs)
Change%: 12px (text-xs)
Sparkline: Hidden (width = 150, needs > 120)
```

**Very Small Tile (Edge Case: 100×100):**
```
Icon: Hidden (area < 15000)
Name: 12px (text-xs)
Capital Flow: 12px (text-xs)
Change%: 12px (text-xs)
Sparkline: Hidden
```

---

## Acceptance Criteria

✅ **Icon Scaling:**
- [ ] Large tiles (> 180px): 18px icon
- [ ] Medium tiles (150-180px): 16px icon
- [ ] Small tiles (< 150px): 14px icon or hidden
- [ ] Icon never pixelated or blurry
- [ ] Correct icon displays for all sectors

✅ **Name Text Scaling:**
- [ ] Large tiles: 16px font (text-base)
- [ ] Medium tiles: 14px font (text-sm)
- [ ] Small tiles: 12px font (text-xs)
- [ ] Chinese characters remain readable at all sizes
- [ ] Truncation with ellipsis works correctly

✅ **Metrics (Capital Flow + Change%):**
- [ ] Always 12px (text-xs) regardless of tile size
- [ ] Never scales below 12px (readability threshold)
- [ ] Arrow size fixed at 14px
- [ ] Numeric precision maintained (1 decimal for flow, 2 for %)

✅ **Sparkline Visibility:**
- [ ] Hidden on tiles ≤ 120px width
- [ ] Hidden on tiles ≤ 80px height
- [ ] Appears on hover for qualifying tiles
- [ ] See Task 06 acceptance criteria

✅ **Edge Cases:**
- [ ] Minimum tile (150×150): All elements readable
- [ ] Very wide tile (300×100): Icon hidden, name visible
- [ ] Very tall tile (100×300): Icon hidden, name visible
- [ ] Square large tile (250×250): All elements large and clear

✅ **Performance:**
- [ ] Content scale calculation runs once per render
- [ ] No unnecessary re-calculations on hover
- [ ] Tailwind classes applied correctly
- [ ] No layout shift when content scales

---

## References

- **Icon Mapping:** [Section 3 → Data Model → Icon Mapping](../../../3-data-model/threads/icon-mapping/index.md)
- **Upper Panel:** [Task 03: Upper Panel Layout](./03-upper-panel.md)
- **Lower Panel:** [Task 04: Lower Panel Layout](./04-lower-panel.md)
- **Sparkline:** [Task 06: Sparkline Integration](./06-sparkline-integration.md)

---

## Technical Notes

**Why keep metrics at fixed 12px?**

```
Financial data (capital flow, change%) is critical information.
Scaling it down risks making numbers unreadable.
12px is the minimum readable font size on most displays.
Sacrificing icon/name size is acceptable, but not numeric data.
```

**Why min dimension instead of average?**

```typescript
// ❌ Using average can be misleading
const avgDimension = (width + height) / 2;
// 300×100 tile: avg = 200 (seems large, but actually very narrow)

// ✅ Using minimum dimension
const minDimension = Math.min(width, height);
// 300×100 tile: min = 100 (correctly identifies as constrained)
```

**Tile Size Distribution:**

Based on market cap distribution of 31 SW sectors:
- Large tiles (> 180px): ~8-10 sectors (银行, 食品饮料, 电子, etc.)
- Medium tiles (150-180px): ~15-20 sectors (most common)
- Small tiles (< 150px): ~3-5 sectors (smallest market caps)
