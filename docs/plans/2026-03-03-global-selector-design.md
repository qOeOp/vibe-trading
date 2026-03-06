# Global Selector 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **上游约束:** `docs/plans/2026-03-03-factor-data-architecture.md` §2

**Goal:** 新建面板级 sticky 选择器，控制全局上下文（stock pool × horizon）。所有下游 section 响应选择器变化。

**Architecture:** 复用现有 Radix Tabs 组件（`@/components/ui/tabs`），配合 Zustand store 管理全局 pool/horizon 状态。Sticky 定位在 PanelFrameBody 内顶部。

**Tech Stack:** React 19, TypeScript, Radix Tabs, Tailwind CSS v4, Zustand

---

## 1. 布局结构

```
┌─ Global Selector (sticky top:0, z-10) ──────┐
│                                               │
│ ┌─ Pool Tabs (Radix TabsList) ─────────────┐ │
│ │ [全A] [沪深300] [中证500●] [中证1000]     │ │  segmented control, best-dot 标记
│ └───────────────────────────────────────────┘ │
│                                               │
│ ┌─ Horizon Tabs (Radix TabsList) ──────────┐ │
│ │ [T+1] [T+5] [T+10] [T+20]                │ │  segmented control
│ └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

---

## 2. 组件结构

```tsx
interface GlobalSelectorProps {
  factor: Factor;
  className?: string;
}
```

### 容器

- 位置: Identity Header 下方，PanelFrameBody 内
- Sticky: `sticky top-0 z-10 bg-white border-b border-mine-border`
- Padding: `px-4 pt-2.5 pb-1.5`
- 不用 PanelSection 包裹（自己是 sticky 独立区域）

### Pool Tabs

- 使用 `<Tabs>` + `<TabsList>` + `<TabsTrigger>`，variant="default"
- 4 个 tab: 全A | 沪深300 | 中证500 | 中证1000
- `<TabsList>` 额外样式: `w-full` (占满宽度)
- `<TabsTrigger>` 额外样式: `text-[10px]` (缩小字号适配侧栏宽度)
- Best-dot: 全局 IC 最优池的 tab 右上角显示 teal 圆点
  - `position: absolute; top: 3px; right: 6px; w-1 h-1 rounded-full bg-mine-accent-teal`
  - 仅一个 tab 有 dot（IC 值最高的池）

### Horizon Tabs

- 同样使用 Radix Tabs，variant="default"
- 4 个 tab: T+1 | T+5 | T+10 | T+20
- `<TabsList>` 样式: `w-full`，高度略小 `h-8`

### Tab 状态视觉

每个 tab 有两种数据状态：

| 状态 | Tab 视觉 | 说明 |
|------|----------|------|
| ready | 正常样式，无标记 | 数据完整可查看 |
| loading | 正常样式 + 右上角 2px amber 呼吸点 (pulse) | 后台正在计算/待处理 |
| error | 正常样式 + 右上角 2px red 点 | 计算失败 |

失败的 pool×horizon 组合显示 error 状态（SectionErrorCard），不提供"触发计算"按钮——入库时 16 组全算，Library 不触发计算。

映射关系：DB `pending` → 前端 `loading`，DB `error` → 前端 `error`

- ready tab: 正常可点击切换
- loading tab: 可点击，切换后内容区显示计算进度（见 §4）
- error tab: 可点击，切换后内容区显示 SectionErrorCard

---

## 3. 数据计算策略

### 入库时的计算范围（BLOCKED_BY: Backtest 模块）

- **信号指标**（IC、ICIR、IC decay、IC by industry 等）:
  - 入库时 16 pool×horizon 组合全部自动计算
  - 计算量轻（截面相关），每组毫秒级，全算也就几分钟
- **组合指标**（Sharpe、MaxDD、分组累计收益、换手率）:
  - 入库时 16 pool×horizon 组合全部后台异步计算
  - 后台异步任务，约 30-60 分钟。入库是低频操作，不阻塞用户

### Pool × Horizon 切换时的数据状态

Pool/Horizon 切换即时更新 store，下游 section 数据跟随切换。已入库时全算，切换无需按需补算。

---

## 4. 下游 Section 数据状态

当用户切换到某个 pool × horizon 组合时，下游 section 根据 ComputeStatus 有三种状态：

### 全部就绪

正常展示所有指标数据。

### 整个 section 计算中

该组合正在后台计算时，section 内容区替换为计算状态卡片：

```
┌─ PanelSection ──────────────────────────┐
│  PREDICTIVE POWER                        │
│  ┌────────────────────────────────────┐  │
│  │     ○ ─── 计算中 ···               │  │
│  │     沪深300 × T+5 信号指标          │  │
│  │     ████████░░░░  68%              │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

