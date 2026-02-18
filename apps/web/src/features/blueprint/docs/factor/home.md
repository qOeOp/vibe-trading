---
title: Home 因子大看板
subtitle: 健康预警 · 因子Zoo · 可视化概览 · 模块活动索引
icon: LayoutDashboard
layout: rows
cards:
  - id: health
    title: 健康预警 Banner
    subtitle: IC 异常 · PROBATION 因子 · 系统级预警
    render: markdown
    flex: 100
    row: 0
    badge: { icon: AlertTriangle, label: 预警, color: red }
  - id: zoo-top
    title: 因子 Zoo & Top 因子
    subtitle: 生命周期统计 · Top 因子排名
    render: markdown
    flex: 55
    row: 1
    badge: { icon: Shield, label: 实时, color: teal }
    expandTitle: 因子 Zoo & Top 因子 — 完整文档
    expandSubtitle: 概念索引 · 因子生命周期状态机 · Zoo 管理策略 · 数据源
  - id: trend
    title: 因子表现趋势
    subtitle: 月度日历 · 分位收益带 · 策略排名
    render: markdown
    flex: 45
    row: 1
    badge: { icon: BarChart3, label: 可视化, color: blue }
    expandTitle: 因子表现趋势 — 完整文档
    expandSubtitle: 可视化功能详解 · 交互行为 · 数据源
  - id: activity
    title: 模块活动概览 & 快速导航
    subtitle: 5 区域状态 · 最近事件 · Tier 路线图
    render: markdown
    flex: 100
    row: 2
    badge: { icon: Navigation, label: 5 areas, color: gray }
    expandTitle: 模块活动概览 — 完整文档
    expandSubtitle: Dashboard 联动 · 数据刷新频率 · Tier 路线图 · 功能分期
rows:
  - height: auto
  - height: 420px
  - height: auto
links:
  - from: IC 预警
    to: Monitor tab
    desc: 查看因子健康详情
  - from: 因子 Zoo
    to: Library tab
    desc: 管理因子生命周期
  - from: 进行中检验
    to: Lab tab
    desc: 继续因子检验
  - from: 策略信号
    to: Dashboard
    desc: 查看每日策略信号
  - from: 挖掘任务
    to: Mining tab
    desc: 查看 AI 挖掘进度
footer: >-
  预警Banner(全宽) | Zoo&Top因子(flex-55) | 可视化趋势(flex-45) | 活动导航(全宽) ·
  数据源: 因子生命周期 DB + scipy spearmanr + 回测引擎
---

<!-- card: health -->

## 健康预警色带

全宽 Banner, 按严重度从高到低展示 0-3 条预警消息:

| 严重度 | 颜色 | 示例 |
|---|---|---|
| 🔴 严重 | 红色 | "动量因子 v3 IC 连续 5 日 < 0.01, 已进入 PROBATION" |
| 🟡 警告 | 橙色 | "价值因子 v2 IC 近 20 日下滑 30%, 观察中" |
| 🔵 信息 | 蓝色 | "波动率因子 Paper Test 还剩 8 个交易日到期" |

**无预警时**: 显示 "✅ 所有因子健康运行中" (绿色背景)

**交互**: 点击预警消息 → 跳转到对应 tab (Monitor/Lab/Library) 的具体因子

<!-- card: zoo-top -->

## 因子 Zoo 概览

按生命周期状态分组统计:

| 状态 | 含义 | 展示 |
|---|---|---|
| INCUBATING | 假设已定义, 统计检验中 | 数量 + 趋势箭头 |
| PAPER_TEST | 通过检验, 前瞻测试中 | 数量 + 趋势箭头 |
| LIVE_ACTIVE | 正式产生交易信号 | 数量 + 趋势箭头 |
| PROBATION | IC 衰减, 观察中 | 数量 + 趋势箭头 (橙色) |
| RETIRED | 确认失效, 已停止 | 数量 + 趋势箭头 (灰色) |

**交互**: 点击任一状态卡片 → 跳转 Library tab, 预筛选该状态

---

## Top 5 因子排名

