# Task: Title & Breadcrumb Integration

Left-aligned section containing static title and dynamic breadcrumb navigation for hierarchy traversal.

---

## Design

### Purpose
Display current location in the hierarchy and provide clickable navigation to parent levels, helping users understand context and navigate the 4-level data structure.

### Content Structure

**Static Title:** "申万一级板块热力图"
- Always visible at root level (L1 - Sectors)
- Font: 16px, weight 600 (semibold)
- Color: White `#ffffff`

**Breadcrumb Component:**
- Appears when drilling down beyond L1
- Shows path: Root > Sector > Industry > Sub-industry
- Interactive navigation to any parent level
- See [Breadcrumb Component Thread](../../breadcrumb/index.md)

### Layout Examples

**Level 1 (Sectors - Root):**
```
┌───────────────────────────────────┐
│ 申万一级板块热力图                 │
└───────────────────────────────────┘
```

**Level 2 (Industries within a Sector):**
```
┌───────────────────────────────────────────────┐
│ 申万一级板块 > 电子                            │
│      ↑          ↑                             │
│    Root    Current sector                     │
└───────────────────────────────────────────────┘
```

**Level 3 (Sub-industries within an Industry):**
```
┌─────────────────────────────────────────────────────┐
│ 申万一级板块 > 电子 > 半导体                         │
│      ↑          ↑      ↑                            │
│    Root    Sector   Current industry                │
└─────────────────────────────────────────────────────┘
```

**Level 4 (Stocks within a Sub-industry):**
```
┌──────────────────────────────────────────────────────────────┐
│ 申万一级板块 > 电子 > 半导体 > 半导体材料                     │
│      ↑          ↑      ↑           ↑                         │
│    Root    Sector  Industry   Current sub-industry           │
└──────────────────────────────────────────────────────────────┘
```

### Interaction Behavior

**Root Click:**
- Always enabled (clickable at any level)
- Returns to L1 (Sectors view)
- Resets breadcrumb path to single item

**Intermediate Clicks:**
- Clicking "电子" from L3 returns to L2 (Industries in 电子)
- Clicking "半导体" from L4 returns to L3 (Sub-industries in 半导体)
- Updates breadcrumb path and re-renders tiles

**Current Level:**
- Not clickable (already at that level)
- Styled differently (no hover state)

---

## Implementation

### Component Integration

```typescript
// apps/preview/src/app/components/HeatMapHeader.tsx

import { Breadcrumb } from './Breadcrumb';

export function HeatMapHeader({
  currentLevel,
  breadcrumbPath,
  onNavigate,
  // ... other props
}: HeatMapHeaderProps) {
  return (
    <header className="heatmap-header">
      {/* Left section: Title + Breadcrumb */}
      <div className="flex-1 flex items-center gap-2">
        {currentLevel === 0 ? (
          // Level 1 (Root): Show static title only
          <h1 className="text-base font-semibold text-white">
            申万一级板块热力图
          </h1>
        ) : (
          // Level 2-4: Show breadcrumb navigation
          <Breadcrumb path={breadcrumbPath} onNavigate={onNavigate} />
        )}
      </div>

      {/* Right section: Search + Toggle (Task 03) */}
      <div className="flex items-center gap-2">
        {/* ... */}
      </div>
    </header>
  );
}
```

### Breadcrumb Props

```typescript
interface BreadcrumbItem {
  label: string;  // Display text (e.g., "电子", "半导体")
  level: number;  // Hierarchy level (0=root, 1=sector, 2=industry, 3=sub-industry)
}

interface BreadcrumbProps {
  path: BreadcrumbItem[];
  onNavigate: (level: number) => void;
}

// Example breadcrumb path at L3:
const breadcrumbPath: BreadcrumbItem[] = [
  { label: '申万一级板块', level: 0 },  // Root
  { label: '电子', level: 1 },          // Sector
  { label: '半导体', level: 2 },        // Industry (current)
];
```

### State Management Example

```typescript
// In parent component (HeatMapContainer or page)
const [currentLevel, setCurrentLevel] = useState(0);
const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([
  { label: '申万一级板块', level: 0 }
]);

// Navigation handler
const handleNavigate = (level: number) => {
  // Truncate path to selected level
  const newPath = breadcrumbPath.slice(0, level + 1);
  setBreadcrumbPath(newPath);
  setCurrentLevel(level);

  // Load data for selected level
  // ... (data fetching logic)
};

// Drill-down handler (from tile click)
const handleDrillDown = (entityName: string) => {
  const newPath = [
    ...breadcrumbPath,
    { label: entityName, level: currentLevel + 1 }
  ];
  setBreadcrumbPath(newPath);
  setCurrentLevel(currentLevel + 1);

  // Load child data
  // ... (data fetching logic)
};
```

---

## Acceptance Criteria

