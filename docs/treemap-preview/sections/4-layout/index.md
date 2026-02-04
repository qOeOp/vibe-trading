# Section 4: Layout & Dimensions

Page layout structure, container sizing rules, tile constraints, and responsive behavior specifications.

---

## Threads

### [Page Layout](./threads/page-layout/index.md)
Full page structure: HeatMap Container → Treemap Body arrangement.

### [Container Dimensions](./threads/container-dimensions/index.md)
HeatMap Container sizing (920px-100vw width, 580px max height for treemap area), padding, overflow behavior.

### [Tile Constraints](./threads/tile-constraints/index.md)
Minimum tile size (150×150px), aspect ratio limits (1:1 to 1:1.618), 4px gap spacing.

### [Responsive Strategy](./threads/responsive-strategy/index.md)
Mobile degradation (no sparkline), tablet adjustments, desktop optimizations.

---

## Layout Hierarchy

```
HeatMap Container (920px-100vw × auto height, 8px padding)
  └── Treemap Body (max 580px height, overflow-y: scroll)
        └── HeatMapTile × 31 (absolute positioning)
              ├── Upper Panel (50% height)
              └── Lower Panel (50% height)
```