按 IC × IR 综合得分排名, 展示:
- 因子名称 + 类别标签
- IC 值 (保留 3 位小数)
- IR 值 (保留 2 位小数)
- 生命周期状态 badge
- 近 20 日 IC sparkline (迷你折线图)

<!-- card: zoo-top:expand -->

## 因子模块概念索引

本索引是因子模块所有实体的权威定义。其他 tab 引用此处, 不重复定义。

### 方法论声明

本平台的因子检验采用**预测范式** (T 日因子值预测 T+1 日横截面收益), 而非传统资产定价的同期解释范式 (Fama-French/Fama-MacBeth 回归)。这一选择是因为我们的目标是**交易信号生成**, 而非学术资产定价研究。Lab 中所有 IC 均为预测性 IC。

### Factor 因子实体

| 字段 | 说明 |
|---|---|
| id | 唯一标识 (自动生成) |
| name | 因子名称 (如 "小盘动量 v3") |
| version | 版本号 (同名因子修改参数产生新版本) |
| category | 9 大类: 动能 / 股息率 / 价值 / 成长 / 品质 / 流动性 / 波动度 / 规模 / 情绪 |
| factorType | "leaf" (叶子因子, 直接从数据源计算) \| "composite" (复合因子, 由多个因子通过算子组合) |
| expectedDirection | "positive" (值大→预期收益高) \| "negative" (值大→预期收益低) |
| source | "manual" \| "mining_gplearn" \| "mining_pysr" \| "mining_llm" — 因子来源 (与分类正交) |
| status | 生命周期状态 (见状态机) |
| expression | 因子表达式/公式 (如 `rank(volume) / rank(close)`) |
| ic | 最近 60 日滚动 IC |
| ir | IC 的均值/标准差 |
| ic_tstat | IC 的 t 统计量 |
| turnover | 月度换手率 |
| capacity | 估算容量上限 (万元) |
| createdAt | 创建时间 |
| createdBy | 创建者 |
| tags | 自定义标签 |

### 9 大因子分类 — 子类说明

| 分类 | 子类 | 典型因子 |
|---|---|---|
| **动能** | 动量 (1M/3M/12M 收益率) · 反转 (短期超卖信号) · 技术指标 (RSI/MACD/KDJ) | 12M 动量, 1M 反转 |
| **股息率** | 股息率 · 股息成长率 · 股息稳定性 | 近 12M 股息率 |
| **价值** | BP (账面市值比) · EP (盈利市值比) · SP (营收市值比) · CF/P (现金流市值比) | PB 倒数, PE 倒数 |
| **成长** | 营收同比增速 · 净利润同比增速 · ROE 变化率 | 营收 YoY, 净利润 YoY |
| **品质** | 盈利能力 (ROE/ROA/毛利率) · 应计质量 · 财务健康 (负债率/流动比) | GP/Assets, Accruals |
| **流动性** | 换手率 · 成交额 · Amihud 非流动性 · 买卖价差 | 月均换手率 |
| **波动度** | 总波动率 · 特质波动率 (IVOL) · Beta · 尾部风险 | 60 日 IVOL |
| **规模** | 总市值 · 流通市值 · 对数市值 | ln(市值) |
| **情绪** | 新闻情绪 · 社媒情绪 · 分析师预期修正 · 北向资金流向 | 新闻极性得分 |

> **"AI 挖掘" 不是因子分类**, 而是因子来源 (source 字段)。Mining 发现的因子应归入其经济学含义对应的 9 大类之一。

### Factor → Strategy (1:N)

- **Strategy (策略)** = N 个 Factor × 权重 + 调仓规则 + 选股规则 + 风控规则
- 策略在 **Backtest tab** 定义和验证, 在 **Portfolio/Books** 管理和部署
- 因子是策略的原材料; 一个策略可组合多个因子

### Strategy → Book (N:M)

- **Book (策略账本)** = Strategy + Capital + Broker + Risk Rules (定义于 product-vision.md)
- 1 个 Book 可包含多个 Strategy (多策略混合)
- 1 个 Strategy 可被多个 Book 引用 (共享信号, 独立资金)

