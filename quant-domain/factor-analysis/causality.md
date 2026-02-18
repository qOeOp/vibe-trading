# 因果性与因子投资 (Causality in Factor Investing)

本篇基于 Marcos López de Prado 的研究，探讨了传统计量经济学在因子投资中的局限性，并引入了因果推断 (Causal Inference) 框架来解决"因子幻觉"问题。

## 1. 从"因子动物园"到"因子幻觉"
- **因子动物园 (Factor Zoo)**: 指学术界和业界发现的数百个溢价因子，但大多无法通过复制或实际落地。
- **因子幻觉 (Factor Mirage)**: 指那些在常规统计标准（如显著的 p 值、高 $R^2$）下表现良好，但由于误导了变量间的因果关系，在样本外失效的实证发现。

## 2. 核心偏误：混杂因子与碰撞节点

### (1) 混杂偏误 (Confounder Bias)
- **定义**: 一个变量同时是一个因子（自变量）和收益率（因变量）的共同原因。
- **后果**: 如果不控制混杂因子，估计出的因子溢价会发生偏差（大小甚至符号）。
- **示例**: 杠杆可能同时影响账面市值比 (BTOP) 和收益率。

### (2) 碰撞偏误 (Collider Bias) —— 最危险的幻觉
- **定义**: 一个变量是因子和收益率的共同**结果**（处于下游）。
- **后果**: 如果在回归中错误地将其作为控制变量，会引入虚假的非因果相关性，虚增 $R^2$，甚至改变因子系数的符号。
- **关键点**: 碰撞节点引入的相关性是无法变现的，因为当观测到碰撞节点时，收益已经发生。

## 3. 结构化因果模型 (SCM) 与 贝叶斯网络
- **因果图 (Causal Graph)**: 使用有向无环图 (DAG) 可视化变量间的依赖结构。
- **因果发现算法**:
    - **PC 算法 (Peter-Clark)**: 发现变量间的依赖网络。
    - **LiNGAM**: 线性非高斯无环模型。
- **准则**: 为了避免碰撞偏误，在构建模型时应**控制祖先节点 (Ancestors)**，而**严禁控制后代节点 (Descendants)**。

## 4. 因子投资因果审查 5 步法

### 第一步：变量选择 (Variable Selection)
- 明确因子模型的目标是"风险归因"还是"溢价收割"。
- 使用 Shapley 值、特征重要性等手段，并结合领域约束剔除伪变量。

### 第二步：因果发现 (Causal Discovery)
- 构建因果图，使用 PC 或 GES 算法。
- 必须有经济学逻辑或领域专家知识支撑图结构。
- 使用微软 **DoWhy** 库进行 refutations（反驳测试）。

### 第三步：因果调整 (Causal Adjustment)
- 识别调整方法（Backdoor, Front-door, 工具变量）。
- 使用 **do-calculus** 确认调整的有效性（如 DAGitty）。
- 确认模型中不包含任何已知的"碰撞节点"。

### 第四步：因果解释与预测力
- 模型是否支持反事实 (Counterfactual) 问题（"如果没有 X，Y 会怎样？"）。
- 评估模型在收益符号、排名和量级上的表现。

### 第五步：因果组合构建
- 将因果效应转化为投资组合权重。
- 策略应对非因果因子保持中性或不可知。
- 利用因果图进行对冲 (Hedging) 决策。

## 5. 经济成本与结论
- **忽视因果的代价**: 资本错配、隐藏杠杆、过度换手、信号不持久以及失去客户信任。
- **核心观点**: 宁可"欠拟合" (Underfit) 也不要"过拟合" (Overfit)。在金融数据充满碰撞节点的环境下，保守的模型更具鲁棒性。

## 6. 科学因子投资的三步走框架

> 合并自: López de Prado (2022-2025) 系列研究 — [references.md #3, #4, #5, #6]

### (1) 现象学阶段 (Phenomenological)
- 观察数据，发现异常现象 (Anomalies)
- 工具: EDA、相关性分析

### (2) 理论化阶段 (Theoretical)
- 构建结构化因果模型 (SCM)
- 明确因果路径：谁是原因 (Confounder)，谁是结果 (Collider)
- **核心准则**: 仅控制祖先节点 (Ancestors)，排除后代节点 (Descendants)

### (3) 证伪实验阶段 (Falsification)
- 提出可被证伪的因果假设
- 工具: 反事实分析 (Counterfactuals) — 模拟"如果因子值改变，收益会如何变化"

## 7. 伪科学分类

| 类型 | 定义 | 表现 |
|---|---|---|
| **Type-A** | 过拟合 | "因子动物园"，回测挖掘出的虚假因子 |
| **Type-B** | 模型设定错误 | 碰撞偏误导致 β 符号反转，系统性亏损 |

**碰撞节点导致 β 符号反转的机制**: 将碰撞节点作为控制变量 → 引入虚假非因果相关性 → β 估计符号反转 → 投资者在该买入时卖出。

## 8. 论文引用链

López de Prado 因果因子投资系列的演进：

1. **2022** "Causal Factor Investing: Can Factor Investing Become Scientific?" — 开创性专著，提出完整框架 [references.md #6]
2. **2023** "Where Are the Factors in Factor Investing?" (JPM) — 因果图框架的学术发表 [references.md #5]
3. **2024** "Why Has Factor Investing Failed?" — 碰撞偏误/因子幻觉的详细论证 [references.md #4]
4. **2025** "Causal Factor Analysis is a Necessary Condition for Investment Efficiency" (JPM) — 因果分析作为必要条件 [references.md #3]
5. **2025** "Causality and Factor Investing: A Primer" — CFA Institute 简版 [references.md #7]
6. **2025** "Causality and Factor Investing: A Primer" (SSRN) — 完整学术版 [references.md #2]
