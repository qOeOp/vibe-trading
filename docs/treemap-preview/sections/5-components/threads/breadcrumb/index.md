# Thread: Breadcrumb Component

Hierarchy navigation breadcrumb showing path from root to current level with clickable parent navigation.

---

## Purpose

Display current location in 4-level hierarchy (Root → Sector → Industry → Sub-industry) and enable quick navigation to any parent level.

## Component Location

```
apps/preview/src/app/components/Breadcrumb.tsx
```

## Usage Context

**Displayed in:** HeatMapHeader left section (when currentLevel > 0)
**Replaces:** Static title "申万一级板块热力图" at L2-L4

## Component Anatomy

```
┌──────────────────────────────────────────────────────┐
│ 申万一级板块 > 电子 > 半导体                          │
│      ↑          ↑      ↑                             │
│  Clickable  Clickable Current (not clickable)        │
└──────────────────────────────────────────────────────┘
```

## Task Breakdown

### [Task 01: Breadcrumb Container & Separator](./tasks/01-container-separator.md)
- Horizontal flex layout
- ">" separator between items
- 8px gap spacing

### [Task 02: Breadcrumb Items](./tasks/02-breadcrumb-items.md)
- Clickable parent items (14px, gray-400)
- Current item (14px, white, not clickable)
- Hover states for clickable items

### [Task 03: Navigation Handler](./tasks/03-navigation-handler.md)
- onClick handler with level parameter
- Path truncation on navigation
- Accessibility (aria-current for current item)

---

## Props Interface

```typescript
interface BreadcrumbItem {
  label: string;   // Display text (e.g., "电子")
  level: number;   // Hierarchy level (0-3)
}

interface BreadcrumbProps {
  /** Breadcrumb path array */
  path: BreadcrumbItem[];

  /** Navigation click handler */
  onNavigate: (level: number) => void;

  /** Additional CSS classes */
  className?: string;
}
```

## Design Specifications

**Item Styling:**
- Clickable (parent): 14px, gray-400, hover: gray-200
- Current (last): 14px, white, no hover
- Separator: 14px, gray-600, ">"

**Spacing:**
- Gap between items: 8px
- Separator centered between items

---

## References

- **HeatMapHeader Integration:** [Section 5 → HeatMapHeader → Task 02](../heatmap-header/tasks/02-breadcrumb-area.md)
- **Hierarchy Levels:** [Section 3 → Data Model → Type Definitions](../../../../3-data-model/threads/type-definitions/index.md)

---

## Technical Notes

**Why ">" instead of "/"?**
- ">" visually indicates progression/depth
- Common in Chinese interfaces
- Matches design conventions

**Path array structure:**
```typescript
// L2: [Root, Sector(current)]
// L3: [Root, Sector, Industry(current)]
// L4: [Root, Sector, Industry, Sub-industry(current)]
// Last item always current level (not clickable)
```