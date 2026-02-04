# Task: Adaptive Content Scaling & Water Ripple Expansion

Content size and visibility adjustments based on tile dimensions, combined with water ripple expansion for small tiles. Centralized `applyAdaptiveStyles()` function recomputes all adaptive properties on initial render and during hover layout changes.

---

## Design

### Purpose
Ensure text and metrics remain readable across variable tile sizes through:
1. **Continuous adaptive scaling** — Font sizes, padding, badge prominence scale with `sqrt(area)`
2. **Visibility rules** — Content hidden/shown based on min dimension thresholds
3. **Vertical text modes** — Tall tiles and narrow tiles use `writing-mode: vertical-rl`
4. **Compact value** — Drop "亿" unit when vertical value would overlap badge
5. **Water ripple expansion** — Small tiles expand to W/d × H/d on hover (d = min(4, √n), n = tile count)
6. **Hover adaptive refresh** — ALL tiles recompute adaptive styles when layout changes during hover

### Layout Constraints
- **Horizontal bias**: Virtual container height stretched by S=1.35, Y scaled back → ≥80% tiles have width > height
- **D3 config**: `treemapSquarify.ratio(1)`, `padding(2)`
- **No initial max tile clamping** — D3 squarify naturally balances tiles; W/d × H/d is hover expansion target only (d = min(4, √n))

### Continuous Scaling (replaces discrete size categories)

All properties interpolate based on `t = normalized sqrt(area)` where t ∈ [0, 1]:

| Property | t=0 (smallest) | t=1 (largest) |
|----------|----------------|---------------|
| Name font-size | 9px | 28px |
| Name font-weight | 400 | 700 |
| Value font-size | 8px | 13px |
| Badge font-size | 7px | 12px |
| Content padding | 4px | 16px |
| Badge bg alpha | 0.03 | 0.15 |
| Badge border alpha | 0.06 | 0.25 |
| Badge shadow alpha | 0.05 | 0.3 |
| Badge pad (V/H) | 2px / 4px | 4.5px / 6px |

### Visibility Rules

```typescript
const minDim = Math.min(width, height);
const threshold = Math.min(containerW / 4, containerH / 4);

hideValue:     minDim < 50
hideBadge:     minDim < 50
showSparkline: minDim >= threshold
verticalText:  height > width * 1.2
verticalValue: !verticalText && headerDoesntFitHorizontally
```

### Name Width Constraint

```typescript
const maxNameSize = (0.5 * textFlowDim) / Math.max(charCount, 1);
nameSize = Math.min(nameSize, Math.max(9, maxNameSize));
```

### Compact Value (Auto-Drop Unit)

```typescript
const needCompact = isValueVertical && valueCharH > spaceForValue;
valueEl.textContent = needCompact ? shortValueText : fullValueText;
// "+125.5亿" → "+125.5"
```

### Centralized `applyAdaptiveStyles()`

Single module-scope function called on initial render AND during hover layout changes:

```
D3 Render Chain:
.each() → tile style + corner radius
.html() → generates DOM
.each() → applyAdaptiveStyles() + sparkline  ← MUST be after .html()
.each() → hover event handlers
```

---

## Water Ripple Expansion

### When to Apply
- **Trigger**: Small tiles (min dimension < 200px) on hover
- **Target**: Expand to **W/d × H/d** rectangle where d = min(4, √n), n = tile count (e.g., 300×285px for 31 tiles at 1200×1140; 347×330px for 12 tiles)
- **Effect**: Surrounding tiles pushed away like water ripples
- **Constraints**:
  - Zero overlaps
  - No boundary overflow
  - Border preservation (2px border never clipped)

### Algorithm: Split-Line Propagation with Grouping

**Problem**: D3 treemap's `padding(2)` creates 2px gaps between tiles, resulting in separate split lines that can overlap during expansion.

**Solution**: Group split lines within tolerance distance (TOL=2.5) so they move together as logical units.

#### Phase 1: Split Line Grouping

```javascript
function buildSplitLineStructure(layout) {
    const TOL = 2.5;  // Slightly > padding to group separated boundaries

    // Collect all edge positions
    const vEdges = [], hEdges = [];
    layout.forEach(tile => {
        vEdges.push(tile.x, tile.x + tile.width);
        hEdges.push(tile.y, tile.y + tile.height);
    });

    // Group nearby edges (within TOL)
    function groupEdges(edges) {
        const sorted = [...new Set(edges)].sort((a, b) => a - b);
        const groups = [];
        let currentGroup = [sorted[0]];

        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] - sorted[i - 1] <= TOL) {
                currentGroup.push(sorted[i]);
            } else {
                groups.push(currentGroup);
                currentGroup = [sorted[i]];
            }
        }
        if (currentGroup.length > 0) groups.push(currentGroup);

        return groups.map(group => ({
            canonical: Math.round(group[Math.floor(group.length / 2)]),
            values: group
        }));
    }

    const vGroups = groupEdges(vEdges);
    const hGroups = groupEdges(hEdges);

    // Map actual edge values to canonical positions
    const vLineMap = new Map();
    const hLineMap = new Map();
    vGroups.forEach(g => g.values.forEach(v => vLineMap.set(v, g.canonical)));
    hGroups.forEach(g => g.values.forEach(v => hLineMap.set(v, g.canonical)));

    return { vLines: ..., hLines: ..., vLineMap, hLineMap };
}
```

**Result**: Split lines reduced from ~64 to ~36 unique edges.

#### Phase 2: Border-Aware Virtual Boundary

```javascript
// Define virtual boundary to preserve 2px borders
const BORDER_WIDTH = 2;
const VIRTUAL_PADDING = BORDER_WIDTH * 2; // 4px total

const virtualW = W - VIRTUAL_PADDING;
const virtualH = H - VIRTUAL_PADDING;
const offset = BORDER_WIDTH; // 2px offset from container edge

// All calculations use virtual dimensions
// Ensures edge tiles' borders never get clipped by container overflow
```

**Result**: 2px border always visible, never clipped by `overflow: hidden`.

#### Phase 3: Boundary-Aware Expansion

