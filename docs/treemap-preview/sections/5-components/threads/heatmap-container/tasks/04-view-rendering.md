# Task: View Rendering Logic

Conditional rendering: Loading → Error → Empty → Content (TileGrid).

---

## Implementation

```typescript
export function HeatMapContainer(props: HeatMapContainerProps) {
  // ... state (Task 02)
  // ... handlers (Task 03, 05)

  return (
    <div ref={containerRef} className="heatmap-container">
      {/* Content: Conditional rendering */}
      <div className="heatmap-content">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => loadData(currentLevel, breadcrumbPath)} />
        ) : filteredEntities.length === 0 ? (
          <EmptyState />
        ) : (
          <TileGrid entities={filteredEntities} onDrillDown={handleDrillDown} />
        )}
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

✅ **Conditional Rendering:**
- [ ] Loading: LoadingState shown
- [ ] Error: ErrorState with retry
- [ ] Empty: EmptyState for no results
- [ ] Content: TileGrid for valid data

✅ **Priority:**
1. Loading (highest priority)
2. Error
3. Empty
4. Content (lowest priority)
