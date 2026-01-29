# Thread: ErrorState Component

Full-screen error display shown when data fetching fails, with retry action button.

---

## Purpose

Inform users of data loading failures and provide clear recovery action through retry mechanism.

## Component Location

```
apps/preview/src/app/components/ErrorState.tsx
```

## Component Anatomy

```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│              [Error Icon] ⚠️                  │ ← Red warning icon
│                                              │
│           加载失败                            │ ← Error title
│           请检查网络连接后重试                  │ ← Error message
│                                              │
│              [重试按钮]                        │ ← Retry button
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

## Task Breakdown

### [Task 01: Error Container & Icon](./tasks/01-error-container.md)
- Centered layout
- Red warning icon (Lucide AlertCircle)
- 48px icon size

### [Task 02: Error Messages](./tasks/02-error-messages.md)
- Title: "加载失败" (16px, semibold)
- Message: Custom error message (14px, gray-400)
- Vertical spacing

### [Task 03: Retry Button](./tasks/03-retry-button.md)
- "重试" button with indigo background
- Click handler for retry action
- 32px height, rounded-md

---

## Props Interface

```typescript
interface ErrorStateProps {
  /** Error title (default: "加载失败") */
  title?: string;

  /** Error message (default: "请检查网络连接后重试") */
  message?: string;

  /** Retry button click handler */
  onRetry: () => void;

  /** Additional CSS classes */
  className?: string;
}
```

---

## Technical Notes

**Why retry button instead of auto-retry?**
- Gives user control over retry timing
- Prevents infinite retry loops
- Clear user-initiated action