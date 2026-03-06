# Identity Header 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **上游约束:** `docs/plans/2026-03-03-factor-data-architecture.md` §1, §2.6, §3.1, §5

**Goal:** 重构因子详情侧边栏 Identity Header，移除冗余信息（name/tags/badge/手动状态变更），新增 Source Block + 金融假设 + Lifecycle Proposal Bar。

**Architecture:** 保留现有 IdentityHeader 组件 + LifecycleTimeline，新增 SourceBlock 子组件 + ProposalBar 子组件，删除 StatusActionsSection。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, PanelSection primitives, Lucide icons

---

## 1. 布局结构

```
┌─ Identity Header (PanelSection noBorder) ────┐
│                                               │
│ ┌─ Source Block (bg-mine-bg rounded-md) ────┐ │
│ │ 📄 factors/vol_adj_momentum/factor.py  ↗  │ │  文件路径 + 跳转 Lab
│ └───────────────────────────────────────────┘ │
│                                               │
│ 经波动率调整的20日动量因子。假设高动量且低波    │  金融假设 (3行截断 + 展开)
│ 动的股票具有更强的趋势延续性...                 │
│                                               │
│ ● ──── ● ──── ○ ──── ○ ──── ○               │  lifecycle timeline (现有组件)
│ INC   PAPER  LIVE  PROB   RET                │
│                                               │
│ ┌─ Proposal Bar (teal border) ─────────────┐ │  条件显示 (有 pending proposal 时)
│ │ ⬆ 系统建议升级至 LIVE       [✓] [✕]      │ │
│ └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

**设计理由:**
- **无 name/tags**: 表格行选中高亮已展示 name、category badge、source badge、status badge，侧边栏不重复
- **Source Block 只有文件模式**: 所有因子都是 Lab 工作区的 .py 文件（见 factor-data-architecture §1.1）
- **Proposal Bar 在 lifecycle 下方**: 先看当前状态 → 再看系统的转换建议，逻辑顺序自然
- **金融假设必填**: 送测门禁强制 hypothesis.md 非空，入库时读取存入 Factor.hypothesis

---

## 2. Source Block 子组件

### Props

```tsx
interface SourceBlockProps {
  factor: Factor;
  onNavigateToLab?: (workspacePath: string) => void;  // stub 阶段用 console.log
  className?: string;
}
```

### 显示模式（统一：文件路径 + 跳转）

所有因子都是 Lab 工作区中的 .py 文件，Source Block 只有一种模式：

- 容器: `bg-mine-bg rounded-md px-3 py-2 flex items-center gap-2`
- 左侧 icon: `FileCode` (lucide), 14px, `text-mine-muted shrink-0`
- 文件路径: `text-[11px] font-mono text-mine-text truncate flex-1 min-w-0`
  - 显示完整 namespace 路径（如 `factors/vol_adj_momentum/factor.py`）
  - 数据来源: `factor.workspacePath`（required string）
  - 单行截断，overflow ellipsis
  - hover 时显示 tooltip（全路径）
- 右侧跳转按钮: `text-mine-muted hover:text-mine-text transition-colors shrink-0`
  - Icon: `ExternalLink` (lucide), 14px
  - 点击: 导航到 Lab → 自动展开文件树到对应目录 → 打开 factor.py

### 跳转交互（BLOCKED_BY: Lab 模块）

见 factor-data-architecture §5.1:
1. 点击跳转按钮
2. 导航到 Lab 模块
3. 自动展开文件树到对应因子目录
4. 自动打开 `factor.py` 主文件
5. 编辑器呈现该文件内容，工作区就绪

### 组件规范

- `data-slot="source-block"`
- 接受 `className` prop，用 `cn()` 合并
- spread `...props`
- 命名导出

---

## 3. 金融假设

不抽独立组件——直接在 IdentityHeader 内渲染。

### 样式规格

- 容器: `mt-2`
- 文字: `text-[11px] text-mine-muted leading-relaxed`
- 默认 3 行截断: `line-clamp-3`
- 展开交互:
  - 文字超过 3 行时，末尾显示「展开」按钮
  - 按钮样式: `text-[10px] text-mine-accent-teal cursor-pointer hover:underline`
  - 点击后移除 `line-clamp-3`，按钮文字变为「收起」
- 状态: `const [expanded, setExpanded] = useState(false)` + `useRef` 检测是否超过 3 行
- 因子切换重置: `useEffect(() => setExpanded(false), [factor.id])` — 切换因子时重置为截断态
- 换行保留: `whitespace-pre-line` — Mining 因子的 hypothesis 可能包含段落换行

### 数据来源

```ts
factor.hypothesis  // required string
```

- 来源: Lab 工作区 `hypothesis.md` 文件内容，入库时读取存入
- Mining 因子: RD-Agent 自动生成 hypothesis，落盘时写入 hypothesis.md
- 手写因子: 交易员自行编写 hypothesis.md，送测时强制非空检查

---

## 4. Lifecycle Timeline

**保留现有组件不改动。**

- 组件: `LifecycleTimeline` (`features/library/components/lifecycle-timeline.tsx`)
- Props: `{ status: FactorLifecycleStatus }`
- 5 步 stepper: INCUBATING → PAPER_TEST → LIVE_ACTIVE → PROBATION → RETIRED
- 已有 AnimatedBeam 动画效果
- 位于金融假设下方，`mt-3` 间距（现有）

---

## 5. Proposal Bar 子组件

### Props

```tsx
interface ProposalBarProps {
  proposal: Factor['pendingProposal'];
  currentStatus: FactorLifecycleStatus;
  factorId: string;
  onNavigateToLab?: (workspacePath: string) => void;
  className?: string;
}

