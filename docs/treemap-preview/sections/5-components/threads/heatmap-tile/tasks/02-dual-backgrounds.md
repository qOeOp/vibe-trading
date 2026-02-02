# Task: Tile Background & Border

Solid opaque tile backgrounds with simple border and drop shadow on white page.
---

## Design

### Implementation

Single `<div>` with solid background:

```css
.tile {
  /* Solid opaque background from 7-stop color ramp */
  background: var(--tile-bg-color);  /* e.g. #F6465D, #2EBD85, #76808E */

  /* Simple border */
  border: 1px solid rgba(255, 255, 255, 0.18);

  /* Drop shadow for depth on white page */
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.37);

  /* Corner radius: 0 default, 16px on container-edge corners only */
  border-radius: 0;
  overflow: hidden;
}
```

### Benefits Over Glassmorphism

| Aspect | Glassmorphism (old) | Solid (current) |
|--------|-------------------|-----------------|
| DOM depth | 3 layers (shell + gradient + glass) | 1 layer (shell) |
| GPU cost | High (backdrop-filter) | None |
| Browser compat | Safari prefix needed | Universal |
| Visual clarity | Muddy on opaque bg | Crisp, professional |

---

## Acceptance Criteria

✅ **Tile Background:**
- [ ] Solid opaque color from 7-stop ramp (no alpha)
- [ ] Color maps correctly to changePercent
- [ ] No backdrop-filter or blur effects

✅ **Border & Shadow:**
- [ ] 1px white border at 18% opacity
- [ ] Drop shadow `0px 8px 32px rgba(0, 0, 0, 0.37)`
- [ ] No inset shadows

✅ **Performance:**
- [ ] No GPU-intensive effects
- [ ] Single DOM layer per tile
- [ ] Smooth 60fps with 31 tiles

---

## References

- **Color Calculation:** [Task 05: Dynamic Color System](./05-dynamic-color.md)
- **Tile Styling Specs:** Section 6 → Visual Design
- **Theme Config:** [Section 7: Implementation → Theme](../../../7-implementation/threads/theme/tasks/01-theme-config.md)
