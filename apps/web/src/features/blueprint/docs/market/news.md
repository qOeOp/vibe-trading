---
title: News 新闻墙
subtitle: 多源聚合 · AI 摘要 · 紧急度分级 · 政策追踪
icon: Newspaper
layout: two-column
cards:
  - id: feed
    title: 新闻瀑布流
    subtitle: 虚拟化列表 · 紧急度色带 · AI 摘要 · 关注词高亮
    render: markdown
    flex: 65
    row: 1
    badge: { icon: Rss, label: 5 源, color: teal }
    expandTitle: 新闻瀑布流 — 完整文档
    expandSubtitle: 数据源详情 · AI 摘要技术方案 · 关注词系统
  - id: filter
    title: 分类 & 过滤
    subtitle: 来源 · 板块 · 紧急度 · 关注词 · 政策分级
    render: markdown
    flex: 35
    row: 1
    badge: { icon: Filter, label: 5 维度, color: purple }
    expandTitle: 分类 & 过滤 — 完整文档
    expandSubtitle: 筛选器状态管理 · 新闻-板块关联算法
  - id: timeline
    title: 事件时间线 & 晨会
    subtitle: D3 timeline · 晨会纪要聚合 · 跨模块联动
    render: markdown
    flex: 100
    row: 2
    badge: { icon: Clock, label: Timeline, color: blue }
    expandTitle: 事件时间线 & 晨会 — 完整文档
    expandSubtitle: D3 timeline 实现 · 晨会纪要数据源 · 政策窗口日历
rows:
  - height: 420px
  - height: 260px
links:
  - from: 新闻关联个股
    to: Analysis/Overview
    desc: 跳转个股六维透视
  - from: 新闻关联板块
    to: Sector tab
    desc: Treemap 定位到该板块
  - from: 政策类新闻
    to: Macro tab
    desc: 关联宏观经济事件
  - from: 情绪评分
    to: Sentiment tab
    desc: 查看完整情绪分析
footer: >-
  三Card布局: 新闻流(flex-65) | 分类&过滤(flex-35) | 事件时间线&晨会(全宽) ·
  数据源: AKShare + 财联社 + 东财 · 推送: 60s polling (Tier 1)
---

<!-- card: feed -->

## 新闻瀑布流

**组件**: 虚拟化列表 (react-window 或自定义 IntersectionObserver)

**列表项结构**:

| 元素 | 说明 |
|---|---|
| 来源标签 | 财联社(橙) · 东财(蓝) · 新浪(红) · 上交所(绿) · 深交所(绿) |
| 时间戳 | HH:mm 格式, 超过24h显示日期 |
| 标题 | 粗体, 关注词高亮 (用户自定义) |
| AI 摘要 | 一句话摘要 (LLM 生成), 灰色折叠, 点击展开全文 |
| 紧急度色带 | 左侧 3px 色带: 🔴紧急 · 🟠重要 · 🔵一般 · ⚪常规 |

---

## 紧急度分级

| 级别 | 色带 | 触发条件 | 示例 |
|---|---|---|---|
| 紧急 | 红色 | 监管政策/黑天鹅/突发事件 | 证监会新规、央行降准、地缘冲突 |
| 重要 | 橙色 | 行业政策/龙头财报/重大人事 | 新能源补贴、茅台财报、高管变动 |
| 一般 | 蓝色 | 研报/分析/行业观点 | 券商研报、行业分析、策略观点 |
| 常规 | 灰色 | 日常公告/例行数据 | 交易所公告、日常统计 |

分级方式: LLM 自动分级 (FinBERT-CN 置信度 + 规则引擎补充)

---

## 点击展开详情

点击新闻条目展开:
- 全文内容 (Markdown 渲染)
- 关联个股列表 (自动提取 A 股代码 + 名称)
- 情绪评分 (-1 ~ +1, 来自 Sentiment tab 的模型)
- 操作按钮: "查看个股" → Analysis | "查看板块" → Sector

---

## 实时推送策略

| 方案 | 延迟 | 实现 |
|---|---|---|
| Tier 1: Polling | 60s | AKShare `stock_news_em()` 定时拉取 |
| Tier 2: WebSocket | <5s | 自建爬虫 + Kafka → WebSocket 推送 |
| Tier 3: SSE | <3s | 财联社 API 直接订阅 (需付费) |

