// 市场新闻流数据
export interface NewsItem {
  id: string;
  time: string; // HH:mm
  title: string;
  source: string;
  type: "flash" | "news" | "announcement" | "research"; // 快讯/新闻/公告/研报
  importance: "high" | "medium" | "low";
  tags?: string[];
  stocks?: string[]; // 相关股票
}

export const mockNews: NewsItem[] = [
  {
    id: "1",
    time: "14:52",
    title: "国务院常务会议：研究促进人工智能产业发展的政策措施",
    source: "新华社",
    type: "flash",
    importance: "high",
    tags: ["AI", "政策"],
  },
  {
    id: "2",
    time: "14:45",
    title: "华为发布新一代昇腾AI芯片，算力提升50%",
    source: "财联社",
    type: "news",
    importance: "high",
    tags: ["华为", "芯片"],
    stocks: ["润和软件", "中科曙光"],
  },
  {
    id: "3",
    time: "14:38",
    title: "北向资金午后加速流入，净买入超50亿元",
    source: "Wind",
    type: "flash",
    importance: "medium",
    tags: ["北向资金"],
  },
  {
    id: "4",
    time: "14:30",
    title: "宁德时代：与多家车企签订战略合作协议",
    source: "公司公告",
    type: "announcement",
    importance: "medium",
    tags: ["锂电池"],
    stocks: ["宁德时代"],
  },
  {
    id: "5",
    time: "14:22",
    title: "机构：AI算力需求将在2024年增长300%",
    source: "中信证券",
    type: "research",
    importance: "medium",
    tags: ["AI", "研报"],
  },
  {
    id: "6",
    time: "14:15",
    title: "创业板指涨幅扩大至2%，半导体板块领涨",
    source: "财联社",
    type: "flash",
    importance: "low",
    tags: ["半导体"],
  },
  {
    id: "7",
    time: "14:08",
    title: "多只AI概念股涨停，市场情绪持续升温",
    source: "同花顺",
    type: "flash",
    importance: "medium",
    tags: ["AI", "涨停"],
  },
  {
    id: "8",
    time: "14:00",
    title: "午后开盘：三大指数集体高开，科技股活跃",
    source: "Wind",
    type: "flash",
    importance: "low",
  },
  {
    id: "9",
    time: "13:45",
    title: "比亚迪：11月新能源汽车销量突破30万辆",
    source: "公司公告",
    type: "announcement",
    importance: "medium",
    tags: ["新能源车"],
    stocks: ["比亚迪"],
  },
  {
    id: "10",
    time: "13:30",
    title: "央行：将继续实施稳健的货币政策",
    source: "央行官网",
    type: "news",
    importance: "high",
    tags: ["央行", "政策"],
  },
  {
    id: "11",
    time: "11:30",
    title: "午间收盘：沪指涨0.8%，两市成交额破万亿",
    source: "Wind",
    type: "flash",
    importance: "low",
  },
  {
    id: "12",
    time: "11:15",
    title: "光伏板块异动拉升，隆基绿能涨超5%",
    source: "财联社",
    type: "flash",
    importance: "medium",
    tags: ["光伏"],
    stocks: ["隆基绿能"],
  },
];

// 获取最新N条新闻
export function getLatestNews(n = 10): NewsItem[] {
  return mockNews.slice(0, n);
}

// 获取重要新闻
export function getImportantNews(): NewsItem[] {
  return mockNews.filter((n) => n.importance === "high");
}
