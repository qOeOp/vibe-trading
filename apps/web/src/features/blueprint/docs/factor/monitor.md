---
title: Monitor 因子健康看板
subtitle: IC/IR滚动监控 · 预警 & Paper Test · 正交性矩阵 · 条件IC
icon: HeartPulse
layout: rows
cards:
  - id: heatmap
    title: IC/IR 滚动热力图
    subtitle: X=因子 Y=日期 Color=IC值 · 20/60/120日窗口
    render: markdown
    flex: 55
    row: 1
    badge: { icon: BarChart3, label: 周度, color: blue }
    expandTitle: IC/IR 滚动热力图 — 完整文档
    expandSubtitle: 热力图实现方案 · 数据管道 · 交互规格
  - id: alerts
    title: 预警 & Paper Test
    subtitle: IC下滑预警 · Paper Test 追踪 · 因子Zoo统计
    render: markdown
    flex: 45
    row: 1
    badge: { icon: AlertTriangle, label: 预警, color: yellow }
    expandTitle: 预警 & Paper Test — 完整文档
    expandSubtitle: PROBATION 判定规则 · Paper Test 操作细节 · 自动毕业/淘汰
  - id: orthogonal
    title: 正交性矩阵 & 条件IC
    subtitle: 正交性矩阵 · 条件IC三维切面 · Vintage衰减
    render: markdown
    flex: 100
    row: 2
    badge: { icon: Grid3X3, label: 相关性, color: purple }
    expandTitle: 正交性矩阵 & 条件IC — 完整文档
    expandSubtitle: 条件IC分析 (Regime/市值/行业) · Vintage衰减追踪 · 跨模块联动
rows:
  - height: 620px
  - height: 280px
links:
  - from: IC预警因子
    to: Library tab
    desc: 管理因子状态 (降权/退役)
  - from: 正交性参照
    to: Lab tab
    desc: 新因子检验时参照已有因子
  - from: 条件IC环境
    to: Market/Industry
    desc: 关联市场环境分析
  - from: 容量预警
    to: Portfolio/Books
    desc: 调整策略 AUM 分配
  - from: Regime状态
    to: Risk/Regime
    desc: 查看完整HMM状态检测 — 转移概率矩阵 · 历史状态序列
footer: >-
  三Card布局: IC/IR热力图(flex-55) | 预警&Paper Test(flex-45) | 正交性&条件IC(全宽) ·
  数据源: scipy + numpy + hmmlearn · 更新频率: 每日收盘后批量计算
---

> **边界**: Monitor 回答 "上线后的因子还健不健康?" — 持续追踪 LIVE 因子的 IC/IR, 管理 Paper Test 流程, 检测因子间的冗余关系。
> 新因子的构建和检验是 Lab 的职责; 因子的管理和版本维护是 Library 的职责。

<!-- card: heatmap -->

## 热力图设计

**布局**: X轴=因子名, Y轴=日期(近60日), 颜色=IC值

| IC 范围 | 颜色 | 状态 |
|---|---|---|
| > 0.05 | 深绿 | 强 |
| 0.03 — 0.05 | 浅绿 | 良 |
| 0.01 — 0.03 | 黄色 | 弱 |
| < 0.01 | 红色 | 危险 |

---

## 滚动窗口

3 档切换按钮: **20日** | **60日** (默认) | **120日**

- IC 计算: Spearman rank correlation (因子值 vs T+1 收益率)
- IR 指标: IC均值 / IC标准差, 显示在因子名旁

---

## 交互行为

- **排序**: 默认按平均 IC 降序排列因子 (左→右), 可切换为按分类聚类排列
- **趋势检测**: 连续 N 天 IC 下降 → 自动标注下降趋势线
- **因子详情**: 点击因子列 → 右侧弹出单因子 IC 时序折线 mini chart (20/60/120 日叠加)
- **缩放**: 支持区域框选放大 (D3 brush), 查看密集区域细节
- **导出**: "导出 IC 矩阵" 按钮 → CSV (日期 × 因子 的 IC 值矩阵)
- **tooltip**: 悬浮显示 因子名 + 日期 + IC 值 + IR 值 + 状态标签

