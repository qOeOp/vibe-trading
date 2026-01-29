# Task: Performance Targets

Performance benchmarks and optimization techniques.

---

## Targets

**Frame Rate:** 60fps constant (16.67ms budget per frame)  
**Initial Render:** <100ms (L1 31 tiles)  
**Hover Response:** <50ms (tile elevation + sparkline mount)  
**Search Filter:** <200ms (300ms debounce + filter execution)  
**Drill-Down:** <200ms (data load + tile animation)

---

## Optimizations

**GPU Acceleration:**
- Use `transform` instead of `top`/`left`
- Use `opacity` instead of visibility toggling
- Apply `will-change` hints sparingly

**React Optimization:**
- useMemo for treemap calculations
- React.memo for tile components (if needed)
- Debounced search input (300ms)

**Event Handling:**
- Passive scroll listeners (`{ passive: true }`)
- Debounced resize handlers (future)

**Bundle Size:**
- Tree-shaking Lucide icons
- No unnecessary dependencies

---

## Acceptance Criteria

✅ **Performance:**
- [ ] 60fps maintained with 31 tiles
- [ ] No forced reflows
- [ ] Animations GPU-accelerated
- [ ] Search doesn't block UI
