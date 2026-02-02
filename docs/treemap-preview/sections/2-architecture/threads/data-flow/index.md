# Thread: Data Flow

Data flow from mock source through state to components.

---

## Task: [Data Flow](./tasks/01-data-flow.md)

**Source:** Mock data files (L1-L4)  
**Transform:** Treemap layout calculation  
**State:** React useState in HeatMapContainer  
**Props:** Passed down to child components

---

## Data Pipeline

```
Mock Data Files
    ↓
HeatMapContainer (fetch)
    ↓
useTreeMap (layout calculation)
    ↓
TileLayout[] (x, y, width, height)
    ↓
HeatMapTile[] components
    ↓
Sparkline children
```

---

## References

- **State Management:** [Section 5 → HeatMapContainer → Task 02](../../../5-components/threads/heatmap-container/tasks/02-state-management.md)
