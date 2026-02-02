# Task: Header Container & Layout

Fixed-height header bar with horizontal flex layout for left/right content sections and solid background styling with backdrop blur.

---

## Design

### Purpose
Create structural container for header content with proper spacing, alignment, and visual styling.

### Dimensions

**Height:** Fixed 60px
- Tall enough for search input (32px) + padding
- Accommodates icon buttons and text comfortably
- Standard header proportion (~5% of 1200px container)

**Width:** 100% of parent container
- Spans entire HeatMapContainer width
- Responsive to container size changes

**Padding:**
- Horizontal: 16px (left/right)
- Vertical: 12px (top/bottom)
- Creates breathing room around content

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ ← 16px padding                              16px padding → │
│ ↓ 12px padding                                              │
├─────────────────────────────────────────────────────────────┤
│ [Left Section: 70% flex-grow]    [Right Section: natural]  │
│                                                              │
│ ← justify-between (space between sections) →               │
├─────────────────────────────────────────────────────────────┤
│ ↑ 12px padding                                              │
│                                     Total height: 60px      │
└─────────────────────────────────────────────────────────────┘
```

### Flex Layout

**Container:**
```tsx
display: flex
justify-content: space-between  // Push left/right sections apart
align-items: center             // Vertically center content
```

**Left Section:**
```tsx
flex: 1                        // Grows to fill available space
display: flex
align-items: center
gap: 8px                       // Space between breadcrumb items
```

**Right Section:**
```tsx
display: flex
align-items: center
gap: 8px                       // Space between search and toggle
```

### Styling

**Background:**
```css
background: rgba(17, 24, 39, 0.9);  /* gray-900 with 90% opacity */
backdrop-filter: blur(8px);          /* Subtle blur */
```

**Border:**
```css
border-bottom: 1px solid rgba(255, 255, 255, 0.1);  /* Subtle separator */
```

**Positioning:**
```css
position: sticky;
top: 0;
z-index: 10;  /* Above tiles (z-index: 0-10) */
```

---

## Implementation

### Component Base Structure

```typescript
// apps/preview/src/app/components/HeatMapHeader.tsx

interface HeatMapHeaderProps {
  currentLevel: number;
  breadcrumbPath: BreadcrumbItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onNavigate: (level: number) => void;
}

interface BreadcrumbItem {
  label: string;
  level: number;
}

export function HeatMapHeader({
  currentLevel,
  breadcrumbPath,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onNavigate,
}: HeatMapHeaderProps) {
  return (
    <header className="heatmap-header">
      {/* Left section: Breadcrumb */}
      <div className="flex-1 flex items-center gap-2">
        {/* Breadcrumb will be added in Task 02 */}
      </div>

      {/* Right section: Search + Toggle */}
      <div className="flex items-center gap-2">
        {/* Search and toggle will be added in Task 03 */}
      </div>
    </header>
  );
}
```

### Base Styles

```css
/* apps/preview/src/app/styles.css */

.heatmap-header {
  /* Positioning */
  position: sticky;
  top: 0;
  z-index: 10;

  /* Dimensions */
  height: 60px;
  width: 100%;

  /* Layout */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;

  /* Styling */
  background: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  /* Smooth transitions for scroll effects (Task 04) */
  transition: backdrop-filter 200ms ease-out, box-shadow 200ms ease-out;
}
```

### Tailwind Utility Classes (Alternative)

```tsx
<header className="
  sticky top-0 z-10
  h-[60px] w-full
  flex justify-between items-center
  px-4 py-3
  bg-gray-900/90
  backdrop-blur-md
  border-b border-white/10
  transition-all duration-200
">
  {/* Content */}
