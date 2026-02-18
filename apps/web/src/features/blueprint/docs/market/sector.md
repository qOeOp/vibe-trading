---
title: Sector 板块态势
subtitle: 实时板块可视化 — Treemap | 排名 & 宽度 | 资金 & 联动
icon: TrendingUp
layout: two-column
cards:
  - id: treemap
    title: 板块 Treemap
    subtitle: D3 treemap · water-ripple hover · 3级 drill-down
    render: markdown
    flex: 60
    row: 1
    badge: { icon: Grid3X3, label: Treemap, color: teal }
    expandTitle: 板块 Treemap — 可视化规格 & 实现参考
    expandSubtitle: 已实现交互 + 6项增量功能 + 组件架构 + 数据模型
  - id: ranking
    title: 板块排名 & 市场宽度
    subtitle: HUD 双角色 · idle=排名表 / hover=详情 · 涨跌分布 · 热门概念
    render: markdown
    flex: 40
    row: 1
    badge: { icon: Table2, label: AG Grid, color: purple }
    expandTitle: 板块排名 & 市场宽度 — 联动机制 & 数据源
    expandSubtitle: 双向联动 Treemap + 市场宽度数据源
  - id: capital
    title: 板块资金 & 模块联动
    subtitle: 北向/主力 Top 3 · 动量/均值回归 · 跨模块跳转
    render: markdown
    flex: 100
    row: 2
    badge: { icon: Layers, label: 联动, color: purple }
    expandTitle: 板块资金 & 模块联动 — 完整数据 & 方法论
    expandSubtitle: 完整资金流向表 + 动量计算方法 + 板块-宏观关联
rows:
  - height: 420px
  - height: 280px
links:
  - from: 选中板块 → 操作按钮
    to: Industry tab
    desc: 跳转到该板块的 RRG 旋转图深度分析
  - from: 双击个股 leaf tile
    to: Analysis/Overview
    desc: 个股六维透视
  - from: 北向资金板块偏好
    to: Capital tab
    desc: 跳转完整北向资金流向
  - from: 选中板块 → 因子选股
    to: Screener/Filter
    desc: 以板块为筛选条件打开多因子选股
  - from: 热门概念
    to: News tab
    desc: 按概念标签过滤新闻
footer: >-
  三Card布局: Treemap(flex-3) | 排名&宽度(flex-2) | 资金&联动(全宽) ·
  数据源: AKShare (Tier 1) · 刷新: 30s polling
---

<!-- card: treemap -->

## 已实现交互 (复用 features/market/components/treemap/)

| 交互 | 说明 |
|---|---|
| Water-ripple hover | 小 tile 弹性放大, 周围 tile 梯度压缩 (5级: 15%→40%→70%→100%), 最小 60px |
| 60日 K线 sparkline | Hover 后延迟显示 (小tile 420ms / 大tile 50ms), 白色半透明柱体 |
| 3级 drill-down | 板块 → 行业 → 个股, 面包屑导航 + 数据快照回溯 |
| 实时搜索 | 递归匹配层级节点, 无结果状态提示 |
| 7级色阶 | 跌>5% → 跌2-5% → 跌0.5-2% → 平盘 → 涨0.5-2% → 涨2-5% → 涨>5% |
| 自适应排版 | fontSize 9-28px 面积插值, 竖排(H>W×1.2), 小面积隐藏 value/badge |
| Binance边角 | 仅容器边缘 tile 圆角, 内部 tile 直角 |
| 键盘无障碍 | Enter/Space 触发, aria-label 含名称+涨跌+资金流 |

> 以上交互已在 `HeatMapContainer` + `useTreemap` 中实现, 无需重新开发。

---

## 增量功能 1: 分类体系切换

**当前**: 只有一种固定的 sector→industry→stock 层级

**目标**: 3 套分类体系, 通过 segmented control 切换

