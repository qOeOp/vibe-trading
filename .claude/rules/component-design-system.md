# Component Design System — Vibe Trading Web

> 本规范仅适用于 `apps/web/`。后端、基础设施代码不受此约束。
> 本规范是 AI 生成前端代码时的**强制约束**，不是建议。
> 结构：**§1-4 是规则（必须遵守）**，**§5-6 是参考（按需查阅）**。

---

## 1. 禁令（违反即犯错）

### 1.1 颜色

**禁止裸 hex**（`#2EBD85`、`text-[#CF304A]`、`bg-[#f5f3ef]`）。

1. 先查 `globals.css` 的 `@theme` 块是否有对应 token → 有则用（`text-mine-muted`、`bg-market-up-medium`）
2. 没有 → 在 `@theme` 中新增语义 token，再引用
3. Tailwind 内置色板（`bg-zinc-900`、`text-white/80`）可直接用
4. 唯一例外：ANSI 色表、D3 绑定等需要 JS 原始值的标准映射

### 1.2 样式复用

**禁止在多个文件中重复相同的 Tailwind 字符串组合。** 重复出现 2 次以上的样式组合必须先抽象，再消费：

- **组件系统内部的排版/布局模式** → 定义 `@utility` class 在 `globals.css`，组件消费单个语义 class
- **跨组件复用的视觉模式** → 抽为共享组件（`components/shared/`）
- **feature 内部复用** → 抽为 feature 级组件

示例 — 面板系统已有的语义 class（定义在 `globals.css`）：

| Class | 用途 |
|-------|------|
| `panel-label` | Section 标题、frame 标题 — 10px/500/muted/uppercase/tracking |
| `panel-body` | 正文内容 — 11px |
| `panel-value` | 数据值 — 11px/mono/tabular |
| `panel-hint` | 次要信息、KV 标签 — 10px/muted |
| `panel-label-sm` / `panel-value-sm` | 紧凑变体 — 9px |
| `panel-value-lg` | KPI 大数字 — 14px/bold/mono |

**新建组件系统时也遵循同样模式**：先在 `globals.css` 用 `@utility` 定义语义 class，再让组件消费。

### 1.3 组件结构

- 每个组件**必须**有 `data-slot` 属性
- **必须**接受 `className` prop 并用 `cn()` 合并
- **必须** spread `...props` 保持可扩展性
- **必须**命名导出，`default export` 仅限 `page.tsx` / `layout.tsx`
- **禁止**引入外部 UI 框架（DaisyUI, HeroUI, MUI, Ant Design 等）

### 1.4 视觉

- **禁止**在卡片/面板上用 `backdrop-blur`（玻璃拟态仅限 left sidebar、top nav pills、ticker）
- **禁止**数字不带 `font-mono tabular-nums`
- **禁止**可点击元素没有 hover 态
- **禁止**用 `text-white/70` 等暗色主题写法（Mine 是浅色主题，用 `text-mine-text` / `text-mine-muted`）
- **禁止**加载状态用 spinner（用 `Skeleton` + `animate-pulse`）
- **禁止**间距用任意值（`p-[13px]`），用 Tailwind spacing scale（p-2/p-3/p-4），图表像素精确场景除外
- **禁止**卡片/面板无约束高度（内容撑开），主体区域除外
- 卡片标准三件套：`bg-white shadow-sm border border-mine-border rounded-xl`

### 1.5 面板

**ALL panels**（侧栏、详情、底栏）**必须**使用 `@/components/shared/panel` 原语。详见 `components/shared/panel/USAGE.md`。

- 面板外壳 → `PanelFrame` + `PanelFrameHeader` + `PanelFrameBody`
- 内容分段 → `PanelSection`（自带 border-b），**禁止**手写分隔线
- 文字 → 用 `panel-*` CSS class 或面板原语组件，**禁止**硬编码 font specs
- KPI → `PanelStatGrid` + `PanelStatItem`
- 键值对 → `PanelKV`
- 图表 → `PanelChartBox`
- 颜色 → `PanelStatItem` / `PanelKV` 的 `color` prop（`"up"` / `"down"` / `"flat"` / `"muted"`）

### 1.6 动效

- **禁止** bounce / elastic / spring（金融产品不适合）
- **禁止** 超过 1s 的动画
- **禁止** 纯装饰动画（不传递信息的粒子、波纹）
- **禁止** 自动轮播 / auto-play
- **禁止** 数值变化静态替换（必须有过渡动画）
- **禁止** 图表 `motion.path` 缺少 `d`（initial/animate/exit 三个 variant 都要有）

