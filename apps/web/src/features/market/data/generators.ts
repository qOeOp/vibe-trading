import type { TreemapNode, CandleData } from "../types";

const STOCK_SUFFIXES = [
  "股份", "科技", "电子", "新材", "智能", "精密", "光电",
  "信息", "控股", "实业", "集团", "技术", "工业", "能源", "生物",
];

export function generateSyntheticChildren(
  parentName: string,
  parentCF: number,
  parentCP: number,
  count: number
): TreemapNode[] {
  const children: TreemapNode[] = [];
  const weights = Array.from({ length: count }, () => 0.5 + Math.random());
  const wSum = weights.reduce((a, b) => a + b, 0);
  const shuffled = [...STOCK_SUFFIXES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    const cf = +(parentCF * (weights[i] / wSum)).toFixed(1);
    const cp = +(parentCP + (Math.random() - 0.5) * 4).toFixed(2);
    const suffix = shuffled[i % shuffled.length];
    const prefix = parentName.length > 2 ? parentName.slice(0, 2) : parentName;
    children.push({
      name: prefix + suffix,
      capitalFlow: cf,
      changePercent: cp,
    });
  }
  return children;
}

export function generateCandleData(days = 60): CandleData[] {
  const candles: CandleData[] = [];
  let close = 50 + Math.random() * 50;
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.48) * 4;
    const open = close;
    close = +(open + change).toFixed(2);
    const high = +Math.max(open, close, open + Math.random() * 2).toFixed(2);
    const low = +Math.min(open, close, open - Math.random() * 2).toFixed(2);
    candles.push({ open, close, high, low });
  }
  return candles;
}