```javascript
const BOUNDARY_MARGIN = 50;

// Adjust expansion direction based on proximity to virtual boundaries
if (hovL < BOUNDARY_MARGIN + offset) {
    // Close to left edge - expand more to the right
    leftExp = Math.min((hovL - offset) * 0.5, exp.w * 0.2);
    rightExp = exp.w - leftExp;
} else if (hovR > virtualW - BOUNDARY_MARGIN + offset) {
    // Close to right edge - expand more to the left
    rightExp = Math.min((virtualW + offset - hovR) * 0.5, exp.w * 0.2);
    leftExp = exp.w - rightExp;
}
```

**Result**: Corner/edge tiles expand without overflowing virtual boundary, borders preserved.

#### Phase 4: Gradient Compression & Constraint Solving

**Core Principle**: "Progressive tax" — large tiles contribute most compression, tiny tiles contribute zero.

**Architecture**: The algorithm processes V-axis and H-axis **independently**. Each axis calls `elasticRedistribute()` which is a 3-step pipeline:
1. Gradient compression via `gradientMapRegion()` → redistribute split-line positions
2. Tile-level MIN enforcement loop (max 50 iterations)
3. Monotonicity enforcement

```
calculateRippleLayout(hoveredIndex)
├── buildTileSpans('v')  →  vTileSpans: [[loCanonical, hiCanonical], ...]
├── buildTileSpans('h')  →  hTileSpans: [[loCanonical, hiCanonical], ...]
├── elasticRedistribute(vCanonicals, hovL, hovR, targetW, VB_L, VB_R, vTileSpans)  →  vLinePos
├── elasticRedistribute(hCanonicals, hovT, hovB, targetH, VB_T, VB_B, hTileSpans)  →  hLinePos
└── Build newLayout by mapping each tile's canonical edges through vLinePos/hLinePos
```

##### 4.1 Edge-Pinning for Boundary Tiles

```javascript
// Detect if hovered tile is at container edge
const pinnedLeft = (idxLo === 0);        // First canonical = container left
const pinnedRight = (idxHi === n - 1);   // Last canonical = container right

if (pinnedLeft && pinnedRight) {
    newHovLo = vbLo; newHovHi = vbHi;    // Fill entire axis
} else if (pinnedLeft) {
    newHovLo = vbLo;                      // Pin left edge
    newHovHi = Math.min(vbLo + targetSize, vbHi);  // Grow rightward only
} else if (pinnedRight) {
    newHovHi = vbHi;                      // Pin right edge
    newHovLo = Math.max(vbHi - targetSize, vbLo);  // Grow leftward only
}
```

**Result**: Eliminates left/top gaps when hovering edge tiles.

##### 4.2 `analyzeRegionIntervals` — Interval Analysis with 5-Tier Gradient

This function is the core intelligence. For a set of canonical indices, it analyzes each interval between consecutive canonicals and computes:
- Which tile spans this interval (smallest tile wins)
- How much that tile can compress (compressible = tileSize - MIN)
- A **gradient rate** based on compressible headroom
- A **weight** = intervalSize × rate (determines compression share)
- A **minSize** = intervalSize × (MIN / tileSize) (floor for this interval)

```javascript
function analyzeRegionIntervals(regionIndices) {
    const regionCans = regionIndices.map(i => canonicals[i]);
    const intervals = [];
    let totalWeight = 0;
    let totalMinFootprint = 0;

    for (let k = 0; k < regionCans.length - 1; k++) {
        const intLo = regionCans[k];
        const intHi = regionCans[k + 1];
        const intSize = intHi - intLo;
        if (intSize < 0.01) continue;

        // Find the SMALLEST tile that spans this interval
        let bestTileSize = Infinity;
        for (const [tLo, tHi] of tileSpans) {
            if (tLo === hovLo && tHi === hovHi) continue;  // Skip hovered tile
            if (tLo <= intLo && tHi >= intHi) {
                const ts = tHi - tLo;
                if (ts < bestTileSize) bestTileSize = ts;
            }
        }
        if (bestTileSize === Infinity) bestTileSize = intSize;

        // 5-tier gradient rate based on compressible headroom
        const compressible = Math.max(0, bestTileSize - MIN);
        let rate;
        if (compressible <= 5)        rate = 0;      // Tiny: exempt
        else if (compressible <= 15)  rate = 0.15;   // Very small: minimal
        else if (compressible <= 40)  rate = 0.4;    // Small: moderate
        else if (compressible <= 80)  rate = 0.7;    // Medium: substantial
        else                          rate = 1.0;    // Large: full contribution

        const weight = intSize * rate;
        totalWeight += weight;

        // Minimum size: tiles already ≤MIN can't compress at all
        const minSize = (bestTileSize <= MIN)
            ? intSize                            // Floor = full original size
            : intSize * (MIN / bestTileSize);    // Floor = proportional MIN
        totalMinFootprint += minSize;

        intervals.push({
            lo: intLo, hi: intHi, size: intSize,
            compressible, rate, weight, minSize, bestTileSize
        });
    }

    const totalOrigRange = regionCans.length > 1
        ? regionCans[regionCans.length - 1] - regionCans[0] : 0;
    const trueCapacity = Math.max(0, totalOrigRange - totalMinFootprint);

    return { intervals, totalWeight, totalMinFootprint, totalOrigRange, trueCapacity };
}
```

**Key**: `trueCapacity` = how much the region can actually shrink. Used to decide expansion direction.

##### 4.3 Capacity-Aware Directional Expansion

For non-edge tiles, compute true capacity on each side and distribute expansion proportionally:

