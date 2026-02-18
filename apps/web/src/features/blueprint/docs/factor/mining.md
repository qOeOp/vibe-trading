---
title: Mining AI因子挖掘
subtitle: 符号回归 · 遗传编程 · LLM因子生成 · 进化树可视化
icon: Pickaxe
layout: rows
cards:
  - id: config
    title: 挖掘任务配置 & 进度
    subtitle: 任务模板 · 目标变量 · 特征池 · 约束条件 · 3 Tier算法
    render: markdown
    flex: 55
    row: 1
    badge: { icon: Cpu, label: AI, color: purple }
    expandTitle: 挖掘任务配置 & 进度 — 完整文档
    expandSubtitle: gplearn参数 · PySR对比 · LLM架构 · 搜索空间估算 · 并行化方案
  - id: review
    title: 挖掘结果审查
    subtitle: 候选因子 · 统计量 · 人工审核 · 可解释性
    render: markdown
    flex: 45
    row: 1
    badge: { icon: Eye, label: 审查, color: yellow }
    expandTitle: 挖掘结果审查 — 完整文档
    expandSubtitle: 初筛规则 · 表达式简化 · LLM幻觉风险 · 审核工作流 · Lab衔接合同
  - id: evolution
    title: 进化树可视化 & 技术方案
    subtitle: 遗传编程进化过程 · 3 Tier对比 · 研究论文
    render: markdown
    flex: 100
    row: 2
    expandTitle: 进化树可视化 & 技术方案 — 完整文档
    expandSubtitle: D3进化树实现 · 研究论文 · QLib集成 · 跨模块联动
rows:
  - height: 420px
  - height: 280px
links:
  - from: 候选因子
    to: Lab tab
    desc: 深度检验因子有效性
  - from: 通过因子
    to: Library tab
    desc: 入库管理因子生命周期
  - from: 进化树
    to: Research
    desc: 关联相关论文和研究
  - from: 特征数据
    to: Market/Capital
    desc: 获取北向资金等另类数据
footer: >-
  三Card布局: 任务配置(flex-55) | 结果审查(flex-45) | 进化树&技术(全宽) ·
  MVP 范围: Tier 1 (gplearn) + 基础审查界面 · P2: 进化树可视化 + PySR · P3: LLM因子生成
---

> **边界**: Mining 回答 "数据里还藏着什么有效因子?" — 自动化因子发现。
> Mining 发现的候选因子必须经过 Lab 深度检验才能入库, 不能直接进入 Library。
> Tier 1 (gplearn) 是 MVP 范围, Tier 2/3 是后续研究项目。

<!-- card: config -->

## 任务模板

预设模板帮助快速启动挖掘:

| 模板 | 目标变量 | 特征池 | 适用场景 |
|---|---|---|---|
| **动量因子挖掘** | T+5 收益率 | OHLCV + 技术指标 | 寻找价格惯性/反转信号 |
| **价值因子挖掘** | 超额收益 | 财报 + PE/PB | 寻找估值异常 |
| **另类因子挖掘** | 行业中性收益 | 北向资金 + 情绪 | 寻找非传统 alpha |
| **自定义** | 用户配置 | 用户选择 | 自由探索 |

用户可基于模板修改参数, 也可从空白开始。

---

## 任务配置

| 参数 | 选项 |
|---|---|
| 目标变量 | T+1收益率 · T+5收益率 · 超额收益 · 行业中性收益 |
| 特征池 | OHLCV · 财报 · 技术指标 · 北向资金 · 情绪(可选) |
| IC下限 | 0.03 (默认) |
| 换手率上限 | 可配置 |
| 与已有因子相关性 | < 0.5 |

---

## 3 Tier 算法方案

### Tier 1 — gplearn 符号回归 (MVP)
- 遗传编程, 搜索表达式空间
- CPU可跑, 小时级别
- 输出: 数学表达式 (可解释)
- **实现**: `pip install gplearn`, 1-2 周

### Tier 2 — PySR
- Julia后端, 比gplearn快10-100x
- 需要GPU, 分钟级别
- 输出: 更复杂表达式
- **实现**: 需Julia环境, **实际工程量 4-8 周** (含环境搭建 + 与 Python 服务对接 + 表达式格式转换)

### Tier 3 — LLM驱动因子生成 (研究阶段)
- LLM生成假设 → 代码化 → 自动检验 → 反馈循环
- 参考: QuantaAlpha / RD-Agent-Q / Alpha-R1
- 输出: 自然语言描述 + 代码
- **实现**: 2-6个月研究项目, 不在近期交付范围

"启动挖掘"按钮

---

## 任务进度