- 居中布局，skeleton 风格背景
- 显示当前计算的组合名称
- 进度条（如后端支持进度上报）或 pulse 动画（如只知道在算）

### 部分指标缺失

Section 有部分数据（如信号指标就绪但组合指标在算），有数据的指标正常显示，缺失的指标位置用 skeleton：

- `skeleton + animate-pulse` 替代指标值
- 指标标签保留，值区域显示 skeleton 占位
- 不用微型进度条（单个指标要么有要么没有）
- 符合设计规范：禁止 spinner，用 skeleton

---

## 5. 状态管理

### Store 扩展 (`use-library-store.ts`)

```ts
interface LibraryStore {
  // 新增: Global Selector 状态
  selectedPool: UniversePool;                    // 默认 '全A'
  selectedHorizon: 'T1' | 'T5' | 'T10' | 'T20'; // 默认 'T5'

  // Actions
  setPool: (pool: UniversePool) => void;
  setHorizon: (horizon: 'T1' | 'T5' | 'T10' | 'T20') => void;
}
```

### 数据模型扩展 (`types.ts`)

```ts
type ComputeStatus = 'ready' | 'loading' | 'error';

interface Factor {
  // 每个 pool×horizon 组合的计算状态
  // key = `${pool}_${horizon}`
  configStatus?: Record<string, {
    signalStatus: ComputeStatus;   // 信号指标状态
    portfolioStatus: ComputeStatus; // 组合指标状态
  }>;
}
```

### 下游响应

所有 section 通过 `useLibraryStore` 读取 `selectedPool` / `selectedHorizon`，同时检查 `factor.configStatus[key]` 决定渲染数据、skeleton 还是计算状态卡片。

---

## 6. 交互细节

- Pool/Horizon 切换: 即时更新 store，下方所有 section 数据跟随切换
- 切换动画: 下方内容区 opacity 0.3 → 1.0，150ms transition
- Best-dot: 在所有**已就绪**的池中比较当前 horizon 下的 IC 值，最高者显示 dot

---

## 7. 组件规范

- `data-slot="global-selector"`
- 接受 `className` prop，用 `cn()` 合并
- spread `...props`
- 命名导出

---

## 8. 上游依赖

| 依赖项 | 阻塞模块 | 说明 |
|--------|----------|------|
| 信号指标批量计算 | Backtest | 入库时 4×4=16 组信号指标自动计算 |
| 组合指标批量计算 | Backtest | 入库时 4×4=16 组组合指标后台异步计算，无按需触发 |
| 计算状态 API | 后台服务 | 前端需要知道每个组合的状态（ready/loading/error） |

---

## 9. 任务顺序

1. **Store 扩展** — `use-library-store.ts` 添加 pool/horizon 状态、actions（无 triggerCompute）
2. **数据模型** — `types.ts` 添加 `configStatus`，mock 数据添加示例（部分 ready/部分 loading/部分 error）
3. **新建 GlobalSelector** — Radix Tabs pool/horizon + tab 三态视觉
4. **集成到 factor-detail-panel** — Identity Header 下方，sticky 定位
5. **Section 数据状态组件** — 通用的 section 级计算状态卡片 + 指标级 skeleton
6. **下游 section 接入** — 各 section 读取 store 全局状态 + configStatus 渲染对应状态
