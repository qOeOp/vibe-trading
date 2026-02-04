/**
 * Mock Sectors Data
 * 板块和行业数据 - 纯函数式、不可变
 */

import type { SectorData, IndustryData } from "../types";

// ============ Base Sector Data ============

const SECTORS_BASE: readonly Omit<SectorData, "children">[] = [
  { name: "农林牧渔", icon: "wheat", capitalFlow: 12.5, changePercent: 0.85 },
  { name: "采掘", icon: "pickaxe", capitalFlow: -8.3, changePercent: -0.62 },
  { name: "化工", icon: "flask-conical", capitalFlow: 25.7, changePercent: 1.73 },
  { name: "钢铁", icon: "factory", capitalFlow: -15.2, changePercent: -1.25 },
  { name: "有色金属", icon: "gem", capitalFlow: 24.3, changePercent: 1.87 },
  { name: "电子", icon: "cpu", capitalFlow: 145.8, changePercent: 3.85 },
  { name: "家用电器", icon: "refrigerator", capitalFlow: 32.4, changePercent: 2.15 },
  { name: "食品饮料", icon: "coffee", capitalFlow: 78.6, changePercent: 2.68 },
  { name: "纺织服装", icon: "shirt", capitalFlow: -12.5, changePercent: -0.95 },
  { name: "轻工制造", icon: "package", capitalFlow: 15.3, changePercent: 0.12 },
  { name: "医药生物", icon: "pill", capitalFlow: 95.2, changePercent: 2.92 },
  { name: "公用事业", icon: "zap", capitalFlow: 8.7, changePercent: 0.15 },
  { name: "交通运输", icon: "truck", capitalFlow: -18.9, changePercent: -1.58 },
  { name: "房地产", icon: "home", capitalFlow: -45.6, changePercent: -3.42 },
  { name: "商业贸易", icon: "shopping-cart", capitalFlow: 12.8, changePercent: 0.78 },
  { name: "休闲服务", icon: "palmtree", capitalFlow: 22.3, changePercent: 1.65 },
  { name: "综合", icon: "grid-3x3", capitalFlow: 6.5, changePercent: -0.08 },
  { name: "建筑材料", icon: "hammer", capitalFlow: -9.8, changePercent: -0.73 },
  { name: "建筑装饰", icon: "paint-bucket", capitalFlow: 7.2, changePercent: 0.45 },
  { name: "电气设备", icon: "lightbulb", capitalFlow: 52.3, changePercent: 2.35 },
  { name: "机械设备", icon: "cog", capitalFlow: 28.9, changePercent: 1.88 },
  { name: "国防军工", icon: "shield", capitalFlow: 34.7, changePercent: 2.05 },
  { name: "计算机", icon: "monitor", capitalFlow: 67.5, changePercent: 2.78 },
  { name: "传媒", icon: "radio", capitalFlow: -23.4, changePercent: -2.15 },
  { name: "通信", icon: "smartphone", capitalFlow: 41.2, changePercent: 1.95 },
  { name: "银行", icon: "landmark", capitalFlow: 125.6, changePercent: 3.52 },
  { name: "汽车", icon: "car", capitalFlow: 56.8, changePercent: 2.45 },
  { name: "非银金融", icon: "credit-card", capitalFlow: 89.3, changePercent: 2.85 },
  { name: "煤炭", icon: "fuel", capitalFlow: -32.7, changePercent: -2.68 },
  { name: "石油石化", icon: "droplets", capitalFlow: -27.5, changePercent: -1.92 },
  { name: "新能源", icon: "battery-charging", capitalFlow: 102.3, changePercent: 4.15 },
] as const;

// ============ L2 Industry Data ============

