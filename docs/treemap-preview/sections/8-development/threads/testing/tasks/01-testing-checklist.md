# Task: Testing Checklist

Manual testing checklist for Phase 1.

---

## Functional Testing

### Initial Render
- [ ] Page loads without errors
- [ ] 31 sector tiles render in treemap layout
- [ ] All tiles have visible content (icon, name, metrics)
- [ ] Colors vary based on changePercent (7-stop ramp: red/green/gray)

### Hover Interactions
- [ ] Tile lifts 2px on hover
- [ ] Z-index elevates (tile appears above others)
- [ ] Sparkline appears on tiles >120×80px
- [ ] Sparkline animates (draw-line effect)
### Drill-Down (L1→L2)
- [ ] Click "电子" sector tile
- [ ] Loading spinner appears
- [ ] Breadcrumb updates: "申万一级板块 > 电子"
- [ ] 8 industry tiles render
- [ ] Previous tiles cleared (not overlapping)

### Drill-Down (L2→L3→L4)
- [ ] Can drill to L3 (sub-industries)
- [ ] Can drill to L4 (stocks)
- [ ] Breadcrumb path grows correctly
- [ ] Max 4 levels enforced

### Breadcrumb Navigation
- [ ] Click "申万一级板块" returns to L1
- [ ] Click intermediate level (e.g., "电子") returns to L2
- [ ] Current level not clickable
- [ ] Breadcrumb path updates correctly

### Search
- [ ] Type in SearchBox: "半导体"
- [ ] Results filter after 300ms debounce
- [ ] Only matching tiles shown
- [ ] Clear search: all tiles return
- [ ] No results: EmptyState displays

---

## Performance Testing

- [ ] 60fps during idle (check DevTools Performance)
- [ ] 60fps during hover (sparkline animation)
- [ ] <100ms initial render (31 tiles)
- [ ] <200ms drill-down transition
- [ ] <50ms hover response
- [ ] No memory leaks (refresh, check memory usage)

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Visual Regression

- [ ] Solid opaque tile backgrounds visible
- [ ] Border (1px white 18%) and drop shadow correct
- [ ] Colors match design (7-stop ramp)
- [ ] Typography readable (min 12px)
- [ ] Icons display correctly (all 31 unique)
- [ ] Sparkline path draws smoothly
- [ ] Water ripple expansion works on hover

---

## Error Handling

- [ ] Simulate fetch error: ErrorState appears
- [ ] Click retry button: Data reloads
- [ ] Search with no results: EmptyState appears
- [ ] Invalid drill-down: Handled gracefully

---

## Acceptance Criteria

✅ **Testing:**
- [ ] All checklist items pass
- [ ] No console errors
- [ ] No warnings
- [ ] Performance targets met (60fps, <100ms)
