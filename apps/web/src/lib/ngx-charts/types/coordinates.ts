/**
 * @fileoverview Coordinate type definitions
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/models/coordinates.model.ts
 *
 * @description
 * Basic coordinate types for positioning and vector calculations.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

/** 2D point with x and y coordinates */
export interface Point {
  x: number;
  y: number;
}

/** 2D vector defined by two points */
export interface Vector2D {
  v1: Point;
  v2: Point;
}
