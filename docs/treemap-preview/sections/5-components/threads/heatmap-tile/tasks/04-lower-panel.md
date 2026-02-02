# Task: Badge (涨跌幅) Layout

Change percentage badge absolutely positioned at bottom-right corner of tile, with area-scaled visual prominence.
---

## Design

### Purpose
Display change percentage as a badge element at the tile's bottom-right corner. Visual prominence scales with tile area — large tiles have strong badge styling, small tiles have subtle styling.

### Layout

```
┌──────────────────────────────────────┐
│ tile-header (name + value)           │
│                                      │
│ sparkline (if visible)               │
│                                      │
│                        ┌───────────┐ │
│                        │  +2.35%   │ │ ← absolute bottom-right
│                        └───────────┘ │
└──────────────────────────────────────┘
```

### Badge Styling

```css
.tile-badge {
  position: absolute;
  bottom: var(--tile-pad);
  right: calc(var(--tile-pad) - var(--badge-pad-h));  /* Text right-aligns with value above */

  padding: var(--badge-pad);           /* 2-4.5px vertical, 4-6px horizontal */
  border-radius: 6px;
  background: rgba(255, 255, 255, var(--badge-bg-alpha));
  border: 0.5px solid rgba(255, 255, 255, var(--badge-border-alpha));
  box-shadow: 0px 2px 8px rgba(0, 0, 0, var(--badge-shadow-alpha));

  font-weight: 600;
  font-size: var(--tile-badge-size);   /* 7-12px */
  color: rgba(255, 255, 255, 0.95);
}
```

### Prominence Gradient (Area-Scaled)

All CSS variables interpolate via `sqrt(area)` normalization (t = 0..1):

| CSS Variable | Smallest tile (t=0) | Largest tile (t=1) | Effect |
|-------------|---------------------|-------------------|--------|
| `--badge-bg-alpha` | 0.03 | 0.15 | Background visibility |
| `--badge-border-alpha` | 0.06 | 0.25 | Border visibility |
| `--badge-shadow-alpha` | 0.05 | 0.3 | Shadow depth |
| `--badge-pad` (vertical) | 2px | 4.5px | Internal spacing |
| `--badge-pad-h` (horizontal) | 4px | 6px | Internal spacing |
| `--tile-badge-size` | 7px | 12px | Font size |

**Result**: Large tiles have prominent, clearly visible badges. Small tiles have nearly invisible badges that don't compete for attention.

### Right-Alignment with Value

The badge `right` position uses `calc(var(--tile-pad) - var(--badge-pad-h))` to offset by the badge's own horizontal padding. This makes the badge **text** right edge align with the value **text** right edge in the header above — not the badge box edge.

### No Arrows

Lucide arrows (ArrowUp/ArrowDown) were removed:
- Sign in the percentage text already indicates direction (+2.35% vs -1.87%)
- Arrow anti-fusion (drop-shadow on colored backgrounds) is no longer needed
- Simplifies DOM and removes CDN dependency

### Chinese Market Convention

- Positive change: Red hue tile background (涨)
- Negative change: Green hue tile background (跌)
- Badge text is always white — color convention is expressed through tile background, not badge text

---

## Implementation

```typescript
// Badge prominence in applyAdaptiveStyles()
const t = getTileScale(w, h);
const badgeSize = lerp(7, 12, t);
const badgeBgAlpha = lerp(0.03, 0.15, t);
const badgeBorderAlpha = lerp(0.06, 0.25, t);
const badgeShadowAlpha = lerp(0.05, 0.3, t);
const badgePadV = lerp(2, 4.5, t);
const badgePadH = lerp(4, 6, t);

el.style.setProperty('--tile-badge-size', badgeSize + 'px');
el.style.setProperty('--badge-bg-alpha', badgeBgAlpha);
el.style.setProperty('--badge-border-alpha', badgeBorderAlpha);
el.style.setProperty('--badge-shadow-alpha', badgeShadowAlpha);
el.style.setProperty('--badge-pad', `${badgePadV}px ${badgePadH}px`);
el.style.setProperty('--badge-pad-h', badgePadH + 'px');
```

### HTML Template

```html
<span class="tile-badge">+2.35%</span>
```

### Visibility

- Badge hidden when `minDim < 50px` (class `hide-badge`)
- Badge always visible otherwise, with scaled prominence

---

## Acceptance Criteria

✅ **Position:**
- [ ] Absolutely positioned at bottom-right of tile
- [ ] `bottom: var(--tile-pad)`, `right: calc(var(--tile-pad) - var(--badge-pad-h))`
- [ ] Badge text right edge aligns with value text right edge above

✅ **Prominence Gradient:**
- [ ] Background alpha: 0.03 (small) → 0.15 (large)
- [ ] Border alpha: 0.06 (small) → 0.25 (large)
- [ ] Shadow alpha: 0.05 (small) → 0.3 (large)
- [ ] Padding: 2-4.5px vertical, 4-6px horizontal
- [ ] Font size: 7px (small) → 12px (large)
- [ ] Visual: large tiles have prominent badge, small tiles have subtle badge

✅ **Format:**
- [ ] `+2.35%` or `-1.87%` (2 decimal places, always sign)
- [ ] Font weight: 600
- [ ] Color: `rgba(255, 255, 255, 0.95)` (white)
- [ ] Border radius: 6px

✅ **Visibility:**
- [ ] Hidden when tile min dimension < 50px
- [ ] No arrow icons (removed)

---

## References

- **Header Row:** [Task 03: Header Row Layout](./03-upper-panel.md)
- **Tile Styling:** Section 6 → Visual Design
- **Theme Config:** [Section 7 → Theme → Task 01](../../../7-implementation/threads/theme/tasks/01-theme-config.md)