```javascript
// Build region indices
const beforeIndices = [];  // [0, 1, ..., idxLo]
for (let i = 0; i <= idxLo; i++) beforeIndices.push(i);
const afterIndices = [];   // [idxHi, idxHi+1, ..., n-1]
for (let i = idxHi; i < n; i++) afterIndices.push(i);

const beforeAnalysis = analyzeRegionIntervals(beforeIndices);
const afterAnalysis = analyzeRegionIntervals(afterIndices);

const spaceBefore = hovLo - vbLo;  // Raw pixel space before hovered tile
const spaceAfter = vbHi - hovHi;   // Raw pixel space after hovered tile

// Effective capacity = min(raw space, true compressible capacity)
const effBefore = Math.min(spaceBefore, beforeAnalysis.trueCapacity);
const effAfter = Math.min(spaceAfter, afterAnalysis.trueCapacity);
const totalEffective = effBefore + effAfter;

let expandBefore, expandAfter;
if (totalEffective > 0.01) {
    expandBefore = needExpand * (effBefore / totalEffective);
    expandAfter = needExpand * (effAfter / totalEffective);
} else {
    // Fallback: raw space ratio
    expandBefore = needExpand * (spaceBefore / (spaceBefore + spaceAfter));
    expandAfter = needExpand * (spaceAfter / (spaceBefore + spaceAfter));
}

// Cap each side to its true capacity, overflow to opposite side
if (expandBefore > effBefore && effBefore < spaceBefore) {
    expandAfter += (expandBefore - effBefore);
    expandBefore = effBefore;
}
if (expandAfter > effAfter && effAfter < spaceAfter) {
    expandBefore += (expandAfter - effAfter);
    expandAfter = effAfter;
}

// Final cap to raw space + safety clamp to virtual boundary
expandBefore = Math.min(expandBefore, spaceBefore);
expandAfter = Math.min(expandAfter, spaceAfter);

newHovLo = hovLo - expandBefore;
newHovHi = hovHi + expandAfter;
// Safety clamp: if newHovLo < vbLo, shift right; if newHovHi > vbHi, shift left
```

**Result**: Hovering "公用事业" (86% capacity above) expands mostly upward, compressing "电子"/"银行" while preserving "建筑装饰"/"综合".

##### 4.4 `gradientMapRegion` — Core Compression Function

This is the function that actually repositions split lines within a compressed region. Called separately for the "before" region (left of hovered tile) and "after" region (right of hovered tile).

```javascript
function gradientMapRegion(indices, origStart, origEnd, newStart, newEnd) {
    const origRange = origEnd - origStart;
    const newRange = newEnd - newStart;

    // No compression needed — use linear mapping
    if (newRange >= origRange - 0.5) {
        for (const idx of indices) {
            const c = canonicals[idx];
            pos.set(c, newStart + ((c - origStart) / origRange) * newRange);
        }
        return;
    }

    // Compression needed. Use interval analysis for weighted distribution.
    const analysis = analyzeRegionIntervals(indices);
    const totalCompression = origRange - newRange;

    if (analysis.totalWeight < 0.01) {
        // No compressible capacity — fallback to uniform linear
        for (const idx of indices) {
            const c = canonicals[idx];
            pos.set(c, newStart + ((c - origStart) / origRange) * newRange);
        }
        return;
    }

    // Distribute compression across intervals proportionally to weight
    const newSizes = [];
    let totalNewSize = 0;
    for (const iv of analysis.intervals) {
        let compressionShare = (iv.weight > 0)
            ? totalCompression * (iv.weight / analysis.totalWeight)
            : 0;

        // Cap: never compress below interval's minSize
        const maxCompression = Math.max(0, iv.size - iv.minSize);
        compressionShare = Math.min(compressionShare, maxCompression);

        const ns = iv.size - compressionShare;
        newSizes.push(ns);
        totalNewSize += ns;
    }

    // Floating-point adjustment: scale if total doesn't match target
    if (Math.abs(totalNewSize - newRange) > 0.5 && totalNewSize > 0.01) {
        const scale = newRange / totalNewSize;
        for (let k = 0; k < newSizes.length; k++) newSizes[k] *= scale;
    }

    // Place canonicals based on cumulative new sizes
    const regionCanonicals = indices.map(i => canonicals[i]);
    let cursor = newStart;
    pos.set(regionCanonicals[0], newStart);
    for (let k = 0; k < analysis.intervals.length; k++) {
        cursor += newSizes[k];
        pos.set(analysis.intervals[k].hi, cursor);
    }
    pos.set(regionCanonicals[regionCanonicals.length - 1], newEnd);
}
```

**Region splitting**: The canonicals are divided into 3 groups:
- `leftIndices` = [0 ... idxLo] → compressed via `gradientMapRegion`
- `insideIndices` = [idxLo ... idxHi] → linear scale (the hovered tile itself)
- `rightIndices` = [idxHi ... n-1] → compressed via `gradientMapRegion`

##### 4.5 Tile-Level MIN Enforcement (Iterative, max 50 iterations)

After gradient compression, some tiles may have been squeezed below their effective MIN. This step iteratively fixes them:

```javascript
const lockedCanonicals = new Set([hovLo, hovHi]);  // Never move hovered tile edges

for (let iter = 0; iter < 50; iter++) {
    let anyFixed = false;

    for (const [tLo, tHi] of tileSpans) {
        const curLo = pos.get(tLo);
        const curHi = pos.get(tHi);
        if (curLo === undefined || curHi === undefined) continue;

        const origSpan = tHi - tLo;
        const effectiveMin = Math.min(MIN, origSpan);  // Adaptive MIN
        const span = curHi - curLo;
        if (span >= effectiveMin - 0.5) continue;      // Already OK

        // Expand from midpoint
        const midpoint = (curLo + curHi) / 2;
        let desiredLo = midpoint - effectiveMin / 2;
        let desiredHi = midpoint + effectiveMin / 2;

        // Clamp to virtual boundary
        if (desiredLo < vbLo) { desiredLo = vbLo; desiredHi = vbLo + effectiveMin; }
        if (desiredHi > vbHi) { desiredHi = vbHi; desiredLo = vbHi - effectiveMin; }

        // Respect locked canonicals
        if (lockedCanonicals.has(tLo) && lockedCanonicals.has(tHi)) continue;
        if (lockedCanonicals.has(tLo)) {
            desiredLo = curLo; desiredHi = curLo + effectiveMin;
            if (desiredHi > vbHi) desiredHi = vbHi;
        }
        if (lockedCanonicals.has(tHi)) {
            desiredHi = curHi; desiredLo = curHi - effectiveMin;
            if (desiredLo < vbLo) desiredLo = vbLo;
        }

        if (!lockedCanonicals.has(tLo) && Math.abs(pos.get(tLo) - desiredLo) > 0.5) {
            pos.set(tLo, desiredLo); anyFixed = true;
        }
        if (!lockedCanonicals.has(tHi) && Math.abs(pos.get(tHi) - desiredHi) > 0.5) {
            pos.set(tHi, desiredHi); anyFixed = true;
        }
    }

    if (!anyFixed) break;
}
```

