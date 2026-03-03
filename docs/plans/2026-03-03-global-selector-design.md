# Global Selector 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 新建面板级 sticky 选择器，控制全局上下文（stock pool × horizon × calc config）。所有下游 section 响应选择器变化。

**Architecture:** 复用现有 Radix Tabs 组件（`@/components/ui/tabs`），配合 Zustand store 管理全局 pool/horizon/config 状态。Sticky 定位在 PanelFrameBody 内顶部。

**Tech Stack:** React 19, TypeScript, Radix Tabs, Tailwind CSS v4, Zustand, Popover (Radix)

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
│ │ [5D] [20D] [60D]                          │ │  segmented control
│ └───────────────────────────────────────────┘ │
│                                               │
│ ⚙ RankIC · MAD去极值 · 行业中性        ▾     │  calc config summary + popover
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
- Disabled: 未计算的池 `disabled` 属性，opacity 0.5，cursor not-allowed

### Horizon Tabs

- 同样使用 Radix Tabs，variant="default"
- 3 个 tab: 5D | 20D | 60D
- `<TabsList>` 样式: `w-full`，高度略小 `h-8`
- Disabled 逻辑同 Pool

### Calc Config 行

- 非 tab 组件，纯 `<button>` + Radix `<Popover>`
- Summary 行: `flex items-center gap-1.5`
  - ⚙ icon: `Settings2` (lucide), 12px, mine-muted
  - 文字: `text-[10px] text-mine-muted` — 格式: `{icMethod} · {winsorization} · {neutralization}`
  - ▾ 箭头: `text-[8px] text-mine-muted`
- 整行 hover: `hover:text-mine-text transition-colors`
- Popover 内容:
  - `bg-white border border-mine-border rounded-lg shadow-md p-3`
  - 4 行配置项，每行 `flex justify-between items-center py-1`
  - Label: `text-[10px] text-mine-muted`
  - Select: `text-[10px] px-1.5 py-0.5 border border-mine-border rounded bg-mine-bg`
  - 配置项:
    1. IC 方法: RankIC / NormalIC
    2. 去极值: MAD / 3σ / Winsorize
    3. 行业中性化: 是 / 否
    4. 市值中性化: 是 / 否
  - **只读选择**: 只展示已预计算的配置组合，切换 select 实际是切换"查看哪个已有结果"

---

## 3. 状态管理

### Store 扩展 (`use-library-store.ts`)

```ts
interface LibraryStore {
  // 新增: Global Selector 状态
  selectedPool: UniversePool;        // 默认 '全A'
  selectedHorizon: 5 | 20 | 60;     // 默认 20
  selectedConfig: {
    icMethod: 'RankIC' | 'NormalIC';
    winsorization: 'MAD' | '3σ' | 'Winsorize';
    industryNeutral: boolean;
    sizeNeutral: boolean;
  };

  // Actions
  setPool: (pool: UniversePool) => void;
  setHorizon: (horizon: 5 | 20 | 60) => void;
  setConfig: (config: Partial<LibraryStore['selectedConfig']>) => void;
}
```

### 数据模型扩展 (`types.ts`)

```ts
interface Factor {
  // 新增: 哪些 pool×horizon×config 组合已预计算
  availableConfigs?: Array<{
    pool: UniversePool;
    horizon: number;
    icMethod: string;
    winsorization: string;
    industryNeutral: boolean;
    sizeNeutral: boolean;
  }>;
}
```

### 下游响应

所有 section 通过 `useLibraryStore` 读取 `selectedPool` / `selectedHorizon` / `selectedConfig`，用这些参数从 factor 数据中取对应切片。当前 mock 数据只有默认配置，后续数据层扩展后自动生效。

---

## 4. 交互细节

- Pool/Horizon 切换: 即时更新 store，下方所有 section 数据跟随切换
- 切换动画: 下方内容区 opacity 0.3 → 1.0，150ms transition（模拟数据切换）
- Disabled tab: 未预计算的组合灰色不可点。hover 时 tooltip 显示"该配置尚未计算"
- Best-dot: 在所有可用池中比较当前 horizon+config 下的 IC 值，最高者显示 dot
- Calc config popover: 点击 ⚙ 行打开，点击外部关闭。切换 select 即时生效

---

## 5. 组件规范

- `data-slot="global-selector"`
- 接受 `className` prop，用 `cn()` 合并
- spread `...props`
- 命名导出

---

## 6. 任务顺序

1. **Store 扩展** — `use-library-store.ts` 添加 pool/horizon/config 状态和 actions
2. **数据模型** — `types.ts` 添加 `availableConfigs`，mock 数据添加示例
3. **新建 GlobalSelector** — Radix Tabs pool/horizon + Popover config
4. **集成到 factor-detail-panel** — Identity Header 下方，sticky 定位
5. **下游 section 接入** — 各 section 读取 store 全局状态（后续 task，先建骨架）