</header>
```

---

## Acceptance Criteria

✅ **Dimensions:**
- [ ] Header height is exactly 60px
- [ ] Header width spans 100% of container
- [ ] Horizontal padding is 16px (left and right)
- [ ] Vertical padding is 12px (top and bottom)
- [ ] Content area = 60px - 24px padding = 36px usable height

✅ **Layout:**
- [ ] Header uses flex layout with `justify-between`
- [ ] Left section grows with `flex: 1`
- [ ] Right section uses natural width (no flex-grow)
- [ ] Content vertically centered with `align-items: center`
- [ ] Sections have appropriate gap spacing (8px)

✅ **Styling:**
- [ ] Background color: `rgba(17, 24, 39, 0.9)` (gray-900 with 90% opacity)
- [ ] Backdrop filter: `blur(8px)` applied
- [ ] Border bottom: 1px solid white with 10% opacity
- [ ] Backdrop blur effect visible (can see content behind header)

✅ **Positioning:**
- [ ] Position: `sticky`
- [ ] Top offset: 0
- [ ] Z-index: 10 (above tile hover z-index: 10, equal priority)
- [ ] Header stays at top when scrolling

✅ **Visual Quality:**
- [ ] Backdrop blur renders correctly
- [ ] Border is subtle but visible
- [ ] Background semi-transparent (90% opacity)
- [ ] No layout shift when sticky positioning activates

---

## References

- **Breadcrumb Area:** [Task 02: Title & Breadcrumb Integration](./02-breadcrumb-area.md)
- **Controls Area:** [Task 03: Search & Toggle Controls](./03-controls-area.md)
- **Sticky Behavior:** [Task 04: Scroll Behavior & Sticky Positioning](./04-sticky-behavior.md)
- **Visual Design:** Section 6 → Visual Design

---

## Technical Notes

**Why sticky positioning?**

```css
/* ❌ Fixed positioning */
position: fixed;
top: 0;
left: 0;
right: 0;
/* Problems:
  - Needs explicit left/right (assumes viewport width)
  - Removed from document flow (content jumps)
  - Hard to position relative to container
*/

/* ✅ Sticky positioning */
position: sticky;
top: 0;
/* Benefits:
  - Stays in document flow (no layout shift)
  - Relative to scroll container (works inside HeatMapContainer)
  - CSS-only (no JavaScript scroll listeners)
  - Activates automatically when scrolling
*/
```

**Z-index layering strategy:**

```
Layer hierarchy:
- Header (z-index: 10) - Always on top
- Tile hover (z-index: 10) - Same level, render order decides
- Tile default (z-index: 0) - Behind header
- Container background (z-index: -1 or none) - Furthest back

Equal z-index (10) for header and tile hover:
- Tile hover happens in tile container (below header in DOM)
- Header rendered later → naturally appears above
- Intentional: Allows seeing tile hover under semi-transparent header
```

**Backdrop filter browser support:**

```
✅ Chrome 76+ (2019)
✅ Safari 13.1+ (2020)
✅ Firefox 103+ (2022)
✅ Edge 79+ (2020)

Fallback for older browsers:
.heatmap-header {
  background: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(8px);
}

/* Older browsers ignore backdrop-filter */
/* Still see 90% opaque background (acceptable degradation) */
```

**Why 60px height?**

```
Content requirements:
- Search input: 32px height (standard)
- Vertical padding: 12px top + 12px bottom = 24px
- Min clearance: 4px above/below input
- Total: 32 + 24 + 4 = 60px

Alternative heights considered:
- 48px: Too cramped, input feels squeezed
- 56px: Slightly tight, no breathing room
- 64px: Unnecessarily tall, wastes space
- 60px: Perfect balance
```

**Justify-between vs gap:**

```css
/* ❌ Using gap alone */
.header {
  display: flex;
  gap: 16px;
}
/* Problem: Gap appears between left and right sections */
/* No way to push sections to edges */

/* ✅ Using justify-between */
.header {
  display: flex;
  justify-content: space-between;
}
/* Sections pushed to edges, auto space between */
/* Gap only needed within sections */
```

**Padding vs margin for spacing:**

```css
/* ✅ Padding inside header */
.heatmap-header {
  padding: 12px 16px;
}
/* Content inset from edges, clickable area includes padding */

/* ❌ Margin on content */
.heatmap-header > * {
  margin: 12px 16px;
}
/* Content at edges, clickable area excludes margins */
/* Header height calculation more complex */
```

**Backdrop blur intensity:**

```
Blur values tested:
- 4px:  Too subtle, barely noticeable
- 8px:  Optimal - visible blur, maintains legibility
- 12px: Strong effect, used for scrolled state (Task 04)
- 16px: Too intense, content behind unrecognizable

8px chosen for default state:
- Visible separation from background
- Doesn't obscure tiles excessively
- Performs well (low blur radius)
```

**Performance consideration:**

```css
/* Backdrop filter triggers GPU compositing */
.heatmap-header {
  backdrop-filter: blur(8px);
  /* Browser creates separate layer for header */
  /* GPU handles blur in real-time */
}

/* Performance impact:
  - One-time layer creation (~0.5ms)
  - Ongoing blur rendering (~0.1ms per frame)
  - Total: Negligible on modern devices
*/
```
