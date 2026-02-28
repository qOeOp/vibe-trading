---
title: Lab 因子实验室
subtitle: 因子构建 · 单因子检验 · 正交检验 · 条件IC · 归因分析 · AI因子助手 · IDE式迭代
icon: FlaskConical
layout: rows
cards:
  - id: workbench
    title: 因子构建工作台
    subtitle: 模式选择器(代码/工作流) · CodeMirror 6 · AI因子助手 · 二级Tab(代码/笔记/预处理) · Typed Dataflow(P2)
    render: markdown
    flex: 100
    row: 1
    badge: { icon: FlaskConical, label: 研究, color: teal }
    expandTitle: 因子构建工作台 — 完整文档
    expandSubtitle: PyScript + CodeMirror 6 · AI因子助手详解 · 二级Tab · Typed Dataflow Graph · 内置函数库 · Pyodide执行引擎 · 直接回测跳转
  - id: results
    title: 检验结果面板
    subtitle: IC/IR · 分位收益 · IC衰减 · 正交 · 条件IC · 归因 · 成本 · 直接回测
    render: markdown
    flex: 100
    row: 2
    badge: { icon: CheckCircle2, label: 8步检验, color: green }
    expandTitle: 检验结果面板 — 完整文档
    expandSubtitle: 判定规则 · 因子归因分析 · 单调性检验 · T+1成本模型 · 入库工作流 · 直接回测
rows:
  - height: h-full
  - height: 420px
links:
  - from: 检验通过
    to: Library tab
    desc: 提交因子入库 (INCUBATING 状态)
  - from: 直接回测
    to: Backtest tab
    desc: 预填单因子策略一键跳转回测
  - from: 正交性参照
    to: Monitor tab
    desc: 参照已有因子健康状态
  - from: 条件 IC 环境
    to: Market/Industry
    desc: 关联市场环境判断
  - from: 因子定义
    to: Mining tab
    desc: 参考 AI 挖掘发现的因子
footer: >-
  上下分屏: 构建工作台(row-1, 全宽) | 检验结果面板(row-2, 全宽) ·
  构建区左=编辑器/画布 右=AI因子助手(可收起, 320px) ·
  模式选择器: 代码(CodeMirror 6) / 工作流(React Flow, P2) ·
  顶栏: 模式+因子名+检验参数⚙️+开始检验+直接回测+AI toggle ·
  执行: PyScript/Pyodide (浏览器WASM) · 数据源: AKShare + BaoStock + scipy spearmanr
---

> **边界**: Lab 回答 "这个因子有没有预测力?" — 单因子层面的统计检验。
> 如果答案是 Yes, 因子进入 Library (INCUBATING 状态) → Monitor 的 Paper Test 流程。
> "这些因子组成的策略能不能赚钱?" 是 Backtest tab 的问题。

<!-- card: workbench -->

## IDE 工作区 (上下分屏)

