/**
 * Statistical distribution generators for realistic mock data.
 * Uses seeded PRNG for reproducible test data.
 */

/** Simple seeded PRNG (mulberry32) */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seed = 42) {
  return mulberry32(seed);
}

/** Box-Muller transform: uniform → normal */
export function normalRandom(rng: () => number, mean = 0, std = 1): number {
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * std;
}

/** Generate array of normal random values */
export function normalSeries(
  rng: () => number,
  length: number,
  mean = 0,
  std = 1,
): number[] {
  return Array.from({ length }, () => normalRandom(rng, mean, std));
}

/** Clamp value to range */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Pick random element from array */
export function pickRandom<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Generate cumulative NAV curve with realistic volatility and drawdowns */
export function generateNAVCurve(
  rng: () => number,
  length: number,
  annualReturn = 0.12,
  annualVol = 0.2,
): number[] {
  const dailyReturn = annualReturn / 252;
  const dailyVol = annualVol / Math.sqrt(252);
  const curve: number[] = [1.0];

  for (let i = 1; i < length; i++) {
    const ret = normalRandom(rng, dailyReturn, dailyVol);
    curve.push(curve[i - 1] * (1 + ret));
  }

  return curve;
}

/** Generate IC time series with mean reversion and autocorrelation */
export function generateICTimeSeries(
  rng: () => number,
  length: number,
  mean = 0.035,
  std = 0.04,
  autocorr = 0.3,
): number[] {
  const series: number[] = [normalRandom(rng, mean, std)];

  for (let i = 1; i < length; i++) {
    const innovation = normalRandom(rng, 0, std * Math.sqrt(1 - autocorr ** 2));
    const value = mean + autocorr * (series[i - 1] - mean) + innovation;
    series.push(clamp(value, -0.15, 0.15));
  }

  return series;
}

/** Round to N decimal places */
export function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
