# Task: Adaptive Content Scaling & Water Ripple Expansion

Content size and visibility adjustments based on tile dimensions, combined with water ripple expansion for small tiles to provide sufficient space for full content display.

---

## Design

### Purpose
Ensure text, icons, and metrics remain readable across variable tile sizes through:
1. **Content adaptive scaling** - Font sizes, icon sizes, visibility rules
2. **Water ripple expansion** - Small tiles expand to W/4 × H/4 on hover, pushing surrounding tiles away

### Layout Constraints
- **Maximum tile size**: No tile can exceed **1/4 container width** × **1/4 container height**
- **Rationale**: Prevents single tile dominance, ensures balanced visual hierarchy
- **Implementation**: Applied in D3 treemap layout algorithm via size clamping

### Size Thresholds

| Tile Size | Min Dimension | Icon Size | Font Size (Name) | Font Size (Metrics) | Notes |
|-----------|---------------|-----------|------------------|---------------------|-------|
| **Large** | ≥ 200px | 16px | 14px (sm) | 12px (xs) | Full detail, sparkline visible |
| **Medium** | 120-200px | 14px | 13px | 11px | Name + capital flow, sparkline on hover |
| **Small** | 60-120px | - | 11px | - | Name only, **water ripple expansion on hover** |
| **Tiny** | < 60px | - | 10px | - | Minimal display |

**Note**: Power scaling (x^0.8) + aspect ratio bias typically produces tiles in 60-250px range.

### Adaptive Rules

**Size Category Detection:**
```typescript
const minDimension = Math.min(width, height);
if (minDimension >= 200) category = 'large';
else if (minDimension >= 120) category = 'medium';
else if (minDimension >= 60) category = 'small';
else category = 'tiny';
```

**Content Visibility:**

```typescript
// Large tiles (≥ 200px)
{
  iconSize: 16,
  nameFontSize: 'text-sm' (14px),
  showCapitalFlow: true,
  showChange: true,
  showSparkline: true,
  metrics: 'text-xs' (12px)
}

// Medium tiles (120-200px)
{
  iconSize: 14,
  nameFontSize: '13px',
  showCapitalFlow: true,
  showChange: false,
  showSparkline: isHovered,
  metrics: '11px'
}

// Small tiles (60-120px)
{
  iconSize: null,
  nameFontSize: '11px',
  showCapitalFlow: false,
  showChange: false,
  showSparkline: false,
  waterRippleExpansion: true  // Expands to W/4 × H/4 on hover
}
```

---

## Water Ripple Expansion

### When to Apply
- **Trigger**: Small tiles (min dimension < 200px) on hover
- **Target**: Expand to fixed **W/4 × H/4** rectangle (e.g., 300×285px for 1200×1140 container)
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

**Core Principle**: "Progressive tax" - large tiles contribute most compression capacity, tiny tiles contribute zero.

##### 4.1 Edge-Pinning for Boundary Tiles

```javascript
// Tiles at container edges expand inward only
const pinnedLeft = (hovIdx === firstColumnIndex);
const pinnedTop = (hovIdx === firstRowIndex);

if (pinnedLeft) {
    newHovLo = vbLo;  // Pin left edge
    newHovHi = vbLo + targetSize;  // Grow rightward only
} else if (pinnedRight) {
    newHovHi = vbHi;  // Pin right edge
    newHovLo = vbHi - targetSize;  // Grow leftward only
}
```

**Result**: Eliminates left/top gaps when hovering edge tiles.

##### 4.2 Capacity-Aware Directional Expansion

```javascript
function analyzeRegionIntervals(idxLo, idxHi, linePositions, tiles) {
    let totalOrigRange = 0;
    let totalMinFootprint = 0;

    for (let idx = idxLo; idx < idxHi; idx++) {
        const origSpan = tiles[idx].originalEnd - tiles[idx].originalStart;
        const effectiveMin = Math.min(MIN, origSpan);  // Adaptive MIN

        totalOrigRange += origSpan;
        totalMinFootprint += effectiveMin;
    }

    return {
        trueCapacity: totalOrigRange - totalMinFootprint  // Actual compressible space
    };
}

// Smart directional expansion based on true capacity
const beforeAnalysis = analyzeRegionIntervals(0, hovIdx, vLinePos, tiles);
const afterAnalysis = analyzeRegionIntervals(hovIdx + 1, tiles.length, vLinePos, tiles);

const effBefore = Math.min(spaceBefore, beforeAnalysis.trueCapacity);
const effAfter = Math.min(spaceAfter, afterAnalysis.trueCapacity);
const totalEff = effBefore + effAfter;

// Distribute expansion proportionally to true capacity
const expandBefore = needExpansion * (effBefore / totalEff);
const expandAfter = needExpansion * (effAfter / totalEff);
```