<!-- card: feed:expand -->

## 数据源详情

| 来源 | 接口 | 更新频率 | 特点 |
|---|---|---|---|
| 财联社 | 电报 API / 爬虫 | 实时 | 速度最快, A 股首选信息源 |
| 东方财富 | `stock_news_em()` | 分钟级 | 覆盖广, 含研报/公告 |
| 新浪财经 | RSS / API | 分钟级 | 宏观新闻为主 |
| 上交所公告 | 官网 RSS | 日级 | 正式公告, 合规信息 |
| 深交所公告 | 官网 RSS | 日级 | 正式公告, 合规信息 |

## AI 摘要技术方案

- 模型: FinBERT-CN (摘要任务微调) 或 GPT-4o API
- 输入: 新闻全文 (截断至 512 tokens)
- 输出: 一句话摘要 (≤50 字) + 关联行业/个股提取
- 缓存: Redis, TTL 24h
- 降级: 模型不可用时显示前 50 字截断

## 关注词系统

- 存储: localStorage (前端) + 未来迁移到用户设置 (后端)
- 匹配: 全文正则匹配, 高亮显示
- 预设: 可选预设包 (如 "半导体产业链", "新能源", "消费")

<!-- card: filter -->

## 来源筛选

多选按钮组:
- 财联社 · 东方财富 · 新浪财经 · 上交所 · 深交所
- 全选/取消全选

---

## 板块/行业筛选

- 下拉选择: 跟随 Sector tab 分类体系 (申万/概念/地域)
- 选中板块后只显示该板块相关新闻
- 关联方式: 新闻提及个股 → 所属板块

---

## 紧急度筛选

单选: 全部 | 仅紧急 | 紧急+重要 | 仅一般

---

## 自定义关注词

- 输入框添加关键词
- 匹配到的新闻: 标题高亮 + 置顶
- 支持正则 (高级模式)
- 保存到 localStorage

---

## 政策分级筛选

层级结构:
- 国务院 (最高级别)
- 证监会 / 银保监会
- 央行
- 交易所 (上交所/深交所/北交所)

按发布机构层级过滤政策类新闻

---

## 今日统计

- 总条数 · 各来源占比 (mini 饼图)
- 紧急/重要新闻数 · 最热板块 (被提及最多)

<!-- card: filter:expand -->

## 筛选器状态管理

- 使用 Zustand store 或 React state 管理筛选条件
- URL query params 同步 (分享筛选结果)
- 筛选条件变更 → 新闻列表即时过滤 (前端过滤)

## 新闻-板块关联算法

1. 正则提取: 新闻文本中匹配 A 股代码 (6位数字)
2. 个股→板块映射: 通过申万行业分类关联
3. NER 模型: 实体识别提取公司名/行业名 (Tier 2)
4. 人工标签: 编辑后台手动标注 (Tier 3, 高精度)

<!-- card: timeline -->

### 重大事件时间线

- D3 timeline 水平轴, 按日期排列
- 事件气泡: 大小=影响级别, 颜色=类型 (政策/市场/公司)
- 点击气泡: 展开相关新闻列表
- 可缩放: 日/周/月视图切换

### 晨会纪要聚合

- 各券商当日晨会观点汇总
- 观点分类: 看多 (绿) / 看空 (红) / 中性 (灰)
- 共识度: 多空比例可视化

<!-- card: timeline:expand -->

## 事件时间线实现

- 可视化: D3 timeline 或自定义 SVG
- 数据: 从新闻流中提取"重大事件"标签 (紧急+重要级别)
- 交互: hover 显示事件摘要, 点击展开关联新闻

## 晨会纪要数据源

| 来源 | 获取方式 | 频率 |
|---|---|---|
| 主流券商研报 | 东财研报中心 / 万得 | 每交易日 8:00 前 |
| 策略观点 | 自动分类: 看多/看空/中性 | NLP 情感分析 |

## 政策窗口日历

- 静态数据: 已知政策会议日期 (两会/国常会 等)
- 动态数据: 央行操作日 (MLF/逆回购)
- 与 Macro tab 共享数据源
