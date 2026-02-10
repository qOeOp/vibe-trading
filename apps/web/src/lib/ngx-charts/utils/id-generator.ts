/**
 * @fileoverview Unique ID generator
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/utils/id.ts
 *
 * @description
 * Generates short unique IDs for SVG elements.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

const cache: Record<string, boolean> = {};

/**
 * Generates a short unique ID (4-character alphanumeric sequence).
 * Prefixed with 'a' to ensure valid SVG ID.
 *
 * @example
 * generateId() // Returns something like "aeb3f"
 */
export function generateId(): string {
  let newId = ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);

  // Prefix with 'a' to ensure valid SVG ID
  newId = `a${newId}`;

  // Ensure not already used
  if (!cache[newId]) {
    cache[newId] = true;
    return newId;
  }

  // Recursively generate new ID if collision
  return generateId();
}

/**
 * Clears the ID cache (useful for testing)
 */
export function clearIdCache(): void {
  for (const key in cache) {
    delete cache[key];
  }
}

/**
 * React hook for generating a stable unique ID
 * Uses React's useId() for SSR-safe stable IDs
 */
import { useId } from 'react';

export function useStableId(prefix: string = 'a'): string {
  const id = useId();
  // React useId returns IDs like ":r0:", ":r1:", etc.
  // We need to make it a valid SVG ID (alphanumeric, starts with letter)
  // Replace colons with empty string and prefix with 'a'
  const safeId = id.replace(/:/g, '');
  return `${prefix}${safeId}`;
}

/**
 * @deprecated Use useStableId() instead for SSR-safe IDs
 */
let idCounter = 0;

export function useUniqueId(prefix: string = 'ngx'): string {
  // In a real React implementation, this would use useId() or useMemo()
  // For now, we generate a deterministic ID
  return `${prefix}-${++idCounter}`;
}