Lab 是因子研发的 IDE。**上方 = 构建区 (编辑器/画布 + AI 助手), 下方 = 检验结果**。

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔽[代码▼] 因子名  [检验参数⚙️] [▶开始检验] [▷直接回测] [🧠AI] │
├───────────────────────────────────┬──────────────────────────────┤
│  代码|笔记|预处理  [工具条...]    │  🧠 AI 因子助手      ⚙️📌✕ │
│  ┌─ CodeMirror 6 ─────────────┐  │  Alpha 因子顾问              │
│  │ rank(ts_corr(close,vol,20))│  │  [解释这个因子公式]          │
│  │                            │  │  [IC=0.04在A股什么水平]      │
│  └────────────────────────────┘  │  💬 输入问题...              │
├───────────────────────────────────┴──────────────────────────────┤
│  ✅✅⚠️✅✅✅⚠️─  检验结果 (全宽, 可折叠)                      │
│  ① IC/IR  ② 分位收益  ③ IC衰减  ④ 正交  ...  ⑧ 操作          │
└──────────────────────────────────────────────────────────────────┘
```

- **上下分屏比例**: 构建区 flex-[3] + 检验结果 flex-[2], 可拖拽分割线调整
- 支持多因子同时编辑 (tab 切换, 类似 IDE 多标签页)
- 运行历史: 保留最近 20 次检验结果, 可回溯对比
- "对比运行" 功能: 选中两次运行结果, 并排对比 IC/分位收益差异

---

## 顶栏工具条

顶栏包含全局操作, 从左到右:

| 区域 | 元素 | 说明 |
|------|------|------|
| 左 | 🔽 模式选择器 | 下拉: `代码` (默认) / `工作流` (P2, 灰色 badge) |
| 左中 | 因子名称 | 可编辑文本, 如 "动量反转_v3" |
| 中 | 检验参数 ⚙️ | 下拉面板: IC方法 / 去极值 / 分位组数 / 持有期 / 股票池 / ST过滤 |
| 右 | [▶ 开始检验] | 绿色主按钮, 触发 Pyodide Worker → 填充下方检验结果 |
| 右 | [▷ 直接回测] | 蓝色次按钮, 检验通过后激活, 跳转 Backtest (预填单因子策略) |
| 右 | [🧠 AI] | toggle 按钮, 控制右侧 AI 因子助手面板的显示/隐藏 |

---

## 双模式构建

**左上角模式选择器** (下拉菜单, 借鉴量化策略平台交互模式):
- 选择 `代码` → 构建区显示 CodeMirror 6 编辑器
- 选择 `工作流` (P2) → 构建区显示 React Flow 画布
- 两种模式**共用同一构建区域** (全宽), 切换时画布内容变化
- 编译目标一致: 两种模式最终都产出 Python 因子表达式

**代码模式** (PyScript + CodeMirror 6, MVP):
- **编辑器**: CodeMirror 6 (`@codemirror/lang-python`), ~30KB 轻量, 原生 Web 组件
- **执行引擎**: PyScript (Pyodide) — 浏览器端 WASM Python, 无需后端 roundtrip
- Python 语法, 内置函数:
  - 截面: `rank()`, `zscore()`, `industry_neutralize()`
  - 时序: `ts_mean()`, `ts_std()`, `ts_corr()`, `ts_rank()`, `delay()`
  - 数学: `log()`, `abs()`, `sign()`, `power()`
- 数据变量: `close`, `open`, `high`, `low`, `volume`, `amount`, `turn`, `pe`, `pb`, `roe`
- 示例: `rank(ts_corr(close, volume, 20))`
- 运行时: NumPy + Pandas + SciPy 均通过 Pyodide 在浏览器直接执行

**拖拽模式** (Typed Dataflow Graph, 借鉴 Flume 设计 + React Flow 引擎, P2):
- **渲染层**: `@xyflow/react` (React Flow v12) — React 19 兼容, 自定义节点/边, minimap, auto-layout
- **类型系统**: Typed Port — 端口分类型 (timeseries / scalar / cross-section / boolean), 颜色编码, 仅类型兼容的端口可连线
- **节点声明**: FlumeConfig 式声明式 API — 一处定义 node type (ports + controls + label) → 自动生成 Mine 风格节点 UI
- **DAG 求值**: RootEngine 式反向遍历 — 从输出节点递归, 每个节点 resolve 为 Python 表达式片段, 拼接为完整因子公式
- **环检测**: DFS 拓扑排序, 连线时实时校验, 禁止形成环
- 节点类型: 数据源 (OHLCV/财报/北向) → 算子 (截面/时序) → 组合 (加减乘除/权重) → 输出
- **Tier 标注**: P2 (React Flow + 自定义层, 5-7 周工程量)
- **双向同步 (P2 延伸)**: 代码 ↔ 工作流可互转 — 工作流→代码由 RootEngine 完成, 代码→工作流需 AST 解析

---

## 构建区二级 Tab

编辑器上方提供 3 个 tab, 组织不同维度的因子研发内容:

| Tab | 内容 | 说明 |
|-----|------|------|
| **代码** (默认) | CodeMirror 6 编辑器 | 因子公式编辑区 |
| **笔记** | Markdown 编辑器 | 记录因子设计思路、假设、参考文献, 与因子绑定持久化 |
| **预处理** | Pipeline 4 步可视化 | 去极值→标准化→行业中性→市值中性, toggle 开关控制 |

好处: 编辑器区域聚焦于代码, 预处理配置和研究笔记不再挤占编辑器正文。

---

## AI 因子助手

构建区右侧的可收起面板, 为因子研究提供 AI 辅助。

**定位**: Alpha 因子研究顾问 — 公式解读 · IC 分析 · 覆盖率调试 · 学术文献关联

**交互**:
- 顶栏 [🧠 AI] toggle 按钮控制面板开/关
- 面板内: ⚙️ 设置 / 📌 固定 / ✕ 关闭
- **默认关闭**, 点击打开; AI 面板关闭时构建区自动扩展到全宽
- 面板宽度: 320px

**预设 prompt pills** (点击即发送, 降低使用门槛):
- `解释这个因子公式`
- `IC=X 在 A 股算什么水平`
- `覆盖率低于 Y% 可能是什么原因`
- `如何做行业中性化`
- `这个因子的学术衰减模式`
- `帮我写一个动量反转因子`
- `分析我的因子公式有什么问题`

**上下文注入**: AI 可读取当前因子公式 + 最新检验结果 (IC/IR/分位收益等), 作为回答上下文。

**双轨原则约束**: AI **不直接修改编辑器中的因子公式** — 只给出建议代码片段, 用户手动复制采纳。AI 不产出量化信号, 只做解读/问答/建议。量化信号由左侧构建区独立产出, 与 AI 建议物理隔离。

---

## 特征池选择

勾选可用数据字段:

| 类别 | 字段 |
|---|---|
| 价量 | OHLCV, amount, turn |
| 财报 | PE, PB, ROE, ROA, 营收增速 |
| 北向 | 净买入, 持股比例变化 |
| 情绪 | FinBERT 评分 (可选) |

时间范围: 起始日~结束日 + 样本内/外分切 (默认 70/30)

---

## 因子预处理 Pipeline

> 此内容在构建区通过 **「预处理」Tab** 访问 (见上方二级 Tab 系统)。

因子原始值 → 4 步标准化处理 → 送入检验:

| 步骤 | 方法 | 说明 |
|---|---|---|
| ① 去极值 | MAD (中位数绝对偏差) | 将超出 ±5 MAD 的值缩尾至边界, 比 3σ 对偏态分布更稳健 |
| ② 标准化 | Z-Score | (x - mean) / std, 使因子值可跨因子比较 |
| ③ 行业中性化 | 行业哑变量回归取残差 | 消除行业暴露, 申万一级 31 行业 |
| ④ 市值中性化 | 对数市值回归取残差 | 消除规模效应 (A股小盘溢价显著) |

**Pipeline 可视化**: 左→右 4 个节点, 每步一个 toggle 开关。默认全部启用, 用户可关闭任一步骤。关闭后实时预览因子分布直方图变化。顺序固定 (去极值→标准化→行业中性→市值中性), 不可拖拽调序。

---

## 检验参数配置

> 检验参数收纳在顶栏 **⚙️ 检验参数** 下拉面板中 (见上方顶栏工具条)。

| 参数 | 选项 | 默认值 |
|---|---|---|
| IC 计算方法 | Rank IC (Spearman) / Normal IC (Pearson) | Rank IC |
| 去极值方法 | MAD / 3σ / 百分位 (1%/99%) | MAD |
| 分位组数 | 5 / 10 | 5 |
| 持有期 | T+1 / T+5 / T+10 / T+21 (多选) | 全选 |
| 股票池 | 全 A / 沪深300 / 中证500 / 中证1000 | 全 A |
| ST/新股过滤 | 开/关 | 开 |

---

## 计算预览

点击 [▶ 开始检验] 前的即时反馈:

- 前 10 行因子值预览表格
- 分布直方图: 偏度/峰度/极值检测
- 点击 [▶ 开始检验] → 触发 Pyodide Worker 执行 → 结果填充下方检验结果面板

<!-- card: workbench:expand -->

## 代码编辑器技术

**技术选型**: PyScript + CodeMirror 6 (轻量且原生)

| 维度 | CodeMirror 6 | Monaco (备选) |
|---|---|---|
| 包体积 | ~30KB (gzip) | ~2MB |
| 架构 | Lezer 增量解析, 模块化扩展 | VS Code 核心提取, monolithic |
| Python 支持 | `@codemirror/lang-python` (Lezer parser) | 内置 Monarch tokenizer |
| 自动补全 | `@codemirror/autocomplete` + 自定义 source | 内置 IntelliSense |
| 主题适配 | EditorView.theme() 完全可控 | 受限于 VS Code 主题格式 |
| 决策理由 | 轻量、原生 Web、与 PyScript 生态一致 | — |

- **语法高亮**: Lezer Python parser, 增量解析, 编辑时零延迟
- **自动补全**: 自定义 CompletionSource — 内置函数名 (`rank`, `ts_mean` 等) + 数据变量名 (`close`, `volume` 等), 带类型签名和文档
- **语法校验**: Pyodide `compile()` 做真正的 Python 编译检查 (非 AST 模拟), 实时错误提示
- **主题**: 自定义 Mine 主题, 暗色编辑器背景 (`#1e1e1e`), 与检验结果面板形成对比

