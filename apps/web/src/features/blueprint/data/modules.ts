import type { LucideIcon } from 'lucide-react';
import {
  LayoutGrid,
  TrendingUp,
  Newspaper,
  BarChart3,
  FlaskConical,
  Gem,
  Wallet,
  LineChart,
  BookOpen,
  Shield,
  Settings,
} from 'lucide-react';

export interface BlueprintModule {
  id: string;
  icon: LucideIcon;
  label: string;
  phase: 'MVP' | 'P2' | 'P3';
  workflow: string;
  topbar: string[];
  tabDescs: string[];
  note?: string;
}

export const MODULES: BlueprintModule[] = [
  {
    id: 'dashboard',
    icon: LayoutGrid,
    label: 'Dashboard',
    phase: 'MVP',
    workflow: '监控 — 每日起点',
    topbar: ['Vision', 'Workflow', 'Roadmap', 'Data', 'Tech'],
    tabDescs: [
      '平台定位 · 进化循环 · 市场定位',
      '三循环模型(日/周/季) · A股工作流 · 策略生命周期 · 多策略集成',
      'MVP → P2 → P3 开发路线',
      '数据架构 · AKShare · BaoStock · TuShare',
      '技术栈 · Monorepo · 前后端架构',
    ],
    note: '蓝图阶段: TopBar 暂存设计文档。上线后此页无 TopBar，直接展示核心仪表盘。',
  },
  {
    id: 'market',
    icon: TrendingUp,
    label: 'Market',
    phase: 'MVP',
    workflow: '观察 — 市场全景',
    topbar: [
      'Sector',
      'Auction',
      'News',
      'Macro',
      'Industry',
      'Capital',
      'Sentiment',
    ],
    tabDescs: [
      '板块实时态势 (3 Cards): Card1板块Treemap(复用已实现的water-ripple/sparkline/drill-down交互+增量:分类体系切换申万/概念/地域·面积维度切换市值/成交额/资金流·时间维度今日/5日/20日·tooltip增强领涨领跌·右键菜单跨模块跳转) · Card2板块排名&市场宽度(AG Grid排名表+涨跌分布+板块分化度σ+热门概念Top3·双向联动treemap) · Card3板块资金&联动(北向/主力资金板块偏好Top3·5日动量/均值回归信号·5条跨模块联动)',
      '集合竞价监控 (3 Cards精简架构): Card1全市场竞价总览(AG Grid表格+9:25统计banner+单股详情弹出含AI解读·四层数据源:AKShare/XTick/QMT/万得) · Card2异动检测引擎(4维度:大单/涨跌停预判/量比/偏离度·动态阈值·异动→表格联动) · Card3深市尾盘&模块联动(14:57条件激活·2核心分析+模态框含补充分析/时段状态机/布局建议·5条跨模块联动) · 顶部阶段指示器+底部统计条 · 裁剪: 竞价情报中心→合并到Card1统计banner+Dashboard; 时段状态机→技术文档移入模态框; 撤单异动→Tier2+可启用; 10→5联动精简',
      '新闻墙: 多源爬取 (财联社/东财/新浪/公告) · 按行业/板块/类型/紧急度分类 · AI摘要 · 事件时间线 · 自定义关注词高亮 · 政策分级 (国务院/证监会/央行/交易所) · 晨会纪要聚合',
      '宏观经济日历: MLF/LPR/社融/PMI/CPI/GDP/工业增加值 · 数据发布时间表 · 预期vs实际差异 · 历史趋势 · 政策窗口标注 (两会/中央经济工作会议/国常会) · 财报季日历 (1月预告/4月年报/8月中报/10月三季报) · A股特色事件 (指数成分调整/IPO节奏/减持公告窗口)',
      '行业轮动分析 · 板块相对强弱 (RRG旋转图) · 概念热度排名 · 板块资金流向 · 行业间相关性 · 轮动趋势 (动量+均值回归信号) · HMM市场状态下的板块表现差异',
      '北向资金 (实时净买入/持仓变动/重仓股/行业偏好) · 主力资金流向 (超大单/大单/中单/小单) · 融资融券 (余额变化/标的异动) · 龙虎榜 (机构/游资席位/买卖金额/关联分析) · 大宗交易 (折溢价/接盘方追踪) · 市场温度计 (Fear/Greed 综合指标)',
      'LLM情绪因子: 新闻/公告/社媒 → 情绪评分 · 情绪-收益相关性回测 · 行业情绪热力图 · 个股情绪时序 · 舆情异动预警 (雪球/东财热帖/微博) · 技术方案: FinGPT/FinBERT-CN (LoRA微调, 单卡可跑)',
    ],
  },
  {
    id: 'research',
    icon: Newspaper,
    label: 'Research',
    phase: 'P2',
    workflow: '观察→假设 — 知识中台',
    topbar: ['Papers', 'Reports', 'Hypotheses'],
    tabDescs: [
      '量化论文爬取 (arxiv/SSRN/知网) · AI摘要 · 关键方法论提取 · 按主题标签分类 (因子/风控/执行/另类数据) · 收藏与批注',
      '券商研报爬取 · AI结构化提取 (目标价/评级变动/核心逻辑) · 行业覆盖热力图 · 分析师追踪',
      '假设看板: 从论文/研报中提取的可测试假设 → 状态管理 (待验证/验证中/已确认/已否决) · 一键创建 Factor Lab 任务',
    ],
  },
  {
    id: 'analysis',
    icon: BarChart3,
    label: 'Analysis',
    phase: 'P2',
    workflow: '观察 — 个股深度透视',
    topbar: [
      'Overview',
      'Technical',
      'Factors',
      'Fundamental',
      'Flow & Events',
      'Compare',
    ],
    tabDescs: [
      '6D共振雷达图 · 综合评分+置信度 · 关键指标速览 (PE/PB/ROE/市值/换手率) · 当前持仓状态 (在哪些Book里) · AI一句话摘要',
      'K线图 · 技术指标 (MA/MACD/KDJ/BOLL) · Price Action结构分析 (支撑阻力/趋势结构/关键K线形态) · 成交量分析 · 指标有效性评级',
      '因子得分时序图 · 因子排名分位数 (全市场位置) · 因子暴露分析 (风格因子) · 因子信号历史 (过去买卖信号准确率)',
      '财务报表 (利润表/资产负债表/现金流) · 估值指标+历史分位 · 杜邦分析 · 现金流质量评分 · 成长性趋势',
      '主力资金流向 (日/周/月) · 北向资金持仓变化 · 龙虎榜+席位分析 · 大宗交易 · 事件时间线 (财报/评级/减持/政策) · 新闻/公告/研报摘要',
      '多股走势叠加 · 财务指标横向对比 · 因子暴露对比 · 同行业排名',
    ],
  },
  {
    id: 'factor',
    icon: FlaskConical,
    label: 'Factor',
    phase: 'MVP',
    workflow: '假设→验证 — 因子工坊',
    topbar: ['Home', 'Monitor', 'Library', 'Lab', 'Backtest', 'Mining'],
    tabDescs: [
      '因子模块大看板: 健康预警banner (IC异常/PROBATION因子→跳转Monitor) · 因子zoo状态 (LIVE/PROBATION/RETIRED数量→跳转Library) · Polar Calendar (月度表现日历) · Band Chart (日收益分布带) · Strategy Ranking · Lab进行中任务 · Mining任务状态 · 最近回测结果摘要 · 各区域点击可跳转对应tab',
      '因子健康看板 (周度必查): 全因子IC/IR滚动热力图 (X=因子, Y=时间, 色=IC值) · 正交性矩阵 (因子间相关性/聚类分组/冗余检测) · 条件IC分析 (按Regime/市值/行业分切) · 预警列表 (IC连续下滑/进入PROBATION的因子) · 因子zoo统计 (总数/LIVE/PROBATION/RETIRED) · 容量监控 (策略AUM vs 因子容量上限)',
      '因子卡片网格 · 生命周期状态管理 (INCUBATING→PAPER_TEST→LIVE_ACTIVE→PROBATION→RETIRED) · IC衰减曲线 · AG Grid多维排序 · 因子详情 (点击展开: 定义/统计量/历史表现/使用中的Book) · 批量操作 (对比/导出/状态变更) · 因子分类标签 (价值/质量/动量/情绪/波动/流动性/规模/AI挖掘)',
      '因子构建工作台: 代码模式 (Python/表达式编辑器) + 可视化拖拽模式 (借鉴BigQuant) · 单因子检验全流程: IC/IR统计 · 分位收益 (Q1-Q5) · T检验 · 正交检验 (与已有因子的相关性) · 条件检验 (不同Regime/市值/行业下的IC稳定性) · 换手率分析 · A股约束检验 (T+1换手成本/涨跌停流动性影响) · 检验通过→一键提交到Library (INCUBATING状态)',
      '回测引擎: 净值曲线 · 绩效归因 Brinson · Walk-Forward分析 (防过拟合) · 策略对比 (多策略叠加) · 一键生成策略体检报告 (QuantStats: Sharpe/Sortino/Calmar/月度热力图/水下曲线/滚动指标) · K线交易标注 (VectorBT风格) · 参数空间热力图 · A股成本模型 (佣金/印花税/滑点/T+1冲击) · 容量分析 (不同AUM下的策略衰减)',
      'AI因子挖掘引擎: LLM驱动因子生成 (QuantaAlpha/RD-Agent-Q/Alpha-R1) · 进化树可视化 (因子变异/交叉/选择过程) · 任务配置 (目标变量/特征池/约束条件/算法选择) · 进度追踪 (实时日志/GPU利用率/已评估因子数) · 挖掘结果审查 (自动IC/IR检验→人工审核→提交到Lab深度检验)',
    ],
  },
  {
    id: 'screener',
    icon: Gem,
    label: 'Screener',
    phase: 'P2',
    workflow: '构建 — 选股落地',
    topbar: ['Factor Picks', 'Watchlist', 'Filter'],
    tabDescs: [
      '六维共振信号卡片: ①量化因子 ②Price Action ③情绪 ④聪明钱 ⑤事件催化 ⑥Regime — 共振塔可视化 · 综合评分 · Kelly仓位 · Bull/Bear对抗论点摘要 (多空双方AI论证)',
      '自选股列表 · 分组管理 · 盯盘提醒 · 共振层数变化通知',
      '条件筛选器 · 自定义指标组合筛选 · 因子暴露过滤 · 按共振维度数排序',
    ],
  },
  {
    id: 'portfolio',
    icon: Wallet,
    label: 'Portfolio',
    phase: 'P2',
    workflow: '执行 — 组合管理',
    topbar: ['Books', 'Holdings', 'Exposure', 'Attribution', 'Rebalance'],
    tabDescs: [
      '策略账本(Book)管理: 创建/配置/资金分配 · 实盘vs模拟盘 · 券商账户关联 · Book间绩效对比 (净值叠加/Sharpe/MaxDD/相关性矩阵) · 资金分配建议',
      '按Book查看持仓 · 市值分布 · 盈亏明细 · Kelly最优仓位 vs 实际仓位对比 · All Books汇总视图',
      '行业/因子/风格暴露分析 · 集中度风险 · Regime条件下的暴露变化 · 跨Book暴露汇总',
      '绩效归因 Brinson · 超额收益来源分解 · Alpha/Beta分离 · 按Book独立归因',
      '组合优化引擎 (Mean-Variance · Risk Parity · Black-Litterman · 最大夏普) · 目标组合 vs 当前持仓 · 再平衡交易建议 · 交易成本预估 · 容量管理',
    ],
  },
  {
    id: 'trading',
    icon: LineChart,
    label: 'Trading',
    phase: 'P3',
    workflow: '执行 — 交易闭环',
    topbar: ['Plan', 'Orders', 'History'],
    tabDescs: [
      '多策略信号汇总 → 共振过滤 → 今日交易计划 · Kelly仓位 · ATR止损价 · 多目标止盈',
      '委托管理 · 订单状态 · 执行偏差 (滑点/冲击) · TWAP/VWAP 执行算法选择',
      '历史交易记录 · 成本分析 · 交易行为统计 · 执行纪律评分',
    ],
  },
  {
    id: 'journal',
    icon: BookOpen,
    label: 'Journal',
    phase: 'P3',
    workflow: '复盘→改进 — 进化记录',
    topbar: ['Daily', 'Review', 'Patterns', 'Evolution'],
    tabDescs: [
      '日历视图 · 每策略每日: 系统自动记录 (交易/市场) + 用户主观反思',
      '周报/月报 · 盈亏归因 · 执行纪律评分 · 策略偏离度分析',
      '跨时间模式识别 · Regime × 策略表现矩阵 · 认知偏差检测',
      '三层记忆系统: 情景记忆(每笔交易) · 语义记忆(规律总结) · 程序记忆(自动规则) · 进化管理器每日回顾',
    ],
  },
  {
    id: 'risk',
    icon: Shield,
    label: 'Risk',
    phase: 'P3',
    workflow: '监控 — 风控护栏',
    topbar: ['Monitor', 'Rules', 'Stress Test', 'Regime'],
    tabDescs: [
      '实时风险仪表盘 · VaR/CVaR · 回撤 · 因子衰减预警 · ATR动态止损',
      '风控规则引擎 · 止损线 / 仓位上限 / 集中度限制 / 相关性限制 · Regime触发规则',
      '酷刑室: 合成极端数据 (闪崩/假新闻/流动性枯竭) 对抗测试 → OOS盲测 → 因子生命周期门控 (Torture Chamber)',
      'HMM市场状态检测 (牛市/熊市/震荡/危机) · 状态转移概率 · Regime驱动策略权重自动调节',
    ],
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Settings',
    phase: 'MVP',
    workflow: '—',
    topbar: ['General', 'Data Sources', 'Agents', 'Notifications'],
    tabDescs: [
      '技术栈概览 · Monorepo 结构 · 系统配置 · A2UI 协议设置',
      '数据源管理 · 接入状态 · 更新频率 · 延迟 · 数据质量监控 · 券商接口对接 (QMT/PTrade API · 模拟盘/实盘切换)',
      'Agent矩阵管理: 知识Agent · 决策Agent · R&D Agent · QC Agent · 监控Agent · 各Agent状态/日志/配置',
      '通知偏好 · 预警阈值 · 推送渠道 · Regime变化自动通知',
    ],
  },
];

