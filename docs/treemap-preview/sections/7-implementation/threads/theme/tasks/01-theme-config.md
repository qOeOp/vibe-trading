# Task: Theme Config

Light background theme with 7-stop color ramp and continuous typography scaling.
---

## Implementation

```typescript
// apps/preview/src/app/config/theme.ts

export const theme = {
  colors: {
    background: '#ffffff',         // White page background
    surface: '#ffffff',            // Container background (same as page)

    // Text colors (on solid-colored tile backgrounds)
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',   // Tile name
      secondary: 'rgba(255, 255, 255, 0.7)',  // Tile value
      badge: 'rgba(255, 255, 255, 0.95)',     // Badge text (white)
    },

    // Page-level text (on white background)
    pageText: {
      primary: 'rgba(0, 0, 0, 0.85)',
      secondary: '#999999',
    },

    // 7-stop tile color ramp (Binance-style)
    tileRamp: [
      '#0B8C5F',  // deep green (< -5%)
      '#2EBD85',  // medium green (-2% ~ -5%)
      '#58CEAA',  // light green (-0.5% ~ -2%)
      '#76808E',  // gray (±0.5%)
      '#E8626F',  // light red (+0.5% ~ +2%)
      '#F6465D',  // medium red (+2% ~ +5%)
      '#CF304A',  // deep red (> +5%)
    ],

    // Sparkline
    sparkline: {
      up: '#F6465D',
      down: '#2EBD85',
    },

    focus: '#6366f1',
    warning: '#facc15',
  },

  // Continuous font scaling (Binance-style)
  // Interpolated by sqrt(tileArea) from min→max
  fontScale: {
    name:    { min: 9,   max: 28  },  // px
    value:   { min: 8,   max: 13  },  // px
    badge:   { min: 7,   max: 12  },  // px (smaller than value for visual balance)
    weight:  { min: 400, max: 700 },  // font-weight (name only)
    padding: { min: 4,   max: 16  },  // px
  },

  // Badge prominence gradient (area-scaled CSS variables)
  badgeScale: {
    bgAlpha:     { min: 0.03, max: 0.15 },  // background opacity
    borderAlpha: { min: 0.06, max: 0.25 },  // border opacity
    shadowAlpha: { min: 0.05, max: 0.3  },  // shadow opacity
    padV:        { min: 2,    max: 4.5  },   // px vertical padding
    padH:        { min: 4,    max: 6    },   // px horizontal padding
  },

  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
  },

  borderRadius: {
    container: '16px',  // Outer container corners
    tile: '0px',        // Internal tiles (square edges)
    // Corner tiles get container radius on outer-facing corners only
    badge: '6px',
  },

  shadow: {
    tile: '0px 8px 32px rgba(0, 0, 0, 0.37)',
    badge: '0px 2px 8px rgba(0, 0, 0, 0.3)',
  },
};
```

---

## Acceptance Criteria

✅ **Theme:**
- [ ] All design tokens documented
- [ ] White background theme (not dark)
- [ ] 7-stop solid color ramp integrated
- [ ] Continuous font scale ranges defined
- [ ] Border radius: container 16px, tiles 0px (outer corners only)
