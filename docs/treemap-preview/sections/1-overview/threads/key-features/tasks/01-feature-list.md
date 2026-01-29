# Task: Feature List

Complete catalog of implemented features.

---

## Features by Category

### Hierarchy & Navigation
- [x] 4-level drill-down (Sector → Industry → Sub → Stock)
- [x] Breadcrumb navigation with click-to-level
- [x] Dynamic title/breadcrumb based on current level
- [x] State management (currentLevel, breadcrumbPath)

### Visualization
- [x] Squarified treemap layout (d3-hierarchy)
- [x] Dynamic tile sizing based on capitalFlow magnitude
- [x] 3-zone dynamic coloring (±0.2%, 0.2-3%, >3%)
- [x] Glassmorphism with dual backgrounds
- [x] Gradient borders with preserved border-radius

### Interactions
- [x] Tile hover: -2px lift + z-index elevation
- [x] Sparkline reveal on hover (if tile >120×80px)
- [x] Click to drill-down with loading state
- [x] Search with 300ms debounce
- [x] Header sticky positioning with scroll effects

### Animations
- [x] Breathing dot pulse (1-3s based on attention)
- [x] Ripple rings (synchronized with pulse, 200ms delay)
- [x] Sparkline draw-line (400ms stroke-dasharray)
- [x] Loading spinner (1s rotation)
- [x] Smooth transitions (200-300ms ease-out)

### Data Display
- [x] Capital Flow (format: "+125.5亿")
- [x] Change Percent (format: "+2.35%")
- [x] Attention Level (0-100 driving dot speed)
- [x] Sector icons (31 unique Lucide icons)
- [x] Adaptive content scaling (icon 14-18px, font 12-16px)

### State Management
- [x] Loading state with spinner
- [x] Error state with retry button
- [x] Empty state for no search results
- [x] Search query state with debounce

---

## Phase 1 Scope

**Included:**
- All visualization features
- All interaction features
- Mock data (61 entities across 4 levels)
- Desktop only (1200×1200px fixed)

**Not Included (Future):**
- Real API integration
- Responsive layouts
- Mobile support
- List view mode (toggle exists, not implemented)

---

## Acceptance Criteria

✅ **Features:**
- [ ] All listed features implemented
- [ ] 60fps performance maintained
- [ ] No console errors
- [ ] Works on Chrome/Firefox/Safari