export const PHASE_COLOR: Record<string, string> = {
  MVP: 'var(--color-mine-accent-teal)',
  P2: 'var(--color-mine-accent-purple)',
  P3: 'var(--color-mine-accent-yellow)',
};

export const RESONANCE_DIMS = [
  {
    key: 'factor',
    label: '量化因子',
    short: 'Factor',
    color: 'var(--color-mine-accent-teal)',
    desc: '横截面多因子综合评分',
  },
  {
    key: 'pa',
    label: '价格行为',
    short: 'PA',
    color: 'var(--color-mine-accent-blue)',
    desc: '支撑阻力 · 趋势结构 · K线形态',
  },
  {
    key: 'sentiment',
    label: '情绪',
    short: 'Senti',
    color: 'var(--color-mine-accent-amber)',
    desc: '新闻/社媒/研报情绪极性',
  },
  {
    key: 'flow',
    label: '聪明钱',
    short: 'Flow',
    color: 'var(--color-mine-accent-purple)',
    desc: '北向资金 · 主力净流入 · 大宗',
  },
  {
    key: 'event',
    label: '事件催化',
    short: 'Event',
    color: 'var(--color-factor-dividend)',
    desc: '业绩超预期 · 评级上调 · 政策',
  },
  {
    key: 'regime',
    label: '市场环境',
    short: 'Regime',
    color: 'var(--color-factor-size)',
    desc: 'Regime状态 · 板块轮动方向',
  },
];

