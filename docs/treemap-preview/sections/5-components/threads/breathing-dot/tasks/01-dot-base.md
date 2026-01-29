# Task: Dot Base Structure & Styling

Core circle element with 7px diameter, yellow color, and flexible positioning system.

---

## Design

### Purpose
Create foundational dot element that serves as the base for breathing and ripple animations.

### Visual Specifications

**Dimensions:**
- Diameter: 7px (default, configurable via `size` prop)
- Border radius: 50% (perfect circle)
- Display: `block` or `inline-block` depending on context

**Color:**
- Fill: `#facc15` (yellow-400 in Tailwind)
- Opacity: 90% (`bg-yellow-400/90`)
- No border (solid fill only)

**Positioning:**
- Default: Relative positioning (for use in flex containers)
- Option: Absolute positioning when `className` includes positioning classes
- Z-index: Inherits from parent (no explicit z-index on dot itself)

### Layout Integration

**In HeatMapTile Upper Panel:**
```
┌──────────────────────────────────────┐
│ [Icon] Name...           [Dot] 8px→ │
│                            ↑         │
│                      ml-auto pushes  │
│                      to right edge   │
└──────────────────────────────────────┘
```

**In Sparkline:**
```
┌──────────────────────────────────────┐
│     /\      /\                       │
│    /  \    /  \     [Dot]            │ ← Positioned at last data point
│   /    \  /    \___/                 │
└──────────────────────────────────────┘
```

---

## Implementation

### Component Base Structure

```typescript
// apps/preview/src/app/components/BreathingDot.tsx

import { HTMLAttributes } from 'react';

interface BreathingDotProps extends HTMLAttributes<HTMLDivElement> {
  /** Attention level (0-100) - controls animation intensity */
  attentionLevel: number;

  /** Additional CSS classes */
  className?: string;

  /** Dot size in pixels (default: 7) */
  size?: number;
}

export function BreathingDot({
  attentionLevel,
  className = '',
  size = 7,
  ...props
}: BreathingDotProps) {
  return (
    <div
      className={`breathing-dot ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      {...props}
    >
      {/* Core dot */}
      <div
        className="absolute inset-0 rounded-full bg-yellow-400/90"
        aria-hidden="true"
      />

      {/* Ripple layers will be added in Task 03 */}
      {/* Animation will be added in Task 02 */}
    </div>
  );
}
```

### Base Styles

```css
/* apps/preview/src/app/styles.css */

.breathing-dot {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

/* Core dot - no animation yet (added in Task 02) */
.breathing-dot > div:first-child {
  background-color: #facc15;
  opacity: 0.9;
}
```

### Usage Examples

**In HeatMapTile (ml-auto positioning):**
```typescript
<BreathingDot
  attentionLevel={entity.attentionLevel}
  className="ml-auto"
/>
```

**In Sparkline (absolute positioning at endpoint):**
```typescript
<BreathingDot
  attentionLevel={attentionLevel}
  className="absolute"
  style={{ right: 0, top: `${lastPointY}px` }}
  size={6}  // Slightly smaller for sparkline
/>
```

**Standalone (default size):**
```typescript
<BreathingDot attentionLevel={75} />
```

---

## Acceptance Criteria

✅ **Dot Rendering:**
- [ ] Dot renders as perfect circle (border-radius: 50%)
- [ ] Default diameter is exactly 7px
- [ ] Custom `size` prop overrides default size
- [ ] Yellow color matches #facc15 (Tailwind yellow-400)
- [ ] Opacity is 90% (semi-transparent)

✅ **Positioning:**
- [ ] Default: Relative positioning allows flex layout integration
- [ ] Supports `className` for custom positioning (absolute, fixed, etc.)
- [ ] Works with `ml-auto` to push to right edge in flex containers
- [ ] Does not cause layout shift in parent container

✅ **Props Interface:**
- [ ] `attentionLevel` prop accepted (0-100 number)
- [ ] `className` prop merged with base classes
- [ ] `size` prop controls both width and height
- [ ] Spreads remaining props to root div (`...props`)
- [ ] TypeScript types are correct and strict

✅ **Accessibility:**
- [ ] `aria-hidden="true"` on core dot (decorative only)
- [ ] No critical information conveyed solely through dot
- [ ] Does not interfere with screen readers

✅ **Visual Quality:**
- [ ] Dot edges are smooth (anti-aliased)
- [ ] No pixelation at 7px size
- [ ] Renders correctly at different sizes (6px, 7px, 8px)
- [ ] Color consistent across browsers

---

## References

- **HeatMapTile Integration:** [Task 03: Upper Panel Layout](../../heatmap-tile/tasks/03-upper-panel.md)
- **Sparkline Integration:** [Section 5 → Components → Sparkline](../../sparkline/index.md)
- **Color System:** [Section 6 → Visual Design → Color System](../../../../6-visual-design/threads/color-system/index.md)

---

## Technical Notes

**Why 90% opacity instead of solid?**

```
Solid yellow (#facc15) can appear too harsh against dark backgrounds.
90% opacity provides subtle blending with background layers.
Creates softer visual integration with glassmorphism tiles.
```

**Why relative positioning as default?**

```typescript
// ✅ Works in flex containers without extra wrapper
<div className="flex items-center">
  <Icon />
  <Name />
  <BreathingDot className="ml-auto" />  {/* Pushes to right */}
</div>

// ❌ Absolute positioning would require wrapper
<div className="flex items-center">
  <Icon />
  <Name />
  <div className="ml-auto relative">
    <BreathingDot className="absolute" />  {/* Needs wrapper */}
  </div>
</div>
```

**Size prop design:**

```typescript
// Default 7px for most use cases
<BreathingDot attentionLevel={50} />  // 7px

// Smaller in sparklines (less visual weight)
<BreathingDot attentionLevel={50} size={6} />  // 6px

// Larger for emphasis (if needed)
<BreathingDot attentionLevel={80} size={9} />  // 9px
```

**Component extends HTMLAttributes:**

Allows passing standard div props like `onClick`, `onMouseEnter`, `data-*` attributes:

```typescript
<BreathingDot
  attentionLevel={60}
  onClick={() => console.log('Clicked')}
  data-testid="tile-indicator"
/>
```