<!-- card: heatmap:expand -->

## 热力图实现方案

### 方案 A: ngx-charts heat-map (推荐 MVP)
- 复用已有 `lib/ngx-charts/heat-map/` 组件
- 扩展 color scale 为 diverging (green → yellow → red)
- X 轴: 因子名 (scalePoint), Y 轴: 日期 (scalePoint, 倒序)

### 方案 B: D3 直接绑定 (P2 升级)
- 更灵活, 支持 dendrogram 侧边栏 (因子聚类树)
- 支持框选缩放 (D3 brush)
- 需要自建 tooltip + 交互

---

## 因子预计算 (每日自动)

Monitor 能工作的前提是: **所有 LIVE_ACTIVE + PAPER_TEST 因子的最新因子值在每日收盘后自动更新。**

```
每日 15:30 收盘后 → 因子预计算 Pipeline:
  1. 拉取当日全市场收盘数据 (AKShare)
  2. 对每个 LIVE_ACTIVE + PAPER_TEST 因子, 增量计算当日因子值
  3. 因子值存入因子库 (Redis / DB)
  4. 如果计算失败 (数据缺失/公式异常) → 触发 Home health banner 告警
  5. 预计算完成后触发 IC 监控 Pipeline (见下方)
```

**计算失败处理**: 单因子计算失败不阻塞其他因子; 连续 3 日失败 → 该因子标记 "数据异常" + 推送预警

---

## IC 监控数据管道

```
预计算完成后 (约 16:00):
  1. 拉取全市场日线收益率 (AKShare stock_zh_a_hist)
  2. 读取因子值快照 (Redis / DB)
  3. 批量计算 spearmanr(factor, returns_t1) → IC
  4. 滚动窗口聚合 (20/60/120日) → IC 矩阵
  5. 写入 Redis 缓存 → 前端拉取
```

<!-- card: alerts -->

## Section A: IC 下滑预警

**触发条件**: 滚动 60 日 IC 跌破 0.01 → 进入 PROBATION (参见 Home tab 概念索引 — 状态转换门禁)

| 列名 | 类型 | 说明 |
|---|---|---|
| 因子名 | string | 因子标识 |
| 当前 IC | number | 最近一期 IC 值 |
| 60日前 IC | number | 60 个交易日前的 IC |
| 衰减速率 | percent | (当前IC - 60日前IC) / 60日前IC |
| **覆盖率** | percent | 有效因子值的股票占比 (MVP 新增) |
| 建议 | action | 降权 / 观察 / 退役 |

**覆盖率预警规则** (MVP 新增):
- 触发条件: LIVE 因子的覆盖率**连续 3 个交易日** < 90%
- 预警展示: 覆盖率列变红 + tooltip "覆盖率连续 N 日低于 90%, 可能存在数据源异常或公式在特定市场状态下失效"
- 操作: "检查数据源" | "暂停信号" → 跳转 Library 或数据管理页面
- 原因: 覆盖率骤降通常意味着数据源异常 (AKShare/BaoStock 接口变更)、财报季数据空窗、或因子公式中某些字段在特定市场状态下大量缺失

**操作按钮**: "降权" | "观察" | "退役" → 跳转 Library tab 执行

---

## Section B: Paper Test 追踪

**Paper Test 仪表盘**: 展示所有正在 Paper Test 的因子, 每个因子一行:

| 列名 | 说明 |
|---|---|
| 因子名 | 因子标识 + 版本 |
| 启动日期 | Paper Test 开始日 |
| 已观察天数 | 自启动以来的交易日数 |
| 当前 IC | 累积 IC (Paper Test 期间) |
| 当前 IR | 累积 IR |
| 毕业进度 | IC ✅/❌ · IR ✅/❌ (距毕业还差哪些条件) |
| 状态 | 进行中 / 待审核 / 已延期 |

**交互**: 点击因子行 → 展开 IC 累积曲线 (从 Paper Test 启动日开始)

### Paper Test 操作规格

- **选股规则**: 每日按因子排名取 **Top 50** (做多组) + **Bottom 50** (做空组)
  - 组大小可在 Paper Test 配置中调整 (默认 50)
