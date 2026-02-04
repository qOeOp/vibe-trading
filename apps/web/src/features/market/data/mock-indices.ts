import type { MarketIndex, MarketBreadth } from "../types";

function generateSparkline(base: number, volatility: number): number[] {
  const data: number[] = [];
  let v = base;
  for (let i = 0; i < 240; i++) {
    v += (Math.random() - 0.48) * volatility;
    data.push(+v.toFixed(2));
  }
  return data;
}

export const mockIndices: MarketIndex[] = [
  {
    code: "000001.SH",
    name: "上证指数",
    shortName: "上证",
    value: 3245.67,
    change: 38.92,
    changePercent: 1.21,
    volume: 3842,
    turnover: 4521,
    sparklineData: generateSparkline(3206, 8),
  },
  {
    code: "399001.SZ",
    name: "深证成指",
    shortName: "深证",
    value: 10523.45,
    change: 152.38,
    changePercent: 1.47,
    volume: 5124,
    turnover: 5832,
    sparklineData: generateSparkline(10371, 25),
  },
  {
    code: "399006.SZ",
    name: "创业板指",
    shortName: "创业板",
    value: 2156.78,
    change: 45.23,
    changePercent: 2.14,
    volume: 2156,
    turnover: 2843,
    sparklineData: generateSparkline(2111, 6),
  },
  {
    code: "000688.SH",
    name: "科创50",
    shortName: "科创50",
    value: 1023.45,
    change: -12.34,
    changePercent: -1.19,
    volume: 856,
    turnover: 1023,
    sparklineData: generateSparkline(1035, 4),
  },
  {
    code: "899050.BJ",
    name: "北证50",
    shortName: "北证50",
    value: 892.34,
    change: 8.56,
    changePercent: 0.97,
    volume: 234,
    turnover: 312,
    sparklineData: generateSparkline(883, 3),
  },
  {
    code: "000300.SH",
    name: "沪深300",
    shortName: "沪深300",
    value: 3876.12,
    change: 52.67,
    changePercent: 1.38,
    volume: 2678,
    turnover: 3245,
    sparklineData: generateSparkline(3823, 9),
  },
];

export const mockBreadth: MarketBreadth = {
  advancers: 2841,
  decliners: 1523,
  unchanged: 312,
  limitUp: 47,
  limitDown: 12,
};