---

## PyScript 执行引擎

**架构**: PyScript Next (2025 重写版) + Pyodide (CPython→WASM)

| 特性 | 说明 |
|---|---|
| 运行时 | Pyodide = CPython 3.11+ 编译为 WebAssembly |
| 科学计算 | NumPy, Pandas, SciPy 内置 (Pyodide 预编译 wheel) |
| 首次加载 | ~12MB (Pyodide core + packages), 浏览器缓存后 <1s |
| 执行线程 | Web Worker (不阻塞 UI 主线程) |
| FFI | Python ↔ JS 双向桥接, Python 可直接操作 DOM |
| 文件系统 | Emscripten 沙箱 FS, 可挂载 API 拉取的数据 |

**为什么不用后端 Python**:
- 因子研究是高频迭代 (改一行公式 → 立即看结果), 后端 roundtrip 增加 200-500ms 延迟
- Pyodide 自带 NumPy/Pandas/SciPy, 因子计算所需的全部库都能在浏览器运行
- 安全沙箱: WebAssembly 天然隔离, 用户代码无法访问服务器资源
- 离线可用: 数据预加载后可断网运算

**混合架构** (MVP → P2 渐进):
- MVP: Pyodide 浏览器端执行小规模数据 (≤500 股 × 240 日 ≈ 120K 行)
- P2: 大规模回测 (全 A 5000+ 股 × 10 年) 仍走后端 FastAPI + Pandas, 通过 Kafka 异步返回
- 切换逻辑: 前端根据数据规模自动选择执行引擎 (阈值可配置)

---

## 内置函数库

30+ 时序/截面算子, 参考 WorldQuant Alpha101:

- **截面函数**: `rank()`, `zscore()`, `industry_neutralize()`, `percentile()`, `quantile()`
- **时序函数**: `ts_mean(x, d)`, `ts_std(x, d)`, `ts_corr(x, y, d)`, `ts_rank(x, d)`, `ts_delta(x, d)`, `ts_max(x, d)`, `ts_min(x, d)`, `ts_argmax(x, d)`, `ts_argmin(x, d)`, `delay(x, d)`
- **数学函数**: `log()`, `abs()`, `sign()`, `power()`, `max()`, `min()`

> **工程备注 — 函数命名规范**: 开发时统一为 `CS_` 前缀 (截面) 和 `TS_` 前缀 (时序), 如 `CS_ZSCORE()`, `TS_MA()`, 参考 RiceQuant 规范。有利于用户直觉区分函数作用域。

---

## 拖拽模式架构 (P2)

**设计决策**: 借鉴 Flume (chrisjpatty/flume) 的架构模式, 底层使用 React Flow (`@xyflow/react`) 渲染引擎, 构建自定义 Typed Dataflow Graph 组件。

**为什么不直接用 Flume**:
- React 18 peer dep, 我们 React 19
- CSS 全部要重写才能匹配 Mine 设计系统 → 等于重写渲染层
- 自定义 node 能力有限, 无 auto-layout
- 如果渲染层要重写, 不如一开始就用更好的引擎

**为什么不纯 React Flow**:
- React Flow 只提供画布 + 节点渲染 + 边路由, 不提供类型系统和 DAG 求值
- 没有端口类型约束, 任何节点可连任何节点 → 用户会犯错
- 没有表达式编译器, 需要全部自建

**Hybrid 架构分层**:

| 层 | 来源 | 职责 |
|---|---|---|
| **渲染层** | React Flow (`@xyflow/react`) | 画布、Custom Node/Edge 渲染、minimap、controls、拖拽交互、viewport 虚拟化 |
| **类型层** | 自建 (借鉴 Flume TypedPort) | Port 类型定义 (timeseries/scalar/cross-section/boolean)、颜色映射、连线兼容性校验 |
| **声明层** | 自建 (借鉴 Flume FlumeConfig) | NodeTypeRegistry — 一处定义节点 (输入端口/输出端口/控件/标签), 自动生成 Mine 风格 UI |
| **求值层** | 自建 (借鉴 Flume RootEngine) | 反向 DAG 遍历: 从输出节点递归 resolve → 每个节点产出 Python 表达式片段 → 拼接为完整因子公式 |
| **校验层** | 自建 | DFS 拓扑排序环检测 (连线时实时)、孤立节点检测、必需输入未连接警告 |
| **布局层** | dagre / elkjs (React Flow 生态) | Auto-layout: 新增节点自动排列, 防止节点重叠, 可选手动微调 |

**Port 类型系统**:

| 类型 | 颜色 | 含义 | 示例 |
|---|---|---|---|
| `timeseries` | 蓝 `#6366f1` | 时间序列 DataFrame (股票×日期) | close, volume, ts_mean(close, 20) |
| `scalar` | 橙 `#f59e0b` | 标量参数 | 窗口长度 20, 权重 0.5 |
| `cross-section` | 绿 `#2EBD85` | 截面向量 (单日全股票) | rank(), zscore() 的输出 |
| `boolean` | 红 `#F6465D` | 布尔掩码 | 过滤条件, ST 标记 |

