/**
 * @fileoverview Marker shape generators for line race chart
 *
 * @description
 * Generates distinct SVG path data for marker shapes, cycling through
 * 10 different geometric shapes to visually distinguish series.
 *
 * @license MIT
 */

/**
 * Generate distinct SVG marker shapes per series index.
 * Cycles through: circle, square, diamond, triangle-up, triangle-down,
 * plus, cross, pentagon, hexagon, star.
 */
export function markerPath(cx: number, cy: number, r: number, index: number): string {
  const shape = index % 10;
  switch (shape) {
    case 0:
      return circleMarker(cx, cy, r);
    case 1: // square
      return `M${cx - r},${cy - r}L${cx + r},${cy - r}L${cx + r},${cy + r}L${cx - r},${cy + r}Z`;
    case 2: // diamond
      return `M${cx},${cy - r}L${cx + r},${cy}L${cx},${cy + r}L${cx - r},${cy}Z`;
    case 3: // triangle up
      return `M${cx},${cy - r}L${cx + r},${cy + r}L${cx - r},${cy + r}Z`;
    case 4: // triangle down
      return `M${cx - r},${cy - r}L${cx + r},${cy - r}L${cx},${cy + r}Z`;
    case 5: { // plus
      const h = r * 0.35;
      return `M${cx - h},${cy - r}L${cx + h},${cy - r}L${cx + h},${cy - h}L${cx + r},${cy - h}L${cx + r},${cy + h}L${cx + h},${cy + h}L${cx + h},${cy + r}L${cx - h},${cy + r}L${cx - h},${cy + h}L${cx - r},${cy + h}L${cx - r},${cy - h}L${cx - h},${cy - h}Z`;
    }
    case 6: { // cross (rotated plus)
      const a = r * 0.7, b = r * 0.25;
      return `M${cx},${cy - b}L${cx + a - b},${cy - a}L${cx + a},${cy - a + b}L${cx + b},${cy}L${cx + a},${cy + a - b}L${cx + a - b},${cy + a}L${cx},${cy + b}L${cx - a + b},${cy + a}L${cx - a},${cy + a - b}L${cx - b},${cy}L${cx - a},${cy - a + b}L${cx - a + b},${cy - a}Z`;
    }
    case 7: // pentagon
      return regularPolygon(cx, cy, r, 5, -Math.PI / 2);
    case 8: // hexagon
      return regularPolygon(cx, cy, r, 6, 0);
    case 9: // star (5-pointed)
      return starPath(cx, cy, r, r * 0.45, 5);
    default:
      return circleMarker(cx, cy, r);
  }
}

function circleMarker(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy}A${r},${r},0,1,1,${cx + r},${cy}A${r},${r},0,1,1,${cx - r},${cy}Z`;
}

function regularPolygon(cx: number, cy: number, r: number, sides: number, startAngle: number): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (2 * Math.PI * i) / sides;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return `M${pts.join('L')}Z`;
}

function starPath(cx: number, cy: number, outerR: number, innerR: number, points: number): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = -Math.PI / 2 + (Math.PI * i) / points;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return `M${pts.join('L')}Z`;
}
