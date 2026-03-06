import { describe, it, expect } from 'vitest';
import { createMockFactor, createMockFactors, createRng } from '../index';

describe('createRng', () => {
  it('produces deterministic sequences', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(99);
    expect(rng1()).not.toEqual(rng2());
  });
});

describe('createMockFactor', () => {
  it('generates a complete Factor object', () => {
    const factor = createMockFactor();
    expect(factor.id).toBe('mock_42');
    expect(factor.icTimeSeries).toHaveLength(240);
    expect(factor.icTrend).toHaveLength(30);
    expect(factor.icDecayProfile).toHaveLength(20);
    expect(factor.quantileReturns).toHaveLength(5);
    expect(factor.longShortEquityCurve).toHaveLength(240);
    expect(factor.icByIndustry).toHaveLength(28);
    expect(factor.icMonthlyHeatmap).toHaveLength(12);
    expect(factor.quantileCumulativeReturns).toHaveLength(5);
    expect(factor.quantileCumulativeReturns[0]).toHaveLength(240);
    expect(factor.rankAutoCorrelation).toHaveLength(240);
    expect(factor.quantileTurnover.top).toHaveLength(240);
    expect(factor.quantileTurnover.bottom).toHaveLength(240);
    expect(factor.icHistogramBins).toHaveLength(20);
  });

  it('produces deterministic output with same seed', () => {
    const f1 = createMockFactor({}, 42);
    const f2 = createMockFactor({}, 42);
    expect(f1.ic).toBe(f2.ic);
    expect(f1.ir).toBe(f2.ir);
    expect(f1.icTimeSeries).toEqual(f2.icTimeSeries);
  });

  it('respects overrides', () => {
    const factor = createMockFactor({
      id: 'my_factor',
      ic: 0.05,
      category: '动能',
      status: 'LIVE_ACTIVE',
    });
    expect(factor.id).toBe('my_factor');
    expect(factor.ic).toBe(0.05);
    expect(factor.category).toBe('动能');
    expect(factor.status).toBe('LIVE_ACTIVE');
  });

  it('generates IC in realistic range', () => {
    const factor = createMockFactor();
    expect(Math.abs(factor.ic)).toBeGreaterThanOrEqual(0.005);
    expect(Math.abs(factor.ic)).toBeLessThanOrEqual(0.08);
  });

  it('generates consistent icDistribution from icTimeSeries', () => {
    const factor = createMockFactor();
    const { icDistribution } = factor;
    expect(
      icDistribution.icPositiveCount + icDistribution.icNegativeCount,
    ).toBeLessThanOrEqual(240);
    expect(icDistribution.icStd).toBeGreaterThan(0);
  });

  it('generates monotonic quantile returns for positive direction', () => {
    const factor = createMockFactor(
      { expectedDirection: 'positive', ic: 0.05 },
      100,
    );
    const [q1, q2, , q4, q5] = factor.quantileReturns;
    // Q5 should be higher than Q1 for positive direction
    expect(q5).toBeGreaterThan(q1);
    expect(q4).toBeGreaterThan(q2);
  });

  it('generates valid coverage rate', () => {
    const factor = createMockFactor();
    expect(factor.coverageRate).toBeGreaterThanOrEqual(0.85);
    expect(factor.coverageRate).toBeLessThanOrEqual(0.98);
  });
});

describe('createMockFactors', () => {
  it('generates N unique factors', () => {
    const factors = createMockFactors(10);
    expect(factors).toHaveLength(10);
    const ids = new Set(factors.map((f) => f.id));
    expect(ids.size).toBe(10);
  });

  it('produces variety across categories', () => {
    const factors = createMockFactors(50);
    const categories = new Set(factors.map((f) => f.category));
    expect(categories.size).toBeGreaterThan(1);
  });
});
