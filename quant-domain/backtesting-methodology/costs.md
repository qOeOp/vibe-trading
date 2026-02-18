# 交易成本速查 (Costs Cheat Sheet)

## 滑点模型 (Slippage Models)

### 百分比滑点
- **买入**: $P_{exec} = P_{ref} \times (1 + S\%)$
- **卖出**: $P_{exec} = P_{ref} \times (1 - S\%)$

### 固定价位滑点 (Tick-Based)
- **买入**: $P_{exec} = P_{ref} + (Ticks \times TickSize)$
- **卖出**: $P_{exec} = P_{ref} - (Ticks \times TickSize)$

### VWAP 滑点
根据历史成交量分布，模拟分批执行订单以减少市场冲击。

## Alpha 影响

- **盈亏平衡 IC (Breakeven IC)**: 扣除换手成本后因子盈利所需的最低 IC
- **净 IC**: $IC_{net} = IC_{raw} - Costs_{normalized}$
- 高换手率策略对成本高度敏感
