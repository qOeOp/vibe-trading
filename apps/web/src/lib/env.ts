/**
 * Shared runtime environment constants.
 * All service base URLs live here so they can be referenced from any feature
 * without creating cross-feature dependencies.
 */

export const VIBE_COMPUTE_URL =
  process.env.NEXT_PUBLIC_VIBE_COMPUTE_URL ?? 'http://localhost:2728';