连线规则: 只有相同类型的端口可以连接。`timeseries` 输出 → `timeseries` 输入 ✅, `timeseries` 输出 → `scalar` 输入 ❌。违反时连线显示红色 + 弹出提示。

**节点类型注册表 (NodeTypeRegistry)**:

```typescript
// 声明式 API 示例 (借鉴 Flume FlumeConfig 模式)
const registry = new NodeTypeRegistry()
  .addNodeType("ts_corr", {
    label: "时序相关性",
    category: "timeseries",
    inputs: [
      { name: "x", type: "timeseries", label: "序列 X" },
      { name: "y", type: "timeseries", label: "序列 Y" },
      { name: "window", type: "scalar", label: "窗口", control: "number", default: 20 },
    ],
    outputs: [
      { name: "result", type: "timeseries", label: "相关系数" },
    ],
    resolve: (inputs) => `ts_corr(${inputs.x}, ${inputs.y}, ${inputs.window})`,
  })
```

一处定义 → 自动生成: Mine 风格节点卡片 (白底圆角, 左侧彩色端口圆点, 内嵌 controls)。

**DAG → Python 表达式编译** (RootEngine 模式):

```
用户连线: [close] → ts_corr.x, [volume] → ts_corr.y, [20] → ts_corr.window
         [ts_corr.result] → rank.input
         [rank.result] → 输出

RootEngine 反向遍历:
  输出 ← rank(?) ← ts_corr(?, ?, ?) ← close, volume, 20

生成: rank(ts_corr(close, volume, 20))
```

遍历到数据源节点时返回变量名, 遍历到算子节点时返回函数调用字符串, 递归拼接。

**工程量**: 5-7 周
- React Flow 集成 + Mine 风格 Custom Node = 2 周
- TypedPort 系统 + 连线校验 = 1 周
- NodeTypeRegistry + 30 个节点定义 = 1 周
- RootEngine 表达式编译器 = 1 周
- Auto-layout + 交互优化 (undo/redo, 快捷键) = 1-2 周

---

## 数据变量来源

| 来源 | 数据 |
|---|---|
| AKShare 日线 | OHLCV, amount, turn |
| BaoStock 财报 | PE, PB, ROE, ROA, 营收增速, 净利润增速 |
| AKShare 北向 | 净买入, 持股比例变化 |

---

## 编译与执行流程

```
CodeMirror 编辑器 → 用户代码 (Python)
    ↓
Pyodide compile() → 语法检查 (实时, 红色波浪线)
    ↓
"开始检验" → Web Worker 启动 Pyodide
    ↓
注入预加载数据 (DataFrame: 股票×日期×字段)
    ↓
exec(user_code) → 因子值矩阵 (股票×日期)
    ↓
内置检验函数 (spearmanr, quantile split) → 结果 JSON
    ↓
postMessage → 主线程 → 填充右侧检验结果面板
```

**安全模型**:
- Pyodide 运行在 Web Worker, 无法访问主线程 DOM (除非通过 FFI)
- `exec()` 在受限 namespace: 只暴露内置函数 + 数据变量, 禁止 `import os`, `open()` 等
- WebAssembly 沙箱: 无文件系统访问、无网络 (除非显式 fetch)

**工程量**: CodeMirror 集成 = 1 周, Pyodide Worker 封装 = 1-2 周, 内置函数库移植 = 1 周。共 3-4 周, 属于 MVP 关键路径。

---

## A 股公司行为处理

因子计算和检验必须正确处理 A 股特有的公司行为, 否则引入生存偏差, 因子回测结果虚高:

