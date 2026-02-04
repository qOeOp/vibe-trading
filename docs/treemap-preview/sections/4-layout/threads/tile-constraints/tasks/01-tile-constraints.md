# Task: Tile Constraints

Minimum tile size, treemap algorithm configuration, and horizontal bias.

---

## Constraints

**Minimum Tile:** 150×150px
**Rationale:**
- Readable text (12px minimum)
- Visible sparkline (>120px width requirement)
- Breathing room for content

**Algorithm:** Squarified treemap with horizontal bias
**Library:** d3-hierarchy
**Config:**
- `d3.treemapSquarify.ratio(1)` — maximizes squareness
- `padding(2)` — 2px gap between tiles
- Virtual height stretch S=1.35 — biases tiles toward horizontal (width > height)
- Power scaling `x^0.8` for capitalFlow → area mapping
- No initial max tile clamping — W/d × H/d is hover expansion target only (d = min(4, √n), n = tile count)

---

## Acceptance Criteria

✅ **Constraints:**
- [ ] No tile < 150×150px
- [ ] Squarified aspect ratios (ratio(1))
- [ ] All 31 sectors fit at L1
- [ ] ≥80% of tiles have width > height (horizontal bias)
- [ ] No non-padding gaps between tiles
- [ ] Corner-aware border radius preserved (4 container corners get 16px radius)
