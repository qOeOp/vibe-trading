# Factor Detail Panel Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 重构因子详情侧边栏，从 21 个 section 精简为 12 个高信息密度 section。删除冗余 section，增强关键 section，统一设计规范。

**Architecture:** 保持现有 PanelFrame + PanelSection 原语体系，所有 section 标题统一使用 PanelSection title prop。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, CVA, cn(), PanelSection primitives, DivergingBarChart (xycharts), ngx-charts

**关联 Plan:** `docs/plans/2026-03-02-quantile-gauge-design.md`（QuantileGauge 组件，独立执行）

**最终 Section 顺序（优先级排序：决策性 → 监控性 → 维度性 → 验证性）:**

1. Identity Header（含生命周期 stepper + pending 审批通知）
2. Global Selector（sticky: pool tabs + horizon tabs + ⚙ calc config popover）
3. V-Score + Radar（全宽，跟随 global selector 变化）
4. Cross-combo Matrix（4×3 IC grid，仅标全局最优 ★）
5. Predictive Power（IC card with CI + t-stat, ICIR card with 胜率）
6. Risk-Return（Sharpe/MaxDD hero + ARR/Calmar/换手率/容量 sub-metrics）
7. Quantile Cumulative Returns + QuantileGauge（独立 plan）
8. IC Bar + MA Overlay（增强版 #12，吸收 #8 累计 IC）
9. IC Monthly Heatmap（保留）
10. IC Decay Profile（当前 horizon 高亮）
11. IC by Industry（Top 5 + expand + Bottom 3）
12. IC Statistics（直方图 with normal fit + hatching, Rank/Binary Test, KV stats — 不折叠）

---

## Phase 1: 删除冗余 Section（7 项）

清理信息冗余的 section，减少面板长度。每项删除都经过信息覆盖验证。

### Task 1: 删除多空月度展差

