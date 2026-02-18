---
title: Sentiment 情绪因子
subtitle: FinBERT/FinGPT · 情绪热力图 · 舆情异动 · 因子检验
icon: Brain
layout: two-column
cards:
  - id: engine
    title: 情绪因子引擎
    subtitle: FinBERT-CN / FinGPT pipeline · 情绪评分 · IC/IR 检验 · 分组回测
    render: markdown
    flex: 55
    row: 1
    badge: { icon: Brain, label: NLP, color: teal }
    expandTitle: 情绪因子引擎 — 模型对比 & 入库流程
    expandSubtitle: FinBERT-CN vs FinGPT vs GPT-4o + 文本预处理 + 因子入库
  - id: heatmap
    title: 情绪热力图 & 异动
    subtitle: 行业×日期矩阵 · 舆情异动 Top 5 · 个股情绪时序
    render: markdown
    flex: 45
    row: 1
    badge: { icon: BarChart3, label: 热力图, color: purple }
    expandTitle: 情绪热力图 & 异动 — 实现 & 算法
    expandSubtitle: D3 heat-map 方案 + 异动检测算法 + 情绪-价格相关性
  - id: tech
    title: 技术方案 & 联动
    subtitle: Kafka pipeline · 六维共振第 3 维 · 跨模块跳转
    render: markdown
    flex: 100
    row: 2
    badge: { icon: Activity, label: Pipeline, color: blue }
    expandTitle: 技术方案 & 联动 — 选型决策 & 回测框架
    expandSubtitle: 模型选型决策树 + 数据隐私 + 回测框架 + News 数据共享
rows:
  - height: 420px
  - height: 260px
links:
  - from: 情绪因子入库
    to: Factor/Library
    desc: 情绪因子进入因子库, 参与多因子组合
  - from: 舆情异动标的
    to: News tab
    desc: 查看原始新闻/社媒文本
  - from: 行业情绪热力图
    to: Sector tab
    desc: Treemap 定位到高/低情绪板块
  - from: 个股情绪评分
    to: Analysis/Factors
    desc: 查看个股完整因子得分
  - from: 情绪极值
    to: Screener
    desc: 按情绪评分筛选标的
footer: >-
  三Card布局: 情绪引擎(flex-55) | 热力图&异动(flex-45) | 技术方案&联动(全宽) ·
  模型: FinBERT-CN (Tier 1) · 更新: 新闻实时 / 社媒小时级 / 因子入库日级
---

<!-- card: engine -->

## Pipeline 架构

```
数据源 (新闻/公告/社媒)
  → 文本预处理 (分词/清洗/截断)
  → FinBERT-CN / FinGPT (情绪分类)
  → 情绪评分 (-1 ~ +1) + 置信度
  → 截面标准化 (z-score)
  → 因子入库 (Factor Library)
```

---

## 输入数据源

| 来源 | 数据类型 | 更新频率 | 权重 |
|---|---|---|---|
| 财经新闻 | 标题 + 摘要 | 实时 | 高 |
| 上市公司公告 | 公告全文 | 日级 | 高 |
| 研报摘要 | 核心观点 | 日级 | 中 |
| 雪球评论 | 用户讨论 | 小时级 | 低 |
| 东财评论 | 股吧帖子 | 小时级 | 低 |
| 微博财经 | 大V观点 | 小时级 | 低 |

---

## 模型输出

| 字段 | 类型 | 说明 |
|---|---|---|
| stock_code | string | 关联个股代码 |
| sentiment_score | float | -1 (极度看空) ~ +1 (极度看多) |
| confidence | float | 0 ~ 1, 模型置信度 |
| source_count | int | 基于多少条文本评估 |
| dominant_source | string | 主要信号来源 (新闻/社媒/公告) |

---

## 因子检验标准

