# Thread: Glassmorphism

Dual backgrounds method for gradient borders with preserved border-radius and backdrop blur effects.

---

## Purpose

Implement modern glassmorphism aesthetic using dual-layer backgrounds to achieve gradient borders without sacrificing border-radius.

## Task: [Glassmorphism Implementation](./tasks/01-glassmorphism-impl.md)

Complete specification including:
- Dual backgrounds solution (outer gradient + inner content)
- Backdrop-filter blur configuration
- Border gradient specifications
- Shadow layering

---

## Dual Backgrounds Method

**Problem:** `border-image` breaks `border-radius`  
**Solution:** Two nested divs - outer for gradient, inner for content

```tsx
<div className="gradient-border">  {/* Outer: gradient background */}
  <div className="glass-content">  {/* Inner: content + blur */}
    {/* Content */}
  </div>
</div>
```

---

## Specifications

**Gradient Border (Outer):**
- Background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)`
- Padding: 1px (creates border effect)
- Border-radius: Preserved

**Glass Content (Inner):**
- Background: Dynamic color (3-zone system)
- Backdrop-filter: `blur(12px)`
- Border: `1px solid rgba(255, 255, 255, 0.1)` (inner separator)

---

## References

- **Component Implementation:** [Section 5 → HeatMapTile → Task 02](../../../5-components/threads/heatmap-tile/tasks/02-dual-backgrounds.md)
- **Header Usage:** [Section 5 → HeatMapHeader → Task 01](../../../5-components/threads/heatmap-header/tasks/01-header-container.md)
