# /team 工作流全图

> 你了解 /team 工作流的入口。所有细节见 `.claude/` 目录下的对应文件。

```mermaid
flowchart TD
    Start["用户: /team 需求描述"] --> Load

    subgraph Load["加载上下文"]
        L1["coordination.md\n+ REGISTRY.md"] --> L2["扫描 docs/plans/\n匹配已有 plan"]
    end

    Load --> S0

    subgraph S0["Step 0: 需求简报"]
        S0a["Lead 写简报\n目标/约束/不做/关联/规模"] --> S0b{"用户确认？"}
        S0b -->|"补充"| S0a
        S0b -->|"OK"| S0c{"规模？"}
        S0c -->|"S"| GoS["→ Step 2"]
        S0c -->|"M / L"| GoM["→ Step 1"]
    end

    GoS --> S2
    GoM --> S1

    subgraph S1["Step 1: Plan (M/L)"]
        S1a{"需求模糊？"}
        S1a -->|"YES"| S1b["/ce:brainstorm"]
        S1a -->|"NO"| S1d
        S1b --> S1d["/ce:plan → design.md"]
        S1d --> S1e

        subgraph S1R["Plan Review ≤2 轮"]
            S1e["加载 agents/qpm.md + qa.md\nPM + QA 并行 review"] --> S1f{"阻塞项？"}
            S1f -->|"NO"| S1g["Plan 定稿"]
            S1f -->|"YES ≤2轮"| S1h["修 plan"] --> S1e
            S1f -->|"YES >2轮"| S1j["升级用户 → 讨论"] --> S1e
        end
    end

    S1 --> UI{"涉及 UI？"}
    UI -->|"NO"| S2
    UI -->|"YES"| S15

    subgraph S15["Step 1.5: 设计稿 (M/L)"]
        S15load["加载 workflows/design-system.md"] --> S15scan["资产扫描\nget_variables + batch_get(reusable)\n+ REGISTRY.md"]
        S15scan --> S15tag["标注: 复用 / 扩展 / 新建"]
        S15tag --> S15build["新建原子 → ref 组装 → Screen"]
        S15build --> S15ss["get_screenshot"]
        S15ss --> S15rev{"用户 review\n(Pencil 桌面端)"}
        S15rev -->|"修改"| S15build
        S15rev -->|"OK"| S15done["写入 plan doc\npencil-file + pencil-node"]
    end

    S15 --> S2

    subgraph S2["Step 2: 实现"]
        S2a["读 plan doc → Pencil spec\nbatch_get + get_screenshot"] --> S2b["/ce:work\n前端按设计稿 + 后端按 plan"]
        S2b --> S2c["新 L1/L2 → REGISTRY.md + tokens.pen"]
    end

    S2 --> Size2{"规模？"}
    Size2 -->|"S"| S4
    Size2 -->|"M/L"| S25

    subgraph S25["Step 2.5: 对齐验证 (M/L)"]
        S25load["加载 workflows/design-sync.md\n+ design-system.md"] --> S25exec["独立 review agent 执行\ndesign-sync review"]
        S25exec --> S25check["属性级对比 + snapshot_layout\n+ 双端截图 + ref 核查"]
        S25check --> S25r{"结果？"}
        S25r -->|"PASS"| S25done["代码成为 Source of Truth"]
        S25r -->|"FAIL ≤2轮"| S25fix["builder 修正"] --> S25exec
        S25r -->|"WARN"| S25warn["记录 AUDIT.md"] --> S25done
    end

    S25 --> S3

    subgraph S3["Step 3: 验收 (M/L)"]
        S3a["/ce:review\n6 reviewer agents"] --> S3b["加载 agents/qpm.md + qa.md\nPM + QA 并行验收"]
        S3b --> S3c{"结果？"}
        S3c -->|"通过"| S3done["验收完成"]
        S3c -->|"bug ≤2轮"| S3fix["修复 → 重测"] --> S3b
        S3c -->|"设计级问题"| BackDesign["→ Step 1.5\n重走 2→2.5→3"]
        S3c -->|"Plan 级问题"| BackPlan["→ Step 1\n重走 1.5→2→2.5→3"]
        S3c -->|">2轮"| S3esc["升级用户"]
    end

    BackDesign --> S15
    BackPlan --> S1
    S3 --> S4

    subgraph S4["Step 4: 收尾"]
        S4a["全量回归\ntest + lint + build"] --> S4b{"M/L？"}
        S4b -->|"YES"| S4c["PM 产出 guides"]
        S4b -->|"S"| S4skip[" "]
        S4c --> S4d["design-sync reverse\n代码 → 回写 tokens.pen"]
        S4skip --> S4d
        S4d --> S4e["通知用户"]
    end

    S4 --> S5{"L 或有踩坑？"}
    S5 -->|"YES"| Compound
    S5 -->|"NO"| Done["完成"]

    subgraph Compound["Step 5: 即时复利"]
        C1["/ce:compound\n→ docs/solutions/"] --> C2["发现 → 立刻改对应文件\nagents/ rules/ workflows/\ncommit 标注 [compound]"]
    end

    Compound --> Done

    style S0 fill:#f8f9fa,stroke:#dee2e6
    style S1 fill:#fff3cd,stroke:#ffc107
    style S15 fill:#fff3cd,stroke:#ffc107
    style S2 fill:#d4edda,stroke:#28a745
    style S25 fill:#cce5ff,stroke:#007bff
    style S3 fill:#f8d7da,stroke:#dc3545
    style S4 fill:#d4edda,stroke:#28a745
    style Compound fill:#e2d5f1,stroke:#6f42c1
```

## 文件结构速查

```
.claude/
├── commands/team.md         ← 唯一用户命令（/team）
├── rules/                   ← 始终加载
│   ├── product-vision.md
│   └── component-design-system.md
├── agents/                  ← 按需注入 subagent
│   ├── qpm.md
│   ├── qa.md
│   └── quant-domain-reviewer.md
└── workflows/               ← 按需加载
    ├── coordination.md      ← 协调规则
    ├── design-system.md     ← 换算表 + 组件规范
    └── design-sync.md       ← 像素级对齐

docs/team/workflow-diagram.md ← 本文件（你在这里）
```

## 规模分级速查

| 规模 | Step 0 | Step 1      | Step 1.5 | Step 2              | Step 2.5           | Step 3      | Step 4              | Step 5       |
| ---- | ------ | ----------- | -------- | ------------------- | ------------------ | ----------- | ------------------- | ------------ |
| S    | 简报   | -           | -        | 实现                | -                  | -           | 回归 + reverse sync | 如有发现     |
| M    | 简报   | Plan+Review | 设计稿   | 实现+注册           | design-sync review | Review+验收 | 回归+guides+reverse | 即时复利     |
| L    | 简报   | Plan+Review | 设计稿   | 实现+注册(worktree) | design-sync review | Review+验收 | 回归+guides+reverse | /ce:compound |

## 退出条件

| 循环          | 位置     | 参与者         | 退出条件           | 硬上限              |
| ------------- | -------- | -------------- | ------------------ | ------------------- |
| Plan review   | Step 1c  | PM + QA + 用户 | 三方共识, 无阻塞项 | 2 轮/批, 升级后重置 |
| 设计稿 review | Step 1.5 | 用户 + Lead    | 用户确认 OK        | 无 (用户主导)       |
| 对齐验证      | Step 2.5 | Review agent   | 无 FAIL            | 2 轮修正            |
| 验收          | Step 3b  | PM + QA        | 全部通过           | 2 轮, 超过升级用户  |