const INDUSTRIES_MAP: Readonly<Record<string, readonly IndustryData[]>> = {
  // ============ 有色金属 - 真实申万二级/三级行业及成分股 ============
  有色金属: [
    {
      name: "工业金属",
      capitalFlow: 8.2,
      changePercent: 1.85,
      children: [
        // 铜 (16只成分股)
        { name: "紫金矿业", capitalFlow: 3.8, changePercent: 2.45 },
        { name: "江西铜业", capitalFlow: 1.5, changePercent: 1.92 },
        { name: "铜陵有色", capitalFlow: 0.8, changePercent: 1.65 },
        { name: "云南铜业", capitalFlow: 0.6, changePercent: 1.38 },
        { name: "西部矿业", capitalFlow: 0.5, changePercent: 2.12 },
        { name: "金诚信", capitalFlow: 0.4, changePercent: 3.25 },
        { name: "洛阳钼业", capitalFlow: 2.1, changePercent: 2.88 },
        // 铝 (31只成分股)
        { name: "中国铝业", capitalFlow: 1.8, changePercent: 1.42 },
        { name: "云铝股份", capitalFlow: 1.2, changePercent: 1.95 },
        { name: "天山铝业", capitalFlow: 0.9, changePercent: 2.68 },
        { name: "神火股份", capitalFlow: 0.7, changePercent: 1.75 },
        { name: "南山铝业", capitalFlow: 0.5, changePercent: 1.28 },
        { name: "明泰铝业", capitalFlow: 0.4, changePercent: 1.85 },
        { name: "中国宏桥", capitalFlow: 0.6, changePercent: 1.52 },
        { name: "新疆众和", capitalFlow: 0.3, changePercent: 2.15 },
        // 铅锌 (13只成分股)
        { name: "中金岭南", capitalFlow: 0.4, changePercent: 0.95 },
        { name: "驰宏锌锗", capitalFlow: 0.3, changePercent: 1.12 },
        { name: "锌业股份", capitalFlow: 0.2, changePercent: 0.78 },
        { name: "罗平锌电", capitalFlow: 0.1, changePercent: 0.65 },
        { name: "兴业矿业", capitalFlow: 0.2, changePercent: 1.35 },
        { name: "豫光金铅", capitalFlow: 0.15, changePercent: 0.88 },
      ],
    },
    {
      name: "贵金属",
      capitalFlow: 5.6,
      changePercent: 2.15,
      children: [
        // 黄金 (8只成分股)
        { name: "中金黄金", capitalFlow: 1.5, changePercent: 2.35 },
        { name: "山东黄金", capitalFlow: 1.2, changePercent: 2.68 },
        { name: "赤峰黄金", capitalFlow: 0.8, changePercent: 3.15 },
        { name: "银泰黄金", capitalFlow: 0.6, changePercent: 2.42 },
        { name: "湖南黄金", capitalFlow: 0.5, changePercent: 1.95 },
        { name: "西部黄金", capitalFlow: 0.3, changePercent: 1.78 },
        { name: "四川黄金", capitalFlow: 0.4, changePercent: 2.85 },
        { name: "恒邦股份", capitalFlow: 0.3, changePercent: 1.52 },
        // 白银 (3只成分股)
        { name: "盛达资源", capitalFlow: 0.2, changePercent: 1.65 },
        { name: "兴业银锡", capitalFlow: 0.5, changePercent: 2.92 },
        { name: "金贵银业", capitalFlow: 0.1, changePercent: 0.95 },
      ],
    },
    {
      name: "能源金属",
      capitalFlow: 3.2,
      changePercent: 0.85,
      children: [
        // 锂 (6只成分股)
        { name: "赣锋锂业", capitalFlow: 1.2, changePercent: 1.25 },
        { name: "天齐锂业", capitalFlow: 0.8, changePercent: 0.92 },
        { name: "盐湖股份", capitalFlow: 0.6, changePercent: 0.75 },
        { name: "融捷股份", capitalFlow: 0.2, changePercent: 1.45 },
        { name: "永兴材料", capitalFlow: 0.3, changePercent: 0.68 },
        { name: "雅化集团", capitalFlow: 0.15, changePercent: 0.55 },
        // 钴 (4只成分股)
        { name: "华友钴业", capitalFlow: 0.5, changePercent: 0.85 },
        { name: "寒锐钴业", capitalFlow: 0.2, changePercent: 1.15 },
        { name: "洛阳钼业", capitalFlow: 0.4, changePercent: 0.72 },
        { name: "腾远钴业", capitalFlow: 0.1, changePercent: 0.48 },
        // 镍 (3只成分股)
        { name: "格林美", capitalFlow: 0.3, changePercent: 0.65 },
        { name: "盛屯矿业", capitalFlow: 0.2, changePercent: 0.95 },
        { name: "华科镍材", capitalFlow: 0.1, changePercent: 0.35 },
      ],
    },
    {
      name: "小金属",
      capitalFlow: 4.5,
      changePercent: 2.58,
      children: [
        // 稀土 (9只成分股)
        { name: "北方稀土", capitalFlow: 1.5, changePercent: 3.25 },
        { name: "中国稀土", capitalFlow: 0.8, changePercent: 2.85 },
        { name: "广晟有色", capitalFlow: 0.4, changePercent: 2.15 },
        { name: "盛和资源", capitalFlow: 0.3, changePercent: 2.42 },
        { name: "五矿稀土", capitalFlow: 0.25, changePercent: 1.95 },
        // 钨 (8只成分股)
        { name: "厦门钨业", capitalFlow: 0.6, changePercent: 2.75 },
        { name: "中钨高新", capitalFlow: 0.4, changePercent: 3.15 },
        { name: "章源钨业", capitalFlow: 0.2, changePercent: 2.08 },
        { name: "翔鹭钨业", capitalFlow: 0.15, changePercent: 1.85 },
        // 其他小金属 (6只成分股)
        { name: "锡业股份", capitalFlow: 0.3, changePercent: 1.95 },
        { name: "金钼股份", capitalFlow: 0.25, changePercent: 2.52 },
        { name: "云海金属", capitalFlow: 0.2, changePercent: 1.68 },
        { name: "东方锆业", capitalFlow: 0.1, changePercent: 1.42 },
        { name: "有研新材", capitalFlow: 0.15, changePercent: 2.05 },
      ],
    },
    {
      name: "金属新材料",
      capitalFlow: 2.8,
      changePercent: 1.92,
      children: [
        // 磁性材料 (7只成分股)
        { name: "中科三环", capitalFlow: 0.6, changePercent: 2.35 },
        { name: "金力永磁", capitalFlow: 0.5, changePercent: 2.85 },
        { name: "宁波韵升", capitalFlow: 0.4, changePercent: 1.95 },
        { name: "正海磁材", capitalFlow: 0.3, changePercent: 2.15 },
        { name: "英洛华", capitalFlow: 0.25, changePercent: 1.72 },
        { name: "大地熊", capitalFlow: 0.2, changePercent: 2.42 },
        { name: "横店东磁", capitalFlow: 0.35, changePercent: 1.58 },
        // 其他金属新材料 (6只成分股)
        { name: "博威合金", capitalFlow: 0.2, changePercent: 1.85 },
        { name: "斯瑞新材", capitalFlow: 0.15, changePercent: 3.42 },
        { name: "安泰科技", capitalFlow: 0.18, changePercent: 1.65 },
        { name: "图南股份", capitalFlow: 0.12, changePercent: 2.08 },
        { name: "西部超导", capitalFlow: 0.25, changePercent: 1.92 },
        { name: "钢研高纳", capitalFlow: 0.15, changePercent: 1.48 },
      ],
    },
  ],

  电子: [
    { name: "半导体", capitalFlow: 52.3, changePercent: 5.12 },
    { name: "消费电子", capitalFlow: 28.7, changePercent: 3.45 },
    { name: "电子元件", capitalFlow: 18.2, changePercent: 2.88 },
    { name: "光学光电", capitalFlow: 15.6, changePercent: 4.21 },
    { name: "被动元件", capitalFlow: 10.8, changePercent: 2.15 },
    { name: "PCB", capitalFlow: 9.4, changePercent: 3.72 },
    { name: "LED", capitalFlow: 5.9, changePercent: 1.85 },
    { name: "面板", capitalFlow: 4.9, changePercent: 2.47 },
  ],
  食品饮料: [
    { name: "白酒", capitalFlow: 35.2, changePercent: 3.15 },
    { name: "啤酒", capitalFlow: 12.8, changePercent: 1.92 },
    { name: "乳制品", capitalFlow: 10.5, changePercent: 2.08 },
    { name: "调味品", capitalFlow: 8.7, changePercent: 1.65 },
    { name: "休闲食品", capitalFlow: 6.9, changePercent: 2.78 },
    { name: "饮料", capitalFlow: 4.5, changePercent: 3.42 },
  ],
  银行: [
    { name: "国有大行", capitalFlow: 48.5, changePercent: 3.85 },
    { name: "股份行", capitalFlow: 32.1, changePercent: 3.22 },
    { name: "城商行", capitalFlow: 22.4, changePercent: 3.68 },
    { name: "农商行", capitalFlow: 14.2, changePercent: 2.95 },
    { name: "金融科技", capitalFlow: 8.4, changePercent: 4.15 },
  ],
  医药生物: [
    { name: "化学制药", capitalFlow: 28.6, changePercent: 3.15 },
    { name: "中药", capitalFlow: 18.3, changePercent: 2.42 },
    { name: "生物制品", capitalFlow: 16.8, changePercent: 3.68 },
    { name: "医疗器械", capitalFlow: 14.2, changePercent: 2.85 },
    { name: "医药商业", capitalFlow: 9.8, changePercent: 1.92 },
    { name: "CXO", capitalFlow: 7.5, changePercent: 3.95 },
  ],
  新能源: [
    { name: "光伏", capitalFlow: 28.5, changePercent: 4.85 },
    { name: "风电", capitalFlow: 18.2, changePercent: 3.72 },
    { name: "储能", capitalFlow: 16.8, changePercent: 5.15 },
    { name: "锂电池", capitalFlow: 15.3, changePercent: 3.92 },
    { name: "氢能", capitalFlow: 10.2, changePercent: 4.68 },
    { name: "充电桩", capitalFlow: 7.8, changePercent: 3.45 },
    { name: "新能源车", capitalFlow: 5.5, changePercent: 4.22 },
  ],
} as const;