- 已评估因子数 / 总搜索空间
- 当前最优IC值
- GPU/CPU利用率 (Tier 2/3)
- 实时日志流 (最近20条)

---

## 历史任务

| 列 | 说明 |
|---|---|
| 日期 | 启动时间 |
| 算法 | Tier 1/2/3 |
| 模板 | 使用的任务模板 |
| 状态 | 运行中/已完成/失败 |
| 发现因子数 | 通过初筛的因子数 |
| 最优IC | 最佳因子的IC值 |

<!-- card: config:expand -->

## gplearn 配置参数

```python
population_size = 1000
generations = 50
tournament_size = 20
function_set = ['add', 'sub', 'mul', 'div', 'sqrt', 'log', 'abs']
```

---

## PySR 对比

使用 Julia 的 SymbolicRegression.jl, 搜索速度快但需 Julia 环境。与 gplearn 的主要区别在于搜索算法 (模拟退火 + 遗传 混合) 和表达式简化能力。

**工程量诚实标注**: PRD 原估 2-4 周, 实际应为 4-8 周 — 包含 Julia 运行环境搭建 (Docker + julia depot)、PySR ↔ Python 服务的 IPC 通信、表达式格式转换 (Julia AST → Python 可执行表达式)、与现有因子评估 Pipeline 对接。

---

## LLM 方案架构

```
Prompt Engineering → LLM(GPT-4/Claude) → 因子假设(自然语言)
→ 代码生成(Python) → 自动检验(IC/IR/正交) → 结果反馈到Prompt
→ 迭代优化
```

---

## 搜索空间估算

30个算子 × 20个变量 × 深度5 ≈ 数十亿候选表达式

---

## 并行化

因子评估可并行 (embarrassingly parallel), 支持多核/GPU加速。gplearn 原生支持 `n_jobs=-1`; PySR 自动利用 Julia 多线程; Tier 3 通过异步 API 调用并行。

<!-- card: review -->

## 审查面板布局

- **左侧**: 候选因子列表 (按 IC 降序排列, 自动标注 通过/边缘/不通过)
- **右侧**: 选中因子的详情 (表达式 + 统计量 + 图表)

---

## 候选因子列表

| 列 | 说明 |
|---|---|
| 因子表达式 | 符号回归输出的数学公式 |
| IC | 预测力 |
| IR | 稳定性 |
| t-stat | 显著性 |
| 换手率 | 月度换手 |
| 最大相关性 | 与已有因子的最大相关系数 |
| 状态 | 通过初筛 / 边缘 / 不通过 |

---

## 因子详情 (点击展开)

- 表达式: `ts_corr(rank(volume), rank(close), 10)`
- 经济学解读: "量价相关性衰减反映市场微观结构变化"
- 分位收益柱状图 (Q1-Q5)
- IC时序折线图

---

## 人工审核

| 操作 | 说明 | 交互 |
|---|---|---|
| **通过** | 提交到Lab深度检验 | 弹出确认面板: ① 选择归入 9 大类之一 (动能/股息率/价值/成长/品质/流动性/波动度/规模/情绪) ② 来源自动标记为对应 Mining tier (gplearn/pysr/llm) ③ 确认 "发送到 Lab 深度检验?" → 自动在 Lab 创建检验任务 |
| **拒绝** | 标注拒绝原因 | 弹出下拉: 选择拒绝原因 (4 分类) + 可选备注 |
| **存疑** | 标记待定, 后续再审 | 加入待定队列, 可设置提醒日期 |

---

## 经济学可解释性评分

1-5分 (人工打分):
- 1分: 纯数据挖掘, 无经济直觉
- 3分: 有一定逻辑但不确定
- 5分: 清晰的经济学假设支撑

<!-- card: review:expand -->

## 初筛规则

```
IC > 0.03
t-stat > 2.0
与已有因子相关性 < 0.5
月度换手率 < 30%
```

---

## 批量去重 (初筛后、人工审核前)

**问题**: 一次 Mining 任务可产出 50+ 通过初筛的因子, 它们从同一搜索空间进化而来, 相互间高度相关。直接全部交给人工审核效率低下。

**机制**:
1. 对通过初筛的候选因子计算两两相关性矩阵 (Spearman)
2. 层次聚类 (Ward 距离): 相关性 > 0.7 的归为一簇
3. 每簇保留 IC 最高的代表因子, 其余标记为 "去重淘汰"

**UI**:
- 候选列表增加 "簇 ID" 列 — 显示该因子所属聚类编号
- "去重后" 筛选视图: 默认只显示去重后的代表因子, 可切换查看全部
- 数量变化示例: 初筛通过 50 → 去重后 12 → 人工审核 12 个 (工作量降 76%)

---

## 表达式简化

