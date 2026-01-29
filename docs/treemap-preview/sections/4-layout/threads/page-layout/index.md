# Thread: Page Layout

Overall page structure for the treemap preview application.

---

## Purpose

Define top-level page layout including main container positioning and background.

## Task: [Page Structure](./tasks/01-page-structure.md)

Complete page layout specification with centered 1200×1200px container.

---

## Layout Structure

```
┌─────────────────────────────────────────┐
│ Browser Viewport (full width/height)   │
│                                         │
│     ┌───────────────────────────┐      │
│     │  HeatMapContainer         │      │
│     │  (1200×1200px, centered)  │      │
│     │                           │      │
│     │  [Header (sticky 60px)]  │      │
│     │  [Tile Grid (1140px)]    │      │
│     │                           │      │
│     └───────────────────────────┘      │
│                                         │
└─────────────────────────────────────────┘
```

**Centering:** Flexbox or margin auto  
**Background:** Dark (#111827)  
**Container:** Fixed 1200×1200px

---

## References

- **Container:** [Section 5 → HeatMapContainer](../../../5-components/threads/heatmap-container/index.md)
