# Section 3: Data Model

TypeScript type definitions, mock data for all 4 drill-down levels, and Lucide icon mappings for 31 sectors.

---

## Threads

### [Type Definitions](./threads/type-definitions/index.md)
BaseEntity, Sector, Industry, SubIndustry, Stock interfaces, and navigation state types.

### [Mock Sectors Level 1](./threads/mock-sectors-level1/index.md)
All 31 SW Level-1 sector indices with market cap, change%, capital flow, attention level.

### [Mock Industries Level 2](./threads/mock-industries-level2/index.md)
8 sub-industries under 电子 (Electronics) sector.

### [Mock SubIndustries Level 3](./threads/mock-subindustries-level3/index.md)
7 tertiary industries under 半导体 (Semiconductor).

### [Mock Stocks Level 4](./threads/mock-stocks-level4/index.md)
15 individual stocks under 光学光电子 (Optoelectronics).

### [Icon Mapping](./threads/icon-mapping/index.md)
Lucide React icon mapping for all 31 sectors with visual metaphors.

---

## Data Hierarchy

```
Level 1: 31 SW Sectors (一级行业)
    └─ Level 2: Industries (二级行业, e.g., 8 under 电子)
        └─ Level 3: Sub-Industries (三级行业, e.g., 7 under 半导体)
            └─ Level 4: Individual Stocks (股票, e.g., 15 under 光学光电子)
```

**Total Data Points:** 31 + 8 + 7 + 15 = 61 entities
