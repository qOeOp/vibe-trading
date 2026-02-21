export type DataCategory =
  | 'market'
  | 'fundamental'
  | 'factor'
  | 'alternative'
  | 'reference';

export interface DataSource {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  category: DataCategory;
  schema: { column: string; type: string }[];
  sampleCode: string;
}

export const CATEGORIES: { id: DataCategory; label: string; icon: string }[] = [
  { id: 'market', label: '行情数据', icon: 'TrendingUp' },
  { id: 'fundamental', label: '基本面', icon: 'Building2' },
  { id: 'factor', label: '因子数据', icon: 'FlaskConical' },
  { id: 'alternative', label: '另类数据', icon: 'Zap' },
  { id: 'reference', label: '参考数据', icon: 'BookOpen' },
];

export const DATA_SOURCES: DataSource[] = [
  {
    id: 'stock_zh_a_hist',
    name: 'stock_zh_a_hist',
    nameZh: 'A股历史行情',
    description: '获取 A 股个股历史 K 线数据（前复权）',
    category: 'market',
    schema: [
      { column: 'date', type: 'str' },
      { column: 'open', type: 'float64' },
      { column: 'close', type: 'float64' },
      { column: 'high', type: 'float64' },
      { column: 'low', type: 'float64' },
      { column: 'volume', type: 'int64' },
      { column: 'turnover', type: 'float64' },
    ],
    sampleCode:
      'df = ak.stock_zh_a_hist("000001", period="daily", adjust="qfq")',
  },
  {
    id: 'stock_zh_a_spot_em',
    name: 'stock_zh_a_spot_em',
    nameZh: 'A股实时行情',
    description: '获取 A 股所有股票的实时行情数据',
    category: 'market',
    schema: [
      { column: 'code', type: 'str' },
      { column: 'name', type: 'str' },
      { column: 'latest_price', type: 'float64' },
      { column: 'change_pct', type: 'float64' },
      { column: 'volume', type: 'int64' },
      { column: 'amount', type: 'float64' },
    ],
    sampleCode: 'df = ak.stock_zh_a_spot_em()',
  },
  {
    id: 'stock_financial_abstract_ths',
    name: 'stock_financial_abstract_ths',
    nameZh: '财务摘要',
    description: '获取同花顺个股财务摘要数据',
    category: 'fundamental',
    schema: [
      { column: 'report_date', type: 'str' },
      { column: 'eps', type: 'float64' },
      { column: 'bvps', type: 'float64' },
      { column: 'roe', type: 'float64' },
      { column: 'revenue', type: 'float64' },
      { column: 'net_profit', type: 'float64' },
    ],
    sampleCode: 'df = ak.stock_financial_abstract_ths(symbol="000001")',
  },
  {
    id: 'stock_lhb_detail_em',
    name: 'stock_lhb_detail_em',
    nameZh: '龙虎榜详情',
    description: '获取东方财富龙虎榜详情数据',
    category: 'alternative',
    schema: [
      { column: 'code', type: 'str' },
      { column: 'name', type: 'str' },
      { column: 'close', type: 'float64' },
      { column: 'change_pct', type: 'float64' },
      { column: 'net_buy', type: 'float64' },
    ],
    sampleCode:
      'df = ak.stock_lhb_detail_em(start_date="20240101", end_date="20240131")',
  },
  {
    id: 'stock_board_industry_name_em',
    name: 'stock_board_industry_name_em',
    nameZh: '行业板块',
    description: '获取东方财富行业板块名称列表',
    category: 'reference',
    schema: [
      { column: 'rank', type: 'int64' },
      { column: 'board_name', type: 'str' },
      { column: 'board_code', type: 'str' },
      { column: 'change_pct', type: 'float64' },
    ],
    sampleCode: 'df = ak.stock_board_industry_name_em()',
  },
];