### 1.7 图表（ngx-charts）

- `motion.path` 必须在 initial/animate/exit 中都包含 `d` 属性
- 字体：`var(--font-chart)` = Roboto, weight 300
- 轴线/网格：`mine-border` 色，轴文字 `#666666`
- Tooltip 背景：`rgba(30, 30, 30, 0.95)`，白色文字

---

## 2. 架构分层

```
L0 lib/          → 不依赖 L1/L2/L3（纯库代码）
L1 components/ui/ → 不依赖 L2/L3（shadcn + Radix + CVA）
L2 components/{layout,animation,shared}/ → 可依赖 L0+L1
L3 features/*/   → 可依赖所有层级
```

---

## 3. 组件文件模板

```tsx
import * as React from "react"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const myComponentVariants = cva("base-classes", {
  variants: { ... },
  defaultVariants: { ... },
})

type MyComponentProps = React.ComponentProps<"div"> &
  VariantProps<typeof myComponentVariants>

function MyComponent({ className, variant, ...props }: MyComponentProps) {
  return (
    <div
      data-slot="my-component"
      className={cn(myComponentVariants({ variant }), className)}
      {...props}
    />
  )
}

export { MyComponent, myComponentVariants }
```

---

## 4. 动效分级

| 级别 | 场景 | 时长 | 实现 |
|------|------|------|------|
| L0 即时 | hover、focus ring | 150ms | `transition-colors` |
| L1 快速 | 按钮、展开/折叠 | 200-300ms | `transition-all duration-200` |
| L2 标准 | 页面入场、面板切换 | 400ms | `AnimateIn` / `AnimateHeavy` |
| L3 数据 | 图表路径变形 | 750ms | Framer Motion `motion.path` |

必须有动效的场景：价格变化、图表切换、列表增删、页面切换、加载状态、hover 反馈。

---

## 5. 参考：主题色板

> 以下是查阅用的色板表。规则在 §1.1。具体值以 `globals.css` `@theme` 块为准。

**语义色**：`mine-page-bg`(页面底) · `mine-bg`(面板底) · `mine-card`(白底) · `mine-text`(主文本) · `mine-muted`(次要) · `mine-border`(边框) · `mine-nav-active`(导航激活) · `mine-accent-{green,yellow,red,teal}`(强调)

**市场色**（红涨绿跌）：`market-up`/`market-up-medium`/`market-up-light` · `market-flat` · `market-down-light`/`market-down-medium`/`market-down`

**不透明度梯度**（数据可视化）：0.01~0.07 深层 → 0.09~0.18 中层 → 0.25~0.35 前景 → 0.60~1.00 焦点

---

## 6. 参考：样式速查

> 以下是已有的样式模式。不是规则，是速查。

**卡片**：`bg-white shadow-sm border border-mine-border rounded-xl` · 头部 `px-4 py-3 border-b border-mine-border/50` · 内容 `px-4 py-4`

**按钮**：主要 `bg-mine-nav-active text-white` · 次要 `text-mine-text hover:bg-mine-bg` · 强调 `bg-mine-accent-teal text-white`

**导航**（玻璃拟态仅限此处）：sidebar `bg-white/40 backdrop-blur-2xl rounded-full` · nav pills `bg-white/60 backdrop-blur-sm rounded-full`

**市场标签**：`px-2.5 py-1.5 rounded-lg text-xs font-medium bg-market-{up,down}-medium/5 border border-market-{up,down}-medium/20 text-market-{up,down}-medium`

**布局**：三面板 `flex gap-4` — 左 `w-[280px] hidden xl:flex` · 中 `flex-1 min-w-0` · 右 `w-[260px] hidden lg:flex`

**间距**：组件内 p-2/p-3/p-4 · 组件间 gap-2/gap-3/gap-4 · 卡片头尾 px-4 py-3

**阴影**：L0 无 · L1 shadow-xs(输入框) · L2 shadow-sm(卡片，最常用) · L3 shadow-md(弹出层)

**圆角**：badge `rounded-sm` · 按钮 `rounded-lg` · 卡片 `rounded-xl` · 导航 `rounded-full`

**排版**：UI=Inter · 图表=Roboto/300 · 等宽=Geist Mono · 所有数字 `font-mono tabular-nums`

**入场动画**：轻量 `<AnimateIn delay={0} from="left">` · 重量 `<AnimateHeavy delay={0.15}>`
