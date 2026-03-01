// apps/web/src/components/shared/factor-metrics/__tests__/metric-configs.test.ts
import { describe, it, expect } from 'vitest';
import {
  getThresholdTier,
  formatMetricValue,
  METRIC_CONFIGS,
} from '../metric-configs';

describe('getThresholdTier', () => {
  it('returns "poor" when below first threshold (higher is better)', () => {
    expect(getThresholdTier(0.01, [0.03, 0.05], true)).toBe('poor');
  });
  it('returns "ok" when between thresholds (higher is better)', () => {
    expect(getThresholdTier(0.04, [0.03, 0.05], true)).toBe('ok');
  });
  it('returns "good" when above second threshold (higher is better)', () => {
    expect(getThresholdTier(0.06, [0.03, 0.05], true)).toBe('good');
  });
  it('returns "neutral" when higherIsBetter is null', () => {
    expect(getThresholdTier(0.5, [], null)).toBe('neutral');
  });
  it('reverses for lower-is-better (maxDrawdown)', () => {
    // thresholds are [-0.20, -0.10], value -0.05 = above -0.10 = "good"
    expect(getThresholdTier(-0.05, [-0.2, -0.1], false)).toBe('good');
    expect(getThresholdTier(-0.15, [-0.2, -0.1], false)).toBe('ok');
    expect(getThresholdTier(-0.25, [-0.2, -0.1], false)).toBe('poor');
  });
});

describe('formatMetricValue', () => {
  it('formats decimal4', () => {
    expect(formatMetricValue(0.03152, 'decimal4')).toBe('0.0315');
  });
  it('formats percent', () => {
    expect(formatMetricValue(0.123, 'percent')).toBe('12.3%');
  });
  it('formats percent with sign for arr', () => {
    expect(formatMetricValue(-0.05, 'percent')).toBe('-5.0%');
  });
});

describe('METRIC_CONFIGS', () => {
  it('has all 6 required metrics', () => {
    const keys = ['ic', 'icir', 'arr', 'sharpe', 'maxDrawdown', 'turnover'];
    keys.forEach((k) => expect(METRIC_CONFIGS).toHaveProperty(k));
  });
});
