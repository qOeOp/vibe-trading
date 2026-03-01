import { describe, it, expect } from 'vitest';
import { computeBins, getPercentile } from '../distribution-bar';

describe('computeBins', () => {
  it('places values into correct bins', () => {
    const values = [0.01, 0.02, 0.03, 0.04, 0.05];
    const bins = computeBins(values, [0, 0.1], 5);
    expect(bins).toHaveLength(5);
    expect(bins.map((b) => b.count)).toEqual([2, 2, 1, 0, 0]);
  });
  it('returns normalized counts (0-1)', () => {
    const values = [0.01, 0.01, 0.02];
    const bins = computeBins(values, [0, 0.1], 5);
    const max = Math.max(...bins.map((b) => b.normalizedCount));
    expect(max).toBe(1);
  });
  it('handles empty values gracefully', () => {
    const bins = computeBins([], [0, 0.1], 5);
    expect(bins.every((b) => b.count === 0)).toBe(true);
  });
});

describe('getPercentile', () => {
  it('returns correct percentile', () => {
    const values = [1, 2, 3, 4, 5];
    expect(getPercentile(3, values)).toBe(40); // 2 values below 3
  });
  it('handles edge cases', () => {
    expect(getPercentile(0, [1, 2, 3])).toBe(0);
    expect(getPercentile(10, [1, 2, 3])).toBe(100);
  });
});
