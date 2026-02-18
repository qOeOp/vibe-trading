---
title: 数据架构
subtitle: 数据源 · 核心模型 · 更新策略
icon: Database
layout: rows
cards:
  - id: sources
    title: 数据源
    subtitle: AKShare (免费·主力) · BaoStock (免费·基本面) · TuShare Pro (付费·补充)
    render: markdown
    flex: 100
    row: 1
    badge: { icon: Database, label: 3 源, color: teal }
    expandTitle: 数据源 — 接口清单 & 限制
    expandSubtitle: 各数据源 API 列表 + 频率限制 + 数据质量对比
  - id: models
    title: 核心数据模型
    subtitle: SQLite (MVP) → PostgreSQL (Production) · 4 核心表
    render: markdown
    flex: 50
    row: 2
    badge: { icon: Layers, label: 模型, color: purple }
  - id: schedule
    title: 数据更新策略
    subtitle: 日线 T+0 · 财报 T+30 · 宏观 T+7~30 · 实时 3s
    render: markdown
    flex: 50
    row: 2
    badge: { icon: Clock, label: 更新, color: blue }
rows:
  - height: auto
  - height: auto
links:
  - from: 日线行情
    to: Market/Sector
    desc: 驱动板块 Treemap 和 K 线图
  - from: 财务报表
    to: Analysis/Fundamental
    desc: 基本面分析数据源
  - from: 因子值
    to: Factor/Library
    desc: 因子库存储计算结果
footer: >-
  数据源: AKShare (主力) + BaoStock (基本面) + TuShare Pro (可选增强) ·
  存储: SQLite (MVP) → PostgreSQL (Production) · 缓存: Redis
---

<!-- card: sources -->

## AKShare — 免费 · 主力数据源

| 数据类型 | 说明 |
|---|---|
| A股日线 OHLCV | 全市场历史日线数据 |
| 实时行情快照 | 盘中 3s 间隔刷新 |
| 板块/概念/行业分类 | 申万/同花顺/概念板块 |
| 宏观经济指标 | GDP/CPI/PMI 等 |
| 大宗商品价格 | 黄金/白银/原油 |
| 北向资金/融资融券 | 资金流向数据 |

---

## BaoStock — 免费 · 基本面

| 数据类型 | 说明 |
|---|---|
| 上市公司财报 | 利润表/资产负债表/现金流 |
| 杰邦分析指标 | 综合分析指标 |
| 盈利能力/成长能力指标 | 财务质量评估 |
| 更新频率 | 季频 (T+30) |

---

## TuShare Pro — 付费 · 补充

| 数据类型 | 说明 |
|---|---|
| 分钟级别行情数据 | 高频分析需求 |
| 龙虎榜/大宗交易明细 | 异动监控 |
| 基金持仓/申赎数据 | 机构行为追踪 |
| 备注 | 需要积分 (付费), 作为可选增强数据源 |

<!-- card: sources:expand -->

## 数据源对比

| 维度 | AKShare | BaoStock | TuShare Pro |
|---|---|---|---|
| 费用 | 免费 | 免费 | 付费 (积分) |
| 覆盖 | 行情+宏观+资金 | 财务报表 | 高频+机构 |
| 延迟 | T+0 (日线) / 实时 | T+30 (季频) | T+0 |
| 稳定性 | 中 (依赖爬虫) | 高 (官方接口) | 高 (商业级) |
| API 限流 | 无明确限制 | 较宽松 | 按积分等级 |

## 数据质量处理

- 缺失值: 停牌日自动填充前值 / 标记 NaN
- 异常值: 涨跌停超限检测 → 标记而非删除
- 复权: 默认使用前复权 (hfq) 价格
- 对账: 每周与交易所官方数据核对一次

<!-- card: models -->

## 核心数据表

| 模型 | 字段 |
|---|---|
| **StockDaily** | code, date, open, high, low, close, volume, amount, turnover_rate |
| **MacroIndicator** | indicator_id, date, value, source, frequency |
| **FactorValue** | factor_id, code, date, value, zscore, percentile |
| **BacktestResult** | strategy_id, start_date, end_date, returns, sharpe, max_drawdown |

存储路径: SQLite (MVP 阶段) → PostgreSQL (生产环境)

<!-- card: schedule -->

## 更新频率

| 数据类型 | 频率 | 来源 | 延迟 |
|---|---|---|---|
| 日线行情 | 每日 15:30 | AKShare | T+0 |
| 财务报表 | 季度更新 | BaoStock | T+30 |
| 宏观指标 | 月度/季度 | AKShare | T+7~30 |
| 实时快照 | 盘中 3s 间隔 | AKShare | 实时 |
