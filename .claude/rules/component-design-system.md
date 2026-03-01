# Component Design System — Vibe Trading Web

> 本规范仅适用于 `apps/web/`。后端、基础设施代码不受此约束。
> 本规范是 AI 生成前端代码时的**强制约束**，不是建议。

## 1. 架构分层

```
apps/web/src/
├── lib/                    # L0: 基座层 — library-grade，可跨项目复用
│   ├── ngx-charts/         # 可视化引擎（D3 + Framer Motion）
│   ├── data-table/         # 表格引擎（TanStack Table 封装）
│   ├── utils.ts            # cn() = clsx + tailwind-merge
│   ├── compose-refs.ts     # ref 合并
│   ├── format.ts           # 数字/日期格式化
│   └── id.ts               # 稳定 ID 生成
│
├── components/ui/          # L1: 原语层 — shadcn copy-paste + Mine 主题覆写
│   └── button.tsx, card.tsx, input.tsx, dialog.tsx ...
│
├── components/layout/      # L2: 布局层 — 全局导航、sidebar、ticker
│   └── left-icon-sidebar.tsx, top-nav-bar.tsx ...
│
├── components/animation/   # L2: 动效层 — 入场/过渡动画包装器
│   └── animate-in.tsx
│
├── components/shared/      # L2: 共享层 — 跨 feature 的业务组件
│
└── features/*/components/  # L3: 特性层 — feature 专属组件
```

**规则**：

- L0 不依赖 L1/L2/L3（纯库代码，不引用 `@/components/`）
- L1 不依赖 L2/L3（原语层只依赖 Radix + Tailwind + CVA）
- L2 可依赖 L0 和 L1
- L3 可依赖所有层级
- **禁止引入外部 UI 框架**（不要 DaisyUI, HeroUI, DiceUI, MUI, Ant Design 等）

## 2. 组件构建模式

### 2.1 强制技术约束

| 约束          | 值                             | 原因                                       |
| ------------- | ------------------------------ | ------------------------------------------ |
| React 版本    | 19                             | 项目实际版本                               |
| Next.js 版本  | 15                             | App Router, static export                  |
| Tailwind 版本 | **v4**                         | `@theme` CSS 指令，没有 tailwind.config.js |
| 样式方案      | Tailwind utility + CVA         | 不用 CSS modules, styled-components        |
| 原语库        | Radix UI                       | 所有可交互组件的无障碍基座                 |
| 变体管理      | class-variance-authority (CVA) | 类型安全的变体系统                         |
| 工具函数      | `cn()` from `@/lib/utils`      | clsx + tailwind-merge                      |
| 动画          | Framer Motion (`motion/react`) | 统一动画方案                               |
| 状态管理      | Zustand                        | feature 级 store                           |
| 色彩空间      | OKLCH (Tailwind v4 原生)       | 感知均匀的颜色插值                         |

### 2.2 组件文件结构

```tsx
// 1. 外部库导入
import * as React from "react"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"

// 2. 内部依赖
import { cn } from "@/lib/utils"

// 3. 变体定义（CVA）
const myComponentVariants = cva(
  "base-classes ...",  // 基础类
  {
    variants: { ... },
    defaultVariants: { ... },
  }
)

// 4. 类型定义
type MyComponentProps = React.ComponentProps<"div"> &
  VariantProps<typeof myComponentVariants>

// 5. 组件实现 — 命名导出（不用 default export）
function MyComponent({ className, variant, ...props }: MyComponentProps) {
  return (
    <div
      data-slot="my-component"     // 语义化 slot 标记
      className={cn(myComponentVariants({ variant }), className)}
      {...props}
    />
  )
}

// 6. 导出
export { MyComponent, myComponentVariants }
```

**强制规则**：

- 每个组件必须有 `data-slot` 属性
- 必须接受 `className` prop 并用 `cn()` 合并
- 必须 spread `...props` 保持可扩展性
- 命名导出，不用 default export（Next.js page.tsx/layout.tsx 除外）
- 复合组件拆分为独立函数：`Card`, `CardHeader`, `CardContent` 等

## 3. Mine 主题视觉规范

### 3.1 颜色系统

#### 语义色板（从 globals.css 提取，AI 必须使用这些 token）