| 分类 | 层级结构 | 特点 | 数据源 |
|---|---|---|---|
| 申万一级行业 | 31个行业 → 个股 | 机构标准, 稳定, 用于正式分析 | `stock_board_industry_index_ths()` |
| 概念板块 | **Top 20-30 热点概念** → 个股 | 主题驱动 (AI/华为/固态电池), 波动大, 交易机会多。**注意**: 概念是标签体系(一股多概念), 非树状结构, 必须取 Top N 避免面积重复计算 | `stock_board_concept_index_ths()` |
| 地域板块 | 省份/城市 → 个股 | 区域政策受益分析 (自贸区/大湾区/雄安) | `stock_board_geo_index_ths()` |

**实现方式**: `TreemapPanel` 新增 `classification` prop, 切换时重新构建 `TreemapNode[]` 数据源, `HeatMapContainer` 无需改动

---

## 增量功能 2: 面积维度切换

**当前**: `capitalFlow` (资金净流入) 作为 tile 面积

**目标**: 3 种面积维度, header 区域下拉切换

| 维度 | 含义 | D3 sum 函数 |
|---|---|---|
| 流通市值 (默认) | 市场权重视角 | `d3.hierarchy.sum(d => d.marketCap)` |
| 成交额 | 资金关注度视角 | `d3.hierarchy.sum(d => d.turnover)` |
| 资金净流入 | 资金流动视角 (现有) | `d3.hierarchy.sum(d => Math.abs(d.capitalFlow))` |

**实现**: `useTreemap` 的 `sum` 函数参数化; `TreemapNode` 扩展 `marketCap?`, `turnover?` 字段

**⚠️ 色阶联动**: 面积维度=资金净流入时, 颜色映射必须从涨跌幅切换为**资金流方向**:

| 面积维度 | 色阶映射 | 说明 |
|---|---|---|
| 流通市值 / 成交额 | 涨跌幅 (红涨绿跌) | 默认, 7级色阶不变 |
| 资金净流入 | **资金流方向** (红=流入, 绿=流出, 灰=平) | 避免面积=资金+颜色=涨跌的认知混乱 |

> 认知原理: 如果面积已表达"资金量级", 颜色再映射涨跌幅会造成信息冲突 (大面积绿色=大量资金流入但股价下跌?), 用同维度色阶更直觉

---

## 增量功能 3: 时间维度切换

| 模式 | 数据来源 | 刷新策略 | sparkline |
|---|---|---|---|
| 今日实时 (默认) | AKShare 实时行情 | 30s polling (Tier 1), WebSocket (Tier 2+) | 60日日K |
| 5日 | AKShare 日线 | 静态 (开盘前加载) | 20日日K |
| 20日 | AKShare 日线 | 静态 | 60日日K |

- `changePercent` 在 5日/20日 模式下改为区间涨跌幅
- header 区域 period toggle 切换

---

## 增量功能 4: HUD/Info Panel (取代 tooltip)

**当前**: 只有 sparkline, 无文字 tooltip

**为什么不用 tooltip**: 跟随鼠标的 tooltip 与 water-ripple 弹性扩展冲突 — tile 位置在 hover 时持续变化, tooltip 会抖动/遮挡扩展动画

**方案**: Card 2 (板块排名 & 市场宽度) 充当 **HUD 角色** — 固定位置, 内容随 hover 状态切换

| 状态 | Card 2 显示内容 |
|---|---|
| **Idle** (无 hover) | 默认: 板块排名表 + 市场宽度 + 热门概念 (现有 Section A/B/C) |
| **Hover 板块 tile** | 即时切换: 板块涨跌幅·成交额·换手率 + 领涨/领跌股 Top 3 + 成分数 |
| **Hover 个股 leaf** | 即时切换: 涨跌幅·现价·成交额 + 所属板块列表 + 因子得分(如有) |
| **选中 tile** (单击) | 锁定显示: 同 hover 内容 + 操作按钮 (见增量功能 5) |

