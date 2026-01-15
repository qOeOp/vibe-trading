# Index

- [ak.stock_sse_summary()](#上海证券交易所) - 上海证券交易所-股票数据总貌
- [ak.stock_szse_summary(date="20200619")](#证券类别统计) - 深圳证券交易所-市场总貌-证券类别统计
- [ak.stock_szse_area_summary()](#地区交易排序) - 深圳证券交易所-市场总貌-地区交易排序
- [ak.stock_szse_sector_summary(symbol="当年", date="202501")](#股票行业成交) - 深圳证券交易所-统计资料-股票行业成交数据
- [ak.stock_sse_deal_daily(date="20250221")](#上海证券交易所-每日概况) - 上海证券交易所-数据-股票数据-成交概况-股票成交概况-每日股票情况
- [ak.stock_individual_info_em(symbol="000001")](#个股信息查询-东财) - 东方财富-个股-股票信息
- [ak.stock_individual_basic_info_xq(symbol="SH601127")](#个股信息查询-雪球) - 雪球财经-个股-公司概况-公司简介
- [ak.stock_bid_ask_em(symbol="000001")](#行情报价) - 东方财富-行情报价
- [ak.stock_zh_a_spot_em()](#沪深京-A-股) - 东方财富网-沪深京 A 股-实时行情数据
- [ak.stock_sh_a_spot_em()](#沪-A-股) - 东方财富网-沪 A 股-实时行情数据
- [ak.stock_sz_a_spot_em()](#深-A-股) - 东方财富网-深 A 股-实时行情数据
- [ak.stock_bj_a_spot_em()](#京-A-股) - 东方财富网-京 A 股-实时行情数据
- [ak.stock_new_a_spot_em()](#新股) - 东方财富网-新股-实时行情数据
- [ak.stock_cy_a_spot_em()](#创业板) - 东方财富网-创业板-实时行情
- [ak.stock_kc_a_spot_em()](#科创板) - 东方财富网-科创板-实时行情
- [ak.stock_zh_ab_comparison_em()](#AB-股比价) - 东方财富网-行情中心-沪深京个股-AB股比价-全部AB股比价
- [ak.stock_zh_a_spot()](#实时行情数据-新浪) - 新浪财经-沪深京 A 股数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔
- [ak.stock_individual_spot_xq(symbol="SH600000")](#实时行情数据-雪球) - 雪球-行情中心-个股
- [ak.stock_zh_a_hist()](#历史行情数据-东财) - 东方财富-沪深京 A 股日频率数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取
- [ak.stock_zh_a_daily()](#历史行情数据-新浪) - 新浪财经-沪深京 A 股的数据, 历史数据按日频率更新; 注意其中的 sh689009 为 CDR, 请 通过 ak.stock_zh_a_cdr_daily 接口获取
- [ak.stock_zh_a_hist_tx()](#历史行情数据-腾讯) - 腾讯证券-日频-股票历史数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取
- [ak.stock_zh_a_minute(symbol=&#39;sh600751&#39;, period=&#39;1&#39;, adjust="qfq")](#分时数据-新浪) - 新浪财经-沪深京 A 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权
- [ak.stock_zh_a_hist_min_em()](#分时数据-东财) - 东方财富网-行情首页-沪深京 A 股-每日分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置
- [ak.stock_intraday_em(symbol="000001")](#日内分时数据-东财) - 东方财富-分时数据
- [ak.stock_intraday_sina(symbol="sz000001", date="20240321")](#日内分时数据-新浪) - 新浪财经-日内分时数据
- [ak.stock_zh_a_hist_pre_min_em(symbol="000001", start_time="09:00:00", end_time="15:40:00")](#盘前数据) - 东方财富-股票行情-盘前数据
- [ak.stock_zh_a_tick_tx_js(symbol="sz000001")](#腾讯财经) - 每个交易日 16:00 提供当日数据; 如遇到数据缺失, 请使用 ak.stock_zh_a_tick_163() 接口(注意数据会有一定差异)
- [ak.stock_zh_growth_comparison_em(symbol="SZ000895")](#成长性比较) - 东方财富-行情中心-同行比较-成长性比较
- [ak.stock_zh_valuation_comparison_em(symbol="SZ000895")](#估值比较) - 东方财富-行情中心-同行比较-估值比较
- [ak.stock_zh_dupont_comparison_em(symbol="SZ000895")](#杜邦分析比较) - 东方财富-行情中心-同行比较-杜邦分析比较
- [ak.stock_zh_scale_comparison_em(symbol="SZ000895")](#公司规模) - 东方财富-行情中心-同行比较-公司规模
- [ak.stock_zh_a_cdr_daily(symbol=&#39;sh689009&#39;, start_date=&#39;20201103&#39;, end_date=&#39;20201116&#39;)](#历史行情数据) - 上海证券交易所-科创板-CDR
- [ak.stock_zh_b_spot_em()](#实时行情数据-东财) - 东方财富网-实时行情数据
- [ak.stock_zh_b_spot()](#实时行情数据-新浪) - B 股数据是从新浪财经获取的数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔
- [ak.stock_zh_b_daily()](#历史行情数据) - B 股数据是从新浪财经获取的数据, 历史数据按日频率更新
- [ak.stock_zh_b_minute(symbol=&#39;sh900901&#39;, period=&#39;1&#39;, adjust="qfq")](#分时数据) - 新浪财经 B 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权
- [ak.stock_zh_a_new()](#次新股) - 新浪财经-行情中心-沪深股市-次新股
- [ak.stock_gsrl_gsdt_em(date="20230808")](#公司动态) - 东方财富网-数据中心-股市日历-公司动态
- [ak.stock_zh_a_st_em()](#风险警示板) - 东方财富网-行情中心-沪深个股-风险警示板
- [ak.stock_zh_a_new_em()](#新股) - 东方财富网-行情中心-沪深个股-新股
- [ak.stock_xgsr_ths()](#新股上市首日) - 同花顺-数据中心-新股数据-新股上市首日
- [ak.stock_ipo_benefit_ths()](#IPO-受益股) - 同花顺-数据中心-新股数据-IPO受益股
- [ak.stock_zh_a_stop_em()](#两网及退市) - 东方财富网-行情中心-沪深个股-两网及退市
- [ak.stock_zh_kcb_spot()](#实时行情数据) - 新浪财经-科创板股票实时行情数据
- [ak.stock_zh_kcb_daily(symbol="sh688399", adjust="hfq")](#历史行情数据) - 新浪财经-科创板股票历史行情数据
- [ak.stock_zh_kcb_report_em(from_page=1, to_page=100)](#科创板公告) - 东方财富-科创板报告数据
- [ak.stock_zh_ah_spot_em()](#实时行情数据-东财) - 东方财富网-行情中心-沪深港通-AH股比价-实时行情, 延迟 15 分钟更新
- [ak.stock_zh_ah_spot()](#实时行情数据-腾讯) - A+H 股数据是从腾讯财经获取的数据, 延迟 15 分钟更新
- [ak.stock_zh_ah_daily(symbol="02318", start_year="2022", end_year="2024", adjust="")](#历史行情数据) - 腾讯财经-A+H 股数据
- [ak.stock_zh_ah_name()](#A+H股票字典) - A+H 股数据是从腾讯财经获取的数据, 历史数据按日频率更新
- [ak.stock_us_spot_em()](#实时行情数据-东财) - 东方财富网-美股-实时行情
- [ak.stock_us_spot()](#实时行情数据-新浪) - 新浪财经-美股; 获取的数据有 15 分钟延迟; 建议使用 ak.stock_us_spot_em() 来获取数据
- [ak.stock_us_hist(symbol=&#39;106.TTE&#39;, period="daily", start_date="20200101", end_date="20240214", adjust="qfq")](#历史行情数据-东财) - 东方财富网-行情-美股-每日行情
- [ak.stock_individual_basic_info_us_xq(symbol="SH601127")](#个股信息查询-雪球) - 雪球-个股-公司概况-公司简介
- [ak.stock_us_hist_min_em(symbol="105.ATER")](#分时数据-东财) - 东方财富网-行情首页-美股-每日分时行情
- [ak.stock_us_daily()](#历史行情数据-新浪) - 美股历史行情数据，设定 adjust=
- [ak.stock_us_pink_spot_em()](#粉单市场) - 美股粉单市场的实时行情数据
- [ak.stock_us_famous_spot_em(symbol=&#39;科技类&#39;)](#知名美股) - 美股-知名美股的实时行情数据
- [ak.stock_hk_spot_em()](#实时行情数据-东财) - 所有港股的实时行情数据; 该数据有 15 分钟延时
- [ak.stock_hk_main_board_spot_em()](#港股主板实时行情数据-东财) - 港股主板的实时行情数据; 该数据有 15 分钟延时
- [ak.stock_hk_spot()](#实时行情数据-新浪) - 获取所有港股的实时行情数据 15 分钟延时
- [ak.stock_individual_basic_info_hk_xq(symbol="02097")](#个股信息查询-雪球) - 雪球-个股-公司概况-公司简介
- [ak.stock_hk_hist_min_em()](#分时数据-东财) - 东方财富网-行情首页-港股-每日分时行情
- [ak.stock_hk_hist()](#历史行情数据-东财) - 港股-历史行情数据, 可以选择返回复权后数据, 更新频率为日频
- [ak.stock_hk_daily()](#历史行情数据-新浪) - 港股-历史行情数据, 可以选择返回复权后数据,更新频率为日频
- [ak.stock_hk_famous_spot_em()](#知名港股) - 东方财富网-行情中心-港股市场-知名港股实时行情数据
- [ak.stock_hk_security_profile_em(symbol="03900")](#证券资料) - 东方财富-港股-证券资料
- [ak.stock_hk_company_profile_em(symbol="03900")](#公司资料) - 东方财富-港股-公司资料
- [ak.stock_hk_financial_indicator_em(symbol="03900")](#财务指标) - 东方财富-港股-核心必读-最新指标
- [ak.stock_hk_dividend_payout_em(symbol="03900")](#分红派息) - 东方财富-港股-核心必读-分红派息
- [ak.stock_hk_growth_comparison_em(symbol="03900")](#成长性对比) - 东方财富-港股-行业对比-成长性对比
- [ak.stock_hk_valuation_comparison_em(symbol="03900")](#估值对比) - 东方财富-港股-行业对比-估值对比
- [ak.stock_hk_scale_comparison_em(symbol="03900")](#规模对比) - 东方财富-港股-行业对比-规模对比
- [ak.stock_jgdy_tj_em(date="20210128")](#机构调研-统计) - 东方财富网-数据中心-特色数据-机构调研-机构调研统计
- [ak.stock_jgdy_detail_em(date="20241211")](#机构调研-详细) - 东方财富网-数据中心-特色数据-机构调研-机构调研详细
- [ak.stock_zyjs_ths(symbol="000066")](#主营介绍-同花顺) - 同花顺-主营介绍
- [ak.stock_zygc_em(symbol="SH688041")](#主营构成-东财) - 东方财富网-个股-主营构成
- [ak.stock_gpzy_profile_em()](#股权质押市场概况) - 东方财富网-数据中心-特色数据-股权质押-股权质押市场概况
- [ak.stock_gpzy_pledge_ratio_em(date="20241220")](#上市公司质押比例) - 东方财富网-数据中心-特色数据-股权质押-上市公司质押比例
- [ak.stock_gpzy_pledge_ratio_detail_em()](#重要股东股权质押明细) - 东方财富网-数据中心-特色数据-股权质押-重要股东股权质押明细
- [ak.stock_gpzy_distribute_statistics_company_em()](#质押机构分布统计-证券公司) - 东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-证券公司
- [ak.stock_gpzy_distribute_statistics_bank_em()](#质押机构分布统计-银行) - 东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-银行
- [ak.stock_gpzy_industry_data_em()](#上市公司质押比例) - 东方财富网-数据中心-特色数据-股权质押-上市公司质押比例-行业数据
- [ak.stock_sy_profile_em()](#A股商誉市场概况) - 东方财富网-数据中心-特色数据-商誉-A股商誉市场概况
- [ak.stock_sy_yq_em(date="20221231")](#商誉减值预期明细) - 东方财富网-数据中心-特色数据-商誉-商誉减值预期明细
- [ak.stock_sy_jz_em(date="20230331")](#个股商誉减值明细) - 东方财富网-数据中心-特色数据-商誉-个股商誉减值明细
- [ak.stock_sy_em(date="20240630")](#个股商誉明细) - 东方财富网-数据中心-特色数据-商誉-个股商誉明细
- [ak.stock_sy_hy_em(date="20240930")](#行业商誉) - 东方财富网-数据中心-特色数据-商誉-行业商誉
- [ak.stock_account_statistics_em()](#股票账户统计月度) - 东方财富网-数据中心-特色数据-股票账户统计
- [ak.stock_analyst_rank_em(year=&#39;2024&#39;)](#分析师指数排行) - 东方财富网-数据中心-研究报告-东方财富分析师指数
- [ak.stock_analyst_detail_em()](#分析师详情) - 东方财富网-数据中心-研究报告-东方财富分析师指数-分析师详情
- [ak.stock_comment_em()](#千股千评) - 东方财富网-数据中心-特色数据-千股千评
- [ak.stock_comment_detail_zlkp_jgcyd_em(symbol="600000")](#机构参与度) - 东方财富网-数据中心-特色数据-千股千评-主力控盘-机构参与度
- [ak.stock_comment_detail_zhpj_lspf_em(symbol="600000")](#历史评分) - 东方财富网-数据中心-特色数据-千股千评-综合评价-历史评分
- [ak.stock_comment_detail_scrd_focus_em(symbol="600000")](#用户关注指数) - 东方财富网-数据中心-特色数据-千股千评-市场热度-用户关注指数
- [ak.stock_comment_detail_scrd_desire_em(symbol="600000")](#市场参与意愿) - 东方财富网-数据中心-特色数据-千股千评-市场热度-市场参与意愿
- [ak.stock_hsgt_fund_flow_summary_em()](#沪深港通资金流向) - 东方财富网-数据中心-资金流向-沪深港通资金流向
- [ak.stock_sgt_settlement_exchange_rate_szse()](#结算汇率-深港通) - 深港通-港股通业务信息-结算汇率
- [ak.stock_sgt_settlement_exchange_rate_sse()](#结算汇率-沪港通) - 沪港通-港股通信息披露-结算汇兑
- [ak.stock_sgt_reference_exchange_rate_szse()](#参考汇率-深港通) - 深港通-港股通业务信息-参考汇率
- [ak.stock_sgt_reference_exchange_rate_sse()](#参考汇率-沪港通) - 沪港通-港股通信息披露-参考汇率
- [ak.stock_hk_ggt_components_em()](#港股通成份股) - 东方财富网-行情中心-港股市场-港股通成份股
- [ak.stock_hsgt_fund_min_em()](#沪深港通分时数据) - 东方财富-数据中心-沪深港通-市场概括-分时数据
- [ak.stock_hsgt_board_rank_em(symbol="北向资金增持行业板块排行", indicator="今日")](#板块排行) - 东方财富网-数据中心-沪深港通持股-板块排行
- [ak.stock_hsgt_hold_stock_em(market="北向", indicator="今日排行")](#个股排行) - 东方财富网-数据中心-沪深港通持股-个股排行
- [ak.stock_hsgt_stock_statistics_em(symbol="北向持股", start_date="20211027", end_date="20211027")](#每日个股统计) - 东方财富网-数据中心-沪深港通-沪深港通持股-每日个股统计
- [ak.stock_hsgt_institution_statistics_em(market="北向持股", start_date="20201218", end_date="20201218")](#机构排行) - 东方财富网-数据中心-沪深港通-沪深港通持股-机构排行
- [ak.stock_hsgt_sh_hk_spot_em()](#沪深港通-港股通(沪&gt;港)实时行情) - 东方财富网-行情中心-沪深港通-港股通(沪&gt;港)-股票；按股票代码排序
- [ak.stock_hsgt_hist_em()](#沪深港通历史数据) - 东方财富网-数据中心-资金流向-沪深港通资金流向-沪深港通历史数据
- [ak.stock_hsgt_individual_em()](#沪深港通持股-个股) - 东方财富网-数据中心-沪深港通-沪深港通持股-具体股票
- [ak.stock_hsgt_individual_detail_em(](#沪深港通持股-个股详情) - 东方财富网-数据中心-沪深港通-沪深港通持股-具体股票-个股详情
- [ak.stock_tfp_em(date="20240426")](#停复牌信息) - 东方财富网-数据中心-特色数据-停复牌信息
- [ak.news_trade_notify_suspend_baidu(date="20241107")](#停复牌) - 百度股市通-交易提醒-停复牌
- [ak.news_trade_notify_dividend_baidu(date="20251126")](#分红派息) - 百度股市通-交易提醒-分红派息
- [ak.stock_news_em(symbol="603777")](#个股新闻) - 东方财富指定个股的新闻资讯数据
- [ak.stock_news_main_cx()](#财经内容精选) - 财新网-财新数据通-最新
- [ak.news_report_time_baidu(date="20241107")](#财报发行) - 百度股市通-财报发行
- [ak.stock_dxsyl_em()](#打新收益率) - 东方财富网-数据中心-新股申购-打新收益率
- [ak.stock_xgsglb_em()](#新股申购与中签) - 东方财富网-数据中心-新股数据-新股申购-新股申购与中签查询
- [ak.stock_yjbb_em(date="20220331")](#业绩报表) - 东方财富-数据中心-年报季报-业绩报表
- [ak.stock_yjkb_em(date="20200331")](#业绩快报) - 东方财富-数据中心-年报季报-业绩快报
- [ak.stock_yjyg_em(date="20190331")](#业绩预告) - 东方财富-数据中心-年报季报-业绩预告
- [ak.stock_yysj_em(symbol="沪深A股", date="20211231")](#预约披露时间-东方财富) - 东方财富-数据中心-年报季报-预约披露时间
- [ak.stock_report_disclosure(market="沪深京", period="2022年报")](#预约披露时间-巨潮资讯) - 巨潮资讯-数据-预约披露的数据
- [ak.stock_zh_a_disclosure_report_cninfo(symbol="000001", market="沪深京", category="公司治理", start_date="20230619", end_date="20231220")](#信息披露公告-巨潮资讯) - 巨潮资讯-首页-公告查询-信息披露公告-沪深京
- [ak.stock_zh_a_disclosure_relation_cninfo(symbol="000001", market="沪深京", start_date="20230619", end_date="20231220")](#信息披露调研-巨潮资讯) - 巨潮资讯-首页-公告查询-信息披露调研-沪深京
- [ak.stock_industry_category_cninfo(symbol="巨潮行业分类标准")](#行业分类数据-巨潮资讯) - 巨潮资讯-数据-行业分类数据
- [ak.stock_industry_change_cninfo(symbol="002594", start_date="20091227", end_date="20220708")](#上市公司行业归属的变动情况-巨潮资讯) - 巨潮资讯-数据-上市公司行业归属的变动情况
- [ak.stock_share_change_cninfo(symbol="002594", start_date="20091227", end_date="20241021")](#公司股本变动-巨潮资讯) - 巨潮资讯-数据-公司股本变动
- [ak.stock_allotment_cninfo(symbol="600030", start_date="19900101", end_date="20241022")](#配股实施方案-巨潮资讯) - 巨潮资讯-个股-配股实施方案
- [ak.stock_profile_cninfo(symbol="600030")](#公司概况-巨潮资讯) - 巨潮资讯-个股-公司概况
- [ak.stock_ipo_summary_cninfo(symbol="600030")](#上市相关-巨潮资讯) - 巨潮资讯-个股-上市相关
- [ak.stock_zcfz_em(date="20240331")](#资产负债表-沪深) - 东方财富-数据中心-年报季报-业绩快报-资产负债表
- [ak.stock_zcfz_bj_em(date="20240331")](#资产负债表-北交所) - 东方财富-数据中心-年报季报-业绩快报-资产负债表
- [ak.stock_lrb_em(date="20240331")](#利润表) - 东方财富-数据中心-年报季报-业绩快报-利润表
- [ak.stock_xjll_em(date="20240331")](#现金流量表) - 东方财富-数据中心-年报季报-业绩快报-现金流量表
- [ak.stock_ggcg_em(symbol="全部")](#股东增减持) - 东方财富网-数据中心-特色数据-高管持股
- [ak.stock_fhps_em(date="20231231")](#分红配送-东财) - 东方财富-数据中心-年报季报-分红配送
- [ak.stock_fhps_detail_em(symbol="300073")](#分红配送详情-东财) - 东方财富网-数据中心-分红送配-分红送配详情
- [ak.stock_fhps_detail_ths(symbol="603444")](#分红情况-同花顺) - 同花顺-分红情况
- [ak.stock_hk_fhpx_detail_ths(symbol="0700")](#分红配送详情-港股-同花顺) - 同花顺-港股-分红派息
- [ak.stock_fund_flow_individual()](#个股资金流) - 同花顺-数据中心-资金流向-个股资金流
- [ak.stock_fund_flow_concept()](#概念资金流) - 同花顺-数据中心-资金流向-概念资金流
- [ak.stock_fund_flow_industry()](#行业资金流) - 同花顺-数据中心-资金流向-行业资金流
- [ak.stock_fund_flow_big_deal()](#大单追踪) - 同花顺-数据中心-资金流向-大单追踪
- [ak.stock_individual_fund_flow(stock="600094", market="sh")](#个股资金流) - 东方财富网-数据中心-个股资金流向
- [ak.stock_individual_fund_flow_rank()](#个股资金流排名) - 东方财富网-数据中心-资金流向-排名
- [ak.stock_market_fund_flow()](#大盘资金流) - 东方财富网-数据中心-资金流向-大盘
- [ak.stock_sector_fund_flow_rank()](#板块资金流排名) - 东方财富网-数据中心-资金流向-板块资金流-排名
- [ak.stock_main_fund_flow(symbol="全部股票")](#主力净流入排名) - 东方财富网-数据中心-资金流向-主力净流入排名
- [ak.stock_sector_fund_flow_summary(symbol="电源设备", indicator="今日")](#行业个股资金流) - 东方财富网-数据中心-资金流向-行业资金流-xx行业个股资金流
- [ak.stock_sector_fund_flow_hist(symbol="汽车服务")](#行业历史资金流) - 东方财富网-数据中心-资金流向-行业资金流-行业历史资金流
- [ak.stock_concept_fund_flow_hist(symbol="数据要素")](#概念历史资金流) - 东方财富网-数据中心-资金流向-概念资金流-概念历史资金流
- [ak.stock_cyq_em(symbol="000001", adjust="")](#筹码分布) - 东方财富网-概念板-行情中心-日K-筹码分布
- [ak.stock_gddh_em()](#股东大会) - 东方财富网-数据中心-股东大会
- [ak.stock_zdhtmx_em(start_date="20220819", end_date="20230819")](#重大合同) - 东方财富网-数据中心-重大合同-重大合同明细
- [ak.stock_research_report_em(symbol="000001")](#个股研报) - 东方财富网-数据中心-研究报告-个股研报
- [ak.stock_notice_report(symbol=&#39;财务报告&#39;, date="20240613")](#沪深京-A-股公告) - 东方财富网-数据中心-公告大全-沪深京 A 股公告
- [ak.stock_financial_report_sina(stock="sh600600", symbol="资产负债表")](#财务报表-新浪) - 新浪财经-财务报表-三大报表
- [ak.stock_balance_sheet_by_report_em(symbol="SH600519")](#资产负债表-按报告期) - 东方财富-股票-财务分析-资产负债表-按报告期
- [ak.stock_balance_sheet_by_yearly_em(symbol="SH600519")](#资产负债表-按年度) - 东方财富-股票-财务分析-资产负债表-按年度
- [ak.stock_profit_sheet_by_report_em(symbol="SH600519")](#利润表-按报告期) - 东方财富-股票-财务分析-利润表-报告期
- [ak.stock_profit_sheet_by_yearly_em(symbol="SH600519")](#利润表-按年度) - 东方财富-股票-财务分析-利润表-按年度
- [ak.stock_profit_sheet_by_quarterly_em(symbol="SH600519")](#利润表-按单季度) - 东方财富-股票-财务分析-利润表-按单季度
- [ak.stock_cash_flow_sheet_by_report_em(symbol="SH600519")](#现金流量表-按报告期) - 东方财富-股票-财务分析-现金流量表-按报告期
- [ak.stock_cash_flow_sheet_by_yearly_em(symbol="SH600519")](#现金流量表-按年度) - 东方财富-股票-财务分析-现金流量表-按年度
- [ak.stock_cash_flow_sheet_by_quarterly_em(symbol="SH600519")](#现金流量表-按单季度) - 东方财富-股票-财务分析-现金流量表-按单季度
- [ak.stock_financial_debt_new_ths(symbol="000063", indicator="按年度")](#资产负债表) - 同花顺-财务指标-资产负债表；替换 stock_financial_debt_ths 接口
- [ak.stock_financial_benefit_new_ths(symbol="000063", indicator="按报告期")](#利润表) - 同花顺-财务指标-利润表；替换 stock_financial_benefit_ths 接口
- [ak.stock_financial_cash_new_ths(symbol="000063", indicator="按年度")](#现金流量表) - 同花顺-财务指标-现金流量表；替换 stock_financial_cash_ths 接口
- [ak.stock_balance_sheet_by_report_delisted_em(symbol="SZ000013")](#资产负债表-按报告期) - 东方财富-股票-财务分析-资产负债表-已退市股票-按报告期
- [ak.stock_profit_sheet_by_report_delisted_em(symbol="SZ000013")](#利润表-按报告期) - 东方财富-股票-财务分析-利润表-已退市股票-按报告期
- [ak.stock_cash_flow_sheet_by_report_delisted_em(symbol="SZ000013")](#现金流量表-按报告期) - 东方财富-股票-财务分析-现金流量表-已退市股票-按报告期
- [ak.stock_financial_hk_report_em()](#港股财务报表) - 东方财富-港股-财务报表-三大报表
- [ak.stock_financial_us_report_em()](#美股财务报表) - 东方财富-美股-财务分析-三大报表
- [ak.stock_financial_abstract(symbol="600004")](#关键指标-新浪) - 新浪财经-财务报表-关键指标
- [ak.stock_financial_abstract_new_ths(symbol="000063", indicator="按报告期")](#关键指标-同花顺) - 同花顺-财务指标-重要指标；替换 stock_financial_abstract_ths 接口
- [ak.stock_financial_analysis_indicator_em(symbol="301389.SZ", indicator="按报告期")](#主要指标-东方财富) - 东方财富-A股-财务分析-主要指标
- [ak.stock_financial_analysis_indicator(symbol="600004", start_year="2020")](#财务指标) - 新浪财经-财务分析-财务指标
- [ak.stock_financial_hk_analysis_indicator_em(symbol="00700", indicator="年度")](#港股财务指标) - 东方财富-港股-财务分析-主要指标
- [ak.stock_financial_us_analysis_indicator_em(symbol="TSLA", indicator="年报")](#美股财务指标) - 东方财富-美股-财务分析-主要指标
- [ak.stock_history_dividend()](#历史分红) - 新浪财经-发行与分配-历史分红
- [ak.stock_gdfx_free_top_10_em(symbol="sh688686", date="20240930")](#十大流通股东(个股)) - 东方财富网-个股-十大流通股东
- [ak.stock_gdfx_top_10_em(symbol="sh688686", date="20210630")](#十大股东(个股)) - 东方财富网-个股-十大股东
- [ak.stock_gdfx_free_holding_change_em(date="20210930")](#股东持股变动统计-十大流通股东) - 东方财富网-数据中心-股东分析-股东持股变动统计-十大流通股东
- [ak.stock_gdfx_holding_change_em(date="20210930")](#股东持股变动统计-十大股东) - 东方财富网-数据中心-股东分析-股东持股变动统计-十大股东
- [ak.stock_management_change_ths(symbol="688981")](#高管持股变动统计) - 同花顺-公司大事-高管持股变动
- [ak.stock_shareholder_change_ths(symbol="688981")](#股东持股变动统计) - 同花顺-公司大事-股东持股变动
- [ak.stock_gdfx_free_holding_analyse_em(date="20230930")](#股东持股分析-十大流通股东) - 东方财富网-数据中心-股东分析-股东持股分析-十大流通股东
- [ak.stock_gdfx_holding_analyse_em(date="20210930")](#股东持股分析-十大股东) - 东方财富网-数据中心-股东分析-股东持股分析-十大股东
- [ak.stock_gdfx_free_holding_detail_em(date="20210930")](#股东持股明细-十大流通股东) - 东方财富网-数据中心-股东分析-股东持股明细-十大流通股东
- [ak.stock_gdfx_holding_detail_em(date="20230331", indicator="个人", symbol="新进")](#股东持股明细-十大股东) - 东方财富网-数据中心-股东分析-股东持股明细-十大股东
- [ak.stock_gdfx_free_holding_statistics_em(date="20210930")](#股东持股统计-十大流通股东) - 东方财富网-数据中心-股东分析-股东持股统计-十大股东
- [ak.stock_gdfx_holding_statistics_em(date="20210930")](#股东持股统计-十大股东) - 东方财富网-数据中心-股东分析-股东持股统计-十大股东
- [ak.stock_gdfx_free_holding_teamwork_em(symbol="社保")](#股东协同-十大流通股东) - 东方财富网-数据中心-股东分析-股东协同-十大流通股东
- [ak.stock_gdfx_holding_teamwork_em(symbol="社保")](#股东协同-十大股东) - 东方财富网-数据中心-股东分析-股东协同-十大股东
- [ak.stock_zh_a_gdhs(symbol="20230930")](#股东户数) - 东方财富网-数据中心-特色数据-股东户数数据
- [ak.stock_zh_a_gdhs_detail_em(symbol="000001")](#股东户数详情) - 东方财富网-数据中心-特色数据-股东户数详情
- [ak.stock_history_dividend_detail()](#分红配股) - 新浪财经-发行与分配-分红配股
- [ak.stock_dividend_cninfo(symbol="600009")](#历史分红) - 巨潮资讯-个股-历史分红
- [ak.stock_ipo_info(stock="600004")](#新股发行) - 新浪财经-发行与分配-新股发行
- [ak.stock_ipo_review_em()](#新股上会信息) - 东方财富网-数据中心-新股申购-新股上会信息
- [ak.stock_ipo_tutor_em()](#IPO辅导信息) - 东方财富网-数据中心-新股申购-IPO辅导信息
- [ak.stock_add_stock(symbol="600004")](#股票增发) - 新浪财经-发行与分配-增发
- [ak.stock_restricted_release_queue_sina(symbol="600000")](#个股限售解禁-新浪) - 新浪财经-发行分配-限售解禁
- [ak.stock_restricted_release_summary_em(symbol="全部股票", start_date="20221108", end_date="20221209")](#限售股解禁) - 东方财富网-数据中心-特色数据-限售股解禁
- [ak.stock_restricted_release_detail_em(start_date="20221202", end_date="20221204")](#限售股解禁详情) - 东方财富网-数据中心-限售股解禁-解禁详情一览
- [ak.stock_restricted_release_queue_em(symbol="600000")](#解禁批次) - 东方财富网-数据中心-个股限售解禁-解禁批次
- [ak.stock_restricted_release_stockholder_em(symbol="600000", date="20200904")](#解禁股东) - 东方财富网-数据中心-个股限售解禁-解禁股东
- [ak.stock_circulate_stock_holder(symbol="600000")](#流通股东) - 新浪财经-股东股本-流通股东
- [ak.stock_sector_spot(indicator="新浪行业")](#板块行情) - 新浪行业-板块行情
- [ak.stock_sector_detail(sector="hangye_ZL01")](#板块详情) - 新浪行业-板块行情-成份详情, 由于新浪网页提供的统计数据有误, 部分行业数量大于统计数
- [ak.stock_info_a_code_name()](#股票列表-A股) - 沪深京 A 股股票代码和股票简称数据
- [ak.stock_info_sh_name_code(symbol="主板A股")](#股票列表-上证) - 上海证券交易所股票代码和简称数据
- [ak.stock_info_sz_name_code(symbol="A股列表")](#股票列表-深证) - 深证证券交易所股票代码和股票简称数据
- [ak.stock_info_bj_name_code()](#股票列表-北证) - 北京证券交易所股票代码和简称数据
- [ak.stock_info_sz_delist(symbol="终止上市公司")](#终止/暂停上市-深证) - 深证证券交易所终止/暂停上市股票
- [ak.stock_staq_net_stop()](#两网及退市) - 东方财富网-行情中心-沪深个股-两网及退市
- [ak.stock_info_sh_delist(symbol="全部")](#暂停/终止上市-上证) - 上海证券交易所暂停/终止上市股票
- [ak.stock_info_change_name(symbol="000503")](#股票更名) - 新浪财经-股票曾用名
- [ak.stock_info_sz_change_name(symbol="全称变更")](#名称变更-深证) - 深证证券交易所-市场数据-股票数据-名称变更
- [ak.stock_fund_stock_holder(symbol="601318")](#基金持股) - 新浪财经-股本股东-基金持股
- [ak.stock_main_stock_holder(stock="600004")](#主要股东) - 新浪财经-股本股东-主要股东
- [ak.stock_institute_hold(symbol="20201")](#机构持股一览表) - 新浪财经-机构持股-机构持股一览表
- [ak.stock_institute_hold_detail(stock="300003", quarter="20201")](#机构持股详情) - 新浪财经-机构持股-机构持股详情
- [ak.stock_institute_recommend(symbol="投资评级选股")](#机构推荐池) - 新浪财经-机构推荐池-具体指标的数据
- [ak.stock_institute_recommend_detail(symbol="002709")](#股票评级记录) - 新浪财经-机构推荐池-股票评级记录
- [ak.stock_rank_forecast_cninfo(date="20230817")](#投资评级) - 巨潮资讯-数据中心-评级预测-投资评级
- [ak.stock_industry_clf_hist_sw()](#申万个股行业分类变动历史) - 申万宏源研究-行业分类-全部行业分类
- [ak.stock_industry_pe_ratio_cninfo(symbol="国证行业分类", date="20240617")](#行业市盈率) - 巨潮资讯-数据中心-行业分析-行业市盈率
- [ak.stock_new_gh_cninfo()](#新股过会) - 巨潮资讯-数据中心-新股数据-新股过会
- [ak.stock_new_ipo_cninfo()](#新股发行) - 巨潮资讯-数据中心-新股数据-新股发行
- [ak.stock_share_hold_change_sse(symbol="600000")](#董监高及相关人员持股变动-上证) - 上海证券交易所-披露-监管信息公开-公司监管-董董监高人员股份变动
- [ak.stock_share_hold_change_szse(symbol="001308")](#董监高及相关人员持股变动-深证) - 深圳证券交易所-信息披露-监管信息公开-董监高人员股份变动
- [ak.stock_share_hold_change_bse(symbol="430489")](#董监高及相关人员持股变动-北证) - 北京证券交易所-信息披露-监管信息-董监高及相关人员持股变动
- [ak.stock_hold_num_cninfo(date="20210630")](#股东人数及持股集中度) - 巨潮资讯-数据中心-专题统计-股东股本-股东人数及持股集中度
- [ak.stock_hold_change_cninfo(symbol="全部")](#股本变动) - 巨潮资讯-数据中心-专题统计-股东股本-股本变动
- [ak.stock_hold_control_cninfo(symbol="全部")](#实际控制人持股变动) - 巨潮资讯-数据中心-专题统计-股东股本-实际控制人持股变动
- [ak.stock_hold_management_detail_cninfo(symbol="增持")](#高管持股变动明细) - 巨潮资讯-数据中心-专题统计-股东股本-高管持股变动明细
- [ak.stock_hold_management_detail_em()](#董监高及相关人员持股变动明细) - 东方财富网-数据中心-特色数据-高管持股-董监高及相关人员持股变动明细
- [ak.stock_hold_management_person_em(symbol="001308", name="孙建华")](#人员增减持股变动明细) - 东方财富网-数据中心-特色数据-高管持股-人员增减持股变动明细
- [ak.stock_cg_guarantee_cninfo(symbol="全部", start_date="20180630", end_date="20210927")](#对外担保) - 巨潮资讯-数据中心-专题统计-公司治理-对外担保
- [ak.stock_cg_lawsuit_cninfo(symbol="全部", start_date="20180630", end_date="20210927")](#公司诉讼) - 巨潮资讯-数据中心-专题统计-公司治理-公司诉讼
- [ak.stock_cg_equity_mortgage_cninfo(date="20210930")](#股权质押) - 巨潮资讯-数据中心-专题统计-公司治理-股权质押
- [ak.stock_price_js(symbol="us")](#美港目标价) - 美港电讯-美港目标价数据
- [ak.stock_qsjy_em(date="20200430")](#券商业绩月报) - 东方财富网-数据中心-特色数据-券商业绩月报
- [ak.stock_a_gxl_lg(symbol="上证A股")](#A-股股息率) - 乐咕乐股-股息率-A 股股息率
- [ak.stock_hk_gxl_lg()](#恒生指数股息率) - 乐咕乐股-股息率-恒生指数股息率
- [ak.stock_a_congestion_lg()](#大盘拥挤度) - 乐咕乐股-大盘拥挤度
- [ak.stock_ebs_lg()](#股债利差) - 乐咕乐股-股债利差
- [ak.stock_buffett_index_lg()](#巴菲特指标) - 乐估乐股-底部研究-巴菲特指标
- [ak.stock_a_ttm_lyr()](#A-股等权重与中位数市盈率) - 乐咕乐股-A 股等权重市盈率与中位数市盈率
- [ak.stock_a_all_pb()](#A-股等权重与中位数市净率) - 乐咕乐股-A 股等权重与中位数市净率
- [ak.stock_market_pe_lg()](#主板市盈率) - 乐咕乐股-主板市盈率
- [ak.stock_index_pe_lg(symbol="上证50")](#指数市盈率) - 乐咕乐股-指数市盈率
- [ak.stock_market_pb_lg(symbol="上证")](#主板市净率) - 乐咕乐股-主板市净率
- [ak.stock_index_pb_lg(symbol="上证50")](#指数市净率) - 乐咕乐股-指数市净率
- [ak.stock_zh_valuation_baidu(symbol="002044", indicator="总市值", period="近一年")](#A-股估值指标) - 百度股市通-A 股-财务报表-估值数据
- [ak.stock_value_em(symbol="300766")](#个股估值) - 东方财富网-数据中心-估值分析-每日互动-每日互动-估值分析
- [ak.stock_zh_vote_baidu(symbol="000001", indicator="指数")](#涨跌投票) - 百度股市通- A 股或指数-股评-投票
- [ak.stock_hk_indicator_eniu()](#港股个股指标) - 亿牛网-港股个股指标: 市盈率, 市净率, 股息率, ROE, 市值
- [ak.stock_hk_valuation_baidu(symbol="06969", indicator="总市值", period="近一年")](#港股估值指标) - 百度股市通-港股-财务报表-估值数据
- [ak.stock_us_valuation_baidu(symbol="NVDA", indicator="总市值", period="近一年")](#美股估值指标) - 百度股市通-美股-财务报表-估值数据
- [ak.stock_a_high_low_statistics(symbol="all")](#创新高和新低的股票数量) - 不同市场的创新高和新低的股票数量
- [ak.stock_a_below_net_asset_statistics()](#破净股统计) - 乐咕乐股-A 股破净股统计数据
- [ak.stock_report_fund_hold(symbol="基金持仓", date="20200630")](#基金持股) - 东方财富网-数据中心-主力数据-基金持仓
- [ak.stock_report_fund_hold_detail(symbol="005827", date="20201231")](#基金持股明细) - 东方财富网-数据中心-主力数据-基金持仓-基金持仓明细表
- [ak.stock_lhb_detail_em(start_date="20230403", end_date="20230417")](#龙虎榜详情) - 东方财富网-数据中心-龙虎榜单-龙虎榜详情
- [ak.stock_lhb_stock_statistic_em(symbol="近一月")](#个股上榜统计) - 东方财富网-数据中心-龙虎榜单-个股上榜统计
- [ak.stock_lhb_jgmmtj_em(start_date="20240417", end_date="20240430")](#机构买卖每日统计) - 东方财富网-数据中心-龙虎榜单-机构买卖每日统计
- [ak.stock_lhb_jgstatistic_em(symbol="近一月")](#机构席位追踪) - 东方财富网-数据中心-龙虎榜单-机构席位追踪
- [ak.stock_lhb_hyyyb_em(start_date="20220324", end_date="20220324")](#每日活跃营业部) - 东方财富网-数据中心-龙虎榜单-每日活跃营业部
- [ak.stock_lhb_yyb_detail_em(symbol="10188715")](#营业部详情数据-东财) - 东方财富网-数据中心-龙虎榜单-营业部历史交易明细-营业部交易明细
- [ak.stock_lhb_yybph_em(symbol="近一月")](#营业部排行) - 东方财富网-数据中心-龙虎榜单-营业部排行
- [ak.stock_lhb_traderstatistic_em(symbol="近一月")](#营业部统计) - 东方财富网-数据中心-龙虎榜单-营业部统计
- [ak.stock_lhb_stock_detail_em(symbol="600077", date="20070416", flag="买入")](#个股龙虎榜详情) - 东方财富网-数据中心-龙虎榜单-个股龙虎榜详情
- [ak.stock_lh_yyb_most()](#龙虎榜-营业部排行-上榜次数最多) - 龙虎榜-营业部排行-上榜次数最多
- [ak.stock_lh_yyb_capital()](#龙虎榜-营业部排行-资金实力最强) - 龙虎榜-营业部排行-资金实力最强
- [ak.stock_lh_yyb_control()](#龙虎榜-营业部排行-抱团操作实力) - 龙虎榜-营业部排行-抱团操作实力
- [ak.stock_lhb_detail_daily_sina(date="20240222")](#龙虎榜-每日详情) - 新浪财经-龙虎榜-每日详情
- [ak.stock_lhb_ggtj_sina(symbol="5")](#龙虎榜-个股上榜统计) - 新浪财经-龙虎榜-个股上榜统计
- [ak.stock_lhb_yytj_sina(symbol="5")](#龙虎榜-营业上榜统计) - 新浪财经-龙虎榜-营业上榜统计
- [ak.stock_lhb_jgzz_sina(symbol="5")](#龙虎榜-机构席位追踪) - 新浪财经-龙虎榜-机构席位追踪
- [ak.stock_lhb_jgmx_sina()](#龙虎榜-机构席位成交明细) - 新浪财经-龙虎榜-机构席位成交明细
- [ak.stock_ipo_declare_em()](#首发申报信息) - 东方财富网-数据中心-新股申购-首发申报信息-首发申报企业信息
- [ak.stock_register_all_em()](#全部) - 东方财富网-数据中心-新股数据-IPO审核信息-全部
- [ak.stock_register_kcb()](#科创板) - 东方财富网-数据中心-新股数据-IPO审核信息-科创板
- [ak.stock_register_cyb()](#创业板) - 东方财富网-数据中心-新股数据-IPO审核信息-创业板
- [ak.stock_register_sh()](#上海主板) - 东方财富网-数据中心-新股数据-IPO审核信息-上海主板
- [ak.stock_register_sz()](#深圳主板) - 东方财富网-数据中心-新股数据-IPO审核信息-深圳主板
- [ak.stock_register_bj()](#北交所) - 东方财富网-数据中心-新股数据-IPO审核信息-北交所
- [ak.stock_register_db()](#达标企业) - 东方财富网-数据中心-新股数据-注册制审核-达标企业
- [ak.stock_qbzf_em()](#增发) - 东方财富网-数据中心-新股数据-增发-全部增发
- [ak.stock_pg_em()](#配股) - 东方财富网-数据中心-新股数据-配股
- [ak.stock_repurchase_em()](#股票回购数据) - 东方财富网-数据中心-股票回购-股票回购数据
- [ak.stock_zh_a_gbjg_em(symbol="603392.SH")](#股本结构) - 东方财富-A股数据-股本结构
- [ak.stock_dzjy_sctj()](#市场统计) - 东方财富网-数据中心-大宗交易-市场统计
- [ak.stock_dzjy_mrmx()](#每日明细) - 东方财富网-数据中心-大宗交易-每日明细
- [ak.stock_dzjy_mrtj(start_date=&#39;20220105&#39;, end_date=&#39;20220105&#39;)](#每日统计) - 东方财富网-数据中心-大宗交易-每日统计
- [ak.stock_dzjy_hygtj(symbol=&#39;近三月&#39;)](#活跃-A-股统计) - 东方财富网-数据中心-大宗交易-活跃 A 股统计
- [ak.stock_dzjy_hyyybtj(symbol=&#39;近3日&#39;)](#活跃营业部统计) - 东方财富网-数据中心-大宗交易-活跃营业部统计
- [ak.stock_dzjy_yybph(symbol=&#39;近三月&#39;)](#营业部排行) - 东方财富网-数据中心-大宗交易-营业部排行
- [ak.stock_yzxdr_em(date="20210331")](#一致行动人) - 东方财富网-数据中心-特色数据-一致行动人
- [ak.stock_margin_ratio_pa(symbol="沪市", date="20260113")](#标的证券名单及保证金比例查询) - 融资融券-标的证券名单及保证金比例查询
- [ak.stock_margin_account_info()](#两融账户信息) - 东方财富网-数据中心-融资融券-融资融券账户统计-两融账户信息
- [ak.stock_margin_sse(start_date="20010106", end_date="20210208")](#融资融券汇总) - 上海证券交易所-融资融券数据-融资融券汇总数据
- [ak.stock_margin_detail_sse(date="20230922")](#融资融券明细) - 上海证券交易所-融资融券数据-融资融券明细数据
- [ak.stock_margin_szse(date="20240411")](#融资融券汇总) - 深圳证券交易所-融资融券数据-融资融券汇总数据
- [ak.stock_margin_detail_szse(date="20230925")](#融资融券明细) - 深证证券交易所-融资融券数据-融资融券交易明细数据
- [ak.stock_margin_underlying_info_szse(date="20210727")](#标的证券信息) - 深圳证券交易所-融资融券数据-标的证券信息
- [ak.stock_profit_forecast_em()](#盈利预测-东方财富) - 东方财富网-数据中心-研究报告-盈利预测; 该数据源网页端返回数据有异常, 本接口已修复该异常
- [ak.stock_hk_profit_forecast_et()](#港股盈利预测-经济通) - 经济通-公司资料-盈利预测
- [ak.stock_profit_forecast_ths()](#盈利预测-同花顺) - 同花顺-盈利预测
- [ak.stock_board_concept_index_ths(symbol="阿里巴巴概念", start_date="20200101", end_date="20250321")](#同花顺-概念板块指数) - 同花顺-板块-概念板块-指数日频率数据
- [ak.stock_board_concept_info_ths(symbol="阿里巴巴概念")](#同花顺-概念板块简介) - 同花顺-板块-概念板块-板块简介
- [ak.stock_board_concept_name_em()](#东方财富-概念板块) - 东方财富网-行情中心-沪深京板块-概念板块
- [ak.stock_board_concept_spot_em(symbol="可燃冰")](#东方财富-概念板块-实时行情) - 东方财富网-行情中心-沪深京板块-概念板块-实时行情
- [ak.stock_board_concept_cons_em(symbol="融资融券")](#东方财富-成份股) - 东方财富-沪深板块-概念板块-板块成份
- [ak.stock_board_concept_hist_em(symbol="绿色电力", period="daily", start_date="20220101", end_date="20250227", adjust="")](#东方财富-指数) - 东方财富-沪深板块-概念板块-历史行情数据
- [ak.stock_board_concept_hist_min_em()](#东方财富-指数-分时) - 东方财富-沪深板块-概念板块-分时历史行情数据
- [ak.stock_concept_cons_futu(symbol="特朗普概念股")](#富途牛牛-美股概念-成分股) - 富途牛牛-主题投资-概念板块-成分股
- [ak.stock_board_industry_summary_ths()](#同花顺-同花顺行业一览表) - 同花顺-同花顺行业一览表
- [ak.stock_board_industry_index_ths(symbol="元件", start_date="20240101", end_date="20240718")](#同花顺-指数) - 同花顺-板块-行业板块-指数日频率数据
- [ak.stock_board_industry_name_em()](#东方财富-行业板块) - 东方财富-沪深京板块-行业板块
- [ak.stock_board_industry_spot_em(symbol="小金属")](#东方财富-行业板块-实时行情) - 东方财富网-沪深板块-行业板块-实时行情
- [ak.stock_board_industry_cons_em(symbol="小金属")](#东方财富-成份股) - 东方财富-沪深板块-行业板块-板块成份
- [ak.stock_board_industry_hist_em(symbol="小金属", start_date="20211201", end_date="20240222", period="日k", adjust="")](#东方财富-指数-日频) - 东方财富-沪深板块-行业板块-历史行情数据
- [ak.stock_board_industry_hist_min_em()](#东方财富-指数-分时) - 东方财富-沪深板块-行业板块-分时历史行情数据
- [ak.stock_hot_follow_xq(symbol="最热门")](#关注排行榜) - 雪球-沪深股市-热度排行榜-关注排行榜
- [ak.stock_hot_tweet_xq(symbol="最热门")](#讨论排行榜) - 雪球-沪深股市-热度排行榜-讨论排行榜
- [ak.stock_hot_deal_xq(symbol="最热门")](#交易排行榜) - 雪球-沪深股市-热度排行榜-交易排行榜
- [ak.stock_hot_rank_em()](#人气榜-A股) - 东方财富网站-股票热度
- [ak.stock_hot_up_em()](#飙升榜-A股) - 东方财富-个股人气榜-飙升榜
- [ak.stock_hk_hot_rank_em()](#人气榜-港股) - 东方财富-个股人气榜-人气榜-港股市场
- [ak.stock_hot_rank_detail_em(symbol="SZ000665")](#A股) - 东方财富网-股票热度-历史趋势及粉丝特征
- [ak.stock_hk_hot_rank_detail_em(symbol="00700")](#港股) - 东方财富网-股票热度-历史趋势
- [ak.stock_irm_cninfo(symbol="002594")](#互动易-提问) - 互动易-提问
- [ak.stock_irm_ans_cninfo(symbol="1495108801386602496")](#互动易-回答) - 互动易-回答
- [ak.stock_sns_sseinfo(symbol="603119")](#上证e互动) - 上证e互动-提问与回答
- [ak.stock_hot_rank_detail_realtime_em(symbol="SZ000665")](#A股) - 东方财富网-个股人气榜-实时变动
- [ak.stock_hk_hot_rank_detail_realtime_em(symbol="00700")](#港股) - 东方财富网-个股人气榜-实时变动
- [ak.stock_hot_keyword_em(symbol="SZ000665")](#热门关键词) - 东方财富-个股人气榜-热门关键词
- [ak.stock_inner_trade_xq()](#内部交易) - 雪球-行情中心-沪深股市-内部交易
- [ak.stock_hot_rank_latest_em(symbol="SZ000665")](#A股) - 东方财富-个股人气榜-最新排名
- [ak.stock_hk_hot_rank_latest_em(symbol="00700")](#港股) - 东方财富-个股人气榜-最新排名
- [ak.stock_hot_search_baidu(symbol="A股", date="20250616", time="今日")](#热搜股票) - 百度股市通-热搜股票
- [ak.stock_hot_rank_relate_em(symbol="SZ000665")](#相关股票) - 东方财富-个股人气榜-相关股票
- [ak.stock_changes_em(symbol="大笔买入")](#盘口异动) - 东方财富-行情中心-盘口异动数据
- [ak.stock_board_change_em()](#板块异动详情) - 东方财富-行情中心-当日板块异动详情
- [ak.stock_zt_pool_em(date=&#39;20241008&#39;)](#涨停股池) - 东方财富网-行情中心-涨停板行情-涨停股池
- [ak.stock_zt_pool_previous_em(date=&#39;20240415&#39;)](#昨日涨停股池) - 东方财富网-行情中心-涨停板行情-昨日涨停股池
- [ak.stock_zt_pool_strong_em(date=&#39;20241231&#39;)](#强势股池) - 东方财富网-行情中心-涨停板行情-强势股池
- [ak.stock_zt_pool_sub_new_em(date=&#39;20241231&#39;)](#次新股池) - 东方财富网-行情中心-涨停板行情-次新股池
- [ak.stock_zt_pool_zbgc_em(date=&#39;20241011&#39;)](#炸板股池) - 东方财富网-行情中心-涨停板行情-炸板股池
- [ak.stock_zt_pool_dtgc_em(date=&#39;20241011&#39;)](#跌停股池) - 东方财富网-行情中心-涨停板行情-跌停股池
- [ak.stock_market_activity_legu()](#赚钱效应分析) - 乐咕乐股网-赚钱效应分析数据
- [ak.stock_info_global_sina()](#全球财经快讯-新浪财经) - 全球财经快讯-新浪财经
- [ak.stock_info_global_futu()](#快讯-富途牛牛) - 快讯-富途牛牛
- [ak.stock_info_global_ths()](#全球财经直播-同花顺财经) - 全球财经直播-同花顺财经
- [ak.stock_rank_lxsz_ths()](#连续上涨) - 连续上涨
- [ak.stock_rank_cxfl_ths()](#持续放量) - 同花顺-数据中心-技术选股-持续放量
- [ak.stock_rank_cxsl_ths()](#持续缩量) - 同花顺-数据中心-技术选股-持续缩量
- [ak.stock_rank_xstp_ths(symbol="500日均线")](#向上突破) - 同花顺-数据中心-技术选股-向上突破
- [ak.stock_rank_xxtp_ths(symbol="500日均线")](#向下突破) - 同花顺-数据中心-技术选股-向下突破
- [ak.stock_rank_ljqs_ths()](#量价齐升) - 同花顺-数据中心-技术选股-量价齐升
- [ak.stock_rank_ljqd_ths()](#量价齐跌) - 同花顺-数据中心-技术选股-量价齐跌
- [ak.stock_rank_xzjp_ths()](#险资举牌) - 同花顺-数据中心-技术选股-险资举牌
- [ak.stock_esg_rate_sina()](#ESG-评级数据) - 新浪财经-ESG评级中心-ESG评级-ESG评级数据
- [ak.stock_esg_msci_sina()](#MSCI) - 新浪财经-ESG评级中心-ESG评级-MSCI
- [ak.stock_esg_rft_sina()](#路孚特) - 新浪财经-ESG评级中心-ESG评级-路孚特
- [ak.stock_esg_zd_sina()](#秩鼎) - 新浪财经-ESG评级中心-ESG评级-秩鼎
- [ak.stock_esg_hz_sina()](#华证指数) - 新浪财经-ESG评级中心-ESG评级-华证指数
- [ak.fund_name_em()](#基金基本信息) - 东方财富网-天天基金网-基金数据-所有基金的基本信息数据
- [ak.fund_individual_basic_info_xq(symbol="000001")](#基金基本信息-雪球) - 雪球基金-基金详情
- [ak.fund_info_index_em(symbol="沪深指数", indicator="增强指数型")](#基金基本信息-指数型) - 东方财富网-天天基金网-基金数据-基金基本信息-指数型
- [ak.fund_purchase_em()](#基金申购状态) - 东方财富网站-天天基金网-基金数据-基金申购状态
- [ak.fund_etf_spot_em()](#ETF基金实时行情-东财) - 东方财富-ETF 实时行情
- [ak.fund_etf_spot_ths(date="20240620")](#ETF基金实时行情-同花顺) - 同花顺理财-基金数据-每日净值-ETF-实时行情
- [ak.fund_lof_spot_em()](#LOF基金实时行情-东财) - 东方财富-LOF 实时行情
- [ak.fund_etf_category_sina(symbol="封闭式基金")](#基金实时行情-新浪) - 新浪财经-基金列表及行情数据
- [ak.fund_etf_hist_min_em()](#ETF基金分时行情-东财) - 东方财富-ETF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置
- [ak.fund_lof_hist_min_em()](#LOF基金分时行情-东财) - 东方财富-LOF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置
- [ak.fund_etf_hist_em()](#ETF基金历史行情-东财) - 东方财富-ETF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取
- [ak.fund_lof_hist_em()](#LOF基金历史行情-东财) - 东方财富-LOF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取
- [ak.fund_etf_hist_sina(symbol="sh510050")](#基金历史行情-新浪) - 新浪财经-基金行情的日频率行情数据
- [ak.fund_open_fund_daily_em()](#开放式基金-实时数据) - 东方财富网-天天基金网-基金数据, 此接口在每个交易日 16:00-23:00 更新当日的最新开放式基金净值数据
- [ak.fund_open_fund_info_em()](#开放式基金-历史数据) - 东方财富网-天天基金网-基金数据-具体基金信息
- [ak.fund_money_fund_daily_em()](#货币型基金-实时数据) - 东方财富网-天天基金网-基金数据-货币型基金收益, 此接口数据每个交易日 16:00～23:00
- [ak.fund_money_fund_info_em(symbol="000009")](#货币型基金-历史数据) - 东方财富网-天天基金网-基金数据-货币型基金-历史净值
- [ak.fund_financial_fund_daily_em()](#理财型基金-实时数据) - 东方财富网-天天基金网-基金数据-理财型基金-实时数据, 此接口数据每个交易日 16:00～23:00 更新
- [ak.fund_financial_fund_info_em(symbol="000134")](#理财型基金-历史数据) - 东方财富网站-天天基金网-基金数据-理财型基金收益-历史净值明细
- [ak.fund_graded_fund_daily_em()](#分级基金-实时数据) - 东方财富网-天天基金网-基金数据-分级基金-实时数据, 此接口数据每个交易日 16:00～23:00
- [ak.fund_graded_fund_info_em(symbol="150232")](#分级基金-历史数据) - 东方财富网站-天天基金网-基金数据-分级基金-历史数据
- [ak.fund_etf_fund_daily_em()](#场内交易基金-实时数据) - 东方财富网站-天天基金网-基金数据-场内交易基金-实时数据, 此接口数据每个交易日 16:00～23:00
- [ak.fund_etf_fund_info_em(fund="511280", start_date="20000101", end_date="20500101")](#场内交易基金-历史数据) - 东方财富网站-天天基金网-基金数据-场内交易基金-历史净值数据
- [ak.fund_hk_fund_hist_em()](#香港基金-历史数据) - 东方财富网站-天天基金网-基金数据-香港基金-历史净值明细
- [ak.fund_fh_em(year="2025")](#基金分红) - 天天基金网-基金数据-分红送配-基金分红
- [ak.fund_cf_em(year="2025")](#基金拆分) - 天天基金网-基金数据-分红送配-基金拆分
- [ak.fund_fh_rank_em(2025)](#基金分红排行) - 天天基金网-基金数据-分红送配-基金分红排行
- [ak.fund_open_fund_rank_em(symbol="全部")](#开放式基金排行) - 东方财富网-数据中心-开放式基金排行
- [ak.fund_exchange_rank_em()](#场内交易基金排行榜) - 东方财富网-数据中心-场内交易基金排行榜
- [ak.fund_money_rank_em()](#货币型基金排行) - 东方财富网-数据中心-货币型基金排行
- [ak.fund_lcx_rank_em()](#理财基金排行) - 东方财富网-数据中心-理财基金排行, 每个交易日17点后更新, 货币基金的单位净值均为 1.0000 元，最新一年期定存利率: 1.50%
- [ak.fund_hk_rank_em()](#香港基金排行) - 东方财富网-数据中心-基金排行-香港基金排行
- [ak.fund_individual_achievement_xq(symbol="000001")](#基金业绩-雪球) - 雪球基金-基金详情-基金业绩-详情
- [ak.fund_value_estimation_em(symbol="混合型")](#净值估算) - 东方财富网-数据中心-净值估算
- [ak.fund_individual_analysis_xq(symbol="000001")](#基金数据分析) - 雪球基金-基金详情-数据分析
- [ak.fund_individual_profit_probability_xq(symbol="000001")](#基金盈利概率) - 雪球基金-基金详情-盈利概率；历史任意时点买入，持有满X时间，盈利概率，以及平均收益
- [ak.fund_individual_detail_hold_xq(symbol="002804", date="20231231")](#基金持仓资产比例) - 雪球基金-基金详情-基金持仓-详情
- [ak.fund_overview_em(symbol="015641")](#基金基本概况) - 天天基金-基金档案-基本概况
- [ak.fund_fee_em(symbol="015641", indicator="认购费率")](#基金交易费率) - 天天基金-基金档案-购买信息
- [ak.fund_individual_detail_info_xq(symbol="000001")](#基金交易规则) - 雪球基金-基金详情-基金交易规则
- [ak.fund_portfolio_hold_em(symbol="000001", date="2024")](#基金持仓) - 天天基金网-基金档案-投资组合-基金持仓
- [ak.fund_portfolio_bond_hold_em(symbol="000001", date="2023")](#债券持仓) - 天天基金网-基金档案-投资组合-债券持仓
- [ak.fund_portfolio_industry_allocation_em(symbol="000001", date="2023")](#行业配置) - 天天基金网-基金档案-投资组合-行业配置
- [ak.fund_portfolio_change_em(symbol="003567", indicator="累计买入", date="2023")](#重大变动) - 天天基金网-基金档案-投资组合-重大变动
- [ak.fund_rating_all()](#基金评级总汇) - 天天基金网-基金评级-基金评级总汇
- [ak.fund_rating_sh(date=&#39;20230630&#39;)](#上海证券评级) - 天天基金网-基金评级-上海证券评级
- [ak.fund_rating_zs(date=&#39;20230331&#39;)](#招商证券评级) - 天天基金网-基金评级-招商证券评级
- [ak.fund_rating_ja(date=&#39;20200930&#39;)](#济安金信评级) - 天天基金网-基金评级-济安金信评级
- [ak.fund_manager_em()](#基金经理) - 天天基金网-基金数据-基金经理大全
- [ak.fund_new_found_em()](#新发基金) - 天天基金网-基金数据-新发基金-新成立基金
- [ak.fund_scale_open_sina(symbol=&#39;股票型基金&#39;)](#开放式基金) - 基金数据中心-基金规模-开放式基金
- [ak.fund_scale_close_sina()](#封闭式基金) - 基金数据中心-基金规模-封闭式基金
- [ak.fund_scale_structured_sina()](#分级子基金) - 基金数据中心-基金规模-分级子基金
- [ak.fund_aum_em()](#基金规模详情) - 天天基金网-基金数据-基金规模
- [ak.fund_aum_trend_em()](#基金规模走势) - 天天基金网-基金数据-市场全部基金规模走势
- [ak.fund_aum_hist_em(year="2023")](#基金公司历年管理规模) - 天天基金网-基金数据-基金公司历年管理规模排行列表
- [ak.reits_realtime_em()](#REITs-实时行情) - 东方财富网-行情中心-REITs-沪深 REITs-实时行情
- [ak.reits_hist_em(symbol="508097")](#REITs-历史行情) - 东方财富网-行情中心-REITs-沪深 REITs-历史行情
- [ak.fund_report_stock_cninfo(date="20210630")](#基金重仓股) - 巨潮资讯-数据中心-专题统计-基金报表-基金重仓股
- [ak.fund_report_industry_allocation_cninfo(date="20210630")](#基金行业配置) - 巨潮资讯-数据中心-专题统计-基金报表-基金行业配置
- [ak.fund_report_asset_allocation_cninfo()](#基金资产配置) - 巨潮资讯-数据中心-专题统计-基金报表-基金资产配置
- [ak.fund_scale_change_em()](#规模变动) - 天天基金网-基金数据-规模份额-规模变动
- [ak.fund_hold_structure_em()](#持有人结构) - 天天基金网-基金数据-规模份额-持有人结构
- [ak.fund_stock_position_lg()](#股票型基金仓位) - 乐咕乐股-基金仓位-股票型基金仓位
- [ak.fund_balance_position_lg()](#平衡混合型基金仓位) - 乐咕乐股-基金仓位-平衡混合型基金仓位
- [ak.fund_linghuo_position_lg()](#灵活配置型基金仓位) - 乐咕乐股-基金仓位-灵活配置型基金仓位
- [ak.fund_announcement_dividend_em(symbol="000001")](#分红配送) - 东方财富网站-天天基金网-基金档案-基金公告-分红配送
- [ak.fund_announcement_report_em(symbol="000001")](#定期报告) - 东方财富网站-天天基金网-基金档案-基金公告-定期报告
- [ak.fund_announcement_personnel_em(symbol="000001")](#人事公告) - 东方财富网站-天天基金网-基金档案-基金公告-人事调整
- [ak.bond_info_cm(bond_name="", bond_code="", bond_issue="", bond_type="短期融资券", coupon_type="零息式", issue_year="2019", grade="A-1", underwriter="重庆农村商业银行股份有限公司")](#债券查询) - 中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询
- [ak.bond_info_detail_cm(symbol="19万林投资CP001")](#债券基础信息) - 中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询-债券详情
- [ak.bond_cash_summary_sse(date=&#39;20210111&#39;)](#债券现券市场概览) - 上登债券信息网-市场数据-市场统计-市场概览-债券现券市场概览
- [ak.bond_deal_summary_sse(date=&#39;20210104&#39;)](#债券成交概览) - 上登债券信息网-市场数据-市场统计-市场概览-债券成交概览
- [ak.bond_debt_nafmii(page="2")](#银行间市场债券发行基础数据) - 中国银行间市场交易商协会-非金融企业债务融资工具注册信息系统
- [ak.bond_spot_quote()](#现券市场做市报价) - 中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场做市报价
- [ak.bond_spot_deal()](#现券市场成交行情) - 中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场成交行情
- [ak.bond_china_yield(start_date="20210201", end_date="20220201")](#国债及其他债券收益率曲线) - 中国债券信息网-国债及其他债券收益率曲线
- [ak.bond_zh_hs_spot(start_page="1", end_page="5")](#实时行情数据) - 新浪财经-债券-沪深债券-实时行情数据
- [ak.bond_zh_hs_daily(symbol="sh010107")](#历史行情数据) - 新浪财经-债券-沪深债券-历史行情数据, 历史数据按日频率更新
- [ak.bond_cb_profile_sina(symbol="sz128039")](#可转债-详情资料) - 新浪财经-债券-可转债-详情资料
- [ak.bond_cb_summary_sina(symbol="sh155255")](#可转债-债券概况) - 新浪财经-债券-可转债-债券概况
- [ak.bond_zh_hs_cov_spot()](#实时行情数据) - 新浪财经-沪深可转债数据
- [ak.bond_zh_hs_cov_daily(symbol="sz128039")](#历史行情数据-日频) - 新浪财经-历史行情数据，日频率更新, 新上的标的需要次日更新数据
- [ak.bond_zh_hs_cov_min()](#历史行情数据-分时) - 东方财富网-可转债-分时行情
- [ak.bond_zh_hs_cov_pre_min(symbol="sh113570")](#历史行情数据-盘前分时) - 东方财富网-可转债-分时行情-盘前分时
- [ak.bond_zh_cov()](#可转债数据一览表) - 东方财富网-数据中心-新股数据-可转债数据一览表
- [ak.bond_zh_cov_info(symbol="123121", indicator="基本信息")](#可转债详情) - 东方财富网-数据中心-新股数据-可转债详情
- [ak.bond_zh_cov_info_ths()](#可转债详情-同花顺) - 同花顺-数据中心-可转债
- [ak.bond_cov_comparison()](#可转债比价表) - 东方财富网-行情中心-债券市场-可转债比价表
- [ak.bond_zh_cov_value_analysis(symbol="113527")](#可转债价值分析) - 东方财富网-行情中心-新股数据-可转债数据-可转债价值分析
- [ak.bond_zh_cov_value_analysis(symbol="113527")](#可转债溢价率分析) - 东方财富网-行情中心-新股数据-可转债数据-可转债溢价率分析
- [ak.bond_sh_buy_back_em()](#上证质押式回购) - 东方财富网-行情中心-债券市场-上证质押式回购
- [ak.bond_sz_buy_back_em()](#深证质押式回购) - 东方财富网-行情中心-债券市场-深证质押式回购
- [ak.bond_buy_back_hist_em(symbol="204001")](#质押式回购历史数据) - 东方财富网-行情中心-债券市场-质押式回购-历史数据
- [ak.bond_cb_jsl(cookie="您的集思录 cookie")](#可转债实时数据-集思录) - 集思录可转债实时数据，包含行情数据（涨跌幅，成交量和换手率等）及可转债基本信息（转股价，溢价率和到期收益率等）
- [ak.bond_cb_redeem_jsl()](#可转债强赎) - 集思录可转债-强赎
- [ak.bond_cb_index_jsl()](#集思录可转债等权指数) - 可转债-集思录可转债等权指数
- [ak.bond_cb_adj_logs_jsl(symbol="128013")](#可转债转股价格调整记录-集思录) - 集思录-单个可转债的转股价格-调整记录
- [ak.bond_china_close_return(symbol="国债", period="1", start_date="20231101", end_date="20231101")](#收盘收益率曲线历史数据) - 收盘收益率曲线历史数据, 该接口只能获取近 3 个月的数据，且每次获取的数据不超过 1 个月
- [ak.bond_zh_us_rate(start_date="19901219")](#中美国债收益率) - 东方财富网-数据中心-经济数据-中美国债收益率历史数据
- [ak.bond_treasure_issue_cninfo(start_date="20210910", end_date="20211109")](#国债发行) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-国债发行
- [ak.bond_local_government_issue_cninfo(start_date="20210911", end_date="20211110")](#地方债发行) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-地方债发行
- [ak.bond_corporate_issue_cninfo(start_date="20210911", end_date="20211110")](#企业债发行) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-企业债发行
- [ak.bond_cov_issue_cninfo(start_date="20210913", end_date="20211112")](#可转债发行) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债发行
- [ak.bond_cov_stock_issue_cninfo()](#可转债转股) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债转股
- [ak.bond_new_composite_index_cbond(indicator="财富", period="总值")](#新综合指数) - 中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-新综合指数
- [ak.bond_composite_index_cbond(indicator="财富", period="总值")](#综合指数) - 中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-综合指数

---

# Index

- [ak.stock_sse_summary()](#上海证券交易所) - 上海证券交易所-股票数据总貌
- [ak.stock_szse_summary(date="20200619")](#证券类别统计) - 深圳证券交易所-市场总貌-证券类别统计
- [ak.stock_szse_area_summary()](#地区交易排序) - 深圳证券交易所-市场总貌-地区交易排序
- [ak.stock_szse_sector_summary(symbol="当年", date="202501")](#股票行业成交) - 深圳证券交易所-统计资料-股票行业成交数据
- [ak.stock_sse_deal_daily(date="20250221")](#上海证券交易所-每日概况) - 上海证券交易所-数据-股票数据-成交概况-股票成交概况-每日股票情况
- [ak.stock_individual_info_em(symbol="000001")](#个股信息查询-东财) - 东方财富-个股-股票信息
- [ak.stock_individual_basic_info_xq(symbol="SH601127")](#个股信息查询-雪球) - 雪球财经-个股-公司概况-公司简介
- [ak.stock_bid_ask_em(symbol="000001")](#行情报价) - 东方财富-行情报价
- [ak.stock_zh_a_spot_em()](#沪深京-A-股) - 东方财富网-沪深京 A 股-实时行情数据
- [ak.stock_sh_a_spot_em()](#沪-A-股) - 东方财富网-沪 A 股-实时行情数据
- [ak.stock_sz_a_spot_em()](#深-A-股) - 东方财富网-深 A 股-实时行情数据
- [ak.stock_bj_a_spot_em()](#京-A-股) - 东方财富网-京 A 股-实时行情数据
- [ak.stock_new_a_spot_em()](#新股) - 东方财富网-新股-实时行情数据
- [ak.stock_cy_a_spot_em()](#创业板) - 东方财富网-创业板-实时行情
- [ak.stock_kc_a_spot_em()](#科创板) - 东方财富网-科创板-实时行情
- [ak.stock_zh_ab_comparison_em()](#AB-股比价) - 东方财富网-行情中心-沪深京个股-AB股比价-全部AB股比价
- [ak.stock_zh_a_spot()](#实时行情数据-新浪) - 新浪财经-沪深京 A 股数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔
- [ak.stock_individual_spot_xq(symbol="SH600000")](#实时行情数据-雪球) - 雪球-行情中心-个股
- [ak.stock_zh_a_hist()](#历史行情数据-东财) - 东方财富-沪深京 A 股日频率数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取
- [ak.stock_zh_a_daily()](#历史行情数据-新浪) - 新浪财经-沪深京 A 股的数据, 历史数据按日频率更新; 注意其中的 sh689009 为 CDR, 请 通过 ak.stock_zh_a_cdr_daily 接口获取
- [ak.stock_zh_a_hist_tx()](#历史行情数据-腾讯) - 腾讯证券-日频-股票历史数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取
- [ak.stock_zh_a_minute(symbol=&#39;sh600751&#39;, period=&#39;1&#39;, adjust="qfq")](#分时数据-新浪) - 新浪财经-沪深京 A 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权
- [ak.stock_zh_a_hist_min_em()](#分时数据-东财) - 东方财富网-行情首页-沪深京 A 股-每日分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置
- [ak.stock_intraday_em(symbol="000001")](#日内分时数据-东财) - 东方财富-分时数据
- [ak.stock_intraday_sina(symbol="sz000001", date="20240321")](#日内分时数据-新浪) - 新浪财经-日内分时数据
- [ak.stock_zh_a_hist_pre_min_em(symbol="000001", start_time="09:00:00", end_time="15:40:00")](#盘前数据) - 东方财富-股票行情-盘前数据
- [ak.stock_zh_a_tick_tx_js(symbol="sz000001")](#腾讯财经) - 每个交易日 16:00 提供当日数据; 如遇到数据缺失, 请使用 ak.stock_zh_a_tick_163() 接口(注意数据会有一定差异)
- [ak.stock_zh_growth_comparison_em(symbol="SZ000895")](#成长性比较) - 东方财富-行情中心-同行比较-成长性比较
- [ak.stock_zh_valuation_comparison_em(symbol="SZ000895")](#估值比较) - 东方财富-行情中心-同行比较-估值比较
- [ak.stock_zh_dupont_comparison_em(symbol="SZ000895")](#杜邦分析比较) - 东方财富-行情中心-同行比较-杜邦分析比较
- [ak.stock_zh_scale_comparison_em(symbol="SZ000895")](#公司规模) - 东方财富-行情中心-同行比较-公司规模
- [ak.stock_zh_a_cdr_daily(symbol=&#39;sh689009&#39;, start_date=&#39;20201103&#39;, end_date=&#39;20201116&#39;)](#历史行情数据) - 上海证券交易所-科创板-CDR
- [ak.stock_zh_b_spot_em()](#实时行情数据-东财) - 东方财富网-实时行情数据
- [ak.stock_zh_b_spot()](#实时行情数据-新浪) - B 股数据是从新浪财经获取的数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔
- [ak.stock_zh_b_daily()](#历史行情数据) - B 股数据是从新浪财经获取的数据, 历史数据按日频率更新
- [ak.stock_zh_b_minute(symbol=&#39;sh900901&#39;, period=&#39;1&#39;, adjust="qfq")](#分时数据) - 新浪财经 B 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权
- [ak.stock_zh_a_new()](#次新股) - 新浪财经-行情中心-沪深股市-次新股
- [ak.stock_gsrl_gsdt_em(date="20230808")](#公司动态) - 东方财富网-数据中心-股市日历-公司动态
- [ak.stock_zh_a_st_em()](#风险警示板) - 东方财富网-行情中心-沪深个股-风险警示板
- [ak.stock_zh_a_new_em()](#新股) - 东方财富网-行情中心-沪深个股-新股
- [ak.stock_xgsr_ths()](#新股上市首日) - 同花顺-数据中心-新股数据-新股上市首日
- [ak.stock_ipo_benefit_ths()](#IPO-受益股) - 同花顺-数据中心-新股数据-IPO受益股
- [ak.stock_zh_a_stop_em()](#两网及退市) - 东方财富网-行情中心-沪深个股-两网及退市
- [ak.stock_zh_kcb_spot()](#实时行情数据) - 新浪财经-科创板股票实时行情数据
- [ak.stock_zh_kcb_daily(symbol="sh688399", adjust="hfq")](#历史行情数据) - 新浪财经-科创板股票历史行情数据
- [ak.stock_zh_kcb_report_em(from_page=1, to_page=100)](#科创板公告) - 东方财富-科创板报告数据
- [ak.stock_zh_ah_spot_em()](#实时行情数据-东财) - 东方财富网-行情中心-沪深港通-AH股比价-实时行情, 延迟 15 分钟更新
- [ak.stock_zh_ah_spot()](#实时行情数据-腾讯) - A+H 股数据是从腾讯财经获取的数据, 延迟 15 分钟更新
- [ak.stock_zh_ah_daily(symbol="02318", start_year="2022", end_year="2024", adjust="")](#历史行情数据) - 腾讯财经-A+H 股数据
- [ak.stock_zh_ah_name()](#A+H股票字典) - A+H 股数据是从腾讯财经获取的数据, 历史数据按日频率更新
- [ak.stock_us_spot_em()](#实时行情数据-东财) - 东方财富网-美股-实时行情
- [ak.stock_us_spot()](#实时行情数据-新浪) - 新浪财经-美股; 获取的数据有 15 分钟延迟; 建议使用 ak.stock_us_spot_em() 来获取数据
- [ak.stock_us_hist(symbol=&#39;106.TTE&#39;, period="daily", start_date="20200101", end_date="20240214", adjust="qfq")](#历史行情数据-东财) - 东方财富网-行情-美股-每日行情
- [ak.stock_individual_basic_info_us_xq(symbol="SH601127")](#个股信息查询-雪球) - 雪球-个股-公司概况-公司简介
- [ak.stock_us_hist_min_em(symbol="105.ATER")](#分时数据-东财) - 东方财富网-行情首页-美股-每日分时行情
- [ak.stock_us_daily()](#历史行情数据-新浪) - 美股历史行情数据，设定 adjust=
- [ak.stock_us_pink_spot_em()](#粉单市场) - 美股粉单市场的实时行情数据
- [ak.stock_us_famous_spot_em(symbol=&#39;科技类&#39;)](#知名美股) - 美股-知名美股的实时行情数据
- [ak.stock_hk_spot_em()](#实时行情数据-东财) - 所有港股的实时行情数据; 该数据有 15 分钟延时
- [ak.stock_hk_main_board_spot_em()](#港股主板实时行情数据-东财) - 港股主板的实时行情数据; 该数据有 15 分钟延时
- [ak.stock_hk_spot()](#实时行情数据-新浪) - 获取所有港股的实时行情数据 15 分钟延时
- [ak.stock_individual_basic_info_hk_xq(symbol="02097")](#个股信息查询-雪球) - 雪球-个股-公司概况-公司简介
- [ak.stock_hk_hist_min_em()](#分时数据-东财) - 东方财富网-行情首页-港股-每日分时行情
- [ak.stock_hk_hist()](#历史行情数据-东财) - 港股-历史行情数据, 可以选择返回复权后数据, 更新频率为日频
- [ak.stock_hk_daily()](#历史行情数据-新浪) - 港股-历史行情数据, 可以选择返回复权后数据,更新频率为日频
- [ak.stock_hk_famous_spot_em()](#知名港股) - 东方财富网-行情中心-港股市场-知名港股实时行情数据
- [ak.stock_hk_security_profile_em(symbol="03900")](#证券资料) - 东方财富-港股-证券资料
- [ak.stock_hk_company_profile_em(symbol="03900")](#公司资料) - 东方财富-港股-公司资料
- [ak.stock_hk_financial_indicator_em(symbol="03900")](#财务指标) - 东方财富-港股-核心必读-最新指标
- [ak.stock_hk_dividend_payout_em(symbol="03900")](#分红派息) - 东方财富-港股-核心必读-分红派息
- [ak.stock_hk_growth_comparison_em(symbol="03900")](#成长性对比) - 东方财富-港股-行业对比-成长性对比
- [ak.stock_hk_valuation_comparison_em(symbol="03900")](#估值对比) - 东方财富-港股-行业对比-估值对比
- [ak.stock_hk_scale_comparison_em(symbol="03900")](#规模对比) - 东方财富-港股-行业对比-规模对比
- [ak.stock_jgdy_tj_em(date="20210128")](#机构调研-统计) - 东方财富网-数据中心-特色数据-机构调研-机构调研统计
- [ak.stock_jgdy_detail_em(date="20241211")](#机构调研-详细) - 东方财富网-数据中心-特色数据-机构调研-机构调研详细
- [ak.stock_zyjs_ths(symbol="000066")](#主营介绍-同花顺) - 同花顺-主营介绍
- [ak.stock_zygc_em(symbol="SH688041")](#主营构成-东财) - 东方财富网-个股-主营构成
- [ak.stock_gpzy_profile_em()](#股权质押市场概况) - 东方财富网-数据中心-特色数据-股权质押-股权质押市场概况
- [ak.stock_gpzy_pledge_ratio_em(date="20241220")](#上市公司质押比例) - 东方财富网-数据中心-特色数据-股权质押-上市公司质押比例
- [ak.stock_gpzy_pledge_ratio_detail_em()](#重要股东股权质押明细) - 东方财富网-数据中心-特色数据-股权质押-重要股东股权质押明细
- [ak.stock_gpzy_distribute_statistics_company_em()](#质押机构分布统计-证券公司) - 东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-证券公司
- [ak.stock_gpzy_distribute_statistics_bank_em()](#质押机构分布统计-银行) - 东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-银行
- [ak.stock_gpzy_industry_data_em()](#上市公司质押比例) - 东方财富网-数据中心-特色数据-股权质押-上市公司质押比例-行业数据
- [ak.stock_sy_profile_em()](#A股商誉市场概况) - 东方财富网-数据中心-特色数据-商誉-A股商誉市场概况
- [ak.stock_sy_yq_em(date="20221231")](#商誉减值预期明细) - 东方财富网-数据中心-特色数据-商誉-商誉减值预期明细
- [ak.stock_sy_jz_em(date="20230331")](#个股商誉减值明细) - 东方财富网-数据中心-特色数据-商誉-个股商誉减值明细
- [ak.stock_sy_em(date="20240630")](#个股商誉明细) - 东方财富网-数据中心-特色数据-商誉-个股商誉明细
- [ak.stock_sy_hy_em(date="20240930")](#行业商誉) - 东方财富网-数据中心-特色数据-商誉-行业商誉
- [ak.stock_account_statistics_em()](#股票账户统计月度) - 东方财富网-数据中心-特色数据-股票账户统计
- [ak.stock_analyst_rank_em(year=&#39;2024&#39;)](#分析师指数排行) - 东方财富网-数据中心-研究报告-东方财富分析师指数
- [ak.stock_analyst_detail_em()](#分析师详情) - 东方财富网-数据中心-研究报告-东方财富分析师指数-分析师详情
- [ak.stock_comment_em()](#千股千评) - 东方财富网-数据中心-特色数据-千股千评
- [ak.stock_comment_detail_zlkp_jgcyd_em(symbol="600000")](#机构参与度) - 东方财富网-数据中心-特色数据-千股千评-主力控盘-机构参与度
- [ak.stock_comment_detail_zhpj_lspf_em(symbol="600000")](#历史评分) - 东方财富网-数据中心-特色数据-千股千评-综合评价-历史评分
- [ak.stock_comment_detail_scrd_focus_em(symbol="600000")](#用户关注指数) - 东方财富网-数据中心-特色数据-千股千评-市场热度-用户关注指数
- [ak.stock_comment_detail_scrd_desire_em(symbol="600000")](#市场参与意愿) - 东方财富网-数据中心-特色数据-千股千评-市场热度-市场参与意愿
- [ak.stock_hsgt_fund_flow_summary_em()](#沪深港通资金流向) - 东方财富网-数据中心-资金流向-沪深港通资金流向
- [ak.stock_sgt_settlement_exchange_rate_szse()](#结算汇率-深港通) - 深港通-港股通业务信息-结算汇率
- [ak.stock_sgt_settlement_exchange_rate_sse()](#结算汇率-沪港通) - 沪港通-港股通信息披露-结算汇兑
- [ak.stock_sgt_reference_exchange_rate_szse()](#参考汇率-深港通) - 深港通-港股通业务信息-参考汇率
- [ak.stock_sgt_reference_exchange_rate_sse()](#参考汇率-沪港通) - 沪港通-港股通信息披露-参考汇率
- [ak.stock_hk_ggt_components_em()](#港股通成份股) - 东方财富网-行情中心-港股市场-港股通成份股
- [ak.stock_hsgt_fund_min_em()](#沪深港通分时数据) - 东方财富-数据中心-沪深港通-市场概括-分时数据
- [ak.stock_hsgt_board_rank_em(symbol="北向资金增持行业板块排行", indicator="今日")](#板块排行) - 东方财富网-数据中心-沪深港通持股-板块排行
- [ak.stock_hsgt_hold_stock_em(market="北向", indicator="今日排行")](#个股排行) - 东方财富网-数据中心-沪深港通持股-个股排行
- [ak.stock_hsgt_stock_statistics_em(symbol="北向持股", start_date="20211027", end_date="20211027")](#每日个股统计) - 东方财富网-数据中心-沪深港通-沪深港通持股-每日个股统计
- [ak.stock_hsgt_institution_statistics_em(market="北向持股", start_date="20201218", end_date="20201218")](#机构排行) - 东方财富网-数据中心-沪深港通-沪深港通持股-机构排行
- [ak.stock_hsgt_sh_hk_spot_em()](#沪深港通-港股通(沪&gt;港)实时行情) - 东方财富网-行情中心-沪深港通-港股通(沪&gt;港)-股票；按股票代码排序
- [ak.stock_hsgt_hist_em()](#沪深港通历史数据) - 东方财富网-数据中心-资金流向-沪深港通资金流向-沪深港通历史数据
- [ak.stock_hsgt_individual_em()](#沪深港通持股-个股) - 东方财富网-数据中心-沪深港通-沪深港通持股-具体股票
- [ak.stock_hsgt_individual_detail_em(](#沪深港通持股-个股详情) - 东方财富网-数据中心-沪深港通-沪深港通持股-具体股票-个股详情
- [ak.stock_tfp_em(date="20240426")](#停复牌信息) - 东方财富网-数据中心-特色数据-停复牌信息
- [ak.news_trade_notify_suspend_baidu(date="20241107")](#停复牌) - 百度股市通-交易提醒-停复牌
- [ak.news_trade_notify_dividend_baidu(date="20251126")](#分红派息) - 百度股市通-交易提醒-分红派息
- [ak.stock_news_em(symbol="603777")](#个股新闻) - 东方财富指定个股的新闻资讯数据
- [ak.stock_news_main_cx()](#财经内容精选) - 财新网-财新数据通-最新
- [ak.news_report_time_baidu(date="20241107")](#财报发行) - 百度股市通-财报发行
- [ak.stock_dxsyl_em()](#打新收益率) - 东方财富网-数据中心-新股申购-打新收益率
- [ak.stock_xgsglb_em()](#新股申购与中签) - 东方财富网-数据中心-新股数据-新股申购-新股申购与中签查询
- [ak.stock_yjbb_em(date="20220331")](#业绩报表) - 东方财富-数据中心-年报季报-业绩报表
- [ak.stock_yjkb_em(date="20200331")](#业绩快报) - 东方财富-数据中心-年报季报-业绩快报
- [ak.stock_yjyg_em(date="20190331")](#业绩预告) - 东方财富-数据中心-年报季报-业绩预告
- [ak.stock_yysj_em(symbol="沪深A股", date="20211231")](#预约披露时间-东方财富) - 东方财富-数据中心-年报季报-预约披露时间
- [ak.stock_report_disclosure(market="沪深京", period="2022年报")](#预约披露时间-巨潮资讯) - 巨潮资讯-数据-预约披露的数据
- [ak.stock_zh_a_disclosure_report_cninfo(symbol="000001", market="沪深京", category="公司治理", start_date="20230619", end_date="20231220")](#信息披露公告-巨潮资讯) - 巨潮资讯-首页-公告查询-信息披露公告-沪深京
- [ak.stock_zh_a_disclosure_relation_cninfo(symbol="000001", market="沪深京", start_date="20230619", end_date="20231220")](#信息披露调研-巨潮资讯) - 巨潮资讯-首页-公告查询-信息披露调研-沪深京
- [ak.stock_industry_category_cninfo(symbol="巨潮行业分类标准")](#行业分类数据-巨潮资讯) - 巨潮资讯-数据-行业分类数据
- [ak.stock_industry_change_cninfo(symbol="002594", start_date="20091227", end_date="20220708")](#上市公司行业归属的变动情况-巨潮资讯) - 巨潮资讯-数据-上市公司行业归属的变动情况
- [ak.stock_share_change_cninfo(symbol="002594", start_date="20091227", end_date="20241021")](#公司股本变动-巨潮资讯) - 巨潮资讯-数据-公司股本变动
- [ak.stock_allotment_cninfo(symbol="600030", start_date="19900101", end_date="20241022")](#配股实施方案-巨潮资讯) - 巨潮资讯-个股-配股实施方案
- [ak.stock_profile_cninfo(symbol="600030")](#公司概况-巨潮资讯) - 巨潮资讯-个股-公司概况
- [ak.stock_ipo_summary_cninfo(symbol="600030")](#上市相关-巨潮资讯) - 巨潮资讯-个股-上市相关
- [ak.stock_zcfz_em(date="20240331")](#资产负债表-沪深) - 东方财富-数据中心-年报季报-业绩快报-资产负债表
- [ak.stock_zcfz_bj_em(date="20240331")](#资产负债表-北交所) - 东方财富-数据中心-年报季报-业绩快报-资产负债表
- [ak.stock_lrb_em(date="20240331")](#利润表) - 东方财富-数据中心-年报季报-业绩快报-利润表
- [ak.stock_xjll_em(date="20240331")](#现金流量表) - 东方财富-数据中心-年报季报-业绩快报-现金流量表
- [ak.stock_ggcg_em(symbol="全部")](#股东增减持) - 东方财富网-数据中心-特色数据-高管持股
- [ak.stock_fhps_em(date="20231231")](#分红配送-东财) - 东方财富-数据中心-年报季报-分红配送
- [ak.stock_fhps_detail_em(symbol="300073")](#分红配送详情-东财) - 东方财富网-数据中心-分红送配-分红送配详情
- [ak.stock_fhps_detail_ths(symbol="603444")](#分红情况-同花顺) - 同花顺-分红情况
- [ak.stock_hk_fhpx_detail_ths(symbol="0700")](#分红配送详情-港股-同花顺) - 同花顺-港股-分红派息
- [ak.stock_fund_flow_individual()](#个股资金流) - 同花顺-数据中心-资金流向-个股资金流
- [ak.stock_fund_flow_concept()](#概念资金流) - 同花顺-数据中心-资金流向-概念资金流
- [ak.stock_fund_flow_industry()](#行业资金流) - 同花顺-数据中心-资金流向-行业资金流
- [ak.stock_fund_flow_big_deal()](#大单追踪) - 同花顺-数据中心-资金流向-大单追踪
- [ak.stock_individual_fund_flow(stock="600094", market="sh")](#个股资金流) - 东方财富网-数据中心-个股资金流向
- [ak.stock_individual_fund_flow_rank()](#个股资金流排名) - 东方财富网-数据中心-资金流向-排名
- [ak.stock_market_fund_flow()](#大盘资金流) - 东方财富网-数据中心-资金流向-大盘
- [ak.stock_sector_fund_flow_rank()](#板块资金流排名) - 东方财富网-数据中心-资金流向-板块资金流-排名
- [ak.stock_main_fund_flow(symbol="全部股票")](#主力净流入排名) - 东方财富网-数据中心-资金流向-主力净流入排名
- [ak.stock_sector_fund_flow_summary(symbol="电源设备", indicator="今日")](#行业个股资金流) - 东方财富网-数据中心-资金流向-行业资金流-xx行业个股资金流
- [ak.stock_sector_fund_flow_hist(symbol="汽车服务")](#行业历史资金流) - 东方财富网-数据中心-资金流向-行业资金流-行业历史资金流
- [ak.stock_concept_fund_flow_hist(symbol="数据要素")](#概念历史资金流) - 东方财富网-数据中心-资金流向-概念资金流-概念历史资金流
- [ak.stock_cyq_em(symbol="000001", adjust="")](#筹码分布) - 东方财富网-概念板-行情中心-日K-筹码分布
- [ak.stock_gddh_em()](#股东大会) - 东方财富网-数据中心-股东大会
- [ak.stock_zdhtmx_em(start_date="20220819", end_date="20230819")](#重大合同) - 东方财富网-数据中心-重大合同-重大合同明细
- [ak.stock_research_report_em(symbol="000001")](#个股研报) - 东方财富网-数据中心-研究报告-个股研报
- [ak.stock_notice_report(symbol=&#39;财务报告&#39;, date="20240613")](#沪深京-A-股公告) - 东方财富网-数据中心-公告大全-沪深京 A 股公告
- [ak.stock_financial_report_sina(stock="sh600600", symbol="资产负债表")](#财务报表-新浪) - 新浪财经-财务报表-三大报表
- [ak.stock_balance_sheet_by_report_em(symbol="SH600519")](#资产负债表-按报告期) - 东方财富-股票-财务分析-资产负债表-按报告期
- [ak.stock_balance_sheet_by_yearly_em(symbol="SH600519")](#资产负债表-按年度) - 东方财富-股票-财务分析-资产负债表-按年度
- [ak.stock_profit_sheet_by_report_em(symbol="SH600519")](#利润表-按报告期) - 东方财富-股票-财务分析-利润表-报告期
- [ak.stock_profit_sheet_by_yearly_em(symbol="SH600519")](#利润表-按年度) - 东方财富-股票-财务分析-利润表-按年度
- [ak.stock_profit_sheet_by_quarterly_em(symbol="SH600519")](#利润表-按单季度) - 东方财富-股票-财务分析-利润表-按单季度
- [ak.stock_cash_flow_sheet_by_report_em(symbol="SH600519")](#现金流量表-按报告期) - 东方财富-股票-财务分析-现金流量表-按报告期
- [ak.stock_cash_flow_sheet_by_yearly_em(symbol="SH600519")](#现金流量表-按年度) - 东方财富-股票-财务分析-现金流量表-按年度
- [ak.stock_cash_flow_sheet_by_quarterly_em(symbol="SH600519")](#现金流量表-按单季度) - 东方财富-股票-财务分析-现金流量表-按单季度
- [ak.stock_financial_debt_new_ths(symbol="000063", indicator="按年度")](#资产负债表) - 同花顺-财务指标-资产负债表；替换 stock_financial_debt_ths 接口
- [ak.stock_financial_benefit_new_ths(symbol="000063", indicator="按报告期")](#利润表) - 同花顺-财务指标-利润表；替换 stock_financial_benefit_ths 接口
- [ak.stock_financial_cash_new_ths(symbol="000063", indicator="按年度")](#现金流量表) - 同花顺-财务指标-现金流量表；替换 stock_financial_cash_ths 接口
- [ak.stock_balance_sheet_by_report_delisted_em(symbol="SZ000013")](#资产负债表-按报告期) - 东方财富-股票-财务分析-资产负债表-已退市股票-按报告期
- [ak.stock_profit_sheet_by_report_delisted_em(symbol="SZ000013")](#利润表-按报告期) - 东方财富-股票-财务分析-利润表-已退市股票-按报告期
- [ak.stock_cash_flow_sheet_by_report_delisted_em(symbol="SZ000013")](#现金流量表-按报告期) - 东方财富-股票-财务分析-现金流量表-已退市股票-按报告期
- [ak.stock_financial_hk_report_em()](#港股财务报表) - 东方财富-港股-财务报表-三大报表
- [ak.stock_financial_us_report_em()](#美股财务报表) - 东方财富-美股-财务分析-三大报表
- [ak.stock_financial_abstract(symbol="600004")](#关键指标-新浪) - 新浪财经-财务报表-关键指标
- [ak.stock_financial_abstract_new_ths(symbol="000063", indicator="按报告期")](#关键指标-同花顺) - 同花顺-财务指标-重要指标；替换 stock_financial_abstract_ths 接口
- [ak.stock_financial_analysis_indicator_em(symbol="301389.SZ", indicator="按报告期")](#主要指标-东方财富) - 东方财富-A股-财务分析-主要指标
- [ak.stock_financial_analysis_indicator(symbol="600004", start_year="2020")](#财务指标) - 新浪财经-财务分析-财务指标
- [ak.stock_financial_hk_analysis_indicator_em(symbol="00700", indicator="年度")](#港股财务指标) - 东方财富-港股-财务分析-主要指标
- [ak.stock_financial_us_analysis_indicator_em(symbol="TSLA", indicator="年报")](#美股财务指标) - 东方财富-美股-财务分析-主要指标
- [ak.stock_history_dividend()](#历史分红) - 新浪财经-发行与分配-历史分红
- [ak.stock_gdfx_free_top_10_em(symbol="sh688686", date="20240930")](#十大流通股东(个股)) - 东方财富网-个股-十大流通股东
- [ak.stock_gdfx_top_10_em(symbol="sh688686", date="20210630")](#十大股东(个股)) - 东方财富网-个股-十大股东
- [ak.stock_gdfx_free_holding_change_em(date="20210930")](#股东持股变动统计-十大流通股东) - 东方财富网-数据中心-股东分析-股东持股变动统计-十大流通股东
- [ak.stock_gdfx_holding_change_em(date="20210930")](#股东持股变动统计-十大股东) - 东方财富网-数据中心-股东分析-股东持股变动统计-十大股东
- [ak.stock_management_change_ths(symbol="688981")](#高管持股变动统计) - 同花顺-公司大事-高管持股变动
- [ak.stock_shareholder_change_ths(symbol="688981")](#股东持股变动统计) - 同花顺-公司大事-股东持股变动
- [ak.stock_gdfx_free_holding_analyse_em(date="20230930")](#股东持股分析-十大流通股东) - 东方财富网-数据中心-股东分析-股东持股分析-十大流通股东
- [ak.stock_gdfx_holding_analyse_em(date="20210930")](#股东持股分析-十大股东) - 东方财富网-数据中心-股东分析-股东持股分析-十大股东
- [ak.stock_gdfx_free_holding_detail_em(date="20210930")](#股东持股明细-十大流通股东) - 东方财富网-数据中心-股东分析-股东持股明细-十大流通股东
- [ak.stock_gdfx_holding_detail_em(date="20230331", indicator="个人", symbol="新进")](#股东持股明细-十大股东) - 东方财富网-数据中心-股东分析-股东持股明细-十大股东
- [ak.stock_gdfx_free_holding_statistics_em(date="20210930")](#股东持股统计-十大流通股东) - 东方财富网-数据中心-股东分析-股东持股统计-十大股东
- [ak.stock_gdfx_holding_statistics_em(date="20210930")](#股东持股统计-十大股东) - 东方财富网-数据中心-股东分析-股东持股统计-十大股东
- [ak.stock_gdfx_free_holding_teamwork_em(symbol="社保")](#股东协同-十大流通股东) - 东方财富网-数据中心-股东分析-股东协同-十大流通股东
- [ak.stock_gdfx_holding_teamwork_em(symbol="社保")](#股东协同-十大股东) - 东方财富网-数据中心-股东分析-股东协同-十大股东
- [ak.stock_zh_a_gdhs(symbol="20230930")](#股东户数) - 东方财富网-数据中心-特色数据-股东户数数据
- [ak.stock_zh_a_gdhs_detail_em(symbol="000001")](#股东户数详情) - 东方财富网-数据中心-特色数据-股东户数详情
- [ak.stock_history_dividend_detail()](#分红配股) - 新浪财经-发行与分配-分红配股
- [ak.stock_dividend_cninfo(symbol="600009")](#历史分红) - 巨潮资讯-个股-历史分红
- [ak.stock_ipo_info(stock="600004")](#新股发行) - 新浪财经-发行与分配-新股发行
- [ak.stock_ipo_review_em()](#新股上会信息) - 东方财富网-数据中心-新股申购-新股上会信息
- [ak.stock_ipo_tutor_em()](#IPO辅导信息) - 东方财富网-数据中心-新股申购-IPO辅导信息
- [ak.stock_add_stock(symbol="600004")](#股票增发) - 新浪财经-发行与分配-增发
- [ak.stock_restricted_release_queue_sina(symbol="600000")](#个股限售解禁-新浪) - 新浪财经-发行分配-限售解禁
- [ak.stock_restricted_release_summary_em(symbol="全部股票", start_date="20221108", end_date="20221209")](#限售股解禁) - 东方财富网-数据中心-特色数据-限售股解禁
- [ak.stock_restricted_release_detail_em(start_date="20221202", end_date="20221204")](#限售股解禁详情) - 东方财富网-数据中心-限售股解禁-解禁详情一览
- [ak.stock_restricted_release_queue_em(symbol="600000")](#解禁批次) - 东方财富网-数据中心-个股限售解禁-解禁批次
- [ak.stock_restricted_release_stockholder_em(symbol="600000", date="20200904")](#解禁股东) - 东方财富网-数据中心-个股限售解禁-解禁股东
- [ak.stock_circulate_stock_holder(symbol="600000")](#流通股东) - 新浪财经-股东股本-流通股东
- [ak.stock_sector_spot(indicator="新浪行业")](#板块行情) - 新浪行业-板块行情
- [ak.stock_sector_detail(sector="hangye_ZL01")](#板块详情) - 新浪行业-板块行情-成份详情, 由于新浪网页提供的统计数据有误, 部分行业数量大于统计数
- [ak.stock_info_a_code_name()](#股票列表-A股) - 沪深京 A 股股票代码和股票简称数据
- [ak.stock_info_sh_name_code(symbol="主板A股")](#股票列表-上证) - 上海证券交易所股票代码和简称数据
- [ak.stock_info_sz_name_code(symbol="A股列表")](#股票列表-深证) - 深证证券交易所股票代码和股票简称数据
- [ak.stock_info_bj_name_code()](#股票列表-北证) - 北京证券交易所股票代码和简称数据
- [ak.stock_info_sz_delist(symbol="终止上市公司")](#终止/暂停上市-深证) - 深证证券交易所终止/暂停上市股票
- [ak.stock_staq_net_stop()](#两网及退市) - 东方财富网-行情中心-沪深个股-两网及退市
- [ak.stock_info_sh_delist(symbol="全部")](#暂停/终止上市-上证) - 上海证券交易所暂停/终止上市股票
- [ak.stock_info_change_name(symbol="000503")](#股票更名) - 新浪财经-股票曾用名
- [ak.stock_info_sz_change_name(symbol="全称变更")](#名称变更-深证) - 深证证券交易所-市场数据-股票数据-名称变更
- [ak.stock_fund_stock_holder(symbol="601318")](#基金持股) - 新浪财经-股本股东-基金持股
- [ak.stock_main_stock_holder(stock="600004")](#主要股东) - 新浪财经-股本股东-主要股东
- [ak.stock_institute_hold(symbol="20201")](#机构持股一览表) - 新浪财经-机构持股-机构持股一览表
- [ak.stock_institute_hold_detail(stock="300003", quarter="20201")](#机构持股详情) - 新浪财经-机构持股-机构持股详情
- [ak.stock_institute_recommend(symbol="投资评级选股")](#机构推荐池) - 新浪财经-机构推荐池-具体指标的数据
- [ak.stock_institute_recommend_detail(symbol="002709")](#股票评级记录) - 新浪财经-机构推荐池-股票评级记录
- [ak.stock_rank_forecast_cninfo(date="20230817")](#投资评级) - 巨潮资讯-数据中心-评级预测-投资评级
- [ak.stock_industry_clf_hist_sw()](#申万个股行业分类变动历史) - 申万宏源研究-行业分类-全部行业分类
- [ak.stock_industry_pe_ratio_cninfo(symbol="国证行业分类", date="20240617")](#行业市盈率) - 巨潮资讯-数据中心-行业分析-行业市盈率
- [ak.stock_new_gh_cninfo()](#新股过会) - 巨潮资讯-数据中心-新股数据-新股过会
- [ak.stock_new_ipo_cninfo()](#新股发行) - 巨潮资讯-数据中心-新股数据-新股发行
- [ak.stock_share_hold_change_sse(symbol="600000")](#董监高及相关人员持股变动-上证) - 上海证券交易所-披露-监管信息公开-公司监管-董董监高人员股份变动
- [ak.stock_share_hold_change_szse(symbol="001308")](#董监高及相关人员持股变动-深证) - 深圳证券交易所-信息披露-监管信息公开-董监高人员股份变动
- [ak.stock_share_hold_change_bse(symbol="430489")](#董监高及相关人员持股变动-北证) - 北京证券交易所-信息披露-监管信息-董监高及相关人员持股变动
- [ak.stock_hold_num_cninfo(date="20210630")](#股东人数及持股集中度) - 巨潮资讯-数据中心-专题统计-股东股本-股东人数及持股集中度
- [ak.stock_hold_change_cninfo(symbol="全部")](#股本变动) - 巨潮资讯-数据中心-专题统计-股东股本-股本变动
- [ak.stock_hold_control_cninfo(symbol="全部")](#实际控制人持股变动) - 巨潮资讯-数据中心-专题统计-股东股本-实际控制人持股变动
- [ak.stock_hold_management_detail_cninfo(symbol="增持")](#高管持股变动明细) - 巨潮资讯-数据中心-专题统计-股东股本-高管持股变动明细
- [ak.stock_hold_management_detail_em()](#董监高及相关人员持股变动明细) - 东方财富网-数据中心-特色数据-高管持股-董监高及相关人员持股变动明细
- [ak.stock_hold_management_person_em(symbol="001308", name="孙建华")](#人员增减持股变动明细) - 东方财富网-数据中心-特色数据-高管持股-人员增减持股变动明细
- [ak.stock_cg_guarantee_cninfo(symbol="全部", start_date="20180630", end_date="20210927")](#对外担保) - 巨潮资讯-数据中心-专题统计-公司治理-对外担保
- [ak.stock_cg_lawsuit_cninfo(symbol="全部", start_date="20180630", end_date="20210927")](#公司诉讼) - 巨潮资讯-数据中心-专题统计-公司治理-公司诉讼
- [ak.stock_cg_equity_mortgage_cninfo(date="20210930")](#股权质押) - 巨潮资讯-数据中心-专题统计-公司治理-股权质押
- [ak.stock_price_js(symbol="us")](#美港目标价) - 美港电讯-美港目标价数据
- [ak.stock_qsjy_em(date="20200430")](#券商业绩月报) - 东方财富网-数据中心-特色数据-券商业绩月报
- [ak.stock_a_gxl_lg(symbol="上证A股")](#A-股股息率) - 乐咕乐股-股息率-A 股股息率
- [ak.stock_hk_gxl_lg()](#恒生指数股息率) - 乐咕乐股-股息率-恒生指数股息率
- [ak.stock_a_congestion_lg()](#大盘拥挤度) - 乐咕乐股-大盘拥挤度
- [ak.stock_ebs_lg()](#股债利差) - 乐咕乐股-股债利差
- [ak.stock_buffett_index_lg()](#巴菲特指标) - 乐估乐股-底部研究-巴菲特指标
- [ak.stock_a_ttm_lyr()](#A-股等权重与中位数市盈率) - 乐咕乐股-A 股等权重市盈率与中位数市盈率
- [ak.stock_a_all_pb()](#A-股等权重与中位数市净率) - 乐咕乐股-A 股等权重与中位数市净率
- [ak.stock_market_pe_lg()](#主板市盈率) - 乐咕乐股-主板市盈率
- [ak.stock_index_pe_lg(symbol="上证50")](#指数市盈率) - 乐咕乐股-指数市盈率
- [ak.stock_market_pb_lg(symbol="上证")](#主板市净率) - 乐咕乐股-主板市净率
- [ak.stock_index_pb_lg(symbol="上证50")](#指数市净率) - 乐咕乐股-指数市净率
- [ak.stock_zh_valuation_baidu(symbol="002044", indicator="总市值", period="近一年")](#A-股估值指标) - 百度股市通-A 股-财务报表-估值数据
- [ak.stock_value_em(symbol="300766")](#个股估值) - 东方财富网-数据中心-估值分析-每日互动-每日互动-估值分析
- [ak.stock_zh_vote_baidu(symbol="000001", indicator="指数")](#涨跌投票) - 百度股市通- A 股或指数-股评-投票
- [ak.stock_hk_indicator_eniu()](#港股个股指标) - 亿牛网-港股个股指标: 市盈率, 市净率, 股息率, ROE, 市值
- [ak.stock_hk_valuation_baidu(symbol="06969", indicator="总市值", period="近一年")](#港股估值指标) - 百度股市通-港股-财务报表-估值数据
- [ak.stock_us_valuation_baidu(symbol="NVDA", indicator="总市值", period="近一年")](#美股估值指标) - 百度股市通-美股-财务报表-估值数据
- [ak.stock_a_high_low_statistics(symbol="all")](#创新高和新低的股票数量) - 不同市场的创新高和新低的股票数量
- [ak.stock_a_below_net_asset_statistics()](#破净股统计) - 乐咕乐股-A 股破净股统计数据
- [ak.stock_report_fund_hold(symbol="基金持仓", date="20200630")](#基金持股) - 东方财富网-数据中心-主力数据-基金持仓
- [ak.stock_report_fund_hold_detail(symbol="005827", date="20201231")](#基金持股明细) - 东方财富网-数据中心-主力数据-基金持仓-基金持仓明细表
- [ak.stock_lhb_detail_em(start_date="20230403", end_date="20230417")](#龙虎榜详情) - 东方财富网-数据中心-龙虎榜单-龙虎榜详情
- [ak.stock_lhb_stock_statistic_em(symbol="近一月")](#个股上榜统计) - 东方财富网-数据中心-龙虎榜单-个股上榜统计
- [ak.stock_lhb_jgmmtj_em(start_date="20240417", end_date="20240430")](#机构买卖每日统计) - 东方财富网-数据中心-龙虎榜单-机构买卖每日统计
- [ak.stock_lhb_jgstatistic_em(symbol="近一月")](#机构席位追踪) - 东方财富网-数据中心-龙虎榜单-机构席位追踪
- [ak.stock_lhb_hyyyb_em(start_date="20220324", end_date="20220324")](#每日活跃营业部) - 东方财富网-数据中心-龙虎榜单-每日活跃营业部
- [ak.stock_lhb_yyb_detail_em(symbol="10188715")](#营业部详情数据-东财) - 东方财富网-数据中心-龙虎榜单-营业部历史交易明细-营业部交易明细
- [ak.stock_lhb_yybph_em(symbol="近一月")](#营业部排行) - 东方财富网-数据中心-龙虎榜单-营业部排行
- [ak.stock_lhb_traderstatistic_em(symbol="近一月")](#营业部统计) - 东方财富网-数据中心-龙虎榜单-营业部统计
- [ak.stock_lhb_stock_detail_em(symbol="600077", date="20070416", flag="买入")](#个股龙虎榜详情) - 东方财富网-数据中心-龙虎榜单-个股龙虎榜详情
- [ak.stock_lh_yyb_most()](#龙虎榜-营业部排行-上榜次数最多) - 龙虎榜-营业部排行-上榜次数最多
- [ak.stock_lh_yyb_capital()](#龙虎榜-营业部排行-资金实力最强) - 龙虎榜-营业部排行-资金实力最强
- [ak.stock_lh_yyb_control()](#龙虎榜-营业部排行-抱团操作实力) - 龙虎榜-营业部排行-抱团操作实力
- [ak.stock_lhb_detail_daily_sina(date="20240222")](#龙虎榜-每日详情) - 新浪财经-龙虎榜-每日详情
- [ak.stock_lhb_ggtj_sina(symbol="5")](#龙虎榜-个股上榜统计) - 新浪财经-龙虎榜-个股上榜统计
- [ak.stock_lhb_yytj_sina(symbol="5")](#龙虎榜-营业上榜统计) - 新浪财经-龙虎榜-营业上榜统计
- [ak.stock_lhb_jgzz_sina(symbol="5")](#龙虎榜-机构席位追踪) - 新浪财经-龙虎榜-机构席位追踪
- [ak.stock_lhb_jgmx_sina()](#龙虎榜-机构席位成交明细) - 新浪财经-龙虎榜-机构席位成交明细
- [ak.stock_ipo_declare_em()](#首发申报信息) - 东方财富网-数据中心-新股申购-首发申报信息-首发申报企业信息
- [ak.stock_register_all_em()](#全部) - 东方财富网-数据中心-新股数据-IPO审核信息-全部
- [ak.stock_register_kcb()](#科创板) - 东方财富网-数据中心-新股数据-IPO审核信息-科创板
- [ak.stock_register_cyb()](#创业板) - 东方财富网-数据中心-新股数据-IPO审核信息-创业板
- [ak.stock_register_sh()](#上海主板) - 东方财富网-数据中心-新股数据-IPO审核信息-上海主板
- [ak.stock_register_sz()](#深圳主板) - 东方财富网-数据中心-新股数据-IPO审核信息-深圳主板
- [ak.stock_register_bj()](#北交所) - 东方财富网-数据中心-新股数据-IPO审核信息-北交所
- [ak.stock_register_db()](#达标企业) - 东方财富网-数据中心-新股数据-注册制审核-达标企业
- [ak.stock_qbzf_em()](#增发) - 东方财富网-数据中心-新股数据-增发-全部增发
- [ak.stock_pg_em()](#配股) - 东方财富网-数据中心-新股数据-配股
- [ak.stock_repurchase_em()](#股票回购数据) - 东方财富网-数据中心-股票回购-股票回购数据
- [ak.stock_zh_a_gbjg_em(symbol="603392.SH")](#股本结构) - 东方财富-A股数据-股本结构
- [ak.stock_dzjy_sctj()](#市场统计) - 东方财富网-数据中心-大宗交易-市场统计
- [ak.stock_dzjy_mrmx()](#每日明细) - 东方财富网-数据中心-大宗交易-每日明细
- [ak.stock_dzjy_mrtj(start_date=&#39;20220105&#39;, end_date=&#39;20220105&#39;)](#每日统计) - 东方财富网-数据中心-大宗交易-每日统计
- [ak.stock_dzjy_hygtj(symbol=&#39;近三月&#39;)](#活跃-A-股统计) - 东方财富网-数据中心-大宗交易-活跃 A 股统计
- [ak.stock_dzjy_hyyybtj(symbol=&#39;近3日&#39;)](#活跃营业部统计) - 东方财富网-数据中心-大宗交易-活跃营业部统计
- [ak.stock_dzjy_yybph(symbol=&#39;近三月&#39;)](#营业部排行) - 东方财富网-数据中心-大宗交易-营业部排行
- [ak.stock_yzxdr_em(date="20210331")](#一致行动人) - 东方财富网-数据中心-特色数据-一致行动人
- [ak.stock_margin_ratio_pa(symbol="沪市", date="20260113")](#标的证券名单及保证金比例查询) - 融资融券-标的证券名单及保证金比例查询
- [ak.stock_margin_account_info()](#两融账户信息) - 东方财富网-数据中心-融资融券-融资融券账户统计-两融账户信息
- [ak.stock_margin_sse(start_date="20010106", end_date="20210208")](#融资融券汇总) - 上海证券交易所-融资融券数据-融资融券汇总数据
- [ak.stock_margin_detail_sse(date="20230922")](#融资融券明细) - 上海证券交易所-融资融券数据-融资融券明细数据
- [ak.stock_margin_szse(date="20240411")](#融资融券汇总) - 深圳证券交易所-融资融券数据-融资融券汇总数据
- [ak.stock_margin_detail_szse(date="20230925")](#融资融券明细) - 深证证券交易所-融资融券数据-融资融券交易明细数据
- [ak.stock_margin_underlying_info_szse(date="20210727")](#标的证券信息) - 深圳证券交易所-融资融券数据-标的证券信息
- [ak.stock_profit_forecast_em()](#盈利预测-东方财富) - 东方财富网-数据中心-研究报告-盈利预测; 该数据源网页端返回数据有异常, 本接口已修复该异常
- [ak.stock_hk_profit_forecast_et()](#港股盈利预测-经济通) - 经济通-公司资料-盈利预测
- [ak.stock_profit_forecast_ths()](#盈利预测-同花顺) - 同花顺-盈利预测
- [ak.stock_board_concept_index_ths(symbol="阿里巴巴概念", start_date="20200101", end_date="20250321")](#同花顺-概念板块指数) - 同花顺-板块-概念板块-指数日频率数据
- [ak.stock_board_concept_info_ths(symbol="阿里巴巴概念")](#同花顺-概念板块简介) - 同花顺-板块-概念板块-板块简介
- [ak.stock_board_concept_name_em()](#东方财富-概念板块) - 东方财富网-行情中心-沪深京板块-概念板块
- [ak.stock_board_concept_spot_em(symbol="可燃冰")](#东方财富-概念板块-实时行情) - 东方财富网-行情中心-沪深京板块-概念板块-实时行情
- [ak.stock_board_concept_cons_em(symbol="融资融券")](#东方财富-成份股) - 东方财富-沪深板块-概念板块-板块成份
- [ak.stock_board_concept_hist_em(symbol="绿色电力", period="daily", start_date="20220101", end_date="20250227", adjust="")](#东方财富-指数) - 东方财富-沪深板块-概念板块-历史行情数据
- [ak.stock_board_concept_hist_min_em()](#东方财富-指数-分时) - 东方财富-沪深板块-概念板块-分时历史行情数据
- [ak.stock_concept_cons_futu(symbol="特朗普概念股")](#富途牛牛-美股概念-成分股) - 富途牛牛-主题投资-概念板块-成分股
- [ak.stock_board_industry_summary_ths()](#同花顺-同花顺行业一览表) - 同花顺-同花顺行业一览表
- [ak.stock_board_industry_index_ths(symbol="元件", start_date="20240101", end_date="20240718")](#同花顺-指数) - 同花顺-板块-行业板块-指数日频率数据
- [ak.stock_board_industry_name_em()](#东方财富-行业板块) - 东方财富-沪深京板块-行业板块
- [ak.stock_board_industry_spot_em(symbol="小金属")](#东方财富-行业板块-实时行情) - 东方财富网-沪深板块-行业板块-实时行情
- [ak.stock_board_industry_cons_em(symbol="小金属")](#东方财富-成份股) - 东方财富-沪深板块-行业板块-板块成份
- [ak.stock_board_industry_hist_em(symbol="小金属", start_date="20211201", end_date="20240222", period="日k", adjust="")](#东方财富-指数-日频) - 东方财富-沪深板块-行业板块-历史行情数据
- [ak.stock_board_industry_hist_min_em()](#东方财富-指数-分时) - 东方财富-沪深板块-行业板块-分时历史行情数据
- [ak.stock_hot_follow_xq(symbol="最热门")](#关注排行榜) - 雪球-沪深股市-热度排行榜-关注排行榜
- [ak.stock_hot_tweet_xq(symbol="最热门")](#讨论排行榜) - 雪球-沪深股市-热度排行榜-讨论排行榜
- [ak.stock_hot_deal_xq(symbol="最热门")](#交易排行榜) - 雪球-沪深股市-热度排行榜-交易排行榜
- [ak.stock_hot_rank_em()](#人气榜-A股) - 东方财富网站-股票热度
- [ak.stock_hot_up_em()](#飙升榜-A股) - 东方财富-个股人气榜-飙升榜
- [ak.stock_hk_hot_rank_em()](#人气榜-港股) - 东方财富-个股人气榜-人气榜-港股市场
- [ak.stock_hot_rank_detail_em(symbol="SZ000665")](#A股) - 东方财富网-股票热度-历史趋势及粉丝特征
- [ak.stock_hk_hot_rank_detail_em(symbol="00700")](#港股) - 东方财富网-股票热度-历史趋势
- [ak.stock_irm_cninfo(symbol="002594")](#互动易-提问) - 互动易-提问
- [ak.stock_irm_ans_cninfo(symbol="1495108801386602496")](#互动易-回答) - 互动易-回答
- [ak.stock_sns_sseinfo(symbol="603119")](#上证e互动) - 上证e互动-提问与回答
- [ak.stock_hot_rank_detail_realtime_em(symbol="SZ000665")](#A股) - 东方财富网-个股人气榜-实时变动
- [ak.stock_hk_hot_rank_detail_realtime_em(symbol="00700")](#港股) - 东方财富网-个股人气榜-实时变动
- [ak.stock_hot_keyword_em(symbol="SZ000665")](#热门关键词) - 东方财富-个股人气榜-热门关键词
- [ak.stock_inner_trade_xq()](#内部交易) - 雪球-行情中心-沪深股市-内部交易
- [ak.stock_hot_rank_latest_em(symbol="SZ000665")](#A股) - 东方财富-个股人气榜-最新排名
- [ak.stock_hk_hot_rank_latest_em(symbol="00700")](#港股) - 东方财富-个股人气榜-最新排名
- [ak.stock_hot_search_baidu(symbol="A股", date="20250616", time="今日")](#热搜股票) - 百度股市通-热搜股票
- [ak.stock_hot_rank_relate_em(symbol="SZ000665")](#相关股票) - 东方财富-个股人气榜-相关股票
- [ak.stock_changes_em(symbol="大笔买入")](#盘口异动) - 东方财富-行情中心-盘口异动数据
- [ak.stock_board_change_em()](#板块异动详情) - 东方财富-行情中心-当日板块异动详情
- [ak.stock_zt_pool_em(date=&#39;20241008&#39;)](#涨停股池) - 东方财富网-行情中心-涨停板行情-涨停股池
- [ak.stock_zt_pool_previous_em(date=&#39;20240415&#39;)](#昨日涨停股池) - 东方财富网-行情中心-涨停板行情-昨日涨停股池
- [ak.stock_zt_pool_strong_em(date=&#39;20241231&#39;)](#强势股池) - 东方财富网-行情中心-涨停板行情-强势股池
- [ak.stock_zt_pool_sub_new_em(date=&#39;20241231&#39;)](#次新股池) - 东方财富网-行情中心-涨停板行情-次新股池
- [ak.stock_zt_pool_zbgc_em(date=&#39;20241011&#39;)](#炸板股池) - 东方财富网-行情中心-涨停板行情-炸板股池
- [ak.stock_zt_pool_dtgc_em(date=&#39;20241011&#39;)](#跌停股池) - 东方财富网-行情中心-涨停板行情-跌停股池
- [ak.stock_market_activity_legu()](#赚钱效应分析) - 乐咕乐股网-赚钱效应分析数据
- [ak.stock_info_global_sina()](#全球财经快讯-新浪财经) - 全球财经快讯-新浪财经
- [ak.stock_info_global_futu()](#快讯-富途牛牛) - 快讯-富途牛牛
- [ak.stock_info_global_ths()](#全球财经直播-同花顺财经) - 全球财经直播-同花顺财经
- [ak.stock_rank_lxsz_ths()](#连续上涨) - 连续上涨
- [ak.stock_rank_cxfl_ths()](#持续放量) - 同花顺-数据中心-技术选股-持续放量
- [ak.stock_rank_cxsl_ths()](#持续缩量) - 同花顺-数据中心-技术选股-持续缩量
- [ak.stock_rank_xstp_ths(symbol="500日均线")](#向上突破) - 同花顺-数据中心-技术选股-向上突破
- [ak.stock_rank_xxtp_ths(symbol="500日均线")](#向下突破) - 同花顺-数据中心-技术选股-向下突破
- [ak.stock_rank_ljqs_ths()](#量价齐升) - 同花顺-数据中心-技术选股-量价齐升
- [ak.stock_rank_ljqd_ths()](#量价齐跌) - 同花顺-数据中心-技术选股-量价齐跌
- [ak.stock_rank_xzjp_ths()](#险资举牌) - 同花顺-数据中心-技术选股-险资举牌
- [ak.stock_esg_rate_sina()](#ESG-评级数据) - 新浪财经-ESG评级中心-ESG评级-ESG评级数据
- [ak.stock_esg_msci_sina()](#MSCI) - 新浪财经-ESG评级中心-ESG评级-MSCI
- [ak.stock_esg_rft_sina()](#路孚特) - 新浪财经-ESG评级中心-ESG评级-路孚特
- [ak.stock_esg_zd_sina()](#秩鼎) - 新浪财经-ESG评级中心-ESG评级-秩鼎
- [ak.stock_esg_hz_sina()](#华证指数) - 新浪财经-ESG评级中心-ESG评级-华证指数
- [ak.fund_name_em()](#基金基本信息) - 东方财富网-天天基金网-基金数据-所有基金的基本信息数据
- [ak.fund_individual_basic_info_xq(symbol="000001")](#基金基本信息-雪球) - 雪球基金-基金详情
- [ak.fund_info_index_em(symbol="沪深指数", indicator="增强指数型")](#基金基本信息-指数型) - 东方财富网-天天基金网-基金数据-基金基本信息-指数型
- [ak.fund_purchase_em()](#基金申购状态) - 东方财富网站-天天基金网-基金数据-基金申购状态
- [ak.fund_etf_spot_em()](#ETF基金实时行情-东财) - 东方财富-ETF 实时行情
- [ak.fund_etf_spot_ths(date="20240620")](#ETF基金实时行情-同花顺) - 同花顺理财-基金数据-每日净值-ETF-实时行情
- [ak.fund_lof_spot_em()](#LOF基金实时行情-东财) - 东方财富-LOF 实时行情
- [ak.fund_etf_category_sina(symbol="封闭式基金")](#基金实时行情-新浪) - 新浪财经-基金列表及行情数据
- [ak.fund_etf_hist_min_em()](#ETF基金分时行情-东财) - 东方财富-ETF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置
- [ak.fund_lof_hist_min_em()](#LOF基金分时行情-东财) - 东方财富-LOF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置
- [ak.fund_etf_hist_em()](#ETF基金历史行情-东财) - 东方财富-ETF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取
- [ak.fund_lof_hist_em()](#LOF基金历史行情-东财) - 东方财富-LOF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取
- [ak.fund_etf_hist_sina(symbol="sh510050")](#基金历史行情-新浪) - 新浪财经-基金行情的日频率行情数据
- [ak.fund_open_fund_daily_em()](#开放式基金-实时数据) - 东方财富网-天天基金网-基金数据, 此接口在每个交易日 16:00-23:00 更新当日的最新开放式基金净值数据
- [ak.fund_open_fund_info_em()](#开放式基金-历史数据) - 东方财富网-天天基金网-基金数据-具体基金信息
- [ak.fund_money_fund_daily_em()](#货币型基金-实时数据) - 东方财富网-天天基金网-基金数据-货币型基金收益, 此接口数据每个交易日 16:00～23:00
- [ak.fund_money_fund_info_em(symbol="000009")](#货币型基金-历史数据) - 东方财富网-天天基金网-基金数据-货币型基金-历史净值
- [ak.fund_financial_fund_daily_em()](#理财型基金-实时数据) - 东方财富网-天天基金网-基金数据-理财型基金-实时数据, 此接口数据每个交易日 16:00～23:00 更新
- [ak.fund_financial_fund_info_em(symbol="000134")](#理财型基金-历史数据) - 东方财富网站-天天基金网-基金数据-理财型基金收益-历史净值明细
- [ak.fund_graded_fund_daily_em()](#分级基金-实时数据) - 东方财富网-天天基金网-基金数据-分级基金-实时数据, 此接口数据每个交易日 16:00～23:00
- [ak.fund_graded_fund_info_em(symbol="150232")](#分级基金-历史数据) - 东方财富网站-天天基金网-基金数据-分级基金-历史数据
- [ak.fund_etf_fund_daily_em()](#场内交易基金-实时数据) - 东方财富网站-天天基金网-基金数据-场内交易基金-实时数据, 此接口数据每个交易日 16:00～23:00
- [ak.fund_etf_fund_info_em(fund="511280", start_date="20000101", end_date="20500101")](#场内交易基金-历史数据) - 东方财富网站-天天基金网-基金数据-场内交易基金-历史净值数据
- [ak.fund_hk_fund_hist_em()](#香港基金-历史数据) - 东方财富网站-天天基金网-基金数据-香港基金-历史净值明细
- [ak.fund_fh_em(year="2025")](#基金分红) - 天天基金网-基金数据-分红送配-基金分红
- [ak.fund_cf_em(year="2025")](#基金拆分) - 天天基金网-基金数据-分红送配-基金拆分
- [ak.fund_fh_rank_em(2025)](#基金分红排行) - 天天基金网-基金数据-分红送配-基金分红排行
- [ak.fund_open_fund_rank_em(symbol="全部")](#开放式基金排行) - 东方财富网-数据中心-开放式基金排行
- [ak.fund_exchange_rank_em()](#场内交易基金排行榜) - 东方财富网-数据中心-场内交易基金排行榜
- [ak.fund_money_rank_em()](#货币型基金排行) - 东方财富网-数据中心-货币型基金排行
- [ak.fund_lcx_rank_em()](#理财基金排行) - 东方财富网-数据中心-理财基金排行, 每个交易日17点后更新, 货币基金的单位净值均为 1.0000 元，最新一年期定存利率: 1.50%
- [ak.fund_hk_rank_em()](#香港基金排行) - 东方财富网-数据中心-基金排行-香港基金排行
- [ak.fund_individual_achievement_xq(symbol="000001")](#基金业绩-雪球) - 雪球基金-基金详情-基金业绩-详情
- [ak.fund_value_estimation_em(symbol="混合型")](#净值估算) - 东方财富网-数据中心-净值估算
- [ak.fund_individual_analysis_xq(symbol="000001")](#基金数据分析) - 雪球基金-基金详情-数据分析
- [ak.fund_individual_profit_probability_xq(symbol="000001")](#基金盈利概率) - 雪球基金-基金详情-盈利概率；历史任意时点买入，持有满X时间，盈利概率，以及平均收益
- [ak.fund_individual_detail_hold_xq(symbol="002804", date="20231231")](#基金持仓资产比例) - 雪球基金-基金详情-基金持仓-详情
- [ak.fund_overview_em(symbol="015641")](#基金基本概况) - 天天基金-基金档案-基本概况
- [ak.fund_fee_em(symbol="015641", indicator="认购费率")](#基金交易费率) - 天天基金-基金档案-购买信息
- [ak.fund_individual_detail_info_xq(symbol="000001")](#基金交易规则) - 雪球基金-基金详情-基金交易规则
- [ak.fund_portfolio_hold_em(symbol="000001", date="2024")](#基金持仓) - 天天基金网-基金档案-投资组合-基金持仓
- [ak.fund_portfolio_bond_hold_em(symbol="000001", date="2023")](#债券持仓) - 天天基金网-基金档案-投资组合-债券持仓
- [ak.fund_portfolio_industry_allocation_em(symbol="000001", date="2023")](#行业配置) - 天天基金网-基金档案-投资组合-行业配置
- [ak.fund_portfolio_change_em(symbol="003567", indicator="累计买入", date="2023")](#重大变动) - 天天基金网-基金档案-投资组合-重大变动
- [ak.fund_rating_all()](#基金评级总汇) - 天天基金网-基金评级-基金评级总汇
- [ak.fund_rating_sh(date=&#39;20230630&#39;)](#上海证券评级) - 天天基金网-基金评级-上海证券评级
- [ak.fund_rating_zs(date=&#39;20230331&#39;)](#招商证券评级) - 天天基金网-基金评级-招商证券评级
- [ak.fund_rating_ja(date=&#39;20200930&#39;)](#济安金信评级) - 天天基金网-基金评级-济安金信评级
- [ak.fund_manager_em()](#基金经理) - 天天基金网-基金数据-基金经理大全
- [ak.fund_new_found_em()](#新发基金) - 天天基金网-基金数据-新发基金-新成立基金
- [ak.fund_scale_open_sina(symbol=&#39;股票型基金&#39;)](#开放式基金) - 基金数据中心-基金规模-开放式基金
- [ak.fund_scale_close_sina()](#封闭式基金) - 基金数据中心-基金规模-封闭式基金
- [ak.fund_scale_structured_sina()](#分级子基金) - 基金数据中心-基金规模-分级子基金
- [ak.fund_aum_em()](#基金规模详情) - 天天基金网-基金数据-基金规模
- [ak.fund_aum_trend_em()](#基金规模走势) - 天天基金网-基金数据-市场全部基金规模走势
- [ak.fund_aum_hist_em(year="2023")](#基金公司历年管理规模) - 天天基金网-基金数据-基金公司历年管理规模排行列表
- [ak.reits_realtime_em()](#REITs-实时行情) - 东方财富网-行情中心-REITs-沪深 REITs-实时行情
- [ak.reits_hist_em(symbol="508097")](#REITs-历史行情) - 东方财富网-行情中心-REITs-沪深 REITs-历史行情
- [ak.fund_report_stock_cninfo(date="20210630")](#基金重仓股) - 巨潮资讯-数据中心-专题统计-基金报表-基金重仓股
- [ak.fund_report_industry_allocation_cninfo(date="20210630")](#基金行业配置) - 巨潮资讯-数据中心-专题统计-基金报表-基金行业配置
- [ak.fund_report_asset_allocation_cninfo()](#基金资产配置) - 巨潮资讯-数据中心-专题统计-基金报表-基金资产配置
- [ak.fund_scale_change_em()](#规模变动) - 天天基金网-基金数据-规模份额-规模变动
- [ak.fund_hold_structure_em()](#持有人结构) - 天天基金网-基金数据-规模份额-持有人结构
- [ak.fund_stock_position_lg()](#股票型基金仓位) - 乐咕乐股-基金仓位-股票型基金仓位
- [ak.fund_balance_position_lg()](#平衡混合型基金仓位) - 乐咕乐股-基金仓位-平衡混合型基金仓位
- [ak.fund_linghuo_position_lg()](#灵活配置型基金仓位) - 乐咕乐股-基金仓位-灵活配置型基金仓位
- [ak.fund_announcement_dividend_em(symbol="000001")](#分红配送) - 东方财富网站-天天基金网-基金档案-基金公告-分红配送
- [ak.fund_announcement_report_em(symbol="000001")](#定期报告) - 东方财富网站-天天基金网-基金档案-基金公告-定期报告
- [ak.fund_announcement_personnel_em(symbol="000001")](#人事公告) - 东方财富网站-天天基金网-基金档案-基金公告-人事调整
- [ak.bond_info_cm(bond_name="", bond_code="", bond_issue="", bond_type="短期融资券", coupon_type="零息式", issue_year="2019", grade="A-1", underwriter="重庆农村商业银行股份有限公司")](#债券查询) - 中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询
- [ak.bond_info_detail_cm(symbol="19万林投资CP001")](#债券基础信息) - 中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询-债券详情
- [ak.bond_cash_summary_sse(date=&#39;20210111&#39;)](#债券现券市场概览) - 上登债券信息网-市场数据-市场统计-市场概览-债券现券市场概览
- [ak.bond_deal_summary_sse(date=&#39;20210104&#39;)](#债券成交概览) - 上登债券信息网-市场数据-市场统计-市场概览-债券成交概览
- [ak.bond_debt_nafmii(page="2")](#银行间市场债券发行基础数据) - 中国银行间市场交易商协会-非金融企业债务融资工具注册信息系统
- [ak.bond_spot_quote()](#现券市场做市报价) - 中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场做市报价
- [ak.bond_spot_deal()](#现券市场成交行情) - 中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场成交行情
- [ak.bond_china_yield(start_date="20210201", end_date="20220201")](#国债及其他债券收益率曲线) - 中国债券信息网-国债及其他债券收益率曲线
- [ak.bond_zh_hs_spot(start_page="1", end_page="5")](#实时行情数据) - 新浪财经-债券-沪深债券-实时行情数据
- [ak.bond_zh_hs_daily(symbol="sh010107")](#历史行情数据) - 新浪财经-债券-沪深债券-历史行情数据, 历史数据按日频率更新
- [ak.bond_cb_profile_sina(symbol="sz128039")](#可转债-详情资料) - 新浪财经-债券-可转债-详情资料
- [ak.bond_cb_summary_sina(symbol="sh155255")](#可转债-债券概况) - 新浪财经-债券-可转债-债券概况
- [ak.bond_zh_hs_cov_spot()](#实时行情数据) - 新浪财经-沪深可转债数据
- [ak.bond_zh_hs_cov_daily(symbol="sz128039")](#历史行情数据-日频) - 新浪财经-历史行情数据，日频率更新, 新上的标的需要次日更新数据
- [ak.bond_zh_hs_cov_min()](#历史行情数据-分时) - 东方财富网-可转债-分时行情
- [ak.bond_zh_hs_cov_pre_min(symbol="sh113570")](#历史行情数据-盘前分时) - 东方财富网-可转债-分时行情-盘前分时
- [ak.bond_zh_cov()](#可转债数据一览表) - 东方财富网-数据中心-新股数据-可转债数据一览表
- [ak.bond_zh_cov_info(symbol="123121", indicator="基本信息")](#可转债详情) - 东方财富网-数据中心-新股数据-可转债详情
- [ak.bond_zh_cov_info_ths()](#可转债详情-同花顺) - 同花顺-数据中心-可转债
- [ak.bond_cov_comparison()](#可转债比价表) - 东方财富网-行情中心-债券市场-可转债比价表
- [ak.bond_zh_cov_value_analysis(symbol="113527")](#可转债价值分析) - 东方财富网-行情中心-新股数据-可转债数据-可转债价值分析
- [ak.bond_zh_cov_value_analysis(symbol="113527")](#可转债溢价率分析) - 东方财富网-行情中心-新股数据-可转债数据-可转债溢价率分析
- [ak.bond_sh_buy_back_em()](#上证质押式回购) - 东方财富网-行情中心-债券市场-上证质押式回购
- [ak.bond_sz_buy_back_em()](#深证质押式回购) - 东方财富网-行情中心-债券市场-深证质押式回购
- [ak.bond_buy_back_hist_em(symbol="204001")](#质押式回购历史数据) - 东方财富网-行情中心-债券市场-质押式回购-历史数据
- [ak.bond_cb_jsl(cookie="您的集思录 cookie")](#可转债实时数据-集思录) - 集思录可转债实时数据，包含行情数据（涨跌幅，成交量和换手率等）及可转债基本信息（转股价，溢价率和到期收益率等）
- [ak.bond_cb_redeem_jsl()](#可转债强赎) - 集思录可转债-强赎
- [ak.bond_cb_index_jsl()](#集思录可转债等权指数) - 可转债-集思录可转债等权指数
- [ak.bond_cb_adj_logs_jsl(symbol="128013")](#可转债转股价格调整记录-集思录) - 集思录-单个可转债的转股价格-调整记录
- [ak.bond_china_close_return(symbol="国债", period="1", start_date="20231101", end_date="20231101")](#收盘收益率曲线历史数据) - 收盘收益率曲线历史数据, 该接口只能获取近 3 个月的数据，且每次获取的数据不超过 1 个月
- [ak.bond_zh_us_rate(start_date="19901219")](#中美国债收益率) - 东方财富网-数据中心-经济数据-中美国债收益率历史数据
- [ak.bond_treasure_issue_cninfo(start_date="20210910", end_date="20211109")](#国债发行) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-国债发行
- [ak.bond_local_government_issue_cninfo(start_date="20210911", end_date="20211110")](#地方债发行) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-地方债发行
- [ak.bond_corporate_issue_cninfo(start_date="20210911", end_date="20211110")](#企业债发行) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-企业债发行
- [ak.bond_cov_issue_cninfo(start_date="20210913", end_date="20211112")](#可转债发行) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债发行
- [ak.bond_cov_stock_issue_cninfo()](#可转债转股) - 巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债转股
- [ak.bond_new_composite_index_cbond(indicator="财富", period="总值")](#新综合指数) - 中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-新综合指数
- [ak.bond_composite_index_cbond(indicator="财富", period="总值")](#综合指数) - 中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-综合指数

---
# 上海证券交易所

## api call
ak.stock_sse_summary()

## response
```json
{
  "metadata": {
    "description": "上海证券交易所-股票数据总貌",
    "data_structure": []
  },
  "sample_data": {
    "description": "上海证券交易所-股票数据总貌",
    "data": [],
    "summary": {}
  }
}
```# 证券类别统计

## api call
ak.stock_szse_summary(date="20200619")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20200619"; 当前交易日的数据需要交易所收盘后统计 |

## response
```json
{
  "metadata": {
    "description": "深圳证券交易所-市场总貌-证券类别统计",
    "data_structure": [
      {
        "field": "证券类别",
        "type": "object",
        "description": "-"
      },
      {
        "field": "数量",
        "type": "int64",
        "description": "注意单位: 只"
      },
      {
        "field": "成交金额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "深圳证券交易所-市场总貌-证券类别统计",
    "data": [],
    "summary": {}
  }
}
```# 地区交易排序

## api call
ak.stock_szse_area_summary()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="202203"; 年月 |

## response
```json
{
  "metadata": {
    "description": "深圳证券交易所-市场总貌-地区交易排序",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "地区",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总交易额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "占市场",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "股票交易额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "基金交易额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "债券交易额",
        "type": "float64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "深圳证券交易所-市场总貌-地区交易排序",
    "data": [],
    "summary": {}
  }
}
```# 股票行业成交

## api call
ak.stock_szse_sector_summary(symbol="当年", date="202501")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="当月"; choice of {"当月", "当年"} |
| date | str | date="202501"; 年月 |

## response
```json
{
  "metadata": {
    "description": "深圳证券交易所-统计资料-股票行业成交数据",
    "data_structure": [
      {
        "field": "项目名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "项目名称-英文",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易天数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交金额-人民币元",
        "type": "int64",
        "description": ""
      },
      {
        "field": "成交金额-占总计",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成交股数-股数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交股数-占总计",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成交笔数-笔",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交笔数-占总计",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "深圳证券交易所-统计资料-股票行业成交数据",
    "data": [],
    "summary": {}
  }
}
```# 上海证券交易所-每日概况

## api call
ak.stock_sse_deal_daily(date="20250221")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20250221"; 当前交易日的数据需要交易所收盘后统计; 注意仅支持获取在 20211227（包含）之后的数据 |

## response
```json
{
  "metadata": {
    "description": "上海证券交易所-数据-股票数据-成交概况-股票成交概况-每日股票情况",
    "data_structure": [
      {
        "field": "单日情况",
        "type": "object",
        "description": "包含了网页所有字段"
      },
      {
        "field": "股票",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主板A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主板B",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "科创板",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股票回购",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "上海证券交易所-数据-股票数据-成交概况-股票成交概况-每日股票情况",
    "data": [],
    "summary": {}
  }
}
```# 个股信息查询-东财

## api call
ak.stock_individual_info_em(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="603777"; 股票代码 |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "东方财富-个股-股票信息",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-个股-股票信息",
    "data": [],
    "summary": {}
  }
}
```# 个股信息查询-雪球

## api call
ak.stock_individual_basic_info_xq(symbol="SH601127")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH601127"; 股票代码 |
| token | str | token=None; |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球财经-个股-公司概况-公司简介",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "雪球财经-个股-公司概况-公司简介",
    "data": [],
    "summary": {}
  }
}
```# 行情报价

## api call
ak.stock_bid_ask_em(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-行情报价",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-行情报价",
    "data": [],
    "summary": {}
  }
}
```# 沪深京 A 股

## api call
ak.stock_zh_a_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-沪深京 A 股-实时行情数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5分钟涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "60日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年初至今涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-沪深京 A 股-实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 沪 A 股

## api call
ak.stock_sh_a_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-沪 A 股-实时行情数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5分钟涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "60日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年初至今涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-沪 A 股-实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 深 A 股

## api call
ak.stock_sz_a_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-深 A 股-实时行情数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5分钟涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "60日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年初至今涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-深 A 股-实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 京 A 股

## api call
ak.stock_bj_a_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-京 A 股-实时行情数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5分钟涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "60日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年初至今涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-京 A 股-实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 新股

## api call
ak.stock_new_a_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-新股-实时行情数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上市时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5分钟涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "60日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年初至今涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-新股-实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 创业板

## api call
ak.stock_cy_a_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-创业板-实时行情",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5分钟涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "60日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年初至今涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-创业板-实时行情",
    "data": [],
    "summary": {}
  }
}
```# 科创板

## api call
ak.stock_kc_a_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-科创板-实时行情",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5分钟涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "60日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年初至今涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-科创板-实时行情",
    "data": [],
    "summary": {}
  }
}
```# AB 股比价

## api call
ak.stock_zh_ab_comparison_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-沪深京个股-AB股比价-全部AB股比价",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "B股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "B股名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价B",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅B",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "A股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "A股名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "比价",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-沪深京个股-AB股比价-全部AB股比价",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-新浪

## api call
ak.stock_zh_a_spot()

## response
```json
{
  "metadata": {
    "description": "新浪财经-沪深京 A 股数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "买入",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖出",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "时间戳",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-沪深京 A 股数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-雪球

## api call
ak.stock_individual_spot_xq(symbol="SH600000")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH600000"; 证券代码，可以是 A 股个股代码，A 股场内基金代码，A 股指数，美股代码, 美股指数 |
| token | float | token=None; 默认不设置token |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球-行情中心-个股",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "雪球-行情中心-个股",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-东财

## api call
ak.stock_zh_a_hist()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='603777'; 股票代码可以在 ak.stock_zh_a_spot_em() 中获取 |
| period | str | period='daily'; choice of {'daily', 'weekly', 'monthly'} |
| start_date | str | start_date='20210301'; 开始查询的日期 |
| end_date | str | end_date='20210616'; 结束查询的日期 |
| adjust | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据 |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "东方财富-沪深京 A 股日频率数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富-沪深京 A 股日频率数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-新浪

## api call
ak.stock_zh_a_daily()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='sh600000'; 股票代码可以在 ak.stock_zh_a_spot() 中获取 |
| start_date | str | start_date='20201103'; 开始查询的日期 |
| end_date | str | end_date='20201116'; 结束查询的日期 |
| adjust | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; hfq-factor: 返回后复权因子; qfq-factor: 返回前复权因子 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-沪深京 A 股的数据, 历史数据按日频率更新; 注意其中的 sh689009 为 CDR, 请 通过 ak.stock_zh_a_cdr_daily 接口获取",
    "data_structure": []
  },
  "sample_data": {
    "description": "新浪财经-沪深京 A 股的数据, 历史数据按日频率更新; 注意其中的 sh689009 为 CDR, 请 通过 ak.stock_zh_a_cdr_daily 接口获取",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-腾讯

## api call
ak.stock_zh_a_hist_tx()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='sz000001'; 带市场标识 |
| start_date | str | start_date='19000101'; 开始查询的日期 |
| end_date | str | end_date='20500101'; 结束查询的日期 |
| adjust | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据 |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "腾讯证券-日频-股票历史数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取",
    "data_structure": []
  },
  "sample_data": {
    "description": "腾讯证券-日频-股票历史数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取",
    "data": [],
    "summary": {}
  }
}
```# 分时数据-新浪

## api call
ak.stock_zh_a_minute(symbol=&#39;sh600751&#39;, period=&#39;1&#39;, adjust="qfq")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='sh000300'; 同日频率数据接口 |
| period | str | period='1'; 获取 1, 5, 15, 30, 60 分钟的数据频率 |
| adjust | str | adjust=""; 默认为空: 返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; |

## response
```json
{
  "metadata": {
    "description": "新浪财经-沪深京 A 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权",
    "data_structure": [
      {
        "field": "day",
        "type": "object",
        "description": "-"
      },
      {
        "field": "open",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "high",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "low",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "volume",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-沪深京 A 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权",
    "data": [],
    "summary": {}
  }
}
```# 分时数据-东财

## api call
ak.stock_zh_a_hist_min_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='000300'; 股票代码 |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据 |
| end_date | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据 |
| period | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 5 个交易日数据且不复权 |
| adjust | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 5 个交易日数据且不复权 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情首页-沪深京 A 股-每日分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-行情首页-沪深京 A 股-每日分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置",
    "data": [],
    "summary": {}
  }
}
```# 日内分时数据-东财

## api call
ak.stock_intraday_em(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-分时数据",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成交价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "手数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "买卖盘性质",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-分时数据",
    "data": [],
    "summary": {}
  }
}
```# 日内分时数据-新浪

## api call
ak.stock_intraday_sina(symbol="sz000001", date="20240321")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="sz000001"; 带市场标识的股票代码 |
| date | str | date="20240321"; 交易日 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-日内分时数据",
    "data_structure": [
      {
        "field": "symbol",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ticktime",
        "type": "object",
        "description": "-"
      },
      {
        "field": "price",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "volume",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "prev_price",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "kind",
        "type": "object",
        "description": "D 表示卖盘，表示 是买盘"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-日内分时数据",
    "data": [],
    "summary": {}
  }
}
```# 盘前数据

## api call
ak.stock_zh_a_hist_pre_min_em(symbol="000001", start_time="09:00:00", end_time="15:40:00")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 股票代码 |
| start_time | str | start_time="09:00:00"; 时间; 默认返回所有数据 |
| end_time | str | end_time="15:40:00"; 时间; 默认返回所有数据 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票行情-盘前数据",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票行情-盘前数据",
    "data": [],
    "summary": {}
  }
}
```# 腾讯财经

## api call
ak.stock_zh_a_tick_tx_js(symbol="sz000001")

## response
```json
{
  "metadata": {
    "description": "每个交易日 16:00 提供当日数据; 如遇到数据缺失, 请使用 ak.stock_zh_a_tick_163() 接口(注意数据会有一定差异)",
    "data_structure": [
      {
        "field": "成交时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成交价格",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "价格变动",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "成交量",
        "type": "int32",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "int32",
        "description": "注意单位: 元"
      },
      {
        "field": "性质",
        "type": "object",
        "description": "买卖盘标记"
      }
    ]
  },
  "sample_data": {
    "description": "每个交易日 16:00 提供当日数据; 如遇到数据缺失, 请使用 ak.stock_zh_a_tick_163() 接口(注意数据会有一定差异)",
    "data": [],
    "summary": {}
  }
}
```# 成长性比较

## api call
ak.stock_zh_growth_comparison_em(symbol="SZ000895")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000895" |

## response
```json
{
  "metadata": {
    "description": "东方财富-行情中心-同行比较-成长性比较",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基本每股收益增长率-3年复合",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "基本每股收益增长率-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "基本每股收益增长率-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "基本每股收益增长率-25E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "基本每股收益增长率-26E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "基本每股收益增长率-27E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业收入增长率-3年复合",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业收入增长率-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业收入增长率-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业收入增长率-25E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业收入增长率-26E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业收入增长率-27E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润增长率-3年复合",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润增长率-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润增长率-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润增长率-25E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润增长率-26E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润增长率-27E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "基本每股收益增长率-3年复合排名",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-行情中心-同行比较-成长性比较",
    "data": [],
    "summary": {}
  }
}
```# 估值比较

## api call
ak.stock_zh_valuation_comparison_em(symbol="SZ000895")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000895" |

## response
```json
{
  "metadata": {
    "description": "东方财富-行情中心-同行比较-估值比较",
    "data_structure": [
      {
        "field": "排名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "PEG",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市盈率-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市盈率-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市盈率-25E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市盈率-26E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市盈率-27E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市销率-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市销率-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市销率-25E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市销率-26E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市销率-27E",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率-MRQ",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市现率1-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市现率1-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市现率2-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市现率2-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "EV/EBITDA-24A",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-行情中心-同行比较-估值比较",
    "data": [],
    "summary": {}
  }
}
```# 杜邦分析比较

## api call
ak.stock_zh_dupont_comparison_em(symbol="SZ000895")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000895" |

## response
```json
{
  "metadata": {
    "description": "东方财富-行情中心-同行比较-杜邦分析比较",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ROE-3年平均",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ROE-22A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ROE-23A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ROE-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利率-3年平均",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利率-22A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利率-23A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利率-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产周转率-3年平均",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产周转率-22A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产周转率-23A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产周转率-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "权益乘数-3年平均",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "权益乘数-22A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "权益乘数-23A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "权益乘数-24A",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ROE-3年平均排名",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-行情中心-同行比较-杜邦分析比较",
    "data": [],
    "summary": {}
  }
}
```# 公司规模

## api call
ak.stock_zh_scale_comparison_em(symbol="SZ000895")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000895" |

## response
```json
{
  "metadata": {
    "description": "东方财富-行情中心-同行比较-公司规模",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流通市值排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业收入",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业收入排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "净利润",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润排名",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-行情中心-同行比较-公司规模",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据

## api call
ak.stock_zh_a_cdr_daily(symbol=&#39;sh689009&#39;, start_date=&#39;20201103&#39;, end_date=&#39;20201116&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='sh689009'; CDR 股票代码 |
| start_date | str | start_date='20201103' |
| end_date | str | end_date='20201116' |

## response
```json
{
  "metadata": {
    "description": "上海证券交易所-科创板-CDR",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "交易日"
      },
      {
        "field": "open",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "high",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "low",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "volume",
        "type": "float64",
        "description": "注意单位: 手"
      }
    ]
  },
  "sample_data": {
    "description": "上海证券交易所-科创板-CDR",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-东财

## api call
ak.stock_zh_b_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-实时行情数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5分钟涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "60日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年初至今涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-新浪

## api call
ak.stock_zh_b_spot()

## response
```json
{
  "metadata": {
    "description": "B 股数据是从新浪财经获取的数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔",
    "data_structure": []
  },
  "sample_data": {
    "description": "B 股数据是从新浪财经获取的数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据

## api call
ak.stock_zh_b_daily()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='sh900901'; 股票代码可以在 ak.stock_zh_b_spot() 中获取 |
| start_date | str | start_date='20201103'; 开始查询的日期 |
| end_date | str | end_date='20201116'; 结束查询的日期 |
| adjust | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; hfq-factor: 返回后复权因子; qfq-factor: 返回前复权因子 |

## response
```json
{
  "metadata": {
    "description": "B 股数据是从新浪财经获取的数据, 历史数据按日频率更新",
    "data_structure": []
  },
  "sample_data": {
    "description": "B 股数据是从新浪财经获取的数据, 历史数据按日频率更新",
    "data": [],
    "summary": {}
  }
}
```# 分时数据

## api call
ak.stock_zh_b_minute(symbol=&#39;sh900901&#39;, period=&#39;1&#39;, adjust="qfq")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='sh900901'; 同日频率数据接口 |
| period | str | period='1'; 获取 1, 5, 15, 30, 60 分钟的数据频率 |
| adjust | str | adjust=""; 默认为空: 返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; |

## response
```json
{
  "metadata": {
    "description": "新浪财经 B 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权",
    "data_structure": [
      {
        "field": "day",
        "type": "object",
        "description": "-"
      },
      {
        "field": "open",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "high",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "low",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "volume",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经 B 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权",
    "data": [],
    "summary": {}
  }
}
```# 次新股

## api call
ak.stock_zh_a_new()

## response
```json
{
  "metadata": {
    "description": "新浪财经-行情中心-沪深股市-次新股",
    "data_structure": [
      {
        "field": "symbol",
        "type": "object",
        "description": "新浪代码"
      },
      {
        "field": "code",
        "type": "object",
        "description": "股票代码"
      },
      {
        "field": "open",
        "type": "float64",
        "description": "开盘价"
      },
      {
        "field": "high",
        "type": "float64",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "float64",
        "description": "最低价"
      },
      {
        "field": "volume",
        "type": "int64",
        "description": "成交量"
      },
      {
        "field": "amount",
        "type": "int64",
        "description": "成交额"
      },
      {
        "field": "mktcap",
        "type": "float64",
        "description": "市值"
      },
      {
        "field": "turnoverratio",
        "type": "float64",
        "description": "换手率"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-行情中心-沪深股市-次新股",
    "data": [],
    "summary": {}
  }
}
```# 公司动态

## api call
ak.stock_gsrl_gsdt_em(date="20230808")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20230808"; 交易日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股市日历-公司动态",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "事件类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "具体事项",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易日",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股市日历-公司动态",
    "data": [],
    "summary": {}
  }
}
```# 风险警示板

## api call
ak.stock_zh_a_st_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-沪深个股-风险警示板",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-沪深个股-风险警示板",
    "data": [],
    "summary": {}
  }
}
```# 新股

## api call
ak.stock_zh_a_new_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-沪深个股-新股",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-沪深个股-新股",
    "data": [],
    "summary": {}
  }
}
```# 新股上市首日

## api call
ak.stock_xgsr_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-新股数据-新股上市首日",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "首日开盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "首日收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "首日最高价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "首日最低价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "首日涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "是否破发",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-新股数据-新股上市首日",
    "data": [],
    "summary": {}
  }
}
```# IPO 受益股

## api call
ak.stock_ipo_benefit_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-新股数据-IPO受益股",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市值",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "参股家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "投资总额",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "投资占市值比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "参股对象",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-新股数据-IPO受益股",
    "data": [],
    "summary": {}
  }
}
```# 两网及退市

## api call
ak.stock_zh_a_stop_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-沪深个股-两网及退市",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-沪深个股-两网及退市",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据

## api call
ak.stock_zh_kcb_spot()

## response
```json
{
  "metadata": {
    "description": "新浪财经-科创板股票实时行情数据",
    "data_structure": []
  },
  "sample_data": {
    "description": "新浪财经-科创板股票实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据

## api call
ak.stock_zh_kcb_daily(symbol="sh688399", adjust="hfq")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="sh688008"; 带市场标识的股票代码 |
| adjust | str | 默认不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; hfq-factor: 返回后复权因子; qfq-factor: 返回前复权因子 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-科创板股票历史行情数据",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "收盘价"
      },
      {
        "field": "high",
        "type": "float64",
        "description": "最高价"
      },
      {
        "field": "low",
        "type": "float64",
        "description": "最低价"
      },
      {
        "field": "open",
        "type": "float64",
        "description": "开盘价"
      },
      {
        "field": "volume",
        "type": "float64",
        "description": "成交量(股)"
      },
      {
        "field": "after_volume",
        "type": "float64",
        "description": "盘后量; 参见科创板盘后固定价格交易"
      },
      {
        "field": "after_amount",
        "type": "float64",
        "description": "盘后额; 参见科创板盘后固定价格交易"
      },
      {
        "field": "outstanding_share",
        "type": "float64",
        "description": "流通股本(股)"
      },
      {
        "field": "turnover",
        "type": "float64",
        "description": "换手率=成交量(股)/流通股本(股)"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-科创板股票历史行情数据",
    "data": [],
    "summary": {}
  }
}
```# 科创板公告

## api call
ak.stock_zh_kcb_report_em(from_page=1, to_page=100)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| from_page | int | from_page=1; 始获取的页码 |
| to_page | int | to_page=100; 结束获取的页码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-科创板报告数据",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告代码",
        "type": "object",
        "description": "本代码可以用来获取公告详情: http://data.eastmoney.com/notices/detail/688595/{替换到此处}.html"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-科创板报告数据",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-东财

## api call
ak.stock_zh_ah_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-沪深港通-AH股比价-实时行情, 延迟 15 分钟更新",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "H股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价-HKD",
        "type": "float64",
        "description": "注意单位: HKD"
      },
      {
        "field": "H股-涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "A股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价-RMB",
        "type": "float64",
        "description": "注意单位: RMB"
      },
      {
        "field": "A股-涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "比价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "溢价",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-沪深港通-AH股比价-实时行情, 延迟 15 分钟更新",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-腾讯

## api call
ak.stock_zh_ah_spot()

## response
```json
{
  "metadata": {
    "description": "A+H 股数据是从腾讯财经获取的数据, 延迟 15 分钟更新",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "买入",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖出",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "A+H 股数据是从腾讯财经获取的数据, 延迟 15 分钟更新",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据

## api call
ak.stock_zh_ah_daily(symbol="02318", start_year="2022", end_year="2024", adjust="")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="02318"; 港股股票代码, 可以通过 ak.stock_zh_ah_name() 函数获取 |
| start_year | str | start_year="2000"; 开始年份 |
| end_year | str | end_year="2019"; 结束年份 |
| adjust | str | adjust=""; 默认为空不复权; 'qfq': 前复权, 'hfq': 后复权 |

## response
```json
{
  "metadata": {
    "description": "腾讯财经-A+H 股数据",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "腾讯财经-A+H 股数据",
    "data": [],
    "summary": {}
  }
}
```# A+H股票字典

## api call
ak.stock_zh_ah_name()

## response
```json
{
  "metadata": {
    "description": "A+H 股数据是从腾讯财经获取的数据, 历史数据按日频率更新",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "A+H 股数据是从腾讯财经获取的数据, 历史数据按日频率更新",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-东财

## api call
ak.stock_us_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-美股-实时行情",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "开盘价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最高价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最低价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "昨收价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "注意: 用来获取历史数据的代码"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-美股-实时行情",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-新浪

## api call
ak.stock_us_spot()

## response
```json
{
  "metadata": {
    "description": "新浪财经-美股; 获取的数据有 15 分钟延迟; 建议使用 ak.stock_us_spot_em() 来获取数据",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "新浪默认"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-美股; 获取的数据有 15 分钟延迟; 建议使用 ak.stock_us_spot_em() 来获取数据",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-东财

## api call
ak.stock_us_hist(symbol=&#39;106.TTE&#39;, period="daily", start_date="20200101", end_date="20240214", adjust="qfq")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | 美股代码, 可以通过 ak.stock_us_spot_em() 函数返回所有的 pandas.DataFrame 里面的 代码 字段获取 |
| period | str | period='daily'; choice of {'daily', 'weekly', 'monthly'} |
| start_date | str | start_date="20210101" |
| end_date | str | end_date="20210601" |
| adjust | str | 默认 adjust="", 则返回未复权的数据; adjust="qfq" 则返回前复权的数据, adjust="hfq" 则返回后复权的数据 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情-美股-每日行情",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "成交量",
        "type": "int32",
        "description": "注意单位: 股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情-美股-每日行情",
    "data": [],
    "summary": {}
  }
}
```# 个股信息查询-雪球

## api call
ak.stock_individual_basic_info_us_xq(symbol="SH601127")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="NVDA"; 股票代码 |
| token | str | token=None; |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球-个股-公司概况-公司简介",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "雪球-个股-公司概况-公司简介",
    "data": [],
    "summary": {}
  }
}
```# 分时数据-东财

## api call
ak.stock_us_hist_min_em(symbol="105.ATER")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="105.ATER"; 美股代码可以通过 ak.stock_us_spot_em() 函数返回所有的 pandas.DataFrame 里面的 代码 字段获取 |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据 |
| end_date | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情首页-美股-每日分时行情",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 美元"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情首页-美股-每日分时行情",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-新浪

## api call
ak.stock_us_daily()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | 美股代码, 可以通过 ak.get_us_stock_name() 函数返回所有美股代码, 由于美股数据量大, 建议按需要获取 |
| adjust | str | adjust="qfq" 则返回前复权后的数据，默认 adjust="", 则返回未复权的数据 |

## response
```json
{
  "metadata": {
    "description": "美股历史行情数据，设定 adjust="qfq" 则返回前复权后的数据，默认 adjust="", 则返回未复权的数据，历史数据按日频率更新",
    "data_structure": []
  },
  "sample_data": {
    "description": "美股历史行情数据，设定 adjust="qfq" 则返回前复权后的数据，默认 adjust="", 则返回未复权的数据，历史数据按日频率更新",
    "data": [],
    "summary": {}
  }
}
```# 粉单市场

## api call
ak.stock_us_pink_spot_em()

## response
```json
{
  "metadata": {
    "description": "美股粉单市场的实时行情数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "开盘价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最高价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最低价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "昨收价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "注意: 用来获取历史数据的代码"
      }
    ]
  },
  "sample_data": {
    "description": "美股粉单市场的实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 知名美股

## api call
ak.stock_us_famous_spot_em(symbol=&#39;科技类&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="科技类"; choice of {'科技类', '金融类', '医药食品类', '媒体类', '汽车能源类', '制造零售类'} |

## response
```json
{
  "metadata": {
    "description": "美股-知名美股的实时行情数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "开盘价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最高价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "最低价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "昨收价",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 美元"
      },
      {
        "field": "市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "注意: 用来获取历史数据的代码"
      }
    ]
  },
  "sample_data": {
    "description": "美股-知名美股的实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-东财

## api call
ak.stock_hk_spot_em()

## response
```json
{
  "metadata": {
    "description": "所有港股的实时行情数据; 该数据有 15 分钟延时",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 港元"
      }
    ]
  },
  "sample_data": {
    "description": "所有港股的实时行情数据; 该数据有 15 分钟延时",
    "data": [],
    "summary": {}
  }
}
```# 港股主板实时行情数据-东财

## api call
ak.stock_hk_main_board_spot_em()

## response
```json
{
  "metadata": {
    "description": "港股主板的实时行情数据; 该数据有 15 分钟延时",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 港元"
      }
    ]
  },
  "sample_data": {
    "description": "港股主板的实时行情数据; 该数据有 15 分钟延时",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据-新浪

## api call
ak.stock_hk_spot()

## response
```json
{
  "metadata": {
    "description": "获取所有港股的实时行情数据 15 分钟延时",
    "data_structure": [
      {
        "field": "日期时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "中文名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "英文名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "买一",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖一",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "获取所有港股的实时行情数据 15 分钟延时",
    "data": [],
    "summary": {}
  }
}
```# 个股信息查询-雪球

## api call
ak.stock_individual_basic_info_hk_xq(symbol="02097")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="02097"; 股票代码 |
| token | str | token=None; |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球-个股-公司概况-公司简介",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "雪球-个股-公司概况-公司简介",
    "data": [],
    "summary": {}
  }
}
```# 分时数据-东财

## api call
ak.stock_hk_hist_min_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="01611"; 港股代码可以通过 ak.stock_hk_spot_em() 函数返回所有的 pandas.DataFrame 里面的 代码 字段获取 |
| period | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 5 个交易日数据且不复权 |
| adjust | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 5 个交易日数据且不复权 |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据 |
| end_date | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情首页-港股-每日分时行情",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-行情首页-港股-每日分时行情",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-东财

## api call
ak.stock_hk_hist()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="00593"; 港股代码,可以通过 ak.stock_hk_spot_em() 函数返回所有港股代码 |
| period | str | period='daily'; choice of {'daily', 'weekly', 'monthly'} |
| start_date | str | start_date="19700101"; 开始日期 |
| end_date | str | end_date="22220101"; 结束日期 |
| adjust | str | adjust="": 返回未复权的数据, 默认; qfq: 返回前复权数据; hfq: 返回后复权数据; |

## response
```json
{
  "metadata": {
    "description": "港股-历史行情数据, 可以选择返回复权后数据, 更新频率为日频",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "港股-历史行情数据, 可以选择返回复权后数据, 更新频率为日频",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-新浪

## api call
ak.stock_hk_daily()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | 港股代码,可以通过 ak.stock_hk_spot() 函数返回所有港股代码 |
| adjust | str | "": 返回未复权的数据 ; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; qfq-factor: 返回前复权因子和调整; hfq-factor: 返回后复权因子和调整; |

## response
```json
{
  "metadata": {
    "description": "港股-历史行情数据, 可以选择返回复权后数据,更新频率为日频",
    "data_structure": []
  },
  "sample_data": {
    "description": "港股-历史行情数据, 可以选择返回复权后数据,更新频率为日频",
    "data": [],
    "summary": {}
  }
}
```# 知名港股

## api call
ak.stock_hk_famous_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-港股市场-知名港股实时行情数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "注意单位: 港元"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 港元"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-港股市场-知名港股实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 证券资料

## api call
ak.stock_hk_security_profile_em(symbol="03900")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="03900" |

## response
```json
{
  "metadata": {
    "description": "东方财富-港股-证券资料",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "发行量(股)",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "每手股数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "每股面值",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "板块",
        "type": "object",
        "description": "-"
      },
      {
        "field": "年结日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ISIN（国际证券识别编码）",
        "type": "object",
        "description": "-"
      },
      {
        "field": "是否沪港通标的",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-港股-证券资料",
    "data": [],
    "summary": {}
  }
}
```# 公司资料

## api call
ak.stock_hk_company_profile_em(symbol="03900")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="03900" |

## response
```json
{
  "metadata": {
    "description": "东方财富-港股-公司资料",
    "data_structure": [
      {
        "field": "公司名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "英文名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册地",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司成立日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "董事长",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司秘书",
        "type": "object",
        "description": "-"
      },
      {
        "field": "员工人数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "办公地址",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司网址",
        "type": "object",
        "description": "-"
      },
      {
        "field": "E-MAIL",
        "type": "object",
        "description": "-"
      },
      {
        "field": "年结日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "联系电话",
        "type": "object",
        "description": "-"
      },
      {
        "field": "核数师",
        "type": "object",
        "description": "-"
      },
      {
        "field": "传真",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司介绍",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-港股-公司资料",
    "data": [],
    "summary": {}
  }
}
```# 财务指标

## api call
ak.stock_hk_financial_indicator_em(symbol="03900")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="03900" |

## response
```json
{
  "metadata": {
    "description": "东方财富-港股-核心必读-最新指标",
    "data_structure": [
      {
        "field": "基本每股收益(元)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "每股净资产(元)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "法定股本(股)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "每手股",
        "type": "object",
        "description": "-"
      },
      {
        "field": "每股股息TTM(港元)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "派息比率(%)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "已发行股本(股)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "已发行股本-H股(股)",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "每股经营现金流(元)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股息率TTM(%)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总市值(港元)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "港股市值(港元)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "营业总收入",
        "type": "object",
        "description": "-"
      },
      {
        "field": "营业总收入滚动环比增长(%)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "销售净利率(%)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "净利润",
        "type": "object",
        "description": "-"
      },
      {
        "field": "净利润滚动环比增长(%)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东权益回报率(%)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "市盈率",
        "type": "object",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总资产回报率(%)",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-港股-核心必读-最新指标",
    "data": [],
    "summary": {}
  }
}
```# 分红派息

## api call
ak.stock_hk_dividend_payout_em(symbol="03900")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="03900" |

## response
```json
{
  "metadata": {
    "description": "东方财富-港股-核心必读-分红派息",
    "data_structure": [
      {
        "field": "最新公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "财政年度",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分红方案",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分配类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "除净日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "截至过户日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发放日",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-港股-核心必读-分红派息",
    "data": [],
    "summary": {}
  }
}
```# 成长性对比

## api call
ak.stock_hk_growth_comparison_em(symbol="03900")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="03900" |

## response
```json
{
  "metadata": {
    "description": "东方财富-港股-行业对比-成长性对比",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基本每股收益同比增长率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "基本每股收益同比增长率排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业收入同比增长率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业收入同比增长率排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业利润率同比增长率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业利润率同比增长率排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基本每股收总资产同比增长率益同比增长率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产同比增长率排名",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-港股-行业对比-成长性对比",
    "data": [],
    "summary": {}
  }
}
```# 估值对比

## api call
ak.stock_hk_valuation_comparison_em(symbol="03900")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="03900" |

## response
```json
{
  "metadata": {
    "description": "东方财富-港股-行业对比-估值对比",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "市盈率-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市盈率-TTM排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "市盈率-LYR",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市盈率-LYR排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "市净率-MRQ",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率-MRQ排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "市净率-LYR",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率-LYR排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "市销率-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市销率-TTM排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "市销率-LYR",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市销率-LYR排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "市现率-TTM",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市现率-TTM排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "市现率-LYR",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市现率-LYR排名",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-港股-行业对比-估值对比",
    "data": [],
    "summary": {}
  }
}
```# 规模对比

## api call
ak.stock_hk_scale_comparison_em(symbol="03900")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="03900" |

## response
```json
{
  "metadata": {
    "description": "东方财富-港股-行业对比-规模对比",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流通市值排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业总收入",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业总收入排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "净利润",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "净利润排名",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-港股-行业对比-规模对比",
    "data": [],
    "summary": {}
  }
}
```# 机构调研-统计

## api call
ak.stock_jgdy_tj_em(date="20210128")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20180928"; 开始查询的时间 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-机构调研-机构调研统计",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "接待机构数量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "接待方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "接待人员",
        "type": "object",
        "description": "-"
      },
      {
        "field": "接待地点",
        "type": "object",
        "description": "-"
      },
      {
        "field": "接待日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-机构调研-机构调研统计",
    "data": [],
    "summary": {}
  }
}
```# 机构调研-详细

## api call
ak.stock_jgdy_detail_em(date="20241211")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20241211"; 开始查询的时间 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-机构调研-机构调研详细",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "调研机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "机构类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "调研人员",
        "type": "object",
        "description": "-"
      },
      {
        "field": "接待方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "接待人员",
        "type": "object",
        "description": "-"
      },
      {
        "field": "接待地点",
        "type": "object",
        "description": "-"
      },
      {
        "field": "调研日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-机构调研-机构调研详细",
    "data": [],
    "summary": {}
  }
}
```# 主营介绍-同花顺

## api call
ak.stock_zyjs_ths(symbol="000066")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000066" |

## response
```json
{
  "metadata": {
    "description": "同花顺-主营介绍",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "主营业务",
        "type": "object",
        "description": "-"
      },
      {
        "field": "产品类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "产品名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "经营范围",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-主营介绍",
    "data": [],
    "summary": {}
  }
}
```# 主营构成-东财

## api call
ak.stock_zygc_em(symbol="SH688041")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH688041" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-个股-主营构成",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分类类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "主营构成",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "主营收入",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "收入比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主营成本",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "成本比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主营利润",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "利润比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "毛利率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-个股-主营构成",
    "data": [],
    "summary": {}
  }
}
```# 股权质押市场概况

## api call
ak.stock_gpzy_profile_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-股权质押-股权质押市场概况",
    "data_structure": [
      {
        "field": "交易日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "A股质押总比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "质押公司数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "质押笔数",
        "type": "float64",
        "description": "注意单位: 笔"
      },
      {
        "field": "质押总股数",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "质押总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "沪深300指数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-股权质押-股权质押市场概况",
    "data": [],
    "summary": {}
  }
}
```# 上市公司质押比例

## api call
ak.stock_gpzy_pledge_ratio_em(date="20241220")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20240906"; 请访问 http://data.eastmoney.com/gpzy/pledgeRatio.aspx 查询具体交易日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-股权质押-上市公司质押比例",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "质押比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "质押股数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "质押市值",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "质押笔数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "无限售股质押数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "限售股质押数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "近一年涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "所属行业代码",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-股权质押-上市公司质押比例",
    "data": [],
    "summary": {}
  }
}
```# 重要股东股权质押明细

## api call
ak.stock_gpzy_pledge_ratio_detail_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-股权质押-重要股东股权质押明细",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "质押股份数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "占所持股份比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "占总股本比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "质押机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "质押日收盘价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "预估平仓线",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "质押开始日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-股权质押-重要股东股权质押明细",
    "data": [],
    "summary": {}
  }
}
```# 质押机构分布统计-证券公司

## api call
ak.stock_gpzy_distribute_statistics_company_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-证券公司",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "质押机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "质押公司数量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "质押笔数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "质押数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "未达预警线比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "达到预警线未达平仓线比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "达到平仓线比例",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-证券公司",
    "data": [],
    "summary": {}
  }
}
```# 质押机构分布统计-银行

## api call
ak.stock_gpzy_distribute_statistics_bank_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-银行",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "质押机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "质押公司数量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "质押笔数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "质押数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "未达预警线比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "达到预警线未达平仓线比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "达到平仓线比例",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-银行",
    "data": [],
    "summary": {}
  }
}
```# 上市公司质押比例

## api call
ak.stock_gpzy_industry_data_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-股权质押-上市公司质押比例-行业数据",
    "data_structure": [
      {
        "field": "行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "平均质押比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "公司家数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "质押总笔数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "质押总股本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新质押市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "统计时间",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-股权质押-上市公司质押比例-行业数据",
    "data": [],
    "summary": {}
  }
}
```# A股商誉市场概况

## api call
ak.stock_sy_profile_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-商誉-A股商誉市场概况",
    "data_structure": [
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "商誉",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "商誉减值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "净资产",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "商誉占净资产比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "商誉减值占净资产比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润规模",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "商誉减值占净利润比例",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-商誉-A股商誉市场概况",
    "data": [],
    "summary": {}
  }
}
```# 商誉减值预期明细

## api call
ak.stock_sy_yq_em(date="20221231")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20221231"; 参见网页选项 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-商誉-商誉减值预期明细",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "业绩变动原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新商誉报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新一期商誉",
        "type": "float64",
        "description": "主要单位: 元"
      },
      {
        "field": "上年商誉",
        "type": "float64",
        "description": "主要单位: 元"
      },
      {
        "field": "预计净利润-下限",
        "type": "int64",
        "description": "主要单位: 元"
      },
      {
        "field": "预计净利润-上限",
        "type": "int64",
        "description": "主要单位: 元"
      },
      {
        "field": "业绩变动幅度-下限",
        "type": "float64",
        "description": "主要单位: %"
      },
      {
        "field": "业绩变动幅度-上限",
        "type": "float64",
        "description": "主要单位: %"
      },
      {
        "field": "上年度同期净利润",
        "type": "float64",
        "description": "主要单位: 元"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-商誉-商誉减值预期明细",
    "data": [],
    "summary": {}
  }
}
```# 个股商誉减值明细

## api call
ak.stock_sy_jz_em(date="20230331")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20230331"; 参见网页选项 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-商誉-个股商誉减值明细",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "商誉",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "商誉减值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "商誉减值占净资产比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "商誉减值占净利润比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-商誉-个股商誉减值明细",
    "data": [],
    "summary": {}
  }
}
```# 个股商誉明细

## api call
ak.stock_sy_em(date="20240630")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20240630"; 参见网页选项 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-商誉-个股商誉明细",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "商誉",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "商誉占净资产比例",
        "type": "float64",
        "description": ""
      },
      {
        "field": "净利润",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "净利润同比",
        "type": "float64",
        "description": ""
      },
      {
        "field": "上年商誉",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-商誉-个股商誉明细",
    "data": [],
    "summary": {}
  }
}
```# 行业商誉

## api call
ak.stock_sy_hy_em(date="20240930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20240930"; 参见网页选项 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-商誉-行业商誉",
    "data_structure": [
      {
        "field": "行业名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "商誉规模",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净资产",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "商誉规模占净资产规模比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润规模",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-商誉-行业商誉",
    "data": [],
    "summary": {}
  }
}
```# 股票账户统计月度

## api call
ak.stock_account_statistics_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-股票账户统计",
    "data_structure": [
      {
        "field": "数据日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "新增投资者-数量",
        "type": "float64",
        "description": "注意单位: 万户"
      },
      {
        "field": "新增投资者-环比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "新增投资者-同比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末投资者-总量",
        "type": "float64",
        "description": "注意单位: 万户"
      },
      {
        "field": "期末投资者-A股账户",
        "type": "float64",
        "description": "注意单位: 万户"
      },
      {
        "field": "期末投资者-B股账户",
        "type": "float64",
        "description": "注意单位: 万户"
      },
      {
        "field": "沪深总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "沪深户均市值",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "上证指数-收盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上证指数-涨跌幅",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-股票账户统计",
    "data": [],
    "summary": {}
  }
}
```# 分析师指数排行

## api call
ak.stock_analyst_rank_em(year=&#39;2024&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| year | str | year='2024'; 从 2013 年至今 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-研究报告-东方财富分析师指数",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "分析师名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分析师单位",
        "type": "object",
        "description": "-"
      },
      {
        "field": "年度指数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "xxxx年收益率",
        "type": "float64",
        "description": "其中 xxxx 表示指定的年份; 注意单位: %"
      },
      {
        "field": "3个月收益率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "6个月收益率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "12个月收益率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成分股个数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "xxxx最新个股评级-股票名称",
        "type": "object",
        "description": "其中 xxxx 表示指定的年份"
      },
      {
        "field": "xxxx最新个股评级-股票代码",
        "type": "object",
        "description": "其中 xxxx 表示指定的年份"
      },
      {
        "field": "分析师ID",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "数据更新日期"
      },
      {
        "field": "年度",
        "type": "object",
        "description": "数据更新年度"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-研究报告-东方财富分析师指数",
    "data": [],
    "summary": {}
  }
}
```# 分析师详情

## api call
ak.stock_analyst_detail_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| analyst_id | str | analyst_id="11000257131"; 分析师ID, 从 ak.stock_analyst_rank_em() 获取 |
| indicator | str | indicator="最新跟踪成分股"; 从 {"最新跟踪成分股", "历史跟踪成分股", "历史指数"} 中选择 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-研究报告-东方财富分析师指数-分析师详情",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-数据中心-研究报告-东方财富分析师指数-分析师详情",
    "data": [],
    "summary": {}
  }
}
```# 千股千评

## api call
ak.stock_comment_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-千股千评",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主力成本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "机构参与度",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "综合得分",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上升",
        "type": "int64",
        "description": "注意: 正负号"
      },
      {
        "field": "目前排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "关注指数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "交易日",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-千股千评",
    "data": [],
    "summary": {}
  }
}
```# 机构参与度

## api call
ak.stock_comment_detail_zlkp_jgcyd_em(symbol="600000")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600000" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-千股千评-主力控盘-机构参与度",
    "data_structure": [
      {
        "field": "交易日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "机构参与度",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-千股千评-主力控盘-机构参与度",
    "data": [],
    "summary": {}
  }
}
```# 历史评分

## api call
ak.stock_comment_detail_zhpj_lspf_em(symbol="600000")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600000" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-千股千评-综合评价-历史评分",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "评分",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-千股千评-综合评价-历史评分",
    "data": [],
    "summary": {}
  }
}
```# 用户关注指数

## api call
ak.stock_comment_detail_scrd_focus_em(symbol="600000")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600000" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-千股千评-市场热度-用户关注指数",
    "data_structure": [
      {
        "field": "交易日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "用户关注指数",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-千股千评-市场热度-用户关注指数",
    "data": [],
    "summary": {}
  }
}
```# 市场参与意愿

## api call
ak.stock_comment_detail_scrd_desire_em(symbol="600000")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600000" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-千股千评-市场热度-市场参与意愿",
    "data_structure": [
      {
        "field": "交易日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "参与意愿",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5日平均参与意愿",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "参与意愿变化",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5日平均变化",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-千股千评-市场热度-市场参与意愿",
    "data": [],
    "summary": {}
  }
}
```# 沪深港通资金流向

## api call
ak.stock_hsgt_fund_flow_summary_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-资金流向-沪深港通资金流向",
    "data_structure": [
      {
        "field": "交易日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "板块",
        "type": "object",
        "description": "-"
      },
      {
        "field": "资金方向",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易状态",
        "type": "int64",
        "description": "3 为收盘"
      },
      {
        "field": "成交净买额",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "资金净流入",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "当日资金余额",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "上涨数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "持平数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "下跌数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "相关指数",
        "type": "object",
        "description": "-"
      },
      {
        "field": "指数涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-资金流向-沪深港通资金流向",
    "data": [],
    "summary": {}
  }
}
```# 结算汇率-深港通

## api call
ak.stock_sgt_settlement_exchange_rate_szse()

## response
```json
{
  "metadata": {
    "description": "深港通-港股通业务信息-结算汇率",
    "data_structure": [
      {
        "field": "适用日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "买入结算汇兑比率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖出结算汇兑比率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "货币种类",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "深港通-港股通业务信息-结算汇率",
    "data": [],
    "summary": {}
  }
}
```# 结算汇率-沪港通

## api call
ak.stock_sgt_settlement_exchange_rate_sse()

## response
```json
{
  "metadata": {
    "description": "沪港通-港股通信息披露-结算汇兑",
    "data_structure": [
      {
        "field": "适用日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "买入结算汇兑比率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖出结算汇兑比率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "货币种类",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "沪港通-港股通信息披露-结算汇兑",
    "data": [],
    "summary": {}
  }
}
```# 参考汇率-深港通

## api call
ak.stock_sgt_reference_exchange_rate_szse()

## response
```json
{
  "metadata": {
    "description": "深港通-港股通业务信息-参考汇率",
    "data_structure": [
      {
        "field": "适用日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "参考汇率买入价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "参考汇率卖出价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "货币种类",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "深港通-港股通业务信息-参考汇率",
    "data": [],
    "summary": {}
  }
}
```# 参考汇率-沪港通

## api call
ak.stock_sgt_reference_exchange_rate_sse()

## response
```json
{
  "metadata": {
    "description": "沪港通-港股通信息披露-参考汇率",
    "data_structure": [
      {
        "field": "适用日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "参考汇率买入价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "参考汇率卖出价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "货币种类",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "沪港通-港股通信息披露-参考汇率",
    "data": [],
    "summary": {}
  }
}
```# 港股通成份股

## api call
ak.stock_hk_ggt_components_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-港股市场-港股通成份股",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: HKD"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 港元"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-港股市场-港股通成份股",
    "data": [],
    "summary": {}
  }
}
```# 沪深港通分时数据

## api call
ak.stock_hsgt_fund_min_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="北向资金"; choice of {"北向资金", "南向资金"} |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-沪深港通-市场概括-分时数据",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富-数据中心-沪深港通-市场概括-分时数据",
    "data": [],
    "summary": {}
  }
}
```# 板块排行

## api call
ak.stock_hsgt_board_rank_em(symbol="北向资金增持行业板块排行", indicator="今日")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="北向资金增持行业板块排行"; choice of {"北向资金增持行业板块排行", "北向资金增持概念板块排行", "北向资金增持地域板块排行"} |
| indicator | str | indicator="今日"; choice of {"今日", "3日", "5日", "10日", "1月", "1季", "1年"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-沪深港通持股-板块排行",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "最新涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "北向资金今日持股-股票只数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "北向资金今日持股-市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "北向资金今日持股-占板块比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "北向资金今日持股-占北向资金比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "北向资金今日增持估计-股票只数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "北向资金今日增持估计-市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "北向资金今日增持估计-市值增幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "北向资金今日增持估计-占板块比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "北向资金今日增持估计-占北向资金比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今日增持最大股-市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今日增持最大股-占股本比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今日减持最大股-占股本比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今日减持最大股-市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "报告时间",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-沪深港通持股-板块排行",
    "data": [],
    "summary": {}
  }
}
```# 个股排行

## api call
ak.stock_hsgt_hold_stock_em(market="北向", indicator="今日排行")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| market | str | market="沪股通"; choice of {"北向", "沪股通", "深股通"} |
| indicator | str | indicator="沪股通"; choice of {"今日排行", "3日排行", "5日排行", "10日排行", "月排行", "季排行", "年排行"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-沪深港通持股-个股排行",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "今日收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今日持股-股数",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "今日持股-市值",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "今日持股-占流通股比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今日持股-占总股本比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "增持估计-股数",
        "type": "float64",
        "description": "注意单位: 万; 主要字段名根据 indicator 变化"
      },
      {
        "field": "增持估计-市值",
        "type": "float64",
        "description": "注意单位: 万; 主要字段名根据 indicator 变化"
      },
      {
        "field": "增持估计-市值增幅",
        "type": "object",
        "description": "注意单位: %; 主要字段名根据 indicator 变化"
      },
      {
        "field": "增持估计-占流通股比",
        "type": "float64",
        "description": "注意单位: ‰; 主要字段名根据 indicator 变化"
      },
      {
        "field": "增持估计-占总股本比",
        "type": "float64",
        "description": "注意单位: ‰; 主要字段名根据 indicator 变化"
      },
      {
        "field": "所属板块",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-沪深港通持股-个股排行",
    "data": [],
    "summary": {}
  }
}
```# 每日个股统计

## api call
ak.stock_hsgt_stock_statistics_em(symbol="北向持股", start_date="20211027", end_date="20211027")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="北向持股"; choice of {"北向持股", "沪股通持股", "深股通持股", "南向持股"} |
| start_date | str | start_date="20210601"; 此处指定近期交易日 |
| end_date | str | end_date="20210608"; 此处指定近期交易日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-沪深港通-沪深港通持股-每日个股统计",
    "data_structure": [
      {
        "field": "持股日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "当日收盘价",
        "type": "float64",
        "description": "注意单位: 元; 南向持股单位为: 港元"
      },
      {
        "field": "当日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "持股数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "持股市值",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "持股数量占发行股百分比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "持股市值变化-1日",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "持股市值变化-5日",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "持股市值变化-10日",
        "type": "float64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-沪深港通-沪深港通持股-每日个股统计",
    "data": [],
    "summary": {}
  }
}
```# 机构排行

## api call
ak.stock_hsgt_institution_statistics_em(market="北向持股", start_date="20201218", end_date="20201218")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| market | str | market="北向持股"; choice of {"北向持股", "沪股通持股", "深股通持股", "南向持股"} |
| start_date | str | start_date="20201218"; 此处指定近期交易日 |
| end_date | str | end_date="20201218"; 此处指定近期交易日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-沪深港通-沪深港通持股-机构排行",
    "data_structure": [
      {
        "field": "持股日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "机构名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股只数",
        "type": "float64",
        "description": "注意单位: 只"
      },
      {
        "field": "持股市值",
        "type": "float64",
        "description": "注意单位: 元; 南向持股单位为: 港元"
      },
      {
        "field": "持股市值变化-1日",
        "type": "float64",
        "description": "注意单位: 元; 南向持股单位为: 港元"
      },
      {
        "field": "持股市值变化-5日",
        "type": "float64",
        "description": "注意单位: 元; 南向持股单位为: 港元"
      },
      {
        "field": "持股市值变化-10日",
        "type": "float64",
        "description": "注意单位: 元; 南向持股单位为: 港元"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-沪深港通-沪深港通持股-机构排行",
    "data": [],
    "summary": {}
  }
}
```# 沪深港通-港股通(沪&gt;港)实时行情

## api call
ak.stock_hsgt_sh_hk_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-沪深港通-港股通(沪&gt;港)-股票；按股票代码排序",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: HKD"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 亿股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 亿港元"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-沪深港通-港股通(沪&gt;港)-股票；按股票代码排序",
    "data": [],
    "summary": {}
  }
}
```# 沪深港通历史数据

## api call
ak.stock_hsgt_hist_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="北向资金"; choice of {"北向资金", "沪股通", "深股通", "南向资金", "港股通沪", "港股通深"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-资金流向-沪深港通资金流向-沪深港通历史数据",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-数据中心-资金流向-沪深港通资金流向-沪深港通历史数据",
    "data": [],
    "summary": {}
  }
}
```# 沪深港通持股-个股

## api call
ak.stock_hsgt_individual_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="002008"; 支持港股和A股 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-沪深港通-沪深港通持股-具体股票",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-数据中心-沪深港通-沪深港通持股-具体股票",
    "data": [],
    "summary": {}
  }
}
```# 沪深港通持股-个股详情

## api call
ak.stock_hsgt_individual_detail_em(

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="002008" |
| start_date | str | start_date="20210830"; 注意只能返回离最近交易日 90 个交易日内的数据 |
| end_date | str | end_date="20211026"; 注意只能返回离最近交易日 90 个交易日内的数据 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-沪深港通-沪深港通持股-具体股票-个股详情",
    "data_structure": [
      {
        "field": "持股日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "当日收盘价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "当日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "机构名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股数量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "持股市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "持股数量占A股百分比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "持股市值变化-1日",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "持股市值变化-5日",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "持股市值变化-10日",
        "type": "float64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-沪深港通-沪深港通持股-具体股票-个股详情",
    "data": [],
    "summary": {}
  }
}
```# 停复牌信息

## api call
ak.stock_tfp_em(date="20240426")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20240426" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-停复牌信息",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": ""
      },
      {
        "field": "代码",
        "type": "object",
        "description": ""
      },
      {
        "field": "停牌时间",
        "type": "object",
        "description": ""
      },
      {
        "field": "停牌截止时间",
        "type": "object",
        "description": ""
      },
      {
        "field": "停牌期限",
        "type": "object",
        "description": ""
      },
      {
        "field": "停牌原因",
        "type": "object",
        "description": ""
      },
      {
        "field": "所属市场",
        "type": "object",
        "description": ""
      },
      {
        "field": "预计复牌时间",
        "type": "object",
        "description": ""
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-停复牌信息",
    "data": [],
    "summary": {}
  }
}
```# 停复牌

## api call
ak.news_trade_notify_suspend_baidu(date="20241107")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20241107" |

## response
```json
{
  "metadata": {
    "description": "百度股市通-交易提醒-停复牌",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": ""
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": ""
      },
      {
        "field": "交易所",
        "type": "object",
        "description": ""
      },
      {
        "field": "停牌时间",
        "type": "object",
        "description": ""
      },
      {
        "field": "复牌时间",
        "type": "object",
        "description": ""
      },
      {
        "field": "停牌事项说明",
        "type": "object",
        "description": ""
      }
    ]
  },
  "sample_data": {
    "description": "百度股市通-交易提醒-停复牌",
    "data": [],
    "summary": {}
  }
}
```# 分红派息

## api call
ak.news_trade_notify_dividend_baidu(date="20251126")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20241107" |
| cookie | str | 可以指定 cookie |

## response
```json
{
  "metadata": {
    "description": "百度股市通-交易提醒-分红派息",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": ""
      },
      {
        "field": "除权日",
        "type": "object",
        "description": ""
      },
      {
        "field": "分红",
        "type": "object",
        "description": ""
      },
      {
        "field": "送股",
        "type": "object",
        "description": ""
      },
      {
        "field": "转增",
        "type": "object",
        "description": ""
      },
      {
        "field": "实物",
        "type": "object",
        "description": ""
      },
      {
        "field": "交易所",
        "type": "object",
        "description": ""
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": ""
      },
      {
        "field": "报告期",
        "type": "object",
        "description": ""
      }
    ]
  },
  "sample_data": {
    "description": "百度股市通-交易提醒-分红派息",
    "data": [],
    "summary": {}
  }
}
```# 个股新闻

## api call
ak.stock_news_em(symbol="603777")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="603777"; 股票代码或其他关键词 |

## response
```json
{
  "metadata": {
    "description": "东方财富指定个股的新闻资讯数据",
    "data_structure": [
      {
        "field": "关键词",
        "type": "object",
        "description": "-"
      },
      {
        "field": "新闻标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "新闻内容",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发布时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "文章来源",
        "type": "object",
        "description": "-"
      },
      {
        "field": "新闻链接",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富指定个股的新闻资讯数据",
    "data": [],
    "summary": {}
  }
}
```# 财经内容精选

## api call
ak.stock_news_main_cx()

## response
```json
{
  "metadata": {
    "description": "财新网-财新数据通-最新",
    "data_structure": [
      {
        "field": "tag",
        "type": "object",
        "description": "-"
      },
      {
        "field": "summary",
        "type": "object",
        "description": "-"
      },
      {
        "field": "url",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "财新网-财新数据通-最新",
    "data": [],
    "summary": {}
  }
}
```# 财报发行

## api call
ak.news_report_time_baidu(date="20241107")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20241107" |

## response
```json
{
  "metadata": {
    "description": "百度股市通-财报发行",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": ""
      },
      {
        "field": "交易所",
        "type": "object",
        "description": ""
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": ""
      },
      {
        "field": "财报期",
        "type": "object",
        "description": ""
      }
    ]
  },
  "sample_data": {
    "description": "百度股市通-财报发行",
    "data": [],
    "summary": {}
  }
}
```# 打新收益率

## api call
ak.stock_dxsyl_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股申购-打新收益率",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "网上发行中签率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "网上有效申购股数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "网上有效申购户数",
        "type": "int64",
        "description": "注意单位: 户"
      },
      {
        "field": "网上超额认购倍数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "网下配售中签率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "网下有效申购股数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "网下有效申购户数",
        "type": "int64",
        "description": "注意单位: 户"
      },
      {
        "field": "网下配售认购倍数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总发行数量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "开盘溢价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "首日涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股申购-打新收益率",
    "data": [],
    "summary": {}
  }
}
```# 新股申购与中签

## api call
ak.stock_xgsglb_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部股票"; choice of {"全部股票", "沪市主板", "科创板", "深市主板", "创业板", "北交所"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-新股申购-新股申购与中签查询",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-新股申购-新股申购与中签查询",
    "data": [],
    "summary": {}
  }
}
```# 业绩报表

## api call
ak.stock_yjbb_em(date="20220331")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20100331 开始 |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-年报季报-业绩报表",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "每股收益",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "营业总收入-营业总收入",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "营业总收入-同比增长",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "营业总收入-季度环比增长",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "净利润-净利润",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "净利润-同比增长",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "净利润-季度环比增长",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "每股净资产",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "净资产收益率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "每股经营现金流量",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "销售毛利率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "所处行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-数据中心-年报季报-业绩报表",
    "data": [],
    "summary": {}
  }
}
```# 业绩快报

## api call
ak.stock_yjkb_em(date="20200331")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20100331 开始 |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-年报季报-业绩快报",
    "data_structure": [
      {
        "field": "序号",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "每股收益",
        "type": "object",
        "description": "-"
      },
      {
        "field": "营业收入-营业收入",
        "type": "object",
        "description": "-"
      },
      {
        "field": "营业收入-去年同期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "营业收入-同比增长",
        "type": "str",
        "description": "-"
      },
      {
        "field": "营业收入-季度环比增长",
        "type": "object",
        "description": "-"
      },
      {
        "field": "净利润-净利润",
        "type": "object",
        "description": "-"
      },
      {
        "field": "净利润-去年同期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "净利润-同比增长",
        "type": "str",
        "description": "-"
      },
      {
        "field": "净利润-季度环比增长",
        "type": "object",
        "description": "-"
      },
      {
        "field": "每股净资产",
        "type": "object",
        "description": "-"
      },
      {
        "field": "净资产收益率",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所处行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "市场板块",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券类型",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-数据中心-年报季报-业绩快报",
    "data": [],
    "summary": {}
  }
}
```# 业绩预告

## api call
ak.stock_yjyg_em(date="20190331")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-年报季报-业绩预告",
    "data_structure": [
      {
        "field": "序号",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "预测指标",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "业绩变动",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "预测数值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "业绩变动幅度",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "业绩变动原因",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "预告类型",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上年同期值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日期",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-数据中心-年报季报-业绩预告",
    "data": [],
    "summary": {}
  }
}
```# 预约披露时间-东方财富

## api call
ak.stock_yysj_em(symbol="沪深A股", date="20211231")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="沪深A股"; choice of {'沪深A股', '沪市A股', '科创板', '深市A股', '创业板', '京市A股', 'ST板'} |
| date | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-年报季报-预约披露时间",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "首次预约时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "一次变更日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "二次变更日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "三次变更日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实际披露时间",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-数据中心-年报季报-预约披露时间",
    "data": [],
    "summary": {}
  }
}
```# 预约披露时间-巨潮资讯

## api call
ak.stock_report_disclosure(market="沪深京", period="2022年报")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| market | str | market="沪深京"; choice of {"沪深京", "深市", "深主板", "创业板", "沪市", "沪主板", "科创板", "北交所"} |
| period | str | period="2021年报"; 近四期的财务报告; e.g., choice of {"2021一季", "2021半年报", "2021三季", "2021年报"} |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据-预约披露的数据",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "首次预约",
        "type": "object",
        "description": "-"
      },
      {
        "field": "初次变更",
        "type": "object",
        "description": "-"
      },
      {
        "field": "二次变更",
        "type": "object",
        "description": "-"
      },
      {
        "field": "三次变更",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实际披露",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据-预约披露的数据",
    "data": [],
    "summary": {}
  }
}
```# 信息披露公告-巨潮资讯

## api call
ak.stock_zh_a_disclosure_report_cninfo(symbol="000001", market="沪深京", category="公司治理", start_date="20230619", end_date="20231220")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 股票代码 |
| market | str | market="沪深京"; choice of {"沪深京", "港股", "三板", "基金", "债券", "监管", "预披露"} |
| keyword | str | keyword=""; 关键词 |
| category | str | category=""; choice of {'年报', '半年报', '一季报', '三季报', '业绩预告', '权益分派', '董事会', '监事会', '股东大会', '日常经营', '公司治理', '中介报告', '首发', '增发', '股权激励', '配股', '解禁', '公司债', '可转债', '其他融资', '股权变动', '补充更正', '澄清致歉', '风险提示', '特别处理和退市', '退市整理期'} |
| start_date | str | start_date="20230618" |
| end_date | str | end_date="20231219" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-首页-公告查询-信息披露公告-沪深京",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告链接",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-首页-公告查询-信息披露公告-沪深京",
    "data": [],
    "summary": {}
  }
}
```# 信息披露调研-巨潮资讯

## api call
ak.stock_zh_a_disclosure_relation_cninfo(symbol="000001", market="沪深京", start_date="20230619", end_date="20231220")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 股票代码 |
| market | str | market="沪深京"; choice of {"沪深京", "港股", "三板", "基金", "债券", "监管", "预披露"} |
| start_date | str | start_date="20230618" |
| end_date | str | end_date="20231219" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-首页-公告查询-信息披露调研-沪深京",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告链接",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-首页-公告查询-信息披露调研-沪深京",
    "data": [],
    "summary": {}
  }
}
```# 行业分类数据-巨潮资讯

## api call
ak.stock_industry_category_cninfo(symbol="巨潮行业分类标准")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="巨潮行业分类标准"; choice of {"证监会行业分类标准", "巨潮行业分类标准", "申银万国行业分类标准", "新财富行业分类标准", "国资委行业分类标准", "巨潮产业细分标准", "天相行业分类标准", "全球行业分类标准"} |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据-行业分类数据",
    "data_structure": [
      {
        "field": "类目编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "类目名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "终止日期",
        "type": "datetime64",
        "description": "-"
      },
      {
        "field": "行业类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业类型编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "类目名称英文",
        "type": "object",
        "description": "-"
      },
      {
        "field": "父类编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分级",
        "type": "int32",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据-行业分类数据",
    "data": [],
    "summary": {}
  }
}
```# 上市公司行业归属的变动情况-巨潮资讯

## api call
ak.stock_industry_change_cninfo(symbol="002594", start_date="20091227", end_date="20220708")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="002594" |
| start_date | str | start_date="20091227" |
| end_date | str | end_date="20220708" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据-上市公司行业归属的变动情况",
    "data_structure": [
      {
        "field": "新证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业中类",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业大类",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业次类",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业门类",
        "type": "object",
        "description": "-"
      },
      {
        "field": "机构名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分类标准",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分类标准编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变更日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据-上市公司行业归属的变动情况",
    "data": [],
    "summary": {}
  }
}
```# 公司股本变动-巨潮资讯

## api call
ak.stock_share_change_cninfo(symbol="002594", start_date="20091227", end_date="20241021")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="002594" |
| start_date | str | start_date="20091227" |
| end_date | str | end_date="20241021" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据-公司股本变动",
    "data_structure": [
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "机构名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "境外法人持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "证券投资基金持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "国家持股-受限",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "国有法人持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "配售法人股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "发起人股份",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "未流通股份",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其中：境外自然人持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其他流通受限股份",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其他流通股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "外资持股-受限",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "内部职工股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "境外上市外资股-H股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其中：境内法人持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "自然人持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "人民币普通股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "国有法人持股-受限",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "一般法人持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "控股股东、实际控制人",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其中：限售H股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "境内法人持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "战略投资者持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "国家持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其中：限售B股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其他未流通股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流通受限股份",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "优先股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "高管股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总股本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其中：限售高管股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转配股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "境内上市外资股-B股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其中：境外法人持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "募集法人股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "已流通股份",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其中：境内自然人持股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其他内资持股-受限",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动原因编码",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据-公司股本变动",
    "data": [],
    "summary": {}
  }
}
```# 配股实施方案-巨潮资讯

## api call
ak.stock_allotment_cninfo(symbol="600030", start_date="19900101", end_date="20241022")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600030" |
| start_date | str | start_date="19700101" |
| end_date | str | end_date="22220222" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-个股-配股实施方案",
    "data_structure": [
      {
        "field": "记录标识",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "停牌起始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配股缴款起始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "可转配股数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "停牌截止日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实际配股数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "配股价格",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "配股比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "配股前总股本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股配权转让费(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "法人股实配数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "实际募资净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "大股东认购方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "其他配售简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配股失败，退还申购款日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "除权基准日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "预计发行费用",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "配股发行结果公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配股权证交易截止日",
        "type": "datetime64",
        "description": "-"
      },
      {
        "field": "其他股份实配数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "国家股实配数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "委托单位",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公众获转配数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其他配售代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配售对象",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配股权证交易起始日",
        "type": "datetime64",
        "description": "-"
      },
      {
        "field": "资金到账日",
        "type": "datetime64",
        "description": "-"
      },
      {
        "field": "机构名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股权登记日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实际募资总额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "预计募集资金",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "大股东认购数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公众股实配数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转配股实配数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "承销费用",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "法人获转配数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "配股后流通股本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股票类别",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公众配售简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行方式编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "承销方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配股上市日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配股缴款截止日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "承销余额(股)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "预计配股数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "配股后总股本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "职工股实配数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "承销方式编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行费用总额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "配股前流通股本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股票类别编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公众配售代码",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-个股-配股实施方案",
    "data": [],
    "summary": {}
  }
}
```# 公司概况-巨潮资讯

## api call
ak.stock_profile_cninfo(symbol="600030")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600030" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-个股-公司概况",
    "data_structure": [
      {
        "field": "公司名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "英文名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "曾用简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "A股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "A股简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "B股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "B股简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "H股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "H股简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "入选指数",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属市场",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "法人代表",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册资金",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成立日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "官方网站",
        "type": "object",
        "description": "-"
      },
      {
        "field": "电子邮箱",
        "type": "object",
        "description": "-"
      },
      {
        "field": "联系电话",
        "type": "object",
        "description": "-"
      },
      {
        "field": "传真",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册地址",
        "type": "object",
        "description": "-"
      },
      {
        "field": "办公地址",
        "type": "object",
        "description": "-"
      },
      {
        "field": "邮政编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "主营业务",
        "type": "object",
        "description": "-"
      },
      {
        "field": "经营范围",
        "type": "object",
        "description": "-"
      },
      {
        "field": "机构简介",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-个股-公司概况",
    "data": [],
    "summary": {}
  }
}
```# 上市相关-巨潮资讯

## api call
ak.stock_ipo_summary_cninfo(symbol="600030")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600030" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-个股-上市相关",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "招股公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "中签率公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "每股面值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "总发行数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "发行前每股净资产",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "摊薄发行市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "募集资金净额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "上网发行日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行价格",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "发行费用总额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "发行后每股净资产",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "上网发行中签率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "主承销商",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-个股-上市相关",
    "data": [],
    "summary": {}
  }
}
```# 资产负债表-沪深

## api call
ak.stock_zcfz_em(date="20240331")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20240331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-年报季报-业绩快报-资产负债表",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "资产-货币资金",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "资产-应收账款",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "资产-存货",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "资产-总资产",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "资产-总资产同比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "负债-应付账款",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "负债-总负债",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "负债-预收账款",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "负债-总负债同比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "资产负债率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "股东权益合计",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-数据中心-年报季报-业绩快报-资产负债表",
    "data": [],
    "summary": {}
  }
}
```# 资产负债表-北交所

## api call
ak.stock_zcfz_bj_em(date="20240331")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20240331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-年报季报-业绩快报-资产负债表",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "资产-货币资金",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "资产-应收账款",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "资产-存货",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "资产-总资产",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "资产-总资产同比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "负债-应付账款",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "负债-总负债",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "负债-预收账款",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "负债-总负债同比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "资产负债率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "股东权益合计",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-数据中心-年报季报-业绩快报-资产负债表",
    "data": [],
    "summary": {}
  }
}
```# 利润表

## api call
ak.stock_lrb_em(date="20240331")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20240331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20120331 开始 |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-年报季报-业绩快报-利润表",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "净利润",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "净利润同比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "营业总收入",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "营业总收入同比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "营业总支出-营业支出",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "营业总支出-销售费用",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "营业总支出-管理费用",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "营业总支出-财务费用",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "营业总支出-营业总支出",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "营业利润",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "利润总额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-数据中心-年报季报-业绩快报-利润表",
    "data": [],
    "summary": {}
  }
}
```# 现金流量表

## api call
ak.stock_xjll_em(date="20240331")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-年报季报-业绩快报-现金流量表",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "净现金流-净现金流",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "净现金流-同比增长",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "经营性现金流-现金流量净额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "经营性现金流-净现金流占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "投资性现金流-现金流量净额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "投资性现金流-净现金流占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "融资性现金流-现金流量净额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "融资性现金流-净现金流占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-数据中心-年报季报-业绩快报-现金流量表",
    "data": [],
    "summary": {}
  }
}
```# 股东增减持

## api call
ak.stock_ggcg_em(symbol="全部")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部"; choice of {"全部", "股东增持", "股东减持"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-高管持股",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股变动信息-增减",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "持股变动信息-变动数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "持股变动信息-占总股本比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "持股变动信息-占流通股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "变动后持股情况-持股总数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "变动后持股情况-占总股本比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "变动后持股情况-持流通股数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "变动后持股情况-占流通股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "变动开始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动截止日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-高管持股",
    "data": [],
    "summary": {}
  }
}
```# 分红配送-东财

## api call
ak.stock_fhps_em(date="20231231")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20231231"; choice of {"XXXX0630", "XXXX1231"}; 从 19901231 开始 |

## response
```json
{
  "metadata": {
    "description": "东方财富-数据中心-年报季报-分红配送",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "送转股份-送转总比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "送转股份-送转比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "送转股份-转股比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "现金分红-现金分红比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "现金分红-股息率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股净资产",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股公积金",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股未分配利润",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润同比增长",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总股本",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "预案公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股权登记日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "除权除息日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "方案进度",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-数据中心-年报季报-分红配送",
    "data": [],
    "summary": {}
  }
}
```# 分红配送详情-东财

## api call
ak.stock_fhps_detail_em(symbol="300073")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="300073" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-分红送配-分红送配详情",
    "data_structure": [
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "业绩披露日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "送转股份-送转总比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "送转股份-送股比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "送转股份-转股比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "现金分红-现金分红比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "现金分红-现金分红比例描述",
        "type": "object",
        "description": "-"
      },
      {
        "field": "现金分红-股息率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股净资产",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股公积金",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股未分配利润",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润同比增长",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总股本",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "预案公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股权登记日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "除权除息日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "方案进度",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-分红送配-分红送配详情",
    "data": [],
    "summary": {}
  }
}
```# 分红情况-同花顺

## api call
ak.stock_fhps_detail_ths(symbol="603444")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="603444"; 兼容 A 股和 B 股 |

## response
```json
{
  "metadata": {
    "description": "同花顺-分红情况",
    "data_structure": [
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "董事会日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东大会预案公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实施公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分红方案说明",
        "type": "object",
        "description": "-"
      },
      {
        "field": "A股股权登记日",
        "type": "object",
        "description": "注意: 根据 A 股和 B 股变化"
      },
      {
        "field": "A股除权除息日",
        "type": "object",
        "description": "注意: 根据 A 股和 B 股变化"
      },
      {
        "field": "分红总额",
        "type": "object",
        "description": "-"
      },
      {
        "field": "方案进度",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股利支付率",
        "type": "object",
        "description": "-"
      },
      {
        "field": "税前分红率",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-分红情况",
    "data": [],
    "summary": {}
  }
}
```# 分红配送详情-港股-同花顺

## api call
ak.stock_hk_fhpx_detail_ths(symbol="0700")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="0700"; 港股代码 |

## response
```json
{
  "metadata": {
    "description": "同花顺-港股-分红派息",
    "data_structure": [
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "方案",
        "type": "object",
        "description": "-"
      },
      {
        "field": "除净日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "派息日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "过户日期起止日-起始",
        "type": "object",
        "description": "-"
      },
      {
        "field": "过户日期起止日-截止",
        "type": "object",
        "description": "-"
      },
      {
        "field": "类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "进度",
        "type": "object",
        "description": "-"
      },
      {
        "field": "以股代息",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-港股-分红派息",
    "data": [],
    "summary": {}
  }
}
```# 个股资金流

## api call
ak.stock_fund_flow_individual()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="即时"; choice of {“即时”, "3日排行", "5日排行", "10日排行", "20日排行"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-资金流向-个股资金流",
    "data_structure": []
  },
  "sample_data": {
    "description": "同花顺-数据中心-资金流向-个股资金流",
    "data": [],
    "summary": {}
  }
}
```# 概念资金流

## api call
ak.stock_fund_flow_concept()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="即时"; choice of {“即时”, "3日排行", "5日排行", "10日排行", "20日排行"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-资金流向-概念资金流",
    "data_structure": []
  },
  "sample_data": {
    "description": "同花顺-数据中心-资金流向-概念资金流",
    "data": [],
    "summary": {}
  }
}
```# 行业资金流

## api call
ak.stock_fund_flow_industry()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="即时"; choice of {“即时”, "3日排行", "5日排行", "10日排行", "20日排行"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-资金流向-行业资金流",
    "data_structure": []
  },
  "sample_data": {
    "description": "同花顺-数据中心-资金流向-行业资金流",
    "data": [],
    "summary": {}
  }
}
```# 大单追踪

## api call
ak.stock_fund_flow_big_deal()

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-资金流向-大单追踪",
    "data_structure": []
  },
  "sample_data": {
    "description": "同花顺-数据中心-资金流向-大单追踪",
    "data": [],
    "summary": {}
  }
}
```# 个股资金流

## api call
ak.stock_individual_fund_flow(stock="600094", market="sh")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| stock | str | stock="000425"; 股票代码 |
| market | str | market="sh"; 上海证券交易所: sh, 深证证券交易所: sz, 北京证券交易所: bj |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-个股资金流向",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "主力净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主力净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "超大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "超大单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "大单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "中单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "小单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "小单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-个股资金流向",
    "data": [],
    "summary": {}
  }
}
```# 个股资金流排名

## api call
ak.stock_individual_fund_flow_rank()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| indicator | str | indicator="今日"; choice {"今日", "3日", "5日", "10日"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-资金流向-排名",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-数据中心-资金流向-排名",
    "data": [],
    "summary": {}
  }
}
```# 大盘资金流

## api call
ak.stock_market_fund_flow()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-资金流向-大盘",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上证-收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上证-涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "深证-收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "深证-涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "主力净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主力净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "超大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "超大单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "大单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "中单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "小单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "小单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-资金流向-大盘",
    "data": [],
    "summary": {}
  }
}
```# 板块资金流排名

## api call
ak.stock_sector_fund_flow_rank()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| indicator | str | indicator="今日"; choice of {"今日", "5日", "10日"} |
| sector_type | str | sector_type="行业资金流"; choice of {"行业资金流", "概念资金流", "地域资金流"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-资金流向-板块资金流-排名",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-数据中心-资金流向-板块资金流-排名",
    "data": [],
    "summary": {}
  }
}
```# 主力净流入排名

## api call
ak.stock_main_fund_flow(symbol="全部股票")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部股票"；choice of {"全部股票", "沪深A股", "沪市A股", "科创板", "深市A股", "创业板", "沪市B股", "深市B股"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-资金流向-主力净流入排名",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今日排行榜-主力净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今日排行榜-今日排名",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今日排行榜-今日涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "5日排行榜-主力净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "5日排行榜-5日排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "5日排行榜-5日涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "10日排行榜-主力净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "10日排行榜-10日排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "10日排行榜-10日涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "所属板块",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-资金流向-主力净流入排名",
    "data": [],
    "summary": {}
  }
}
```# 行业个股资金流

## api call
ak.stock_sector_fund_flow_summary(symbol="电源设备", indicator="今日")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="电源设备" |
| indicator | str | indicator="今日"; choice of {"今日", "5日", "10日"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-资金流向-行业资金流-xx行业个股资金流",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-数据中心-资金流向-行业资金流-xx行业个股资金流",
    "data": [],
    "summary": {}
  }
}
```# 行业历史资金流

## api call
ak.stock_sector_fund_flow_hist(symbol="汽车服务")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="汽车服务" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-资金流向-行业资金流-行业历史资金流",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "主力净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主力净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "超大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "超大单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "大单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "中单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "小单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "小单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-资金流向-行业资金流-行业历史资金流",
    "data": [],
    "summary": {}
  }
}
```# 概念历史资金流

## api call
ak.stock_concept_fund_flow_hist(symbol="数据要素")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="数据要素" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-资金流向-概念资金流-概念历史资金流",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "主力净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主力净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "超大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "超大单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "大单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "中单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "小单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "小单净流入-净占比",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-资金流向-概念资金流-概念历史资金流",
    "data": [],
    "summary": {}
  }
}
```# 筹码分布

## api call
ak.stock_cyq_em(symbol="000001", adjust="")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 股票代码 |
| adjust | str | adjust=""; choice of {"qfq": "前复权", "hfq": "后复权", "": "不复权"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-概念板-行情中心-日K-筹码分布",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "获利比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "平均成本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "90成本-低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "90成本-高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "90集中度",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "70成本-低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "70成本-高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "70集中度",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-概念板-行情中心-日K-筹码分布",
    "data": [],
    "summary": {}
  }
}
```# 股东大会

## api call
ak.stock_gddh_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东大会",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东大会名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "召开开始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股权登记日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "现场登记日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "网络投票时间-开始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "网络投票时间-结束日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "决议公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "序列号",
        "type": "object",
        "description": "-"
      },
      {
        "field": "提案",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东大会",
    "data": [],
    "summary": {}
  }
}
```# 重大合同

## api call
ak.stock_zdhtmx_em(start_date="20220819", end_date="20230819")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20200819" |
| end_date | str | end_date="20230819" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-重大合同-重大合同明细",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "签署主体",
        "type": "object",
        "description": "-"
      },
      {
        "field": "签署主体-与上市公司关系",
        "type": "object",
        "description": "-"
      },
      {
        "field": "其他签署方",
        "type": "object",
        "description": "-"
      },
      {
        "field": "其他签署方-与上市公司关系",
        "type": "object",
        "description": "-"
      },
      {
        "field": "合同类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "合同名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "合同金额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上年度营业收入",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "占上年度营业收入比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新财务报表的营业收入",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "签署日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-重大合同-重大合同明细",
    "data": [],
    "summary": {}
  }
}
```# 个股研报

## api call
ak.stock_research_report_em(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-研究报告-个股研报",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "东财评级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "近一月个股研报数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "2024-盈利预测-收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "2024-盈利预测-市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "2025-盈利预测-收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "2025-盈利预测-市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "2026-盈利预测-收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "2026-盈利预测-市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告PDF链接",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-研究报告-个股研报",
    "data": [],
    "summary": {}
  }
}
```# 沪深京 A 股公告

## api call
ak.stock_notice_report(symbol=&#39;财务报告&#39;, date="20240613")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='财务报告'; choice of {"全部", "重大事项", "财务报告", "融资公告", "风险提示", "资产重组", "信息变更", "持股变动"} |
| date | str | date="20220511"; 指定日期 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-公告大全-沪深京 A 股公告",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "网址",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-公告大全-沪深京 A 股公告",
    "data": [],
    "summary": {}
  }
}
```# 财务报表-新浪

## api call
ak.stock_financial_report_sina(stock="sh600600", symbol="资产负债表")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| stock | str | stock="sh600600"; 带市场标识的股票代码 |
| symbol | str | symbol="现金流量表"; choice of {"资产负债表", "利润表", "现金流量表"} |

## response
```json
{
  "metadata": {
    "description": "新浪财经-财务报表-三大报表",
    "data_structure": [
      {
        "field": "报告日",
        "type": "object",
        "description": "报告日期"
      },
      {
        "field": "流动资产",
        "type": "object",
        "description": "-"
      },
      {
        "field": "...",
        "type": "object",
        "description": "-"
      },
      {
        "field": "类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-财务报表-三大报表",
    "data": [],
    "summary": {}
  }
}
```# 资产负债表-按报告期

## api call
ak.stock_balance_sheet_by_report_em(symbol="SH600519")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH600519"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-资产负债表-按报告期",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "319 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-资产负债表-按报告期",
    "data": [],
    "summary": {}
  }
}
```# 资产负债表-按年度

## api call
ak.stock_balance_sheet_by_yearly_em(symbol="SH600519")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH600519"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-资产负债表-按年度",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "319 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-资产负债表-按年度",
    "data": [],
    "summary": {}
  }
}
```# 利润表-按报告期

## api call
ak.stock_profit_sheet_by_report_em(symbol="SH600519")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH600519"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-利润表-报告期",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "203 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-利润表-报告期",
    "data": [],
    "summary": {}
  }
}
```# 利润表-按年度

## api call
ak.stock_profit_sheet_by_yearly_em(symbol="SH600519")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH600519"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-利润表-按年度",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "203 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-利润表-按年度",
    "data": [],
    "summary": {}
  }
}
```# 利润表-按单季度

## api call
ak.stock_profit_sheet_by_quarterly_em(symbol="SH600519")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH600519"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-利润表-按单季度",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "204 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-利润表-按单季度",
    "data": [],
    "summary": {}
  }
}
```# 现金流量表-按报告期

## api call
ak.stock_cash_flow_sheet_by_report_em(symbol="SH600519")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH600519"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-现金流量表-按报告期",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "252 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-现金流量表-按报告期",
    "data": [],
    "summary": {}
  }
}
```# 现金流量表-按年度

## api call
ak.stock_cash_flow_sheet_by_yearly_em(symbol="SH600519")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH600519"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-现金流量表-按年度",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "314 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-现金流量表-按年度",
    "data": [],
    "summary": {}
  }
}
```# 现金流量表-按单季度

## api call
ak.stock_cash_flow_sheet_by_quarterly_em(symbol="SH600519")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SH600519"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-现金流量表-按单季度",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "315 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-现金流量表-按单季度",
    "data": [],
    "summary": {}
  }
}
```# 资产负债表

## api call
ak.stock_financial_debt_new_ths(symbol="000063", indicator="按年度")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000063"; 股票代码 |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "按年度"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-财务指标-资产负债表；替换 stock_financial_debt_ths 接口",
    "data_structure": [
      {
        "field": "report_date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "report_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "report_period",
        "type": "object",
        "description": "-"
      },
      {
        "field": "quarter_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "metric_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "single",
        "type": "object",
        "description": "-"
      },
      {
        "field": "yoy",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "mom",
        "type": "object",
        "description": "-"
      },
      {
        "field": "single_yoy",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-财务指标-资产负债表；替换 stock_financial_debt_ths 接口",
    "data": [],
    "summary": {}
  }
}
```# 利润表

## api call
ak.stock_financial_benefit_new_ths(symbol="000063", indicator="按报告期")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000063"; 股票代码 |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "一季度", "二季度", "三季度", "四季度", "按年度"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-财务指标-利润表；替换 stock_financial_benefit_ths 接口",
    "data_structure": [
      {
        "field": "report_date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "report_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "report_period",
        "type": "object",
        "description": "-"
      },
      {
        "field": "quarter_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "metric_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "single",
        "type": "object",
        "description": "-"
      },
      {
        "field": "yoy",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "mom",
        "type": "object",
        "description": "-"
      },
      {
        "field": "single_yoy",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-财务指标-利润表；替换 stock_financial_benefit_ths 接口",
    "data": [],
    "summary": {}
  }
}
```# 现金流量表

## api call
ak.stock_financial_cash_new_ths(symbol="000063", indicator="按年度")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000063"; 股票代码 |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "一季度", "二季度", "三季度", "四季度", "按年度"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-财务指标-现金流量表；替换 stock_financial_cash_ths 接口",
    "data_structure": [
      {
        "field": "report_date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "report_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "report_period",
        "type": "object",
        "description": "-"
      },
      {
        "field": "quarter_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "metric_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "single",
        "type": "object",
        "description": "-"
      },
      {
        "field": "yoy",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "mom",
        "type": "object",
        "description": "-"
      },
      {
        "field": "single_yoy",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-财务指标-现金流量表；替换 stock_financial_cash_ths 接口",
    "data": [],
    "summary": {}
  }
}
```# 资产负债表-按报告期

## api call
ak.stock_balance_sheet_by_report_delisted_em(symbol="SZ000013")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000013"; 带市场标识的已退市股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-资产负债表-已退市股票-按报告期",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "319项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-资产负债表-已退市股票-按报告期",
    "data": [],
    "summary": {}
  }
}
```# 利润表-按报告期

## api call
ak.stock_profit_sheet_by_report_delisted_em(symbol="SZ000013")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000013"; 带市场标识的已退市股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-利润表-已退市股票-按报告期",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "203 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-利润表-已退市股票-按报告期",
    "data": [],
    "summary": {}
  }
}
```# 现金流量表-按报告期

## api call
ak.stock_cash_flow_sheet_by_report_delisted_em(symbol="SZ000013")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000013"; 带市场标识的已退市股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-股票-财务分析-现金流量表-已退市股票-按报告期",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "252 项，不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-股票-财务分析-现金流量表-已退市股票-按报告期",
    "data": [],
    "summary": {}
  }
}
```# 港股财务报表

## api call
ak.stock_financial_hk_report_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| stock | str | stock="00700"; 股票代码 |
| symbol | str | symbol="现金流量表"; choice of {"资产负债表", "利润表", "现金流量表"} |
| indicator | str | indicator="年度"; choice of {"年度", "报告期"} |

## response
```json
{
  "metadata": {
    "description": "东方财富-港股-财务报表-三大报表",
    "data_structure": [
      {
        "field": "SECUCODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "SECURITY_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "SECURITY_NAME_ABBR",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ORG_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "REPORT_DATE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "DATE_TYPE_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "FISCAL_YEAR",
        "type": "object",
        "description": "-"
      },
      {
        "field": "STD_ITEM_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "STD_ITEM_NAME",
        "type": "object",
        "description": "-"
      },
      {
        "field": "AMOUNT",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "STD_REPORT_DATE",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-港股-财务报表-三大报表",
    "data": [],
    "summary": {}
  }
}
```# 美股财务报表

## api call
ak.stock_financial_us_report_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| stock | str | stock="TSLA"; 股票代码, 比如 BRK.A 需修改为 BRK_A 再获取 |
| symbol | str | symbol="资产负债表"; choice of {"资产负债表", "综合损益表", "现金流量表"} |
| indicator | str | indicator="年报"; choice of {"年报", "单季报", "累计季报"} |

## response
```json
{
  "metadata": {
    "description": "东方财富-美股-财务分析-三大报表",
    "data_structure": [
      {
        "field": "SECUCODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "SECURITY_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "SECURITY_NAME_ABBR",
        "type": "object",
        "description": "-"
      },
      {
        "field": "REPORT_DATE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "REPORT_TYPE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "REPORT",
        "type": "object",
        "description": "-"
      },
      {
        "field": "STD_ITEM_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "AMOUNT",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ITEM_NAME",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-美股-财务分析-三大报表",
    "data": [],
    "summary": {}
  }
}
```# 关键指标-新浪

## api call
ak.stock_financial_abstract(symbol="600004")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600004"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-财务报表-关键指标",
    "data_structure": [
      {
        "field": "选项",
        "type": "object",
        "description": "-"
      },
      {
        "field": "指标",
        "type": "object",
        "description": "-"
      },
      {
        "field": "【具体的报告期】",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-财务报表-关键指标",
    "data": [],
    "summary": {}
  }
}
```# 关键指标-同花顺

## api call
ak.stock_financial_abstract_new_ths(symbol="000063", indicator="按报告期")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000063"; 股票代码 |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "一季度", "二季度", "三季度", "四季度", "按年度"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-财务指标-重要指标；替换 stock_financial_abstract_ths 接口",
    "data_structure": [
      {
        "field": "report_date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "report_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "report_period",
        "type": "object",
        "description": "-"
      },
      {
        "field": "quarter_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "metric_name",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "single",
        "type": "object",
        "description": "-"
      },
      {
        "field": "yoy",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "mom",
        "type": "object",
        "description": "-"
      },
      {
        "field": "single_yoy",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-财务指标-重要指标；替换 stock_financial_abstract_ths 接口",
    "data": [],
    "summary": {}
  }
}
```# 主要指标-东方财富

## api call
ak.stock_financial_analysis_indicator_em(symbol="301389.SZ", indicator="按报告期")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="301389.SZ"; 股票代码 |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "按单季度"} |

## response
```json
{
  "metadata": {
    "description": "东方财富-A股-财务分析-主要指标",
    "data_structure": [
      {
        "field": "SECUCODE",
        "type": "object",
        "description": "股票代码(带后缀)"
      },
      {
        "field": "SECURITY_CODE",
        "type": "object",
        "description": "股票代码"
      },
      {
        "field": "SECURITY_NAME_ABBR",
        "type": "object",
        "description": "股票名称"
      },
      {
        "field": "REPORT_DATE",
        "type": "object",
        "description": "报告日期"
      },
      {
        "field": "REPORT_TYPE",
        "type": "object",
        "description": "报告类型"
      },
      {
        "field": "REPORT_DATE_NAME",
        "type": "object",
        "description": "报告日期名称"
      },
      {
        "field": "EPSJB",
        "type": "float64",
        "description": "基本每股收益(元)"
      },
      {
        "field": "EPSKCJB",
        "type": "float64",
        "description": "扣非每股收益(元)"
      },
      {
        "field": "EPSXS",
        "type": "float64",
        "description": "稀释每股收益(元)"
      },
      {
        "field": "BPS",
        "type": "float64",
        "description": "每股净资产(元)"
      },
      {
        "field": "MGZBGJ",
        "type": "float64",
        "description": "每股公积金(元)"
      },
      {
        "field": "MGWFPLR",
        "type": "float64",
        "description": "每股未分配利润(元)"
      },
      {
        "field": "MGJYXJJE",
        "type": "float64",
        "description": "每股经营现金流(元)"
      },
      {
        "field": "TOTALOPERATEREVE",
        "type": "float64",
        "description": "营业总收入(元)"
      },
      {
        "field": "MLR",
        "type": "float64",
        "description": "毛利润(元)"
      },
      {
        "field": "PARENTNETPROFIT",
        "type": "float64",
        "description": "归属净利润(元)"
      },
      {
        "field": "KCFJCXSYJLR",
        "type": "float64",
        "description": "扣非净利润(元)"
      },
      {
        "field": "TOTALOPERATEREVETZ",
        "type": "float64",
        "description": "营业总收入同比增长(%)"
      },
      {
        "field": "PARENTNETPROFITTZ",
        "type": "float64",
        "description": "归属净利润同比增长(%)"
      },
      {
        "field": "KCFJCXSYJLRTZ",
        "type": "float64",
        "description": "扣非净利润同比增长(%)"
      },
      {
        "field": "YYZSRGDHBZC",
        "type": "float64",
        "description": "营业总收入滚动环比增长(%)"
      },
      {
        "field": "NETPROFITRPHBZC",
        "type": "float64",
        "description": "归属净利润滚动环比增长(%)"
      },
      {
        "field": "KFJLRGDHBZC",
        "type": "float64",
        "description": "扣非净利润滚动环比增长(%)"
      },
      {
        "field": "ROEJQ",
        "type": "float64",
        "description": "净资产收益率(加权)(%)"
      },
      {
        "field": "ROEKCJQ",
        "type": "float64",
        "description": "净资产收益率(扣非/加权)(%)"
      },
      {
        "field": "ZZCJLL",
        "type": "float64",
        "description": "总资产收益率(加权)(%)"
      },
      {
        "field": "XSJLL",
        "type": "float64",
        "description": "净利率(%)"
      },
      {
        "field": "XSMLL",
        "type": "float64",
        "description": "毛利率(%)"
      },
      {
        "field": "YSZKYYSR",
        "type": "float64",
        "description": "预收账款/营业收入"
      },
      {
        "field": "XSJXLYYSR",
        "type": "float64",
        "description": "销售净现金流/营业收入"
      },
      {
        "field": "JYXJLYYSR",
        "type": "float64",
        "description": "经营净现金流/营业收入"
      },
      {
        "field": "TAXRATE",
        "type": "float64",
        "description": "实际税率(%)"
      },
      {
        "field": "LD",
        "type": "float64",
        "description": "流动比率"
      },
      {
        "field": "SD",
        "type": "float64",
        "description": "速动比率"
      },
      {
        "field": "XJLLB",
        "type": "float64",
        "description": "现金流量比率"
      },
      {
        "field": "ZCFZL",
        "type": "float64",
        "description": "资产负债率(%)"
      },
      {
        "field": "QYCS",
        "type": "float64",
        "description": "权益系数"
      },
      {
        "field": "CQBL",
        "type": "float64",
        "description": "产权比率"
      },
      {
        "field": "ZZCZZTS",
        "type": "float64",
        "description": "总资产周转天数(天)"
      },
      {
        "field": "CHZZTS",
        "type": "float64",
        "description": "存货周转天数(天)"
      },
      {
        "field": "YSZKZZTS",
        "type": "float64",
        "description": "应收账款周转天数(天)"
      },
      {
        "field": "TOAZZL",
        "type": "float64",
        "description": "总资产周转率(次)"
      },
      {
        "field": "CHZZL",
        "type": "float64",
        "description": "存货周转率(次)"
      },
      {
        "field": "YSZKZZL",
        "type": "float64",
        "description": "应收账款周转率(次)"
      },
      {
        "field": "...",
        "type": "...",
        "description": "..."
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-A股-财务分析-主要指标",
    "data": [],
    "summary": {}
  }
}
```# 财务指标

## api call
ak.stock_financial_analysis_indicator(symbol="600004", start_year="2020")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600004"; 股票代码 |
| start_year | str | start_year="2020"; 开始查询的时间 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-财务分析-财务指标",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "摊薄每股收益(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "加权每股收益(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股收益_调整后(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "扣除非经常性损益后的每股收益(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股净资产_调整前(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股净资产_调整后(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股经营性现金流(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股资本公积金(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "每股未分配利润(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "调整后的每股净资产(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产利润率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主营业务利润率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产净利润率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成本费用利润率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "营业利润率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主营业务成本率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "销售净利率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股本报酬率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净资产报酬率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "资产报酬率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "销售毛利率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "三项费用比重",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "非主营比重",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主营利润比重",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股息发放率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "投资收益率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主营业务利润(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净资产收益率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "加权净资产收益率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "扣除非经常性损益后的净利润(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主营业务收入增长率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净利润增长率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净资产增长率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产增长率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "应收账款周转率(次)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "应收账款周转天数(天)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "存货周转天数(天)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "存货周转率(次)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "固定资产周转率(次)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产周转率(次)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产周转天数(天)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流动资产周转率(次)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流动资产周转天数(天)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股东权益周转率(次)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流动比率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "速动比率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "现金比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "利息支付倍数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "长期债务与营运资金比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股东权益比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "长期负债比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股东权益与固定资产比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "负债与所有者权益比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "长期资产与长期资金比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "资本化比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "固定资产净值率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "资本固定化比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "产权比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "清算价值比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "固定资产比重(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "资产负债率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总资产(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "经营现金净流量对销售收入比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "资产的经营现金流量回报率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "经营现金净流量与净利润的比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "经营现金净流量对负债比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "现金流量比率(%)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "短期股票投资(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "短期债券投资(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "短期其它经营性投资(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "长期股票投资(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "长期债券投资(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "长期其它经营性投资(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "1年以内应收帐款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "1-2年以内应收帐款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "2-3年以内应收帐款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "3年以内应收帐款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "1年以内预付货款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "1-2年以内预付货款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "2-3年以内预付货款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "3年以内预付货款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "1年以内其它应收款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "1-2年以内其它应收款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "2-3年以内其它应收款(元)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "3年以内其它应收款(元)",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-财务分析-财务指标",
    "data": [],
    "summary": {}
  }
}
```# 港股财务指标

## api call
ak.stock_financial_hk_analysis_indicator_em(symbol="00700", indicator="年度")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="00700"; 股票代码 |
| indicator | str | indicator="年度"; choice of {"年度", "报告期"} |

## response
```json
{
  "metadata": {
    "description": "东方财富-港股-财务分析-主要指标",
    "data_structure": [
      {
        "field": "SECUCODE",
        "type": "object",
        "description": "股票代码(带HK后缀)"
      },
      {
        "field": "SECURITY_CODE",
        "type": "object",
        "description": "股票代码(不带HK后缀)"
      },
      {
        "field": "SECURITY_NAME_ABBR",
        "type": "object",
        "description": "股票名称"
      },
      {
        "field": "ORG_CODE",
        "type": "object",
        "description": "ORG_CODE"
      },
      {
        "field": "REPORT_DATE",
        "type": "object",
        "description": "报告日期"
      },
      {
        "field": "DATE_TYPE_CODE",
        "type": "object",
        "description": "报告日期类型"
      },
      {
        "field": "PER_NETCASH_OPERATE",
        "type": "float64",
        "description": "每股经营现金流(元)"
      },
      {
        "field": "PER_OI",
        "type": "float64",
        "description": "每股营业收入(元)"
      },
      {
        "field": "BPS",
        "type": "float64",
        "description": "每股净资产(元)"
      },
      {
        "field": "BASIC_EPS",
        "type": "float64",
        "description": "基本每股收益(元)"
      },
      {
        "field": "DILUTED_EPS",
        "type": "float64",
        "description": "稀释每股收益(元)"
      },
      {
        "field": "OPERATE_INCOME",
        "type": "int64",
        "description": "营业总收入(元)"
      },
      {
        "field": "OPERATE_INCOME_YOY",
        "type": "float64",
        "description": "营业总收入同比增长(%)"
      },
      {
        "field": "GROSS_PROFIT",
        "type": "int64",
        "description": "毛利润(元)"
      },
      {
        "field": "GROSS_PROFIT_YOY",
        "type": "float64",
        "description": "毛利润同比增长(%)"
      },
      {
        "field": "HOLDER_PROFIT",
        "type": "int64",
        "description": "归母净利润(元)"
      },
      {
        "field": "HOLDER_PROFIT_YOY",
        "type": "float64",
        "description": "归母净利润同比增长(%)"
      },
      {
        "field": "GROSS_PROFIT_RATIO",
        "type": "float64",
        "description": "毛利率(%)"
      },
      {
        "field": "EPS_TTM",
        "type": "float64",
        "description": "TTM每股收益(元)"
      },
      {
        "field": "OPERATE_INCOME_QOQ",
        "type": "float64",
        "description": "营业总收入滚动环比增长(%)"
      },
      {
        "field": "NET_PROFIT_RATIO",
        "type": "float64",
        "description": "净利率(%)"
      },
      {
        "field": "ROE_AVG",
        "type": "float64",
        "description": "平均净资产收益率(%)"
      },
      {
        "field": "GROSS_PROFIT_QOQ",
        "type": "float64",
        "description": "毛利润滚动环比增长(%)"
      },
      {
        "field": "ROA",
        "type": "float64",
        "description": "总资产净利率(%)"
      },
      {
        "field": "HOLDER_PROFIT_QOQ",
        "type": "float64",
        "description": "归母净利润滚动环比增长(%)"
      },
      {
        "field": "ROE_YEARLY",
        "type": "float64",
        "description": "年化净资产收益率(%)"
      },
      {
        "field": "ROIC_YEARLY",
        "type": "float64",
        "description": "年化投资回报率(%)"
      },
      {
        "field": "TAX_EBT",
        "type": "float64",
        "description": "所得税/利润总额(%)"
      },
      {
        "field": "OCF_SALES",
        "type": "float64",
        "description": "经营现金流/营业收入(%)"
      },
      {
        "field": "DEBT_ASSET_RATIO",
        "type": "float64",
        "description": "资产负债率(%)"
      },
      {
        "field": "CURRENT_RATIO",
        "type": "float64",
        "description": "流动比率(倍)"
      },
      {
        "field": "CURRENTDEBT_DEBT",
        "type": "float64",
        "description": "流动负债/总负债(%)"
      },
      {
        "field": "START_DATE",
        "type": "object",
        "description": "START_DATE"
      },
      {
        "field": "FISCAL_YEAR",
        "type": "object",
        "description": "年结日"
      },
      {
        "field": "CURRENCY",
        "type": "object",
        "description": "CURRENCY"
      },
      {
        "field": "IS_CNY_CODE",
        "type": "int64",
        "description": "IS_CNY_CODE"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-港股-财务分析-主要指标",
    "data": [],
    "summary": {}
  }
}
```# 美股财务指标

## api call
ak.stock_financial_us_analysis_indicator_em(symbol="TSLA", indicator="年报")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="TSLA"; 股票代码 |
| indicator | str | indicator="年报"; choice of {"年报", "单季报", "累计季报"} |

## response
```json
{
  "metadata": {
    "description": "东方财富-美股-财务分析-主要指标",
    "data_structure": [
      {
        "field": "SECUCODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "SECURITY_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "SECURITY_NAME_ABBR",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ORG_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "SECURITY_INNER_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ACCOUNTING_STANDARDS",
        "type": "object",
        "description": "-"
      },
      {
        "field": "NOTICE_DATE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "START_DATE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "REPORT_DATE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "FINANCIAL_DATE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "STD_REPORT_DATE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "CURRENCY",
        "type": "object",
        "description": "-"
      },
      {
        "field": "DATE_TYPE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "DATE_TYPE_CODE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "REPORT_TYPE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "REPORT_DATA_TYPE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ORGTYPE",
        "type": "object",
        "description": "-"
      },
      {
        "field": "OPERATE_INCOME",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "OPERATE_INCOME_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "GROSS_PROFIT",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "GROSS_PROFIT_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "PARENT_HOLDER_NETPROFIT",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "PARENT_HOLDER_NETPROFIT_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "BASIC_EPS",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "DILUTED_EPS",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "GROSS_PROFIT_RATIO",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "NET_PROFIT_RATIO",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ACCOUNTS_RECE_TR",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "INVENTORY_TR",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "TOTAL_ASSETS_TR",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ACCOUNTS_RECE_TDAYS",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "INVENTORY_TDAYS",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "TOTAL_ASSETS_TDAYS",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ROE_AVG",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ROA",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "CURRENT_RATIO",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "SPEED_RATIO",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "OCF_LIQDEBT",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "DEBT_ASSET_RATIO",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "EQUITY_RATIO",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "BASIC_EPS_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "GROSS_PROFIT_RATIO_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "NET_PROFIT_RATIO_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ROE_AVG_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ROA_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "DEBT_ASSET_RATIO_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "CURRENT_RATIO_YOY",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "SPEED_RATIO_YOY",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-美股-财务分析-主要指标",
    "data": [],
    "summary": {}
  }
}
```# 历史分红

## api call
ak.stock_history_dividend()

## response
```json
{
  "metadata": {
    "description": "新浪财经-发行与分配-历史分红",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "累计股息",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年均股息",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "分红次数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "融资总额",
        "type": "float64",
        "description": "注意单位: 亿"
      },
      {
        "field": "融资次数",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-发行与分配-历史分红",
    "data": [],
    "summary": {}
  }
}
```# 十大流通股东(个股)

## api call
ak.stock_gdfx_free_top_10_em(symbol="sh688686", date="20240930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="sh688686"; 带市场标识的股票代码 |
| date | str | date="20240930"; 财报发布季度最后日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-个股-十大流通股东",
    "data_structure": [
      {
        "field": "名次",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东性质",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股份类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股数",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "占总流通股本持股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "增减",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "变动比率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-个股-十大流通股东",
    "data": [],
    "summary": {}
  }
}
```# 十大股东(个股)

## api call
ak.stock_gdfx_top_10_em(symbol="sh688686", date="20210630")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="sh688686"; 带市场标识的股票代码 |
| date | str | date="20210630"; 财报发布季度最后日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-个股-十大股东",
    "data_structure": [
      {
        "field": "名次",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股份类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股数",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "占总股本持股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "增减",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "变动比率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-个股-十大股东",
    "data": [],
    "summary": {}
  }
}
```# 股东持股变动统计-十大流通股东

## api call
ak.stock_gdfx_free_holding_change_em(date="20210930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210930"; 财报发布季度最后日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东持股变动统计-十大流通股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-总持有",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-新进",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-增加",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-不变",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-减少",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流通市值统计",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "持有个股",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东持股变动统计-十大流通股东",
    "data": [],
    "summary": {}
  }
}
```# 股东持股变动统计-十大股东

## api call
ak.stock_gdfx_holding_change_em(date="20210930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210930"; 财报发布季度最后日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东持股变动统计-十大股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-总持有",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-新进",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-增加",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-不变",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股只数统计-减少",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流通市值统计",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "持有个股",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东持股变动统计-十大股东",
    "data": [],
    "summary": {}
  }
}
```# 高管持股变动统计

## api call
ak.stock_management_change_ths(symbol="688981")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="688981"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "同花顺-公司大事-高管持股变动",
    "data_structure": [
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "与公司高管关系",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动数量",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "交易均价",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "剩余股数",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "变动途径",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-公司大事-高管持股变动",
    "data": [],
    "summary": {}
  }
}
```# 股东持股变动统计

## api call
ak.stock_shareholder_change_ths(symbol="688981")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="688981"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "同花顺-公司大事-股东持股变动",
    "data_structure": [
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动股东",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动数量",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "交易均价",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "剩余股份总数",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "变动期间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动途径",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-公司大事-股东持股变动",
    "data": [],
    "summary": {}
  }
}
```# 股东持股分析-十大流通股东

## api call
ak.stock_gdfx_free_holding_analyse_em(date="20230930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20230930"; 财报发布季度最后日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东持股分析-十大流通股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "期末持股-数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "期末持股-数量变化",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "期末持股-数量变化比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "期末持股-持股变动",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股-流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日后涨跌幅-10个交易日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "公告日后涨跌幅-30个交易日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "公告日后涨跌幅-60个交易日",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东持股分析-十大流通股东",
    "data": [],
    "summary": {}
  }
}
```# 股东持股分析-十大股东

## api call
ak.stock_gdfx_holding_analyse_em(date="20210930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210930"; 财报发布季度最后日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东持股分析-十大股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "期末持股-数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "期末持股-数量变化",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "期末持股-数量变化比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "期末持股-持股变动",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股-流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日后涨跌幅-10个交易日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "公告日后涨跌幅-30个交易日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "公告日后涨跌幅-60个交易日",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东持股分析-十大股东",
    "data": [],
    "summary": {}
  }
}
```# 股东持股明细-十大流通股东

## api call
ak.stock_gdfx_free_holding_detail_em(date="20210930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210930"; 财报发布季度最后日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东持股明细-十大流通股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "期末持股-数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "期末持股-数量变化",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "期末持股-数量变化比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "期末持股-持股变动",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股-流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东持股明细-十大流通股东",
    "data": [],
    "summary": {}
  }
}
```# 股东持股明细-十大股东

## api call
ak.stock_gdfx_holding_detail_em(date="20230331", indicator="个人", symbol="新进")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20230331"; 财报发布季度最后日 |
| indicator | str | indicator="个人"; 股东类型; choice of {"个人", "基金", "QFII", "社保", "券商", "信托"} |
| symbol | str | symbol="新进"; 持股变动; choice of {"新进", "增加", "不变", "减少"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东持股明细-十大股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东排名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "期末持股-数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "期末持股-数量变化",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "期末持股-数量变化比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "期末持股-持股变动",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "期末持股-流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东持股明细-十大股东",
    "data": [],
    "summary": {}
  }
}
```# 股东持股统计-十大流通股东

## api call
ak.stock_gdfx_free_holding_statistics_em(date="20210930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210930"; 财报发布季度最后日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东持股统计-十大股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "统计次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-10个交易日-平均涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-10个交易日-最大涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-10个交易日-最小涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-30个交易日-平均涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-30个交易日-最大涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-30个交易日-最小涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-60个交易日-平均涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-60个交易日-最大涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-60个交易日-最小涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "持有个股",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东持股统计-十大股东",
    "data": [],
    "summary": {}
  }
}
```# 股东持股统计-十大股东

## api call
ak.stock_gdfx_holding_statistics_em(date="20210930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210930"; 财报发布季度最后日 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东持股统计-十大股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "统计次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-10个交易日-平均涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-10个交易日-最大涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-10个交易日-最小涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-30个交易日-平均涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-30个交易日-最大涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-30个交易日-最小涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-60个交易日-平均涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-60个交易日-最大涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日后涨幅统计-60个交易日-最小涨幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "持有个股",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东持股统计-十大股东",
    "data": [],
    "summary": {}
  }
}
```# 股东协同-十大流通股东

## api call
ak.stock_gdfx_free_holding_teamwork_em(symbol="社保")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="社保"; choice of {"全部", "个人", "基金", "QFII", "社保", "券商", "信托"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东协同-十大流通股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "协同股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "协同股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "协同次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "个股详情",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东协同-十大流通股东",
    "data": [],
    "summary": {}
  }
}
```# 股东协同-十大股东

## api call
ak.stock_gdfx_holding_teamwork_em(symbol="社保")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="社保"; choice of {"全部", "个人", "基金", "QFII", "社保", "券商", "信托"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股东分析-股东协同-十大股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "协同股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "协同股东类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "协同次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "个股详情",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股东分析-股东协同-十大股东",
    "data": [],
    "summary": {}
  }
}
```# 股东户数

## api call
ak.stock_zh_a_gdhs(symbol="20230930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="20230930"; choice of {"最新", 每个季度末}, 其中 每个季度末需要写成 20230930 格式 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-股东户数数据",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "股东户数-本次",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东户数-上次",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东户数-增减",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东户数-增减比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "区间涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "股东户数统计截止日-本次",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东户数统计截止日-上次",
        "type": "object",
        "description": "-"
      },
      {
        "field": "户均持股市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "户均持股数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总股本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-股东户数数据",
    "data": [],
    "summary": {}
  }
}
```# 股东户数详情

## api call
ak.stock_zh_a_gdhs_detail_em(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-股东户数详情",
    "data_structure": [
      {
        "field": "股东户数统计截止日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "区间涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "股东户数-本次",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东户数-上次",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东户数-增减",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东户数-增减比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "户均持股市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "户均持股数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总股本",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股本变动",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股本变动原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东户数公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-股东户数详情",
    "data": [],
    "summary": {}
  }
}
```# 分红配股

## api call
ak.stock_history_dividend_detail()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600012"; 股票代码 |
| indicator | str | indicator="配股"; choice of {"分红", "配股"} |
| date | str | date="1994-12-24"; 分红配股的具体日期, e.g., "1994-12-24" |

## response
```json
{
  "metadata": {
    "description": "新浪财经-发行与分配-分红配股",
    "data_structure": []
  },
  "sample_data": {
    "description": "新浪财经-发行与分配-分红配股",
    "data": [],
    "summary": {}
  }
}
```# 历史分红

## api call
ak.stock_dividend_cninfo(symbol="600009")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600009" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-个股-历史分红",
    "data_structure": [
      {
        "field": "实施方案公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "送股比例",
        "type": "float64",
        "description": "注意单位: 每 10 股"
      },
      {
        "field": "转增比例",
        "type": "float64",
        "description": "注意单位: 每 10 股"
      },
      {
        "field": "派息比例",
        "type": "float64",
        "description": "注意单位: 每 10 股"
      },
      {
        "field": "股权登记日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "除权日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "派息日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股份到账日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实施方案分红说明",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分红类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告时间",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-个股-历史分红",
    "data": [],
    "summary": {}
  }
}
```# 新股发行

## api call
ak.stock_ipo_info(stock="600004")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| stock | str | stock="600004"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-发行与分配-新股发行",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "所列项目"
      },
      {
        "field": "value",
        "type": "object",
        "description": "项目值"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-发行与分配-新股发行",
    "data": [],
    "summary": {}
  }
}
```# 新股上会信息

## api call
ak.stock_ipo_review_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股申购-新股上会信息",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "企业名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市板块",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上会日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审核状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发审委委员",
        "type": "object",
        "description": "-"
      },
      {
        "field": "主承销商",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行数量(股)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拟融资额(元)",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股申购-新股上会信息",
    "data": [],
    "summary": {}
  }
}
```# IPO辅导信息

## api call
ak.stock_ipo_tutor_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股申购-IPO辅导信息",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "企业名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "辅导机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "辅导状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "派出机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "备案日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股申购-IPO辅导信息",
    "data": [],
    "summary": {}
  }
}
```# 股票增发

## api call
ak.stock_add_stock(symbol="600004")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600004"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-发行与分配-增发",
    "data_structure": [
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行价格",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实际公司募集资金总额",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行费用总额",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实际发行数量",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-发行与分配-增发",
    "data": [],
    "summary": {}
  }
}
```# 个股限售解禁-新浪

## api call
ak.stock_restricted_release_queue_sina(symbol="600000")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600000"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-发行分配-限售解禁",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "解禁日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "解禁数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "解禁股流通市值",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "上市批次",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-发行分配-限售解禁",
    "data": [],
    "summary": {}
  }
}
```# 限售股解禁

## api call
ak.stock_restricted_release_summary_em(symbol="全部股票", start_date="20221108", end_date="20221209")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部股票"; choice of {"全部股票", "沪市A股", "科创板", "深市A股", "创业板", "京市A股"} |
| start_date | str | start_date="20221101" |
| end_date | str | end_date="20221209" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-限售股解禁",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "解禁时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "当日解禁股票家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "解禁数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "实际解禁数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "实际解禁市值",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "沪深300指数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "沪深300指数涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-限售股解禁",
    "data": [],
    "summary": {}
  }
}
```# 限售股解禁详情

## api call
ak.stock_restricted_release_detail_em(start_date="20221202", end_date="20221204")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20221202" |
| end_date | str | end_date="20241202" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-限售股解禁-解禁详情一览",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "解禁时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "限售股类型",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "解禁数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "实际解禁数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "实际解禁市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "占解禁前流通市值比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "解禁前一交易日收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "解禁前20日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "解禁后20日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-限售股解禁-解禁详情一览",
    "data": [],
    "summary": {}
  }
}
```# 解禁批次

## api call
ak.stock_restricted_release_queue_em(symbol="600000")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600000" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-个股限售解禁-解禁批次",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "解禁时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "解禁股东数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "解禁数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "实际解禁数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "未解禁数量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "实际解禁数量市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "占总市值比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "占流通市值比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "解禁前一交易日收盘价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "限售股类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "解禁前20日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "解禁后20日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-个股限售解禁-解禁批次",
    "data": [],
    "summary": {}
  }
}
```# 解禁股东

## api call
ak.stock_restricted_release_stockholder_em(symbol="600000", date="20200904")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600000" |
| date | str | date="20200904"; 通过 ak.stock_restricted_release_queue_em(symbol="600000") 获取 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-个股限售解禁-解禁股东",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "解禁数量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "实际解禁数量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "解禁市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "锁定期",
        "type": "int64",
        "description": "注意单位: 月"
      },
      {
        "field": "剩余未解禁数量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "限售股类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "进度",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-个股限售解禁-解禁股东",
    "data": [],
    "summary": {}
  }
}
```# 流通股东

## api call
ak.stock_circulate_stock_holder(symbol="600000")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600000"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-股东股本-流通股东",
    "data_structure": [
      {
        "field": "截止日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "编号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股数量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "占流通股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "股本性质",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-股东股本-流通股东",
    "data": [],
    "summary": {}
  }
}
```# 板块行情

## api call
ak.stock_sector_spot(indicator="新浪行业")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| indicator | str | indicator="新浪行业"; choice of {"新浪行业", "启明星行业", "概念", "地域", "行业"} |

## response
```json
{
  "metadata": {
    "description": "新浪行业-板块行情",
    "data_structure": [
      {
        "field": "label",
        "type": "object",
        "description": "-"
      },
      {
        "field": "板块",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "平均价格",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "总成交量",
        "type": "int64",
        "description": "注意单位: 手"
      },
      {
        "field": "总成交额",
        "type": "int64",
        "description": "注意单位: 万元"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "个股-涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "个股-当前价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "个股-涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪行业-板块行情",
    "data": [],
    "summary": {}
  }
}
```# 板块详情

## api call
ak.stock_sector_detail(sector="hangye_ZL01")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| sector | str | sector="hangye_ZL01"; 通过 ak.stock_sector_spot 返回数据的 label 字段选择 sector |

## response
```json
{
  "metadata": {
    "description": "新浪行业-板块行情-成份详情, 由于新浪网页提供的统计数据有误, 部分行业数量大于统计数",
    "data_structure": [
      {
        "field": "symbol",
        "type": "object",
        "description": "-"
      },
      {
        "field": "code",
        "type": "object",
        "description": "-"
      },
      {
        "field": "trade",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "pricechange",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "changepercent",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "buy",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "sell",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "settlement",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "open",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "high",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "low",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "volume",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "amount",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "ticktime",
        "type": "object",
        "description": "-"
      },
      {
        "field": "per",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "pb",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "mktcap",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "nmc",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "turnoverratio",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪行业-板块行情-成份详情, 由于新浪网页提供的统计数据有误, 部分行业数量大于统计数",
    "data": [],
    "summary": {}
  }
}
```# 股票列表-A股

## api call
ak.stock_info_a_code_name()

## response
```json
{
  "metadata": {
    "description": "沪深京 A 股股票代码和股票简称数据",
    "data_structure": [
      {
        "field": "code",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "沪深京 A 股股票代码和股票简称数据",
    "data": [],
    "summary": {}
  }
}
```# 股票列表-上证

## api call
ak.stock_info_sh_name_code(symbol="主板A股")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="主板A股"; choice of {"主板A股", "主板B股", "科创板"} |

## response
```json
{
  "metadata": {
    "description": "上海证券交易所股票代码和简称数据",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司全称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "上海证券交易所股票代码和简称数据",
    "data": [],
    "summary": {}
  }
}
```# 股票列表-深证

## api call
ak.stock_info_sz_name_code(symbol="A股列表")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="A股列表"; choice of {"A股列表", "B股列表", "CDR列表", "AB股列表"} |

## response
```json
{
  "metadata": {
    "description": "深证证券交易所股票代码和股票简称数据",
    "data_structure": []
  },
  "sample_data": {
    "description": "深证证券交易所股票代码和股票简称数据",
    "data": [],
    "summary": {}
  }
}
```# 股票列表-北证

## api call
ak.stock_info_bj_name_code()

## response
```json
{
  "metadata": {
    "description": "北京证券交易所股票代码和简称数据",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总股本",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "流通股本",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "地区",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "北京证券交易所股票代码和简称数据",
    "data": [],
    "summary": {}
  }
}
```# 终止/暂停上市-深证

## api call
ak.stock_info_sz_delist(symbol="终止上市公司")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="终止上市公司"; choice of {"暂停上市公司", "终止上市公司"} |

## response
```json
{
  "metadata": {
    "description": "深证证券交易所终止/暂停上市股票",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "终止上市日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "深证证券交易所终止/暂停上市股票",
    "data": [],
    "summary": {}
  }
}
```# 两网及退市

## api call
ak.stock_staq_net_stop()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-沪深个股-两网及退市",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-沪深个股-两网及退市",
    "data": [],
    "summary": {}
  }
}
```# 暂停/终止上市-上证

## api call
ak.stock_info_sh_delist(symbol="全部")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部"; choice of {"全部", "沪市", "科创板"} |

## response
```json
{
  "metadata": {
    "description": "上海证券交易所暂停/终止上市股票",
    "data_structure": [
      {
        "field": "公司代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "暂停上市日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "上海证券交易所暂停/终止上市股票",
    "data": [],
    "summary": {}
  }
}
```# 股票更名

## api call
ak.stock_info_change_name(symbol="000503")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000503"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-股票曾用名",
    "data_structure": [
      {
        "field": "index",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-股票曾用名",
    "data": [],
    "summary": {}
  }
}
```# 名称变更-深证

## api call
ak.stock_info_sz_change_name(symbol="全称变更")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全称变更"; choice of {"全称变更", "简称变更"} |

## response
```json
{
  "metadata": {
    "description": "深证证券交易所-市场数据-股票数据-名称变更",
    "data_structure": [
      {
        "field": "变更日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变更前全称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变更后全称",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "深证证券交易所-市场数据-股票数据-名称变更",
    "data": [],
    "summary": {}
  }
}
```# 基金持股

## api call
ak.stock_fund_stock_holder(symbol="601318")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600004"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-股本股东-基金持股",
    "data_structure": [
      {
        "field": "基金名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持仓数量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "占流通股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "持股市值",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "占净值比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "截止日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-股本股东-基金持股",
    "data": [],
    "summary": {}
  }
}
```# 主要股东

## api call
ak.stock_main_stock_holder(stock="600004")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| stock | str | stock="600004"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-股本股东-主要股东",
    "data_structure": [
      {
        "field": "编号",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "持股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "股本性质",
        "type": "object",
        "description": "-"
      },
      {
        "field": "截至日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东说明",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东总数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "平均持股数",
        "type": "float64",
        "description": "备注: 按总股本计算"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-股本股东-主要股东",
    "data": [],
    "summary": {}
  }
}
```# 机构持股一览表

## api call
ak.stock_institute_hold(symbol="20201")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="20051"; 从 2005 年开始, {"一季报":1, "中报":2 "三季报":3 "年报":4}, e.g., "20191", 其中的 1 表示一季报; "20193", 其中的 3 表示三季报; |

## response
```json
{
  "metadata": {
    "description": "新浪财经-机构持股-机构持股一览表",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "机构数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "机构数变化",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "持股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "持股比例增幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "占流通股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "占流通股比例增幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-机构持股-机构持股一览表",
    "data": [],
    "summary": {}
  }
}
```# 机构持股详情

## api call
ak.stock_institute_hold_detail(stock="300003", quarter="20201")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| stock | str | stock="300003"; 股票代码 |
| quarter | str | quarter="20201"; 从 2005 年开始, {"一季报":1, "中报":2 "三季报":3 "年报":4}, e.g., "20191", 其中的 1 表示一季报; "20193", 其中的 3 表示三季报; |

## response
```json
{
  "metadata": {
    "description": "新浪财经-机构持股-机构持股详情",
    "data_structure": [
      {
        "field": "持股机构类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股机构代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股机构简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股机构全称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "最新持股数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "持股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新持股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "占流通股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新占流通股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "持股比例增幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "占流通股比例增幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-机构持股-机构持股详情",
    "data": [],
    "summary": {}
  }
}
```# 机构推荐池

## api call
ak.stock_institute_recommend(symbol="投资评级选股")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="行业关注度"; choice of {'最新投资评级', '上调评级股票', '下调评级股票', '股票综合评级', '首次评级股票', '目标涨幅排名', '机构关注度', '行业关注度', '投资评级选股'} |

## response
```json
{
  "metadata": {
    "description": "新浪财经-机构推荐池-具体指标的数据",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "根据特定 indicator 而定"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-机构推荐池-具体指标的数据",
    "data": [],
    "summary": {}
  }
}
```# 股票评级记录

## api call
ak.stock_institute_recommend_detail(symbol="002709")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001" |

## response
```json
{
  "metadata": {
    "description": "新浪财经-机构推荐池-股票评级记录",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "str",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "str",
        "description": "-"
      },
      {
        "field": "目标价",
        "type": "str",
        "description": "-"
      },
      {
        "field": "最新评级",
        "type": "str",
        "description": "-"
      },
      {
        "field": "评级机构",
        "type": "str",
        "description": "-"
      },
      {
        "field": "分析师",
        "type": "str",
        "description": "-"
      },
      {
        "field": "行业",
        "type": "str",
        "description": "-"
      },
      {
        "field": "评级日期",
        "type": "str",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-机构推荐池-股票评级记录",
    "data": [],
    "summary": {}
  }
}
```# 投资评级

## api call
ak.stock_rank_forecast_cninfo(date="20230817")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210910"; 交易日 |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-评级预测-投资评级",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发布日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "研究机构简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "研究员名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "投资评级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "是否首次评级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "评级变化",
        "type": "object",
        "description": "-"
      },
      {
        "field": "前一次投资评级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "目标价格-下限",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "目标价格-上限",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-评级预测-投资评级",
    "data": [],
    "summary": {}
  }
}
```# 申万个股行业分类变动历史

## api call
ak.stock_industry_clf_hist_sw()

## response
```json
{
  "metadata": {
    "description": "申万宏源研究-行业分类-全部行业分类",
    "data_structure": [
      {
        "field": "symbol",
        "type": "object",
        "description": "股票代码"
      },
      {
        "field": "start_date",
        "type": "object",
        "description": "计入日期"
      },
      {
        "field": "industry_code",
        "type": "object",
        "description": "申万行业代码"
      },
      {
        "field": "update_time",
        "type": "object",
        "description": "更新日期"
      }
    ]
  },
  "sample_data": {
    "description": "申万宏源研究-行业分类-全部行业分类",
    "data": [],
    "summary": {}
  }
}
```# 行业市盈率

## api call
ak.stock_industry_pe_ratio_cninfo(symbol="国证行业分类", date="20240617")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="证监会行业分类"; choice of {"证监会行业分类", "国证行业分类"} |
| date | str | date="20210910"; 交易日 |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-行业分析-行业市盈率",
    "data_structure": [
      {
        "field": "变动日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业分类",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业层级",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "行业编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "纳入计算公司数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值-静态",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "净利润-静态",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "静态市盈率-加权平均",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "静态市盈率-中位数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "静态市盈率-算术平均",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-行业分析-行业市盈率",
    "data": [],
    "summary": {}
  }
}
```# 新股过会

## api call
ak.stock_new_gh_cninfo()

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-新股数据-新股过会",
    "data_structure": [
      {
        "field": "公司名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上会日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审核类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审议内容",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审核结果",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审核公告日",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-新股数据-新股过会",
    "data": [],
    "summary": {}
  }
}
```# 新股发行

## api call
ak.stock_new_ipo_cninfo()

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-新股数据-新股发行",
    "data_structure": [
      {
        "field": "证劵代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "总发行数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "发行市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上网发行中签率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "摇号结果公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "中签公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "中签缴款日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "网上申购上限",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上网发行数量",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-新股数据-新股发行",
    "data": [],
    "summary": {}
  }
}
```# 董监高及相关人员持股变动-上证

## api call
ak.stock_share_hold_change_sse(symbol="600000")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600000"; choice of {"全部", "具体股票代码"} |

## response
```json
{
  "metadata": {
    "description": "上海证券交易所-披露-监管信息公开-公司监管-董董监高人员股份变动",
    "data_structure": [
      {
        "field": "公司代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "姓名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "职务",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票种类",
        "type": "object",
        "description": "-"
      },
      {
        "field": "货币种类",
        "type": "object",
        "description": "-"
      },
      {
        "field": "本次变动前持股数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "变动数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "本次变动平均价格",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动后持股数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "变动原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "填报日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "上海证券交易所-披露-监管信息公开-公司监管-董董监高人员股份变动",
    "data": [],
    "summary": {}
  }
}
```# 董监高及相关人员持股变动-深证

## api call
ak.stock_share_hold_change_szse(symbol="001308")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="001308"; choice of {"全部", "具体股票代码"} |

## response
```json
{
  "metadata": {
    "description": "深圳证券交易所-信息披露-监管信息公开-董监高人员股份变动",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "董监高姓名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动股份数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "成交均价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动比例",
        "type": "float64",
        "description": "注意单位: 千分之一"
      },
      {
        "field": "当日结存股数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "股份变动人姓名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "职务",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动人与董监高的关系",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "深圳证券交易所-信息披露-监管信息公开-董监高人员股份变动",
    "data": [],
    "summary": {}
  }
}
```# 董监高及相关人员持股变动-北证

## api call
ak.stock_share_hold_change_bse(symbol="430489")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="430489"; choice of {"全部", "具体股票代码"} |

## response
```json
{
  "metadata": {
    "description": "北京证券交易所-信息披露-监管信息-董监高及相关人员持股变动",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "姓名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "职务",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动股数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "变动前持股数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "变动后持股数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "变动均价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "变动原因",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "北京证券交易所-信息披露-监管信息-董监高及相关人员持股变动",
    "data": [],
    "summary": {}
  }
}
```# 股东人数及持股集中度

## api call
ak.stock_hold_num_cninfo(date="20210630")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210630"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20170331 开始 |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-股东股本-股东人数及持股集中度",
    "data_structure": [
      {
        "field": "证劵代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "本期股东人数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上期股东人数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股东人数增幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "本期人均持股数量",
        "type": "int64",
        "description": "注意单位: 万股"
      },
      {
        "field": "上期人均持股数量",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "人均持股数量增幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-股东股本-股东人数及持股集中度",
    "data": [],
    "summary": {}
  }
}
```# 股本变动

## api call
ak.stock_hold_change_cninfo(symbol="全部")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部"; choice of {"深市主板", "沪市", "创业板", "科创板", "北交所", "全部"} |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-股东股本-股本变动",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总股本",
        "type": "float64",
        "description": "单位: 万股"
      },
      {
        "field": "已流通股份",
        "type": "float64",
        "description": "单位: 万股"
      },
      {
        "field": "已流通比例",
        "type": "float64",
        "description": "单位: %"
      },
      {
        "field": "流通受限股份",
        "type": "float64",
        "description": "单位: 万股"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-股东股本-股本变动",
    "data": [],
    "summary": {}
  }
}
```# 实际控制人持股变动

## api call
ak.stock_hold_control_cninfo(symbol="全部")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部"; choice of {"单独控制", "实际控制人", "一致行动人", "家族控制", "全部"}; 从 2010 开始 |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-股东股本-实际控制人持股变动",
    "data_structure": [
      {
        "field": "证劵代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实际控制人名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "控股数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "控股比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "直接控制人名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "控制类型",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-股东股本-实际控制人持股变动",
    "data": [],
    "summary": {}
  }
}
```# 高管持股变动明细

## api call
ak.stock_hold_management_detail_cninfo(symbol="增持")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="增持"; choice of {"增持", "减持"} |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-股东股本-高管持股变动明细",
    "data_structure": [
      {
        "field": "证劵代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "截止日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "高管姓名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "董监高姓名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "董监高职务",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动人与董监高关系",
        "type": "object",
        "description": "-"
      },
      {
        "field": "期初持股数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "期末持股数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "变动数量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动比例",
        "type": "int64",
        "description": "注意单位: %"
      },
      {
        "field": "成交均价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "期末市值",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "持股变动原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "数据来源",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-股东股本-高管持股变动明细",
    "data": [],
    "summary": {}
  }
}
```# 董监高及相关人员持股变动明细

## api call
ak.stock_hold_management_detail_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-高管持股-董监高及相关人员持股变动明细",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动股数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交均价",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "变动金额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动后持股数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "持股种类",
        "type": "object",
        "description": "-"
      },
      {
        "field": "董监高人员姓名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "职务",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动人与董监高的关系",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开始时持有",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "结束后持有",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-高管持股-董监高及相关人员持股变动明细",
    "data": [],
    "summary": {}
  }
}
```# 人员增减持股变动明细

## api call
ak.stock_hold_management_person_em(symbol="001308", name="孙建华")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="001308"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-高管持股-人员增减持股变动明细",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动股数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交均价",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "变动金额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动后持股数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "持股种类",
        "type": "object",
        "description": "-"
      },
      {
        "field": "董监高人员姓名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "职务",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动人与董监高的关系",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开始时持有",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "结束后持有",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-高管持股-人员增减持股变动明细",
    "data": [],
    "summary": {}
  }
}
```# 对外担保

## api call
ak.stock_cg_guarantee_cninfo(symbol="全部", start_date="20180630", end_date="20210927")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部"; choice of {"全部", "深市主板", "沪市", "创业板", "科创板"} |
| start_date | str | start_date="20180630" |
| end_date | str | end_date="20210927" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-公司治理-对外担保",
    "data_structure": [
      {
        "field": "证劵代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告统计区间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "担保笔数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "担保金额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "归属于母公司所有者权益",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "担保金融占净资产比例",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-公司治理-对外担保",
    "data": [],
    "summary": {}
  }
}
```# 公司诉讼

## api call
ak.stock_cg_lawsuit_cninfo(symbol="全部", start_date="20180630", end_date="20210927")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部"; choice of {"全部", "深市主板", "沪市", "创业板", "科创板"} |
| start_date | str | start_date="20180630" |
| end_date | str | end_date="20210927" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-公司治理-公司诉讼",
    "data_structure": [
      {
        "field": "证劵代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告统计区间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "诉讼次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "诉讼金额",
        "type": "float64",
        "description": "注意单位: 万元"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-公司治理-公司诉讼",
    "data": [],
    "summary": {}
  }
}
```# 股权质押

## api call
ak.stock_cg_equity_mortgage_cninfo(date="20210930")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210930" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-公司治理-股权质押",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "出质人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "质权人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "质押数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "占总股本比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "质押解除数量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "质押事项",
        "type": "object",
        "description": "注意单位: 万元"
      },
      {
        "field": "累计质押占总股本比例",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-公司治理-股权质押",
    "data": [],
    "summary": {}
  }
}
```# 美港目标价

## api call
ak.stock_price_js(symbol="us")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="us"; choice of {"us", "hk"} |

## response
```json
{
  "metadata": {
    "description": "美港电讯-美港目标价数据",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "个股名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "评级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "先前目标价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新目标价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "机构名称",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "美港电讯-美港目标价数据",
    "data": [],
    "summary": {}
  }
}
```# 券商业绩月报

## api call
ak.stock_qsjy_em(date="20200430")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20200430"; 输入需要查询月份的最后一天的日期 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-券商业绩月报",
    "data_structure": [
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "当月净利润-净利润",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "当月净利润-同比增长",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "当月净利润-环比增长",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "当年累计净利润-累计净利润",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "当年累计净利润-同比增长",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "当月营业收入-营业收入",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "当月营业收入-环比增长",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "当月营业收入-同比增长",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "当年累计营业收入-累计营业收入",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "当年累计营业收入-同比增长",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净资产-净资产",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "净资产-同比增长",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-券商业绩月报",
    "data": [],
    "summary": {}
  }
}
```# A 股股息率

## api call
ak.stock_a_gxl_lg(symbol="上证A股")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="上证A股"; choice of {"上证A股", "深证A股", "创业板", "科创板"} |

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-股息率-A 股股息率",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股息率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-股息率-A 股股息率",
    "data": [],
    "summary": {}
  }
}
```# 恒生指数股息率

## api call
ak.stock_hk_gxl_lg()

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-股息率-恒生指数股息率",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股息率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-股息率-恒生指数股息率",
    "data": [],
    "summary": {}
  }
}
```# 大盘拥挤度

## api call
ak.stock_a_congestion_lg()

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-大盘拥挤度",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "日期"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "收盘价"
      },
      {
        "field": "congestion",
        "type": "float64",
        "description": "拥挤度"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-大盘拥挤度",
    "data": [],
    "summary": {}
  }
}
```# 股债利差

## api call
ak.stock_ebs_lg()

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-股债利差",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "沪深300指数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股债利差",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股债利差均线",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-股债利差",
    "data": [],
    "summary": {}
  }
}
```# 巴菲特指标

## api call
ak.stock_buffett_index_lg()

## response
```json
{
  "metadata": {
    "description": "乐估乐股-底部研究-巴菲特指标",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "交易日"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "A股收盘价*已发行股票总股本（A股+B股+H股）"
      },
      {
        "field": "GDP",
        "type": "float64",
        "description": "上年度国内生产总值（例如：2019年，则取2018年GDP）"
      },
      {
        "field": "近十年分位数",
        "type": "float64",
        "description": "当前\"总市值/GDP\"在历史数据上的分位数"
      },
      {
        "field": "总历史分位数",
        "type": "float64",
        "description": "当前\"总市值/GDP\"在历史数据上的分位数"
      }
    ]
  },
  "sample_data": {
    "description": "乐估乐股-底部研究-巴菲特指标",
    "data": [],
    "summary": {}
  }
}
```# A 股等权重与中位数市盈率

## api call
ak.stock_a_ttm_lyr()

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-A 股等权重市盈率与中位数市盈率",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "日期"
      },
      {
        "field": "middlePETTM",
        "type": "float64",
        "description": "全A股滚动市盈率(TTM)中位数"
      },
      {
        "field": "averagePETTM",
        "type": "float64",
        "description": "全A股滚动市盈率(TTM)等权平均"
      },
      {
        "field": "middlePELYR",
        "type": "float64",
        "description": "全A股静态市盈率(LYR)中位数"
      },
      {
        "field": "averagePELYR",
        "type": "float64",
        "description": "全A股静态市盈率(LYR)等权平均"
      },
      {
        "field": "quantileInAllHistoryMiddlePeTtm",
        "type": "float64",
        "description": "当前\"TTM(滚动市盈率)中位数\"在历史数据上的分位数"
      },
      {
        "field": "quantileInRecent10YearsMiddlePeTtm",
        "type": "float64",
        "description": "当前\"TTM(滚动市盈率)中位数\"在最近10年数据上的分位数"
      },
      {
        "field": "quantileInAllHistoryAveragePeTtm",
        "type": "float64",
        "description": "当前\"TTM(滚动市盈率)等权平均\"在历史数据上的分位数"
      },
      {
        "field": "quantileInRecent10YearsAveragePeTtm",
        "type": "float64",
        "description": "当前\"TTM(滚动市盈率)等权平均\"在在最近10年数据上的分位数"
      },
      {
        "field": "quantileInAllHistoryMiddlePeLyr",
        "type": "float64",
        "description": "当前\"LYR(静态市盈率)中位数\"在历史数据上的分位数"
      },
      {
        "field": "quantileInRecent10YearsMiddlePeLyr",
        "type": "float64",
        "description": "当前\"LYR(静态市盈率)中位数\"在最近10年数据上的分位数"
      },
      {
        "field": "quantileInAllHistoryAveragePeLyr",
        "type": "float64",
        "description": "当前\"LYR(静态市盈率)等权平均\"在历史数据上的分位数"
      },
      {
        "field": "quantileInRecent10YearsAveragePeLyr",
        "type": "float64",
        "description": "当前\"LYR(静态市盈率)等权平均\"在最近10年数据上的分位数"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "沪深300指数"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-A 股等权重市盈率与中位数市盈率",
    "data": [],
    "summary": {}
  }
}
```# A 股等权重与中位数市净率

## api call
ak.stock_a_all_pb()

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-A 股等权重与中位数市净率",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "日期"
      },
      {
        "field": "middlePB",
        "type": "float64",
        "description": "全部A股市净率中位数"
      },
      {
        "field": "equalWeightAveragePB",
        "type": "float64",
        "description": "全部A股市净率等权平均"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "上证指数"
      },
      {
        "field": "quantileInAllHistoryMiddlePB",
        "type": "float64",
        "description": "当前市净率中位数在历史数据上的分位数"
      },
      {
        "field": "quantileInRecent10YearsMiddlePB",
        "type": "float64",
        "description": "当前市净率中位数在最近10年数据上的分位数"
      },
      {
        "field": "quantileInAllHistoryEqualWeightAveragePB",
        "type": "float64",
        "description": "当前市净率等权平均在历史数据上的分位数"
      },
      {
        "field": "quantileInRecent10YearsEqualWeightAveragePB",
        "type": "float64",
        "description": "当前市净率等权平均在最近10年数据上的分位数"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-A 股等权重与中位数市净率",
    "data": [],
    "summary": {}
  }
}
```# 主板市盈率

## api call
ak.stock_market_pe_lg()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="上证"; choice of {"上证", "深证", "创业板", "科创版"} |

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-主板市盈率",
    "data_structure": []
  },
  "sample_data": {
    "description": "乐咕乐股-主板市盈率",
    "data": [],
    "summary": {}
  }
}
```# 指数市盈率

## api call
ak.stock_index_pe_lg(symbol="上证50")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="上证50"; choice of {"上证50", "沪深300", "上证380", "创业板50", "中证500", "上证180", "深证红利", "深证100", "中证1000", "上证红利", "中证100", "中证800"} |

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-指数市盈率",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "指数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "等权静态市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "静态市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "静态市盈率中位数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "等权滚动市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "滚动市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "滚动市盈率中位数",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-指数市盈率",
    "data": [],
    "summary": {}
  }
}
```# 主板市净率

## api call
ak.stock_market_pb_lg(symbol="上证")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="上证"; choice of {"上证", "深证", "创业板", "科创版"} |

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-主板市净率",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "指数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "等权市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率中位数",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-主板市净率",
    "data": [],
    "summary": {}
  }
}
```# 指数市净率

## api call
ak.stock_index_pb_lg(symbol="上证50")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="上证50"; choice of {"上证50", "沪深300", "上证380", "创业板50", "中证500", "上证180", "深证红利", "深证100", "中证1000", "上证红利", "中证100", "中证800"} |

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-指数市净率",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "指数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "等权市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率中位数",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-指数市净率",
    "data": [],
    "summary": {}
  }
}
```# A 股估值指标

## api call
ak.stock_zh_valuation_baidu(symbol="002044", indicator="总市值", period="近一年")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="002044"; A 股代码 |
| indicator | str | indicator="总市值"; choice of {"总市值", "市盈率(TTM)", "市盈率(静)", "市净率", "市现率"} |
| period | str | period="近一年"; choice of {"近一年", "近三年", "近五年", "近十年", "全部"} |

## response
```json
{
  "metadata": {
    "description": "百度股市通-A 股-财务报表-估值数据",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "百度股市通-A 股-财务报表-估值数据",
    "data": [],
    "summary": {}
  }
}
```# 个股估值

## api call
ak.stock_value_em(symbol="300766")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="002044"; A 股代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-估值分析-每日互动-每日互动-估值分析",
    "data_structure": [
      {
        "field": "数据日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "当日收盘价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "当日涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "总股本",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "流通股本",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "PE(TTM)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "PE(静)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "PEG值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市现率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市销率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-估值分析-每日互动-每日互动-估值分析",
    "data": [],
    "summary": {}
  }
}
```# 涨跌投票

## api call
ak.stock_zh_vote_baidu(symbol="000001", indicator="指数")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; A 股股票或指数代码 |
| indicator | str | indicator="指数"; choice of {"指数", "股票"} |

## response
```json
{
  "metadata": {
    "description": "百度股市通- A 股或指数-股评-投票",
    "data_structure": [
      {
        "field": "周期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "看涨",
        "type": "object",
        "description": "-"
      },
      {
        "field": "看跌",
        "type": "object",
        "description": "-"
      },
      {
        "field": "看涨比例",
        "type": "object",
        "description": "-"
      },
      {
        "field": "看跌比例",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "百度股市通- A 股或指数-股评-投票",
    "data": [],
    "summary": {}
  }
}
```# 港股个股指标

## api call
ak.stock_hk_indicator_eniu()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="hk01093"; 可通过调用 ak.stock_hk_indicator_eniu(symbol="hk01093", indicator="港股") 获取股票代码 |
| indicator | str | indicator="市盈率"; choice of {"港股", "市盈率", "市净率", "股息率", "ROE", "市值"} |

## response
```json
{
  "metadata": {
    "description": "亿牛网-港股个股指标: 市盈率, 市净率, 股息率, ROE, 市值",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "根据 indicator 而异"
      }
    ]
  },
  "sample_data": {
    "description": "亿牛网-港股个股指标: 市盈率, 市净率, 股息率, ROE, 市值",
    "data": [],
    "summary": {}
  }
}
```# 港股估值指标

## api call
ak.stock_hk_valuation_baidu(symbol="06969", indicator="总市值", period="近一年")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="02358"; 港股代码 |
| indicator | str | indicator="总市值"; choice of {"总市值", "市盈率(TTM)", "市盈率(静)", "市净率", "市现率"} |
| period | str | period="近一年"; choice of {"近一年", "近三年", "全部"} |

## response
```json
{
  "metadata": {
    "description": "百度股市通-港股-财务报表-估值数据",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "百度股市通-港股-财务报表-估值数据",
    "data": [],
    "summary": {}
  }
}
```# 美股估值指标

## api call
ak.stock_us_valuation_baidu(symbol="NVDA", indicator="总市值", period="近一年")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="NVDA"; 美股代码 |
| indicator | str | indicator="总市值"; choice of {"总市值", "市盈率(TTM)", "市盈率(静)", "市净率", "市现率"} |
| period | str | period="近一年"; choice of {"近一年", "近三年", "全部"} |

## response
```json
{
  "metadata": {
    "description": "百度股市通-美股-财务报表-估值数据",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "百度股市通-美股-财务报表-估值数据",
    "data": [],
    "summary": {}
  }
}
```# 创新高和新低的股票数量

## api call
ak.stock_a_high_low_statistics(symbol="all")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="all"; {"all": "全部A股", "sz50": "上证50", "hs300": "沪深300", "zz500": "中证500"} |

## response
```json
{
  "metadata": {
    "description": "不同市场的创新高和新低的股票数量",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "交易日"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "相关指数收盘价"
      },
      {
        "field": "high20",
        "type": "int64",
        "description": "20日新高"
      },
      {
        "field": "low20",
        "type": "int64",
        "description": "20日新低"
      },
      {
        "field": "high60",
        "type": "int64",
        "description": "60日新高"
      },
      {
        "field": "low60",
        "type": "int64",
        "description": "60日新低"
      },
      {
        "field": "high120",
        "type": "int64",
        "description": "120日新高"
      },
      {
        "field": "low120",
        "type": "int64",
        "description": "120日新低"
      }
    ]
  },
  "sample_data": {
    "description": "不同市场的创新高和新低的股票数量",
    "data": [],
    "summary": {}
  }
}
```# 破净股统计

## api call
ak.stock_a_below_net_asset_statistics()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部A股"; choice of {"全部A股", "沪深300", "上证50", "中证500"} |

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-A 股破净股统计数据",
    "data_structure": []
  },
  "sample_data": {
    "description": "乐咕乐股-A 股破净股统计数据",
    "data": [],
    "summary": {}
  }
}
```# 基金持股

## api call
ak.stock_report_fund_hold(symbol="基金持仓", date="20200630")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="基金持仓"; choice of {"基金持仓", "QFII持仓", "社保持仓", "券商持仓", "保险持仓", "信托持仓"} |
| date | str | date="20200630"; 财报发布日期, xxxx-03-31, xxxx-06-30, xxxx-09-30, xxxx-12-31 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-主力数据-基金持仓",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持有基金家数",
        "type": "int64",
        "description": "注意单位: 家"
      },
      {
        "field": "持股总数",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "持股市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "持股变化",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股变动数值",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "持股变动比例",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-主力数据-基金持仓",
    "data": [],
    "summary": {}
  }
}
```# 基金持股明细

## api call
ak.stock_report_fund_hold_detail(symbol="005827", date="20201231")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="005827"; 基金代码 |
| date | str | date="20200630"; 财报发布日期, xxxx-03-31, xxxx-06-30, xxxx-09-30, xxxx-12-31 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-主力数据-基金持仓-基金持仓明细表",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股数",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "持股市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "占总股本比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "占流通股本比例",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-主力数据-基金持仓-基金持仓明细表",
    "data": [],
    "summary": {}
  }
}
```# 龙虎榜详情

## api call
ak.stock_lhb_detail_em(start_date="20230403", end_date="20230417")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20220314" |
| end_date | str | end_date="20220315" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-龙虎榜单-龙虎榜详情",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "解读",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "龙虎榜净买额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "龙虎榜买入额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "龙虎榜卖出额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "龙虎榜成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "市场总成交额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "净买额占总成交比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成交额占总成交比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "上榜原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜后1日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后2日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后5日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后10日",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-龙虎榜单-龙虎榜详情",
    "data": [],
    "summary": {}
  }
}
```# 个股上榜统计

## api call
ak.stock_lhb_stock_statistic_em(symbol="近一月")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="近一月"; choice of {"近一月", "近三月", "近六月", "近一年"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-龙虎榜单-个股上榜统计",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最近上榜日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上榜次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "龙虎榜净买额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "龙虎榜买入额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "龙虎榜卖出额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "龙虎榜总成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "买方机构次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "卖方机构次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "机构买入净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "机构买入总额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "机构卖出总额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "近1个月涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "近3个月涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "近6个月涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "近1年涨跌幅",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-龙虎榜单-个股上榜统计",
    "data": [],
    "summary": {}
  }
}
```# 机构买卖每日统计

## api call
ak.stock_lhb_jgmmtj_em(start_date="20240417", end_date="20240430")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20240417" |
| end_date | str | end_date="20240430" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-龙虎榜单-机构买卖每日统计",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "买方机构数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖方机构数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "机构买入总额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "机构卖出总额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "机构买入净额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "市场总成交额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "机构净买额占总成交额比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "上榜原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-龙虎榜单-机构买卖每日统计",
    "data": [],
    "summary": {}
  }
}
```# 机构席位追踪

## api call
ak.stock_lhb_jgstatistic_em(symbol="近一月")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="近一月"; choice of {"近一月", "近三月", "近六月", "近一年"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-龙虎榜单-机构席位追踪",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "龙虎榜成交金额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "上榜次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "机构买入额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "机构买入次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "机构卖出额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "机构卖出次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "机构净买额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "近1个月涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3个月涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近6个月涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1年涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-龙虎榜单-机构席位追踪",
    "data": [],
    "summary": {}
  }
}
```# 每日活跃营业部

## api call
ak.stock_lhb_hyyyb_em(start_date="20220324", end_date="20220324")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20220311" |
| end_date | str | end_date="20220315" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-龙虎榜单-每日活跃营业部",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "买入个股数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖出个股数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "买入总金额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "卖出总金额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "总买卖净额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "买入股票",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-龙虎榜单-每日活跃营业部",
    "data": [],
    "summary": {}
  }
}
```# 营业部详情数据-东财

## api call
ak.stock_lhb_yyb_detail_em(symbol="10188715")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="10026729"; 营业部代码, 通过 ak.stock_lhb_hyyyb_em() 接口获取 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-龙虎榜单-营业部历史交易明细-营业部交易明细",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业部代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "营业部简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "买入金额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "卖出金额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "净额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "上榜原因",
        "type": "object",
        "description": "-"
      },
      {
        "field": "1日后涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "2日后涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "3日后涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "5日后涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "10日后涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "20日后涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "30日后涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-龙虎榜单-营业部历史交易明细-营业部交易明细",
    "data": [],
    "summary": {}
  }
}
```# 营业部排行

## api call
ak.stock_lhb_yybph_em(symbol="近一月")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="近一月"; choice of {"近一月", "近三月", "近六月", "近一年"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-龙虎榜单-营业部排行",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜后1天-买入次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上榜后1天-平均涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后1天-上涨概率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后2天-买入次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上榜后2天-平均涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后2天-上涨概率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后3天-买入次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上榜后3天-平均涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后3天-上涨概率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后4天-买入次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上榜后4天-平均涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后4天-上涨概率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后10天-买入次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上榜后10天-平均涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后10天-上涨概率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-龙虎榜单-营业部排行",
    "data": [],
    "summary": {}
  }
}
```# 营业部统计

## api call
ak.stock_lhb_traderstatistic_em(symbol="近一月")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="近一月"; choice of {"近一月", "近三月", "近六月", "近一年"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-龙虎榜单-营业部统计",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "龙虎榜成交金额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上榜次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "买入额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "买入次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "卖出额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "卖出次数",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-龙虎榜单-营业部统计",
    "data": [],
    "summary": {}
  }
}
```# 个股龙虎榜详情

## api call
ak.stock_lhb_stock_detail_em(symbol="600077", date="20070416", flag="买入")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600077"; |
| date | str | date="20220310"; 需要通过 ak.stock_lhb_stock_detail_date_em(symbol="600077") 接口获取相应股票的有龙虎榜详情数据的日期 |
| flag | str | flag="卖出";  choice of {"买入", "卖出"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-龙虎榜单-个股龙虎榜详情",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "交易营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "买入金额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "买入金额-占总成交比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖出金额-占总成交比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "类型",
        "type": "object",
        "description": "该字段主要处理多种龙虎榜标准问题"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-龙虎榜单-个股龙虎榜详情",
    "data": [],
    "summary": {}
  }
}
```# 龙虎榜-营业部排行-上榜次数最多

## api call
ak.stock_lh_yyb_most()

## response
```json
{
  "metadata": {
    "description": "龙虎榜-营业部排行-上榜次数最多",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "合计动用资金",
        "type": "object",
        "description": "-"
      },
      {
        "field": "年内上榜次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "年内买入股票只数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "年内3日跟买成功率",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "龙虎榜-营业部排行-上榜次数最多",
    "data": [],
    "summary": {}
  }
}
```# 龙虎榜-营业部排行-资金实力最强

## api call
ak.stock_lh_yyb_capital()

## response
```json
{
  "metadata": {
    "description": "龙虎榜-营业部排行-资金实力最强",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "今日最高操作",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "今日最高金额",
        "type": "object",
        "description": "-"
      },
      {
        "field": "今日最高买入金额",
        "type": "object",
        "description": "-"
      },
      {
        "field": "累计参与金额",
        "type": "object",
        "description": "-"
      },
      {
        "field": "累计买入金额",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "龙虎榜-营业部排行-资金实力最强",
    "data": [],
    "summary": {}
  }
}
```# 龙虎榜-营业部排行-抱团操作实力

## api call
ak.stock_lh_yyb_control()

## response
```json
{
  "metadata": {
    "description": "龙虎榜-营业部排行-抱团操作实力",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "携手营业部家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "年内最佳携手对象",
        "type": "object",
        "description": "-"
      },
      {
        "field": "年内最佳携手股票数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "年内最佳携手成功率",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "龙虎榜-营业部排行-抱团操作实力",
    "data": [],
    "summary": {}
  }
}
```# 龙虎榜-每日详情

## api call
ak.stock_lhb_detail_daily_sina(date="20240222")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20240222"; 交易日 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-龙虎榜-每日详情",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "对应值",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "指标",
        "type": "object",
        "description": "注意单位: 万元"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-龙虎榜-每日详情",
    "data": [],
    "summary": {}
  }
}
```# 龙虎榜-个股上榜统计

## api call
ak.stock_lhb_ggtj_sina(symbol="5")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="5"; choice of {"5": 最近 5 天; "10": 最近 10 天; "30": 最近 30 天; "60": 最近 60 天;} |

## response
```json
{
  "metadata": {
    "description": "新浪财经-龙虎榜-个股上榜统计",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "累积购买额",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "累积卖出额",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "净额",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "买入席位数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "卖出席位数",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-龙虎榜-个股上榜统计",
    "data": [],
    "summary": {}
  }
}
```# 龙虎榜-营业上榜统计

## api call
ak.stock_lhb_yytj_sina(symbol="5")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="5"; choice of {"5": 最近 5 天; "10": 最近 10 天; "30": 最近 30 天; "60": 最近 60 天;} |

## response
```json
{
  "metadata": {
    "description": "新浪财经-龙虎榜-营业上榜统计",
    "data_structure": [
      {
        "field": "营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "累积购买额",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "买入席位数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "累积卖出额",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "卖出席位数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "买入前三股票",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-龙虎榜-营业上榜统计",
    "data": [],
    "summary": {}
  }
}
```# 龙虎榜-机构席位追踪

## api call
ak.stock_lhb_jgzz_sina(symbol="5")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="5"; choice of {"5": 最近 5 天; "10": 最近 10 天; "30": 最近 30 天; "60": 最近 60 天;} |

## response
```json
{
  "metadata": {
    "description": "新浪财经-龙虎榜-机构席位追踪",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "累积买入额",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "买入次数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "累积卖出额",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "卖出次数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "净额",
        "type": "float64",
        "description": "注意单位: 万"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-龙虎榜-机构席位追踪",
    "data": [],
    "summary": {}
  }
}
```# 龙虎榜-机构席位成交明细

## api call
ak.stock_lhb_jgmx_sina()

## response
```json
{
  "metadata": {
    "description": "新浪财经-龙虎榜-机构席位成交明细",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "机构席位买入额",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "机构席位卖出额",
        "type": "float64",
        "description": "注意单位: 万"
      },
      {
        "field": "类型",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-龙虎榜-机构席位成交明细",
    "data": [],
    "summary": {}
  }
}
```# 首发申报信息

## api call
ak.stock_ipo_declare_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股申购-首发申报信息-首发申报企业信息",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "企业名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册地",
        "type": "object",
        "description": "-"
      },
      {
        "field": "保荐机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "律师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "会计师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拟上市地点",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "招股说明书",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股申购-首发申报信息-首发申报企业信息",
    "data": [],
    "summary": {}
  }
}
```# 全部

## api call
ak.stock_register_all_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-全部",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "企业名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册地",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "保荐机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "律师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "会计师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "受理日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拟上市地点",
        "type": "object",
        "description": "-"
      },
      {
        "field": "招股说明书",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-全部",
    "data": [],
    "summary": {}
  }
}
```# 科创板

## api call
ak.stock_register_kcb()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-科创板",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "发行人全称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审核状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册地",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证监会行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "保荐机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "律师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "会计师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "受理日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拟上市地点",
        "type": "object",
        "description": "-"
      },
      {
        "field": "招股说明书",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-科创板",
    "data": [],
    "summary": {}
  }
}
```# 创业板

## api call
ak.stock_register_cyb()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-创业板",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "发行人全称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审核状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册地",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证监会行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "保荐机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "律师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "会计师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "受理日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拟上市地点",
        "type": "object",
        "description": "-"
      },
      {
        "field": "招股说明书",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-创业板",
    "data": [],
    "summary": {}
  }
}
```# 上海主板

## api call
ak.stock_register_sh()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-上海主板",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "发行人全称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审核状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册地",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证监会行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "保荐机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "律师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "会计师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "受理日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拟上市地点",
        "type": "object",
        "description": "-"
      },
      {
        "field": "招股说明书",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-上海主板",
    "data": [],
    "summary": {}
  }
}
```# 深圳主板

## api call
ak.stock_register_sz()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-深圳主板",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "发行人全称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审核状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册地",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证监会行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "保荐机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "律师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "会计师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "受理日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拟上市地点",
        "type": "object",
        "description": "-"
      },
      {
        "field": "招股说明书",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-深圳主板",
    "data": [],
    "summary": {}
  }
}
```# 北交所

## api call
ak.stock_register_bj()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-北交所",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "发行人全称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "审核状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册地",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证监会行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "保荐机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "律师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "会计师事务所",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "受理日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拟上市地点",
        "type": "object",
        "description": "-"
      },
      {
        "field": "招股说明书",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-IPO审核信息-北交所",
    "data": [],
    "summary": {}
  }
}
```# 达标企业

## api call
ak.stock_register_db()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-注册制审核-达标企业",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "企业名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "经营范围",
        "type": "object",
        "description": "-"
      },
      {
        "field": "近三年营业收入-2019",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "近三年净利润-2019",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "近三年研发费用-2019",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "近三年营业收入-2018",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "近三年净利润-2018",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "近三年研发费用-2018",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "近三年营业收入-2017",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "近三年净利润-2017",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "近三年研发费用-2017",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "近两年累计净利润",
        "type": "float64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-注册制审核-达标企业",
    "data": [],
    "summary": {}
  }
}
```# 增发

## api call
ak.stock_qbzf_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-增发-全部增发",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "增发代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行总数",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "网上发行",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "发行价格",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "发行日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "增发上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "锁定期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-增发-全部增发",
    "data": [],
    "summary": {}
  }
}
```# 配股

## api call
ak.stock_pg_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-配股",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配售代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配股数量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "配股比例",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配股价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "配股前总股本",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "配股后总股本",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "股权登记日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "缴款起始日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "缴款截止日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-配股",
    "data": [],
    "summary": {}
  }
}
```# 股票回购数据

## api call
ak.stock_repurchase_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-股票回购-股票回购数据",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "计划回购价格区间",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "计划回购数量区间-下限",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "计划回购数量区间-上限",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "占公告前一日总股本比例-下限",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "占公告前一日总股本比例-上限",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "计划回购金额区间-下限",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "计划回购金额区间-上限",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "回购起始时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "实施进度",
        "type": "object",
        "description": "-"
      },
      {
        "field": "已回购股份价格区间-下限",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "已回购股份价格区间-上限",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "已回购股份数量",
        "type": "float64",
        "description": "注意单位: 股"
      },
      {
        "field": "已回购金额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "最新公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-股票回购-股票回购数据",
    "data": [],
    "summary": {}
  }
}
```# 股本结构

## api call
ak.stock_zh_a_gbjg_em(symbol="603392.SH")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="603392.SH" |

## response
```json
{
  "metadata": {
    "description": "东方财富-A股数据-股本结构",
    "data_structure": [
      {
        "field": "变更日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总股本",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "流通受限股份",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "其他内资持股(受限)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "境内法人持股(受限)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "境内自然人持股(受限)",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "已流通股份",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "已上市流通A股",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "变动原因",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-A股数据-股本结构",
    "data": [],
    "summary": {}
  }
}
```# 市场统计

## api call
ak.stock_dzjy_sctj()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-大宗交易-市场统计",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "交易日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上证指数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上证指数涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "大宗交易成交总额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "溢价成交总额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "溢价成交总额占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "折价成交总额",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "折价成交总额占比",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-大宗交易-市场统计",
    "data": [],
    "summary": {}
  }
}
```# 每日明细

## api call
ak.stock_dzjy_mrmx()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='债券'; choice of {'A股', 'B股', '基金', '债券'} |
| start_date | str | start_date='20201123'; 开始日期 |
| end_date | sr | end_date='20201204'; 结束日期 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-大宗交易-每日明细",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-数据中心-大宗交易-每日明细",
    "data": [],
    "summary": {}
  }
}
```# 每日统计

## api call
ak.stock_dzjy_mrtj(start_date=&#39;20220105&#39;, end_date=&#39;20220105&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date='20220105'; 开始日期 |
| end_date | sr | end_date='20220105'; 结束日期 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-大宗交易-每日统计",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "交易日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交均价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "折溢率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交笔数",
        "type": "int64",
        "description": ""
      },
      {
        "field": "成交总量",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "成交总额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "成交总额/流通市值",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-大宗交易-每日统计",
    "data": [],
    "summary": {}
  }
}
```# 活跃 A 股统计

## api call
ak.stock_dzjy_hygtj(symbol=&#39;近三月&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='近三月'; choice of {'近一月', '近三月', '近六月', '近一年'} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-大宗交易-活跃 A 股统计",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最近上榜日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜次数-总计",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上榜次数-溢价",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上榜次数-折价",
        "type": "int64",
        "description": ""
      },
      {
        "field": "总成交额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "折溢率",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "成交总额/流通市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上榜日后平均涨跌幅-1日",
        "type": "float64",
        "description": "注意符号: %"
      },
      {
        "field": "上榜日后平均涨跌幅-5日",
        "type": "float64",
        "description": "注意符号: %"
      },
      {
        "field": "上榜日后平均涨跌幅-10日",
        "type": "float64",
        "description": "注意符号: %"
      },
      {
        "field": "上榜日后平均涨跌幅-20日",
        "type": "float64",
        "description": "注意符号: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-大宗交易-活跃 A 股统计",
    "data": [],
    "summary": {}
  }
}
```# 活跃营业部统计

## api call
ak.stock_dzjy_hyyybtj(symbol=&#39;近3日&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='近3日'; choice of {'当前交易日', '近3日', '近5日', '近10日', '近30日'} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-大宗交易-活跃营业部统计",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业部名称",
        "type": "str",
        "description": "-"
      },
      {
        "field": "最近上榜日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "次数总计-买入",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "次数总计-卖出",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成交金额统计-买入",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "成交金额统计-卖出",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "成交金额统计-净买入额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "买入的股票",
        "type": "object",
        "description": ""
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-大宗交易-活跃营业部统计",
    "data": [],
    "summary": {}
  }
}
```# 营业部排行

## api call
ak.stock_dzjy_yybph(symbol=&#39;近三月&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='近三月'; choice of {'近一月', '近三月', '近六月', '近一年'} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-大宗交易-营业部排行",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "营业部名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上榜后1天-买入次数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上榜后1天-平均涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后1天-上涨概率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上榜后5天-买入次数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上榜后5天-平均涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后5天-上涨概率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上榜后10天-买入次数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上榜后10天-平均涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后10天-上涨概率",
        "type": "float64",
        "description": ""
      },
      {
        "field": "上榜后20天-买入次数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "上榜后20天-平均涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上榜后20天-上涨概率",
        "type": "float64",
        "description": ""
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-大宗交易-营业部排行",
    "data": [],
    "summary": {}
  }
}
```# 一致行动人

## api call
ak.stock_yzxdr_em(date="20210331")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20200930"; 每年的季度末时间点 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-特色数据-一致行动人",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "一致行动人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东排名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股数量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "持股比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "持股数量变动",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-特色数据-一致行动人",
    "data": [],
    "summary": {}
  }
}
```# 标的证券名单及保证金比例查询

## api call
ak.stock_margin_ratio_pa(symbol="沪市", date="20260113")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="深市"; choice of {"深市", "沪市", "北交所"} |
| date | str | date="20260113" |

## response
```json
{
  "metadata": {
    "description": "融资融券-标的证券名单及保证金比例查询",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "融资比例",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "融券比例",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "融资融券-标的证券名单及保证金比例查询",
    "data": [],
    "summary": {}
  }
}
```# 两融账户信息

## api call
ak.stock_margin_account_info()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-融资融券-融资融券账户统计-两融账户信息",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "融资余额",
        "type": "float64",
        "description": "注意单位: 亿"
      },
      {
        "field": "融券余额",
        "type": "float64",
        "description": "注意单位: 亿"
      },
      {
        "field": "融资买入额",
        "type": "float64",
        "description": "注意单位: 亿"
      },
      {
        "field": "融券卖出额",
        "type": "float64",
        "description": "注意单位: 亿"
      },
      {
        "field": "证券公司数量",
        "type": "float64",
        "description": "注意单位: 家"
      },
      {
        "field": "营业部数量",
        "type": "float64",
        "description": "注意单位: 家"
      },
      {
        "field": "个人投资者数量",
        "type": "float64",
        "description": "注意单位: 万名"
      },
      {
        "field": "机构投资者数量",
        "type": "float64",
        "description": "注意单位: 家"
      },
      {
        "field": "参与交易的投资者数量",
        "type": "float64",
        "description": "注意单位: 名"
      },
      {
        "field": "有融资融券负债的投资者数量",
        "type": "float64",
        "description": "注意单位: 名"
      },
      {
        "field": "担保物总价值",
        "type": "float64",
        "description": "注意单位: 亿"
      },
      {
        "field": "平均维持担保比例",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-融资融券-融资融券账户统计-两融账户信息",
    "data": [],
    "summary": {}
  }
}
```# 融资融券汇总

## api call
ak.stock_margin_sse(start_date="20010106", end_date="20210208")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20010106" |
| end_date | str | end_date="20010106" |

## response
```json
{
  "metadata": {
    "description": "上海证券交易所-融资融券数据-融资融券汇总数据",
    "data_structure": [
      {
        "field": "信用交易日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "融资余额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "融资买入额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "融券余量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "融券余量金额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "融券卖出量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "融资融券余额",
        "type": "int64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "上海证券交易所-融资融券数据-融资融券汇总数据",
    "data": [],
    "summary": {}
  }
}
```# 融资融券明细

## api call
ak.stock_margin_detail_sse(date="20230922")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210205" |

## response
```json
{
  "metadata": {
    "description": "上海证券交易所-融资融券数据-融资融券明细数据",
    "data_structure": [
      {
        "field": "信用交易日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "标的证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "标的证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "融资余额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "融资买入额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "融资偿还额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "融券余量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "融券卖出量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "融券偿还量",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "上海证券交易所-融资融券数据-融资融券明细数据",
    "data": [],
    "summary": {}
  }
}
```# 融资融券汇总

## api call
ak.stock_margin_szse(date="20240411")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20240411"; 交易日期 |

## response
```json
{
  "metadata": {
    "description": "深圳证券交易所-融资融券数据-融资融券汇总数据",
    "data_structure": [
      {
        "field": "融资买入额",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "融资余额",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "融券卖出量",
        "type": "float64",
        "description": "注意单位: 亿股/亿份"
      },
      {
        "field": "融券余量",
        "type": "float64",
        "description": "注意单位: 亿股/亿份"
      },
      {
        "field": "融券余额",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "融资融券余额",
        "type": "float64",
        "description": "注意单位: 亿元"
      }
    ]
  },
  "sample_data": {
    "description": "深圳证券交易所-融资融券数据-融资融券汇总数据",
    "data": [],
    "summary": {}
  }
}
```# 融资融券明细

## api call
ak.stock_margin_detail_szse(date="20230925")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20220118" |

## response
```json
{
  "metadata": {
    "description": "深证证券交易所-融资融券数据-融资融券交易明细数据",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "融资买入额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "融资余额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "融券卖出量",
        "type": "int64",
        "description": "注意单位: 股/份"
      },
      {
        "field": "融券余量",
        "type": "int64",
        "description": "注意单位: 股/份"
      },
      {
        "field": "融券余额",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "融资融券余额",
        "type": "int64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "深证证券交易所-融资融券数据-融资融券交易明细数据",
    "data": [],
    "summary": {}
  }
}
```# 标的证券信息

## api call
ak.stock_margin_underlying_info_szse(date="20210727")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210205" |

## response
```json
{
  "metadata": {
    "description": "深圳证券交易所-融资融券数据-标的证券信息",
    "data_structure": [
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "融资标的",
        "type": "object",
        "description": "-"
      },
      {
        "field": "融券标的",
        "type": "object",
        "description": "-"
      },
      {
        "field": "当日可融资",
        "type": "object",
        "description": "-"
      },
      {
        "field": "当日可融券",
        "type": "object",
        "description": "-"
      },
      {
        "field": "融券卖出价格限制",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅限制",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "深圳证券交易所-融资融券数据-标的证券信息",
    "data": [],
    "summary": {}
  }
}
```# 盈利预测-东方财富

## api call
ak.stock_profit_forecast_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="", 默认为获取全部数据; symbol="船舶制造", 则获取具体行业板块的数据; 行业板块可以通过 ak.stock_board_industry_name_em() 接口获取 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-研究报告-盈利预测; 该数据源网页端返回数据有异常, 本接口已修复该异常",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "研报数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "机构投资评级(近六个月)-买入",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "机构投资评级(近六个月)-增持",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "机构投资评级(近六个月)-中性",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "机构投资评级(近六个月)-减持",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "机构投资评级(近六个月)-卖出",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "xxxx预测每股收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "xxxx预测每股收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "xxxx预测每股收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "xxxx预测每股收益",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-研究报告-盈利预测; 该数据源网页端返回数据有异常, 本接口已修复该异常",
    "data": [],
    "summary": {}
  }
}
```# 港股盈利预测-经济通

## api call
ak.stock_hk_profit_forecast_et()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="09999" |
| indicator | str | indicator="盈利预测概览"; choice of {"评级总览", "去年度业绩表现", "综合盈利预测", "盈利预测概览"} |

## response
```json
{
  "metadata": {
    "description": "经济通-公司资料-盈利预测",
    "data_structure": []
  },
  "sample_data": {
    "description": "经济通-公司资料-盈利预测",
    "data": [],
    "summary": {}
  }
}
```# 盈利预测-同花顺

## api call
ak.stock_profit_forecast_ths()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="600519"; 股票代码 |
| indicator | str | indicator="预测年报每股收益"; choice of {"预测年报每股收益", "预测年报净利润", "业绩预测详表-机构", "业绩预测详表-详细指标预测"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-盈利预测",
    "data_structure": []
  },
  "sample_data": {
    "description": "同花顺-盈利预测",
    "data": [],
    "summary": {}
  }
}
```# 同花顺-概念板块指数

## api call
ak.stock_board_concept_index_ths(symbol="阿里巴巴概念", start_date="20200101", end_date="20250321")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="阿里巴巴概念"; 可以通过调用 ak.stock_board_concept_name_ths() 查看同花顺的所有概念名称 |
| start_date | str | start_date="20200101"; 开始时间 |
| end_date | str | end_date="20250228"; 结束时间 |

## response
```json
{
  "metadata": {
    "description": "同花顺-板块-概念板块-指数日频率数据",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-板块-概念板块-指数日频率数据",
    "data": [],
    "summary": {}
  }
}
```# 同花顺-概念板块简介

## api call
ak.stock_board_concept_info_ths(symbol="阿里巴巴概念")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol: str = "阿里巴巴概念"; 可以通过调用 ak.stock_board_concept_name_ths() 查看同花顺的所有概念名称 |

## response
```json
{
  "metadata": {
    "description": "同花顺-板块-概念板块-板块简介",
    "data_structure": [
      {
        "field": "项目",
        "type": "object",
        "description": "-"
      },
      {
        "field": "值",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-板块-概念板块-板块简介",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-概念板块

## api call
ak.stock_board_concept_name_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-沪深京板块-概念板块",
    "data_structure": [
      {
        "field": "排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "板块名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "板块代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位：%"
      },
      {
        "field": "总市值",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位：%"
      },
      {
        "field": "上涨家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "下跌家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "领涨股票",
        "type": "object",
        "description": "-"
      },
      {
        "field": "领涨股票-涨跌幅",
        "type": "float64",
        "description": "注意单位：%"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-沪深京板块-概念板块",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-概念板块-实时行情

## api call
ak.stock_board_concept_spot_em(symbol="可燃冰")

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-沪深京板块-概念板块-实时行情",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-沪深京板块-概念板块-实时行情",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-成份股

## api call
ak.stock_board_concept_cons_em(symbol="融资融券")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="融资融券"; 支持传入板块代码比如：BK0655，可以通过调用 ak.stock_board_concept_name_em() 查看东方财富-概念板块的所有行业名称 |

## response
```json
{
  "metadata": {
    "description": "东方财富-沪深板块-概念板块-板块成份",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-沪深板块-概念板块-板块成份",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-指数

## api call
ak.stock_board_concept_hist_em(symbol="绿色电力", period="daily", start_date="20220101", end_date="20250227", adjust="")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="绿色电力"; 可以通过调用 ak.stock_board_concept_name_em() 查看东方财富-概念板块的所有概念代码 |
| period | str | period="daily"; choice of {"daily", "weekly", "monthly"} |
| start_date | str | start_date="20220101" |
| end_date | str | end_date="20221128" |
| adjust | str | adjust=""; choice of {'': 不复权, 默认; "qfq": 前复权, "hfq": 后复权} |

## response
```json
{
  "metadata": {
    "description": "东方财富-沪深板块-概念板块-历史行情数据",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-沪深板块-概念板块-历史行情数据",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-指数-分时

## api call
ak.stock_board_concept_hist_min_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="长寿药"; 可以通过调用 ak.stock_board_concept_name_em() 查看东方财富-概念板块的所有概念代码 |
| period | str | period="5"; choice of {"1", "5", "15", "30", "60"} |

## response
```json
{
  "metadata": {
    "description": "东方财富-沪深板块-概念板块-分时历史行情数据",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富-沪深板块-概念板块-分时历史行情数据",
    "data": [],
    "summary": {}
  }
}
```# 富途牛牛-美股概念-成分股

## api call
ak.stock_concept_cons_futu(symbol="特朗普概念股")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="特朗普概念股"; choice of {"巴菲特持仓", "佩洛西持仓", "特朗普概念股"} |

## response
```json
{
  "metadata": {
    "description": "富途牛牛-主题投资-概念板块-成分股",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "富途牛牛-主题投资-概念板块-成分股",
    "data": [],
    "summary": {}
  }
}
```# 同花顺-同花顺行业一览表

## api call
ak.stock_board_industry_summary_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺-同花顺行业一览表",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "板块",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "总成交量",
        "type": "float64",
        "description": "注意单位: 万手"
      },
      {
        "field": "总成交额",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "净流入",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "上涨家数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "下跌家数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "均价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "领涨股",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "领涨股-最新价",
        "type": "object",
        "description": "-"
      },
      {
        "field": "领涨股-涨跌幅",
        "type": "object",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-同花顺行业一览表",
    "data": [],
    "summary": {}
  }
}
```# 同花顺-指数

## api call
ak.stock_board_industry_index_ths(symbol="元件", start_date="20240101", end_date="20240718")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="元件"; 可以通过调用 ak.stock_board_industry_name_ths() 查看同花顺的所有行业名称 |
| start_date | str | start_date="20200101"; 开始时间 |
| end_date | str | end_date="20211027"; 结束时间 |

## response
```json
{
  "metadata": {
    "description": "同花顺-板块-行业板块-指数日频率数据",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-板块-行业板块-指数日频率数据",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-行业板块

## api call
ak.stock_board_industry_name_em()

## response
```json
{
  "metadata": {
    "description": "东方财富-沪深京板块-行业板块",
    "data_structure": [
      {
        "field": "排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "板块名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "板块代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位：%"
      },
      {
        "field": "总市值",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位：%"
      },
      {
        "field": "上涨家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "下跌家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "领涨股票",
        "type": "object",
        "description": "-"
      },
      {
        "field": "领涨股票-涨跌幅",
        "type": "float64",
        "description": "注意单位：%"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-沪深京板块-行业板块",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-行业板块-实时行情

## api call
ak.stock_board_industry_spot_em(symbol="小金属")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="小金属" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-沪深板块-行业板块-实时行情",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-沪深板块-行业板块-实时行情",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-成份股

## api call
ak.stock_board_industry_cons_em(symbol="小金属")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="小金属"; 支持传入板块代码比如：BK1027，可以通过调用 ak.stock_board_industry_name_em() 查看东方财富-行业板块的所有行业代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富-沪深板块-行业板块-板块成份",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市盈率-动态",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "市净率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-沪深板块-行业板块-板块成份",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-指数-日频

## api call
ak.stock_board_industry_hist_em(symbol="小金属", start_date="20211201", end_date="20240222", period="日k", adjust="")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="小金属"; 可以通过调用 ak.stock_board_industry_name_em() 查看东方财富-行业板块的所有行业代码 |
| start_date | str | start_date="20211201"; |
| end_date | str | end_date="20220401"; |
| period | str | period="日k"; 周期; choice of {"日k", "周k", "月k"} |
| adjust | str | adjust=""; choice of {'': 不复权, 默认; "qfq": 前复权, "hfq": 后复权} |

## response
```json
{
  "metadata": {
    "description": "东方财富-沪深板块-行业板块-历史行情数据",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-沪深板块-行业板块-历史行情数据",
    "data": [],
    "summary": {}
  }
}
```# 东方财富-指数-分时

## api call
ak.stock_board_industry_hist_min_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="小金属"; 可以通过调用 ak.stock_board_industry_name_em() 查看东方财富-行业板块的所有行业代码 |
| period | str | period=""; choice of {"1", "5", "15", "30", "60"} |

## response
```json
{
  "metadata": {
    "description": "东方财富-沪深板块-行业板块-分时历史行情数据",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富-沪深板块-行业板块-分时历史行情数据",
    "data": [],
    "summary": {}
  }
}
```# 关注排行榜

## api call
ak.stock_hot_follow_xq(symbol="最热门")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="最热门"; choice of {"本周新增", "最热门"} |

## response
```json
{
  "metadata": {
    "description": "雪球-沪深股市-热度排行榜-关注排行榜",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "关注",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "雪球-沪深股市-热度排行榜-关注排行榜",
    "data": [],
    "summary": {}
  }
}
```# 讨论排行榜

## api call
ak.stock_hot_tweet_xq(symbol="最热门")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="最热门"; choice of {"本周新增", "最热门"} |

## response
```json
{
  "metadata": {
    "description": "雪球-沪深股市-热度排行榜-讨论排行榜",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "关注",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "雪球-沪深股市-热度排行榜-讨论排行榜",
    "data": [],
    "summary": {}
  }
}
```# 交易排行榜

## api call
ak.stock_hot_deal_xq(symbol="最热门")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="最热门"; choice of {"本周新增", "最热门"} |

## response
```json
{
  "metadata": {
    "description": "雪球-沪深股市-热度排行榜-交易排行榜",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "关注",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "雪球-沪深股市-热度排行榜-交易排行榜",
    "data": [],
    "summary": {}
  }
}
```# 人气榜-A股

## api call
ak.stock_hot_rank_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网站-股票热度",
    "data_structure": [
      {
        "field": "当前排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网站-股票热度",
    "data": [],
    "summary": {}
  }
}
```# 飙升榜-A股

## api call
ak.stock_hot_up_em()

## response
```json
{
  "metadata": {
    "description": "东方财富-个股人气榜-飙升榜",
    "data_structure": [
      {
        "field": "排名较昨日变动",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "当前排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-个股人气榜-飙升榜",
    "data": [],
    "summary": {}
  }
}
```# 人气榜-港股

## api call
ak.stock_hk_hot_rank_em()

## response
```json
{
  "metadata": {
    "description": "东方财富-个股人气榜-人气榜-港股市场",
    "data_structure": [
      {
        "field": "当前排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-个股人气榜-人气榜-港股市场",
    "data": [],
    "summary": {}
  }
}
```# A股

## api call
ak.stock_hot_rank_detail_em(symbol="SZ000665")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000665" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-股票热度-历史趋势及粉丝特征",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "新晋粉丝",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "铁杆粉丝",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-股票热度-历史趋势及粉丝特征",
    "data": [],
    "summary": {}
  }
}
```# 港股

## api call
ak.stock_hk_hot_rank_detail_em(symbol="00700")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="00700" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-股票热度-历史趋势",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "排名",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "证券代码",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-股票热度-历史趋势",
    "data": [],
    "summary": {}
  }
}
```# 互动易-提问

## api call
ak.stock_irm_cninfo(symbol="002594")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="002594"; |

## response
```json
{
  "metadata": {
    "description": "互动易-提问",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "问题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "提问者",
        "type": "object",
        "description": "-"
      },
      {
        "field": "来源",
        "type": "object",
        "description": "-"
      },
      {
        "field": "提问时间",
        "type": "datetime64[ns]",
        "description": "-"
      },
      {
        "field": "更新时间",
        "type": "datetime64[ns]",
        "description": "-"
      },
      {
        "field": "提问者编号",
        "type": "object",
        "description": "-"
      },
      {
        "field": "问题编号",
        "type": "object",
        "description": "-"
      },
      {
        "field": "回答ID",
        "type": "object",
        "description": "-"
      },
      {
        "field": "回答内容",
        "type": "object",
        "description": "-"
      },
      {
        "field": "回答者",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "互动易-提问",
    "data": [],
    "summary": {}
  }
}
```# 互动易-回答

## api call
ak.stock_irm_ans_cninfo(symbol="1495108801386602496")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="1495108801386602496"; 通过 ak.stock_irm_cninfo 来获取具体的提问者编号 |

## response
```json
{
  "metadata": {
    "description": "互动易-回答",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "问题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "回答内容",
        "type": "object",
        "description": "-"
      },
      {
        "field": "提问者",
        "type": "object",
        "description": "-"
      },
      {
        "field": "提问时间",
        "type": "datetime64[ns]",
        "description": "-"
      },
      {
        "field": "回答时间",
        "type": "datetime64[ns]",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "互动易-回答",
    "data": [],
    "summary": {}
  }
}
```# 上证e互动

## api call
ak.stock_sns_sseinfo(symbol="603119")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="603119"; 股票代码 |

## response
```json
{
  "metadata": {
    "description": "上证e互动-提问与回答",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "问题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "回答",
        "type": "object",
        "description": "-"
      },
      {
        "field": "问题时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "回答时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "问题来源",
        "type": "object",
        "description": "-"
      },
      {
        "field": "回答来源",
        "type": "object",
        "description": "-"
      },
      {
        "field": "用户名",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "上证e互动-提问与回答",
    "data": [],
    "summary": {}
  }
}
```# A股

## api call
ak.stock_hot_rank_detail_realtime_em(symbol="SZ000665")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000665" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-个股人气榜-实时变动",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "排名",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-个股人气榜-实时变动",
    "data": [],
    "summary": {}
  }
}
```# 港股

## api call
ak.stock_hk_hot_rank_detail_realtime_em(symbol="00700")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="00700" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-个股人气榜-实时变动",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "排名",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-个股人气榜-实时变动",
    "data": [],
    "summary": {}
  }
}
```# 热门关键词

## api call
ak.stock_hot_keyword_em(symbol="SZ000665")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000665" |

## response
```json
{
  "metadata": {
    "description": "东方财富-个股人气榜-热门关键词",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "概念名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "概念代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "热度",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-个股人气榜-热门关键词",
    "data": [],
    "summary": {}
  }
}
```# 内部交易

## api call
ak.stock_inner_trade_xq()

## response
```json
{
  "metadata": {
    "description": "雪球-行情中心-沪深股市-内部交易",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "变动股数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交均价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "变动后持股数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "与董监高关系",
        "type": "object",
        "description": "-"
      },
      {
        "field": "董监高职务",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "雪球-行情中心-沪深股市-内部交易",
    "data": [],
    "summary": {}
  }
}
```# A股

## api call
ak.stock_hot_rank_latest_em(symbol="SZ000665")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000665" |

## response
```json
{
  "metadata": {
    "description": "东方财富-个股人气榜-最新排名",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-个股人气榜-最新排名",
    "data": [],
    "summary": {}
  }
}
```# 港股

## api call
ak.stock_hk_hot_rank_latest_em(symbol="00700")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="00700" |

## response
```json
{
  "metadata": {
    "description": "东方财富-个股人气榜-最新排名",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-个股人气榜-最新排名",
    "data": [],
    "summary": {}
  }
}
```# 热搜股票

## api call
ak.stock_hot_search_baidu(symbol="A股", date="20250616", time="今日")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="A股"; choice of {"全部", "A股", "港股", "美股"} |
| date | str | date="20250616" |
| time | str | time="今日"; choice of {"今日", "1小时"} |

## response
```json
{
  "metadata": {
    "description": "百度股市通-热搜股票",
    "data_structure": [
      {
        "field": "名称/代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "object",
        "description": "-"
      },
      {
        "field": "综合热度",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "百度股市通-热搜股票",
    "data": [],
    "summary": {}
  }
}
```# 相关股票

## api call
ak.stock_hot_rank_relate_em(symbol="SZ000665")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="SZ000665" |

## response
```json
{
  "metadata": {
    "description": "东方财富-个股人气榜-相关股票",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "相关股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-个股人气榜-相关股票",
    "data": [],
    "summary": {}
  }
}
```# 盘口异动

## api call
ak.stock_changes_em(symbol="大笔买入")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="大笔买入"; choice of {'火箭发射', '快速反弹', '大笔买入', '封涨停板', '打开跌停板', '有大买盘', '竞价上涨', '高开5日线', '向上缺口', '60日新高', '60日大幅上涨', '加速下跌', '高台跳水', '大笔卖出', '封跌停板', '打开涨停板', '有大卖盘', '竞价下跌', '低开5日线', '向下缺口', '60日新低', '60日大幅下跌'} |

## response
```json
{
  "metadata": {
    "description": "东方财富-行情中心-盘口异动数据",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "板块",
        "type": "object",
        "description": "-"
      },
      {
        "field": "相关信息",
        "type": "object",
        "description": "注意: 不同的 symbol 的单位不同"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-行情中心-盘口异动数据",
    "data": [],
    "summary": {}
  }
}
```# 板块异动详情

## api call
ak.stock_board_change_em()

## response
```json
{
  "metadata": {
    "description": "东方财富-行情中心-当日板块异动详情",
    "data_structure": [
      {
        "field": "板块名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "主力净流入",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "板块异动总次数",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "板块异动最频繁个股及所属类型-股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "板块异动最频繁个股及所属类型-股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "板块异动最频繁个股及所属类型-买卖方向",
        "type": "object",
        "description": "-"
      },
      {
        "field": "板块具体异动类型列表及出现次数",
        "type": "object",
        "description": "返回具体异动的字典"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-行情中心-当日板块异动详情",
    "data": [],
    "summary": {}
  }
}
```# 涨停股池

## api call
ak.stock_zt_pool_em(date=&#39;20241008&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20241008' |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-涨停板行情-涨停股池",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "封板资金",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "首次封板时间",
        "type": "object",
        "description": "注意格式: 09:25:00"
      },
      {
        "field": "最后封板时间",
        "type": "object",
        "description": "注意格式: 09:25:00"
      },
      {
        "field": "炸板次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "涨停统计",
        "type": "object",
        "description": "-"
      },
      {
        "field": "连板数",
        "type": "int64",
        "description": "注意格式: 1 为首板"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-涨停板行情-涨停股池",
    "data": [],
    "summary": {}
  }
}
```# 昨日涨停股池

## api call
ak.stock_zt_pool_previous_em(date=&#39;20240415&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20240415' |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-涨停板行情-昨日涨停股池",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新价",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "涨停价",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "昨日封板时间",
        "type": "int64",
        "description": "注意格式: 09:25:00"
      },
      {
        "field": "昨日连板数",
        "type": "int64",
        "description": "注意格式: 1 为首板"
      },
      {
        "field": "涨停统计",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-涨停板行情-昨日涨停股池",
    "data": [],
    "summary": {}
  }
}
```# 强势股池

## api call
ak.stock_zt_pool_strong_em(date=&#39;20241231&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20241009' |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-涨停板行情-强势股池",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨停价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨速",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "是否新高",
        "type": "object",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨停统计",
        "type": "object",
        "description": "-"
      },
      {
        "field": "入选理由",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-涨停板行情-强势股池",
    "data": [],
    "summary": {}
  }
}
```# 次新股池

## api call
ak.stock_zt_pool_sub_new_em(date=&#39;20241231&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20241231' |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-涨停板行情-次新股池",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨停价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "开板几日",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "开板日期",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "是否新高",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "涨停统计",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-涨停板行情-次新股池",
    "data": [],
    "summary": {}
  }
}
```# 炸板股池

## api call
ak.stock_zt_pool_zbgc_em(date=&#39;20241011&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20241011' |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-涨停板行情-炸板股池",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨停价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨速",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "首次封板时间",
        "type": "object",
        "description": "注意格式: 09:25:00"
      },
      {
        "field": "炸板次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "涨停统计",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-涨停板行情-炸板股池",
    "data": [],
    "summary": {}
  }
}
```# 跌停股池

## api call
ak.stock_zt_pool_dtgc_em(date=&#39;20241011&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20241011' |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-涨停板行情-跌停股池",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "动态市盈率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "封单资金",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "最后封板时间",
        "type": "object",
        "description": "注意格式: 09:25:00"
      },
      {
        "field": "板上成交额",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "连续跌停",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "开板次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-涨停板行情-跌停股池",
    "data": [],
    "summary": {}
  }
}
```# 赚钱效应分析

## api call
ak.stock_market_activity_legu()

## response
```json
{
  "metadata": {
    "description": "乐咕乐股网-赚钱效应分析数据",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股网-赚钱效应分析数据",
    "data": [],
    "summary": {}
  }
}
```# 全球财经快讯-新浪财经

## api call
ak.stock_info_global_sina()

## response
```json
{
  "metadata": {
    "description": "全球财经快讯-新浪财经",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "内容",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "全球财经快讯-新浪财经",
    "data": [],
    "summary": {}
  }
}
```# 快讯-富途牛牛

## api call
ak.stock_info_global_futu()

## response
```json
{
  "metadata": {
    "description": "快讯-富途牛牛",
    "data_structure": [
      {
        "field": "标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "内容",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发布时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "链接",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "快讯-富途牛牛",
    "data": [],
    "summary": {}
  }
}
```# 全球财经直播-同花顺财经

## api call
ak.stock_info_global_ths()

## response
```json
{
  "metadata": {
    "description": "全球财经直播-同花顺财经",
    "data_structure": [
      {
        "field": "标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "内容",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发布时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "链接",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "全球财经直播-同花顺财经",
    "data": [],
    "summary": {}
  }
}
```# 连续上涨

## api call
ak.stock_rank_lxsz_ths()

## response
```json
{
  "metadata": {
    "description": "连续上涨",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "最高价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "最低价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "连涨天数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "连续涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "累计换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "连续上涨",
    "data": [],
    "summary": {}
  }
}
```# 持续放量

## api call
ak.stock_rank_cxfl_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-技术选股-持续放量",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "成交量",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "基准日成交量",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "放量天数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "阶段涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-技术选股-持续放量",
    "data": [],
    "summary": {}
  }
}
```# 持续缩量

## api call
ak.stock_rank_cxsl_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-技术选股-持续缩量",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "成交量",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "基准日成交量",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "缩量天数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "阶段涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-技术选股-持续缩量",
    "data": [],
    "summary": {}
  }
}
```# 向上突破

## api call
ak.stock_rank_xstp_ths(symbol="500日均线")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="500日均线"; choice of {"5日均线", "10日均线", "20日均线", "30日均线", "60日均线", "90日均线", "250日均线", "500日均线"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-技术选股-向上突破",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "成交额",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "成交量",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-技术选股-向上突破",
    "data": [],
    "summary": {}
  }
}
```# 向下突破

## api call
ak.stock_rank_xxtp_ths(symbol="500日均线")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="500日均线"; choice of {"5日均线", "10日均线", "20日均线", "30日均线", "60日均线", "90日均线", "250日均线", "500日均线"} |

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-技术选股-向下突破",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "成交额",
        "type": "object",
        "description": "注意单位: 元"
      },
      {
        "field": "成交量",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-技术选股-向下突破",
    "data": [],
    "summary": {}
  }
}
```# 量价齐升

## api call
ak.stock_rank_ljqs_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-技术选股-量价齐升",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "量价齐升天数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "阶段涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "累计换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-技术选股-量价齐升",
    "data": [],
    "summary": {}
  }
}
```# 量价齐跌

## api call
ak.stock_rank_ljqd_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-技术选股-量价齐跌",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "量价齐跌天数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "阶段涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "累计换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "所属行业",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-技术选股-量价齐跌",
    "data": [],
    "summary": {}
  }
}
```# 险资举牌

## api call
ak.stock_rank_xzjp_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-技术选股-险资举牌",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "举牌公告日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "现价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "举牌方",
        "type": "object",
        "description": "-"
      },
      {
        "field": "增持数量",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "交易均价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "增持数量占总股本比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "变动后持股总数",
        "type": "object",
        "description": "注意单位: 股"
      },
      {
        "field": "变动后持股比例",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-技术选股-险资举牌",
    "data": [],
    "summary": {}
  }
}
```# ESG 评级数据

## api call
ak.stock_esg_rate_sina()

## response
```json
{
  "metadata": {
    "description": "新浪财经-ESG评级中心-ESG评级-ESG评级数据",
    "data_structure": [
      {
        "field": "成分股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "评级机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "评级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "评级季度",
        "type": "object",
        "description": "-"
      },
      {
        "field": "标识",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-ESG评级中心-ESG评级-ESG评级数据",
    "data": [],
    "summary": {}
  }
}
```# MSCI

## api call
ak.stock_esg_msci_sina()

## response
```json
{
  "metadata": {
    "description": "新浪财经-ESG评级中心-ESG评级-MSCI",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ESG评分",
        "type": "object",
        "description": "-"
      },
      {
        "field": "环境总评",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "社会责任总评",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "治理总评",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "评级日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-ESG评级中心-ESG评级-MSCI",
    "data": [],
    "summary": {}
  }
}
```# 路孚特

## api call
ak.stock_esg_rft_sina()

## response
```json
{
  "metadata": {
    "description": "新浪财经-ESG评级中心-ESG评级-路孚特",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ESG评分",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ESG评分日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "环境总评",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "环境总评日期",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "社会责任总评",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "社会责任总评日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "治理总评",
        "type": "object",
        "description": "-"
      },
      {
        "field": "治理总评日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "争议总评",
        "type": "object",
        "description": "-"
      },
      {
        "field": "争议总评日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "行业",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易所",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-ESG评级中心-ESG评级-路孚特",
    "data": [],
    "summary": {}
  }
}
```# 秩鼎

## api call
ak.stock_esg_zd_sina()

## response
```json
{
  "metadata": {
    "description": "新浪财经-ESG评级中心-ESG评级-秩鼎",
    "data_structure": [
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ESG评分",
        "type": "object",
        "description": "-"
      },
      {
        "field": "环境总评",
        "type": "object",
        "description": "-"
      },
      {
        "field": "社会责任总评",
        "type": "object",
        "description": "-"
      },
      {
        "field": "治理总评",
        "type": "object",
        "description": "-"
      },
      {
        "field": "评分日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-ESG评级中心-ESG评级-秩鼎",
    "data": [],
    "summary": {}
  }
}
```# 华证指数

## api call
ak.stock_esg_hz_sina()

## response
```json
{
  "metadata": {
    "description": "新浪财经-ESG评级中心-ESG评级-华证指数",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "ESG评分",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "ESG等级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "环境",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "环境等级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "社会",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "社会等级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公司治理",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "公司治理等级",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-ESG评级中心-ESG评级-华证指数",
    "data": [],
    "summary": {}
  }
}
```# 基金基本信息

## api call
ak.fund_name_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-天天基金网-基金数据-所有基金的基本信息数据",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拼音缩写",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拼音全称",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-天天基金网-基金数据-所有基金的基本信息数据",
    "data": [],
    "summary": {}
  }
}
```# 基金基本信息-雪球

## api call
ak.fund_individual_basic_info_xq(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 基金代码 |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球基金-基金详情",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "雪球基金-基金详情",
    "data": [],
    "summary": {}
  }
}
```# 基金基本信息-指数型

## api call
ak.fund_info_index_em(symbol="沪深指数", indicator="增强指数型")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部"; choice of {"全部", "沪深指数", "行业主题", "大盘指数", "中盘指数", "小盘指数", "股票指数", "债券指数"} |
| indicator | str | indicator="全部"; choice of {"全部", "被动指数型", "增强指数型"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-天天基金网-基金数据-基金基本信息-指数型",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1周",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近6月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近2年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今年来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成立来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "手续费",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "起购金额",
        "type": "object",
        "description": "-"
      },
      {
        "field": "跟踪标的",
        "type": "object",
        "description": "-"
      },
      {
        "field": "跟踪方式",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-天天基金网-基金数据-基金基本信息-指数型",
    "data": [],
    "summary": {}
  }
}
```# 基金申购状态

## api call
ak.fund_purchase_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网站-天天基金网-基金数据-基金申购状态",
    "data_structure": [
      {
        "field": "序号",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新净值/万份收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新净值/万份收益-报告时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "赎回状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "下一开放日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "购买起点",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "日累计限定金额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "手续费",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网站-天天基金网-基金数据-基金申购状态",
    "data": [],
    "summary": {}
  }
}
```# ETF基金实时行情-东财

## api call
ak.fund_etf_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富-ETF 实时行情",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "IOPV实时估值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "基金折价率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "开盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "量比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "委比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "外盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "内盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主力净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "主力净流入-净占比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "超大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "超大单净流入-净占比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "大单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "大单净流入-净占比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中单净流入-净占比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "小单净流入-净额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "小单净流入-净占比",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "现手",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "买一",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖一",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新份额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "数据日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新时间",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-ETF 实时行情",
    "data": [],
    "summary": {}
  }
}
```# ETF基金实时行情-同花顺

## api call
ak.fund_etf_spot_ths(date="20240620")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date=""; 默认返回当前最新的数据 |

## response
```json
{
  "metadata": {
    "description": "同花顺理财-基金数据-每日净值-ETF-实时行情",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "当前-单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "当前-累计净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "前一日-单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "前一日-累计净值",
        "type": "float64",
        "description": ""
      },
      {
        "field": "增长值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "增长率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "赎回状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新-交易日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新-单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新-累计净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "基金类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "查询日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺理财-基金数据-每日净值-ETF-实时行情",
    "data": [],
    "summary": {}
  }
}
```# LOF基金实时行情-东财

## api call
ak.fund_lof_spot_em()

## response
```json
{
  "metadata": {
    "description": "东方财富-LOF 实时行情",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "开盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "流通市值",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "总市值",
        "type": "int64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-LOF 实时行情",
    "data": [],
    "summary": {}
  }
}
```# 基金实时行情-新浪

## api call
ak.fund_etf_category_sina(symbol="封闭式基金")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="LOF基金"; choice of {"封闭式基金", "ETF基金", "LOF基金"} |

## response
```json
{
  "metadata": {
    "description": "新浪财经-基金列表及行情数据",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "买入",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖出",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "注意单位: 股"
      },
      {
        "field": "成交额",
        "type": "int64",
        "description": "注意单位: 元"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-基金列表及行情数据",
    "data": [],
    "summary": {}
  }
}
```# ETF基金分时行情-东财

## api call
ak.fund_etf_hist_min_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='513500'; ETF 代码可以在 ak.fund_etf_spot_em() 中获取 |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据 |
| end_date | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据 |
| period | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 5 个交易日数据且不复权 |
| adjust | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 5 个交易日数据且不复权 |

## response
```json
{
  "metadata": {
    "description": "东方财富-ETF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富-ETF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置",
    "data": [],
    "summary": {}
  }
}
```# LOF基金分时行情-东财

## api call
ak.fund_lof_hist_min_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='166009'; LOF 代码可以在 ak.fund_lof_spot_em() 中获取 |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据 |
| end_date | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据 |
| period | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 5 个交易日数据且不复权 |
| adjust | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 5 个交易日数据且不复权 |

## response
```json
{
  "metadata": {
    "description": "东方财富-LOF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富-LOF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置",
    "data": [],
    "summary": {}
  }
}
```# ETF基金历史行情-东财

## api call
ak.fund_etf_hist_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='159707'; ETF 代码可以在 ak.fund_etf_spot_em() 中获取或查看东财主页 |
| period | str | period='daily'; choice of {'daily', 'weekly', 'monthly'} |
| start_date | str | start_date='20000101'; 开始查询的日期 |
| end_date | str | end_date='20230104'; 结束查询的日期 |
| adjust | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据 |

## response
```json
{
  "metadata": {
    "description": "东方财富-ETF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-ETF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取",
    "data": [],
    "summary": {}
  }
}
```# LOF基金历史行情-东财

## api call
ak.fund_lof_hist_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='166009'; LOF 代码可以在 ak.fund_lof_spot_em() 中获取 |
| period | str | period='daily'; choice of {'daily', 'weekly', 'monthly'} |
| start_date | str | start_date='20000101'; 开始查询的日期 |
| end_date | str | end_date='20230104'; 结束查询的日期 |
| adjust | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据 |

## response
```json
{
  "metadata": {
    "description": "东方财富-LOF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富-LOF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取",
    "data": [],
    "summary": {}
  }
}
```# 基金历史行情-新浪

## api call
ak.fund_etf_hist_sina(symbol="sh510050")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="sh510050"; 基金列表可以通过 ak.fund_etf_category_sina(symbol="LOF基金") 可选参数为: 封闭式基金, ETF基金, LOF基金 查询 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-基金行情的日频率行情数据",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "open",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "high",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "low",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "volume",
        "type": "int64",
        "description": "注意单位: 手"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-基金行情的日频率行情数据",
    "data": [],
    "summary": {}
  }
}
```# 开放式基金-实时数据

## api call
ak.fund_open_fund_daily_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-天天基金网-基金数据, 此接口在每个交易日 16:00-23:00 更新当日的最新开放式基金净值数据",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "str",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "str",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float",
        "description": "随时间变动"
      },
      {
        "field": "累计净值",
        "type": "float",
        "description": "随时间变动"
      },
      {
        "field": "前交易日-单位净值",
        "type": "float",
        "description": "随时间变动"
      },
      {
        "field": "前交易日-累计净值",
        "type": "float",
        "description": "随时间变动"
      },
      {
        "field": "日增长值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float",
        "description": "-"
      },
      {
        "field": "申购状态",
        "type": "str",
        "description": "-"
      },
      {
        "field": "赎回状态",
        "type": "str",
        "description": "-"
      },
      {
        "field": "手续费",
        "type": "str",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-天天基金网-基金数据, 此接口在每个交易日 16:00-23:00 更新当日的最新开放式基金净值数据",
    "data": [],
    "summary": {}
  }
}
```# 开放式基金-历史数据

## api call
ak.fund_open_fund_info_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="710001"; 需要基金代码, 可以通过调用 ak.fund_open_fund_daily_em() 获取 |
| indicator | str | indicator="单位净值走势";  参见 fund_open_fund_info_em 参数一览表 |
| period | str | period="成立来"; 该参数只对 累计收益率走势 有效, choice of {"1月", "3月", "6月", "1年", "3年", "5年", "今年来", "成立来"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-天天基金网-基金数据-具体基金信息",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-天天基金网-基金数据-具体基金信息",
    "data": [],
    "summary": {}
  }
}
```# 货币型基金-实时数据

## api call
ak.fund_money_fund_daily_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-天天基金网-基金数据-货币型基金收益, 此接口数据每个交易日 16:00～23:00",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "str",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "str",
        "description": "-"
      },
      {
        "field": "当前交易日-万份收益",
        "type": "float",
        "description": "-"
      },
      {
        "field": "当前交易日-7日年化%",
        "type": "float",
        "description": "-"
      },
      {
        "field": "当前交易日-单位净值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "前一交易日-万份收益",
        "type": "float",
        "description": "-"
      },
      {
        "field": "前一交易日-7日年化%",
        "type": "float",
        "description": "-"
      },
      {
        "field": "前一交易日-单位净值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "日涨幅",
        "type": "str",
        "description": "-"
      },
      {
        "field": "成立日期",
        "type": "str",
        "description": "-"
      },
      {
        "field": "基金经理",
        "type": "str",
        "description": "-"
      },
      {
        "field": "手续费",
        "type": "str",
        "description": "-"
      },
      {
        "field": "可购全部",
        "type": "str",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-天天基金网-基金数据-货币型基金收益, 此接口数据每个交易日 16:00～23:00",
    "data": [],
    "summary": {}
  }
}
```# 货币型基金-历史数据

## api call
ak.fund_money_fund_info_em(symbol="000009")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000009"; 需要基金代码, 可以通过调用 ak.fund_money_fund_daily_em() 获取 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-天天基金网-基金数据-货币型基金-历史净值",
    "data_structure": [
      {
        "field": "净值日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "每万份收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "7日年化收益率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "申购状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "赎回状态",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-天天基金网-基金数据-货币型基金-历史净值",
    "data": [],
    "summary": {}
  }
}
```# 理财型基金-实时数据

## api call
ak.fund_financial_fund_daily_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-天天基金网-基金数据-理财型基金-实时数据, 此接口数据每个交易日 16:00～23:00 更新",
    "data_structure": [
      {
        "field": "序号",
        "type": "int",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "str",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "str",
        "description": "-"
      },
      {
        "field": "上一期年化收益率",
        "type": "float",
        "description": "-"
      },
      {
        "field": "当前交易日-万份收益",
        "type": "float",
        "description": "-"
      },
      {
        "field": "当前交易日-7日年华",
        "type": "float",
        "description": "-"
      },
      {
        "field": "前一个交易日-万份收益",
        "type": "float",
        "description": "-"
      },
      {
        "field": "前一个交易日-7日年华",
        "type": "float",
        "description": "-"
      },
      {
        "field": "封闭期",
        "type": "float",
        "description": "-"
      },
      {
        "field": "申购状态",
        "type": "str",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-天天基金网-基金数据-理财型基金-实时数据, 此接口数据每个交易日 16:00～23:00 更新",
    "data": [],
    "summary": {}
  }
}
```# 理财型基金-历史数据

## api call
ak.fund_financial_fund_info_em(symbol="000134")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000134"; 基金代码, 可以通过调用 ak.fund_financial_fund_daily_em() 获取 |

## response
```json
{
  "metadata": {
    "description": "东方财富网站-天天基金网-基金数据-理财型基金收益-历史净值明细",
    "data_structure": [
      {
        "field": "净值日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "累计净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "申购状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "赎回状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分红送配",
        "type": "object",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网站-天天基金网-基金数据-理财型基金收益-历史净值明细",
    "data": [],
    "summary": {}
  }
}
```# 分级基金-实时数据

## api call
ak.fund_graded_fund_daily_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-天天基金网-基金数据-分级基金-实时数据, 此接口数据每个交易日 16:00～23:00",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "str",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "str",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "累计净值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "前交易日-单位净值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "前交易日-累计净值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "日增长值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float",
        "description": "注意单位: %"
      },
      {
        "field": "市价",
        "type": "str",
        "description": "-"
      },
      {
        "field": "折价率",
        "type": "str",
        "description": "-"
      },
      {
        "field": "手续费",
        "type": "str",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-天天基金网-基金数据-分级基金-实时数据, 此接口数据每个交易日 16:00～23:00",
    "data": [],
    "summary": {}
  }
}
```# 分级基金-历史数据

## api call
ak.fund_graded_fund_info_em(symbol="150232")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="150232"; 需要基金代码, 可以通过调用 ak.fund_graded_fund_daily_em() 获取 |

## response
```json
{
  "metadata": {
    "description": "东方财富网站-天天基金网-基金数据-分级基金-历史数据",
    "data_structure": [
      {
        "field": "净值日期",
        "type": "str",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "累计净值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float",
        "description": "注意单位: %; 日增长率为空原因如下: 1. 非交易日净值不参与日增长率计算(灰色数据行). 2. 上一交易日净值未披露, 日增长率无法计算."
      },
      {
        "field": "申购状态",
        "type": "str",
        "description": "-"
      },
      {
        "field": "赎回状态",
        "type": "str",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网站-天天基金网-基金数据-分级基金-历史数据",
    "data": [],
    "summary": {}
  }
}
```# 场内交易基金-实时数据

## api call
ak.fund_etf_fund_daily_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网站-天天基金网-基金数据-场内交易基金-实时数据, 此接口数据每个交易日 16:00～23:00",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "类型",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "当前交易日-单位净值",
        "type": "float64",
        "description": "会返回具体的日期值作为字段"
      },
      {
        "field": "当前交易日-累计净值",
        "type": "float64",
        "description": "会返回具体的日期值作为字段"
      },
      {
        "field": "前一个交易日-单位净值",
        "type": "float64",
        "description": "会返回具体的日期值作为字段"
      },
      {
        "field": "前一个交易日-累计净值",
        "type": "float64",
        "description": "会返回具体的日期值作为字段"
      },
      {
        "field": "增长值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "增长率",
        "type": "object",
        "description": "-"
      },
      {
        "field": "市价",
        "type": "object",
        "description": "-"
      },
      {
        "field": "折价率",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网站-天天基金网-基金数据-场内交易基金-实时数据, 此接口数据每个交易日 16:00～23:00",
    "data": [],
    "summary": {}
  }
}
```# 场内交易基金-历史数据

## api call
ak.fund_etf_fund_info_em(fund="511280", start_date="20000101", end_date="20500101")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| fund | str | fund="511280"; 基金代码, 可以通过调用 ak.fund_etf_fund_daily_em() 获取 |
| start_date | str | start_date="20000101"; 开始时间 |
| end_date | str | end_date="20500101"; 结束时间 |

## response
```json
{
  "metadata": {
    "description": "东方财富网站-天天基金网-基金数据-场内交易基金-历史净值数据",
    "data_structure": [
      {
        "field": "净值日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "累计净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "申购状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "赎回状态",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网站-天天基金网-基金数据-场内交易基金-历史净值数据",
    "data": [],
    "summary": {}
  }
}
```# 香港基金-历史数据

## api call
ak.fund_hk_fund_hist_em()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| code | str | code="1002200683"; 香港基金代码, 可以通过调用 ak.fund_em_hk_rank() 获取 |
| symbol | str | symbol="历史净值明细"; choice of {"历史净值明细", "分红送配详情"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网站-天天基金网-基金数据-香港基金-历史净值明细",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网站-天天基金网-基金数据-香港基金-历史净值明细",
    "data": [],
    "summary": {}
  }
}
```# 基金分红

## api call
ak.fund_fh_em(year="2025")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| year | str | year="2025"; 最早支持 1999 年 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-分红送配-基金分红",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "权益登记日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "除息日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "分红",
        "type": "float64",
        "description": "注意单位: 元/份"
      },
      {
        "field": "分红发放日",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-分红送配-基金分红",
    "data": [],
    "summary": {}
  }
}
```# 基金拆分

## api call
ak.fund_cf_em(year="2025")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| year | str | year="2025"; 最早支持 2005 年 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-分红送配-基金拆分",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拆分折算日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拆分类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "拆分折算",
        "type": "float64",
        "description": "注意单位: 每份"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-分红送配-基金拆分",
    "data": [],
    "summary": {}
  }
}
```# 基金分红排行

## api call
ak.fund_fh_rank_em(2025)

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-分红送配-基金分红排行",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "累计分红",
        "type": "float64",
        "description": "注意单位: 元/份"
      },
      {
        "field": "累计次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成立日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-分红送配-基金分红排行",
    "data": [],
    "summary": {}
  }
}
```# 开放式基金排行

## api call
ak.fund_open_fund_rank_em(symbol="全部")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="全部"; choice of {"全部", "股票型", "混合型", "债券型", "指数型", "QDII", "FOF"} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-开放式基金排行",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "累计净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1周",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近6月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近2年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今年来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成立来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "自定义",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "手续费",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-开放式基金排行",
    "data": [],
    "summary": {}
  }
}
```# 场内交易基金排行榜

## api call
ak.fund_exchange_rank_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-场内交易基金排行榜",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "累计净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "近1周",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近6月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近2年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今年来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成立来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成立日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-场内交易基金排行榜",
    "data": [],
    "summary": {}
  }
}
```# 货币型基金排行

## api call
ak.fund_money_rank_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-货币型基金排行",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "万份收益",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年化收益率7日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年化收益率14日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年化收益率28日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近6月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近2年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近5年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今年来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成立来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "手续费",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-货币型基金排行",
    "data": [],
    "summary": {}
  }
}
```# 理财基金排行

## api call
ak.fund_lcx_rank_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-理财基金排行, 每个交易日17点后更新, 货币基金的单位净值均为 1.0000 元，最新一年期定存利率: 1.50%",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "万份收益",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "年化收益率7日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年化收益率14日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "年化收益率28日",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1周",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近6月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今年来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成立来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "可购买",
        "type": "float64",
        "description": "可购买"
      },
      {
        "field": "手续费",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-理财基金排行, 每个交易日17点后更新, 货币基金的单位净值均为 1.0000 元，最新一年期定存利率: 1.50%",
    "data": [],
    "summary": {}
  }
}
```# 香港基金排行

## api call
ak.fund_hk_rank_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-基金排行-香港基金排行",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "币种",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1周",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近6月",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近2年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3年",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "今年来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成立来",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "可购买",
        "type": "object",
        "description": "-"
      },
      {
        "field": "香港基金代码",
        "type": "object",
        "description": "用于查询历史净值数据, 通过该字段查询相关的数据"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-基金排行-香港基金排行",
    "data": [],
    "summary": {}
  }
}
```# 基金业绩-雪球

## api call
ak.fund_individual_achievement_xq(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 基金代码 |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球基金-基金详情-基金业绩-详情",
    "data_structure": [
      {
        "field": "业绩类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "周期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "本产品区间收益",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "本产品最大回撒",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "周期收益同类排名",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "雪球基金-基金详情-基金业绩-详情",
    "data": [],
    "summary": {}
  }
}
```# 净值估算

## api call
ak.fund_value_estimation_em(symbol="混合型")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='全部'; 默认返回所有数据; choice of {'全部', '股票型', '混合型', '债券型', '指数型', 'QDII', 'ETF联接', 'LOF', '场内交易基金'} |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-净值估算",
    "data_structure": [
      {
        "field": "序号",
        "type": "str",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "str",
        "description": "-"
      },
      {
        "field": "基金名称",
        "type": "str",
        "description": "-"
      },
      {
        "field": "交易日-估算数据-估算值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "交易日-估算数据-估算增长率",
        "type": "str",
        "description": "-"
      },
      {
        "field": "交易日-公布数据-单位净值",
        "type": "float",
        "description": "-"
      },
      {
        "field": "交易日-公布数据-日增长率",
        "type": "str",
        "description": "-"
      },
      {
        "field": "估算偏差",
        "type": "str",
        "description": "-"
      },
      {
        "field": "交易日-单位净值",
        "type": "str",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-净值估算",
    "data": [],
    "summary": {}
  }
}
```# 基金数据分析

## api call
ak.fund_individual_analysis_xq(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 基金代码 |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球基金-基金详情-数据分析",
    "data_structure": [
      {
        "field": "周期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "较同类风险收益比",
        "type": "int64",
        "description": "注意单位：%"
      },
      {
        "field": "较同类抗风险波动",
        "type": "int64",
        "description": "注意单位：%"
      },
      {
        "field": "年化波动率",
        "type": "float64",
        "description": "注意单位：%"
      },
      {
        "field": "年化夏普比率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最大回撤",
        "type": "float64",
        "description": "注意单位：%"
      }
    ]
  },
  "sample_data": {
    "description": "雪球基金-基金详情-数据分析",
    "data": [],
    "summary": {}
  }
}
```# 基金盈利概率

## api call
ak.fund_individual_profit_probability_xq(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 基金代码 |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球基金-基金详情-盈利概率；历史任意时点买入，持有满X时间，盈利概率，以及平均收益",
    "data_structure": [
      {
        "field": "持有时长",
        "type": "object",
        "description": "-"
      },
      {
        "field": "盈利概率",
        "type": "object",
        "description": "注意单位：%"
      },
      {
        "field": "平均收益",
        "type": "object",
        "description": "注意单位：%"
      }
    ]
  },
  "sample_data": {
    "description": "雪球基金-基金详情-盈利概率；历史任意时点买入，持有满X时间，盈利概率，以及平均收益",
    "data": [],
    "summary": {}
  }
}
```# 基金持仓资产比例

## api call
ak.fund_individual_detail_hold_xq(symbol="002804", date="20231231")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 基金代码 |
| date | str | date="20231231"; 季度日期 |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球基金-基金详情-基金持仓-详情",
    "data_structure": [
      {
        "field": "资产类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "仓位占比",
        "type": "float64",
        "description": "注意单位：%"
      }
    ]
  },
  "sample_data": {
    "description": "雪球基金-基金详情-基金持仓-详情",
    "data": [],
    "summary": {}
  }
}
```# 基金基本概况

## api call
ak.fund_overview_em(symbol="015641")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="015641"; 基金代码 |

## response
```json
{
  "metadata": {
    "description": "天天基金-基金档案-基本概况",
    "data_structure": [
      {
        "field": "基金全称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成立日期/规模",
        "type": "object",
        "description": "-"
      },
      {
        "field": "资产规模",
        "type": "object",
        "description": "-"
      },
      {
        "field": "份额规模",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金管理人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金托管人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金经理人",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成立来分红",
        "type": "object",
        "description": "-"
      },
      {
        "field": "管理费率",
        "type": "object",
        "description": "-"
      },
      {
        "field": "托管费率",
        "type": "object",
        "description": "-"
      },
      {
        "field": "销售服务费率",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最高认购费率",
        "type": "object",
        "description": "-"
      },
      {
        "field": "业绩比较基准",
        "type": "object",
        "description": "-"
      },
      {
        "field": "跟踪标的",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金-基金档案-基本概况",
    "data": [],
    "summary": {}
  }
}
```# 基金交易费率

## api call
ak.fund_fee_em(symbol="015641", indicator="认购费率")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="015641"; 基金代码 |
| indicator | str | indicator="申购费率"; choice of {"交易状态", "申购与赎回金额", "交易确认日", "运作费用", "认购费率（前端）", "认购费率（后端）","申购费率（前端）", "赎回费率"} |

## response
```json
{
  "metadata": {
    "description": "天天基金-基金档案-购买信息",
    "data_structure": [
      {
        "field": "费用类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "条件或名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "费用",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金-基金档案-购买信息",
    "data": [],
    "summary": {}
  }
}
```# 基金交易规则

## api call
ak.fund_individual_detail_info_xq(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 基金代码 |
| timeout | float | timeout=None; 默认不设置超时参数 |

## response
```json
{
  "metadata": {
    "description": "雪球基金-基金详情-基金交易规则",
    "data_structure": [
      {
        "field": "费用类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "条件或名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "费用",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "雪球基金-基金详情-基金交易规则",
    "data": [],
    "summary": {}
  }
}
```# 基金持仓

## api call
ak.fund_portfolio_hold_em(symbol="000001", date="2024")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 基金代码, 可以通过调用 ak.fund_name_em() 接口获取 |
| date | str | date="2024"; 指定年份 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金档案-投资组合-基金持仓",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "占净值比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "持股数",
        "type": "float64",
        "description": "注意单位: 万股"
      },
      {
        "field": "持仓市值",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "季度",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金档案-投资组合-基金持仓",
    "data": [],
    "summary": {}
  }
}
```# 债券持仓

## api call
ak.fund_portfolio_bond_hold_em(symbol="000001", date="2023")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 基金代码, 可以通过调用 ak.fund_name_em() 接口获取 |
| date | str | date="2023"; 指定年份 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金档案-投资组合-债券持仓",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "债券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "占净值比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "持仓市值",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "季度",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金档案-投资组合-债券持仓",
    "data": [],
    "summary": {}
  }
}
```# 行业配置

## api call
ak.fund_portfolio_industry_allocation_em(symbol="000001", date="2023")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="000001"; 基金代码, 可以通过调用 ak.fund_name_em() 接口获取 |
| date | str | date="2023"; 指定年份 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金档案-投资组合-行业配置",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "行业类别",
        "type": "object",
        "description": "-"
      },
      {
        "field": "占净值比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "市值",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "截止时间",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金档案-投资组合-行业配置",
    "data": [],
    "summary": {}
  }
}
```# 重大变动

## api call
ak.fund_portfolio_change_em(symbol="003567", indicator="累计买入", date="2023")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="003567"; 基金代码, 可以通过调用 ak.fund_name_em() 接口获取 |
| indicator | str | indicator="累计买入"; choice of {"累计买入", "累计卖出"} |
| date | str | date="2023"; 指定年份 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金档案-投资组合-重大变动",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "本期累计买入金额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "占期初基金资产净值比例",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "季度",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金档案-投资组合-重大变动",
    "data": [],
    "summary": {}
  }
}
```# 基金评级总汇

## api call
ak.fund_rating_all()

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金评级-基金评级总汇",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金经理",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金公司",
        "type": "object",
        "description": "-"
      },
      {
        "field": "5星评级家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "上海证券",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "招商证券",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "济安金信",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "手续费",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "类型",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金评级-基金评级总汇",
    "data": [],
    "summary": {}
  }
}
```# 上海证券评级

## api call
ak.fund_rating_sh(date=&#39;20230630&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20230630'; https://fund.eastmoney.com/data/fundrating_3.html 获取查询日期 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金评级-上海证券评级",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金经理",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金公司",
        "type": "object",
        "description": "-"
      },
      {
        "field": "3年期评级-3年评级",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "3年期评级-较上期",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5年期评级-5年评级",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "5年期评级-较上期",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1年涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3年涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近5年涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "手续费",
        "type": "object",
        "description": "-"
      },
      {
        "field": "类型",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金评级-上海证券评级",
    "data": [],
    "summary": {}
  }
}
```# 招商证券评级

## api call
ak.fund_rating_zs(date=&#39;20230331&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20230331'; https://fund.eastmoney.com/data/fundrating_2.html 获取查询日期 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金评级-招商证券评级",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金经理",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金公司",
        "type": "object",
        "description": "-"
      },
      {
        "field": "3年期评级-3年评级",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "3年期评级-较上期",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1年涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3年涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近5年涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "手续费",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金评级-招商证券评级",
    "data": [],
    "summary": {}
  }
}
```# 济安金信评级

## api call
ak.fund_rating_ja(date=&#39;20200930&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20200930'; https://fund.eastmoney.com/data/fundrating_4.html 获取查询日期 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金评级-济安金信评级",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金经理",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金公司",
        "type": "object",
        "description": "-"
      },
      {
        "field": "3年期评级-3年评级",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "3年期评级-较上期",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "日增长率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近1年涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近3年涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "近5年涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "手续费",
        "type": "object",
        "description": "-"
      },
      {
        "field": "类型",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金评级-济安金信评级",
    "data": [],
    "summary": {}
  }
}
```# 基金经理

## api call
ak.fund_manager_em()

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-基金经理大全",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "姓名",
        "type": "object",
        "description": "-"
      },
      {
        "field": "所属公司",
        "type": "object",
        "description": "-"
      },
      {
        "field": "现任基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "现任基金",
        "type": "object",
        "description": "-"
      },
      {
        "field": "累计从业时间",
        "type": "int64",
        "description": "注意单位: 天"
      },
      {
        "field": "现任基金资产总规模",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "现任基金最佳回报",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-基金经理大全",
    "data": [],
    "summary": {}
  }
}
```# 新发基金

## api call
ak.fund_new_found_em()

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-新发基金-新成立基金",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行公司",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "集中认购期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "募集份额",
        "type": "float64",
        "description": "注意单位: 亿份"
      },
      {
        "field": "成立日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成立来涨幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "基金经理",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购状态",
        "type": "object",
        "description": "-"
      },
      {
        "field": "优惠费率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-新发基金-新成立基金",
    "data": [],
    "summary": {}
  }
}
```# 开放式基金

## api call
ak.fund_scale_open_sina(symbol=&#39;股票型基金&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="股票型基金"; choice of {"股票型基金", "混合型基金", "债券型基金", "货币型基金", "QDII基金"} |

## response
```json
{
  "metadata": {
    "description": "基金数据中心-基金规模-开放式基金",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "总募集规模",
        "type": "float64",
        "description": "注意单位: 万份"
      },
      {
        "field": "最近总份额",
        "type": "float64",
        "description": "注意单位: 份"
      },
      {
        "field": "成立日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金经理",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "基金数据中心-基金规模-开放式基金",
    "data": [],
    "summary": {}
  }
}
```# 封闭式基金

## api call
ak.fund_scale_close_sina()

## response
```json
{
  "metadata": {
    "description": "基金数据中心-基金规模-封闭式基金",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "总募集规模",
        "type": "float64",
        "description": "注意单位: 万份"
      },
      {
        "field": "最近总份额",
        "type": "float64",
        "description": "注意单位: 份"
      },
      {
        "field": "成立日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金经理",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "基金数据中心-基金规模-封闭式基金",
    "data": [],
    "summary": {}
  }
}
```# 分级子基金

## api call
ak.fund_scale_structured_sina()

## response
```json
{
  "metadata": {
    "description": "基金数据中心-基金规模-分级子基金",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "单位净值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "总募集规模",
        "type": "float64",
        "description": "注意单位: 万份"
      },
      {
        "field": "最近总份额",
        "type": "float64",
        "description": "注意单位: 份"
      },
      {
        "field": "成立日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金经理",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "基金数据中心-基金规模-分级子基金",
    "data": [],
    "summary": {}
  }
}
```# 基金规模详情

## api call
ak.fund_aum_em()

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-基金规模",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金公司",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成立时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "全部管理规模",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "全部基金数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "全部经理数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-基金规模",
    "data": [],
    "summary": {}
  }
}
```# 基金规模走势

## api call
ak.fund_aum_trend_em()

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-市场全部基金规模走势",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-市场全部基金规模走势",
    "data": [],
    "summary": {}
  }
}
```# 基金公司历年管理规模

## api call
ak.fund_aum_hist_em(year="2023")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| year | str | year="2023"; 从 2001 年开始 |

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-基金公司历年管理规模排行列表",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "基金公司",
        "type": "object",
        "description": "-"
      },
      {
        "field": "总规模",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "股票型",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "混合型",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "债券型",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "指数型",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "QDII",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "货币型",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-基金公司历年管理规模排行列表",
    "data": [],
    "summary": {}
  }
}
```# REITs-实时行情

## api call
ak.reits_realtime_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-REITs-沪深 REITs-实时行情",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "开盘价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-REITs-沪深 REITs-实时行情",
    "data": [],
    "summary": {}
  }
}
```# REITs-历史行情

## api call
ak.reits_hist_em(symbol="508097")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="508097"; REITs 代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-REITs-沪深 REITs-历史行情",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "振幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "换手",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-REITs-沪深 REITs-历史行情",
    "data": [],
    "summary": {}
  }
}
```# 基金重仓股

## api call
ak.fund_report_stock_cninfo(date="20210630")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210630"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}, 其中 XXXX 为年份 |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-基金报表-基金重仓股",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "股票代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股票简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金覆盖家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "持股总数",
        "type": "object",
        "description": "-"
      },
      {
        "field": "持股总市值",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-基金报表-基金重仓股",
    "data": [],
    "summary": {}
  }
}
```# 基金行业配置

## api call
ak.fund_report_industry_allocation_cninfo(date="20210630")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date="20210630"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}, 其中 XXXX 为年份 |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-基金报表-基金行业配置",
    "data_structure": [
      {
        "field": "行业编码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "证监会行业名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金覆盖家数",
        "type": "int64",
        "description": "注意单位: 只"
      },
      {
        "field": "行业规模",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "占净资产比例",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-基金报表-基金行业配置",
    "data": [],
    "summary": {}
  }
}
```# 基金资产配置

## api call
ak.fund_report_asset_allocation_cninfo()

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-基金报表-基金资产配置",
    "data_structure": [
      {
        "field": "报告期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金覆盖家数",
        "type": "object",
        "description": "注意单位: 只"
      },
      {
        "field": "股票权益类占净资产比例",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "债券固定收益类占净资产比例",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "现金货币类占净资产比例",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "基金市场净资产规模",
        "type": "object",
        "description": "注意单位: 亿元"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-基金报表-基金资产配置",
    "data": [],
    "summary": {}
  }
}
```# 规模变动

## api call
ak.fund_scale_change_em()

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-规模份额-规模变动",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "截止日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "期间申购",
        "type": "float64",
        "description": "注意单位: 亿份"
      },
      {
        "field": "期间赎回",
        "type": "float64",
        "description": "注意单位: 亿份"
      },
      {
        "field": "期末总份额",
        "type": "float64",
        "description": "注意单位: 亿份"
      },
      {
        "field": "期末净资产",
        "type": "float64",
        "description": "注意单位: 亿份"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-规模份额-规模变动",
    "data": [],
    "summary": {}
  }
}
```# 持有人结构

## api call
ak.fund_hold_structure_em()

## response
```json
{
  "metadata": {
    "description": "天天基金网-基金数据-规模份额-持有人结构",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "截止日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金家数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "机构持有比列",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "个人持有比列",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "内部持有比列",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "总份额",
        "type": "float64",
        "description": "注意单位: 亿份"
      }
    ]
  },
  "sample_data": {
    "description": "天天基金网-基金数据-规模份额-持有人结构",
    "data": [],
    "summary": {}
  }
}
```# 股票型基金仓位

## api call
ak.fund_stock_position_lg()

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-基金仓位-股票型基金仓位",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "注意单位: 沪深 300 收盘价"
      },
      {
        "field": "position",
        "type": "float64",
        "description": "注意单位: 持仓比例"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-基金仓位-股票型基金仓位",
    "data": [],
    "summary": {}
  }
}
```# 平衡混合型基金仓位

## api call
ak.fund_balance_position_lg()

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-基金仓位-平衡混合型基金仓位",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "注意单位: 沪深 300 收盘价"
      },
      {
        "field": "position",
        "type": "float64",
        "description": "注意单位: 持仓比例"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-基金仓位-平衡混合型基金仓位",
    "data": [],
    "summary": {}
  }
}
```# 灵活配置型基金仓位

## api call
ak.fund_linghuo_position_lg()

## response
```json
{
  "metadata": {
    "description": "乐咕乐股-基金仓位-灵活配置型基金仓位",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "注意单位: 沪深 300 收盘价"
      },
      {
        "field": "position",
        "type": "float64",
        "description": "注意单位: 持仓比例"
      }
    ]
  },
  "sample_data": {
    "description": "乐咕乐股-基金仓位-灵活配置型基金仓位",
    "data": [],
    "summary": {}
  }
}
```# 分红配送

## api call
ak.fund_announcement_dividend_em(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | 基金代码，可以通过调用 ak.fund_name_em() 接口获取 |

## response
```json
{
  "metadata": {
    "description": "东方财富网站-天天基金网-基金档案-基金公告-分红配送",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "object",
        "description": "基金代码"
      },
      {
        "field": "公告标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金名称",
        "type": "object",
        "description": "基金名称"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "公告的发布日期"
      },
      {
        "field": "报告ID",
        "type": "object",
        "description": "获取报告详情的依据; 拼接后可以获取公告地址"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网站-天天基金网-基金档案-基金公告-分红配送",
    "data": [],
    "summary": {}
  }
}
```# 定期报告

## api call
ak.fund_announcement_report_em(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | 基金代码，可以通过调用 ak.fund_name_em() 接口获取 |

## response
```json
{
  "metadata": {
    "description": "东方财富网站-天天基金网-基金档案-基金公告-定期报告",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "object",
        "description": "基金代码"
      },
      {
        "field": "公告标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金名称",
        "type": "object",
        "description": "基金名称"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "公告的发布日期"
      },
      {
        "field": "报告ID",
        "type": "object",
        "description": "获取报告详情的依据; 拼接后可以获取公告地址"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网站-天天基金网-基金档案-基金公告-定期报告",
    "data": [],
    "summary": {}
  }
}
```# 人事公告

## api call
ak.fund_announcement_personnel_em(symbol="000001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | 基金代码，可以通过调用 ak.fund_name_em() 接口获取 |

## response
```json
{
  "metadata": {
    "description": "东方财富网站-天天基金网-基金档案-基金公告-人事调整",
    "data_structure": [
      {
        "field": "基金代码",
        "type": "object",
        "description": "基金代码"
      },
      {
        "field": "公告标题",
        "type": "object",
        "description": "-"
      },
      {
        "field": "基金名称",
        "type": "object",
        "description": "基金名称"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "公告的发布日期"
      },
      {
        "field": "报告ID",
        "type": "object",
        "description": "获取报告详情的依据; 拼接后可以获取公告地址"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网站-天天基金网-基金档案-基金公告-人事调整",
    "data": [],
    "summary": {}
  }
}
```# 债券查询

## api call
ak.bond_info_cm(bond_name="", bond_code="", bond_issue="", bond_type="短期融资券", coupon_type="零息式", issue_year="2019", grade="A-1", underwriter="重庆农村商业银行股份有限公司")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| bond_name | str | bond_name=""; 默认为空 |
| bond_code | str | bond_code=""; 默认为空 |
| bond_issue | str | bond_issue=""; 默认为空, 通过 ak.bond_info_cm_query() 查询相关参数 |
| bond_type | str | bond_type=""; 默认为空, 通过 ak.bond_info_cm_query() 查询相关参数 |
| coupon_type | str | coupon_type=""; 默认为空, 通过 ak.bond_info_cm_query() 查询相关参数 |
| issue_year | str | issue_year=""; 默认为空 |
| underwriter | str | underwriter=""; 默认为空, 通过 ak.bond_info_cm_query() 查询相关参数 |
| grade | str | grade=""; 默认为空 |

## response
```json
{
  "metadata": {
    "description": "中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询",
    "data_structure": [
      {
        "field": "债券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行人/受托机构",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新债项评级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "查询代码",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询",
    "data": [],
    "summary": {}
  }
}
```# 债券基础信息

## api call
ak.bond_info_detail_cm(symbol="19万林投资CP001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="19万林投资CP001"; 通过 ak.bond_info_cm() 查询 债券简称 |

## response
```json
{
  "metadata": {
    "description": "中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询-债券详情",
    "data_structure": [
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询-债券详情",
    "data": [],
    "summary": {}
  }
}
```# 债券现券市场概览

## api call
ak.bond_cash_summary_sse(date=&#39;20210111&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20200111' |

## response
```json
{
  "metadata": {
    "description": "上登债券信息网-市场数据-市场统计-市场概览-债券现券市场概览",
    "data_structure": [
      {
        "field": "债券现货",
        "type": "object",
        "description": "-"
      },
      {
        "field": "托管只数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "托管市值",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "托管面值",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "数据日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "上登债券信息网-市场数据-市场统计-市场概览-债券现券市场概览",
    "data": [],
    "summary": {}
  }
}
```# 债券成交概览

## api call
ak.bond_deal_summary_sse(date=&#39;20210104&#39;)

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| date | str | date='20200104' |

## response
```json
{
  "metadata": {
    "description": "上登债券信息网-市场数据-市场统计-市场概览-债券成交概览",
    "data_structure": [
      {
        "field": "债券类型",
        "type": "object",
        "description": "-"
      },
      {
        "field": "当日成交笔数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "当日成交金额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "当年成交笔数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "当年成交金额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "数据日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "上登债券信息网-市场数据-市场统计-市场概览-债券成交概览",
    "data": [],
    "summary": {}
  }
}
```# 银行间市场债券发行基础数据

## api call
ak.bond_debt_nafmii(page="2")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| page | str | page="1", 需要获取第 page 页 |

## response
```json
{
  "metadata": {
    "description": "中国银行间市场交易商协会-非金融企业债务融资工具注册信息系统",
    "data_structure": [
      {
        "field": "债券名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "品种",
        "type": "object",
        "description": "-"
      },
      {
        "field": "注册或备案",
        "type": "object",
        "description": "-"
      },
      {
        "field": "金额",
        "type": "float64",
        "description": "注意单位：亿元"
      },
      {
        "field": "注册通知书文号",
        "type": "object",
        "description": "-"
      },
      {
        "field": "更新日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "项目状态",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "中国银行间市场交易商协会-非金融企业债务融资工具注册信息系统",
    "data": [],
    "summary": {}
  }
}
```# 现券市场做市报价

## api call
ak.bond_spot_quote()

## response
```json
{
  "metadata": {
    "description": "中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场做市报价",
    "data_structure": [
      {
        "field": "报价机构",
        "type": "object",
        "description": ""
      },
      {
        "field": "债券简称",
        "type": "object",
        "description": ""
      },
      {
        "field": "买入净价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "卖出净价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "买入收益率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "卖出收益率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场做市报价",
    "data": [],
    "summary": {}
  }
}
```# 现券市场成交行情

## api call
ak.bond_spot_deal()

## response
```json
{
  "metadata": {
    "description": "中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场成交行情",
    "data_structure": [
      {
        "field": "债券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "成交净价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "最新收益率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "涨跌",
        "type": "float64",
        "description": "注意单位: BP"
      },
      {
        "field": "加权收益率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "交易量",
        "type": "float64",
        "description": "注意单位: 亿"
      }
    ]
  },
  "sample_data": {
    "description": "中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场成交行情",
    "data": [],
    "summary": {}
  }
}
```# 国债及其他债券收益率曲线

## api call
ak.bond_china_yield(start_date="20210201", end_date="20220201")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20190204", 指定开始日期; start_date 到 end_date 需要小于一年 |
| end_date | str | end_date="20200204", 指定结束日期; start_date 到 end_date 需要小于一年 |

## response
```json
{
  "metadata": {
    "description": "中国债券信息网-国债及其他债券收益率曲线",
    "data_structure": [
      {
        "field": "曲线名称",
        "type": "object",
        "description": ""
      },
      {
        "field": "日期",
        "type": "object",
        "description": ""
      },
      {
        "field": "3月",
        "type": "float64",
        "description": ""
      },
      {
        "field": "6月",
        "type": "float64",
        "description": ""
      },
      {
        "field": "1年",
        "type": "float64",
        "description": ""
      },
      {
        "field": "3年",
        "type": "float64",
        "description": ""
      },
      {
        "field": "5年",
        "type": "float64",
        "description": ""
      },
      {
        "field": "7年",
        "type": "float64",
        "description": ""
      },
      {
        "field": "10年",
        "type": "float64",
        "description": ""
      },
      {
        "field": "30年",
        "type": "float64",
        "description": ""
      }
    ]
  },
  "sample_data": {
    "description": "中国债券信息网-国债及其他债券收益率曲线",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据

## api call
ak.bond_zh_hs_spot(start_page="1", end_page="5")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_page | str | start_page="1"; 开始获取的页面，每页 80 条数据 |
| end_page | str | end_page="10"; 结束获取的页面，每页 80 条数据 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-债券-沪深债券-实时行情数据",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "买入",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "卖出",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "int64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "int64",
        "description": "注意单位: 万"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-债券-沪深债券-实时行情数据",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据

## api call
ak.bond_zh_hs_daily(symbol="sh010107")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="sh010107" |

## response
```json
{
  "metadata": {
    "description": "新浪财经-债券-沪深债券-历史行情数据, 历史数据按日频率更新",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "open",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "high",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "low",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "volume",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-债券-沪深债券-历史行情数据, 历史数据按日频率更新",
    "data": [],
    "summary": {}
  }
}
```# 可转债-详情资料

## api call
ak.bond_cb_profile_sina(symbol="sz128039")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="sz128039"; 带市场标识的转债代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-债券-可转债-详情资料",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-债券-可转债-详情资料",
    "data": [],
    "summary": {}
  }
}
```# 可转债-债券概况

## api call
ak.bond_cb_summary_sina(symbol="sh155255")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="sh155255"; 带市场标识的转债代码 |

## response
```json
{
  "metadata": {
    "description": "新浪财经-债券-可转债-债券概况",
    "data_structure": [
      {
        "field": "item",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-债券-可转债-债券概况",
    "data": [],
    "summary": {}
  }
}
```# 实时行情数据

## api call
ak.bond_zh_hs_cov_spot()

## response
```json
{
  "metadata": {
    "description": "新浪财经-沪深可转债数据",
    "data_structure": [
      {
        "field": "-",
        "type": "-",
        "description": "不逐一列出"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-沪深可转债数据",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-日频

## api call
ak.bond_zh_hs_cov_daily(symbol="sz128039")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="sh113542" |

## response
```json
{
  "metadata": {
    "description": "新浪财经-历史行情数据，日频率更新, 新上的标的需要次日更新数据",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "open",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "high",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "low",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "close",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "volume",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "新浪财经-历史行情数据，日频率更新, 新上的标的需要次日更新数据",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-分时

## api call
ak.bond_zh_hs_cov_min()

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol='sz123106'; 转债代码 |
| period | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 1 个交易日数据且不复权 |
| adjust | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 1 个交易日数据且不复权 |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据 |
| end_date | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-可转债-分时行情",
    "data_structure": []
  },
  "sample_data": {
    "description": "东方财富网-可转债-分时行情",
    "data": [],
    "summary": {}
  }
}
```# 历史行情数据-盘前分时

## api call
ak.bond_zh_hs_cov_pre_min(symbol="sh113570")

## response
```json
{
  "metadata": {
    "description": "东方财富网-可转债-分时行情-盘前分时",
    "data_structure": [
      {
        "field": "时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "注意单位: 手"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-可转债-分时行情-盘前分时",
    "data": [],
    "summary": {}
  }
}
```# 可转债数据一览表

## api call
ak.bond_zh_cov()

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-可转债数据一览表",
    "data_structure": [
      {
        "field": "债券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购上限",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "正股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转股价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转股价值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "债现价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转股溢价率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "原股东配售-股权登记日",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "原股东配售-每股配售额",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行规模",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "中签号发布日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "中签率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "上市时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "信用评级",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-可转债数据一览表",
    "data": [],
    "summary": {}
  }
}
```# 可转债详情

## api call
ak.bond_zh_cov_info(symbol="123121", indicator="基本信息")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="123121"; 可转债代码 |
| indicator | str | indicator="基本信息"; choice of {"基本信息", "中签号", "筹资用途", "重要日期"}, 其中 "可转债重要条款" 在 "基本信息中" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-新股数据-可转债详情",
    "data_structure": [
      {
        "field": "债券代码",
        "type": "object",
        "description": "返回 67 个字段"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-新股数据-可转债详情",
    "data": [],
    "summary": {}
  }
}
```# 可转债详情-同花顺

## api call
ak.bond_zh_cov_info_ths()

## response
```json
{
  "metadata": {
    "description": "同花顺-数据中心-可转债",
    "data_structure": [
      {
        "field": "债券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "原股东配售码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "每股获配额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "计划发行量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "实际发行量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中签公布日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "中签号",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转股价格",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "到期时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "中签率",
        "type": "object",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "同花顺-数据中心-可转债",
    "data": [],
    "summary": {}
  }
}
```# 可转债比价表

## api call
ak.bond_cov_comparison()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-债券市场-可转债比价表",
    "data_structure": [
      {
        "field": "序号",
        "type": "int32",
        "description": "-"
      },
      {
        "field": "转债代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转债名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转债最新价",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转债涨跌幅",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "正股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股最新价",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股涨跌幅",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "转股价",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转股价值",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转股溢价率",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "纯债溢价率",
        "type": "object",
        "description": "注意单位: %"
      },
      {
        "field": "回售触发价",
        "type": "object",
        "description": "-"
      },
      {
        "field": "强赎触发价",
        "type": "object",
        "description": "-"
      },
      {
        "field": "到期赎回价",
        "type": "object",
        "description": "-"
      },
      {
        "field": "纯债价值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "开始转股日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "上市日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "申购日期",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-债券市场-可转债比价表",
    "data": [],
    "summary": {}
  }
}
```# 可转债价值分析

## api call
ak.bond_zh_cov_value_analysis(symbol="113527")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="113527"; 可转债代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-新股数据-可转债数据-可转债价值分析",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "纯债价值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "转股价值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "纯债溢价率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "转股溢价率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-新股数据-可转债数据-可转债价值分析",
    "data": [],
    "summary": {}
  }
}
```# 可转债溢价率分析

## api call
ak.bond_zh_cov_value_analysis(symbol="113527")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="113527"; 可转债代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-新股数据-可转债数据-可转债溢价率分析",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "收盘价",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "纯债价值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "转股价值",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "纯债溢价率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "转股溢价率",
        "type": "float64",
        "description": "注意单位: %"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-新股数据-可转债数据-可转债溢价率分析",
    "data": [],
    "summary": {}
  }
}
```# 上证质押式回购

## api call
ak.bond_sh_buy_back_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-债券市场-上证质押式回购",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-债券市场-上证质押式回购",
    "data": [],
    "summary": {}
  }
}
```# 深证质押式回购

## api call
ak.bond_sz_buy_back_em()

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-债券市场-深证质押式回购",
    "data_structure": [
      {
        "field": "序号",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最新价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌额",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "今开",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "昨收",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-债券市场-深证质押式回购",
    "data": [],
    "summary": {}
  }
}
```# 质押式回购历史数据

## api call
ak.bond_buy_back_hist_em(symbol="204001")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="204001"; 质押式回购代码 |

## response
```json
{
  "metadata": {
    "description": "东方财富网-行情中心-债券市场-质押式回购-历史数据",
    "data_structure": [
      {
        "field": "日期",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "开盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "收盘",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最高",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "最低",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交量",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-行情中心-债券市场-质押式回购-历史数据",
    "data": [],
    "summary": {}
  }
}
```# 可转债实时数据-集思录

## api call
ak.bond_cb_jsl(cookie="您的集思录 cookie")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| cookie | str | cookie=''; 此处输入您的集思录 cookie 就可以获取完整数据，否则只能返回前 30 条 |

## response
```json
{
  "metadata": {
    "description": "集思录可转债实时数据，包含行情数据（涨跌幅，成交量和换手率等）及可转债基本信息（转股价，溢价率和到期收益率等）",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转债名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "现价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "涨跌幅",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "正股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "正股涨跌",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "正股PB",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转股价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转股价值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转股溢价率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "债券评级",
        "type": "object",
        "description": "-"
      },
      {
        "field": "回售触发价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "强赎触发价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转债占比",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "到期时间",
        "type": "object",
        "description": "-"
      },
      {
        "field": "剩余年限",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "剩余规模",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "成交额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "换手率",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "到期税前收益",
        "type": "float64",
        "description": "注意单位: %"
      },
      {
        "field": "双低",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "集思录可转债实时数据，包含行情数据（涨跌幅，成交量和换手率等）及可转债基本信息（转股价，溢价率和到期收益率等）",
    "data": [],
    "summary": {}
  }
}
```# 可转债强赎

## api call
ak.bond_cb_redeem_jsl()

## response
```json
{
  "metadata": {
    "description": "集思录可转债-强赎",
    "data_structure": [
      {
        "field": "代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "现价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "正股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "正股名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "规模",
        "type": "float64",
        "description": "注意单位: 亿"
      },
      {
        "field": "剩余规模",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "转股起始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最后交易日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "到期日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转股价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "强赎触发比",
        "type": "int64",
        "description": "注意单位: %"
      },
      {
        "field": "强赎触发价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "正股价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "强赎价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "强赎天计数",
        "type": "object",
        "description": "-"
      },
      {
        "field": "强赎条款",
        "type": "object",
        "description": "-"
      },
      {
        "field": "强赎状态",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "集思录可转债-强赎",
    "data": [],
    "summary": {}
  }
}
```# 集思录可转债等权指数

## api call
ak.bond_cb_index_jsl()

## response
```json
{
  "metadata": {
    "description": "可转债-集思录可转债等权指数",
    "data_structure": [
      {
        "field": "price_dt",
        "type": "object",
        "description": "日期"
      },
      {
        "field": "price",
        "type": "float64",
        "description": "指数"
      },
      {
        "field": "amount",
        "type": "float64",
        "description": "剩余规模(亿元)"
      },
      {
        "field": "volume",
        "type": "float64",
        "description": "成交额(亿元)"
      },
      {
        "field": "count",
        "type": "int64",
        "description": "数量"
      },
      {
        "field": "increase_val",
        "type": "float64",
        "description": "涨跌"
      },
      {
        "field": "increase_rt",
        "type": "float64",
        "description": "涨幅"
      },
      {
        "field": "avg_price",
        "type": "float64",
        "description": "平均价格(元)"
      },
      {
        "field": "mid_price",
        "type": "float64",
        "description": "中位数价格(元)"
      },
      {
        "field": "mid_convert_value",
        "type": "float64",
        "description": "中位数转股价值"
      },
      {
        "field": "avg_dblow",
        "type": "float64",
        "description": "平均双底"
      },
      {
        "field": "avg_premium_rt",
        "type": "float64",
        "description": "平均溢价率"
      },
      {
        "field": "mid_premium_rt",
        "type": "float64",
        "description": "中位数溢价率"
      },
      {
        "field": "avg_ytm_rt",
        "type": "float64",
        "description": "平均收益率"
      },
      {
        "field": "turnover_rt",
        "type": "float64",
        "description": "换手率"
      },
      {
        "field": "price_90",
        "type": "int64",
        "description": "&gt;90"
      },
      {
        "field": "price_90_100",
        "type": "int64",
        "description": "90~100"
      },
      {
        "field": "price_100_110",
        "type": "int64",
        "description": "100~110"
      },
      {
        "field": "price_110_120",
        "type": "int64",
        "description": "110~120"
      },
      {
        "field": "price_120_130",
        "type": "int64",
        "description": "120~130"
      },
      {
        "field": "price_130",
        "type": "int64",
        "description": "&gt;130"
      },
      {
        "field": "increase_rt_90",
        "type": "float64",
        "description": "&gt;90涨幅"
      },
      {
        "field": "increase_rt_90_100",
        "type": "float64",
        "description": "90~100涨幅"
      },
      {
        "field": "increase_rt_100_110",
        "type": "float64",
        "description": "100~110涨幅"
      },
      {
        "field": "increase_rt_110_120",
        "type": "float64",
        "description": "110~120涨幅"
      },
      {
        "field": "increase_rt_120_130",
        "type": "float64",
        "description": "120~130涨幅"
      },
      {
        "field": "increase_rt_130",
        "type": "float64",
        "description": "&gt;130涨幅"
      },
      {
        "field": "idx_price",
        "type": "float64",
        "description": "沪深300指数"
      },
      {
        "field": "idx_increase_rt",
        "type": "float64",
        "description": "沪深300指数涨幅"
      }
    ]
  },
  "sample_data": {
    "description": "可转债-集思录可转债等权指数",
    "data": [],
    "summary": {}
  }
}
```# 可转债转股价格调整记录-集思录

## api call
ak.bond_cb_adj_logs_jsl(symbol="128013")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="128013"; 可转债代码 |

## response
```json
{
  "metadata": {
    "description": "集思录-单个可转债的转股价格-调整记录",
    "data_structure": [
      {
        "field": "转债名称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "股东大会日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "下修前转股价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "下修后转股价",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "新转股价生效日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "下修底价",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "集思录-单个可转债的转股价格-调整记录",
    "data": [],
    "summary": {}
  }
}
```# 收盘收益率曲线历史数据

## api call
ak.bond_china_close_return(symbol="国债", period="1", start_date="20231101", end_date="20231101")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| symbol | str | symbol="政策性金融债(进出口行)"; 通过网页查询或调用 ak.bond_china_close_return_map() 获取 |
| period | str | period: str = "1"; 期限间隔, choice of {'0.1', '0.5', '1'} |
| start_date | str | start_date="20231101"; 结束日期, 结束日期和开始日期不要超过 1 个月 |
| end_date | str | end_date="20231101"; 结束日期, 结束日期和开始日期不要超过 1 个月 |

## response
```json
{
  "metadata": {
    "description": "收盘收益率曲线历史数据, 该接口只能获取近 3 个月的数据，且每次获取的数据不超过 1 个月",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "期限",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "到期收益率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "即期收益率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "远期收益率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "收盘收益率曲线历史数据, 该接口只能获取近 3 个月的数据，且每次获取的数据不超过 1 个月",
    "data": [],
    "summary": {}
  }
}
```# 中美国债收益率

## api call
ak.bond_zh_us_rate(start_date="19901219")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="19901219" |

## response
```json
{
  "metadata": {
    "description": "东方财富网-数据中心-经济数据-中美国债收益率历史数据",
    "data_structure": [
      {
        "field": "日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "中国国债收益率2年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中国国债收益率5年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中国国债收益率10年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中国国债收益率30年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中国国债收益率10年-2年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "中国GDP年增率",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "美国国债收益率2年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "美国国债收益率5年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "美国国债收益率10年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "美国国债收益率30年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "美国国债收益率10年-2年",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "美国GDP年增率",
        "type": "float64",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "东方财富网-数据中心-经济数据-中美国债收益率历史数据",
    "data": [],
    "summary": {}
  }
}
```# 国债发行

## api call
ak.bond_treasure_issue_cninfo(start_date="20210910", end_date="20211109")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20210911" |
| end_date | str | end_date="20211110" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-国债发行",
    "data_structure": [
      {
        "field": "债券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行起始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行终止日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "计划发行总量",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "实际发行总量",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "发行价格",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "单位面值",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "缴款日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "增发次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行对象",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券名称",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-国债发行",
    "data": [],
    "summary": {}
  }
}
```# 地方债发行

## api call
ak.bond_local_government_issue_cninfo(start_date="20210911", end_date="20211110")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20210911" |
| end_date | str | end_date="20211110" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-地方债发行",
    "data_structure": [
      {
        "field": "债券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行起始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行终止日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "计划发行总量",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "实际发行总量",
        "type": "float64",
        "description": "注意单位: 亿元"
      },
      {
        "field": "发行价格",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "单位面值",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "缴款日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "增发次数",
        "type": "int64",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行对象",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券名称",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-地方债发行",
    "data": [],
    "summary": {}
  }
}
```# 企业债发行

## api call
ak.bond_corporate_issue_cninfo(start_date="20210911", end_date="20211110")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20210911" |
| end_date | str | end_date="20211110" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-企业债发行",
    "data_structure": [
      {
        "field": "债券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易所网上发行起始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易所网上发行终止日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "计划发行总量",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "实际发行总量",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "发行面值",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "发行价格",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "发行方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行对象",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行范围",
        "type": "object",
        "description": "-"
      },
      {
        "field": "承销方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最小认购单位",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "募资用途说明",
        "type": "object",
        "description": "-"
      },
      {
        "field": "最低认购额",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "债券名称",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-企业债发行",
    "data": [],
    "summary": {}
  }
}
```# 可转债发行

## api call
ak.bond_cov_issue_cninfo(start_date="20210913", end_date="20211112")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| start_date | str | start_date="20210913" |
| end_date | str | end_date="20211112" |

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债发行",
    "data_structure": [
      {
        "field": "债券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行起始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行终止日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "计划发行总量",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "实际发行总量",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "发行面值",
        "type": "int64",
        "description": "注意单位: 元"
      },
      {
        "field": "发行价格",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "发行方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行对象",
        "type": "object",
        "description": "-"
      },
      {
        "field": "发行范围",
        "type": "object",
        "description": "-"
      },
      {
        "field": "承销方式",
        "type": "object",
        "description": "-"
      },
      {
        "field": "募资用途说明",
        "type": "object",
        "description": "-"
      },
      {
        "field": "初始转股价格",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "转股开始日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转股终止日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "网上申购日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "网上申购代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "网上申购简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "网上申购数量上限",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "网上申购数量下限",
        "type": "float64",
        "description": "注意单位: 万元"
      },
      {
        "field": "网上申购单位",
        "type": "float64",
        "description": "-"
      },
      {
        "field": "网上申购中签结果公告日及退款日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "优先申购日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "配售价格",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "债权登记日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "优先申购缴款日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "交易市场",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券名称",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债发行",
    "data": [],
    "summary": {}
  }
}
```# 可转债转股

## api call
ak.bond_cov_stock_issue_cninfo()

## response
```json
{
  "metadata": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债转股",
    "data_structure": [
      {
        "field": "债券代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "公告日期",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转股代码",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转股简称",
        "type": "object",
        "description": "-"
      },
      {
        "field": "转股价格",
        "type": "float64",
        "description": "注意单位: 元"
      },
      {
        "field": "自愿转换期起始日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "自愿转换期终止日",
        "type": "object",
        "description": "-"
      },
      {
        "field": "标的股票",
        "type": "object",
        "description": "-"
      },
      {
        "field": "债券名称",
        "type": "object",
        "description": "-"
      }
    ]
  },
  "sample_data": {
    "description": "巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债转股",
    "data": [],
    "summary": {}
  }
}
```# 新综合指数

## api call
ak.bond_new_composite_index_cbond(indicator="财富", period="总值")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| indicator | str | indicator="财富"; choice of {"全价", "净价", "财富", "平均市值法久期", "平均现金流法久期", "平均市值法凸性", "平均现金流法凸性", "平均现金流法到期收益率", "平均市值法到期收益率", "平均基点价值", "平均待偿期", "平均派息率", "指数上日总市值", "财富指数涨跌幅", "全价指数涨跌幅", "净价指数涨跌幅", "现券结算量"} |
| period | str | period="总值"; choice of {"总值", "1年以下", "1-3年", "3-5年", "5-7年", "7-10年", "10年以上", "0-3个月", "3-6个月", "6-9个月", "9-12个月", "0-6个月", "6-12个月"} |

## response
```json
{
  "metadata": {
    "description": "中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-新综合指数",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "注意单位"
      }
    ]
  },
  "sample_data": {
    "description": "中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-新综合指数",
    "data": [],
    "summary": {}
  }
}
```# 综合指数

## api call
ak.bond_composite_index_cbond(indicator="财富", period="总值")

## input parameters
| 名称 | 类型 | 描述 |
|---|---|---|
| indicator | str | indicator="财富"; choice of {"全价", "净价", "财富", "平均市值法久期", "平均现金流法久期", "平均市值法凸性", "平均现金流法凸性", "平均现金流法到期收益率", "平均市值法到期收益率", "平均基点价值", "平均待偿期", "平均派息率", "指数上日总市值", "财富指数涨跌幅", "全价指数涨跌幅", "净价指数涨跌幅", "现券结算量"} |
| period | str | period="总值"; choice of {"总值", "1年以下", "1-3年", "3-5年", "5-7年", "7-10年", "10年以上", "0-3个月", "3-6个月", "6-9个月", "9-12个月", "0-6个月", "6-12个月"} |

## response
```json
{
  "metadata": {
    "description": "中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-综合指数",
    "data_structure": [
      {
        "field": "date",
        "type": "object",
        "description": "-"
      },
      {
        "field": "value",
        "type": "float64",
        "description": "注意单位"
      }
    ]
  },
  "sample_data": {
    "description": "中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-综合指数",
    "data": [],
    "summary": {}
  }
}
```


