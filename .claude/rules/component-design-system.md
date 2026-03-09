# Component Design System — Vibe Trading Web

> `apps/web/` 专用。AI 生成前端代码时的强制约束。

---

## 1. 禁令

### 1.1 颜色

**禁止裸 hex**（`#2EBD85`、`text-[#CF304A]`、`bg-[#f5f3ef]`）。

1. 先查 `globals.css` 的 `@theme` 块是否有对应 token → 有则用
2. 没有 → 在 `@theme` 中新增语义 token，再引用
3. Tailwind 内置色板（`bg-zinc-900`、`text-white/80`）可直接用
4. 唯一例外：ANSI 色表、D3 绑定等需要 JS 原始值的标准映射

### 1.2 样式复用

**禁止在多个文件中重复相同的 Tailwind 字符串组合。** 重复 2 次以上 → 必须先抽象为 `@utility` 或组件，再消费。

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
- **禁止**间距用任意值（`p-[13px]`），用 Tailwind spacing scale，图表像素精确场景除外
- **禁止**卡片/面板无约束高度（内容撑开），主体区域除外
- 卡片标准三件套：`bg-white shadow-sm border border-mine-border rounded-xl`

### 1.5 动效

- **禁止** bounce / elastic / spring（金融产品不适合）
- **禁止** 超过 1s 的动画
- **禁止** 纯装饰动画（不传递信息的粒子、波纹）
- **禁止** 自动轮播 / auto-play
- **禁止** 数值变化静态替换（必须有过渡动画）

---

## 2. 动效分级

| 级别 | 场景 | 时长 | 实现 |
|------|------|------|------|
| L0 即时 | hover、focus ring | 150ms | `transition-colors` |
| L1 快速 | 按钮、展开/折叠 | 200-300ms | `transition-all duration-200` |
| L2 标准 | 页面入场、面板切换 | 400ms | `AnimateIn` / `AnimateHeavy` |
| L3 数据 | 图表路径变形 | 750ms | Framer Motion `motion.path` |

必须有动效的场景：价格变化、图表切换、列表增删、页面切换、加载状态、hover 反馈。
