import type { UniverseIC } from '../types';

/**
 * Find the pool with the highest absolute IC among ready pools.
 * Returns the universe name, or null if no data.
 */
export function getBestPool(
  universeProfile: UniverseIC[] | undefined,
): string | null {
  if (!universeProfile || universeProfile.length === 0) return null;

  let best: UniverseIC | null = null;
  for (const entry of universeProfile) {
    if (!best || Math.abs(entry.ic) > Math.abs(best.ic)) {
      best = entry;
    }
  }
  return best?.universe ?? null;
}
