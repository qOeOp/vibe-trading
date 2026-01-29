# Task: Data Flow

Detailed data pipeline from source to display.

---

## Data Sources (Phase 1)

```typescript
// Mock data imports
import { mockSectorsL1 } from '../data/mockSectorsL1';
import { mockIndustriesL2 } from '../data/mockIndustriesL2';
import { mockSubIndustriesL3 } from '../data/mockSubIndustriesL3';
import { mockStocksL4 } from '../data/mockStocksL4';
```

**Phase 2:** Replace with API calls

---

## State Flow

1. **Fetch:** Load entities for current level
2. **Store:** setEntities(data)
3. **Layout:** useTreeMap calculates positions
4. **Render:** Map over TileLayout[] → create HeatMapTile components
5. **Props:** Pass entity + layout to each tile

**No Global State:** All state in HeatMapContainer (local)

---

## Prop Drilling

```
HeatMapContainer
  ├─ HeatMapHeader
  │   ├─ Breadcrumb (path, onNavigate)
  │   └─ SearchBox (query, onChange)
  └─ TileGrid
      └─ HeatMapTile[] (entity, x, y, width, height, onDrillDown)
          ├─ BreathingDot (attentionLevel)
          └─ Sparkline (data, width, height, attentionLevel)
```

**Shallow:** Max 2-3 levels deep

---

## Acceptance Criteria

✅ **Data Flow:**
- [ ] Mock data loads correctly
- [ ] State updates propagate to children
- [ ] No unnecessary re-renders
- [ ] Props typed correctly
