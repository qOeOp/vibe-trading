# Task: Breadcrumb Items

Clickable parent items and non-clickable current item with appropriate styling.

---

## Implementation

```typescript
const isLast = index === path.length - 1;

{isLast ? (
  // Current level (not clickable)
  <span className="text-sm font-medium text-white" aria-current="page">
    {item.label}
  </span>
) : (
  // Parent level (clickable)
  <button
    onClick={() => onNavigate(item.level)}
    className="text-sm font-normal text-gray-400 hover:text-gray-200 transition-colors"
  >
    {item.label}
  </button>
)}
```

---

## Acceptance Criteria

✅ **Items:**
- [ ] Parent items: 14px gray-400, hover: gray-200
- [ ] Current item: 14px white, font-medium
- [ ] Current has aria-current="page"
- [ ] Only parents clickable (last item not clickable)
