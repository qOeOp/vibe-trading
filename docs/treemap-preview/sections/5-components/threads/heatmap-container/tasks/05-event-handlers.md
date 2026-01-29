# Task: Event Handlers & Integration

Search, view toggle, drill-down, and navigation event handlers.

---

## Implementation

```typescript
// Search handler with debounce
const debouncedQuery = useDebouncedValue(searchQuery, 300);

useEffect(() => {
  if (debouncedQuery === '') {
    setFilteredEntities(entities);
  } else {
    const filtered = entities.filter(entity =>
      entity.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    setFilteredEntities(filtered);
  }
}, [debouncedQuery, entities]);

const handleSearchChange = (query: string) => {
  setSearchQuery(query);
};

// View mode toggle
const handleViewModeChange = (mode: 'grid' | 'list') => {
  setViewMode(mode);
  // Note: List view not implemented in Phase 1 (preview)
};

// Drill-down (from Task 03)
const handleDrillDown = async (entity: Entity) => {
  // ... (see Task 03)
};

// Navigate (from Task 03)
const handleNavigate = async (level: number) => {
  // ... (see Task 03)
};
```

---

## Acceptance Criteria

✅ **Search:**
- [ ] Query updates search state
- [ ] 300ms debounce applied
- [ ] Filtered entities update after debounce
- [ ] Empty state shown if no results

✅ **Handlers:**
- [ ] handleSearchChange updates search query
- [ ] handleViewModeChange updates view mode
- [ ] handleDrillDown loads child data
- [ ] handleNavigate loads parent data

✅ **Integration:**
- [ ] All handlers passed to child components
- [ ] State updates trigger re-renders
- [ ] No prop drilling issues
