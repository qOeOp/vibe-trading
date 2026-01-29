# Task: 3D Hover Effects

Complete hover interaction specifications with transform and reveal effects.

---

## Implementation

See complete implementation in:  
[Section 5 → HeatMapTile → Task 01: Tile Shell & Positioning](../../../../5-components/threads/heatmap-tile/tasks/01-tile-shell.md)

**CSS:**
```css
.heatmap-tile {
  transform: translateY(0);
  z-index: 0;
  transition: transform 300ms ease-out, z-index 0ms;
}

.heatmap-tile:hover {
  transform: translateY(-2px);
  z-index: 10;
}
```

**React:**
```typescript
const [isHovered, setIsHovered] = useState(false);

<div
  style={{
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    zIndex: isHovered ? 10 : 0,
  }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  {isHovered && <Sparkline />}
</div>
```

---

## Acceptance Criteria

✅ **Visual Effect:**
- [ ] Tile lifts 2px on hover
- [ ] Smooth 300ms transition
- [ ] Z-index elevates above neighbors
- [ ] Sparkline appears on qualifying tiles

✅ **Performance:**
- [ ] GPU-accelerated transform
- [ ] No layout thrashing
- [ ] 60fps maintained
