/**
 * Mock Data Factory — statistically realistic test data for Vibe Trading.
 *
 * Usage:
 *   import { createMockFactor, createMockFactors, createRng } from '@/lib/mock-factory';
 *
 *   // Single factor with overrides
 *   const factor = createMockFactor({ ic: 0.05, category: '动能' });
 *
 *   // Batch generation
 *   const factors = createMockFactors(50, 42);
 *
 *   // Low-level distributions
 *   const rng = createRng(42);
 *   const navCurve = generateNAVCurve(rng, 240);
 */

export {
  createMockFactor,
  createMockFactors,
  createMockStatusChange,
} from './factor';
export {
  createRng,
  normalRandom,
  normalSeries,
  clamp,
  pickRandom,
  generateNAVCurve,
  generateICTimeSeries,
  round,
} from './distributions';
export {
  SHENWAN_L1_INDUSTRIES,
  MONTHS,
  UNIVERSE_MULTIPLIERS,
} from './constants';
