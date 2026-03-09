/**
 * Resolve CSS custom property values for Canvas 2D / JS contexts
 * where `var(--color-xxx)` cannot be used directly.
 *
 * Usage:
 *   const bg = resolveToken('mine-bg');        // → '#f5f3ef'
 *   const teal = resolveToken('mine-accent-teal'); // → '#26a69a'
 */
export function resolveToken(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${name}`)
    .trim();
}