| 公司行为 | 处理方式 |
|---|---|
| **停牌** | 停牌日因子值标记 NaN, 不参与横截面排名 |
| **ST/*ST** | 默认排除 ST 和退市股票 (可通过开关关闭) |
| **配股/拆股** | 使用前复权价格 (hfq), 成交量做除权调整 |
| **新股上市** | 上市首 60 个交易日 (默认) 不纳入因子计算 |
| **涨跌停** | 涨停/跌停日的因子值标记为无效 (无法交易) |
| **退市** | 退市前最后 20 个交易日因子值保留但标记警告 |

**为什么重要**: A 股每年有 ~50 家 ST 公司, ~20 家退市, 停牌天数远多于美股。不处理这些会导致因子 "在已经不存在的股票上表现优秀" — 典型的生存偏差。

---

## 预处理 Pipeline 详解

**去极值 — MAD vs 3σ**:
- 3σ 假设正态分布, A股因子值通常偏态+厚尾, 3σ 会误判
- MAD = median(|x - median(x)|), 对极端值更稳健
- 缩尾公式: 若 x > median + 5·MAD, 则 x = median + 5·MAD

**标准化 — Z-Score vs Rank**:
- Z-Score: 保留原始分布形状, 适合线性模型
- Rank (百分位): 强制均匀分布, 适合非线性模型
- 默认 Z-Score, 可选 Rank

**行业中性化**:
- 回归模型: `factor = α + Σ(βi · industry_dummyi) + ε`
- 取残差 ε 作为中性化后因子值
- 使用申万一级 31 行业分类 (通过 BaoStock 获取)

**市值中性化**:
- 回归模型: `factor = α + β · ln(market_cap) + ε`
- 取残差 ε, 消除规模效应
- A股小盘溢价长期显著, 不中性化会导致因子 "实际上只是在选小盘股"

**Pipeline 顺序很重要**: 去极值 → 标准化 → 行业中性 → 市值中性 (先处理异常值, 再标准化, 最后去暴露)

---

## AI 因子助手详解

### 技术架构

复用全局 Chat Advisor 组件, 注入 Lab 专属配置:

| 维度 | 方案 |
|------|------|
| **组件** | `<ChatAdvisor context="factor-lab" />` — 全局 Chat 组件的 Lab 实例 |
| **面板位置** | 构建区右侧, 固定宽度 320px, 可收起 (关闭后构建区自动扩展到全宽) |
| **打开方式** | 顶栏 [🧠 AI] toggle 按钮; 面板内 ✕ 关闭 / 📌 固定 / ⚙️ 设置 |
| **LLM 后端** | 复用全局 LLM 网关, 支持流式输出 (SSE) |

### System Prompt 策略

Lab 专属 system prompt 在全局 prompt 基础上追加:

```
你是 Alpha 因子研究顾问。你的职责是:
1. 解读因子公式的数学含义和经济学直觉
2. 分析 IC/IR 等统计指标在 A 股市场的合理水平
3. 诊断因子覆盖率低、IC 不稳定等常见问题
4. 提供行业中性化、去极值等预处理建议
5. 关联学术文献 (如 Alpha101, Harvey2015 等)

约束:
- 不直接修改编辑器中的因子公式 — 只给出建议代码片段, 用户手动采纳
- 不产出量化交易信号 — 只做解读/问答/建议
- 回答必须基于注入的因子上下文, 不编造数据
```

### 上下文注入

每次对话请求自动附加当前因子状态:

| 上下文字段 | 来源 | 示例 |
|------------|------|------|
| `factorExpression` | CodeMirror 编辑器当前内容 | `rank(ts_corr(close, volume, 20))` |
| `factorName` | 顶栏因子名称 | `动量反转_v3` |
| `latestIC` | 最新检验结果 Step ① | `{ mean: 0.041, std: 0.12, ir: 0.34 }` |
| `quantileReturns` | 最新检验结果 Step ② | `[Q1: -2.1%, ..., Q5: +3.8%]` |
| `coverageRate` | 最新检验结果 Step ① | `92.5%` |
| `icHalfLife` | 最新检验结果 Step ③ | `T+6` |
| `preprocessConfig` | 预处理 Tab 当前配置 | `{ mad: true, zscore: true, indNeutral: true, capNeutral: false }` |

**上下文窗口**: 仅注入最新一次检验结果 (非全部历史), 控制 token 消耗。用户可手动粘贴历史数据到对话中。

### 预设 Prompt Pills 完整列表

| Pill | 发送内容 | 典型回答方向 |
|------|----------|-------------|
| 解释这个因子公式 | `请解释当前因子公式 {factorExpression} 的数学含义和经济学直觉` | 公式分解 + 经济学假设 + 适用场景 |
| IC=X 在 A 股什么水平 | `IC均值={latestIC.mean}, 这在 A 股因子研究中属于什么水平?` | 对标行业基准 + 分级评价 |
| 覆盖率低的原因分析 | `因子覆盖率为 {coverageRate}, 可能是什么原因导致偏低? 如何改善?` | 数据缺失诊断 + 公式条件分析 + 建议 |
| 如何做行业中性化 | `请解释行业中性化的原理, 以及对当前因子的影响` | 回归残差法 + 对 IC 的影响 + 何时需要 |
| 学术衰减模式 | `IC半衰期为 {icHalfLife}, 这种衰减模式在学术文献中属于哪一类?` | 文献关联 + 调仓频率建议 |
| 帮我写一个因子 | `帮我写一个动量反转因子, 使用内置函数库` | 代码片段 (用户手动复制) + 解释 |
| 分析因子问题 | `分析当前因子公式可能存在的问题` | 前视偏差 / 过拟合 / 数据泄露检查 |

### 双轨原则实现

```
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  量化信号轨 (左侧构建区)      │   │  AI 顾问轨 (右侧面板)        │
│                             │   │                             │
│  因子公式 → Pyodide 执行     │   │  公式解读 / 诊断 / 建议       │
│  → 检验结果 → 入库/回测      │   │  用户手动采纳建议到编辑器      │
│                             │   │                             │
│  ✅ 独立产出交易信号          │   │  ❌ 不修改因子公式             │
│  ✅ 决定因子有效性            │   │  ❌ 不产出交易信号             │
└─────────────────────────────┘   └─────────────────────────────┘
           │                                    │
           │      物理隔离: 两轨无直接写通道       │
           └────────────────────────────────────┘
```

---

## 直接回测工作流

### 功能定位

Lab 检验通过后, 用户最自然的下一步是 "做成策略试试能不能赚钱"。**直接回测** 将 Lab → Library → Backtest 的 3 步跳转简化为 1 键直达。

### 触发入口

两处触发, 行为一致:

| 入口 | 位置 | 样式 |
|------|------|------|
| 顶栏 [▷ 直接回测] | 工具条, [▶ 开始检验] 右侧 | 蓝色次按钮 |
| ⑧ 操作 [▷ 直接回测] | 检验结果面板最后一步 | 蓝色按钮 |

### 启用条件

- 综合判定 = **绿色** (因子有效 — 可提交入库) → 按钮激活
- 综合判定 = 黄色或红色或未检验 → 按钮灰色, tooltip: "请先完成因子检验且结果为有效"

### URL 参数规格

跳转目标: `/factor/backtest?factorId=xxx&mode=quick`

| 参数 | 值 | 说明 |
|------|------|------|
| `factorId` | 当前因子 ID (若已入库) 或临时 ID | 定位因子 |
| `mode` | `quick` | 告知 Backtest 页面进入快速回测模式 |
| `expression` | URL-encoded 因子表达式 | 兜底: 若因子未入库, 传表达式 |
| `pool` | 检验时使用的股票池 | 如 `全A` / `沪深300` |
| `dateRange` | 检验时间范围 | 如 `2022-01-01~2024-12-31` |

### Backtest 预填逻辑

Backtest 页面接收 URL 参数后自动填充:

| 配置项 | 预填值 | 用户可改 |
|--------|--------|---------|
| 因子 | 当前因子 (单因子) | ✅ 可添加更多因子 |
| 权重方案 | 等权 (Equal Weight) | ✅ 可切换 IC 加权等 |
| 基准 | 沪深300 | ✅ 可切换中证500等 |
| 滑点模型 | Level 1 (佣金+印花税+2bp滑点) | ✅ |
| 回测区间 | Lab 检验的同一时间范围 | ✅ |
| 调仓频率 | 根据 IC 半衰期推荐 (T+5 或 T+21) | ✅ |

**预填 ≠ 锁定**: 所有配置项用户均可修改后再运行回测。直接回测只是省去手动配置的步骤。

### 流程图

```
Lab 因子检验
    │
    ├─ 检验通过 (绿色 banner)
    │   ├─ [▶ 提交入库] → Library (INCUBATING 状态) → Monitor Paper Test
    │   └─ [▷ 直接回测] → /factor/backtest?factorId=xxx&mode=quick
    │                       │
    │                       ├─ Backtest 页面自动预填配置
    │                       ├─ 用户确认/修改配置
    │                       └─ [运行回测] → 策略绩效报告
    │
    ├─ 检验边缘 (黄色 banner)
    │   └─ [直接回测] 灰色, 建议优化后重新检验
    │
    └─ 检验无效 (红色 banner)
        └─ [直接回测] 灰色, 返回编辑器修改公式
```

### 边界说明

- Lab **不执行回测** — 只跳转并预填参数, 回测引擎在 Backtest 模块
- 保持 Lab (因子层面统计检验) 和 Backtest (策略层面绩效评估) 的职责边界清晰
- 直接回测是 "快捷通道", 不是 "必经之路" — 用户也可以走 Lab → 入库 → 在 Backtest 手动选因子的传统路径

<!-- card: results -->

## 综合判定 Banner

8 步检验完成后, 顶部显示综合判定:

| 判定 | 条件 | 颜色 |
|---|---|---|
| **因子有效 — 可提交入库** | IC > 0.03 + t-stat > 2.0 + 分位收益单调 + 覆盖率 > 80% | 绿色 |
| **边缘因子 — 建议优化后重新检验** | IC > 0.02 或 t-stat > 1.5 | 黄色 |
| **因子无效 — 不建议使用** | 不满足以上 | 红色 |

banner 下方: 8 步检验各自的 ✅/⚠️/❌ 一行概要

**覆盖率警告**: 覆盖率 < 80% 时, 即使 IC/IR 达标, banner 仍追加 ⚠️ "覆盖率不足 (X%), 可能引入样本偏差, 建议检查因子公式或数据源"

> **多重检验校正** (P2): 当 Zoo 中因子数量 > 50 时, 传统 t > 2.0 (5% 显著性) 会产生大量假阳性。建议启用更严格阈值 t > 3.0 (Harvey, Liu, Zhu 2015) 或 Bonferroni/FDR 校正。MVP 阶段因子数量少, 2.0 够用。

---

## ① IC/IR 统计

**IC 计算方法**: 默认使用 **Rank IC (Spearman)** — 对因子值分布无假设, 受离群值影响小, 适合 A 股偏态+厚尾分布。可选 **Normal IC (Pearson)** 作为对照 (对线性关系更敏感, 但受极端值影响大)。两种 IC 并排展示。

| 指标 | 含义 | 基准 |
|---|---|---|
| IC 均值 | 因子预测能力 | > 0.03 有效 |
| IC 标准差 | 因子稳定性 | 越小越好 |
| IR | IC 均值/标准差 | > 0.5 优秀 |
| IC>0 占比 | 方向正确率 | > 55% |
| IC t-stat | 统计显著性 | > 2.0 显著 |
| IC 偏度 (Skewness) | IC 分布对称性 | 接近 0 为佳, 负偏 = 右尾风险 |
| IC 峰度 (Kurtosis) | IC 分布尾部厚度 | 接近 3 (正态), 过高 = 极端值驱动 |
| IC < 0 占比 | IC 为负的天数比例 | < 45% (即 IC 方向正确率 > 55%) |
| **因子覆盖率** | 有效 (非 NaN) 因子值的股票比例 | > 90% 绿, 80-90% 黄, < 80% 红 |

**覆盖率说明**: 覆盖率 = 因子值有效的股票数 / 股票池总数。低覆盖率意味着因子在大量股票上无法计算 (数据缺失、公式条件不满足等), 引入样本偏差。覆盖率低于 80% 时, 综合判定 banner 追加 ⚠️ "覆盖率不足, 可能引入样本偏差"。

附: IC 时序折线图 (mini chart, 240 日), Rank IC 与 Normal IC 双线对比

---

## ② 分位收益 & 多空分析

- Q1-Q5: 因子值五等分, 各组平均 T+1 收益柱状图
- 单调性检验: Q1<Q2<...<Q5 (或反向单调)
- 多空收益: Q5-Q1 累计收益曲线

**多空组合统计表** (MVP 新增):

| 指标 | 含义 | 基准 |
|---|---|---|
| 多空累计收益 | Q5-Q1 年化超额收益 | > 5% 有效, > 10% 优秀 |
| 多空 MaxDD | Q5-Q1 组合最大回撤 | < 20% 可控, < 10% 优秀 |
| 多空 IR | 多空超额 / 多空波动 | > 0.5 可用, > 1.0 优秀 |
| 多头收益占比 | Q5 收益 / (\|Q5\| + \|Q1\|) | 0.5-0.8 健康, >0.9 空头贡献不足 |

**新增图表 — 多空累计净值曲线** (与分位柱状图并列):
- X 轴: 回测日期, Y 轴: 累计净值 (从 1.0 开始)
- 主线: Q5-Q1 多空组合累计净值 (蓝色 `#6366f1`)
- 参考线: y=1.0 灰虚线
- MaxDD 区间标注: 红色半透明背景 + 回撤幅度标签
- 组件: ngx-charts LineChart, 容器高度 h-[200px]

---

## ③ IC 衰减 & 多持有期分析

**多持有期 IC 统计表** (参考 TEJ 因子研究范式):

| 持有期 | IC Mean | IC Std | IR | IC Skew | IC Kurt | IC<0% | 适用频率 |
|---|---|---|---|---|---|---|---|
| T+1 | — | — | — | — | — | — | 日频 |
| T+5 | — | — | — | — | — | — | 周频 |
| T+10 | — | — | — | — | — | — | 双周 |
| T+21 | — | — | — | — | — | — | 月频 |

每个持有期独立计算完整 IC 统计 (均值/标准差/IR/偏度/峰度/负值比例)。

附: T+1/5/10/21 IC 衰减折线图。快衰减 = 日频适用, 慢衰减 = 周频/月频适用。因子在不同持有期的 IR 差异可能比 IC 绝对值差异更有参考价值

**IC 半衰期** (MVP 新增):
- 定义: 从 T+1 IC 衰减至 50% 时对应的滞后天数
- 计算: 线性插值 `icDecayProfile` (T+1 到 T+20), 找到首次 IC < IC_T1 × 0.5 的 lag
- 显示: 数值 + 文字解读
  - 半衰期 ≤ 3 天: "快衰因子, 适合日频策略"
  - 半衰期 4-10 天: "中速衰减, 适合周频策略"
  - 半衰期 > 10 天: "慢衰因子, 适合月频策略"
- 用途: 指导调仓频率选择 — 半衰期短的因子必须高频调仓才能捕获 alpha, 否则信号已过期

---

## ③.5 因子持续性检验 (P2)

> **Tier**: P2 — 在 IC 衰减之后、正交检验之前插入

**因子自相关 (Factor Autocorrelation)**:
- 计算: 截面 Spearman 相关 — 今日因子值排名 vs 昨日因子值排名
- 含义: 衡量因子信号的稳定性 / 换手倾向

| 自相关区间 | 解读 | 影响 |
|---|---|---|
| > 0.85 | 因子高度稳定, 信号变化缓慢 | 换手低, 交易成本可控 |
| 0.5 — 0.85 | 中等稳定性 | 适中换手 |
| < 0.5 | 因子剧烈变化, 信号频繁翻转 | 换手高, 交易成本风险大 |

**与 Step ⑦ 换手率交叉验证**: 自相关低 + 换手高 = 一致, 因子天然高频。自相关高 + 换手高 = 矛盾, 可能是预处理 pipeline 引入的伪信号。

---

## ④ 正交检验

- 新因子 vs 已有 LIVE 因子: Pearson 相关性列表
- 增量 IC 贡献: 加入新因子后组合 IC 提升量
- 判定: 相关性 > 0.7 → "冗余, 不建议入库"

---

## ⑤ 条件 IC

- 按 Regime (HMM 4 态): 牛市 | 熊市 | 震荡 | 危机 下的 IC
- 按市值: 大盘 | 中盘 | 小盘 IC
- 按行业: 申万一级 31 个行业 IC
- 解读: "此因子在震荡市更有效" / "偏向小盘股"

> **P3 研究方向 — 因子舒适区**: 当前条件 IC 采用离散分箱 (大/中/小盘), 2025 年研究表明每个因子有连续型 "舒适区" (在哪些股票上最有效)。未来可输出每只股票的因子舒适度得分, 只在舒适区内使用该因子。

**P2 增强 — 条件 IC 衰减速率**:
- **IC 行业衰减速率**: 各行业 (申万一级 31 个) 的 IC 从 T+1 到 T+20 的衰减速度, 热力图展示 (X=滞后天数, Y=行业, 颜色=IC)
- **IC 市值衰减速率**: 大/中/小盘的 IC 衰减速度, 3 条衰减曲线叠加对比
- 用途: 判断因子在哪个子域最持久 — 例如 "此因子在小盘股半衰期仅 2 天, 但在大盘股半衰期 12 天" → 影响策略的股票池选择

---

## ⑥ 因子归因分析

**用途**: IC=0.04 是稳健信号还是被少数股票撑起的假信号? 归因分析帮用户判断因子的 "质量" 而非仅看 "数字"。

**行业贡献分解**:
- IC 按申万 31 行业分解, 柱状图展示各行业对总 IC 的贡献
- 识别: "IC 的 60% 来自计算机行业" → 行业集中度过高

**个股集中度**:
- Top 10 股票贡献了多少 IC? 超过 50% = 集中度过高警告
- 防止因子被 3-5 只大盘股的异常表现驱动

**市值归因**:
- 大盘/中盘/小盘各自的 IC 贡献
- 判断因子是否只在某个市值区间有效 → 影响容量评估

**Tier 标注**: 行业分解 = MVP (基础的分组 IC 计算), 个股集中度 = P2

---

## ⑦ 换手率与 A 股成本

**因子内在周转率** (P2):
- 每期因子十分位分组的平均周转率: 有多少股票从一个分位跳到另一个分位
- 高 IC + 高周转 = alpha 可能被交易成本吃掉
- 低周转因子 (如价值类) 天然比高周转因子 (如动量类) 有成本优势

**A 股交易成本模型**:

| 成本项 | 费率 |
|---|---|
| 佣金 | 万 2.5 (双边) |
| 印花税 | 千 1 (卖出) |
| 滑点 | 2-5bp |
| T+1 冲击 | 当日买入次日才能卖 |

净 IC = IC - 交易成本影响

---

## ⑧ 操作

- **提交到 Library**: 因子入库 (INCUBATING 状态)
- **▷ 直接回测**: 检验通过后激活, 跳转 `/factor/backtest?factorId=xxx&mode=quick`, 预填单因子等权策略 (详见 workbench expand)
- **重新迭代**: 返回编辑器修改公式
- **对比运行**: 与历史检验结果并排对比

> **直接回测启用条件**: 仅在综合判定 = 绿色 (因子有效) 后激活。否则灰色 + tooltip "请先完成因子检验且结果为有效"。

<!-- card: results:expand -->

## 检验步骤交互

每步可折叠展开 (默认展开前 3 步, 后 5 步折叠):
- 每步包含: 指标表格 + 一个关键图表 + 结论标签 (✅/⚠️/❌)
- IC/IR 统计: IC 时序折线图 (240 日)
- 分位收益: Q1-Q5 柱状图
- IC 衰减: T+1/3/5/10/20 折线图

---

## 结论自动判定规则

- **有效**: IC > 0.03 且 t-stat > 2.0 且分位收益单调 (Spearman > 0.8)
- **边缘**: IC > 0.02 或 t-stat > 1.5
- **无效**: 不满足以上任一条件

> **P2 研究方向 — 相对排名式筛选**: 当因子池扩大到 50+ 时, 可考虑从绝对阈值 (IC > 0.03) 切换为相对排名 (top 70% IC + top 70% IR + top 70% Sharpe), 逐层筛选, 避免市场环境变化导致全部因子不通过或全部通过。参考: 机器学习轮动多因子量化选股论文的三层筛选法。

---

## 单调性检验

- Spearman rank 相关性检验: 五分位组编号 vs 组均收益
- 完美单调 = 相关系数 +/-1.0, 实际 > 0.8 即可接受
- 非单调警告: 中间组异常突出可能暗示非线性关系

---

## 因子归因分析详解

### 行业 IC 分解

对每个行业 i, 计算行业内因子值与 T+1 收益的横截面 IC:
- `IC_industry_i = spearmanr(factor_values_in_industry_i, returns_in_industry_i)`
- 加权汇总: `IC_total ≈ Σ(weight_i × IC_industry_i)`, weight_i = 行业内股票数/总股票数
- 可视化: 31 行业柱状图, 按 IC 贡献排序

### 个股集中度 (P2)

- 计算每只股票对总 IC 的边际贡献 (leave-one-out IC drop)
- Top 10 贡献占比 > 50%: 红色警告 "因子依赖少数个股"
- 边际贡献可视化: 前 20 只股票的贡献柱状图

### 市值分层 IC

- 按总市值分为大盘 (Top 300) / 中盘 (301-800) / 小盘 (801+)
- 分别计算每层 IC + IR
- 表格展示: 市值层 / IC / IR / 股票数
- 常见模式: "小盘 IC=0.08, 大盘 IC=0.01" → 因子本质上是规模效应的变体

---

## A 股 T+1 成本模型

- 假设每次调仓换手 x%, T+1 约束导致部分仓位无法当日平仓
- 换手成本 = 换手率 × (佣金双边 0.05% + 卖出印花税 0.1% + 滑点 3bp)
- 净 IC 扣除: 从 raw IC 中减去每日换手成本对收益的拖累

---

## 检验通过工作流

检验通过后有两条并行路径:

```
综合判定 = 绿色 (因子有效)
    │
    ├─→ [▶ 提交入库]                        ← 入库路径 (长期验证)
    │     └─ Library (INCUBATING)
    │         └─ Monitor Paper Test 追踪
    │
    └─→ [▷ 直接回测]                        ← 快捷路径 (即时验证)
          └─ /factor/backtest?factorId=xxx&mode=quick
              └─ 预填单因子等权策略 → 运行回测 → 绩效报告
```

**入库路径**:
- "提交到 Library" 按钮 → 设为 INCUBATING → 进入 Monitor 的 Paper Test 流程
- 提交时记录: 因子表达式 / IC/IR 统计 / 正交检验结果 / 条件 IC 概况 / 归因概况
- 自动填充 Library 的因子卡片元数据
- 入库后因子在 Library 可见, 在 Monitor 开始 Paper Test 追踪

**直接回测路径** (详见 workbench expand "直接回测工作流"):
- 跳转 Backtest 页面, 预填当前因子 + 等权 + 沪深300 基准 + Lab 同期时间范围
- 用户可修改任何配置后运行
- Lab 不执行回测, 只是快捷跳转 + 参数预填
- 价值: 用户在 Lab 完成单因子检验后, 能立即验证 "这个因子做成策略能不能赚钱"

---

## IDE Shell — 剩余迁移任务

Phase 2 (Cell 换骨) 和 Pyodide cleanup 已合并。以下是 IDE shell 的补全工作:

### Chrome Header 功能接入

Chrome header 的 Menu/Settings/Power/Play 四个按钮接入实际功能:

| Icon | 功能 | 实现 |
|------|------|------|
| Menu | 切换左侧文件树显示/隐藏 | `onToggleFileTree` callback |
| Settings | 打开 marimo Settings 面板 | zustand → jotai bridge |
| Power | 断开/重连 kernel | reset labMode |
| Play | Run All Cells | zustand bridge → `useRunAllCells()` |

zustand store (`useLabModeStore`) 新增 `actions` 字段桥接 jotai hooks，因为 ChromeHeader 在 Provider 树外层。
LiveIDEBody 挂载时注册 jotai actions → ChromeHeader 从 store 读取调用。

### Add Cell 按钮

Cell 换骨移除了 `CellLeftSideActions`，需要新的 Mine 风格添加 cell UI:
- 低透明度虚线边框卡片，hover 增强
- 点击创建 Python cell，支持 Markdown/SQL 下拉
- 替换 cell-array.tsx 的 footer（lab mode 条件）

### File Tree 真实化 (Phase 3)

用 Magic UI file-tree 组件替换手写递归 MineFileTree:
- 断连态: Magic UI Tree 渲染 DEFAULT_FILES mock 数据
- 连接态: 从 marimo `treeAtom` (RequestingTree) 读取真实文件系统数据
- MineAppChrome 负责数据转换和注入

### File Tree 视觉优化

文件树组件视觉质感改进:
- 文件夹图标半填充效果 (`fill="currentColor" fillOpacity={0.12}`)，增加图标质感
- 字体层级: 目录 14px `font-medium`，文件 14px 常规字重
- 行间距收紧 (`gap-0.5`, `py-0.5`)，更紧凑
- 工具栏 (新建文件/文件夹/上传/刷新/隐藏/折叠) 始终可见，位于面板标题下方树内容顶部
- 面板标题保留 "Files" 文本 (由 ContentFrame title prop 渲染)
- 移除了原来的 "PROJECT" 标签

### Data Catalog 面板重设计

数据目录面板从卡片式改为手风琴式三级层级:
- L1 类别头 (白底): 类别名 + 数量 + 折叠箭头
- L2 数据源行 (浅灰底 `bg-mine-bg/70`): 源名称 + 中文名
- L3 描述卡 (白底纸质圆角卡 `bg-white rounded-lg shadow-xs`): 2-3 句详细描述
- 数据源扩充至 38 个，基于 AkShare 数据字典，覆盖 6 个分类

### 预览态统一 (Preview ↔ Connected 一致性)

断连预览态对齐连接态布局:
- 移除 `StaticEditorContent` 中硬编码的 FactorPreviewPanel 右侧边栏
- 右侧面板默认打开 Data Catalog (`snippets`) 而非 null
- 面板路由 `DisconnectedContent` 增加 `snippets` case 直接渲染 DataCatalogPanel (纯静态 mock 数据)
- Tab bar 断连态显示 `welcome.py` (单 tab) 替代之前的 factor.py + factory.py 双 tab
- Demo 代码更新为完整因子分析教程 (imports → 因子定义 → IC 生成 → 分位收益 → IC 衰减)
