# Thread: Color System

7-stop solid color ramp with Chinese market convention (red=涨, green=跌).

---

## Purpose

Define unified color system emphasizing professionalism and data clarity, with discrete color stops based on changePercent magnitude.

## Task: [Color Specifications](./tasks/01-color-specs.md)

Single comprehensive task documenting:
- Base palette (white background, white text on tiles)
- Chinese market convention (red=up, green=down)
- 7-stop solid color ramp
- Color-to-changePercent mapping

---

## Color Philosophy

**Conservative Finance Palette:**
- Page background: #ffffff (white)
- Text on tiles: White scale (95%/70%/60% opacity)
- Accents: Red/Green only for price data
- No decorative colors

**7-Stop Solid Color Ramp:**

| changePercent | Hex | Visual |
|--------------|-----|--------|
| < -5% | `#0B8C5F` | Deep Green |
| -2% ~ -5% | `#2EBD85` | Medium Green |
| -0.5% ~ -2% | `#58CEAA` | Light Green |
| ±0.5% | `#76808E` | Gray |
| +0.5% ~ +2% | `#E8626F` | Light Red |
| +2% ~ +5% | `#F6465D` | Medium Red |
| > +5% | `#CF304A` | Deep Red |

---

## References

- **Implementation:** [Section 5 → HeatMapTile → Task 05](../../../5-components/threads/heatmap-tile/tasks/05-dynamic-color.md)
- **Algorithm:** getTileBackgroundColor() utility function
