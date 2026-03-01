export type DataCategory =
  | 'market'
  | 'fundamental'
  | 'index'
  | 'capital'
  | 'alternative'
  | 'reference';

export interface DataSource {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  category: DataCategory;
  snippetPath?: string;
}

export const CATEGORIES: { id: DataCategory; label: string }[] = [
  { id: 'market', label: '行情数据' },
  { id: 'fundamental', label: '基本面' },
  { id: 'index', label: '指数数据' },
  { id: 'capital', label: '资金流向' },
  { id: 'alternative', label: '另类数据' },
  { id: 'reference', label: '参考数据' },
];

export const DATA_SOURCES: DataSource[] = [
  // ── 行情数据 ──────────────────────────────────────────
  {
    id: 'stock_zh_a_hist',
    name: 'stock_zh_a_hist',
    nameZh: 'A股历史行情',
    description:
      '获取沪深京A股个股日/周/月频率历史K线数据，包含开盘价、收盘价、最高价、最低价、成交量、成交额、振幅、涨跌幅与换手率。支持前复权、后复权和不复权三种模式，数据来源为东方财富。',
    category: 'market',
    snippetPath: 'market/stock_zh_a_hist.py',
  },
  {
    id: 'stock_zh_a_spot_em',
    name: 'stock_zh_a_spot_em',
    nameZh: 'A股实时行情',
    description:
      '获取沪深京全部A股的实时行情快照数据，包含最新价、涨跌额、涨跌幅、今开、最高、最低、成交量、成交额、振幅、换手率、市盈率、量比等字段。适用于盘中监控和选股筛选。',
    category: 'market',
    snippetPath: 'market/stock_zh_a_spot_em.py',
  },
  {
    id: 'stock_zh_a_hist_min_em',
    name: 'stock_zh_a_hist_min_em',
    nameZh: 'A股分时行情',
    description:
      '获取个股分钟级K线数据，支持1分钟、5分钟、15分钟、30分钟和60分钟五种周期。返回每根K线的开高低收和成交量，适用于日内交易策略回测和盘中技术分析。',
    category: 'market',
  },
  {
    id: 'stock_zh_a_tick_163',
    name: 'stock_zh_a_tick_163',
    nameZh: 'A股分笔数据',
    description:
      '获取网易财经提供的A股逐笔成交明细数据，包含每笔成交时间、成交价格、成交数量和买卖方向标识。可用于微观结构分析、订单流因子构建和冲击成本测算。',
    category: 'market',
  },
  {
    id: 'stock_hk_spot_em',
    name: 'stock_hk_spot_em',
    nameZh: '港股实时行情',
    description:
      '获取港股全部股票实时行情数据，涵盖主板与创业板。包含最新价、涨跌幅、成交额、52周最高/最低、市盈率、股息率等字段，适用于AH股溢价分析和南向资金跟踪。',
    category: 'market',
  },
  {
    id: 'stock_us_hist',
    name: 'stock_us_hist',
    nameZh: '美股历史行情',
    description:
      '获取东方财富美股历史K线数据，支持日/周/月频率和前复权/后复权。覆盖纽交所和纳斯达克上市公司，可用于跨市场对比分析和全球配置策略回测。',
    category: 'market',
  },
  {
    id: 'stock_zh_kcb_spot',
    name: 'stock_zh_kcb_spot',
    nameZh: '科创板行情',
    description:
      '获取科创板（688开头）股票实时行情数据。科创板实行注册制，涨跌幅限制为±20%，上市前5个交易日不设涨跌幅限制。数据含特殊标识字段以区分交易规则差异。',
    category: 'market',
  },
  {
    id: 'stock_zh_a_st_em',
    name: 'stock_zh_a_st_em',
    nameZh: 'ST股行情',
    description:
      '获取风险警示板（ST、*ST）股票实时行情数据。ST股涨跌幅限制为±5%，数据包含风险警示原因和摘帽/戴帽日期，适用于特殊事件驱动策略和壳资源研究。',
    category: 'market',
  },

  // ── 基本面 ──────────────────────────────────────────
  {
    id: 'stock_financial_analysis_indicator',
    name: 'stock_financial_analysis_indicator',
    nameZh: '财务分析指标',
    description:
      '获取东方财富个股财务分析指标数据，按报告期展示每股指标、盈利能力、成长能力、营运能力、偿债能力和现金流量等六大维度的详细财务比率。是多因子模型中基本面因子构建的核心数据源。',
    category: 'fundamental',
    snippetPath: 'fundamental/stock_financial_analysis_indicator.py',
  },
  {
    id: 'stock_financial_abstract_ths',
    name: 'stock_financial_abstract_ths',
    nameZh: '财务摘要',
    description:
      '获取同花顺个股财务摘要数据，按季度报告期展示。包含每股收益(EPS)、每股净资产(BPS)、净资产收益率(ROE)、营业收入、归母净利润和毛利率等核心财务指标，适用于基本面选股和估值模型输入。',
    category: 'fundamental',
  },
  {
    id: 'stock_individual_info_em',
    name: 'stock_individual_info_em',
    nameZh: '个股信息',
    description:
      '获取东方财富个股基本信息查询数据，包含总市值、流通市值、所属行业、上市日期、股票简称、注册地址等元数据字段。是构建股票池和横截面分析的基础参考数据。',
    category: 'fundamental',
  },
  {
    id: 'stock_sse_summary',
    name: 'stock_sse_summary',
    nameZh: '上交所概况',
    description:
      '获取上海证券交易所股票数据总貌，包含上市公司数量、总市值、流通市值、当日成交额和成交量等宏观统计指标。可用于监测市场整体规模变化和流动性趋势。',
    category: 'fundamental',
  },
  {
    id: 'stock_szse_summary',
    name: 'stock_szse_summary',
    nameZh: '深交所概况',
    description:
      '获取深圳证券交易所市场总貌数据，按证券类别（A股、B股、基金、债券）分别统计上市数量、市值和成交额，提供深市全景视图。',
    category: 'fundamental',
  },
  {
    id: 'stock_sse_deal_daily',
    name: 'stock_sse_deal_daily',
    nameZh: '上交所每日概况',
    description:
      '获取上交所每日成交概况，分别统计股票、基金、债券和回购的成交额与成交量。可用于跟踪市场日度活跃度变化和资产类别间的资金轮动趋势。',
    category: 'fundamental',
  },

  // ── 指数数据 ──────────────────────────────────────────
  {
    id: 'index_zh_a_hist',
    name: 'index_zh_a_hist',
    nameZh: 'A股指数行情',
    description:
      '获取中国股票指数（如上证指数、深证成指、创业板指、沪深300等）的历史行情数据。支持日/周/月频率，返回开高低收和成交量，是策略基准对比和宏观趋势分析的核心数据源。',
    category: 'index',
  },
  {
    id: 'index_zh_a_hist_min_em',
    name: 'index_zh_a_hist_min_em',
    nameZh: '指数分时行情',
    description:
      '获取东方财富提供的指数分钟级K线数据，支持1/5/15/30/60分钟多种时间周期。适用于日内指数趋势跟踪、择时信号验证和高频因子构建。',
    category: 'index',
  },
  {
    id: 'index_stock_cons',
    name: 'index_stock_cons',
    nameZh: '指数成份股',
    description:
      '获取指定指数的最新成份股列表，返回成份股代码和名称。覆盖沪深300、中证500、中证1000等主流宽基指数，是构建指数增强策略和行业分析的必备数据。',
    category: 'index',
  },
  {
    id: 'index_stock_cons_weight_csindex',
    name: 'index_stock_cons_weight_csindex',
    nameZh: '成份股权重',
    description:
      '获取中证指数网提供的成份股权重数据，包含每只成份股在指数中的权重占比。是指数复制、跟踪误差计算和风险归因分析的关键输入数据。',
    category: 'index',
  },
  {
    id: 'sw_index_spot',
    name: 'sw_index_spot',
    nameZh: '申万行业指数',
    description:
      '获取申万一级行业实时行情数据，包含各行业指数的涨跌幅、成交额、领涨股和领跌股。申万行业分类是A股最广泛使用的行业标准之一，覆盖31个一级行业。',
    category: 'index',
  },
  {
    id: 'sw_index_cons',
    name: 'sw_index_cons',
    nameZh: '申万行业成份',
    description:
      '获取申万一级和二级行业的成份股列表和权重数据。可用于行业轮动策略、板块强弱分析和组合行业暴露度计算。',
    category: 'index',
  },
  {
    id: 'index_vix',
    name: 'index_vix',
    nameZh: 'VIX恐慌指数',
    description:
      '获取CBOE波动率指数(VIX)历史数据，俗称"恐慌指数"。VIX衡量标普500期权隐含波动率，数值越高表示市场恐慌情绪越强。可用于全球市场情绪监测和尾部风险预警。',
    category: 'index',
  },

  // ── 资金流向 ──────────────────────────────────────────
  {
    id: 'stock_hsgt_north_net_flow_in',
    name: 'stock_hsgt_north_net_flow_in',
    nameZh: '北向资金净流入',
    description:
      '获取沪深港通北向资金每日净流入数据，分别统计沪股通和深股通两个通道。北向资金被视为"聪明钱"，其流入流出节奏常被用于判断外资对A股的态度和市场拐点信号。',
    category: 'capital',
  },
  {
    id: 'stock_hsgt_north_acc_flow_in',
    name: 'stock_hsgt_north_acc_flow_in',
    nameZh: '北向资金累计',
    description:
      '获取沪深港通北向资金历史累计净流入数据，展示外资在A股市场的长期资金配置趋势。可与指数叠加分析，观察外资累计流入与市场走势的背离或共振关系。',
    category: 'capital',
  },
  {
    id: 'stock_hsgt_hold_stock_em',
    name: 'stock_hsgt_hold_stock_em',
    nameZh: '北向持股明细',
    description:
      '获取东方财富北向资金个股持仓明细数据，包含持股数量、持股市值、占流通股比例和持股变动。可用于追踪外资重仓股变化、构建北向资金偏好因子。',
    category: 'capital',
  },
  {
    id: 'stock_margin_detail_szse',
    name: 'stock_margin_detail_szse',
    nameZh: '融资融券明细',
    description:
      '获取深交所融资融券逐日交易明细数据，包含融资余额、融资买入额、融券卖出量和担保比例。两融数据是衡量市场杠杆水平和投资者情绪的重要指标。',
    category: 'capital',
  },
  {
    id: 'stock_individual_fund_flow',
    name: 'stock_individual_fund_flow',
    nameZh: '个股资金流',
    description:
      '获取东方财富个股资金流向数据，按订单金额分为主力、超大单、大单、中单和小单五档，分别统计净流入/净流出金额。是判断个股主力动向和散户情绪的常用工具。',
    category: 'capital',
  },
  {
    id: 'stock_market_fund_flow',
    name: 'stock_market_fund_flow',
    nameZh: '大盘资金流',
    description:
      '获取东方财富沪深两市整体资金流向数据，按主力资金、超大单、大单、中单和小单分档统计净流入/净流出。可用于判断市场整体资金面松紧和主力进出场节奏。',
    category: 'capital',
  },

  // ── 另类数据 ──────────────────────────────────────────
  {
    id: 'stock_lhb_detail_em',
    name: 'stock_lhb_detail_em',
    nameZh: '龙虎榜详情',
    description:
      '获取东方财富龙虎榜详情数据，包含上榜个股、上榜原因、买入/卖出前五营业部明细和净买入额。龙虎榜揭示了短线游资和机构的操作轨迹，是短线交易者的重要参考。',
    category: 'alternative',
  },
  {
    id: 'stock_hot_rank_em',
    name: 'stock_hot_rank_em',
    nameZh: '个股人气榜',
    description:
      '获取东方财富个股人气排名数据，包含实时排名、排名变化幅度和连续上榜天数。人气排名反映散户关注度和市场情绪热点轮动，可作为反向情绪指标使用。',
    category: 'alternative',
  },
  {
    id: 'stock_zh_a_gdhs_detail_em',
    name: 'stock_zh_a_gdhs_detail_em',
    nameZh: '股东户数',
    description:
      '获取东方财富A股股东户数变化数据，包含最新股东户数、户均持股数量、户均持股金额和较上期增减比例。股东户数持续减少通常被视为筹码集中、主力建仓的信号。',
    category: 'alternative',
  },
  {
    id: 'stock_dzjy_sctj',
    name: 'stock_dzjy_sctj',
    nameZh: '大宗交易',
    description:
      '获取东方财富大宗交易市场统计数据，包含成交总额、成交均价、溢价/折价率和活跃个股。大宗交易价格相对市价的折溢价幅度可反映大资金对股票后市的预期。',
    category: 'alternative',
  },
  {
    id: 'baidu_search_index',
    name: 'baidu_search_index',
    nameZh: '百度搜索指数',
    description:
      '获取百度指定关键词的搜索热度历史数据，支持自定义时间区间和地域筛选。在量化中常用于构建散户关注度因子和市场情绪指标，研究表明搜索热度与股票异常收益存在统计相关性。',
    category: 'alternative',
  },
  {
    id: 'stock_comment_em',
    name: 'stock_comment_em',
    nameZh: '千股千评',
    description:
      '获取东方财富千股千评综合评级数据，从技术面、资金面和消息面三个维度对每只股票进行评分和评级。适用于快速筛选多维度共振的标的，辅助基本面和技术面交叉验证。',
    category: 'alternative',
  },

  // ── 参考数据 ──────────────────────────────────────────
  {
    id: 'stock_board_industry_name_em',
    name: 'stock_board_industry_name_em',
    nameZh: '行业板块列表',
    description:
      '获取东方财富行业板块名称、代码和实时涨跌幅列表。东方财富行业分类覆盖90+行业板块，粒度介于申万一级和二级之间，是行业轮动策略和板块强弱排名的常用分类标准。',
    category: 'reference',
  },
  {
    id: 'stock_board_concept_name_em',
    name: 'stock_board_concept_name_em',
    nameZh: '概念板块列表',
    description:
      '获取东方财富概念板块名称、代码和成份股数量。概念板块按热点主题（如人工智能、芯片、新能源等）划分，数量随市场热点动态增减，适用于主题投资和事件驱动策略。',
    category: 'reference',
  },
  {
    id: 'stock_info_a_code_name',
    name: 'stock_info_a_code_name',
    nameZh: 'A股代码表',
    description:
      '获取沪深京全部A股股票代码与名称对照表，是数据清洗和代码映射的基础参考数据。包含主板、中小板、创业板、科创板和北交所全部上市股票。',
    category: 'reference',
  },
  {
    id: 'tool_trade_date_hist_sina',
    name: 'tool_trade_date_hist_sina',
    nameZh: '交易日历',
    description:
      '获取新浪财经A股历史交易日历数据，标记每一天是否为交易日。是回测引擎和数据对齐的必备参考，可用于计算交易日间隔、节假日效应分析和到期日计算。',
    category: 'reference',
  },
  {
    id: 'stock_szse_area_summary',
    name: 'stock_szse_area_summary',
    nameZh: '地区交易排名',
    description:
      '获取深交所各省市地区证券交易额排名和上市公司地域分布数据。可用于研究区域经济活跃度与资本市场参与度的关系，辅助区域轮动策略设计。',
    category: 'reference',
  },
  {
    id: 'stock_szse_sector_summary',
    name: 'stock_szse_sector_summary',
    nameZh: '行业交易统计',
    description:
      '获取深交所行业维度的成交统计数据，包含各行业成交额、成交量、换手率和涨跌家数。提供与申万行业分类互补的官方交易所行业统计视角。',
    category: 'reference',
  },
];