| 检验项 | 指标 | 通过阈值 | 说明 |
|---|---|---|---|
| 预测力 | IC (rank) | > 0.03 | 情绪评分 vs T+1 收益率 |
| 稳定性 | IR | > 0.3 | IC 均值 / IC 标准差 |
| 时效性 | IC 衰减 | T+3 仍显著 | 观察 T+1/T+3/T+5 衰减 |
| 独立性 | 与动量相关性 | < 0.3 | 确保不与动量因子重复 |
| 独立性 | 与价值相关性 | < 0.3 | 确保不与价值因子重复 |

---

## 情绪-收益回测

- 方法: 每日按情绪评分排序, 等分 5 组 (Q1-Q5)
- Q1 = 最看空, Q5 = 最看多
- 展示: Q1-Q5 累计收益曲线 + 多空组合 (Q5-Q1) 收益
- 关注: Q5-Q1 spread 是否持续为正

<!-- card: engine:expand -->

## 模型详细对比

### FinBERT-CN (Tier 1 推荐)

- 基础模型: BERT-base-chinese
- 微调数据: 中文金融文本情感标注数据 (~10万条)
- 推理速度: ~500 条/秒 (单卡 GPU)
- 资源需求: 8GB GPU 内存
- 优点: 推理快, 专为中文金融场景优化
- 缺点: 微调数据有限, 对新概念理解不足

### FinGPT (Tier 2)

- 基础模型: LLaMA-7B / ChatGLM-6B
- 微调方式: LoRA (低秩适配), 训练成本低
- 推理速度: ~50 条/秒 (单卡 GPU)
- 资源需求: 16GB GPU 内存
- 优点: 更灵活, 可理解复杂语境
- 缺点: 推理慢, 部署成本高

### GPT-4o API (Tier 3)

- 零微调, 通过 prompt 工程实现
- 推理速度: 受 API 限流 (~10 条/秒)
- 成本: ~$0.01 / 条
- 优点: 最强理解能力, 零部署
- 缺点: 成本高, 延迟大, 数据隐私

## 文本预处理 Pipeline

1. 分词: jieba / pkuseg (中文分词)
2. 清洗: 去除 HTML 标签、特殊字符、广告文本
3. 截断: 超过 512 tokens 截断 (BERT 限制)
4. 去重: 相似新闻合并 (SimHash 去重)
5. 关联: NER 提取个股代码/名称 → 关联到具体标的

## 因子入库流程

```
情绪评分 (个股×日) → 截面标准化 (z-score) → 写入 Factor Library
```

- 截面标准化: 每日对所有个股的情绪评分做 z-score 变换
- 入库频率: 每日收盘后批处理
- 与其他因子合并: 在 Factor/Library 中与动量/价值/质量等因子并列

<!-- card: heatmap -->

## 行业情绪热力图

**可视化**: 矩阵热力图 (类似 GitHub contribution graph)

- X 轴: 申万一级行业 (31 个)
- Y 轴: 日期 (近 20 个交易日)
- 颜色: 红色=看多 (+1), 蓝色=看空 (-1), 白色=中性 (0)

**交互**:
- Hover 单元格: 显示行业名 + 日期 + 情绪评分 + 评估文本条数
- 点击行业列: 展示该行业情绪时序详情
- 点击日期行: 展示该日全市场情绪分布

---

## 舆情异动预警 Top 5

**检测维度**:

| 维度 | 计算方法 | 阈值 |
|---|---|---|
| 情绪突变 | 日情绪评分变化 > 2σ (20日标准差) | 绝对值 > 0.3 |
| 讨论量暴增 | 今日讨论量 / 20日均值 | > 3 倍 |
| 多空反转 | 情绪评分符号变化 (正→负 / 负→正) | 持续 2 日以上 |

**展示**: 表格列表
- 标的 (个股/板块) + 异动类型 + 情绪变化值 + 来源数 + 代表性文本

**实时性**: 小时级更新 (社媒数据) / 日级 (新闻/公告)

---

## 个股情绪时序 (选中时)

