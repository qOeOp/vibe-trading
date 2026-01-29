# Thread: Type Definitions

Core TypeScript interfaces for the entity data model and hierarchy navigation.

---

## Purpose

Define type-safe contracts for all data structures used throughout the application, ensuring consistent entity shape and enabling TypeScript compiler checks.

## Task Breakdown

### [Task 01: Entity Base Interface](./tasks/01-entity-base.md)
- BaseEntity with common fields (code, name, capitalFlow, changePercent, attentionLevel)
- Level-specific extensions (Sector, Industry, SubIndustry, Stock)

### [Task 02: Navigation Types](./tasks/02-navigation-types.md)
- BreadcrumbItem interface
- HierarchyLevel enum (0-3)
- NavigationState type

---

## Entity Interface

```typescript
interface Entity {
  code: string;           // Unique identifier (sector code, stock code)
  name: string;           // Display name (Chinese)
  capitalFlow: number;    // 资金流入 (positive) or 流出 (negative) in 亿元
  changePercent: number;  // 涨跌幅 (e.g., 2.35 for +2.35%)
  attentionLevel: number; // 关注度 (0-100, controls BreathingDot animation)
  level: number;          // Hierarchy level (0=sector, 1=industry, 2=sub, 3=stock)
  parentCode?: string;    // Parent entity code (undefined for L1)
  children?: Entity[];    // Child entities (undefined for L4)
  sparklineData?: number[]; // 30-day price history (optional)
}
```

---

## References

- **Component Usage:** [Section 5 → HeatMapTile](../../../5-components/threads/heatmap-tile/index.md)
- **Mock Data:** [Mock Sectors L1](../mock-sectors-level1/index.md)