✅ **Title Display (L1):**
- [ ] Title "申万一级板块热力图" displayed at root level (L1)
- [ ] Font size: 16px (text-base)
- [ ] Font weight: 600 (semibold)
- [ ] Color: White (#ffffff)
- [ ] Left-aligned in header

✅ **Breadcrumb Display (L2-L4):**
- [ ] Breadcrumb appears when currentLevel > 0
- [ ] Title hidden when breadcrumb visible
- [ ] Breadcrumb path reflects current hierarchy
- [ ] Root item always included in path

✅ **Breadcrumb Integration:**
- [ ] Breadcrumb component receives `path` prop correctly
- [ ] `onNavigate` handler called with correct level
- [ ] Path updates trigger breadcrumb re-render
- [ ] Breadcrumb aligns with left edge (same as title)

✅ **Navigation Behavior:**
- [ ] Clicking root returns to L1 (sectors)
- [ ] Clicking intermediate item navigates to that level
- [ ] Current level item not clickable
- [ ] Navigation updates both breadcrumbPath and currentLevel state

✅ **Visual Alignment:**
- [ ] Title/breadcrumb vertically centered in header (36px content area)
- [ ] Consistent with right section controls (search/toggle)
- [ ] 8px gap between breadcrumb items (handled by Breadcrumb component)

---

## References

- **Breadcrumb Component:** [Section 5 → Components → Breadcrumb](../../breadcrumb/index.md)
- **Header Container:** [Task 01: Header Container & Layout](./01-header-container.md)
- **Controls Area:** [Task 03: Search & Toggle Controls](./03-controls-area.md)
- **Hierarchy Levels:** [Section 3 → Data Model → Type Definitions](../../../../3-data-model/threads/type-definitions/index.md)

---

## Technical Notes

**Why conditional rendering (title vs breadcrumb)?**

```tsx
// ❌ Always show both
<h1>申万一级板块热力图</h1>
<Breadcrumb path={breadcrumbPath} />
{/* Problem:
  - Redundant at L1 (title says same thing as breadcrumb root)
  - Wastes horizontal space
  - Visually cluttered
*/}

// ✅ Conditional rendering
{currentLevel === 0 ? (
  <h1>申万一级板块热力图</h1>  // Root: Static title
) : (
  <Breadcrumb path={breadcrumbPath} />  // L2-L4: Navigation
)}
{/* Benefits:
  - Clean L1 view (just title)
  - Full breadcrumb path for context at L2+
  - Uses available space efficiently
*/}
```

**Breadcrumb path management:**

```typescript
// Path structure at each level:

// L1 (Sectors):
path = [
  { label: '申万一级板块', level: 0 }
];

// L2 (Industries in 电子):
path = [
  { label: '申万一级板块', level: 0 },
  { label: '电子', level: 1 }  // Current
];

// L3 (Sub-industries in 半导体):
path = [
  { label: '申万一级板块', level: 0 },
  { label: '电子', level: 1 },
  { label: '半导体', level: 2 }  // Current
];

// L4 (Stocks in 半导体材料):
path = [
  { label: '申万一级板块', level: 0 },
  { label: '电子', level: 1 },
  { label: '半导体', level: 2 },
  { label: '半导体材料', level: 3 }  // Current
];
```

**Navigation level truncation:**

```typescript
// User clicks "电子" (level 1) from L4
const handleNavigate = (level: number) => {
  // Before: [Root, 电子, 半导体, 半导体材料]  (4 items)
  // After:  [Root, 电子]                    (2 items)

  const newPath = breadcrumbPath.slice(0, level + 1);
  // slice(0, 2) = first 2 items

  setBreadcrumbPath(newPath);
  setCurrentLevel(level);
};
```

**Why h1 for title?**

```html
<!-- Semantic HTML -->
<h1>申万一级板块热力图</h1>

<!-- Screen readers:
  - Identifies page title
  - Helps with navigation landmarks
  - SEO benefit (if applicable)
-->

<!-- Alternative (div):
  - Less semantic
  - Screen readers miss page context
  - Requires aria-label for accessibility
-->
```

**Drill-down vs navigation difference:**

```typescript
// Navigation: Go back to parent level
// Triggered by breadcrumb click
const handleNavigate = (level: number) => {
  // Truncate path to target level
  setBreadcrumbPath(path.slice(0, level + 1));
};

// Drill-down: Go deeper to child level
// Triggered by tile click
const handleDrillDown = (entityName: string) => {
  // Append new item to path
  setBreadcrumbPath([...path, { label: entityName, level: currentLevel + 1 }]);
};
```

**Text truncation for long names:**

```css
/* If entity names are too long */
.breadcrumb-item {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Example:
  "超长的板块名称超过了最大宽度限制"
  → "超长的板块名称超过了..."
*/
```

**Alternative: Always show breadcrumb:**

```tsx
// Not chosen, but viable alternative
<Breadcrumb path={breadcrumbPath} onNavigate={onNavigate} />

// At L1, breadcrumb would show:
// 申万一级板块  (single item, not clickable)

// At L2:
// 申万一级板块 > 电子

// Pros:
// - Consistent UI (breadcrumb always present)
// - Simpler logic (no conditional)

// Cons:
// - Redundant at L1 (just shows title as breadcrumb)
// - Single breadcrumb item looks odd
// - Current approach (title at L1) is cleaner
```

**Font sizing consistency:**

```css
/* Title at L1 */
h1 {
  font-size: 16px;  /* text-base */
  font-weight: 600; /* semibold */
}

/* Breadcrumb at L2+ */
.breadcrumb-item {
  font-size: 14px;  /* text-sm - slightly smaller */
  font-weight: 500; /* medium */
}

/* Rationale:
  - Title larger (16px) - emphasizes static context
  - Breadcrumb smaller (14px) - fits more items in space
  - Both remain readable at their sizes
*/
```