**实现**: `HeatMapContainer` hover 事件 → 回调传递 hovered node → Card 2 条件渲染, 无需新增 tooltip 组件

---

## 增量功能 5: 单击选中 + Info Panel 操作 (取代右键菜单)

**当前**: click 只做 drill-down

**为什么不用右键**: Web 端右键菜单不直觉, 与浏览器原生菜单冲突, 且不兼容 Touch 设备

**方案**: 单击=选中 (高亮 tile + Card 2 锁定显示操作按钮), drill-down 交互细节 (单击 vs 双击) 后续实现时决定

| 操作 | 行为 |
|---|---|
| **单击** (任意 tile) | 选中: tile 高亮边框 + Card 2 切换为选中态 (详情 + 操作按钮) |
| **双击** (板块 tile) | drill-down: 进入子层级 (现有行为, 可调整) |
| **双击** (个股 leaf) | 跳转 Analysis/Overview |
| **再次单击** / Esc | 取消选中, Card 2 回到 idle 态 |

**Card 2 选中态操作按钮** (板块级):
- "深度分析" → Industry tab (板块 RRG 旋转图)
- "因子选股" → Screener/Filter (板块为预设条件)
- "查看资金" → Capital tab (北向资金板块偏好)
- "相关新闻" → News tab (按板块标签过滤)

**Card 2 选中态操作按钮** (个股级):
- "个股分析" → Analysis/Overview (六维透视)
- "因子得分" → Analysis/Factors (个股因子视角)

> 单击选中模式的优势: (1) 触屏友好 (2) Card 2 有充足空间展示按钮 (3) 操作可见性 > 右键菜单隐藏性

---

## 增量功能 6: 板块分化度 & 拥挤度

**header 区域**并列显示两个实时指标:

### 指标 A: 板块分化度 `σ = stddev(各板块涨跌幅)`

| σ 范围 | 提示 | 含义 |
|---|---|---|
| > 2.5% | amber "板块轮动活跃" | 适合做板块动量 |
| 0.8% - 2.5% | 正常 | — |
| < 0.8% | "系统性行情" | 看大盘方向, 板块选择意义不大 |

### 指标 B: 板块拥挤度 `拥挤度 = 板块成交额 / 全市场成交额`

- 正常: 单板块占比 ~3-5% (申万31个行业)
- **异常高** (如 5%→15-20%) + **高涨幅** = ⚠️ 短线见顶信号 (资金过度集中)
- 异常高 + 涨幅平/跌 = 分歧放大, 关注方向选择
- **展示**: 拥挤度 Top 3 板块名 + 占比, 异常高时 amber 警示
- **计算**: 实时, 从 `TreemapNode.turnover` 汇总

<!-- card: treemap:expand -->

## 技术实现参考

### 现有组件架构

```
TreemapPanel (数据构建层)
  └→ HeatMapContainer (交互编排层)
       ├── useTreemap() hook → D3 布局 + water-ripple 弹性扩展
       ├── HeatMapTile × N → 自适应渲染 + sparkline
       ├── Breadcrumb → drill-down 导航
       ├── SearchBox → 实时过滤
       └── ColorLegend → 7级色阶图例
```

### 增量功能实现路径

1. **分类体系切换**: 改动 `TreemapPanel` 数据构建层, 新增 3 套 `buildTreemapData()` 函数
2. **面积维度切换**: `useTreemap` 的 D3 hierarchy `sum` 函数参数化, 新增 prop
3. **时间维度切换**: 新增 period state, 影响数据拉取和 `changePercent` 计算
4. **HUD/Info Panel**: 无需新增 tooltip 组件, Card 2 条件渲染 hover/选中 tile 详情, `HeatMapContainer` hover 回调传递 node
5. **单击选中 + 操作按钮**: `HeatMapTile` 新增 `onClick` select handler, Card 2 选中态显示操作按钮
6. **分化度**: 纯计算, 在 `TreemapPanel` 层 `useMemo` 计算 stddev

