// apps/web/src/components/shared/factor-metrics/metric-configs.ts

export type MetricKey =
  | 'ic'
  | 'icir'
  | 'arr'
  | 'sharpe'
  | 'maxDrawdown'
  | 'turnover';
export type ThresholdTier = 'poor' | 'ok' | 'good' | 'neutral';
export type MetricFmt = 'decimal4' | 'decimal3' | 'decimal2' | 'percent';

export interface MetricConfig {
  label: string;
  domain: [number, number];
  thresholds: number[];
  higherIsBetter: boolean | null;
  fmt: MetricFmt;
}

export const METRIC_CONFIGS: Record<MetricKey, MetricConfig> = {
  ic: {
    label: 'IC',
    domain: [-0.08, 0.12],
    thresholds: [0.03, 0.05],
    higherIsBetter: true,
    fmt: 'decimal4',
  },
  icir: {
    label: 'ICIR',
    domain: [-1, 3],
    thresholds: [1.0, 1.5],
    higherIsBetter: true,
    fmt: 'decimal3',
  },
  arr: {
    label: 'ARR',
    domain: [-0.3, 0.5],
    thresholds: [0.1, 0.2],
    higherIsBetter: true,
    fmt: 'percent',
  },
  sharpe: {
    label: 'Sharpe',
    domain: [-1, 4],
    thresholds: [1.0, 2.0],
    higherIsBetter: true,
    fmt: 'decimal2',
  },
  maxDrawdown: {
    label: '最大回撤',
    domain: [-0.5, 0],
    thresholds: [-0.2, -0.1],
    higherIsBetter: false,
    fmt: 'percent',
  },
  turnover: {
    label: '换手率',
    domain: [0, 1],
    thresholds: [],
    higherIsBetter: null,
    fmt: 'percent',
  },
};

export function getThresholdTier(
  value: number,
  thresholds: number[],
  higherIsBetter: boolean | null,
): ThresholdTier {
  if (higherIsBetter === null || thresholds.length === 0) return 'neutral';
  const [t1, t2] = thresholds;
  if (higherIsBetter) {
    if (value >= t2) return 'good';
    if (value >= t1) return 'ok';
    return 'poor';
  } else {
    if (value >= t2) return 'good';
    if (value >= t1) return 'ok';
    return 'poor';
  }
}

export function formatMetricValue(value: number, fmt: MetricFmt): string {
  switch (fmt) {
    case 'decimal4':
      return value.toFixed(4);
    case 'decimal3':
      return value.toFixed(3);
    case 'decimal2':
      return value.toFixed(2);
    case 'percent':
      return `${(value * 100).toFixed(1)}%`;
  }
}

export function tierToColorClass(tier: ThresholdTier): string {
  switch (tier) {
    case 'good':
      return 'bg-market-up-medium/70';
    case 'ok':
      return 'bg-amber-400/70';
    case 'poor':
      return 'bg-mine-muted/40';
    case 'neutral':
      return 'bg-mine-muted/30';
  }
}

export function tierLabel(tier: ThresholdTier): string {
  switch (tier) {
    case 'good':
      return '优秀';
    case 'ok':
      return '合格';
    case 'poor':
      return '低于合格线';
    case 'neutral':
      return '—';
  }
}

export function valueToPosition(
  value: number,
  domain: [number, number],
): number {
  const [min, max] = domain;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}
