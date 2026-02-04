# Task: Navigation Handler

Click handler that calls onNavigate with target level for parent navigation.

---

## Implementation

```typescript
// In parent component (HeatMapContainer)
const handleNavigate = (level: number) => {
  // Truncate path to selected level
  const newPath = breadcrumbPath.slice(0, level + 1);
  setBreadcrumbPath(newPath);
  setCurrentLevel(level);

  // Load data for selected level
  loadDataForLevel(level, newPath);
};

<Breadcrumb path={breadcrumbPath} onNavigate={handleNavigate} />
```

---

## Acceptance Criteria

✅ **Navigation:**
- [ ] Clicking parent item calls onNavigate(level)
- [ ] Level parameter matches clicked item's level
- [ ] Current item not clickable (no onClick)
- [ ] Keyboard accessible (Tab + Enter)
- [ ] aria-current="page" on current item
