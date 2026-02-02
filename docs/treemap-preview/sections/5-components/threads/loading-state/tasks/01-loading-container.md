# Task: Loading Container & Layout

Full-size container with centered flexbox layout and semi-transparent backdrop for loading indicator.

---

## Design

### Purpose
Create structural container that covers entire HeatMap area and centers loading content with subtle background overlay.

### Dimensions
- Width: 100% of parent container
- Height: 100% of parent (min 400px for short containers)
- Position: Absolute covering entire parent

### Layout
```typescript
display: flex
flex-direction: column
align-items: center
justify-content: center
gap: 16px  // Space between spinner and text
```

### Styling
- Background: `rgba(17, 24, 39, 0.6)` (gray-900 with 60% opacity)
- Backdrop filter: `blur(4px)`

---

## Implementation

```typescript
// apps/preview/src/app/components/LoadingState.tsx

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = '加载中...', className = '' }: LoadingStateProps) {
  return (
    <div className={`loading-state ${className}`}>
      {/* Spinner: Task 02 */}
      {/* Text: Task 03 */}
    </div>
  );
}
```

```css
/* apps/preview/src/app/styles.css */

.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  min-height: 400px;
}
```

---

## Acceptance Criteria

✅ **Dimensions:**
- [ ] Width: 100% of parent
- [ ] Height: 100% of parent
- [ ] Min-height: 400px

✅ **Layout:**
- [ ] Flexbox column layout
- [ ] Content centered horizontally and vertically
- [ ] 16px gap between spinner and text

✅ **Styling:**
- [ ] Background: rgba(17, 24, 39, 0.6)
- [ ] Backdrop filter: 4px blur

---

## References

- **Spinner:** [Task 02: Spinner Animation](./02-spinner-animation.md)
- **Text:** [Task 03: Loading Text](./03-loading-text.md)
