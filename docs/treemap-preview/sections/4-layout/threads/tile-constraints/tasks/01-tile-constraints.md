# Task: Tile Constraints

Minimum tile size and treemap algorithm configuration.

---

## Constraints

**Minimum Tile:** 150×150px  
**Rationale:**
- Readable text (12px minimum)
- Visible sparkline (>120px width requirement)
- Breathing room for content

**Algorithm:** Squarified treemap  
**Library:** d3-hierarchy or custom implementation

---

## Acceptance Criteria

✅ **Constraints:**
- [ ] No tile < 150×150px
- [ ] Squarified aspect ratios
- [ ] All 31 sectors fit at L1
