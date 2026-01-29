# Thread: Testing

Testing strategy and manual verification checklist.

---

## Task: [Testing Checklist](./tasks/01-testing-checklist.md)

**Phase 1:** Manual testing (no automated tests yet)  
**Checklist:**
- [ ] All 31 sectors render
- [ ] Drill-down works (L1→L2→L3→L4)
- [ ] Breadcrumb navigation works
- [ ] Search filters correctly
- [ ] Sparkline appears on hover
- [ ] Breathing dots animate
- [ ] 60fps maintained

---

## Future Testing

**Phase 2:**
- Unit tests (Jest + React Testing Library)
- Component tests
- E2E tests (Playwright)

---

## Manual Test Scenarios

1. **Initial Render:** 31 tiles, all visible
2. **Hover:** Tile lifts, sparkline appears
3. **Click:** Drill to L2, tiles update
4. **Breadcrumb:** Click root, return to L1
5. **Search:** Type "电子", filter works
6. **Performance:** No lag, smooth 60fps
