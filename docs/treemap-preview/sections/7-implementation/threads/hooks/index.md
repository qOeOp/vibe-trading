# Thread: Hooks

Custom React hooks for treemap layout and debounced values.

---

## Purpose

Encapsulate reusable logic for treemap calculations and input debouncing.

## Task: [Custom Hooks](./tasks/01-custom-hooks.md)

Two core hooks:
- `useTreeMap`: Squarified treemap layout calculation
- `useDebouncedValue`: Debounced state for search input

---

## Hook Overview

### useTreeMap
**Purpose:** Calculate tile positions/sizes from entity data  
**Input:** Entity[] with capitalFlow values  
**Output:** TileLayout[] with x, y, width, height

### useDebouncedValue
**Purpose:** Debounce rapid state changes (search input)  
**Input:** value, delay (ms)  
**Output:** Debounced value

---

## References

- **useTreeMap Usage:** [Section 5 → HeatMapContainer](../../../5-components/threads/heatmap-container/index.md)
- **useDebouncedValue Usage:** [Section 5 → SearchBox → Task 03](../../../5-components/threads/search-box/tasks/03-search-handler.md)
