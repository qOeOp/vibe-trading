# IC Decay Profile 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 改造 IC 衰减剖面图表：更换配色为热力图色板（market-up/market-down），添加 Global Selector 联动高亮（灰底衬柱 + teal bar），增强视觉质感。

**Architecture:** 改造现有 `ICDecayProfileSection` / `ICDecayChart`，修改 `buildDecayColors` 配色逻辑，从 `useLibraryStore` 读取 `selectedHorizon` 高亮对应 bar。

**Tech Stack:** React 19, TypeScript, ngx-charts BarVertical, Zustand, PanelSection

---

## 1. 现有实现

- 组件: `ICDecayProfileSection` (`charts/ic-decay-profile.tsx`)
- 图表: `BarVertical`（ngx-charts）
- 数据: `factor.icDecayProfile` — 20 个值 (Lag T+1 ~ T+20)
- 颜色: 按 IC 正负分蓝/红，明度按幅度梯度（`buildDecayColors`）
- X 轴: T+1, T+5, T+10, T+15, T+20（稀疏刻度）

---

## 2. 配色改造

### Bar 颜色

从蓝/红改为热力图色板两端色：

| IC 方向 | 颜色 | Token | Hex |
|---------|------|-------|-----|
| IC > 0 | 深红（强涨色） | `market-up` | `#cf304a` |
| IC ≤ 0 | 深绿（强跌色） | `market-down` | `#0b8c5f` |

### Opacity 梯度

保留按 IC 幅度的 opacity 梯度（IC 越大越浓，越小越淡）：

```ts
const intensity = Math.abs(ic) / maxAbsIC; // 0~1
const opacity = 0.25 + intensity * 0.45;   // 0.25~0.70
```

### Bar 内部渐变

每根 bar 用 `<linearGradient>` 从顶部实色渐变到底部轻微 fade out：
- 顶部 opacity: 计算值
- 底部 opacity: 顶部 × 0.55（**收敛的 fade**，不是 fade 到透明）
- 正 IC: 渐变方向从上到下
- 负 IC: 渐变方向从下到上

### 微圆角

`rx="0.5"` 消除像素锯齿感。

---

## 3. Horizon 高亮

### 联动逻辑

- 从 `useLibraryStore` 读取 `selectedHorizon`（5 | 20 | 60）
- Horizon 对应的 bar index: `horizon - 1`（T+5 → index 4, T+20 → index 19）
- T+60 超出 20 bar 范围 → 不高亮

### 灰底衬柱

高亮 bar 后方渲染全高灰色背景列，把该 bar 从一排 bar 中视觉"提"出来：

```tsx
// 全高灰色背景（图表区域顶部到底部）
<rect
  x={barX - 2}
  y={chartTop}
  width={barWidth + 4}
  height={chartHeight}
  fill="var(--mine-border)"
  opacity={0.10}
  rx={2.5}
/>
```

### 高亮 bar

- 颜色: `mine-accent-teal` (#26a69a)，不分正负
- 渐变: 同样的 top→bottom fade（teal 色调）
- X 轴标签: teal 色 + font-weight 600
- 底部标注: `当前` 文字（teal, 6.5px）

---

## 4. 视觉精修

参考 `memory/chart-visual-polish.md` 全局图表精修规范：

- **背景微纹理**: 3 条极淡水平参考线（25%/50%/75% 位置），`opacity: 0.08`，给空间以深度
- **零线**: `mine-border` 色，0.6px 虚线
- **Y 轴标签**: 字号 7px，weight 300，opacity 0.4，与图表区域保持 4-8px 间距
- **内边距**: margin 大方，数据不贴边框

---

## 5. PanelSection 标题

- 从手写 `<span>` 改为 PanelSection `title="IC DECAY PROFILE"`
- 右侧 suffix: `Lag T+1 ~ T+20`

---

## 6. 组件规范

- `data-slot="ic-decay-profile-section"` (保留)
- 接受 `className` prop，用 `cn()` 合并
- 命名导出

---

## 7. 任务顺序

1. **修改 buildDecayColors 配色** — 从蓝/红改为 market-up/market-down，添加 opacity 梯度和渐变
2. **灰底衬柱 + teal 高亮** — 添加 `highlightIndex` 参数，渲染灰底全高列 + teal 色 bar
3. **Store 联动** — ICDecayChart 读取 `selectedHorizon`，计算 highlightIndex
4. **PanelSection title** — 改为 `"IC DECAY PROFILE"`，右侧 Lag 提示
5. **视觉精修** — 背景微纹理、零线虚线、Y 轴标签、微圆角
6. **边界处理** — horizon=60 时不高亮（index 超出数据范围）
