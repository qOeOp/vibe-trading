# Task: Container Shell & Dimensions

Fixed-size container with scroll capability for the entire HeatMap visualization.

---

## Design

### Dimensions
- Width: 1200px (fixed)
- Height: 1200px (fixed)
- Overflow: auto (scroll if content exceeds viewport)

### Background
- Color: #111827 (gray-900)
- Optional: Subtle pattern or gradient

---

## Implementation

```typescript
// apps/preview/src/app/components/HeatMapContainer.tsx

export function HeatMapContainer({ initialData, apiEndpoint, className }: HeatMapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`heatmap-container ${className}`}
      style={{
        width: '1200px',
        height: '1200px',
        background: '#111827',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* Content: Task 04 */}
    </div>
  );
}
```

---

## Acceptance Criteria

✅ **Dimensions:**
- [ ] Width: 1200px
- [ ] Height: 1200px
- [ ] Fixed size (not responsive)

✅ **Overflow:**
- [ ] Scroll enabled (overflow: auto)
- [ ] Content scrollable if exceeds container

✅ **Background:**
- [ ] Color: gray-900 (#111827)
