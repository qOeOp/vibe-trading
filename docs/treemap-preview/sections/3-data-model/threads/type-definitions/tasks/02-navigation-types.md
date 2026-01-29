# Task: Navigation Types

Types for breadcrumb navigation and hierarchy level tracking.

---

## Implementation

```typescript
// apps/preview/src/app/types/navigation.ts

export interface BreadcrumbItem {
  /** Display label (e.g., "电子", "半导体") */
  label: string;

  /** Hierarchy level (0-3) */
  level: number;
}

export enum HierarchyLevel {
  Sector = 0,
  Industry = 1,
  SubIndustry = 2,
  Stock = 3,
}

export interface NavigationState {
  /** Current hierarchy level */
  currentLevel: HierarchyLevel;

  /** Breadcrumb path from root to current */
  path: BreadcrumbItem[];

  /** Current entity code (or null for root) */
  currentCode: string | null;
}
```

---

## Acceptance Criteria

✅ **BreadcrumbItem:**
- [ ] label: string (display text)
- [ ] level: number (0-3)

✅ **HierarchyLevel:**
- [ ] Enum with 4 levels: Sector, Industry, SubIndustry, Stock
- [ ] Values: 0, 1, 2, 3

✅ **NavigationState:**
- [ ] currentLevel: HierarchyLevel
- [ ] path: BreadcrumbItem[]
- [ ] currentCode: string | null
