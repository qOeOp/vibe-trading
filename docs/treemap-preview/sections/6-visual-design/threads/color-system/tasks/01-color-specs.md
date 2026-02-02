# Task: Color Specifications

Complete color system including base palette and 7-stop solid color ramp.

---

## Base Palette

```typescript
const colors = {
  // Backgrounds
  background: '#ffffff',               // White (page and container)

  // Text (on colored tile backgrounds)
  textPrimary: 'rgba(255, 255, 255, 0.95)',   // White (tile name)
  textSecondary: 'rgba(255, 255, 255, 0.7)',  // White 70% (tile value)
  textTertiary: 'rgba(255, 255, 255, 0.6)',   // White 60% (badge on neutral)

  // 7-Stop Solid Color Ramp (Chinese Market Convention)
  // Red = 涨 (positive), Green = 跌 (negative)
  tileColors: [
    '#0B8C5F',  // deep green (< -5%)
    '#2EBD85',  // medium green (-2% ~ -5%)
    '#58CEAA',  // light green (-0.5% ~ -2%)
    '#76808E',  // gray (±0.5%)
    '#E8626F',  // light red (+0.5% ~ +2%)
    '#F6465D',  // medium red (+2% ~ +5%)
    '#CF304A',  // deep red (> +5%)
  ],

  // Sparkline
  sparklineUp: '#F6465D',
  sparklineDown: '#2EBD85',

  // UI Accents
  focus: '#6366f1',             // indigo-500
  error: '#ef4444',             // red-500
};
```

---

## 7-Stop Solid Color Ramp

See complete implementation in:
[Section 5 → HeatMapTile → Task 05: Dynamic Color System](../../../../5-components/threads/heatmap-tile/tasks/05-dynamic-color.md)

**Mapping:**

| Index | changePercent | Hex | Visual |
|-------|--------------|-----|--------|
| 0 | < -5% | `#0B8C5F` | Deep Green |
| 1 | -2% ~ -5% | `#2EBD85` | Medium Green |
| 2 | -0.5% ~ -2% | `#58CEAA` | Light Green |
| 3 | ±0.5% | `#76808E` | Gray |
| 4 | +0.5% ~ +2% | `#E8626F` | Light Red |
| 5 | +2% ~ +5% | `#F6465D` | Medium Red |
| 6 | > +5% | `#CF304A` | Deep Red |

---

## Acceptance Criteria

✅ **Base Palette:**
- [ ] All base colors documented
- [ ] 7-stop ramp hex values specified
- [ ] Chinese market convention (red=up) enforced

✅ **Dynamic System:**
- [ ] 7 discrete color stops clearly defined
- [ ] All colors provide sufficient white text contrast
- [ ] Solid opaque colors (no alpha transparency)