**Key**: `buildTileSpans(axis)` returns `[[loCanonical, hiCanonical], ...]` for each tile, using `splitLineStructure.vLineMap` / `hLineMap` to map raw edge positions to canonical positions.

##### 4.6 Monotonicity Enforcement

After MIN enforcement may push canonicals out of order. Final pass ensures positions are monotonically increasing:

```javascript
const sortedPositions = canonicals.map(c => pos.get(c));
for (let i = 1; i < sortedPositions.length; i++) {
    if (sortedPositions[i] < sortedPositions[i - 1]) {
        if (!lockedCanonicals.has(canonicals[i])) {
            sortedPositions[i] = sortedPositions[i - 1];
            pos.set(canonicals[i], sortedPositions[i]);
        }
    }
}
```

##### 4.7 Adaptive MIN Enforcement

```javascript
// ❌ WRONG: Force all tiles ≥ 60px
const MIN = 60;
if (tileSpan < MIN) expandTile(MIN - tileSpan);

// ✅ CORRECT: Respect tiles already smaller than MIN
const origSpan = tHi - tLo;  // Original canonical span
const effectiveMin = Math.min(MIN, origSpan);
// Tiles naturally 36px → effectiveMin = 36px, not 60px
```

**Used in**: `analyzeRegionIntervals` (minSize calculation) and tile-level MIN enforcement loop.

##### 4.8 Hover Lock Mechanism

```javascript
let activeHoverIndex = -1;

tileElement.addEventListener('mouseenter', (e) => {
    const tileIndex = getTileIndex(e.target);
    // Lock: ignore if another tile is expanding
    if (activeHoverIndex >= 0 && activeHoverIndex !== tileIndex) return;
    activeHoverIndex = tileIndex;
    expandTile(tileIndex);
});

tileElement.addEventListener('mouseleave', (e) => {
    const tileIndex = getTileIndex(e.target);
    // Unlock only on same tile's leave
    if (activeHoverIndex === tileIndex) {
        activeHoverIndex = -1;
        resetLayout();
    }
});
```

**Result**: Prevents cursor drift during 400ms CSS transitions.

##### 4.9 Map Iteration Safety

```javascript
// ❌ DANGEROUS: Modifying Map during forEach
hLinePos.forEach((v, k) => { hLinePos.set(k, v - shift); });

// ✅ SAFE: Collect updates first, then apply
const updates = [];
hLinePos.forEach((v, k) => updates.push([k, v - shift]));
updates.forEach(([k, v]) => hLinePos.set(k, v));
```

##### Summary: `elasticRedistribute` Full Pipeline

```
Input: canonicals[], hovLo, hovHi, targetSize, vbLo, vbHi, tileSpans[]

Step 0: Edge-pinning → compute newHovLo, newHovHi
        (if pinnedLeft: pin left, grow right; if pinnedRight: pin right, grow left)

Step 0b: Capacity-aware directional expansion (non-edge tiles only)
         → analyzeRegionIntervals(beforeIndices) → trueCapacity before
         → analyzeRegionIntervals(afterIndices) → trueCapacity after
         → distribute needExpand proportionally to effective capacity
         → cap per side, overflow to opposite, safety clamp

Step 1: Gradient compression
        → gradientMapRegion(leftIndices, origStart=canonicals[0], origEnd=hovLo,
                            newStart=vbLo, newEnd=newHovLo)
        → Linear scale for insideIndices (hovered tile)
        → gradientMapRegion(rightIndices, origStart=hovHi, origEnd=canonicals[n-1],
                            newStart=newHovHi, newEnd=vbHi)
        → Lock hovered tile boundaries: pos.set(hovLo, newHovLo); pos.set(hovHi, newHovHi)

Step 2: Tile-level MIN enforcement (max 50 iterations)
        → For each tileSpan [tLo, tHi]: if span < effectiveMin, expand from midpoint
        → Respect locked canonicals (hovered tile edges)
        → Early termination when no adjustments needed

Step 3: Monotonicity enforcement
        → Ensure pos values are non-decreasing along canonicals[]

Output: Map<canonical, newPosition>
```

**Convergence**: XL/L: 5-10 iterations, M: 15-25 iterations.

**Result**:
- Hovered tile: ≥95% of W/4 × H/4
- Zero overlaps (tolerance: 2px padding)
- Zero boundary overflow
- All tiles ≥ effectiveMin
- Water ripple propagates across entire layout

#### Phase 5: Expansion Validation

```javascript
// Validate hovered tile reached target size
const finalW = vLinePos.get(hovR) - vLinePos.get(hovL);
const finalH = hLinePos.get(hovB) - hLinePos.get(hovT);

const widthRatio = finalW / targetW;
const heightRatio = finalH / targetH;

if (widthRatio < 0.95 || heightRatio < 0.95) {
    console.error(
        `❌ Expansion failed for tile ${hoveredIndex}: ` +
        `${finalW.toFixed(0)}×${finalH.toFixed(0)} ` +
        `(${(widthRatio * 100).toFixed(1)}% × ${(heightRatio * 100).toFixed(1)}%) ` +
        `of target ${targetW}×${targetH}`
    );
}
```

**Result**: Failed expansions logged, providing diagnostic info for edge cases.

### Adaptive Expansion Target

Tiles expand to a **W/d × H/d** rectangle where **d = min(4, √n)** and n is the current tile count. This adapts the hover target to the number of visible tiles — fewer tiles get proportionally larger expansion targets:

```javascript
function tileDivisor() { return Math.min(4, Math.sqrt(currentEntities.length)); }
function targetW() { return W / tileDivisor(); }
function targetH() { return H / tileDivisor(); }
```