### 数据模型扩展

```typescript
// TreemapNode 扩展 (types.ts)
interface TreemapNode {
  name: string;
  capitalFlow: number;
  changePercent: number;
  icon?: string;
  children?: TreemapNode[];
  // 新增字段
  marketCap?: number;      // 流通市值 (亿)
  turnover?: number;       // 成交额 (亿)
  turnoverRate?: number;   // 换手率 (%)
  leadingStocks?: string[];  // 领涨股 Top 3
  laggingStocks?: string[];  // 领跌股 Top 3
  stockCount?: number;     // 成分股数量
}
```

### A 股板块分类体系说明

| 分类体系 | 提供方 | 数量 | 特点 |
|---|---|---|---|
| 申万行业 | 申万宏源 | 一级31 + 二级134 + 三级346 | 机构标准, 覆盖全市场, 每年调整一次 |
| 中信行业 | 中信证券 | 一级30 + 二级104 | 与申万类似但分类边界不同 |
| 概念板块 | 同花顺/东财 | 200+ | 主题驱动, 每日新增/淘汰, 个股可属于多概念 |
| 地域板块 | 同花顺/东财 | 31省+重点城市 | 注册地维度, 用于区域政策分析 |

> 平台优先使用申万行业 (机构标准), 概念板块作为主题视角补充

<!-- card: ranking -->

## 双角色: 排名表 (idle) ↔ HUD 详情 (hover/选中)

> Card 2 不仅是排名面板, 也是 Treemap 的 **HUD (Heads-Up Display)** — hover/选中 tile 时即时切换为详情面板, idle 时回到排名表。这样避免了 tooltip 与 water-ripple 动画的冲突。

---

## Idle 态: 板块排名表

**组件**: AG Grid (紧凑模式)

| 列名 | 类型 | 说明 |
|---|---|---|
| 板块名 | string | 申万/概念/地域 (跟随 Card 1 分类切换) |
| 涨跌幅 | percent | 今日涨跌幅, 红涨绿跌 |
| 领涨股 | string | 该板块涨幅最大的个股 |
| 换手率 | percent | 板块整体换手率 |
| 成交额 | number | 板块成交额 (亿) |
| 5日动量 | percent | 近5日累计涨跌幅 |
| 成分数 | number | 板块内个股数量 |

**交互**:
- 点击行 → Treemap 高亮/zoom 到对应板块 (**双向联动**)
- Treemap hover 板块 → 排名表对应行高亮
- 默认按涨跌幅降序, 支持任意列排序
- 数据与 Card 1 同源, 共享分类体系切换状态

---

## Section B: 市场宽度 (涨跌分布)

**展示**:
- 涨/平/跌 家数 + 水平比例条 (红/灰/绿)
- 涨停 / 跌停 数量
- 封板率: 涨停成功封住 / 曾触及涨停

**板块分化度**:
- 计算: `σ = stddev(各板块涨跌幅)`
- 高分化度 (σ > 2.5%) → 板块轮动活跃, 适合做板块动量策略
- 低分化度 (σ < 0.8%) → 系统性行情 (普涨/普跌), 看大盘方向

---

## Section C: 热门概念 Top 3

按涨幅降序, 展示:
- 概念名 + 涨幅 + 成分数
- 点击 → Treemap 切换到概念板块分类并高亮

> 数据源: AKShare `stock_board_concept_index_ths()`

<!-- card: ranking:expand -->

## HUD 双角色实现

### 状态机
```
Card2State = 'idle' | 'hover-sector' | 'hover-stock' | 'selected'
```

