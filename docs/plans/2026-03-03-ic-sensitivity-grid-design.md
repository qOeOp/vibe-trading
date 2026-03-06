# IC Sensitivity Grid 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 用 Pool×Horizon 井字格替代现有 FitnessSection 的简单表格，直观展示因子在不同股票池和预测周期下的 IC/IR 敏感性。支持 IC/IR tab 切换。与 Global Selector 联动高亮当前选中组合。

**Architecture:** 新建 `SensitivityGrid` 组件替代 `FitnessSection`。CSS Grid 实现井字格布局（只有内分割线，四周开放）。读取 `useLibraryStore` 的 pool/horizon 状态高亮当前选中单元格。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Zustand, PanelSection

---

## 1. 布局结构

```
┌─ PanelSection title="IC SENSITIVITY" ─────────┐
│                                                 │
│  SENSITIVITY [IC] [IR]              ●好 ●中 ●弱 ★│  title + tab + legend
│                                                 │
│              T+1     T+5     T+10    T+20       │  horizon labels (no border)
│                                                 │
│   全A      0.042 │ 0.035  │ 0.029 │ 0.021      │  ← 只有竖线分隔
│         ─────────┼────────┼───────┼─────────    │  ← 横线不到边
│  沪深300   0.028 │ 0.041  │ 0.031 │ 0.025      │
│         ─────────┼────────┼───────┼─────────    │
│  中证500   0.051★│ 0.044  │ 0.033 │ 0.028      │
│         ─────────┼────────┼───────┼─────────    │
│  中证1000  0.030 │ 0.022  │ 0.018 │ 0.014      │  ← 最后一行无底线
│                                                 │
└─────────────────────────────────────────────────┘
```

**设计理由:**
- **井字格 vs 封闭表格**: 数据量少（4×4=16 格），封闭表格视觉过重。井字格只画内分割线，四周开放，视觉更轻盈
- **替代 FitnessSection**: 现有 FitnessSection 只展示 4 池的 IC/IR，不含 horizon 维度。新设计将 4 个 horizon: T+1/T+5/T+10/T+20 加入，形成完整敏感性矩阵
- **与 Global Selector 联动**: 当前选中的 pool×horizon 单元格高亮，视觉锚定用户关注点

---

## 2. 视觉规格

### 井字格容器

- CSS Grid: `grid-template-columns: 56px repeat(4, 1fr)`
- **无外边框**: 不用 `border`、`border-radius`、`overflow: hidden`
- **只有内线**: 行标题右侧 `border-right`，数据行底部 `border-bottom`（最后一行除外）
- 线色: `border-mine-border`（1px）

### Header 行

- 左侧: PanelSection `title="SENSITIVITY"`
- 标题旁: IC/IR 小 tab — `text-[9px]`，下划线风格（非 segmented），默认 IC
  - 当前 tab: `text-mine-text font-semibold border-b border-mine-text`
  - 非当前 tab: `text-mine-muted hover:text-mine-text cursor-pointer`
- 右侧: inline legend，与标题同行
  - 格式: `●好  ●中  ●弱  ★`
  - 样式: `text-[9px] text-mine-muted`，色点 5px
  - 色点颜色: `market-up`(红/好) · `amber`(琥珀/中) · `mine-border`(灰/弱)
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

色点基于 `calibratedNormalize` 的 score 值着色（与 Radar 归一化一致），不硬编码原始值阈值：

色点（5px 圆点，位于数值左侧 3px）:
- score ≥ 0.5 (average 以上): `bg-market-up` (红，好) — A 股语境红=好
- score 0.2-0.5 (poor 到 average): `bg-amber-500` (琥珀，中等)
- score < 0.2: `bg-mine-border` (灰，弱)

IC tab 使用 predictive 维度的校准基准，IR tab 使用 stability 维度的校准基准。
交易员在 Settings 调整校准基准时，Grid 色点自动跟随。

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

### Default Config 标记 (◆)

用户入库时选定的默认 pool×horizon 用 ◆ 标注，与 ★ Global Best（IC 最高的格子）区分。◆ 来自 Factor metadata 的 `defaultPool` + `defaultHorizon`。

- 右上角小 ◆: `text-[7px] text-mine-muted font-medium align-super ml-0.5`
- 仅一个单元格有此标记（可与 ★ 共存于不同单元格）

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

### IC/IR Tab 切换

- IC tab: 展示各 pool×horizon 的 IC 值，色点基于 predictive 校准
- IR tab: 展示各 pool×horizon 的 IR (ICIR) 值，色点基于 stability 校准
- Global Best ★ 在当前 tab 的维度内比较（IC tab 比 IC 最大值，IR tab 比 IR 最大值）
- 选中态、点击交互、disabled 逻辑不变
- Tab 状态: 组件内部 `useState`，不存 store（不影响全局）


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

Mock 数据只有默认 horizon 的值。Grid 仍渲染 4×4 矩阵，但非当前 horizon 的列显示 `—`（disabled）。或者在 mock 中直接生成 4×4 = 16 条 UniverseIC 数据。

**推荐**: mock 数据扩展为 16 条，每池每 horizon 一条。使 preview 完整。

---

## 5. 组件结构

```tsx
interface SensitivityGridProps {
  factor: Factor;
  className?: string;
}
```

### 内部实现

```tsx
function SensitivityGrid({ factor, className, ...props }: SensitivityGridProps) {
  const { selectedPool, selectedHorizon, setPool, setHorizon } = useLibraryStore();
  const [activeTab, setActiveTab] = useState<'ic' | 'ir'>('ic');

  // Build 4×4 matrix from factor.universeProfile
  const matrix = buildSensitivityMatrix(factor.universeProfile, activeTab);
  const globalBest = findGlobalBest(matrix);

  const handleCellClick = (pool: UniversePool, horizon: 'T1' | 'T5' | 'T10' | 'T20') => {
    setPool(pool);
    setHorizon(horizon);
  };

  return (
    <PanelSection
      title="SENSITIVITY"
      headerRight={<><TabSwitch active={activeTab} onChange={setActiveTab} /><Legend /></>}
      className={cn(className)}
      {...props}
    >
      <div className="grid" style={{ gridTemplateColumns: '56px repeat(4, 1fr)' }}>
        {/* horizon labels row */}
        {/* 4 pool rows × 4 horizon cells */}
      </div>
    </PanelSection>
  );
}
```

### 组件规范

- `data-slot="sensitivity-grid"`
- 接受 `className` prop，用 `cn()` 合并
- spread `...props`
- 命名导出

---

## 6. 删除清单

| 删除项 | 文件 | 说明 |
|--------|------|------|
| `FitnessSection` 组件 | `fitness-section.tsx` | 整个文件删除，被 SensitivityGrid 替代 |
| `FitnessSection` 引用 | `factor-detail-panel.tsx` | 替换为 SensitivityGrid import + JSX |

---

## 7. 任务顺序

1. **数据模型扩展** — `UniverseIC` 添加 `horizon` 字段，mock 数据生成 4×4=16 条记录（IC + IR 均有）
2. **新建 SensitivityGrid** — CSS Grid 井字格布局 + IC/IR tab + 颜色编码（基于 calibratedNormalize score）+ Global Best ★
3. **Global Selector 联动** — 读取 store 高亮选中单元格 + 点击切换 pool/horizon
4. **集成到 factor-detail-panel** — 替换 FitnessSection
5. **删除 FitnessSection** — 文件 + 引用
