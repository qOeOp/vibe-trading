/**
 * Quantitative strategy backtest demo data for LineRace chart.
 *
 * ~300 daily data points per strategy simulating realistic cumulative return
 * curves (random walk with drift + volatility, regime shifts, drawdowns).
 *
 * Strategies have meaningfully different drift rates so they fan out over
 * time, making the race visually readable (±30% spread at the end).
 *
 * The benchmark (CSI 300) is exported separately and rendered as a static
 * reference line — it does NOT participate in the race/leaderboard.
 */

/* ── Seeded PRNG (deterministic across renders) ────────────────── */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Curve generator ───────────────────────────────────────────── */
interface CurveParams {
  /** Average daily return (drift) in percentage points, e.g. 0.08 = +0.08%/day */
  drift: number;
  /** Daily volatility std in percentage points, e.g. 0.4 = ±0.4%/day */
  vol: number;
  /** Starting value (%) */
  start: number;
}

function generateCurve(
  rng: () => number,
  n: number,
  { drift, vol, start }: CurveParams,
): number[] {
  const values: number[] = [start];
  let currentDrift = drift;
  let currentVol = vol;

  for (let i = 1; i < n; i++) {
    // Box-Muller for normal distribution
    const u1 = rng() || 0.0001;
    const u2 = rng();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    // Regime shift: occasionally change drift/vol (5% prob)
    if (rng() < 0.005) {
      currentDrift = drift * (0.5 + rng() * 1.0);
      currentVol = vol * (0.7 + rng() * 0.6);
    }

    const prev = values[i - 1];
    const dailyReturn = currentDrift + currentVol * z;
    values.push(+(prev + dailyReturn).toFixed(2));
  }

  return values;
}

/* ── Generate date labels (trading days, ~300 days) ──────────── */
function generateTradingDays(startDate: string, count: number): string[] {
  const labels: string[] = [];
  const d = new Date(startDate);
  while (labels.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      labels.push(`${d.getFullYear()}-${mm}-${dd}`);
    }
    d.setDate(d.getDate() + 1);
  }
  return labels;
}

const NUM_DAYS = 300;
const rng = mulberry32(42);

/* ── Strategy definitions ──────────────────────────────────────── */
// Wide drift spread: best strategy ~ +0.12%/day ≈ +36% over 300 days
//                    worst strategy ~ -0.04%/day ≈ -12% over 300 days
// This creates a ~50% spread between best and worst — very readable in the race.
// Daily vol ~ 0.3-0.5% creates realistic zigzag without drowning the drift signal.
const strategies: { name: string; params: CurveParams }[] = [
  { name: 'ML Multi-Factor', params: { drift: 0.12,  vol: 0.45, start: 0 } },
  { name: 'Momentum',        params: { drift: 0.09,  vol: 0.50, start: 0 } },
  { name: 'Value',            params: { drift: 0.07,  vol: 0.35, start: 0 } },
  { name: 'Quality',          params: { drift: 0.05,  vol: 0.30, start: 0 } },
  { name: 'Growth',           params: { drift: 0.03,  vol: 0.40, start: 0 } },
  { name: 'Low Vol',          params: { drift: 0.01,  vol: 0.20, start: 0 } },
  { name: 'Stat Arb',         params: { drift: 0.00,  vol: 0.25, start: 0 } },
  { name: 'Mean Reversion',   params: { drift: -0.01, vol: 0.35, start: 0 } },
  { name: 'Trend Following',  params: { drift: -0.02, vol: 0.55, start: 0 } },
  { name: 'Sector Rotation',  params: { drift: -0.04, vol: 0.50, start: 0 } },
];

export const LINE_RACE_DEMO_DATA = strategies.map((s) => ({
  name: s.name,
  values: generateCurve(rng, NUM_DAYS, s.params),
}));

/** Benchmark curve (CSI 300 proxy) — NOT part of the race */
export const LINE_RACE_BENCHMARK = generateCurve(rng, NUM_DAYS, {
  drift: 0.02,
  vol: 0.40,
  start: 0,
});

export const LINE_RACE_DEMO_COLORS = [
  '#d568fb',  // ML Multi-Factor — purple
  '#2caffe',  // Momentum — blue
  '#544fc5',  // Value — indigo
  '#00c853',  // Quality — green
  '#5c7cba',  // Growth — steel
  '#fe6a35',  // Low Vol — orange
  '#fa4b42',  // Stat Arb — red
  '#f5a623',  // Mean Reversion — amber
  '#7c4dff',  // Trend Following — violet
  '#00bfa5',  // Sector Rotation — teal
];

/** Daily trading-day labels (~300 days starting 2023-06) */
export const LINE_RACE_DEMO_ROUND_LABELS = generateTradingDays('2023-06-01', NUM_DAYS);