- **idle**: 默认显示排名表 + 市场宽度 + 热门概念 (Section A/B/C)
- **hover-sector**: Treemap hover 板块 tile → Card 2 即时切换为板块详情 (涨跌幅·成交额·换手率·领涨/跌 Top3)
- **hover-stock**: Treemap hover 个股 leaf → Card 2 即时切换为个股详情 (涨跌幅·现价·成交额·所属板块·因子得分)
- **selected**: 单击 tile → 锁定显示 + 操作按钮 (深度分析/因子选股/查看资金/相关新闻)
- 过渡: 150ms cross-fade, 避免闪烁

### 双向联动

**Treemap → Card 2**:
- `HeatMapContainer` 的 `onHoverChange(node | null)` 回调 → Card 2 条件渲染
- `onSelectChange(node | null)` 回调 → Card 2 锁定态 + 操作按钮

**Card 2 → Treemap**:
- 排名表点击行 → `HeatMapContainer.focusTile(sectorName)`
- Treemap 定位到该板块 tile 并触发 hover 效果

### 状态共享
- 分类体系切换状态 (`classification`) 由父组件持有
- Card 1 和 Card 2 通过 props 接收, 同步切换

## 市场宽度数据源
- 涨跌家数: AKShare `stock_zh_a_spot_em()` 统计
- 涨跌停: `stock_zt_pool_em()` / `stock_dt_pool_em()`
- 封板率: 涨停池 / (涨停池 + 曾涨停但开板)

<!-- card: capital -->

## 板块资金流向

### 北向资金板块偏好 Top 3
- 今日净买入额排序
- 展示: 板块名 + 净买入额 (亿) + 占北向总流入比例
- 数据源: AKShare `stock_hsgt_board_rank_em()`

### 主力资金板块 Top 3
- 超大单+大单净流入排序
- 展示: 板块名 + 净流入额 (亿)
- 数据源: AKShare `stock_sector_fund_flow_rank()`

> 与 Capital tab 的区别: 此处仅展示 Top 3 摘要, Capital tab 展示完整资金流分析

---

## 板块动量信号

### 5日动量 Top 3
- 近5日累计涨跌幅排序
- 展示: 板块名 + 5日涨幅 + 今日涨幅 (延续性判断)
- 含义: 短期趋势可能延续

### 均值回归信号 Top 3
- 偏离 20日均值最大的板块
- 展示: 板块名 + 偏离度 + 当前涨跌幅
- 含义: 偏离过大时可能反转

> 与 Industry tab 的区别: 此处是简单动量排名, Industry tab 做 RRG/HMM 深度分析

<!-- card: capital:expand -->

## 完整板块资金流向表

上方 Top 3 为摘要视图, 模态框中展示全部板块的资金流向:

| 列名 | 说明 |
|---|---|
| 板块名 | 申万一级 / 概念板块 |
| 北向净买入 | 今日北向资金净买入额 (亿) |
| 主力净流入 | 超大单+大单净流入 (亿) |
| 散户净流入 | 小单+中单净流入 (亿) |
| 资金流向趋势 | 近5日资金流向 sparkline |

---

## 板块动量/均值回归计算方法

**5日动量**: `momentum_5d = (price_today / price_5d_ago - 1) × 100%`

**均值回归偏离度**: `deviation = (price_today - SMA_20) / SMA_20 × 100%`
- 偏离度 > +10% → 强超买, 回归概率高
- 偏离度 < -10% → 强超卖, 反弹概率高

---

## 板块-宏观事件关联参考

| 宏观事件 | 受益板块 | 受损板块 |
|---|---|---|
| 降准/降息 | 银行、地产、非银金融 | 无明显受损 |
| PMI 超预期 | 有色、钢铁、化工 (周期) | 防御板块 (公用事业) |
| 社融超预期 | 银行、地产 | — |
| CPI 高企 | 食品饮料、农业 | 成长股 (估值压缩) |
| 美联储加息 | — | 高估值科技、有色金属 |
| 产业政策 (新能源) | 新能源、锂电、光伏 | — |
| 地缘冲突 | 军工、黄金 | 航空、旅游 |