- **权重方式**: 等权 (MVP) — P2 可选 IC 加权
- **记录格式**: 每日 { date, factor_id, top_codes[], bottom_codes[], predicted_ic }
- **收益计算**: T+1 日收盘价变动, 多空组合收益 = 做多组均值 − 做空组均值
- **分宇宙**: 默认 A 股全市场 (排除 ST/停牌), 可配置为沪深300/中证500/中证1000 成分股

---

## Section C: 因子 Zoo 统计概要

按 9 大类别分组 (与 Home tab 概念索引一致):

| 类别 | 说明 |
|---|---|
| 动能 | 动量 (1M/3M/12M) · 反转 · 技术指标 (RSI/MACD) |
| 股息率 | 现金股息率 · 股息增长率 · 股息持续性 |
| 价值 | PE/PB/EV-EBITDA/PCF |
| 成长 | 营收/利润增速 · ROE 变化 · 分析师上调 |
| 品质 | ROE/ROA/毛利率/应计 · 盈利稳定性 |
| 流动性 | Amihud/换手率/bid-ask |
| 波动度 | 已实现波动率/GARCH/特质波动/下行波动 |
| 规模 | 总市值/流通市值/自由流通 |
| 情绪 | FinBERT/FinGPT 舆情得分 · 社媒热度 |

每类统计: LIVE 数 / 总数 / 平均 IC / 最佳因子

**周变化**: 新增 / 退役 / 状态变更数量

<!-- card: alerts:expand -->

## Paper Test 自动化规则

所有自动动作需**人工确认** (弹窗确认, 不是全自动执行):

### 自动毕业建议
- 条件: 观察期 ≥ **30 个交易日** + IC > 0.03 + IR > 0.3
- 弹出确认: "因子 [name] 满足毕业条件, 是否升级为 LIVE_ACTIVE?"
- 确认后: 状态 PAPER_TEST → LIVE_ACTIVE, 开始产生交易信号

### 自动淘汰建议
- 条件: 观察期内 IC < 0.01 **连续 10 个交易日**
- 弹出确认: "因子 [name] 观察期 IC 持续不达标, 是否标记为 RETIRED?"
- 确认后: 状态 PAPER_TEST → RETIRED, 标注原因 "Paper Test 未通过"

### 自动延期
- 条件: IC 在 0.02-0.03 区间 (边缘值)
- 动作: 自动延长观察期至 **60 个交易日**
- 通知: 推送 "因子 [name] IC 边缘, 观察期延长至 60 日"

---

## 因子衰减的结构性原因

因子不是永恒的。理解因子为什么会衰减, 才能正确使用 PROBATION 预警:

| 衰减原因 | 机制 | 时间尺度 |
|---|---|---|
| **因子拥挤 (Crowding)** | 越多人使用 → alpha 被套利掉 | 数月~数年 |
| **市场结构变化 (Regime Shift)** | 牛市有效的因子熊市未必有效 | 数周~数月 |
| **数据过拟合 (Overfitting)** | 样本内有效但样本外失效 | 上线后立即暴露 |
| **制度变化 (Regulatory)** | A 股政策变化改变市场微观结构 (如注册制、北交所) | 不可预测 |

这些原因意味着: **PROBATION 预警不是系统故障, 而是因子生命周期的正常现象。** 预警的价值在于帮用户及时发现并应对, 而不是消除衰减本身。

---

## PROBATION 判定规则

阈值来源: Home tab 概念索引 — 状态转换门禁 (权威版本)

### 进入 PROBATION
- 条件: 滚动 60 日 IC < 0.01 **连续 5 个交易日**
- 动作: 因子状态从 LIVE_ACTIVE → PROBATION
- 通知: 推送预警到 Dashboard + Home 预警 Banner

### 退役判定
- 条件: PROBATION 超过 **20 个交易日** 且无回升迹象 (IC 趋势仍为下降)
- 回升定义: IC 回到 0.03 以上 **连续 10 个交易日** → 恢复 LIVE_ACTIVE
- 手动退役: 用户可在 Library tab 主动退役因子 (不受自动规则约束)

