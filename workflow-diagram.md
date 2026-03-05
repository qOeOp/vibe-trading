# /team 工作流全图

## 主流程

```mermaid
flowchart TD
    Start["用户提需求"] --> S0

    subgraph S0["Step 0: 需求简报"]
        S0a["Lead 写 ≤200字简报"] --> S0b{"用户确认？"}
        S0b -->|"补充"| S0a
        S0b -->|"OK"| S0c["简报定稿"]
    end

    S0 --> S1

    subgraph S1["Step 1: Plan"]
        S1a{"需求模糊？"}
        S1a -->|"YES"| S1b["/ce:brainstorm 与用户对话"]
        S1a -->|"NO"| S1c["skip, 记录 retro-log"]
        S1b --> S1d["/ce:plan 产出 design.md"]
        S1c --> S1d
        S1d --> S1e["PM + QA 并行 review"]
        S1e --> S1f{"有阻塞项？"}
        S1f -->|"NO"| S1g["Plan 定稿"]
        S1f -->|"YES"| S1h["修改 plan, 第 2 轮 review"]
        S1h --> S1i{"仍有阻塞？"}
        S1i -->|"NO"| S1g
        S1i -->|"YES"| S1j["升级给用户"]
        S1j --> S1k["用户 + Lead 讨论, 更新 plan"]
        S1k --> S1e
    end

    S1 --> UI{"涉及 UI 变更？"}
    UI -->|"NO"| S2
    UI -->|"YES"| S15

    subgraph S15["Step 1.5: 设计稿"]
        S15a{"路径？"}
        S15a -->|"A: 用户有 Figma"| S15b["get_design_context 读取"]
        S15a -->|"B: 从零设计"| S15c["Lead 写 HTML 设计稿\n+ 设计说明\n+ 外部参考链接"]
        S15a -->|"C: 改造现有"| S15d["capture 当前页面\n→ 用户标注改动"]
        S15d --> S15c
        S15c --> S15e["import-html → Figma"]
        S15e --> S15f{"用户 review"}
        S15f -->|"修改意见"| S15c
        S15f -->|"OK"| S15g["用户提供 Figma 链接"]
        S15b --> S15g
    end

    S15 --> S2

    subgraph S2["Step 2: 实现"]
        S2a["get_design_context\n读取确认版 spec"] --> S2b["/ce:work\n前端按设计稿\n后端按 plan"]
    end

    S2 --> S3

    subgraph S3["Step 3: 验收"]
        S3a["/ce:review\n6 reviewer agents"] --> S3b["PM + QA 并行验收"]
        S3b --> S3c{"结果？"}
        S3c -->|"全部通过"| S3d["验收完成"]
        S3c -->|"bug"| S3e["修复 → 重测"]
        S3e --> S3f{"≤2 轮？"}
        S3f -->|"YES"| S3b
        S3f -->|"NO"| S3g["升级给用户"]
        S3c -->|"设计缺陷"| S1
    end

    S3 --> S4

    subgraph S4["Step 4: 收尾"]
        S4a["全量回归\ntest + lint + build"] --> S4b["capture 最终页面\n→ Figma 存档"]
        S4b --> S4c["PM 产出操作说明"]
        S4c --> S4d["通知用户: 功能就绪"]
    end

    S4 --> S5

    subgraph S5["Step 5: Compound"]
        S5a["/ce:compound\n→ solutions/*.md"] --> S5b["retro-log 更新"]
    end
```

## 三个循环

```mermaid
flowchart LR
    subgraph L1["Loop 1: Plan Review"]
        direction TB
        PR1["PM/QA review"] --> PR2{"阻塞？"}
        PR2 -->|"NO"| PR3["通过"]
        PR2 -->|"YES"| PR4["修 plan → 第2轮"]
        PR4 --> PR5{"仍阻塞？"}
        PR5 -->|"NO"| PR3
        PR5 -->|"YES"| PR6["升级用户 → 讨论"]
        PR6 -->|"轮次重置"| PR1
    end

    subgraph L2["Loop 2: 设计稿 Review"]
        direction TB
        DR1["Lead 写 HTML\n+ 说明 + 参考链接"] --> DR2["推 Figma"]
        DR2 --> DR3{"用户 OK？"}
        DR3 -->|"修改意见"| DR1
        DR3 -->|"OK"| DR4["确认, 给链接"]
    end

    subgraph L3["Loop 3: 验收"]
        direction TB
        VR1["PM/QA 验收"] --> VR2{"通过？"}
        VR2 -->|"YES"| VR3["完成"]
        VR2 -->|"bug"| VR4["修复 → 重测\n≤2 轮"]
        VR4 --> VR1
        VR2 -->|"设计缺陷"| VR5["回 Step 1"]
    end
```

## Figma 数据流

```mermaid
flowchart LR
    subgraph Design["设计阶段"]
        H["Lead 写 HTML"] -->|"import-html"| F1["Figma Screens\n(设计稿)"]
        F1 -->|"用户 review"| H
        F1 -->|"OK"| F2["确认版节点"]
    end

    subgraph Implement["实现阶段"]
        F2 -->|"get_design_context"| Code["代码实现"]
    end

    subgraph Archive["收尾阶段"]
        Code -->|"generate_figma_design"| F3["Figma Screens\n(存档, 标日期)"]
    end

    style F1 fill:#fff3cd,stroke:#ffc107
    style F3 fill:#d4edda,stroke:#28a745
```

## 退出条件总结

| 循环 | 位置 | 参与者 | 退出条件 | 硬上限 |
|------|------|--------|----------|--------|
| Plan review | Step 1c | PM + QA + 用户 | 三方共识, 无阻塞项 | 2 轮/批, 升级后重置 |
| 设计稿 review | Step 1.5 | 用户 + Lead | 用户确认 OK + 提供 Figma 链接 | 无 (用户主导) |
| 验收 | Step 3b | PM + QA | 全部通过 | 2 轮, 超过升级用户 |
