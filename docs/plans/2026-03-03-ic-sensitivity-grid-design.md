# IC Sensitivity Grid 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 用 Pool×Horizon 井字格替代现有 FitnessSection 的简单表格，直观展示因子在不同股票池和预测周期下的 IC 敏感性。与 Global Selector 联动高亮当前选中组合。

**Architecture:** 新建 `ICSensitivityGrid` 组件替代 `FitnessSection`。CSS Grid 实现井字格布局（只有内分割线，四周开放）。读取 `useLibraryStore` 的 pool/horizon 状态高亮当前选中单元格。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Zustand, PanelSection

---

## 1. 布局结构

```
┌─ PanelSection title="IC SENSITIVITY" ─────────┐
│                                                 │
│  IC SENSITIVITY          ●≥0.03 ●0.02– ●<0.02 ★│  header + inline legend
│                                                 │
│              5D      20D      60D               │  horizon labels (no border)
│                                                 │
│   全A      0.042 │ 0.035  │ 0.029              │  ← 只有竖线分隔
│         ─────────┼────────┼─────────            │  ← 横线不到边
│  沪深300   0.028 │ 0.041  │ 0.031              │
│         ─────────┼────────┼─────────            │
│  中证500   0.051★│ 0.044  │ 0.033              │
│         ─────────┼────────┼─────────            │
│  中证1000  0.030 │ 0.022  │ 0.018              │  ← 最后一行无底线
│                                                 │
└─────────────────────────────────────────────────┘
```

**设计理由:**
- **井字格 vs 封闭表格**: 数据量少（4×3=12 格），封闭表格视觉过重。井字格只画内分割线，四周开放，视觉更轻盈
- **替代 FitnessSection**: 现有 FitnessSection 只展示 4 池的 IC/IR，不含 horizon 维度。新设计将 horizon 加入，形成完整敏感性矩阵
- **与 Global Selector 联动**: 当前选中的 pool×horizon 单元格高亮，视觉锚定用户关注点

---

## 2. 视觉规格

### 井字格容器

- CSS Grid: `grid-template-columns: 56px repeat(3, 1fr)`
- **无外边框**: 不用 `border`、`border-radius`、`overflow: hidden`
- **只有内线**: 行标题右侧 `border-right`，数据行底部 `border-bottom`（最后一行除外）
- 线色: `border-mine-border`（1px）

### Header 行

- 左侧: PanelSection `title="IC SENSITIVITY"`
- 右侧: inline legend，与标题同行
  - 格式: `●≥0.03  ●0.02–  ●<0.02  ★`
  - 样式: `text-[9px] text-mine-muted`，色点 5px
  - ★ 图标: `text-mine-accent-teal font-semibold`

### Horizon Labels（第一行）

- 位置: grid 第一行，跳过左上角空格
- 文字: `text-[9px] text-mine-muted font-medium uppercase tracking-wide`
- 无背景色，无边框
- 底部 padding: `pb-1.5`

### Pool Labels（行头）

- 位置: grid 每行第一列
- 文字: `text-[10px] text-mine-muted font-medium text-right`
- 右侧分隔线: `border-r border-mine-border`
- padding: `py-2.5 pr-2`

### 数据单元格

- padding: `py-2.5 px-1`
- 文字: `text-[11px] font-mono tabular-nums font-semibold text-center`
- 底部分隔线: `border-b border-mine-border`（最后一行除外）
- hover: `hover:bg-mine-bg/50 transition-colors duration-150`
- cursor: `cursor-pointer`（点击切换 Global Selector）

### 颜色编码

色点（5px 圆点，位于数值左侧 3px）:
- IC ≥ 0.03: `bg-market-up` (绿，A股语境=好)
- 0.02 ≤ IC < 0.03: `bg-amber` (琥珀，中等)
- IC < 0.02: `bg-mine-border` (灰，弱)

### 选中态

