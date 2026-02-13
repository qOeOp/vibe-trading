# Brush Day Count Label Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a label displaying trading day count above brush selection area in BandChart

**Architecture:** Add state management for brush day count, calculate count during drag interaction, persist after release, and render using existing CrosshairXLabel component

**Tech Stack:** React 19, TypeScript, D3.js (scale utilities), Framer Motion (existing component structure)

---

## Task 1: Add State Management for Brush Day Count

**Files:**
- Modify: `apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx:357-390` (component setup)

**Step 1: Add brushDayCount state**

Locate the existing state declarations after line 380 (after `const [brushRect, setBrushRect] = useState...`).

Add new state:

```typescript
const [brushDayCount, setBrushDayCount] = useState<number | null>(null);
```

**Step 2: Verify TypeScript compilation**

Run: `npx nx run web:build --skip-nx-cache`

Expected: Build succeeds with no TypeScript errors

**Step 3: Commit state addition**

```bash
git add apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx
git commit -m "feat(band-chart): add brushDayCount state for day count label

Add state management for tracking trading day count in brush selection.
State persists after drag release and clears on next interaction.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Calculate Day Count During Brush Drag

**Files:**
- Modify: `apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx:433-456` (handleMouseMove)

**Step 1: Add day count calculation in drag detection block**

Locate the drag detection block in `handleMouseMove` (around line 443-455).

After `setBrushRect({ x: left, width: right - left });` and before `setCrosshair(INITIAL_CROSSHAIR);`, add:

```typescript
// Calculate trading day count
const startIdx = findClosestPointIndex(left, data, xScale);
const endIdx = findClosestPointIndex(right, data, xScale);
const dayCount = Math.abs(endIdx - startIdx) + 1;
setBrushDayCount(dayCount);
```

The full block should look like:

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

**Step 2: Verify TypeScript compilation**

Run: `npx nx run web:build --skip-nx-cache`

Expected: Build succeeds, no TypeScript errors

**Step 3: Commit day count calculation**

```bash
git add apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx
git commit -m "feat(band-chart): calculate day count during brush drag

Calculate trading day count in real-time as user drags brush selection.
Count represents actual data points (trading days) in the range.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Clear Day Count on Crosshair Interaction

**Files:**
- Modify: `apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx:433-456` (handleMouseMove)

**Step 1: Add clear logic at start of handleMouseMove**

Locate the start of the `handleMouseMove` callback (after `if (data.length === 0) return;`).

Add this check before the brush drag detection block:

```typescript
// Clear day count when starting new crosshair interaction (not during brush drag)
if (!isDraggingRef.current && brushDayCount !== null) {
  setBrushDayCount(null);
}
```

The order should be:
1. Early return if no data
2. Clear day count if not dragging (NEW)
3. Brush drag detection block
4. Normal crosshair logic

**Step 2: Update handleMouseMove dependency array**

Locate the dependency array for `handleMouseMove` (around line 540).

Add `brushDayCount` to the dependencies:

```typescript
[data, xScale, yScale, dims, auxLookup, overlayLookup, overlayName, baselineLookup, tooltipDisabled, tooltipTemplate, showTooltip, onHoverStrategy, onHoverInfo, brushZoomEnabled, hideTooltip, brushDayCount],
```

**Step 3: Verify TypeScript compilation**

Run: `npx nx run web:build --skip-nx-cache`

Expected: Build succeeds, no TypeScript errors

**Step 4: Commit clear logic**

```bash
git add apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx
git commit -m "feat(band-chart): clear day count on crosshair interaction

Clear brush day count when user starts hovering for crosshair.
Ensures label only shows during/after brush, not during normal hover.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Clear Day Count on Mouse Leave

**Files:**
- Modify: `apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx:598-608` (handleMouseLeave)

**Step 1: Add setBrushDayCount(null) to handleMouseLeave**

Locate the `handleMouseLeave` callback (around line 598).

After `setBrushRect(null);`, add:

```typescript
setBrushDayCount(null);
```

The full callback should look like:

```typescript
const handleMouseLeave = useCallback(() => {
  setCrosshair(INITIAL_CROSSHAIR);
  hideTooltip();
  onHoverStrategy?.(null);
  onHoverInfo?.(null);
  // Clean up brush state
  dragStartXRef.current = null;
  isDraggingRef.current = false;
  setBrushRect(null);
  setBrushDayCount(null);
}, [hideTooltip, onHoverStrategy, onHoverInfo]);
```

**Step 2: Verify TypeScript compilation**

Run: `npx nx run web:build --skip-nx-cache`

Expected: Build succeeds, no TypeScript errors

**Step 3: Commit mouse leave cleanup**

```bash
git add apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx
git commit -m "feat(band-chart): clear day count on mouse leave

Clean up brush day count state when mouse leaves chart area.
Ensures consistent state cleanup with other brush states.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Render Day Count Label

**Files:**
- Modify: `apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx:627-755` (JSX render)

**Step 1: Add label rendering after brush overlay**

