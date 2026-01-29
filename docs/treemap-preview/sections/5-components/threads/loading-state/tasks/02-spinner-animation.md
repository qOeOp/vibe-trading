# Task: Spinner Animation

Rotating circular spinner with gradient stroke indicating loading progress.

---

## Design

### Specifications
- Diameter: 40px
- Stroke width: 3px
- Stroke color: Linear gradient (indigo-500 → transparent)
- Animation: 360° rotation, 1s linear infinite

---

## Implementation

```typescript
export function LoadingState({ message, className }: LoadingStateProps) {
  return (
    <div className={`loading-state ${className}`}>
      {/* Spinner */}
      <div className="loading-spinner" aria-label="Loading" role="status">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="url(#spinner-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text: Task 03 */}
      <p className="loading-text">{message}</p>
    </div>
  );
}
```

```css
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Acceptance Criteria

✅ **Spinner:**
- [ ] Size: 40×40px
- [ ] Stroke width: 3px
- [ ] Gradient: indigo-500 → transparent
- [ ] Rotation: 1s linear infinite
- [ ] Accessible: role="status", aria-label="Loading"
