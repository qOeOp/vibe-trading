/**
 * @fileoverview Shape helper utilities
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/shape.helper.ts
 *
 * @description
 * Helper functions for generating SVG path shapes.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

/**
 * Generates a rounded rectangle SVG path
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param width - Rectangle width
 * @param height - Rectangle height
 * @param radius - Corner radius
 * @param edges - Which corners to round [top-left, top-right, bottom-right, bottom-left]
 */
export function roundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  edges: boolean[] = [true, true, true, true]
): string {
  const [tl, tr, br, bl] = edges;

  // Ensure radius doesn't exceed half of width or height
  const r = Math.min(radius, width / 2, height / 2);

  const topLeftRadius = tl ? r : 0;
  const topRightRadius = tr ? r : 0;
  const bottomRightRadius = br ? r : 0;
  const bottomLeftRadius = bl ? r : 0;

  return `
    M ${x + topLeftRadius} ${y}
    H ${x + width - topRightRadius}
    ${topRightRadius ? `A ${topRightRadius} ${topRightRadius} 0 0 1 ${x + width} ${y + topRightRadius}` : `L ${x + width} ${y}`}
    V ${y + height - bottomRightRadius}
    ${bottomRightRadius ? `A ${bottomRightRadius} ${bottomRightRadius} 0 0 1 ${x + width - bottomRightRadius} ${y + height}` : `L ${x + width} ${y + height}`}
    H ${x + bottomLeftRadius}
    ${bottomLeftRadius ? `A ${bottomLeftRadius} ${bottomLeftRadius} 0 0 1 ${x} ${y + height - bottomLeftRadius}` : `L ${x} ${y + height}`}
    V ${y + topLeftRadius}
    ${topLeftRadius ? `A ${topLeftRadius} ${topLeftRadius} 0 0 1 ${x + topLeftRadius} ${y}` : `L ${x} ${y}`}
    Z
  `.trim().replace(/\s+/g, ' ');
}

/**
 * Generates a line path between two points
 */
export function line(x1: number, y1: number, x2: number, y2: number): string {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

/**
 * Generates a horizontal line path
 */
export function horizontalLine(x: number, y: number, width: number): string {
  return `M ${x} ${y} H ${x + width}`;
}

/**
 * Generates a vertical line path
 */
export function verticalLine(x: number, y: number, height: number): string {
  return `M ${x} ${y} V ${y + height}`;
}