| Tiles (n) | Divisor d | Target at XL (1200×1140) | Target at L (800×760) |
|-----------|-----------|--------------------------|----------------------|
| 31 (L1) | 4 (capped) | 300×285px | 200×190px |
| 12 (L2) | 3.46 | 347×330px | 231×220px |
| 8 (L2) | 2.83 | 424×403px | 283×269px |
| 5 (L2) | 2.24 | 536×509px | 357×339px |

**Rationale**: Adaptive ratio ensures:
- Consistent user experience: hover target scales with tile density
- Fewer tiles → larger expansion (avoids tiny targets in drilled-down views)
- Capped at 4 for ≥16 tiles (preserves original behavior for L1)

---

## Implementation

### `applyAdaptiveStyles()` — Complete Function

```typescript
function applyAdaptiveStyles(el: HTMLElement, data: TileData, w: number, h: number) {
  const t = getTileScale(w, h);  // 0..1 normalized sqrt(area)
  const minDim = Math.min(w, h);
  const threshold = Math.min(targetW(), targetH());

  // --- Name sizing with width constraint ---
  let nameSize = lerp(9, 28, t);
  const charCount = data.name.length;
  const isVertical = h > w * 1.2;
  const pad = lerp(4, 16, t);
  const textFlowDim = isVertical ? h - 2 * pad : w - 2 * pad;
  const maxNameSize = (0.5 * textFlowDim) / Math.max(charCount, 1);
  nameSize = Math.min(nameSize, Math.max(9, maxNameSize));

  const nameWeight = Math.round(lerp(400, 700, t));
  const valueSize = lerp(8, 13, t);
  const badgeSize = lerp(7, 12, t);

  // --- Set CSS variables ---
  el.style.setProperty('--tile-name-size', nameSize + 'px');
  el.style.setProperty('--tile-name-weight', nameWeight);
  el.style.setProperty('--tile-value-size', valueSize + 'px');
  el.style.setProperty('--tile-badge-size', badgeSize + 'px');
  el.style.setProperty('--tile-pad', pad + 'px');

  // --- Badge prominence gradient ---
  const badgePadV = lerp(2, 4.5, t);
  const badgePadH = lerp(4, 6, t);
  el.style.setProperty('--badge-bg-alpha', lerp(0.03, 0.15, t));
  el.style.setProperty('--badge-border-alpha', lerp(0.06, 0.25, t));
  el.style.setProperty('--badge-shadow-alpha', lerp(0.05, 0.3, t));
  el.style.setProperty('--badge-pad', `${badgePadV}px ${badgePadH}px`);
  el.style.setProperty('--badge-pad-h', badgePadH + 'px');

  // --- Layout classes ---
  el.classList.toggle('show-sparkline', minDim >= threshold);
  el.classList.toggle('vertical-text', isVertical);

  // --- Horizontal fit check → vertical-value ---
  const availW = w - 2 * pad;
  const nameW = data.name.length * nameSize * 0.85;
  const fullValueW = fullValueText.length * valueSize * 0.6;
  const headerFitsH = (nameW + 6 + fullValueW) <= availW;
  const needVerticalValue = !isVertical && !headerFitsH;

  // --- Compact value: drop "亿" if vertical value overlaps badge ---
  const badgeH = badgeSize * 1.3 + 2 * badgePadV;
  const valueCharH = fullValueText.length * valueSize;
  const spaceForValue = (h - 2 * pad) - (needVerticalValue ? badgeH + 4 : 0);
  const needCompact = (needVerticalValue || isVertical) && valueCharH > spaceForValue;

  const valueEl = el.querySelector('.tile-value');
  if (valueEl) valueEl.textContent = needCompact ? shortValueText : fullValueText;

  // --- Visibility ---
  el.classList.toggle('hide-value', minDim < 50);
  el.classList.toggle('hide-badge', minDim < 50);
  el.classList.toggle('hide-sparkline', minDim < threshold);
  el.classList.toggle('vertical-value', needVerticalValue);
}
```

### `applyLayout()` — Hover Refresh

Called when hover triggers water ripple expansion. Recomputes EVERYTHING for all tiles:

```typescript
function applyLayout(layout) {
  d3.selectAll('.tile').each(function(d, i) {
    const l = layout[i];
    this.style.left = l.x + 'px';
    this.style.top = l.y + 'px';
    this.style.width = l.width + 'px';
    this.style.height = l.height + 'px';

    // Recompute corner radius for new position
    // ... (Binance-style edge detection)

    // Recompute ALL adaptive styles for new dimensions
    applyAdaptiveStyles(this, l.data, l.width, l.height);
  });
}
```

### Reference Implementation

Prototype: `docs/treemap-preview/reference/treemap-preview.html` — Standalone HTML+JS+D3 with header row layout, badge prominence gradient, vertical text modes, compact value, water ripple expansion, hover adaptive refresh, 60-day candlestick sparkline.

**Function Signatures & Responsibilities**:

| Function | Signature | Purpose |
|----------|-----------|---------|
| `buildSplitLineStructure(layout)` | `layout: {x,y,width,height}[]` → `{vLines, hLines, vLineMap, hLineMap, vCanonicals, hCanonicals}` | Groups tile edges within TOL=2.5 into canonical split lines. Reduces ~64 raw edges to ~36 canonicals. |
| `buildTileSpans(axis)` | `axis: 'v'\|'h'` → `[loCanonical, hiCanonical][]` | Maps each tile to its canonical lo/hi boundaries on the given axis using `splitLineStructure.*LineMap`. |
| `elasticRedistribute(canonicals, hovLo, hovHi, targetSize, vbLo, vbHi, tileSpans)` | Returns `Map<canonical, newPosition>` | Main 1-axis compression: edge-pinning → capacity-aware expansion → gradient compression → MIN enforcement → monotonicity. |
| `analyzeRegionIntervals(regionIndices)` | Nested inside `elasticRedistribute`. Uses closure over `canonicals`, `tileSpans`, `hovLo`, `hovHi`. Returns `{intervals, totalWeight, totalMinFootprint, totalOrigRange, trueCapacity}` | Analyzes compressibility of each interval between consecutive canonicals. 5-tier gradient rate. |
| `gradientMapRegion(indices, origStart, origEnd, newStart, newEnd)` | Nested inside `elasticRedistribute`. Writes to `pos` Map. | Redistributes split-line positions within a compressed region, weighted by gradient rates. |
| `calculateRippleLayout(hoveredIndex)` | `hoveredIndex: number` → `layout[]` (same shape as `originalLayout`) | Orchestrates expansion: builds tile spans, calls `elasticRedistribute` on V and H axes independently, maps results to new tile positions. |

