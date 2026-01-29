# Thread: Theme

Theme configuration for colors, spacing, and typography (currently dark-only).

---

## Purpose

Centralize design tokens for consistent styling across components.

## Task: [Theme Config](./tasks/01-theme-config.md)

Dark theme configuration with:
- Color palette (background, text, accents)
- Spacing scale (2px increments)
- Typography (font sizes, weights)
- Border radius system

---

## Theme Structure

```typescript
const theme = {
  colors: {
    background: '#111827',
    text: { primary: '#ffffff', secondary: '#9ca3af' },
    price: { up: '#dc2626', down: '#16a34a', neutral: '#6b7280' },
    focus: '#6366f1',
  },
  spacing: { 1: '4px', 2: '8px', 3: '12px', 4: '16px' },
  fontSize: { xs: '12px', sm: '14px', base: '16px', lg: '18px' },
  borderRadius: { md: '8px', lg: '12px' },
};
```

**Note:** Light theme not implemented in Phase 1.

---

## References

- **Color System:** [Section 6 → Visual Design → Color System](../../../6-visual-design/threads/color-system/index.md)