### 退役后处理
- 停止信号产生 (不再参与多因子打分)
- 保留历史数据 (回测/归因仍可查)
- 标记退役原因 (IC 衰减 / 容量不足 / 手动退役)

---

## Paper Test vs Backtest 对比

| | Backtest | Paper Test |
|---|---|---|
| 数据 | 历史数据 (样本内/外) | 真实每日新数据 |
| 时间 | 回溯 N 年, 秒级完成 | 真实运行 1-3 个月 |
| 风险 | 过拟合风险高 | 过拟合风险低 (前瞻验证) |
| 目的 | 快速筛选 | 最终确认 |
| 位置 | Factor/Backtest tab | Factor/Monitor tab |

### Paper Test 异常警报

- IC 连续 5 日为负 → amber 预警
- 预测排名与实际收益反向 (IC < -0.02) → red 预警
- 因子值出现大量 NaN (数据源异常) → 暂停 Paper Test

### 数据完整性检查

每日自动检查:
- 因子值覆盖率 > 95% (允许停牌/涨跌停导致的缺失)
- 无全零/全相同值 (公式 bug 检测)
- 因子值分布未突变 (KS 检验 vs 前 20 日分布)

---

## 容量估算方法 (P2 功能)

```
factor_capacity = sum(avg_daily_volume_i * capture_rate) * avg_holding_period
```

- `avg_daily_volume_i`: 因子持仓标的的平均日成交量
- `capture_rate`: 假设可捕获流动性的 1-5% (保守取 2%)
- `avg_holding_period`: 平均持仓天数 (由换手率反推)
- **Tier 标注**: P2 功能, MVP 阶段不实现容量估算

<!-- card: orthogonal -->

## LIVE 因子相关性热力图

- Pearson / Spearman 双检验 (切换按钮)
- 色阶: 蓝(负相关) → 白(无相关) → 红(正相关)
- 对角线: 自相关=1 (灰色)

## 层次聚类

- 方法: Ward 距离 + 层次聚类
- 相关性 > 0.7 的因子归为同族
- 侧边 dendrogram 可视化聚类树

## 冗余检测

- 高相关因子对高亮 (amber 边框)
- 自动建议: "因子 A 与因子 B 相关性 0.85, 建议合并或保留 IC 更高者"

---

### 当前 Regime 状态

> 📡 来源: Risk/Regime 模块 HMM 检测

| 指标 | 值 |
|---|---|
| 当前状态 | 震荡 (概率 78%) |
| 次可能状态 | 牛市 (概率 15%) |
| 状态持续天数 | 23 天 |
| 转移概率 | 震荡→牛市 12% · 震荡→熊市 8% |

*数据由 Risk/Regime 的 HMM 模型实时推送, 帮助判断条件 IC 的适用环境*

---

### 条件 IC (三维切面)

**按 Regime**: 牛市/熊市/震荡/危机 下因子 IC 差异
- 动量因子: 牛市强, 熊市弱
- **当前环境解读**: 根据上方 Regime 状态, 高亮当前环境对应的 IC 列

**按市值**: 大盘/中盘/小盘 因子效率
- 小盘: 情绪/动量因子更有效

**按行业**: 申万一级 31 行业 IC 热力图
- 高亮行业-因子最优组合

<!-- card: orthogonal:expand -->

## 条件 IC 分析详解

条件 IC 回答: "因子在特定环境下表现如何?" — 同一因子在牛市/熊市、大盘/小盘、不同行业中 IC 可能差异巨大。

### 按 Regime (HMM 4态)

| 市场状态 | 说明 | 典型因子表现 |
|---|---|---|
| 牛市 | 趋势上行, 低波动 | 动量因子强, 价值因子弱 |
| 熊市 | 趋势下行, 高波动 | 价值因子强, 动量因子弱 |
| 震荡 | 无方向, 中等波动 | 均值回归类因子有效 |
| 危机 | 急跌, 极高波动 | 所有因子失效, 相关性趋1 |

- **可视化**: 分组柱状图 (X=因子, Y=IC, 颜色=Regime)
- **数据**: hmmlearn 训练 4 态 HMM, 基于沪深300指数收益率序列

### 按市值区间