```
背景层级（由深到浅）：
  mine-page-bg  → 页面底色 oklch(0.92 0.01 85)
  mine-bg       → 面板/区域底色 #f5f3ef
  mine-card     → 卡片白底 #ffffff

文字层级：
  mine-text     → 主文本 #1a1a1a
  mine-muted    → 次要文本 #8a8a8a

边界：
  mine-border   → 通用边框 #e0ddd8
  mine-grid     → 网格线 #e8ede6
  mine-grid-dark → 深网格线 #d5dbd0

导航：
  mine-nav-active → 激活态导航 #2d2d2d

强调色：
  mine-accent-green  → 正向 #4caf50
  mine-section-green → 章节 #3d7a42
  mine-accent-yellow → 警告 #f5a623
  mine-accent-red    → 错误 #e74c3c
  mine-accent-teal   → 交互强调 #26a69a
```

#### 市场色（中国惯例：红涨绿跌）

```
涨（红系）：
  market-up        → #CF304A（强涨）
  market-up-medium → #F6465D（主涨色）
  market-up-light  → #E8626F（浅涨）

平：
  market-flat      → #76808E

跌（绿系）：
  market-down-light  → #58CEAA（浅跌）
  market-down-medium → #2EBD85（主跌色）
  market-down        → #0B8C5F（强跌）
```

#### 不透明度梯度（从 BandChart 提取的深度系统）

```
数据可视化的分层不透明度：
  0.01 ~ 0.07  → 深层背景填充（band 外层、渐变消失点）
  0.09 ~ 0.18  → 中层填充（band 内层、叠加区域渐变）
  0.25 ~ 0.35  → 前景辅助（边缘线、半透明 bar）
  0.60 ~ 1.00  → 焦点层（选中线、激活元素）
```

**规则**：层次感通过不透明度梯度建立，不通过粗边框或大色块。

### 3.2 排版系统（Typographic Scale）

```
字体族：
  UI 字体    → Inter (--font-sans)
  图表字体   → Roboto (--font-chart), weight 300
  等宽字体   → Geist Mono (--font-mono)

字号层级（从大到小）：
  heading-lg  → text-lg (18px), font-semibold   — 页面标题
  heading     → text-base (16px), font-semibold  — 区域标题
  body        → text-sm (14px), font-normal      — 正文
  caption     → text-xs (12px), font-medium      — 标签、轴标签
  micro       → text-[11px], font-medium         — 次要标注
  tiny        → text-[10px], font-normal         — 最小信息

分类标签：
  section-label → text-xs font-medium text-mine-muted uppercase tracking-wide

数值显示（强制）：
  所有数字必须使用 font-mono tabular-nums
  价格/收益率变化必须带颜色编码（market-up/down/flat）
```

### 3.3 间距韵律（Spacing Rhythm）

基于 4px 网格：

```
组件内部间距：
  tight   → p-2 (8px)     — 紧凑元素内部
  normal  → p-3 (12px)    — 标准卡片内容
  relaxed → p-4 (16px)    — 宽松卡片、主面板

组件间距：
  gap-2  (8px)   — 同级紧凑元素（按钮组、标签组）
  gap-3  (12px)  — 卡片内区域间
  gap-4  (16px)  — 面板/卡片间（主间距）

卡片结构：
  header  → px-4 py-3     — 卡片头部
  content → px-4 py-4     — 卡片内容（或 p-4）
  footer  → px-4 py-3     — 卡片底部
```

**规则**：间距只使用 Tailwind 的 spacing scale（2, 3, 4, 5, 6），不用任意值（如 `p-[13px]`），除非是图表/像素精确场景。

### 3.4 圆角系统

```
--radius:    0.625rem (10px)   — 基准
--radius-sm: 0.425rem (6.8px)  — 小元素（badge, toggle）
--radius-md: 0.425rem (6.8px)  — 中元素（按钮, 输入框）
--radius-lg: 0.625rem (10px)   — 大容器（卡片）
--radius-xl: 1.025rem (16.4px) — 特大容器（modal, panel）
rounded-full                    — 导航元素（sidebar 按钮, pill）
```

### 3.5 阴影层级

```
L0（无阴影）     → 内嵌元素、列表项
L1（shadow-xs）   → 输入框
L2（shadow-sm）   → 卡片、面板（最常用）
L3（shadow-md）   → 弹出层、下拉菜单
L4（自定义）      → 导航容器: shadow-[0_8px_32px_rgba(0,0,0,0.08)]
```

**规则**：只有 L2 和 L3 日常使用。L4 仅限 sidebar 和 nav 的玻璃容器。

## 4. 组件样式清单

### 4.1 卡片（最常用容器）

```tsx
// ✅ 标准卡片
className = 'bg-white shadow-sm border border-mine-border rounded-xl';

// ✅ 卡片头部（带底部分隔线）
className = 'flex items-center justify-between px-4 py-3 border-b border-mine-border/50';

// ✅ 卡片内容区
className = 'px-4 py-4';

// ❌ 禁止在卡片上使用玻璃拟态
className = 'bg-white/5 backdrop-blur-xl'; // 错误！仅限 sidebar/nav
```

