# Task: Breadcrumb Container & Separator

Horizontal flex layout with ">" separators between breadcrumb items.

---

## Implementation

```typescript
export function Breadcrumb({ path, onNavigate, className }: BreadcrumbProps) {
  return (
    <nav className={`breadcrumb ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {path.map((item, index) => (
          <li key={item.level} className="flex items-center gap-2">
            {/* Item: Task 02 */}

            {/* Separator (not after last item) */}
            {index < path.length - 1 && (
              <span className="text-sm text-gray-600" aria-hidden="true">></span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

---

## Acceptance Criteria

✅ **Layout:**
- [ ] Horizontal flex with 8px gap
- [ ] Separator ">" between items (not after last)
- [ ] Separator: 14px gray-600