| 市值区间 | 定义 | 说明 |
|---|---|---|
| 大盘 | 沪深300成分 | 机构定价, 因子效率高 |
| 中盘 | 中证500成分 | 混合定价 |
| 小盘 | 其余 | 散户主导, 动量/情绪因子更强 |

- **可视化**: 热力图 (X=因子, Y=市值区间, 颜色=IC)

### 按行业 (申万一级 31个)

- 热力图: X=因子, Y=行业, 颜色=IC
- 高亮行业-因子最优组合 (IC > 0.05)
- 用途: 行业中性化处理参考

---

## Regime 数据合同

Risk/Regime 模块向 Monitor 推送的数据格式:

```
{
  currentState: "bull" | "bear" | "sideways" | "crisis",
  probability: number,        // 当前状态概率 (0-1)
  duration: number,           // 状态持续天数
  transitions: {              // 转移概率
    bull: number,
    bear: number,
    sideways: number,
    crisis: number
  },
  lastUpdated: string         // ISO date
}
```

- **推送频率**: 每日收盘后
- **来源**: Risk/Regime tab 的 HMM 模型 (hmmlearn)
- **降级策略**: Risk 模块不可用时, 条件 IC 的 Regime 维度降级为 "数据不可用", 其他维度正常运行

---

## 因子 Vintage 衰减追踪 (P2 功能)

**问题**: 因子是否在系统性过期? 2020 年发现的因子 vs 2024 年发现的因子, 衰减速度是否不同?

### Vintage 分析视图
- 按因子创建年份分组, 展示各 vintage 因子的平均 IC 衰减曲线
- X 轴: 因子存活月数 (创建后 1/3/6/12/24 个月)
- Y 轴: 平均 IC
- 多条线: 每个 vintage 年份一条 (如 2023、2024、2025)

### 衰减速率指标
- 3 个月 IC 中位数变化率
- 6 个月 IC 中位数变化率
- 12 个月 IC 中位数变化率

### 系统性衰减警报 (提升至 MVP)

> **决策变更**: 原为 P2 功能, 现提升至 MVP。理由: 系统性衰减是因子策略最危险的风险之一 — 单因子预警只能发现个别因子问题, 而系统性衰减意味着整个因子池的底层逻辑可能失效 (市场结构变化、政策冲击等)。此功能实现成本低 (仅需中位数计算 + 阈值比较), 风险收益比极高。

**触发条件**: 所有 LIVE 因子的中位 IC 60 日滚动值 < 历史均值的 70%
**展示**: Monitor 页面顶部红色 banner — "⚠️ 系统性因子衰减 — 市场环境可能发生结构性变化, 建议检查因子池整体预测力"
**级别**: 🔴 严重 (同时推送到 Home 预警 Banner + Dashboard)
**消除条件**: 中位 IC 回升到历史均值的 85% 以上连续 5 个交易日

### Tier 标注 (Vintage 衰减)
- Vintage 衰减追踪仍为 P2 功能 — 需要因子库积累 6 个月以上数据才有意义
- 系统性衰减警报已提升至 MVP (见上)

---

## 因子轮动评估 (P2 功能)

**问题**: PROBATION 是被动等因子衰减到阈值才预警。但因子的相对排名可能早已大幅下降 — 一个 IC 从 0.06 降到 0.04 的因子仍然 "健康", 但在因子池中可能已从 Top 3 降到 Top 15。

**机制**: 系统每月自动对所有 LIVE_ACTIVE 因子重跑滚动 IC/IR 计算, 与初始检验结果 (入库时的 IC/IR) 和上月结果对比:

| 指标 | 评估内容 |
|---|---|
| IC 排名变化 | 因子在 Zoo 中的 IC 排名是否显著下降 |
| IR 排名变化 | 因子稳定性排名是否下降 |
| 绝对 IC 变化 | 与入库时 IC 的百分比变化 |

**预警规则**:
- IC 排名下降超过 50% (如从 Top 5 降到 Top 10 以下) → amber 预警
- 绝对 IC 较入库时下降 >40% → amber 预警 (即使仍高于 PROBATION 阈值)

**价值**: 从"被动等因子死亡"升级为"主动发现因子相对竞争力变化", 帮助用户提前调整因子权重
