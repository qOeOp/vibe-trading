# Thread: EmptyState Component

Full-screen empty state display shown when search returns no results.

---

## Purpose

Inform users when no data matches their search query and suggest alternative actions.

## Component Location

```
apps/preview/src/app/components/EmptyState.tsx
```

## Component Anatomy

```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│              [Search Icon] 🔍                 │ ← Gray search icon
│                                              │
│           无匹配结果                           │ ← Empty title
│           请尝试其他关键词                      │ ← Empty message
│                                              │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

## Task Breakdown

### [Task 01: Empty Container & Icon](./tasks/01-empty-container.md)
- Centered layout
- Gray search icon (Lucide Search)
- 48px icon size

### [Task 02: Empty Messages](./tasks/02-empty-messages.md)
- Title: "无匹配结果" (16px, semibold)
- Message: Custom message (14px, gray-400)

---

## Props Interface

```typescript
interface EmptyStateProps {
  title?: string;         // Default: "无匹配结果"
  message?: string;       // Default: "请尝试其他关键词"
  className?: string;
}
```
