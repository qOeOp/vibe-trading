# Thread: SearchBox Component

Search input field for real-time filtering of entities across all hierarchy levels.

---

## Purpose

Enable users to quickly find specific sectors, industries, sub-industries, or stocks by name without manual navigation.

## Component Location

```
apps/preview/src/app/components/SearchBox.tsx
```

## Usage Context

**Displayed in:** HeatMapContainer
**Functionality:** Real-time filtering as user types, cross-level search

## Component Anatomy

```
┌──────────────────────────────────┐
│ 🔍 搜索板块、行业、股票...        │ ← Search icon + placeholder
└──────────────────────────────────┘
```

## Task Breakdown

### [Task 01: Search Input Container](./tasks/01-input-container.md)
- 200px width, 32px height
- Rounded border, solid background
- Search icon (Lucide Search)

### [Task 02: Input Styling & States](./tasks/02-input-styling.md)
- Placeholder: "搜索板块、行业、股票..."
- Focus state: indigo border
- Text: 14px white

### [Task 03: Search Handler & Debounce](./tasks/03-search-handler.md)
- onChange handler with debounce (300ms)
- Real-time filtering logic
- Clear button when query present

---

## Props Interface

```typescript
interface SearchBoxProps {
  /** Current search query */
  value: string;

  /** Search query change handler */
  onChange: (query: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Additional CSS classes */
  className?: string;
}
```

## Design Specifications

**Dimensions:**
- Width: 200px (fixed)
- Height: 32px
- Padding: 8px left (icon space), 8px right

**Styling:**
- Background: rgba(255, 255, 255, 0.05)
- Border: 1px solid rgba(255, 255, 255, 0.2)
- Border radius: 6px
- Focus: indigo-500 border

**Icon:**
- Search icon (Lucide): 16px, gray-400
- Positioned: Left side, 8px from edge

---

## References

- **HeatMapContainer Integration:** [Section 5 → HeatMapContainer](../heatmap-container/index.md)

---

## Technical Notes

**Why 300ms debounce?**
- Prevents excessive filtering during typing
- Balances responsiveness and performance
- Standard UX pattern for search inputs

**Cross-level search:**
- Searches all entities in current hierarchy
- Matches Chinese characters
- Case-insensitive comparison