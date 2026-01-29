# Task: Data Loading & Hierarchy Navigation

Data fetching on mount, drill-down, and breadcrumb navigation with loading states.

---

## Implementation

```typescript
// Initial data load
useEffect(() => {
  loadData(0, []);  // Load L1 (sectors)
}, []);

const loadData = async (level: number, path: BreadcrumbItem[]) => {
  setIsLoading(true);
  setError(null);

  try {
    // Mock data or API call
    const data = await fetchEntitiesForLevel(level, path);
    setEntities(data);
    setFilteredEntities(data);
    setCurrentLevel(level);
    setBreadcrumbPath(path.length === 0 ? [{ label: '申万一级板块', level: 0 }] : path);
  } catch (err) {
    setError('加载失败');
  } finally {
    setIsLoading(false);
  }
};

// Drill-down handler (tile click)
const handleDrillDown = async (entity: Entity) => {
  if (currentLevel >= 3) return;  // Max 4 levels

  const newPath = [
    ...breadcrumbPath,
    { label: entity.name, level: currentLevel + 1 }
  ];

  await loadData(currentLevel + 1, newPath);
};

// Navigate handler (breadcrumb click)
const handleNavigate = async (level: number) => {
  const newPath = breadcrumbPath.slice(0, level + 1);
  await loadData(level, newPath);
};
```

---

## Acceptance Criteria

✅ **Loading:**
- [ ] Initial load fetches L1 data
- [ ] Loading state shown during fetch
- [ ] Error state on fetch failure
- [ ] Data updates on successful fetch

✅ **Drill-down:**
- [ ] Tile click loads children
- [ ] Breadcrumb updates with new item
- [ ] Current level increments
- [ ] Max 4 levels enforced

✅ **Navigation:**
- [ ] Breadcrumb click loads parent level
- [ ] Path truncated to selected level
- [ ] Current level updates
- [ ] Data refetched for target level