---

## 因子生命周期状态机

```
INCUBATING → PAPER_TEST → LIVE_ACTIVE → PROBATION → RETIRED
     ↑                          ↓              ↑
     └──────── 重新研发 ────────┘     ←────── 回升
```

### 状态转换门禁 (权威版本)

| 转换 | 条件 |
|---|---|
| INCUBATING → PAPER_TEST | IC > 0.03 + IR > 0.3 + t-stat > 2.0 + Lab 8 步检验通过 |
| PAPER_TEST → LIVE_ACTIVE | 前瞻测试 ≥ 30 个交易日 + IC > 0.03 + IR > 0.3 |
| LIVE_ACTIVE → PROBATION | 滚动 60 日 IC < 0.01 **连续 5 个交易日** |
| PROBATION → RETIRED | PROBATION 状态持续 **20 个交易日** 且无回升 |
| PROBATION → LIVE_ACTIVE | IC 回升 > 0.03 **连续 10 个交易日** |

---

## 数据源

| 数据 | 来源 | 说明 |
|---|---|---|
| 因子生命周期状态 | 自建 DB (PostgreSQL) | 每个因子的状态历史 |
| IC / IR 计算 | scipy `spearmanr` | 截面 Spearman 相关系数 |
| 因子值 | 自建因子库 | 每日收盘后计算 |
| 收益率数据 | AKShare 日线 OHLCV | T+1 日收益率 |

---

## Zoo 管理策略

**Factor Zoo 问题**: 学术界已发现 400+ 因子 (Harvey et al. 2015), 大多数相对已有因子是冗余的。因子数量膨胀带来严重的多重检验风险 — 100 次检验中期望 5 次假阳性。平台需要主动管理因子库规模, 避免 "Zoo 膨胀"。

- **因子去重**: 相关性 > 0.7 的因子标记为"冗余", 保留 IC 更高的版本
- **因子聚类**: 层次聚类 + 相关性矩阵热力图, 识别因子族群
- **多重检验意识**: 当 Zoo 中因子数量 > 50 时, 建议启用更严格的入库门禁 (t-stat > 3.0, Harvey et al. 2015; 详见 Lab tab Verdict Banner)
- **容量分析**: 估算因子在不同资金规模下的 alpha 衰减 (P2 功能)

> **工程备注**: 现有生产组件可作为实现参考 — `polar-ring.tsx` (Canvas 2D), `band-chart/` (D3 + Framer Motion), `leaderboard-table.tsx`, `use-polar-calendar.ts`, `use-band-data.ts`

<!-- card: trend -->

## Polar Calendar 月度因子表现日历

**功能**: 在环形日历中一眼看出因子/策略全年每日表现的分布模式 — 哪些月份稳定盈利, 哪些月份亏损集中, 是否有季节性规律。

- 12 个月环形排列, 每月一个扇区
- 每日一个色块, 颜色编码日收益 (红涨绿跌, 深浅表示幅度)
- 支持策略切换: 下拉选择不同策略
- 支持年份切换: 左右箭头切换年度

---

## Band Chart 日收益分布带

**功能**: 展示多策略日收益的统计分布带 — 中位数/四分位/极值, 让用户判断收益分布的宽度、偏态和异常值频率。

- Q1-Q5 分位收益区间带 (半透明填充)
- 叠加单策略收益线 (hover 或选中时高亮)
- 非线性 Y 轴: 近零区域展开, 极端值压缩 → 日常波动清晰可见

---

## Strategy Ranking 策略排名

**功能**: 缩略排名表, 按综合得分排序, 帮助用户快速定位最优/最差策略。

| 列 | 说明 |
|---|---|
| 排名 | 综合得分排序 |
| 策略名 | 策略名称 |
| 年化收益 | 策略年化收益率 |
| Sharpe | 风险调整收益 |
| MaxDD | 最大回撤 |

<!-- card: trend:expand -->

## 可视化功能详解

