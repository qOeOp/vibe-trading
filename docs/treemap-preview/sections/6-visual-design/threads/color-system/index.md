# Thread: Color System

Conservative finance color palette with 3-zone dynamic coloring for price changes.

---

## Purpose

Define unified color system emphasizing professionalism and data clarity, with dynamic coloring based on changePercent magnitude.

## Task: [Color Specifications](./tasks/01-color-specs.md)

Single comprehensive task documenting:
- Base palette (black/white/gray)
- Chinese market convention (red=up, green=down)
- 3-zone dynamic system (dead/active/extreme)
- Color calculation algorithm

---

## Color Philosophy

**Conservative Finance Palette:**
- Primary background: #111827 (gray-900)
- Text: White/Gray scale
- Accents: Red/Green only for price data
- No decorative colors

**3-Zone Dynamic System:**
1. **Dead Zone (±0.2%):** Gray rgba(107, 114, 128, 0.15) - minimal change
2. **Active Zone (0.2-3%):** Red/Green gradient with linear alpha 0.1-0.3
3. **Extreme Protection (>3%):** Capped at 0.25 alpha - prevents visual overwhelm

---

## References

- **Implementation:** [Section 5 → HeatMapTile → Task 05](../../../5-components/threads/heatmap-tile/tasks/05-dynamic-color.md)
- **Algorithm:** getTileBackgroundColor() utility function
