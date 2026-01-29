# Section 6: Visual Design

Color systems, glassmorphism implementation, 3D interactions, and animation specifications.

---

## Threads

### [Color System](./threads/color-system/index.md)
3-zone dynamic coloring based on changePercent: dead zone (±0.2%), active zone (0.2-3%), extreme protection (>3%). Conservative finance palette (black/white/gray + red/green for prices).

### [Glassmorphism](./threads/glassmorphism/index.md)
Dual backgrounds method for gradient borders with border-radius, backdrop-filter blur (12px), surface textures, and shadow layering.

### [3D Hover](./threads/3d-hover/index.md)
Tile elevation (-2px translateY), panel separation, sparkline reveal, and smooth transitions (300ms ease-out).

### [Animations](./threads/animations/index.md)
Framer Motion configurations for drill-down, stagger effects, ripple animation, draw-line SVG path animation.

---

## Visual Principles

**Finance Aesthetics:**
- Conservative color scheme: Black/white/gray tones only
- Red/green reserved exclusively for price changes (Chinese market convention: 🔴=up, 🟢=down)
- No decorative gradients or vibrant accent colors

**Glassmorphism Stack:**
```
Layer 1 (Border): linear-gradient(135deg, rgba(255,255,255,0.2) → rgba(255,255,255,0.05))
Layer 2 (Content): Dynamic color based on changePercent (3 zones)
Layer 3 (Glass): backdrop-filter: blur(12px)
Layer 4 (Shadows): Inset highlights + drop shadows for depth
```

**Interaction Hierarchy:**
1. Hover: Tile lifts 2px, sparkline appears
2. Click: Drill-down animation (zoom from parent)
3. Breadcrumb: Drill-up animation (reverse shrink)