### 4.2 按钮

```tsx
// 主要操作
className = 'bg-mine-nav-active text-white hover:bg-mine-nav-active/90 rounded-lg px-4 py-2';

// 次要/幽灵按钮
className = 'text-mine-text hover:bg-mine-bg rounded-lg px-4 py-2';

// 交互强调按钮（chat 等）
className = 'bg-mine-accent-teal text-white hover:bg-mine-accent-teal/90 rounded-lg';

// 周期/切换按钮组
// Active:
className = 'px-2 py-1 text-xs font-medium rounded-md bg-mine-nav-active text-white';
// Inactive:
className = 'px-2 py-1 text-xs font-medium rounded-md text-mine-muted hover:text-mine-text';
```

### 4.3 导航元素（玻璃拟态仅限此处）

```tsx
// 左侧 icon sidebar 容器
className = 'bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full';

// 顶部 nav pills 容器
className = 'bg-white/60 backdrop-blur-sm rounded-full p-1';

// Sidebar 按钮 — 激活态
className = 'bg-mine-nav-active text-white shadow-sm rounded-full';

// Sidebar 按钮 — 未激活
className = 'text-mine-text hover:bg-white/80 rounded-full';
```

### 4.4 市场数据展示

```tsx
// 涨
className = 'text-market-up-medium';

// 跌
className = 'text-market-down-medium';

// 平
className = 'text-market-flat';

// 市场标签（涨）
className = 'px-2.5 py-1.5 rounded-lg text-xs font-medium bg-market-up-medium/5 border border-market-up-medium/20 text-market-up-medium';

// 市场标签（跌）
className = 'px-2.5 py-1.5 rounded-lg text-xs font-medium bg-market-down-medium/5 border border-market-down-medium/20 text-market-down-medium';
```

## 5. 动效规范

### 5.1 动效分级

| 级别        | 场景                   | 时长      | 缓动                    | 实现                                   |
| ----------- | ---------------------- | --------- | ----------------------- | -------------------------------------- |
| **L0 即时** | hover 颜色、focus ring | 150ms     | CSS `transition-colors` | Tailwind `transition-colors`           |
| **L1 快速** | 按钮状态、展开/折叠    | 200-300ms | `ease-out`              | Tailwind `transition-all duration-200` |
| **L2 标准** | 页面入场、面板切换     | 400ms     | `[0.25, 0.1, 0.25, 1]`  | `AnimateIn` / `AnimateHeavy`           |
| **L3 数据** | 图表路径变形、数值滚动 | 750ms     | `easeInOut`             | Framer Motion `motion.path`            |

### 5.2 入场动画（已有组件）

```tsx
// 轻量元素（文字、按钮、小卡片）
<AnimateIn delay={0} from="left">    // delay=0,1,2... 实现交错
<AnimateIn delay={1} from="right">

// 重量元素（图表、大面板）
<AnimateHeavy delay={0.15}>          // 带 blur 的渐入
```

### 5.3 必须有动效的场景

| 场景              | 要求                                                         |
| ----------------- | ------------------------------------------------------------ |
| **价格/数值变化** | 数字必须有过渡动画（颜色闪烁或滚动），不能静态替换           |
| **图表数据切换**  | 路径必须 morph 过渡（d-attribute morphing），不能跳切        |
| **列表项增删**    | 必须有 `AnimatePresence` 进出场动画                          |
| **页面切换**      | 必须使用 `AnimateIn` 交错入场                                |
| **加载状态**      | 使用 `Skeleton` 组件，`animate-pulse`，不能用 spinner 或空白 |
| **hover 反馈**    | 所有可点击元素必须有 hover 态（颜色变化 or 背景变化）        |

### 5.4 禁止的动效

- ❌ bounce / elastic / spring（太花哨，不适合金融产品）
- ❌ 超过 1s 的动画（数据驱动产品，用户需要即时响应）
- ❌ 纯装饰动画（不传递信息的粒子、波纹等）
- ❌ 自动轮播 / auto-play（让用户控制信息流）

## 6. 布局模式

### 6.1 三面板布局（Market, Factor 等数据页面）

```tsx
<div className="flex-1 flex gap-4 overflow-hidden">
  {/* 左侧面板（可选，xl 以上显示） */}
  <div className="w-[280px] shrink-0 hidden xl:flex flex-col">

  {/* 中心内容（始终显示，弹性增长） */}
  <div className="flex-1 min-w-0 flex flex-col">

  {/* 右侧面板（可选，lg 以上显示） */}
  <div className="w-[260px] shrink-0 hidden lg:flex flex-col">
</div>
```