当前 Global Selector 选中的 pool×horizon 单元格:
- 背景: `bg-mine-accent-teal/[0.05]`
- 文字色: `text-mine-accent-teal`（替代默认黑色）
- 无色点（teal 文字已足够标识）
- 无 outline/border 变化

### Global Best 标记

- 全矩阵 IC 最大值的单元格
- 右上角小 ★: `text-[7px] text-mine-accent-teal font-bold align-super ml-0.5`
- 仅一个单元格有此标记

### Disabled 单元格

- 未计算的 pool×horizon 组合
- 文字: `text-mine-muted/50`（半透明灰）
- 无色点
- 显示 `—` 而非数值
- 不可点击: `cursor-default`

---

## 3. 交互

### 单元格点击

- 点击数据单元格 → 调用 `setPool(pool)` + `setHorizon(horizon)` 更新 Global Selector
- Global Selector 变化 → 下方所有 section 数据跟随切换
- 点击已选中的单元格无效果

### Hover

- `hover:bg-mine-bg/50`，150ms transition
- 选中态单元格不变色

---

## 4. 数据结构

### 现有数据

```ts
// types.ts
interface Factor {
  universeProfile: UniverseIC[];  // 4 pools × {universe, ic, ir}
}
```

现有 `universeProfile` 只有一个 horizon 的数据。

### 扩展方向

```ts
// 未来: 多 horizon 数据
interface UniverseIC {
  universe: UniversePool;
  horizon: number;   // 新增
  ic: number;
  ir: number;
}
```

### Phase 1（本次实现）

Mock 数据只有默认 horizon 的值。Grid 仍渲染 4×3 矩阵，但非当前 horizon 的列显示 `—`（disabled）。或者在 mock 中直接生成 4×3 = 12 条 UniverseIC 数据。

**推荐**: mock 数据扩展为 12 条，每池每 horizon 一条。使 preview 完整。

---

## 5. 组件结构

```tsx
interface ICSensitivityGridProps {
  factor: Factor;
  className?: string;
}
```

### 内部实现

```tsx
function ICSensitivityGrid({ factor, className, ...props }: ICSensitivityGridProps) {
  const { selectedPool, selectedHorizon, setPool, setHorizon } = useLibraryStore();

  // Build 4×3 matrix from factor.universeProfile
  const matrix = buildSensitivityMatrix(factor.universeProfile);
  const globalBest = findGlobalBest(matrix);

  const handleCellClick = (pool: UniversePool, horizon: number) => {
    setPool(pool);
    setHorizon(horizon as 5 | 20 | 60);
  };

  return (
    <PanelSection title="IC SENSITIVITY" headerRight={<Legend />} className={cn(className)} {...props}>
      <div className="grid" style={{ gridTemplateColumns: '56px repeat(3, 1fr)' }}>
        {/* horizon labels row */}
        {/* 4 pool rows × 3 horizon cells */}
      </div>
    </PanelSection>
  );
}
```

### 组件规范

- `data-slot="ic-sensitivity-grid"`
- 接受 `className` prop，用 `cn()` 合并
- spread `...props`
- 命名导出

---

## 6. 删除清单

| 删除项 | 文件 | 说明 |
|--------|------|------|
| `FitnessSection` 组件 | `fitness-section.tsx` | 整个文件删除，被 ICSensitivityGrid 替代 |
| `FitnessSection` 引用 | `factor-detail-panel.tsx` | 替换为 ICSensitivityGrid import + JSX |

---

## 7. 任务顺序

1. **数据模型扩展** — `UniverseIC` 添加 `horizon` 字段，mock 数据生成 4×3=12 条记录
2. **新建 ICSensitivityGrid** — CSS Grid 井字格布局 + 颜色编码 + Global Best ★
3. **Global Selector 联动** — 读取 store 高亮选中单元格 + 点击切换 pool/horizon
4. **集成到 factor-detail-panel** — 替换 FitnessSection
5. **删除 FitnessSection** — 文件 + 引用
