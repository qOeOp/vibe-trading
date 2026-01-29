# Thread: BreathingDot Component

Small pulsing indicator dot with ripple effect, used to show attention level on tiles and sparkline endpoints.

---

## Purpose

Visual attention indicator that pulses at variable intensity based on `attentionLevel` prop, providing subtle real-time feedback without overwhelming the interface.

## Component Location

```
apps/preview/src/app/components/BreathingDot.tsx
```

## Usage Contexts

1. **HeatMapTile Upper Panel** - Right-aligned indicator showing sector attention
2. **Sparkline Endpoint** - Dot at end of sparkline graph
3. **Future Use** - Any component needing attention-level visualization

## Component Anatomy

```
┌─────────────────────────────┐
│  [Ripple Ring 2] (fading)  │
│    [Ripple Ring 1]          │
│      [Core Dot]             │  ← 7px yellow circle
│        ↑                    │
│   Breathing pulse           │
│   (scale 1.0 ↔ 1.2)         │
└─────────────────────────────┘
```

## Task Breakdown

### [Task 01: Dot Base Structure & Styling](./tasks/01-dot-base.md)
- Circle element with 7px diameter
- Yellow color (#facc15)
- Absolute/relative positioning options
- Basic props interface

### [Task 02: Breathing Animation](./tasks/02-breathing-animation.md)
- Scale pulse keyframes (1.0 → 1.2 → 1.0)
- CSS animation timing
- Attention-level based duration mapping

### [Task 03: Ripple Effect](./tasks/03-ripple-effect.md)
- Two concentric expanding rings
- Fade-out opacity animation
- Synchronized timing with breathing pulse

### [Task 04: Attention Level Integration](./tasks/04-attention-level.md)
- AttentionLevel prop (0-100 scale)
- Animation intensity mapping
- Performance optimization (GPU acceleration)

---

## Props Interface

```typescript
interface BreathingDotProps {
  attentionLevel: number;  // 0-100
  className?: string;      // Additional Tailwind classes
  size?: number;           // Default: 7px
}
```

## Design Principles

**Subtlety:** Animation should be noticeable but not distracting
**Performance:** GPU-accelerated transforms, no layout thrashing
**Accessibility:** Purely decorative, does not convey critical information
**Scalability:** Can be used at different sizes (default 7px)

---

## References

- **Used in HeatMapTile:** [Section 5 → Components → HeatMapTile → Task 03](../heatmap-tile/tasks/03-upper-panel.md)
- **Used in Sparkline:** [Section 5 → Components → Sparkline](../sparkline/index.md)
- **Animation Specs:** [Section 6 → Visual Design → Animations](../../../6-visual-design/threads/animations/index.md)

---

## Technical Notes

**Why 7px diameter?**
- Small enough to be subtle
- Large enough to be visible at all tile sizes
- Matches design system spacing units

**Why yellow (#facc15)?**
- High contrast against all background colors (gray, red, green)
- Neutral color (not tied to positive/negative sentiment)
- Stands out without being aggressive

**Ripple vs Breathing:**
- Breathing: Core dot scales in/out (1.0 → 1.2 → 1.0)
- Ripple: Rings expand outward and fade (0% → 100% size, 100% → 0% opacity)
- Both synchronized for cohesive visual effect