**Key Insight**: Tiles already ≤MIN have zero compressible capacity. Algorithm expands toward regions with actual compression headroom.

**Result**: Hovering "公用事业" (86% space above) expands upward, compressing "电子"/"银行", while preserving "建筑装饰"/"综合".

##### 4.3 Gradient Compression (Redistribution)

```javascript
function elasticRedistribute(idxLo, idxHi, availSpace, desiredSpace, linePositions, tiles) {
    if (desiredSpace <= availSpace) return;  // No compression needed

    const deficit = desiredSpace - availSpace;

    // Calculate per-tile compression capacity with gradient
    const tileCapacities = [];
    for (let idx = idxLo; idx < idxHi; idx++) {
        const origSpan = tiles[idx].originalEnd - tiles[idx].originalStart;
        const currentSpan = linePositions.get(tiles[idx].end) - linePositions.get(tiles[idx].start);
        const effectiveMin = Math.min(MIN, origSpan);  // Adaptive MIN
        const compressible = Math.max(0, currentSpan - effectiveMin);

        tileCapacities.push({ idx, origSpan, compressible });
    }

    const totalCapacity = tileCapacities.reduce((sum, t) => sum + t.compressible, 0);

    // Distribute deficit proportionally to compressible capacity
    tileCapacities.forEach(tc => {
        if (tc.compressible > 0) {
            const compressionShare = (tc.compressible / totalCapacity) * deficit;
            const currentSpan = linePositions.get(tiles[tc.idx].end) - linePositions.get(tiles[tc.idx].start);
            const newSpan = currentSpan - compressionShare;

            // Redistribute space: shrink tile proportionally
            const shrinkRatio = newSpan / currentSpan;
            applyProportionalShrink(tc.idx, shrinkRatio, linePositions);
        }
    });
}
```

**Compression Gradient**:
- Tiles with 100px compressible space → contribute 100px
- Tiles with 10px compressible space → contribute 10px
- Tiles already at originalSize → contribute 0px

**Result**: Large tiles (电子, 银行) absorb compression, tiny tiles (建筑装饰: 34px, 综合: 31px) remain visible.

##### 4.4 Adaptive MIN Enforcement

```javascript
// ❌ WRONG: Force all tiles ≥ 60px
const MIN = 60;
if (tileSpan < MIN) expandTile(MIN - tileSpan);

// ✅ CORRECT: Respect tiles already smaller than MIN
const origSpan = tile.originalEnd - tile.originalStart;
const effectiveMin = Math.min(MIN, origSpan);
if (tileSpan < effectiveMin) expandTile(effectiveMin - tileSpan);
```

**Result**: Tiles naturally small (建筑装饰: 36px original) not forced to 60px during compression.

##### 4.5 Hover Lock Mechanism

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

**Result**: Prevents cursor drift during 400ms CSS transitions. Hovering "建筑装饰" from below no longer slips to "公用事业".

##### 4.6 Tile-Level MIN Enforcement

```javascript
// ❌ WRONG: Check consecutive canonical pairs only
for (let i = 0; i < canonicals.length - 1; i++) {
    const span = linePos.get(canonicals[i+1]) - linePos.get(canonicals[i]);
    if (span < MIN) expandPair(i, MIN - span);
}

// ✅ CORRECT: Check each tile's full span (lo to hi)
function buildTileSpans(tiles, linePositions) {
    return tiles.map(tile => ({
        lo: tile.loCanonical,
        hi: tile.hiCanonical,
        span: linePositions.get(tile.hiCanonical) - linePositions.get(tile.loCanonical)
    }));
}

tileSpans.forEach(ts => {
    if (ts.span < effectiveMin) {
        const expand = (effectiveMin - ts.span) / 2;
        linePos.set(ts.lo, linePos.get(ts.lo) - expand);
        linePos.set(ts.hi, linePos.get(ts.hi) + expand);
    }
});
```

