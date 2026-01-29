# Thread: HeatMap Tile

Glassmorphism tile component with 50/50 panel split, dynamic 3-zone coloring, dual background borders, and 3D hover interactions.

---

## Tasks

### [1. Tile Shell & Positioning](./tasks/01-tile-shell.md)
Absolute positioning wrapper with hover lift animation (-2px translateY).

### [2. Dual Background Layers](./tasks/02-dual-backgrounds.md)
Gradient border layer + dynamic color content layer using dual backgrounds method.

### [3. Upper Panel Layout](./tasks/03-upper-panel.md)
50% height panel with Icon (8px left) + Name (4px gap) + BreathingDot flex layout.

### [4. Lower Panel Layout](./tasks/04-lower-panel.md)
50% height panel with Capital Flow + Change% + Arrow, right-bottom aligned (8px padding).

### [5. Dynamic Color System](./tasks/05-dynamic-color.md)
3-zone coloring function based on changePercent: dead/active/extreme protection.

### [6. Sparkline Integration](./tasks/06-sparkline-integration.md)
Conditional sparkline rendering on hover for tiles > 120×80px.

### [7. Adaptive Content Scaling](./tasks/07-adaptive-scaling.md)
Content size/visibility adjustments based on tile dimensions.

---

## Component Structure

```tsx
<div className="tile-shell">  {/* Task 1: Absolute positioning */}
  <div className="gradient-border">  {/* Task 2: Dual backgrounds */}
    <div className="glass-content">
      {/* Task 3: Upper Panel */}
      <div className="upper-panel">
        <Icon /> <Name /> <BreathingDot />
      </div>

      {/* Task 4: Lower Panel */}
      <div className="lower-panel">
        {/* Task 6: Sparkline (conditional) */}
        <Sparkline />

        <CapitalFlow />
        <ChangePercent + Arrow />
      </div>
    </div>
  </div>
</div>
```

**Reference:** See [Section 6: Visual Design](../../6-visual-design/index.md) for glassmorphism specs.
