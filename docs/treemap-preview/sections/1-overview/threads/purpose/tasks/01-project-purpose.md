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
- **Size:** Tiles proportional to capital flow magnitude (power scaling x^0.8)
- **Color:** 7-stop solid color ramp based on price change (Binance-style)
- **Interaction:** Click to drill-down, hover for sparkline and water ripple expansion
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
