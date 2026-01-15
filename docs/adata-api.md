# Index

- [fund.info.all_etf_exchange_traded_info()](#场内可交易ETF列表-(All-ETF-Exchange-Traded-Info)) - 获取场内所有可以交易的etf基金列表
- [fund.market.get_market_etf()](#K线-(K-line)) - 获取单个ETF的K线行情
- [fund.market.get_market_etf_min()](#分时-(Time-sharing)) - 获取单个ETF的分时行情
- [fund.market.get_market_etf_current()](#实时-(Real-time)) - 获取当个ETF的实时行情，即最新的行情数据
- [stock.finance.get_core_index()](#股票财务核心指标-(Stock-Financial-Core-Indicators)) - 获取单只股票财务的核心指标
- [stock.info.all_code()](#股票代码信息-(Stock-Code-Information)) - 获取A股所有股票代码信息列表
- [stock.info.get_stock_shares()](#股票股本信息-(Stock-Share-Capital-Information)) - 获取单个股票的股本信息
- [stock.info.get_industry_sw()](#股票申万一二级行业信息) - 获取单个股票的申万一二级行业信息
- [stock.info.all_concept_code_ths()](#概念指数信息-ths) - 获取同花顺的概念代码信息列表
- [stock.info.concept_constituent_ths()](#概念指数成分信息-ths) - 获取同花顺的概念代码对应的最新成分列表信息
- [stock.info.get_concept_ths()](#单只股票所属概念-ths) - 获取单只股票所属的概念信息
- [stock.info.all_concept_code_east()](#概念指数信息-east) - 获取东方财富的的概念代码信息列表
- [stock.info.concept_constituent_east()](#概念指数成分信息-east) - 获取东方财富的概念代码对应的最新成分列表信息
- [stock.info.get_concept_east()](#单只股票所属概念-east) - 获取单只股票所属的概念信息
- [stock.info.get_plate_east()](#单只股票所属板块-east) - 获取单只股票所属的板块信息：行业，板块（地区），概念
- [stock.info.get_concept_baidu()](#单只股票所属概念-baidu) - 获取单只股票所属的概念信息
- [stock.info.all_index_code()](#指数代码信息) - 获取A股所有指数信息列表
- [stock.info.index_constituent()](#指数成分信息) - 获取指数对应的最新成分列表信息
- [stock.info.trade_calendar()](#交易日历) - 获取对应年份的交易日历信息
- [stock.market.get_dividend()](#分红-DIVIDEND) - 获取对应股票的所有历史分红信息
- [stock.market.get_market()](#K线行情) - 获取当个股票的K线行情信息
- [stock.market.get_market_min()](#分时行情) - 获取单个股票最新交易日的分时行情
- [stock.market.list_market_current()](#实时行情) - 获取多只股票的实时最新行情数据
- [stock.market.get_market_five()](#五档行情) - 获取单个股票的5档行情
- [stock.market.get_market_bar()](#分时成交) - 获取单个股票的成交分时，最新200条记录
- [stock.market.get_capital_flow_min()](#分时资金流向) - 获取单个股票的资金流向分时
- [stock.market.get_capital_flow()](#资金流向-日度) - 获取单个股票的资金流向历史数据-日度
- [stock.market.get_market_concept_ths()](#概念行情-同花顺-THS---K线) - 获取单个同花顺概念指数的K线行情
- [stock.market.get_market_concept_min_ths()](#概念行情-同花顺-THS---分时) - 获取单个同花顺概念指数的分时行情
- [stock.market.get_market_concept_current_ths()](#概念行情-同花顺-THS---实时) - 获取当个同花顺概念指数的实时行情，即最新的行情数据
- [stock.market.get_market_concept_east()](#概念行情-东方财富-EAST---K线) - 获取单个东方财富概念指数的K线行情
- [stock.market.get_market_concept_min_east()](#概念行情-东方财富-EAST---分时) - 获取单个东方财富概念指数的分时行情
- [stock.market.get_market_concept_current_east()](#概念行情-东方财富-EAST---实时) - 获取当个东方财富概念指数的实时行情，即最新的行情数据
- [stock.market.all_capital_flow_east()](#近N日所有概念流向) - 获取所有的概念近(1,5,10)日的资金流向
- [stock.market.get_market_index()](#指数行情-INDEX-MARKET---K线) - 获取单个指数的K线行情
- [stock.market.get_market_index_min()](#指数行情-INDEX-MARKET---分时) - 获取单个指数的分时行情
- [stock.market.get_market_index_current()](#指数行情-INDEX-MARKET---实时) - 获取当个指数的实时行情，即最新的指数行情数据
- [sentiment.stock_lifting_last_month()](#近一个月的股票解禁列表) - 获取最近一个月的股票解禁数据
- [sentiment.securities_margin()](#融资融券余额数据) - 查询全市场融资融券余额数据
- [sentiment.north.north_flow_current()](#北向实时流入行情) - 获取北向的实时流入行情
- [sentiment.north.north_flow_min()](#北向分时流入行情) - 获取北向的分时流入行情
- [sentiment.north.north_flow()](#北向历史流入行情) - 获取北向的历史流入行情
- [sentiment.hot.pop_rank_100_east()](#东方财富人气榜TOP100) - 东方财富人气榜TOP100
- [sentiment.hot.hot_rank_100_ths()](#同花顺热股TOP100) - 同花顺热股TOP100
- [sentiment.hot.hot_concept_20_ths()](#同花热门概念板块TOP20) - 同花热门概念板块TOP20
- [sentiment.hot.list_a_list_daily()](#每日龙虎榜列表) - 获取相应日期的所有龙虎榜列表
- [sentiment.hot.get_a_list_info()](#单只股票龙虎榜信息) - 获取单只股票龙虎榜信息
- [sentiment.mine.mine_clearance_tdx()](#单只股票扫雷避险信息) - 获取单只股票扫雷避险信息
- [bond.info.all_convert_code()](#可转换债券代码列表) - 获取所有可转换债券代码信息列表
- [bond.market.list_market_current()](#可转换债券行情列表) - 获取可转换债券的实时最新行情信息

---

# 场内可交易ETF列表 (All ETF Exchange Traded Info)

## api call
fund.info.all_etf_exchange_traded_info()

## response
```json
{
  "metadata": {
    "description": "获取场内所有可以交易的etf基金列表",
    "data_structure": [
      {
        "field": "fund_code",
        "type": "string",
        "comment": "基金代码",
        "description": "基金代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "基金简称",
        "description": "基金简称"
      },
      {
        "field": "net_value",
        "type": "decimal",
        "comment": "最新净值(元)",
        "description": "最新净值(元)"
      }
    ]
  },
  "sample_data": {
    "description": "获取场内所有可以交易的etf基金列表",
    "data": [],
    "summary": {}
  }
}
```
# K线 (K-line)

## api call
fund.market.get_market_etf()

## response
```json
{
  "metadata": {
    "description": "获取单个ETF的K线行情",
    "data_structure": [
      {
        "field": "fund_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价",
        "description": "开盘价"
      },
      {
        "field": "close",
        "type": "decimal",
        "comment": "收盘价",
        "description": "收盘价"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价",
        "description": "最低价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个ETF的K线行情",
    "data": [],
    "summary": {}
  }
}
```
# 分时 (Time-sharing)

## api call
fund.market.get_market_etf_min()

## response
```json
{
  "metadata": {
    "description": "获取单个ETF的分时行情",
    "data_structure": [
      {
        "field": "fund_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "现价",
        "description": "现价"
      },
      {
        "field": "avg_price",
        "type": "decimal",
        "comment": "均价",
        "description": "均价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个ETF的分时行情",
    "data": [],
    "summary": {}
  }
}
```
# 实时 (Real-time)

## api call
fund.market.get_market_etf_current()

## response
```json
{
  "metadata": {
    "description": "获取当个ETF的实时行情，即最新的行情数据",
    "data_structure": [
      {
        "field": "fund_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价",
        "description": "开盘价"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "现价",
        "description": "现价"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价",
        "description": "最低价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取当个ETF的实时行情，即最新的行情数据",
    "data": [],
    "summary": {}
  }
}
```
# 股票财务核心指标 (Stock Financial Core Indicators)

## api call
stock.finance.get_core_index()

## response
```json
{
  "metadata": {
    "description": "获取单只股票财务的核心指标",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "report_date",
        "type": "date",
        "comment": "报告日期",
        "description": "报告日期"
      },
      {
        "field": "report_type",
        "type": "date",
        "comment": "报告类型",
        "description": "报告类型"
      },
      {
        "field": "notice_date",
        "type": "date",
        "comment": "公布日期",
        "description": "公布日期"
      },
      {
        "field": "basic_eps",
        "type": "decimal",
        "comment": "基本每股收益(元)",
        "description": "基本每股收益(元)"
      },
      {
        "field": "diluted_eps",
        "type": "decimal",
        "comment": "稀释每股收益(元)",
        "description": "稀释每股收益(元)"
      },
      {
        "field": "non_gaap_eps",
        "type": "decimal",
        "comment": "扣非每股收益(元)",
        "description": "扣非每股收益(元)"
      },
      {
        "field": "net_asset_ps",
        "type": "decimal",
        "comment": "每股净资产(元)",
        "description": "每股净资产(元)"
      },
      {
        "field": "cap_reserve_ps",
        "type": "decimal",
        "comment": "每股公积金(元)",
        "description": "每股公积金(元)"
      },
      {
        "field": "undist_profit_ps",
        "type": "decimal",
        "comment": "每股未分配利润(元)",
        "description": "每股未分配利润(元)"
      },
      {
        "field": "oper_cf_ps",
        "type": "decimal",
        "comment": "每股经营现金流(元)",
        "description": "每股经营现金流(元)"
      },
      {
        "field": "total_rev",
        "type": "decimal",
        "comment": "营业总收入(元)",
        "description": "营业总收入(元)"
      },
      {
        "field": "gross_profit",
        "type": "decimal",
        "comment": "毛利润(元)",
        "description": "毛利润(元)"
      },
      {
        "field": "net_profit_attr_sh",
        "type": "decimal",
        "comment": "归属净利润(元)",
        "description": "归属净利润(元)"
      },
      {
        "field": "non_gaap_net_profit",
        "type": "decimal",
        "comment": "扣非净利润(元)",
        "description": "扣非净利润(元)"
      },
      {
        "field": "total_rev_yoy_gr",
        "type": "decimal",
        "comment": "营业总收入同比增长(%)",
        "description": "营业总收入同比增长(%)"
      },
      {
        "field": "net_profit_yoy_gr",
        "type": "decimal",
        "comment": "归属净利润同比增长(%)",
        "description": "归属净利润同比增长(%)"
      },
      {
        "field": "non_gaap_net_profit_yoy_gr",
        "type": "decimal",
        "comment": "扣非净利润同比增长(%)",
        "description": "扣非净利润同比增长(%)"
      },
      {
        "field": "total_rev_qoq_gr",
        "type": "decimal",
        "comment": "营业总收入滚动环比增长(%)",
        "description": "营业总收入滚动环比增长(%)"
      },
      {
        "field": "net_profit_qoq_gr",
        "type": "decimal",
        "comment": "归属净利润滚动环比增长(%)",
        "description": "归属净利润滚动环比增长(%)"
      },
      {
        "field": "non_gaap_net_profit_qoq_gr",
        "type": "decimal",
        "comment": "扣非净利润滚动环比增长(%)",
        "description": "扣非净利润滚动环比增长(%)"
      },
      {
        "field": "roe_wtd",
        "type": "decimal",
        "comment": "净资产收益率(加权)(%)",
        "description": "净资产收益率(加权)(%)"
      },
      {
        "field": "roe_non_gaap_wtd",
        "type": "decimal",
        "comment": "净资产收益率(扣非/加权)(%)",
        "description": "净资产收益率(扣非/加权)(%)"
      },
      {
        "field": "roa_wtd",
        "type": "decimal",
        "comment": "总资产收益率(加权)(%)",
        "description": "总资产收益率(加权)(%)"
      },
      {
        "field": "gross_margin",
        "type": "decimal",
        "comment": "毛利率(%)",
        "description": "毛利率(%)"
      },
      {
        "field": "net_margin",
        "type": "decimal",
        "comment": "净利率(%)",
        "description": "净利率(%)"
      },
      {
        "field": "adv_receipts_to_rev",
        "type": "decimal",
        "comment": "预收账款/营业总收入",
        "description": "预收账款/营业总收入"
      },
      {
        "field": "net_cf_sales_to_rev",
        "type": "decimal",
        "comment": "销售净现金流/营业总收入",
        "description": "销售净现金流/营业总收入"
      },
      {
        "field": "oper_cf_to_rev",
        "type": "decimal",
        "comment": "经营净现金流/营业总收入",
        "description": "经营净现金流/营业总收入"
      },
      {
        "field": "eff_tax_rate",
        "type": "decimal",
        "comment": "实际税率(%)",
        "description": "实际税率(%)"
      },
      {
        "field": "curr_ratio",
        "type": "decimal",
        "comment": "流动比率",
        "description": "流动比率"
      },
      {
        "field": "quick_ratio",
        "type": "decimal",
        "comment": "速动比率",
        "description": "速动比率"
      },
      {
        "field": "cash_flow_ratio",
        "type": "decimal",
        "comment": "现金流量比率",
        "description": "现金流量比率"
      },
      {
        "field": "asset_liab_ratio",
        "type": "decimal",
        "comment": "资产负债率(%)",
        "description": "资产负债率(%)"
      },
      {
        "field": "equity_multiplier",
        "type": "decimal",
        "comment": "权益系数",
        "description": "权益系数"
      },
      {
        "field": "equity_ratio",
        "type": "decimal",
        "comment": "产权比率",
        "description": "产权比率"
      },
      {
        "field": "total_asset_turn_days",
        "type": "decimal",
        "comment": "总资产周转天数(天)",
        "description": "总资产周转天数(天)"
      },
      {
        "field": "inv_turn_days",
        "type": "decimal",
        "comment": "存货周转天数(天)",
        "description": "存货周转天数(天)"
      },
      {
        "field": "acct_recv_turn_days",
        "type": "decimal",
        "comment": "应收账款周转天数(天)",
        "description": "应收账款周转天数(天)"
      },
      {
        "field": "total_asset_turn_rate",
        "type": "decimal",
        "comment": "总资产周转率(次)",
        "description": "总资产周转率(次)"
      },
      {
        "field": "inv_turn_rate",
        "type": "decimal",
        "comment": "存货周转率(次)",
        "description": "存货周转率(次)"
      },
      {
        "field": "acct_recv_turn_rate",
        "type": "decimal",
        "comment": "应收账款周转率(次)",
        "description": "应收账款周转率(次)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单只股票财务的核心指标",
    "data": [],
    "summary": {}
  }
}
```
# 股票代码信息 (Stock Code Information)

## api call
stock.info.all_code()

## response
```json
{
  "metadata": {
    "description": "获取A股所有股票代码信息列表",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "简称",
        "description": "简称"
      },
      {
        "field": "exchange",
        "type": "string",
        "comment": "交易所",
        "description": "交易所"
      },
      {
        "field": "list_date",
        "type": "date",
        "comment": "上市日期",
        "description": "上市日期"
      }
    ]
  },
  "sample_data": {
    "description": "获取A股所有股票代码信息列表",
    "data": [],
    "summary": {}
  }
}
```
# 股票股本信息 (Stock Share Capital Information)

## api call
stock.info.get_stock_shares()

## response
```json
{
  "metadata": {
    "description": "获取单个股票的股本信息",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "change_date",
        "type": "date",
        "comment": "变动时间",
        "description": "变动时间"
      },
      {
        "field": "total_shares",
        "type": "int",
        "comment": "总股本：股",
        "description": "总股本：股"
      },
      {
        "field": "limit_shares",
        "type": "int",
        "comment": "限售股本：股",
        "description": "限售股本：股"
      },
      {
        "field": "list_a_shares",
        "type": "int",
        "comment": "流通A股股本：股",
        "description": "流通A股股本：股"
      },
      {
        "field": "change_reason",
        "type": "string",
        "comment": "变动原因",
        "description": "变动原因"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个股票的股本信息",
    "data": [],
    "summary": {}
  }
}
```
# 股票申万一二级行业信息

## api call
stock.info.get_industry_sw()

## response
```json
{
  "metadata": {
    "description": "获取单个股票的申万一二级行业信息",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "sw_code",
        "type": "string",
        "comment": "申万行业代码",
        "description": "申万行业代码"
      },
      {
        "field": "industry_name",
        "type": "string",
        "comment": "行业名称",
        "description": "行业名称"
      },
      {
        "field": "industry_type",
        "type": "string",
        "comment": "行业类别",
        "description": "行业类别"
      },
      {
        "field": "source",
        "type": "string",
        "comment": "来源",
        "description": "来源"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个股票的申万一二级行业信息",
    "data": [],
    "summary": {}
  }
}
```
# 概念指数信息-ths

## api call
stock.info.all_concept_code_ths()

## response
```json
{
  "metadata": {
    "description": "获取同花顺的概念代码信息列表",
    "data_structure": [
      {
        "field": "name",
        "type": "string",
        "comment": "名称",
        "description": "名称"
      },
      {
        "field": "index_code",
        "type": "string",
        "comment": "指数代码",
        "description": "指数代码"
      },
      {
        "field": "concept_code",
        "type": "string",
        "comment": "概念代码",
        "description": "概念代码"
      },
      {
        "field": "source",
        "type": "string",
        "comment": "来源",
        "description": "来源"
      }
    ]
  },
  "sample_data": {
    "description": "获取同花顺的概念代码信息列表",
    "data": [],
    "summary": {}
  }
}
```
# 概念指数成分信息-ths

## api call
stock.info.concept_constituent_ths()

## response
```json
{
  "metadata": {
    "description": "获取同花顺的概念代码对应的最新成分列表信息",
    "data_structure": [
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      }
    ]
  },
  "sample_data": {
    "description": "获取同花顺的概念代码对应的最新成分列表信息",
    "data": [],
    "summary": {}
  }
}
```
# 单只股票所属概念-ths

## api call
stock.info.get_concept_ths()

## response
```json
{
  "metadata": {
    "description": "获取单只股票所属的概念信息",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "concept_code",
        "type": "string",
        "comment": "概念代码",
        "description": "概念代码"
      },
      {
        "field": "name",
        "type": "string",
        "comment": "概念名称",
        "description": "概念名称"
      },
      {
        "field": "source",
        "type": "string",
        "comment": "来源",
        "description": "来源"
      },
      {
        "field": "reason",
        "type": "string",
        "comment": "概念原因",
        "description": "概念原因"
      }
    ]
  },
  "sample_data": {
    "description": "获取单只股票所属的概念信息",
    "data": [],
    "summary": {}
  }
}
```
# 概念指数信息-east

## api call
stock.info.all_concept_code_east()

## response
```json
{
  "metadata": {
    "description": "获取东方财富的的概念代码信息列表",
    "data_structure": [
      {
        "field": "name",
        "type": "string",
        "comment": "名称",
        "description": "名称"
      },
      {
        "field": "index_code",
        "type": "string",
        "comment": "指数代码",
        "description": "指数代码"
      },
      {
        "field": "concept_code",
        "type": "string",
        "comment": "概念代码",
        "description": "概念代码"
      },
      {
        "field": "source",
        "type": "string",
        "comment": "来源",
        "description": "来源"
      }
    ]
  },
  "sample_data": {
    "description": "获取东方财富的的概念代码信息列表",
    "data": [],
    "summary": {}
  }
}
```
# 概念指数成分信息-east

## api call
stock.info.concept_constituent_east()

## response
```json
{
  "metadata": {
    "description": "获取东方财富的概念代码对应的最新成分列表信息",
    "data_structure": [
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      }
    ]
  },
  "sample_data": {
    "description": "获取东方财富的概念代码对应的最新成分列表信息",
    "data": [],
    "summary": {}
  }
}
```
# 单只股票所属概念-east

## api call
stock.info.get_concept_east()

## response
```json
{
  "metadata": {
    "description": "获取单只股票所属的概念信息",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "concept_code",
        "type": "string",
        "comment": "概念代码",
        "description": "概念代码"
      },
      {
        "field": "name",
        "type": "string",
        "comment": "概念名称",
        "description": "概念名称"
      },
      {
        "field": "source",
        "type": "string",
        "comment": "来源",
        "description": "来源"
      },
      {
        "field": "reason",
        "type": "string",
        "comment": "概念原因",
        "description": "概念原因"
      }
    ]
  },
  "sample_data": {
    "description": "获取单只股票所属的概念信息",
    "data": [],
    "summary": {}
  }
}
```
# 单只股票所属板块-east

## api call
stock.info.get_plate_east()

## response
```json
{
  "metadata": {
    "description": "获取单只股票所属的板块信息：行业，板块（地区），概念",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "plate_code",
        "type": "string",
        "comment": "板块代码",
        "description": "板块代码"
      },
      {
        "field": "plate_name",
        "type": "string",
        "comment": "板块名称",
        "description": "板块名称"
      },
      {
        "field": "plate_type",
        "type": "string",
        "comment": "板块类型",
        "description": "板块类型"
      },
      {
        "field": "source",
        "type": "string",
        "comment": "来源",
        "description": "来源"
      }
    ]
  },
  "sample_data": {
    "description": "获取单只股票所属的板块信息：行业，板块（地区），概念",
    "data": [],
    "summary": {}
  }
}
```
# 单只股票所属概念-baidu

## api call
stock.info.get_concept_baidu()

## response
```json
{
  "metadata": {
    "description": "获取单只股票所属的概念信息",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "concept_code",
        "type": "string",
        "comment": "概念代码",
        "description": "概念代码"
      },
      {
        "field": "name",
        "type": "string",
        "comment": "概念名称",
        "description": "概念名称"
      },
      {
        "field": "source",
        "type": "string",
        "comment": "来源",
        "description": "来源"
      },
      {
        "field": "reason",
        "type": "string",
        "comment": "概念原因",
        "description": "概念原因"
      }
    ]
  },
  "sample_data": {
    "description": "获取单只股票所属的概念信息",
    "data": [],
    "summary": {}
  }
}
```
# 指数代码信息

## api call
stock.info.all_index_code()

## response
```json
{
  "metadata": {
    "description": "获取A股所有指数信息列表",
    "data_structure": [
      {
        "field": "name",
        "type": "string",
        "comment": "指数简称",
        "description": "指数简称"
      },
      {
        "field": "index_code",
        "type": "string",
        "comment": "指数代码",
        "description": "指数代码"
      },
      {
        "field": "concept_code",
        "type": "string",
        "comment": "概念代码",
        "description": "概念代码"
      },
      {
        "field": "source",
        "type": "string",
        "comment": "来源",
        "description": "来源"
      }
    ]
  },
  "sample_data": {
    "description": "获取A股所有指数信息列表",
    "data": [],
    "summary": {}
  }
}
```
# 指数成分信息

## api call
stock.info.index_constituent()

## response
```json
{
  "metadata": {
    "description": "获取指数对应的最新成分列表信息",
    "data_structure": [
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "index_code",
        "type": "string",
        "comment": "指数代码",
        "description": "指数代码"
      },
      {
        "field": "wait_time",
        "type": "int",
        "comment": "等待时间：毫秒",
        "description": "等待时间：毫秒"
      }
    ]
  },
  "sample_data": {
    "description": "获取指数对应的最新成分列表信息",
    "data": [],
    "summary": {}
  }
}
```
# 交易日历

## api call
stock.info.trade_calendar()

## response
```json
{
  "metadata": {
    "description": "获取对应年份的交易日历信息",
    "data_structure": [
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日",
        "description": "交易日"
      },
      {
        "field": "trade_status",
        "type": "int",
        "comment": "交易状态：0.非交易日；1.交易日",
        "description": "交易状态：0.非交易日；1.交易日"
      },
      {
        "field": "day_week",
        "type": "int",
        "comment": "一周第几天",
        "description": "一周第几天"
      }
    ]
  },
  "sample_data": {
    "description": "获取对应年份的交易日历信息",
    "data": [],
    "summary": {}
  }
}
```
# 分红-DIVIDEND

## api call
stock.market.get_dividend()

## response
```json
{
  "metadata": {
    "description": "获取对应股票的所有历史分红信息",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "report_date",
        "type": "date",
        "comment": "公告日",
        "description": "公告日"
      },
      {
        "field": "dividend_plan",
        "type": "string",
        "comment": "分红方案",
        "description": "分红方案"
      },
      {
        "field": "ex_dividend_date",
        "type": "date",
        "comment": "除权除息日",
        "description": "除权除息日"
      }
    ]
  },
  "sample_data": {
    "description": "获取对应股票的所有历史分红信息",
    "data": [],
    "summary": {}
  }
}
```
# K线行情

## api call
stock.market.get_market()

## response
```json
{
  "metadata": {
    "description": "获取当个股票的K线行情信息",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价(元)",
        "description": "开盘价(元)"
      },
      {
        "field": "close",
        "type": "decimal",
        "comment": "收盘价(元)",
        "description": "收盘价(元)"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价(元)",
        "description": "最高价(元)"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价(元)",
        "description": "最低价(元)"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额(元)",
        "description": "涨跌额(元)"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      },
      {
        "field": "turnover_ratio",
        "type": "decimal",
        "comment": "换手率(%)",
        "description": "换手率(%)"
      },
      {
        "field": "pre_close",
        "type": "decimal",
        "comment": "昨收(元)",
        "description": "昨收(元)"
      }
    ]
  },
  "sample_data": {
    "description": "获取当个股票的K线行情信息",
    "data": [],
    "summary": {}
  }
}
```
# 分时行情

## api call
stock.market.get_market_min()

## response
```json
{
  "metadata": {
    "description": "获取单个股票最新交易日的分时行情",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "价格(元)",
        "description": "价格(元)"
      },
      {
        "field": "avg_price",
        "type": "decimal",
        "comment": "平均价(元)",
        "description": "平均价(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额(元)",
        "description": "涨跌额(元)"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个股票最新交易日的分时行情",
    "data": [],
    "summary": {}
  }
}
```
# 实时行情

## api call
stock.market.list_market_current()

## response
```json
{
  "metadata": {
    "description": "获取多只股票的实时最新行情数据",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "简称",
        "description": "简称"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "当前价格(元)",
        "description": "当前价格(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额(元)",
        "description": "涨跌额(元)"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      }
    ]
  },
  "sample_data": {
    "description": "获取多只股票的实时最新行情数据",
    "data": [],
    "summary": {}
  }
}
```
# 五档行情

## api call
stock.market.get_market_five()

## response
```json
{
  "metadata": {
    "description": "获取单个股票的5档行情",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "简称",
        "description": "简称"
      },
      {
        "field": "s5",
        "type": "decimal",
        "comment": "卖5价(元)",
        "description": "卖5价(元)"
      },
      {
        "field": "sv5",
        "type": "decimal",
        "comment": "卖5量(股)",
        "description": "卖5量(股)"
      },
      {
        "field": "s4",
        "type": "decimal",
        "comment": "卖4价(元)",
        "description": "卖4价(元)"
      },
      {
        "field": "sv4",
        "type": "decimal",
        "comment": "卖4量(股)",
        "description": "卖4量(股)"
      },
      {
        "field": "s3",
        "type": "decimal",
        "comment": "卖3价(元)",
        "description": "卖3价(元)"
      },
      {
        "field": "sv3",
        "type": "decimal",
        "comment": "卖3量(股)",
        "description": "卖3量(股)"
      },
      {
        "field": "s2",
        "type": "decimal",
        "comment": "卖2价(元)",
        "description": "卖2价(元)"
      },
      {
        "field": "sv2",
        "type": "decimal",
        "comment": "卖2量(股)",
        "description": "卖2量(股)"
      },
      {
        "field": "s1",
        "type": "decimal",
        "comment": "卖1价(元)",
        "description": "卖1价(元)"
      },
      {
        "field": "sv1",
        "type": "decimal",
        "comment": "卖1量(股)",
        "description": "卖1量(股)"
      },
      {
        "field": "b1",
        "type": "decimal",
        "comment": "买1价(元)",
        "description": "买1价(元)"
      },
      {
        "field": "bv1",
        "type": "decimal",
        "comment": "买1量(股)",
        "description": "买1量(股)"
      },
      {
        "field": "b2",
        "type": "decimal",
        "comment": "买2价(元)",
        "description": "买2价(元)"
      },
      {
        "field": "bv2",
        "type": "decimal",
        "comment": "买2量(股)",
        "description": "买2量(股)"
      },
      {
        "field": "b3",
        "type": "decimal",
        "comment": "买3价(元)",
        "description": "买3价(元)"
      },
      {
        "field": "bv3",
        "type": "decimal",
        "comment": "买3量(股)",
        "description": "买3量(股)"
      },
      {
        "field": "b4",
        "type": "decimal",
        "comment": "买4价(元)",
        "description": "买4价(元)"
      },
      {
        "field": "bv4",
        "type": "decimal",
        "comment": "买4量(股)",
        "description": "买4量(股)"
      },
      {
        "field": "b5",
        "type": "decimal",
        "comment": "买5价(元)",
        "description": "买5价(元)"
      },
      {
        "field": "bv5",
        "type": "decimal",
        "comment": "买5量(股)",
        "description": "买5量(股)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个股票的5档行情",
    "data": [],
    "summary": {}
  }
}
```
# 分时成交

## api call
stock.market.get_market_bar()

## response
```json
{
  "metadata": {
    "description": "获取单个股票的成交分时，最新200条记录",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "datetime",
        "comment": "成交时间",
        "description": "成交时间"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "当前价格(元)",
        "description": "当前价格(元)"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "bs_type",
        "type": "string",
        "comment": "买卖类型",
        "description": "买卖类型"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个股票的成交分时，最新200条记录",
    "data": [],
    "summary": {}
  }
}
```
# 分时资金流向

## api call
stock.market.get_capital_flow_min()

## response
```json
{
  "metadata": {
    "description": "获取单个股票的资金流向分时",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "datetime",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "main_net_inflow",
        "type": "decimal",
        "comment": "主力资金净流入(元)",
        "description": "主力资金净流入(元)"
      },
      {
        "field": "max_net_inflow",
        "type": "decimal",
        "comment": "特大单净流入(元)",
        "description": "特大单净流入(元)"
      },
      {
        "field": "lg_net_inflow",
        "type": "decimal",
        "comment": "大单净流入(元)",
        "description": "大单净流入(元)"
      },
      {
        "field": "mid_net_inflow",
        "type": "decimal",
        "comment": "中单净流入(元)",
        "description": "中单净流入(元)"
      },
      {
        "field": "sm_net_inflow",
        "type": "decimal",
        "comment": "小单净流入(元)",
        "description": "小单净流入(元)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个股票的资金流向分时",
    "data": [],
    "summary": {}
  }
}
```
# 资金流向-日度

## api call
stock.market.get_capital_flow()

## response
```json
{
  "metadata": {
    "description": "获取单个股票的资金流向历史数据-日度",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "main_net_inflow",
        "type": "decimal",
        "comment": "主力资金净流入(元)",
        "description": "主力资金净流入(元)"
      },
      {
        "field": "max_net_inflow",
        "type": "decimal",
        "comment": "特大单净流入(元)",
        "description": "特大单净流入(元)"
      },
      {
        "field": "lg_net_inflow",
        "type": "decimal",
        "comment": "大单净流入(元)",
        "description": "大单净流入(元)"
      },
      {
        "field": "mid_net_inflow",
        "type": "decimal",
        "comment": "中单净流入(元)",
        "description": "中单净流入(元)"
      },
      {
        "field": "sm_net_inflow",
        "type": "decimal",
        "comment": "小单净流入(元)",
        "description": "小单净流入(元)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个股票的资金流向历史数据-日度",
    "data": [],
    "summary": {}
  }
}
```
# 概念行情-同花顺-THS - K线

## api call
stock.market.get_market_concept_ths()

## response
```json
{
  "metadata": {
    "description": "获取单个同花顺概念指数的K线行情",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价",
        "description": "开盘价"
      },
      {
        "field": "close",
        "type": "decimal",
        "comment": "收盘价",
        "description": "收盘价"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价",
        "description": "最低价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个同花顺概念指数的K线行情",
    "data": [],
    "summary": {}
  }
}
```
# 概念行情-同花顺-THS - 分时

## api call
stock.market.get_market_concept_min_ths()

## response
```json
{
  "metadata": {
    "description": "获取单个同花顺概念指数的分时行情",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "现价",
        "description": "现价"
      },
      {
        "field": "avg_price",
        "type": "decimal",
        "comment": "均价",
        "description": "均价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个同花顺概念指数的分时行情",
    "data": [],
    "summary": {}
  }
}
```
# 概念行情-同花顺-THS - 实时

## api call
stock.market.get_market_concept_current_ths()

## response
```json
{
  "metadata": {
    "description": "获取当个同花顺概念指数的实时行情，即最新的行情数据",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价",
        "description": "开盘价"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "现价",
        "description": "现价"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价",
        "description": "最低价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取当个同花顺概念指数的实时行情，即最新的行情数据",
    "data": [],
    "summary": {}
  }
}
```
# 概念行情-东方财富-EAST - K线

## api call
stock.market.get_market_concept_east()

## response
```json
{
  "metadata": {
    "description": "获取单个东方财富概念指数的K线行情",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价",
        "description": "开盘价"
      },
      {
        "field": "close",
        "type": "decimal",
        "comment": "收盘价",
        "description": "收盘价"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价",
        "description": "最低价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个东方财富概念指数的K线行情",
    "data": [],
    "summary": {}
  }
}
```
# 概念行情-东方财富-EAST - 分时

## api call
stock.market.get_market_concept_min_east()

## response
```json
{
  "metadata": {
    "description": "获取单个东方财富概念指数的分时行情",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "现价",
        "description": "现价"
      },
      {
        "field": "avg_price",
        "type": "decimal",
        "comment": "均价",
        "description": "均价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个东方财富概念指数的分时行情",
    "data": [],
    "summary": {}
  }
}
```
# 概念行情-东方财富-EAST - 实时

## api call
stock.market.get_market_concept_current_east()

## response
```json
{
  "metadata": {
    "description": "获取当个东方财富概念指数的实时行情，即最新的行情数据",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价",
        "description": "开盘价"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "现价",
        "description": "现价"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价",
        "description": "最低价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取当个东方财富概念指数的实时行情，即最新的行情数据",
    "data": [],
    "summary": {}
  }
}
```
# 近N日所有概念流向

## api call
stock.market.all_capital_flow_east()

## response
```json
{
  "metadata": {
    "description": "获取所有的概念近(1,5,10)日的资金流向",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "概念代码",
        "description": "概念代码"
      },
      {
        "field": "index_name",
        "type": "string",
        "comment": "概念名称",
        "description": "概念名称"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "概念最近N日涨跌幅(%)",
        "description": "概念最近N日涨跌幅(%)"
      },
      {
        "field": "main_net_inflow",
        "type": "decimal",
        "comment": "主力资金净流入(元)",
        "description": "主力资金净流入(元)"
      },
      {
        "field": "main_net_inflow_rate",
        "type": "decimal",
        "comment": "主力资金净流入占比(%)",
        "description": "主力资金净流入占比(%)"
      },
      {
        "field": "max_net_inflow",
        "type": "decimal",
        "comment": "特大单净流入(元)",
        "description": "特大单净流入(元)"
      },
      {
        "field": "max_net_inflow_rate",
        "type": "decimal",
        "comment": "特大单净流入占比(%)",
        "description": "特大单净流入占比(%)"
      },
      {
        "field": "lg_net_inflow",
        "type": "decimal",
        "comment": "大单净流入(元)",
        "description": "大单净流入(元)"
      },
      {
        "field": "lg_net_inflow_rate",
        "type": "decimal",
        "comment": "特大单净流入占比(%)",
        "description": "特大单净流入占比(%)"
      },
      {
        "field": "mid_net_inflow",
        "type": "decimal",
        "comment": "中单净流入(元)",
        "description": "中单净流入(元)"
      },
      {
        "field": "mid_net_inflow_rate",
        "type": "decimal",
        "comment": "中单净流入占比(%)",
        "description": "中单净流入占比(%)"
      },
      {
        "field": "sm_net_inflow",
        "type": "decimal",
        "comment": "小单净流入(元)",
        "description": "小单净流入(元)"
      },
      {
        "field": "sm_net_inflow_rate",
        "type": "decimal",
        "comment": "小单净流入占比(%)",
        "description": "小单净流入占比(%)"
      },
      {
        "field": "stock_code",
        "type": "string",
        "comment": "流入最大股代码",
        "description": "流入最大股代码"
      },
      {
        "field": "stock_name",
        "type": "string",
        "comment": "流入最大股名称",
        "description": "流入最大股名称"
      }
    ]
  },
  "sample_data": {
    "description": "获取所有的概念近(1,5,10)日的资金流向",
    "data": [],
    "summary": {}
  }
}
```
# 指数行情-INDEX MARKET - K线

## api call
stock.market.get_market_index()

## response
```json
{
  "metadata": {
    "description": "获取单个指数的K线行情",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价",
        "description": "开盘价"
      },
      {
        "field": "close",
        "type": "decimal",
        "comment": "收盘价",
        "description": "收盘价"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价",
        "description": "最低价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额(元)",
        "description": "涨跌额(元)"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个指数的K线行情",
    "data": [],
    "summary": {}
  }
}
```
# 指数行情-INDEX MARKET - 分时

## api call
stock.market.get_market_index_min()

## response
```json
{
  "metadata": {
    "description": "获取单个指数的分时行情",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "现价",
        "description": "现价"
      },
      {
        "field": "avg_price",
        "type": "decimal",
        "comment": "均价",
        "description": "均价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      }
    ]
  },
  "sample_data": {
    "description": "获取单个指数的分时行情",
    "data": [],
    "summary": {}
  }
}
```
# 指数行情-INDEX MARKET - 实时

## api call
stock.market.get_market_index_current()

## response
```json
{
  "metadata": {
    "description": "获取当个指数的实时行情，即最新的指数行情数据",
    "data_structure": [
      {
        "field": "index_code",
        "type": "string",
        "comment": "代码",
        "description": "代码"
      },
      {
        "field": "trade_time",
        "type": "time",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价",
        "description": "开盘价"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "现价",
        "description": "现价"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价",
        "description": "最低价"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(股)",
        "description": "成交量(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      }
    ]
  },
  "sample_data": {
    "description": "获取当个指数的实时行情，即最新的指数行情数据",
    "data": [],
    "summary": {}
  }
}
```
# 近一个月的股票解禁列表

## api call
sentiment.stock_lifting_last_month()

## response
```json
{
  "metadata": {
    "description": "获取最近一个月的股票解禁数据",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "lift_date",
        "type": "date",
        "comment": "解禁日期",
        "description": "解禁日期"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "解禁股数(股)",
        "description": "解禁股数(股)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "当前解禁市值(元)",
        "description": "当前解禁市值(元)"
      },
      {
        "field": "ratio",
        "type": "decimal",
        "comment": "占总股本比例(%)",
        "description": "占总股本比例(%)"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "当前价格(元)",
        "description": "当前价格(元)"
      }
    ]
  },
  "sample_data": {
    "description": "获取最近一个月的股票解禁数据",
    "data": [],
    "summary": {}
  }
}
```
# 融资融券余额数据

## api call
sentiment.securities_margin()

## response
```json
{
  "metadata": {
    "description": "查询全市场融资融券余额数据",
    "data_structure": [
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "rzye",
        "type": "decimal",
        "comment": "融资余额（元）",
        "description": "融资余额（元）"
      },
      {
        "field": "rqye",
        "type": "decimal",
        "comment": "融券余额（元）",
        "description": "融券余额（元）"
      },
      {
        "field": "rzrqye",
        "type": "decimal",
        "comment": "融资融券余额（元）",
        "description": "融资融券余额（元）"
      },
      {
        "field": "rzrqyecz",
        "type": "decimal",
        "comment": "融资融券余额差值（元）",
        "description": "融资融券余额差值（元）"
      }
    ]
  },
  "sample_data": {
    "description": "查询全市场融资融券余额数据",
    "data": [],
    "summary": {}
  }
}
```
# 北向实时流入行情

## api call
sentiment.north.north_flow_current()

## response
```json
{
  "metadata": {
    "description": "获取北向的实时流入行情",
    "data_structure": [
      {
        "field": "trade_time",
        "type": "datetime",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "net_hgt",
        "type": "decimal",
        "comment": "沪港通净买入金额（元）",
        "description": "沪港通净买入金额（元）"
      },
      {
        "field": "net_sgt",
        "type": "decimal",
        "comment": "深港通净买入金额（元）",
        "description": "深港通净买入金额（元）"
      },
      {
        "field": "net_tgt",
        "type": "decimal",
        "comment": "北向净买入金额（元）",
        "description": "北向净买入金额（元）"
      }
    ]
  },
  "sample_data": {
    "description": "获取北向的实时流入行情",
    "data": [],
    "summary": {}
  }
}
```
# 北向分时流入行情

## api call
sentiment.north.north_flow_min()

## response
```json
{
  "metadata": {
    "description": "获取北向的分时流入行情",
    "data_structure": [
      {
        "field": "trade_time",
        "type": "datetime",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "net_hgt",
        "type": "decimal",
        "comment": "沪港通净买入金额（元）",
        "description": "沪港通净买入金额（元）"
      },
      {
        "field": "net_sgt",
        "type": "decimal",
        "comment": "深港通净买入金额（元）",
        "description": "深港通净买入金额（元）"
      },
      {
        "field": "net_tgt",
        "type": "decimal",
        "comment": "北向净买入金额（元）",
        "description": "北向净买入金额（元）"
      }
    ]
  },
  "sample_data": {
    "description": "获取北向的分时流入行情",
    "data": [],
    "summary": {}
  }
}
```
# 北向历史流入行情

## api call
sentiment.north.north_flow()

## response
```json
{
  "metadata": {
    "description": "获取北向的历史流入行情",
    "data_structure": [
      {
        "field": "trade_date",
        "type": "date",
        "comment": "交易时间",
        "description": "交易时间"
      },
      {
        "field": "net_hgt",
        "type": "decimal",
        "comment": "沪港通净买入金额（元）",
        "description": "沪港通净买入金额（元）"
      },
      {
        "field": "buy_hgt",
        "type": "decimal",
        "comment": "沪港通买入金额（元）",
        "description": "沪港通买入金额（元）"
      },
      {
        "field": "sell_hgt",
        "type": "decimal",
        "comment": "沪港通卖出金额（元）",
        "description": "沪港通卖出金额（元）"
      },
      {
        "field": "net_sgt",
        "type": "decimal",
        "comment": "深港通净买入金额（元）",
        "description": "深港通净买入金额（元）"
      },
      {
        "field": "buy_sgt",
        "type": "decimal",
        "comment": "深港通买入金额（元）",
        "description": "深港通买入金额（元）"
      },
      {
        "field": "sell_sgt",
        "type": "decimal",
        "comment": "深港通卖出金额（元）",
        "description": "深港通卖出金额（元）"
      },
      {
        "field": "net_tgt",
        "type": "decimal",
        "comment": "北向净买入金额（元）",
        "description": "北向净买入金额（元）"
      },
      {
        "field": "buy_tgt",
        "type": "decimal",
        "comment": "北向买入金额（元）",
        "description": "北向买入金额（元）"
      },
      {
        "field": "sell_tgt",
        "type": "decimal",
        "comment": "北向卖出金额（元）",
        "description": "北向卖出金额（元）"
      }
    ]
  },
  "sample_data": {
    "description": "获取北向的历史流入行情",
    "data": [],
    "summary": {}
  }
}
```
# 东方财富人气榜TOP100

## api call
sentiment.hot.pop_rank_100_east()

## response
```json
{
  "metadata": {
    "description": "东方财富人气榜TOP100",
    "data_structure": [
      {
        "field": "rank",
        "type": "int",
        "comment": "排名",
        "description": "排名"
      },
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "最新价格",
        "description": "最新价格"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅（%）",
        "description": "涨跌幅（%）"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富人气榜TOP100",
    "data": [],
    "summary": {}
  }
}
```
# 同花顺热股TOP100

## api call
sentiment.hot.hot_rank_100_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺热股TOP100",
    "data_structure": [
      {
        "field": "rank",
        "type": "int",
        "comment": "排名",
        "description": "排名"
      },
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅（%）",
        "description": "涨跌幅（%）"
      },
      {
        "field": "hot_value",
        "type": "decimal",
        "comment": "热度值",
        "description": "热度值"
      },
      {
        "field": "pop_tag",
        "type": "string",
        "comment": "人气标签",
        "description": "人气标签"
      },
      {
        "field": "concept_tag",
        "type": "string",
        "comment": "概念板块",
        "description": "概念板块"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺热股TOP100",
    "data": [],
    "summary": {}
  }
}
```
# 同花热门概念板块TOP20

## api call
sentiment.hot.hot_concept_20_ths()

## response
```json
{
  "metadata": {
    "description": "同花热门概念板块TOP20",
    "data_structure": [
      {
        "field": "rank",
        "type": "int",
        "comment": "排名",
        "description": "排名"
      },
      {
        "field": "concept_code",
        "type": "string",
        "comment": "概念代码",
        "description": "概念代码"
      },
      {
        "field": "concept_name",
        "type": "string",
        "comment": "概念名称",
        "description": "概念名称"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅（%）",
        "description": "涨跌幅（%）"
      },
      {
        "field": "hot_value",
        "type": "decimal",
        "comment": "热度值",
        "description": "热度值"
      },
      {
        "field": "hot_tag",
        "type": "string",
        "comment": "热度标签",
        "description": "热度标签"
      }
    ]
  },
  "sample_data": {
    "description": "同花热门概念板块TOP20",
    "data": [],
    "summary": {}
  }
}
```
# 每日龙虎榜列表

## api call
sentiment.hot.list_a_list_daily()

## response
```json
{
  "metadata": {
    "description": "获取相应日期的所有龙虎榜列表",
    "data_structure": [
      {
        "field": "trade_date",
        "type": "int",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "close",
        "type": "decimal",
        "comment": "收盘价(元)",
        "description": "收盘价(元)"
      },
      {
        "field": "change_cpt",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      },
      {
        "field": "turnover_ratio",
        "type": "decimal",
        "comment": "换手率(%)",
        "description": "换手率(%)"
      },
      {
        "field": "a_net_amount",
        "type": "decimal",
        "comment": "龙虎榜净买入额(元)",
        "description": "龙虎榜净买入额(元)"
      },
      {
        "field": "a_buy_amount",
        "type": "decimal",
        "comment": "龙虎榜买入额(元)",
        "description": "龙虎榜买入额(元)"
      },
      {
        "field": "a_sell_amount",
        "type": "decimal",
        "comment": "龙虎榜卖出额(元)",
        "description": "龙虎榜卖出额(元)"
      },
      {
        "field": "a_amount",
        "type": "decimal",
        "comment": "龙虎榜成交额(元)",
        "description": "龙虎榜成交额(元)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "总成交额(元)",
        "description": "总成交额(元)"
      },
      {
        "field": "net_amount_rate",
        "type": "decimal",
        "comment": "龙虎榜净买额占总成交额比例(%)",
        "description": "龙虎榜净买额占总成交额比例(%)"
      },
      {
        "field": "a_amount_rate",
        "type": "decimal",
        "comment": "龙虎榜成交额占总成交额比例(%)",
        "description": "龙虎榜成交额占总成交额比例(%)"
      },
      {
        "field": "reason",
        "type": "string",
        "comment": "上榜原因",
        "description": "上榜原因"
      }
    ]
  },
  "sample_data": {
    "description": "获取相应日期的所有龙虎榜列表",
    "data": [],
    "summary": {}
  }
}
```
# 单只股票龙虎榜信息

## api call
sentiment.hot.get_a_list_info()

## response
```json
{
  "metadata": {
    "description": "获取单只股票龙虎榜信息",
    "data_structure": [
      {
        "field": "trade_date",
        "type": "int",
        "comment": "交易日期",
        "description": "交易日期"
      },
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "operate_code",
        "type": "string",
        "comment": "营业部代码",
        "description": "营业部代码"
      },
      {
        "field": "operate_name",
        "type": "string",
        "comment": "营业部名称",
        "description": "营业部名称"
      },
      {
        "field": "a_net_amount",
        "type": "decimal",
        "comment": "龙虎榜净买入额(元)",
        "description": "龙虎榜净买入额(元)"
      },
      {
        "field": "a_buy_amount",
        "type": "decimal",
        "comment": "龙虎榜买入额(元)",
        "description": "龙虎榜买入额(元)"
      },
      {
        "field": "a_sell_amount",
        "type": "decimal",
        "comment": "龙虎榜卖出额(元)",
        "description": "龙虎榜卖出额(元)"
      },
      {
        "field": "a_buy_amount_rate",
        "type": "decimal",
        "comment": "龙虎榜买入额占总成交额比例(%)",
        "description": "龙虎榜买入额占总成交额比例(%)"
      },
      {
        "field": "a_sell_amount_rate",
        "type": "decimal",
        "comment": "龙虎榜卖出额占总成交额比例(%)",
        "description": "龙虎榜卖出额占总成交额比例(%)"
      },
      {
        "field": "reason",
        "type": "string",
        "comment": "上榜原因",
        "description": "上榜原因"
      }
    ]
  },
  "sample_data": {
    "description": "获取单只股票龙虎榜信息",
    "data": [],
    "summary": {}
  }
}
```
# 单只股票扫雷避险信息

## api call
sentiment.mine.mine_clearance_tdx()

## response
```json
{
  "metadata": {
    "description": "获取单只股票扫雷避险信息",
    "data_structure": [
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "score",
        "type": "decimal",
        "comment": "评分",
        "description": "评分"
      },
      {
        "field": "f_type",
        "type": "string",
        "comment": "一级类别",
        "description": "一级类别"
      },
      {
        "field": "s_type",
        "type": "string",
        "comment": "二级类别",
        "description": "二级类别"
      },
      {
        "field": "t_type",
        "type": "string",
        "comment": "三级类别",
        "description": "三级类别"
      },
      {
        "field": "reason",
        "type": "string",
        "comment": "原因",
        "description": "原因"
      }
    ]
  },
  "sample_data": {
    "description": "获取单只股票扫雷避险信息",
    "data": [],
    "summary": {}
  }
}
```
# 可转换债券代码列表

## api call
bond.info.all_convert_code()

## response
```json
{
  "metadata": {
    "description": "获取所有可转换债券代码信息列表",
    "data_structure": [
      {
        "field": "bond_code",
        "type": "string",
        "comment": "债券代码",
        "description": "债券代码"
      },
      {
        "field": "bond_name",
        "type": "string",
        "comment": "债券名称",
        "description": "债券名称"
      },
      {
        "field": "stock_code",
        "type": "string",
        "comment": "股票代码",
        "description": "股票代码"
      },
      {
        "field": "short_name",
        "type": "string",
        "comment": "股票简称",
        "description": "股票简称"
      },
      {
        "field": "sub_date",
        "type": "date",
        "comment": "申购日期",
        "description": "申购日期"
      },
      {
        "field": "issue_amount",
        "type": "decimal",
        "comment": "发行金额(元)",
        "description": "发行金额(元)"
      },
      {
        "field": "listing_date",
        "type": "date",
        "comment": "上市日期",
        "description": "上市日期"
      },
      {
        "field": "expire_date",
        "type": "date",
        "comment": "到期日期",
        "description": "到期日期"
      },
      {
        "field": "convert_price",
        "type": "decimal",
        "comment": "转换价格(元)",
        "description": "转换价格(元)"
      }
    ]
  },
  "sample_data": {
    "description": "获取所有可转换债券代码信息列表",
    "data": [],
    "summary": {}
  }
}
```
# 可转换债券行情列表

## api call
bond.market.list_market_current()

## response
```json
{
  "metadata": {
    "description": "获取可转换债券的实时最新行情信息",
    "data_structure": [
      {
        "field": "bond_code",
        "type": "string",
        "comment": "债券代码",
        "description": "债券代码"
      },
      {
        "field": "bond_name",
        "type": "string",
        "comment": "债券名称",
        "description": "债券名称"
      },
      {
        "field": "price",
        "type": "decimal",
        "comment": "现价",
        "description": "现价"
      },
      {
        "field": "open",
        "type": "decimal",
        "comment": "开盘价",
        "description": "开盘价"
      },
      {
        "field": "high",
        "type": "decimal",
        "comment": "最高价",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "decimal",
        "comment": "最低价",
        "description": "最低价"
      },
      {
        "field": "pre_close",
        "type": "decimal",
        "comment": "前日收盘价",
        "description": "前日收盘价"
      },
      {
        "field": "change",
        "type": "decimal",
        "comment": "涨跌额",
        "description": "涨跌额"
      },
      {
        "field": "change_pct",
        "type": "decimal",
        "comment": "涨跌幅(%)",
        "description": "涨跌幅(%)"
      },
      {
        "field": "volume",
        "type": "decimal",
        "comment": "成交量(张)",
        "description": "成交量(张)"
      },
      {
        "field": "amount",
        "type": "decimal",
        "comment": "成交额(元)",
        "description": "成交额(元)"
      },
      {
        "field": "time",
        "type": "str",
        "comment": "时间",
        "description": "时间"
      }
    ]
  },
  "sample_data": {
    "description": "获取可转换债券的实时最新行情信息",
    "data": [],
    "summary": {}
  }
}
```

