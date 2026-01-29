# Task: Search & Toggle Controls

Right-aligned section containing SearchBox component and view mode toggle buttons for grid/list layout switching.

---

## Design

### Purpose
Provide quick search functionality for finding entities across hierarchy levels and allow users to toggle between grid (treemap) and list views.

### Component Layout

```
┌──────────────────────────────────────────────┐
│                         🔍[Search] [Grid][List] │
│                            ↑        ↑      ↑  │
│                      SearchBox   Grid   List  │
│                       (200px)   (32px) (32px) │
└──────────────────────────────────────────────┘
```

**Spacing:**
- Gap between SearchBox and toggles: 8px
- Gap between Grid and List buttons: 0px (joined buttons)

### SearchBox Integration

**Dimensions:**
- Width: 200px (fixed)
- Height: 32px
- Border radius: 6px

**Behavior:**
- Real-time filtering as user types
- Placeholder: "搜索板块、行业、股票..."
- See [SearchBox Component Thread](../../search-box/index.md)

### View Toggle Buttons

**Button Group:**
- Two buttons: "Grid" and "List"
- Active state: Highlighted background
- Inactive state: Transparent background with border
- Joined appearance (no gap between buttons)

**Grid Button:**
- Icon: Grid icon (3×3 squares) from Lucide
- Active when `viewMode === 'grid'`
- Click handler: `onViewModeChange('grid')`

**List Button:**
- Icon: List icon (horizontal lines) from Lucide
- Active when `viewMode === 'list'`
- Click handler: `onViewModeChange('list')`

**Styling:**
```
Active:   Background: rgba(99, 102, 241, 0.2)  // indigo-500 with 20% opacity
          Border: 1px solid #6366f1              // indigo-500
          Icon: #6366f1                          // indigo-500

Inactive: Background: transparent
          Border: 1px solid rgba(255, 255, 255, 0.2)
          Icon: rgba(255, 255, 255, 0.6)
```

---

## Implementation

### Component Structure

```typescript
// apps/preview/src/app/components/HeatMapHeader.tsx

import { Grid3x3, List } from 'lucide-react';
import { SearchBox } from './SearchBox';

export function HeatMapHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  // ... other props
}: HeatMapHeaderProps) {
  return (
    <header className="heatmap-header">
      {/* Left section: Breadcrumb (Task 02) */}
      <div className="flex-1 flex items-center gap-2">
        {/* ... */}
      </div>

      {/* Right section: Search + Toggle */}
      <div className="flex items-center gap-2">
        {/* SearchBox */}
        <SearchBox
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="搜索板块、行业、股票..."
          className="w-[200px]"
        />

        {/* View Mode Toggle */}
        <div className="flex items-center">
          {/* Grid Button */}
          <button
            onClick={() => onViewModeChange('grid')}
            className={`
              view-toggle-btn
              rounded-l-md
              ${viewMode === 'grid' ? 'active' : ''}
            `}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <Grid3x3 size={16} />
          </button>

          {/* List Button */}
          <button
            onClick={() => onViewModeChange('list')}
            className={`
              view-toggle-btn
              rounded-r-md
              ${viewMode === 'list' ? 'active' : ''}
            `}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
```

### Toggle Button Styles

```css
/* apps/preview/src/app/styles.css */

.view-toggle-btn {
  /* Dimensions */
  width: 32px;
  height: 32px;

  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Styling - Inactive state */
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);

  /* Interaction */
  cursor: pointer;
  transition: all 150ms ease-out;
}

.view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
}

.view-toggle-btn.active {
  /* Active state */
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
  color: #6366f1;
}

.view-toggle-btn.active:hover {
  background: rgba(99, 102, 241, 0.3);
}

/* Remove middle borders for joined appearance */
.view-toggle-btn.rounded-l-md {
  border-right: none;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.view-toggle-btn.rounded-r-md {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
```

### State Management

```typescript
// In parent component (HeatMapContainer or page)
const [searchQuery, setSearchQuery] = useState('');
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

// Search handler
const handleSearchChange = (query: string) => {
  setSearchQuery(query);
  // Filter entities based on query
  // ... (filtering logic)
};

// View mode handler
const handleViewModeChange = (mode: 'grid' | 'list') => {
  setViewMode(mode);
  // Switch rendering logic
  // ... (view mode logic)
};
```

---

## Acceptance Criteria

✅ **SearchBox Integration:**
- [ ] SearchBox renders with 200px fixed width
- [ ] SearchBox height is 32px (matches toggle buttons)
- [ ] Placeholder text: "搜索板块、行业、股票..."
- [ ] Search query state synced with parent
- [ ] `onChange` handler called on input

✅ **Toggle Button Layout:**
- [ ] Grid and List buttons side-by-side (no gap)
- [ ] Each button is 32×32px
- [ ] Buttons have joined appearance (shared border)
- [ ] Left button has left border-radius, right button has right border-radius
- [ ] 8px gap between SearchBox and toggle group

