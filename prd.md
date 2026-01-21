# 📄 PRD: AI Investment Research & Monitoring Platform (v10.0)
*Type: Master Specification | Status: **Frozen** | Scope: Knowledge -> Mining (Alpha/Risk) -> Stress Test -> Lifecycle -> Monitor*

## 1. 核心设计哲学 (Core Philosophy)
基于 **System 1 / System 2** 理论与 **反脆弱 (Anti-Fragility)** 设计：
1.  **System 2 (慢思考 - 投研):** 负责研报阅读、Alpha与风险模型挖掘、全生命周期管理。
2.  **System 1 (快反应 - 监控):** 负责日内分钟级行情监控、异动报警、快速解说。
3.  **反脆弱 (Robustness):** 引入**对抗性压力测试**和**数学风控模型**，确保系统在极端行情下存活。

---

## 2. 系统全景架构 (Global Architecture)

新增了 **Plugin C (Risk)** 和 **Torture Chamber (压力测试)**。

```mermaid
graph TD
    %% L1: Knowledge
    subgraph "L1: Knowledge Center (知识中台)"
        Crawler[Paper/Report Crawler]
        Librarian[The Librarian Agent]
    end

    %% L2: Decision
    subgraph "L2: Decision Brain (大脑)"
        Strategist[Chief Strategist]
        Memory[(Global Vector DB)]
    end

    %% L3: R&D Engine
    subgraph "L3: Pluggable R&D Engine (插件层)"
        Router[Task Dispatcher]
        Plugin_A[Plugin: CogAlpha (7-Level Alpha)]
        Plugin_B[Plugin: RD-Agent (Alpha)]
        Plugin_C[Plugin: Risk Modeler (SDE/VaR)]
    end

    %% L4: QC & Lifecycle
    subgraph "L4: Gatekeeper (质控)"
        Torture[Torture Chamber (Stress Test)]
        OOS_Test[OOS Blind Test]
        FLM[Factor Lifecycle Manager]
    end

    %% L5: Execution/Selection
    subgraph "L5: Selection & Risk"
        Live_Factors[Alpha Factors]
        Risk_Models[Risk Models]
        Stock_Pool[Selected Stock Pool]
    end

    %% L6: Intraday Monitor
    subgraph "L6: Smart Monitor (System 1)"
        Stream[Minute Data Stream]
        Watcher[Intraday Monitor]
        Fast_LLM[Fast Analyst]
    end

    %% Flows
    Crawler --> Librarian --> Strategist
    Strategist --> Router --> Plugin_A & Plugin_B & Plugin_C
    Plugin_A & Plugin_B & Plugin_C --> Torture --> OOS_Test --> FLM
    FLM --> Live_Factors & Risk_Models
    Live_Factors & Risk_Models --> Stock_Pool
    Stock_Pool --> Watcher
    Stream --> Watcher --> Fast_LLM --> User
```

---

## 3. 详细功能模块与机制 (Detailed Modules & Mechanisms)

### 模块 A: 知识中台 (Knowledge Center)
*覆盖：研报爬取、灵感提取*

*   **1. 智能爬虫 (The Crawler):**
  *   每日 02:00 爬取 ArXiv (Quant), 研报, 雪球深度文。支持手动上传 PDF/URL。
*   **2. 研报分析师 (The Librarian Agent):**
  *   解析 PDF，提取数学逻辑。
  *   **核心功能:** 将自然语言转化为 `Hypothesis JSON` (e.g., "基于成交量衰减的Alpha" 或 "基于GARCH的波动率模型")。
  *   **交互:** 界面提供 **"一键转挖掘任务"**。

### 模块 B: 插件式研发引擎 (Pluggable R&D Engine)
*覆盖：CogAlpha, RD-Agent, **Risk Modeler (New)**, 插件协议*

*   **3. 统一插件协议 (Standard Protocol):**
  *   **Input:** `Task_JSON` (含 `task_type`: "alpha"|"risk", `time_split`, `hypothesis`).
  *   **Output:** `Artifact_Package` (Code, Logic, Metrics).
  *   **扩展性:** 支持未来接入任意新框架。

*   **4. 插件 A: CogAlpha (认知派 Alpha):**
  *   **7层路由:** 1.周期, 2.尾部风险, 3.量价, 4.波动, 5.分形, 6.择时, 7.几何。
  *   **进化:** Mutation & Crossover 算子。
  *   **内审:** `Judge Agent` (查未来函数) + `Code Repair Agent`。

*   **5. 插件 B: Microsoft RD-Agent (工程派 Alpha):**
  *   Generator -> Simulator -> Refiner 闭环。暴力搜索。

*   **6. 插件 C: Risk Modeler (风控派) [NEW]:**
  *   **职责:** 挖掘描述市场风险的数学模型，而非选股因子。
  *   **目标:** `Predict(Volatility)` 或 `Predict(Correlation)`。
  *   **方法:** 基于 *Estimating Market Risk* 论文，利用 LLM 发现 **SDE (随机微分方程)** 或 **动态 VaR 公式**。
  *   **产出:** 例如 `def calc_dynamic_stoploss(df): return df['volatility'].rolling(20).std() * 3`。

### 模块 C: 严密质控体系 (Rigorous QC System)
*覆盖：双重回测、**对抗性压力测试 (New)**, 数据隔离*