**Constants**:
- `MIN = 60` — minimum tile dimension (px), adaptive: `effectiveMin = Math.min(MIN, origSpan)`
- `BORDER = 2` — virtual boundary offset from container edge
- `TOL = 2.5` — split-line grouping tolerance
- Target size: `W/d × H/d` where `d = min(4, √n)`, n = tile count

**Mock Data**: 31 sectors with `capitalFlow` values, weights via `Math.pow(Math.abs(capitalFlow), 0.8)`

**D3 Treemap Config**: `d3.treemapSquarify.ratio(1)`, `padding(2)`, layout inside virtual boundary `(W-4) × (H-4)`, horizontal bias via S=1.35 virtual height stretch

**Horizontal Bias Layout**:
```javascript
const S = 1.35;
d3.treemap()
    .size([vW(), vH() * S])
    .padding(2)
    .tile(d3.treemapSquarify.ratio(1))(root);

// Scale Y back — tiles biased toward horizontal (width > height)
originalLayout = root.leaves().map(d => ({
    data: d.data,
    x: d.x0 + BORDER,
    y: (d.y0 / S) + BORDER,
    width: d.x1 - d.x0,
    height: (d.y1 - d.y0) / S
}));
```

**Test Coverage**: 87 test scenarios (29 small tiles × 3 container sizes), all passing

---

## Acceptance Criteria

✅ **Continuous Adaptive Scaling:**
- [ ] Font sizes scale continuously via sqrt(area) normalization
- [ ] Name width constraint prevents overflow on long names
- [ ] Badge prominence gradient scales with tile area
- [ ] Vertical text activates when h > w × 1.2
- [ ] Vertical value activates when horizontal header doesn't fit
- [ ] Compact value drops "亿" when vertical value would overlap badge
- [ ] `applyAdaptiveStyles()` runs AFTER `.html()` in D3 render chain

✅ **Water Ripple Expansion (Small Tiles < 200px):**
- [ ] **CRITICAL**: Expands to **exact W/4 × H/4 rectangle** on hover (≥95% of target)
  - Width ≥ 95% of W/4
  - Height ≥ 95% of H/4
  - No竖状长方形 (vertical rectangles where width < height)
  - Rectangle shape required for sparkline display
- [ ] Zero overlaps maintained (tolerance: 2px for padding)
- [ ] No boundary overflow on corner/edge tiles
- [ ] Border preservation: 2px borders never clipped by container
- [ ] Surrounding tiles pushed away smoothly
- [ ] Split lines stay aligned (edge count reduced ~36)
- [ ] Smooth 400ms transition

✅ **Gradient Compression:**
- [ ] Large tiles (compressible >100px) absorb majority of compression
- [ ] Tiny tiles (original size ≤60px) remain visible and not crushed
- [ ] Adaptive MIN: tiles naturally small not forced to 60px
- [ ] Example: Hovering "公用事业" in M size preserves "建筑装饰" (34px) and "综合" (31px)

✅ **Edge Cases:**
- [ ] Edge-pinning: Hovering left/top tiles expands inward, no gaps
- [ ] Hover lock: No cursor drift during 400ms transitions
- [ ] Smart direction: Expands toward direction with more compressible capacity
- [ ] M size stability: No overlaps in 600×570 container

✅ **Large Tiles (≥ 200px):**
- [ ] No water ripple expansion (already sufficient size)
- [ ] Sparkline visible by default
- [ ] Subtle glow on hover only

✅ **Medium Tiles (120-200px):**
- [ ] No water ripple expansion
- [ ] Sparkline appears on hover
- [ ] All content visible

✅ **Layout Constraints:**
- [ ] ≥80% of tiles have width > height (horizontal bias via S=1.35 stretch)
- [ ] No non-padding gaps between tiles (tiles fill container fully)
- [ ] Balanced visual hierarchy maintained
- [ ] D3 config: `treemapSquarify.ratio(1)` with virtual height stretch S=1.35

✅ **Multi-Size Support:**
- [ ] XL (1200×1140): 300×285px target, all 29 small tiles expand correctly
- [ ] L (800×760): 200×190px target, all 29 small tiles expand correctly
- [ ] M (600×570): 150×142px target, all 29 small tiles expand correctly
- [ ] Total: 87 test scenarios pass

✅ **Container & Visual:**
- [ ] Symmetric 2px gap between tiles and container edge on all four sides
- [ ] Container border uses `box-shadow` (not CSS `border`) to avoid layout space consumption
- [ ] Container `overflow: visible` — hover glow not clipped on any edge
- [ ] Hover glow fully visible on right-edge tiles (e.g., rightmost column)
- [ ] Hover glow fully visible on bottom-edge tiles (e.g., bottom row, right + bottom corners)
- [ ] Container border-radius (12px) preserved visually

✅ **Performance:**
- [ ] Hover expansion completes in <50ms
- [ ] Smooth 60fps animations
- [ ] No layout thrashing
- [ ] Constraint loop converges in <25 iterations

---

## Testing

### Automated Testing (Playwright)

**Exhaustive Test**: Test all small tiles (minDim < 200px) across all container sizes.

