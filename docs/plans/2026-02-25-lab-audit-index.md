# Lab Editor 审计拆分计划索引

> 来源：`docs/lab-migration-issues.md`（Codex 审计，2026-02-24）
> 拆分日期：2026-02-25
> 状态：每个 plan 独立评审 → 确认 → 实施

## 实施原则

1. **减法优先**：先删重复入口和 placeholder，再补核心能力
2. **后端收口优先**：先做安全/隔离后端改造，再去前端补丁
3. **每次只推一个**：逐个评审确认，不一股脑展开
4. **已完成的不重做**：ERR Batch A 已 done，从 Batch B 继续

## Plan 列表

### 一、基础设施 & 安全

| #   | Plan 文件                                  | 审计 ID                                             | 优先级 | 状态 |
| --- | ------------------------------------------ | --------------------------------------------------- | ------ | ---- |
| 1   | `lab-audit-01-auth-runtime.md`             | Issue#1, Issue#2                                    | P0     | todo |
| 2   | `lab-audit-02-workspace-security.md`       | WORKSPACE-REDIRECT-001, WORKSPACE-SECURITY-PLAN-001 | P0     | todo |
| 3   | `lab-audit-03-session-binding.md`          | Issue#3, Issue#4, Issue#5, SESS-STATUS-001          | P1     | todo |
| 4   | `lab-audit-04-vibe-editor-tests.md`        | Issue#6                                             | P1     | todo |
| 5   | `lab-audit-05-connection-observability.md` | GAP-BE-004, §9.2 矩阵                               | P2     | **done** — Chrome header 轮询 /api/status, 显示 version/Python/LSP 状态 |

### 二、面板架构治理

| #   | Plan 文件                                | 审计 ID                           | 优先级 | 状态                                                                                              |
| --- | ---------------------------------------- | --------------------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| 6   | `lab-audit-06-panel-arch-convergence.md` | PANEL-ARCH-001~005, §55           | P0     | **done** — `panels.ts` + `PanelSlot` + `PanelShell` + `PanelContent` + `PanelButton` 统一架构落地 |
| 7   | `lab-audit-07-entry-cleanup.md`          | PANEL-ARCH-003, §54.4 Remove 清单 | P1     | **done** — ActivityBar 由 `panels.ts` 驱动，旧 `sidebar.tsx` 已删                                 |

### 三、面板功能落地

| #   | Plan 文件                                 | 审计 ID                                                     | 优先级 | 状态                                                                                                   |
| --- | ----------------------------------------- | ----------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| 8   | `lab-audit-08-terminal-v1.md`             | PANEL-TERM-001, §5, §10, §15                                | P0     | **done** — `BottomSlot` mount-once xterm + 拖拽高度调节                                                |
| 9   | `lab-audit-09-ai-panel.md`                | PANEL-AI-001, §22                                           | P0     | **done** — T1 路由+T3 MCP 已由 #6 顺带完成; T2 输出动作(insert cell/send terminal)延后与 #12 DataHub 联动 |
| 10  | `lab-audit-10-errors-batch-bc.md`         | ERR-205~208, §29                                            | P1     | **done** — 结构化渲染(traceback/SQL/cycle/多定义), interruption 过滤, View logs 链接, 回归测试 13 pass |
| 11  | `lab-audit-11-run-console.md`             | PANEL-LOG-001, PANEL-RUNCONSOLE-001, PANEL-LEFT-001, §26~27 | P0     | **done** — 独立底部面板 (Terminal/Logs), VT LogsPanel 三源聚合, errors→logs 联动, 高度/面板记忆持久化  |
| 12  | `lab-audit-12-datahub.md`                 | PANEL-DS-001, DATAHUB-ARCH-001, §23, §49                    | P0     | todo                                                                                                   |
| 13  | `lab-audit-13-variables-consolidation.md` | PANEL-VAR-SESSION-001, §48                                  | P1     | todo                                                                                                   |
| 14  | `lab-audit-14-files-consolidation.md`     | PANEL-FILES-001, §45                                        | P0     | **done** — Magic UI file tree + marimo treeAtom 绑定 + WebStorm 工具栏                                 |
| 15  | `lab-audit-15-notebook-map.md`            | PANEL-OUT-001, PANEL-GRAPH-001, §42~43                      | P1     | **done** — Outline 注册为独立面板, FloatingOutline 删除, Zustand 旧版清理                              |
| 16  | `lab-audit-16-secrets.md`                 | PANEL-SEC-001, PANEL-SEC-002, §38~39                        | P1     | **done** — V1 入口+UI, V2 删除闭环, V3 upsert+rotate+值预览 全部完成                                   |

### 四、新能力系统

| #   | Plan 文件                          | 审计 ID                                                                 | 优先级 | 状态 |
| --- | ---------------------------------- | ----------------------------------------------------------------------- | ------ | ---- |
| 17  | `lab-audit-17-template-system.md`  | §8, §11, SNIP-BUILDER-001, SNIP-STATE-001, SNIP-UX-001, SNIP-SOURCE-001 | P0     | todo |
| 18  | `lab-audit-18-mcp-isolation.md`    | MCP-ARCH-002, MCP-SCOPE-001, MCP-ISO, §33~36                            | P1     | todo |
| 19  | `lab-audit-19-export-script.md`    | GAP-BE-003                                                              | P1     | **done** — exportAsScript 网络层 + Activity Bar ⋯ 按钮导出菜单 (Script/HTML/Markdown/PDF) |
| 20  | `lab-audit-20-new-capabilities.md` | NEW-001~004                                                             | P0~P1  | todo |

### 已暂缓（不单独建 plan）

| 能力          | 审计 ID         | 决策                   | 理由                                     |
| ------------- | --------------- | ---------------------- | ---------------------------------------- |
| Scratchpad    | PANEL-SP-001    | **removed**            | 前后端全删，`8b8301f`                    |
| Cache 面板    | PANEL-CACHE-001 | defer → CACHE-CELL-001 | 改为 cell 级缓存开关，不做侧栏面板       |
| Documentation | PANEL-DOC-001   | **removed**            | 面板壳已删，保留 CSS/atom/API，`8b8301f` |
| Tracing       | PANEL-TRACE-001 | **removed**            | 前后端全删含 `_tracer.py`，`8b8301f`     |

## 建议实施顺序

**第一批（P0 基础）**：~~#6 面板架构收敛~~ ✅ → ~~#7 入口清理~~ ✅ → ~~#8 Terminal~~ ✅
**第二批（P0 核心）**：#9 AI 面板 → ~~#11 Run Console~~ ✅ → ~~#14 Files 收敛~~ ✅
**第三批（P0 数据）**：#12 DataHub → #1 鉴权/Runtime → #2 Workspace 安全
**第四批（P1 增强）**：#10 Errors B/C → #13 Variables → #15 Notebook Map → #16 Secrets
**第五批（P1 系统）**：#17 Template 系统 → #18 MCP 隔离 → #20 新能力
**第六批（P1/P2）**：#3 Session → #4 测试 → #5 可观测 → #19 Export
