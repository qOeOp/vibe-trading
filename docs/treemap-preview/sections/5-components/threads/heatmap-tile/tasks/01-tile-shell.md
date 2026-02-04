# Task: Tile Shell & Positioning

Outermost wrapper for HeatMapTile with absolute positioning, corner-aware border-radius, and continuous font scaling.
---

## Design

### Purpose
Provide absolute positioning context for tiles within Treemap Body, with Binance-style corner radius (only outer container corners rounded) and area-proportional typography scaling.

### Visual Behavior
- **Default State**: Tile positioned at calculated (x, y) coordinates
- **Hover State**:
  - Elastic redistribution via split-line grouping (see Section 7)
  - Z-index raises to 10 (float above adjacent tiles)
  - Hover lock prevents cursor drift during 400ms CSS transition
- **Transition**: 400ms cubic-bezier(0.4, 0, 0.2, 1)

### Border Radius Strategy (Binance-style)

```
┌─────────────────────────────────────────────┐
│ 16px ┌─────┬─────┬───────┐ 16px            │
│      │     │     │       │ ← top-right tile │
│      │     │     │       │   gets TL=0 TR=R │
│      ├─────┼─────┼───────┤                  │
│      │     │     │       │ ← inner tiles    │
│      │     │     │       │   all radius = 0  │
│      ├─────┴─────┼───────┤                  │
│      │           │       │                  │
│ 16px └───────────┴───────┘ 16px             │
│  ↑ bottom-left tile: BL=R, others=0        │
└─────────────────────────────────────────────┘
```

**Detection logic:**
- `touchLeft && touchTop` → `border-top-left-radius: 16px`
- `touchRight && touchTop` → `border-top-right-radius: 16px`
- `touchLeft && touchBottom` → `border-bottom-left-radius: 16px`
- `touchRight && touchBottom` → `border-bottom-right-radius: 16px`
- All other corners: `0px`
- Tolerance: 3px for edge detection

### Continuous Font Scaling (Binance-style)

Font size scales **continuously** with tile area using `sqrt(area)` normalization:

| Property | Min (smallest tile) | Max (largest tile) |
|----------|--------------------|--------------------|
| Name font-size | 9px | 28px |
| Name font-weight | 400 | 700 |
| Value font-size | 8px | 13px |
| Badge font-size | 7px | 12px |
| Content padding | 4px | 16px |

**Scaling formula:**
```typescript
const t = (Math.sqrt(tileArea) - Math.sqrt(minArea)) / (Math.sqrt(maxArea) - Math.sqrt(minArea));
const fontSize = lerp(9, 28, t);
```

### Visibility Rules
- `minDim < 50px`: Hide value + hide badge
- `minDim ≥ threshold`: Show sparkline (threshold = min(targetW(), targetH()), where target = container/min(4, √n))

### Hover Adaptive Refresh

When hover causes elastic redistribution (water ripple expansion), ALL tiles get their adaptive styles recomputed via `applyAdaptiveStyles()`. This ensures compressed tiles properly degrade:

```typescript
function applyLayout(layout) {
  d3.selectAll('.tile').each(function(d, i) {
    const l = layout[i];
    // Update position + size
    this.style.left = l.x + 'px';
    this.style.top = l.y + 'px';
    this.style.width = l.width + 'px';
    this.style.height = l.height + 'px';

    // Recompute corner radius for new position
    // ...

    // Recompute ALL adaptive styles for new dimensions
    applyAdaptiveStyles(this, l.data, l.width, l.height);
  });
}
```

**Critical**: `applyAdaptiveStyles` must run AFTER `.html()` sets DOM content (D3 render chain order matters).

### Tile Styling
- **Background**: Solid opaque color from 7-stop ramp (see Task 05)
- **Border**: `1px solid rgba(255, 255, 255, 0.18)`
- **Drop Shadow**: `0px 8px 32px rgba(0, 0, 0, 0.37)`
- **No inset shadow** (removed — was `inset 0px 1px 0px rgba(255,255,255,0.1)`)

---

## Implementation

### Component Structure

```typescript
export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  // Corner radius detection
  const R = 16;
  const tol = 3;
  const touchLeft   = x < tol;
  const touchTop    = y < tol;
  const touchRight  = (x + width) > (containerW - tol);
  const touchBottom = (y + height) > (containerH - tol);

  const borderRadius = [
    touchLeft && touchTop     ? R : 0,
    touchRight && touchTop    ? R : 0,
    touchRight && touchBottom ? R : 0,
    touchLeft && touchBottom  ? R : 0,
  ].map(v => v + 'px').join(' ');

  // Continuous font scaling
  const t = getTileScale(width, height);
  const nameSize = lerp(9, 28, t);
  const nameWeight = Math.round(lerp(400, 700, t));
  const valueSize = lerp(8, 13, t);
  const pad = lerp(4, 16, t);

  return (
    <div
      style={{
        position: 'absolute',
        left: x, top: y, width, height,
        background: getTileBackgroundColor(entity.changePercent),
        borderRadius,
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.37)',
        overflow: 'hidden',
        transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div style={{ padding: pad }}>
        <div style={{ fontSize: nameSize, fontWeight: nameWeight }}>
          {entity.name}
        </div>
        {/* ... value, badge, sparkline */}
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

✅ **Corner Radius:**
- [ ] Only tiles touching container corners get 16px radius on that corner
- [ ] Internal tile edges are all 0px (square)
- [ ] Container has `overflow: hidden` and `border-radius: 16px`
- [ ] Edge detection uses 3px tolerance

✅ **Font Scaling:**
- [ ] Font size varies continuously from 9px to 28px based on tile area
- [ ] Font weight varies from 400 (thin) to 700 (bold)
- [ ] Largest tiles have dominant, eye-catching text
- [ ] Smallest tiles have subtle, receding text
- [ ] sqrt(area) normalization for perceptual linearity

✅ **Tile Styling:**
- [ ] Solid opaque background (no alpha)
- [ ] 1px white border at 18% opacity
- [ ] Drop shadow `0px 8px 32px rgba(0,0,0,0.37)`
- [ ] No inset shadow (removed)

✅ **Performance:**
- [ ] Animation uses transform (GPU-accelerated)
- [ ] Smooth 60fps transitions
- [ ] Font scale calculated once per render

---

## References

- **Color System:** [Task 05: Dynamic Color System](./05-dynamic-color.md)
- **Layout Algorithm:** [Section 7: Implementation → Hooks](../../../7-implementation/threads/hooks/index.md)
- **Related Task:** [Task 02: Tile Background & Border](./02-dual-backgrounds.md)
