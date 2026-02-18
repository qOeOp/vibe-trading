# 因子预处理速查 (Preprocessing Cheat Sheet)

## 执行顺序

**去极值 → 中性化 → 标准化**

## 1. 去极值 (Winsorization)

| 方法 | 边界 |
|---|---|
| 3-Sigma | $[\mu - 3\sigma,\ \mu + 3\sigma]$ |
| MAD | $[M - 3 \times 1.4826 \times MAD,\ M + 3 \times 1.4826 \times MAD]$ 其中 $M = Median(X)$, $MAD = Median(\|X - M\|)$ |
| 百分位 | $[P_k,\ P_{100-k}]$（如 1% / 99%） |

## 2. 标准化 (Z-Score)

$$Z = \frac{X - \mu}{\sigma}$$

- **CS_ZSCORE**: 时间 T 对样本池截面归一化
- **TS_ZSCORE**: 单只股票相对自身历史序列归一化

### 高斯秩变换 (Gauss Rank Transform)

当数据含正负值混合（如财务比率）时，对数变换会产生**双峰分布**，破坏回归正态假设。GRT 是更稳健的替代方案：

1. 截面排名 → 百分位 $p_i \in (0, 1)$
2. 逆正态变换 (Inverse Normal Transform): $Z_i = \Phi^{-1}(p_i)$，其中 $\Phi^{-1}$ 是标准正态分布的累积分布函数的逆函数（probit function）。

**优势**: 保留原始排序信息，输出严格正态分布，无双峰问题。

**典型用法**: 对基本面估值因子（如 EP = 净利润/市值）的分子分母分别做 GRT，再进行截面回归，替代传统的直接比率或对数回归。

## 3. 中性化 (Neutralization)

### 行业中性化
- **均值扣除**: $X_{neutral} = X - \bar{X}_{industry}$
- **回归法**: $X = \beta_0 + \sum \beta_i \cdot Industry_i + \epsilon$，取残差 $\epsilon$

### 风险因子中性化
$$X = \beta_0 + \sum \beta_i \cdot RiskFactor_i + \epsilon$$

残差 = 无法被已知风险因子解释的部分。

## 4. 缺失值处理

| 场景 | 方法 |
|---|---|
| 时间序列缺失 | `TS_FILLNA`: 前向填充或插值 |
| 截面缺失 | `CS_FILLNA`: 中位数/均值填充 |
| 价格数据 | 使用后复权数据，避免除权息缺口 |

## 5. 信号权重调整 (Signal Weight Shaping)

> 预处理完成后、入组合前的信号后处理步骤。解决因子信号分布不均导致的权重集中问题。

### 问题

原始 alpha 信号的极端值会导致权重过度集中在少数股票（尤其是做空端的低流动性小盘股），使策略在 A 股做空受限的现实环境中不可行。

### rank → power → right_tail 工作流

| 步骤 | 算子 | 作用 |
|---|---|---|
| **rank** | 将信号映射到 $[0, 1]$ 均匀分布 | 消除极端值影响，降低权重集中度 |
| **power** | $\text{rank}^n$（$n > 1$） | 重新拉伸分布，恢复排名区分度（$n$ 越大，头部权重越集中） |
| **right_tail** | 设最小阈值，剔除低于阈值的信号 | 聚焦因子有效的市场区间（如剔除换手率极低的大盘股） |

### 权衡

- **纯 rank**: 稳健性↑、但收益和 Sharpe↓（区分度被压平）
- **rank + power**: 在稳健性和收益之间找平衡
- **power 幂次越高**: 收益↑ 但做空端集中度↑ → 需搭配 right_tail 控制

### 关键指标

- **Robust Universe Return**: 考虑真实市场做空限制后的可实现回报。若该指标不达标，说明策略收益依赖于不可兑现的做空端
