// 热门概念板块数据
export interface ConceptData {
  name: string;
  changePercent: number;
  stockCount: number; // 成分股数量
  leadingStock?: string; // 龙头股
  capitalFlow: number; // 资金流入(亿)
}

export const mockConcepts: ConceptData[] = [
  { name: "AI算力", changePercent: 5.82, stockCount: 68, leadingStock: "中科曙光", capitalFlow: 45.2 },
  { name: "华为概念", changePercent: 4.56, stockCount: 142, leadingStock: "润和软件", capitalFlow: 38.7 },
  { name: "机器人", changePercent: 3.89, stockCount: 95, leadingStock: "汇川技术", capitalFlow: 28.3 },
  { name: "CPO概念", changePercent: 3.45, stockCount: 32, leadingStock: "中际旭创", capitalFlow: 22.1 },
  { name: "半导体", changePercent: 2.78, stockCount: 186, leadingStock: "北方华创", capitalFlow: 35.6 },
  { name: "新能源车", changePercent: 2.34, stockCount: 245, leadingStock: "比亚迪", capitalFlow: 18.9 },
  { name: "光伏", changePercent: 1.92, stockCount: 128, leadingStock: "隆基绿能", capitalFlow: 12.4 },
  { name: "锂电池", changePercent: 1.56, stockCount: 167, leadingStock: "宁德时代", capitalFlow: 15.8 },
  { name: "消费电子", changePercent: 1.23, stockCount: 89, leadingStock: "立讯精密", capitalFlow: 8.7 },
  { name: "医药生物", changePercent: 0.87, stockCount: 312, leadingStock: "恒瑞医药", capitalFlow: 6.2 },
  { name: "白酒", changePercent: 0.45, stockCount: 42, leadingStock: "贵州茅台", capitalFlow: 4.5 },
  { name: "银行", changePercent: 0.23, stockCount: 38, leadingStock: "招商银行", capitalFlow: 2.1 },
  { name: "房地产", changePercent: -0.56, stockCount: 98, leadingStock: "万科A", capitalFlow: -8.3 },
  { name: "煤炭", changePercent: -1.23, stockCount: 45, leadingStock: "中国神华", capitalFlow: -12.5 },
  { name: "钢铁", changePercent: -1.78, stockCount: 52, leadingStock: "宝钢股份", capitalFlow: -15.2 },
];

// 获取涨幅前N的概念
export function getTopGainers(n: number = 8): ConceptData[] {
  return [...mockConcepts]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, n);
}

// 获取资金流入前N的概念
export function getTopCapitalInflow(n: number = 5): ConceptData[] {
  return [...mockConcepts]
    .filter((c) => c.capitalFlow > 0)
    .sort((a, b) => b.capitalFlow - a.capitalFlow)
    .slice(0, n);
}
