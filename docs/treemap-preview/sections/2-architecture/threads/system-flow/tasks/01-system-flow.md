# Task: System Flow

Complete application flow documentation.

---

## Initial Load Flow

1. **Mount:** HeatMapContainer mounts
2. **State Init:** Initialize empty entities, loading=true
3. **Fetch:** Load L1 (31 sectors) from mock data
4. **Layout:** Calculate treemap with useTreeMap hook
5. **Render:** Render 31 HeatMapTile components
6. **Ready:** User can interact

**Duration:** <100ms (mock data, no network)

---

## Drill-Down Flow

1. **Click:** User clicks tile (e.g., "电子")
2. **Loading:** Set loading=true, show spinner
3. **Navigate:** Update breadcrumbPath, increment currentLevel
4. **Fetch:** Load L2 industries under "电子"
5. **Layout:** Recalculate treemap for new entities
6. **Render:** Render industry tiles
7. **Ready:** User can drill deeper or navigate up

**Duration:** <200ms (including fetch + layout)

---

## Search Flow

1. **Input:** User types in SearchBox
2. **Debounce:** 300ms delay
3. **Filter:** Filter entities by name (case-insensitive)
4. **Update:** Set filteredEntities
5. **Render:** Re-render with filtered tiles or EmptyState

**Duration:** 300ms debounce + <50ms filter

---

## Acceptance Criteria

✅ **Flow:**
- [ ] All states handled (loading/error/empty/success)
- [ ] Transitions smooth (<200ms)
- [ ] No race conditions
- [ ] State updates trigger correct re-renders
