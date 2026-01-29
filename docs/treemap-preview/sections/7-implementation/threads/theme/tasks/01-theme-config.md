# Task: Theme Config

Dark theme configuration with design tokens.

---

## Implementation

```typescript
// apps/preview/src/app/config/theme.ts

export const theme = {
  colors: {
    background: '#111827',
    surface: 'rgba(17, 24, 39, 0.6)',
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
      tertiary: '#6b7280',
    },
    price: {
      up: '#dc2626',      // Red (Chinese market)
      down: '#16a34a',    // Green (Chinese market)
      neutral: '#6b7280',
    },
    focus: '#6366f1',
    warning: '#facc15',
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
  },
  fontSize: {
    xxs: '10px',
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
  },
};
```

---

## Acceptance Criteria

✅ **Theme:**
- [ ] All design tokens documented
- [ ] Matches Tailwind CSS values
- [ ] Dark theme only (Phase 1)