```javascript
// test-v11-exhaustive.js
const sizes = [
    { name: 'XL', width: 1200, height: 1140 },
    { name: 'L', width: 800, height: 760 },
    { name: 'M', width: 600, height: 570 }
];

for (const size of sizes) {
    await page.setViewportSize({ width: size.width, height: size.height });

    const tiles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.tile')).map((tile, i) => {
            const rect = tile.getBoundingClientRect();
            return {
                index: i,
                name: tile.querySelector('.tile-name').textContent,
                minDim: Math.min(rect.width, rect.height)
            };
        });
    });

    // Test all small tiles (minDim < 200px)
    const smallTiles = tiles.filter(t => t.minDim < 200);

    for (const tile of smallTiles) {
        // Hover tile
        const tileDivs = await page.$$('.tile');
        await tileDivs[tile.index].hover();
        await page.waitForTimeout(500);

        // Validate expansion
        const result = await page.evaluate((idx, targetW, targetH) => {
            const hoveredRect = document.querySelectorAll('.tile')[idx].getBoundingClientRect();
            const tiles = Array.from(document.querySelectorAll('.tile'));

            // Check overlaps
            let overlaps = 0;
            for (let i = 0; i < tiles.length; i++) {
                for (let j = i + 1; j < tiles.length; j++) {
                    const a = tiles[i].getBoundingClientRect();
                    const b = tiles[j].getBoundingClientRect();
                    const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
                    const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
                    if (ox > 2 && oy > 2) overlaps++;
                }
            }

            return {
                width: hoveredRect.width,
                height: hoveredRect.height,
                widthRatio: hoveredRect.width / targetW,
                heightRatio: hoveredRect.height / targetH,
                overlaps
            };
        }, tile.index, size.width / 4, size.height / 4);

        // Assert
        if (result.widthRatio < 0.95 || result.heightRatio < 0.95 || result.overlaps > 0) {
            console.error(`❌ FAILED: ${size.name} - ${tile.name}`);
        } else {
            console.log(`✅ PASSED: ${size.name} - ${tile.name}`);
        }

        // Reset
        await page.mouse.move(0, 0);
        await page.waitForTimeout(500);
    }
}
```

**Expected**: 87 tests passed (29 small tiles × 3 container sizes)

### Critical Test Cases

**Test 1: Gradient Compression (公用事业 in M size)**

Problem: Tiny tiles "建筑装饰" (34px) and "综合" (31px) become invisible when hovering "公用事业".

Expected:
- 公用事业: 117×111 → 150×142 (100% of target)
- 建筑装饰: 155×71 → 333×70 (visible, preserved)
- 综合: 155×65 → 333×65 (visible, preserved)
- 电子: 374×336 → 309×271 (absorbed compression)
- 银行: 374×298 → 309×242 (absorbed compression)

**Test 2: Edge-Pinning (新能源 in XL size)**

Problem: Hovering left-edge tile "新能源" creates gap between tile and container edge.

Expected:
- 新能源 expands rightward only (left edge pinned at x=2px)
- No gap between tile and container left edge

**Test 3: Hover Lock (建筑装饰 from below)**

Problem: Hovering "建筑装饰" from below causes cursor to slip to "公用事业" during transition.

Expected:
- Hover lock prevents "公用事业" from expanding while "建筑装饰" is animating
- Cursor remains on "建筑装饰" throughout 400ms transition

**Test 4: Smart Direction (公用事业 expansion)**

Problem: "公用事业" expands 50/50 even though 86% compressible capacity is above.

Expected:
- Analyzes capacity: above=86%, below=14%
- Expands 86% upward, 14% downward
- Compresses "电子"/"银行" above, preserves "建筑装饰"/"综合" below

### Automated Static Tests (Added 2026-02-02)

These tests run without hover interaction and validate initial layout quality:

**Test 5: Horizontal Rate ≥80%**

```javascript
// For each container size (XL/L/M), compute layout and check horizontal rate
const layout = computeLayoutForSize(W, H);
const horizontal = layout.filter(t => (t.x1 - t.x0) > (t.y1 - t.y0)).length;
const rate = horizontal / layout.length;
assert(rate >= 0.80, `Horizontal rate ${(rate*100).toFixed(0)}% < 80%`);
```

Expected: ≥80% tiles have width > height across all 3 container sizes.

**Test 6: No Non-Padding Gaps Between Tiles**

```javascript
// For each tile, check that at least one neighbor is within padding distance
const layout = computeLayoutForSize(W, H);
layout.forEach(tile => {
    const hasRightNeighbor = layout.some(other =>
        Math.abs(tile.x1 - other.x0) <= 3 && overlap1D(tile.y0, tile.y1, other.y0, other.y1)
    );
    // ... check all 4 directions
    // Edge tiles exempt from the direction facing the container edge
});
```

Expected: No gaps wider than padding(2) + tolerance between adjacent tiles.

**Test 7: 7-Stop Color Ramp Validation**

```javascript
// Verify color mapping covers all 7 stops
const colors = ['#0B8C5F','#2EBD85','#58CEAA','#76808E','#E8626F','#F6465D','#CF304A'];
const thresholds = [-5, -2, -0.5, 0.5, 2, 5]; // % change boundaries
// Verify each sector maps to correct color based on its changePercent
```

Expected: All 31 sectors assigned correct color from 7-stop ramp.

---

## References

- **Sparkline Integration:** [Task 06](./06-sparkline-integration.md)
- **Upper Panel Layout:** [Task 03](./03-upper-panel.md)
- **Lower Panel Layout:** [Task 04](./04-lower-panel.md)

---

## Technical Notes

### Why Water Ripple Instead of Simple Scale?

**Problem**: Simple scale expansion (1.15×) is visually dated and doesn't provide sufficient space for sparkline display.

**Solution**: Water ripple expansion provides ~200×200px space by pushing surrounding tiles away, maintaining perfect treemap topology.

**Benefits**:
- Sufficient space for sparkline rendering
- Modern, fluid interaction
- Zero overlaps guaranteed
- Boundary-safe (corner tiles handled)

### Why Min Dimension for Size Category?

```typescript
// ❌ Average can be misleading
const avgDimension = (width + height) / 2;
// 200×70 tile: avg = 135 (seems medium, but very narrow)

// ✅ Min dimension correctly identifies constraint
const minDimension = Math.min(width, height);
// 200×70 tile: min = 70 (correctly small)
```

### Content Priority (Most to Least Critical)

