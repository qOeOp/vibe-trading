# Product Vision: The Alpha Factory

最小化因子研究的心智负担。从挖掘到交易，全链路自动化。

## 核心流程

LLM 自动挖掘因子 → 自动回测筛选 → 计算评价指标（IC/收益/风险） → Library 自动管理（实时更新因子状态） → ML 模型自动组合因子 → 生成交易模型 → 多策略多账户模拟交易 → 展示收益 + 选股预测

用户角色：监督者，不是操作者。审核、调参、决策——不手动搬砖。

## 模块

Dashboard, Market, Factor, Analysis, Screener, Research, Portfolio, Trading, Risk, Journal, Settings
核心实体 Book = Strategy + Capital + Broker + Risk Rules

## 约束

- 目标市场 A 股（T+1、涨跌停 ±10%/±20%）
- 不对接券商，输出交易建议，用户自行执行
- LLM 双轨：量化模型独立产出信号，LLM 只做解读/问答/情绪因子，不修改信号
- Mock 统计真实：IC 合理区间，净值有回撤，收益近正态