Locate the brush selection overlay block (around line 644-664).

After the closing `</>` of the brush rect overlay and before the crosshair `<g style={crosshairStyle}>`, add:

```typescript
{/* Brush day count label */}
{brushRect && brushDayCount !== null && (
  <CrosshairXLabel
    x={brushRect.x + brushRect.width / 2}
    y={-10}
    text={`${brushDayCount}D`}
  />
)}
```

The structure should be:

```typescript
{/* Brush selection overlay */}
{brushRect && (
  <>
    {/* Existing 3 rects */}
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
```

**Step 2: Verify TypeScript compilation**

Run: `npx nx run web:build --skip-nx-cache`

Expected: Build succeeds, no TypeScript errors

**Step 3: Commit label rendering**

```bash
git add apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx
git commit -m "feat(band-chart): render brush day count label above chart

Display trading day count using CrosshairXLabel component.
Positioned at center of brush selection, 10px above chart top.
Format: '{count}D' (e.g., '212D').

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Manual Testing

**Files:**
- Test: `http://localhost:4200/factor/home` (web application)

**Step 1: Start development server**

Run: `npx nx run web:serve`

Expected: Server starts, accessible at `http://localhost:4200`

**Step 2: Navigate to Factor page**

1. Open browser to `http://localhost:4200/factor/home`
2. Wait for page to load
3. Click on any strategy in the leaderboard (e.g., "Trend Following")

Expected: Chart enters selected mode with orange strategy line and blue baseline

**Step 3: Test brush drag with day count label**

1. Click and hold on the chart
2. Drag horizontally to create a selection range
3. Observe the label appearing above the chart during drag

Expected:
- Label appears immediately when drag threshold is crossed (>5px)
- Label shows format like "45D", "212D", etc.
- Label position: center of selection, above chart top
- Label updates in real-time as selection expands/contracts

**Step 4: Test persistence after release**

1. Release mouse button after creating selection
2. Observe the label remains visible
3. Do NOT move mouse yet

Expected:
- Selection rectangle disappears
- Day count label PERSISTS
- Label shows correct count for the released selection

**Step 5: Test clearing on crosshair interaction**

1. Move mouse over the chart (without clicking)
2. Observe crosshair appears and day count label disappears

Expected:
- Crosshair activates normally
- Day count label clears immediately

**Step 6: Test clearing on mouse leave**

1. Create new brush selection
2. Move mouse outside the chart area

Expected:
- All brush states clear
- Day count label disappears

**Step 7: Test edge cases**

Test small selection (2-3 days):
- Drag very small range
- Verify label shows "2D" or "3D"
- Verify label is readable

Test large selection (full history):
- Drag across entire chart
- Verify label shows "1000D" or similar
- Verify label width auto-adjusts

Test rapid interactions:
- Drag → release → immediately hover
- Verify day count clears on first crosshair

**Step 8: Visual verification**

Check positioning:
- [ ] Label appears above chart (negative Y)
- [ ] Label does not overlap with DrawdownArea
- [ ] Label centers on selection
- [ ] Label style matches crosshair labels (black bg, white text)

**Step 9: Document test results**

If all tests pass, commit a test documentation note:

```bash
git add docs/plans/2026-02-13-brush-day-count-label-implementation.md
git commit -m "docs: verify brush day count label manual testing

All test scenarios passed:
✓ Real-time day count during drag
✓ Persistence after release
✓ Clear on crosshair interaction
✓ Clear on mouse leave
✓ Small/large selections render correctly
✓ Label positioned above chart without overlap

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Final Verification and Linting

**Files:**
- Verify: All modified files

**Step 1: Run linter**

Run: `npx nx run web:lint --fix`

Expected: No errors, warnings auto-fixed

**Step 2: Run type check**

Run: `npx nx run web:build --skip-nx-cache`

Expected: Build succeeds with no errors

**Step 3: Commit lint fixes (if any)**

```bash
git add apps/web/src/lib/ngx-charts/band-chart/components/band-tooltip-area.tsx
git commit -m "style: apply linting fixes to brush day count label

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Step 4: Review all changes**

Run: `git log --oneline -10`

Expected: 6-7 commits showing incremental progress

Run: `git diff main..HEAD`

Expected: Changes only to `band-tooltip-area.tsx`, all changes match design spec

---

## Completion Checklist

- [ ] Task 1: State management added
- [ ] Task 2: Day count calculation during drag
- [ ] Task 3: Clear on crosshair interaction
- [ ] Task 4: Clear on mouse leave
- [ ] Task 5: Label rendering
- [ ] Task 6: Manual testing passed
- [ ] Task 7: Linting and verification

**Next Steps After Completion:**

Use `superpowers:finishing-a-development-branch` to:
1. Review all commits
2. Create pull request
3. Merge to main

**Implementation Notes:**

- No unit tests required (UI interaction feature)
- Manual testing is sufficient for verification
- All code changes in single file (band-tooltip-area.tsx)
- Reuses existing components (CrosshairXLabel, findClosestPointIndex)
- No breaking changes to existing functionality
