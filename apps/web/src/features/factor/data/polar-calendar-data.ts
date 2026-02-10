/**
 * Polar Calendar (玉珏图) mock data generation
 *
 * Generates monthly ranking data and daily cumulative return series
 * for 10 quantitative strategies across multiple years.
 */

/* ── Seeded PRNG ──────────────────────────────────────────────── */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Strategy definitions ─────────────────────────────────────── */
export interface Strategy {
  id: string;
  name: string;
  short: string;
  color: string;
}

export const STRATEGIES: Strategy[] = [
  { id: "ml_multi",     name: "ML Multi-Factor", short: "ML",   color: "#2563EB" },
  { id: "momentum",     name: "Momentum",        short: "Mom",  color: "#DC2626" },
  { id: "value",        name: "Value",            short: "Val",  color: "#7C3AED" },
  { id: "quality",      name: "Quality",          short: "Qlty", color: "#16A34A" },
  { id: "growth",       name: "Growth",           short: "Grth", color: "#EA580C" },
  { id: "low_vol",      name: "Low Volatility",   short: "LVol", color: "#0891B2" },
  { id: "stat_arb",     name: "Stat Arbitrage",   short: "SArb", color: "#BE185D" },
  { id: "mean_rev",     name: "Mean Reversion",   short: "MRev", color: "#4338CA" },
  { id: "trend",        name: "Trend Following",  short: "Trnd", color: "#B45309" },
  { id: "sector_rot",   name: "Sector Rotation",  short: "SRot", color: "#0F766E" },
];

/* ── Types ────────────────────────────────────────────────────── */

/** Monthly ranking for a single strategy in a specific month */
export interface MonthRanking {
  strategyId: string;
  rank: number;         // 1 = best
  monthReturn: number;  // monthly return percentage
}

/** A single month slice with rankings */
export interface MonthSlice {
  year: number;
  month: number;        // 0-11
  label: string;        // "Jan", "Feb" etc
  rankings: MonthRanking[];
}

/** Daily return data point */
export interface DailyReturn {
  date: string;         // YYYY-MM-DD
  values: Record<string, number>;  // strategyId → cumulative return %
}

/** Year data containing monthly slices and daily returns */
export interface YearData {
  year: number;
  months: MonthSlice[];
  dailyReturns: DailyReturn[];
}

/** Leaderboard entry for annual ranking */
export interface RankedStrategy {
  strategy: Strategy;
  rank: number;
  annualReturn: number;
  sharpe: number;
}

/** Complete polar calendar dataset */
export interface PolarCalendarDataset {
  years: number[];
  yearData: Record<number, YearData>;
  strategies: Strategy[];
}

/* ── Month labels ─────────────────────────────────────────────── */
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ── Data generation ──────────────────────────────────────────── */

function generateYearData(year: number, rng: () => number): YearData {
  const strategyDrifts = STRATEGIES.map(() => (rng() - 0.3) * 0.15); // daily drift
  const strategyVols = STRATEGIES.map(() => 0.3 + rng() * 0.4);     // daily vol

  // Generate daily cumulative returns for the entire year
  const dailyReturns: DailyReturn[] = [];
  const cumReturns: number[] = new Array(STRATEGIES.length).fill(0);

  // Trading days in a year (~250)
  const startDate = new Date(year, 0, 2); // Jan 2
  const endDate = new Date(year, 11, 31);
  const d = new Date(startDate);

  while (d <= endDate) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      const values: Record<string, number> = {};

      for (let s = 0; s < STRATEGIES.length; s++) {
        // Box-Muller normal
        const u1 = rng() || 0.0001;
        const u2 = rng();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

        // Occasional regime shift
        if (rng() < 0.01) {
          strategyDrifts[s] *= (0.5 + rng());
        }

        const daily = strategyDrifts[s] + strategyVols[s] * z;
        cumReturns[s] += daily;
        values[STRATEGIES[s].id] = +cumReturns[s].toFixed(2);
      }

      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      dailyReturns.push({
        date: `${year}-${mm}-${dd}`,
        values,
      });
    }
    d.setDate(d.getDate() + 1);
  }

  // Build monthly slices with rankings
  const months: MonthSlice[] = [];

  for (let m = 0; m < 12; m++) {
    // Get daily returns for this month
    const monthDays = dailyReturns.filter((dr) => {
      const month = parseInt(dr.date.substring(5, 7)) - 1;
      return month === m;
    });

    if (monthDays.length === 0) continue;

    // Calculate monthly return for each strategy
    const firstDay = monthDays[0];
    const lastDay = monthDays[monthDays.length - 1];
    const monthReturns: { strategyId: string; monthReturn: number }[] = STRATEGIES.map((s) => ({
      strategyId: s.id,
      monthReturn: +(lastDay.values[s.id] - (firstDay.values[s.id] || 0)).toFixed(2),
    }));

    // For the first month, use absolute values
    if (m === 0) {
      for (const mr of monthReturns) {
        mr.monthReturn = +lastDay.values[mr.strategyId].toFixed(2);
      }
    }

    // Sort by monthly return (descending) to assign ranks
    const sorted = [...monthReturns].sort((a, b) => b.monthReturn - a.monthReturn);

    const rankings: MonthRanking[] = sorted.map((item, idx) => ({
      strategyId: item.strategyId,
      rank: idx + 1,
      monthReturn: item.monthReturn,
    }));

    months.push({
      year,
      month: m,
      label: MONTH_LABELS[m],
      rankings,
    });
  }

  return { year, months, dailyReturns };
}

/* ── Public API ────────────────────────────────────────────────── */

let _cached: PolarCalendarDataset | null = null;

export function getPolarCalendarData(): PolarCalendarDataset {
  if (_cached) return _cached;

  const rng = mulberry32(777);
  const years = [2022, 2023, 2024, 2025];
  const yearData: Record<number, YearData> = {};

  for (const year of years) {
    yearData[year] = generateYearData(year, rng);
  }

  _cached = { years, yearData, strategies: STRATEGIES };
  return _cached;
}

/** Get annual leaderboard for a specific year */
export function getAnnualLeaderboard(dataset: PolarCalendarDataset, year: number): RankedStrategy[] {
  const yd = dataset.yearData[year];
  if (!yd || yd.dailyReturns.length === 0) return [];

  const lastDay = yd.dailyReturns[yd.dailyReturns.length - 1];
  const rng = mulberry32(year * 31337);

  const items: RankedStrategy[] = STRATEGIES.map((s) => {
    const annualReturn = lastDay.values[s.id] || 0;
    // Generate a plausible Sharpe: correlated with return but noisy
    const sharpe = +(annualReturn / (8 + rng() * 6) + (rng() - 0.5) * 0.3).toFixed(2);
    return {
      strategy: s,
      rank: 0,
      annualReturn,
      sharpe,
    };
  });

  items.sort((a, b) => b.annualReturn - a.annualReturn);
  items.forEach((item, idx) => { item.rank = idx + 1; });

  return items;
}

/** Get daily returns for a specific month */
export function getMonthDailyReturns(dataset: PolarCalendarDataset, year: number, month: number): DailyReturn[] {
  const yd = dataset.yearData[year];
  if (!yd) return [];
  return yd.dailyReturns.filter((dr) => {
    const m = parseInt(dr.date.substring(5, 7)) - 1;
    return m === month;
  });
}
