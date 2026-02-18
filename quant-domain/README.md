# 量化金融领域知识库

Vibe Trading 项目的**唯一量化领域知识权威源**。支持产品决策、功能设计和 Blueprint PRD 撰写。

## 目录结构

```
quant-domain/
├── README.md                           ← 本文件
├── references.md                       # 10 篇论文引用索引
│
├── foundations/                         # 产品级基础概念
│   ├── factor-lifecycle.md             # 因子生命周期 5 状态 + 衰减检测
│   ├── resonance-model.md             # 六维共振模型
│   └── performance-thresholds.md      # IC/IR/Sharpe/Sortino/MaxDD 阈值
│
├── factor-analysis/                    # Alpha 研究、构建与评价
│   ├── evaluation.md                  # 评价指标 + PSR/DSR/MinTRL + Factor Zoo
│   ├── construction.md                # 因子定义 + 依赖分类 + 算子表 + 位置/速度/加速度
│   ├── preprocessing.md               # 预处理公式速查（去极值/标准化/中性化）
│   ├── causality.md                   # 因果因子投资（López de Prado 系列）
│   ├── innovation-directions.md       # 10 大创新方向索引
│   └── nonlinear-characteristics.md   # 非线性特征处理
│
├── backtesting-methodology/            # 回测方法论
│   ├── execution.md                   # 向量化引擎 + 撮合逻辑 + 偏误清单
│   └── costs.md                       # 滑点模型公式 + 盈亏平衡 IC
│
├── market-microstructure/              # 市场微观结构
│   ├── auction.md                     # A 股竞价机制（集合/连续/订单类型）
│   ├── data-levels.md                 # L1/L2 行情层级 + Bar 合成
│   ├── high-frequency-factors.md      # 高频因子（ILLIQ/VPIN/BSI/OIB）
│   └── industry-specific.md           # 行业特有因子图谱
│
└── risk-management/                    # 风险管理（P2，待填充）
    └── .gitkeep
```

## Blueprint 映射

| 知识主题 | Blueprint 模块 | 相关 Tab |
|---|---|---|
| foundations/ | `factor`, `dashboard` | Monitor, Overview |
| factor-analysis/ | `factor` | Lab, Library, Monitor |
| backtesting-methodology/ | `factor` | Backtest |
| market-microstructure/ | `market` | Auction, Capital |
| risk-management/ | `dashboard`, `risk` | Tech, Exposure |

## 论文来源

本库内容主要提炼自 10 篇论文，详见 [references.md](./references.md)。

核心来源：
- **López de Prado 因果系列** (6 篇, 2022-2026) — 因果因子投资、PSR/DSR、Factor Zoo
- **Feng, Giglio & Xiu (2020)** — "Taming the Factor Zoo", Double-LASSO
- **王雄 (深圳大学)** — 因子创新方向、构建逻辑
- **学位论文** — ML 经验加权公式

## 提炼原则

- **代码无关性**: 侧重逻辑和公式，不依赖特定库
- **可落地性**: 提取能直接转写为 PRD 需求的信息
- **公式速查**: 预处理/成本等工具性文件以速查卡格式呈现
- **引用溯源**: 通过 `[references.md #N]` 标注论文来源
