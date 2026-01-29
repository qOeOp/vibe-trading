# Task: Retry Button

Action button for retrying failed data load.

---

## Implementation

```typescript
<button
  onClick={onRetry}
  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
>
  重试
</button>
```

---

## Acceptance Criteria

✅ **Button:**
- [ ] Text: "重试"
- [ ] Background: indigo-600, hover: indigo-700
- [ ] Height: 32px (py-2)
- [ ] Rounded: 6px (rounded-md)
- [ ] onClick calls onRetry handler
