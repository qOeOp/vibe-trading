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
- [x] Squarified treemap layout (d3-hierarchy, ratio(1), S=1.35 horizontal bias)
- [x] Dynamic tile sizing based on capitalFlow magnitude (power scaling x^0.8)
- [x] 7-stop solid color ramp (Binance-style, red=涨 green=跌)
- [x] Solid opaque tiles with box-shadow hover glow
- [x] Corner-aware border radius (only container-corner tiles get 16px radius)

### Interactions
- [x] Tile hover: -2px lift + z-index elevation
- [x] Sparkline reveal on hover (if tile >120×80px)
- [x] Click to drill-down with loading state
- [x] Search with 300ms debounce
- [x] Header sticky positioning with scroll effects

### Animations
- [x] Sparkline draw-line (400ms stroke-dasharray)
- [x] Loading spinner (1s rotation)
- [x] Smooth transitions (200-300ms ease-out)
- [x] Water ripple expansion (400ms, small tiles expand to W/4×H/4 on hover)

### Data Display
- [x] Capital Flow (format: "+125.5亿")
- [x] Change Percent (format: "+2.35%")
- [x] Sector icons (31 unique Lucide icons)
- [x] Adaptive content scaling (continuous sqrt(area) normalization, 9-28px name, 8-13px value)

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