*   **7. 物理时间切分 (Physical Time Splitting):**
  *   Train (2020-2024) vs Blind/OOS (2025+). 物理隔离。

*   **8. 酷刑室 (The Torture Chamber) [NEW]:**
  *   **理论:** 基于 *TradeTrap* 论文。
  *   **机制:** 在进入盲测前，先让因子跑一段**人工合成的极端数据**。
    *   *Scenario A:* **Flash Crash** (瞬间暴跌 30%) -> 因子是否发出错误的“满仓抄底”信号？
    *   *Scenario B:* **Fake News** (注入极度利好但价格不动) -> 因子是否由于过拟合舆情而乱买？
  *   **标准:** 若在极端环境下回撤失控，直接**枪毙**。

*   **9. 衰减检查 (Deflation Check):**
  *   `Score = OOS_Sharpe / Train_Sharpe`. 若 < 0.6 拒收。

### 模块 D: 全生命周期管理 (Factor Lifecycle Manager)
*覆盖：5阶段状态机, 模拟盘, 实盘*

*   **10. 五阶段状态机 (The 5 Stages):**
  *   `INCUBATING`: 刚产出。
  *   `PAPER_TEST`: 通过酷刑室和盲测，进入**7天模拟盘** (接实盘流空跑)。
  *   `LIVE_ACTIVE`: 模拟达标，分配实盘权重。
  *   `PROBATION`: 回撤 > 10%，暂停开仓。
  *   `RETIRED`: 彻底失效，归档。

*   **11. 晋升与淘汰:**
  *   `Paper` -> `Live`: 7日收益 > 0 且无报错。
  *   `Probation` -> `Retired`: 30天无起色。

### 模块 E: 智能监控与快系统 (System 1 Monitor)
*覆盖：日内监控, Fast LLM, 日线选股*

*   **12. 选股与池化 (Daily Selection):**
  *   09:00 使用 `Live` 状态的 Alpha 因子打分，结合 Plugin C 产出的 Risk 模型剔除高风险股。选出 Top 10。

*   **13. 日内监控器 (Intraday Monitor):**
  *   接入分钟 WebSocket。计算 RSI, VWAP。**无 LLM 介入**。

*   **14. 极速分析师 (Fast Analyst):**
  *   **模型:** GPT-3.5/Haiku。
  *   **触发:** 异动 (涨跌幅>2%)。
  *   **输出:** "NVDA 急跌，击穿 VWAP..."。

### 模块 F: 进化与记忆 (Evolution)
*覆盖：反思, 向量库*

*   **15. 记忆与闭环:**
  *   Episodic/Semantic/Procedural Memory.
  *   每日盘后 `Evolution Manager` 复盘，更新 Strategist Prompt。

---

## 4. 前端交互设计 (The AI Cockpit)

### 页面 A: 知识库 (Library)
*   研报列表、PDF 解析、**"转 Alpha 任务"** / **"转 Risk 任务"** 按钮。

### 页面 B: 研发实验室 (The Lab)
*   **Chat:** 指挥 Strategist。
*   **Kanban:** 5 阶段漏斗看板。
*   **Test Report:**
  *   Tab 1: 训练集曲线。
  *   Tab 2: OOS 盲测曲线。
  *   **Tab 3: 酷刑室报告 (Stress Test):** 展示在“人工崩盘”数据下的表现（通过/失败）。

### 页面 C: 智能监控台 (Monitor)
*   自选股列表。
*   分钟 K 线。
*   **Live Feed:** Fast Analyst 实时解说流。

---

## 5. 智能体角色完整矩阵 (The Full Agent Matrix)

| 组别 | 角色名 | 核心职责 | System |
| :--- | :--- | :--- | :--- |
| **知识** | **Librarian** | 读研报，提灵感 | Sys 2 |
| | **Info Analyst** | 读新闻，产出情绪因子 | Sys 2 |
| **决策** | **Chief Strategist** | 总指挥 (Alpha方向/风控方向) | Sys 2 |
| | **Evolution Manager** | 盘后复盘，记忆更新 | Sys 2 |
| **研发** | **Router Agent** | 任务分发 | Sys 2 |
| | **CogAlpha Squad** | 7层 Alpha 挖掘 + 内审 | Sys 2 |
| | **RD-Agent** | 微软工程化 Alpha 挖掘 | Sys 2 |
| | **Risk Modeler** | **[New]** SDE/VaR 数学公式挖掘 | Sys 2 |
| **质控** | **Torturer** | **[New]** 对抗性压力测试 (造假数据) | Sys 2 |
| | **Gatekeeper (FLM)** | OOS盲测 + 生命周期管理 | Sys 2 |
| **监控** | **Intraday Monitor** | 分钟异动计算 (No-LLM) | Sys 1 |
| | **Fast Analyst** | 异动快速解说 (Fast LLM) | Sys 1 |
| **执行** | **Trade Executor** | 交易/选股执行 | Sys 1 |

---

## 6. 技术栈 (Tech Stack)

*   **Backend:** Python (FastAPI), Celery.
*   **DB:** PostgreSQL (State), Milvus (Memory).
*   **Data:** Qlib (Daily Binaries), WebSocket (Minute).
*   **Compute:** Docker Plugins.
*   **Math:** `scipy`, `numpy` (用于 Risk Modeler 的 SDE 拟合).

---
