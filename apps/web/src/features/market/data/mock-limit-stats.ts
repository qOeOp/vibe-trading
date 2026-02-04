// 涨跌停统计数据
export interface LimitStats {
  // 涨停
  limitUp: number;
  limitUpYesterday: number; // 昨日涨停
  limitUpOpen: number; // 涨停开板数
  sealRate: number; // 封板率 (%)

  // 跌停
  limitDown: number;
  limitDownYesterday: number;
  limitDownOpen: number; // 跌停开板数

  // 连板
  continuousUp: {
    count: number; // 连板数
    stocks: string[]; // 代表股票
  }[];

  // 炸板
  brokenBoard: number; // 炸板数
  brokenBoardRate: number; // 炸板率 (%)
}

export const mockLimitStats: LimitStats = {
  // 涨停数据
  limitUp: 47,
  limitUpYesterday: 52,
  limitUpOpen: 8, // 涨停开板
  sealRate: 83, // 封板率 = (47-8)/47 * 100

  // 跌停数据
  limitDown: 12,
  limitDownYesterday: 8,
  limitDownOpen: 3,

  // 连板统计
  continuousUp: [
    { count: 5, stocks: ["川大智胜"] },
    { count: 4, stocks: ["润和软件", "中科曙光"] },
    { count: 3, stocks: ["拓维信息", "科大讯飞", "浪潮信息"] },
    { count: 2, stocks: ["中际旭创", "新易盛", "天孚通信", "华工科技"] },
  ],

  // 炸板
  brokenBoard: 8,
  brokenBoardRate: 17, // 炸板率 = 8 / 47 * 100
};

// 涨停股票列表（简化版）
export interface LimitUpStock {
  code: string;
  name: string;
  limitTime: string; // 涨停时间
  sealAmount: number; // 封单金额（亿）
  continuousDays: number; // 连板天数
  concept: string; // 所属概念
}

export const mockLimitUpStocks: LimitUpStock[] = [
  { code: "002230", name: "科大讯飞", limitTime: "09:32", sealAmount: 8.5, continuousDays: 3, concept: "AI算力" },
  { code: "300496", name: "中科创达", limitTime: "09:45", sealAmount: 5.2, continuousDays: 2, concept: "华为概念" },
  { code: "688008", name: "澜起科技", limitTime: "10:12", sealAmount: 3.8, continuousDays: 1, concept: "半导体" },
  { code: "002415", name: "海康威视", limitTime: "10:28", sealAmount: 12.3, continuousDays: 1, concept: "AI算力" },
  { code: "300750", name: "宁德时代", limitTime: "13:15", sealAmount: 25.6, continuousDays: 1, concept: "锂电池" },
];

// 跌停股票列表
export interface LimitDownStock {
  code: string;
  name: string;
  limitTime: string;
  reason: string; // 跌停原因
}

export const mockLimitDownStocks: LimitDownStock[] = [
  { code: "600028", name: "中国石化", limitTime: "09:35", reason: "业绩不及预期" },
  { code: "601088", name: "中国神华", limitTime: "10:05", reason: "煤炭板块调整" },
  { code: "000002", name: "万科A", limitTime: "09:42", reason: "房地产利空" },
];