### 6.2 卡片高度约束

```tsx
// ✅ 必须有高度约束
className = 'h-[280px]'; // 小图表卡片
className = 'h-[320px]'; // 中图表卡片
className = 'h-[400px]'; // 大图表卡片

// ✅ 可滚动内容区
className = 'flex-1 overflow-y-auto scrollbar-thin';

// ❌ 禁止无约束高度（卡片被内容撑开）
// 除非是页面主体区域
```

## 7. AI 生成代码的决策树

AI 在生成前端组件时，必须按以下顺序检查：

```
1. 这个组件在 components/ui/ 里已经有了吗？
   → 有：直接 import 使用，通过 className 覆写样式
   → 没有：走 shadcn copy-paste 路线创建，遵循 §2.2 的文件结构

2. 需要交互行为（focus, keyboard, a11y）吗？
   → 是：必须用 Radix UI 原语作为基座
   → 否：纯展示组件，直接 div/span + Tailwind

3. 需要变体（不同大小/颜色/状态）吗？
   → 是：使用 CVA 定义 variants
   → 否：直接写 className

4. 需要动画吗？
   → 入场动画：包裹 AnimateIn / AnimateHeavy
   → 交互动画：Framer Motion (motion.div)
   → 简单过渡：Tailwind transition-*
   → 不需要：确认真的不需要（参考 §5.3 必须有动效的场景）

5. 展示数值吗？
   → 是：font-mono tabular-nums + 适当的市场颜色
   → 是 + 会变化：必须有数值过渡动画

6. 是卡片/面板容器吗？
   → 是：bg-white shadow-sm border border-mine-border rounded-xl
   → 绝对不用 glassmorphism（仅 sidebar/nav 可用）
```

## 8. 图表约束（ngx-charts 专用）

图表组件遵循 ngx-charts 库自己的模式（见 CLAUDE.md），但以下规则必须遵守：

```
字体：var(--font-chart) = Roboto, weight 300
轴线颜色：#e0ddd8 (mine-border)
轴文字颜色：#666666
轴字号：12px
月份标签：13px, weight 500, #666666
网格线：#e0ddd8, dasharray 可选

Framer Motion 的 motion.path 必须在所有 variants（initial, animate, exit）
中都包含 'd' 属性，避免 undefined SVG path 错误。

参考线：#a8b2c7, dasharray "5", font-size 9px
Tooltip 背景：rgba(30, 30, 30, 0.95)，白色文字
```

## 9. 常见错误清单（AI 必须避免）

| #   | 错误                                                                | 正确做法                                                                     |
| --- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | 在卡片上用 `bg-white/5 backdrop-blur-xl`                            | 只有 sidebar/nav 才用玻璃拟态                                                |
| 2   | 数字不带 `tabular-nums`                                             | 所有数值加 `font-mono tabular-nums`                                          |
| 3   | 缺少 `rounded-xl` 和 `border border-mine-border`                    | 卡片的标准三件套                                                             |
| 4   | 价格变化没有颜色编码                                                | 涨=market-up-medium, 跌=market-down-medium                                   |
| 5   | 可点击元素没有 hover 态                                             | 至少要有 `hover:bg-xxx` 或 `hover:text-xxx`                                  |
| 6   | 用 `text-white/70` 等暗色主题写法                                   | Mine 是浅色主题，用 `text-mine-text` / `text-mine-muted`                     |
| 7   | 加载状态用 spinner                                                  | 用 `Skeleton` 组件 + `animate-pulse`                                         |
| 8   | 引入外部 UI 框架                                                    | 只用项目内的 components/ui + lib                                             |
| 9   | 用 `p-[13px]` 等任意值                                              | 使用 Tailwind spacing scale: p-2/p-3/p-4                                     |
| 10  | 忘记 `shadow-sm`                                                    | 卡片、面板必须有 shadow-sm                                                   |
| 11  | 用 `default export`                                                 | 只有 page.tsx/layout.tsx 才用 default export                                 |
| 12  | 组件缺少 `data-slot`                                                | 每个组件根元素都要有 data-slot                                               |
| 13  | 图表 motion.path 缺 'd'                                             | initial/animate/exit 三个 variant 都要有 'd'                                 |
| 14  | 间距不一致                                                          | 卡片间 gap-4，内部 gap-3，紧凑 gap-2                                         |
| 15  | 数值变化静态替换                                                    | 必须有过渡动画                                                               |
| 16  | 面板 Section 标题风格不统一                                         | 必须用 `PanelSection` 组件                                                   |
| 17  | 面板内自造分隔线（手动 `<div className="border-t">` ）              | 用 `PanelSection` 自带的 `border-b`，最后一个自动隐藏                        |
| 18  | KPI 数值用硬编码 hex（`#2EBD85`）                                   | 用语义色 token：`text-market-down-medium` 或 `PanelStatItem` 的 `color` prop |
| 19  | 面板内区块 padding 不统一（有的 `px-4 py-3`，有的 `p-4 space-y-5`） | 统一用 `PanelSection`（内置 `px-4 py-3`）                                    |

