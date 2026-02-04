# Thread: Performance

Performance optimization strategies and benchmarks.

---

## Purpose

Document performance targets and optimization techniques for smooth 60fps rendering.

## Task: [Performance Targets](./tasks/01-performance-targets.md)

Key metrics:
- 60fps tile rendering (31 tiles)
- <100ms initial render
- <50ms hover response
- <200ms drill-down transition

**Optimizations:**
- GPU-accelerated transforms
- useMemo for treemap calculations
- Debounced search (300ms)

---

## Performance Targets

**Frame Rate:** 60fps (16.67ms per frame)  
**Initial Render:** <100ms (31 tiles)  
**Hover Response:** <50ms (tile lift + sparkline)  
**Search Filter:** <200ms (debounced)

---

## References

- **Component Performance:** Detailed in component acceptance criteria
- **Animation Performance:** [Section 6 → Animations](../../../6-visual-design/threads/animations/index.md)