// 升降级方向判断 — 抽为可测纯函数
function getProposalDirection(
  currentStatus: FactorLifecycleStatus,
  targetStatus: FactorLifecycleStatus
): 'upgrade' | 'downgrade' {
  const order = FACTOR_LIFECYCLE_STATUSES; // ['INCUBATING', 'PAPER_TEST', 'LIVE_ACTIVE', 'PROBATION', 'RETIRED']
  return order.indexOf(targetStatus) > order.indexOf(currentStatus) ? 'upgrade' : 'downgrade';
}
```

### 视觉规格

- 条件渲染: 仅当 `factor.pendingProposal` 存在时显示
- 容器: `flex items-center gap-2 px-3 py-1.5 rounded-md mt-2`
- 容器颜色:
  - 升级建议: `bg-mine-accent-teal/[0.06] border border-mine-accent-teal/20`
  - 降级建议: `bg-market-up/[0.06] border border-market-up/20`（红色警示）
- 左侧 icon:
  - 升级: `ArrowUpCircle` (lucide), 12px, `text-mine-accent-teal shrink-0`
  - 降级: `ArrowDownCircle` (lucide), 12px, `text-market-up shrink-0`
- 文字: `text-[10px] text-mine-text leading-relaxed flex-1`
  - 升级模板: `系统建议升级至 **{targetStatusLabel}**：{reason}`
  - 降级模板: `系统建议降级至 **{targetStatusLabel}**：{reason}`
  - 目标状态加粗: `font-semibold`
- 右侧按钮组: `flex gap-1 shrink-0`
  - Approve 按钮: `px-2 py-0.5 text-[9px] font-semibold rounded border border-mine-accent-teal text-mine-accent-teal bg-transparent hover:opacity-70 transition-opacity cursor-pointer`
    - 内容: `✓`
  - Reject 按钮: `px-2 py-0.5 text-[9px] font-semibold rounded border border-market-up text-market-up bg-transparent hover:opacity-70 transition-opacity cursor-pointer`
    - 内容: `✕`

### 交互

- Approve: 调用 `useLibraryStore` 的 `updateFactorStatus(factorId, targetStatus, 'auto-approved')`
  - `updateFactorStatus` 在更新 status 的同时必须清除 `pendingProposal`（设为 `undefined`）
- Reject: 调用 `dismissProposal(factorId)` — 需新增 store action
  - `dismissProposal` 仅清除 `pendingProposal`，不改变 status
- 两个操作后 Proposal Bar 消失（因 store 中 `pendingProposal` 被清除，组件条件渲染为 null）
- 当前阶段：乐观更新，无错误回滚（stub）

### 触发机制（BLOCKED_BY: 后台服务）

见 factor-data-architecture §2.6:
- 每日收盘后重算 → 评估状态转换规则 → 生成 pendingProposal
- 所有转换需交易员确认，系统不自动执行
- 转换阈值可在 Settings 模块全局配置

### 组件规范

- `data-slot="proposal-bar"`
- 接受 `className` prop
- 命名导出

---

## 6. 删除清单

| 删除项 | 文件 | 说明 |
|--------|------|------|
| `StatusActionsSection` 组件 | `status-actions.tsx` | 整个文件删除，手动状态变更被 auto-lifecycle + Proposal Bar 替代 |
| `StatusChangeDialog` 组件 | `status-change-dialog.tsx` | 如仅被 StatusActionsSection 引用则一并删除 |
| `StatusActionsSection` 引用 | `factor-detail-panel.tsx` | 移除 import + JSX |
| `expression` 字段 | `types.ts` | 删除，所有因子通过文件定义，不存在"纯表达式因子" |
| 现有表达式折叠 | `identity-header.tsx` | 用 SourceBlock 替代 |
| mock 中的 name + tags | N/A | 不实现到生产代码（表格行已有） |

---

## 7. 数据模型变更

```ts
// types.ts — Factor 接口变更