**Result**: Fixes M size overlaps where tile spans multiple canonical intervals.

##### 4.7 Map Iteration Safety

```javascript
// ❌ DANGEROUS: Modifying Map during forEach
hLinePos.forEach((v, k) => {
    hLinePos.set(k, v - shift);  // Causes key loss, undefined values
});

// ✅ SAFE: Collect updates first, then apply
const updates = [];
hLinePos.forEach((v, k) => {
    updates.push([k, v - shift]);
});
updates.forEach(([k, v]) => {
    hLinePos.set(k, v);
});
```

**Result**: Eliminates NaN bugs from lost Map keys during iteration.

##### 4.8 Iterative Constraint Loop

```javascript
const MAX_ITER = 50;

for (let iter = 0; iter < MAX_ITER; iter++) {
    let adjusted = false;

    // Priority 1: Hovered tile reaches target (≥95%)
    if (hoveredTileWidth < targetW * 0.95) {
        applyEdgePinningExpansion();
        adjusted = true;
    }

    // Priority 2: Tile-level MIN enforcement with adaptive MIN
    tileSpans.forEach(ts => {
        const effectiveMin = Math.min(MIN, ts.originalSpan);
        if (ts.currentSpan < effectiveMin) {
            expandTile(ts);
            adjusted = true;
        }
    });

    // Priority 3: Boundary overflow prevention with gradient compression
    if (maxX > virtualW || maxY > virtualH) {
        const overflow = maxX - virtualW;
        elasticRedistribute(overflow);
        adjusted = true;
    }

    if (!adjusted) break;
}
```

**Convergence**: Typically converges in 5-10 iterations for XL/L, 15-25 for M size.

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

### Fixed Expansion Target

All tiles expand to a **fixed 1/4 container size** rectangle for consistent interaction:

```javascript
function calculateTarget() {
    // Fixed target: 1/4 of container dimensions
    return {
        width: W / 4,
        height: H / 4
    };
}
```

| Container Size | Expansion Target | Notes |
|---------------|------------------|-------|
| 1200×1140 (XL) | 300×285px | Standard large screen |
| 800×760 (L) | 200×190px | Medium screen |
| 600×570 (M) | 150×142px | Minimum supported |

**Rationale**: Fixed ratio ensures:
- Consistent user experience across all tile sizes
- Predictable sparkline display area
- Simpler algorithm (no adaptive calculation)

---

## Implementation

### Utility Function

```typescript
// apps/preview/src/app/utils/tileUtils.ts

type TileSize = 'large' | 'medium' | 'small' | 'tiny';

interface ContentScaleConfig {
  sizeCategory: TileSize;
  iconSize: number | null;
  nameFontSize: string;
  metricsFontSize: string;
  showIcon: boolean;
  showCapitalFlow: boolean;
  showChange: boolean;
  showSparkline: boolean;
  enableWaterRipple: boolean;
}

export function getContentScale(
  width: number,
  height: number,
  isHovered: boolean
): ContentScaleConfig {
  const minDimension = Math.min(width, height);

  if (minDimension >= 200) {
    return {
      sizeCategory: 'large',
      iconSize: 16,
      nameFontSize: 'text-sm',
      metricsFontSize: 'text-xs',
      showIcon: true,
      showCapitalFlow: true,
      showChange: true,
      showSparkline: true,
      enableWaterRipple: false,
    };
  }

  if (minDimension >= 120) {
    return {
      sizeCategory: 'medium',
      iconSize: 14,
      nameFontSize: '13px',
      metricsFontSize: '11px',
      showIcon: true,
      showCapitalFlow: true,
      showChange: isHovered,
      showSparkline: isHovered,
      enableWaterRipple: false,
    };
  }

  // Small tiles: water ripple expansion on hover
  return {
    sizeCategory: 'small',
    iconSize: null,
    nameFontSize: '11px',
    metricsFontSize: 'text-xs',
    showIcon: false,
    showCapitalFlow: false,
    showChange: false,
    showSparkline: false,
    enableWaterRipple: true,  // Triggers expansion to W/4 × H/4
  };
}
```

