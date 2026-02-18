---
title: Industry 行业轮动
subtitle: RRG 旋转图 · HMM 市场状态 · 板块动量 · 轮动信号
icon: TrendingUp
layout: two-column
cards:
  - id: rrg
    title: RRG 旋转图
    subtitle: D3 scatter plot · 四象限 · 轨迹拖尾 · JdK 算法
    render: markdown
    flex: 55
    row: 1
    badge: { icon: Compass, label: RRG, color: teal }
    expandTitle: RRG 旋转图 — 可视化规格 & 实现参考
    expandSubtitle: 四象限含义 + 轨迹交互 + D3 实现要点 + 数据管道
  - id: ranking
    title: 轮动排名 & HMM 状态
    subtitle: 四象限分组排名 · 市场 Regime · 行业相关性
    render: markdown
    flex: 45
    row: 1
    badge: { icon: Activity, label: HMM, color: purple }
    expandTitle: 轮动排名 & HMM 状态 — 模型说明 & 板块表现
    expandSubtitle: HMM 模型架构 + 各 Regime 板块表现 + 相关性热力图
  - id: signals
    title: 动量信号 & 联动
    subtitle: 轮动信号 · Regime 条件推荐 · 概念热度 · 跨模块跳转
    render: markdown
    flex: 100
    row: 2
    badge: { icon: Compass, label: 信号, color: blue }
    expandTitle: 动量信号 & 联动 — 算法细节 & 回测框架
    expandSubtitle: RS-Ratio/Momentum 完整算法 + 参数敏感性 + 轮动策略回测
rows:
  - height: 420px
  - height: 260px
links:
  - from: RRG 点击行业
    to: Sector tab
    desc: Treemap 定位到该板块
  - from: 板块资金分析
    to: Capital tab
    desc: 查看该板块资金流向
  - from: Regime 状态
    to: Dashboard
    desc: 策略权重自动调整依据
  - from: 轮动信号个股
    to: Analysis/Overview
    desc: 跳转个股六维透视
  - from: 概念热度
    to: News tab
    desc: 查看概念相关新闻
footer: >-
  三Card布局: RRG旋转图(flex-55) | 轮动排名&HMM(flex-45) | 信号&联动(全宽) ·
  数据源: AKShare 行业指数 + HMM模型 · 更新: 周度 (每周五收盘后)
---

<!-- card: rrg -->

## Relative Rotation Graph (RRG)

**可视化**: D3 scatter plot + 轨迹线 + 象限背景色

**坐标系**:
- X 轴: RS-Ratio (相对强度比率) — 衡量板块 vs 基准的相对强弱
- Y 轴: RS-Momentum (相对强度动量) — 衡量 RS-Ratio 的变化速度
- 原点 (100, 100): 表现等同于基准

---

## 四象限含义

| 象限 | 位置 | 含义 | 颜色 |
|---|---|---|---|
| Leading | 右上 | 强于基准 + 持续加强 | 绿色背景 |
| Weakening | 右下 | 强于基准 + 开始减弱 | 黄色背景 |
| Lagging | 左下 | 弱于基准 + 持续走弱 | 红色背景 |
| Improving | 左上 | 弱于基准 + 开始改善 | 蓝色背景 |

**典型旋转**: 行业沿顺时针方向旋转 (Improving → Leading → Weakening → Lagging → ...)

---

## 轨迹拖尾

- 显示过去 N 周 (默认 8 周) 的旋转路径
- 最新位置: 大圆点 + 行业名称标签
- 历史位置: 逐渐变小的圆点, 透明度递减
- 轨迹线: 连接各周位置的路径

---

## 交互

| 操作 | 行为 |
|---|---|
| Hover 行业点 | 显示: 行业名 + RS-Ratio + RS-Momentum + 周涨跌幅 |
| 点击行业点 | 高亮该行业轨迹 + Card 2 定位到该行业 |
| 基准切换 | 沪深300 (默认) / 中证500 / 中证1000 |
| 周期切换 | 周度 (默认) / 月度 |
| 拖尾长度 | 4周 / 8周 / 12周 |

---

## RS-Ratio 计算 (JdK 算法)

```
1. 相对强度: RS = 行业收盘价 / 基准收盘价
2. RS-Ratio = 100 + (RS 的 N 日 EMA 归一化)
3. RS-Momentum = 100 + (RS-Ratio 的 M 日 ROC 归一化)
默认参数: N=10 周, M=10 周
```

**数据**: 申万一级行业指数 (31个) 周度收盘价
**数据源**: AKShare `index_zh_a_hist()` (申万行业指数代码)

<!-- card: rrg:expand -->

## RRG 实现技术参考

### D3 实现要点

- 坐标系: 线性比例尺, 以 (100, 100) 为中心
- 象限背景: 4 个半透明矩形 rect
- 数据点: circle 元素, 按行业着色
- 轨迹线: path 元素, curveCardinal 插值
- 交互: Voronoi 叠加层处理 hover (避免小圆点难点击)

### 参考实现

- StockCharts RRG (专业版, 收费): 行业标准
- RRG Online (免费): 基础版参考
- Python rrg 库: 算法参考

