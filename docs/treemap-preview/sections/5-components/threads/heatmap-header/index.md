# Thread: HeatMapHeader Component

Top-level header bar for the HeatMap containing title, breadcrumb navigation, search box, and view toggles.

---

## Purpose

Provide navigation controls and context for the treemap visualization, allowing users to understand current hierarchy level and quickly search/filter data.

## Component Location

```
apps/preview/src/app/components/HeatMapHeader.tsx
```

## Position in Hierarchy

**Parent:** HeatMapContainer
**Children:**
- Breadcrumb component (left side)
- SearchBox component (right side)

## Component Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ HeatMapHeader (60px height, top of container)              │
├─────────────────────────────────────────────────────────────┤
│ [Title] > [Sector] > [Industry]          🔍[Search] [Grid] │
│    ↑                                         ↑        ↑     │
│ Breadcrumb (left-aligned)                   Search   Toggle │
│                                             (right-aligned)  │
└─────────────────────────────────────────────────────────────┘
```

## Task Breakdown

### [Task 01: Header Container & Layout](./tasks/01-header-container.md)
- Fixed 60px height bar
- Horizontal flex layout
- Left/right alignment groups
- Background styling (solid background with backdrop blur)

### [Task 02: Title & Breadcrumb Integration](./tasks/02-breadcrumb-area.md)
- "申万一级板块热力图" title
- Breadcrumb component integration
- Hierarchy level tracking
- Left-aligned section

### [Task 03: Search & Toggle Controls](./tasks/03-controls-area.md)
- SearchBox component integration
- View toggle buttons (Grid/List)
- Right-aligned section
- Control spacing and sizing

### [Task 04: Scroll Behavior & Sticky Positioning](./tasks/04-sticky-behavior.md)
- Sticky positioning on scroll
- Backdrop blur enhancement on scroll
- Shadow appearance on scroll
- Z-index management

---

## Props Interface

```typescript
interface HeatMapHeaderProps {
  /** Current hierarchy level (0=sectors, 1=industries, etc.) */
  currentLevel: number;

  /** Breadcrumb path for navigation */
  breadcrumbPath: BreadcrumbItem[];

  /** Search query state */
  searchQuery: string;

  /** Search query change handler */
  onSearchChange: (query: string) => void;

  /** Current view mode (grid or list) */
  viewMode: 'grid' | 'list';

  /** View mode toggle handler */
  onViewModeChange: (mode: 'grid' | 'list') => void;

  /** Navigation handler (breadcrumb clicks) */
  onNavigate: (level: number) => void;
}

interface BreadcrumbItem {
  label: string;
  level: number;
}
```

## Design Specifications

**Dimensions:**
- Height: Fixed 60px
- Width: 100% of container
- Padding: 16px horizontal, 12px vertical

**Layout:**
- Left section: Title + Breadcrumb (70% width)
- Right section: Search + Toggle (30% width)
- Justified space-between

**Styling:**
- Background: `rgba(17, 24, 39, 0.9)` (gray-900 with 90% opacity)
- Backdrop filter: `blur(8px)`
- Border bottom: `1px solid rgba(255, 255, 255, 0.1)`

**Scroll Enhancement:**
- Default: Light backdrop blur (8px)
- Scrolled: Stronger blur (12px) + drop shadow
- Transition: 200ms ease-out

---

## State Management

**Level Tracking:**
```typescript
const [currentLevel, setCurrentLevel] = useState(0);
// 0 = Sectors (L1)
// 1 = Industries (L2)
// 2 = Sub-industries (L3)
// 3 = Stocks (L4)
```

**Breadcrumb Path:**
```typescript
const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([
  { label: '申万一级板块', level: 0 }
]);
```

**Search State:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
```

---

## References

- **Breadcrumb Component:** [Section 5 → Components → Breadcrumb](../breadcrumb/index.md)
- **SearchBox Component:** [Section 5 → Components → SearchBox](../search-box/index.md)
- **HeatMapContainer:** [Section 5 → Components → HeatMapContainer](../heatmap-container/index.md)
- **Sticky Scroll Effects:** [Section 4 → Layout → Header Scroll Effects](../../../4-layout/threads/header-scroll-effects/index.md)

---

## Technical Notes

**Why 60px height?**
- Accommodates 16px title font + 32px search input + 12px vertical padding
- Standard header height in financial dashboards
- Enough space for icons and text without crowding
- Maintains proportion with 1200px total container height (~5% of height)

**Why sticky positioning?**
- Header remains accessible during scroll
- Users can always navigate or search
- Common pattern in data-heavy interfaces
- No JavaScript scroll listeners needed (pure CSS)

**Layout justification strategy:**
```tsx
<div className="flex justify-between">
  <div className="flex-1 flex items-center">
    {/* Breadcrumb (left) */}
  </div>
  <div className="flex items-center gap-2">
    {/* Search + Toggle (right, natural width) */}
  </div>
</div>
```

**Backdrop blur for header:**
- Background transparency allows seeing treemap below
- Backdrop blur creates depth separation
- Maintains readability without full opacity