### Water Ripple Integration

```typescript
// apps/preview/src/app/components/HeatMap.tsx

export function HeatMap({ entities }: HeatMapProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedLayout, setExpandedLayout] = useState(originalLayout);

  const handleTileHover = (index: number) => {
    const tile = originalLayout[index];
    const contentScale = getContentScale(tile.width, tile.height, true);

    if (contentScale.enableWaterRipple) {
      // Calculate water ripple expansion
      const newLayout = calculateRippleLayout(index, originalLayout);
      setExpandedLayout(newLayout);
    }

    setHoveredIndex(index);
  };

  const handleTileLeave = () => {
    setExpandedLayout(originalLayout);
    setHoveredIndex(null);
  };

  return (
    <div className="relative">
      {expandedLayout.map((tile, index) => (
        <HeatMapTile
          key={tile.id}
          entity={tile.data}
          x={tile.x}
          y={tile.y}
          width={tile.width}
          height={tile.height}
          isHovered={hoveredIndex === index}
          onMouseEnter={() => handleTileHover(index)}
          onMouseLeave={handleTileLeave}
        />
      ))}
    </div>
  );
}
```

### Reference Implementation

Complete working implementation: `/tmp/treemap-test/treemap-v11-fixed.html` (818 lines)

**Key Functions**:
- `buildSplitLineStructure()` - Split-line grouping with TOL=2.5
- `analyzeRegionIntervals()` - Capacity-aware region analysis
- `elasticRedistribute()` - Gradient compression algorithm
- `buildTileSpans()` - Tile-level MIN enforcement
- `calculateRippleLayout()` - Main expansion orchestration

**Test Coverage**: 87 test scenarios (29 small tiles × 3 container sizes)

---

## Acceptance Criteria

✅ **Content Adaptive Scaling:**
- [ ] Correctly categorizes tiles as large/medium/small based on min dimension
- [ ] Font sizes adapt to tile size
- [ ] Icon visibility follows size thresholds
- [ ] Content visibility rules applied correctly

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
- [ ] No tile exceeds W/4 × H/4 in initial layout
- [ ] Maximum tile constraint applied correctly across all container sizes
- [ ] Balanced visual hierarchy maintained

✅ **Multi-Size Support:**
- [ ] XL (1200×1140): 300×285px target, all 29 small tiles expand correctly
- [ ] L (800×760): 200×190px target, all 29 small tiles expand correctly
- [ ] M (600×570): 150×142px target, all 29 small tiles expand correctly
- [ ] Total: 87 test scenarios pass

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

1. **Name** (sector name) - Always visible
2. **Capital Flow** (资金流向) - Visible on medium+, or small after expansion
3. **Change%** (涨跌幅) - Visible on large, or medium+ on hover
4. **Icon** - Visible on medium+
5. **Sparkline** - Visible on large, or medium on hover, or small after expansion

### Border Preservation Strategy

**Problem**: Edge tiles' 2px borders get clipped by container `overflow: hidden` during expansion.

**Solution**: Virtual boundary approach
- Define virtual container: `(W - 4px) × (H - 4px)`
- All tiles positioned with 2px offset from container edge
- Expansion algorithm uses virtual dimensions
- 2px borders always fully visible

**Alternative Considered**: `box-shadow: inset 0 0 0 2px` instead of `border`
- Pros: Shadow doesn't occupy layout space, never clipped
- Cons: Requires careful handling for rounded corners
- Decision: Use virtual boundary for cleaner implementation

### Layout Constraint Implementation

**Constraint**: Max tile size ≤ **W/4 × H/4**

**Implementation Approach**:
```javascript
// After D3 treemap layout, clamp oversized tiles
layout.forEach(tile => {
    const maxW = W / 4;
    const maxH = H / 4;

    if (tile.width > maxW || tile.height > maxH) {
        // Redistribute excess area to neighboring tiles
        // Maintain aspect ratio where possible
    }
});
```

**Rationale**: Prevents single sector from dominating visual space, ensures balanced hierarchy even with extreme market cap differences.

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