选中特定个股后展示:
- 30 日情绪评分折线 (红=看多, 蓝=看空)
- 叠加: 股价走势折线 (右 Y 轴)
- 情绪拐点标注: 从负转正 / 从正转负
- 关联文本: 情绪极值时的代表性新闻/评论

> 个股选择方式: 输入框搜索 或 从异动列表点击

<!-- card: heatmap:expand -->

## 情绪热力图实现

### 可视化方案
- D3 heat-map (已有 ngx-charts/heat-map 组件)
- 颜色映射: d3.interpolateRdBu (diverging, 红蓝双色)
- 缺失数据: 灰色 (#e0e0e0) 标注

### 数据聚合
- 个股级情绪评分 → 按申万行业平均 → 行业级日均情绪
- 加权方式: 按信息源数量加权 (多条文本覆盖的个股权重更高)

## 异动检测算法

```python
# 情绪突变检测
rolling_mean = sentiment.rolling(20).mean()
rolling_std = sentiment.rolling(20).std()
z_score = (sentiment_today - rolling_mean) / rolling_std
is_anomaly = abs(z_score) > 2.0

# 讨论量暴增检测
volume_ratio = discussion_count_today / discussion_count.rolling(20).mean()
is_volume_spike = volume_ratio > 3.0
```

## 情绪-价格相关性分析

- 滞后相关性: 情绪(T) vs 收益(T+1/T+3/T+5) 的相关系数
- Granger 因果检验: 情绪是否 Granger-cause 收益
- 典型发现: 社媒情绪对小盘股预测力更强 (信息不对称大)

<!-- card: tech -->

### 部署架构

```
数据采集 (爬虫/API)
  → Kafka: raw.news / raw.social
  → Python 批处理 (FastAPI + FinBERT-CN)
  → Kafka: sentiment.scores
  → Redis 缓存 (最新评分)
  → API → 前端展示
```

处理频率:
- 新闻/公告: 实时处理 (Kafka 消费者)
- 社媒: 每小时批处理
- 因子入库: 每日收盘后

### 六维共振定位

情绪因子是 **六维共振模型** 的第 3 维度:

| # | 维度 | 情绪因子的角色 |
|---|---|---|
| 1 | 量化因子 | — |
| 2 | 价格行为 | — |
| **3** | **情绪** | **本 tab 输出: FinBERT/FinGPT 情绪评分** |
| 4 | 聪明钱 | — |
| 5 | 事件催化 | — |
| 6 | 市场环境 | — |

> LLM 不修改量化信号 (双轨平行架构): 情绪因子独立产出, 经 IC/正交检验后入库, 与其他因子等权参与组合

<!-- card: tech:expand -->

## 模型选型决策树

```
预算有限?
  ├── 是 → FinBERT-CN (Tier 1, 单卡 8GB)
  └── 否 → 需要复杂语境理解?
              ├── 是 → FinGPT LoRA (Tier 2, 单卡 16GB)
              └── 否 → GPT-4o API (Tier 3, 按量付费)
```

## 数据隐私考虑

- Tier 1/2 (本地部署): 数据不出服务器, 隐私安全
- Tier 3 (API): 数据发送到 OpenAI, 需评估合规性
- 建议: 公开新闻可用 API, 用户隐私数据必须本地处理

## 情绪因子历史回测框架

### 回测设置
- 回测期: 2020.01 - 至今
- 换仓频率: 每日 (T+1 生效)
- 组合构建: 等权 Top 50 (最看多) vs Bottom 50 (最看空)
- 成本: 双边千分之一 (佣金) + 千分之一 (冲击)

### 预期指标
- 多头年化: 期望 > 基准 3-5%
- 多空 Spread IC: > 0.03
- 最大回撤: < 基准回撤

## 与 News tab 的数据共享

- News tab 提供原始文本流
- Sentiment tab 消费文本, 产出情绪评分
- 共享: Kafka topic 架构
  - News → `raw.news` → Sentiment 消费 → `sentiment.scores`
  - 前端: News tab 读 `raw.news`, Sentiment tab 读 `sentiment.scores`