export interface ScreenerStock {
  code: string;
  name: string;
  score: number;
  kelly: string;
  winRate: string;
  rr: string;
  signals: { key: string; state: 'bull' | 'neutral' | 'bear' }[];
}

export const MOCK_SCREENER: ScreenerStock[] = [
  {
    code: '002594',
    name: '比亚迪',
    score: 92,
    kelly: '8.5%',
    winRate: '68%',
    rr: '2.4:1',
    signals: [
      { key: 'factor', state: 'bull' },
      { key: 'pa', state: 'bull' },
      { key: 'sentiment', state: 'bull' },
      { key: 'flow', state: 'bull' },
      { key: 'event', state: 'bull' },
      { key: 'regime', state: 'neutral' },
    ],
  },
  {
    code: '300750',
    name: '宁德时代',
    score: 85,
    kelly: '6.2%',
    winRate: '63%',
    rr: '2.1:1',
    signals: [
      { key: 'factor', state: 'bull' },
      { key: 'pa', state: 'bull' },
      { key: 'sentiment', state: 'neutral' },
      { key: 'flow', state: 'bull' },
      { key: 'event', state: 'bull' },
      { key: 'regime', state: 'neutral' },
    ],
  },
  {
    code: '601012',
    name: '隆基绿能',
    score: 78,
    kelly: '5.1%',
    winRate: '59%',
    rr: '1.8:1',
    signals: [
      { key: 'factor', state: 'bull' },
      { key: 'pa', state: 'neutral' },
      { key: 'sentiment', state: 'bull' },
      { key: 'flow', state: 'bull' },
      { key: 'event', state: 'neutral' },
      { key: 'regime', state: 'neutral' },
    ],
  },
  {
    code: '600519',
    name: '贵州茅台',
    score: 71,
    kelly: '4.3%',
    winRate: '56%',
    rr: '1.6:1',
    signals: [
      { key: 'factor', state: 'bull' },
      { key: 'pa', state: 'bear' },
      { key: 'sentiment', state: 'neutral' },
      { key: 'flow', state: 'bull' },
      { key: 'event', state: 'neutral' },
      { key: 'regime', state: 'bull' },
    ],
  },
  {
    code: '000858',
    name: '五粮液',
    score: 64,
    kelly: '3.2%',
    winRate: '52%',
    rr: '1.4:1',
    signals: [
      { key: 'factor', state: 'bull' },
      { key: 'pa', state: 'neutral' },
      { key: 'sentiment', state: 'bear' },
      { key: 'flow', state: 'neutral' },
      { key: 'event', state: 'neutral' },
      { key: 'regime', state: 'bull' },
    ],
  },
];

export const MOCK_CHAT = [
  { role: 'user' as const, text: '今天因子表现不好是什么原因？' },
  {
    role: 'ai' as const,
    text: `你的动量因子今日收益 -1.2%，主要原因是市场 Regime 从“震荡”切换到“避险”模式。北向资金今日净流出 38 亿，前期动量强势的半导体板块遭到集中减仓。建议查看 Risk/Regime 确认状态转移，并检查 Factor/Library 中该因子的 IC 衰减趋势。`,
  },
  { role: 'user' as const, text: '这个因子以后还能用吗？' },
  {
    role: 'ai' as const,
    text: `从 IC 衰减曲线看，该因子近 60 日滚动 IC 从 0.042 下降到 0.018，但尚未跌破 0.01 的 PROBATION 阈值。当前状态: LIVE_ACTIVE。\n\n建议: ① 观察 1-2 周，若 IC 继续下滑则自动进入 PROBATION ② 酷刑室显示该因子在“避险”Regime 下历史表现本就偏弱，属于正常波动 ③ 可在 Portfolio/Exposure 检查该因子的权重暴露是否过高。`,
  },
];