interface Factor {
  // 删除: expression 字段（所有因子都是文件）
  // expression: string;  ← 删除

  // 变更: workspacePath 从 optional → required
  workspacePath: string;  // Lab 工作区中的因子路径（如 'factors/vol_adj_momentum/factor.py'）

  // 变更: hypothesis 从 optional → required
  hypothesis: string;  // 金融假设，来源: hypothesis.md 文件内容

  // 新增: 系统自动提议的生命周期转换
  pendingProposal?: {
    targetStatus: FactorLifecycleStatus;
    reason: string;       // e.g. "样本外 IC 连续 60 期 > 0.02, ICIR > 0.5"
    proposedAt: string;   // ISO timestamp
  };
}
```

Mock 数据需同步更新:
- 所有因子添加 `hypothesis` 字段
- 所有因子添加 `workspacePath` 字段
- 删除 `expression` 字段引用
- 部分因子添加 `pendingProposal` 示例数据

---

## 8. 上游依赖

| 依赖项 | 阻塞模块 | 说明 |
|--------|----------|------|
| Lab → Library 跳转 | Lab | 文件树展开 + 文件打开的路由和状态管理 |
| pendingProposal 数据 | 后台服务 | 每日重算 → 状态机评估 → 生成 proposal |
| 状态转换阈值配置 | Settings | 全局可配置的升级/降级阈值 |
| hypothesis.md 读取 | Backtest | 入库时读取文件内容写入 Factor.hypothesis |

---

## 9. 任务顺序

1. **数据模型变更** — `types.ts` 删除 `expression`，`workspacePath` 改 required，添加 `hypothesis` (required) + `pendingProposal` (optional)，更新 mock 数据
2. **新建 SourceBlock** — 文件路径模式，显示 workspacePath + 跳转按钮（跳转逻辑先 stub）
3. **新建 ProposalBar** — 条件渲染 + approve/reject + 升级/降级视觉区分
4. **重构 IdentityHeader** — 组合 SourceBlock + 假设文字 + LifecycleTimeline + ProposalBar
5. **删除 StatusActionsSection** — 文件 + 引用 + StatusChangeDialog（如无其他引用）
6. **Store 变更** — 新增 `dismissProposal` action，复用现有 `updateFactorStatus`
