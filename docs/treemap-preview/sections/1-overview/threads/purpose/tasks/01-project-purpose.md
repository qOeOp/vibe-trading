# Task: Project Purpose

Detailed project goals and problem statement.

---

## Problem Statement

Chinese stock market has complex hierarchical structure:
- 31 Level-1 sectors (SW classification)
- 150+ Level-2 industries
- 500+ Level-3 sub-industries
- 4000+ individual stocks

Traditional table views make hierarchy hard to understand and capital flow patterns hard to spot.

---

## Solution

Interactive treemap visualization:
- **Size:** Tiles proportional to capital flow magnitude
- **Color:** Dynamic 3-zone system based on price change
- **Interaction:** Click to drill-down, hover for details
- **Animation:** Breathing dots show attention level
- **Search:** Find any entity across levels

---

## Success Metrics

✅ **User Experience:**
- [ ] Intuitive navigation (no instructions needed)
- [ ] <2s to understand hierarchy
- [ ] <5s to find specific entity via search

✅ **Technical:**
- [ ] 60fps animation throughout
- [ ] <100ms initial render
- [ ] Responsive to all interactions
