# Task: Dual Background Layers

Implement glassmorphism border gradient using dual backgrounds method to preserve border-radius.

---

## Design

### Purpose
Create visually distinct gradient borders on glassmorphic tiles while maintaining smooth rounded corners. Traditional `border-image` breaks `border-radius`, so we use layered backgrounds instead.

### Visual Requirements

**Border Layer (Outer):**
- Gradient: 135° linear gradient
- Start color (top-left): `rgba(255, 255, 255, 0.2)` - Brighter
- End color (bottom-right): `rgba(255, 255, 255, 0.05)` - Dimmer
- Simulates light source from top-left

**Content Layer (Inner):**
- Background: Dynamic color based on entity.changePercent
- See [Task 05: Dynamic Color System](./05-dynamic-color.md) for color calculation
- Applied with `padding-box` clip

**Border Properties:**
- Width: 1px (exposed by outer layer padding)
- Radius: 8px (rounded corners)
- Must be `transparent` for layered backgrounds to show through

### Glassmorphism Effect
- Backdrop blur: 12px
- Creates "frosted glass" appearance
- Content behind tile is visible but blurred

---

## Implementation

### Component Structure

```typescript
// apps/preview/src/app/components/HeatMapTile.tsx

import { getTileBackgroundColor } from '../utils/colorUtils';

export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  const bgColor = getTileBackgroundColor(entity.changePercent);

  return (
    <div className="absolute ...">
      {/* Outer layer: Gradient border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
          padding: '1px',  // Border thickness
        }}
      >
        {/* Inner layer: Content + glassmorphism */}
        <div
          className="w-full h-full rounded-lg backdrop-blur-md"
          style={{
            background: bgColor,  // Dynamic color from utils
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Upper Panel, Lower Panel, etc. (see other tasks) */}
        </div>
      </div>
    </div>
  );
}
```

### CSS Utilities

```css
/* apps/preview/src/app/globals.css */

/* Glassmorphism base */
.glass-tile {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);  /* Safari support */
}

/* Fallback for browsers without backdrop-filter support */
@supports not (backdrop-filter: blur(12px)) {
  .glass-tile {
    background: rgba(17, 24, 39, 0.95) !important;  /* Opaque fallback */
  }
}
```

### Alternative Method (Pseudo-Element)

For more flexibility, an alternative approach using `::before` pseudo-element:

```typescript
<div
  className="relative rounded-lg backdrop-blur-xl"
  style={{ background: bgColor }}
>
  {/* Gradient border via ::before pseudo-element */}
  <div
    className="pointer-events-none absolute inset-0 rounded-lg border border-transparent"
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1)) border-box',
      mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      WebkitMaskComposite: 'xor',
    }}
  />

  {/* Content */}
  <div className="relative z-10">
    {children}
  </div>
</div>
```

---

## Acceptance Criteria

✅ **Visual Correctness:**
- [ ] Border gradient visible: bright top-left (rgba(255,255,255,0.2)) → dim bottom-right (rgba(255,255,255,0.05))
- [ ] Border gradient angle is 135° (diagonal from top-left to bottom-right)
- [ ] Border width is exactly 1px
- [ ] Border-radius is 8px with perfectly smooth corners (no sharp edges)

✅ **Glassmorphism Effect:**
- [ ] Backdrop blur is 12px (content behind tile is blurred)
- [ ] Dynamic background color shows through inner layer
- [ ] Color changes smoothly when entity.changePercent updates

✅ **Browser Compatibility:**
- [ ] Works in Chrome/Edge (full support)
- [ ] Works in Firefox (full support)
- [ ] Works in Safari (with `-webkit-` prefixes)
- [ ] Fallback opaque background for unsupported browsers

✅ **Performance:**
- [ ] Backdrop-filter does not cause layout thrashing
- [ ] No visible lag when scrolling through tiles
- [ ] GPU acceleration enabled (will-change: transform if needed)

---

## References

- **Color Calculation:** [Task 05: Dynamic Color System](./05-dynamic-color.md)
- **Glassmorphism Specs:** [Section 6: Visual Design → Glassmorphism](../../../6-visual-design/threads/glassmorphism/index.md)
- **CSS Utilities:** [Section 7: Implementation → Theme](../../../7-implementation/threads/theme/index.md)

---

## Technical Notes

**Why Dual Backgrounds?**
```css
/* ❌ WRONG: border-image breaks border-radius */
border-image: linear-gradient(135deg, white, gray);
border-radius: 8px;  /* Ignored! Sharp corners appear */

/* ✅ CORRECT: Dual backgrounds preserve border-radius */
background:
  linear-gradient(135deg, ...) border-box,
  linear-gradient(...) padding-box;
border: 1px solid transparent;
border-radius: 8px;  /* Works perfectly! */
```

**Browser Support:**
- Dual backgrounds: All modern browsers (IE11+)
- Backdrop-filter: Chrome 76+, Safari 9+, Firefox 103+
- Fallback gracefully for older browsers
