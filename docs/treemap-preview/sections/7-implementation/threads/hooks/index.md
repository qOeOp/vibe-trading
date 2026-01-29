# Thread: Hooks

Custom React hooks for treemap layout, scroll detection, and debounced values.

---

## Purpose

Encapsulate reusable logic for treemap calculations, scroll behavior, and input debouncing.

## Task: [Custom Hooks](./tasks/01-custom-hooks.md)

Three core hooks:
- `useTreeMap`: Squarified treemap layout calculation
- `useScrollTop`: Scroll position detection for header effects
- `useDebouncedValue`: Debounced state for search input

---

## Hook Overview

### useTreeMap
**Purpose:** Calculate tile positions/sizes from entity data  
**Input:** Entity[] with capitalFlow values  
**Output:** TileLayout[] with x, y, width, height

### useScrollTop
**Purpose:** Detect scroll position for sticky header effects  
**Input:** Container ref  
**Output:** scrollTop number

### useDebouncedValue
**Purpose:** Debounce rapid state changes (search input)  
**Input:** value, delay (ms)  
**Output:** Debounced value

---

## References

- **useTreeMap Usage:** [Section 5 → HeatMapContainer](../../../5-components/threads/heatmap-container/index.md)
- **useScrollTop Usage:** [Section 5 → HeatMapHeader → Task 04](../../../5-components/threads/heatmap-header/tasks/04-sticky-behavior.md)
- **useDebouncedValue Usage:** [Section 5 → SearchBox → Task 03](../../../5-components/threads/search-box/tasks/03-search-handler.md)
