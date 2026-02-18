# Product Vision: The Alpha Factory

## 定位

全栈、端到端的量化交易平台。将海量原始数据转化为可执行的交易信号。

**Pipeline**: 数据层(采集/清洗/计算) → 因子实验室(分析/管理/评分) → 策略引擎(回测/优化/归因) → 执行顾问(交易策略/选股/仓位建议)

**目标用户**: 需要 truth、speed、clarity 的专业量化交易者。UI 服务于逻辑，而非反过来。

**目标市场**: A 股（沪深/创业板/科创板/北交所），后续扩展大宗商品和公募基金。

## 用户工作流

**慢循环 — 研究（周/月级）**: 经济学假设 → 量化定义 → 统计检验 → 正交检验 → 回测 → 容量分析 → 模拟盘。禁止跳过验证直接上线。

**快循环 — 执行（每日）**: 07:00 信息扫描 → 08:00 策略引擎结果 → 09:15 集合竞价 → 09:30 交易 → 盘中风控 → 15:00 收盘 → 15:30 自动重算 → 晚间复盘。

**A 股约束**: T+1、涨跌停板（主板±10%/创业板科创板±20%）、北向资金。

## 策略生命周期

```
Draft → Testing → Validated → Paper(模拟盘) → Live(实盘) → Degrading → Retired
```

门禁: 研究区 → 生产环境必须经过显式部署。未验证策略永远不碰真钱。

## 模块架构

> Canonical source of truth: `apps/web/src/features/blueprint/data/modules.ts`

11 个模块: Dashboard, Market, Factor, Analysis, Screener, Research, Portfolio, Trading, Risk, Journal, Settings。

核心实体 Book（策略账本）= Strategy + Capital + Broker + Risk Rules，贯穿 Portfolio/Dashboard/Trading/Risk/Journal。

## 核心设计原则

1. **不对接真实券商**: 输出为交易建议/选股推荐/仓位建议，用户自行执行
2. **LLM 双轨架构**: LLM 不修改量化信号。量化模型独立产出交易建议，LLM 负责解读 + 问答 + 情绪因子
3. **Mock 数据必须统计真实**: 回测曲线要有波动和回撤，IC 值在合理区间（参考 quant-domain 阈值），收益分布接近正态。直线上涨的净值曲线 = 不合格
