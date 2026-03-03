# Identity Header 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 重构因子详情侧边栏 Identity Header，移除冗余信息（name/tags/badge/手动状态变更），新增 Source Block + 金融假设 + Lifecycle Proposal Bar。

**Architecture:** 保留现有 IdentityHeader 组件 + LifecycleTimeline，新增 SourceBlock 子组件 + ProposalBar 子组件，删除 StatusActionsSection。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, PanelSection primitives, Lucide icons

---

## 1. 布局结构

```
┌─ Identity Header (PanelSection noBorder) ────┐
│                                               │
│ ┌─ Source Block (bg-mine-bg rounded-md) ────┐ │
│ │ ts_rank(log_ret(close,20)/reali...  📋    │ │  表达式因子: mono, truncate, copy
│ └───────────────────────────────────────────┘ │
│   OR                                          │
│ ┌─ Source Block (bg-mine-bg rounded-md) ────┐ │
│ │ 📄 factor.py · 23行                    ↗  │ │  代码因子: 文件图标 + 路径 + 跳Lab
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
- **Source Block 在顶部**: 因子的"定义"（表达式/代码）是 header 级信息，像代码仓库展示 git clone URL 一样
- **Proposal Bar 在 lifecycle 下方**: 先看当前状态 → 再看系统的转换建议，逻辑顺序自然
- **金融假设必填**: 量化因子的假设是核心元信息，所有来源的因子都应有

---

## 2. Source Block 子组件

### Props

```tsx
interface SourceBlockProps {
  factor: Factor;
  className?: string;
}
```

### 表达式因子 (source !== 'mining_llm' 或无 codeFile)

- 容器: `bg-mine-bg rounded-md px-3 py-2 flex items-center gap-2`
- 表达式文字: `text-[11px] font-mono text-mine-text truncate flex-1 min-w-0`
  - 单行截断，overflow ellipsis
  - hover 时显示 tooltip（全文）
- Copy 按钮: `text-mine-muted hover:text-mine-text transition-colors shrink-0`
  - Icon: `Copy` (lucide), 14px (w-3.5 h-3.5)
  - 点击: `navigator.clipboard.writeText(factor.expression)`
  - 点击后短暂显示 `Check` icon (1.5s 后恢复)

### 代码因子 (source === 'mining_llm' 且有 codeFile)

- 同一容器样式: `bg-mine-bg rounded-md px-3 py-2 flex items-center gap-2`
- 左侧 icon: `FileCode` (lucide), 14px, `text-mine-muted shrink-0`
- 文件名: `text-[11px] font-mono text-mine-text` — 从 codeFile 提取文件名 (如 `factor.py`)
- 行数提示: `text-[9px] text-mine-muted` — `· 23行`（需后端提供或前端计算）
- 右侧跳转按钮: `text-mine-muted hover:text-mine-text transition-colors shrink-0`
  - Icon: `ExternalLink` (lucide), 14px
  - 点击: 导航到 Lab workspace 打开对应文件

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

### 数据来源

```ts
factor.hypothesis  // required string，所有因子必填
```

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
  factorId: string;
  className?: string;
}
```

### 视觉规格

- 条件渲染: 仅当 `factor.pendingProposal` 存在时显示
- 容器: `flex items-center gap-2 px-3 py-1.5 rounded-md mt-2`
- 容器颜色: `bg-mine-accent-teal/[0.06] border border-mine-accent-teal/20`
- 左侧 icon: `ArrowUpCircle` (lucide), 12px, `text-mine-accent-teal shrink-0`
- 文字: `text-[10px] text-mine-text leading-relaxed flex-1`
  - 内容模板: `系统建议升级至 **{targetStatusLabel}**：{reason}`
  - 目标状态加粗: `font-semibold`
- 右侧按钮组: `flex gap-1 shrink-0`
  - Approve 按钮: `px-2 py-0.5 text-[9px] font-semibold rounded border border-mine-accent-teal text-mine-accent-teal bg-transparent hover:opacity-70 transition-opacity cursor-pointer`
    - 内容: `✓`
  - Reject 按钮: `px-2 py-0.5 text-[9px] font-semibold rounded border border-market-up text-market-up bg-transparent hover:opacity-70 transition-opacity cursor-pointer`
    - 内容: `✕`

### 交互

- Approve: 调用 `useLibraryStore` 的 `updateFactorStatus(factorId, targetStatus, 'auto-approved')`
- Reject: 调用 `dismissProposal(factorId)` — 需新增 store action
- 两个操作后 Proposal Bar 消失（proposal 清除）

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
| 现有表达式折叠 | `identity-header.tsx` | 用 SourceBlock 替代（不折叠，单行截断） |
| mock 中的 name + tags | N/A | 不实现到生产代码（表格行已有） |

---

## 7. 数据模型变更

```ts
// types.ts — Factor 接口变更

interface Factor {
  // 变更: hypothesis 从 optional → required
  hypothesis: string;  // 金融假设描述（所有因子必填，含手动因子）

  // 新增: 系统自动提议的生命周期转换
  pendingProposal?: {
    targetStatus: FactorLifecycleStatus;
    reason: string;       // e.g. "IC 连续 60 期 > 0.03, ICIR 稳定 > 0.3"
    proposedAt: string;   // ISO timestamp
  };

  // 现有 optional → 保持 (代码因子用)
  codeFile?: string;
  workspacePath?: string;
}
```

Mock 数据需同步更新:
- 所有因子添加 `hypothesis` 字段
- 部分因子添加 `pendingProposal` 示例数据

---

## 8. 任务顺序

1. **数据模型变更** — `types.ts` 添加 `hypothesis` (required) + `pendingProposal` (optional)，更新 mock 数据
2. **新建 SourceBlock** — `identity-header.tsx` 内子组件，表达式/代码两种模式
3. **新建 ProposalBar** — `identity-header.tsx` 内子组件，条件渲染 + approve/reject
4. **重构 IdentityHeader** — 组合 SourceBlock + 假设文字 + LifecycleTimeline + ProposalBar
5. **删除 StatusActionsSection** — 文件 + 引用 + StatusChangeDialog（如无其他引用）
6. **Store 变更** — 新增 `dismissProposal` action，复用现有 `updateFactorStatus`
