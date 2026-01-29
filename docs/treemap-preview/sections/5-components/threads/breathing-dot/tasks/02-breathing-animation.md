# Task: Breathing Animation

Scale pulse animation that grows and shrinks the dot based on attention level, creating a "breathing" visual effect.

---

## Design

### Purpose
Animate the core dot with a pulsing scale effect where animation speed and intensity are controlled by `attentionLevel` prop.

### Animation Specifications

**Keyframes:**
```
0%   → scale(1.0)    // Normal size
50%  → scale(1.2)    // Expanded (20% larger)
100% → scale(1.0)    // Back to normal
```

**Timing:**
- Easing: `ease-in-out` (smooth acceleration and deceleration)
- Direction: `alternate` (ping-pong between start and end)
- Iteration: `infinite` (continuous loop)
- Duration: Variable based on attention level (see mapping below)

### Attention Level Mapping

**AttentionLevel → Animation Duration:**

| Attention | Duration | Speed | Use Case |
|-----------|----------|-------|----------|
| 0-20 | 3000ms | Slow | Low activity sectors |
| 21-40 | 2500ms | Moderate | Average activity |
| 41-60 | 2000ms | Medium | Above average |
| 61-80 | 1500ms | Fast | High activity |
| 81-100 | 1000ms | Very fast | Extreme attention |

**Formula:**
```typescript
// Linear interpolation: 3000ms (low) → 1000ms (high)
duration = 3000 - (attentionLevel / 100) * 2000;

// Examples:
// attentionLevel = 0   → 3000ms
// attentionLevel = 50  → 2000ms
// attentionLevel = 100 → 1000ms
```

### Visual Effect

```
Low Attention (20):
  ●     ◉     ●     ◉     (slow pulse, 3s cycle)

High Attention (80):
  ●◉●◉●◉●◉  (fast pulse, 1.5s cycle)
```

---

## Implementation

### Animation Keyframes

```css
/* apps/preview/src/app/styles.css */

@keyframes breathing-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```

### Duration Calculation Function

```typescript
// apps/preview/src/app/utils/animationUtils.ts

/**
 * Calculate breathing animation duration based on attention level
 *
 * @param attentionLevel - Attention value (0-100)
 * @returns Animation duration in milliseconds
 */
export function getBreathingDuration(attentionLevel: number): number {
  // Clamp to 0-100 range
  const clamped = Math.max(0, Math.min(100, attentionLevel));

  // Linear interpolation: 3000ms → 1000ms
  const duration = 3000 - (clamped / 100) * 2000;

  return duration;
}
```

### Component Integration

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
  // Calculate animation duration
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

      {/* Ripple layers will be added in Task 03 */}
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

/* Breathing animation */
@keyframes breathing-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Core dot with animation */
.breathing-dot > div:first-child {
  background-color: #facc15;
  opacity: 0.9;
  transform-origin: center;
  will-change: transform;
}
```

---

## Acceptance Criteria

✅ **Animation Behavior:**
- [ ] Dot scales from 1.0 to 1.2 and back to 1.0
- [ ] Animation loops infinitely without interruption
- [ ] Easing is smooth (ease-in-out curve)
- [ ] Transform origin is center (scales uniformly)

✅ **Attention Level Mapping:**
- [ ] attentionLevel = 0: 3000ms duration (3 seconds per cycle)
- [ ] attentionLevel = 50: 2000ms duration (2 seconds per cycle)
- [ ] attentionLevel = 100: 1000ms duration (1 second per cycle)
- [ ] Duration decreases linearly with increasing attention
- [ ] Values clamped to 0-100 range (no negative or >100)

✅ **Performance:**
- [ ] Uses GPU-accelerated `transform: scale()` (not width/height)
- [ ] `will-change: transform` hint applied
- [ ] No layout thrashing (animation doesn't trigger reflow)
- [ ] Maintains 60fps on all devices
- [ ] No janky animation at low attention levels

✅ **Visual Quality:**
- [ ] Scaling is symmetrical (equal in all directions)
- [ ] No distortion or blurriness during animation
- [ ] Smooth transitions between scale states
- [ ] Animation visible but not distracting

✅ **Edge Cases:**
- [ ] attentionLevel = 0: Animation still runs (3000ms)
- [ ] attentionLevel = 100: Animation runs fast (1000ms)
- [ ] Negative values: Clamped to 0 (3000ms)
- [ ] Values > 100: Clamped to 100 (1000ms)
- [ ] Decimal values: Handled correctly (e.g., 67.5 → 1650ms)

---

## References

- **Dot Base:** [Task 01: Dot Base Structure & Styling](./01-dot-base.md)
- **Ripple Effect:** [Task 03: Ripple Effect](./03-ripple-effect.md)
- **Animation Principles:** [Section 6 → Visual Design → Animations](../../../../6-visual-design/threads/animations/index.md)

---

## Technical Notes

**Why scale() instead of width/height animation?**

```css
/* ❌ Bad: Triggers layout recalculation */
@keyframes bad-pulse {
  0% { width: 7px; height: 7px; }
  50% { width: 8.4px; height: 8.4px; }
  100% { width: 7px; height: 7px; }
}

/* ✅ Good: GPU-accelerated, no reflow */
@keyframes breathing-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

**Why linear duration mapping?**

```typescript
// Linear is intuitive and predictable
duration = 3000 - (attentionLevel / 100) * 2000;

// Alternative: Exponential (too aggressive)
duration = 3000 * Math.pow(0.5, attentionLevel / 50);
// Problem: High attention values become too fast to perceive

// Alternative: Logarithmic (too conservative)
duration = 3000 - Math.log(attentionLevel + 1) * 500;
// Problem: Not enough visual difference between levels

// Linear strikes the best balance between perception and usability
```

**Transform origin importance:**

```css
/* ❌ Without transform-origin: scales from top-left */
.dot {
  transform: scale(1.2);
  /* Visually shifts position during animation */
}

/* ✅ With transform-origin: scales from center */
.dot {
  transform: scale(1.2);
  transform-origin: center;
  /* Stays centered, expands uniformly */
}
```

**will-change optimization:**

```css
.breathing-dot > div:first-child {
  will-change: transform;
  /* Tells browser to optimize this element for transform animations */
  /* Creates separate compositor layer for smooth 60fps */
}
```

**Performance budget:**

```
31 sectors × 7px dot × breathing animation = manageable cost

GPU handles all transforms in parallel
No CPU-bound layout recalculations
Target: 60fps on average laptops
Measured: ~0.1ms per frame for all dots combined
```

**Why 1.2 scale factor (20% growth)?**

```
Too small (1.1): Barely noticeable, defeats purpose
Too large (1.5): Overly aggressive, distracting
1.2 (20%): Sweet spot - visible but subtle

At 7px: 7 × 1.2 = 8.4px (1.4px growth radius)
Perceptible without dominating visual attention
```