## 10. 统一面板系统（Unified Panel System）

> **所有面板**（侧栏、详情、底栏）**必须**使用 `@/components/shared/panel` 中的组件。
> 完整使用指南和强制规则见 `components/shared/panel/USAGE.md`。
> 设计文档见 `docs/plans/2026-03-01-unified-panel-system-design.md`。

### 10.1 组件层次

```
PanelFrame (gray bg, rounded-[20px], inset shadow)
  ├── PanelFrameHeader (title + subtitle badge + actions + red close dot)
  └── PanelFrameBody (white bg, optional toolbar + scrollable content)
        ├── PanelSection (title + border-b + collapsible)
        │     └── Content primitives
        └── ...
```

### 10.2 组件清单

| 组件                              | 职责                                  |
| --------------------------------- | ------------------------------------- |
| `PanelFrame`                      | 灰底圆角容器                          |
| `PanelFrameHeader`                | 标题 + 副标题胶囊 + 操作区 + 关闭按钮 |
| `PanelFrameBody`                  | 白底滚动区（可选固定 toolbar）        |
| `PanelSection`                    | 内容分段（标题 + 分隔线 + 可折叠）    |
| `PanelStatGrid` / `PanelStatItem` | KPI 网格                              |
| `PanelKV`                         | 键值对行                              |
| `PanelRow` / `PanelActions`       | 可点击行 + hover 操作                 |
| `PanelChartBox`                   | 图表容器                              |
| `PanelEmpty`                      | 空状态                                |
| `PanelBadge` / `PanelBadgeTag`    | 标签                                  |
| `PanelActionButton`               | 小图标按钮                            |
| `PanelSearchBar`                  | 搜索栏                                |
| `PanelText`                       | 统一文字（4 variant + size axis）     |

### 10.3 排版系统（4 语义角色）

| 角色    | 语义                                | 默认字号 |
| ------- | ----------------------------------- | -------- |
| `label` | 标注性文字 — section 标题、指标标签 | 10px     |
| `body`  | 主要内容 — 描述、文本               | 11px     |
| `value` | 数据值 — 数字、变量、代码           | 11px     |
| `hint`  | 次要信息 — 时间戳、说明             | 10px     |

Size axis: `sm` (9px), `base` (默认), `lg` (14px + bold)

### 10.4 面板模板

```tsx
import { PanelFrame, PanelFrameHeader, PanelFrameBody, PanelSection,
         PanelStatGrid, PanelStatItem, PanelKV, PanelChartBox } from '@/components/shared/panel'

<PanelFrame className="h-full">
  <PanelFrameHeader title="面板标题" onClose={...} />
  <PanelFrameBody>
    <PanelSection title="核心指标">
      <PanelStatGrid columns={3}>
        <PanelStatItem label="IC" value="+0.022" color="down" />
      </PanelStatGrid>
    </PanelSection>
    <PanelSection title="统计详情">
      <PanelKV label="均值" value="+0.0198" color="up" />
    </PanelSection>
    <PanelSection title="IC 衰减">
      <PanelChartBox><MyChart /></PanelChartBox>
    </PanelSection>
  </PanelFrameBody>
</PanelFrame>
```

### 10.5 AI 面板生成决策树

```
1. 面板外壳用 PanelFrame 了吗？ → 必须用
2. 每个内容区域都用 PanelSection 包裹了吗？ → 必须用，不许手动写 border-b
3. 文字用 PanelText 或面板原语了吗？ → 不许硬编码 font specs
4. 数值用了硬编码颜色吗？ → 用 Tailwind token 或组件 color prop
5. 需要 KPI？ → PanelStatGrid + PanelStatItem
6. 需要键值对？ → PanelKV
7. 需要图表？ → PanelChartBox
```

`PanelStatItem` 和 `PanelKV` 的 `color` prop 接受语义值（`"up"` / `"down"` / `"flat"` / `"muted"`）。