自动合并同类项, 删除冗余算子。例如 `add(x, add(y, z))` → `add(x, y, z)`

---

## LLM 幻觉风险声明

**核心风险**: LLM 可以为任何随机公式编造看似合理的经济学解释 — 这是 Tier 3 方案的最大风险。一个完全无效的因子可能获得 "听起来很有道理" 的解读, 误导审核者。

**对策**:
- LLM 生成的经济学解读必须标注 **"AI 生成, 需人工验证"** (醒目标签)
- LLM 解读 **不作为审核通过/拒绝的依据**, 仅作为人工审核的辅助参考
- **验证流程**: 人工审核者先独立评分经济学可解释性 (1-5 分), 然后才看 LLM 解读作对比
- **回退策略**: 如果 LLM 解读质量不达标 (如人工评分与 LLM 建议相关性 < 0.3), 降级为纯人工审核

---

## 审核工作流

```
候选 → 人工审核 → 通过 → Lab深度检验 → Library入库
                 → 拒绝 → 标注原因归档
                 → 存疑 → 待定队列 (设置提醒日期)
```

---

## 拒绝原因分类

| 分类 | 说明 |
|---|---|
| 过拟合嫌疑 | 样本内IC高但不稳定 |
| 无经济逻辑 | 统计显著但无法解释 |
| 与已有因子高度相关 | 冗余因子 |
| 换手率过高 | 交易成本侵蚀alpha |

---

## Mining → Lab 数据传递合同

通过审核的因子发送到 Lab 时携带以下数据:

| 字段 | 说明 |
|---|---|
| expression | 因子表达式 (Python 可执行) |
| source | "mining" (来源标记) |
| algorithm | "gplearn" / "pysr" / "llm" |
| miningTaskId | 关联挖掘任务 ID |
| initialIC | 初筛 IC 值 |
| initialIR | 初筛 IR 值 |
| economicInterpretation | LLM 生成的解读 (仅 Tier 3, 可选) |

Lab 收到后自动填充 workbench 的代码编辑器, 用户可直接运行完整 8 步检验。

<!-- card: evolution -->

### 进化树可视化 (P2)

- 遗传编程过程: 初始种群→选择→交叉→变异→下一代
- D3树状图: 节点=因子表达式, 颜色=IC值 (红→黄→绿), 大小=IR
- 展示"好因子如何从简单表达式进化而来"

**交互**:
- 节点悬浮: 显示因子表达式 + IC 值 + 代数
- 连线: 实线 = 交叉遗传, 虚线 = 变异
- 点击节点 → 在审查面板中高亮该因子详情
- 时间轴: 底部滑块选择代数范围 (如 Gen 1-50)

### 3 Tier方案对比

| | Tier 1 gplearn | Tier 2 PySR | Tier 3 LLM |
|---|---|---|---|
| 搜索空间 | 表达式树 | 表达式树(更广) | 自然语言→代码 |
| 硬件 | CPU(小时) | GPU(分钟) | GPU+API |
| 可解释性 | 高(公式) | 高 | 最高(自然语言) |
| 实现周期 | 1-2周 | 4-8周 | 2-6月 |
| 推荐阶段 | **MVP** | P2 | P3 |

<!-- card: evolution:expand -->

## 进化树可视化实现 (P2)

D3 tree layout, 每代保留 Top 10 表达式, 展示进化路径。节点颜色映射 IC 值 (红=低 → 绿=高), 节点大小映射 IR (稳定性)。

**工程量**: D3 tree layout + 动画 + 与任务数据对接 = 2-3 周。

---

## 研究论文

- **Alpha-R1 (2025)**: LLM+RL 自动因子发现, 通过奖励信号优化 prompt 策略
- **QuantaAlpha**: 符号回归+强化学习, 引入经济学先验知识约束搜索空间
- **RD-Agent-Q**: 微软研发自动化框架, 通用的研究→开发→测试闭环
- **GeneticAlpha**: 遗传编程用于金融因子发现的经典方法

---

## 与 QLib (Microsoft) 的关系

QLib 提供 alpha mining 框架, 可作为 Tier 2/3 的基础设施:
- `qlib.contrib.model` 提供 LightGBM/TabNet 等模型
- `qlib.workflow` 提供自动化实验管理
- 我们的 Mining 模块可复用 QLib 的因子评估框架

---

## 跨模块联动

| 联动 | 说明 |
|---|---|
| Mining → Lab | 通过审核的候选因子自动创建 Lab 检验任务 |
| Mining → Library | 需经 Lab 检验, 不能直接入库 |
| Mining → Monitor | 挖掘任务状态在 Home 活动时间线中可见 |
| Market → Mining | 特征池数据 (北向资金/情绪) 来自 Market 模块 |