// ============ Factory Functions ============

/**
 * 创建完整的板块数据（包含子行业）
 * 纯函数，每次调用返回新的数组
 */
function createSectorsData(): SectorData[] {
  return SECTORS_BASE.map((sector) => ({
    ...sector,
    children: INDUSTRIES_MAP[sector.name]
      ? [...INDUSTRIES_MAP[sector.name]]
      : undefined,
  }));
}

// ============ Exports ============

/** 板块数据（包含子行业） */
export const mockSectors: SectorData[] = createSectorsData();

/** 获取指定板块的子行业 */
export function getIndustries(sectorName: string): IndustryData[] {
  return INDUSTRIES_MAP[sectorName] ? [...INDUSTRIES_MAP[sectorName]] : [];
}

/** 获取所有板块名称 */
export function getSectorNames(): string[] {
  return SECTORS_BASE.map((s) => s.name);
}

/** 按资金流排序的板块（流入最多的在前） */
export function getSectorsByFlow(ascending = false): SectorData[] {
  const sectors = createSectorsData();
  return sectors.sort((a, b) =>
    ascending ? a.capitalFlow - b.capitalFlow : b.capitalFlow - a.capitalFlow
  );
}

/** 按涨跌幅排序的板块 */
export function getSectorsByChange(ascending = false): SectorData[] {
  const sectors = createSectorsData();
  return sectors.sort((a, b) =>
    ascending ? a.changePercent - b.changePercent : b.changePercent - a.changePercent
  );
}

/** 获取上涨板块 */
export function getGainingSectors(): SectorData[] {
  return createSectorsData().filter((s) => s.changePercent > 0);
}

/** 获取下跌板块 */
export function getLosingSectors(): SectorData[] {
  return createSectorsData().filter((s) => s.changePercent < 0);
}
