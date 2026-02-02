# Task: Header Row Layout

Header row with sector name (left) and capital flow value (right), with continuous font scaling and adaptive vertical modes.
---

## Design

### Purpose
Display sector name and capital flow as a header row, with font size proportional to tile area for natural visual hierarchy — largest tiles catch the eye first.

### Layout Structure

**Normal (horizontal):**
```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │ 板块名称          +125.5亿       │ │ ← flex row, space-between
│ └──────────────────────────────────┘ │
│          (sparkline + badge below)   │
└──────────────────────────────────────┘
```

**Vertical value (narrow tile, horizontal):**
```
┌─────────────┐
│ 板块名  +125│ ← name left, value vertical-rl right
│         .5亿│
│              │
│       +2.35% │ ← badge bottom-right
└─────────────┘
```

**Vertical text (tall tile, h > w × 1.2):**
```
┌──────┐
│ 板  +│ ← both name and value vertical-rl
│ 块  1│
│ 名  2│
│ 称  5│
│    .5│
│    亿│
│      │
│+2.35%│ ← badge bottom-right
└──────┘
```

### Typography (Continuous Scaling)

Font properties interpolate based on `sqrt(tileArea)`:

| Property | Smallest tile | Largest tile |
|----------|--------------|--------------|
| Name font-size | 9px | 28px |
| Name font-weight | 400 (regular) | 700 (bold) |
| Value font-size | 8px | 13px |
| Value font-weight | 400 | 400 |
| Content padding | 4px | 16px |

**Name width constraint:** `maxNameSize = (0.5 × textFlowDim) / charCount` with 9px floor. Prevents long names from overflowing.

### No Icon

Icons removed from tile names. Rationale:
- Icons at small tile sizes were disproportionate and visually noisy
- Sector names in Chinese are self-explanatory (电子, 银行, 食品饮料)
- Simplifies layout and improves text readability
- Matches Binance heatmap reference (text-only tiles)

### Capital Flow Value

- Format: `+125.5亿` or `-45.2亿` (always show sign)
- Color: `rgba(255, 255, 255, 0.7)` (secondary white)
- Positioned right side of header, flex-shrink: 0
- **Compact mode**: When vertical value would overlap badge, drops "亿" unit → `+125.5`
- **Rationale**: Users already know the unit from larger tiles

---

## Implementation

### Component Structure

```typescript
export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  const t = getTileScale(width, height);  // 0..1 based on sqrt(area)
  const nameSize = lerp(9, 28, t);
  const nameWeight = Math.round(lerp(400, 700, t));
  const valueSize = lerp(8, 13, t);
  const pad = lerp(4, 16, t);

  const flowSign = entity.capitalFlow > 0 ? '+' : '';

  return (
    <div className="tile" style={{ /* tile shell */ }}>
      <div className="tile-content" style={{ padding: pad }}>
        {/* Header: name (left) + value (right) */}
        <div className="tile-header">
          <div className="tile-name" style={{
            fontSize: nameSize,
            fontWeight: nameWeight,
            color: 'rgba(255, 255, 255, 0.95)',
          }}>
            {entity.name}
          </div>
          <span className="tile-value" style={{
            fontSize: valueSize,
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            {flowSign}{entity.capitalFlow}亿
          </span>
        </div>

        {/* Sparkline (conditional) */}
        {/* Badge (absolute positioned, see Task 04) */}
      </div>
    </div>
  );
}
```

### CSS

```css
.tile-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.tile-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
}

.tile-value {
  white-space: nowrap;
  flex-shrink: 0;
}

/* Vertical value: when horizontal header doesn't fit */
.tile.vertical-value .tile-value {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
.tile.vertical-value .tile-header {
  align-items: flex-start;  /* Top-aligned to save space */
}

/* Vertical text: tall tiles (h > w × 1.2) */
.tile.vertical-text .tile-header {
  align-items: flex-start;
  flex: 1;
}
.tile.vertical-text .tile-name {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  max-height: 100%;
}
.tile.vertical-text .tile-value {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  max-height: 100%;
}
```

---

## Acceptance Criteria

✅ **Name Display:**
- [ ] Chinese characters render correctly (e.g., 电子, 银行, 石油石化)
- [ ] Font size scales continuously: 9px (smallest) → 28px (largest)
- [ ] Font weight scales continuously: 400 (smallest) → 700 (largest)
- [ ] Color: `rgba(255, 255, 255, 0.95)` (white)
- [ ] Long names truncate with ellipsis (single line)
- [ ] Width constraint: `maxNameSize = (0.5 × textFlowDim) / charCount`

✅ **Value Display:**
- [ ] Format: `+125.5亿` or `-45.2亿` (1 decimal, always sign)
- [ ] Font size: 8px (smallest) → 13px (largest)
- [ ] Color: `rgba(255, 255, 255, 0.7)` (secondary white)
- [ ] Right-aligned in header
- [ ] Compact mode: drops "亿" when vertical value would overlap badge

✅ **Vertical Modes:**
- [ ] `vertical-value`: value goes `writing-mode: vertical-rl` when horizontal doesn't fit
- [ ] `vertical-text`: both name and value go vertical when `h > w × 1.2`
- [ ] Both modes: top-aligned (`align-items: flex-start`)
- [ ] Value always to the RIGHT of name (never below)

✅ **No Icon:**
- [ ] No Lucide icon rendered
- [ ] No Lucide CDN dependency
- [ ] Layout is text-only

---

## References

- **Font Scale Config:** [Section 7 → Theme → Task 01](../../../7-implementation/threads/theme/tasks/01-theme-config.md)
- **Badge (涨跌幅):** [Task 04: Badge Layout](./04-lower-panel.md)
- **Color System:** [Task 05: Dynamic Color System](./05-dynamic-color.md)