**原 Section:** #9 多空月度展差（Long-Short Monthly Spread）
**删除理由:** 与多空净值曲线是积分/差分关系，逐期颗粒感已被增强版 IC bar (#12) 覆盖。
**Files:**
- Delete: `apps/web/src/features/library/components/factor-detail/charts/long-short-spread-section.tsx`（或对应文件名）
- Modify: `apps/web/src/features/library/components/factor-detail/factor-detail-panel.tsx` — 移除 import + JSX

**Step 1:** 在 `factor-detail-panel.tsx` 中找到该 section 的 import 和 JSX 引用，删除
**Step 2:** 删除组件文件
**Step 3:** 运行 `npx nx run web:test` 确认无破坏
**Step 4:** Commit: `refactor(factor-detail): remove LongShortSpreadSection (redundant with IC bar + equity curve)`

### Task 2: 删除多空净值曲线

**原 Section:** #14 多空净值曲线（Long-Short Equity Curve）
**删除理由:** 信息被 #11 分组累计收益（Q1-Q5 五条曲线本身展示了多空差距）+ #6 风险收益（Sharpe/MaxDD 数字）+ QuantileGauge（spread）三重覆盖。A 股不可自由做空，独立展示 long-short portfolio 的实际交易指导意义有限。
**Files:**
- Delete: `apps/web/src/features/library/components/factor-detail/charts/long-short-equity-section.tsx`（或对应文件名）
- Modify: `factor-detail-panel.tsx` — 移除 import + JSX

**Step 1-4:** 同 Task 1 模式
**Commit:** `refactor(factor-detail): remove LongShortEquitySection (covered by cumulative returns + risk metrics)`

### Task 3: 删除 IC QQ Plot

**原 Section:** #17 IC QQ Plot
**删除理由:** 过于学术。JB p-value（在 IC Statistics KV 中）+ IC 直方图（增强版叠正态线 + 斜线填充）已覆盖"IC 是否正态"的问题。
**Files:**
- Delete: `apps/web/src/features/library/components/factor-detail/charts/ic-qq-plot-section.tsx`（或对应文件名）
- Modify: `factor-detail-panel.tsx` — 移除 import + JSX

**Step 1-4:** 同 Task 1 模式
**Commit:** `refactor(factor-detail): remove ICQQPlotSection (JB p-value + histogram sufficient)`

### Task 4: 删除 Rank 自相关 (ACF)

**原 Section:** #19 Rank 自相关
**删除理由:** ACF 的核心信息（排名稳定性→调仓频率）被 IC 衰减剖面 (#15) 从预测力角度覆盖，换手率数字在风险收益 (#6) 中。IC 衰减用的是核心指标 (IC) 本身，语言一致，无需心智转换。
**Files:**
- Delete: `apps/web/src/features/library/components/factor-detail/charts/rank-autocorrelation-section.tsx`（或对应文件名）
- Modify: `factor-detail-panel.tsx` — 移除 import + JSX

**Step 1-4:** 同 Task 1 模式
**Commit:** `refactor(factor-detail): remove RankAutocorrelationSection (covered by IC decay + turnover)`

### Task 5: 删除分位换手率

**原 Section:** #20 分位换手率
**删除理由:** Q1-Q5 各分位组的换手率对交易决策影响小，整体换手率已在风险收益 (#6)。
**Files:**
- Delete: `apps/web/src/features/library/components/factor-detail/charts/quantile-turnover-section.tsx`（或对应文件名）
- Modify: `factor-detail-panel.tsx` — 移除 import + JSX

**Step 1-4:** 同 Task 1 模式
**Commit:** `refactor(factor-detail): remove QuantileTurnoverSection`

### Task 6: 删除 FitnessSection（多池适用性）

**原 Section:** FitnessSection
**删除理由:** 功能被全局 pool tabs (#3) + 跨组合矩阵 (#4) 完全替代。矩阵提供 4 池 × 3 周期的 IC 全貌，交互式切换比静态罗列更好。
**Files:**
- Delete: `apps/web/src/features/library/components/factor-detail/fitness-section.tsx`（或对应文件名）
- Modify: `factor-detail-panel.tsx` — 移除 import + JSX

**Step 1-4:** 同 Task 1 模式
**Commit:** `refactor(factor-detail): remove FitnessSection (replaced by global selector + cross-combo matrix)`

### Task 7: 删除分位收益柱状图（StatisticsSection 内）+ 删除补充统计 Section

**原 Section:** StatisticsSection 内的 QuantileBar 子组件 + 补充统计 Section (#7)
**删除理由:** QuantileBar 被 QuantileGauge 替代（见 `2026-03-02-quantile-gauge-design.md`）。补充统计的指标已分散到各 section（换手率→风险收益，容量→风险收益，其他→预测力 Hero 或 IC Statistics KV）。
**Files:**
- Modify: `apps/web/src/features/library/components/factor-detail/statistics-section.tsx` — 移除 QuantileBar 相关代码（~行 189-230）
- Delete: 补充统计 Section 组件文件（如有独立文件）
- Modify: `factor-detail-panel.tsx` — 移除补充统计的 import + JSX

**Step 1:** 定位 QuantileBar 子组件和它的容器 div（`mt-4 pt-3 border-t` 块）
**Step 2:** 删除 QuantileBar 定义 + 容器 div + 相关 import（BarHorizontal 等）
**Step 3:** 定位并删除补充统计 Section
**Step 4:** 运行 `npx nx run web:test` 确认无破坏
**Step 5:** Commit: `refactor(factor-detail): remove QuantileBar + SupplementaryStats (replaced by QuantileGauge + distributed metrics)`

### Task 8: 删除累计 IC Section

**原 Section:** #8 累计 IC（Cumulative IC）
**删除理由:** 信息被吸收进增强版 IC Bar + MA Overlay (#12)。"因子整体是否持续有效"通过"IC bar 是否持续在零线上方"表达，无需独立曲线。
**Files:**
- Delete: `apps/web/src/features/library/components/factor-detail/charts/ic-cumulative-section.tsx`（或对应文件名）
- Modify: `factor-detail-panel.tsx` — 移除 import + JSX

**Step 1-3:** 同 Task 1 模式
**Commit:** `refactor(factor-detail): remove ICCumulativeSection (absorbed into IC bar + MA overlay)`

---

## Phase 2: 合并与重组（6 项）

### Task 9: Identity Header 简化

**改造:** 移除 TESTING badge（生命周期 stepper 已展示同样信息），移除手动升级/退回按钮（改为系统自动提议 + 用户 approve/reject）。

**设计规格:**
- 保留: factor name (mono font)、category tags、表达式折叠、lifecycle stepper
- 移除: status badge（TESTING）、action-group（升级/退回按钮）
- 新增: 当生命周期有 pending 转换时，stepper 下方显示一行通知条（teal bg），包含转换说明 + approve/reject 按钮
- 生命周期模型: 系统基于量化条件自动提议转换（如 IC 连续 N 期超过阈值 → 提议 TESTING→VALIDATED），用户审批

**Files:**
- Modify: Identity Header 组件
- 可能新增: LifecycleApprovalBar 子组件

**Step 1:** 读取现有 Identity Header 组件
**Step 2:** 移除 badge 和 action buttons
**Step 3:** 添加 lifecycle approval notification（conditional）
**Step 4:** 运行测试
**Step 5:** Commit: `refactor(factor-detail): simplify Identity Header (auto-lifecycle + approval bar)`

### Task 10: 全局选择器（全新 sticky 组件）

**改造:** 新建面板级 sticky 选择器，控制全局上下文（stock pool × horizon × calc config）。所有下游 section 响应选择器变化。

**设计规格:**
- 位置: Identity Header 下方，sticky top: 0, z-index: 10
- Pool tabs: 全A | 沪深300 | 中证500 | 中证1000（segmented control 样式）
- Horizon tabs: 5D | 20D | 60D（同上）
- ⚙ Calc config popover: IC 方法 (RankIC/NormalIC)、去极值 (MAD/3σ/Winsorize)、行业中性化、市值中性化
- 只展示已预计算的配置组合，未计算的 tab 灰色不可点
- 无"触发计算"功能（Library 是只读展示层）

**Files:**
- Create: `apps/web/src/features/library/components/factor-detail/global-selector.tsx`
- Modify: `factor-detail-panel.tsx` — 添加 import + JSX + state 管理

**Step 1:** 创建 GlobalSelector 组件（PanelSection sticky 容器）
**Step 2:** 实现 pool tabs + horizon tabs（segmented control）
**Step 3:** 实现 calc config popover
**Step 4:** 添加灰色不可点逻辑（基于 factor.availableConfigs 数据）
**Step 5:** 在 factor-detail-panel 中集成，state lift 到面板级
**Step 6:** 运行测试
**Step 7:** Commit: `feat(factor-detail): add GlobalSelector (sticky pool/horizon/config selector)`

### Task 11: 跨组合概览矩阵（全新）

**改造:** 4 池 × 3 周期的 IC 矩阵，点击格子切换全局上下文。

**设计规格:**
- Grid: 4 rows (全A/沪深300/中证500/中证1000) × 3 cols (5D/20D/60D)
- 每个格子: 色点（好/中/差）+ IC 值
- 仅全局最优格子标 ★（不高亮行/列最优）
- 当前选中格子高亮（teal outline）
- 点击格子 → 同步更新 GlobalSelector 的 pool + horizon
- 未计算的格子显示 "—" 灰色

**Files:**
- Create: `apps/web/src/features/library/components/factor-detail/cross-combo-matrix.tsx`
- Modify: `factor-detail-panel.tsx` — 添加 import + JSX

**Step 1:** 创建 CrossComboMatrix 组件
**Step 2:** 实现 grid 布局 + IC 色点 + 值
**Step 3:** 实现 click → 全局切换联动
**Step 4:** 实现 ★ global best 标注
**Step 5:** 运行测试
**Step 6:** Commit: `feat(factor-detail): add CrossComboMatrix (4×3 IC overview with global best)`

### Task 12: 预测力 Hero 增强

**改造:** t-stat 放入 IC card（已有），胜率从 IC card 移到 ICIR card，Bootstrap CI 加入 IC card。

**设计规格:**
- IC card:
  - Hero value: IC 均值 + tier badge + percentile
  - Threshold bar
  - Sub-metrics: t-stat, Bootstrap 95% CI [low, high]
  - Mini chart: 90D Rolling IC bar chart
- ICIR card:
  - Hero value: ICIR + tier badge + percentile
  - Threshold bar
  - Sub-metrics: 胜率 (Hit Rate)
  - Mini chart: 90D Rolling ICIR bar chart

**Files:**
- Modify: 预测力 Section 组件（需确认文件名）

**Step 1:** 读取现有预测力组件
**Step 2:** 移动胜率到 ICIR card
**Step 3:** 添加 Bootstrap CI 到 IC card sub-metrics
**Step 4:** 运行测试
**Step 5:** Commit: `feat(factor-detail): rearrange Predictive Power (t-stat+CI in IC, hit rate in ICIR)`

### Task 13: 风险收益增强

**改造:** 保持 2 hero + 4 sub-metrics 布局，增加 Calmar 和换手率。

**设计规格:**
- Hero row (2 cards):
  - Sharpe Ratio: 大数字 + threshold bar + tier
  - MaxDD (Maximum Drawdown): 大数字 + threshold bar + tier
- Sub-metrics grid (2×2):
  - ARR (Annualized Return Rate)
  - Calmar Ratio (ARR / MaxDD)
  - 换手率 (Turnover)
  - 容量 (Capacity)
- 每个 sub-metric: label + value，无 threshold bar

**Files:**
- Modify: 风险收益 Section 组件

**Step 1:** 读取现有风险收益组件
**Step 2:** 添加 Calmar Ratio 和换手率 sub-metric cards
**Step 3:** 验证 2×2 grid 布局
**Step 4:** 运行测试
**Step 5:** Commit: `feat(factor-detail): add Calmar + Turnover to Risk-Return section`

### Task 14: 分行业 IC 改为 Top 5 + expand + Bottom 3

**改造:** 从 scrollable list 改为 Top 5 + expand separator + Bottom 3。

**设计规格:**
- 默认显示: Top 5（IC 最高的 5 个行业，正序）
- 分割线: 水平线 + 左侧展开按钮（"展开 N 项"）
- 默认显示: Bottom 3（IC 最低的 3 个行业，正序）
- 点击展开: 中间行业全部显示
- 不使用内部滚动容器

**Files:**
- Modify: 分行业 IC Section 组件

**Step 1:** 读取现有组件
**Step 2:** 实现 Top 5 / Bottom 3 分组逻辑
**Step 3:** 实现 expand separator 交互
**Step 4:** 移除 max-height + overflow-y 滚动
**Step 5:** 运行测试
**Step 6:** Commit: `feat(factor-detail): IC by Industry top5+expand+bottom3 layout`

---

## Phase 3: 增强现有 Section（2 项）

### Task 15: IC 滚动均线 → IC Bar + MA Overlay

**原 Section:** #12 IC 滚动均线 + #8 累计 IC（已删除，吸收）
**改造:** 将纯 MA 线图增强为 IC 柱状图 + MA 叠加线。每根 bar = 单期 IC 值（原始信号颗粒感），MA 线 = 平滑趋势。共享同一 Y 轴（都是 IC 值域）。

**设计规格:**
- Bar: 半透明填充，IC > 0 用 market-up 色，IC < 0 用 market-down 色
- MA20: mine-accent-teal, 1.2px
- MA60: blue, 1px
- MA120: purple, 1px
- 零线: mine-border 虚线
- 保留现有图例（MA20/MA60/MA120 swatch），bar 不需要图例（颜色语义自明）

**信息增益:** 交易员可以直接看到每一期 IC 值，连续几根 bar 在零线附近 = 因子失效信号。比纯 MA 线更灵敏。

**Files:**
- Modify: 对应的 IC 时间序列 section 组件（需确认文件名）
- 可能需要修改 xycharts 或 ngx-charts 的图表组件以支持 bar + line 混合

**Step 1:** 读取现有 IC 滚动均线组件，理解数据结构和图表类型
**Step 2:** 在图表中添加 bar 层（单期 IC 值），保留 MA 线层
**Step 3:** Bar 颜色按 IC 正负着色（红涨绿跌 A 股惯例：IC > 0 用 market-up）
**Step 4:** 验证 Y 轴刻度正确（bar 和 MA 共享）
**Step 5:** 运行测试
**Step 6:** Commit: `feat(factor-detail): enhance IC rolling MA with IC bar overlay (absorbs cumulative IC)`

### Task 16: IC 直方图增强（正态拟合线 + 偏离填充）

**原 Section:** #16 IC 分布直方图（现移入 IC Statistics section）
**改造:** 叠加正态拟合曲线，超出曲线的 bar 部分用斜线填充（hatching），直观展示偏离正态的区域。

**设计规格:**
- 直方图 bar: 实心填充（与正态曲线重合的部分）
- 偏离区: 斜线填充（超出正态曲线的 bar 部分）——使用 SVG pattern (45° 斜线)
- 正态拟合线: 用数据的 mean + std 计算，mine-muted 色，1px
- 位置: IC Statistics section 内（验证性信息，非决策性信息）

**信息增益:** 一眼看出 IC 分布偏离正态的方向和程度。斜线面积多 = 非正态严重，斜线在右尾 = 右厚尾。替代了 QQ Plot 的功能但更直观。

**Files:**
- Modify: 对应的 IC 直方图组件（需确认文件名）

**Step 1:** 读取现有 IC 直方图组件
**Step 2:** 计算正态拟合参数（mean, std from IC 数据）
**Step 3:** 渲染正态曲线 path
**Step 4:** 实现 SVG hatching pattern，bar 超出曲线的部分用 hatching 填充
**Step 5:** 运行测试
**Step 6:** Commit: `feat(factor-detail): enhance IC histogram with normal fit overlay and deviation hatching`

---

## Phase 4: 合并底部 Section + 排序

### Task 17: 合并 IC Statistics section（不折叠）

**改造:** 合并原 #16 IC 直方图 + #22 IC 统计详情 + #21 鲁棒性检验 为统一的 "IC Statistics" section。不使用折叠（信息放在面板底部本身就是优先级排序，无需额外隐藏）。

**设计规格:**
- Section title: "IC STATISTICS"（PanelSection title prop）
- 内容顺序:
  1. IC Distribution Histogram（增强版，含正态拟合 + hatching）
  2. IC KV Grid（IC Mean/Std/Skew/Kurt/Max/Min, t-stat, p-value, JB-stat, JB p-val）
  3. Robustness Tests（Rank Test + Binary Test + Bootstrap CI）
- 不使用折叠按钮

**Files:**
- Create or modify: IC Statistics Section 组件
- Modify: `factor-detail-panel.tsx` — 重组 section 顺序
- Delete: 原 ICStatsCollapsible、RobustnessSection 独立组件（合并后冗余）

**Step 1:** 创建 ICStatisticsSection 组件（或重构现有）
**Step 2:** 集成增强版直方图 + KV grid + 鲁棒性行
**Step 3:** 在 factor-detail-panel 中替换原 collapsible + robustness 为新 section
**Step 4:** 运行测试
**Step 5:** Commit: `feat(factor-detail): merge IC Statistics section (histogram + KV + robustness, no collapse)`

### Task 18: Section 排序 + V-Score 全宽

**改造:** 按最终顺序重排所有 section，V-Score + Radar 全宽展示。

**设计规格:**
- V-Score + Radar: 移到 Global Selector 下方，移除 max-width 约束，全宽显示
- Section 排序: 按本文档顶部"最终 Section 顺序"排列
- IC 衰减剖面: 当前选中 horizon 对应的 bar 用 mine-accent-teal 高亮

**Files:**
- Modify: `factor-detail-panel.tsx` — 调整 JSX 顺序
- Modify: V-Score/Radar 组件 — 移除宽度约束

**Step 1:** 重排 factor-detail-panel 中的 section JSX 顺序
**Step 2:** V-Score radar 移除 max-width，全宽
**Step 3:** 验证 IC 衰减剖面的 horizon 高亮逻辑
**Step 4:** 运行测试 + 视觉验证
**Step 5:** Commit: `refactor(factor-detail): reorder sections by priority + full-width V-Score`

---

## Phase 5: Section Title 统一

### Task 19: 审查并统一所有 section 标题

**目标:** 所有 factor-detail section 的标题统一使用 PanelSection 的 `title` prop，确保 `panel-label` class 规格一致（9px/500/uppercase/tracking）。消除手写内联标题。

**规则:**
- 所有 section 标题用英文
- 使用 PanelSection `title` prop，不手写 `<span>` / `<div>` 标题
- 保留需要 titleRight 的 section（如图例 swatch）

**英文标题对照表:**

| Section | Title |
|---------|-------|
| V-Score + Radar | OVERVIEW |
| Cross-combo Matrix | CROSS-COMBO OVERVIEW |
| 预测力 | PREDICTIVE POWER |
| 风险收益 | RISK-RETURN |
| 分组累计收益 | QUANTILE CUMULATIVE RETURNS |
| IC Bar + MA | IC ROLLING AVERAGE |
| IC 月度热力图 | IC MONTHLY HEATMAP |
| IC 衰减剖面 | IC DECAY PROFILE |
| 分行业 IC | IC BY INDUSTRY |
| IC Statistics | IC STATISTICS |

**Files:**
- Modify: `factor-detail-panel.tsx` 下所有 section 组件

**Step 1:** 逐个读取每个 section 组件，列出哪些用了 `title` prop、哪些手写了标题
**Step 2:** 统一改为 PanelSection `title` prop + 英文标题
**Step 3:** 运行测试 + 视觉验证
**Step 4:** Commit: `refactor(factor-detail): unify section titles to PanelSection title prop`

---

## 决策追踪表

| # | 原 Section | 决策 | 状态 |
|---|-----------|------|------|
| 1+23 | Identity Header + 状态按钮 | 简化（移除 badge + 按钮，改为 auto-lifecycle + approval bar） | ✅ Task 9 |
| 2 | V-Score + Radar | 全宽，移至 Global Selector 下方 | ✅ Task 18 |
| 3 | 全局选择器 | 新增 sticky 组件（pool + horizon + config popover） | ✅ Task 10 |
| 4 | 跨组合矩阵 | 新增（仅标全局最优 ★，不高亮行列最优） | ✅ Task 11 |
| 5 | 预测力 Hero | 增强（t-stat+CI in IC card, 胜率 in ICIR card） | ✅ Task 12 |
| 6 | 风险收益 | 增强（2 hero + 4 sub-metrics: +Calmar +换手率） | ✅ Task 13 |
| 7 | 补充统计 | 拆散删除（指标分散到各 section） | ✅ Task 7 |
| 8 | 累计 IC | 删除（吸收进 #12 IC bar + MA） | ✅ Task 8 |
| 9 | 多空月度展差 | 删除 | ✅ Task 1 |
| 10+11 | 分位收益 + 分组累计收益 | QuantileGauge 替代 | ✅ 独立 plan |
| 12 | IC 滚动均线 | 增强为 IC bar + MA overlay | ✅ Task 15 |
| 13 | IC 月度热力图 | 保留 | ✅ 无改动 |
| 14 | 多空净值曲线 | 删除（A股不可做空，信息三重覆盖） | ✅ Task 2 |
| 15 | IC 衰减剖面 | 增强（当前 horizon 高亮） | ✅ Task 18 |
| 16 | IC 分布直方图 | 增强（正态线+hatching），移入 IC Statistics | ✅ Task 16+17 |
| 17 | IC QQ Plot | 删除 | ✅ Task 3 |
| 18 | 分行业 IC | 增强（Top 5 + expand + Bottom 3） | ✅ Task 14 |
| 19 | Rank 自相关 | 删除 | ✅ Task 4 |
| 20 | 分位换手率 | 删除 | ✅ Task 5 |
| 21 | 鲁棒性检验 | 合并入 IC Statistics section | ✅ Task 17 |
| 22 | IC 统计详情 | 合并入 IC Statistics section（不折叠） | ✅ Task 17 |
| — | FitnessSection | 删除 | ✅ Task 6 |

---

## 产品架构备忘

**Library 角色:** 只读展示预计算的 Backtest 结果。不触发计算，不写入数据。

**因子生命周期:** Mining → Lab（编辑）→ Backtest（回测）→ Library（展示）

**生命周期转换模型:** 系统基于量化条件自动提议转换（例如 IC 连续 N 期 > 阈值），用户审批（approve/reject）。不支持手动拖拽或下拉选择。

**Global Selector 语义:** 切换的是"查看哪个已有结果"，不是"触发新的计算"。未计算的配置灰色不可选。
