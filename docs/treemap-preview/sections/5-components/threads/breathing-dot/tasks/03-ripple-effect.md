# Task: Ripple Effect

Expanding concentric circles that radiate outward from the core dot and fade to transparency, synchronized with breathing animation.

---

## Design

### Purpose
Create visual ripple rings that expand outward from the dot center, adding depth and drawing attention to the pulsing indicator.

### Ripple Specifications

**Ring Count:** 2 concentric rings

**Ring 1 (Inner):**
- Start: 100% size (same as dot)
- End: 200% size (2× dot diameter)
- Opacity: 90% → 0%
- Delay: 0ms (starts immediately)

**Ring 2 (Outer):**
- Start: 100% size
- End: 250% size (2.5× dot diameter)
- Opacity: 70% → 0%
- Delay: 200ms (slightly delayed for wave effect)

**Animation:**
- Duration: Matches breathing animation (same as core dot)
- Easing: `ease-out` (fast start, slow end)
- Iteration: `infinite`
- Border: 1px solid yellow (#facc15)

### Visual Layering

```
┌───────────────────────────────┐
│  Ring 2 (outer, fading)       │ ← 250% size, 20% opacity
│    ┌─────────────────────┐    │
│    │ Ring 1 (inner)      │    │ ← 180% size, 40% opacity
│    │   ┌───────────┐     │    │
│    │   │ Core Dot  │     │    │ ← 100% size, 90% opacity
│    │   │  (pulse)  │     │    │
│    │   └───────────┘     │    │
│    └─────────────────────┘    │
└───────────────────────────────┘
         ↑
    Time progression →
```

### Timing Synchronization

Both ripple rings and core breathing animation use the same duration (based on `attentionLevel`), creating unified pulsing effect:

```
Core:   ●─────◉─────●─────◉─────●
Ring1:  ○────────○────────○
Ring2:    ○────────○────────○
         └─200ms delay
```

---

## Implementation

### Ripple Keyframes

```css
/* apps/preview/src/app/styles.css */

@keyframes ripple-expand {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes ripple-expand-outer {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
```

### Component with Ripples

```typescript
// apps/preview/src/app/components/BreathingDot.tsx

import { HTMLAttributes } from 'react';
import { getBreathingDuration } from '../utils/animationUtils';

interface BreathingDotProps extends HTMLAttributes<HTMLDivElement> {
  attentionLevel: number;
  className?: string;
  size?: number;
}

export function BreathingDot({
  attentionLevel,
  className = '',
  size = 7,
  ...props
}: BreathingDotProps) {
  const duration = getBreathingDuration(attentionLevel);

  return (
    <div
      className={`breathing-dot ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      {...props}
    >
      {/* Ripple Ring 2 (Outer) - with 200ms delay */}
      <div
        className="absolute inset-0 rounded-full border border-yellow-400"
        style={{
          animation: `ripple-expand-outer ${duration}ms ease-out infinite`,
          animationDelay: '200ms',
          transformOrigin: 'center',
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Ripple Ring 1 (Inner) */}
      <div
        className="absolute inset-0 rounded-full border border-yellow-400"
        style={{
          animation: `ripple-expand ${duration}ms ease-out infinite`,
          transformOrigin: 'center',
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Core dot with breathing animation */}
      <div
        className="absolute inset-0 rounded-full bg-yellow-400/90"
        style={{
          animation: `breathing-pulse ${duration}ms ease-in-out infinite`,
          transformOrigin: 'center',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
```

### Complete CSS

```css
/* apps/preview/src/app/styles.css */

.breathing-dot {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

/* Breathing animation (from Task 02) */
@keyframes breathing-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Ripple animations */
@keyframes ripple-expand {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes ripple-expand-outer {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

/* Ring styling */
.breathing-dot > div[class*="border"] {
  border-color: #facc15;
  border-width: 1px;
  pointer-events: none;
}
```

---

## Acceptance Criteria

✅ **Ripple Rendering:**
- [ ] Two concentric rings visible during animation
- [ ] Inner ring (Ring 1) expands to 200% size
- [ ] Outer ring (Ring 2) expands to 250% size
- [ ] Both rings start at 100% (same as dot size)
- [ ] Border color matches yellow (#facc15)

✅ **Opacity Fade:**
- [ ] Ring 1: Starts at 90% opacity, fades to 0%
- [ ] Ring 2: Starts at 70% opacity, fades to 0%
- [ ] Fade is smooth (no sudden jumps)
- [ ] Completely transparent by animation end

✅ **Timing:**
- [ ] Ring 1: No delay (starts immediately)
- [ ] Ring 2: 200ms delay (creates wave effect)
- [ ] Both rings use same duration as core breathing animation
- [ ] Animations loop infinitely
- [ ] Timing synchronized with core dot pulse

✅ **Visual Effect:**
- [ ] Ripples expand outward from center
- [ ] Rings maintain circular shape (no distortion)
- [ ] Smooth expansion (no jerky motion)
- [ ] Wave-like cascading effect from delay
- [ ] Ripples don't interfere with core dot visibility

✅ **Performance:**
- [ ] Uses GPU-accelerated transform + opacity
- [ ] `will-change` hints applied to ripple rings
- [ ] `pointer-events: none` prevents interaction interference
- [ ] No layout thrashing during animation
- [ ] Maintains 60fps with multiple dots on screen

✅ **Edge Cases:**
- [ ] Ripples scale correctly at different dot sizes (6px, 7px, 9px)
- [ ] Rings don't overflow parent container boundaries
- [ ] Animation works at both slow (3000ms) and fast (1000ms) durations
- [ ] Multiple BreathingDots don't synchronize unintentionally

---

## References

- **Breathing Animation:** [Task 02: Breathing Animation](./02-breathing-animation.md)
- **Dot Base:** [Task 01: Dot Base Structure & Styling](./01-dot-base.md)
- **Animation Specs:** [Section 6 → Visual Design → Animations](../../../../6-visual-design/threads/animations/index.md)

---

## Technical Notes

**Why two ripples instead of one?**

```
Single ripple: Simple but flat, lacks depth
Two ripples: Creates sense of wave propagation
Three+ ripples: Overly complex, diminishing returns

Two rings with 200ms delay creates optimal "radiating" effect
```

**Scale values (2× and 2.5×):**

```
At 7px dot size:
- Ring 1: 7px → 14px (expands 7px radius)
- Ring 2: 7px → 17.5px (expands 10.5px radius)

Visible but not overwhelming
Doesn't overlap with adjacent tiles
Creates clear visual hierarchy
```

**Why ease-out instead of ease-in-out?**

```css
/* ease-out: Fast expansion, slow fade */
@keyframes ripple-expand {
  0% { transform: scale(1); }       /* Fast start */
  100% { transform: scale(2); }     /* Slows down as it expands */
}

/* Creates "energy bursting out" feeling */
/* Matches physical ripple behavior (e.g., water droplet) */
```

**Pointer events handling:**

```css
.breathing-dot > div[class*="border"] {
  pointer-events: none;
  /* Ripple rings don't block clicks on parent elements */
  /* Allows clicking through rings to tiles/sparklines */
}
```

**Synchronized duration math:**

```typescript
// All three elements use same duration variable
const duration = getBreathingDuration(attentionLevel);

// Core dot: breathing-pulse
animation: `breathing-pulse ${duration}ms ease-in-out infinite`;

// Ring 1: ripple-expand
animation: `ripple-expand ${duration}ms ease-out infinite`;

// Ring 2: ripple-expand-outer (with delay)
animation: `ripple-expand-outer ${duration}ms ease-out infinite`;
animationDelay: '200ms';

// Result: All animations loop at same frequency
```

**Z-index layering (implicit):**

```tsx
// Render order = z-index order (no explicit z-index needed)
<>
  {/* Ring 2 - rendered first, appears behind */}
  <div className="ripple-outer" />

  {/* Ring 1 - middle layer */}
  <div className="ripple-inner" />

  {/* Core dot - rendered last, appears in front */}
  <div className="core-dot" />
</>
```

**Border width consideration:**

```
1px border at 7px dot size = 14% of diameter
Too thick: >1px looks chunky
Too thin: <1px hard to see at small sizes
1px optimal for visibility + elegance
```

**Opacity start values rationale:**

```
Ring 1: 90% (visible but not solid)
Ring 2: 70% (more transparent, recedes to background)

Creates depth perception through transparency gradient
Inner ring more prominent, outer ring more subtle
Both fade to 0% for clean disappearance
```