✅ **Active State Styling:**
- [ ] Active button: indigo background (rgba(99, 102, 241, 0.2))
- [ ] Active button: indigo border (#6366f1)
- [ ] Active button: indigo icon (#6366f1)
- [ ] Only one button active at a time (exclusive states)

✅ **Inactive State Styling:**
- [ ] Inactive button: transparent background
- [ ] Inactive button: white border with 20% opacity
- [ ] Inactive button: white icon with 60% opacity
- [ ] Hover: slight background tint (rgba(255, 255, 255, 0.05))

✅ **Interaction:**
- [ ] Clicking Grid button calls `onViewModeChange('grid')`
- [ ] Clicking List button calls `onViewModeChange('list')`
- [ ] Button states update correctly on click
- [ ] Smooth transition between active/inactive (150ms)

✅ **Accessibility:**
- [ ] Buttons have `aria-label` (Grid view / List view)
- [ ] Buttons have `aria-pressed` state (true/false)
- [ ] Keyboard navigable (Tab to focus, Enter to activate)
- [ ] Focus visible (outline on keyboard focus)

---

## References

- **SearchBox Component:** [Section 5 → Components → SearchBox](../../search-box/index.md)
- **Breadcrumb Area:** [Task 02: Title & Breadcrumb Integration](./02-breadcrumb-area.md)
- **Header Container:** [Task 01: Header Container & Layout](./01-header-container.md)

---

## Technical Notes

**Why joined buttons instead of separate?**

```
❌ Separated buttons:
  [Grid] [List]  (gap between)
  - Takes more space
  - Looks disconnected
  - Less common pattern

✅ Joined buttons:
  [Grid|List]  (shared border)
  - Compact
  - Visual grouping (mutual exclusivity clear)
  - Standard toggle pattern
```

**Button border management:**

```css
/* Left button */
.rounded-l-md {
  border-right: none;  /* Remove right border */
  /* Right border shared with right button's left border */
}

/* Right button */
.rounded-r-md {
  /* Has full border */
  /* Left border appears as shared middle border */
}

/* Result: Seamless joined appearance */
```

**Why 200px SearchBox width?**

```
Width considerations:
- Min: 150px - Too narrow, truncates long entity names
- 200px: Optimal - Fits most names, balanced with toggles
- Max: 250px - Too wide, dominates header

Chinese entity names:
- Sectors: 2-4 characters (电子, 食品饮料)
- Industries: 3-6 characters (半导体, 集成电路)
- 200px accommodates up to ~10 Chinese characters
```

**View mode state persistence:**

```typescript
// Optional: Save to localStorage
const handleViewModeChange = (mode: 'grid' | 'list') => {
  setViewMode(mode);
  localStorage.setItem('heatmap-view-mode', mode);
};

// On mount: Restore saved preference
useEffect(() => {
  const saved = localStorage.getItem('heatmap-view-mode');
  if (saved === 'grid' || saved === 'list') {
    setViewMode(saved);
  }
}, []);
```

**Icon sizing:**

```tsx
<Grid3x3 size={16} />
<List size={16} />

// 16px icons in 32px buttons
// Ratio: 50% icon, 50% padding
// Provides adequate click target
// Icons clear and recognizable
```

**Button hover feedback:**

```css
/* Inactive hover */
.view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  /* Subtle feedback: button is interactive */
}

/* Active hover */
.view-toggle-btn.active:hover {
  background: rgba(99, 102, 241, 0.3);
  /* Slightly stronger active color */
  /* Indicates interactivity even when active */
}
```

**Alternative: Radio button group:**

```tsx
// Not chosen, but semantically correct alternative
<fieldset>
  <legend className="sr-only">View mode</legend>
  <input type="radio" name="view-mode" value="grid" />
  <input type="radio" name="view-mode" value="list" />
</fieldset>

// Pros:
// - Semantically correct (radio buttons for exclusive choice)
// - Built-in keyboard navigation

// Cons:
// - Harder to style consistently
// - More complex markup
// - Button approach more common in modern UIs
```

**Search + toggle spacing:**

```tsx
<div className="flex items-center gap-2">
  {/*           8px gap here ↓         */}
  <SearchBox />
  <div className="flex">
    <button />  {/* No gap */}
    <button />
  </div>
</div>

// 8px (gap-2) between SearchBox and toggle group
// 0px between toggle buttons (joined appearance)
```

**Accessibility: aria-pressed vs aria-selected:**

```html
<!-- ✅ aria-pressed (for toggle buttons) -->
<button aria-pressed="true">Grid</button>

<!-- ❌ aria-selected (for selectable items in listbox/tree) -->
<button aria-selected="true">Grid</button>

<!-- aria-pressed indicates toggle state of a button -->
<!-- More appropriate for this UI pattern -->
```

**Performance: Icon rendering:**

```tsx
// Lucide React icons are tree-shakeable
import { Grid3x3, List } from 'lucide-react';

// Only imports these two icons
// Bundle size impact: ~1KB (both icons combined)
// Renders as inline SVG (no external requests)
```

**Color contrast verification:**

```
Active state:
- Background: rgba(99, 102, 241, 0.2) + Icon: #6366f1
- Contrast ratio: >3:1 (meets WCAG AA for UI components)

Inactive state:
- Background: transparent + Icon: rgba(255, 255, 255, 0.6)
- Contrast ratio: >3:1 (meets WCAG AA for UI components)

Both states meet accessibility standards
```
