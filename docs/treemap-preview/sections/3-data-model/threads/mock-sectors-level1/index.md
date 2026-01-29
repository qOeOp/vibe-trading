# Thread: Mock Sectors (Level 1)

Complete mock data for all 31 SW Level-1 sectors.

---

## Purpose

Provide realistic mock data for the root level (L1) of the hierarchy, representing all major market sectors with financial metrics.

## Task: [Mock L1 Data](./tasks/01-mock-l1-data.md)

Single task containing complete array of 31 sector entities with:
- Sector codes (801010-802040)
- Chinese names
- Realistic capitalFlow values (-200亿 to +300亿)
- Change percentages (-5% to +5%)
- Attention levels (0-100)

---

## Data Structure

```typescript
const mockSectorsL1: Entity[] = [
  {
    code: '801010',
    name: '农林牧渔',
    capitalFlow: 12.5,
    changePercent: 1.23,
    attentionLevel: 45,
    level: 0,
  },
  // ... 30 more sectors
];
```

**Total:** 31 entities

---

## References

- **Type Definition:** [Type Definitions → Entity](../type-definitions/tasks/01-entity-base.md)
- **Icon Mapping:** [Icon Mapping](../icon-mapping/index.md)
