# Thread: HeatMapContainer Component

Top-level container component that orchestrates the entire HeatMap visualization including header, tiles, and state management.

---

## Purpose

Serve as the main composition root for the HeatMap application, managing data flow, hierarchy navigation, search state, and view rendering.

## Component Location

```
apps/preview/src/app/components/HeatMapContainer.tsx
```

## Component Hierarchy

```
HeatMapContainer (root)
├── HeatMapHeader
│   ├── Breadcrumb
│   └── SearchBox
├── TileGrid (conditional)
│   └── HeatMapTile[] (31 tiles)
│       └── Sparkline (on hover)
├── LoadingState (conditional)
├── ErrorState (conditional)
└── EmptyState (conditional)
```

## Task Breakdown

### [Task 01: Container Shell & Dimensions](./tasks/01-container-shell.md)
- Fixed 1200×1200px container
- Background styling
- Scroll container setup

### [Task 02: State Management](./tasks/02-state-management.md)
- Hierarchy level tracking (0-3)
- Breadcrumb path state
- Search query state
- Loading/error states

### [Task 03: Data Loading & Hierarchy Navigation](./tasks/03-data-loading.md)
- Initial data fetch
- Drill-down handler (tile click → load children)
- Navigate handler (breadcrumb click → load parent level)
- Data caching strategy

### [Task 04: View Rendering Logic](./tasks/04-view-rendering.md)
- Conditional rendering: Loading → Error → Empty → Content
- TileGrid with treemap layout
- Filtered entities based on search

### [Task 05: Event Handlers & Integration](./tasks/05-event-handlers.md)
- Search handler with debounce
- View mode toggle (grid/list)
- Drill-down navigation
- Breadcrumb navigation

---

## Props Interface

```typescript
interface HeatMapContainerProps {
  /** Initial data source (optional, for SSR or pre-fetched data) */
  initialData?: Entity[];

  /** Optional API endpoint for data fetching */
  apiEndpoint?: string;

  /** Additional CSS classes */
  className?: string;
}

interface Entity {
  code: string;
  name: string;
  capitalFlow: number;
  changePercent: number;
  attentionLevel: number;
  level: number;  // 0=sector, 1=industry, 2=sub-industry, 3=stock
  parentCode?: string;
  children?: Entity[];
}
```

## Design Specifications

**Dimensions:**
- Width: 1200px (fixed)
- Height: 1200px (fixed)
- Overflow: auto (scroll for content beyond viewport)

**Background:**
- Color: #111827 (gray-900)
- Pattern: Optional subtle grid or gradient

**Layout:**
- Header: 60px height (sticky at top)
- Content: Remaining height (1140px)

---

## State Flow

```
Initial Load:
1. Mount → setLoading(true)
2. Fetch L1 (sectors) data
3. setEntities(data) + setLoading(false)
4. Render 31 tiles

Drill-Down:
1. User clicks tile → handleDrillDown(entity)
2. setLoading(true) + update breadcrumb
3. Fetch children for entity
4. setEntities(children) + setLoading(false)
5. Render child tiles

Navigation (Breadcrumb):
1. User clicks breadcrumb item → handleNavigate(level)
2. setLoading(true) + truncate breadcrumb
3. Fetch data for target level
4. setEntities(data) + setLoading(false)
5. Render tiles for that level

Search:
1. User types → setSearchQuery(query)
2. Debounce 300ms → filter entities
3. setFilteredEntities(filtered)
4. Render filtered tiles or EmptyState
```

---

## References

- **HeatMapHeader:** [Section 5 → Components → HeatMapHeader](../heatmap-header/index.md)
- **HeatMapTile:** [Section 5 → Components → HeatMapTile](../heatmap-tile/index.md)
- **State Components:** [LoadingState](../loading-state/index.md), [ErrorState](../error-state/index.md), [EmptyState](../empty-state/index.md)
- **Treemap Algorithm:** [Section 7 → Implementation → Hooks → useTreeMap](../../../../7-implementation/threads/hooks/index.md)

---

## Technical Notes

**Why fixed dimensions?**
- Consistent treemap calculations
- Predictable tile sizing
- Simplifies layout complexity
- Matches design spec (1200×1200px)

**Data fetching strategy:**
- Mock data in preview app (Phase 1)
- Real API integration later (Phase 2)
- Optimistic UI updates for snappy UX

**State management choice:**
- Local state (useState) for preview simplicity
- Could upgrade to Zustand for complex app
- Current approach sufficient for prototype
