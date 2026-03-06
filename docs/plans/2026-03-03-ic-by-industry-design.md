# IC by Industry 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将现有 31 行业柱状图改为 Top 5 + expand separator + Bottom 3 列表，减少垂直占用，聚焦极端行业。

**Architecture:** 改造现有 `ICByIndustrySection`，从 BarVertical 图表改为排序列表 + 展开/折叠交互。不使用滚动容器。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, PanelSection

---

## 1. 布局结构

```
┌─ PanelSection title="IC BY INDUSTRY" ──────────┐
│                                                  │
│  suffix="申万L1"                                  │
│                                                  │
│  ● 电子     ██████████████░░░░  +0.068          │  Top 1 (最高)
│  ● 计算机   ████████████░░░░░░  +0.055          │  Top 2
│  ● 军工     ███████████░░░░░░░  +0.048          │  Top 3
│  ● 电力设备 █████████░░░░░░░░░  +0.041          │  Top 4
│  ● 医药     ████████░░░░░░░░░░  +0.037          │  Top 5
│                                                  │
│  ── 展开 20 项 ──────────────────────────────── │  expand separator
│                                                  │
│  ● 银行     ░░░░░░░░░░░░░░░░░░  -0.012         │  Bottom 3
│  ● 房地产   ░░░░░░░░░░░░░░░░░░  -0.018         │  Bottom 2
│  ● 煤炭     ░░░░░░░░░░░░░░░░░░  -0.023         │  Bottom 1 (最低)
│                                                  │
└──────────────────────────────────────────────────┘
```

**设计理由:**
- **31 行业柱状图太密**: 侧栏宽度下 28 根 bar 每根只有 ~10px，标签挤在一起无法阅读
- **Top 5 + Bottom 3**: 用户关心的是"因子在哪些行业最有效/最无效"，中间行业不重要
- **Expand 折叠**: 需要时展开看全貌，不需要时节省空间
- **列表 vs 图表**: 行业名称是关键信息，列表比柱状图更适合展示长名称 + 精确数值

---

## 2. 数据来源

### 多维度数据对接

所有数据通过 `useFactorSlice()` hook 获取当前 pool×horizon 的信号数据切片：

| 元素 | 旧数据源 | 新数据源 |
|------|---------|---------|
| IC 行业分布 (31 行业) | `factor.icByIndustry` | `signalSlice.icByIndustry` |

见 `factor-data-architecture.md` §2.5。

### 切 tab 行为

用户切换 pool/horizon 时，31 行业 IC 数据自动替换。排序和 Top5/Bottom3 分组在前端实时重算。不同 pool 下行业 IC 分布差异明显（例如中证 500 偏中小盘行业），切换后列表顺序会变。

---

## 3. 行业行视觉规格

### 行布局

每行: `flex items-center gap-2 py-1.5`

```
[色点] [行业名] [─────── inline bar ──────] [IC 值]
```

### 色点

- 尺寸: 5px 圆点
- IC ≥ 0.03: `bg-market-up-medium`（强）
- 0 ≤ IC < 0.03: `bg-amber-400`（中）
- IC < 0: `bg-market-down-medium`（负）

### 行业名

- 样式: `text-[11px] text-mine-text font-medium w-16 shrink-0 truncate`
- 宽度固定 64px，溢出截断

### Inline Bar

- 容器: `flex-1 h-1 bg-mine-bg rounded-full overflow-hidden`（4px 高）
- 填充: 宽度 = `|IC| / maxAbsIC * 100%`
- 颜色: IC > 0 → `bg-market-up-medium/60`, IC ≤ 0 → `bg-market-down-medium/60`
- 动画: `transition-all duration-300`

### IC 值

- 样式: `text-[11px] font-mono tabular-nums font-semibold w-14 text-right shrink-0`
- 格式: `+0.068` / `-0.023`（±符号 + 3 位小数）
- 颜色: IC > 0 → `text-mine-text`, IC ≤ 0 → `text-market-down-medium`

---

## 4. Expand Separator 视觉规格

- 容器: `flex items-center gap-2 py-2 cursor-pointer group`
- 左线: `flex-1 h-px bg-mine-border`
- 按钮: `text-[10px] text-mine-muted group-hover:text-mine-accent-teal transition-colors shrink-0`
  - 折叠态: `展开 {N} 项` + `ChevronDown` icon (8px)
  - 展开态: `收起` + `ChevronUp` icon (8px)
- 右线: `flex-1 h-px bg-mine-border`

---

## 5. 数据逻辑

### 排序和分组

```ts
// 按 IC 降序排列
const sorted = [...factor.icByIndustry].sort((a, b) => b.value - a.value);

const top5 = sorted.slice(0, 5);
const bottom3 = sorted.slice(-3);
const middle = sorted.slice(5, -3);  // 展开时显示
```

### 展开状态

```ts
const [expanded, setExpanded] = useState(false);
```

### maxAbsIC（bar 归一化基准）

```ts
const maxAbsIC = Math.max(...sorted.map(d => Math.abs(d.value)), 0.001);
```

---

## 6. PanelSection 标题

- title: `"IC BY INDUSTRY"`
- suffix: `"申万L1"`（保留现有）

---

## 7. 组件规范

- `data-slot="ic-by-industry-section"`
- 接受 `className` prop，用 `cn()` 合并
- 命名导出
- 替换现有 `ICByIndustrySection` export

---

## 8. 任务顺序

1. **排序和分组逻辑** — Top 5 / Bottom 3 / middle 分组
2. **行业行组件** — 色点 + 行业名 + inline bar + IC 值
3. **Expand separator** — 折叠/展开交互 + 动画
4. **替换现有柱状图** — 移除 BarVertical，改为列表渲染
5. **PanelSection title** — 改为 `"IC BY INDUSTRY"`