### 数据管道

```
AKShare (申万行业日线) → Python 计算 RS-Ratio/RS-Momentum → Redis 缓存 → API → 前端 D3
```

计算频率: 每周五收盘后批处理

<!-- card: ranking -->

## Section A: 板块动量排名

按 RRG 四象限分组, 每组按 RS-Momentum 排序:

**Leading** (强且加速)
- 板块名 | RS-Ratio | RS-Momentum | 周涨跌幅
- 投资含义: 当前最强板块, 可持有

**Weakening** (强但减速)
- 投资含义: 仍强但动量衰减, 注意减仓信号

**Improving** (弱但改善)
- 投资含义: **潜在机会**, 关注是否突破进入 Leading

**Lagging** (弱且减速)
- 投资含义: 最弱板块, 回避

**交互**: 点击行 → Card 1 RRG 图高亮对应行业 (双向联动)

---

## Section B: HMM 市场状态

**当前 Regime**: 牛市 / 熊市 / 震荡 / 危机 (4 态)

| 状态 | 特征 | 历史占比 | 适合策略 |
|---|---|---|---|
| 牛市 | 趋势上行, 波动适中 | ~25% | 动量/成长因子 |
| 震荡 | 区间波动, 无明确方向 | ~45% | 价值/均值回归 |
| 熊市 | 趋势下行, 波动加大 | ~20% | 防御/低波动 |
| 危机 | 急跌, 高波动, 流动性枯竭 | ~10% | 现金/对冲 |

**状态转移概率矩阵** (简化展示):
- 当前状态 → 下一期最可能状态 + 概率

---

## Section C: 行业相关性摘要

- Top 3 高相关行业对 (>0.8): 提示分散化不足
- Top 3 低/负相关行业对 (<0.2): 提示对冲机会
- 数据: 20 日滚动相关性矩阵

<!-- card: ranking:expand -->

## HMM 模型说明

### 模型架构
- 隐变量: 4 个市场状态 (Bull/Bear/Sideways/Crisis)
- 观测变量: 日收益率 + 波动率 + 成交量变化率
- 估计方法: Baum-Welch 算法 (EM)
- 库: hmmlearn (Python)

### 训练数据
- 沪深300指数日线, 2005-至今
- 重训频率: 每季度重训一次 (避免前视偏差)

### 各 Regime 下板块历史表现

| Regime | 表现最好板块 | 表现最差板块 |
|---|---|---|
| 牛市 | 非银金融, 计算机, 电子 | 公用事业, 银行 |
| 震荡 | 食品饮料, 医药, 家电 | 有色金属, 钢铁 |
| 熊市 | 公用事业, 银行, 黄金 | 计算机, 传媒, 非银 |
| 危机 | 黄金, 国债 (非股票) | 全板块下跌 |

## 行业相关性热力图

- 完整 31×31 相关性矩阵 (展开模态框中显示)
- 颜色: 红色=高正相关, 蓝色=负相关, 白色=无相关
- 聚类排序: 相似行业相邻排列
- 数据: 60日滚动相关性

<!-- card: signals -->

### 轮动信号

**即将进入 Leading 的板块** (Improving → Leading):
- RS-Momentum 持续上升 + RS-Ratio 即将突破 100
- 信号强度: RS-Momentum 斜率 × 距离 100 线的距离

**均值回归信号**:
- 长期 Lagging 但 RS-Momentum 转正
- 超卖反弹概率: 历史胜率统计

### Regime 条件板块推荐

当前 Regime 下历史表现:
- 最适合板块 Top 3 + 历史超额收益
- 最应回避板块 Top 3 + 历史亏损

### 概念热度变化

近 5 日搜索/讨论热度变化最大:
- 热度暴增: 概念名 + 涨幅 + 讨论量变化
- 热度骤降: 概念名 + 涨幅 + 讨论量变化

<!-- card: signals:expand -->

## RS-Ratio/RS-Momentum 计算细节

### 完整算法步骤

1. 原始相对强度: RS_raw(t) = Close_sector(t) / Close_benchmark(t)
2. RS 移动平均: RS_ma(t) = EMA(RS_raw, period=10)
3. 归一化: RS_norm(t) = (RS_ma(t) / EMA(RS_ma, period=10) - 1) × 100
4. RS-Ratio = 100 + RS_norm
5. RS-Momentum = 100 + (RS-Ratio(t) / EMA(RS-Ratio, period=10) - 1) × 100

### 参数敏感性

| 参数 | 默认 | 范围 | 影响 |
|---|---|---|---|
| RS EMA 周期 | 10周 | 5-20 | 越短越敏感, 信号越多但噪音也多 |
| Momentum EMA | 10周 | 5-20 | 同上 |
| 拖尾长度 | 8周 | 4-16 | 越长显示越完整趋势 |

## 轮动策略回测框架

- 策略: 每周末根据 RRG 象限, 买入 Improving→Leading 板块, 卖出 Weakening→Lagging 板块
- 基准: 等权持有 31 个申万行业
- 回测指标: 年化收益 / 最大回撤 / 夏普比率
- 注意: 板块轮动策略换手率较高, 需考虑交易成本
