# Thread: LoadingState Component

Full-screen loading indicator displayed while fetching hierarchical data or during drill-down transitions.

---

## Purpose

Provide visual feedback during data loading operations, preventing perceived unresponsiveness and maintaining user confidence.

## Component Location

```
apps/preview/src/app/components/LoadingState.tsx
```

## Usage Context

**Displayed when:**
- Initial page load (fetching L1 sector data)
- Drill-down transitions (loading child level data)
- Search operations (filtering large datasets)
- Data refresh operations

**Replaces:** Entire HeatMap container content during loading

## Component Anatomy

```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│                                              │
│              [Spinner animation]             │ ← Rotating circle
│                                              │
│              加载中...                        │ ← Loading text
│                                              │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

## Task Breakdown

### [Task 01: Loading Container & Layout](./tasks/01-loading-container.md)
- Full container dimensions (100% of parent)
- Centered flexbox layout
- Semi-transparent background

### [Task 02: Spinner Animation](./tasks/02-spinner-animation.md)
- Rotating circle with gradient stroke
- 40px diameter
- 1s rotation duration
- CSS animation

### [Task 03: Loading Text](./tasks/03-loading-text.md)
- "加载中..." with ellipsis animation
- 14px font, gray-400 color
- Positioned below spinner (16px gap)

---

## Props Interface

```typescript
interface LoadingStateProps {
  /** Optional loading message (default: "加载中...") */
  message?: string;

  /** Optional additional CSS classes */
  className?: string;
}
```

## Design Specifications

**Container:**
- Width: 100% of parent
- Height: 100% of parent (or min 400px)
- Background: rgba(17, 24, 39, 0.6) (semi-transparent gray-900)
- Backdrop filter: blur(4px)

**Spinner:**
- Size: 40px diameter
- Stroke: 3px width
- Color: Linear gradient (indigo-500 → transparent)
- Animation: 360° rotation, 1s linear infinite

**Text:**
- Content: "加载中..." (default) or custom message
- Font: 14px (text-sm), weight 400 (normal)
- Color: #9ca3af (gray-400)
- Ellipsis animation: 1.4s ease-in-out infinite

---

## References

- **HeatMapContainer:** [Section 5 → Components → HeatMapContainer](../heatmap-container/index.md)
- **Error State:** [Section 5 → Components → ErrorState](../error-state/index.md)
- **Empty State:** [Section 5 → Components → EmptyState](../empty-state/index.md)

---

## Technical Notes

**Why semi-transparent background?**
- Shows underlying structure (header, layout)
- Prevents jarring blank screen
- Maintains spatial context
- Common pattern in modern UIs

**Spinner vs skeleton:**
- Spinner chosen: Unknown layout (data-driven tile sizes)
- Skeleton alternative: Would require predicting tile layout
- Spinner simpler and more flexible

**Ellipsis animation rationale:**
```
"加载中" (static) - Looks stalled
"加载中..." with animated dots - Shows activity
1.4s cycle matches spinner rotation speed
```