### Polar Calendar 交互行为
- **悬浮**: 显示 tooltip — 日期 + 日收益率 + 策略名
- **点击日期**: 跳转到该日的详细持仓记录 (P2 功能)
- **颜色映射**: 连续色阶 (绿 → 白 → 红), 幅度越大颜色越深

### Band Chart 交互行为
- **悬浮**: 显示 tooltip — 日期 + 中位数 + Q1/Q3 范围
- **策略高亮**: hover 策略排名 → Band Chart 上叠加该策略收益线
- **缩放**: X 轴支持框选放大 (D3 brush)

### Strategy Ranking 交互行为
- **点击策略行**: Band Chart 高亮该策略 + Polar Calendar 切换到该策略
- **排序**: 点击列头切换排序字段

---

## 数据源

| 可视化 | 数据 | 来源 |
|---|---|---|
| Polar Calendar | 策略日收益 | 回测引擎 / Paper Test 日志 |
| Band Chart | 多策略日收益分布 | 回测引擎 + 统计聚合 |
| Strategy Ranking | 策略 KPI 指标 | 回测引擎 (QuantStats) |

> **工程备注**: Polar Calendar 使用 Canvas 2D 渲染 (性能优于 SVG); Band Chart 使用 D3 path + Framer Motion 动画; Y 轴使用对称幂变换 `sign(x)·|x|^0.6` 展开近零区域。

<!-- card: activity -->

## 5 区域状态 Mini Cards

每个区域一张 mini card, 展示 1-2 个关键数字 + 状态标签:

| 区域 | 关键数字 | 状态标签 |
|---|---|---|
| Lab | 进行中检验数 | "3 检验中" / "空闲" |
| Monitor | IC 异常因子数 | "2 IC 异常" / "全部正常" |
| Library | 因子总数 · LIVE 数 | "42 因子 · 8 LIVE" |
| Backtest | 最高 Sharpe | "最高 1.85" |
| Mining | 运行/已完成任务数 | "2 运行 · 5 完成" |

**交互**: 点击 mini card → 跳转到对应 tab

---

## 最近活动时间线

按时间倒序展示因子模块的关键事件:
- "价值因子 v3 从 PAPER_TEST → LIVE_ACTIVE" (绿色)
- "动量因子 IC 降至 0.008, 进入 PROBATION" (橙色)
- "波动率因子 v2 开始 INCUBATING" (蓝色)
- "Mining 任务 #12 发现 3 个候选因子" (紫色)
- "市值因子 IR 连续 10 日 > 0.5" (绿色)

展示最近 10 条, 可展开查看更多。

<!-- card: activity:expand -->

## Tier 路线图 — 因子模块功能分期

| Tier | 功能 | 工程量 | 可行性 |
|---|---|---|---|
| **MVP** | Lab 7步检验 + Library CRUD + Monitor IC追踪 + Home看板 | 1-2 个月 | 已验证可行 |
| **P2** | 回测引擎(基础版) + Mining Tier 1(gplearn) + Paper Test自动化 + 因子归因分析 | 2-3 个月 | 需要回测引擎开发 |
| **P3** | 容量分析 + Mining Tier 2/3 + 拖拽构建 + K线标注 + Vintage衰减 | 研究项目 | 需市场冲击研究/Julia环境 |

**核心依赖**: 回测引擎是 P2 的关键路径 — 没有回测就没有策略验证, 也没有 Portfolio/Books 的策略来源。

---

## Dashboard 联动

- Home 因子预警 → Dashboard 风险预检:
  - PROBATION 因子产生的信号在 Dashboard 中标记 "因子观察中" 警告
  - RETIRED 因子的信号自动从 Dashboard 移除
  - 新 LIVE 因子信号标记 "新因子" badge

## 数据刷新频率

| 数据类型 | 刷新频率 | 触发条件 |
|---|---|---|
| 因子状态 | 每日 15:30 | 收盘后自动重算 |
| IC / IR | 每日 15:30 | 收盘后自动重算 |
| Lab 进度 | 实时 | 检验任务完成时推送 |
| Mining 任务 | 实时 | 任务状态变更时推送 |
| 回测结果 | 按需 | 用户触发回测完成后 |