1. **Name** (sector name) - Always visible, scales 9-28px
2. **Capital Flow** (资金流向) - Hidden when minDim < 50px, compact mode drops unit
3. **Change%** (涨跌幅) - Hidden when minDim < 50px, prominence scales with area
4. **Sparkline** - Visible when minDim ≥ threshold, or after hover expansion

### Container CSS Strategy

**Problem 1**: Edge tiles' hover glow (`box-shadow`) clipped by container `overflow: hidden`.

**Solution**: `overflow: visible`. The virtual boundary (BORDER=2) already constrains tiles within bounds, so `overflow: hidden` is unnecessary. Removing it allows hover glow to extend beyond the container edge naturally.

**Problem 2**: Container `border: 2px` with `box-sizing: border-box` shrinks the content area by 4px total, causing asymmetric tile gaps — 2px on top/left but 0px on right/bottom (tiles overflow the content area).

**Solution**: Replace CSS `border` with `box-shadow: 0 0 0 2px #333`. Visually identical, follows `border-radius`, but doesn't consume layout space. Content area remains exactly W × H.

```css
#container {
    overflow: visible;                /* Glow not clipped */
    box-shadow: 0 0 0 2px #333;      /* Border without layout impact */
    /* NOT: border: 2px solid #333;   ← consumes layout space */
}
```

**Virtual Boundary**: BORDER=2 creates symmetric 2px padding on all four sides.
- D3 layout size: `(W - 2*BORDER) × (H - 2*BORDER)` = `(W-4) × (H-4)`
- Tile offset: `x = d.x0 + BORDER`, `y = d.y0 + BORDER`
- Result: 2px gap on all four sides between tiles and container edge

### Critical Bug Fixes

#### Bug 1: Map Iteration Corruption

**Problem**: `forEach` modifying Map during iteration causes key loss, producing `undefined` values and NaN dimensions.

```javascript
// ❌ WRONG
hLinePos.forEach((v, k) => {
    hLinePos.set(k, v - shift);  // Corrupts iterator
});
```

**Fix**: Collect updates first, apply after iteration.

```javascript
// ✅ CORRECT
const updates = [];
hLinePos.forEach((v, k) => updates.push([k, v - shift]));
updates.forEach(([k, v]) => hLinePos.set(k, v));
```

#### Bug 2: Water Ripple Not Propagating

**Problem**: Hovering corner tiles only affects nearby tiles, distant large tiles overflow container.

**Fix**: Implemented `elasticRedistribute()` with gradient compression - large tiles proportionally compress to absorb expansion pressure.

#### Bug 3: M Size Overlaps

**Problem**: Hovering "建筑装饰" in M size causes overlap with "综合".

**Root Cause**: MIN enforcement checked consecutive canonical pairs instead of full tile spans.

**Fix**: `buildTileSpans()` - validate each tile's full span from lo to hi canonical, not just adjacent pairs.

#### Bug 4: Left Gap on Edge Tiles

**Problem**: Hovering left-edge tile "新能源" creates gap between tile and container edge.

**Root Cause**: Centering logic shifts tile inward even when already at edge.

**Fix**: Edge-pinning - detect boundary tiles, pin edge, expand inward only.

#### Bug 5: Hover Drift

**Problem**: Hovering "建筑装饰" from below causes cursor to slip to "公用事业" during 400ms transition.

**Root Cause**: Tile positions shift during CSS transition, triggering `mouseenter` on neighbors.

**Fix**: `activeHoverIndex` lock - only one tile can expand at a time, ignore other `mouseenter` events during transition.

#### Bug 6: Wrong Expansion Direction

**Problem**: "公用事业" expands 50/50 despite 86% compressible capacity above.

**Root Cause**: Symmetric expansion from center ignores available space distribution.

**Fix**: `analyzeRegionIntervals()` - calculate true compressible capacity per region, distribute expansion proportionally.

#### Bug 7: Tiny Tiles Crushed

**Problem**: "建筑装饰" (34px) and "综合" (31px) become invisible when hovering nearby "公用事业".

**Root Cause**: Uniform compression doesn't account for tiles already below MIN threshold.

**Fix**: Adaptive MIN - tiles naturally small (≤60px original) use original size as minimum, zero compressible capacity.

#### Bug 8: Hover Glow Clipped on Right/Bottom Edge Tiles

**Problem**: Hovering tiles at the right or bottom edge of the container — their `box-shadow` glow is clipped by `overflow: hidden`.

**Root Cause**: Container uses `overflow: hidden` (originally for rounded-corner clipping). The virtual boundary ensures tiles don't overflow, making `overflow: hidden` unnecessary.

**Fix**: Set `overflow: visible` on container. Glow now renders fully on all edges.

#### Bug 9: Asymmetric Tile Gaps (Top/Left vs Right/Bottom)

**Problem**: Tiles have 2px gap from the top and left container edges, but touch/overflow the right and bottom edges — visually asymmetric.

**Root Cause**: Container `border: 2px` with `box-sizing: border-box` shrinks content area by 4px, but D3 layout fills the full `W - 2*BORDER` and tiles are offset by `+BORDER`. Right/bottom tiles overflow the shrunken content area by 2px.

**Fix**: Replace CSS `border` with `box-shadow: 0 0 0 2px #333` — visually identical, follows `border-radius`, but doesn't consume layout space. Content area stays W × H, and the BORDER=2 offset creates symmetric 2px gaps on all four sides.

### Why Gradient Compression?

**Analogy**: Progressive tax system - wealthy contribute more, poor contribute zero.

**Compression Tiers**:
- Tiles with 150px compressible → contribute 150px
- Tiles with 50px compressible → contribute 50px
- Tiles with 0px compressible (already ≤MIN) → contribute 0px

**Result**: Fair distribution where large tiles absorb pressure, tiny tiles preserved.

### Performance Considerations

**Split Line Grouping**: Reduces canonical edges from ~64 to ~36, improving iteration performance.

**Convergence Speed**:
- XL/L: 5-10 iterations
- M: 15-25 iterations (tighter constraints)

**Optimization**: Early termination when no adjustments made in iteration.
