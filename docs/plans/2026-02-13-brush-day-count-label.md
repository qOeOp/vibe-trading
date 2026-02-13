# Brush Day Count Label Design

**Date**: 2026-02-13
**Component**: BandChart / BandTooltipArea
**Feature**: Display trading day count in brush selection area

## Overview

Add a label displaying the number of trading days within a brush selection range. The label appears above the chart during brush selection and persists until the next mouse interaction.

## Requirements

### Display Position
- **X coordinate**: Center of brush selection rectangle (`brushRect.x + brushRect.width / 2`)
- **Y coordinate**: Above the chart in the blank space (`y = -10`), not overlapping with DrawdownArea
- **Visual reference**: See user-provided screenshot showing the blank space above the canvas

### Display Timing
- **During drag**: Show real-time day count as user drags to create brush selection
- **After drag**: Persist the label after mouse up (drag complete)
- **Clear on**: Next mouse move (crosshair activation) or mouse leave

### Style
- **Reuse**: `CrosshairXLabel` component (black background, white text, rounded rect)
- **Format**: `"{count}D"` (e.g., "212D")
- **Font**: Same as crosshair labels (10px, Roboto, 500 weight)

### Day Count Calculation
- **Method**: Count actual data points within brush selection range
- **Logic**: `Math.abs(endIdx - startIdx) + 1` where indices are from `data` array
- **Represents**: True trading days (excludes weekends and holidays)

## Implementation Details

### 1. State Management

Add new state in `BandTooltipArea`:

```typescript
const [brushDayCount, setBrushDayCount] = useState<number | null>(null);
```

### 2. Calculate Day Count During Drag

In `handleMouseMove`, when brush drag is detected:

```typescript
if (brushZoomEnabled && dragStartXRef.current !== null) {
  const dragDist = Math.abs(xPos - dragStartXRef.current);
  if (dragDist > DRAG_THRESHOLD) {
    isDraggingRef.current = true;
    const left = Math.max(0, Math.min(dragStartXRef.current, xPos));
    const right = Math.min(dims.width, Math.max(dragStartXRef.current, xPos));
    setBrushRect({ x: left, width: right - left });

    // Calculate trading day count
    const startIdx = findClosestPointIndex(left, data, xScale);
    const endIdx = findClosestPointIndex(right, data, xScale);
    const dayCount = Math.abs(endIdx - startIdx) + 1;
    setBrushDayCount(dayCount);

    // Suppress crosshair while brushing
    setCrosshair(INITIAL_CROSSHAIR);
    hideTooltip();
    return;
  }
}
```

### 3. Persist After Drag Complete

In `handleMouseUp`, after calculating zoom range:

```typescript
// Existing zoom logic...
onBrushZoom?.(indexRangeToPercent(...));

// Reset brush rect but KEEP dayCount
dragStartXRef.current = null;
isDraggingRef.current = false;
setBrushRect(null);
// DON'T clear brushDayCount here - let it persist
```

### 4. Clear on Next Interaction

In `handleMouseMove`, clear when starting new crosshair interaction:

```typescript
// At the start of normal crosshair update (not during brush drag)
if (!isDraggingRef.current && brushDayCount !== null) {
  setBrushDayCount(null);
}
```

In `handleMouseLeave`:

```typescript
// Clean up all states
setCrosshair(INITIAL_CROSSHAIR);
hideTooltip();
onHoverStrategy?.(null);
onHoverInfo?.(null);
dragStartXRef.current = null;
isDraggingRef.current = false;
setBrushRect(null);
setBrushDayCount(null); // Clear day count
```

### 5. Render Label

Add rendering after brush selection overlay, before crosshair:

```typescript
{/* Brush selection overlay */}
{brushRect && (
  <>
    {/* Existing 3 rects for dimmed areas and highlighted selection */}
  </>
)}

{/* Brush day count label */}
{brushRect && brushDayCount !== null && (
  <CrosshairXLabel
    x={brushRect.x + brushRect.width / 2}
    y={-10}
    text={`${brushDayCount}D`}
  />
)}

{/* Crosshair: vertical line + dots + dashed connector */}
<g style={crosshairStyle}>
  {/* ... */}
</g>
```

### 6. Y Coordinate Notes

- `CrosshairXLabel` height: 16px
- `y={-10}`: Label center is 10px above chart top
- Total vertical space needed: ~18px (half height + margin)
- Assumes sufficient blank space above chart (verified by user screenshot)

## Edge Cases

### Very Small Selections
- Minimum brush width triggers drag threshold (5px)
- Day count minimum: 1D (single day)
- Label width auto-adjusts to text length

### Very Large Selections
- Day count could be 1000+ days for full history
- Format: "1234D" (no comma separators)
- Label width: `Math.max(42, text.length * 6.5 + 12)`

### Brush Cancelled
- If user drags < 5px threshold: no brush rect, no day count
- If user mouseLeave during drag: all states cleaned up

### Rapid Interactions
- Quick drag → release → immediate hover: day count clears on first crosshair activation
- Works as intended (label only shown during/after brush)

## Testing Checklist

- [ ] Drag to create brush selection → day count appears above chart
- [ ] Day count updates in real-time during drag
- [ ] Release mouse → day count persists
- [ ] Move mouse (trigger crosshair) → day count disappears
- [ ] Mouse leave → day count disappears
- [ ] Very small selection (2-3 days) → label readable
- [ ] Very large selection (full history) → label readable
- [ ] Label positioned correctly above chart, not overlapping DrawdownArea
- [ ] Label style matches CrosshairXLabel (black bg, white text)

## Files Modified

- `apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx`
  - Add `brushDayCount` state
  - Update `handleMouseMove` to calculate day count during drag
  - Update `handleMouseMove` to clear day count on new crosshair interaction
  - Update `handleMouseLeave` to clear day count
  - Add label rendering in JSX

## Dependencies

- Reuses existing `CrosshairXLabel` component (no changes needed)
- Reuses existing `findClosestPointIndex` utility
- No new dependencies
